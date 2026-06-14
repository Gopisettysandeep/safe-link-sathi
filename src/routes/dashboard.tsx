import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck, ShieldAlert, ShieldX, Activity, Database, Smartphone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getScanHistory, isProtectionOn, type ScanRecord } from '@/lib/app-store';

export const Route = createFileRoute('/dashboard')({
  component: DashboardScreen,
  head: () => ({ meta: [{ title: 'Security Dashboard — Fraud Shield' }] }),
});

function DashboardScreen() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [protection, setProtection] = useState(true);

  useEffect(() => { setHistory(getScanHistory()); setProtection(isProtectionOn()); }, []);

  const stats = useMemo(() => {
    const safe = history.filter(h => h.status === 'safe').length;
    const caution = history.filter(h => h.status === 'caution').length;
    const fraud = history.filter(h => h.status === 'fraud').length;
    return { total: history.length, safe, caution, fraud };
  }, [history]);

  const Stat = ({ icon: Icon, label, value, color }: any) => (
    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4">
      <Icon className={`h-5 w-5 ${color}`} />
      <span className="mt-1 font-heading text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate({ to: '/home' })} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-lg font-semibold text-foreground">Security Dashboard</h1>
      </div>

      <div className={`mt-6 flex items-center justify-between rounded-2xl p-5 ${protection ? 'gradient-safe' : 'gradient-danger'}`}>
        <div>
          <p className="text-xs uppercase tracking-wide text-primary-foreground/70">Protection Status</p>
          <p className="mt-1 font-heading text-xl font-bold text-primary-foreground">{protection ? 'ACTIVE' : 'DISABLED'}</p>
        </div>
        <ShieldCheck className="h-12 w-12 text-primary-foreground" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat icon={Activity} label="Total Scans" value={stats.total} color="text-primary" />
        <Stat icon={ShieldCheck} label="Safe" value={stats.safe} color="text-safe" />
        <Stat icon={ShieldAlert} label="Suspicious" value={stats.caution} color="text-warning" />
        <Stat icon={ShieldX} label="Fraud Blocked" value={stats.fraud} color="text-danger" />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Threat Database</p>
              <p className="text-xs text-muted-foreground">Local heuristic rules</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-safe">UP TO DATE</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Device</p>
              <p className="text-xs text-muted-foreground">{navigator.userAgent.includes('Mobile') ? 'Mobile browser' : 'Desktop browser'}</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-safe">OK</span>
        </div>
      </div>

      <h2 className="mt-6 font-heading text-base font-semibold text-foreground">Recent Activity</h2>
      <div className="mt-2 flex flex-col gap-2">
        {history.slice(0, 5).map(h => (
          <div key={h.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-mono text-foreground">{h.input}</p>
              <p className="text-[10px] text-muted-foreground">{new Date(h.timestamp).toLocaleString()}</p>
            </div>
            <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${h.status === 'safe' ? 'bg-safe/15 text-safe' : h.status === 'caution' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'}`}>
              {h.score}
            </span>
          </div>
        ))}
        {history.length === 0 && <p className="text-center text-sm text-muted-foreground">No scans yet</p>}
      </div>
    </div>
  );
}
