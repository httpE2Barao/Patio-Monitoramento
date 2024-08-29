import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body } = req;

    if (method === 'POST') {
        const clienteData = JSON.stringify(body);

        fetch('/clientes.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: clienteData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Resposta do servidor:', data);
            })
            .catch(error => {
                console.error('Erro ao enviar dados:', error);
            });

        res.status(200).json({ message: 'Dados do cliente salvos com sucesso.' });
        console.log(body);
    } else {
        res.status(405).json({ message: 'Método não permitido.' });
    }
}