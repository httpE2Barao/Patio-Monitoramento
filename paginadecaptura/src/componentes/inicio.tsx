import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

const BoasVindas = () => {
    return (
        <Container id="conteiner-inicio" className="flex flex-col m-auto gap-3 sm:gap-5 xl:justify-evenly items-center max-md:pt-5 md:mt-[6vh] lg:mt-0 xl:flex-row overflow-hidden">

            <Box className="conteiner-inicio-box lg:pb-5" sx={{
                gap: {
                    lg: "-5em",
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
                    // lg: "80vw",
                    xl: "2000px",
                },
                Height: {
                    sm: "100vh",
                    lg: "100vh",
                    xl: "90vh",
                }
            }}>
                <Typography variant="h2"
                    sx={{
                        fontSize: {
                            xs: "5vw",
                            sm: "1.6rem",
                            md: "2rem",
                            lg: "2.2rem",
                        }
                    }}>Não vai demorar muito.</Typography>

                <Typography className='cont-inicio-titulo' variant="h1"
                    sx={{
                        margin: "auto",
                        width: {
                            xs: "600px",
                            lg: "600px",
                        },
                        fontWeight: "bold",
                        fontSize: {
                            xs: "10vw",
                            sm: "4rem",
                            md: "4.2rem",
                            lg: "4.1rem",
                            xl: "4.5rem"
                        }
                    }}>Mantenha seus<br />dados atualizados!</Typography>

                <Typography variant="h2"
                    sx={{
                        margin: "auto",
                        py: "1rem",
                        maxWidth: {
                            xs: "90vw",
                            md: "700px",
                            lg: "1500px",
                        },
                        fontSize: {
                            xs: "5vw",
                            sm: "1.6rem",
                            md: "1.8rem",
                            lg: "1.8rem",
                            xl: "2rem"
                        }
                    }}>Atualize seus dados para que possamos estar sempre conectados e entregar o melhor serviço.</Typography>

                <Box className="flex gap-5 max-xl:justify-center mt-7 lg:mt-10 md:gap-10 ">
                    <Button variant="contained" color="secondary"
                        onClick={() => {
                            document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        sx={{ 
                            color: "#000000ad",
                            '&:hover': { color: "#FBF355" },
                            fontWeight: "600",
                            paddingX: {
                                sm: "1.3rem",
                            },
                            paddingY: "1rem",
                            fontSize: {
                                xs: "3.3vw",
                                sm: "1.2rem",
                                md: "1rem",
                                lg: "1rem",
                            }
                        }}>Atualizar agora!</Button>

                    <Button variant="outlined" color="secondary"
                        onClick={() => {
                            document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        sx={{
                            color: "GrayText", borderWidth: '2px', borderColor: 'secondary.main',
                            '&:hover': { color: "#000000", borderWidth: '2px' },
                            fontWeight: "600",
                            paddingX: {
                                sm: "1.3rem",
                            },
                            paddingY: "1rem",
                            fontSize: {
                                xs: "3.3vw",
                                sm: "1.2rem",
                                md: "1rem",
                                lg: "1rem",
                            }
                        }} >Por que fazer isso?</Button>
                </Box>
            </Box>

            <Image
                src="/banner-otimizado.jpg" 
                alt="Duas pessoas se cumprimentando em um ambiente profissional."
                width={600} 
                height={600} 
                quality={50} 
                priority 
            />
        </Container>
    )
}

export default BoasVindas;