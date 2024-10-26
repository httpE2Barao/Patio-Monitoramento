"use client"
import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

type FaqOptionProps = {
    pergunta: string;
    resposta: string;
    Expandir: () => void;
    isFirst?: boolean;
};

function Expandir(): void {
    const FAQ = document.querySelectorAll(".FaqBtn");
    FAQ.forEach((faq) => {
        faq.addEventListener("click", () => {
            faq.classList.toggle("active");
        });
    });
}

function FaqOption(props: FaqOptionProps) {
    const [aberto, setAberto] = useState(props.isFirst);

    const handleExpandir = () => {
        setAberto(!aberto);
    };

    return (
        <Box onClick={handleExpandir} sx={{ width: "85vw", maxWidth: "1050px", margin: "auto", py: "1rem", px: "2rem", borderRadius: ".7rem", backgroundColor: "#E8E5E5", cursor: "pointer" }}>
            <span className="flex justify-between items-center">
                <Typography sx={{ fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.4rem", lg: "1.5rem" }, pb: ".2rem", fontWeight: 400 }}>
                    {props.pergunta}
                </Typography>
                <Image src={"/down.png"} className={`SetaExpandir self-start ${aberto && "rotate-180"}`} alt="Ver mais" width={50} height={50} />
            </span>
            {aberto && (
                <p className="FaqBtn py-2 font-light cursor-default sm:text-sm lg:text-lg">
                    {props.resposta}
                </p>
            )}
        </Box>
    );
}

const FAQ = () => {
    return (
        <section id="faq">
            <Container sx={{ pb: "5rem" }}>
                <Typography sx={{
                    textAlign: "center", py: "4rem", fontWeight: 500,
                    fontSize: {
                        xs: "2rem",
                        sm: "2rem",
                        md: "2.4rem",
                        lg: "2.4rem",
                        xl: "2.4rem",
                    },
                }}>
                    Dúvidas frequentes
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                    <FaqOption isFirst={true} pergunta={"Por que preciso atualizar meus dados?"} resposta={"Manter seu cadastro atualizado é essencial para melhorarmos a segurança e o controle de acesso ao condomínio, tanto para pedestres quanto para veículos. Assim, conseguimos oferecer um serviço mais eficiente e personalizado para você."} Expandir={Expandir} />
                    <FaqOption pergunta={"O que acontece se eu não atualizar meus dados?"} resposta={"A falta de atualização pode dificultar seu acesso ao condomínio e o de seus visitantes. Além disso, pode impedir o uso de alguns dos serviços automáticos oferecidos."} Expandir={Expandir} />
                    <FaqOption pergunta={"Os dados de meus familiares também precisam ser atualizados?"} resposta={"Sim, é recomendável manter os dados de todos os familiares que acessam o condomínio atualizados para garantir um controle preciso e seguro."} Expandir={Expandir} />
                    <FaqOption pergunta={"É seguro fornecer meus dados?"} resposta={"Sim, garantimos total segurança. Nosso sistema é 100% seguro e utiliza criptografia para proteger suas informações, que são usadas exclusivamente para controle de acesso ao condomínio e mantidas em sigilo absoluto."} Expandir={Expandir} />
                    <FaqOption pergunta={"Posso cadastrar mais de um veículo?"} resposta={"Sim, no formulário dimâmico você poderá informar quantos veículos possui."} Expandir={Expandir} />
                    <FaqOption pergunta={"Quando a atualização dos dados entrará em vigor?"} resposta={"Após o envio, suas novas informações serão analizadas e atualizadas no sistema em breve para garantir um acesso ainda mais eficiente."} Expandir={Expandir} />
                    <FaqOption pergunta={"O que devo fazer se mudar de apartamento?"} resposta={"Em caso de mudança de apartamento, basta atualizar seu cadastro com o novo endereço. O formulário inclui as datas de envio para garantir que todas as informações estejam sempre atualizadas."} Expandir={Expandir} />
                    <FaqOption pergunta={"Ainda tenho dúvidas, como posso falar com vocês?"} resposta={'Se precisar de mais ajuda, entre em contato clicando no botão "Contate-nos" no topo da página ou pelos nossos canais de atendimento no rodapé.'} Expandir={Expandir} />
                </Box>
            </Container>
        </section>
    );
};

export default FAQ;