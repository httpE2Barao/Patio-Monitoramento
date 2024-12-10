import axios from "axios";

export async function ensureApartmentExists(condominioId: string, apto: string, bloco: string) {
    const listarUrl = `${process.env.NEXT_PUBLIC_API_URL}/apto`; 

    try {
      // Listando todos os apartamentos no condomínio
      const response = await axios.post(
        listarUrl,
        {
          acao: "listar",
          cond_id: condominioId,
          apto: "",
          bloco: ""
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_API_USERNAME}:${process.env.NEXT_PUBLIC_API_PASSWORD}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const apartamentos = response.data.apto || [];
      console.log("Apartamentos existentes:", apartamentos);
  
      // Verificar duplicidade
      const apartamentoExistente = apartamentos.find(
        (apartamento: any) =>
          apartamento.idCasaApto === apto && apartamento.bloco === (bloco || "")
      );
  
      if (apartamentoExistente) {
        console.log("Apartamento já existe. ID:", apartamentoExistente.idregistro);
        return apartamentoExistente; // Retorna o apartamento existente
      } else {
        console.log("Apartamento não encontrado. Criando um novo...");
        return await criarApartamento(condominioId, apto, bloco);
      }
    } catch (error: any) {
      console.error("Erro ao listar apartamentos:", error.response?.data || error.message);
      throw error;
    }
  }
  
  async function criarApartamento(condominioId: string, apto: string, bloco: string) {
    const aptoUrl = `${process.env.NEXT_PUBLIC_API_URL}/apto`;
  
    try {
      const response = await axios.post(
        aptoUrl,
        {
          acao: "novo",
          cond_id: condominioId,
          apto: apto,
          bloco: bloco || ""
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_API_USERNAME}:${process.env.NEXT_PUBLIC_API_PASSWORD}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log("Apartamento criado com sucesso:", response.data);
      return response.data; // Retorna os dados do apartamento criado
    } catch (error: any) {
      console.error("Erro ao criar apartamento:", error.response?.data || error.message);
      throw error;
    }
  }
  