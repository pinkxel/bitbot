// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('sessionCookie');
  
  // Lista de extensiones de archivos estáticos y rutas de API a excluir
  const staticAssetsAndApi = /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ico|mp3|mp4|webm)$|\/api\//;

  // Excluye las rutas de archivos estáticos y la ruta de inicio de sesión de la verificación de la sesión
  if (staticAssetsAndApi.test(pathname) || pathname === '/login') {
    return NextResponse.next();
  }

  // Verifica la cookie de sesión para todas las demás rutas
  const sessionCookie = request.cookies.get('connect.sid');
  console.log('sessionCookie');
  console.log(sessionCookie);

  // Si no hay cookie de sesión, redirige al usuario a la página de inicio de sesión
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Continúa con la respuesta normal si hay una cookie de sesión
  return NextResponse.next();
}
