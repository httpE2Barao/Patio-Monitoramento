import dynamic from 'next/dynamic';

const PaginaPrincipal = dynamic(() => import('./page'));

export default function PaginaServidor() {
    return <PaginaPrincipal />;
}