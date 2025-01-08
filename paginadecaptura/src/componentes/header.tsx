"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearSpecificLocalStorageData } from "src/utils/limparLocal";

const Header = () => {
    const router = useRouter();

    const handleLogout = () => {
      // Remove informações sensíveis do armazenamento local
      clearSpecificLocalStorageData();
  
      // Redireciona para a página de autenticação
      router.push("/auth");
    };

  return (
    <header
      id="inicio"
      className="py-5 px-5 md:px-20 flex content-center items-center justify-between"
    >
      <Image
        src={`/logo.png`}
        width={100}
        height={100}
        className="max-sm:w-[50px] sm:w-[65px] lg:w-[70px] lg:translate-x-4 lg:translate-y-4"
        alt="Grupo Pátio segurança e serviços"
      />
      <ul className="flex gap-5 md:gap-10 text-sm md:text-lg">
        <li>
          <a href="#faq" className="hover:underline">
            FAQ
          </a>
        </li>
        <li className="flex items-start">
          <a
            href="https://www.grupopatiomonitoramento.com.br/contato"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Contate-nos
          </a>
          <Image
            src="/seta-longa.png"
            width={20}
            height={20}
            alt="Ir para o portal da Pátio"
          />
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="hover:text-red-500 font-semibold"
          >
            Sair
          </button>
        </li>
      </ul>
    </header>
  );
};

export default Header;
