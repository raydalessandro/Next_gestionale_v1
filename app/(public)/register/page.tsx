'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomeStudio: '',
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Errore durante la registrazione');

      // 2. Create azienda
      const { data: azienda, error: aziendaError } = await supabase
        .from('aziende')
        .insert({
          nome: formData.nomeStudio,
          email: formData.email,
          prezzo_mensile: 0,
          stato_abbonamento: 'trial',
          moduli_attivi: ['dashboard', 'clienti', 'transazioni', 'prenotazioni', 'cassa'],
        })
        .select()
        .single();

      if (aziendaError) throw aziendaError;

      // 3. Create utente
      const { error: utenteError } = await supabase
        .from('utenti')
        .insert({
          id: authData.user.id,
          azienda_id: azienda.id,
          email: formData.email,
          nome: formData.nome,
          ruolo: 'owner',
        });

      if (utenteError) throw utenteError;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="text-5xl">🎵</div>
          </div>
          <CardTitle className="text-2xl text-center">Registrazione</CardTitle>
          <CardDescription className="text-center">
            Crea il tuo account Soundwave
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nomeStudio">Nome Studio</Label>
              <Input
                id="nomeStudio"
                placeholder="Fonoprint Studio"
                value={formData.nomeStudio}
                onChange={(e) => setFormData({ ...formData, nomeStudio: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Il tuo Nome</Label>
              <Input
                id="nome"
                placeholder="Mario Rossi"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@studio.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registrazione in corso...' : 'Registrati'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Hai già un account? </span>
              <Button 
                type="button"
                variant="link" 
                className="p-0"
                onClick={() => router.push('/login')}
              >
                Accedi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
