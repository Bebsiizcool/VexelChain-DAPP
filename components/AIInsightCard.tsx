import React, { useState, useEffect } from 'react';
import { Token } from '../types';
import { Icons } from './Icon';

interface AIInsightCardProps {
    token: Token;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ token }) => {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);

    // Reset analysis when token changes
    useEffect(() => {
        setAnalysis(null);
        setLoading(false);
    }, [token.id]);

    const generateInsight = () => {
        setLoading(true);
        setAnalysis(null);

        // Simulate AI Processing Time (5-6 seconds)
        setTimeout(() => {
            const sentiment = token.change24h > 0 ? 'bullish' : 'bearish';
            const target = (token.price * (token.change24h > 0 ? 1.05 : 0.95)).toLocaleString(undefined, { maximumFractionDigits: 4 });

            const insights = [
                `Analyzing ${token.name} market structure... RSI suggests a ${sentiment} divergence. Recommended action: Monitor volume at $${target}.`,
                `Deep scan complete. ${token.symbol} shows strong ${sentiment} momentum. Key liquidity pool detected near current price. Expect volatility.`,
                `Pattern recognition: ${token.symbol} is forming a ${token.change24h > 0 ? 'Cup and Handle' : 'Head and Shoulders'} pattern. 78% probability of movement towards $${target}.`,
                `AI Model V4: Whales are currently ${token.change24h > 0 ? 'accumulating' : 'distributing'} ${token.symbol}. On-chain metrics align with a ${sentiment} outlook.`
            ];

            const randomInsight = insights[Math.floor(Math.random() * insights.length)];
            setAnalysis(randomInsight);
            setLoading(false);
        }, 5500);
    };

    return (
        <div className="glass-panel p-5 rounded-xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 relative z-10">
                <span className="text-crimson-400">AI</span> Insight
                {loading && <span className="text-xs font-normal text-crimson-400 animate-pulse ml-auto">Analyzing...</span>}
            </h3>

            <div className="relative z-10 min-h-[80px]">
                {loading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-2 bg-crimson-500/20 rounded w-3/4"></div>
                        <div className="h-2 bg-purple-500/20 rounded w-full"></div>
                        <div className="h-2 bg-purple-500/20 rounded w-5/6"></div>
                        <div className="flex justify-center mt-4">
                            <Icons.Cpu /> {/* Using generic icon as spinner placeholder if simple */}
                            <div className="w-5 h-5 border-2 border-crimson-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                ) : analysis ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <p className="text-sm text-slate-200 leading-relaxed font-medium bg-crimson-500/10 p-3 rounded-lg border border-crimson-500/20">
                            "{analysis}"
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {token.symbol} is currently showing {token.change24h >= 0 ? 'bullish' : 'bearish'} momentum.
                        Ask AI for a deep-dive prediction.
                    </p>
                )}
            </div>

            {!loading && !analysis && (
                <button
                    onClick={generateInsight}
                    className="mt-4 w-full py-2 rounded-lg bg-crimson-600/20 hover:bg-crimson-600/30 border border-crimson-500/30 text-crimson-300 text-sm font-bold transition-all hover:scale-[1.02] relative z-10"
                >
                    Ask Advisor
                </button>
            )}

            {analysis && !loading && (
                <button
                    onClick={generateInsight}
                    className="mt-4 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-medium transition-colors relative z-10"
                >
                    Regenerate Analysis
                </button>
            )}
        </div>
    );
};
