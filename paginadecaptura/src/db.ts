import { VercelPool } from "@vercel/postgres";

class DatabaseConnection {
    private pool: VercelPool;

    constructor(connectionString: string) {
        this.pool = new VercelPool({ connectionString });
    }

    async query(sql: string, params: any[]) {
        try {
            return await this.pool.query(sql, params);
        } catch (error) {
            console.error("Erro na consulta:", error);
            throw error;
        }
    }

    async end() {
        await this.pool.end();
    }
}

export default DatabaseConnection;
