import { Box, Container, Typography } from "@mui/material"
import { Users } from "../users/users"

// type Cliente = {
//     nome: string,
//     email: string,
//     telefone: string,

//     doc: string,
//     // cpf: string,
//     // cnh: string,
//     parente: string,
// }

// type Residencia = {
//     Condominio: string,
//     Apartamento: number,
//     Complementos?: string,
// }

// type Veiculo = {
//     Modelo: string,
//     Cor: string,
//     Placa: string,
// }

export const Formulario = () => {
    return (
        <section id="formulario">
            <Container sx={{ backgroundColor: "primary.main", px: "0", py: "7vw", maxWidth: { lg: "100vw" }, }}>

                <Box sx={{ height: "100vh", width: {md: "90%", lg:"90%", xl:"80%"}, margin: "auto", backgroundColor: "white", borderRadius: ".7rem", }}>

                    <Typography sx={{
                        fontSize: "2.4rem",
                        fontWeight: 500,
                        textAlign: "center",
                        color: "black",
                        py: "4vw",
                    }}>
                        Formulário cadastral
                    </Typography>
                    
                    <Users />

                </Box>
            </Container>
        </section>
    )
}