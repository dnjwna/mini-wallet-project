import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import AmbientBackground from '../components/AmbientBackground';
import BalanceCard from '../components/BalanceCard';
import TopupModal from '../components/TopupModal';
import TransferForm from '../components/TransferForm';
import TransactionTable from '../components/TransactionTable';

export default function DashboardPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [topupOpen, setTopupOpen] = useState(false);
  const transferInputRef = useRef(null);

  const {
    balance,
    transactions,
    loadingBalance,
    loadingHistory,
    actionLoading,
    actionError,
    setActionError,
    topup,
    transfer,
  } = useWallet();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

    const focusTransfer = () => {
    document.getElementById('transfer-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    transferInputRef.current?.focus();
  };

  const initial = user?.name?.[0]?.toUpperCase() || 'U';
  const displayName = user?.name || 'Pengguna';

  return (
    <div className="relative min-h-screen font-body">
      <AmbientBackground />

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent-emerald/70 to-ink-faint/40 font-display text-sm font-bold text-base">
              {initial}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">
                Akun Pribadi
              </p>
              <p className="font-display text-base font-bold text-ink-primary">{displayName}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/[0.03] text-ink-muted transition hover:bg-white/[0.06] hover:text-ink-primary"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-6">
            <BalanceCard
              balance={balance}
              loading={loadingBalance}
              onTopupClick={() => setTopupOpen(true)}
              onTransferClick={focusTransfer}
            />

            <div id="transfer-section">
              <TransferForm
                ref={transferInputRef}
                onSubmit={transfer}
                loading={actionLoading}
                error={actionError}
                clearError={() => setActionError(null)}
              />
            </div>
          </div>

          <TransactionTable transactions={transactions} loading={loadingHistory} />
        </div>
      </div>

      <TopupModal
        open={topupOpen}
        onClose={() => {
          setTopupOpen(false);
          setActionError(null);
        }}
        onSubmit={topup}
        loading={actionLoading}
        error={actionError}
        clearError={() => setActionError(null)}
      />
    </div>
  );
}