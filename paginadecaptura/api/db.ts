// import { VercelPool } from "@vercel/postgres";

// class DatabaseConnection {
//     private pool: VercelPool;

//     constructor(connectionString: string | undefined) {
//         this.pool = new VercelPool({ connectionString });
//     }

//     async executeQuery(sql: string, params: any[]) {
//         try {
//             return await this.pool.query(sql, params);
//         } catch (error) {
//             console.log(this.pool);
//             console.error("Erro na consulta:", error);
//             throw new Error("Erro na consulta ao banco de dados");
//         }
//     }

//     async end() {
//         await this.pool.end();
//     }
// }

// export default DatabaseConnection;
