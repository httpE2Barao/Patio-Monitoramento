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

  // Controla o bloqueio dos campos
  const [isAptoDisabled, setIsAptoDisabled] = useState(false);
  const [isCondominioDisabled, setIsCondominioDisabled] = useState(false);

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
      setValue("endereco.condominio", {
        codigoCondominio: storedCondId,
        nomeCondominio: storedCondNome,
      });
      setIsCondominioDisabled(true); // <--- Bloqueia edição
    } else {
      setIsCondominioDisabled(false);
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
      const listarResponse = await chamarApi("verificar_apto", {
        acao: "listar",
        cond_id: condominioId,
      });
    
      const aptos = listarResponse.apto || [];
  
      // Ajuste a comparação com trim
      const aptoEncontrado = aptos.find((a: any) => {
        const aptoDb = String(a.idCasaApto || "").trim();
        const blocoDb = String(a.bloco || "").trim();
  
        const aptoForm = String(apartamento || "").trim();
        const blocoForm = String(bloco || "").trim();
  
        return aptoDb === aptoForm && blocoDb === blocoForm;
      });
  
      if (aptoEncontrado) {
        console.log("DEBUG > aptoEncontrado =", aptoEncontrado);
        console.log("DEBUG > Apto já existe, ID =", aptoEncontrado.idregistro);
        // Retorne o id (ex: aptoEncontrado.idregistro)
        return aptoEncontrado.idregistro; 
      } else {  
        const criarResponse = await chamarApi("criar_apartamento", {
          acao: "novo",
          cond_id: condominioId,
          apto: apartamento,
          bloco: bloco,
        });
        
        console.log("DEBUG > criarResponse =", criarResponse);
  
        if (!criarResponse?.resposta?.includes("Sucesso")) {
          console.log("DEBUG > criarResponse.resposta =", criarResponse?.resposta);
          throw new Error(criarResponse?.resposta || "Erro ao criar apartamento.");
        }
        // Se a API retornar { idregistro: 999, resposta: "Sucesso" }
        return criarResponse.idregistro;
      }
    } catch (error: any) {
      console.error("Erro ao verificar ou criar apartamento:", error.message);
      throw error;
    }
  };  
  
  async function gerenciarMorador(
    condominioId: string,
    nomeCondominio: string,
    apartamento: string,
    bloco: string,
    morador: {
      nome: string;
      telefone: string[];
      email: string;
      tipoDocumento: string;
      documento: string;
      parentesco: string;
    },
    feedback: string,
    DecryptedPassword: string, // pode ser "" para quem não tem senha
    setEditar: React.Dispatch<React.SetStateAction<boolean | null>>,
    setFeedbackMessage: React.Dispatch<React.SetStateAction<string | null>>
  ): Promise<string> {
    try {
      const payloadMoradorBase = {
        mor_cond_id: condominioId,
        mor_cond_nome: nomeCondominio,
        mor_apto: apartamento,
        mor_bloco: bloco,
        mor_nome: morador.nome,
        mor_parentesco: morador.parentesco || "",
        mor_cpf: morador.documento,
        mor_celular01: morador.telefone[0] || "",
        mor_celular02: morador.telefone[1] || "",
        mor_celular03: morador.telefone[2] || "",
        mor_email: morador.email,
        mor_responsavel: "Formulário de Cadastro",
        mor_obs: feedback || "",
        mor_senhaapp: DecryptedPassword, // se for "", significa sem senha
      };
  
      // 1) Tenta criar
      const novoMoradorResponse = await chamarApi("novo_morador", {
        ...payloadMoradorBase,
        acao: "novo",
      });
  
      // 2) Se já existir, faz edição
      if (
        novoMoradorResponse.resposta?.includes("Erro ! O CPF Informado já está cadastrado") ||
        novoMoradorResponse.resposta?.includes("Erro! O CPF Informado já está cadastrado")
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
          (item: any) => item.rg === morador.documento
        );
  
        if (!moradorExistente) {
          throw new Error("Morador existente não encontrado para edição.");
        }
  
        // Faz a edição
        const editarMoradorResponse = await chamarApi("editar_morador", {
          mor_id: moradorExistente.idregistro,
          ...payloadMoradorBase,
          acao: "editar",
        });
  
        if (!editarMoradorResponse.resposta?.includes("Sucesso")) {
          throw new Error(
            editarMoradorResponse.resposta || "Erro ao editar morador."
          );
        }
  
        return "Morador atualizado com sucesso!";
      }
  
      // 3) Se não veio "CPF já cadastrado", mas também não veio "Sucesso", é erro
      if (!novoMoradorResponse.resposta?.includes("Sucesso")) {
        throw new Error(novoMoradorResponse.resposta || "Erro ao criar morador.");
      }
  
      // 4) Se deu sucesso na criação
      return "Cadastro enviado com sucesso!";
    } catch (error: any) {
      console.error("Erro ao gerenciar morador:", error.message);
      setFeedbackMessage(error.message);
      throw error; // re-lança para interromper fluxo se precisar
    }
  }  

  // ================== Fluxo no onSubmit ================== //
  const onSubmit = async (data: Schema) => {
    setLoading(true);
    try {
      const aptoLimpo = limparAptoBloco(data.endereco.apto);
      const [apartamento, bloco = ""] = aptoLimpo.split(" ");
      const condominioId = data.endereco.condominio.codigoCondominio;

      // Verifica/cria apto
      await verificarOuCriarApartamento(condominioId, apartamento, bloco);

      for (let i = 0; i < data.residentes.length; i++) {
        const morador = data.residentes[i];
        const feedback = data.feedback || "";

        // Só o primeiro recebe a senha descriptografada
        const senhaParaEsseMorador = i === 0 ? DecryptedPassword : "SENHA";

        // Chamamos a função unificada
        const msg = await gerenciarMorador(
          condominioId,
          data.endereco.condominio.nomeCondominio,
          apartamento,
          bloco,
          morador,
          feedback,
          senhaParaEsseMorador,
          setEditar,
          setFeedbackMessage
        );

        console.log("Resposta ao cadastrar/editar um morador:", msg);
        setFeedbackMessage(msg); // Mostra a última mensagem
      }
    } catch (error: unknown) {
      console.error("Erro no fluxo:", error);
    } finally {
      setLoading(false);
      clearSpecificLocalStorageData();
    }
  };

  const onError = (errors: any) => {
    console.log("Erros de validação:", errors);
  };

  function limparAptoBloco(input: string): string {
    // Converte tudo para lowercase
    let texto = input.toLowerCase();
  
    // Remove qualquer caractere que não seja letra, dígito ou espaço
    texto = texto.replace(/[^a-z0-9\s]/g, " ");
  
    // Remove as palavras "apartamento", "apto", "apt", "ap"
    // (\b = borda de palavra para evitar capturar substrings indesejadas)
    texto = texto.replace(/\b(apartamento|apto|apt|ap)\b/g, "");
  
    // Remove as palavras "bloco" e "bl"
    texto = texto.replace(/\b(bloco|bl)\b/g, "");
  
    // Substitui múltiplos espaços por um único e faz trim
    texto = texto.replace(/\s+/g, " ").trim();
  
    return texto;
  }  

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
            variant="h4"
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

              {/* <Grid item xs={12}>
                {veiculosFields.map((item, index) => (
                  <FormVeiculo key={item.id} index={index} />
                ))}
              </Grid> */}

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