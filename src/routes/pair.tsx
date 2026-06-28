import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Smartphone, Monitor, Copy, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { analyzeQrContent } from '@/lib/fraud-detection';
import { addScanRecord } from '@/lib/app-store';

export const Route = createFileRoute('/pair')({
  component: PairScreen,
  head: () => ({ meta: [{ title: 'Desktop Pairing — Fraud Shield' }] }),
});

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function PairScreen() {
  const navigate = useNavigate();
  const [code] = useState(genCode);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'waiting' | 'paired' | 'received'>('waiting');
  const [manualCode, setManualCode] = useState('');
  const [manualContent, setManualContent] = useState('');
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);

  // Desktop: subscribe to its own code and wait for mobile to send scan
  useEffect(() => {
    if (isMobile) return;
    const ch = supabase.channel(`pair-${code}`, { config: { broadcast: { self: false } } });
    ch.on('broadcast', { event: 'scan' }, (msg: any) => {
      const content = msg.payload?.content as string;
      if (!content) return;
      setStatus('received');
      const result = analyzeQrContent(content);
      addScanRecord({
        id: crypto.randomUUID(),
        type: 'qr',
        input: content,
        score: result.score,
        status: result.status,
        explanation: result.reasons.join(' '),
        timestamp: Date.now(),
      });
      setTimeout(() => {
        navigate({
          to: '/result',
          search: { score: result.score, status: result.status, reasons: result.reasons.join('||'), input: content, type: 'qr' },
        });
      }, 800);
    });
    ch.on('broadcast', { event: 'hello' }, () => setStatus('paired'));
    ch.subscribe();
    channelRef.current = ch;
    return () => { supabase.removeChannel(ch); };
  }, [code, isMobile, navigate]);

  async function sendFromMobile() {
    if (!manualCode || !manualContent) return;
    const ch = supabase.channel(`pair-${manualCode}`, { config: { broadcast: { self: false } } });
    await ch.subscribe();
    await ch.send({ type: 'broadcast', event: 'hello', payload: {} });
    await ch.send({ type: 'broadcast', event: 'scan', payload: { content: manualContent } });
    setStatus('paired');
    alert('Sent to desktop!');
    supabase.removeChannel(ch);
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate({ to: '/home' })} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-lg font-semibold text-foreground">Desktop ↔ Mobile Pairing</h1>
      </div>

      {!isMobile ? (
        <div className="mt-8 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary">
            <Monitor className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Open Fraud Shield on your phone, go to <b>Pair</b>, and enter this code:
          </p>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-primary/40 bg-primary/5 px-6 py-4">
            <span className="font-mono text-4xl font-bold tracking-widest text-foreground">{code}</span>
            <button onClick={copyCode} className="rounded-full bg-primary/10 p-2 text-primary">
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
          <div className="mt-6 rounded-full bg-muted px-4 py-2 text-xs font-semibold uppercase text-muted-foreground">
            {status === 'waiting' && 'Waiting for phone…'}
            {status === 'paired' && '📱 Phone connected'}
            {status === 'received' && '✅ Scan received — analyzing'}
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-safe">
            <Smartphone className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">Enter the 6-digit code shown on your desktop and paste/scan QR content to send it for analysis.</p>

          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            className="mt-6 w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-center font-mono text-2xl tracking-widest text-foreground"
          />
          <textarea
            value={manualContent}
            onChange={(e) => setManualContent(e.target.value)}
            placeholder="Paste QR content or transaction URL here…"
            rows={4}
            className="mt-3 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground"
          />
          <button
            onClick={sendFromMobile}
            disabled={manualCode.length !== 6 || !manualContent}
            className="mt-4 w-full rounded-2xl gradient-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            Send to Desktop
          </button>
        </div>
      )}
    </div>
  );
}
