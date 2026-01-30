import React, { useState, useEffect } from 'react';
import { MarketChart } from '../components/MarketChart';
import { SwapCard } from '../components/SwapCard';
import { AIAdvisor } from '../components/AIAdvisor';
import { Token, ChartDataPoint } from '../types';
import { Icons } from '../components/Icon';
import { usePrices } from '../contexts/PriceContext';
import { TradingViewWidget } from '../components/TradingViewWidget';

const generateMockHistory = (startPrice: number): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    let price = startPrice;
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        // Random walk
        price = price * (1 + (Math.random() * 0.04 - 0.02));
        data.push({
            time: time.getHours() + ':00',
            value: parseFloat(price.toFixed(2))
        });
    }
    return data;
};

export const DashboardPage: React.FC = () => {
    const { prices } = usePrices();

    // Convert Context Prices to App Token Format
    const TOKENS: Token[] = [
        {
            id: '1',
            symbol: 'BTC',
            name: 'Bitcoin',
            price: prices['BTC']?.current_price || 64230.50,
            change24h: prices['BTC']?.price_change_percentage_24h || 2.4,
            volume: '24.5B',
            marketCap: '1.2T',
            iconColor: 'bg-orange-500'
        },
        {
            id: '2',
            symbol: 'ETH',
            name: 'Ethereum',
            price: prices['ETH']?.current_price || 3450.20,
            change24h: prices['ETH']?.price_change_percentage_24h || 1.8,
            volume: '15.2B',
            marketCap: '400B',
            iconColor: 'bg-indigo-500'
        },
        {
            id: '3',
            symbol: 'SOL',
            name: 'Solana',
            price: prices['SOL']?.current_price || 145.80,
            change24h: prices['SOL']?.price_change_percentage_24h || -1.2,
            volume: '4.1B',
            marketCap: '65B',
            iconColor: 'bg-purple-500'
        },
        {
            id: '4',
            symbol: 'BPK',
            name: 'BluePeak',
            price: prices['BPK']?.current_price || 1.85,
            change24h: prices['BPK']?.price_change_percentage_24h || 15.4,
            volume: '120M',
            marketCap: '850M',
            iconColor: 'bg-cyan-500'
        },
    ];

    const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

    // Update selected token when prices load
    useEffect(() => {
        const updatedToken = TOKENS.find(t => t.symbol === selectedToken.symbol);
        if (updatedToken) setSelectedToken(updatedToken);
    }, [prices]);

    useEffect(() => {
        const data = generateMockHistory(selectedToken.price);
        setChartData(data);
    }, [selectedToken]);

    return (
        <div className="container mx-auto px-4 pt-8">

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {TOKENS.map((token) => (
                    <div
                        key={token.id}
                        onClick={() => setSelectedToken(token)}
                        className={`glass-panel p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:translate-y-[-2px] ${selectedToken.id === token.id ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-white/20'}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${token.iconColor} flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
                                    {token.symbol[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-none">{token.symbol}</h3>
                                    <span className="text-xs text-slate-400">{token.name}</span>
                                </div>
                            </div>
                            {token.change24h >= 0 ?
                                <div className="bg-green-500/10 text-green-400 px-2 py-1 rounded-md text-xs font-mono font-bold flex items-center gap-1">
                                    <Icons.TrendingUp /> {token.change24h.toFixed(2)}%
                                </div> :
                                <div className="bg-red-500/10 text-red-400 px-2 py-1 rounded-md text-xs font-mono font-bold flex items-center gap-1">
                                    <Icons.TrendingDown /> {token.change24h.toFixed(2)}%
                                </div>
                            }
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-mono text-white font-bold">${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Chart Area */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 min-h-[550px]">
                        {selectedToken.symbol === 'BPK' ? (
                            <>
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white font-sans flex items-center gap-2">
                                            {selectedToken.name} <span className="text-slate-500 text-lg">/ USD</span>
                                        </h2>
                                        <div className="flex gap-4 text-sm text-slate-400 mt-1">
                                            <span>Vol: <span className="text-slate-200">{selectedToken.volume}</span></span>
                                            <span>MCap: <span className="text-slate-200">{selectedToken.marketCap}</span></span>
                                        </div>
                                    </div>
                                    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-white/5">
                                        {['1H', '1D', '1W', '1M', '1Y'].map((tf) => (
                                            <button
                                                key={tf}
                                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${tf === '1D' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                            >
                                                {tf}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <MarketChart data={chartData} token={selectedToken} />
                            </>
                        ) : (
                            <div className="h-[500px]">
                                <TradingViewWidget symbol={selectedToken.symbol} />
                            </div>
                        )}
                    </div>

                    {/* Transactions / History Placeholder */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">Market Activity</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/10 rounded-full text-green-400 group-hover:scale-110 transition-transform">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Buy {selectedToken.symbol}</p>
                                            <p className="text-xs text-slate-500">2 mins ago</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-mono text-white">+$2,450.00</p>
                                        <p className="text-xs text-green-400">Completed</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Swap & AI */}
                <div className="lg:col-span-4 space-y-6">
                    <SwapCard tokens={TOKENS} />
                    <AIAdvisor token={selectedToken} allTokens={TOKENS} />

                    {/* Promo / Staking Mini Card */}
                    <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/40 to-purple-900/40">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white">Staking Yield</h4>
                            <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded">NEW</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-3xl font-bold font-mono text-cyan-400">12.5%</span>
                            <span className="text-sm text-slate-400">APY</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-4">Stake your BPK tokens to earn rewards and governance rights.</p>
                        <button className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium text-white transition-colors">
                            Start Staking
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
