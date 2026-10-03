import React from 'react';
import { ForexPair, UserProfile } from '../types';
import { AdBanner } from '../components/AdBanner';
import { TopGainers } from '../components/TopGainers';
import { MarketOverview } from '../components/MarketOverview';

interface DashboardScreenProps {
  pairs: ForexPair[];
  user: UserProfile;
  onSelectPair: (pairId: string) => void;
  onRefreshQuotes?: () => void;
  isRefreshing?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  pairs,
  onSelectPair,
}) => {
  const handleSelectGainer = (symbol: string) => {
    if (symbol === 'EURO') {
      const euroPair = pairs.find((p) => p.symbol.includes('EUR/USD'));
      if (euroPair) {
        onSelectPair(euroPair.id);
        return;
      }
    } else if (symbol === 'USD') {
      const usdPair = pairs.find((p) => p.symbol.includes('USD/JPY') || p.symbol.includes('USD'));
      if (usdPair) {
        onSelectPair(usdPair.id);
        return;
      }
    }
  };

  const handleSelectMarketSymbol = (symbol: string) => {
    const cleanSym = symbol.replace('/', '').toLowerCase();
    const matchedPair = pairs.find(
      (p) =>
        p.symbol.toLowerCase() === symbol.toLowerCase() ||
        p.symbol.replace('/', '').toLowerCase() === cleanSym
    );
    if (matchedPair) {
      onSelectPair(matchedPair.id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 p-4 space-y-4 max-w-5xl mx-auto w-full">
      {/* 1. Espaço Preparado para Entrar Anúncios */}
      <AdBanner />

      {/* 2. TOP Gainers */}
      <TopGainers onSelectGainer={handleSelectGainer} />

      {/* 3. Market Overview (exatamente 2 cards) */}
      <MarketOverview onSelectSymbol={handleSelectMarketSymbol} />
    </div>
  );
};
