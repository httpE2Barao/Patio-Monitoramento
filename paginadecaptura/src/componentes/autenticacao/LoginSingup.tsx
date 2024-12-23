"use client";
import axios from "axios";
import CryptoJS from "crypto-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AuthForm } from "./authForm";

export const LoginSignup: React.FC = () => {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/form");
    }
  }, [router]);

  const handleToggleForm = () => {
    setIsSignup((prevState) => !prevState);
    setError("");
  };

  const handleSubmit = async (data: any) => {
    console.log("Flow: handleSubmit called");
    setError("");
    setLoading(true);
    const cpfLimpo = data.cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
    const cpf = cpfLimpo;
    const { password } = data;

    try {
      if (isSignup) {
        console.log("Flow: signup logic start");
        // Armazena CPF e senha criptografados localmente
        const encryptedCPF = CryptoJS.AES.encrypt(cpf, "chave-de-seguranca").toString();
        const encryptedPassword = CryptoJS.AES.encrypt(password, "chave-de-seguranca").toString();
        localStorage.setItem("encryptedCPF", encryptedCPF);
        localStorage.setItem("encryptedPassword", encryptedPassword);

        // Verifica se o CPF já está cadastrado
        const payloadLoginCheck = {
          action: "login",
          payload: { cpf, senha: password },
        };

        console.log("Flow: checking if user exists");
        const loginCheckResponse = await axios.post("/api/proxy", payloadLoginCheck);
        console.log("Flow: login check response:", loginCheckResponse.data);

        if (loginCheckResponse.data && loginCheckResponse.data.resposta === "ok") {
          console.log("Flow: user exists, stopping signup");
          setError("Cliente já cadastrado! Por favor, faça login.");
          setLoading(false);
          return; // Interrompe o fluxo
        }

        if (loginCheckResponse.data.resposta === "ok") {
          setError("Cliente já cadastrado! Por favor, faça login.");
          setLoading(false);
          return;
        }
      
        if (loginCheckResponse.data.resposta?.includes("Não foi localizado nenhum morador")) {
            localStorage.setItem("authToken", data.token);
            router.push("/form");
        }

      } else {
        console.log("Flow: login logic start");

        const payloadLogin = {
          action: "login",
          payload: { cpf, senha: password },
        };

        console.log("Flow: login request");
        const response = await axios.post("/api/proxy", payloadLogin);
        console.log("Flow: login response:", response.data);

        if (response.data && response.data.resposta === "ok") {
          console.log("Flow: login success");

          // Armazena o token e redireciona
          localStorage.setItem("authToken", response.data.token);
          router.push("/form");
        } else {
          console.log("Flow: login error");
          setError(response.data.resposta || "Credenciais inválidas.");
        }
      }
    } catch (err: any) {
      console.log("Flow: error caught in try/catch");
      if (err.response) {
        setError(err.response.data.error || "Erro no servidor.");
      } else if (err.request) {
        setError("Sem resposta do servidor.");
      } else {
        setError("Erro desconhecido.");
      }
    } finally {
      console.log("Flow: final, setting loading false");
      setLoading(false);
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
