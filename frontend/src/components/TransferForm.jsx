import { useState, forwardRef } from 'react';
import { Send, User, Banknote, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';

const TransferForm = forwardRef(({ onSubmit, loading, error, clearError }, ref) => {
  const [target, setTarget] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const success = await onSubmit(target, amount, description);
    if (success) {
      setTarget('');
      setAmount('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel rounded-xl2 p-6">
      <h3 className="mb-5 font-display text-base font-bold text-ink-primary">Transfer Saldo</h3>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-accent-danger/20 bg-accent-danger/10 px-4 py-3 text-sm text-accent-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <label className="mb-1.5 block text-xs font-medium text-ink-muted">
        Email / Nomor HP Penerima
      </label>
      <div className="relative mb-4">
        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          ref={ref}
          className="input-flat w-full rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none"
          type="text"
          placeholder="Email atau nomor HP"
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
            clearError?.();
          }}
          required
          disabled={loading}
        />
      </div>

      <label className="mb-1.5 block text-xs font-medium text-ink-muted">Nominal (Rp)</label>
      <div className="relative mb-4">
        <Banknote className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          className="input-flat w-full rounded-xl py-2.5 pl-10 pr-3.5 font-mono text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none"
          type="number"
          min="1"
          step="1"
          placeholder="50000"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            clearError?.();
          }}
          required
          disabled={loading}
        />
      </div>

      <label className="mb-1.5 block text-xs font-medium text-ink-muted">Catatan (opsional)</label>
      <div className="relative mb-5">
        <MessageSquare className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          className="input-flat w-full rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none"
          type="text"
          placeholder="Bayar utang"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-primary py-2.5 text-sm font-semibold text-base transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {loading ? 'Memproses...' : 'Kirim'}
      </button>
    </form>
  );
});
export default TransferForm;