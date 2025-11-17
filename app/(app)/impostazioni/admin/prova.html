'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MODULES_REGISTRY } from '@/types/modules';
import type { Azienda } from '@/types';

export default function AdminSettingsPage() {
  const [azienda, setAzienda] = useState<Azienda | null>(null);
  const [prezzo, setPrezzo] = useState('0');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAzienda();
  }, []);

  const loadAzienda = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const { data: utente } = await supabase
      .from('utenti')
      .select('azienda_id')
      .eq('id', session?.user.id)
      .single();

    const { data: aziendaData } = await supabase
      .from('aziende')
      .select('*')
      .eq('id', utente?.azienda_id)
      .single();

    setAzienda(aziendaData);
    setPrezzo(aziendaData?.prezzo_mensile?.toString() || '0');
  };

  const toggleModulo = async (moduloId: string) => {
    if (!azienda) return;

    const moduliAttivi = azienda.moduli_attivi.includes(moduloId)
      ? azienda.moduli_attivi.filter(id => id !== moduloId)
      : [...azienda.moduli_attivi, moduloId];

    const supabase = createClient();
    const { error } = await supabase
      .from('aziende')
      .update({ moduli_attivi: moduliAttivi })
      .eq('id', azienda.id);

    if (!error) {
      setAzienda({ ...azienda, moduli_attivi: moduliAttivi });
      setSuccess('Moduli aggiornati!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Ricarica pagina per aggiornare sidebar
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const updatePrezzo = async () => {
    if (!azienda) return;
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('aziende')
      .update({ prezzo_mensile: parseFloat(prezzo) || 0 })
      .eq('id', azienda.id);

    if (!error) {
      setSuccess('Prezzo aggiornato!');
      setTimeout(() => setSuccess(''), 3000);
      await loadAzienda();
    }

    setLoading(false);
  };

  if (!azienda) {
    return <div>Caricamento...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Amministrazione</h1>
        <p className="text-muted-foreground mt-2">
          Gestisci moduli attivi e pricing
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✅ {success}
        </div>
      )}

      {/* Pricing */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>💰 Pricing & Abbonamento</CardTitle>
          <CardDescription>
            Imposta il prezzo mensile. Metti €0 per modalità gratuita.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="prezzo">Prezzo Mensile (€)</Label>
              <Input
                id="prezzo"
                type="number"
                min="0"
                step="0.01"
                value={prezzo}
                onChange={(e) => setPrezzo(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <Button onClick={updatePrezzo} disabled={loading}>
              {loading ? 'Salvataggio...' : 'Aggiorna Prezzo'}
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Prezzo Attuale</p>
                <p className="text-sm text-muted-foreground">
                  {azienda.prezzo_mensile === 0 ? 'Modalità Gratuita' : `€${azienda.prezzo_mensile}/mese`}
                </p>
              </div>
              <Badge variant={azienda.prezzo_mensile === 0 ? 'success' : 'default'}>
                {azienda.stato_abbonamento}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moduli */}
      <Card>
        <CardHeader>
          <CardTitle>📦 Gestione Moduli</CardTitle>
          <CardDescription>
            Attiva o disattiva i moduli del gestionale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.values(MODULES_REGISTRY).map((modulo) => {
              const isActive = azienda.moduli_attivi.includes(modulo.id);
              
              return (
                <div
                  key={modulo.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{modulo.icona}</span>
                    <div>
                      <h3 className="font-semibold">{modulo.nome}</h3>
                      <p className="text-sm text-muted-foreground">
                        {modulo.descrizione}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => toggleModulo(modulo.id)}
                    variant={isActive ? 'default' : 'outline'}
                  >
                    {isActive ? '✓ Attivo' : 'Disattivato'}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Nota:</strong> I moduli attivi appariranno nella sidebar.
              Dopo aver modificato i moduli, la pagina si ricaricherà automaticamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
