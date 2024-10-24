import { Box, Container, Stack } from "@mui/material";
import Image from "next/image";

const Footer = () => {
    return (
        <>
            <Container sx={{ p: "4rem", display: "flex", backgroundColor: "primary.main", color: "white", justifyContent: "space-evenly", flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" }, gap: "2rem", alignItems: "center", maxWidth: { lg: "100vw" } }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: ".7rem", textAlign: { xs: "center", sm: "center", md: "left", lg: "left" } }}>
                    <a href="https://www.google.com/maps/search/?api=1&query=Rua%20Dr.%20Fl%C3%A1vio%20Zetola%20372%20-%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais%20PR" target="_blank" rel="noopener noreferrer">
                        <p>
                            Rua: Dr. Flávio Zetola 372 - São José dos Pinhais | PR
                        </p>
                    </a>
                    <a href="mailto:comercial@patiomonitoramento.com" target="_blank" rel="noopener noreferrer">
                        <p>
                            comercial@patiomonitoramento.com
                        </p>
                    </a>
                    <p>
                        +55 41 3029-0329 | +55 41 98814-7719
                    </p>
                </Box>
                <Stack sx={{ gap: "2rem", flexDirection: "row" }}>
                    <a href="https://wa.me/5541988147719" target="_blank" rel="noopener noreferrer">
                        <Image className="invert-color" src={"/whatsapp.png"} alt="Ir para Whatsapp" width={30} height={30} />
                    </a>
                    <a href="https://www.facebook.com/Patio-Monitoramento-1163567820456146" target="_blank" rel="noopener noreferrer">
                        <Image className="invert-color" src={"/facebook.png"} alt="Ir para Facebook" width={30} height={30} />
                    </a>
                    <a href="https://www.instagram.com/grupopatioseguranca/" target="_blank" rel="noopener noreferrer">
                        <Image className="invert-color" src={"/instagram.png"} alt="Ir para Instagram" width={30} height={30} />
                    </a>
                    <a href="https://www.linkedin.com/in/patio-monitoramento-9551a7190/" target="_blank" rel="noopener noreferrer">
                        <Image className="invert-color" src={"/linkedin.png"} alt="Ir para LinkedIn" width={30} height={30} />
                    </a>
                </Stack>
            </Container>
            <p className="bg-black py-1 text-white text-center font-extralight text-xs justify-end cursor-default">
                Site desenvolvido com NextJS por <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/e2barao/">Elias Barão.</a></p>
        </>
    );
};

export default Footer;