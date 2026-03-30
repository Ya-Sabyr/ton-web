import { useNavigate } from 'react-router-dom';
import { TestnetHeader } from '../components/layout/TestnetHeader';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="fixed top-0 w-full z-50">
        <TestnetHeader />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-20 pb-12 max-w-lg mx-auto w-full">
        {/* Logo */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-surface-container-lowest rounded-2xl shadow-sm mb-6">
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
          </div>
          <h1 className="font-headline font-extrabold text-4xl tracking-tight text-primary mb-2">
            Digital Mint
          </h1>
          <p className="text-on-surface-variant font-body text-sm tracking-wide">
            The high-end fintech protocol for TON.
          </p>
        </div>

        {/* Hero Card */}
        <div className="w-full aspect-[4/3] relative mb-16 rounded-2xl overflow-hidden bg-surface-container-low">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="w-full bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/15 p-6 rounded-2xl shadow-lg transform -rotate-2">
              <div className="flex justify-between items-start mb-10">
                <div className="w-10 h-6 bg-primary-container/20 rounded-md" />
                <span className="material-symbols-outlined text-primary/30">contactless</span>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-surface-container-highest rounded" />
                <div className="h-4 w-1/2 bg-surface-container-high rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-4">
          <button
            onClick={() => navigate('/create')}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-5 rounded-xl font-headline font-bold text-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200"
          >
            Create New Wallet
          </button>
          <button
            onClick={() => navigate('/import')}
            className="w-full bg-transparent border border-outline-variant/15 text-primary py-5 rounded-xl font-headline font-bold text-lg hover:bg-surface-container-low active:scale-[0.98] transition-all duration-200"
          >
            Import Existing Wallet
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-12 text-center">
          <p className="text-on-surface-variant text-[11px] font-label uppercase tracking-widest leading-relaxed">
            Secure {'\u00B7'} Decentralized {'\u00B7'} Institutional Grade
          </p>
        </div>
      </main>
    </div>
  );
}
