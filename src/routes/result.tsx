import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck, ShieldAlert, ShieldX, RotateCcw, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type Language, translations } from '@/lib/translations';
import { getSavedLanguage } from '@/lib/app-store';
import { VoiceButton } from '@/components/VoiceButton';
import { RiskScoreCircle } from '@/components/RiskScoreCircle';
import { speak } from '@/lib/voice';

type ResultSearch = {
  score: number;
  status: string;
  reasons: string;
  input: string;
  type: string;
};

export const Route = createFileRoute('/result')({
  component: ResultScreen,
  validateSearch: (search: Record<string, unknown>): ResultSearch => ({
    score: Number(search.score) || 0,
    status: String(search.status || 'safe'),
    reasons: String(search.reasons || ''),
    input: String(search.input || ''),
    type: String(search.type || 'url'),
  }),
  head: () => ({
    meta: [
      { title: 'Scan Result — Fraud Shield' },
      { name: 'description', content: 'View the fraud detection result for your scanned QR or URL.' },
    ],
  }),
});

function ResultScreen() {
  const navigate = useNavigate();
  const { score, status, reasons, input } = Route.useSearch();
  const [lang, setLang] = useState<Language>('en');

  const typedStatus = status as 'safe' | 'caution' | 'fraud';
  const reasonsList = reasons.split('||').filter(Boolean);

  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved) setLang(saved);
  }, []);

  const t = translations[lang];

  // Auto-speak result
  useEffect(() => {
    const statusText = typedStatus === 'safe' ? t.completely_safe : typedStatus === 'caution' ? t.be_careful : t.fraud_detected;
    const voiceText = `${t.risk_score}: ${score}. ${statusText}. ${reasonsList[0] || ''}`;
    const timer = setTimeout(() => speak(voiceText, lang), 500);
    return () => clearTimeout(timer);
  }, [lang]);

  const statusConfig = {
    safe: {
      icon: ShieldCheck,
      message: t.result_safe,
      label: t.completely_safe,
      gradient: 'gradient-safe',
      bgClass: 'bg-safe/10',
      textClass: 'text-safe',
    },
    caution: {
      icon: ShieldAlert,
      message: t.result_caution,
      label: t.be_careful,
      gradient: 'gradient-warning',
      bgClass: 'bg-warning/10',
      textClass: 'text-warning',
    },
    fraud: {
      icon: ShieldX,
      message: t.result_fraud,
      label: t.fraud_detected,
      gradient: 'gradient-danger',
      bgClass: 'bg-danger/10',
      textClass: 'text-danger',
    },
  };

  const config = statusConfig[typedStatus];
  const Icon = config.icon;

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: '/home' })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="font-heading text-lg font-semibold text-foreground">{t.risk_score}</span>
        <VoiceButton
          text={`${t.risk_score}: ${score}. ${config.label}. ${reasonsList[0] || ''}`}
          lang={lang}
        />
      </div>

      <div className="mt-8 flex flex-1 flex-col items-center animate-slide-up">
        {/* Status Icon */}
        <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${config.bgClass}`}>
          <Icon className={`h-10 w-10 ${config.textClass}`} />
        </div>

        {/* Score Circle */}
        <RiskScoreCircle score={score} status={typedStatus} />

        {/* Status Label */}
        <div className={`mt-6 rounded-full px-6 py-2 ${config.gradient}`}>
          <span className="font-heading text-sm font-bold text-primary-foreground">
            {config.label}
          </span>
        </div>

        {/* Message */}
        <p className={`mt-4 text-center font-semibold ${config.textClass}`}>
          {config.message}
        </p>

        {/* Reasons */}
        <div className="mt-6 w-full max-w-sm space-y-2">
          {reasonsList.map((reason: string, i: number) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-3 text-sm text-foreground"
            >
              • {reason}
            </div>
          ))}
        </div>

        {/* Scanned Input */}
        <div className="mt-4 w-full max-w-sm rounded-xl bg-muted p-3">
          <p className="text-xs text-muted-foreground">Scanned content:</p>
          <p className="mt-1 break-all text-sm font-mono text-foreground">{input}</p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex w-full max-w-sm gap-3">
          <button
            onClick={() => navigate({ to: '/home' })}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-4 py-3 font-semibold text-foreground transition active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            {t.scan_again}
          </button>
          <button
            onClick={() => navigate({ to: '/home' })}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-primary px-4 py-3 font-semibold text-primary-foreground transition active:scale-95"
          >
            <Home className="h-4 w-4" />
            {t.go_back}
          </button>
        </div>
      </div>
    </div>
  );
}
