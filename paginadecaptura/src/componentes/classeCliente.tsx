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
    }[]
  ) {
    this.endereco = endereco;
    this.residentes = residentes;
    this.veiculos = veiculos;
    this.feedback = feedback;
  }
}

export default Cliente;