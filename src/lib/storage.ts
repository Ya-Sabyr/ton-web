import type { WalletData, ParsedTransaction } from '../types';
import { TX_CACHE_TTL } from '../constants';

const WALLET_KEY = 'dm_wallet';
const TX_CACHE_KEY = 'dm_tx_cache';
const TX_CACHE_TS_KEY = 'dm_tx_cache_ts';
const KNOWN_ADDRESSES_KEY = 'dm_known_addresses';

export function saveWallet(data: WalletData): void {
  localStorage.setItem(WALLET_KEY, JSON.stringify(data));
}

export function loadWallet(): WalletData | null {
  const raw = localStorage.getItem(WALLET_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearWallet(): void {
  localStorage.removeItem(WALLET_KEY);
  localStorage.removeItem(TX_CACHE_KEY);
  localStorage.removeItem(TX_CACHE_TS_KEY);
  localStorage.removeItem(KNOWN_ADDRESSES_KEY);
}

export function cacheTxs(txs: ParsedTransaction[]): void {
  localStorage.setItem(TX_CACHE_KEY, JSON.stringify(txs));
  localStorage.setItem(TX_CACHE_TS_KEY, String(Date.now()));
}

export function loadCachedTxs(): ParsedTransaction[] | null {
  const ts = localStorage.getItem(TX_CACHE_TS_KEY);
  if (!ts || Date.now() - Number(ts) > TX_CACHE_TTL) return null;
  const raw = localStorage.getItem(TX_CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getKnownAddresses(): string[] {
  const raw = localStorage.getItem(KNOWN_ADDRESSES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addKnownAddress(address: string): void {
  const known = getKnownAddresses();
  if (!known.includes(address)) {
    known.push(address);
    localStorage.setItem(KNOWN_ADDRESSES_KEY, JSON.stringify(known));
  }
}
