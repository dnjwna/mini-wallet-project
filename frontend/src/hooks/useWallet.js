import { useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

export function useWallet() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const fetchBalance = useCallback(async () => {
    setLoadingBalance(true);
    try {
      const { data } = await api.get('/wallet');
      setBalance(data.data.balance);
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data.data);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const topup = useCallback(
    async (amount) => {
      setActionLoading(true);
      setActionError(null);
      try {
        await api.post('/topup', { amount: Number(amount) });
        await Promise.all([fetchBalance(), fetchHistory()]);
        return true;
      } catch (err) {
        setActionError(err.response?.data?.message || 'Top up gagal.');
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchBalance, fetchHistory]
  );

  const transfer = useCallback(
    async (target, amount, description) => {
      setActionLoading(true);
      setActionError(null);
      try {
        await api.post('/transfer', { target, amount: Number(amount), description });
        await Promise.all([fetchBalance(), fetchHistory()]);
        return true;
      } catch (err) {
        setActionError(err.response?.data?.message || 'Transfer gagal.');
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchBalance, fetchHistory]
  );

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, [fetchBalance, fetchHistory]);

  return {
    balance,
    transactions,
    loadingBalance,
    loadingHistory,
    actionLoading,
    actionError,
    setActionError,
    topup,
    transfer,
    refresh: () => Promise.all([fetchBalance(), fetchHistory()]),
  };
}
