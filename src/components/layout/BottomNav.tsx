import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/dashboard', icon: 'account_balance_wallet', label: 'Wallet', filled: true },
  { path: '/history', icon: 'history', label: 'History', filled: false },
  { path: '/settings', icon: 'settings', label: 'Settings', filled: false },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface/80 backdrop-blur-xl shadow-[0_-8px_24px_rgba(25,28,30,0.06)] rounded-t-2xl">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.path === '/dashboard' && location.pathname.startsWith('/dashboard'));
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center px-6 py-2 rounded-xl transition-transform duration-200 active:scale-90 ${
              isActive ? 'bg-surface-container-high text-primary' : 'text-outline hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive && tab.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="font-label text-[10px] font-medium tracking-wide uppercase mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
