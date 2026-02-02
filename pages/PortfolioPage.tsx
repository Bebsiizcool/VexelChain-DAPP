import React, { useMemo } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useTransactions } from '../contexts/TransactionContext';
import { usePrices, TOKENS } from '../contexts/PriceContext';

export const PortfolioPage: React.FC = () => {
    const { account, balance, isConnected, currentNetwork } = useWallet();
    const { transactions, isLoading } = useTransactions();
    const { prices, getTokenInfo } = usePrices();

    // Calculate derived balances from transaction history for Tokens
    const portfolio = useMemo(() => {
        const holdings: Record<string, number> = {};

        if (!transactions) return holdings;

        console.log("Calculating portfolio from", transactions.length, "transactions");

        transactions.forEach(tx => {
            // We only calculate derived balances for TOKENS, not Native (since we have real native balance)
            // ERC20 transactions in our context have type 'Token Transfer'
            if (tx.status === 'Completed' && tx.tokenSymbol && tx.tokenSymbol !== currentNetwork?.nativeCurrency.symbol) {
                const amt = parseFloat(tx.value);
                const symbol = tx.tokenSymbol.toUpperCase(); // Normalize

                if (tx.direction === 'in') {
                    holdings[symbol] = (holdings[symbol] || 0) + amt;
                } else {
                    holdings[symbol] = (holdings[symbol] || 0) - amt;
                }
            }
        });

        console.log("Derived holdings:", holdings);

        // Remove tokens with <= 0 balance
        Object.keys(holdings).forEach(key => {
            if (holdings[key] <= 0.000001) delete holdings[key];
        });

        return holdings;
    }, [transactions, currentNetwork]);

    if (!isConnected) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Wallet Disconnected</h2>
                <p className="text-slate-400 max-w-md">Please connect your wallet to view your portfolio and transaction history.</p>
            </div>
        );
    }

    const nativeSymbol = currentNetwork?.nativeCurrency.symbol || 'ETH';
    const nativeTokenInfo = getTokenInfo(nativeSymbol === 'ETH' ? 'ETH' : nativeSymbol); // map ETH to ETH for lookup
    // Fallback for ETH if not found (e.g. SepoliaETH might just use ETH price)
    const nativeId = nativeTokenInfo?.id || (nativeSymbol === 'ETH' || nativeSymbol === 'BNB' || nativeSymbol === 'MATIC' ? TOKENS[nativeSymbol === 'BTC' ? 'bitcoin' : nativeSymbol === 'ETH' ? 'ethereum' : nativeSymbol === 'BNB' ? 'binancecoin' : 'matic-network']?.id : 'ethereum');

    // Simplification: Try to find ID via getTokenInfo, else guess common ones.
    const getPriceForSymbol = (sym: string) => {
        const info = getTokenInfo(sym);
        if (info && prices[info.id]) return prices[info.id].usd;
        // Fallbacks
        if (sym === 'ETH' && prices['ethereum']) return prices['ethereum'].usd;
        if (sym === 'WETH' && prices['weth']) return prices['weth'].usd;
        if (sym === 'USDT' && prices['tether']) return prices['tether'].usd;
        if (sym === 'USDC' && prices['usd-coin']) return prices['usd-coin'].usd;
        return 0;
    };

    const nativePrice = getPriceForSymbol(nativeSymbol);
    const nativeBalanceVal = parseFloat(balance || '0');
    const nativeValue = nativeBalanceVal * nativePrice;

    // Merge calculated holdings with native
    const allAssets = [
        {
            symbol: nativeSymbol,
            balance: nativeBalanceVal,
            price: nativePrice,
            value: nativeValue,
            iconColor: 'bg-indigo-600'
        },
        ...Object.entries(portfolio).map(([symbol, amount]) => {
            const price = getPriceForSymbol(symbol);
            const value = Number(amount) * price;
            return {
                symbol,
                balance: Number(amount),
                price,
                value,
                iconColor: 'bg-slate-700'
            };
        })
    ];

    const totalNetWorth = allAssets.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">My Portfolio</h1>

            {/* Account Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/20 to-purple-900/10">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Net Worth</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">
                            ${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Wallet Address</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                            {nativeSymbol[0]}
                        </div>
                        <div>
                            <p className="text-lg font-mono text-white break-all">{account}</p>
                            <p className="text-sm text-slate-500">{currentNetwork?.chainName}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assets List */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4">Assets</h2>
                <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-4 text-sm font-medium text-slate-400">Asset</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Balance</th>
                                <th className="p-4 text-sm font-medium text-slate-400">Price</th>
                                <th className="p-4 text-sm font-medium text-slate-400 text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {allAssets.map((asset) => (
                                <tr key={asset.symbol}>
                                    <td className="p-4 flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full ${asset.iconColor} flex items-center justify-center text-white text-xs font-bold`}>{asset.symbol[0]}</div>
                                        <span className="font-bold text-white">{asset.symbol}</span>
                                    </td>
                                    <td className="p-4 text-white font-mono">{asset.balance.toFixed(4)} {asset.symbol}</td>
                                    <td className="p-4 text-slate-300">
                                        {asset.price > 0 ? `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
                                    </td>
                                    <td className="p-4 text-right text-white font-mono">
                                        {asset.value > 0 ? `$${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Transaction History</h2>
                    {isLoading && <span className="text-sm text-slate-400 animate-pulse">Loading...</span>}
                </div>

                <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden">
                    {transactions.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {isLoading ? "Loading transactions..." : "No transactions found"}
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="p-4 text-sm font-medium text-slate-400">Type</th>
                                    <th className="p-4 text-sm font-medium text-slate-400">Details</th>
                                    <th className="p-4 text-sm font-medium text-slate-400">Tx Hash</th>
                                    <th className="p-4 text-sm font-medium text-slate-400">Date</th>
                                    <th className="p-4 text-sm font-medium text-slate-400 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${tx.direction === 'in'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                }`}>
                                                {tx.type === 'Token Transfer' && tx.direction === 'in' ? 'Receive' :
                                                    tx.type === 'Token Transfer' && tx.direction === 'out' ? 'Send' :
                                                        tx.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-white font-medium">
                                                {tx.direction === 'in' ? '+' : '-'}{parseFloat(tx.value).toFixed(4)} {tx.tokenSymbol}
                                                <span className="text-slate-500 ml-2 text-xs">
                                                    {tx.direction === 'in' ? `from ${tx.from.substring(0, 6)}...` : `to ${tx.to.substring(0, 6)}...`}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <a
                                                href={`${currentNetwork?.blockExplorerUrls?.[0]}/tx/${tx.hash}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-400 hover:text-indigo-300 text-xs font-mono"
                                            >
                                                {tx.hash.substring(0, 10)}...
                                            </a>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {new Date(tx.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className={`text-sm font-medium ${tx.status === 'Completed' ? 'text-green-400' : 'text-red-400'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
