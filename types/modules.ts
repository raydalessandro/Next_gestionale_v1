export type ModuloId =
  | 'dashboard'
  | 'clienti'
  | 'transazioni'
  | 'prenotazioni'
  | 'cassa';

export interface Modulo {
  id: ModuloId;
  nome: string;
  descrizione: string;
  icona: string;
  route: string;
  categoria: 'core' | 'finance' | 'operations';
}

export const MODULES_REGISTRY: Record<ModuloId, Modulo> = {
  dashboard: {
    id: 'dashboard',
    nome: 'Dashboard',
    descrizione: 'Panoramica generale studio',
    icona: '📊',
    route: '/dashboard',
    categoria: 'core'
  },
  
  clienti: {
    id: 'clienti',
    nome: 'Artisti & Clienti',
    descrizione: 'Gestione completa artisti',
    icona: '👥',
    route: '/clienti',
    categoria: 'core'
  },
  
  transazioni: {
    id: 'transazioni',
    nome: 'Transazioni',
    descrizione: 'Gestione transazioni e pagamenti',
    icona: '💰',
    route: '/transazioni',
    categoria: 'finance'
  },
  
  prenotazioni: {
    id: 'prenotazioni',
    nome: 'Prenotazioni',
    descrizione: 'Calendario prenotazioni sale',
    icona: '📅',
    route: '/prenotazioni',
    categoria: 'operations'
  },
  
  cassa: {
    id: 'cassa',
    nome: 'Cassa',
    descrizione: 'POS per vendita accessori',
    icona: '🛒',
    route: '/cassa',
    categoria: 'finance'
  }
};

export function getModuliAttivi(azienda: { moduli_attivi: string[] }): ModuloId[] {
  return azienda.moduli_attivi as ModuloId[];
}

export function isModuloAttivo(azienda: { moduli_attivi: string[] }, moduloId: ModuloId): boolean {
  return azienda.moduli_attivi.includes(moduloId);
}
