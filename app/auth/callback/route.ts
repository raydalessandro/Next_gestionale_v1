import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');

  console.log('🔍 Callback called:', { token_hash, type });

  if (token_hash && type) {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    console.log('✅ VerifyOtp result:', { data, error });

    if (!error && data.user) {
      console.log('🎉 Email confirmed! User:', data.user.email);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      console.log('❌ Error confirming:', error);
    }
  }

  return NextResponse.redirect(new URL('/login?error=confirmation_failed', request.url));
}
