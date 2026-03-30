import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useBalance } from '../hooks/useBalance';
import { useTransactions } from '../hooks/useTransactions';
import { useClipboard } from '../hooks/useClipboard';
import { isValidAddress, sendTransaction, formatAddress } from '../lib/walletService';
import { checkSpoofingRisks } from '../lib/addressUtils';
import { addKnownAddress } from '../lib/storage';
import { TestnetHeader } from '../components/layout/TestnetHeader';
import { TopBar } from '../components/layout/TopBar';
import { RiskWarningModal } from '../components/send/RiskWarningModal';
import { SecurityReview } from '../components/send/SecurityReview';


type SendStep = 'form' | 'risk-warning' | 'review' | 'success' | 'error';

export function SendPage() {
  const navigate = useNavigate();
  const { address: ownAddress, publicKey, secretKey } = useWallet();
  const { balance } = useBalance(ownAddress);
  const { allTransactions } = useTransactions(ownAddress);

  const { pasteFromClipboard, hijackWarning } = useClipboard();

  const [step, setStep] = useState<SendStep>('form');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [addressError, setAddressError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [sending, setSending] = useState(false);
  const [txError, setTxError] = useState('');
  const [wasPasted, setWasPasted] = useState(false);

  const balanceNum = balance ? parseFloat(balance) : 0;
  const recentAddresses = [...new Set(allTransactions.map((tx) => tx.isIncoming ? tx.from : tx.to).filter(Boolean))];

  const warnings = recipientAddress && ownAddress
    ? checkSpoofingRisks(recipientAddress, ownAddress, recentAddresses, balance || '0', amount || '0')
    : [];

  const handlePaste = useCallback(async () => {
    const text = await pasteFromClipboard();
    if (text) {
      setRecipientAddress(text);
      setAddressError('');
      setWasPasted(true);
    }
  }, [pasteFromClipboard]);

  const validateForm = (): boolean => {
    let valid = true;

    if (!recipientAddress) {
      setAddressError('Address is required');
      valid = false;
    } else if (!isValidAddress(recipientAddress)) {
      setAddressError('Invalid TON address format');
      valid = false;
    } else {
      setAddressError('');
    }

    const amtNum = parseFloat(amount);
    if (!amount || isNaN(amtNum) || amtNum <= 0) {
      setAmountError('Enter a valid amount');
      valid = false;
    } else if (amtNum > balanceNum) {
      setAmountError('Insufficient balance');
      valid = false;
    } else {
      setAmountError('');
    }

    return valid;
  };

  const handleContinueToReview = () => {
    if (!validateForm()) return;

    if (wasPasted || hijackWarning) {
      setStep('risk-warning');
    } else {
      setStep('review');
    }
  };

  const handleConfirmSend = async () => {
    if (!secretKey || !publicKey || !ownAddress) return;
    setSending(true);
    setTxError('');
    try {
      await sendTransaction(secretKey, publicKey, recipientAddress, amount);
      addKnownAddress(recipientAddress);
      setStep('success');
    } catch (err) {
      setTxError(err instanceof Error ? err.message : 'Transaction failed');
      setStep('error');
    } finally {
      setSending(false);
    }
  };

  const setPercentage = (pct: number) => {
    if (balanceNum > 0) {
      const val = (balanceNum * pct / 100);
      setAmount(val > 0.05 ? (val - 0.05).toFixed(4) : val.toFixed(4));
      setAmountError('');
    }
  };

  // Success screen
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <header className="fixed top-0 w-full z-50 flex flex-col">
          <TestnetHeader text="TESTNET MODE \u2014 NO REAL VALUE" />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-white text-4xl">check</span>
          </div>
          <h2 className="font-headline font-extrabold text-2xl text-primary mb-2">Transaction Sent</h2>
          <p className="text-on-surface-variant text-sm mb-2">
            {amount} TON sent to {formatAddress(recipientAddress)}
          </p>
          <p className="text-on-surface-variant text-xs mb-8">
            It may take 15-30 seconds to appear in the history.
          </p>
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            className="w-full max-w-sm py-5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-lg shadow-lg active:scale-[0.98] transition-all"
          >
            Back to Wallet
          </button>
        </main>
      </div>
    );
  }

  // Error screen
  if (step === 'error') {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <header className="fixed top-0 w-full z-50 flex flex-col">
          <TestnetHeader text="TESTNET MODE \u2014 NO REAL VALUE" />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 bg-error-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-error text-4xl">close</span>
          </div>
          <h2 className="font-headline font-extrabold text-2xl text-error mb-2">Transaction Failed</h2>
          <p className="text-on-surface-variant text-sm mb-8 text-center max-w-sm">{txError}</p>
          <button
            onClick={() => setStep('form')}
            className="w-full max-w-sm py-5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-lg shadow-lg active:scale-[0.98] transition-all mb-4"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-on-surface-variant font-medium text-sm hover:text-primary transition-colors"
          >
            Cancel
          </button>
        </main>
      </div>
    );
  }

  // Review screen
  if (step === 'review') {
    return (
      <div className="min-h-screen bg-surface">
        <header className="fixed top-0 w-full z-50 flex flex-col">
          <TestnetHeader text="Testnet Environment \u2022 No Real Value" />
          <TopBar showClose centered title="Review" />
        </header>
        <SecurityReview
          address={recipientAddress}
          amount={amount}
          warnings={warnings}
          onConfirm={handleConfirmSend}
          onCancel={() => setStep('form')}
          sending={sending}
        />
      </div>
    );
  }

  // Form screen
  return (
    <div className="min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 flex flex-col relative">
        <TestnetHeader text="TESTNET MODE \u2014 NO REAL VALUE" />
        <TopBar showClose centered title="Send TON" />
      </header>

      <main className="pt-28 pb-32 px-6 max-w-lg mx-auto">
        {/* Recipient */}
        <section className="mb-10">
          <label className="block font-headline text-sm font-bold text-on-surface-variant mb-4 uppercase tracking-wider">
            Recipient
          </label>
          <div className="relative group">
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => { setRecipientAddress(e.target.value); setAddressError(''); setWasPasted(false); }}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-5 pr-28 text-base font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline outline-none"
              placeholder="Address or name.ton"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={handlePaste}
                className="flex items-center gap-1 bg-surface-container-high px-3 py-2 rounded-lg text-primary text-xs font-bold transition-all hover:bg-surface-container-highest active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">content_paste</span>
                PASTE
              </button>
            </div>
          </div>
          {addressError && (
            <p className="mt-2 text-error text-xs font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">error</span>
              {addressError}
            </p>
          )}
        </section>

        {/* Amount */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <label className="font-headline text-sm font-bold text-on-surface-variant uppercase tracking-wider">
              Amount
            </label>
            <span className="text-xs text-secondary font-medium">
              Available: <span className="text-on-surface font-bold">{balanceNum.toFixed(2)} TON</span>
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-center shadow-sm">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-headline font-extrabold text-primary">TON</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setAmountError(''); }}
                className="bg-transparent border-none text-5xl font-headline font-extrabold text-center w-full focus:ring-0 p-0 tracking-tighter outline-none"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex gap-2 w-full overflow-x-auto pb-2 mt-4">
              {[25, 50, 75].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setPercentage(pct)}
                  className="bg-surface-container-low px-4 py-2 rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors flex-1 min-w-[60px]"
                >
                  {pct}%
                </button>
              ))}
              <button
                onClick={() => setPercentage(100)}
                className="bg-surface-container-high px-4 py-2 rounded-xl text-sm font-bold text-primary transition-colors flex-1 min-w-[60px]"
              >
                MAX
              </button>
            </div>
          </div>
          {amountError && (
            <div className="mt-4 bg-error-container text-on-error-container p-3 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-error">warning</span>
              <span className="text-xs font-semibold leading-tight">{amountError}</span>
            </div>
          )}
        </section>

        {/* Fee info */}
        <section className="bg-surface-container-low rounded-xl p-4 mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-secondary font-medium uppercase tracking-widest">Network Fee</span>
            <span className="text-xs font-semibold">~0.015 TON</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-secondary font-medium uppercase tracking-widest">Estimated Time</span>
            <div className="flex items-center gap-1 text-xs font-bold text-on-surface">
              <span className="material-symbols-outlined text-sm">bolt</span>
              ~ 5-10 seconds
            </div>
          </div>
        </section>
      </main>

      {/* Fixed bottom CTA */}
      <footer className="fixed bottom-0 left-0 w-full p-6 bg-surface/90 backdrop-blur-xl">
        <button
          onClick={handleContinueToReview}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-5 rounded-xl font-headline font-extrabold text-lg shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          Continue to Review
        </button>
      </footer>

      {/* Risk Warning Modal */}
      {step === 'risk-warning' && (
        <RiskWarningModal
          address={recipientAddress}
          amount={amount}
          onContinue={() => setStep('review')}
          onCancel={() => setStep('form')}
        />
      )}
    </div>
  );
}
