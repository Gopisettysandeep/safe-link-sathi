import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Plus, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { addTrustedRecipient, getTrustedRecipients, removeTrustedRecipient, type TrustedRecipient } from '@/lib/app-store';

export const Route = createFileRoute('/trusted')({
  component: TrustedScreen,
  head: () => ({ meta: [{ title: 'Trusted Recipients — Fraud Shield' }] }),
});

function TrustedScreen() {
  const navigate = useNavigate();
  const [list, setList] = useState<TrustedRecipient[]>([]);
  const [label, setLabel] = useState('');
  const [upi, setUpi] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => { setList(getTrustedRecipients()); }, []);

  function refresh() { setList(getTrustedRecipients()); }

  function save() {
    const l = label.trim().slice(0, 60);
    const u = upi.trim().toLowerCase();
    if (!l || !/^[\w.\-]{2,}@[\w.\-]{2,}$/.test(u)) {
      alert('Please enter a name and valid UPI ID like name@bank');
      return;
    }
    addTrustedRecipient({ label: l, upiId: u });
    setLabel(''); setUpi(''); setOpen(false); refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate({ to: '/settings' })} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-lg font-semibold text-foreground">Trusted Recipients</h1>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Save UPI IDs of people and businesses you trust. We'll flag them as <strong>Trusted</strong> when you scan.
      </p>

      {!open ? (
        <button onClick={() => setOpen(true)} className="mt-4 flex items-center justify-center gap-2 rounded-2xl gradient-primary px-4 py-3 font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Recipient
        </button>
      ) : (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (e.g. Mother, Shop Owner)" className="mb-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
          <input value={upi} onChange={e => setUpi(e.target.value)} placeholder="UPI ID (e.g. mom@okhdfcbank)" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
          <div className="mt-3 flex gap-2">
            <button onClick={save} className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save</button>
            <button onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-border px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2">
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No trusted recipients yet.</p>
          </div>
        ) : list.map(r => (
          <div key={r.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground">{r.label}</h3>
              <p className="text-xs font-mono text-muted-foreground">{r.upiId}</p>
            </div>
            <button onClick={() => { removeTrustedRecipient(r.id); refresh(); }} className="flex h-9 w-9 items-center justify-center rounded-full text-danger hover:bg-danger/10">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
