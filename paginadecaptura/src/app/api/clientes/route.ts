import { NextResponse } from 'next/server';

// Manipulador para requisições GET
export async function GET() {
  if (!process.env.API_URL || !process.env.API_USERNAME || !process.env.API_PASSWORD) {
    console.error('Erro: Variáveis de ambiente não definidas.');
    return NextResponse.json(
      { error: 'As variáveis de ambiente API_URL, API_USERNAME e API_PASSWORD devem ser definidas.' },
      { status: 500 }
    );
  }

  const apiUrl = process.env.API_URL;
  const username = process.env.API_USERNAME;
  const password = process.env.API_PASSWORD;
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro da API externa: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Erro ao comunicar com a API externa:', error);
    return NextResponse.json({ error: 'Erro ao comunicar com a API externa.' }, { status: 500 });
  }
}

// Manipulador para requisições POST
export async function POST(request: Request) {
  if (!process.env.API_URL || !process.env.API_USERNAME || !process.env.API_PASSWORD) {
    console.error('Erro: Variáveis de ambiente não definidas.');
    return NextResponse.json(
      { error: 'As variáveis de ambiente API_URL, API_USERNAME e API_PASSWORD devem ser definidas.' },
      { status: 500 }
    );
  }

  const apiUrl = process.env.API_URL;
  const username = process.env.API_USERNAME;
  const password = process.env.API_PASSWORD;
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

  const body = await request.json();

  // Envia os dados, incluindo a ação, para a API externa
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro da API externa: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Erro ao comunicar com a API externa:', error);
    return NextResponse.json({ error: error.message || 'Erro ao comunicar com a API externa.' }, { status: 500 });
  }
}