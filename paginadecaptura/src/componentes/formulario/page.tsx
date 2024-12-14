import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { schema, Schema } from "../schema-zod";
import { FormEndereco } from "./FormEndereco";
import { FormFeedback } from "./FormFeedback";
import { FormResidentes } from "./FormResidentes";
import { FormVeiculo } from "./FormVeiculo";

export const Form: React.FC = () => {
  const router = useRouter();
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
        console.log("CPF descriptografado:", originalCPF);
      } catch (err) {
        console.error("Erro ao descriptografar o CPF:", err);
      }
    }

    if (encryptedPassword) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, "chave-de-seguranca");
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        setDecryptedPassword(originalPassword);
        console.log("Senha descriptografada:", originalPassword);
      } catch (err) {
        console.error("Erro ao descriptografar a senha:", err);
      }
    }
  }, [setValue]);

  const verificarOuCriarApartamento = async (condominioId: string, apartamento: string, bloco: string) => {
    try {
      console.log("Verificando apartamento na API...");
  
      const { data: verificarAptoResponse } = await axios.post("/api/proxy", {
        action: "verificar_apto",
        payload: {
          acao: "listar", // Define a ação explicitamente
          cond_id: condominioId,
          apto: apartamento,
          bloco: bloco,
        },
      });
  
      console.log("Resposta da API verificar_apto:", verificarAptoResponse);
  
      if (verificarAptoResponse?.resposta === "Apartamento não encontrado") {
        console.log("Apartamento não encontrado. Criando um novo...");
  
        const { data: criarAptoResponse } = await axios.post("/api/proxy", {
          action: "criar_apartamento",
          payload: {
            acao: "novo", // Define a ação explicitamente
            cond_id: condominioId,
            apto: apartamento,
            bloco: bloco,
          },
        });
  
        console.log("Resposta da API criar_apartamento:", criarAptoResponse);
  
        if (criarAptoResponse?.resposta?.includes("Sucesso")) {
          console.log("Apartamento criado com sucesso.");
          return true;
        } else if (criarAptoResponse?.resposta?.includes("Erro! Esse apto já esta cadastrado")) {
          console.log("Apartamento já cadastrado. Continuando o processo...");
          return true;
        } else {
          throw new Error("Erro ao criar apartamento. Verifique os dados e tente novamente.");
        }
      }
  
      console.log("Apartamento já existe. Continuando...");
      return true;
    } catch (error) {
      console.error("Erro ao verificar ou criar apartamento:", error);
      throw error;
    }
  };
  
  const onSubmit = async (data: Schema) => {
    setLoading(true);
    try {
      console.log("Dados do formulário enviados para onSubmit:", data);
  
      const [apartamento, bloco = ""] = data.endereco.apto.trim().split(" ");
      const condominioId = data.endereco.condominio.codigoCondominio;
  
      // Verifica e cria o apartamento, se necessário
      await verificarOuCriarApartamento(condominioId, apartamento, bloco);
  
      const payloadMorador = {
        acao: "novo", // Define a ação explicitamente
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
  
      console.log("Payload do morador:", payloadMorador);
  
      // Tentar cadastrar o morador
      const { data: novoMoradorResponse } = await axios.post("/api/proxy", {
        action: "novo_morador",
        payload: payloadMorador,
      });
  
      console.log("Resposta da API novo_morador:", novoMoradorResponse);
  
      if (novoMoradorResponse.resposta?.includes("Erro ! O CPF Informado já está cadastrado")) {
        console.log("CPF já cadastrado, refazendo chamada com 'editar_morador'...");
  
        // Tentar listar os moradores para encontrar o ID
        const { data: listarMoradoresResponse } = await axios.post("/api/proxy", {
          action: "listar_moradores",
          payload: {
            acao: "listar",
            mor_cond_id: condominioId,
            mor_apto: apartamento,
            mor_bloco: bloco,
          },
        });
  
        console.log("Resposta da API listar_moradores:", listarMoradoresResponse);
  
        if (listarMoradoresResponse.Moradores?.length > 0) {
          const moradorExistente = listarMoradoresResponse.Moradores.find(
            (morador: any) => morador.rg === data.residentes[0].documento
          );
  
          if (!moradorExistente) {
            throw new Error("Erro ao localizar morador existente para edição.");
          }
  
          // Atualiza o payload com o ID do morador
          const editarPayload = {
            ...payloadMorador,
            acao: "editar", // Atualiza a ação para edição
            mor_id: moradorExistente.idregistro,
          };
  
          const { data: editarMoradorResponse } = await axios.post("/api/proxy", {
            action: "editar_morador",
            payload: editarPayload,
          });
  
          console.log("Resposta da API editar_morador:", editarMoradorResponse);
  
          if (editarMoradorResponse.resposta?.includes("Sucesso")) {
            alert("Morador atualizado com sucesso!");
          } else {
            alert(`Erro ao atualizar morador: ${editarMoradorResponse.resposta}`);
          }
        } else {
          console.error("Nenhum morador encontrado na listagem.");
          throw new Error("Erro ao localizar morador existente para edição.");
        }
      } else if (novoMoradorResponse.resposta?.includes("Sucesso")) {
        alert("Cadastro enviado com sucesso!");
      } else {
        alert(`Erro ao cadastrar morador: ${novoMoradorResponse.resposta}`);
      }
    } catch (error) {
      console.error("Erro no fluxo:", error);
      alert("Erro no processo. Tente novamente.");
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
