import dynamic from 'next/dynamic';

// Carregar o componente com renderização do lado do servidor
const PaginaPrincipal = dynamic(() => import('./page'));

export default function PaginaServidor() {
    return <PaginaPrincipal />;
}