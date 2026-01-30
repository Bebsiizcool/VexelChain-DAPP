'use client';

import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, LogOut, TrendingUp, Activity } from 'lucide-react';
import { formatUnits } from 'viem';

export default function DashboardContent() {
    const { address, isConnected, chain } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: balance } = useBalance({ address });
    const router = useRouter();

    useEffect(() => {
        if (!isConnected) {
            router.push('/');
        }
    }, [isConnected, router]);

    if (!isConnected) return null;

    return (
        <div className="container mx-auto p-6 space-y-8">
            <header className="flex justify-between items-end pb-8 border-b border-slate-800">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400">Welcome back, Crypto Explorer</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-slate-400 mb-1">Total Balance</p>
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            {balance ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}` : 'Loading...'}
                        </h2>
                        <div className="mt-4 flex items-center text-sm text-green-400">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>+2.4% this week</span>
                        </div>
                    </div>
                </motion.div>

                {/* Network Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-2xl"
                >
                    <Activity className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Network Status</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-lg">{chain?.name || 'Unknown Network'}</span>
                    </div>
                    <p className="text-slate-500 mt-2 text-sm">Connected securely via RainbowKit</p>
                </motion.div>

                {/* Account Info */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-6 rounded-2xl flex flex-col justify-between"
                >
                    <div>
                        <h3 className="text-lg font-bold mb-2">Wallet Address</h3>
                        <p className="text-sm font-mono text-slate-400 break-all bg-slate-900/50 p-2 rounded border border-white/5">
                            {address}
                        </p>
                    </div>
                    <button
                        onClick={() => disconnect()}
                        className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Disconnect
                    </button>
                </motion.div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
                <div className="glass-panel rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="p-4 text-slate-400 font-medium">Type</th>
                                <th className="p-4 text-slate-400 font-medium">Asset</th>
                                <th className="p-4 text-slate-400 font-medium">Amount</th>
                                <th className="p-4 text-slate-400 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="hover:bg-white/5">
                                    <td className="p-4">Received</td>
                                    <td className="p-4">ETH</td>
                                    <td className="p-4">0.05</td>
                                    <td className="p-4"><span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">Completed</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
