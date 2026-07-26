import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Smartphone, Monitor, Copy, Check, Camera } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { analyzeQrContent } from '@/lib/fraud-detection';
import { addScanRecord } from '@/lib/app-store';
import { decodeFromVideo } from '@/lib/qr-decode';

export const Route = createFileRoute('/pair')({
  component: PairScreen,
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === 'string' ? search.code.replace(/\D/g, '').slice(0, 6) : undefined,
  }),
  head: () => ({
    meta: [
      { title: 'Desktop Pairing — Fraud Shield' },
      { name: 'description', content: 'Pair your phone with desktop Fraud Shield to scan QR codes.' },
    ],
  }),
});

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function PairScreen() {
  const navigate = useNavigate();
  const { code: incomingCode } = Route.useSearch();
  const [code] = useState(genCode);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'waiting' | 'paired' | 'received'>('waiting');
  const [manualCode, setManualCode] = useState(incomingCode ?? '');
  const [manualContent, setManualContent] = useState('');
  const [liveScan, setLiveScan] = useState(false);
  const [sent, setSent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isMobile =
    typeof navigator !== 'undefined' && (/Mobi|Android/i.test(navigator.userAgent) || !!incomingCode);

  // Desktop: listen on its own code
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
          search: {
            score: result.score,
            status: result.status,
            reasons: result.reasons.join('||'),
            input: content,
            type: 'qr',
          },
        });
      }, 800);
    });
    ch.on('broadcast', { event: 'hello' }, () => setStatus('paired'));
    ch.subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [code, isMobile, navigate]);

  // Mobile: live camera scan → broadcast to desktop
  useEffect(() => {
    if (!liveScan) return;
    let active = true;
    let raf = 0;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        let detector: any;
        if ('BarcodeDetector' in window) {
          try {
            detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
          } catch {
            detector = undefined;
          }
        }
        let busy = false;
        const loop = async () => {
          if (!active || !videoRef.current) return;
          if (!busy) {
            busy = true;
            const value = await decodeFromVideo(videoRef.current, detector);
            busy = false;
            if (value) {
              setManualContent(value);
              setLiveScan(false);
              await sendToDesktop(manualCode, value);
              return;
            }
          }
          raf = requestAnimationFrame(loop);
        };
        loop();
      } catch {
        setLiveScan(false);
      }
    })();

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveScan, manualCode]);

  async function sendToDesktop(targetCode: string, content: string) {
    if (targetCode.length !== 6 || !content) return;
    const ch = supabase.channel(`pair-${targetCode}`, { config: { broadcast: { self: false } } });
    await ch.subscribe();
    await ch.send({ type: 'broadcast', event: 'hello', payload: {} });
    await ch.send({ type: 'broadcast', event: 'scan', payload: { content } });
    setStatus('paired');
    setSent(true);
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
        <button
          onClick={() => navigate({ to: '/home' })}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="truncate font-heading text-lg font-semibold text-foreground">
          Desktop ↔ Mobile Pairing
        </h1>
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
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Enter the 6-digit code shown on your desktop, then scan the payment QR with your phone camera
            or paste its content.
          </p>

          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            inputMode="numeric"
            className="mt-6 w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-center font-mono text-2xl tracking-widest text-foreground"
          />

          {liveScan ? (
            <div className="relative mt-4 w-full overflow-hidden rounded-2xl">
              <video ref={videoRef} className="h-64 w-full object-cover" playsInline muted autoPlay />
              <div className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-primary/50" />
            </div>
          ) : (
            <button
              onClick={() => setLiveScan(true)}
              disabled={manualCode.length !== 6}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary/40 bg-primary/5 px-4 py-3 font-semibold text-primary disabled:opacity-50"
            >
              <Camera className="h-5 w-5" /> Scan QR with phone camera
            </button>
          )}

          <textarea
            value={manualContent}
            onChange={(e) => setManualContent(e.target.value)}
            placeholder="Or paste QR content / transaction URL here…"
            rows={3}
            className="mt-3 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground"
          />
          <button
            onClick={() => sendToDesktop(manualCode, manualContent)}
            disabled={manualCode.length !== 6 || !manualContent}
            className="mt-4 w-full rounded-2xl gradient-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            Send to Desktop
          </button>
          {sent && (
            <p className="mt-3 text-sm font-medium text-success">✅ Sent to desktop for verification</p>
          )}
        </div>
      )}
    </div>
  );
}
