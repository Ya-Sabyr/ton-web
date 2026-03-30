import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTransactions } from '../lib/walletService';
import { cacheTxs, loadCachedTxs } from '../lib/storage';
import type { ParsedTransaction } from '../types';

export function useTransactions(address: string | null) {
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchTxs = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const cached = loadCachedTxs();
      if (cached) {
        setTransactions(cached);
        setLoading(false);
      }
      const txs = await getTransactions(address);
      setTransactions(txs);
      cacheTxs(txs);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      const cached = loadCachedTxs();
      if (cached) setTransactions(cached);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchTxs();
  }, [fetchTxs]);

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.from.toLowerCase().includes(q) ||
        tx.to.toLowerCase().includes(q) ||
        tx.amount.includes(q) ||
        tx.comment.toLowerCase().includes(q),
    );
  }, [transactions, search]);

  return { transactions: filtered, allTransactions: transactions, loading, search, setSearch, refresh: fetchTxs };
}
