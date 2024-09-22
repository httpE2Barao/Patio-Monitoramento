"use client"
import { BtnToTop } from '@/app/componentes/botaoSubir';
import FAQ from '@/app/componentes/faq';
import Footer from '@/app/componentes/footer';
import Formulario from '@/app/componentes/formulario';
import Header from '@/app/componentes/header';
import BoasVindas from '@/app/componentes/inicio';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#131946",
    },
    secondary: {
      main: "#FBF355",
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

export default function Root() {
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
