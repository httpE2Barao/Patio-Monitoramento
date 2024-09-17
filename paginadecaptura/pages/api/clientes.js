import { createPool } from "@vercel/postgres";

export default async function handler(req, res) {
    const pool = new createPool({
        connectionString: process.env.clientes_URL,
        host: '',
    });

    try {
        const data = req.body;

        const insertQuery = `INSERT INTO clientes (residentes, veiculos, endereco, feedback, data) VALUES ($1, $2, $3, $4, $5)`;
        const values = [data.residentes, data.veiculos, data.endereco, data.feedback, data.data];

        await pool.query(insertQuery, values);

        res.status(200).json({ message: "Dados do cliente enviados com sucesso!" });
    } catch (error) {
        console.error("Erro ao enviar dados:", error);
        res.status(500).json({ message: "Erro ao enviar dados do cliente." });
    } finally {
        await pool.end();
    }
}