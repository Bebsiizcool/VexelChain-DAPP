import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
    account: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    isConnected: boolean;
    currentNetwork: Network | null;
    switchNetwork: (chainId: string) => Promise<void>;
    balance: string | null;
    refreshBalance: () => Promise<void>;
}

interface Network {
    chainId: string;
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
    apiBaseUrl?: string; // For Etherscan-compatible APIs
}

export const NETWORKS: { [key: string]: Network } = {
    '0x1': {
        chainId: '0x1',
        chainName: 'Ethereum',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io'],
        apiBaseUrl: 'https://api.etherscan.io/api',
    },
    '0xaa36a7': {
        chainId: '0xaa36a7',
        chainName: 'Sepolia',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
        apiBaseUrl: 'https://api-sepolia.etherscan.io/api',
    },
    '0x89': {
        chainId: '0x89',
        chainName: 'Polygon',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com'],
        apiBaseUrl: 'https://api.polygonscan.com/api',
    },
    '0x38': {
        chainId: '0x38',
        chainName: 'BSC',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com'],
        apiBaseUrl: 'https://api.bscscan.com/api',
    },
};

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [currentNetwork, setCurrentNetwork] = useState<Network | null>(null);
    const [balance, setBalance] = useState<string | null>(null);

    const refreshBalance = async () => {
        if (!account || !window.ethereum) {
            setBalance(null);
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const balanceBigInt = await provider.getBalance(account);
            setBalance(ethers.formatEther(balanceBigInt));
        } catch (error) {
            console.error("Error fetching balance:", error);
            setBalance(null);
        }
    };

    // Update balance when account or network changes
    useEffect(() => {
        refreshBalance();
        const interval = setInterval(refreshBalance, 15000); // Polling every 15s
        return () => clearInterval(interval);
    }, [account, currentNetwork]);

    // Load state from local storage on mount
    useEffect(() => {
        const checkConnection = async () => {
            // Check if user explicitly disconnected
            const isDisconnected = localStorage.getItem('isWalletDisconnected') === 'true';
            if (isDisconnected) return;

            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                        const normalizedChainId = chainId.toLowerCase();
                        setCurrentNetwork(NETWORKS[normalizedChainId] || {
                            chainId: normalizedChainId,
                            chainName: 'Unknown Network',
                            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                            rpcUrls: [],
                            blockExplorerUrls: []
                        });
                    }
                } catch (error) {
                    console.error("Error checking connection:", error);
                }
            }
        };

        checkConnection();

        // Listen for chain changes
        if (window.ethereum) {
            window.ethereum.on('chainChanged', (chainId: string) => {
                const normalizedChainId = chainId.toLowerCase();
                // Handle chain change - reload or update state
                setCurrentNetwork(NETWORKS[normalizedChainId] || {
                    chainId: normalizedChainId,
                    chainName: 'Unknown Network',
                    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                    rpcUrls: [],
                    blockExplorerUrls: []
                });
                window.location.reload();
            });
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    localStorage.removeItem('isWalletDisconnected');
                } else {
                    setAccount(null);
                    localStorage.setItem('isWalletDisconnected', 'true');
                }
            });
        }
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            localStorage.removeItem('isWalletDisconnected');

            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const normalizedChainId = chainId.toLowerCase();
            setCurrentNetwork(NETWORKS[normalizedChainId] || {
                chainId: normalizedChainId,
                chainName: 'Unknown Network',
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: [],
                blockExplorerUrls: []
            });

        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const disconnectWallet = async () => {
        try {
            if (window.ethereum) {
                await window.ethereum.request({
                    method: "wallet_revokePermissions",
                    params: [{ eth_accounts: {} }]
                });
            }
        } catch (error) {
            console.error("Error revoking permissions:", error);
        }
        setAccount(null);
        setCurrentNetwork(null);
        localStorage.setItem('isWalletDisconnected', 'true');
    };

    const switchNetwork = async (chainId: string) => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
            setCurrentNetwork(NETWORKS[chainId]);
        } catch (error: any) {
            // If chain doesn't exist, we could add it (omitted for brevity)
            if (error.code === 4902) {
                alert("Network not added to MetaMask. Please add it manually or implement addChain logic.");
            }
            console.error("Error switching network:", error);
        }
    };

    return (
        <WalletContext.Provider value={{
            account,
            connectWallet,
            disconnectWallet,
            isConnected: !!account,
            currentNetwork,
            switchNetwork,
            balance,
            refreshBalance
        }}>
            {children}
        </WalletContext.Provider>
    );
};
