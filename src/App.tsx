import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider, useWallet } from './context/WalletContext';
import { WelcomePage } from './pages/WelcomePage';
import { CreateWalletPage } from './pages/CreateWalletPage';
import { ImportWalletPage } from './pages/ImportWalletPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReceivePage } from './pages/ReceivePage';
import { SendPage } from './pages/SendPage';

function AppRoutes() {
  const { state } = useWallet();

  if (state === 'none') {
    return (
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/create" element={<CreateWalletPage />} />
        <Route path="/import" element={<ImportWalletPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/receive" element={<ReceivePage />} />
      <Route path="/send" element={<SendPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        <AppRoutes />
      </WalletProvider>
    </BrowserRouter>
  );
}
