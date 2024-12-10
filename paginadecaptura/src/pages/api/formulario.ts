import axios from 'axios';
import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  try {
    // Parse cookies
    const cookies = parse(req.headers.cookie || '');
    const { cpf, morador_id: moradorId, condominio_id: condominioId } = cookies;

    if (!cpf || !condominioId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    // Determine payload and action
    const { action, payload } = body;

    if (!action || !payload) {
      return res.status(400).json({ error: 'Ação ou payload ausente.' });
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/${action === 'novo_apto' ? 'apto' : 'moradores'}`;

    const dataToSend = {
      acao: action,
      ...payload,
    };

    // Check if an apartment needs to be ensured for "novo_morador"
    if (action === 'novo_morador') {
      await ensureApartmentExists(condominioId, dataToSend);
    }

    const response = await axios.post(url, dataToSend, {
      headers: getApiHeaders(),
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Erro na API Proxy:', {
      message: error.message,
      response: error.response?.data,
    });

    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Erro interno do servidor.',
    });
  }
}

async function ensureApartmentExists(condominioId: string, payload: any) {
  const { mor_apto, mor_bloco } = payload;

  if (!mor_apto) return;

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/moradores`,
      {
        acao: 'listar',
        cond_id: condominioId,
        mor_apto,
        mor_bloco: mor_bloco || '',
      },
      { headers: getApiHeaders() }
    );

    // If the apartment doesn't exist, create it
    if (Array.isArray(response.data) && response.data.length === 0) {
      await criarApartamento(condominioId, mor_apto, mor_bloco);
    }
  } catch (error: any) {
    console.error('Erro ao verificar existência do apartamento:', error.response?.data || error.message);
    await criarApartamento(condominioId, mor_apto, mor_bloco);
  }
}

async function criarApartamento(condominioId: string, apto: string, bloco: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/apto`,
      {
        acao: 'novo',
        cond_id: condominioId,
        apto,
        bloco: bloco || '',
      },
      { headers: getApiHeaders() }
    );

    console.log('Apartamento criado com sucesso:', response.data);
  } catch (error: any) {
    console.error('Erro ao criar apartamento:', error.response?.data || error.message);
    throw error;
  }
}

function getApiHeaders() {
  return {
    Authorization: `Basic ${Buffer.from(
      `${process.env.NEXT_PUBLIC_API_USERNAME}:${process.env.NEXT_PUBLIC_API_PASSWORD}`
    ).toString('base64')}`,
    'Content-Type': 'application/json',
  };
}