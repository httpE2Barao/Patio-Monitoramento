import Cliente from "@/componentes/classeCliente";
import { prisma } from "../lib/prisma";

async function enviarCliente(dadosCliente: Cliente) {
    const cliente = await prisma.cliente.create({
        data: {
            endereco: {
                create: {
                    condominio: "Wolf",
                    apto: "33"
                },
            },
            residentes: {
                create: {
                    nome: "Elias Barão",
                    telefone: "41998046755",
                    email: "e2barao@hotmail.com",
                    tipoDocumento: "RG",
                    documento: "137257890",
                    parentesco: ""
                }
            },
            veiculos: {
                create: {
                    cor: "",
                    modelo: "",
                    placa: ""
                }
            },
            feedback: "alguma coisa"
        }
    }).then(async () => {
        const verClientes = await prisma.cliente.findMany();
        console.log("Cliente criado com sucesso!");
        console.log(verClientes);
        await prisma.$disconnect()
    })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
    console.log(cliente);
}

export default enviarCliente;
