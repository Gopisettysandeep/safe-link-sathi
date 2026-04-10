import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Volume2, Check } from 'lucide-react';
import { useState } from 'react';
import { type Language, languageNames, translations } from '@/lib/translations';
import { saveLanguage } from '@/lib/app-store';
import { speak } from '@/lib/voice';

export const Route = createFileRoute('/language')({
  component: LanguageScreen,
  head: () => ({
    meta: [
      { title: 'Choose Language — Fraud Shield' },
      { name: 'description', content: 'Select your preferred language for Fraud Shield app' },
    ],
  }),
});

const languages: { code: Language; flag: string }[] = [
  { code: 'te', flag: '🇮🇳' },
  { code: 'en', flag: '🇬🇧' },
  { code: 'hi', flag: '🇮🇳' },
  { code: 'ta', flag: '🇮🇳' },
  { code: 'kn', flag: '🇮🇳' },
  { code: 'ml', flag: '🇮🇳' },
];

function LanguageScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Language | null>(null);

  const handleSpeak = (lang: Language) => {
    speak(translations[lang].voice_welcome, lang);
  };

  const handleContinue = () => {
    if (!selected) return;
    saveLanguage(selected);
    navigate({ to: '/home' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-8">
      <div className="animate-slide-up">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
            <span className="text-3xl">🌐</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Choose Your Language
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Select your preferred language
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 gap-3">
          {languages.map(({ code, flag }) => (
            <button
              key={code}
              onClick={() => setSelected(code)}
              className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 transition-all active:scale-[0.98] ${
                selected === code
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{flag}</span>
                <span className="text-lg font-semibold text-foreground">
                  {languageNames[code]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(code);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"
                  aria-label={`Listen in ${languageNames[code]}`}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                {selected === code && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`mt-8 w-full rounded-2xl px-8 py-4 font-heading text-lg font-semibold transition-all active:scale-95 ${
            selected
              ? 'gradient-primary text-primary-foreground shadow-lg'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
