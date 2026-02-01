import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
    account: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    isConnected: boolean;
    currentNetwork: Network | null;
    switchNetwork: (chainId: string) => Promise<void>;
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
}

export const NETWORKS: { [key: string]: Network } = {
    '0x1': {
        chainId: '0x1',
        chainName: 'Ethereum',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io'],
    },
    '0xaa36a7': {
        chainId: '0xaa36a7',
        chainName: 'Sepolia',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
    },
    '0x89': {
        chainId: '0x89',
        chainName: 'Polygon',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com'],
    },
    '0x38': {
        chainId: '0x38',
        chainName: 'BSC',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com'],
    },
};

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [currentNetwork, setCurrentNetwork] = useState<Network | null>(null);

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
                        setCurrentNetwork(NETWORKS[chainId] || null);
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
                // Handle chain change - reload or update state
                // Typically recommendation is to reload, but we can update state
                setCurrentNetwork(NETWORKS[chainId] || null);
                window.location.reload();
            });
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    localStorage.removeItem('isWalletDisconnected'); // Re-enable if external change
                } else {
                    setAccount(null);
                    localStorage.setItem('isWalletDisconnected', 'true');
                }
            });
        }

        return () => {
            // Cleanup listeners if possible (ethers providers usually persist)
        };
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            localStorage.removeItem('isWalletDisconnected'); // Clear disconnect flag

            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            setCurrentNetwork(NETWORKS[chainId] || null);

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
            switchNetwork
        }}>
            {children}
        </WalletContext.Provider>
    );
};
