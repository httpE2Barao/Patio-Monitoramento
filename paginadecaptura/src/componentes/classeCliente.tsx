export interface VeiculoData {
  cor: string;
  modelo: string;
  placa: string;
}

export interface ResidenteData {
  nome: string;
  telefone: Array<string>;
  email: string;
  tipoDocumento: string;
  documento: string;
  parentesco?: string;
}

export interface EnderecoData {
  condominio: string;
  apto: string;
}

export interface ClienteData {
  endereco: EnderecoData;
  residentes: ResidenteData[];
  veiculos?: VeiculoData[];
  feedback?: string;
}

class Cliente {
  constructor(private data: ClienteData) {}

  private async obterClientes(): Promise<ClienteData[]> {
    try {
      const response = await fetch('/api/cliente', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', 
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter clientes: ${response.status} ${response.statusText}`);
      }

      const clientes: ClienteData[] = await response.json();
      return clientes;
    } catch (error) {
      console.error('Erro ao obter clientes:', error);
      throw error;
    }
  }

  async enviarCliente(): Promise<void> {
    const residentesArray = Array.isArray(this.data.residentes)
      ? this.data.residentes
      : [this.data.residentes];

    const veiculosArray = Array.isArray(this.data.veiculos)
      ? this.data.veiculos
      : this.data.veiculos
      ? [this.data.veiculos]
      : [];

    const cliente: ClienteData = {
      endereco: this.data.endereco,
      residentes: residentesArray,
      veiculos: veiculosArray.length > 0 ? veiculosArray : undefined,
      feedback: this.data.feedback || undefined,
    };

    try {
      const clientesExistentes = await this.obterClientes();

      const clienteExiste = clientesExistentes.some((clienteExistente) => {
        const residenteExistente = clienteExistente.residentes[0];
        const residenteAtual = residentesArray[0];

        return (
          residenteExistente.tipoDocumento === residenteAtual.tipoDocumento &&
          residenteExistente.documento === residenteAtual.documento
        );
      });

      const dadosEnviar = {
        ...cliente,
        acao: clienteExiste ? 'atualizar' : 'criar',
      };

      const response = await fetch('/api/cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosEnviar),
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar cliente: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Cliente enviado com sucesso:', data);
    } catch (error) {
      console.error('Erro ao enviar cliente:', error);
      throw error;
    }
  }

  // Método para testar a conexão e obter clientes
  async testarConexao(): Promise<void> {
    try {
      const clientes = await this.obterClientes();
      console.log('Clientes obtidos com sucesso:', clientes);
    } catch (error) {
      console.error('Falha ao testar a conexão:', error);
    }
  }
}

export default Cliente;