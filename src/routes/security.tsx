import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck, Lock, Camera, FileUp, Radar, Clock, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSavedLanguage, isProtectionOn } from '@/lib/app-store';
import { securityT } from '@/lib/i18n/privacy-security';
import type { Language } from '@/lib/translations';
import {
  getSecurityEvents, clearSecurityEvents, getLastSecurityCheck, markSecurityCheck,
  logSecurityEvent, type SecurityEvent,
} from '@/lib/security-log';

export const Route = createFileRoute('/security')({
  component: SecurityCenter,
  head: () => ({
    meta: [
      { title: 'Security Center — Fraud Shield' },
      { name: 'description', content: 'Review protection status, permissions, upload protection and security events in Fraud Shield.' },
      { property: 'og:title', content: 'Security Center — Fraud Shield' },
      { property: 'og:description', content: 'Protection status, permission state and security events.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
});

type PermState = 'granted' | 'denied' | 'prompt' | 'unsupported';

function SecurityCenter() {
  const navigate = useNavigate();
  const [protection, setProtection] = useState(true);
  const [https, setHttps] = useState(true);
  const [camera, setCamera] = useState<PermState>('unsupported');
  const [notif, setNotif] = useState<PermState>('unsupported');
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [lastCheck, setLastCheck] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const s = securityT[lang];

  const runCheck = async () => {
    setChecking(true);
    setProtection(isProtectionOn());
    setHttps(window.location.protocol === 'https:' || window.location.hostname === 'localhost');
    try {
      if (navigator.permissions?.query) {
        const c = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCamera(c.state as PermState);
      }
    } catch { setCamera('unsupported'); }
    if (typeof Notification !== 'undefined') {
      setNotif(Notification.permission === 'default' ? 'prompt' : (Notification.permission as PermState));
    }
    markSecurityCheck();
    setLastCheck(Date.now());
    setEvents(getSecurityEvents());
    setChecking(false);
  };

  useEffect(() => {
    setLang(getSavedLanguage() ?? 'en');
    setLastCheck(getLastSecurityCheck());
    setEvents(getSecurityEvents());
    void runCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const permLabel = (p: PermState) =>
    p === 'granted' ? s.permAllowed : p === 'denied' ? s.permBlocked : p === 'prompt' ? s.permAsked : s.permNotReported;

  const items = [
    { icon: ShieldCheck, title: s.protTitle, value: protection ? s.protProtected : s.protOff, ok: protection },
    { icon: Lock, title: s.httpsTitle, value: https ? s.httpsSecure : s.httpsNotSecure, ok: https },
    { icon: Camera, title: s.cameraTitle, value: permLabel(camera), ok: camera !== 'denied' },
    { icon: Radar, title: s.notifTitle, value: permLabel(notif), ok: true },
    { icon: Lock, title: s.storageTitle, value: s.storageValue, ok: true },
    { icon: FileUp, title: s.uploadTitle, value: s.uploadValue, ok: true },
    { icon: Radar, title: s.threatTitle, value: s.threatValue, ok: true },
  ];

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
          <button onClick={() => navigate({ to: '/home' })} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="truncate font-heading text-lg font-semibold text-foreground">{s.title}</h1>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span className="truncate">{s.lastCheck.replace('{value}', lastCheck ? new Date(lastCheck).toLocaleString() : s.never)}</span>
          </div>
          <button onClick={runCheck} disabled={checking} className="flex shrink-0 items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} /> {s.recheck}
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {items.map(({ icon: Icon, title, value, ok }) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ok ? 'bg-safe/15 text-safe' : 'bg-danger/15 text-danger'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-sm font-semibold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">{s.eventsTitle}</h2>
          {events.length > 0 && (
            <button
              onClick={() => { clearSecurityEvents(); setEvents([]); logSecurityEvent('history_cleared', 'Security log cleared'); setEvents(getSecurityEvents()); }}
              className="flex items-center gap-1 text-xs text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" /> {s.clear}
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {events.length === 0 && (
            <p className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
              {s.noEvents}
            </p>
          )}
          {events.map((e) => (
            <div key={e.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3">
              <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${e.severity === 'critical' ? 'text-danger' : e.severity === 'warning' ? 'text-warning' : 'text-muted-foreground'}`} />
              <div className="min-w-0">
                <p className="text-sm text-foreground">{e.detail}</p>
                <p className="text-[11px] text-muted-foreground">{e.type.replace(/_/g, ' ')} · {new Date(e.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          {s.footerNote}
        </p>
      </div>
    </div>
  );
}
