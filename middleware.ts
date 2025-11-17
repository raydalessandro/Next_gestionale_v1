import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // ✅ AGGIUNGI QUESTA ECCEZIONE PER AUTH CALLBACK
  if (req.nextUrl.pathname.startsWith('/auth/callback')) {
    return res;
  }
  
  // Public routes
  if (req.nextUrl.pathname.startsWith('/login') || 
      req.nextUrl.pathname.startsWith('/register')) {
    // Redirect to dashboard if already logged in
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return res;
  }
  
  // Protected routes - redirect to login if not authenticated
  if (!session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
