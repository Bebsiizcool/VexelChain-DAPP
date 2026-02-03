import React, { useState, useEffect } from 'react';
import { Icons } from './Icon';
import { Token } from '../types';
import { useTransactions } from '../contexts/TransactionContext';
import { TokenSelectorModal } from './TokenSelectorModal';
import { useBalances } from '../hooks/useBalances';

interface SwapCardProps {
  tokens: Token[];
}

export const SwapCard: React.FC<SwapCardProps> = ({ tokens }) => {
  const { addTransaction } = useTransactions();
  const { getBalance } = useBalances();
  const [fromToken, setFromToken] = useState<Token>(tokens[1] || tokens[0]);
  const [toToken, setToToken] = useState<Token>(tokens[3] || tokens[2]);

  const [fromAmount, setFromAmount] = useState<string>('1.0');
  const [toAmount, setToAmount] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [gasPrice, setGasPrice] = useState<string>('0.00');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingSide, setSelectingSide] = useState<'from' | 'to'>('from');

  // Fetch Gas
  useEffect(() => {
    const fetchGas = async () => {
      if (window.ethereum) {
        try {
          const priceHex = await window.ethereum.request({ method: 'eth_gasPrice' });
          const price = parseInt(priceHex, 16) / 1e9; // Gwei
          // Estimate swap gas ~150,000 units
          const costEth = (price * 150000) / 1e9;
          setGasPrice((costEth * 2500).toFixed(2)); // Rough USD conversion (ETH=$2500)
        } catch (e) {
          setGasPrice((Math.random() * 5 + 2).toFixed(2));
        }
      } else {
        setGasPrice((Math.random() * 5 + 2).toFixed(2));
      }
    };
    fetchGas();
    const i = setInterval(fetchGas, 10000);
    return () => clearInterval(i);
  }, []);

  // Update effect when tokens change (e.g. price update)
  useEffect(() => {
    calculateToAmount(fromAmount);
  }, [tokens, fromToken, toToken]);

  const calculateToAmount = (val: string) => {
    const amount = parseFloat(val);
    if (!isNaN(amount) && fromToken.price && toToken.price) {
      const valueUSD = amount * fromToken.price;
      const toVal = valueUSD / toToken.price;
      setToAmount(toVal.toFixed(6));
    } else {
      setToAmount('');
    }
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFromAmount(val);
    calculateToAmount(val);
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
  };

  const openTokenSelector = (side: 'from' | 'to') => {
    setSelectingSide(side);
    setIsModalOpen(true);
  };

  const handleTokenSelect = (token: Token) => {
    if (selectingSide === 'from') {
      if (token.id === toToken.id) {
        setToToken(fromToken);
      }
      setFromToken(token);
    } else {
      if (token.id === fromToken.id) {
        setFromToken(toToken);
      }
      setToToken(token);
    }
  };

  const executeSwap = async () => {
    if (!fromAmount || !toAmount) return;
    setIsSwapping(true);

    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          // Trigger a real send transaction (0 ETH to self) to simulate interaction and verification
          await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: accounts[0],
              to: accounts[0],
              value: '0x0',
              data: '0x',
            }]
          });
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      addTransaction({
        type: 'SWAP',
        fromToken: fromToken.symbol,
        toToken: toToken.symbol,
        fromAmount: fromAmount,
        toAmount: toAmount,
        hash: '0x' + Math.random().toString(36).substring(2),
      });

      alert(`Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}!`);
      setFromAmount('');
      setToAmount('');

    } catch (error) {
      console.error(error);
      alert("Transaction Cancelled");
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <>
      <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-xl font-bold text-white font-sans">Swap</h2>
          <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
            <Icons.Settings />
          </button>
        </div>

        <div className="space-y-2 relative z-10">
          <div className="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">From</span>
              <span className="text-xs text-slate-400 font-medium">Balance: {getBalance(fromToken.symbol).toLocaleString()} {fromToken.symbol}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={fromAmount}
                onChange={handleFromChange}
                className="w-full bg-transparent text-2xl font-mono text-white focus:outline-none placeholder-slate-600"
                placeholder="0.0"
              />
              <button
                onClick={() => openTokenSelector('from')}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-white/10 transition-all min-w-[120px] justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {fromToken.image ? (
                    <img src={fromToken.image} alt={fromToken.symbol} className="w-5 h-5 rounded-full" />
                  ) : (
                    <div className={`w-5 h-5 rounded-full ${fromToken.iconColor}`}></div>
                  )}
                  <span className="font-bold text-sm">{fromToken.symbol}</span>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
            <div className="text-right text-xs text-slate-500 mt-1">
              ~${(parseFloat(fromAmount || '0') * fromToken.price).toFixed(2)}
            </div>
          </div>

          <div className="flex justify-center -my-3 relative z-20">
            <button
              onClick={handleSwapTokens}
              className="bg-[#1F0505] p-2 rounded-lg border border-white/10 text-red-400 hover:text-white hover:bg-red-600 transition-all shadow-lg"
            >
              <Icons.ArrowRightLeft />
            </button>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">To</span>
              <span className="text-xs text-slate-400 font-medium">Balance: {getBalance(toToken.symbol).toLocaleString()} {toToken.symbol}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={toAmount}
                readOnly
                className="w-full bg-transparent text-2xl font-mono text-white focus:outline-none placeholder-slate-600"
                placeholder="0.0"
              />
              <button
                onClick={() => openTokenSelector('to')}

                className="flex items-center gap-2 bg-[#1F0505] hover:bg-[#2a0a0a] text-white px-3 py-1.5 rounded-lg border border-white/10 transition-all min-w-[120px] justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {toToken.image ? (
                    <img src={toToken.image} alt={toToken.symbol} className="w-5 h-5 rounded-full" />
                  ) : (
                    <div className={`w-5 h-5 rounded-full ${toToken.iconColor}`}></div>
                  )}
                  <span className="font-bold text-sm">{toToken.symbol}</span>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
            <div className="text-right text-xs text-slate-500 mt-1">
              ~${(parseFloat(toAmount || '0') * toToken.price).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 relative z-10">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Rate</span>
            <span>1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Network Cost (Est)</span>
            <span className="text-crimson-400 flex items-center gap-1">
              <Icons.Cpu /> ${gasPrice}
            </span>
          </div>
        </div>

        <button
          onClick={executeSwap}
          disabled={isSwapping || !fromAmount}
          className="w-full mt-6 bg-gradient-to-r from-red-700 to-crimson-600 hover:from-red-600 hover:to-crimson-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-crimson-500/25 transition-all neon-glow relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSwapping ? 'Swapping...' : 'Swap Tokens'}
        </button>
      </div>

      <TokenSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tokens={tokens}
        onSelect={handleTokenSelect}
      />
    </>
  );
};
