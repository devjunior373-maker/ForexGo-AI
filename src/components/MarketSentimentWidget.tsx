import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Compass,
  Sparkles,
  RefreshCw,
  Newspaper,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Clock,
} from 'lucide-react';
import { ForexPair } from '../types';
import { analyzeMarketSentiment, MarketSentimentData } from '../services/marketSentimentService';

interface MarketSentimentWidgetProps {
  pair: ForexPair;
  className?: string;
}

export const MarketSentimentWidget: React.FC<MarketSentimentWidgetProps> = ({
  pair,
  className = '',
}) => {
  const [data, setData] = useState<MarketSentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSentiment = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await analyzeMarketSentiment(pair);
      setData(result);
    } catch (err: any) {
      console.error('Erro na análise de sentimento:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSentiment();
  }, [pair.symbol]);

  const isBullish = data?.sentiment === 'BULLISH';
  const isBearish = data?.sentiment === 'BEARISH';

  const sentimentColor = isBullish ? '#00E676' : isBearish ? '#FF5252' : '#00BCD4';
  const sentimentLabel = isBullish ? 'BULLISH (Alta)' : isBearish ? 'BEARISH (Baixa)' : 'NEUTRO';

  return (
    <div
      className={`w-full bg-[#161B26] border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Ambient background glow spot */}
      <div
        className="absolute top-0 right-0 w-56 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: sentimentColor }}
      />

      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Sentimento do Mercado (IA)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                News NLP
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Análise em tempo real de notícias financeiras globais (Reuters, Bloomberg)
            </p>
          </div>
        </div>

        {/* Re-analyze Button */}
        <button
          onClick={() => fetchSentiment(true)}
          disabled={loading || isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-cyan-500 text-xs text-neutral-300 hover:text-white transition active:scale-95 disabled:opacity-50"
          title="Reanalisar notícias com IA"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span className="hidden sm:inline">
            {isRefreshing ? 'Analisando...' : 'Reanalisar'}
          </span>
        </button>
      </div>

      {loading ? (
        /* Loading Skeleton */
        <div className="py-8 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-400 animate-pulse">
            Gemini IA processando notícias e sentimento macro para {pair.symbol}...
          </p>
        </div>
      ) : data ? (
        <div className="pt-4 space-y-5">
          {/* Sentiment Gauge & Visual Split Bar */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: sentimentColor }}
                />
                <span className="text-xs font-semibold text-neutral-300">Medidor de Sentimento:</span>
                <span
                  className="text-xs font-black uppercase px-2 py-0.5 rounded font-mono tracking-wide"
                  style={{
                    backgroundColor: `${sentimentColor}20`,
                    color: sentimentColor,
                    border: `1px solid ${sentimentColor}40`,
                  }}
                >
                  {sentimentLabel}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-white">
                Score IA: {data.score}/100
              </span>
            </div>

            {/* Dual Colored Gradient Gauge Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3.5 rounded-full bg-neutral-950 overflow-hidden flex border border-neutral-800 p-0.5">
                {/* Bullish Section */}
                <div
                  className="h-full rounded-l-full transition-all duration-700 relative group flex items-center justify-end pr-1"
                  style={{
                    width: `${data.bullishPercentage}%`,
                    background: 'linear-gradient(90deg, #00BCD4 0%, #00E676 100%)',
                  }}
                >
                  {data.bullishPercentage >= 20 && (
                    <span className="text-[9px] font-mono font-black text-neutral-950 select-none">
                      {data.bullishPercentage}%
                    </span>
                  )}
                </div>

                {/* Bearish Section */}
                <div
                  className="h-full rounded-r-full transition-all duration-700 relative group flex items-center justify-start pl-1"
                  style={{
                    width: `${data.bearishPercentage}%`,
                    background: 'linear-gradient(90deg, #E53935 0%, #FF5252 100%)',
                  }}
                >
                  {data.bearishPercentage >= 20 && (
                    <span className="text-[9px] font-mono font-black text-white select-none">
                      {data.bearishPercentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* Gauge Scale Labels */}
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="flex items-center gap-1 text-[#00E676]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Bullish: {data.bullishPercentage}%</span>
                </span>
                <span className="text-neutral-500">Neutro (50%)</span>
                <span className="flex items-center gap-1 text-[#FF5252]">
                  <span>Bearish: {data.bearishPercentage}%</span>
                  <TrendingDown className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* AI Summary Highlight */}
            <div className="mt-3.5 pt-3 border-t border-neutral-800/80">
              <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{data.headline}</span>
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {data.summary}
              </p>
            </div>
          </div>

          {/* Key News Feed Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
                <span>Notícias e Catalisadores Analisados</span>
              </span>
              <span className="text-[11px] font-mono">Últimas 24h</span>
            </div>

            <div className="space-y-2">
              {data.keyNews.map((news, idx) => {
                const isNewsBullish = news.impact === 'BULLISH';
                const isNewsBearish = news.impact === 'BEARISH';
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-400 border border-neutral-700">
                          {news.source}
                        </span>
                        <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {news.time}
                        </span>
                      </div>
                      <p className="text-neutral-200 font-medium leading-snug">
                        {news.title}
                      </p>
                    </div>

                    <span
                      className={`self-start sm:self-center px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap ${
                        isNewsBullish
                          ? 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30'
                          : isNewsBearish
                          ? 'bg-[#FF5252]/15 text-[#FF5252] border border-[#FF5252]/30'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {news.impact}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fundamental Factors Pill List */}
          {data.fundamentalFactors && data.fundamentalFactors.length > 0 && (
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-850 space-y-1.5">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Fatores Fundamentais em Foco:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.fundamentalFactors.map((factor, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300"
                  >
                    &bull; {factor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
