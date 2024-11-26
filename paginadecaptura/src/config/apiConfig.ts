import axios from "axios";

export const createApiClient = (authHeader: string) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
  });

export const getBasicAuthHeader = () => {
  const username = process.env.NEXT_PUBLIC_API_USERNAME;
  const password = process.env.NEXT_PUBLIC_API_PASSWORD;

  if (!username || !password) {
    throw new Error("Credenciais de API não definidas.");
  }

  const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  return basicAuth;
};
