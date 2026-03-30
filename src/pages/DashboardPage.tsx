import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useBalance } from '../hooks/useBalance';
import { useTransactions } from '../hooks/useTransactions';
import { TestnetHeader } from '../components/layout/TestnetHeader';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import { BalanceHero } from '../components/wallet/BalanceHero';
import { TransactionList } from '../components/wallet/TransactionList';

export function DashboardPage() {
  const navigate = useNavigate();
  const { address } = useWallet();
  const { balance, loading: balLoading } = useBalance(address);
  const { transactions, loading: txLoading, search, setSearch } = useTransactions(address);

  if (!address) return null;

  return (
    <div className="min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 flex flex-col">
        <TestnetHeader text="Testnet Mode \u2022 Digital Mint Protocol" />
        <TopBar />
      </header>

      <main className="pt-28 pb-32 px-6 max-w-2xl mx-auto space-y-8">
        <BalanceHero balance={balance} address={address} loading={balLoading} />

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/receive')}
            className="flex items-center justify-center gap-3 bg-surface-container-lowest py-4 rounded-xl border border-outline-variant/15 text-primary font-bold transition-all active:scale-95 shadow-sm hover:shadow-md"
          >
            <span className="material-symbols-outlined">south_west</span>
            <span>Receive</span>
          </button>
          <button
            onClick={() => navigate('/send')}
            className="flex items-center justify-center gap-3 bg-surface-container-lowest py-4 rounded-xl border border-outline-variant/15 text-primary font-bold transition-all active:scale-95 shadow-sm hover:shadow-md"
          >
            <span className="material-symbols-outlined">north_east</span>
            <span>Send</span>
          </button>
        </div>

        <TransactionList
          transactions={transactions}
          loading={txLoading}
          search={search}
          onSearchChange={setSearch}
        />
      </main>

      <BottomNav />
    </div>
  );
}
