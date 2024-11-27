import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  // Definir o endpoint baseado na ação fornecida no corpo da requisição
  let endpoint = "/";
  switch (body?.action) {
    case "signup":
      endpoint = "/criar_senha";
      break;
    case "login":
      endpoint = "/login";
      break;
    case "verificar_apto":
      endpoint = "/apto";
      break;
    case "novo_morador":
      endpoint = "/moradores";
      break;
    default:
      return res.status(400).json({ error: "Ação inválida" });
  }

  const url = `${process.env.API_URL}${endpoint}`;

  try {
    const response = await axios({
      url,
      method: "POST",
      data: body.payload, // Para garantir que apenas o payload seja enviado
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error("Erro na API Proxy:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });

    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal Server Error",
    });
  }
}
