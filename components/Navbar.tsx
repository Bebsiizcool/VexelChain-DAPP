'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-20 group-hover:opacity-60 transition-opacity"></div>
                                <div className="bg-slate-900/80 p-2 rounded-xl border border-white/10 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <Rocket className="h-6 w-6 text-cyan-400" />
                                </div>
                            </div>
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-widest drop-shadow-[0_0_10px_rgba(0,242,234,0.3)]">
                                BLUEPEAK
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <ConnectButton
                            accountStatus="address"
                            chainStatus="icon"
                            showBalance={false}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
