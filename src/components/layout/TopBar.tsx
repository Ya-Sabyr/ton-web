import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showClose?: boolean;
  rightAction?: React.ReactNode;
  centered?: boolean;
}

export function TopBar({ title, showBack, showClose, rightAction, centered }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <nav className="bg-surface px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-surface-container-high rounded-full transition-all active:scale-95">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
        )}
        {showClose && (
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-surface-container-high rounded-full transition-all active:scale-95">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        )}
        {!centered && (
          title ? (
            <h1 className="font-headline font-bold tracking-tight text-xl text-primary">{title}</h1>
          ) : (
            <>
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              <h1 className="font-headline font-bold tracking-tight text-xl text-primary">Digital Mint</h1>
            </>
          )
        )}
      </div>
      {centered && (
        <h1 className="font-headline font-bold tracking-tight text-xl text-primary absolute left-1/2 -translate-x-1/2">{title}</h1>
      )}
      <div className="flex items-center gap-4">
        {rightAction}
      </div>
    </nav>
  );
}
