import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export interface Network {
    chainId: string; // Hex string
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
}

export const NETWORKS: Record<string, Network> = {
    '0x1': {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io'],
    },
    '0xaa36a7': {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
        rpcUrls: ['https://rpc.sepolia.org'],
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
    },
    '0x89': {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/'],
    },
    '0x13882': { // Amoy (Mumbai replacement) or just keep Mumbai for legacy ref if needed, but Amoy is new
        chainId: '0x13882',
        chainName: 'Polygon Amoy',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-amoy.polygon.technology'],
        blockExplorerUrls: ['https://www.oklink.com/amoy'],
    },
    '0x38': {
        chainId: '0x38',
        chainName: 'BSC Mainnet',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/'],
    },
    '0x61': {
        chainId: '0x61',
        chainName: 'BSC Testnet',
        nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        blockExplorerUrls: ['https://testnet.bscscan.com/'],
    }
};

interface WalletContextType {
    account: string | null;
    balance: string | null;
    currentNetwork: Network | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    switchNetwork: (chainId: string) => Promise<void>;
    isConnected: boolean;
    provider: ethers.BrowserProvider | null;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [currentNetwork, setCurrentNetwork] = useState<Network | null>(null);

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const _provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(_provider);

                // Get Network
                const network = await _provider.getNetwork();
                const chainIdHex = "0x" + network.chainId.toString(16);
                setCurrentNetwork(NETWORKS[chainIdHex] || {
                    chainId: chainIdHex,
                    chainName: 'Unknown Network',
                    nativeCurrency: { name: 'Unknown', symbol: '???', decimals: 18 },
                    rpcUrls: [],
                    blockExplorerUrls: []
                });

                const accounts = await _provider.listAccounts();
                if (accounts.length > 0) {
                    const address = accounts[0].address;
                    setAccount(address);
                    updateBalance(_provider, address);
                }

                // Listen for changes
                window.ethereum.on('accountsChanged', (accounts: string[]) => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        updateBalance(_provider, accounts[0]);
                    } else {
                        disconnectWallet();
                    }
                });

                window.ethereum.on('chainChanged', () => {
                    window.location.reload(); // Recommended by MetaMask
                });
            }
        };
        checkConnection();

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners();
            }
        }
    }, []);

    const updateBalance = async (prov: ethers.BrowserProvider, addr: string) => {
        const bal = await prov.getBalance(addr);
        setBalance(ethers.formatEther(bal));
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        try {
            const _provider = provider || new ethers.BrowserProvider(window.ethereum);
            setProvider(_provider);
            const accounts = await _provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
            updateBalance(_provider, accounts[0]);

            // Initial network check
            const network = await _provider.getNetwork();
            const chainIdHex = "0x" + network.chainId.toString(16);
            setCurrentNetwork(NETWORKS[chainIdHex] || {
                chainId: chainIdHex,
                chainName: 'Unknown Network',
                nativeCurrency: { name: 'Unknown', symbol: '???', decimals: 18 },
                rpcUrls: [],
                blockExplorerUrls: []
            });

        } catch (error) {
            console.error("Connection failed", error);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setBalance(null);
        // Note: We cannot actually disconnect from MetaMask side programmatically,
        // but we can clear our app state to simulate it.
    };

    const switchNetwork = async (chainId: string) => {
        if (!window.ethereum) return;

        const targetNetwork = NETWORKS[chainId];

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chainId }],
            });
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902 && targetNetwork) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: targetNetwork.chainId,
                                chainName: targetNetwork.chainName,
                                nativeCurrency: targetNetwork.nativeCurrency,
                                rpcUrls: targetNetwork.rpcUrls,
                                blockExplorerUrls: targetNetwork.blockExplorerUrls,
                            },
                        ],
                    });
                } catch (addError) {
                    console.error("Failed to add network", addError);
                }
            } else {
                console.error("Failed to switch network", switchError);
            }
        }
    };

    return (
        <WalletContext.Provider value={{
            account,
            balance,
            currentNetwork,
            connectWallet,
            disconnectWallet,
            switchNetwork,
            isConnected: !!account,
            provider
        }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
