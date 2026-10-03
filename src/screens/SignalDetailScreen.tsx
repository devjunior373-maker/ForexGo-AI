import React, { useState } from 'react';
import { ForexPair } from '../types';
import { CandleChart } from '../components/CandleChart';
import { RechartsTrendChart } from '../components/RechartsTrendChart';
import { CurrencyFlag } from '../components/CurrencyFlag';
import { MarketSentimentWidget } from '../components/MarketSentimentWidget';
import {
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ShieldAlert,
  Target,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  LineChart,
} from 'lucide-react';

interface SignalDetailScreenProps {
  pair: ForexPair;
  onBack: () => void;
  onRefreshPair?: (pairId: string) => void;
}

export const SignalDetailScreen: React.FC<SignalDetailScreenProps> = ({
  pair,
  onBack,
  onRefreshPair,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(pair.timeframe || 'M15');
  const [chartMode, setChartMode] = useState<'recharts' | 'candle'>('recharts');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotification, setRefreshNotification] = useState<string | null>(null);

  const isBuy = pair.signal === 'BUY';
  const isSell = pair.signal === 'SELL';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshNotification('Análise recalculada com os dados de tick mais recentes!');
      if (onRefreshPair) onRefreshPair(pair.id);
      setTimeout(() => setRefreshNotification(null), 3000);
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-28 bg-[#121212] select-none">
      {/* Toast Notification on refresh */}
      {refreshNotification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-cyan-500 text-neutral-950 px-4 py-2 rounded-xl font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{refreshNotification}</span>
        </div>
      )}

      {/* Main Container constrained for readability */}
      <div className="max-w-4xl mx-auto w-full">
        {/* Chart View Switcher Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400">Modo Gráfico:</span>
            <div className="flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
              <button
                onClick={() => setChartMode('recharts')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
                  chartMode === 'recharts'
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>Tendência Recharts</span>
              </button>
              <button
                onClick={() => setChartMode('candle')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
                  chartMode === 'candle'
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Candlestick</span>
              </button>
            </div>
          </div>

          <span className="text-[11px] font-mono text-cyan-400 hidden xs:inline">
            Tick Ativo &bull; {pair.priceDisplay}
          </span>
        </div>

        {/* Dynamic Chart Display (Recharts Trend Chart or Candlestick) */}
        <div className="w-full">
          {chartMode === 'recharts' ? (
            <RechartsTrendChart
              pair={pair}
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />
          ) : (
            <CandleChart
              pair={pair}
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />
          )}
        </div>

        {/* Data Panel Section */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Pair Identity & Micro stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CurrencyFlag pair={pair.symbol} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {pair.symbol}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 font-mono">
                    {pair.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                  <span>Cotação Atual:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {pair.priceDisplay}
                  </span>
                  <span
                    className={`font-semibold ${
                      pair.changePercent >= 0 ? 'text-[#00E676]' : 'text-[#FF5252]'
                    }`}
                  >
                    {pair.changePercent >= 0 ? '+' : ''}
                    {pair.changePercent}%
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-cyan-400 active:scale-95 transition"
              title="Atualizar Análise"
            >
              <RefreshCw
                className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          {/* Large Signal Banner */}
          <div
            className={`w-full min-h-[64px] h-16 flex items-center justify-center text-xl sm:text-2xl font-black rounded-xl shadow-xl tracking-wider select-none ${
              isBuy
                ? 'bg-[#00E676] text-neutral-950 shadow-green-500/20'
                : isSell
                ? 'bg-[#FF5252] text-white shadow-red-500/20'
                : 'bg-yellow-400 text-neutral-950 shadow-yellow-500/20'
            }`}
          >
            {isBuy && 'COMPRA FORTE (BUY)'}
            {isSell && 'VENDA FORTE (SELL)'}
            {!isBuy && !isSell && 'SINAL NEUTRO (AGUARDAR)'}
          </div>

          {/* Grid de Dados (2 colunas em mobile, 4 em desktop) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Parâmetros da Ordem IA
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Preço de Entrada */}
              <div className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333333] shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-xs font-semibold">Preço de Entrada</span>
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-neutral-50 text-lg sm:text-xl font-bold font-mono mt-1">
                  {pair.entryPriceDisplay}
                </p>
                <span className="text-[10px] text-cyan-400 font-medium">Ordem a Mercado</span>
              </div>

              {/* Stop Loss */}
              <div className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333333] shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-xs font-semibold">Stop Loss</span>
                  <ShieldAlert className="w-3.5 h-3.5 text-[#FF5252]" />
                </div>
                <p className="text-neutral-50 text-lg sm:text-xl font-bold font-mono mt-1">
                  {pair.stopLossDisplay}
                </p>
                <span className="text-[10px] text-[#FF5252] font-medium">Proteção de Capital</span>
              </div>

              {/* Take Profit */}
              <div className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333333] shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-xs font-semibold">Take Profit (Alvo 1)</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" />
                </div>
                <p className="text-neutral-50 text-lg sm:text-xl font-bold font-mono mt-1">
                  {pair.takeProfitDisplay}
                </p>
                <span className="text-[10px] text-[#00E676] font-medium">
                  {pair.takeProfit2 ? `Alvo 2: ${pair.takeProfit2}` : 'Alvo Principal'}
                </span>
              </div>

              {/* Probabilidade & Risco/Retorno */}
              <div className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333333] shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-xs font-semibold">Probabilidade IA</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-cyan-400 text-lg sm:text-xl font-black font-mono mt-1">
                  {pair.probability}%
                </p>
                <span className="text-[10px] text-neutral-300 font-medium">
                  {pair.signalStrength} &bull; R:R {pair.riskReward}
                </span>
              </div>
            </div>
          </div>

          {/* Painel de IA Indicadores */}
          <div className="bg-[#1E1E1E] rounded-xl p-5 border border-[#333333] shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">IA Indicadores Técnicos</h3>
              </div>
              <span className="text-[11px] text-neutral-400">Timeframe: {selectedTimeframe}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Item 1: EMA 50 */}
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">
                    {pair.indicators.ema50.name}
                  </span>
                  <span className="text-sm font-mono text-white font-semibold">
                    {pair.indicators.ema50.value}
                  </span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                    pair.indicators.ema50.trend === 'Alta'
                      ? 'bg-green-500/15 text-[#00E676] border border-green-500/30'
                      : pair.indicators.ema50.trend === 'Baixa'
                      ? 'bg-red-500/15 text-[#FF5252] border border-red-500/30'
                      : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  }`}
                >
                  {pair.indicators.ema50.status}
                </span>
              </div>

              {/* Item 2: RSI */}
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">
                    {pair.indicators.rsi.name}
                  </span>
                  <span className="text-sm font-mono text-white font-semibold">
                    Nível {pair.indicators.rsi.value}
                  </span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                    pair.indicators.rsi.trend === 'Alta'
                      ? 'bg-green-500/15 text-[#00E676] border border-green-500/30'
                      : pair.indicators.rsi.trend === 'Baixa'
                      ? 'bg-red-500/15 text-[#FF5252] border border-red-500/30'
                      : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  }`}
                >
                  {pair.indicators.rsi.status}
                </span>
              </div>

              {/* Item 3: MACD */}
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">
                    {pair.indicators.macd.name}
                  </span>
                  <span className="text-sm font-mono text-white font-semibold">
                    {pair.indicators.macd.value}
                  </span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                    pair.indicators.macd.trend === 'Alta'
                      ? 'bg-green-500/15 text-[#00E676] border border-green-500/30'
                      : pair.indicators.macd.trend === 'Baixa'
                      ? 'bg-red-500/15 text-[#FF5252] border border-red-500/30'
                      : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  }`}
                >
                  {pair.indicators.macd.status}
                </span>
              </div>

              {/* Item 4: Bandas de Bollinger */}
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">
                    {pair.indicators.bollinger.name}
                  </span>
                  <span className="text-sm font-mono text-white font-semibold">
                    {pair.indicators.bollinger.value}
                  </span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                    pair.indicators.bollinger.trend === 'Alta'
                      ? 'bg-green-500/15 text-[#00E676] border border-green-500/30'
                      : pair.indicators.bollinger.trend === 'Baixa'
                      ? 'bg-red-500/15 text-[#FF5252] border border-red-500/30'
                      : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  }`}
                >
                  {pair.indicators.bollinger.status}
                </span>
              </div>
            </div>
          </div>

          {/* Medidor de Sentimento do Mercado (IA & Notícias) */}
          <MarketSentimentWidget pair={pair} />

          {/* AI Narrative Analysis Card */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tese Algorítmica da Inteligência Artificial</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {pair.aiAnalysisText}
            </p>
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleRefresh}
              className="w-full sm:flex-1 min-h-[48px] rounded-xl bg-[#00BCD4] hover:bg-cyan-300 text-neutral-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Atualizar Análise</span>
            </button>

            <button
              onClick={onBack}
              className="w-full sm:w-36 min-h-[48px] rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-sm transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
