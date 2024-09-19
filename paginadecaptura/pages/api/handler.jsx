// import Cliente from '@/app/construtor';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function enviarDadosAoBanco(cliente) {
    try {
        await prisma.$connect();

        const { endereco, residentes, veiculos, feedback } = cliente;

        const novoUsuario = await prisma.cliente.create({
            data: {
                residentes: {
                    createMany: {
                        data: residentes,
                    },
                },
                veiculos: {
                    createMany: {
                        data: veiculos || [],
                    },
                },
                endereco: {
                    create: {
                        condominio: cliente.endereco.condominio,
                        apto: cliente.endereco.apto,
                    },
                },
                feedback: {
                    create: {
                        texto: feedback || '',
                    },
                },
                createdAt: new Date(),
            },
        });

        console.log('Dados enviados com sucesso:', novoUsuario);

        return novoUsuario;
    } catch (error) {
        console.error('Erro ao enviar dados ao banco:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
