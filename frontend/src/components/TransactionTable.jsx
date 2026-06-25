import { ArrowDownLeft, ArrowUpRight, ArrowDownToLine, Inbox } from 'lucide-react';

const TYPE_META = {
  topup: { label: 'Top Up', icon: ArrowDownToLine, color: 'text-accent-emerald', bg: 'bg-accent-emerald/10', sign: '+' },
  transfer_in: { label: 'Transfer Masuk', icon: ArrowDownLeft, color: 'text-accent-emerald', bg: 'bg-accent-emerald/10', sign: '+' },
  transfer_out: { label: 'Transfer Keluar', icon: ArrowUpRight, color: 'text-ink-primary', bg: 'bg-white/[0.06]', sign: '-' },
};

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(value);
}

export default function TransactionTable({ transactions, loading }) {
  return (
    <div className="panel flex h-full flex-col rounded-xl2 p-6">
      <h3 className="mb-5 font-display text-base font-bold text-ink-primary">Riwayat Transaksi</h3>

      {loading && (
        <div className="space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/[0.03]" />
          ))}
        </div>
      )}

      {!loading && transactions.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
          <Inbox className="h-8 w-8 text-ink-faint" />
          <p className="text-sm text-ink-muted">Belum ada transaksi.</p>
        </div>
      )}

      {!loading && transactions.length > 0 && (
        <div className="max-h-[28rem] space-y-1 overflow-y-auto pr-1">
          {transactions.map((tx) => {
            const meta = TYPE_META[tx.type] || {
              label: tx.type,
              icon: ArrowDownToLine,
              color: 'text-ink-muted',
              bg: 'bg-white/5',
              sign: '',
            };
            const Icon = meta.icon;
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-white/[0.02]"
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${meta.bg}`}>
                  <Icon className={`h-[18px] w-[18px] ${meta.color}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-primary">
                    {tx.description || meta.label}
                  </p>
                  <p className="text-xs text-ink-faint">
                    {new Date(tx.created_at).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-semibold ${meta.color}`}>
                    {meta.sign} Rp{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs italic text-ink-faint">{meta.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}