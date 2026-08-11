import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShieldOff, Database, Trash2, EyeOff, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';
import { clearScanHistory, getScanHistory, getTrustedRecipients, removeTrustedRecipient, getSavedLanguage } from '@/lib/app-store';
import { clearSecurityEvents, logSecurityEvent } from '@/lib/security-log';
import { privacyT } from '@/lib/i18n/privacy-security';
import type { Language } from '@/lib/translations';

export const Route = createFileRoute('/privacy')({
  component: PrivacyCenter,
  head: () => ({
    meta: [
      { title: 'Privacy Center — Fraud Shield' },
      { name: 'description', content: 'See exactly what Fraud Shield stores on your device and clear it at any time.' },
      { property: 'og:title', content: 'Privacy Center — Fraud Shield' },
      { property: 'og:description', content: 'What Fraud Shield stores, and how to erase it.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
});

function PrivacyCenter() {
  const navigate = useNavigate();
  const [historyCount, setHistoryCount] = useState(0);
  const [trustedCount, setTrustedCount] = useState(0);
  const [lang, setLang] = useState<Language>('en');
  const t = privacyT[lang];

  useEffect(() => {
    setLang(getSavedLanguage() ?? 'en');
  }, []);

  const refresh = () => {
    setHistoryCount(getScanHistory().length);
    setTrustedCount(getTrustedRecipients().length);
  };
  useEffect(refresh, []);

  const never = [t.never_otp, t.never_upipin, t.never_passwords, t.never_cvv, t.never_bankcreds];
  const stored = [
    { label: t.stored_scanhistory_label, detail: t.stored_scanhistory_detail },
    { label: t.stored_trusted_label, detail: t.stored_trusted_detail },
    { label: t.stored_prefs_label, detail: t.stored_prefs_detail },
    { label: t.stored_community_label, detail: t.stored_community_detail },
  ];

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
          <button onClick={() => navigate({ to: '/home' })} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="truncate font-heading text-lg font-semibold text-foreground">{t.title}</h1>
        </div>

        <div className="mt-5 rounded-2xl border border-safe/40 bg-safe/10 p-4">
          <div className="flex items-center gap-2">
            <ShieldOff className="h-5 w-5 text-safe" />
            <h2 className="font-heading text-sm font-semibold text-foreground">{t.neverTitle}</h2>
          </div>
          <ul className="mt-2 list-disc pl-8 text-sm text-muted-foreground">
            {never.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>

        <h2 className="mt-6 font-heading text-base font-semibold text-foreground">{t.whatStored}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {stored.map((s) => (
            <div key={s.label} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <Database className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <h3 className="font-heading text-sm font-semibold text-foreground">{s.label}</h3>
                <p className="text-xs text-muted-foreground">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
          <Wifi className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground">{t.needsInternet_title}</h3>
            <p className="text-xs text-muted-foreground">{t.needsInternet_detail}</p>
          </div>
        </div>

        <h2 className="mt-6 font-heading text-base font-semibold text-foreground">{t.eraseData_title}</h2>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            onClick={() => { if (confirm(t.clearScanHistory_confirm.replace('{count}', String(historyCount)))) { clearScanHistory(); logSecurityEvent('history_cleared', 'Scan history cleared by user'); refresh(); } }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
          >
            <Trash2 className="h-4 w-4" /> {t.clearScanHistory_btn.replace('{count}', String(historyCount))}
          </button>
          <button
            onClick={() => { if (confirm(t.clearTrusted_confirm.replace('{count}', String(trustedCount)))) { getTrustedRecipients().forEach((r) => removeTrustedRecipient(r.id)); refresh(); } }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
          >
            <Trash2 className="h-4 w-4" /> {t.clearTrusted_btn.replace('{count}', String(trustedCount))}
          </button>
          <button
            onClick={() => { if (confirm(t.clearSecurityLog_confirm)) { clearSecurityEvents(); refresh(); } }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
          >
            <EyeOff className="h-4 w-4" /> {t.clearSecurityLog_btn}
          </button>
        </div>
      </div>
    </div>
  );
}
