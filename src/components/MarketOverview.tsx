import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CurrencyFlag } from './CurrencyFlag';
import { CryptoIcon } from './CryptoIcon';

export interface OverviewAsset {
  symbol: string;
  name: string;
  category: 'forex' | 'crypto';
  price: string;
  change: string;
  isPositive: boolean;
  high24h: string;
  low24h: string;
  sentiment: string;
}

const twoOverviewAssets: OverviewAsset[] = [
  {
    symbol: 'EUR/USD',
    name: 'Euro / Dólar Americano',
    category: 'forex',
    price: '1.0924',
    change: '+0.42%',
    isPositive: true,
    high24h: '1.0945',
    low24h: '1.0880',
    sentiment: 'Compra',
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    category: 'crypto',
    price: '$67,480.00',
    change: '+7.45%',
    isPositive: true,
    high24h: '$68,100',
    low24h: '$62,800',
    sentiment: 'Compra',
  },
];

interface MarketOverviewProps {
  onSelectSymbol?: (symbol: string) => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ onSelectSymbol }) => {
  return (
    <section className="w-full space-y-2.5 pt-1">
      {/* Cabeçalho da Seção limpo igual Top Gainers: sem ícone, sem subtítulo */}
      <div className="flex items-center justify-between px-0.5">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Market Overview
        </h3>
      </div>

      {/* Exatamente 2 cards do Market Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {twoOverviewAssets.map((asset) => (
          <div
            key={asset.symbol}
            onClick={() => onSelectSymbol && onSelectSymbol(asset.symbol)}
            className="flex items-center justify-between p-3.5 rounded-[5px] bg-[#14161C] border border-neutral-800/80 hover:border-neutral-700 transition active:scale-[0.99] cursor-pointer shadow-sm"
          >
            {/* Esquerda: Ícone Verdadeiro + Símbolo e Nome */}
            <div className="flex items-center gap-3 min-w-0">
              {asset.category === 'forex' ? (
                <CurrencyFlag pair={asset.symbol} size="sm" />
              ) : (
                <CryptoIcon symbol={asset.symbol} size="md" />
              )}

              <div className="space-y-0.5 truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight">
                    {asset.symbol}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-[5px] font-semibold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {asset.sentiment}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate">{asset.name}</p>
              </div>
            </div>

            {/* Direita: Cotação + Variação 24h */}
            <div className="text-right shrink-0">
              <div className="text-xs font-mono font-bold text-white">{asset.price}</div>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span
                  className={`inline-flex items-center text-[11px] font-semibold ${
                    asset.isPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {asset.isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {asset.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
