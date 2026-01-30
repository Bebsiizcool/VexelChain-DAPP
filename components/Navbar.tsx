'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Rocket } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center h-16">
                    {/* Centered Logo & Name */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href="/" className="flex items-center gap-1 group">
                            <div className="relative">
                                <Logo />
                            </div>
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ea] via-[#5F85DB] to-[#9F5AFD] tracking-widest drop-shadow-[0_0_10px_rgba(0,242,234,0.3)]">
                                BLUEPEAK
                            </span>
                        </Link>
                    </div>

                    {/* Right Side Items (pushed to end) */}
                    <div className="flex-1 flex justify-end items-center gap-4 ml-auto">
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
