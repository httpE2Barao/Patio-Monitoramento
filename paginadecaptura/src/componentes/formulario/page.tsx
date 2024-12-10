import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Container,
  Grid,
  Typography
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { schema, Schema } from "../schema-zod";
import { FormEndereco } from "./FormEndereco";
import { FormFeedback } from "./FormFeedback";
import { FormResidentes } from "./FormResidentes";
import { FormVeiculo } from "./FormVeiculo";

interface FormProps {
  cpf: string | null;
}

export const Form: React.FC<FormProps> = ({ cpf }) => {
  const router = useRouter();
  const methods = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { 
      endereco: { 
        condominio: {
          codigoCondominio: "", 
          nomeCondominio: "" 
        }, 
        apto: "" 
      },
      residentes: [
        {
          nome: "",
          telefone: [""],
          email: "",
          tipoDocumento: "CPF",
          documento: cpf || "",
          parentesco: "",
        },
      ],
      veiculos: [{ cor: "", modelo: "", placa: "" }],
      feedback: "",
    },
  });

  const { fields: residentesFields } = useFieldArray({
    name: "residentes",
    control: methods.control,
  });

  const { fields: veiculosFields } = useFieldArray({
    name: "veiculos",
    control: methods.control,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [aptoError, setAptoError] = useState<string>("");

  const { reset, handleSubmit } = methods;

  const onSubmit = async (data: Schema) => {
    setLoading(true);
  
    try {
      const [apartamento, bloco = ""] = data.endereco.apto.trim().split(" ");
      const condominioId = data.endereco.condominio.codigoCondominio;

      console.log("Verificando se o cliente já existe via proxy...");
      const { data: moradoresResponse } = await axios.post(`/api/proxy`, {
        action: "listar_moradores",
        payload: {
          mor_cond_id: condominioId,
          mor_apto: apartamento || "",
          mor_bloco: bloco || "",
        },
      });

      if (moradoresResponse?.Moradores?.length > 0) {
        console.log("Cliente encontrado:", moradoresResponse.Moradores[0]);

        const cliente = moradoresResponse.Moradores[0];

        // Atualizar formulário com os dados do cliente
        reset({
          endereco: {
            condominio: {
              codigoCondominio: cliente.idCondominio,
              nomeCondominio: cliente.nomeCondominio,
            },
            apto: cliente.idCasaApto,
          },
          residentes: [
            {
              nome: cliente.nomeMorador,
              telefone: [cliente.celular],
              email: cliente.eMail,
              tipoDocumento: "RG",
              documento: cliente.rg,
              parentesco: cliente.cargoCasa || "Proprietário(a)",
            },
          ],
          veiculos: [], // Preencha se necessário
          feedback: "",
        });

        // Adicionar senha ao payload
        data.residentes[0].documento = cliente.rg;
        data.residentes[0].telefone[0] = cliente.celular;
        data.feedback = `Senha recuperada: ${cliente.senhWeb}`;
      }

      console.log("Cliente verificado ou atualizado com sucesso.");
      
      // Continue o fluxo para salvar ou atualizar o cliente
      const moradorPayload = {
        mor_cond_id: condominioId,
        mor_cond_nome: data.endereco.condominio.nomeCondominio,
        mor_apto: apartamento,
        mor_bloco: bloco || "",
        mor_nome: data.residentes[0].nome,
        mor_parentesco: data.residentes[0].parentesco || "Outros",
        mor_cpf: data.residentes[0].documento,
        mor_celular01: data.residentes[0].telefone[0],
        mor_celular02: data.residentes[0].telefone[1] || "",
        mor_celular03: data.residentes[0].telefone[2] || "",
        mor_email: data.residentes[0].email,
        mor_responsavel: "Formulário de Cadastro",
        mor_obs: data.feedback || "",
      };

      console.log("Enviando dados do morador via proxy...");
      const moradorResponse = await axios.post(`/api/proxy`, {
        action: "novo_morador",
        payload: moradorPayload,
      });

      if (moradorResponse.data.resposta?.includes("Sucesso")) {
        alert("Processo concluído com sucesso!");
      } else {
        console.error("Erro ao processar morador:", moradorResponse.data.error);
        alert("Erro ao processar o morador.");
      }
    } catch (error) {
      console.error("Erro no fluxo:", error);
      alert("Erro no processo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormProvider {...methods}>
        <form
          className="flex gap-2 flex-col items-center justify-evenly pb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormEndereco />
            </Grid>
            {aptoError && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error" align="center">
                  {aptoError}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              {residentesFields.map((item, index) => (
                <FormResidentes key={item.id} index={index} />
              ))}
            </Grid>
            <Grid item xs={12}>
              {veiculosFields.map((item, index) => (
                <FormVeiculo key={item.id} index={index} />
              ))}
            </Grid>
            <Grid item xs={12}>
              <FormFeedback />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">
                Enviar
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Container>
  );
};
