import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Camera, AlertCircle, Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { type Language, translations } from '@/lib/translations';
import { getSavedLanguage, addScanRecord } from '@/lib/app-store';
import { VoiceButton } from '@/components/VoiceButton';
import { analyzeQrContent } from '@/lib/fraud-detection';
import { decodeFromVideo } from '@/lib/qr-decode';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/scan')({
  component: ScanScreen,
  head: () => ({
    meta: [
      { title: 'Scan QR Code — Fraud Shield' },
      { name: 'description', content: 'Scan QR codes with your camera to detect fraud.' },
    ],
  }),
});

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function ScanScreen() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lang, setLang] = useState<Language>('en');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const [pairCode] = useState(genCode);
  const [pairQr, setPairQr] = useState<string | null>(null);
  const [pairStatus, setPairStatus] = useState<'waiting' | 'connected'>('waiting');
  const streamRef = useRef<MediaStream | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved) setLang(saved);
  }, []);

  const t = translations[lang];

  const handleQrDetected = (content: string) => {
    if (handledRef.current) return;
    handledRef.current = true;
    setScanning(false);
    streamRef.current?.getTracks().forEach((tr) => tr.stop());

    const result = analyzeQrContent(content);
    addScanRecord({
      id: crypto.randomUUID(),
      type: 'qr',
      input: content,
      score: result.score,
      status: result.status,
      explanation: result.reasons.join('; '),
      timestamp: Date.now(),
    });

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
  };

  // Camera + detection loop (native BarcodeDetector, jsQR/ZXing fallback)
  useEffect(() => {
    let active = true;
    let raf = 0;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (!active) {
          stream.getTracks().forEach((tr) => tr.stop());
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
              handleQrDetected(value);
              return;
            }
          }
          raf = requestAnimationFrame(loop);
        };
        loop();
      } catch {
        setError(t.camera_error);
        setScanning(false);
      }
    }

    if (scanning) start();

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  // No camera (desktop) → pairing QR + realtime listener
  useEffect(() => {
    if (!error) return;
    QRCode.toDataURL(`${window.location.origin}/pair?code=${pairCode}`, { width: 260, margin: 1 })
      .then(setPairQr)
      .catch(() => {});

    const ch = supabase.channel(`pair-${pairCode}`, { config: { broadcast: { self: false } } });
    ch.on('broadcast', { event: 'hello' }, () => setPairStatus('connected'));
    ch.on('broadcast', { event: 'scan' }, (msg: any) => {
      const content = msg.payload?.content as string;
      if (content) handleQrDetected(content);
    });
    ch.subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, pairCode]);

  return (
    <div className="flex min-h-screen flex-col bg-foreground">
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => navigate({ to: '/home' })}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="truncate font-heading text-lg font-semibold text-primary-foreground">{t.scan_qr}</span>
        <VoiceButton text={t.scan_qr_desc} lang={lang} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10">
        {error ? (
          <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <AlertCircle className="h-5 w-5 text-warning" />
              <span className="text-sm">No camera available on this device</span>
            </div>
            <h2 className="font-heading text-lg font-semibold text-primary-foreground">
              Scan with your phone
            </h2>
            <p className="text-sm text-primary-foreground/60">
              Open Fraud Shield on your phone and scan this pairing QR. Your phone camera does the live
              scan and the result appears here instantly.
            </p>
            {pairQr && (
              <img src={pairQr} alt="Fraud Shield pairing QR code" className="rounded-2xl bg-white p-3" />
            )}
            <div className="rounded-full bg-primary-foreground/10 px-4 py-2 font-mono text-xl tracking-widest text-primary-foreground">
              {pairCode}
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary-foreground/60">
              <Smartphone className="h-4 w-4" />
              {pairStatus === 'waiting' ? 'Waiting for phone…' : 'Phone connected'}
            </div>
            <button
              onClick={() => navigate({ to: '/upload' })}
              className="mt-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              Upload QR Image Instead
            </button>
          </div>
        ) : (
          <div className="relative w-full max-w-xs overflow-hidden rounded-3xl">
            <video ref={videoRef} className="h-72 w-full object-cover" playsInline muted autoPlay />
            <div className="absolute inset-0 rounded-3xl border-4 border-primary/50">
              <div className="absolute left-0 right-0 h-0.5 animate-scan-line bg-primary" />
            </div>
          </div>
        )}

        {scanning && !error && (
          <div className="mt-6 flex items-center gap-2">
            <Camera className="h-5 w-5 animate-pulse text-primary" />
            <span className="text-sm text-primary-foreground/70">{t.scanning}</span>
          </div>
        )}

        <button
          onClick={() => navigate({ to: '/url-check' })}
          className="mt-8 text-sm text-primary-foreground/60 underline"
        >
          Or enter URL manually
        </button>
      </div>
    </div>
  );
}
