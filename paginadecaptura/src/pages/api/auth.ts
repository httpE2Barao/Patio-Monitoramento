import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta";

// Simulando um "banco de dados" em memória
const users: { cpf: string; senha: string }[] = [
  { cpf: "12345678900", senha: "SenhaSegura123!" },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "POST") {
    const { cpf, senha } = req.body;

    // Verifica se já existe um usuário com esse CPF
    const existingUserIndex = users.findIndex((user) => user.cpf === cpf);

    if (existingUserIndex !== -1) {
      // Se existir, atualiza a senha
      users[existingUserIndex].senha = senha;
    } else {
      // Se não existir, adiciona um novo registro
      users.push({ cpf, senha });
    }

    // === Gera Token JWT ===
    // Conteúdo do token: { cpf }
    // Configura a expiração em 1h, por exemplo
    const token = jwt.sign({ cpf }, JWT_SECRET, { expiresIn: "1h" });

    // === Configura o cookie HttpOnly com o token ===
    // path: '/' torna-o disponível em toda a aplicação
    // secure: true em produção => cookie só enviado por HTTPS
    // httpOnly: true => impede acesso via JavaScript (mais seguro)
    res.setHeader("Set-Cookie", cookie.serialize("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600, // 1 hora em segundos
    }));

    return res.status(200).json({ message: "Senha armazenada com sucesso." });
  }

  if (method === "GET") {
    // Rota para validar se o usuário está autenticado
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (typeof decoded === "object" && "cpf" in decoded) {
        const user = users.find((u) => u.cpf === decoded.cpf);
        if (!user) {
          return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Usuário encontrado e token é válido
        return res.status(200).json({ message: "Autenticado", user });
      } else {
        return res.status(401).json({ message: "Token inválido." });
      }
    } catch (error) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }
  }

  // Se chegou aqui, método não permitido
  res.setHeader("Allow", ["POST", "GET"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
