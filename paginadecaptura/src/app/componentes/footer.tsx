import { Box, Container } from "@mui/material"

export const Footer = () => {
    return (
        <Container sx={{p:"4rem", display:"flex", backgroundColor:"secondary.main", color:"white", justifyContent:"space-evenly", flexDirection:"row", alignItems:"center", maxWidth:{ lg: "100vw" }}}>
            <Box sx={{display:"flex", flexDirection:"column", gap:".7rem"}}>
                <p>
                    Rua: Dr. Flávio Zetola 372 - São José dos Pinhais | PR                    
                </p>
                <p>
                    comercial@patiomonitoramento.com    
                </p>
                <p>
                    +55 41 3029-0329 | +55 41 98814-7719
                </p>
            </Box>
            <Box>
            <p>
                    +55 41 3029-0329
                </p>
                <p>
                    comercial@patiomonitoramento.com    
                </p>
                <p>
                    Rua: Dr. Flávio Zetola 372 - São José dos Pinhais | PR                    
                </p>
            </Box>
        </Container>
    )
}