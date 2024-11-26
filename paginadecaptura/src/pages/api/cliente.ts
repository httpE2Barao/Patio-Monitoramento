import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { ClienteData } from '../../componentes/classeCliente';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract the cookies
    const cookieHeader = req.headers.cookie || '';
    const cookies = parse(cookieHeader);
    const cpf = cookies.cpf;
    const moradorId = cookies.morador_id;
    const condominioId = cookies.condominio_id;

    if (!cpf || !moradorId || !condominioId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    // Prepare the payload to list residents
    const payload = {
      acao: 'listar_moradores',
      cond_id: condominioId,
    };

    const response = await fetch(process.env.API_URL_LISTAR_MORADORES!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.erro) {
      return res.status(response.status).json({ error: data.erro || 'Erro ao obter clientes.' });
    }

    // Map the data to your ClienteData interface
    const clientes: ClienteData[] = data.moradores.map((morador: any) => ({
      endereco: {
        condominio: morador.bloco,
        apto: morador.apto,
      },
      residentes: [
        {
          nome: morador.nome,
          telefone: morador.telefone,
          email: morador.email,
          tipoDocumento: 'CPF', // Assuming the document type is CPF
          documento: morador.cpf,
          parentesco: 'Titular',
        },
      ],
      veiculos: morador.veiculos || [],
      feedback: morador.feedback || '',
    }));

    return res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao obter clientes:', error);
    return res.status(500).json({ error: 'Erro ao obter clientes.' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
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

    // Parse e validação do corpo da requisição
    const body = req.body;
    const data = typeof body === 'string' ? JSON.parse(body) : body;

    const { endereco, residentes, veiculos, feedback, acao } = data as ClienteData & { acao: string };

    let apiUrl = '';
    let payload: any = {};

    // Preparar o array de residentes para o payload
    const residentesPayload = residentes.map((residente) => ({
      nome: residente.nome,
      telefone: residente.telefone,
      email: residente.email,
      tipoDocumento: residente.tipoDocumento,
      documento: residente.documento,
      parentesco: residente.parentesco || '',
    }));

    if (acao === 'criar') {
      apiUrl = process.env.API_URL_NOVO_MORADOR!;
      payload = {
        acao: 'novo_morador',
        cond_id: condominioId,
        residentes: residentesPayload,
        apto: endereco.apto,
        bloco: endereco.condominio,
        veiculos: veiculos || [],
        feedback: feedback || '',
      };
    } else if (acao === 'atualizar') {
      apiUrl = process.env.API_URL_EDITAR_MORADOR!;
      payload = {
        acao: 'editar_morador',
        morador_id: moradorId,
        residentes: residentesPayload,
        novo_apto: endereco.apto,
        novo_bloco: endereco.condominio,
        veiculos: veiculos || [],
        feedback: feedback || '',
      };
    } else {
      return res.status(400).json({ error: 'Ação inválida.' });
    }

    // Enviar a requisição para a API externa
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok || responseData.erro) {
      return res
        .status(response.status)
        .json({ error: responseData.erro || 'Erro ao processar a solicitação.' });
    }

    // Sucesso
    return res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error('Erro ao enviar cliente:', error);
    return res.status(500).json({ error: 'Erro ao enviar cliente.' });
  }
}