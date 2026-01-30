import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Define the shape of our price data
interface TokenPrice {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    total_volume: number;
    market_cap: number;
}

interface PriceContextType {
    prices: Record<string, TokenPrice>;
    loading: boolean;
    refreshPrices: () => Promise<void>;
}

const PriceContext = createContext<PriceContextType>({} as PriceContextType);

// Mapping of our internal IDs/Symbols to CoinGecko API IDs
const COINGECKO_IDS: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'BPK': 'bluepeak',
};

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [prices, setPrices] = useState<Record<string, TokenPrice>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const pricesRef = useRef<Record<string, TokenPrice>>({}); // Ref to hold latest for the interval

    const fetchPrices = async () => {
        try {
            // Coingecko free API
            const ids = Object.values(COINGECKO_IDS).join(',');
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);

            if (!response.ok) throw new Error('Failed to fetch prices');

            const data = await response.json();
            const newPrices: Record<string, TokenPrice> = { ...pricesRef.current };

            data.forEach((coin: any) => {
                const symbol = coin.symbol.toUpperCase();
                newPrices[symbol] = {
                    id: coin.id,
                    symbol: symbol,
                    name: coin.name,
                    current_price: coin.current_price,
                    price_change_percentage_24h: coin.price_change_percentage_24h,
                    total_volume: coin.total_volume,
                    market_cap: coin.market_cap
                };
            });

            // Mock BluePeak if missing
            if (!newPrices['BPK']) {
                newPrices['BPK'] = {
                    id: 'bluepeak',
                    symbol: 'BPK',
                    name: 'BluePeak',
                    current_price: 1.85,
                    price_change_percentage_24h: 15.4,
                    total_volume: 120000000,
                    market_cap: 850000000
                };
            }

            setPrices(newPrices);
            pricesRef.current = newPrices;
            setLoading(false);
        } catch (error) {
            console.error("Error fetching prices:", error);
            setLoading(false);
        }
    };

    // Live Ticker Simulation
    useEffect(() => {
        const tickInterval = setInterval(() => {
            setPrices(prevPrices => {
                const nextPrices = { ...prevPrices };
                let changed = false;

                Object.keys(nextPrices).forEach(key => {
                    const token = nextPrices[key];
                    // Simulate random movement: +/- 0.05% max fluctuation per tick
                    // Bias slightly towards the 24h trend? No, just random noise for liveness.
                    const volatility = 0.0005;
                    const change = 1 + (Math.random() * volatility * 2 - volatility);

                    // Update price
                    const newPrice = token.current_price * change;

                    nextPrices[key] = {
                        ...token,
                        current_price: newPrice
                    };
                    changed = true;
                });

                if (changed) {
                    pricesRef.current = nextPrices;
                    return nextPrices;
                }
                return prevPrices;
            });
        }, 1000); // Tick every 1 second

        return () => clearInterval(tickInterval);
    }, []);

    // Real API Fetch Interval
    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 60000); // Fetch real data every 60s to reset drift
        return () => clearInterval(interval);
    }, []);

    return (
        <PriceContext.Provider value={{ prices, loading, refreshPrices: fetchPrices }}>
            {children}
        </PriceContext.Provider>
    );
};

export const usePrices = () => useContext(PriceContext);
