# 🎵 SOUNDWAVE SAAS - Setup Guide

Gestionale cloud per studi di registrazione con white-label nativo.

## 📦 Cosa Include Questo MVP

### ✅ Moduli Core:
- **Dashboard** - Overview generale studio
- **Clienti/Artisti** - Gestione completa artisti con dati musicali
- **Transazioni** - Transaction manager con multi-payment
- **Prenotazioni** - Calendario booking sale
- **Cassa** - POS per vendita accessori

### ✅ Configurazione:
- **White-Label** - Logo, colori, naming personalizzati
- **Servizi Custom** - Ogni studio configura i propri servizi
- **Sale Custom** - Configurazione sale studio
- **Admin Panel** - Toggle moduli + pricing libero (€0 = gratis)

---

## 🚀 SETUP RAPIDO (30 minuti)

### 1️⃣ Setup Supabase

```bash
# 1. Vai su https://supabase.com
# 2. Crea nuovo progetto
#    - Nome: soundwave-production
#    - Region: EU West (Ireland) o Europe (Frankfurt)
#    - Password: [salva bene!]

# 3. Una volta creato, vai su SQL Editor
# 4. Copia tutto il contenuto di supabase-schema.sql
# 5. Incolla e clicca "Run"
# 6. Aspetta conferma "Success"
```

### 2️⃣ Setup Progetto Locale

```bash
# 1. Estrai lo ZIP
unzip soundwave-saas.zip
cd soundwave-saas

# 2. Installa dipendenze
npm install

# 3. Configura environment variables
cp .env.local.example .env.local

# 4. Modifica .env.local con le tue credenziali Supabase:
#    - Vai su Supabase > Project Settings > API
#    - Copia URL e anon key
#    - Incolla in .env.local

# File .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 5. Avvia dev server
npm run dev

# 6. Apri browser su http://localhost:3000
```

### 3️⃣ Primo Accesso

```bash
# 1. Vai su http://localhost:3000
# 2. Clicca "Registrati"
# 3. Compila form:
#    - Nome Studio: "Test Studio"
#    - Nome: "Il tuo nome"
#    - Email: "test@test.com"
#    - Password: "password123"

# 4. Login automatico
# 5. Sei dentro! 🎉
```

---

## 🔧 CONFIGURAZIONE INIZIALE

### Dopo il primo login:

1. **Impostazioni > Branding**
   - Carica logo
   - Imposta colori brand
   - Personalizza nome pubblico

2. **Impostazioni > Servizi**
   - Aggiungi servizi (Recording, Mixing, etc.)
   - Configura prezzi

3. **Impostazioni > Sale**
   - Aggiungi sale studio
   - Configura equipment

4. **Clienti > Nuovo Cliente**
   - Aggiungi primo artista

5. **Dashboard**
   - Vedi tutto in azione!

---

## 🎨 PERSONALIZZAZIONE

### Admin Panel

Vai su **Impostazioni > Admin** per:

- **Toggle Moduli**: Attiva/disattiva moduli
- **Set Pricing**: Imposta prezzo mensile (€0 = gratis)
- **Date Scadenza**: Imposta data scadenza abbonamento

### White-Label

Vai su **Impostazioni > Branding** per:

- Upload logo
- Scegli colori (primario, secondario, accento)
- Imposta nome pubblico & tagline
- Configura contatti & social

---

## 📁 STRUTTURA PROGETTO

```
soundwave-saas/
├── app/
│   ├── (public)/              # Login, Register
│   ├── (app)/                 # Dashboard protetto
│   │   ├── dashboard/
│   │   ├── clienti/
│   │   ├── transazioni/
│   │   ├── prenotazioni/
│   │   ├── cassa/
│   │   └── impostazioni/
│   └── api/                   # API routes
├── components/
│   ├── layout/                # Sidebar, etc.
│   └── ui/                    # Shadcn components
├── lib/
│   ├── supabase/              # Supabase clients
│   └── utils.ts
└── types/                     # TypeScript types
```

---

## 🚀 DEPLOY SU VERCEL

### Setup GitHub

```bash
# 1. Crea repo GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tuo-username/soundwave-saas.git
git push -u origin main
```

### Deploy Vercel

```bash
# 1. Vai su https://vercel.com
# 2. New Project
# 3. Import dal tuo repo GitHub
# 4. Framework Preset: Next.js
# 5. Aggiungi Environment Variables:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_ROLE_KEY
#    - NEXT_PUBLIC_APP_URL (https://tuo-dominio.vercel.app)

# 6. Deploy!
# 7. Vai su tuo-dominio.vercel.app
```

### Setup Dominio Custom (Opzionale)

```bash
# 1. Vai su Vercel > Settings > Domains
# 2. Aggiungi tuo dominio
# 3. Configura DNS come indicato
# 4. Aspetta propagazione (5-10 min)
```

---

## 🔐 SICUREZZA

### RLS (Row Level Security)

✅ **Già configurato!** Ogni studio vede solo i propri dati.

### Policies Attive:

- ✅ Utenti vedono solo dati della propria azienda
- ✅ Nessun cross-tenant data leak possibile
- ✅ Queries automaticamente filtrate per azienda_id

### Test Sicurezza:

```bash
# Crea 2 account diversi
# Verifica che non vedano dati reciproci
```

---

## 📊 DATABASE

### Backup

```bash
# 1. Vai su Supabase > Database > Backups
# 2. Abilita backups automatici
# 3. Schedule: Daily
```

### Migration

```bash
# Per aggiungere nuove tabelle/colonne:
# 1. Scrivi SQL in Supabase SQL Editor
# 2. Salva come Migration
# 3. Versiona in Git
```

---

## 🐛 TROUBLESHOOTING

### Problema: "Session expired"
**Soluzione**: Ricarica pagina e fai login

### Problema: "RLS policy violation"
**Soluzione**: Verifica che utente sia associato a azienda

### Problema: "Cannot read property 'azienda'"
**Soluzione**: Verifica che utente esista in tabella utenti

### Problema: Logo non si vede
**Soluzione**: 
1. Vai su Supabase > Storage
2. Crea bucket "logos" (public)
3. Upload logo
4. Copia URL pubblico

---

## 📈 NEXT STEPS

### Dopo MVP funzionante:

1. **Analytics** - Aggiungi dashboard metriche
2. **AI Assistant** - Integra hub_ai
3. **App Mobile Cliente** - React Native
4. **Stripe** - Gestione pagamenti
5. **Email Notifications** - Resend/SendGrid

---

## 🆘 SUPPORTO

### Hai problemi?

1. Controlla console browser (F12)
2. Controlla logs Supabase
3. Verifica .env.local
4. Riavvia dev server

### Domande?

Scrivi a: ray@soundwave.app

---

## 📝 NOTE

### Questo è un MVP!

- ✅ Core funzionante e testato
- ✅ Multi-tenant sicuro
- ✅ White-label ready
- ⏳ Analytics, AI, Stripe = da aggiungere

### Roadmap:

**Week 1-2**: Testing + fix bugs
**Week 3-4**: Primi 3-5 studi beta
**Week 5-6**: Analytics + features richieste
**Week 7-8**: AI + App Cliente

---

## 🎉 FATTO!

Ora hai un gestionale SaaS production-ready per studi di registrazione!

**Buon lavoro! 🚀**
