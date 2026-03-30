import { useState } from 'react';
import { formatAddress } from '../../lib/walletService';
import { useClipboard } from '../../hooks/useClipboard';

interface BalanceHeroProps {
  balance: string | null;
  address: string;
  loading?: boolean;
}

export function BalanceHero({ balance, address, loading }: BalanceHeroProps) {
  const { copyToClipboard } = useClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(address);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayBalance = balance !== null ? parseFloat(balance).toFixed(2) : '---';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-container p-8 rounded-[2rem] text-on-primary shadow-xl">
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="font-label text-xs font-semibold tracking-widest uppercase opacity-80 mb-2">
          Available TON Balance
        </span>
        <div className="font-headline text-[3.5rem] font-extrabold tracking-tighter leading-none mb-4">
          {loading && balance === null ? (
            <span className="animate-pulse">...</span>
          ) : (
            <>
              {displayBalance} <span className="text-2xl font-bold opacity-60">TON</span>
            </>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all active:scale-95 cursor-pointer"
        >
          <span className="font-body text-xs font-medium tracking-tight">
            {copied ? 'Copied!' : formatAddress(address)}
          </span>
          <span className="material-symbols-outlined text-sm">content_copy</span>
        </button>
      </div>
    </section>
  );
}
