import DatabaseConnection from "@/db";
import { sql } from '@vercel/postgres';

import { Schema } from "./componentes/formComponentes/schema";

export var retornoForm: boolean | undefined = undefined;

export function resetarRetorno() {
    return () => {
        retornoForm = undefined
        console.log(process.env)
    };
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

    mostrarDados() {
        console.log(this.endereco + " " + this.residentes + " " + this.veiculos + " " + this.feedback);
    }

    async enviarDados(data: Schema, dataAtual: Date) {

        const dbConnection = new DatabaseConnection(process.env.clientes_URL);

        const clienteData = {
            residentes: data.residentes,
            veiculos: data.veiculos,
            endereco: data.endereco,
            feedback: data.feedback,
            data: dataAtual.toLocaleString(),
        };

        try {
            await dbConnection.query(
                "INSERT INTO clientes (residentes, veiculos, endereco, feedback, data) VALUES ($1, $2, $3, $4, $5)",
                [clienteData.residentes, clienteData.veiculos, clienteData.endereco, clienteData.feedback, clienteData.data]
            );

            retornoForm = true;
        } catch (error) {
            retornoForm = false;
            console.error("Erro na solicitação:", error);
        } finally {
            await dbConnection.end();
        }
    }
}

export default Cliente;
