import fastify from 'fastify';

const app = fastify();

app.get('/clientes', async () => {
    const clientes = await prisma.cliente.findMany()
    console.log(clientes)
    return clientes
})

app.post('/clientes', async (request, reply) => {
  try {
    const clienteData = request.body;
    return reply.status(201).send(clienteData);
  } catch (error) {
    console.error('Erro ao enviar dados ao banco:', error);
    return reply.status(500).send({ error: 'Erro interno do servidor' });
  }
});

app.listen({ host: '0.0.0.0', port: process.env.PORT ? Number(process.env.PORT) : 3333 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});

export default app;