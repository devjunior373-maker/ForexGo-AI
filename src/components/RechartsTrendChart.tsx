import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { ForexPair } from '../types';
import { TrendingUp, TrendingDown, Target, ShieldAlert, CheckCircle2, Sliders } from 'lucide-react';

interface RechartsTrendChartProps {
  pair: ForexPair;
  selectedTimeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  className?: string;
}

export const RechartsTrendChart: React.FC<RechartsTrendChartProps> = ({
  pair,
  selectedTimeframe = 'M15',
  onTimeframeChange,
  className = '',
}) => {
  const [showEma, setShowEma] = useState(true);
  const [showTargets, setShowTargets] = useState(true);

  const isBuy = pair.signal === 'BUY';
  const isSell = pair.signal === 'SELL';
  const isJpy = pair.symbol.includes('JPY');
  const decimals = isJpy ? 3 : 5;

  const timeframes = ['M5', 'M15', 'H1', 'H4', 'D1'];

  // Build chart dataset from pair candles and trend
  const chartData = pair.candles.map((candle, index) => {
    // Smoothed EMA calculation based on candles
    const prevClose = index > 0 ? pair.candles[index - 1].close : candle.close;
    const emaValue = +(candle.close * 0.4 + prevClose * 0.6).toFixed(decimals);

    return {
      time: candle.time,
      price: candle.close,
      high: candle.high,
      low: candle.low,
      open: candle.open,
      volume: candle.volume,
      ema50: emaValue,
      entry: pair.entryPrice,
      tp: pair.takeProfit,
      sl: pair.stopLoss,
    };
  });

  // Calculate dynamic domain
  const allValues = [
    ...chartData.map((d) => d.price),
    ...chartData.map((d) => d.ema50),
    pair.entryPrice,
    pair.takeProfit,
    pair.stopLoss,
  ];
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const padding = (maxVal - minVal) * 0.1 || (isJpy ? 0.2 : 0.001);
  const domainMin = +(minVal - padding).toFixed(decimals);
  const domainMax = +(maxVal + padding).toFixed(decimals);

  const primaryColor = isBuy ? '#00E676' : isSell ? '#FF5252' : '#00BCD4';

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPositive = data.price >= data.open;
      return (
        <div className="bg-neutral-900/95 backdrop-blur-md border border-neutral-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 z-50">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-800 pb-1 font-mono text-neutral-400">
            <span className="font-bold text-white">{pair.symbol}</span>
            <span>{label}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 font-mono">
            <span className="text-neutral-400">Preço:</span>
            <span className={`font-bold text-right ${isPositive ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>
              {data.price.toFixed(decimals)}
            </span>
            <span className="text-neutral-400">Abertura:</span>
            <span className="text-neutral-200 text-right">{data.open.toFixed(decimals)}</span>
            <span className="text-neutral-400">Máx / Mín:</span>
            <span className="text-neutral-300 text-right">
              {data.high.toFixed(decimals)} / {data.low.toFixed(decimals)}
            </span>
            {showEma && (
              <>
                <span className="text-cyan-400">EMA 50:</span>
                <span className="text-cyan-400 text-right font-bold">{data.ema50.toFixed(decimals)}</span>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`relative w-full rounded-b-xl overflow-hidden bg-[#0A0D14] border-b border-neutral-800 shadow-2xl flex flex-col ${className}`}
    >
      {/* Chart Top Controls Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-900/90 border-b border-neutral-800 text-xs text-neutral-300 flex-wrap gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="font-bold text-white text-xs sm:text-sm tracking-wide mr-1 flex items-center gap-1.5">
            {isBuy ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#00E676]" />
            ) : isSell ? (
              <TrendingDown className="w-3.5 h-3.5 text-[#FF5252]" />
            ) : null}
            <span>{pair.symbol} Tendência</span>
          </span>
          <div className="flex bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange && onTimeframeChange(tf)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  selectedTimeframe === tf
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => setShowEma(!showEma)}
            className={`px-2 py-1 rounded border transition ${
              showEma
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400 font-medium'
                : 'border-neutral-800 bg-neutral-950 text-neutral-500'
            }`}
          >
            EMA 50
          </button>
          <button
            onClick={() => setShowTargets(!showTargets)}
            className={`px-2 py-1 rounded border transition ${
              showTargets
                ? 'border-[#00E676]/40 bg-green-500/10 text-[#00E676] font-medium'
                : 'border-neutral-800 bg-neutral-950 text-neutral-500'
            }`}
          >
            Níveis TP/SL
          </button>
        </div>
      </div>

      {/* Recharts Render Area */}
      <div className="w-full h-64 sm:h-72 md:h-84 min-h-[250px] p-2 select-none">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="rechartsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#1f2533" strokeDasharray="3 3" vertical={false} opacity={0.6} />

            <XAxis
              dataKey="time"
              stroke="#52525b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#27272a' }}
            />

            <YAxis
              domain={[domainMin, domainMax]}
              stroke="#52525b"
              fontSize={10}
              orientation="right"
              tickLine={false}
              axisLine={{ stroke: '#27272a' }}
              tickFormatter={(v) => v.toFixed(isJpy ? 2 : 4)}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* AI Reference Levels */}
            {showTargets && (
              <>
                <ReferenceLine
                  y={pair.takeProfit}
                  stroke="#00E676"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `TP: ${pair.takeProfitDisplay}`,
                    position: 'insideTopLeft',
                    fill: '#00E676',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
                <ReferenceLine
                  y={pair.entryPrice}
                  stroke="#00BCD4"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{
                    value: `Entrada: ${pair.entryPriceDisplay}`,
                    position: 'insideBottomLeft',
                    fill: '#00BCD4',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
                <ReferenceLine
                  y={pair.stopLoss}
                  stroke="#FF5252"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `SL: ${pair.stopLossDisplay}`,
                    position: 'insideBottomLeft',
                    fill: '#FF5252',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              </>
            )}

            {/* Price Area */}
            <Area
              type="monotone"
              dataKey="price"
              stroke={primaryColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#rechartsAreaGrad)"
              isAnimationActive={true}
              animationDuration={800}
            />

            {/* Optional EMA 50 trendline */}
            {showEma && (
              <Line
                type="monotone"
                dataKey="ema50"
                stroke="#00E5FF"
                strokeWidth={1.8}
                dot={false}
                strokeDasharray="2 2"
                isAnimationActive={true}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Target Price Ribbon below chart */}
      <div className="grid grid-cols-3 divide-x divide-neutral-800 bg-neutral-950/80 border-t border-neutral-800/80 py-1.5 text-center text-[10px]">
        <div className="flex flex-col items-center">
          <span className="text-neutral-500 font-medium">SL Proteção</span>
          <span className="font-mono font-bold text-[#FF5252]">{pair.stopLossDisplay}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-neutral-500 font-medium">Entrada IA</span>
          <span className="font-mono font-bold text-cyan-400">{pair.entryPriceDisplay}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-neutral-500 font-medium">Alvo TP</span>
          <span className="font-mono font-bold text-[#00E676]">{pair.takeProfitDisplay}</span>
        </div>
      </div>
    </div>
  );
};
