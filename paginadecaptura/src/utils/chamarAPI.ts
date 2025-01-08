import axios from "axios";

  // ========= Função genérica para chamadas de API ========= //
  export const chamarApi = async (action: string, payload: Record<string, any>) => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.post(
        "/api/proxy",
        { action, payload },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return data;
    } catch (error: any) {
      console.error(`Erro ao chamar API (${action}):`, error.response?.data || error.message);
      throw new Error(
        `Erro na ação ${action}: ${error.response?.data || "Erro desconhecido"}`
      );
    }
};