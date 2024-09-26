import fastifyFormbody from '@fastify/formbody';
import fastify from 'fastify';
import { schema } from './schema-zod';

const app = fastify();

app.register(fastifyFormbody);

app.get('/clientes', async (request, reply) => {
  try {
    const clientes = await prisma.cliente.findMany();
    console.log(clientes);
    return { clientes, status: 200 }; 
  } catch (error) {
    return await error;
  }
});

app.post('/clientes', async (request, reply) => {
  const { endereco, residentes, veiculos, feedback } = schema.parse(request.body);

  await prisma.cliente.create({
    data: {
      endereco: {
        create: {
          condominio: endereco[0].condominio,
          apto: endereco[0].apto,
        },
      },
      residentes: {
        create: {
          nome: residentes[0].nome,
          telefone: residentes[0].telefone,
          email: residentes[0].email,
          tipoDocumento: residentes[0].tipoDocumento,
          documento: residentes[0].documento,
        },
      },
      veiculos: {
        create: {
          cor: veiculos[0].cor,
          modelo: veiculos[0].modelo,
          placa: veiculos[0].placa,
        },
      },
      feedback: feedback,
    }
  })
  return reply.status(201).send('Cliente data saved successfully!')
});

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333
}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

export default app;
