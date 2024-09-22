import Cliente from '@/app/construtor';
import prisma from './prisma';

export async function enviarDadosAoBanco(cliente: Cliente) {
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
                        condominio: endereco[0].condominio,
                        apto: endereco[0].apto,
                    },
                },
                feedback: feedback || '',
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
