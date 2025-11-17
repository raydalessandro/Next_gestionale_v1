-- SOUNDWAVE SAAS - DATABASE SCHEMA
-- Esegui questo script nel tuo progetto Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- AZIENDE (Studi di Registrazione)
CREATE TABLE aziende (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  
  -- Branding
  logo_url TEXT,
  nome_pubblico TEXT,
  tagline TEXT,
  descrizione TEXT,
  colore_primario TEXT DEFAULT '#8B5CF6',
  colore_secondario TEXT DEFAULT '#EC4899',
  colore_accento TEXT DEFAULT '#10B981',
  
  -- Contatti
  telefono TEXT,
  indirizzo TEXT,
  citta TEXT,
  sito_web TEXT,
  instagram TEXT,
  
  -- Abbonamento
  prezzo_mensile DECIMAL(10,2) DEFAULT 0,
  stato_abbonamento TEXT DEFAULT 'trial',
  data_scadenza TIMESTAMP,
  moduli_attivi TEXT[] DEFAULT ARRAY['dashboard', 'clienti', 'transazioni', 'prenotazioni', 'cassa'],
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_aziende_email ON aziende(email);

-- UTENTI (Staff Studio)
CREATE TABLE utenti (
  id UUID PRIMARY KEY,
  azienda_id UUID REFERENCES aziende(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  ruolo TEXT DEFAULT 'staff',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_utenti_azienda ON utenti(azienda_id);

-- CLIENTI (Artisti)
CREATE TABLE clienti (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  azienda_id UUID REFERENCES aziende(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  nome_arte TEXT,
  email TEXT,
  telefono TEXT,
  
  -- Dati musicali
  genere_musicale TEXT,
  sottogenere TEXT,
  tipo_progetto TEXT,
  etichetta TEXT,
  
  -- Social
  instagram TEXT,
  spotify TEXT,
  youtube TEXT,
  soundcloud TEXT,
  
  -- Status
  vip BOOLEAN DEFAULT FALSE,
  livello TEXT DEFAULT 'emerging',
  note TEXT,
  tags TEXT[],
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clienti_azienda ON clienti(azienda_id);

-- SERVIZI STUDIO (personalizzati per ogni studio)
CREATE TABLE servizi_studio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  azienda_id UUID REFERENCES aziende(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descrizione TEXT,
  
  tipo_prezzo TEXT DEFAULT 'hourly',
  prezzo_orario DECIMAL(10,2),
  prezzo_fisso DECIMAL(10,2),
  ore_incluse INTEGER,
  
  categoria TEXT,
  icona TEXT DEFAULT '🎵',
  colore TEXT DEFAULT '#8B5CF6',
  
  attivo BOOLEAN DEFAULT TRUE,
  ordine INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_servizi_azienda ON servizi_studio(azienda_id);

-- SALE STUDIO (personalizzate per ogni studio)
CREATE TABLE sale_studio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  azienda_id UUID REFERENCES aziende(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descrizione TEXT,
  
  equipment JSONB DEFAULT '[]',
  caratteristiche TEXT[],
  
  prezzo_orario DECIMAL(10,2),
  immagine_url TEXT,
  colore_calendario TEXT DEFAULT '#10B981',
  icona TEXT DEFAULT '🎙️',
  
  attiva BOOLEAN DEFAULT TRUE,
  ordine INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sale_azienda ON sale_studio(azienda_id);

-- TRANSAZIONI
CREATE TABLE transazioni (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  azienda_id UUID REFERENCES aziende(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clienti(id),
  
  numero_transazione TEXT UNIQUE NOT NULL,
  totale DECIMAL(10,2) NOT NULL,
  stato TEXT DEFAULT 'pending',
  
  servizi JSONB NOT NULL,
  note TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transazioni_azienda ON transazioni(azienda_id);
CREATE INDEX idx_transazioni_cliente ON transazioni(cliente_id);

-- PAGAMENTI
CREATE TABLE pagamenti (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transazione_id UUID REFERENCES transazioni(id) ON DELETE CASCADE,
  azienda_id UUID REFERENCES aziende(id) ON DELETE CASCADE,
  
  importo DECIMAL(10,2) NOT NULL,
  metodo TEXT NOT NULL,
  data_pagamento DATE NOT NULL,
  note TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pagamenti_transazione ON pagamenti(transazione_id);

-- PRENOTAZIONI
CREATE TABLE prenotazioni (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  azienda_id UUID REFERENCES aziende(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clienti(id),
  sala_id UUID REFERENCES sale_studio(id),
  servizio_id UUID REFERENCES servizi_studio(id),
  
  sala_nome TEXT NOT NULL,
  servizio_nome TEXT NOT NULL,
  
  data DATE NOT NULL,
  ora_inizio TIME NOT NULL,
  durata INTEGER NOT NULL,
  
  stato TEXT DEFAULT 'confirmed',
  note TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prenotazioni_azienda ON prenotazioni(azienda_id);
CREATE INDEX idx_prenotazioni_data ON prenotazioni(data);

-- PRODOTTI CASSA
CREATE TABLE prodotti_cassa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  azienda_id UUID REFERENCES aziende(id) ON DELETE CASCADE,
  
  codice TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  prezzo DECIMAL(10,2) NOT NULL,
  
  stock INTEGER DEFAULT 0,
  icona TEXT DEFAULT '📦',
  
  attivo BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prodotti_azienda ON prodotti_cassa(azienda_id);

-- VENDITE CASSA
CREATE TABLE vendite_cassa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  azienda_id UUID REFERENCES aziende(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clienti(id),
  
  numero_vendita TEXT UNIQUE NOT NULL,
  subtotale DECIMAL(10,2) NOT NULL,
  sconto DECIMAL(10,2) DEFAULT 0,
  totale DECIMAL(10,2) NOT NULL,
  
  items JSONB NOT NULL,
  metodo_pagamento TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vendite_azienda ON vendite_cassa(azienda_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE aziende ENABLE ROW LEVEL SECURITY;
ALTER TABLE utenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE clienti ENABLE ROW LEVEL SECURITY;
ALTER TABLE servizi_studio ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_studio ENABLE ROW LEVEL SECURITY;
ALTER TABLE transazioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE prenotazioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE prodotti_cassa ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendite_cassa ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's azienda_id
CREATE OR REPLACE FUNCTION get_user_azienda_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT azienda_id FROM utenti WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for AZIENDE
CREATE POLICY "Users can view their own azienda"
  ON aziende FOR SELECT
  USING (id = get_user_azienda_id());

CREATE POLICY "Users can update their own azienda"
  ON aziende FOR UPDATE
  USING (id = get_user_azienda_id());

-- Policies for UTENTI
CREATE POLICY "Users can view users in their azienda"
  ON utenti FOR SELECT
  USING (azienda_id = get_user_azienda_id());

-- Policies for CLIENTI
CREATE POLICY "Users can manage clienti in their azienda"
  ON clienti FOR ALL
  USING (azienda_id = get_user_azienda_id());

-- Policies for SERVIZI_STUDIO
CREATE POLICY "Users can manage servizi in their azienda"
  ON servizi_studio FOR ALL
  USING (azienda_id = get_user_azienda_id());

-- Policies for SALE_STUDIO
CREATE POLICY "Users can manage sale in their azienda"
  ON sale_studio FOR ALL
  USING (azienda_id = get_user_azienda_id());

-- Policies for TRANSAZIONI
CREATE POLICY "Users can manage transazioni in their azienda"
  ON transazioni FOR ALL
  USING (azienda_id = get_user_azienda_id());

-- Policies for PAGAMENTI
CREATE POLICY "Users can manage pagamenti in their azienda"
  ON pagamenti FOR ALL
  USING (azienda_id = get_user_azienda_id());

-- Policies for PRENOTAZIONI
CREATE POLICY "Users can manage prenotazioni in their azienda"
  ON prenotazioni FOR ALL
  USING (azienda_id = get_user_azienda_id());

-- Policies for PRODOTTI_CASSA
CREATE POLICY "Users can manage prodotti in their azienda"
  ON prodotti_cassa FOR ALL
  USING (azienda_id = get_user_azienda_id());

-- Policies for VENDITE_CASSA
CREATE POLICY "Users can manage vendite in their azienda"
  ON vendite_cassa FOR ALL
  USING (azienda_id = get_user_azienda_id());

-- ============================================
-- SEED DATA (Optional - Default Services)
-- ============================================

-- Uncomment to add default services to new studios
-- These can be customized by each studio later

/*
CREATE OR REPLACE FUNCTION create_default_services()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO servizi_studio (azienda_id, nome, descrizione, tipo_prezzo, prezzo_orario, categoria, icona, colore)
  VALUES
    (NEW.id, 'Recording Voce', 'Registrazione voce con ingegnere', 'hourly', 50, 'Recording', '🎤', '#EC4899'),
    (NEW.id, 'Mixing', 'Mix professionale tracce', 'fixed', 200, 'Post-Production', '🎛️', '#8B5CF6'),
    (NEW.id, 'Mastering', 'Mastering finale', 'fixed', 150, 'Post-Production', '✨', '#10B981');
  
  INSERT INTO sale_studio (azienda_id, nome, descrizione, prezzo_orario, colore_calendario, icona)
  VALUES
    (NEW.id, 'Studio A', 'Sala principale', 60, '#10B981', '🎙️'),
    (NEW.id, 'Sala Podcast', 'Sala voice over', 40, '#3B82F6', '🎧');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_defaults_on_new_azienda
  AFTER INSERT ON aziende
  FOR EACH ROW
  EXECUTE FUNCTION create_default_services();
*/
