import Cliente from "@/componentes/classeCliente";
import fastify, { FastifyBaseLogger, FastifyInstance, FastifyTypeProvider, RawServerDefault } from "fastify";
import { IncomingMessage, ServerResponse } from "http";

const app = fastify();

app.register(fastifyCors, {
    origin: '*',
});

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

function fastifyCors(instance: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProvider>, opts: { origin: string; }, done: (err?: Error | undefined) => void): void {
    throw new Error("Function not implemented.");
}

