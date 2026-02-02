import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { ethers } from 'ethers';

export interface Transaction {
    id: string;
    type: string; // 'Send', 'Receive', 'Swap', 'Approval', etc. (Derived)
    from: string;
    to: string;
    value: string;
    tokenSymbol?: string;
    tokenDecimal?: string;
    timestamp: number;
    hash: string;
    status: 'Completed' | 'Pending' | 'Failed';
    direction: 'in' | 'out';
}

interface TransactionContextType {
    transactions: Transaction[];
    isLoading: boolean;
    refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType>({} as TransactionContextType);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { account, currentNetwork } = useWallet();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const refreshTransactions = async () => {
        if (!account || !currentNetwork?.apiBaseUrl) {
            setTransactions([]);
            return;
        }

        setIsLoading(true);
        try {
            // Fetch Native Transactions
            // Note: Etherscan free tier allows requests without API key but with strict rate limits. 
            // We remove the default key placeholder to avoid invalid key errors.
            const normalTxUrl = `${currentNetwork.apiBaseUrl}?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&sort=desc`;
            // Fetch ERC20 Token Transfers
            const erc20TxUrl = `${currentNetwork.apiBaseUrl}?module=account&action=tokentx&address=${account}&startblock=0&endblock=99999999&sort=desc`;

            console.log("Fetching transactions from:", normalTxUrl);

            const [normalRes, erc20Res] = await Promise.all([
                fetch(normalTxUrl).then(res => res.json().catch(e => { console.error("Normal fetch json error", e); return { status: "0", result: [] }; })),
                fetch(erc20TxUrl).then(res => res.json().catch(e => { console.error("ERC20 fetch json error", e); return { status: "0", result: [] }; }))
            ]);

            console.log("Transaction Responses:", { normalRes, erc20Res });

            let allTxs: Transaction[] = [];

            // Process Normal Transactions
            if (normalRes.status === "1" && Array.isArray(normalRes.result)) {
                const normalTxs = normalRes.result.map((tx: any) => ({
                    id: tx.hash,
                    type: tx.from.toLowerCase() === account.toLowerCase() ? 'Send' : 'Receive',
                    from: tx.from,
                    to: tx.to,
                    value: ethers.formatEther(tx.value),
                    tokenSymbol: currentNetwork.nativeCurrency.symbol,
                    tokenDecimal: '18',
                    timestamp: parseInt(tx.timeStamp) * 1000,
                    hash: tx.hash,
                    status: tx.isError === "0" ? 'Completed' : 'Failed',
                    direction: tx.from.toLowerCase() === account.toLowerCase() ? 'out' : 'in'
                }));
                allTxs = [...allTxs, ...normalTxs];
            }

            // Process ERC20 Transactions
            if (erc20Res.status === "1" && Array.isArray(erc20Res.result)) {
                const tokenTxs = erc20Res.result.map((tx: any) => {
                    const decimals = parseInt(tx.tokenDecimal || '18');
                    return {
                        id: `${tx.hash}-${tx.logIndex}`, // unique id
                        type: 'Token Transfer',
                        from: tx.from,
                        to: tx.to,
                        value: ethers.formatUnits(tx.value, decimals),
                        tokenSymbol: tx.tokenSymbol,
                        tokenDecimal: tx.tokenDecimal,
                        timestamp: parseInt(tx.timeStamp) * 1000,
                        hash: tx.hash,
                        status: 'Completed', // ERC20 events are usually successful if indexed
                        direction: tx.from.toLowerCase() === account.toLowerCase() ? 'out' : 'in'
                    };
                });
                allTxs = [...allTxs, ...tokenTxs];
            }

            // Sort by timestamp desc
            allTxs.sort((a, b) => b.timestamp - a.timestamp);

            setTransactions(allTxs);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshTransactions();
    }, [account, currentNetwork]);

    return (
        <TransactionContext.Provider value={{ transactions, isLoading, refreshTransactions }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => useContext(TransactionContext);
