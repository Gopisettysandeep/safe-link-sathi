import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck, ShieldAlert, ShieldX, RotateCcw, Home, BadgeCheck, AlertTriangle, ExternalLink, Flag, Monitor, Copy, Check, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { type Language, translations } from '@/lib/translations';
import { findTrustedByUpi, getSavedLanguage, isFamilyMode } from '@/lib/app-store';
import { VoiceButton } from '@/components/VoiceButton';
import { RiskScoreCircle } from '@/components/RiskScoreCircle';
import { speak } from '@/lib/voice';
import { classifyQr, buildDeepLink, type UpiInfo, type PayPlatform } from '@/lib/qr-classify';
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

const PLATFORMS: { key: PayPlatform; label: string; color: string }[] = [
  { key: 'gpay', label: 'Google Pay', color: 'from-blue-500 to-green-500' },
  { key: 'phonepe', label: 'PhonePe', color: 'from-purple-600 to-indigo-600' },
  { key: 'paytm', label: 'Paytm', color: 'from-sky-500 to-blue-600' },
  { key: 'bhim', label: 'BHIM', color: 'from-orange-500 to-red-500' },
  { key: 'amazonpay', label: 'Amazon Pay', color: 'from-yellow-500 to-orange-500' },
  { key: 'other', label: 'Other UPI App', color: 'from-slate-500 to-slate-700' },
];

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
}

