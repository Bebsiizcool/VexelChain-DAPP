import React, { useState } from 'react';
import { usePrices, TOKENS as CONTEXT_TOKENS } from '../contexts/PriceContext';
import { useWallet } from '../contexts/WalletContext';
import { MarketChart } from '../components/MarketChart';
import { TradingViewWidget } from '../components/TradingViewWidget';
import { SwapCard } from '../components/SwapCard';
import { Icons } from '../components/Icon';
import { Token, ChartDataPoint } from '../types';
import { MarketAnalysis } from '../components/MarketAnalysis';
import { AIInsightCard } from '../components/AIInsightCard';

export const DashboardPage: React.FC = () => {
    const { prices, loading } = usePrices();
    const { isConnected } = useWallet();
    const [selectedTokenId, setSelectedTokenId] = useState<string>('bitcoin');
    const [searchTerm, setSearchTerm] = useState('');

    const selectedContextToken = Object.values(CONTEXT_TOKENS).find(t => t.id === selectedTokenId) || CONTEXT_TOKENS['bitcoin'];

    // Convert Dict to Array & Filter
    const tokenList: Token[] = Object.values(CONTEXT_TOKENS).map(t => {
        const p = prices[t.id];
        return {
            id: t.id,
            symbol: t.symbol,
            name: t.name,
            price: p?.usd || 0,
            change24h: p?.usd_24h_change || 0,
            volume: 'N/A',
            marketCap: 'N/A',
            iconColor: 'bg-slate-700',
            image: t.image
        };
    }).filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedToken = tokenList.find(t => t.id === selectedTokenId) || tokenList[0] || ({} as Token);

    // Mock Data for Custom Chart (BluePeak)
    const mockChartData: ChartDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: (prices['bluepeak']?.usd || 1.25) * (1 + (Math.random() * 0.1 - 0.05))
    }));

    return (
        <div className="h-[calc(100vh-80px)] overflow-hidden flex">

            {/* LEFT SIDEBAR: Token List */}
            <div className="w-80 flex-shrink-0 border-r border-white/5 bg-[#0a0202]/50 flex flex-col glass-panel m-4 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-[#1F0505]/30">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Markets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            placeholder="Search Markets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1F0505]/50 border border-white/10 rounded-lg px-4 py-2 pl-10 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                        <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {tokenList.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setSelectedTokenId(t.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${selectedTokenId === t.id ? 'bg-red-500/10 border border-red-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <img src={CONTEXT_TOKENS[t.id]?.image} className="w-8 h-8 rounded-full" />
                                <div className="text-left">
                                    <div className="font-bold text-sm text-white">{t.symbol}</div>
                                    <div className="text-xs text-slate-500">{t.name}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-sm text-white">${t.price.toLocaleString()}</div>
                                <div className={`text-xs font-bold ${t.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {t.change24h > 0 ? '+' : ''}{t.change24h.toFixed(2)}%
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT: Chart & Swap */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* CENTER: Chart */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {/* Header for selected token */}
                    <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img src={CONTEXT_TOKENS[selectedTokenId]?.image} className="w-10 h-10 rounded-full shadow-lg shadow-red-500/20" />
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    {selectedToken.name} <span className="text-slate-500 text-lg font-normal">/ USD</span>
                                </h1>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="font-mono text-white text-lg">${selectedToken.price.toLocaleString()}</span>
                                    <span className={`font-bold px-2 py-0.5 rounded ${selectedToken.change24h >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {selectedToken.change24h.toFixed(2)}% (24h)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="flex-1 glass-panel rounded-xl border border-white/5 overflow-hidden min-h-[500px] relative">
                        {CONTEXT_TOKENS[selectedTokenId]?.chartSymbol?.startsWith('CUSTOM') ? (
                            <MarketChart token={selectedToken} data={mockChartData} />
                        ) : (
                            <TradingViewWidget symbol={CONTEXT_TOKENS[selectedTokenId]?.chartSymbol} />
                        )}
                    </div>

                    {/* Technical Analysis Section */}
                    <MarketAnalysis token={selectedToken} />
                </div>

                {/* RIGHT: Swap */}
                <div className="space-y-6">
                    <SwapCard tokens={tokenList} />
                    {/* Quick Helper / Advisor */}
                    <AIInsightCard token={selectedToken} />
                </div>

            </div>
        </div>
    );
};
