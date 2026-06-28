import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, BookOpen, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/education')({
  component: EducationScreen,
  head: () => ({
    meta: [
      { title: 'Education Center — Fraud Shield' },
      { name: 'description', content: 'Learn how to spot UPI fraud, phishing QR codes, and online payment scams.' },
    ],
  }),
});

const ARTICLES = [
  {
    title: 'How UPI QR Fraud Works',
    summary: 'Scammers create QR codes that look like payment requests but actually trigger a payment from your account.',
    body: [
      'Every UPI QR code uses the upi://pay format. A scammer can craft a QR with their own UPI ID (pa=fraud@bank) and a fixed amount (am=500).',
      'When you scan and approve, money leaves YOUR account. The QR cannot "receive" money on your behalf — that is the most common myth.',
      'Always check the payee name and UPI ID shown on your payment app before approving. Fraud Shield highlights unknown recipients automatically.',
    ],
  },
  {
    title: 'Spotting Phishing URLs',
    summary: 'Fake bank links use lookalike domains and urgent language to steal your credentials.',
    body: [
      'Watch for tiny spelling changes: sbi-secure.xyz, hdfc-verify.click, paytm-rewards.top.',
      'Real banks NEVER send links asking you to "verify", "unblock", or "claim a refund". When in doubt, open the official app directly.',
      'Suspicious top-level domains (.xyz, .click, .gq, .tk) and shortened links (bit.ly, tinyurl) deserve extra caution.',
    ],
  },
  {
    title: 'KYC & OTP Scams',
    summary: 'No bank or wallet will ever ask for your OTP, PIN, or full card number over a call or message.',
    body: [
      'If someone calls claiming to be from your bank and asks you to "verify KYC" by entering an OTP — hang up. It is always a scam.',
      'Never install screen-sharing apps (AnyDesk, TeamViewer) at the request of a "support agent". They will watch you enter your PIN.',
      'Report fraud immediately on the National Cyber Crime Portal (cybercrime.gov.in) or call 1930.',
    ],
  },
  {
    title: 'Safe Payment Habits',
    summary: 'A few simple habits eliminate most payment fraud.',
    body: [
      'Save trusted recipients (shopkeeper, family) in Fraud Shield so unknown UPI IDs stand out.',
      'Enable Family Protection Mode for elderly users — it adds an extra confirmation on suspicious payments.',
      'Keep your payment apps updated. Use UPI Lite for small daily payments to limit exposure.',
      'Never approve a "collect request" you did not initiate. Genuine merchants generate a QR for YOU to pay.',
    ],
  },
  {
    title: 'What the Risk Score Means',
    summary: 'Fraud Shield combines dozens of signals into a single 0-100 score.',
    body: [
      '0–30 (Safe): No red flags. Trusted domain or valid UPI format with a known recipient.',
      '31–60 (Caution): Some warning signs — suspicious keywords, unusual TLDs, or an unknown UPI ID. Verify before paying.',
      '61–100 (Fraud): Multiple strong signals. Do NOT proceed. Report it to the community to protect others.',
    ],
  },
];

function EducationScreen() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate({ to: '/home' })} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-lg font-semibold text-foreground">Education Center</h1>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl gradient-primary p-4">
        <BookOpen className="h-6 w-6 shrink-0 text-primary-foreground" />
        <p className="text-sm text-primary-foreground">Learn how scams work so you can spot them before they reach you.</p>
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
