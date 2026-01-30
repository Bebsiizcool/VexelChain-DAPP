import React, { useState } from 'react';
import { Token } from '../types';

interface TokenSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    tokens: Token[];
    onSelect: (token: Token) => void;
}

export const TokenSelectorModal: React.FC<TokenSelectorModalProps> = ({ isOpen, onClose, tokens, onSelect }) => {
    const [search, setSearch] = useState('');

    if (!isOpen) return null;

    const filteredTokens = tokens.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.symbol.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Select a Token</h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Search name or paste address"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                    {filteredTokens.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No tokens found</div>
                    ) : (
                        filteredTokens.map(token => (
                            <button
                                key={token.id}
                                onClick={() => { onSelect(token); onClose(); }}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full ${token.iconColor} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                        {token.symbol[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{token.symbol}</div>
                                        <div className="text-xs text-slate-400">{token.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-white">${token.price.toLocaleString()}</div>
                                    {token.change24h >= 0 ?
                                        <div className="text-green-400 text-xs font-bold">+{token.change24h.toFixed(2)}%</div> :
                                        <div className="text-red-400 text-xs font-bold">{token.change24h.toFixed(2)}%</div>
                                    }
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
