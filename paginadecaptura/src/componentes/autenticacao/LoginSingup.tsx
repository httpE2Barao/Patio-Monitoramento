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
    setIsSignup(!isSignup);
    setError("");
  };

  const handleSubmit = async (data: any) => {
    setError("");
    setLoading(true);
    const { cpf, password } = data;

    try {
      const action = isSignup ? "signup" : "login";

      // Criptografa CPF e senha
      const encryptedCPF = CryptoJS.AES.encrypt(cpf, "chave-de-seguranca").toString();
      const encryptedPassword = CryptoJS.AES.encrypt(password, "chave-de-seguranca").toString();

      // Armazena os valores criptografados
      localStorage.setItem("encryptedCPF", encryptedCPF);
      localStorage.setItem("encryptedPassword", encryptedPassword);

      // Monta o payload para o backend
      const payload = {
        action,
        payload: {
          cpf,   // Necessário caso o backend exija o CPF em texto puro para login
          senha: password,
        },
      };

      console.log("Enviando payload:", payload);

      // Chamada de API
      const response = await axios.post("/api/proxy", payload);
      console.log("Resposta da API:", response.data);

      if (response.data && response.data.resposta === "ok") {
        localStorage.setItem("authToken", response.data.token);
        router.push("/form");
      } else {
        setError(response.data.resposta || "Credenciais inválidas.");
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || "Erro no servidor.");
      } else if (err.request) {
        setError("Sem resposta do servidor.");
      } else {
        setError("Erro desconhecido.");
      }
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row md:h-screen relative">
      <div className="w-full md:w-1/2 md:relative md:my-auto max-w-[1300px] order-2 md:order-none">
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
