import axios from 'axios';
import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const cookieHeader = req.headers.cookie || '';
    const cookies = parse(cookieHeader);
    const cpf = cookies.cpf;
    const moradorId = cookies.morador_id;
    const condominioId = cookies.condominio_id;

    if (!cpf || !moradorId || !condominioId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    let endpoint = '/';
    let payload = body.payload;

    switch (body?.action) {
      case 'listar_moradores':
        endpoint = '/listar_moradores';
        payload = {
          ...payload,
          cond_id: condominioId,
        };
        break;
      case 'novo_morador':
        endpoint = '/moradores';
        payload = {
          ...payload,
          cond_id: condominioId,
        };
        // Antes de cadastrar o novo morador, garantir que o apartamento exista
        await ensureApartmentExists(condominioId, payload, req, res);
        break;
      case 'editar_morador':
        endpoint = '/editar_morador';
        payload = {
          ...payload,
          morador_id: moradorId,
        };
        break;
      default:
        return res.status(400).json({ error: 'Ação inválida' });
    }

    const url = `${process.env.API_URL}${endpoint}`;

    const response = await axios({
      url,
      method: 'POST',
      data: payload,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`
        ).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Erro na API Proxy:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });

    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Erro interno do servidor.',
    });
  }
}

async function ensureApartmentExists(condominioId: string, payload: any, req: NextApiRequest, res: NextApiResponse) {
  const { mor_apto, mor_bloco } = payload;

  // Se não foi fornecido apartamento, não há o que checar
  if (!mor_apto) return;

  // Primeiro, verificar se o apto já existe
  const aptoUrl = `${process.env.API_URL}/apto`;

  try {
    const listarResponse = await axios.post(
      aptoUrl,
      {
        acao: "listar",
        cond_id: condominioId
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // listarResponse.data provavelmente será um array de apartamentos.
    // Vamos verificar se o apto/bloco desejado está presente.
    const apartamentos = Array.isArray(listarResponse.data) ? listarResponse.data : [];
    const aptoExistente = apartamentos.find((apto: any) => {
      return apto.apto === mor_apto && apto.bloco === (mor_bloco || "");
    });

    if (aptoExistente) {
      // Apartamento já existe, não é necessário criar.
      return;
    } else {
      // Apartamento não encontrado, criar um novo apartamento
      await criarApartamento(condominioId, mor_apto, mor_bloco);
    }
  } catch (error: any) {
    console.error("Erro ao listar aptos:", error.response?.data || error.message);
    throw error;
  }
}

async function criarApartamento(condominioId: string, apto: string, bloco: string) {
  const aptoUrl = `${process.env.API_URL}/apto`;

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
          Authorization: `Basic ${Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // Se criado com sucesso, ótimo. Caso contrário, será pego pelo catch.
  } catch (error: any) {
    console.error("Erro ao criar novo apto:", error.response?.data || error.message);
    throw error;
  }
}
