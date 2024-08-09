import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Image from 'next/image';

const theme = createTheme({
  palette: {
    primary: {
      main: "#FBF355",
    },
    secondary: {
      main: "#131946",
    },
  },
  typography: {
    h1: {
      fontSize: '4rem',
      '@media (min-width:600px)': {
        fontSize: '6rem',
      },
      '@media (min-width:960px)': {
        fontSize: '7rem',
      },
    },
    h2: {
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
      '@media (min-width:960px)': {
        fontSize: '4rem',
      },
    },
    h3: {
      fontSize: '3rem',
      '@media (min-width:600px)': {
        fontSize: '4rem',
      },
      '@media (min-width:960px)': {
        fontSize: '5rem',
      },
    },
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

export default function PaginaPrincipal() {
  return (
    <ThemeProvider theme={theme}>

      <header className="px-20 pt-5 flex content-center items-center justify-between">
        <Image src={`/logo.png`} width={100} height={100} alt="Grupo Pátio segurança e serviços" />
        <ul className="flex gap-10">
          <li><a href="#">FAQ</a></li>
          <li className="flex items-start"><a href="#">Contate-nos</a><img src="seta-longa.png" alt="Ir para o portal da Pátio" /></li>
        </ul>
      </header>

      <Container className="flex flex-col gap-5 w-[50rem] justify-center text-center items-center" sx={{}}>
        <Typography variant="h2" sx={{}} className="text-lg">Não vai demorar muito.</Typography>
        <Typography variant="h1" sx={{ fontWeight: "bold" }} className="text-lg">Queremos te <br /> conhecer melhor!</Typography>
        <Typography variant="h2">Atualize seus dados para que possamos estar sempre conectados e entregar o melhor serviço.</Typography>
        <Box className="flex gap-10" sx={{ mt: 5 }}>
          <Button variant="contained" color="primary" sx={{ py: 2, px: 5, color: "Black", fontWeight: "bold" }}>Responder agora!</Button>
          <Button variant="outlined" color="primary" sx={{ py: 2, px: 5, color: "GrayText", borderWidth: '2px', borderColor: 'primary.main', '&:hover': { color: "black", borderWidth: '2px' }, }} >Por que fazer isso?</Button>
        </Box>
      </Container>
      
    </ThemeProvider>
  );
}
