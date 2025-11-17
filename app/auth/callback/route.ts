import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');

  if (token_hash && type) {
    const supabase = createRouteHandlerClient({ cookies });
    
    // ✅ Questo conferma l'email!
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (!error) {
      // Success! Redirect a dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Se errore, redirect a login
  return NextResponse.redirect(new URL('/login', request.url));
}
