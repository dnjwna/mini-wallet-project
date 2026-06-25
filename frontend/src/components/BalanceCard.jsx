import { ArrowDownToLine, Send, Eye } from 'lucide-react';
import { useState } from 'react';

export default function BalanceCard({ balance, loading, onTopupClick, onTransferClick }) {
  const [revealed, setRevealed] = useState(true);

  const formatted =
    balance === null
      ? null
      : new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(balance);

  return (
    <div className="panel relative overflow-hidden rounded-xl2 p-7 sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(52,211,153,0.08),_transparent_55%)]" />

      <div className="relative">
        <div className="mb-4 flex items-center gap-2 text-ink-muted">
          <span className="text-xs font-medium uppercase tracking-widest">Saldo Saat Ini</span>
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="text-ink-faint transition hover:text-ink-muted"
            aria-label={revealed ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>

        <h2 className="mb-7 font-serif text-5xl font-medium tracking-tight text-ink-primary sm:text-6xl">
          {loading || formatted === null ? (
            <span className="text-2xl text-ink-faint">Memuat...</span>
          ) : revealed ? (
            <>
              <span className="mr-2 text-2xl text-ink-muted">Rp</span>
              {formatted}
            </>
          ) : (
            '••••••••'
          )}
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onTopupClick}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-ink-primary px-5 py-2.5 text-sm font-semibold text-base transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Top Up
          </button>
          <button
            onClick={onTransferClick}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-ink-primary transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}