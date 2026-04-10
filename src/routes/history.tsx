import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck, ShieldAlert, ShieldX, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type Language, translations } from '@/lib/translations';
import { getSavedLanguage, getScanHistory, type ScanRecord } from '@/lib/app-store';

export const Route = createFileRoute('/history')({
  component: HistoryScreen,
  head: () => ({
    meta: [
      { title: 'Scan History — Fraud Shield' },
      { name: 'description', content: 'View your past QR and URL scan results.' },
    ],
  }),
});

function HistoryScreen() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('en');
  const [history, setHistory] = useState<ScanRecord[]>([]);

  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved) setLang(saved);
    setHistory(getScanHistory());
  }, []);

  const t = translations[lang];

  const statusIcon = (status: string) => {
    if (status === 'safe') return <ShieldCheck className="h-5 w-5 text-safe" />;
    if (status === 'caution') return <ShieldAlert className="h-5 w-5 text-warning" />;
    return <ShieldX className="h-5 w-5 text-danger" />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: '/home' })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="font-heading text-lg font-semibold text-foreground">{t.scan_history}</span>
        <div className="w-10" />
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-3">
        {history.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
            <p className="text-lg">{t.no_history}</p>
          </div>
        ) : (
          history.map((record) => (
            <button
              key={record.id}
              onClick={() =>
                navigate({
                  to: '/result',
                  search: {
                    score: record.score,
                    status: record.status,
                    reasons: record.explanation.replace(/; /g, '||'),
                    input: record.input,
                    type: record.type,
                  },
                })
              }
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:shadow-md"
            >
              {statusIcon(record.status)}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{record.input}</p>
                <p className="text-xs text-muted-foreground">
                  {record.type.toUpperCase()} · Score: {record.score} · {new Date(record.timestamp).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-sm font-bold ${
                record.status === 'safe' ? 'text-safe' : record.status === 'caution' ? 'text-warning' : 'text-danger'
              }`}>
                {record.score}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
