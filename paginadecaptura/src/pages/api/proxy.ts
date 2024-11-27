import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  // Defina o endpoint baseado no corpo da requisição
  let endpoint = "/"; // Padrão
  if (body?.action === "signup") {
    endpoint = "/criar_senha";
  } else if (body?.action === "login") {
    endpoint = "/login";
  }

  const url = `${process.env.API_URL}${endpoint}`;

  try {
    const response = await axios({
      url,
      method,
      data: body,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`
        ).toString("base64")}`,
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
