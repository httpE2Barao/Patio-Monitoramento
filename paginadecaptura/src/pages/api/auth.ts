import bcrypt from "bcrypt";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "sua_refresh_secreta";

// Simulação de "banco de dados" em memória
const users: { cpf: string; senha: string }[] = [
  { cpf: "12345678900", senha: bcrypt.hashSync("SenhaSegura123!", 10) },
];

// Função para criar tokens JWT
const createToken = (cpf: string, expiresIn: string, secret: string) => {
  return jwt.sign({ cpf }, secret, { expiresIn });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "POST") {
    const { cpf, senha } = req.body;

    // Verifica se o CPF já existe no "banco de dados"
    const existingUser = users.find((user) => user.cpf === cpf);

    if (existingUser) {
      // Atualiza a senha existente
      existingUser.senha = await bcrypt.hash(senha, 10);
    } else {
      // Adiciona novo usuário
      users.push({ cpf, senha: await bcrypt.hash(senha, 10) });
    }

    // Gera tokens de acesso e renovação
    const token = createToken(cpf, "1h", JWT_SECRET); // Token de acesso
    const refreshToken = createToken(cpf, "7d", REFRESH_SECRET); // Token de renovação

    // Configura os cookies
    res.setHeader("Set-Cookie", [
      `authToken=${token}; HttpOnly; Path=/; Max-Age=3600; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      }`,
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      }`,
    ]);

    return res.status(200).json({ message: "Usuário autenticado com sucesso." });
  }

  if (method === "GET") {
    // Valida se o usuário está autenticado
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

        // Usuário encontrado e token válido
        return res.status(200).json({ message: "Autenticado", user });
      } else {
        return res.status(401).json({ message: "Token inválido." });
      }
    } catch (error) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }
  }

  if (method === "PUT") {
    // Atualiza o token de acesso utilizando o token de renovação
    const cookies = cookie.parse(req.headers.cookie || "");
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Token de renovação ausente." });
    }

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

      if (typeof decoded === "object" && "cpf" in decoded) {
        const token = createToken(decoded.cpf, "1h", JWT_SECRET); // Novo token de acesso

        // Configura o novo cookie
        res.setHeader("Set-Cookie", [
          `authToken=${token}; HttpOnly; Path=/; Max-Age=3600; ${
            process.env.NODE_ENV === "production" ? "Secure;" : ""
          }`,
        ]);

        return res.status(200).json({ message: "Token atualizado com sucesso." });
      } else {
        return res.status(401).json({ message: "Token de renovação inválido." });
      }
    } catch (error) {
      return res.status(401).json({ message: "Token de renovação inválido ou expirado." });
    }
  }

  // Método não permitido
  res.setHeader("Allow", ["POST", "GET", "PUT"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
