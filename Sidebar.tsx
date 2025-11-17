'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { MODULES_REGISTRY } from '@/types/modules';
import type { Azienda, Utente } from '@/types';

interface SidebarProps {
  azienda: Azienda;
  utente: Utente;
}

export default function Sidebar({ azienda, utente }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const moduliAttivi = azienda.moduli_attivi.map(id => MODULES_REGISTRY[id as keyof typeof MODULES_REGISTRY]).filter(Boolean);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo & Studio Name */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {azienda.logo_url ? (
            <img src={azienda.logo_url} alt="Logo" className="w-10 h-10 rounded-lg" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl">
              🎵
            </div>
          )}
          <div>
            <h1 className="font-bold text-lg">{azienda.nome_pubblico || azienda.nome}</h1>
            {azienda.tagline && (
              <p className="text-xs text-muted-foreground">{azienda.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {moduliAttivi.map((modulo) => {
          const isActive = pathname.startsWith(modulo.route);
          
          return (
            <Link
              key={modulo.id}
              href={modulo.route}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <span className="text-xl">{modulo.icona}</span>
              <span className="font-medium">{modulo.nome}</span>
            </Link>
          );
        })}

        {/* Impostazioni */}
        <Link
          href="/impostazioni/azienda"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            pathname.startsWith('/impostazioni')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span className="font-medium">Impostazioni</span>
        </Link>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
            {utente.nome.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{utente.nome}</p>
            <p className="text-xs text-muted-foreground truncate">{utente.email}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Esci
        </Button>
      </div>
    </div>
  );
}
