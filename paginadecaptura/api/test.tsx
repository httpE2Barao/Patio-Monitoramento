// import { sql } from "@vercel/postgres";

// export default async function testAPI({
//   params
// } : {
//   params: { user: string }
// }): Promise<JSX.Element> {
//   const { rows } = await sql`SELECT * from clientes`;

//   return (
//     <div>
//       {rows.map((row) => (
//         <div key={row.id}>
//           {row.id} - {row.quantity}
//         </div>
//       ))}
//     </div>
//   );
// }