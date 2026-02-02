import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { PriceProvider } from './contexts/PriceContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { NewsPage } from './pages/NewsPage';

function App() {
  return (
    <Router>
      <WalletProvider>
        <PriceProvider>
          <TransactionProvider>
            <div className="min-h-screen font-sans selection:bg-orange-500/30" style={{ backgroundColor: '#050a10', backgroundImage: 'radial-gradient(circle at 50% 0%, #1a0505 0%, #050a10 70%)' }}>
              <Header />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/news" element={<NewsPage />} />
              </Routes>
            </div>
          </TransactionProvider>
        </PriceProvider>
      </WalletProvider>
    </Router>
  );
}
export default App;
