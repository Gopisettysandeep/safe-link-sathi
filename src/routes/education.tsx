import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, BookOpen, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSavedLanguage } from '@/lib/app-store';
import type { Language } from '@/lib/translations';
import { educationT } from '@/lib/i18n/education-pair';

export const Route = createFileRoute('/education')({
  component: EducationScreen,
  head: () => ({
    meta: [
      { title: 'Education Center — Fraud Shield' },
      { name: 'description', content: 'Learn how to spot UPI fraud, phishing QR codes, and online payment scams.' },
    ],
  }),
});

function EducationScreen() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(0);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    setLang(getSavedLanguage() ?? 'en');
  }, []);

  const t = educationT[lang];

  const ARTICLES = [
    { title: t.a1_title, summary: t.a1_summary, body: t.a1_body.split('\n') },
    { title: t.a2_title, summary: t.a2_summary, body: t.a2_body.split('\n') },
    { title: t.a3_title, summary: t.a3_summary, body: t.a3_body.split('\n') },
    { title: t.a4_title, summary: t.a4_summary, body: t.a4_body.split('\n') },
    { title: t.a5_title, summary: t.a5_summary, body: t.a5_body.split('\n') },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate({ to: '/home' })} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-lg font-semibold text-foreground">{t.header_title}</h1>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl gradient-primary p-4">
        <BookOpen className="h-6 w-6 shrink-0 text-primary-foreground" />
        <p className="text-sm text-primary-foreground">{t.intro}</p>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {ARTICLES.map((a, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-start justify-between gap-3 p-4 text-left"
            >
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">{a.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{a.summary}</p>
              </div>
              <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="space-y-2 border-t border-border px-4 pb-4 pt-3">
                {a.body.map((p, j) => (
                  <p key={j} className="text-sm leading-relaxed text-foreground">{p}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
