import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Expanded Token List (Top 70 from CoinGecko + BluePeak)
export const TOKENS: { [key: string]: { name: string, symbol: string, id: string, image: string, chartSymbol: string } } = {
    'bitcoin': { name: 'Bitcoin', symbol: 'BTC', id: 'bitcoin', image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png', chartSymbol: 'BINANCE:BTCUSDT' },
    'ethereum': { name: 'Ethereum', symbol: 'ETH', id: 'ethereum', image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png', chartSymbol: 'BINANCE:ETHUSDT' },
    'tether': { name: 'Tether', symbol: 'USDT', id: 'tether', image: 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png', chartSymbol: 'BINANCE:BTCUSDT' },
    'binancecoin': { name: 'BNB', symbol: 'BNB', id: 'binancecoin', image: 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', chartSymbol: 'BINANCE:BNBUSDT' },
    'ripple': { name: 'XRP', symbol: 'XRP', id: 'ripple', image: 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', chartSymbol: 'BINANCE:XRPUSDT' },
    'usd-coin': { name: 'USDC', symbol: 'USDC', id: 'usd-coin', image: 'https://coin-images.coingecko.com/coins/images/6319/large/USDC.png', chartSymbol: 'BINANCE:USDCUSDT' },
    'solana': { name: 'Solana', symbol: 'SOL', id: 'solana', image: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png', chartSymbol: 'BINANCE:SOLUSDT' },
    'tron': { name: 'TRON', symbol: 'TRX', id: 'tron', image: 'https://coin-images.coingecko.com/coins/images/1094/large/tron-logo.png', chartSymbol: 'BINANCE:TRXUSDT' },
    'staked-ether': { name: 'Lido Staked Ether', symbol: 'stETH', id: 'staked-ether', image: 'https://coin-images.coingecko.com/coins/images/13442/large/steth_logo.png', chartSymbol: 'BINANCE:ETHUSDT' },
    'dogecoin': { name: 'Dogecoin', symbol: 'DOGE', id: 'dogecoin', image: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png', chartSymbol: 'BINANCE:DOGEUSDT' },
    'cardano': { name: 'Cardano', symbol: 'ADA', id: 'cardano', image: 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png', chartSymbol: 'BINANCE:ADAUSDT' },
    'wrapped-steth': { name: 'Wrapped stETH', symbol: 'wstETH', id: 'wrapped-steth', image: 'https://coin-images.coingecko.com/coins/images/18834/large/wstETH.png', chartSymbol: 'BINANCE:ETHUSDT' },
    'whitebit': { name: 'WhiteBIT Coin', symbol: 'WBT', id: 'whitebit', image: 'https://coin-images.coingecko.com/coins/images/27045/large/wbt_token.png', chartSymbol: 'BINANCE:BTCUSDT' },
    'bitcoin-cash': { name: 'Bitcoin Cash', symbol: 'BCH', id: 'bitcoin-cash', image: 'https://coin-images.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png', chartSymbol: 'BINANCE:BCHUSDT' },
    'wrapped-bitcoin': { name: 'Wrapped Bitcoin', symbol: 'WBTC', id: 'wrapped-bitcoin', image: 'https://coin-images.coingecko.com/coins/images/7598/large/WBTCLOGO.png', chartSymbol: 'BINANCE:BTCUSDT' },
    'wrapped-beacon-eth': { name: 'Wrapped Beacon ETH', symbol: 'WBETH', id: 'wrapped-beacon-eth', image: 'https://coin-images.coingecko.com/coins/images/30061/large/wbeth-icon.png', chartSymbol: 'BINANCE:ETHUSDT' },
    'monero': { name: 'Monero', symbol: 'XMR', id: 'monero', image: 'https://coin-images.coingecko.com/coins/images/69/large/monero_logo.png', chartSymbol: 'BINANCE:XMRUSDT' },
    'leo-token': { name: 'LEO Token', symbol: 'LEO', id: 'leo-token', image: 'https://coin-images.coingecko.com/coins/images/8418/large/leo-token.png', chartSymbol: 'BINANCE:LEOUSDT' },
    'chainlink': { name: 'Chainlink', symbol: 'LINK', id: 'chainlink', image: 'https://coin-images.coingecko.com/coins/images/877/large/Chainlink_Logo_500.png', chartSymbol: 'BINANCE:LINKUSDT' },
    'hyperliquid': { name: 'Hyperliquid', symbol: 'HYPE', id: 'hyperliquid', image: 'https://coin-images.coingecko.com/coins/images/50882/large/hyperliquid.jpg', chartSymbol: 'BINANCE:HYPEUSDT' },
    'ethena-usde': { name: 'Ethena USDe', symbol: 'USDe', id: 'ethena-usde', image: 'https://coin-images.coingecko.com/coins/images/33613/large/usde.png', chartSymbol: 'BINANCE:BTCUSDT' },
    'stellar': { name: 'Stellar', symbol: 'XLM', id: 'stellar', image: 'https://coin-images.coingecko.com/coins/images/100/large/fmpFRHHQ_400x400.jpg', chartSymbol: 'BINANCE:XLMUSDT' },
    'weth': { name: 'WETH', symbol: 'WETH', id: 'weth', image: 'https://coin-images.coingecko.com/coins/images/2518/large/weth.png', chartSymbol: 'BINANCE:ETHUSDT' },
    'zcash': { name: 'Zcash', symbol: 'ZEC', id: 'zcash', image: 'https://coin-images.coingecko.com/coins/images/486/large/circle-zcash-color.png', chartSymbol: 'BINANCE:ZECUSDT' },
    'litecoin': { name: 'Litecoin', symbol: 'LTC', id: 'litecoin', image: 'https://coin-images.coingecko.com/coins/images/2/large/litecoin.png', chartSymbol: 'BINANCE:LTCUSDT' },
    'sui': { name: 'Sui', symbol: 'SUI', id: 'sui', image: 'https://coin-images.coingecko.com/coins/images/26375/large/sui-ocean-square.png', chartSymbol: 'BINANCE:SUIUSDT' },
    'avalanche-2': { name: 'Avalanche', symbol: 'AVAX', id: 'avalanche-2', image: 'https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', chartSymbol: 'BINANCE:AVAXUSDT' },
    'dai': { name: 'Dai', symbol: 'DAI', id: 'dai', image: 'https://coin-images.coingecko.com/coins/images/9956/large/Badge_Dai.png', chartSymbol: 'BINANCE:USDCUSDT' },
    'shiba-inu': { name: 'Shiba Inu', symbol: 'SHIB', id: 'shiba-inu', image: 'https://coin-images.coingecko.com/coins/images/11939/large/shiba.png', chartSymbol: 'BINANCE:SHIBUSDT' },
    'hedera-hashgraph': { name: 'Hedera', symbol: 'HBAR', id: 'hedera-hashgraph', image: 'https://coin-images.coingecko.com/coins/images/3688/large/hbar.png', chartSymbol: 'BINANCE:HBARUSDT' },
    'paypal-usd': { name: 'PayPal USD', symbol: 'PYUSD', id: 'paypal-usd', image: 'https://coin-images.coingecko.com/coins/images/31212/large/PYUSD_Token_Logo_2x.png', chartSymbol: 'BINANCE:USDCUSDT' },
    'the-open-network': { name: 'Toncoin', symbol: 'TON', id: 'the-open-network', image: 'https://coin-images.coingecko.com/coins/images/17980/large/photo_2024-09-10_17.09.00.jpeg', chartSymbol: 'BINANCE:TONUSDT' },
    'crypto-com-chain': { name: 'Cronos', symbol: 'CRO', id: 'crypto-com-chain', image: 'https://coin-images.coingecko.com/coins/images/7310/large/cro_token_logo.png', chartSymbol: 'BINANCE:CROUSDT' },
    'polkadot': { name: 'Polkadot', symbol: 'DOT', id: 'polkadot', image: 'https://coin-images.coingecko.com/coins/images/12171/large/polkadot.jpg', chartSymbol: 'BINANCE:DOTUSDT' },
    'uniswap': { name: 'Uniswap', symbol: 'UNI', id: 'uniswap', image: 'https://coin-images.coingecko.com/coins/images/12504/large/uniswap-logo.png', chartSymbol: 'BINANCE:UNIUSDT' },
    'mantle': { name: 'Mantle', symbol: 'MNT', id: 'mantle', image: 'https://coin-images.coingecko.com/coins/images/30980/large/MNT_Token_Logo.png', chartSymbol: 'BINANCE:MNTUSDT' },
    'bitget-token': { name: 'Bitget Token', symbol: 'BGB', id: 'bitget-token', image: 'https://coin-images.coingecko.com/coins/images/11610/large/Bitget_logo.png', chartSymbol: 'BINANCE:BGBUSDT' },
    'okb': { name: 'OKB', symbol: 'OKB', id: 'okb', image: 'https://coin-images.coingecko.com/coins/images/4463/large/WeChat_Image_20220118095654.png', chartSymbol: 'BINANCE:OKBUSDT' },
    'aave': { name: 'Aave', symbol: 'AAVE', id: 'aave', image: 'https://coin-images.coingecko.com/coins/images/12645/large/aave-token-round.png', chartSymbol: 'BINANCE:AAVEUSDT' },
    'bittensor': { name: 'Bittensor', symbol: 'TAO', id: 'bittensor', image: 'https://coin-images.coingecko.com/coins/images/28452/large/ARUsPeNQ_400x400.jpeg', chartSymbol: 'BINANCE:TAOUSDT' },
    'pepe': { name: 'Pepe', symbol: 'PEPE', id: 'pepe', image: 'https://coin-images.coingecko.com/coins/images/29850/large/pepe-token.jpeg', chartSymbol: 'BINANCE:PEPEUSDT' },
    'near': { name: 'NEAR Protocol', symbol: 'NEAR', id: 'near', image: 'https://coin-images.coingecko.com/coins/images/10365/large/near.jpg', chartSymbol: 'BINANCE:NEARUSDT' },
    'internet-computer': { name: 'Internet Computer', symbol: 'ICP', id: 'internet-computer', image: 'https://coin-images.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png', chartSymbol: 'BINANCE:ICPUSDT' },
    'ethereum-classic': { name: 'Ethereum Classic', symbol: 'ETC', id: 'ethereum-classic', image: 'https://coin-images.coingecko.com/coins/images/453/large/ethereum-classic-logo.png', chartSymbol: 'BINANCE:ETCUSDT' },
    'aptos': { name: 'Aptos', symbol: 'APT', id: 'aptos', image: 'https://coin-images.coingecko.com/coins/images/26455/large/aptos_round.png', chartSymbol: 'BINANCE:APTUSDT' },
    'render-token': { name: 'Render', symbol: 'RNDR', id: 'render-token', image: 'https://coin-images.coingecko.com/coins/images/11636/large/rndr.png', chartSymbol: 'BINANCE:RNDRUSDT' },
    'cosmos': { name: 'Cosmos', symbol: 'ATOM', id: 'cosmos', image: 'https://coin-images.coingecko.com/coins/images/1481/large/cosmos_hub.png', chartSymbol: 'BINANCE:ATOMUSDT' },
    'arbitrum': { name: 'Arbitrum', symbol: 'ARB', id: 'arbitrum', image: 'https://coin-images.coingecko.com/coins/images/16547/large/arbitrum_logo.jpg', chartSymbol: 'BINANCE:ARBUSDT' },
    'filecoin': { name: 'Filecoin', symbol: 'FIL', id: 'filecoin', image: 'https://coin-images.coingecko.com/coins/images/12817/large/filecoin.png', chartSymbol: 'BINANCE:FILUSDT' },
    'maker': { name: 'Maker', symbol: 'MKR', id: 'maker', image: 'https://coin-images.coingecko.com/coins/images/1364/large/Mark_Maker.png', chartSymbol: 'BINANCE:MKRUSDT' },
    'optimism': { name: 'Optimism', symbol: 'OP', id: 'optimism', image: 'https://coin-images.coingecko.com/coins/images/25244/large/Optimism.png', chartSymbol: 'BINANCE:OPUSDT' },
    'sei-network': { name: 'Sei', symbol: 'SEI', id: 'sei-network', image: 'https://coin-images.coingecko.com/coins/images/28205/large/Sei_Logo_Background_200x200.png', chartSymbol: 'BINANCE:SEIUSDT' },
    'first-digital-usd': { name: 'First Digital USD', symbol: 'FDUSD', id: 'first-digital-usd', image: 'https://coin-images.coingecko.com/coins/images/31199/large/FDUSD_Token_Logo_2x.png', chartSymbol: 'BINANCE:USDCUSDT' },
    'fetch-ai': { name: 'Fetch.ai', symbol: 'FET', id: 'fetch-ai', image: 'https://coin-images.coingecko.com/coins/images/5624/large/fet-logo-new.png', chartSymbol: 'BINANCE:FETUSDT' },
    'gala': { name: 'GALA', symbol: 'GALA', id: 'gala', image: 'https://coin-images.coingecko.com/coins/images/12493/large/GALA-COINGECKO.png', chartSymbol: 'BINANCE:GALAUSDT' },
    'the-graph': { name: 'The Graph', symbol: 'GRT', id: 'the-graph', image: 'https://coin-images.coingecko.com/coins/images/13397/large/Graph_Token.png', chartSymbol: 'BINANCE:GRTUSDT' },
    'theta-token': { name: 'Theta Network', symbol: 'THETA', id: 'theta-token', image: 'https://coin-images.coingecko.com/coins/images/2538/large/theta-token-logo.png', chartSymbol: 'BINANCE:THETAUSDT' },
    'thorchain': { name: 'THORChain', symbol: 'RUNE', id: 'thorchain', image: 'https://coin-images.coingecko.com/coins/images/6595/large/Rune_icon.png', chartSymbol: 'BINANCE:RUNEUSDT' },
    'quant-network': { name: 'Quant', symbol: 'QNT', id: 'quant-network', image: 'https://coin-images.coingecko.com/coins/images/3370/large/5563.png', chartSymbol: 'BINANCE:QNTUSDT' },
    'algorand': { name: 'Algorand', symbol: 'ALGO', id: 'algorand', image: 'https://coin-images.coingecko.com/coins/images/4380/large/download.png', chartSymbol: 'BINANCE:ALGOUSDT' },
    'arweave': { name: 'Arweave', symbol: 'AR', id: 'arweave', image: 'https://coin-images.coingecko.com/coins/images/4343/large/arweave.png', chartSymbol: 'BINANCE:ARUSDT' },
    'fantom': { name: 'Fantom', symbol: 'FTM', id: 'fantom', image: 'https://coin-images.coingecko.com/coins/images/4001/large/Fantom_round.png', chartSymbol: 'BINANCE:FTMUSDT' },
    'flow': { name: 'Flow', symbol: 'FLOW', id: 'flow', image: 'https://coin-images.coingecko.com/coins/images/13446/large/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.png', chartSymbol: 'BINANCE:FLOWUSDT' },
    'kucoin-shares': { name: 'KuCoin Token', symbol: 'KCS', id: 'kucoin-shares', image: 'https://coin-images.coingecko.com/coins/images/1047/large/kucoin__1_.png', chartSymbol: 'BINANCE:KCSUSDT' },
    'multiversx': { name: 'MultiversX', symbol: 'EGLD', id: 'multiversx', image: 'https://coin-images.coingecko.com/coins/images/12335/large/egld-token-logo.png', chartSymbol: 'BINANCE:EGLDUSDT' },
    'axie-infinity': { name: 'Axie Infinity', symbol: 'AXS', id: 'axie-infinity', image: 'https://coin-images.coingecko.com/coins/images/13029/large/axie_infinity_logo.png', chartSymbol: 'BINANCE:AXSUSDT' },
    'elrond-erd-2': { name: 'MultiversX', symbol: 'EGLD', id: 'elrond-erd-2', image: 'https://coin-images.coingecko.com/coins/images/12335/large/egld-token-logo.png', chartSymbol: 'BINANCE:EGLDUSDT' },
    'sandbox': { name: 'The Sandbox', symbol: 'SAND', id: 'sandbox', image: 'https://coin-images.coingecko.com/coins/images/12129/large/sandbox_logo.jpg', chartSymbol: 'BINANCE:SANDUSDT' },
    'tezos': { name: 'Tezos', symbol: 'XTZ', id: 'tezos', image: 'https://coin-images.coingecko.com/coins/images/976/large/Tezos-Logo.png', chartSymbol: 'BINANCE:XTZUSDT' },
    'vexel-chain': { name: 'Vexel Chain', symbol: 'VXL', id: 'vexel-chain', image: '/favicon.png', chartSymbol: 'CUSTOM:VXL' }
};

interface PriceContextType {
    prices: { [key: string]: { usd: number, usd_24h_change: number } };
    loading: boolean;
    refreshPrices: () => Promise<void>;
    getTokenInfo: (symbol: string) => any;
}

const PriceContext = createContext<PriceContextType>({} as PriceContextType);

declare global {
    interface Window {
        ethereum?: any;
    }
}

export const usePrices = () => useContext(PriceContext);

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [prices, setPrices] = useState<{ [key: string]: { usd: number, usd_24h_change: number } }>({});
    const [loading, setLoading] = useState(true);

    // Store true API values in Ref so jitter doesn't cause drift
    const apiPricesRef = useRef<{ [key: string]: { usd: number, usd_24h_change: number } }>({});

    const fetchPrices = async () => {
        try {
            const ids = Object.values(TOKENS).filter(t => t.id !== 'vexel-chain').map(t => t.id).join(',');
            // Batch if needed, currently sending all (URL length should be OK for ~70 IDs)
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
            const data = await response.json();

            // Add Mock VXL
            data['vexel-chain'] = { usd: 1.25 + (Math.random() * 0.1 - 0.05), usd_24h_change: 5.4 };

            apiPricesRef.current = data;
            setPrices(data); // Immediate update
            setLoading(false);
        } catch (error) {
            console.error("Error fetching prices:", error);
            if (Object.keys(prices).length === 0) {
                // Provide stable fallbacks for common coins if API fails (e.g. Rate Limit)
                const fallbackData: any = {
                    'bitcoin': { usd: 95000, usd_24h_change: 0.5 },
                    'ethereum': { usd: 3300, usd_24h_change: 1.2 },
                    'binancecoin': { usd: 600, usd_24h_change: -0.5 },
                    'tether': { usd: 1, usd_24h_change: 0 },
                    'usd-coin': { usd: 1, usd_24h_change: 0 },
                    'matic-network': { usd: 0.45, usd_24h_change: 1.1 },
                    'vexel-chain': { usd: 1.25, usd_24h_change: 5.4 }
                };
                // Fill others with generic
                Object.values(TOKENS).forEach(t => {
                    if (!fallbackData[t.id]) {
                        fallbackData[t.id] = { usd: 0, usd_24h_change: 0 };
                    }
                });
                apiPricesRef.current = fallbackData;
                setPrices(fallbackData);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 30000); // 30s Real API Refresh
        return () => clearInterval(interval);
    }, []);

    // "Vibration" Effect: Simulate live ticks around the TRUE price
    // This prevents drifting but keeps the UI alive
    useEffect(() => {
        const interval = setInterval(() => {
            setPrices(prev => {
                const vibratingPrices = { ...prev };
                const api = apiPricesRef.current;

                Object.keys(api).forEach(key => {
                    if (api[key]) {
                        // Vibrate +/- 0.05% around the TRUE API price
                        // This matches "ticker" behavior without drifting away from the chart
                        const vibration = 1 + ((Math.random() - 0.5) * 0.001);
                        vibratingPrices[key] = {
                            ...api[key], // ALWAYS BASE OFF API
                            usd: api[key].usd * vibration
                        };
                    }
                });
                return vibratingPrices;
            });
        }, 2000); // Update every 2 seconds for visual liveness
        return () => clearInterval(interval);
    }, []);

    const getTokenInfo = (symbol: string) => {
        const token = Object.values(TOKENS).find(t => t.symbol === symbol);
        return token;
    };

    return (
        <PriceContext.Provider value={{ prices, loading, refreshPrices: fetchPrices, getTokenInfo }}>
            {children}
        </PriceContext.Provider>
    );
};
