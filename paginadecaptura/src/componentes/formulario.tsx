import { Box, Container } from "@mui/material";
import React from "react";
import { Form } from "./formulario/page";

type FormularioProps = {
  moradorDados: {
    mor_cond_id: string;
    mor_cond_nome: string;
    mor_apto: string;
    mor_bloco: string;
    mor_nome: string;
    mor_parentesco: string;
    mor_cpf: string;
    mor_celular01: string;
    mor_email: string;
    mor_responsavel: string;
    mor_obs: string;
    mor_senhaapp: string;
  };
  setMoradorDados: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
};

const Formulario: React.FC<FormularioProps> = ({ moradorDados, setMoradorDados, handleSubmit }) => {
    return (
        <section id="formulario">
            <Container sx={{ backgroundColor: "primary.main", px: "0", py: "7vw", maxWidth: { lg: "100vw" }, }}>
                <Box sx={{ width: { md: "90%", lg: "90%", xl: "1300px" }, margin: "auto", backgroundColor: "white", borderRadius: ".7rem", }}>
                    <Form moradorDados={moradorDados} setMoradorDados={setMoradorDados} handleSubmit={handleSubmit} />
                </Box>
            </Container>
        </section>
    );
};

export default Formulario;