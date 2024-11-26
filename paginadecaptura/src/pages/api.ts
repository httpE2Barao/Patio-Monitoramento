import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiRequest = async (endpoint: string, data?: any) => {
  const username = process.env.API_USERNAME;
  const password = process.env.API_PASSWORD;
  
  if (!username || !password) {
    throw new Error("Credenciais de API não definidas.");
  }
  
  const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

  return api.post(endpoint, data, {
    headers: {
      Authorization: basicAuth,
    },
  });
};