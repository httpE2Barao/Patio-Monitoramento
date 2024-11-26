import ThemeProviderWrapper from "../componentes/ThemeProvider";
import "./globals.css";

export const metadata = {
  title: "Grupo Pátio Monitoramento",
  description: "Página de levantamento de dados dos clientes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  );
}
