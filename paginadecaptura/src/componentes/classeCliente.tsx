import { schema } from "@/api/schema-zod";

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

  async enviarCliente() {
    
    const dadosDoCliente = {
      endereco: this.endereco,
      residentes: this.residentes,
      veiculos: this.veiculos,
      feedback: this.feedback,
    };
    
    // Validando os dados
    const resultado = schema.parseAsync(dadosDoCliente);
    console.log(resultado);
    

    // try {
    //   const response = await app.inject({
    //     url: 'http://localhost:3333/clientes',
    //     body: resultado,
    //   });

    //   if (response.statusCode !== 201) {
    //     throw new Error(`Failed to create client: ${response.body}`);
    //   }

    //   console.log(response);
    // } catch (error) {
    //   console.error(error);
    //   throw error;
    // }
  }
}

export default Cliente;