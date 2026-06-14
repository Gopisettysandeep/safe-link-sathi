import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck, ShieldAlert, ShieldX, RotateCcw, Home, BadgeCheck, AlertTriangle, ExternalLink, Flag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { type Language, translations } from '@/lib/translations';
import { findTrustedByUpi, getSavedLanguage, isFamilyMode } from '@/lib/app-store';
import { VoiceButton } from '@/components/VoiceButton';
import { RiskScoreCircle } from '@/components/RiskScoreCircle';
import { speak } from '@/lib/voice';
import { classifyQr, buildDeepLink, type UpiInfo } from '@/lib/qr-classify';
import { supabase } from '@/integrations/supabase/client';

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
  head: () => ({ meta: [{ title: 'Scan Result — Fraud Shield' }] }),
});

const PLATFORMS: { key: NonNullable<UpiInfo['platform']>; label: string }[] = [
  { key: 'gpay', label: 'Google Pay' },
  { key: 'phonepe', label: 'PhonePe' },
  { key: 'paytm', label: 'Paytm' },
  { key: 'bhim', label: 'BHIM' },
];

function ResultScreen() {
  const navigate = useNavigate();
  const { score, status, reasons, input, type } = Route.useSearch();
  const [lang, setLang] = useState<Language>('en');
  const [reported, setReported] = useState(false);
  const [family, setFamily] = useState(false);

  const typedStatus = status as 'safe' | 'caution' | 'fraud';
  const reasonsList = reasons.split('||').filter(Boolean);

  const classification = useMemo(() => (type === 'qr' ? classifyQr(input) : null), [type, input]);
  const trusted = classification?.upi?.payeeAddress ? findTrustedByUpi(classification.upi.payeeAddress) : undefined;

  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved) setLang(saved);
    setFamily(isFamilyMode());
  }, []);

  const t = translations[lang];

  useEffect(() => {
    const statusText = typedStatus === 'safe' ? t.completely_safe : typedStatus === 'caution' ? t.be_careful : t.fraud_detected;
    const voiceText = `${t.risk_score}: ${score}. ${statusText}. ${reasonsList[0] || ''}`;
    const timer = setTimeout(() => speak(voiceText, lang), 500);
    return () => clearTimeout(timer);
  }, [lang]);

  const statusConfig = {
    safe: { icon: ShieldCheck, message: t.result_safe, label: t.completely_safe, gradient: 'gradient-safe', bgClass: 'bg-safe/10', textClass: 'text-safe' },
    caution: { icon: ShieldAlert, message: t.result_caution, label: t.be_careful, gradient: 'gradient-warning', bgClass: 'bg-warning/10', textClass: 'text-warning' },
    fraud: { icon: ShieldX, message: t.result_fraud, label: t.fraud_detected, gradient: 'gradient-danger', bgClass: 'bg-danger/10', textClass: 'text-danger' },
  };
  const config = statusConfig[typedStatus];
  const Icon = config.icon;

  async function payWith(platform: NonNullable<UpiInfo['platform']>) {
    if (!classification?.upi) return;
    if (typedStatus === 'fraud') {
      if (!confirm('⚠️ This payment was flagged as FRAUD. Proceed anyway?')) return;
    } else if (family && typedStatus === 'caution') {
      if (!confirm('Are you sure? This payment looked suspicious.')) return;
    }
    const link = buildDeepLink(platform, classification.upi);
    window.location.href = link;
  }

  async function reportFraud() {
    const reason = prompt('Why are you reporting this? (optional)') ?? '';
    const reportType = classification?.category === 'upi' ? 'upi' : (type === 'qr' ? 'qr' : 'url');
    const { error } = await supabase.from('fraud_reports').insert({
      report_type: reportType,
      content: input.slice(0, 1900),
      reason: reason.slice(0, 500) || null,
      risk_score: score,
    });
    if (error) { alert('Failed to submit: ' + error.message); return; }
    setReported(true);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate({ to: '/home' })} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="font-heading text-lg font-semibold text-foreground">{t.risk_score}</span>
        <VoiceButton text={`${t.risk_score}: ${score}. ${config.label}. ${reasonsList[0] || ''}`} lang={lang} />
      </div>

      <div className="mt-6 flex flex-1 flex-col items-center animate-slide-up">
        {/* Non-transaction QR notice */}
        {classification && !classification.isTransaction && (
          <div className="mb-4 w-full max-w-sm rounded-2xl border border-warning/40 bg-warning/10 p-4 text-center">
            <AlertTriangle className="mx-auto h-6 w-6 text-warning" />
            <p className="mt-2 font-heading text-sm font-bold text-foreground">Non-Transaction QR Detected</p>
            <p className="mt-1 text-xs text-muted-foreground">{classification.label} — {classification.description}</p>
          </div>
        )}

        <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${config.bgClass}`}>
          <Icon className={`h-10 w-10 ${config.textClass}`} />
        </div>

        <RiskScoreCircle score={score} status={typedStatus} />

        <div className={`mt-6 rounded-full px-6 py-2 ${config.gradient}`}>
          <span className="font-heading text-sm font-bold text-primary-foreground">{config.label}</span>
        </div>

        <p className={`mt-4 text-center font-semibold ${config.textClass}`}>{config.message}</p>

        {/* UPI details */}
        {classification?.upi && (
          <div className="mt-6 w-full max-w-sm rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Payment Details</span>
              {trusted ? (
                <span className="flex items-center gap-1 rounded-full bg-safe/15 px-2 py-0.5 text-[10px] font-bold text-safe">
                  <BadgeCheck className="h-3 w-3" /> TRUSTED · {trusted.label}
                </span>
              ) : (
                <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold text-warning">UNKNOWN RECIPIENT</span>
              )}
            </div>
            <div className="mt-2 space-y-1 text-sm">
              {classification.upi.payeeName && <p><span className="text-muted-foreground">Name: </span><span className="font-semibold text-foreground">{classification.upi.payeeName}</span></p>}
              {classification.upi.payeeAddress && <p className="break-all"><span className="text-muted-foreground">UPI ID: </span><span className="font-mono text-foreground">{classification.upi.payeeAddress}</span></p>}
              {classification.upi.amount && <p><span className="text-muted-foreground">Amount: </span><span className="font-semibold text-foreground">₹{classification.upi.amount}</span></p>}
              <p><span className="text-muted-foreground">Platform: </span><span className="font-semibold capitalize text-foreground">{classification.upi.platform}</span></p>
            </div>
          </div>
        )}

        {/* Reasons */}
        <div className="mt-4 w-full max-w-sm space-y-2">
          {reasonsList.map((reason: string, i: number) => (
            <div key={i} className="rounded-xl border border-border bg-card p-3 text-sm text-foreground">• {reason}</div>
          ))}
        </div>

        {/* Scanned input */}
        <div className="mt-3 w-full max-w-sm rounded-xl bg-muted p-3">
          <p className="text-xs text-muted-foreground">Scanned content:</p>
          <p className="mt-1 break-all text-xs font-mono text-foreground">{input}</p>
        </div>

        {/* Payment continuation */}
        {classification?.upi && typedStatus !== 'fraud' && (
          <div className="mt-6 w-full max-w-sm">
            <p className="mb-2 text-center text-xs font-semibold uppercase text-muted-foreground">Continue payment via</p>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(p => (
                <button key={p.key} onClick={() => payWith(p.key)} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-sm font-semibold text-foreground transition active:scale-95">
                  <ExternalLink className="h-4 w-4 text-primary" /> {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Report fraud */}
        {typedStatus !== 'safe' && (
          <button
            onClick={reportFraud}
            disabled={reported}
            className="mt-6 flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger transition active:scale-95 disabled:opacity-50"
          >
            <Flag className="h-4 w-4" /> {reported ? 'Reported — Thank you!' : 'Report as Fraud (Community)'}
          </button>
        )}

        {/* Actions */}
        <div className="mt-6 mb-2 flex w-full max-w-sm gap-3">
          <button onClick={() => navigate({ to: '/home' })} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-4 py-3 font-semibold text-foreground transition active:scale-95">
            <RotateCcw className="h-4 w-4" /> {t.scan_again}
          </button>
          <button onClick={() => navigate({ to: '/home' })} className="flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-primary px-4 py-3 font-semibold text-primary-foreground transition active:scale-95">
            <Home className="h-4 w-4" /> {t.go_back}
          </button>
        </div>
      </div>
    </div>
  );
}
