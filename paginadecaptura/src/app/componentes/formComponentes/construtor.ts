import { Schema } from "./schema";

class Cliente {
    endereco: {
        condominio: string;
        apto: string;
    }[];
    residentes: {
        // tipoCadastro: "Cadastrado" | "Novo cadastro";
        nome: string;
        telefone: string;
        email: string;
        tipoDocumento: "RG" | "CPF" | "CNH";
        documento: string;
        parentesco?: string;
    }[];
    veiculos?: {
        cor: string;
        modelo: string;
        placa: string;
    }[];
    feedback?: string;

    constructor(
        endereco: {
            condominio: string;
            apto: string;
        }[],
        residentes: {
            // tipoCadastro: "Cadastrado" | "Novo cadastro";
            nome: string;
            telefone: string;
            email: string;
            tipoDocumento: "RG" | "CPF" | "CNH";
            documento: string;
            parentesco?: string;
        }[],
        veiculos?: {
            cor: string;
            modelo: string;
            placa: string;
        }[],
        feedback?: string

    ) {
        this.endereco = endereco;
        this.residentes = residentes;
        this.veiculos = veiculos;
        this.feedback = feedback;
    }

    mostrarDados() {
        console.log(this.endereco + " " + this.residentes + " " + this.veiculos + " " + this.feedback);
    }

    // Adicione outros métodos relevantes aqui, se necessário
    // Por exemplo:
    // salvarDados() {
    //     // Lógica para salvar os dados em um arquivo JSON
    // }
}

export default Cliente;
