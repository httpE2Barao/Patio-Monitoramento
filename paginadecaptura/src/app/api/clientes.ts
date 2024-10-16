import { PrismaClient } from '@prisma/client';
import { ClienteData } from 'componentes/classeCliente';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';

const prisma = new PrismaClient();
const app = fastify();

app.register(fastifyCors, {
  origin: ['http://127.0.0.1:3000', 'https://www.patiomonitoramento.com', 'https://app-grupo-patio-web.onrender.com'],
});

// app.get('/api/clientes', async (request, reply) => {
//   try {
//     const clientes = await prisma.cliente.findMany({
//       include: {
//         endereco: true,
//         residentes: true,
//         veiculos: true,
//       },
//     });
//     reply.send({ clientes, status: 200 });
//   } catch (error: any) {
//     console.error('Erro ao buscar clientes:', error.message);
//     reply.send({ error: 'Erro ao buscar clientes', status: 500 });
//   }
// });

app.post('/api/clientes', async (request, reply) => {
  const { endereco, residentes, veiculos, feedback } = request.body as ClienteData;
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
        feedback: feedback || '',
      },
      include: {
        endereco: true,
        residentes: true,
        veiculos: true,
      },
    });
    console.log('Cliente criado com sucesso:', novoCliente);
    reply.status(201).send(novoCliente);
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error.message);
    reply.status(500).send({ error: 'Erro ao criar cliente' });
  }
});

app.delete('/api/clientes', async (request, reply) => {
  try {
    const clientesDeletados = await prisma.cliente.deleteMany();
    reply.status(200).send({ message: `Foram deletados ${clientesDeletados.count} clientes` });
  } catch (error: any) {
    console.error('Erro ao deletar clientes:', error.message);
    reply.status(500).send({ message: 'Erro interno do servidor' });
  }
});

app.listen({ host: '0.0.0.0', port: Number(process.env.SERVER_PORT) || 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

export default app;
