import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    // URL da API definida no .env
    const apiUrl = process.env.API_URL_LISTAR_CONDOMINIOS;

    if (!apiUrl) {
      return res.status(500).json({ error: 'API_URL_LISTAR_CONDOMINIOS não definida.' });
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Erro ao obter condomínios: ${response.statusText}` });
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao obter condomínios:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
