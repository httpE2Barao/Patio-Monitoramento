"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BtnToTop } from "./botaoSubir";
import FAQ from "./faq";
import Footer from "./footer";
import Formulario from "./formulario";
import Header from "./header";
import BoasVindas from "./inicio";

export const FormularioLayout = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [cpf, setCpf] = useState<string | null>(null);
  const [senha, setSenha] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedCpf = localStorage.getItem("cpf");
    const storedSenha = localStorage.getItem("senha");

    const verificarCpfExistente = async (cpf: string) => {
      try {
        // Verifica na API se o CPF realmente existe
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_MORADOR}/${cpf}`);
        if (response.status === 200 && response.data.resposta === "não encontrado") {
          throw new Error("CPF não encontrado");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Se houver uma resposta do servidor com mensagem de erro, exibe a mensagem
          setErrorMessage(error.response.data.message || "Erro ao verificar o CPF. Tente novamente.");
        } else {
          // Se não houver resposta ou ocorrer outro tipo de erro
          setErrorMessage("Erro ao verificar o CPF. Tente novamente.");
        }
      }
    };

    if (token) {
      // Usuário autenticado pelo token
      setIsAuthenticated(true);
    } else if (storedCpf && storedSenha) {
      // Verifica se o CPF realmente existe na API
      verificarCpfExistente(storedCpf)
        .then(() => {
          setIsAuthenticated(false);
          setCpf(storedCpf);
          setSenha(storedSenha);
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    } else {
      // Usuário não autenticado e sem CPF e senha - redireciona para /auth
      router.push("/auth");
    }
  }, [router]);

  // Exibe um estado de carregamento enquanto verifica a autenticação
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen font-semibold text-2xl">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <BoasVindas />
      <Formulario cpf={cpf} senha={senha} />
      <FAQ />
      <Footer />
      <BtnToTop />
    </>
  );
};
