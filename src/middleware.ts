import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Determines if the user should be redirected based on their country info and plan.
 *
 * @param user - The user's plan and country information.
 * @param pathname - The current request pathname.
 * @param baseUrl - The base URL from the request.
 * @returns A URL object if a redirection is needed; otherwise, null.
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For API routes: add security headers and continue.
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    return response;
  }

  return NextResponse.next();
}

// Retain the NextAuth middleware default behavior for authentication.
export { default } from 'next-auth/middleware';

// Apply this middleware to all subpaths under /dashboard.
export const config = { matcher: ['/dashboard/:path*', '/dashboard'] };