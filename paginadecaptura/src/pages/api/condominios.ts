import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
    }

    // URL da API definida no .env
    const apiUrl = process.env.API_URL_LISTAR_CONDOMINIOS;

    if (!apiUrl) {
      return res
        .status(500)
        .json({ error: 'API_URL_LISTAR_CONDOMINIOS não definida.' });
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Adicione outros headers se necessário, ex:
        // 'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Erro ao obter condomínios: ${response.statusText}` });
    }

    // Converte a resposta para JSON
    const data = await response.json();

    // Responde para o cliente com os dados
    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao obter condomínios:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
