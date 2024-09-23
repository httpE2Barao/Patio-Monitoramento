// import Cliente from '@/app/construtor';
// import fastify from 'fastify';

// const app = fastify();

// app.post('/clientes', async (request, reply) => {
//   try {
//     const clienteData = request.body;

//     const cliente = new Cliente(clienteData:Cliente);
//     const novoUsuario = await cliente.enviarDadosAoBanco(clienteData);
//     return reply.status(201).send(novoUsuario);
//   } catch (error) {
//     console.error('Erro ao enviar dados ao banco:', error);
//     return reply.status(500).send({ error: 'Erro interno do servidor' });
//   }
// });

// export default app;
