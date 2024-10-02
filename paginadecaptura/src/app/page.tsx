"use client"
import { ThemeProvider } from "@mui/material";
import { BtnToTop } from "../componentes/botaoSubir";
import FAQ from "../componentes/faq";
import Footer from "../componentes/footer";
import Formulario from "../componentes/formulario";
import Header from "../componentes/header";
import BoasVindas from "../componentes/inicio";
import { theme } from "./theme";

export default function PaginaPrincipal() {
  return (
    <>
      <ThemeProvider theme={theme}>

        <Header />

        <BoasVindas />

        <Formulario />

        <FAQ />

        <Footer />

        <BtnToTop />

      </ThemeProvider>
    </>
  );
}