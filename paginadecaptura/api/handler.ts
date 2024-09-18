// import { db, QueryResultRow } from '@vercel/postgres';

// export default async function handler(request: any, response: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: unknown; clientes?: QueryResultRow[]; }): any; new(): any; }; }; }) {
//     const client = await db.connect();

//     try {
//         await client.sql`CREATE TABLE IF NOT EXISTS Clientes ( Nome varchar(255), Endereço varchar(255) );`;
//         await client.sql`INSERT INTO Clientes (Endereço, Residentes, Veículos, Data) VALUES (${});`;
//     } catch (error) {
//         return response.status(500).json({ error });
//     }

//     const clientes = await client.sql`SELECT * FROM Clientes;`;
//     console.log(clientes.rows);
//     return response.status(200).json({ clientes: clientes.rows });
// }