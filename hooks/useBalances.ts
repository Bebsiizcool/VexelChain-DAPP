import { useMemo, useState, useEffect } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { useWallet } from '../contexts/WalletContext';

export const useBalances = () => {
    const { transactions } = useTransactions();
    const { account, currentNetwork } = useWallet();
    const [nativeBalance, setNativeBalance] = useState<number>(0);

    // Fetch Native Balance from Wallet
    useEffect(() => {
        console.log('DebuguseBalances: Account:', account, 'Network:', currentNetwork);
        const fetchNativeBalance = async () => {
            if (account && window.ethereum) {
                try {
                    const balanceHex = await window.ethereum.request({
                        method: 'eth_getBalance',
                        params: [account, 'latest']
                    });
                    console.log('Fetched Balance Hex:', balanceHex);
                    // Use BigInt to safely parse large hex values (wei), then convert to float ETH
                    const balanceWei = BigInt(balanceHex);
                    const balanceEth = Number(balanceWei) / 1e18;
                    console.log('Parsed Balance ETH:', balanceEth);
                    setNativeBalance(balanceEth);
                } catch (error) {
                    console.error("Error fetching balance:", error);
                    setNativeBalance(0);
                }
            } else {
                setNativeBalance(0);
            }
        };

        fetchNativeBalance();
        const interval = setInterval(fetchNativeBalance, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [account, currentNetwork]);

    const balances = useMemo(() => {
        // Initial Mock Balances (for demo purposes)
        const calculatedBalances: Record<string, number> = {
            'USDT': 10000,
            'BTC': 0.5,
            'SOL': 50
        };

        // Add Native Balance (Real)
        // We use the symbol from the current network, or default to ETH if undefined
        const nativeSymbol = currentNetwork?.nativeCurrency.symbol || 'ETH';
        calculatedBalances[nativeSymbol] = nativeBalance;

        transactions.forEach(tx => {
            if (tx.status !== 'Completed') return;

            // Debit From
            if (calculatedBalances[tx.fromToken] === undefined) calculatedBalances[tx.fromToken] = 0;
            calculatedBalances[tx.fromToken] -= parseFloat(tx.fromAmount);

            // Credit To
            if (calculatedBalances[tx.toToken] === undefined) calculatedBalances[tx.toToken] = 0;
            calculatedBalances[tx.toToken] += parseFloat(tx.toAmount);
        });

        // Ensure no negative (floating point safety)
        Object.keys(calculatedBalances).forEach(key => {
            if (calculatedBalances[key] < 0) calculatedBalances[key] = 0;
        });

        return calculatedBalances;
    }, [transactions, nativeBalance, currentNetwork]);

    const getBalance = (symbol: string) => {
        return balances[symbol] || 0;
    };

    return { balances, getBalance };
};
