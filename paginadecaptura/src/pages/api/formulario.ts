import axios from 'axios';
import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  // Apenas permitir requisições POST
  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    // Extrair os cookies
    const cookieHeader = req.headers.cookie || '';
    const cookies = parse(cookieHeader);
    const cpf = cookies.cpf;
    const moradorId = cookies.morador_id;
    const condominioId = cookies.condominio_id;

    if (!cpf || !moradorId || !condominioId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    // Definir o endpoint baseado na ação fornecida no corpo da requisição
    let endpoint = '/';
    switch (body?.action) {
      case 'listar_moradores':
        endpoint = '/listar_moradores';
        break;
      case 'novo_morador':
        endpoint = '/moradores';
        break;
      case 'editar_morador':
        endpoint = '/editar_morador';
        break;
      default:
        return res.status(400).json({ error: 'Ação inválida' });
    }

    const url = `${process.env.API_URL}${endpoint}`;

    // Preparar o payload e incluir IDs necessários
    let payload = body.payload;
    if (body.action === 'listar_moradores') {
      payload = {
        ...payload,
        cond_id: condominioId,
      };
    } else if (body.action === 'novo_morador') {
      payload = {
        ...payload,
        cond_id: condominioId,
      };
    } else if (body.action === 'editar_morador') {
      payload = {
        ...payload,
        morador_id: moradorId,
      };
    }

    // Enviar a requisição para a API externa
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

    res.status(response.status).json(response.data);
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
