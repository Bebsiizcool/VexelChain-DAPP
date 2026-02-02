import React, { useState, useMemo } from 'react';
import { Token } from '../types';

interface MarketAnalysisProps {
    token: Token;
}

type Timeframe = '15m' | '30m' | '1H' | '4H' | '1D';

export const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ token }) => {
    const [timeframe, setTimeframe] = useState<Timeframe>('1D');

    // Memoize analysis to prevent flickering on every render
    const analysis = useMemo(() => {
        const { price, change24h, symbol } = token;

        // Heuristic Logic for "Simulation" based on Timeframe and 24h Change
        let sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
        let rsiValue = 50;
        let summary = '';

        // Adjust "virtual" change based on timeframe to simulate different trends
        // e.g., a token could be bullish on 1D but bearish on 15m
        let virtualChange = change24h;
        if (timeframe === '15m') virtualChange = change24h * 1.5 - 2; // More volatile/noise
        if (timeframe === '4H') virtualChange = change24h * 0.8;

        if (virtualChange > 2) {
            sentiment = 'BULLISH';
            rsiValue = 60 + Math.random() * 20;
        } else if (virtualChange < -2) {
            sentiment = 'BEARISH';
            rsiValue = 40 - Math.random() * 20;
        } else {
            sentiment = 'NEUTRAL';
            rsiValue = 50 + (Math.random() * 10 - 5);
        }

        const rsiState = rsiValue > 70 ? 'Overbought' : rsiValue < 30 ? 'Oversold' : 'Neutral';
        const resistance = (price * (1 + Math.abs(virtualChange / 100) + 0.02)).toLocaleString(undefined, { maximumFractionDigits: 4 });
        const support = (price * (1 - Math.abs(virtualChange / 100) - 0.02)).toLocaleString(undefined, { maximumFractionDigits: 4 });

        switch (timeframe) {
            case '15m':
            case '30m':
                summary = `Short-term scalping setup. Momentum is ${rsiState.toLowerCase()}. Price is chopping around local support at $${support}. High volatility expected; tighten stop-losses.`;
                break;
            case '1H':
            case '4H':
                summary = `Intraday trend is ${sentiment.toLowerCase()}. Forming a potential ${sentiment === 'BULLISH' ? 'flag pattern' : 'breakdown structure'}. valid entry if $${resistance} is broken with volume. Order block detected nearby.`;
                break;
            case '1D':
                summary = `Macro trend remains ${change24h > 0 ? 'constructive' : 'weak'}. Daily RSI is ${rsiState}. Major liquidity zone sits at $${support}. Long-term accumulation feasible if structure holds.`;
                break;
        }

        return {
            sentiment,
            title: `Technical Analysis: ${symbol}/USD`,
            summary,
            rsi: rsiValue.toFixed(1),
            support,
            resistance
        };
    }, [token.id, token.change24h, timeframe]);

    return (
        <div className="glass-panel p-6 rounded-xl border border-white/5 bg-[#0a0202]/30 mt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-gradient-to-b from-red-500 to-crimson-600 rounded-full"></span>
                    {analysis.title}
                </h3>

                {/* Timeframe Selector */}
                <div className="flex bg-[#1F0505] rounded-lg p-1 border border-white/5">
                    {(['15m', '30m', '1H', '4H', '1D'] as Timeframe[]).map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${timeframe === tf ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${analysis.sentiment === 'BULLISH' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                    analysis.sentiment === 'BEARISH' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                        'border-slate-500/30 text-slate-400 bg-slate-500/10'
                    }`}>
                    {analysis.sentiment}
                </div>
                <span className="text-xs text-slate-500 font-mono">Timeframe: {timeframe}</span>
            </div>

            <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 text-sm leading-relaxed">
                    {analysis.summary}
                </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">RSI ({timeframe})</div>
                    <div className={`text-sm font-mono ${parseFloat(analysis.rsi) > 70 || parseFloat(analysis.rsi) < 30 ? 'text-orange-400' : 'text-crimson-400'}`}>
                        {analysis.rsi}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Resistance</div>
                    <div className="text-sm font-mono text-red-400">${analysis.resistance}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Support</div>
                    <div className="text-sm font-mono text-green-400">${analysis.support}</div>
                </div>
            </div>
        </div>
    );
};