function ResultScreen() {
  const navigate = useNavigate();
  const { score, status, reasons, input, type } = Route.useSearch();
  const [lang, setLang] = useState<Language>('en');
  const [reported, setReported] = useState(false);
  const [family, setFamily] = useState(false);
  const [showPayPicker, setShowPayPicker] = useState(false);
  const [fraudOverrideStep, setFraudOverrideStep] = useState(0);
  const [showDesktopBridge, setShowDesktopBridge] = useState(false);
  const [verifiedQrDataUrl, setVerifiedQrDataUrl] = useState<string>('');
  const [pairCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [pairSent, setPairSent] = useState(false);
  const pairChRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const typedStatus = status as 'safe' | 'caution' | 'fraud';
  const reasonsList = reasons.split('||').filter(Boolean);

  const classification = useMemo(() => (type === 'qr' ? classifyQr(input) : null), [type, input]);
  const trusted = classification?.upi?.payeeAddress ? findTrustedByUpi(classification.upi.payeeAddress) : undefined;
  const isDesktop = !isMobileDevice();

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

  // Auto-open payment picker for SAFE payments
  useEffect(() => {
    if (typedStatus === 'safe' && classification?.upi) setShowPayPicker(true);
  }, [typedStatus, classification]);

  const statusConfig = {
    safe: { icon: ShieldCheck, message: t.result_safe, label: t.completely_safe, gradient: 'gradient-safe', bgClass: 'bg-safe/10', textClass: 'text-safe', ringClass: 'ring-safe/30' },
    caution: { icon: ShieldAlert, message: t.result_caution, label: t.be_careful, gradient: 'gradient-warning', bgClass: 'bg-warning/10', textClass: 'text-warning', ringClass: 'ring-warning/30' },
    fraud: { icon: ShieldX, message: t.result_fraud, label: t.fraud_detected, gradient: 'gradient-danger', bgClass: 'bg-danger/10', textClass: 'text-danger', ringClass: 'ring-danger/30' },
  };
  const config = statusConfig[typedStatus];
  const Icon = config.icon;

  async function generateVerifiedBridge() {
    if (!classification?.upi) return;
    const uri = buildDeepLink('other', classification.upi);
    const dataUrl = await QRCode.toDataURL(uri, { width: 260, margin: 1, color: { dark: '#0f172a', light: '#ffffff' } });
    setVerifiedQrDataUrl(dataUrl);

    // Publish verified payload over realtime under pair code so mobile Fraud Shield can pick up
    const ch = supabase.channel(`pair-${pairCode}`, { config: { broadcast: { self: false } } });
    ch.on('broadcast', { event: 'hello' }, async () => {
      await ch.send({
        type: 'broadcast',
        event: 'verified-payment',
        payload: { upi: classification.upi, score, status: typedStatus, reasons: reasonsList },
      });
      setPairSent(true);
    });
    await ch.subscribe();
    pairChRef.current = ch;
    setShowDesktopBridge(true);
  }

  useEffect(() => () => {
    if (pairChRef.current) supabase.removeChannel(pairChRef.current);
  }, []);

  async function launchApp(platform: PayPlatform) {
    if (!classification?.upi) return;
    // Desktop → no UPI apps; open verified bridge instead
    if (isDesktop) {
      await generateVerifiedBridge();
      return;
    }
    const link = buildDeepLink(platform, classification.upi);
    window.location.href = link;
  }

  function onSelectPlatform(platform: PayPlatform) {
    if (typedStatus === 'fraud') {
      // Require two confirmations
      if (fraudOverrideStep < 2) {
        const step = fraudOverrideStep + 1;
        const msg = step === 1
          ? '🚨 This QR was flagged as FRAUD. Are you absolutely sure you want to continue?'
          : '⚠️ FINAL WARNING — you may lose your money. Proceed?';
        if (!confirm(msg)) { setFraudOverrideStep(0); return; }
        setFraudOverrideStep(step);
        if (step < 2) return;
      }
    } else if (typedStatus === 'caution' && family) {
      if (!confirm('This payment looked suspicious. Continue?')) return;
    }
    launchApp(platform);
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

  function copyPairCode() {
    navigator.clipboard.writeText(pairCode);
  }

  const showContinueSection = classification?.upi && (typedStatus === 'safe' || (typedStatus === 'caution' && showPayPicker) || (typedStatus === 'fraud' && fraudOverrideStep >= 1));

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
        {classification && !classification.isTransaction && (
          <div className="mb-4 w-full max-w-sm rounded-2xl border border-warning/40 bg-warning/10 p-4 text-center">
            <AlertTriangle className="mx-auto h-6 w-6 text-warning" />
            <p className="mt-2 font-heading text-sm font-bold text-foreground">Non-Transaction QR Detected</p>
            <p className="mt-1 text-xs text-muted-foreground">{classification.label} — {classification.description}</p>
          </div>
        )}

        <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${config.bgClass} ring-4 ${config.ringClass}`}>
          <Icon className={`h-10 w-10 ${config.textClass}`} />
        </div>

        <RiskScoreCircle score={score} status={typedStatus} />

        <div className={`mt-6 rounded-full px-6 py-2 ${config.gradient}`}>
          <span className="font-heading text-sm font-bold text-primary-foreground">{config.label}</span>
        </div>

        <p className={`mt-4 text-center font-semibold ${config.textClass}`}>{config.message}</p>

        {classification?.upi && (
          <div className="mt-6 w-full max-w-sm rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Recipient Details</span>
              {trusted ? (
                <span className="flex items-center gap-1 rounded-full bg-safe/15 px-2 py-0.5 text-[10px] font-bold text-safe">
                  <BadgeCheck className="h-3 w-3" /> TRUSTED · {trusted.label}
                </span>
              ) : (
                <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold text-warning">UNKNOWN RECIPIENT</span>
              )}
            </div>
            <div className="mt-2 space-y-1 text-sm">
              {classification.upi.payeeName && <p><span className="text-muted-foreground">Merchant: </span><span className="font-semibold text-foreground">{classification.upi.payeeName}</span></p>}
              {classification.upi.payeeAddress && <p className="break-all"><span className="text-muted-foreground">UPI ID: </span><span className="font-mono text-foreground">{classification.upi.payeeAddress}</span></p>}
              {classification.upi.amount && <p><span className="text-muted-foreground">Amount: </span><span className="font-semibold text-foreground">₹{classification.upi.amount}</span></p>}
              <p><span className="text-muted-foreground">Transaction Type: </span><span className="font-semibold text-foreground">UPI Payment</span></p>
              <p><span className="text-muted-foreground">Platform: </span><span className="font-semibold capitalize text-foreground">{classification.upi.platform}</span></p>
            </div>
          </div>
        )}

        <div className="mt-4 w-full max-w-sm space-y-2">
          {reasonsList.map((reason: string, i: number) => (
            <div key={i} className="flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm text-foreground">
              <span className={typedStatus === 'safe' ? 'text-safe' : typedStatus === 'caution' ? 'text-warning' : 'text-danger'}>
                {typedStatus === 'safe' ? '✔' : typedStatus === 'caution' ? '⚠' : '✕'}
              </span>
              <span>{reason}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 w-full max-w-sm rounded-xl bg-muted p-3">
          <p className="text-xs text-muted-foreground">Scanned content:</p>
          <p className="mt-1 break-all text-xs font-mono text-foreground">{input}</p>
        </div>

        {/* CAUTION prompt */}
        {classification?.upi && typedStatus === 'caution' && !showPayPicker && (
          <div className="mt-6 w-full max-w-sm rounded-2xl border-2 border-warning/50 bg-warning/5 p-4">
            <p className="text-center text-sm font-semibold text-foreground">⚠ This payment appears suspicious.</p>
            <p className="mt-1 text-center text-xs text-muted-foreground">Review the reasons above before continuing.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => navigate({ to: '/home' })} className="flex items-center justify-center gap-1 rounded-xl border border-border bg-card px-3 py-3 text-sm font-semibold">
                <X className="h-4 w-4" /> Cancel
              </button>
              <button onClick={() => setShowPayPicker(true)} className="rounded-xl bg-warning px-3 py-3 text-sm font-semibold text-primary-foreground">
                Proceed Anyway
              </button>
            </div>
          </div>
        )}

        {/* FRAUD block */}
        {classification?.upi && typedStatus === 'fraud' && fraudOverrideStep === 0 && (
          <div className="mt-6 w-full max-w-sm rounded-2xl border-2 border-danger/60 bg-danger/5 p-4">
            <p className="text-center font-heading font-bold text-danger">🚨 Fraud Detected</p>
            <p className="mt-1 text-center text-xs text-muted-foreground">Payment continuation is blocked for your safety.</p>
            <div className="mt-4 grid grid-cols-1 gap-2">
              <button onClick={reportFraud} disabled={reported} className="rounded-xl bg-danger px-3 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                <Flag className="mr-1 inline h-4 w-4" /> {reported ? 'Reported' : 'Report QR'}
              </button>
              <button onClick={() => navigate({ to: '/scan' })} className="rounded-xl border border-border bg-card px-3 py-3 text-sm font-semibold">
                Scan Another QR
              </button>
              <button onClick={() => setFraudOverrideStep(1)} className="rounded-xl border border-danger/40 px-3 py-2 text-xs text-danger">
                Override (requires double confirmation)
              </button>
            </div>
          </div>
        )}

        {/* Payment app picker */}
        {showContinueSection && (
          <div className="mt-6 w-full max-w-sm">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {isDesktop ? 'Desktop → Mobile Bridge' : 'Select Your Preferred Payment App'}
            </p>
            {isDesktop && (
              <p className="mb-3 rounded-lg bg-muted p-2 text-center text-[11px] text-muted-foreground">
                <Monitor className="mr-1 inline h-3 w-3" /> No UPI app on desktop. Tap any app to open a verified bridge.
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.key}
                  onClick={() => onSelectPlatform(p.key)}
                  className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br ${p.color} px-3 py-4 text-sm font-semibold text-white shadow-md transition active:scale-95`}
                >
                  <ExternalLink className="h-4 w-4" /> {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop bridge display */}
        {showDesktopBridge && verifiedQrDataUrl && (
          <div className="mt-6 w-full max-w-sm rounded-2xl border border-border bg-card p-4 text-center">
            <p className="font-heading text-sm font-bold text-foreground">Scan this verified QR on mobile</p>
            <img src={verifiedQrDataUrl} alt="Verified QR" className="mx-auto my-3 rounded-lg border border-border" />
            <p className="text-xs text-muted-foreground">or share pair code with mobile Fraud Shield</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <code className="rounded-lg bg-muted px-3 py-1 font-mono text-lg font-bold tracking-widest text-foreground">{pairCode}</code>
              <button onClick={copyPairCode} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            {pairSent && <p className="mt-2 flex items-center justify-center gap-1 text-xs text-safe"><Check className="h-3 w-3" /> Sent to mobile</p>}
          </div>
        )}

        {/* Report fraud (caution) */}
        {typedStatus === 'caution' && (
          <button
            onClick={reportFraud}
            disabled={reported}
            className="mt-6 flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger transition active:scale-95 disabled:opacity-50"
          >
            <Flag className="h-4 w-4" /> {reported ? 'Reported — Thank you!' : 'Report as Fraud (Community)'}
          </button>
        )}

        <div className="mt-6 mb-2 flex w-full max-w-sm gap-3">
          <button onClick={() => navigate({ to: '/scan' })} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-4 py-3 font-semibold text-foreground transition active:scale-95">
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
