import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta";

const users: { cpf: string; senha: string }[] = [
  { cpf: "12345678900", senha: "SenhaSegura123!" },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "POST") {
    const { cpf, senha } = req.body;

    const existingUser = users.find((user) => user.cpf === cpf);

    if (existingUser) {
      existingUser.senha = senha; // Atualizar senha se o usuário já existir
    } else {
      users.push({ cpf, senha }); // Adicionar novo usuário
    }

    return res.status(200).json({ message: "Senha armazenada com sucesso." });
  }

  if (method === "GET") {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (typeof decoded === "object" && "cpf" in decoded) {
        const user = users.find((user) => user.cpf === decoded.cpf);

        if (!user) {
          return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.status(200).json({ message: "Autenticado", user });
      } else {
        return res.status(401).json({ message: "Token inválido." });
      }
    } catch (error) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }
  }

  res.setHeader("Allow", ["POST", "GET"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
