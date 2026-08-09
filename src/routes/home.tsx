import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { ScanLine, Upload, Link2, History, ShieldCheck, Globe, Lightbulb, Settings, Users, AlertOctagon, Activity, BookOpen, Smartphone, Lock, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type Language, translations } from '@/lib/translations';
import { extraTranslations } from '@/lib/translations-extra';
import { getSavedLanguage, hasSeenPermissions, isProtectionOn, setProtectionOn } from '@/lib/app-store';
import { logSecurityEvent } from '@/lib/security-log';
import { VoiceButton } from '@/components/VoiceButton';


export const Route = createFileRoute('/home')({
  component: HomeScreen,
  head: () => ({
    meta: [
      { title: 'Fraud Shield — Verify Transactions' },
      { name: 'description', content: 'Scan QR codes, upload images, or enter URLs to detect fraud in online transactions.' },
    ],
  }),
});

function HomeScreen() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('en');
  const [protection, setProtection] = useState(true);

  useEffect(() => {
    const saved = getSavedLanguage();
    if (!saved) { navigate({ to: '/language' }); return; }
    if (!hasSeenPermissions()) { navigate({ to: '/permissions' }); return; }
    setLang(saved);
    setProtection(isProtectionOn());
  }, [navigate]);

  const t = translations[lang];
  const x = extraTranslations[lang];

  const mainActions = [
    { icon: ScanLine, title: t.scan_qr, desc: t.scan_qr_desc, color: 'gradient-primary', to: '/scan' as const },
    { icon: Upload, title: t.upload_qr, desc: t.upload_qr_desc, color: 'gradient-safe', to: '/upload' as const },
    { icon: Link2, title: t.enter_url, desc: t.enter_url_desc, color: 'gradient-warning', to: '/url-check' as const },
  ];

  function toggleProtection() {
    const next = !protection;
    setProtectionOn(next);
    setProtection(next);
    logSecurityEvent('protection_changed', `Protection turned ${next ? 'ON' : 'OFF'}`, next ? 'info' : 'warning');
  }


  return (
    <div className="flex min-h-screen flex-col bg-background pb-8">
      {/* Header */}
      <div className="gradient-primary px-5 pb-10 pt-6">
        <div className="mx-auto w-full max-w-3xl">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <button onClick={() => navigate({ to: '/settings' })} aria-label={x.settings} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground">
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex min-w-0 items-center justify-center gap-2">
              <ShieldCheck className="h-6 w-6 shrink-0 text-primary-foreground" />
              <span className="truncate font-heading text-lg font-bold text-primary-foreground">{t.welcome_title}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button onClick={() => navigate({ to: '/language' })} aria-label="Language" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground">
                <Globe className="h-5 w-5" />
              </button>
              <VoiceButton text={t.voice_welcome} lang={lang} />
            </div>
          </div>

          {/* Protection Toggle */}
          <button
            onClick={toggleProtection}
            aria-pressed={protection}
            className={`mt-6 grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl border-2 p-4 transition ${protection ? 'border-safe/40 bg-safe/10' : 'border-danger/40 bg-danger/15'}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${protection ? 'bg-safe' : 'bg-danger'}`}>
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                {protection && <span className="absolute inset-0 animate-ping rounded-full bg-safe/60" />}
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate font-heading text-base font-bold text-primary-foreground">{protection ? x.protection_on : x.protection_off}</p>
                <p className="text-xs text-primary-foreground/80">{protection ? x.protection_on_desc : x.protection_off_desc}</p>
              </div>
            </div>
            <span className={`h-3 w-3 shrink-0 rounded-full ${protection ? 'bg-safe shadow-[0_0_12px_var(--safe)]' : 'bg-danger'}`} />
          </button>
        </div>
      </div>

      {/* Main Actions */}
      <div className="-mt-4 mx-auto flex w-full max-w-3xl flex-col gap-3 px-5">
        <div className="grid gap-3 md:grid-cols-3">
          {mainActions.map(({ icon: Icon, title, desc, color, to }) => (
            <button key={to} onClick={() => navigate({ to })} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-md transition-all hover:shadow-lg active:scale-[0.98]">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="min-w-0 text-left">
                <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Secondary actions */}
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {[
            { to: '/history' as const, icon: History, label: t.history },
            { to: '/trusted' as const, icon: Users, label: x.trusted },
            { to: '/dashboard' as const, icon: Activity, label: x.dashboard },
            { to: '/community' as const, icon: AlertOctagon, label: x.community },
            { to: '/education' as const, icon: BookOpen, label: x.learn },
            { to: '/pair' as const, icon: Smartphone, label: x.pair },
            { to: '/security' as const, icon: Lock, label: x.security_center },
            { to: '/privacy' as const, icon: EyeOff, label: x.privacy_center },
            { to: '/tips' as const, icon: Lightbulb, label: t.safety_tips },
            { to: '/settings' as const, icon: Settings, label: x.settings },
          ].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 text-center transition hover:shadow-md">
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-[11px] font-medium text-foreground">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

}
