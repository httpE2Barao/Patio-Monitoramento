import { Box, Container } from "@mui/material";
import React from "react";
import { Form } from "./formulario/page";

const Formulario: React.FC = () => {

    return (
        <section id="formulario">
            <Container sx={{ backgroundColor: "primary.main", px: "0", py: "7vw", maxWidth: { lg: "100vw" }, }}>
                <Box sx={{ width: { md: "90%", lg: "90%", xl: "1300px" }, margin: "auto", backgroundColor: "white", borderRadius: ".7rem", }}>
                    <Form />
                </Box>
            </Container>
        </section>
    );
};

export default Formulario;