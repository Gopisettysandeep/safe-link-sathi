import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Upload, ImagePlus, AlertCircle } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { type Language, translations } from '@/lib/translations';
import { getSavedLanguage, addScanRecord } from '@/lib/app-store';
import { VoiceButton } from '@/components/VoiceButton';
import { analyzeQrContent } from '@/lib/fraud-detection';

export const Route = createFileRoute('/upload')({
  component: UploadScreen,
  head: () => ({
    meta: [
      { title: 'Upload QR Image — Fraud Shield' },
      { name: 'description', content: 'Upload a QR code image to check for fraud.' },
    ],
  }),
});

function UploadScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lang, setLang] = useState<Language>('en');
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved) setLang(saved);
  }, []);

  const t = translations[lang];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setProcessing(true);
    setError('');

    try {
      // Try BarcodeDetector
      if ('BarcodeDetector' in window) {
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((res) => { img.onload = res; });

        const barcodes = await detector.detect(img);
        if (barcodes.length > 0) {
          processResult(barcodes[0].rawValue);
          return;
        }
      }

      // Fallback — treat filename or prompt user
      setError(t.invalid_qr);
      setProcessing(false);
    } catch {
      setError(t.invalid_qr);
      setProcessing(false);
    }
  };

  const processResult = (content: string) => {
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
        <span className="font-heading text-lg font-semibold text-foreground">{t.upload_qr}</span>
        <VoiceButton text={t.upload_qr_desc} lang={lang} />
      </div>

      {/* Upload Area */}
      <div className="mt-8 flex flex-1 flex-col items-center justify-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={preview}
              alt="QR Preview"
              className="h-56 w-56 rounded-2xl object-contain border-2 border-border"
            />
            {processing && (
              <div className="flex items-center gap-2 text-primary">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm">{t.analyzing}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-danger">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-64 w-full max-w-xs flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 transition hover:border-primary/50 hover:bg-primary/10"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <ImagePlus className="h-10 w-10 text-primary" />
            </div>
            <span className="text-base font-medium text-foreground">{t.upload_image}</span>
            <span className="text-xs text-muted-foreground">JPG, PNG, WebP</span>
          </button>
        )}

        {(preview && !processing) && (
          <button
            onClick={() => {
              setPreview(null);
              setError('');
              fileInputRef.current?.click();
            }}
            className="mt-6 rounded-xl gradient-primary px-8 py-3 font-semibold text-primary-foreground transition active:scale-95"
          >
            Try Another Image
          </button>
        )}
      </div>
    </div>
  );
}
