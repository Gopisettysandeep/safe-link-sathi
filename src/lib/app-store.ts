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

export interface TrustedRecipient {
  id: string;
  label: string; // e.g. "Mother", "Shop Owner"
  upiId: string;
  addedAt: number;
}

const LANG_KEY = 'fraud-shield-lang';
const HISTORY_KEY = 'fraud-shield-history';
const MUTED_KEY = 'fraud-shield-muted';
const PROTECTION_KEY = 'fraud-shield-protection';
const PERMS_KEY = 'fraud-shield-perms-seen';
const TRUSTED_KEY = 'fraud-shield-trusted';
const FAMILY_KEY = 'fraud-shield-family-mode';

export function getSavedLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LANG_KEY) as Language | null;
}
export function saveLanguage(lang: Language) {
  localStorage.setItem(LANG_KEY, lang);
}

export function getScanHistory(): ScanRecord[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
export function addScanRecord(record: ScanRecord) {
  const history = getScanHistory();
  history.unshift(record);
  if (history.length > 100) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
export function clearScanHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(MUTED_KEY) === 'true';
}
export function setMuted(muted: boolean) {
  localStorage.setItem(MUTED_KEY, String(muted));
}

// Protection toggle
export function isProtectionOn(): boolean {
  if (typeof window === 'undefined') return true;
  const v = localStorage.getItem(PROTECTION_KEY);
  return v === null ? true : v === 'true';
}
export function setProtectionOn(on: boolean) {
  localStorage.setItem(PROTECTION_KEY, String(on));
}

// Permissions screen seen
export function hasSeenPermissions(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(PERMS_KEY) === 'true';
}
export function markPermissionsSeen() {
  localStorage.setItem(PERMS_KEY, 'true');
}

// Family mode
export function isFamilyMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(FAMILY_KEY) === 'true';
}
export function setFamilyMode(on: boolean) {
  localStorage.setItem(FAMILY_KEY, String(on));
}

// Trusted recipients
export function getTrustedRecipients(): TrustedRecipient[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(TRUSTED_KEY) || '[]'); } catch { return []; }
}
export function addTrustedRecipient(r: Omit<TrustedRecipient, 'id' | 'addedAt'>) {
  const list = getTrustedRecipients();
  list.unshift({ ...r, id: crypto.randomUUID(), addedAt: Date.now() });
  localStorage.setItem(TRUSTED_KEY, JSON.stringify(list));
}
export function removeTrustedRecipient(id: string) {
  const list = getTrustedRecipients().filter(r => r.id !== id);
  localStorage.setItem(TRUSTED_KEY, JSON.stringify(list));
}
export function findTrustedByUpi(upiId: string): TrustedRecipient | undefined {
  return getTrustedRecipients().find(r => r.upiId.toLowerCase() === upiId.toLowerCase());
}
