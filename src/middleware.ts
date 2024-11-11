// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for the API docs
  if (request.nextUrl.pathname.startsWith('/api-docs')) {
    const host = request.headers.get('host');

    // Only allow access on localhost:3000
    if (!host?.includes('localhost:3000')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Get the response
  const response = NextResponse.next();

  // Add cache prevention headers to all API routes
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

// Apply to both API routes and API docs
export const config = {
  matcher: ['/api/:path*', '/api-docs/:path*'],
};
