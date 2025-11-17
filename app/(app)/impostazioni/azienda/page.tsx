'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Azienda } from '@/types';

export default function AziendaSettingsPage() {
  const [azienda, setAzienda] = useState<Azienda | null>(null);
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
  };

  const handleUpdate = async (updates: Partial<Azienda>) => {
    if (!azienda) return;
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('aziende')
      .update(updates)
      .eq('id', azienda.id);

    if (!error) {
      setSuccess('Impostazioni salvate!');
      setTimeout(() => setSuccess(''), 3000);
      await loadAzienda();
      
      // Ricarica per aggiornare sidebar
      setTimeout(() => window.location.reload(), 1000);
    }

    setLoading(false);
  };

  if (!azienda) {
    return <div>Caricamento...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Impostazioni Studio</h1>
        <p className="text-muted-foreground mt-2">
          Gestisci le informazioni del tuo studio
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✅ {success}
        </div>
      )}

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Info Generale</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="contatti">Contatti</TabsTrigger>
        </TabsList>

        {/* Info Generale */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Studio</CardTitle>
              <CardDescription>
                Dati principali del tuo studio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Studio</Label>
                <Input
                  id="nome"
                  defaultValue={azienda.nome}
                  onBlur={(e) => handleUpdate({ nome: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={azienda.email}
                  onBlur={(e) => handleUpdate({ email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="descrizione">Descrizione</Label>
                <Input
                  id="descrizione"
                  defaultValue={azienda.descrizione || ''}
                  onBlur={(e) => handleUpdate({ descrizione: e.target.value })}
                  placeholder="Breve descrizione dello studio..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>🎨 Personalizzazione Brand</CardTitle>
              <CardDescription>
                Logo, colori e stile visivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome_pubblico">Nome Pubblico</Label>
                <Input
                  id="nome_pubblico"
                  defaultValue={azienda.nome_pubblico || azienda.nome}
                  onBlur={(e) => handleUpdate({ nome_pubblico: e.target.value })}
                  placeholder="Es: Fonoprint Recording Studio"
                />
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  defaultValue={azienda.tagline || ''}
                  onBlur={(e) => handleUpdate({ tagline: e.target.value })}
                  placeholder="Es: Professional Recording Since 1976"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="colore_primario">Colore Primario</Label>
                  <div className="flex gap-2">
                    <Input
                      id="colore_primario"
                      type="color"
                      defaultValue={azienda.colore_primario}
                      onBlur={(e) => handleUpdate({ colore_primario: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      defaultValue={azienda.colore_primario}
                      disabled
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="colore_secondario">Colore Secondario</Label>
                  <div className="flex gap-2">
                    <Input
                      id="colore_secondario"
                      type="color"
                      defaultValue={azienda.colore_secondario}
                      onBlur={(e) => handleUpdate({ colore_secondario: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      defaultValue={azienda.colore_secondario}
                      disabled
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="colore_accento">Colore Accento</Label>
                  <div className="flex gap-2">
                    <Input
                      id="colore_accento"
                      type="color"
                      defaultValue={azienda.colore_accento}
                      onBlur={(e) => handleUpdate({ colore_accento: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      defaultValue={azienda.colore_accento}
                      disabled
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <div
                  className="p-6 rounded-lg text-white"
                  style={{
                    background: `linear-gradient(135deg, ${azienda.colore_primario}, ${azienda.colore_secondario})`
                  }}
                >
                  <h3 className="text-2xl font-bold mb-1">
                    {azienda.nome_pubblico || azienda.nome}
                  </h3>
                  {azienda.tagline && (
                    <p className="text-white/90">{azienda.tagline}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contatti */}
        <TabsContent value="contatti">
          <Card>
            <CardHeader>
              <CardTitle>📞 Contatti & Social</CardTitle>
              <CardDescription>
                Informazioni di contatto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="telefono">Telefono</Label>
                <Input
                  id="telefono"
                  defaultValue={azienda.telefono || ''}
                  onBlur={(e) => handleUpdate({ telefono: e.target.value })}
                  placeholder="+39 02 1234567"
                />
              </div>

              <div>
                <Label htmlFor="indirizzo">Indirizzo</Label>
                <Input
                  id="indirizzo"
                  defaultValue={azienda.indirizzo || ''}
                  onBlur={(e) => handleUpdate({ indirizzo: e.target.value })}
                  placeholder="Via Example 123"
                />
              </div>

              <div>
                <Label htmlFor="citta">Città</Label>
                <Input
                  id="citta"
                  defaultValue={azienda.citta || ''}
                  onBlur={(e) => handleUpdate({ citta: e.target.value })}
                  placeholder="Milano"
                />
              </div>

              <div>
                <Label htmlFor="sito_web">Sito Web</Label>
                <Input
                  id="sito_web"
                  defaultValue={azienda.sito_web || ''}
                  onBlur={(e) => handleUpdate({ sito_web: e.target.value })}
                  placeholder="https://tuostudio.com"
                />
              </div>

              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  defaultValue={azienda.instagram || ''}
                  onBlur={(e) => handleUpdate({ instagram: e.target.value })}
                  placeholder="@tuostudio"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button onClick={() => window.location.href = '/impostazioni/admin'}>
          → Vai ad Amministrazione (Moduli & Pricing)
        </Button>
      </div>
    </div>
  );
}
