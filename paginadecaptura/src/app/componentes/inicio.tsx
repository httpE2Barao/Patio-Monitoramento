import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';

export const BoasVindas = () => {
    return (
        <Container className="flex flex-col gap-3 sm:gap-5 md:justify-center text-center items-center max-md:pt-5">
            <Typography variant="h2"
                sx={{
                    fontSize: {
                        xs: "5vw",
                        sm: "1.6rem",
                        md: "2rem",
                        lg: "3rem",
                    }
                }}>Não vai demorar muito.</Typography>

            <Typography variant="h1"
                sx={{
                    fontWeight: "bold",
                    fontSize: {
                        xs: "10vw",
                        sm: "4rem",
                        md: "5rem",
                        lg: "7rem",
                    }
                }}>Queremos te <br /> conhecer melhor!</Typography>

            <Typography variant="h2"
                sx={{
                    fontSize: {
                        xs: "5vw",
                        sm: "1.6rem",
                        md: "2rem",
                        lg: "3rem",
                    }
                }}>Atualize seus dados para que possamos estar sempre conectados e entregar o melhor serviço.</Typography>

            <Image src={"/Agreement-cuate.svg"} width={700} height={700} alt='Um homem' />

            <Box className="flex gap-5 lg:mt-10 md:gap-10">
                <Button variant="contained" color="primary"
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
                            lg: "3rem",
                        }
                    }}>Atualizar agora!</Button>

                <Button variant="outlined" color="primary" sx={{
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
                        lg: "3rem",
                    }
                }} >Por que fazer isso?</Button>
            </Box>
        </Container>
    )
}