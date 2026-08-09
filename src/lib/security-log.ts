// Local, privacy-safe security event log.
// Never stores credentials, OTPs, PINs or full payment payloads.

export type SecurityEventType =
  | 'qr_scanned'
  | 'fraud_detected'
  | 'suspicious_url_blocked'
  | 'upload_rejected'
  | 'permission_changed'
  | 'pairing_created'
  | 'pairing_expired'
  | 'history_cleared'
  | 'protection_changed';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: number;
}

const KEY = 'fraud-shield-security-log';
const MAX = 100;

const SENSITIVE = /(otp|pin|cvv|password|passwd|token|secret)/gi;

function redact(text: string): string {
  return text.replace(SENSITIVE, '[redacted]').slice(0, 160);
}

export function getSecurityEvents(): SecurityEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as SecurityEvent[];
  } catch {
    return [];
  }
}

export function logSecurityEvent(
  type: SecurityEventType,
  detail: string,
  severity: SecurityEvent['severity'] = 'info',
) {
  if (typeof window === 'undefined') return;
  const events = getSecurityEvents();
  events.unshift({
    id: crypto.randomUUID(),
    type,
    detail: redact(detail),
    severity,
    timestamp: Date.now(),
  });
  localStorage.setItem(KEY, JSON.stringify(events.slice(0, MAX)));
}

export function clearSecurityEvents() {
  localStorage.removeItem(KEY);
}

const CHECK_KEY = 'fraud-shield-last-security-check';
export function getLastSecurityCheck(): number | null {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(CHECK_KEY);
  return v ? Number(v) : null;
}
export function markSecurityCheck() {
  localStorage.setItem(CHECK_KEY, String(Date.now()));
}
