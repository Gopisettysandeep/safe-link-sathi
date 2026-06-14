import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Camera, HardDrive, Mic, Bell, Wifi, ShieldCheck } from 'lucide-react';
import { markPermissionsSeen } from '@/lib/app-store';

export const Route = createFileRoute('/permissions')({
  component: PermissionsScreen,
  head: () => ({
    meta: [
      { title: 'Permissions — Fraud Shield' },
      { name: 'description', content: 'Grant permissions Fraud Shield needs to protect your transactions.' },
    ],
  }),
});

const items = [
  { icon: Camera, title: 'Camera', desc: 'Scan QR codes with your camera.' },
  { icon: HardDrive, title: 'Storage', desc: 'Open QR images from your gallery.' },
  { icon: Mic, title: 'Microphone', desc: 'Optional voice commands (future).' },
  { icon: Bell, title: 'Notifications', desc: 'Warn you about fraud alerts.' },
  { icon: Wifi, title: 'Internet', desc: 'Check URLs against threat databases.' },
];

function PermissionsScreen() {
  const navigate = useNavigate();

  async function continueFlow() {
    // Best-effort camera + notifications prompt; ignore failures
    try { await navigator.mediaDevices?.getUserMedia({ video: true }).then(s => s.getTracks().forEach(t => t.stop())); } catch {}
    try { if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission(); } catch {}
    markPermissionsSeen();
    navigate({ to: '/home' });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
          <ShieldCheck className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Permissions</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Fraud Shield needs these permissions to keep you safe. You can change them later in Settings.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button onClick={continueFlow} className="w-full rounded-2xl gradient-primary px-6 py-4 font-heading text-base font-semibold text-primary-foreground shadow-md transition active:scale-95">
          Allow & Continue
        </button>
        <button onClick={() => { markPermissionsSeen(); navigate({ to: '/home' }); }} className="text-center text-sm text-muted-foreground underline">
          Skip for now
        </button>
      </div>
    </div>
  );
}
