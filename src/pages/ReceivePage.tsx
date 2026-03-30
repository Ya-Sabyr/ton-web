import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useWallet } from '../context/WalletContext';
import { useClipboard } from '../hooks/useClipboard';
import { TestnetHeader } from '../components/layout/TestnetHeader';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';

export function ReceivePage() {
  const { address } = useWallet();
  const { copyToClipboard } = useClipboard();
  const [copied, setCopied] = useState(false);

  if (!address) return null;

  const handleCopy = async () => {
    const ok = await copyToClipboard(address);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 flex flex-col">
        <TestnetHeader text="TESTNET ASSETS ONLY" />
        <TopBar title="Receive" showBack />
      </header>

      <main className="pt-24 pb-32 px-6 max-w-lg mx-auto flex flex-col items-center">
        {/* QR Code */}
        <div className="w-full mt-8 flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-surface-container-low rounded-[2.5rem] -z-10" />
            <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm flex flex-col items-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <QRCodeSVG
                  value={address}
                  size={240}
                  bgColor="transparent"
                  fgColor="#006193"
                  level="M"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-surface-container-lowest p-2 rounded-lg shadow-md">
                    <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="w-full mt-12 bg-surface-container-low p-6 rounded-xl text-center">
          <span className="font-label text-xs font-bold text-secondary uppercase tracking-widest mb-3 block">
            Your Wallet Address
          </span>
          <p className="font-body text-sm font-semibold text-on-surface break-all leading-relaxed tracking-tight px-4">
            {address}
          </p>
        </div>

        {/* Actions */}
        <div className="w-full mt-8 flex flex-col gap-4">
          <button
            onClick={handleCopy}
            className="w-full py-5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>

        {/* Warning */}
        <div className="w-full mt-10 p-6 rounded-xl bg-error-container/40 border border-error/10">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-error mt-1">warning</span>
            <div>
              <h3 className="font-headline font-bold text-error text-base mb-1">Important Instruction</h3>
              <p className="font-body text-sm text-on-error-container leading-relaxed">
                Only send <span className="font-bold">TON (TESTNET)</span> assets to this address. Sending Mainnet assets or other tokens will result in{' '}
                <span className="font-bold">permanent loss of funds.</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
