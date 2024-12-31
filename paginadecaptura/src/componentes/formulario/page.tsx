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

// Carrega a chave de criptografia do .env
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "chave-de-seguranca";

export const Form: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [aptoError, setAptoError] = useState<string>("");
  const [DecryptedPassword, setDecryptedPassword] = useState<string>("");

  // ========= Configuração do react-hook-form ========= //
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

  const { handleSubmit, setValue, control } = methods;

  // Cria arrays controlados para residentes e veículos
  const { fields: residentesFields } = useFieldArray({
    name: "residentes",
    control,
  });
  const { fields: veiculosFields } = useFieldArray({
    name: "veiculos",
    control,
  });

  // ========= Armazena hash da senha (substituindo senha descriptografada) ========= //
  const [hashedPassword, setHashedPassword] = useState<string>("");

  useEffect(() => {
    console.log("Form: useEffect iniciado");
    
    // 1) Verifica se existe token de autenticação no localStorage
    const authToken = localStorage.getItem("authToken");
    console.log("Form: authToken encontrado:", authToken);
    if (!authToken) {
      console.log("Form: Token não encontrado, redirecionando para /auth");
      setSnackbar({
        open: true,
        message: "Você não está autenticado! Faça login primeiro.",
        severity: 'error',
      });
      router.push("/auth");
      return;
    }
  
    // 2) Carrega do localStorage a versão criptografada do CPF
    const encryptedCPF = localStorage.getItem("encryptedCPF");
    const encryptedPassword = localStorage.getItem("encryptedPassword");
  
    // 3) Carrega o hashedPassword
    const storedHashedPassword = localStorage.getItem("hashedPassword");
    if (storedHashedPassword) {
      setHashedPassword(storedHashedPassword);
      console.log("Form: hashedPassword carregado");
    } else {
      console.log("Form: hashedPassword não encontrado");
    }
  
    // 4) Se tiver apto/bloco salvos
    const storedApto = localStorage.getItem("mor_apto");
    const storedBloco = localStorage.getItem("mor_bloco");
  
    // =============== Decriptando CPF e setando no form =============== //
    if (encryptedCPF) {
      try {
        console.log("Form: Decriptando CPF");
        const bytes = CryptoJS.AES.decrypt(encryptedCPF, ENCRYPTION_KEY);
        const originalCPF = bytes.toString(CryptoJS.enc.Utf8);
        console.log("Form: CPF decriptografado:", originalCPF);
        setValue("residentes.0.documento", originalCPF);
      } catch (err) {
        console.error("Form: Erro ao descriptografar o CPF:", err);
      }
    } else {
      console.log("Form: encryptedCPF não encontrado no localStorage");
    }
  
    // =============== Decriptando a Senha e setando no estado =============== //
    if (encryptedPassword) {
      try {
        console.log("Form: Decriptando senha");
        const bytesPass = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
        const originalPass = bytesPass.toString(CryptoJS.enc.Utf8);
        console.log("Form: Senha decriptografada:", originalPass);
        setDecryptedPassword(originalPass); // Armazena a senha descriptografada
      } catch (err) {
        console.error("Form: Erro ao descriptografar a senha:", err);
      }
    } else {
      console.log("Form: encryptedPassword não encontrado no localStorage");
    }
  
    // 5) Se você tiver campos separados para apto e bloco
    if (storedApto || storedBloco) {
      console.log("Form: Setando apto e bloco no formulário");
      const AptoBloco = storedApto + '' + storedBloco;
      setValue("endereco.apto", AptoBloco ?? "");
    }
  
    console.log("Form: useEffect finalizado");
  }, [router, setValue]);
  

  // ========= Função genérica para chamadas de API ========= //
  const chamarApi = async (action: string, payload: Record<string, any>) => {
    try {
      console.log(`chamarApi: Chamando API com ação "${action}" e payload:`, payload);
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("chamarApi: Token de autenticação não encontrado, continuando sem ele.");
      }

      const { data } = await axios.post(
        "/api/proxy",
        { action, payload },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      console.log(`chamarApi: Resposta da API (${action}):`, data);
      return data;
    } catch (error: any) {
      console.error(`chamarApi: Erro ao chamar API (${action}):`, error.response?.data || error.message);
      throw new Error(
        `Erro na ação ${action}: ${error.response?.data || "Erro desconhecido"}`
      );
    }
  };

  // ========= Verifica/cria apartamento se não existir ========= //
  const verificarOuCriarApartamento = async (
    condominioId: string,
    apartamento: string,
    bloco: string
  ) => {
    try {
      console.log("verificarOuCriarApartamento: Verificando apartamento...");
      const verificarAptoResponse = await chamarApi("verificar_apto", {
        acao: "listar",
        cond_id: condominioId,
        apto: apartamento,
        bloco,
      });

      console.log("verificarOuCriarApartamento: Resposta da verificação:", verificarAptoResponse);

      if (verificarAptoResponse?.resposta === "Apartamento não encontrado") {
        console.log("verificarOuCriarApartamento: Apartamento não encontrado. Criando novo apartamento...");
        const criarAptoResponse = await chamarApi("criar_apartamento", {
          acao: "novo",
          cond_id: condominioId,
          apto: apartamento,
          bloco,
        });

        console.log("verificarOuCriarApartamento: Resposta da criação do apartamento:", criarAptoResponse);

        if (!criarAptoResponse?.resposta?.includes("Sucesso")) {
          console.error("verificarOuCriarApartamento: Erro ao criar apartamento.");
          throw new Error("Erro ao criar apartamento.");
        }
      } else {
        console.log("verificarOuCriarApartamento: Apartamento já existe ou outra resposta.");
      }
      console.log("verificarOuCriarApartamento: Apartamento verificado/criado com sucesso.");
      return true;
    } catch (error: any) {
      console.error("verificarOuCriarApartamento: Erro ao verificar ou criar apartamento:", error.message);
      throw error;
    }
  };

  // ========= Cria ou edita morador conforme necessidade ========= //
  const gerenciarMorador = async (
    condominioId: string,
    apartamento: string,
    bloco: string,
    data: Schema,
    hashedPassword: string
  ): Promise<string> => {
    try {
      console.log("gerenciarMorador: Iniciando gerenciamento de morador");
      // Monta payload base para criar morador
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
        mor_senhaapp: DecryptedPassword,
      };

      console.log("gerenciarMorador: Payload base para morador:", payloadMoradorBase);

      // 1) Tenta criar morador
      console.log("gerenciarMorador: Tentando criar morador");
      const novoMoradorResponse = await chamarApi("novo_morador", {
        ...payloadMoradorBase,
        acao: "novo",
      });

      console.log("gerenciarMorador: Resposta da API novo_morador:", novoMoradorResponse);

      // 2) Se já existir, edita
      if (
        novoMoradorResponse.resposta?.includes(
          "Erro ! O CPF Informado já está cadastrado"
        )
      ) {
        console.log("gerenciarMorador: CPF já cadastrado. Tentando editar o morador...");

        // Lista moradores do condomínio para achar o ID do morador
        console.log("gerenciarMorador: Listando moradores para encontrar existente");
        const listarMoradoresResponse = await chamarApi("listar_moradores", {
          acao: "listar",
          mor_cond_id: condominioId,
          mor_apto: "",
          mor_bloco: "",
        });

        console.log("gerenciarMorador: Resposta da API listar_moradores:", listarMoradoresResponse);

        const moradores = listarMoradoresResponse?.Moradores || [];
        if (!Array.isArray(moradores)) {
          console.error("gerenciarMorador: Formato inesperado na resposta de listar_moradores.");
          throw new Error("Formato inesperado na resposta de listar_moradores.");
        }

        // Procura morador existente pelo "rg" ou "cpf"
        const moradorExistente = moradores.find(
          (morador: any) => morador.rg === data.residentes[0].documento
        );

        if (!moradorExistente) {
          console.error("gerenciarMorador: Morador existente não encontrado para edição.");
          throw new Error("Erro ao localizar morador existente para edição.");
        }

        console.log("gerenciarMorador: Morador existente encontrado:", moradorExistente);

        // ========== Atualiza o formulário para exibir dados já cadastrados ========== //
        console.log("gerenciarMorador: Atualizando valores no formulário com dados existentes");
        setValue("endereco.apto", moradorExistente.mor_apto || "");
        setValue(
          "endereco.condominio.nomeCondominio",
          moradorExistente.mor_cond_nome || ""
        );
        // Se tiver "bloco" no back, supondo que seja "mor_bloco"
        setValue("endereco.apto", moradorExistente.mor_bloco || "");

        // Agora faz a edição do morador
        const editarMoradorPayload = {
          mor_id: moradorExistente.idregistro,
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
          mor_senhaapp: hashedPassword,
          acao: "editar",
        };

        console.log("gerenciarMorador: Payload para edição do morador:", editarMoradorPayload);

        const editarMoradorResponse = await chamarApi(
          "editar_morador",
          editarMoradorPayload
        );

        console.log("gerenciarMorador: Resposta da API editar_morador:", editarMoradorResponse);

        if (!editarMoradorResponse.resposta?.includes("Sucesso")) {
          console.error("gerenciarMorador: Erro ao editar morador:", editarMoradorResponse.resposta);
          throw new Error(
            editarMoradorResponse.resposta || "Erro ao editar morador."
          );
        }

        return "Morador atualizado com sucesso!";
      }

      // 3) Se não há erro de CPF já cadastrado, mas ainda assim não veio "Sucesso"
      if (!novoMoradorResponse.resposta?.includes("Sucesso")) {
        console.error("gerenciarMorador: Erro ao criar morador:", novoMoradorResponse.resposta);
        throw new Error(
          novoMoradorResponse.resposta || "Erro ao criar morador."
        );
      }

      console.log("gerenciarMorador: Cadastro enviado com sucesso!");
      return "Cadastro enviado com sucesso!";
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("gerenciarMorador: Erro ao gerenciar morador:", error.message);
        throw error;
      } else {
        console.error("gerenciarMorador: Erro desconhecido ao gerenciar morador:", error);
        throw new Error("Erro desconhecido.");
      }
    }
  };

  // ========= Fluxo principal: onSubmit ========= //
  const onSubmit = async (data: Schema) => {
    console.log("onSubmit: Iniciando submissão do formulário");
    setLoading(true);
    try {
      console.log("onSubmit: Dados do formulário:", data);

      // Quebra apto em "apartamento" e "bloco" (ex.: "10 A2")
      const [apartamento, bloco = ""] = data.endereco.apto.trim().split(" ");
      const condominioId = data.endereco.condominio.codigoCondominio;

      console.log("onSubmit: Apartamento:", apartamento);
      console.log("onSubmit: Bloco:", bloco);
      console.log("onSubmit: Condominio ID:", condominioId);

      // Verifica ou cria o apartamento
      await verificarOuCriarApartamento(condominioId, apartamento, bloco);
      console.log("onSubmit: Verificação/criação do apartamento concluída");

      // Tenta criar/editar o morador
      const mensagem = await gerenciarMorador(
        condominioId,
        apartamento,
        bloco,
        data,
        hashedPassword
      );

      console.log("onSubmit: Mensagem recebida do gerenciamento de morador:", mensagem);
      alert(mensagem);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("onSubmit: Erro no fluxo:", error.message);
        alert(error.message);
      } else {
        console.error("onSubmit: Erro desconhecido no fluxo:", error);
        alert("Erro desconhecido no processo. Tente novamente.");
      }
    } finally {
      setLoading(false);
      console.log("onSubmit: Processo finalizado, loading setado para false");
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
function setSnackbar(arg0: { open: boolean; message: string; severity: string; }) {
  throw new Error("Function not implemented.");
}

