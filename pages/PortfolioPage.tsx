import React, { useMemo } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useTransactions } from '../contexts/TransactionContext';
import { usePrices } from '../contexts/PriceContext';

export const PortfolioPage: React.FC = () => {
    const { account, balance, isConnected, currentNetwork } = useWallet();
    const { transactions } = useTransactions();
    const { prices } = usePrices();

    // Calculate derived balances from transaction history
    // Assumption: User starts with 0 of everything except the connected wallet's native token (which we read directly)
    const portfolio = useMemo(() => {
        const holdings: Record<string, number> = {};

        transactions.forEach(tx => {
            if (tx.status === 'Completed' && tx.type === 'SWAP') {
                const toAmt = parseFloat(tx.toAmount);
                const fromAmt = parseFloat(tx.fromAmount);

                // Add to bought token
                holdings[tx.toToken] = (holdings[tx.toToken] || 0) + toAmt;

                // Subtract from sold token (if it's not the native token we read from wallet)
                // Note: If they sold ETH, we already see the reduced balance from useWallet(), 
                // BUT only if they actually sent a transaction. Since we are simulating, the wallet balance won't drop on chain.
                // So for consistency in this "Simulated Environment", we should rely on the wallet balance for Native, 
                // and calculated balances for others.
                if (tx.fromToken !== 'ETH' && tx.fromToken !== 'MATIC' && tx.fromToken !== 'BNB') { // Simple check
                    holdings[tx.fromToken] = (holdings[tx.fromToken] || 0) - fromAmt;
                }
            }
        });

        return holdings;
    }, [transactions]);

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
    const nativePrice = prices[nativeSymbol]?.current_price || prices['ETH']?.current_price || 0;
    const nativeBalanceVal = parseFloat(balance || '0');
    const nativeValue = nativeBalanceVal * nativePrice;

    // Merge calculated holdings with native
    const allAssets = [
        {
            symbol: nativeSymbol,
            balance: nativeBalanceVal,
            price: nativePrice,
            value: nativeValue,
            iconColor: 'bg-indigo-500' // Simple default
        },
        ...Object.entries(portfolio).map(([symbol, amount]) => {
            const price = prices[symbol]?.current_price || 0;
            return {
                symbol,
                balance: amount,
                price: price,
                value: amount * price,
                iconColor: 'bg-slate-700' // Default
            };
        }).filter(a => a.balance > 0.000001) // Filter out zero/dust
    ];

    const totalNetWorth = allAssets.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">My Portfolio</h1>

            {/* Account Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Net Worth</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        {/* Mock change */}
                        <span className="text-sm font-bold text-green-400">+2.4%</span>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Wallet Address</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
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
                                    <td className="p-4 text-slate-300">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="p-4 text-right text-white font-mono">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
                <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden">
                    {transactions.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No transactions yet</div>
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
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-white font-medium">Swap {tx.fromAmount} {tx.fromToken} for {tx.toAmount} {tx.toToken}</span>
                                        </td>
                                        <td className="p-4">
                                            <a
                                                href={`${currentNetwork?.blockExplorerUrls?.[0]}/tx/${tx.hash}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-cyan-400 hover:text-cyan-300 text-xs font-mono"
                                            >
                                                {tx.hash.substring(0, 10)}...
                                            </a>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {new Date(tx.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="text-green-400 text-sm font-medium">{tx.status}</span>
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
