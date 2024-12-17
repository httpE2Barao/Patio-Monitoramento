import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

interface RequestBody {
  action:
    | "signup"
    | "login"
    | "verificar_apto"
    | "criar_apartamento"
    | "novo_morador"
    | "listar_moradores"
    | "editar_morador";
  payload: Record<string, any>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  // Validar o método HTTP
  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Método ${method} não permitido.` });
  }

  // Verificar se o corpo está no formato correto
  if (!body || typeof body.action !== "string" || !body.payload || typeof body.payload !== "object") {
    return res.status(400).json({ error: "Ação ou payload inválido." });
  }

  // Mapear ações e endpoints
  const actionMap: Record<RequestBody["action"], string> = {
    signup: "criar",
    login: "login",
    verificar_apto: "apartamento",
    criar_apartamento: "apartamento",
    novo_morador: "moradores",
    listar_moradores: "moradores",
    editar_morador: "moradores",
  };

  const endpointMap: Record<string, string> = {
    criar: "/criar_senha",
    login: "/login",
    moradores: "/moradores",
    apartamento: "/apto",
  };

  const action = body.action as keyof typeof actionMap;
  const acao = actionMap[action];
  const endpoint = endpointMap[acao];

  if (!acao || !endpoint) {
    return res.status(400).json({ error: "Ação ou endpoint inválido fornecido." });
  }

  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return res.status(500).json({ error: "URL da API não configurada no ambiente." });
  }

  const url = `${apiUrl}${endpoint}`;

  try {
    const response = await axios.post(
      url,
      { acao, ...body.payload },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Resposta da API externa:", response.data);

    if (!response.data || typeof response.data !== "object") {
      return res.status(500).json({ error: "Dados inválidos retornados pela API externa." });
    }

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error("Erro na API Proxy:", {
      message: error.message,
      statusCode: error.response?.status,
      data: error.response?.data,
    });

    return res.status(error.response?.status || 500).json({
      error: error.response?.data || "Erro interno no servidor.",
    });
  }
}
