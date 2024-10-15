interface VeiculoData {
  cor: string;
  modelo: string;
  placa: string;
}

interface ResidenteData {
  nome?: string;
  telefone: string;
  email: string;
  tipoDocumento: string;
  documento: string;
  parentesco?: string;
}

interface ClienteData {
  endereco: { condominio: string; apto: string };
  residentes: ResidenteData | ResidenteData[];
  veiculos?: VeiculoData | VeiculoData[];
  feedback?: string;
}

class Cliente {
  constructor(private data: ClienteData) {}

  async enviarCliente() {

    const formatarResidentes = (residentes: ResidenteData | ResidenteData[]) => {
      return Array.isArray(residentes) ? residentes : [residentes];
    };
    const formatarVeiculos = (veiculos: VeiculoData | VeiculoData[] | undefined): VeiculoData[] => {
      return Array.isArray(veiculos) ? veiculos : veiculos ? [veiculos] : [];
    };

    const cliente = {
      endereco: this.data.endereco,
      residentes: formatarResidentes(this.data.residentes),
      veiculos: formatarVeiculos(this.data.veiculos),
      feedback: this.data.feedback,
    };

    try {
      const response = await fetch('http://localhost:3333/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });
  
      if (!response.ok) {
        throw new Error(`Error creating client: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Cliente criado com sucesso:', data); 
    } catch (error) {
      console.error('Error creating client:', error); 
    }
  }
}

export default Cliente;