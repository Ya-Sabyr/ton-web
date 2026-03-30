import { useState } from 'react';
import { splitAddress } from '../../lib/addressUtils';
import type { SpoofingWarning } from '../../types';
import { formatAddress } from '../../lib/walletService';

interface SecurityReviewProps {
  address: string;
  amount: string;
  warnings: SpoofingWarning[];
  onConfirm: () => void;
  onCancel: () => void;
  sending: boolean;
}

export function SecurityReview({ address, amount, warnings, onConfirm, onCancel, sending }: SecurityReviewProps) {
  const [verified, setVerified] = useState(false);
  const { first, middle, last } = splitAddress(address);

  return (
    <div className="pt-24 px-6 max-w-lg mx-auto pb-32">
      {/* Amount Display */}
      <section className="mt-8 mb-12 text-center">
        <p className="font-label text-xs uppercase tracking-[0.1em] text-secondary mb-2">Review Transaction</p>
        <h2 className="font-headline font-extrabold text-[3.5rem] leading-none tracking-tight text-primary">
          {parseFloat(amount).toFixed(2)} <span className="text-2xl font-bold align-middle opacity-60">TON</span>
        </h2>
      </section>

      {/* Risk Cards */}
      {warnings.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {warnings.map((w, i) => (
            <div
              key={i}
              className={`bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-32 ${
                w.title === 'New Address' ? 'border-l-4 border-error' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`material-symbols-outlined ${
                    w.level === 'danger' || w.title === 'New Address' ? 'text-error' : 'text-tertiary'
                  }`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {w.level === 'info' ? 'warning' : w.title === 'High Amount' ? 'monetization_on' : 'warning'}
                </span>
                {(w.title === 'New Address' || w.level === 'danger') && (
                  <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    High Risk
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-headline font-bold text-sm">{w.title}</h3>
                <p className="text-[11px] text-on-surface-variant leading-tight">{w.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Verification */}
      <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_8px_24px_rgba(25,28,30,0.06)] mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">Recipient Address</p>
            <p className="font-headline font-bold text-on-surface">External Wallet</p>
          </div>
        </div>

        <div className="bg-surface-container-high p-4 rounded-xl mb-6 break-all">
          <p className="font-body text-xs text-on-surface-variant mb-2 font-medium">Is this the correct address?</p>
          <p className="font-headline font-extrabold text-xl tracking-tight text-primary">
            {formatAddress(address)}
          </p>
          <div className="mt-3 flex items-center gap-2 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/15">
            <span className="text-[13px] font-mono text-on-surface-variant break-all">
              <span className="text-primary font-bold">{first}</span>
              {middle.length > 20 ? `${middle.slice(0, 8)}...${middle.slice(-8)}` : middle}
              <span className="text-primary font-bold">{last}</span>
            </span>
          </div>
        </div>

        <p className="text-[11px] text-on-surface-variant leading-relaxed mb-6">
          Address Substitution Protection: Please verify the highlighted characters match your intended recipient. Malicious software can swap addresses in your clipboard.
        </p>

        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex items-center justify-center mt-1">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary-container cursor-pointer"
            />
          </div>
          <span className="text-sm font-medium text-on-surface leading-tight">
            I have manually verified that every character of the recipient address is correct.
          </span>
        </label>
      </section>

      {/* Fee Details */}
      <div className="bg-surface-container-low rounded-xl p-4 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-on-surface-variant">Network Fee</span>
          <span className="text-xs font-semibold">~0.015 TON</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-on-surface-variant">Arrival Estimation</span>
          <span className="text-xs font-semibold text-primary">~15 Seconds</span>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={onConfirm}
        disabled={!verified || sending}
        className={`w-full py-5 rounded-xl font-headline font-extrabold text-lg shadow-lg transition-all active:scale-95 ${
          verified && !sending
            ? 'bg-gradient-to-br from-primary to-primary-container text-white'
            : 'bg-surface-container-high text-outline cursor-not-allowed'
        }`}
      >
        {sending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            Sending...
          </span>
        ) : (
          'Confirm & Send'
        )}
      </button>
      <button
        onClick={onCancel}
        disabled={sending}
        className="w-full mt-4 text-on-surface-variant font-medium text-sm py-2 hover:text-primary transition-colors"
      >
        Cancel Transaction
      </button>
    </div>
  );
}
