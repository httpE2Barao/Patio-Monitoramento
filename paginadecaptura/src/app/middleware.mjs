import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Redireciona a partir da raiz "/" para "/auth"
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  return NextResponse.next();
}

// Configura onde o middleware será aplicado
export const config = {
  matcher: '/', // Middleware será executado somente na rota raiz "/"
};