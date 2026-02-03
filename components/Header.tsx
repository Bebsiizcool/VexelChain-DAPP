import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from './Icon';
import { useWallet, NETWORKS } from '../contexts/WalletContext';
import logo from '../assets/vexel-logo.png';

export const Header: React.FC = () => {
  const { account, connectWallet, disconnectWallet, isConnected, currentNetwork, switchNetwork } = useWallet();
  const location = useLocation();

  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const networkRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path ? 'text-white' : 'text-white/70 hover:text-white';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (networkRef.current && !networkRef.current.contains(event.target as Node)) {
        setIsNetworkOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: '#6F1019' }}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">

        {/* Branding */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Vexel Chain Logo"
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-3xl font-black tracking-widest text-white uppercase" style={{ fontFamily: '"Orbitron", sans-serif', letterSpacing: '0.15em' }}>
            VEXEL
          </span>
        </Link>

        {/* Navigation - Absolute Centered */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[
            { path: '/', label: 'Home' },
            { path: '/dashboard', label: 'Swap' },
            { path: '/portfolio', label: 'Portfolio' },
            { path: '/news', label: 'News' }
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 rounded-full transition-all duration-300 group ${location.pathname === link.path ? 'text-white' : 'text-white/70 hover:text-white'}`}
            >
              {/* Hover Glow Background */}
              <span className={`absolute inset-0 rounded-full bg-white/5 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ${location.pathname === link.path ? 'scale-100 opacity-100 bg-white/10' : ''}`}></span>

              {/* Text Content */}
              <span className="relative z-10 flex items-center gap-2">
                {link.label}
              </span>

              {/* Animated Underline (Active Indicator) */}
              {location.pathname === link.path && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right: Network & Wallet */}
        <div className="flex items-center gap-4">

          {/* Network Selector */}
          {isConnected && (
            <div className="relative" ref={networkRef}>
              <button
                onClick={() => setIsNetworkOpen(!isNetworkOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20 hover:bg-black/30 text-white border border-white/10 transition-all text-sm"
              >
                <div className={`w-2 h-2 rounded-full ${currentNetwork ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="hidden lg:inline">{currentNetwork?.chainName || 'Wrong Network'}</span>
                <svg className={`w-4 h-4 ml-1 transition-transform ${isNetworkOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {isNetworkOpen && (
                <div className="absolute top-full mt-2 right-0 w-56 bg-[#500b12] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 text-xs font-bold text-white/50 uppercase tracking-wider">Select Network</div>
                    {Object.values(NETWORKS).map((net) => (
                      <button
                        key={net.chainId}
                        onClick={() => { switchNetwork(net.chainId); setIsNetworkOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentNetwork?.chainId === net.chainId ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${currentNetwork?.chainId === net.chainId ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                        {net.chainName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wallet Connection */}
          {isConnected ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white font-medium text-sm hover:bg-black/30 transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-[10px]">
                  {account?.substring(2, 4)}
                </span>
                <span className="hidden sm:inline">{account?.substring(0, 6)}...{account?.substring(38)}</span>
                <svg className={`w-4 h-4 ml-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {isProfileOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-[#500b12] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                  <div className="p-2 space-y-1">
                    <Link to="/portfolio" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setIsProfileOpen(false)}>
                      <Icons.Wallet />
                      Portfolio
                    </Link>
                    <button
                      onClick={() => { disconnectWallet(); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-[#6F1019] font-bold text-sm hover:bg-gray-100 transition-all shadow-lg"
            >
              <Icons.Wallet />
              <span>Connect</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
