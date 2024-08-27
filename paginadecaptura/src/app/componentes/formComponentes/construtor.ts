import { Schema } from "./schema";

class Cliente {
    cliente: {
        endereco: {
            condominio: string;
            apto: string;
        }[];
        residentes: {
            tipoCadastro: "Cadastrado" | "Novo cadastro";
            nome: string;
            telefone: string;
            email: string;
            tipoDocumento: "RG" | "CPF" | "CNH";
            documento: string;
            parentesco?: string;
        }[];
    }[];
    veiculos?: {
        cor: string;
        modelo: string;
        placa: string;
    }[];

    constructor(
        cliente: {
            endereco: {
                condominio: string;
                apto: string;
            }[];
            residentes: {
                tipoCadastro: "Cadastrado" | "Novo cadastro";
                nome: string;
                telefone: string;
                email: string;
                tipoDocumento: "RG" | "CPF" | "CNH";
                documento: string;
                parentesco?: string;
            }[];
        }[],
        veiculos?: {
            cor: string;
            modelo: string;
            placa: string;
        }[]
    ) {
        this.cliente = cliente;
        this.veiculos = veiculos;
    }

    mostrarDados() {
        console.log(this.cliente + " " + this.veiculos);
    }

    // Adicione outros métodos relevantes aqui, se necessário
    // Por exemplo:
    // salvarDados() {
    //     // Lógica para salvar os dados em um arquivo JSON
    // }
}

export default Cliente;
