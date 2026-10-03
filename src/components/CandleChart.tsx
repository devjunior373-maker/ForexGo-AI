import React, { useState, useRef } from 'react';
import { CandleData, ForexPair } from '../types';
import { Activity, Layers, Maximize2, Minimize2 } from 'lucide-react';

interface CandleChartProps {
  pair: ForexPair;
  selectedTimeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  className?: string;
}

export const CandleChart: React.FC<CandleChartProps> = ({
  pair,
  selectedTimeframe = 'M15',
  onTimeframeChange,
  className = '',
}) => {
  const [activeCandle, setActiveCandle] = useState<CandleData | null>(null);
  const [showIndicators, setShowIndicators] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const timeframes = ['M5', 'M15', 'H1', 'H4', 'D1'];

  // Base candles
  const candles = pair.candles;
  if (!candles || candles.length === 0) return null;

  // Calculate min & max prices for scale
  const allPrices = candles.flatMap((c) => [c.low, c.high]);
  allPrices.push(pair.entryPrice, pair.stopLoss, pair.takeProfit);
  if (pair.supportLevels) allPrices.push(...pair.supportLevels);
  if (pair.resistanceLevels) allPrices.push(...pair.resistanceLevels);

  const minPrice = Math.min(...allPrices) * 0.9992;
  const maxPrice = Math.max(...allPrices) * 1.0008;
  const priceRange = maxPrice - minPrice || 0.001;

  // SVG viewBox coordinates
  const svgWidth = 800;
  const svgHeight = 420;
  const chartPaddingTop = 30;
  const chartPaddingBottom = 60;
  const chartHeight = svgHeight - chartPaddingTop - chartPaddingBottom;
  const volumeHeight = 50;

  const getY = (price: number) => {
    return chartPaddingTop + (1 - (price - minPrice) / priceRange) * chartHeight;
  };

  const candleSpacing = svgWidth / (candles.length + 1);
  const candleBodyWidth = Math.max(12, candleSpacing * 0.58);

  const currentHovered = activeCandle || candles[candles.length - 1];

  // EMA curve points calculation
  const emaPoints = candles.map((c, i) => {
    const x = (i + 1) * candleSpacing;
    // Smoothed simulated EMA
    const smoothFactor = 0.35;
    const prevPrice = i > 0 ? (candles[i - 1].close + candles[i - 1].open) / 2 : c.close;
    const emaVal = c.close * smoothFactor + prevPrice * (1 - smoothFactor);
    const y = getY(emaVal);
    return `${x},${y}`;
  }).join(' ');

  // Handle pointer move for crosshair
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const scaleX = svgWidth / rect.width;
    const svgX = clientX * scaleX;

    const closestIndex = Math.min(
      Math.max(0, Math.round(svgX / candleSpacing) - 1),
      candles.length - 1
    );
    if (candles[closestIndex]) {
      setActiveCandle(candles[closestIndex]);
    }
  };

  const handlePointerLeave = () => {
    setActiveCandle(null);
  };

  const activeIndex = activeCandle ? candles.indexOf(activeCandle) : candles.length - 1;
  const activeX = (activeIndex + 1) * candleSpacing;
  const activeY = currentHovered ? getY(currentHovered.close) : 0;

  return (
    <div
      className={`relative w-full rounded-b-xl overflow-hidden bg-[#0A0D14] border-b border-neutral-800 shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-72 sm:h-80 md:h-[400px]'
      } ${className}`}
    >
      {/* Chart Top Controls Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-900/90 border-b border-neutral-800 text-xs text-neutral-300">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="font-bold text-white text-xs sm:text-sm tracking-wide mr-1">
            {pair.symbol}
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

        {/* Status / Toggle Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIndicators(!showIndicators)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border transition ${
              showIndicators
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                : 'border-neutral-700 bg-neutral-800 text-neutral-400'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">IA Linhas</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded text-neutral-400 hover:text-white bg-neutral-800 border border-neutral-700"
            title={isFullscreen ? 'Minimizar' : 'Tela Cheia'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Floating Candle HUD Metrics */}
      <div className="px-3 py-1 bg-black/60 border-b border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400 overflow-x-auto gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <span>
            Hora: <strong className="text-neutral-200">{currentHovered.time}</strong>
          </span>
          <span>
            O: <strong className="text-neutral-200">{currentHovered.open.toFixed(5)}</strong>
          </span>
          <span>
            H: <strong className="text-green-400">{currentHovered.high.toFixed(5)}</strong>
          </span>
          <span>
            L: <strong className="text-red-400">{currentHovered.low.toFixed(5)}</strong>
          </span>
          <span>
            C:{' '}
            <strong
              className={
                currentHovered.close >= currentHovered.open ? 'text-green-400' : 'text-red-400'
              }
            >
              {currentHovered.close.toFixed(5)}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 shrink-0 font-mono">
          <Activity className="w-3 h-3" />
          <span>Sinal IA Ativo</span>
        </div>
      </div>

      {/* Interactive SVG Chart Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden touch-none cursor-crosshair">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          className="w-full h-full select-none"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            <linearGradient id="bullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00E676" />
              <stop offset="100%" stopColor="#00B0FF" />
            </linearGradient>
            <linearGradient id="bearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF5252" />
              <stop offset="100%" stopColor="#D50000" />
            </linearGradient>
            <linearGradient id="tpGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 230, 118, 0.15)" />
              <stop offset="100%" stopColor="rgba(0, 230, 118, 0.0)" />
            </linearGradient>
            <linearGradient id="slGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 82, 82, 0.15)" />
              <stop offset="100%" stopColor="rgba(255, 82, 82, 0.0)" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
            const y = chartPaddingTop + ratio * chartHeight;
            const priceVal = maxPrice - ratio * priceRange;
            return (
              <g key={idx} opacity="0.35">
                <line
                  x1="0"
                  y1={y}
                  x2={svgWidth - 65}
                  y2={y}
                  stroke="#262b36"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text
                  x={svgWidth - 60}
                  y={y + 3}
                  fill="#71717a"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {priceVal.toFixed(5)}
                </text>
              </g>
            );
          })}

          {/* AI Levels Overlays */}
          {showIndicators && (
            <>
              {/* Take Profit Zone & Line */}
              <line
                x1="0"
                y1={getY(pair.takeProfit)}
                x2={svgWidth - 60}
                y2={getY(pair.takeProfit)}
                stroke="#00E676"
                strokeWidth="1.5"
                strokeDasharray="5,4"
                opacity="0.9"
              />
              <rect
                x={svgWidth - 145}
                y={getY(pair.takeProfit) - 10}
                width="80"
                height="18"
                rx="3"
                fill="#00E676"
              />
              <text
                x={svgWidth - 105}
                y={getY(pair.takeProfit) + 3}
                fill="#000000"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                TP: {pair.takeProfitDisplay}
              </text>

              {/* Entry Price Zone & Line */}
              <line
                x1="0"
                y1={getY(pair.entryPrice)}
                x2={svgWidth - 60}
                y2={getY(pair.entryPrice)}
                stroke="#00BCD4"
                strokeWidth="1.5"
                strokeDasharray="4,3"
                opacity="0.9"
              />
              <rect
                x={svgWidth - 150}
                y={getY(pair.entryPrice) - 10}
                width="85"
                height="18"
                rx="3"
                fill="#00BCD4"
              />
              <text
                x={svgWidth - 107}
                y={getY(pair.entryPrice) + 3}
                fill="#000000"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                Entrada: {pair.entryPriceDisplay}
              </text>

              {/* Stop Loss Zone & Line */}
              <line
                x1="0"
                y1={getY(pair.stopLoss)}
                x2={svgWidth - 60}
                y2={getY(pair.stopLoss)}
                stroke="#FF5252"
                strokeWidth="1.5"
                strokeDasharray="5,4"
                opacity="0.9"
              />
              <rect
                x={svgWidth - 145}
                y={getY(pair.stopLoss) - 10}
                width="80"
                height="18"
                rx="3"
                fill="#FF5252"
              />
              <text
                x={svgWidth - 105}
                y={getY(pair.stopLoss) + 3}
                fill="#FFFFFF"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                SL: {pair.stopLossDisplay}
              </text>

              {/* EMA 50 trend line */}
              <polyline
                fill="none"
                stroke="#0288D1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.75"
                points={emaPoints}
              />
            </>
          )}

          {/* Candlesticks Rendering */}
          {candles.map((candle, i) => {
            const x = (i + 1) * candleSpacing;
            const openY = getY(candle.open);
            const closeY = getY(candle.close);
            const highY = getY(candle.high);
            const lowY = getY(candle.low);
            const isBullish = candle.close >= candle.open;

            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(3, Math.abs(closeY - openY));

            return (
              <g key={i} className="transition-all duration-150">
                {/* Candle wick line */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={isBullish ? '#00E676' : '#FF5252'}
                  strokeWidth="1.5"
                  opacity="0.9"
                />

                {/* Candle Body */}
                <rect
                  x={x - candleBodyWidth / 2}
                  y={bodyTop}
                  width={candleBodyWidth}
                  height={bodyHeight}
                  rx="1.5"
                  fill={isBullish ? '#00E676' : '#FF5252'}
                  stroke={isBullish ? '#00E676' : '#FF5252'}
                  strokeWidth="1"
                  className="hover:brightness-125 cursor-pointer"
                />

                {/* Volume bar at bottom */}
                <rect
                  x={x - candleBodyWidth / 2}
                  y={svgHeight - (candle.volume / 4500) * volumeHeight}
                  width={candleBodyWidth}
                  height={(candle.volume / 4500) * volumeHeight}
                  fill={isBullish ? 'rgba(0, 230, 118, 0.25)' : 'rgba(255, 82, 82, 0.25)'}
                  rx="1"
                />

                {/* X axis time marker */}
                {i % 2 === 0 && (
                  <text
                    x={x}
                    y={svgHeight - 10}
                    fill="#71717a"
                    fontSize="8.5"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {candle.time}
                  </text>
                )}
              </g>
            );
          })}

          {/* Interactive Crosshair when active */}
          {activeCandle && (
            <g pointerEvents="none">
              {/* Vertical Crosshair Line */}
              <line
                x1={activeX}
                y1={0}
                x2={activeX}
                y2={svgHeight}
                stroke="#00BCD4"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.8"
              />
              {/* Horizontal Crosshair Line */}
              <line
                x1={0}
                y1={activeY}
                x2={svgWidth - 60}
                y2={activeY}
                stroke="#00BCD4"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.8"
              />
              {/* Price Tag on Right Axis */}
              <rect
                x={svgWidth - 60}
                y={activeY - 9}
                width="60"
                height="18"
                rx="2"
                fill="#00BCD4"
              />
              <text
                x={svgWidth - 30}
                y={activeY + 3}
                fill="#000000"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {activeCandle.close.toFixed(5)}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
