import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

interface RequestBody {
  action: "signup" | "login" | "verificar_apto" | "novo_morador" | "listar_moradores" | "editar_morador";
  payload: Record<string, any>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  // Validar o método HTTP
  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  // Verificar se o corpo está no formato correto
  if (!body || !body.action || !body.payload) {
    return res.status(400).json({ error: "Ação ou payload ausente." });
  }

  // Mapear ações
  const actionMap: Record<RequestBody["action"], string> = {
    signup: "criar",
    login: "login",
    verificar_apto: "listar_apto",
    novo_morador: "novo",
    listar_moradores: "listar",
    editar_morador: "editar",
  };

  const endpointMap: Record<string, string> = {
    criar: "/criar_senha",
    login: "/login",
    novo: "/moradores",
    listar: "/moradores",
    listar_apto: "/apto",
    editar: "/moradores",
  };

  const acao = actionMap[body.action as RequestBody["action"]];
  const endpoint = endpointMap[acao];

  if (!acao || !endpoint) {
    return res.status(400).json({ error: "Ação ou endpoint inválido fornecido." });
  }

  const url = `${process.env.API_URL}${endpoint}`;

  try {
    const response = await axios.post(url, { acao, ...body.payload }, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Resposta da API externa:", response.data);

    if (!response.data || typeof response.data !== "object") {
      return res.status(400).json({ error: "Dados inválidos retornados pela API externa." });
    }

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error("Erro na API Proxy:", {
      message: error.message,
      response: error.response?.data,
    });

    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Erro interno no servidor.",
    });
  }
}
