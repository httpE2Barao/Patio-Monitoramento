import { schema } from '@/app/componentes/formComponentes/schema';
import fastifyFormbody from '@fastify/formbody';
import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';

const app = fastify();

const prisma = new PrismaClient();

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
        create: endereco,
      },
      residentes: {
        create: residentes,
      },
      veiculos: {
        create: veiculos,
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