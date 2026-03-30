import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { TestnetHeader } from '../components/layout/TestnetHeader';
import { TopBar } from '../components/layout/TopBar';
import { MnemonicGrid } from '../components/wallet/MnemonicGrid';

export function CreateWalletPage() {
  const navigate = useNavigate();
  const { createWallet, confirmWallet } = useWallet();
  const [words, setWords] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const mnemonic = await createWallet();
      setWords(mnemonic);
      setLoading(false);
    })();
  }, [createWallet]);

  const handleContinue = () => {
    confirmWallet();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="fixed top-0 w-full z-50 flex flex-col">
        <TestnetHeader />
        <TopBar showClose />
      </header>

      <main className="flex-1 mt-24 mb-12 px-6 max-w-2xl mx-auto w-full">
        <section className="mb-10 text-center">
          <h2 className="font-headline text-3xl font-extrabold tracking-tight mb-2">Secret Recovery Phrase</h2>
          <p className="text-on-surface-variant text-sm px-4">
            This phrase is the only way to recover your wallet if you lose access. Write it down and store it somewhere safe.
          </p>
        </section>

        {/* Warning */}
        <div className="bg-error-container text-on-error-container p-5 rounded-xl mb-8 flex items-start gap-4 shadow-sm border border-error/5">
          <span className="material-symbols-outlined text-error mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <div className="flex flex-col gap-1">
            <p className="font-bold text-sm">Never share this with anyone. If lost, funds are gone.</p>
            <p className="text-xs opacity-80">Digital Mint staff will never ask for this phrase. Anyone with these words can take all your funds.</p>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
          </div>
        ) : (
          <MnemonicGrid words={words} />
        )}

        {/* Pen & Paper reminder */}
        <div className="mt-10 mb-10 p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="material-symbols-outlined text-primary text-3xl">edit_note</span>
          </div>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
            Take a physical pen and paper.<br />
            Digital copies (screenshots, cloud storage) are vulnerable to hackers.
          </p>
        </div>

        {/* Confirm */}
        <div className="space-y-6">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={saved}
                onChange={(e) => setSaved(e.target.checked)}
                className="peer appearance-none w-6 h-6 border-2 border-outline rounded-md checked:bg-primary checked:border-primary transition-all duration-200 cursor-pointer"
              />
              <span className="material-symbols-outlined absolute text-white opacity-0 peer-checked:opacity-100 text-sm pointer-events-none">check</span>
            </div>
            <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
              I have saved my recovery phrase safely.
            </span>
          </label>

          <button
            onClick={handleContinue}
            disabled={!saved}
            className={`w-full py-5 rounded-xl font-headline font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${
              saved
                ? 'bg-gradient-to-br from-primary to-primary-container text-white shadow-primary/20 hover:brightness-110'
                : 'bg-gradient-to-br from-primary to-primary-container text-white opacity-50 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}
