import { createServerClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default async function DashboardPage() {
  const supabase = createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  const { data: utente } = await supabase
    .from('utenti')
    .select('azienda_id')
    .eq('id', session?.user.id)
    .single();

  // Get stats
  const { count: clientiCount } = await supabase
    .from('clienti')
    .select('*', { count: 'exact', head: true })
    .eq('azienda_id', utente?.azienda_id);

  const { data: transazioni } = await supabase
    .from('transazioni')
    .select('totale, stato')
    .eq('azienda_id', utente?.azienda_id);

  const totaleEntrate = transazioni?.reduce((sum, t) => sum + Number(t.totale), 0) || 0;
  const transazioniPagate = transazioni?.filter(t => t.stato === 'paid').length || 0;

  const { count: prenotazioniOggi } = await supabase
    .from('prenotazioni')
    .select('*', { count: 'exact', head: true })
    .eq('azienda_id', utente?.azienda_id)
    .eq('data', new Date().toISOString().split('T')[0]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Panoramica generale del tuo studio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Clienti</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clientiCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Artisti registrati
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entrate Totali</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totaleEntrate)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {transazioniPagate} transazioni completate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prenotazioni Oggi</CardTitle>
            <span className="text-2xl">📅</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{prenotazioniOggi || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sessioni programmate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <span className="text-2xl">✨</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Attivo</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sistema operativo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card>
        <CardHeader>
          <CardTitle>Benvenuto su Soundwave! 🎵</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Il tuo gestionale per studi di registrazione è pronto. 
            Inizia aggiungendo clienti, configurando servizi e gestendo le tue prenotazioni.
          </p>
          <div className="mt-4 space-x-4">
            <a href="/clienti/nuovo" className="text-primary hover:underline">
              Aggiungi primo cliente →
            </a>
            <a href="/impostazioni/servizi" className="text-primary hover:underline">
              Configura servizi →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
