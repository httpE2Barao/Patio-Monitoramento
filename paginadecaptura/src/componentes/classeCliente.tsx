import { prisma } from "../../lib/prisma";
import { schema } from "../api/schema-zod";

class Cliente {
  endereco: { condominio: string; apto: string };
  residentes: {
    nome: string;
    telefone: string;
    email: string;
    tipoDocumento: "RG" | "CPF" | "CNH";
    documento: string;
    parentesco?: string;
  }[];
  veiculos?: { cor: string; modelo: string; placa: string }[];
  feedback?: string;

  constructor(
    endereco: { condominio: string; apto: string },
    residentes: {
      nome: string;
      telefone: string;
      email: string;
      tipoDocumento: "RG" | "CPF" | "CNH";
      documento: string;
      parentesco?: string;
    }[],
    veiculos?: { cor: string; modelo: string; placa: string }[],
    feedback?: string
  ) {
    this.endereco = endereco;
    this.residentes = residentes;
    this.veiculos = veiculos;
    this.feedback = feedback;
  }

  async receberDados() {
    const dados = await prisma.cliente.findMany();
    console.log(dados);
  }

  async enviarCliente() {

    const dadosDoCliente = {
      endereco: this.endereco,
      residentes: this.residentes,
      veiculos: this.veiculos,
      feedback: this.feedback,
    };

    try {
      // Validando os dados
      const resultado = await schema.parseAsync(dadosDoCliente);
      console.log(resultado);
      
      const novoCliente = await prisma.cliente.create({
        data: { 
          endereco: { create: resultado.endereco },
          residentes: { createMany: { data: resultado.residentes } },
          veiculos: { createMany: { data: resultado.veiculos } },
          feedback: resultado.feedback,
        },
      });

      console.log('Cliente criado com sucesso:', novoCliente);
      return true;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return false;
    } 
  }
}

export default Cliente;