import { type Language } from './translations';

export interface ScanRecord {
  id: string;
  type: 'qr' | 'url';
  input: string;
  score: number;
  status: 'safe' | 'caution' | 'fraud';
  explanation: string;
  timestamp: number;
}

const LANG_KEY = 'fraud-shield-lang';
const HISTORY_KEY = 'fraud-shield-history';
const MUTED_KEY = 'fraud-shield-muted';

export function getSavedLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LANG_KEY) as Language | null;
}

export function saveLanguage(lang: Language) {
  localStorage.setItem(LANG_KEY, lang);
}

export function getScanHistory(): ScanRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addScanRecord(record: ScanRecord) {
  const history = getScanHistory();
  history.unshift(record);
  if (history.length > 50) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(MUTED_KEY) === 'true';
}

export function setMuted(muted: boolean) {
  localStorage.setItem(MUTED_KEY, String(muted));
}
