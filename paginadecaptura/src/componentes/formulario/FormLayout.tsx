"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BtnToTop } from "../botaoSubir";
import FAQ from "../faq";
import Footer from "../footer";
import Formulario from "../formulario";
import Header from "../header";
import BoasVindas from "../inicio";

export const FormularioLayout = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [cpf, setCpf] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedCpf = localStorage.getItem("cpf");

    if (!token) {
      router.push("/auth");
    } else {
      setIsAuthenticated(true); // Usuário autenticado
      setCpf(storedCpf); // Recupera o CPF armazenado
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
      <Formulario cpf={cpf} />
      <FAQ />
      <Footer />
      <BtnToTop />
    </>
  );
};
