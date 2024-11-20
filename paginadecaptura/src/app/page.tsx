"use client"
import { ThemeProvider } from "@mui/material";
import LoginSignupPage from "componentes/autenticacao/page";
import FAQ from "componentes/faq";
import Footer from "componentes/footer";
import Formulario from "componentes/formulario";
import Header from "componentes/header";
import BoasVindas from "componentes/inicio";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { BtnToTop } from "../componentes/botaoSubir";
import { theme } from "./theme";

const PaginaPrincipal: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignupPage />} />
          <Route path="/form" element={
            <>
              <Header />
              <BoasVindas />
              <Formulario />
              <FAQ />
              <Footer />
              <BtnToTop />
            </>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default PaginaPrincipal;