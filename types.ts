export interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
  iconColor: string;
  image?: string;
}

export interface PortfolioItem {
  token: Token;
  amount: number;
  value: number;
}

export enum MarketSentiment {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL'
}

export interface AIAnalysis {
  sentiment: MarketSentiment;
  summary: string;
  keyLevels: {
    support: string;
    resistance: string;
  };
  recommendation: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
}
