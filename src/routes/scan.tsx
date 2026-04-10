import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Camera, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { type Language, translations } from '@/lib/translations';
import { getSavedLanguage, addScanRecord } from '@/lib/app-store';
import { VoiceButton } from '@/components/VoiceButton';
import { analyzeQrContent, type FraudResult } from '@/lib/fraud-detection';
import { speak } from '@/lib/voice';

export const Route = createFileRoute('/scan')({
  component: ScanScreen,
  head: () => ({
    meta: [
      { title: 'Scan QR Code — Fraud Shield' },
      { name: 'description', content: 'Scan QR codes with your camera to detect fraud.' },
    ],
  }),
});

function ScanScreen() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lang, setLang] = useState<Language>('en');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved) setLang(saved);
  }, []);

  const t = translations[lang];

  useEffect(() => {
    let active = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch {
        setError(t.camera_error);
        setScanning(false);
      }
    }

    if (scanning) {
      startCamera();
    }

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [scanning, t.camera_error]);

  // Simple QR detection loop using BarcodeDetector API
  useEffect(() => {
    if (!scanning) return;

    let active = true;

    async function detectQR() {
      if (!('BarcodeDetector' in window)) {
        // Fallback: prompt user to use upload instead
        return;
      }

      const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });

      const loop = async () => {
        if (!active || !videoRef.current || !scanning) return;

        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const content = barcodes[0].rawValue;
            handleQrDetected(content);
            return;
          }
        } catch {
          // ignore detection errors
        }

        if (active) requestAnimationFrame(loop);
      };

      loop();
    }

    detectQR();

    return () => {
      active = false;
    };
  }, [scanning]);

  const handleQrDetected = (content: string) => {
    setScanning(false);
    streamRef.current?.getTracks().forEach(t => t.stop());

    const result = analyzeQrContent(content);
    
    const record = {
      id: crypto.randomUUID(),
      type: 'qr' as const,
      input: content,
      score: result.score,
      status: result.status,
      explanation: result.reasons.join('; '),
      timestamp: Date.now(),
    };
    addScanRecord(record);

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

  return (
    <div className="flex min-h-screen flex-col bg-foreground">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => navigate({ to: '/home' })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="font-heading text-lg font-semibold text-primary-foreground">{t.scan_qr}</span>
        <VoiceButton text={t.scan_qr_desc} lang={lang} />
      </div>

      {/* Camera View */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {error ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-16 w-16 text-danger" />
            <p className="text-primary-foreground">{error}</p>
            <p className="text-sm text-primary-foreground/60">
              Try uploading a QR image instead
            </p>
            <button
              onClick={() => navigate({ to: '/upload' })}
              className="mt-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              Upload QR Image
            </button>
          </div>
        ) : (
          <div className="relative w-full max-w-xs overflow-hidden rounded-3xl">
            <video
              ref={videoRef}
              className="h-72 w-full object-cover"
              playsInline
              muted
              autoPlay
            />
            {/* Scan overlay */}
            <div className="absolute inset-0 border-4 border-primary/50 rounded-3xl">
              <div className="absolute left-0 right-0 h-0.5 bg-primary animate-scan-line" />
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {scanning && !error && (
          <div className="mt-6 flex items-center gap-2">
            <Camera className="h-5 w-5 animate-pulse text-primary" />
            <span className="text-sm text-primary-foreground/70">{t.scanning}</span>
          </div>
        )}

        {/* Manual input fallback */}
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
