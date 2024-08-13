import { Box, Container, Typography } from "@mui/material"

type Cliente = {
    nome: string,
    email: string,
    telefone: string,

    doc: string,
    // cpf: string,
    // cnh: string,
    parente: string,
}

type Residencia = {
    Condominio: string,
    Apartamento: number,
    Complementos?: string,
}

type Veiculo = {
    Modelo: string,
    Cor: string,
    Placa: string,
}

export const Formulario = () => {
    return (
        <section id="formulario">
            <Container sx={{ backgroundColor: "secondary.main", px: "0", py: "7rem", maxWidth: { lg: "100vw" }, }}>

                <Box sx={{ height: "100vh", width: "80%", margin: "auto", backgroundColor: "white", borderRadius: ".7rem", }}>

                    <Typography variant="h2" sx={{
                        fontSize: {
                            md: "2.2rem",
                            lg: "2.4rem",
                       },
                        fontWeight: 500,
                        textAlign: "center",
                        color: "black",
                        py: "3rem",
                    }}>
                        Formulário cadastral
                    </Typography>


                    
                </Box>
            </Container>
        </section>
    )
}