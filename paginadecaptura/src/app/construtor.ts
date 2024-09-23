import fastify from "fastify";

export var retornoForm: boolean | undefined = undefined;

export function resetarRetorno() {
    retornoForm = undefined;
}

const app = fastify();

class Cliente {
    endereco: {
        condominio: string;
        apto: string;
    }[];
    residentes: {
        nome: string;
        telefone: string;
        email: string;
        tipoDocumento: "RG" | "CPF" | "CNH";
        documento: string;
        parentesco?: string;
    }[];
    veiculos?: {
        cor: string;
        modelo: string;
        placa: string;
    }[];
    feedback?: string;

    constructor(
        endereco: {
            condominio: string;
            apto: string;
        }[],
        residentes: {
            nome: string;
            telefone: string;
            email: string;
            tipoDocumento: "RG" | "CPF" | "CNH";
            documento: string;
            parentesco?: string;
        }[],
        feedback?: string,
        veiculos?: {
            cor: string;
            modelo: string;
            placa: string;
        }[],
    ) {
        this.endereco = endereco;
        this.residentes = residentes;
        this.veiculos = veiculos;
        this.feedback = feedback;
    }

    mostrarDados = () => {
        console.log(
            `Endereço: ${JSON.stringify(this.endereco)}, Residentes: ${JSON.stringify(
                this.residentes
            )}, Veículos: ${JSON.stringify(this.veiculos)}, Feedback: ${this.feedback}`
        );
        app.get('/clientes', async () => {
            const clientes = await prisma.cliente.findMany()
            return clientes
        })
    }

    async enviarDadosAoBanco() {
        try {
            await prisma.$connect();

            const { endereco, residentes, veiculos, feedback } = this;

            await prisma.cliente.create({
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

            console.log('Dados enviados com sucesso!');
            alert('Dados enviados com sucesso!');
            retornoForm = true;
        } catch (error) {
            console.error('Erro ao enviar dados ao banco:', error);
            alert('Erro ao enviar dados ao banco.');
            retornoForm = false;
            throw error;
        } finally {
            await prisma.$disconnect();
        }
    }
}

export default Cliente;
