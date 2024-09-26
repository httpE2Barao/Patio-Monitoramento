import Cliente from "@/componentes/classeCliente";
import fastify from "fastify";

const app = fastify();

async function enviarDadosAoBanco(cliente: Cliente) {
    const clientData = {
        endereco: { create: { condominio: cliente.endereco[0].condominio, apto: cliente.endereco[0].apto } },
        residentes: cliente.residentes.map((residente) => ({
            create: {
                nome: residente.nome,
                telefone: residente.telefone,
                email: residente.email,
                tipoDocumento: residente.tipoDocumento,
                documento: residente.documento,
                parentesco: residente.parentesco || undefined, 
            },
        })),
        veiculos: cliente.veiculos?.map((veiculo) => ({
            create: {
                cor: veiculo.cor,
                modelo: veiculo.modelo,
                placa: veiculo.placa,
            },
        })),
        feedback: cliente.feedback || undefined,
    };

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
