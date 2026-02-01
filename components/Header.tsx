import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from './Icon';
import { useWallet, NETWORKS } from '../contexts/WalletContext';
import logo from '../assets/logo.png';

export const Header: React.FC = () => {
  const { account, connectWallet, disconnectWallet, isConnected, currentNetwork, switchNetwork } = useWallet();
  const location = useLocation();

  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const networkRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path ? 'text-cyan-400' : 'hover:text-cyan-400';

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
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 backdrop-blur-md h-20">
      <div className="container mx-auto px-4 h-full relative flex items-center justify-between">

        {/* Left: Navigation Links */}
        <nav className="flex items-center gap-8 text-sm font-medium text-slate-400 z-10 w-1/3">
          <Link to="/" className={`${isActive('/')} transition-colors font-bold`}>Home</Link>
          <Link to="/dashboard" className={`${isActive('/dashboard')} transition-colors`}>Trade</Link>
          <Link to="/portfolio" className={`${isActive('/portfolio')} transition-colors`}>Portfolio</Link>
        </nav>

        {/* Center: Constructed Brand (Blue + Overflowing Logo + Peak) */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full flex items-center justify-center z-20 pointer-events-none w-1/3">
          <Link to="/" className="flex items-center gap-0 pointer-events-auto group">
            {/* Visual Updates: No Italic, Reduced Glow, Tight Gap */}
            <span className="text-3xl font-black tracking-tighter text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)] uppercase" style={{ fontFamily: 'system-ui, sans-serif' }}>Blue</span>

            <div className="relative">
              {/* Glow effect - Reduced opacity and blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500/10 rounded-full blur-lg group-hover:bg-cyan-500/20 transition-colors"></div>
              {/* Logo Image */}
              <img
                src={logo}
                alt="Logo"
                className="h-32 w-auto object-contain transform translate-y-4 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.3)] transition-transform group-hover:scale-105"
              />
            </div>

            <span className="text-3xl font-black tracking-tighter text-purple-500 drop-shadow-[0_0_5px_rgba(168,85,247,0.3)] uppercase" style={{ fontFamily: 'system-ui, sans-serif' }}>Peak</span>
          </Link>
        </div>

        {/* Right: Network & Wallet */}
        <div className="flex items-center justify-end gap-4 z-10 w-1/3">

          {/* Network Selector */}
          {/* Network Selector */}
          {isConnected && (
            <div className="relative" ref={networkRef}>
              <button
                onClick={() => setIsNetworkOpen(!isNetworkOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-sm font-mono text-cyan-400"
              >
                <div className={`w-2 h-2 rounded-full ${currentNetwork ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <span className="hidden lg:inline">{currentNetwork?.chainName || 'Wrong Network'}</span>
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {isNetworkOpen && (
                <div className="absolute top-full mt-2 right-0 w-56 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Select Network</div>
                    {Object.values(NETWORKS).map((net) => (
                      <button
                        key={net.chainId}
                        onClick={() => { switchNetwork(net.chainId); setIsNetworkOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentNetwork?.chainId === net.chainId ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${currentNetwork?.chainId === net.chainId ? 'bg-cyan-400' : 'bg-slate-600'}`}></div>
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
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium text-sm hover:border-cyan-500/50 transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-[10px]">
                  {account?.substring(2, 4)}
                </span>
                <span className="hidden sm:inline">{account?.substring(0, 6)}...{account?.substring(38)}</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {isProfileOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                  <div className="p-2 space-y-1">
                    <Link to="/portfolio" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setIsProfileOpen(false)}>
                      <Icons.Wallet />
                      Portfolio
                    </Link>
                    <button
                      onClick={() => { disconnectWallet(); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
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
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-sm transition-all neon-glow shadow-lg shadow-blue-500/20"
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
