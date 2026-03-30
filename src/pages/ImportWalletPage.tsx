import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { TestnetHeader } from '../components/layout/TestnetHeader';
import { TopBar } from '../components/layout/TopBar';

export function ImportWalletPage() {
  const navigate = useNavigate();
  const { importWallet } = useWallet();
  const [phrase, setPhrase] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const words = phrase.trim().split(/\s+/).filter(Boolean);
  const validCount = words.length === 24 || words.length === 12;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPhrase(text.trim());
      setError('');
    } catch {
      // clipboard not available
    }
  };

  const handleImport = async () => {
    if (!validCount) return;
    setLoading(true);
    setError('');
    try {
      await importWallet(words);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid recovery phrase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="fixed top-0 w-full z-50 flex flex-col">
        <TestnetHeader />
        <TopBar showClose />
      </header>

      <main className="flex-grow pt-32 pb-12 px-6 flex flex-col items-center max-w-2xl mx-auto w-full">
        {/* Header */}
        <section className="w-full mb-10 text-left">
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface leading-tight mb-4">
            Import Your <span className="text-primary">Vault</span>
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
            Enter your 12 or 24-word recovery phrase to restore your digital assets and history.
          </p>
        </section>

        {/* Input Card */}
        <div className="w-full grid grid-cols-1 gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_24px_rgba(25,28,30,0.04)] flex flex-col gap-4 relative">
            <div className="flex justify-between items-center mb-2">
              <label className="font-headline font-bold text-sm tracking-wide text-on-surface-variant uppercase">Recovery Phrase</label>
              <button
                onClick={handlePaste}
                className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-lg text-primary text-xs font-semibold hover:bg-surface-container-highest transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">content_paste</span>
                Paste from clipboard
              </button>
            </div>

            <div className="relative group">
              <textarea
                value={phrase}
                onChange={(e) => { setPhrase(e.target.value); setError(''); }}
                className="w-full h-48 bg-surface-container-low border-none rounded-xl p-5 text-on-surface font-body text-base leading-relaxed focus:ring-0 focus:outline-none placeholder:text-outline/50 resize-none transition-all"
                placeholder="Enter your seed phrase here..."
              />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-center" />
            </div>

            {/* Validation badges */}
            <div className="flex flex-wrap gap-4 mt-2">
              {words.length > 0 && validCount && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-100">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Valid Word Count
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 bg-error-container text-on-error-container px-3 py-1.5 rounded-full text-xs font-medium">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Security notice */}
          <div className="bg-surface-container-low rounded-xl p-6 flex gap-4 items-start border border-outline-variant/15">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">security</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-on-surface text-base mb-1">Stay Secure</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Digital Mint never transmits your recovery phrase. This process happens locally on your device. Never share your phrase with anyone.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-col gap-4">
            <button
              onClick={handleImport}
              disabled={!validCount || loading}
              className={`w-full py-5 rounded-xl font-headline font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                validCount && !loading
                  ? 'bg-gradient-to-br from-primary to-primary-container text-white hover:shadow-primary/20 active:scale-[0.98]'
                  : 'bg-surface-container-high text-outline cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Importing...
                </>
              ) : (
                <>
                  Import Wallet
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/create')}
              className="w-full py-4 text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors"
            >
              I don't have a recovery phrase
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
