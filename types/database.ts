export interface Azienda {
  id: string;
  nome: string;
  email: string;
  
  // Branding
  logo_url?: string;
  nome_pubblico?: string;
  tagline?: string;
  descrizione?: string;
  colore_primario: string;
  colore_secondario: string;
  colore_accento: string;
  
  // Contatti
  telefono?: string;
  indirizzo?: string;
  citta?: string;
  sito_web?: string;
  instagram?: string;
  
  // Abbonamento
  prezzo_mensile: number;
  stato_abbonamento: 'trial' | 'active' | 'suspended' | 'canceled';
  data_scadenza?: string;
  moduli_attivi: string[];
  
  created_at: string;
  updated_at: string;
}

export interface Utente {
  id: string;
  azienda_id: string;
  email: string;
  nome: string;
  ruolo: 'owner' | 'admin' | 'staff';
  avatar_url?: string;
  created_at: string;
}

export interface Cliente {
  id: string;
  azienda_id: string;
  nome: string;
  nome_arte?: string;
  email?: string;
  telefono?: string;
  
  // Dati musicali
  genere_musicale?: string;
  sottogenere?: string;
  tipo_progetto?: string;
  etichetta?: string;
  
  // Social
  instagram?: string;
  spotify?: string;
  youtube?: string;
  soundcloud?: string;
  
  // Status
  vip: boolean;
  livello: 'emerging' | 'professional' | 'signed';
  
  note?: string;
  tags?: string[];
  
  created_at: string;
  updated_at: string;
}

export interface ServizioStudio {
  id: string;
  azienda_id: string;
  nome: string;
  descrizione?: string;
  
  tipo_prezzo: 'hourly' | 'fixed' | 'package';
  prezzo_orario?: number;
  prezzo_fisso?: number;
  ore_incluse?: number;
  
  categoria: string;
  icona: string;
  colore: string;
  
  attivo: boolean;
  ordine: number;
  
  created_at: string;
  updated_at: string;
}

export interface SalaStudio {
  id: string;
  azienda_id: string;
  nome: string;
  descrizione?: string;
  
  equipment?: any[];
  caratteristiche?: string[];
  
  prezzo_orario: number;
  
  immagine_url?: string;
  colore_calendario: string;
  icona: string;
  
  attiva: boolean;
  ordine: number;
  
  created_at: string;
  updated_at: string;
}

export interface Transazione {
  id: string;
  azienda_id: string;
  cliente_id?: string;
  
  numero_transazione: string;
  totale: number;
  stato: 'pending' | 'partial' | 'paid' | 'cancelled';
  
  servizi: any;
  note?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Pagamento {
  id: string;
  transazione_id: string;
  azienda_id: string;
  
  importo: number;
  metodo: string;
  data_pagamento: string;
  note?: string;
  
  created_at: string;
}

export interface Prenotazione {
  id: string;
  azienda_id: string;
  cliente_id?: string;
  sala_id: string;
  servizio_id: string;
  
  sala_nome: string;
  servizio_nome: string;
  
  data: string;
  ora_inizio: string;
  durata: number;
  
  stato: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  note?: string;
  
  created_at: string;
  updated_at: string;
}

export interface ProdottoCassa {
  id: string;
  azienda_id: string;
  
  codice: string;
  nome: string;
  categoria: string;
  prezzo: number;
  
  stock: number;
  icona: string;
  
  attivo: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface VenditaCassa {
  id: string;
  azienda_id: string;
  cliente_id?: string;
  
  numero_vendita: string;
  subtotale: number;
  sconto: number;
  totale: number;
  
  items: any;
  metodo_pagamento: string;
  
  created_at: string;
}
