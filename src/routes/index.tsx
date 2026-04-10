import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Sparkles, Lock, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSavedLanguage } from '@/lib/app-store';
import shieldIcon from '@/assets/shield-icon.png';

export const Route = createFileRoute('/')({
  component: WelcomeScreen,
  head: () => ({
    meta: [
      { title: 'Fraud Shield — Protect Your Transactions' },
      { name: 'description', content: 'Detect fraudulent QR codes and URLs before making payments. Stay safe with real-time fraud detection.' },
      { property: 'og:title', content: 'Fraud Shield — Protect Your Transactions' },
      { property: 'og:description', content: 'Detect fraudulent QR codes and URLs before making payments.' },
    ],
  }),
});

function WelcomeScreen() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // If language already selected, skip to home
    const lang = getSavedLanguage();
    if (lang) {
      navigate({ to: '/home' });
      return;
    }
    setShow(true);
  }, [navigate]);

  if (!show) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 gradient-primary">
      <div className="flex flex-col items-center gap-8 animate-slide-up">
        {/* Animated Shield Icon */}
        <div className="relative animate-float">
          <div className="absolute inset-0 rounded-full bg-primary-foreground/20 animate-pulse-ring" />
          <img src={shieldIcon} alt="Fraud Shield" width={120} height={120} className="relative" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-primary-foreground">
            Fraud Shield
          </h1>
          <p className="mt-3 max-w-xs text-base text-primary-foreground/80">
            Protect your transactions from fraud. Scan QR codes & verify URLs instantly.
          </p>
        </div>

        {/* Feature icons */}
        <div className="flex gap-6">
          {[
            { icon: Eye, label: 'Detect' },
            { icon: Lock, label: 'Protect' },
            { icon: Sparkles, label: 'Verify' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/15 backdrop-blur-sm">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xs font-medium text-primary-foreground/70">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate({ to: '/language' })}
          className="mt-4 w-full max-w-xs rounded-2xl bg-primary-foreground px-8 py-4 font-heading text-lg font-semibold text-primary shadow-lg transition-all active:scale-95 hover:shadow-xl"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
