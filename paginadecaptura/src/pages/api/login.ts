import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { cpf, senha } = req.body;

    // Simule uma lógica de autenticação
    if (cpf === "12345678900" && senha === "senha123") {
      res.status(200).json({ resposta: "ok", token: "fake-token" });
    } else {
      res.status(401).json({ resposta: "Credenciais inválidas" });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
