import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import Sidebar from '@/components/layout/Sidebar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Get user and azienda data
  const { data: utente } = await supabase
    .from('utenti')
    .select('*, azienda:aziende(*)')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar azienda={utente?.azienda} utente={utente} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
