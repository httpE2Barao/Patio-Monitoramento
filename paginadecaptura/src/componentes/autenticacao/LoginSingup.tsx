"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "../../pages/api/service";
import { AuthForm } from "./authForm";

const ToggleFormButton: React.FC<{ isSignup: boolean; onToggle: () => void }> = ({
  isSignup,
  onToggle,
}) => (
  <button
    onClick={onToggle}
    className="text-blue-500 underline hover:text-blue-700 transition-colors duration-300"
  >
    {isSignup ? "Já sou cliente" : "Não tem uma conta? Cadastre-se"}
  </button>
);

export const LoginSignup: React.FC = () => {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.replace("/form");
    }
  }, [router]);

  const handleToggleForm = () => {
    setIsSignup(!isSignup);
    setError("");
  };

  const handleApiError = (err: any): string => {
    if (err.response) {
      console.error("Erro na API:", {
        status: err.response.status,
        data: err.response.data,
      });
      return err.response.data.error || "Erro no servidor. Tente novamente mais tarde.";
    } else if (err.request) {
      console.error("Nenhuma resposta da API:", err.request);
      return "Sem resposta do servidor. Verifique sua conexão.";
    } else {
      console.error("Erro ao configurar a requisição:", err.message);
      return "Erro desconhecido. Tente novamente mais tarde.";
    }
  };

  const handleSubmit = async (data: any) => {
    setError("");
    setLoading(true);
  
    const { cpf, password } = data;
  
    try {
      const payload = {
        cpf,
        senha: password,
        action: isSignup ? "signup" : "login", 
      };
  
      // Chamada para a API Route
      const response = await api.post("/proxy", payload);
  
      if (response.data.resposta === "ok") {
        localStorage.setItem("authToken", response.data.token);
        router.push("/form");
      } else {
        setError(response.data.resposta || "Credenciais inválidas ou usuário não encontrado.");
      }
    } catch (err: any) {
      console.error("Erro na API:", err);
      setError(err.response?.data || "Erro ao conectar ao servidor.");
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
          <ToggleFormButton isSignup={isSignup} onToggle={handleToggleForm} />
        </div>
      </div>
    </div>
  );
};
