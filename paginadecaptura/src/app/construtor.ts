import { db } from "@vercel/postgres";
// import DatabaseConnection from "../../api/db";
import { Schema } from "./componentes/formComponentes/schema";

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

    mostrarDados() {
        console.log(this.endereco + " " + this.residentes + " " + this.veiculos + " " + this.feedback);
    }

    async enviarDados(data: Schema, dataAtual: Date) {
        const dbConnection = await db.connect();
        console.log("Conectando ao Banco de dados: " + dbConnection);

        const clienteData = {
            residentes: JSON.stringify(data.residentes),
            veiculos: JSON.stringify(data.veiculos),
            endereco: JSON.stringify(data.endereco),
            feedback: data.feedback,
            data: dataAtual.toLocaleString(),
        };

        try {
            await dbConnection.sql`
                INSERT INTO clientes (residentes, veiculos, endereco, feedback, data)
                VALUES (${clienteData.residentes}, ${clienteData.veiculos}, ${clienteData.endereco}, ${clienteData.feedback}, ${clienteData.data})
            `;

            retornoForm = true;
        } catch (error) {
            retornoForm = false;
            console.error("Erro na solicitação:", error);
            // return console.status(500).json({ error });
        }

        const clientes = await dbConnection.sql`SELECT * FROM clientes;`;
        console.log(clientes.rows);
        // return response.status(200).json({ clientes: clientes.rows });
    }

}

export default Cliente;
