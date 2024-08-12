import { Container, Typography } from "@mui/material"

export const FAQ = () => {
    return (
        <section id="faq">
            <Container sx={{ height: "100vh" }}>
                <Typography sx={{ fontSize: "2.4rem", textAlign: "center", py: "4rem", fontWeight: 400, }}>
                    Dúvidas frequentes
                </Typography>
            </Container>
        </section>
    )
}