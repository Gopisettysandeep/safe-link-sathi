import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { ArrowLeft, Globe, Volume2, VolumeX, ShieldCheck, Users, Heart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  isMuted, setMuted,
  isProtectionOn, setProtectionOn,
  isFamilyMode, setFamilyMode,
  clearScanHistory,
  getSavedLanguage,
} from '@/lib/app-store';
import type { Language } from '@/lib/translations';
import { settingsT } from '@/lib/i18n/settings-trusted';

export const Route = createFileRoute('/settings')({
  component: SettingsScreen,
  head: () => ({ meta: [{ title: 'Settings — Fraud Shield' }] }),
});

function SettingsScreen() {
  const navigate = useNavigate();
  const [muted, setMutedState] = useState(false);
  const [protection, setProtection] = useState(true);
  const [family, setFamily] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const t = settingsT[lang];

  useEffect(() => {
    setMutedState(isMuted());
    setProtection(isProtectionOn());
    setFamily(isFamilyMode());
    setLang(getSavedLanguage() || 'en');
  }, []);

  const Row = ({ icon: Icon, title, desc, action }: any) => (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {action}
    </div>
  );

  const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!on)}
      className={`h-7 w-12 rounded-full p-0.5 transition ${on ? 'bg-safe' : 'bg-muted'}`}
      aria-label={t.toggle_aria}
    >
      <span className={`block h-6 w-6 rounded-full bg-primary-foreground shadow transition ${on ? 'translate-x-5' : ''}`} />
    </button>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate({ to: '/home' })} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-lg font-semibold text-foreground">{t.title}</h1>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Row icon={ShieldCheck} title={t.protection_title} desc={protection ? t.protection_on : t.protection_off}
          action={<Toggle on={protection} onChange={(v) => { setProtectionOn(v); setProtection(v); }} />} />
        <Row icon={muted ? VolumeX : Volume2} title={t.voice_title} desc={muted ? t.voice_muted : t.voice_enabled}
          action={<Toggle on={!muted} onChange={(v) => { setMuted(!v); setMutedState(!v); }} />} />
        <Row icon={Heart} title={t.family_title} desc={t.family_desc}
          action={<Toggle on={family} onChange={(v) => { setFamilyMode(v); setFamily(v); }} />} />

        <Link to="/language" className="block">
          <Row icon={Globe} title={t.language_title} desc={t.language_desc} action={<span className="text-sm text-primary">{t.language_change}</span>} />
        </Link>
        <Link to="/trusted" className="block">
          <Row icon={Users} title={t.trusted_title} desc={t.trusted_desc} action={<span className="text-sm text-primary">{t.trusted_open}</span>} />
        </Link>
        <Link to="/permissions" className="block">
          <Row icon={ShieldCheck} title={t.permissions_title} desc={t.permissions_desc} action={<span className="text-sm text-primary">{t.permissions_review}</span>} />
        </Link>

        <button
          onClick={() => { if (confirm(t.clear_history_confirm)) clearScanHistory(); }}
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger"
        >
          <Trash2 className="h-4 w-4" /> {t.clear_history}
        </button>
      </div>
    </div>
  );
}
