import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { WalletState } from '../types';
import { saveWallet, loadWallet, clearWallet } from '../lib/storage';
import { generateMnemonic, mnemonicToKeys, deriveWalletAddress, validateMnemonic } from '../lib/walletService';

interface WalletContextValue {
  state: WalletState;
  address: string | null;
  publicKey: Buffer | null;
  secretKey: Buffer | null;
  mnemonic: string[] | null;
  createWallet: () => Promise<string[]>;
  confirmWallet: () => void;
  importWallet: (words: string[]) => Promise<void>;
  logout: () => void;
}

const WalletCtx = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>('none');
  const [address, setAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<Buffer | null>(null);
  const [secretKey, setSecretKey] = useState<Buffer | null>(null);
  const [mnemonic, setMnemonic] = useState<string[] | null>(null);

  useEffect(() => {
    const saved = loadWallet();
    if (saved) {
      (async () => {
        const keys = await mnemonicToKeys(saved.mnemonic);
        setMnemonic(saved.mnemonic);
        setPublicKey(keys.publicKey as unknown as Buffer);
        setSecretKey(keys.secretKey as unknown as Buffer);
        setAddress(saved.address);
        setState('unlocked');
      })();
    }
  }, []);

  const createWallet = useCallback(async () => {
    const words = await generateMnemonic();
    const keys = await mnemonicToKeys(words);
    const addr = deriveWalletAddress(keys.publicKey as unknown as Buffer);
    setMnemonic(words);
    setPublicKey(keys.publicKey as unknown as Buffer);
    setSecretKey(keys.secretKey as unknown as Buffer);
    setAddress(addr);
    return words;
  }, []);

  const confirmWallet = useCallback(() => {
    if (mnemonic && address) {
      saveWallet({ mnemonic, address });
      setState('unlocked');
    }
  }, [mnemonic, address]);

  const importWallet = useCallback(async (words: string[]) => {
    const valid = await validateMnemonic(words);
    if (!valid) throw new Error('Invalid mnemonic phrase');
    const keys = await mnemonicToKeys(words);
    const addr = deriveWalletAddress(keys.publicKey as unknown as Buffer);
    setMnemonic(words);
    setPublicKey(keys.publicKey as unknown as Buffer);
    setSecretKey(keys.secretKey as unknown as Buffer);
    setAddress(addr);
    saveWallet({ mnemonic: words, address: addr });
    setState('unlocked');
  }, []);

  const logout = useCallback(() => {
    clearWallet();
    setMnemonic(null);
    setPublicKey(null);
    setSecretKey(null);
    setAddress(null);
    setState('none');
  }, []);

  return (
    <WalletCtx.Provider value={{ state, address, publicKey, secretKey, mnemonic, createWallet, confirmWallet, importWallet, logout }}>
      {children}
    </WalletCtx.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error('useWallet must be inside WalletProvider');
  return ctx;
}
