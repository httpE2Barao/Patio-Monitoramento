import dynamic from 'next/dynamic';

// Carregar o componente client-side dinamicamente
const PaginaPrincipal = dynamic(() => import('./page'), {
  ssr: false, // Desativar renderização do lado do servidor para este componente
});

export default async function PaginaServidor() {
  return <PaginaPrincipal />;
}
