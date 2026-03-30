import type { ParsedTransaction } from '../../types';
import { formatAddress } from '../../lib/walletService';

interface TransactionItemProps {
  tx: ParsedTransaction;
}

export function TransactionItem({ tx }: TransactionItemProps) {
  const date = new Date(tx.time * 1000);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="group flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${
          tx.isIncoming
            ? 'bg-secondary-container text-primary'
            : 'bg-error-container text-error'
        }`}>
          <span className="material-symbols-outlined">
            {tx.isIncoming ? 'call_received' : 'call_made'}
          </span>
        </div>
        <div>
          <p className="font-semibold text-on-surface">
            {tx.isIncoming ? `From: ${formatAddress(tx.from)}` : `To: ${formatAddress(tx.to)}`}
          </p>
          <p className="text-xs text-on-surface-variant">{dateStr} {'\u2022'} {timeStr}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${tx.isIncoming ? 'text-primary' : 'text-error'}`}>
          {tx.isIncoming ? '+' : '-'} {parseFloat(tx.amount).toFixed(2)} TON
        </p>
      </div>
    </div>
  );
}
