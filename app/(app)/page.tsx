import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function ClientiPage() {
  const supabase = createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  const { data: utente } = await supabase
    .from('utenti')
    .select('azienda_id')
    .eq('id', session?.user.id)
    .single();

  const { data: clienti } = await supabase
    .from('clienti')
    .select('*')
    .eq('azienda_id', utente?.azienda_id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Artisti & Clienti</h1>
          <p className="text-muted-foreground mt-2">
            Gestisci i tuoi artisti e clienti
          </p>
        </div>
        <Link href="/clienti/nuovo">
          <Button>+ Nuovo Cliente</Button>
        </Link>
      </div>

      {!clienti || clienti.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold mb-2">Nessun cliente ancora</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Inizia aggiungendo il tuo primo artista o cliente
            </p>
            <Link href="/clienti/nuovo">
              <Button>+ Aggiungi Cliente</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clienti.map((cliente) => (
            <Link key={cliente.id} href={`/clienti/${cliente.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
                      {cliente.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                      {cliente.nome_arte && (
                        <p className="text-sm text-muted-foreground">"{cliente.nome_arte}"</p>
                      )}
                      <div className="flex gap-2 mt-1">
                        {cliente.genere_musicale && (
                          <Badge variant="secondary">{cliente.genere_musicale}</Badge>
                        )}
                        {cliente.vip && (
                          <Badge variant="default">⭐ VIP</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {cliente.email && (
                      <p className="text-sm text-muted-foreground">{cliente.email}</p>
                    )}
                    {cliente.telefono && (
                      <p className="text-sm text-muted-foreground">{cliente.telefono}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
