import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';

export const BoasVindas = () => {
    return (
        <Container className="flex flex-col m-auto gap-3 sm:gap-5 justify-center items-center max-md:pt-5 xl:flex-row ">
            <Box className="no-scrollbar" sx={{
                gap: {
                    lg: "5em",
                    xl: "7em",
                },
                textAlign: {
                    xs: "center",
                    sm: "center",
                    md: "center",
                    lg: "left",
                    xl: "left",
                },
                maxWidth: {
                    xs: "70em",
                    sm: "70em",
                    lg: "80vw",
                    xl: "1600px",
                },
                Height: {
                    sm: "100vh",
                    lg: "100vh",
                    xl: "1600px",
                }
            }}>
                <Typography variant="h2"
                    sx={{
                        fontSize: {
                            xs: "5vw",
                            sm: "1.6rem",
                            md: "2rem",
                            lg: "2rem",
                        }
                    }}>Não vai demorar muito.</Typography>

                <Typography variant="h1"
                    sx={{
                        margin: "auto",
                        width: {
                            xs: "600px",
                            lg: "530px",
                        },
                        fontWeight: "bold",
                        fontSize: {
                            xs: "10vw",
                            sm: "4rem",
                            md: "4rem",
                            lg: "4rem",
                        }
                    }}>Queremos te <br /> conhecer melhor!</Typography>

                <Typography variant="h2"
                    sx={{
                        margin: "auto",
                        py: "1rem",
                        maxWidth: {
                            xs: "90vw",
                            md: "700px",
                        },
                        fontSize: {
                            xs: "5vw",
                            sm: "1.6rem",
                            md: "1.8rem",
                            lg: "1.8rem",
                        }
                    }}>Atualize seus dados para que possamos estar sempre conectados e entregar o melhor serviço.</Typography>

                <Box className="flex gap-5 max-xl:justify-center mt-7 lg:mt-10 md:gap-10 ">
                    <Button variant="contained" color="primary"
                        onClick={() => {
                            document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        sx={{
                            color: "Black",
                            paddingX: {
                                sm: "1.3rem",
                            },
                            paddingY: "1rem",
                            fontSize: {
                                xs: "2.8vw",
                                sm: "1.2rem",
                                md: "1rem",
                                lg: "1rem",
                            }
                        }}>Atualizar agora!</Button>

                    <Button variant="outlined" color="primary"
                        onClick={() => {
                            document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        sx={{
                            color: "GrayText", borderWidth: '2px', borderColor: 'primary.main',
                            '&:hover': { color: "black", borderWidth: '2px' },
                            paddingX: {
                                sm: "1.3rem",
                            },
                            paddingY: "1rem",
                            fontSize: {
                                xs: "2.8vw",
                                sm: "1.2rem",
                                md: "1rem",
                                lg: "1rem",
                            }
                        }} >Por que fazer isso?</Button>
                </Box>
            </Box>

            <Image src={"/Agreement-cuate.svg"} className='' width={600} height={600} alt='Duas pessoas se comprimentando em um ambiente profissional.' />

        </Container>
    )
}