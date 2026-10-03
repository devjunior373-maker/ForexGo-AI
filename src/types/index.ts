export type MarketTendency = 'Alta' | 'Baixa' | 'Lateral';
export type SignalType = 'BUY' | 'SELL' | 'NEUTRO';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ForexIndicator {
  name: string;
  value: string | number;
  status: string; // e.g. "Alta", "Baixa", "68 Compra", "Altista"
  trend: MarketTendency;
}

export interface ForexPair {
  id: string;
  symbol: string; // 'EUR/USD'
  base: string; // 'EUR'
  quote: string; // 'USD'
  name: string;
  currentPrice: number;
  priceDisplay: string;
  changePercent: number;
  tendency: MarketTendency;
  signal: SignalType;
  probability: number; // e.g. 85, 78, 62
  signalStrength: 'Força Alta' | 'Força Média' | 'Neutra';
  entryPrice: number;
  entryPriceDisplay: string;
  stopLoss: number;
  stopLossDisplay: string;
  takeProfit: number;
  takeProfitDisplay: string;
  takeProfit2?: string;
  timeframe: string;
  riskReward: string;
  indicators: {
    ema50: ForexIndicator;
    rsi: ForexIndicator;
    macd: ForexIndicator;
    bollinger: ForexIndicator;
  };
  supportLevels: number[];
  resistanceLevels: number[];
  candles: CandleData[];
  aiAnalysisText: string;
}

export interface SignalHistoryItem {
  id: string;
  pair: string;
  type: SignalType;
  entryPrice: string;
  exitPrice: string;
  resultText: string;
  profitPips: string;
  isProfit: boolean;
  date: string;
  timestamp: number;
  duration?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  notificationsEnabled: boolean;
  riskAlertsEnabled: boolean;
  soundEnabled: boolean;
  autoRefresh: boolean;
  preferredPairs: string[];
}
