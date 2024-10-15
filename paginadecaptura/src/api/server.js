import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';

const prisma = new PrismaClient();

const app = fastify({
    __internal: {
        useUds: true,
    },
});

app.register(fastifyCors, {
    origin: 'http://localhost:3000',
});

app.get('/clientes', async () => {
    try {
        const clientes = await prisma.cliente.findMany({
            include: {
                endereco: true,
                residentes: true,
                veiculos: true,
            }
        });
        console.log(clientes);
        return { clientes, status: 200 };
    } catch (error) {
        console.error('Erro ao buscar clientes:', error.message);
        return { error: 'Erro ao buscar clientes', status: 500 };
    }
});

app.post('/clientes', async (request, reply) => {
    const { endereco, residentes, veiculos, feedback } = request.body;
    console.log('Dados recebidos:', request.body);
    if (!endereco || !residentes) {
        return reply.status(400).send({ error: 'Dados incompletos' });
    }
    try {
        const novoCliente = await prisma.cliente.create({
            data: {
                endereco: {
                    create: {
                        condominio: endereco.condominio,
                        apto: endereco.apto,
                    },
                },
                residentes: {
                    create: residentes,
                },
                veiculos: {
                    create: veiculos,
                },
                feedback: feedback,
            },
            include: {
                endereco: true,
                residentes: true,
                veiculos: true,
            },
        });
        console.log('Cliente criado com sucesso:', novoCliente);
        return reply.status(201).send(novoCliente);
    } catch (error) {
        console.error('Erro ao criar cliente:', error.message);
        return reply.status(500).send({ error: 'Erro ao criar cliente' });
    }
});

app.delete('/clientes', async (request, reply) => {
    try {
        const clientesDeletados = await prisma.cliente.deleteMany();
        return reply.status(200).send({ message: `Foram deletados ${clientesDeletados.count} clientes` });
    } catch (error) {
        console.error('Erro ao deletar clientes:', error.message);
        return reply.status(500).send({ message: 'Erro interno do servidor' });
    }
});

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});

export default app;
