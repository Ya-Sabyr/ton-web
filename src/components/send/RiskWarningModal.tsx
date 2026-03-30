import { useState } from 'react';
import { splitAddress } from '../../lib/addressUtils';

interface RiskWarningModalProps {
  address: string;
  amount: string;
  onContinue: () => void;
  onCancel: () => void;
}

export function RiskWarningModal({ address, amount, onContinue, onCancel }: RiskWarningModalProps) {
  const [verified, setVerified] = useState(false);
  const { first, middle, last } = splitAddress(address);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-surface-container-lowest w-full max-w-md rounded-xl overflow-hidden shadow-[0_24px_48px_rgba(25,28,30,0.12)] animate-slide-up">
        {/* Amber Header */}
        <div className="bg-tertiary-container text-on-tertiary-container px-6 py-4 flex items-center gap-3">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <span className="font-headline font-bold text-lg">Critical Risk Warning - Verify Address</span>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <p className="text-on-surface font-medium">This address was just pasted from your clipboard.</p>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Malicious software can sometimes swap addresses in your clipboard. Ensure you are sending to the intended recipient to prevent permanent loss of funds.
            </p>
          </div>

          {/* Address breakdown */}
          <div className="bg-surface-container-low p-5 rounded-xl space-y-4">
            <div className="space-y-2">
              <span className="font-label text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Recipient Address</span>
              <div className="flex items-center gap-1 font-mono text-sm tracking-tight text-on-surface bg-surface-container-highest/50 p-3 rounded-lg border border-outline-variant/15">
                <span className="bg-tertiary-fixed text-on-tertiary-fixed px-1 rounded font-bold">{first}</span>
                <span className="opacity-40">{middle.length > 12 ? `${middle.slice(0, 6)}...${middle.slice(-6)}` : middle}</span>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed px-1 rounded font-bold">{last}</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="font-label text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Transaction Amount</span>
                <div className="text-2xl font-headline font-extrabold text-primary">{amount} TON</div>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-error-container/30 rounded-lg">
              <span className="material-symbols-outlined text-error text-sm" style={{ fontVariationSettings: "'wght' 700" }}>info</span>
              <p className="text-xs font-semibold text-on-error-container">
                Verify the first and last characters of the address manually.
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="h-5 w-5 rounded border-outline text-primary focus:ring-primary-container cursor-pointer"
              />
              <span className="text-sm font-medium text-on-surface select-none group-hover:text-primary transition-colors">
                I have verified the address manually
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onContinue}
              disabled={!verified}
              className={`w-full py-4 rounded-xl font-headline font-bold text-center shadow-lg transition-all active:scale-95 ${
                verified
                  ? 'bg-gradient-to-br from-primary to-primary-container text-white shadow-primary/20'
                  : 'bg-primary-container/50 text-white/50 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
            <button
              onClick={onCancel}
              className="w-full py-3 rounded-xl font-headline font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
