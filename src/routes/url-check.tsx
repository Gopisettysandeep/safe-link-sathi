import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Link2, Search, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type Language, translations } from '@/lib/translations';
import { getSavedLanguage, addScanRecord } from '@/lib/app-store';
import { VoiceButton } from '@/components/VoiceButton';
import { analyzeUrl } from '@/lib/fraud-detection';

export const Route = createFileRoute('/url-check')({
  component: UrlCheckScreen,
  head: () => ({
    meta: [
      { title: 'Check URL — Fraud Shield' },
      { name: 'description', content: 'Paste a transaction URL to check if it is safe.' },
    ],
  }),
});

function UrlCheckScreen() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('en');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved) setLang(saved);
  }, [navigate]);

  const t = translations[lang];

  const handleCheck = () => {
    setError('');
    const trimmed = url.trim();
    if (!trimmed) {
      setError(t.invalid_url);
      return;
    }

    setChecking(true);

    // Simulate brief analysis delay
    setTimeout(() => {
      const result = analyzeUrl(trimmed);

      addScanRecord({
        id: crypto.randomUUID(),
        type: 'url',
        input: trimmed,
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
          input: trimmed,
          type: 'url',
        },
      });
    }, 800);
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
        <span className="font-heading text-lg font-semibold text-foreground">{t.enter_url}</span>
        <VoiceButton text={t.enter_url_desc} lang={lang} />
      </div>

      <div className="mt-10 flex flex-1 flex-col items-center">
        {/* Icon */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full gradient-warning">
          <Link2 className="h-10 w-10 text-warning-foreground" />
        </div>

        {/* URL Input */}
        <div className="w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t.enter_url_placeholder}
              className="w-full rounded-2xl border-2 border-border bg-card py-4 pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            />
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 text-danger">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleCheck}
            disabled={checking}
            className="mt-6 w-full rounded-2xl gradient-primary px-8 py-4 font-heading text-lg font-semibold text-primary-foreground shadow-lg transition-all active:scale-95 disabled:opacity-60"
          >
            {checking ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                {t.analyzing}
              </span>
            ) : (
              t.check_url
            )}
          </button>
        </div>

        {/* Paste hint */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Paste any payment link, UPI URL, or website address
        </p>
      </div>
    </div>
  );
}
