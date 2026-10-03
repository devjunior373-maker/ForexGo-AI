import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CryptoIcon } from './CryptoIcon';

export interface TopGainerItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  iconBg: string;
  iconColor: string;
  tag?: string;
}

export const topGainersData: TopGainerItem[] = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$67,480',
    change24h: '+7.45%',
    iconBg: 'bg-amber-500/15 border-amber-500/30',
    iconColor: 'text-amber-400',
    tag: 'Cripto',
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    price: '$3,542',
    change24h: '+5.82%',
    iconBg: 'bg-indigo-500/15 border-indigo-500/30',
    iconColor: 'text-indigo-400',
    tag: 'Cripto',
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    price: '$172.30',
    change24h: '+9.14%',
    iconBg: 'bg-purple-500/15 border-purple-500/30',
    iconColor: 'text-purple-400',
    tag: 'Destaque',
  },
  {
    id: 'eur',
    symbol: 'EURO',
    name: 'Euro',
    price: '1.0924',
    change24h: '+2.18%',
    iconBg: 'bg-blue-500/15 border-blue-500/30',
    iconColor: 'text-blue-400',
    tag: 'Forex',
  },
  {
    id: 'usd',
    symbol: 'USD',
    name: 'Dólar (DXY)',
    price: '104.38',
    change24h: '+1.75%',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30',
    iconColor: 'text-emerald-400',
    tag: 'Índice',
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether USD',
    price: '$1.00',
    change24h: '+0.15%',
    iconBg: 'bg-teal-500/15 border-teal-500/30',
    iconColor: 'text-teal-400',
    tag: 'Stable',
  },
  {
    id: 'gold',
    symbol: 'XAU',
    name: 'Ouro (Gold)',
    price: '$2,684',
    change24h: '+3.42%',
    iconBg: 'bg-yellow-500/15 border-yellow-500/30',
    iconColor: 'text-yellow-400',
    tag: 'Metal',
  },
];

interface TopGainersProps {
  onSelectGainer?: (symbol: string) => void;
}

export const TopGainers: React.FC<TopGainersProps> = ({ onSelectGainer }) => {
  const [showAll, setShowAll] = useState(false);

  // Apenas 3 cards visíveis por padrão (cabendo na horizontal)
  const displayedGainers = showAll ? topGainersData : topGainersData.slice(0, 3);

  return (
    <section className="w-full space-y-2.5">
      {/* Cabeçalho da Seção: sem ícone, sem subtítulo, com See All à direita */}
      <div className="flex items-center justify-between px-0.5">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Top Gainers
        </h3>

        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
        >
          {showAll ? 'Show Less' : 'See All'}
        </button>
      </div>

      {/* Grid com 3 cards na horizontal, conteúdo totalmente centralizado */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {displayedGainers.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectGainer && onSelectGainer(item.symbol)}
            className="bg-[#14161C] border border-neutral-800/80 hover:border-neutral-700 rounded-[5px] p-2.5 sm:p-3 transition active:scale-[0.98] cursor-pointer shadow-sm flex flex-col items-center justify-center text-center gap-1.5"
          >
            {/* 1. Ícone Verdadeiro Centralizado */}
            <div className="flex items-center justify-center">
              <CryptoIcon symbol={item.symbol} size="md" />
            </div>

            {/* 2. Apenas o Símbolo Centralizado (sem nome) */}
            <div className="w-full flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                {item.symbol}
              </span>
            </div>

            {/* 3. Percentagem Abaixo do Símbolo (sem fundo verde) */}
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                {item.change24h}
              </span>
            </div>

            {/* 4. Preço Centralizado */}
            <div className="text-[10px] sm:text-xs font-mono font-semibold text-neutral-200 truncate w-full">
              {item.price}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
