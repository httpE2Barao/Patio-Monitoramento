import { ClienteData } from 'componentes/classeCliente';
import { SerializeOptions, parse, serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

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
    const cookieHeader = req.headers.cookie!;
    const cookies = parse(cookieHeader);
    const cpf = cookies.cpf;
    const moradorId = cookies.morador_id;

    if (!cpf || !moradorId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const payload = {
      acao: 'listar_moradores',
      cond_id: process.env.COND_ID,
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

    const clientes = data.moradores.map((morador: any) => ({
      endereco: {
        condominio: morador.bloco,
        apto: morador.apto,
      },
      residentes: [
        {
          nome: morador.nome,
          telefone: morador.telefone,
          email: morador.email,
          tipoDocumento: 'CPF',
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
    const cookieHeader = req.headers.cookie || '';
    const cookies = parse(cookieHeader);
    const cpf = cookies.cpf;
    const moradorId = cookies.morador_id;

    const body = req.body;
    const data = typeof body === 'string' ? JSON.parse(body) : body;

    const { endereco, residentes, veiculos, feedback, acao, senha } = data as ClienteData & { acao: string; senha: string };

    const residentesPayload = residentes.map((residente) => ({
      nome: residente.nome,
      telefone: residente.telefone,
      email: residente.email,
      tipoDocumento: residente.tipoDocumento,
      documento: residente.documento,
      parentesco: residente.parentesco || '',
    }));

    let apiUrl = '';
    let payload: any = {};

    if (acao === 'criar') {
      apiUrl = process.env.API_URL_NOVO_MORADOR!;
      payload = {
        acao: 'novo_morador',
        cond_id: process.env.COND_ID,
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

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok || responseData.erro) {
      return res.status(response.status).json({ error: responseData.erro || 'Erro ao processar a solicitação.' });
    }

    // Armazenar informações no cookie
    const cookieOptions: SerializeOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    };

    res.setHeader('Set-Cookie', [
      serialize('cpf', cpf || data.residentes[0].documento, cookieOptions),
      serialize('morador_id', responseData.morador_id, cookieOptions),
      serialize('condominio', endereco.condominio, cookieOptions),
      serialize('senha', senha, cookieOptions),
    ]);

    // Redirecionar para a página /form
    res.writeHead(302, { Location: '/form' });
    res.end();
  } catch (error) {
    console.error('Erro ao enviar cliente:', error);
    return res.status(500).json({ error: 'Erro ao enviar cliente.' });
  }
}