import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Transaction {
    id: string;
    type: 'SWAP';
    fromToken: string;
    toToken: string;
    fromAmount: string;
    toAmount: string;
    timestamp: number;
    hash: string; // Mock hash or real if on chain
    status: 'Completed' | 'Pending' | 'Failed';
}

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => void;
}

const TransactionContext = createContext<TransactionContextType>({} as TransactionContextType);

const STORAGE_KEY = 'bluepeak_transactions';

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setTransactions(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse transactions", e);
            }
        }
    }, []);

    const addTransaction = (tx: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
        const newTx: Transaction = {
            ...tx,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            status: 'Completed' // Mock immediate completion
        };

        const updated = [newTx, ...transactions];
        setTransactions(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return (
        <TransactionContext.Provider value={{ transactions, addTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => useContext(TransactionContext);
