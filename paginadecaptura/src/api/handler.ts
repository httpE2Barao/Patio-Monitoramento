import Cliente from "@/app/classeCliente";
import app from "./server.js";

async function enviarDadosAoBanco(cliente: Cliente) {
    const clientData: {
        endereco: { create: { condominio: string; apto: string } };
        residentes: { create: { nome: string; telefone: string; email: string; tipoDocumento: "RG" | "CPF" | "CNH"; documento: string; parentesco?: string } }[];
        veiculos?: { create: { cor: string; modelo: string; placa: string } }[];
        feedback?: string;
    } = {
        residentes: [],
        endereco: {
            create: {
                condominio: '',
                apto: ''
            }
        }
    };

    clientData.endereco = { create: { condominio: cliente.endereco[0].condominio, apto: cliente.endereco[0].apto } };
    clientData.residentes = cliente.residentes.map((residente) => ({ create: { nome: residente.nome, telefone: residente.telefone, email: residente.email, tipoDocumento: residente.tipoDocumento, documento: residente.documento, parentesco: residente.parentesco } }));
    clientData.veiculos = cliente.veiculos?.map((veiculo) => ({ create: { cor: veiculo.cor, modelo: veiculo.modelo, placa: veiculo.placa } }));
    clientData.feedback = cliente.feedback;

    try {
        const response = await app.inject({
            method: 'POST',
            url: '/clientes',
            body: clientData,
        });

        if (response.statusCode !== 201) {
            throw new Error(`Failed to create client: ${response.body}`);
        }

        console.log(response);
    } catch (error) {
        console.error(error);
        throw error; 
    }
}

export default enviarDadosAoBanco;