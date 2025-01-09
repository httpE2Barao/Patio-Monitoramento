import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Grid, Typography } from "@mui/material";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { chamarApi } from "src/utils/chamarAPI";
import { clearSpecificLocalStorageData } from "src/utils/limparLocal";
import { Schema, schema } from "../schema-zod";
import { FormEndereco } from "./FormEndereco";
import { FormFeedback } from "./FormFeedback";
import { FormResidentes } from "./FormResidentes";
import { FormVeiculo } from "./FormVeiculo";

const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "chave-de-seguranca";

export const Form: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [aptoError, setAptoError] = useState<string>("");

  // Guardar a senha de forma descriptografada (opcional)
  const [DecryptedPassword, setDecryptedPassword] = useState<string>("");

  // Mensagem de feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Flag para indicar se vamos editar um morador que já existe
  const [Editar, setEditar] = useState<boolean | null>(null);

  // Referência para scroll automático no feedback
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  // Vai controlar o bloqueio do campo apto
  const [isAptoDisabled, setIsAptoDisabled] = useState(false);

  // Guardar o CPF e apto/bloco vindos do localStorage
  const [storedCPF, setStoredCPF] = useState<string>("");
  const [storedAptoBloco, setStoredAptoBloco] = useState<string>("");

  // Hash da senha (opcional)
  const [hashedPassword, setHashedPassword] = useState<string>("");

  // ========= Configuração do react-hook-form ========= //
  const methods = useForm<Schema>({
    resolver: zodResolver(schema),
    // "defaultValues" inicial pode ficar vazio, pois vamos setar depois no useEffect
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

  const { handleSubmit, setValue, control, reset } = methods;
  const { fields: residentesFields } = useFieldArray({
    name: "residentes",
    control,
  });
  const { fields: veiculosFields } = useFieldArray({
    name: "veiculos",
    control,
  });

  // ========= Carregar dados do localStorage no useEffect ========= //
  useEffect(() => {
    // 1) Verifica se existe token de autenticação
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setFeedbackMessage("Você não está autenticado! Faça login primeiro.");
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
    }
  
    // 4) Carrega condo/apto/bloco
    const storedCondId = localStorage.getItem("mor_cond_id");
    const storedCondNome = localStorage.getItem("mor_cond_nome");
    const storedApto = localStorage.getItem("mor_apto") || "";
    const storedBloco = localStorage.getItem("mor_bloco") || "";
  
    // =============== Decriptar CPF =============== //
    if (encryptedCPF) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedCPF, ENCRYPTION_KEY);
        const originalCPF = bytes.toString(CryptoJS.enc.Utf8);
  
        // Já define no form
        setValue("residentes.0.documento", originalCPF);
        // Armazena no state
        setStoredCPF(originalCPF);
      } catch (err) {
        console.error("Erro ao descriptografar o CPF:", err);
      }
    }
  
    // =============== Decriptar Senha =============== //
    if (encryptedPassword) {
      try {
        const bytesPass = CryptoJS.AES.decrypt(
          encryptedPassword,
          ENCRYPTION_KEY
        );
        const originalPass = bytesPass.toString(CryptoJS.enc.Utf8);
        setDecryptedPassword(originalPass);
      } catch (err) {
        console.error("Erro ao descriptografar a senha:", err);
      }
    }
  
    // Preenche no form o condomínio
    if (storedCondId && storedCondNome) {
      setValue("endereco.condominio.codigoCondominio", storedCondId);
      setValue("endereco.condominio.nomeCondominio", storedCondNome);
    }
  
    // Junta apto e bloco
    const aptoBloco = storedApto + (storedBloco ? " " + storedBloco : "");
    setStoredAptoBloco(aptoBloco);
  
    // Se aptoBloco não está vazio, desabilita
    if (aptoBloco) {
      setIsAptoDisabled(true);
      setValue("endereco.apto", aptoBloco);
    }
  
  }, [router, setValue]);  

  // ========= Verifica/cria apartamento se não existir ========= //
  const verificarOuCriarApartamento = async (
    condominioId: string,
    apartamento: string,
    bloco: string
  ) => {
    try {
      const verificarAptoResponse = await chamarApi("verificar_apto", {
        acao: "listar",
        cond_id: condominioId,
        apto: apartamento,
        bloco,
      });

      // Desestruturei para facilitar
      const { resposta } = verificarAptoResponse;

      // transforme "resposta" em string
      const respStr = String(resposta || "");

      // Se contiver algo que indique "não encontrado", cria o apto
      if (respStr.includes("Erro!") || respStr.includes("Erro !")) {
        const criarAptoResponse = await chamarApi("criar_apartamento", {
          acao: "novo",
          cond_id: condominioId,
          apto: apartamento,
          bloco,
        });

        if (!criarAptoResponse?.resposta?.includes("Sucesso")) {
          throw new Error(
            criarAptoResponse?.resposta || "Erro ao criar apartamento."
          );
        }
        return true; // Apartamento criado
      }

      // Caso contrário, assumo que já existe ou não é erro
      return true;
    } catch (error: any) {
      console.error("Erro ao verificar ou criar apartamento:", error.message);
      throw error;
    }
  };

  // ========= Cria ou edita morador conforme necessidade ========= //
  const gerenciarMorador = async (
    condominioId: string,
    apartamento: string,
    bloco: string,
    data: Schema,
    DecryptedPassword: string
  ): Promise<string> => {
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
        mor_senhaapp: DecryptedPassword,
      };

      // 1) Tenta criar morador
      const novoMoradorResponse = await chamarApi("novo_morador", {
        ...payloadMoradorBase,
        acao: "novo",
      });

      // 2) Se já existir, edita
      if (
        novoMoradorResponse.resposta?.includes(
          "Erro ! O CPF Informado já está cadastrado"
        ) ||
        novoMoradorResponse.resposta?.includes(
          "Erro! O CPF Informado já está cadastrado"
        )
      ) {
        setEditar(true);

        const listarMoradoresResponse = await chamarApi("listar_moradores", {
          acao: "listar",
          mor_cond_id: condominioId,
          mor_apto: "",
          mor_bloco: "",
        });

        const moradores = listarMoradoresResponse?.Moradores || [];
        const moradorExistente = moradores.find(
          (morador: any) => morador.rg === data.residentes[0].documento
        );

        if (!moradorExistente) {
          throw new Error("Morador existente não encontrado para edição.");
        }

        // Agora faz a edição do morador
        const editarMoradorPayload = {
          mor_id: moradorExistente.idregistro,
          ...payloadMoradorBase,
          acao: "editar",
        };

        console.log(
          "gerenciarMorador: Payload para edição do morador:",
          editarMoradorPayload
        );

        const editarMoradorResponse = await chamarApi(
          "editar_morador",
          editarMoradorPayload
        );

        if (!editarMoradorResponse.resposta?.includes("Sucesso")) {
          throw new Error(
            editarMoradorResponse.resposta || "Erro ao editar morador."
          );
        }

        return "Morador atualizado com sucesso!";
      }

      if (!novoMoradorResponse.resposta?.includes("Sucesso")) {
        throw new Error(
          novoMoradorResponse.resposta || "Erro ao criar morador."
        );
      }

      return "Cadastro enviado com sucesso!";
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao gerenciar morador:", error.message);
        setFeedbackMessage(error.message);
      } else {
        console.error("Erro desconhecido:", error);
        setFeedbackMessage("Erro desconhecido no processo. Tente novamente.");
      }
      throw error;
    }
  };

  // ========= Fluxo principal: onSubmit ========= //
  const onSubmit = async (data: Schema) => {
    setLoading(true);
    try {
      // Separa apto e bloco se houver
      const [apartamento, bloco = ""] = data.endereco.apto.trim().split(" ");
      const condominioId = data.endereco.condominio.codigoCondominio;

      // Verifica ou cria o apartamento
      await verificarOuCriarApartamento(condominioId, apartamento, bloco);

      // Tenta criar/editar o morador
      const mensagem = await gerenciarMorador(
        condominioId,
        apartamento,
        bloco,
        data,
        hashedPassword
      );

      setFeedbackMessage(mensagem); // Exibe a mensagem retornada
    } catch (error: unknown) {
      console.error("Erro no fluxo:", error);
      setFeedbackMessage("Erro desconhecido no processo. Tente novamente.");
    } finally {
      setLoading(false);
      // Remove dados do localStorage (mas pode manter se quiser re-editar)
      clearSpecificLocalStorageData();
    }
  };

  const onError = (errors: any) => {
    console.log("Erros de validação:", errors);
  };

  // ========= Funções para resetar e fazer logout ========= //
  const handleReset = () => {
    // Queremos que ao resetar ele mantenha o CPF e o apto que carregamos
    // Podemos fazer algo assim:
    reset({
      // Pegamos todos valores atuais...
      ...methods.getValues(),
      // ... mas sobrescrevemos especificamente os campos que queremos manter
      residentes: [
        {
          ...methods.getValues().residentes[0],
          documento: storedCPF, // reinserir CPF
        },
      ],
      endereco: {
        ...methods.getValues().endereco,
        apto: storedAptoBloco, // reinserir apto
      },
    });
    setFeedbackMessage(null);
  };

  const handleLogout = () => {
    clearSpecificLocalStorageData();
    router.push("/auth");
  };

  // ========= Scroll para feedback ========= //
  useEffect(() => {
    if (feedbackMessage && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [feedbackMessage]);

  return (
    <Container>
      {feedbackMessage ? (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh" }}
          ref={feedbackRef}
        >
          <Typography
            variant="h2"
            color="primary"
            align="center"
            style={{ letterSpacing: "1px", fontWeight: "normal", padding: "1em" }}
          >
            {feedbackMessage}
          </Typography>
          <Grid item container justifyContent="center" spacing={2}>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={handleReset} sx={{fontSize:"1.1em"}}>
                Voltar
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleLogout} sx={{fontSize:"1.1em"}}>
                Sair
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <FormProvider {...methods}>
          <form
            className="flex gap-2 flex-col items-center justify-evenly pb-4"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                {/* Agora passamos a isAptoDisabled para o FormEndereco */}
                <FormEndereco isAptoDisabled={isAptoDisabled} />
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
                <Button type="submit" variant="contained" disabled={loading}  sx={{fontSize:"1.1em"}}>
                  {loading ? "Enviando..." : "Cadastrar"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      )}
    </Container>
  );
};