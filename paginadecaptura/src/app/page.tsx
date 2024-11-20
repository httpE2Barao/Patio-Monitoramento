"use client";
import { ThemeProvider } from "@mui/material";
import LoginSignupPage from "componentes/autenticacao/loginSignup";
import { BtnToTop } from "componentes/botaoSubir";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import FAQ from "../componentes/faq";
import Footer from "../componentes/footer";
import Formulario from "../componentes/formulario";
import Header from "../componentes/header";
import BoasVindas from "../componentes/inicio";
import { theme } from "./theme";

const PaginaPrincipal: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/formulario" replace />} />
          <Route path="/auth" element={<LoginSignupPage />} />
          <Route path="/formulario" element={
            <>
              <Header />
              <BoasVindas />
              <Formulario />
              <FAQ />
              <Footer />
              <BtnToTop />
            </>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default PaginaPrincipal;