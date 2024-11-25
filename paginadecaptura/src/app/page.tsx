"use client"
import { ThemeProvider } from "@mui/material";
import axios from "axios";
import { BtnToTop } from "componentes/botaoSubir";
import FAQ from "componentes/faq";
import Footer from "componentes/footer";
import Formulario from "componentes/formulario";
import Header from "componentes/header";
import BoasVindas from "componentes/inicio";
import React, { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginSignupPage from "./loginSignupPage";
import { theme } from "./theme";

const PaginaPrincipal: React.FC = () => {
  const [apartamentoExistente, setApartamentoExistente] = useState<boolean | null>(null);
  const [moradorDados, setMoradorDados] = useState({
    mor_cond_id: "12345678",
    mor_cond_nome: "PATIO TESTE",
    mor_apto: "",
    mor_bloco: "",
    mor_nome: "",
    mor_parentesco: "",
    mor_cpf: "",
    mor_celular01: "",
    mor_email: "",
    mor_responsavel: "",
    mor_obs: "",
    mor_senhaapp: ""
  });

  useEffect(() => {
    if (moradorDados.mor_apto) {
      verificarApartamentoExistente(moradorDados.mor_cond_id, moradorDados.mor_apto);
    }
  }, [moradorDados.mor_apto]);

  const verificarApartamentoExistente = async (condominioId: string, apto: string) => {
    try {
      const response = await axios.get(`${process.env.API_URL_LISTAR_MORADORES}/?condominio=${condominioId}`);
      const apartamentos = response.data.moradores;
      const aptoExistente = apartamentos.some((morador: any) => morador.idCasaApto === apto);
      setApartamentoExistente(aptoExistente);
    } catch (error) {
      console.error("Erro ao verificar apartamento existente:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (apartamentoExistente === false) {
      // Criar novo apartamento
      try {
        await axios.post(process.env.API_URL_APTO!, {
          acao: "novo",
          cond_id: moradorDados.mor_cond_id,
          apto: moradorDados.mor_apto,
          bloco: moradorDados.mor_bloco
        });
        console.log("Apartamento criado com sucesso");
      } catch (error) {
        console.error("Erro ao criar apartamento:", error);
        return;
      }
    }

    // Cadastrar ou atualizar morador
    try {
      const response = await axios.post(process.env.API_URL_MORADOR!, {
        acao: "novo",
        mor_cond_id: moradorDados.mor_cond_id,
        mor_cond_nome: moradorDados.mor_cond_nome,
        mor_apto: moradorDados.mor_apto,
        mor_bloco: moradorDados.mor_bloco,
        mor_nome: moradorDados.mor_nome,
        mor_parentesco: moradorDados.mor_parentesco,
        mor_cpf: moradorDados.mor_cpf,
        mor_celular01: moradorDados.mor_celular01,
        mor_celular02: "..",
        mor_celular03: "..",
        mor_email: moradorDados.mor_email,
        mor_responsavel: moradorDados.mor_responsavel,
        mor_obs: moradorDados.mor_obs,
        mor_senhaapp: moradorDados.mor_senhaapp
      });
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao cadastrar morador:", error);
    }
  };

  if (typeof window === 'undefined') {
    return null; 
  }
  
  return (  
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/auth" element={<LoginSignupPage />} />
          <Route path="/form" element={
            <>
              <Header />
              <BoasVindas />
              <Formulario
                moradorDados={moradorDados}
                setMoradorDados={setMoradorDados}
                handleSubmit={handleSubmit}
              />
              <FAQ />
              <Footer />
              <BtnToTop />
            </>
          } />
          <Route path="/*" element={<Navigate to="/form" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default PaginaPrincipal;