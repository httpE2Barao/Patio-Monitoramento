import { BtnToTop } from '@/app/componentes/botaoSubir';
import FAQ from '@/app/componentes/faq';
import Footer from '@/app/componentes/footer';
import Formulario from '@/app/componentes/formulario';
import Header from '@/app/componentes/header';
import BoasVindas from '@/app/componentes/inicio';
import { theme } from '@/app/theme';
import { ThemeProvider } from '@mui/material/styles';

export function Root() {
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
