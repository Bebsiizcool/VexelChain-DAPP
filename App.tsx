import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { PriceProvider } from './contexts/PriceContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PortfolioPage } from './pages/PortfolioPage';

function App() {
  return (
    <Router>
      <WalletProvider>
        <PriceProvider>
          <TransactionProvider>
            <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500/30">
              <Header />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
              </Routes>
            </div>
          </TransactionProvider>
        </PriceProvider>
      </WalletProvider>
    </Router>
  );
}
export default App;
