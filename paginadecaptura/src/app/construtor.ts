import { Schema } from "./componentes/formComponentes/schema";
import { enviarDadosAoBanco } from "../../pages/api/handler";

export var retornoForm: boolean | undefined = undefined;

export function resetarRetorno() {
    retornoForm = undefined;
}

class Cliente {
    endereco: {
        condominio: string;
        apto: string;
    }[];
    residentes: {
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

    mostrarDados = () => {
        console.log(
            `Endereço: ${JSON.stringify(this.endereco)}, Residentes: ${JSON.stringify(
                this.residentes
            )}, Veículos: ${JSON.stringify(this.veiculos)}, Feedback: ${this.feedback}`
        );
    }

    async function (data: Schema) {
        const dadosCliente = new Cliente(data.endereco, data.residentes, data.veiculos, data.feedback);
        enviarDadosAoBanco(dadosCliente);
    }

}

export default Cliente;
