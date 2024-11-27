"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "../../pages/api/service";
import { AuthForm } from "./authForm";

export const LoginSignup: React.FC = () => {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Verifica se o usuário já está autenticado
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/form"); // Redireciona se o token existir
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
      const endpoint = isSignup ? "/criar_senha" : "/login";
      const payload = { cpf, senha: password };

      // Enviando a requisição para criar senha ou login
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        payload
      );

      // Verificando a resposta da API
      if (response.data && response.data.resposta === "ok") {
        localStorage.setItem("cpf", cpf);
        localStorage.setItem("authToken", response.data.token); // Salva o token no localStorage
        router.push("/form"); // Redireciona após o login bem-sucedido
      } else {
        setError(
          response.data.resposta ||
          "Credenciais inválidas ou usuário não encontrado."
        );
      }
    } catch (err: any) {
      if (err.response) {
        console.error("Erro na API:", {
          status: err.response.status,
          data: err.response.data,
        });
        setError(
          err.response.data.error || "Erro no servidor. Tente novamente mais tarde."
        );
      } else if (err.request) {
        console.error("Nenhuma resposta da API:", err.request);
        setError("Sem resposta do servidor. Verifique sua conexão.");
      } else {
        console.error("Erro ao configurar a requisição:", err.message);
        setError("Erro desconhecido. Tente novamente mais tarde.");
      }
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
