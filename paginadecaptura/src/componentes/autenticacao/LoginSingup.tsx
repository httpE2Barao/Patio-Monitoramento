"use client";
import axios from "axios";
import CryptoJS from "crypto-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AuthForm } from "./authForm";

// Carrega a chave de criptografia do .env
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "chave-de-seguranca";

export const LoginSignup: React.FC = () => {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("useEffect: Verificando token de autenticação...");
    const token = localStorage.getItem("authToken");
    console.log("useEffect: Token encontrado:", token);
    if (token) {
      console.log("useEffect: Token válido, redirecionando para /form");
      router.push("/form");
    } else {
      console.log("useEffect: Token não encontrado, permanecendo em /auth");
    }
  }, [router]);

  const handleToggleForm = () => {
    setIsSignup((prevState) => !prevState);
    setError("");
    console.log(`handleToggleForm: Formulário alterado para ${isSignup ? "Login" : "Signup"}`);
  };

  const handleSubmit = async (data: any) => {
    console.log("LoginSingup: Iniciando processo de", isSignup ? "signup" : "login");
    setError("");
    setLoading(true);

    const cpf = data.cpf.replace(/\D/g, "");
    const { password } = data;

    try {
      if (isSignup) {
        console.log("LoginSingup: Fluxo de Signup iniciado");
          console.log("LoginSingup: Criando novo usuário");
          // Salva token localmente
          const authToken = data.mor_cond_id || "autenticado";
          console.log("LoginSingup: Salvando authToken no localStorage:", authToken);
          localStorage.setItem("authToken", authToken);

          // === Criptografa e salva CPF e Senha no localStorage ===
          console.log("LoginSingup: Criptografando CPF e senha");
          const encryptedCPF = CryptoJS.AES.encrypt(cpf, ENCRYPTION_KEY).toString();
          const encryptedPassword = CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();

          console.log("LoginSingup: Salvando CPF e senha criptografados no localStorage");
          localStorage.setItem("encryptedCPF", encryptedCPF);
          localStorage.setItem("encryptedPassword", encryptedPassword);

          console.log("LoginSingup: Redirecionando para /form");
          router.push("/form");
      } else {
          // Fluxo de login
          console.log("LoginSingup: Fluxo de Login iniciado");
          const payloadLogin = {
            action: "login",
            payload: { cpf, senha: password },
          };
          console.log("LoginSingup: Enviando requisição de login ao backend");
        const response = await axios.post("/api/proxy", payloadLogin);

        console.log("LoginSingup: Resposta do login:", response.data);
        
        if (response.data?.resposta === "ok") {
          console.log("LoginSingup: Login bem-sucedido");
          
          // Salva token localmente
          const authToken = response.data.mor_cond_id || "autenticado";
          localStorage.setItem("authToken", authToken);
          
          // 1) Salva o cond_id (mor_cond_id) no localStorage
          const condId = response.data.mor_cond_id || "";
          const condNome = response.data.mor_cond_nome || "";
          localStorage.setItem("mor_cond_id", condId);
          localStorage.setItem("mor_cond_nome", condNome);
          
          // 2) Salva apto e bloco no localStorage
          const morApto = response.data.mor_apto || "";
          const morBloco = response.data.mor_bloco || "";
          localStorage.setItem("mor_apto", morApto);
          localStorage.setItem("mor_bloco", morBloco);
          
          // === Criptografa e salva CPF e Senha no localStorage ===
          const encryptedCPF = CryptoJS.AES.encrypt(cpf, ENCRYPTION_KEY).toString();
          const encryptedPassword = CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
          localStorage.setItem("encryptedCPF", encryptedCPF);
          localStorage.setItem("encryptedPassword", encryptedPassword);
          
          router.push("/form");             
        } else {
          console.log("LoginSingup: Erro no login:", response.data.resposta);
          setError(response.data.resposta || "Credenciais inválidas.");
        }
      }} 
      catch (err: any) {
      console.log("LoginSingup: Erro capturado no try/catch:", err);
      if (err.response) {
        console.log("LoginSingup: Erro de resposta do servidor:", err.response.data);
        setError(err.response.data.error || "Erro no servidor.");
      } else if (err.request) {
        console.log("LoginSingup: Erro na requisição:", err.request);
        setError("Sem resposta do servidor.");
      } else {
        console.log("LoginSingup: Erro desconhecido:", err.message);
        setError("Erro desconhecido.");
      }
    } finally {
      setLoading(false);
      console.log("LoginSingup: Processo finalizado, loading setado para false");
    }
  };
  
  return (
    <div className="flex flex-col-reverse md:flex-row md:h-screen relative">
      <div className="img-auth w-full md:w-1/2 md:relative md:my-auto max-w-[1300px] order-2 md:order-none">
        <Image
          src="/banner-login-1.png"
          alt="Banner Login"
          width={1300}
          height={800}
          className="rounded-b-2xl md:rounded-r-2xl md:rounded-b-none object-left-top"
          priority
        />
      </div>
      <div className="flex flex-col px-7 gap-5 2xl:gap-20 md:justify-center md:w-1/2 p-6 m-auto max-w-[60em]">
        <div className="mb-4 text-center order-3 md:order-none">
          <p className="text-gray-600 text-lg px-7 md:text-xl xl:text-2xl">
            Mantenha seus dados atualizados para que possamos oferecer o melhor
            serviço e te manter sempre informado.
          </p>
        </div>
        <AuthForm
          isSignup={isSignup}
          error={error}
          setError={setError}
          handleSubmit={handleSubmit}
          loading={loading}
        />
        <div className="flex justify-center xl:mt-4">
          <button
            onClick={handleToggleForm}
            className="text-blue-500 underline hover:text-blue-700 transition-colors duration-300"
          >
            {isSignup ? "Já sou cliente" : "Não tem uma conta? Cadastre-se"}
          </button>
        </div>
      </div>
    </div>
  );
};
