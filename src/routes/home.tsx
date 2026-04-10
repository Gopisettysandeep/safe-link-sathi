import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { ScanLine, Upload, Link2, History, ShieldCheck, Globe, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type Language, translations } from '@/lib/translations';
import { getSavedLanguage, saveLanguage } from '@/lib/app-store';
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

  useEffect(() => {
    const saved = getSavedLanguage();
    if (!saved) {
      navigate({ to: '/language' });
      return;
    }
    setLang(saved);
  }, [navigate]);

  const t = translations[lang];

  const mainActions = [
    {
      icon: ScanLine,
      title: t.scan_qr,
      desc: t.scan_qr_desc,
      color: 'gradient-primary',
      to: '/scan' as const,
    },
    {
      icon: Upload,
      title: t.upload_qr,
      desc: t.upload_qr_desc,
      color: 'gradient-safe',
      to: '/upload' as const,
    },
    {
      icon: Link2,
      title: t.enter_url,
      desc: t.enter_url_desc,
      color: 'gradient-warning',
      to: '/url-check' as const,
    },
  ];

  const switchLanguage = () => {
    navigate({ to: '/language' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="gradient-primary px-5 pb-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
            <h1 className="font-heading text-xl font-bold text-primary-foreground">
              {t.welcome_title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={switchLanguage}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground transition hover:bg-primary-foreground/25"
            >
              <Globe className="h-5 w-5" />
            </button>
            <VoiceButton text={t.voice_welcome} lang={lang} />
          </div>
        </div>
        <p className="mt-3 text-sm text-primary-foreground/80">{t.home_title}</p>
      </div>

      {/* Main Actions */}
      <div className="flex flex-1 flex-col gap-4 px-5 -mt-4">
        {mainActions.map(({ icon: Icon, title, desc, color, to }) => (
          <button
            key={to}
            onClick={() => navigate({ to })}
            className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-md transition-all active:scale-[0.98] hover:shadow-lg border border-border"
          >
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
            </div>
          </button>
        ))}

        {/* Bottom Actions */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            to="/history"
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md"
          >
            <History className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">{t.history}</span>
          </Link>
          <Link
            to="/tips"
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md"
          >
            <Lightbulb className="h-6 w-6 text-warning" />
            <span className="text-sm font-medium text-foreground">{t.safety_tips}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
