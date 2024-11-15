// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add cache prevention headers to ALL routes
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  // API docs check
  if (request.nextUrl.pathname.startsWith('/api-docs')) {
    const host = request.headers.get('host');
    if (!host?.includes('localhost:3000')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

// Apply to all routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
