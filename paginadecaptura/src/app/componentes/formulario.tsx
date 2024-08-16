import { Box, Container, Typography } from "@mui/material"
import { FormTitular } from "../formComponentes/titular"

const Titulo = (props: { titulo: string }) => {
    return (
        <Typography sx={{
            fontSize: {
                sx: "2rem",
                sm: "2.4rem",
                md: "2.4rem",
                lg: "2.4rem",
                xl: "2.4rem",
            },
            fontWeight: 500,
            textAlign: "center",
            color: "black",
            py: "3vw",
        }}>
            {props.titulo}
        </Typography>
    )
}

export const Formulario = () => {
    return (
        <section id="formulario">
            <Container sx={{ backgroundColor: "primary.main", px: "0", py: "7vw", maxWidth: { lg: "100vw" }, }}>

                <Box sx={{ width: { md: "90%", lg: "90%", xl: "80%" }, margin: "auto", backgroundColor: "white", borderRadius: ".7rem", }}>

                    <Titulo titulo="Titular" />

                    <FormTitular />

                    <Titulo titulo="Residêncial" />

                    <Titulo titulo="Veículo" />

                </Box>

            </Container>
        </section>
    )
}