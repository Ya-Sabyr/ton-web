import { useState, useEffect, useCallback } from 'react';
import { getBalance } from '../lib/walletService';
import { BALANCE_POLL_INTERVAL } from '../constants';

export function useBalance(address: string | null) {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const bal = await getBalance(address);
      setBalance(bal);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, BALANCE_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return { balance, loading, refresh };
}
