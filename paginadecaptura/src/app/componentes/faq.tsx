import { Box, Container, Typography } from "@mui/material";
import { useState } from "react";
import Image from "next/image";

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
        <Box sx={{ width: "85vw", maxWidth: "1000px", margin: "auto", py: "1rem", px: "2rem", borderRadius: ".7rem", backgroundColor: "#E8E5E5" }}>
            <span className="flex justify-between items-center cursor-pointer" onClick={handleExpandir}>
                <Typography sx={{ fontSize: { xs: "1.2rem", sm: "1.2rem", md: "1.4rem", lg: "1.5rem" }, pb: ".2rem", fontWeight: 400 }}>
                    {props.pergunta}
                </Typography>
                <Image src={"/down.png"} className={`SetaExpandir self-start ${aberto && "rotate-180"}`} alt="Ver mais" width={50} height={50} />
            </span>
            {aberto && (
                <p className="FaqBtn py-2 font-light">
                    {props.resposta}
                </p>
            )}
        </Box>
    );
}

export const FAQ = () => {
    return (
        <section id="faq">
            <Container sx={{ pb: "5rem" }}>
                <Typography sx={{
                    textAlign: "center", py: "4rem", fontWeight: 500,
                    fontSize: {
                        xs: "1.2rem",
                        sm: "2rem",
                        md: "2.4rem",
                        lg: "2.4rem",
                        xl: "2.4rem",
                    },
                }}>
                    Dúvidas frequentes
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                    <FaqOption isFirst={true} pergunta={"Por que preciso atualizar meus dados?"} resposta={"Para garantir a segurança de todos os moradores, é fundamental que a empresa disponha dos dados mais recentes de cada residente. A atualização dos dados permitirá um controle mais preciso do acesso ao condomínio, tanto para pedestres quanto para veículos."} Expandir={Expandir} />
                    <FaqOption pergunta={"O que acontece se eu não atualizar meus dados?"} resposta={"Se você não atualizar seus dados, poderá enfrentar dificuldades no acesso ao condomínio e na utilização de serviços de automação oferecidos."} Expandir={Expandir} />
                    <FaqOption pergunta={"Posso atualizar os dados de outros moradores?"} resposta={"Não, cada morador deve atualizar seus próprios dados para garantir a precisão e segurança das informações."} Expandir={Expandir} />
                    <FaqOption pergunta={"É seguro fornecer meus dados?"} resposta={"Sim, a segurança dos seus dados é uma prioridade. As informações coletadas serão utilizadas exclusivamente para fins de controle de acesso ao condomínio e serão armazenadas de forma confidencial."} Expandir={Expandir} />
                    <FaqOption pergunta={"E se eu tiver mais de um veículo?"} resposta={"Sim, você poderá informar a quantidade de veículos que possui no formulário de atualização."} Expandir={Expandir} />
                    <FaqOption pergunta={"Quando a atualização dos dados entrará em vigor?"} resposta={"Após a atualização dos dados, a empresa de segurança realizará a devida atualização do sistema e as novas informações estarão disponíveis em breve."} Expandir={Expandir} />
                    <FaqOption pergunta={"E se eu tiver alguma dúvida?"} resposta={'Em caso de dúvidas, entre em contato conosco ao clicar no botão "Contate-nos" no topo da página ou pelo nossos canais de atendimento dispostos no rodapé abaixo.'} Expandir={Expandir} />
                </Box>
            </Container>
        </section>
    );
};
