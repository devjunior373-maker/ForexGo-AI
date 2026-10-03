import React, { useState } from 'react';
import { SignalHistoryItem } from '../types';
import { CurrencyFlag } from '../components/CurrencyFlag';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  XCircle,
  MinusCircle,
  Award,
  Zap,
} from 'lucide-react';

interface HistoryScreenProps {
  historyItems: SignalHistoryItem[];
  onSelectPairFromHistory?: (symbol: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  historyItems,
  onSelectPairFromHistory,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'profit' | 'loss'>('all');

  const filteredItems = historyItems.filter((item) => {
    if (activeFilter === 'profit') return item.isProfit && item.profitPips.includes('+');
    if (activeFilter === 'loss') return !item.isProfit || item.profitPips.includes('-');
    return true;
  });

  // Calculate statistics
  const totalTrades = historyItems.length;
  const profitableTrades = historyItems.filter(
    (h) => h.isProfit && h.profitPips.includes('+')
  ).length;
  const winRate = totalTrades > 0 ? Math.round((profitableTrades / totalTrades) * 100) : 0;

  const totalPips = historyItems.reduce((acc, curr) => {
    const val = parseInt(curr.profitPips.replace(/[^0-9-]/g, ''), 10) || 0;
    return acc + val;
  }, 0);

  return (
    <div className="flex-1 overflow-y-auto pb-24 p-4 space-y-4 max-w-4xl mx-auto w-full select-none">
      {/* Title & Stats Ribbon */}
      <div className="space-y-3 pt-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Histórico Recente
          </h2>
          <p className="text-xs text-neutral-400">
            Relatório auditado de ordens e sinais executados com metas de TP e SL.
          </p>
        </div>

        {/* Top Summary Metrics Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {/* Win Rate */}
          <div className="bg-[#1E1E1E] p-3 sm:p-4 rounded-xl border border-[#333333] shadow-md text-center">
            <span className="text-[10px] sm:text-xs text-neutral-400 font-semibold block uppercase">
              Assertividade
            </span>
            <span className="text-base sm:text-2xl font-black text-[#00E676] font-mono mt-0.5 block">
              {winRate}%
            </span>
            <span className="text-[9px] text-neutral-500 font-medium">Win Rate IA</span>
          </div>

          {/* Total Pips */}
          <div className="bg-[#1E1E1E] p-3 sm:p-4 rounded-xl border border-[#333333] shadow-md text-center">
            <span className="text-[10px] sm:text-xs text-neutral-400 font-semibold block uppercase">
              Pips Totais
            </span>
            <span className="text-base sm:text-2xl font-black text-cyan-400 font-mono mt-0.5 block">
              +{totalPips}
            </span>
            <span className="text-[9px] text-neutral-500 font-medium">Saldo Líquido</span>
          </div>

          {/* Total Signals */}
          <div className="bg-[#1E1E1E] p-3 sm:p-4 rounded-xl border border-[#333333] shadow-md text-center">
            <span className="text-[10px] sm:text-xs text-neutral-400 font-semibold block uppercase">
              Operações
            </span>
            <span className="text-base sm:text-2xl font-black text-white font-mono mt-0.5 block">
              {totalTrades}
            </span>
            <span className="text-[9px] text-neutral-500 font-medium">Executadas</span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto">
          {[
            { id: 'all', label: 'Todos os Sinais' },
            { id: 'profit', label: 'Take Profit (+)' },
            { id: 'loss', label: 'Stop Loss (-)' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition min-h-[40px] flex items-center justify-center ${
                activeFilter === btn.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List (border-l-4 style) */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isProfit = item.isProfit && !item.profitPips.startsWith('-');
          const isLoss = item.profitPips.startsWith('-');
          const isNeutral = item.type === 'NEUTRO' || item.profitPips === '0 pips';

          const borderColor = isLoss
            ? 'border-l-[#FF5252]'
            : isProfit
            ? 'border-l-[#00E676]'
            : 'border-l-yellow-400';

          return (
            <div
              key={item.id}
              onClick={() => onSelectPairFromHistory && onSelectPairFromHistory(item.pair)}
              className={`bg-[#1E1E1E] rounded-xl p-4 sm:p-5 border-y border-r border-[#333333] border-l-4 ${borderColor} shadow-lg hover:border-r-cyan-500/40 transition-all cursor-pointer`}
            >
              {/* Header row: Pair & Type Badge */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3">
                  <CurrencyFlag pair={item.pair} size="sm" />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                      {item.pair}
                    </h3>
                    <span className="text-[10px] text-neutral-500 uppercase">Pair</span>
                  </div>
                </div>

                {/* Badge Type */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                    item.type === 'BUY'
                      ? 'bg-green-500/20 text-[#00E676] border border-green-500/30'
                      : item.type === 'SELL'
                      ? 'bg-red-500/20 text-[#FF5252] border border-red-500/30'
                      : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                  }`}
                >
                  {item.type}
                </span>
              </div>

              {/* Grid / Details row */}
              <div className="space-y-1.5 text-xs">
                {/* Entrada */}
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Entrada:</span>
                  <span className="font-mono text-neutral-200 font-medium">
                    {item.entryPrice}
                  </span>
                </div>

                {/* Resultado */}
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Resultado:</span>
                  <span className="font-medium text-neutral-200 truncate max-w-[200px] text-right">
                    {item.resultText}
                  </span>
                </div>

                {/* Lucro & Data row */}
                <div className="pt-1.5 border-t border-neutral-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Data: {item.date}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-neutral-400 text-xs">Lucro:</span>
                    <span
                      className={`font-black font-mono text-sm sm:text-base ${
                        isLoss ? 'text-[#FF5252]' : isProfit ? 'text-[#00E676]' : 'text-neutral-300'
                      }`}
                    >
                      {item.profitPips}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-2">
            <p className="text-neutral-300 font-medium">Nenhum sinal no filtro selecionado</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="text-xs text-cyan-400 font-semibold underline"
            >
              Ver todos os sinais
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
