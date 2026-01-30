import React, { useState } from 'react';
import { Token, AIAnalysis, MarketSentiment } from '../types';
import { analyzeMarket } from '../services/gemini';
import { Icons } from './Icon';

interface AIAdvisorProps {
  token: Token;
  allTokens: Token[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ token, allTokens }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeMarket(allTokens, token);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full flex flex-col relative overflow-hidden">
       {/* Background accent */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
          <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-sans">BluePeak AI Analyst</h2>
          <p className="text-xs text-slate-400">Powered by Gemini 2.0 Flash</p>
        </div>
      </div>

      <div className="flex-1 relative z-10">
        {!analysis && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-slate-400 mb-6 max-w-xs">
              Generate a real-time market sentiment analysis for <span className="text-white font-bold">{token.name}</span> based on current technical indicators and market volume.
            </p>
            <button 
              onClick={handleAnalyze}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              <Icons.Activity />
              Generate Analysis
            </button>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-400 animate-pulse font-mono">Analyzing market data...</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl border border-white/5">
              <span className="text-slate-400 text-sm">Sentiment</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                analysis.sentiment === MarketSentiment.BULLISH ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                analysis.sentiment === MarketSentiment.BEARISH ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {analysis.sentiment}
              </span>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Summary</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/10">
                <h4 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1">Support</h4>
                <p className="text-lg font-mono text-white">{analysis.keyLevels.support}</p>
              </div>
              <div className="bg-red-900/10 p-4 rounded-xl border border-red-500/10">
                <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Resistance</h4>
                <p className="text-lg font-mono text-white">{analysis.keyLevels.resistance}</p>
              </div>
            </div>

            <div className="bg-indigo-900/10 p-4 rounded-xl border border-indigo-500/20">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Recommendation</h4>
              <p className="text-sm font-medium text-white">{analysis.recommendation}</p>
            </div>
            
            <button 
              onClick={handleAnalyze} 
              className="w-full text-xs text-slate-500 hover:text-indigo-400 underline decoration-indigo-500/30 underline-offset-4 transition-colors text-center"
            >
              Refresh Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
