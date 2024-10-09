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
                createMany: {
                    data: [{
                        nome: "Elias Barão",
                        telefone: "41998046755",
                        email: "e2barao@hotmail.com",
                        tipoDocumento: "RG",
                        documento: "137257890",
                        parentesco: ""
                    },{
                        nome: "Thiago Barão",
                        telefone: "41998046755",
                        email: "e2barao@hotmail.com",
                        tipoDocumento: "RG",
                        documento: "137257890",
                        parentesco: "Conjuge"
                    }]
                },
            },
            veiculos: {
                createMany: {
                    data: [{
                    cor: "",
                    modelo: "",
                    placa: ""
                    }]
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
        .catch(async () => {
            await prisma.$disconnect()
            process.exit(1)
        })
    console.log(cliente);
}

export default enviarCliente;
