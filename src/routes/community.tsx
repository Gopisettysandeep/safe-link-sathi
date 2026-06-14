import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, AlertOctagon, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/community')({
  component: CommunityScreen,
  head: () => ({ meta: [{ title: 'Community Fraud Reports — Fraud Shield' }] }),
});

interface Report {
  id: string;
  report_type: string;
  content: string;
  reason: string | null;
  risk_score: number | null;
  reporter_label: string | null;
  created_at: string;
}

function CommunityScreen() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('fraud_reports').select('*').order('created_at', { ascending: false }).limit(100);
      if (!error && data) setReports(data as Report[]);
      setLoading(false);
    })();
  }, []);

  const filtered = q ? reports.filter(r => r.content.toLowerCase().includes(q.toLowerCase()) || (r.reason ?? '').toLowerCase().includes(q.toLowerCase())) : reports;

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate({ to: '/home' })} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-lg font-semibold text-foreground">Community Fraud Reports</h1>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-warning/10 p-4">
        <Users className="h-6 w-6 text-warning" />
        <p className="text-xs text-foreground">Crowdsourced fraud QR/URL/UPI database. Submit a report from the scan result screen.</p>
      </div>

      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search reports..."
        className="mt-4 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
      />

      <div className="mt-4 flex flex-col gap-2">
        {loading && <p className="text-center text-sm text-muted-foreground">Loading reports...</p>}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-8 text-center">
            <AlertOctagon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No reports yet.</p>
          </div>
        )}
        {filtered.map(r => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-bold uppercase text-danger">{r.report_type}</span>
              <span className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            <p className="mt-2 break-all font-mono text-xs text-foreground">{r.content}</p>
            {r.reason && <p className="mt-2 text-xs text-muted-foreground">"{r.reason}"</p>}
            {r.risk_score !== null && <p className="mt-1 text-[10px] text-muted-foreground">Reported risk score: {r.risk_score}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
