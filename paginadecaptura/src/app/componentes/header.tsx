import Image from "next/image"

export const Header = () => {
    return (
        <header id="inicio" className="py-5 px-5 md:px-20 flex content-center items-center justify-between">
            <Image src={`/logo.png`} width={100} height={100} className="max-sm:w-[50px] sm:w-[65px] lg:w-[70px]" alt="Grupo Pátio segurança e serviços" />
            <ul className="flex gap-5 md:gap-10 text-sm md:text-lg">
                <li><a href="#faq">FAQ</a></li>
                <li className="flex items-start">
                    <a href="https://www.grupopatiomonitoramento.com.br/contato" target="_blank">Contate-nos</a>
                    <img src="/seta-longa.png" alt="Ir para o portal da Pátio" />
                </li>
            </ul>
        </header>
    )
}