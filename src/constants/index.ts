export const TONCENTER_ENDPOINT = import.meta.env.VITE_TONCENTER_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC';
export const TONCENTER_API_KEY = import.meta.env.VITE_TONCENTER_API_KEY || '';
export const WORKCHAIN = Number(import.meta.env.VITE_WORKCHAIN ?? 0);
export const BALANCE_POLL_INTERVAL = Number(import.meta.env.VITE_BALANCE_POLL_INTERVAL ?? 15_000);
export const TX_CACHE_TTL = Number(import.meta.env.VITE_TX_CACHE_TTL ?? 300_000);
export const TONSCAN_TESTNET_URL = import.meta.env.VITE_TONSCAN_URL || 'https://testnet.tonscan.org';
