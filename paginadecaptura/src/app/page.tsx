"use client"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Header } from './componentes/header';
import { BoasVindas } from './componentes/inicio';
import { Formulario } from './componentes/formulario';
import { FAQ } from './componentes/faq';
import { BtnToTop } from './componentes/botaoSubir';
import { Footer } from './componentes/footer';

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

      <Header />

      <BoasVindas />

      <Formulario />

      <FAQ />

      <Footer />

      <BtnToTop />

    </ThemeProvider>
  );
}
