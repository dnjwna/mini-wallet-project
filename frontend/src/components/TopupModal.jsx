import { useState } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';

export default function TopupModal({ open, onClose, onSubmit, loading, error, clearError }) {
  const [amount, setAmount] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; 
    const success = await onSubmit(amount);
    if (success) {
      setAmount('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="panel-raised w-full max-w-sm rounded-xl2 p-7"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink-primary">Top Up Saldo</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-ink-faint transition hover:text-ink-primary"
            aria-label="Tutup"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-accent-danger/20 bg-accent-danger/10 px-4 py-3 text-sm text-accent-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <label className="mb-1.5 block text-xs font-medium text-ink-muted" htmlFor="topup-amount">
          Nominal (Rp)
        </label>
        <input
          id="topup-amount"
          className="input-flat w-full rounded-xl px-4 py-2.5 font-mono text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none"
          type="number"
          min="1"
          step="1"
          placeholder="100000"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            clearError?.();
          }}
          required
          disabled={loading}
          autoFocus
        />

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-line bg-white/[0.03] py-2.5 text-sm font-medium text-ink-muted transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink-primary py-2.5 text-sm font-semibold text-base transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'Memproses...' : 'Top Up'}
          </button>
        </div>
      </form>
    </div>
  );
}