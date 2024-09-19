import Cliente from '@/app/construtor';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function enviarDadosAoBanco(cliente: Cliente) {

    try {
        await prisma.$connect();

        const novoUsuario = await prisma.Cliente.create({
            cliente
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
