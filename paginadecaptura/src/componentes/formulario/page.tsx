"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { schema, Schema } from "../schema-zod";
import { FormEndereco } from "./FormEndereco";
import { FormFeedback } from "./FormFeedback";
import { FormResidentes } from "./FormResidentes";
import { FormRetorno } from "./FormRetorno";
import { FormVeiculo } from "./FormVeiculo";

interface FormProps {
  cpf: string | null;
  senha: string | null;
}

export const Form: React.FC<FormProps> = ({ cpf, senha }) => {
  const methods = useForm<Schema>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      endereco: { condominio: "", apto: "" },
      residentes: [
        { nome: "", telefone: [""], email: "", tipoDocumento: "CPF", documento: cpf || "", parentesco: "" },
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

  const [retornoForm, setRetornoForm] = useState<boolean | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [aptoError, setAptoError] = useState<string>("");

  const { reset, trigger, control, formState, setValue } = methods;

  const tipoDocumento = useWatch({
    name: "residentes",
    control,
  });

  useEffect(() => {
    if (
      tipoDocumento &&
      formState.touchedFields.residentes?.some((residente) => residente?.tipoDocumento)
    ) {
      trigger("residentes");
    }
  }, [tipoDocumento, trigger, formState.touchedFields.residentes]);

  // Função para verificar se o apartamento existe
  const verificarApto = async (condominioId: string, apto: string, bloco: string): Promise<boolean> => {
    try {
      const response = await axios.post(`/api/proxy`, {
        action: "verificar_apto",
        payload: {
          acao: "listar",
          cond_id: condominioId,
        },
      });

      if (response.status === 200 && response.data.apartamentos) {
        const aptoExiste = response.data.apartamentos.some(
          (aptoObj: { apto: string; bloco: string }) => aptoObj.apto === apto && aptoObj.bloco === bloco
        );

        if (aptoExiste) {
          return true;
        } else {
          setAptoError("Apartamento não encontrado. Verifique as informações e tente novamente.");
          return false;
        }
      } else {
        setAptoError("Erro ao verificar o apartamento. Por favor, tente novamente.");
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar apartamento:", error);
      setAptoError("Erro ao verificar o apartamento. Por favor, tente novamente mais tarde.");
      return false;
    }
  };

  const onSubmit = async (data: Schema) => {
    setLoading(true);
    console.log('Clicou no botão enviar');

    if (!cpf || !senha) {
      console.error("CPF ou senha não encontrados no localStorage. O usuário precisa estar autenticado.");
      return;
    }

    // Separar o apartamento e o bloco da string fornecida
    const [apartamento, bloco = ""] = data.endereco.apto.trim().split(" ");

    setAptoError(""); // Limpar erro anterior de apartamento

    try {
      // Verificar se o apartamento é válido antes de enviar
      const aptoValido = await verificarApto(data.endereco.condominio, apartamento, bloco);
      if (!aptoValido) {
        setLoading(false);
        return;
      }

      // Prepara os dados para o envio conforme o formato esperado pela API
      const moradorData = {
        acao: "novo",
        mor_cond_id: data.endereco.condominio,
        mor_cond_nome: "Condomínio Teste", // Este campo deve ser adaptado conforme o select
        mor_apto: apartamento,
        mor_bloco: bloco,
        mor_nome: data.residentes[0].nome,
        mor_parentesco: data.residentes[0].parentesco || "Proprietário(a)",
        mor_cpf: data.residentes[0].documento,
        mor_celular01: data.residentes[0].telefone[0] || "",
        mor_celular02: data.residentes[0].telefone[1] || "",
        mor_celular03: data.residentes[0].telefone[2] || "",
        mor_email: data.residentes[0].email,
        mor_responsavel: "API Teste",
        mor_obs: data.feedback || "",
        mor_senhaapp: senha,
      };

      // Faz a requisição via proxy
      const response = await axios.post(`/api/proxy`, {
        action: "novo_morador",
        data: moradorData,
      });

      if (response.status === 200 && response.data.resposta === "Morador Cadastrado com Sucesso") {
        setRetornoForm(true);
        localStorage.removeItem("formData");
      } else {
        setRetornoForm(false);
        console.error("Erro ao cadastrar morador:", response.data.resposta);
      }
    } catch (error) {
      setRetornoForm(false);
      console.error("Erro ao enviar dados:", error);
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <Container>
      <FormProvider {...methods}>
        <form className="flex gap-2 flex-col items-center justify-evenly" >
          <Grid container spacing={1} sx={{ pb: 4, maxWidth: "100%", m: "auto" }}>
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
              <span className="flex justify-center items-center mt-2">
                {loading ? <CircularProgress /> : <FormRetorno enviado={retornoForm} />}
              </span>
            </Grid>
            <Grid item xs={12} sx={{ mt: 3, justifyContent: "space-around", display: "flex" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  reset();
                  setRetornoForm(undefined);
                  setAptoError("");
                  localStorage.removeItem("formData");
                }}
                sx={{ ml: 2, fontSize: "large" }}
              >
                Limpar
              </Button>
              <Button type="submit" variant="contained" sx={{ fontSize: "large" }} onClick={()=> onSubmit}>
                Enviar
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Container>
  );
};
