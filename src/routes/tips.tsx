import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck, AlertTriangle, Lock, Eye, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type Language, translations } from '@/lib/translations';
import { getSavedLanguage } from '@/lib/app-store';
import { VoiceButton } from '@/components/VoiceButton';

export const Route = createFileRoute('/tips')({
  component: TipsScreen,
  head: () => ({
    meta: [
      { title: 'Safety Tips — Fraud Shield' },
      { name: 'description', content: 'Online transaction safety tips to protect yourself from fraud.' },
    ],
  }),
});

const tipIcons = [ShieldCheck, Lock, MessageCircle, Eye, AlertTriangle];

function TipsScreen() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved) setLang(saved);
  }, []);

  const t = translations[lang];

  const tips = [t.tip_1, t.tip_2, t.tip_3, t.tip_4, t.tip_5];

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: '/home' })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="font-heading text-lg font-semibold text-foreground">{t.tips_title}</span>
        <VoiceButton text={tips.join('. ')} lang={lang} />
      </div>

      <div className="mt-8 space-y-4 animate-slide-up">
        {tips.map((tip, i) => {
          const Icon = tipIcons[i];
          return (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="pt-1 text-sm leading-relaxed text-foreground">{tip}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
