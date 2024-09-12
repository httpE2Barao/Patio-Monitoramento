import { Schema } from "./schema";

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
        const filePath = 'http://localhost:4000/clientes';
        const clienteData = {
            residentes: data.residentes,
            veiculos: data.veiculos,
            endereco: data.endereco,
            feedback: data.feedback,
            data: dataAtual.toISOString()
        };

        try {
            const response = await fetch(filePath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData),
            });

            if (response.ok) {
                alert('Dados do cliente enviados com sucesso.');
            } else {
                alert('Erro ao enviar dados do cliente.');
            }
        } catch (error) {
            alert('Erro ao enviar dados do cliente.');
            console.error('Erro na solicitação:', error);
        }
    }
}

export default Cliente;
