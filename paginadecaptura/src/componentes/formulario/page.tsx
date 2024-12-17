import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { schema, Schema } from "../schema-zod";
import { FormEndereco } from "./FormEndereco";
import { FormFeedback } from "./FormFeedback";
import { FormResidentes } from "./FormResidentes";
import { FormVeiculo } from "./FormVeiculo";

export const Form: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [aptoError, setAptoError] = useState<string>("");

  const methods = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      endereco: {
        condominio: { codigoCondominio: "", nomeCondominio: "" },
        apto: "",
      },
      residentes: [
        {
          nome: "",
          telefone: [""],
          email: "",
          tipoDocumento: "CPF",
          documento: "",
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

  const { handleSubmit, setValue } = methods;
  const [decryptedPassword, setDecryptedPassword] = useState<string>("");

  useEffect(() => {
    const encryptedCPF = localStorage.getItem("encryptedCPF");
    const encryptedPassword = localStorage.getItem("encryptedPassword");

    if (encryptedCPF) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedCPF, "chave-de-seguranca");
        const originalCPF = bytes.toString(CryptoJS.enc.Utf8);
        setValue("residentes.0.documento", originalCPF);
      } catch (err) {
        console.error("Erro ao descriptografar o CPF:", err);
      }
    }

    if (encryptedPassword) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, "chave-de-seguranca");
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        setDecryptedPassword(originalPassword);
      } catch (err) {
        console.error("Erro ao descriptografar a senha:", err);
      }
    }
  }, [setValue]);

  const chamarApi = async (action: string, payload: Record<string, any>) => {
    try {
      const { data } = await axios.post("/api/proxy", { action, payload });
      console.log(`Resposta da API (${action}):`, data);
      return data;
    } catch (error: any) {
      console.error(`Erro ao chamar API (${action}):`, error.response?.data || error.message);
      throw new Error(`Erro na ação ${action}: ${error.response?.data || "Erro desconhecido"}`);
    }
  };
  
  const verificarOuCriarApartamento = async (condominioId: string, apartamento: string, bloco: string) => {
    try {
      const verificarAptoResponse = await chamarApi("verificar_apto", {
        acao: "listar",
        cond_id: condominioId,
        apto: apartamento,
        bloco: bloco,
      });
  
      if (verificarAptoResponse?.resposta === "Apartamento não encontrado") {
        console.log("Apartamento não encontrado. Criando um novo...");
        const criarAptoResponse = await chamarApi("criar_apartamento", {
          acao: "novo",
          cond_id: condominioId,
          apto: apartamento,
          bloco: bloco,
        });
  
        if (!criarAptoResponse?.resposta?.includes("Sucesso")) {
          throw new Error("Erro ao criar apartamento.");
        }
      }
      console.log("Apartamento verificado/criado com sucesso.");
      return true;
    } catch (error: any) {
      console.error("Erro ao verificar ou criar apartamento:", error.message);
      throw error;
    }
  };
  
  const gerenciarMorador = async (condominioId: string, apartamento: string, bloco: string, data: Schema, decryptedPassword: string) => {
    try {
      const payloadMoradorBase = {
        mor_cond_id: condominioId,
        mor_cond_nome: data.endereco.condominio.nomeCondominio,
        mor_apto: apartamento,
        mor_bloco: bloco,
        mor_nome: data.residentes[0].nome,
        mor_parentesco: data.residentes[0].parentesco || "Outros",
        mor_cpf: data.residentes[0].documento,
        mor_celular01: data.residentes[0].telefone[0],
        mor_celular02: data.residentes[0].telefone[1] || "",
        mor_celular03: data.residentes[0].telefone[2] || "",
        mor_email: data.residentes[0].email,
        mor_responsavel: "Formulário de Cadastro",
        mor_obs: data.feedback || "",
        mor_senhaapp: decryptedPassword,
      };
  
      // Tentar criar o morador
      const novoMoradorResponse = await chamarApi("novo_morador", {
        ...payloadMoradorBase,
        acao: "novo",
      });
      
      console.log("Resposta da API novo_morador:", novoMoradorResponse);
  
      if (novoMoradorResponse.resposta?.includes("Erro ! O CPF Informado já está cadastrado")) {
        console.log("CPF já cadastrado. Tentando editar o morador...");
  
        // Listar moradores para encontrar o ID do morador
        const listarMoradoresResponse = await chamarApi("listar_moradores", {
          acao: "listar",
          mor_cond_id: condominioId,
          mor_apto: apartamento,
          mor_bloco: bloco,
        });
  
        console.log("Resposta da API listar_moradores:", listarMoradoresResponse);
  
        const moradorExistente = listarMoradoresResponse?.Moradores?.find(
          (morador: any) => morador.rg === data.residentes[0].documento
        );
  
        if (!moradorExistente) {
          throw new Error("Erro ao localizar morador existente para edição.");
        }
  
        // Atualizar morador com o ID encontrado
        const editarMoradorResponse = await chamarApi("editar_morador", {
          ...payloadMoradorBase,
          acao: "editar",
          mor_id: moradorExistente.idregistro,
        });
  
        console.log("Resposta da API editar_morador:", editarMoradorResponse);
  
        if (!editarMoradorResponse.resposta?.includes("Sucesso")) {
          throw new Error(editarMoradorResponse.resposta || "Erro ao editar morador.");
        }
  
        return "Morador atualizado com sucesso!";
      }
  
      if (!novoMoradorResponse.resposta?.includes("Sucesso")) {
        throw new Error(novoMoradorResponse.resposta || "Erro ao criar morador.");
      }
  
      return "Cadastro enviado com sucesso!";
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao gerenciar morador:", error.message);
        throw error;
      } else {
        console.error("Erro desconhecido ao gerenciar morador:", error);
        throw new Error("Erro desconhecido.");
      }
    }
  };
  
  const onSubmit = async (data: Schema) => {
    setLoading(true);
    try {
      console.log("Dados do formulário enviados para onSubmit:", data);
  
      const [apartamento, bloco = ""] = data.endereco.apto.trim().split(" ");
      const condominioId = data.endereco.condominio.codigoCondominio;
  
      // Verifica ou cria o apartamento
      await verificarOuCriarApartamento(condominioId, apartamento, bloco);
  
      // Gerencia criação ou edição do morador
      const mensagem = await gerenciarMorador(condominioId, apartamento, bloco, data, decryptedPassword);
  
      alert(mensagem);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro no fluxo:", error.message);
        alert(error.message);
      } else {
        console.error("Erro desconhecido no fluxo:", error);
        alert("Erro desconhecido no processo. Tente novamente.");
      }
    } finally {
      setLoading(false);
      console.log("Processo concluído.");
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
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Enviando..." : "Cadastrar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Container>
  );
};
