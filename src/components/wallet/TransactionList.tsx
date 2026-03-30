import type { ParsedTransaction } from '../../types';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
  transactions: ParsedTransaction[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
}

export function TransactionList({ transactions, loading, search, onSearchChange }: TransactionListProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-xl font-bold text-on-surface">Recent Activity</h2>
      </div>

      {/* Search */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-outline text-lg">search</span>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline outline-none"
          placeholder="Search history..."
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all group-focus-within:w-full" />
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading && transactions.length === 0 ? (
          // Skeleton
          <div className="opacity-40 animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-highest rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-surface-container-highest rounded" />
                    <div className="h-3 w-20 bg-surface-container-highest rounded" />
                  </div>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                  <div className="h-4 w-16 bg-surface-container-highest rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-4xl text-outline opacity-40">history</span>
            </div>
            <h3 className="font-headline text-lg font-bold">No transactions yet</h3>
            <p className="text-on-surface-variant max-w-[200px] text-sm">
              Receive your first TON to see your history here.
            </p>
          </div>
        ) : (
          transactions.map((tx) => <TransactionItem key={tx.hash} tx={tx} />)
        )}
      </div>
    </section>
  );
}
