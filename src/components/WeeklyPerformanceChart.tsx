import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Target, Award, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';

interface DayPerformance {
  day: string;
  fullName: string;
  winCount: number;
  lossCount: number;
  totalSignals: number;
  pips: number;
  winRate: number;
  topPair: string;
}

const weeklyData: DayPerformance[] = [
  { day: 'Seg', fullName: 'Segunda-feira', winCount: 7, lossCount: 1, totalSignals: 8, pips: 85, winRate: 87.5, topPair: 'EUR/USD' },
  { day: 'Ter', fullName: 'Terça-feira', winCount: 9, lossCount: 1, totalSignals: 10, pips: 110, winRate: 90.0, topPair: 'USD/JPY' },
  { day: 'Qua', fullName: 'Quarta-feira', winCount: 6, lossCount: 2, totalSignals: 8, pips: 65, winRate: 75.0, topPair: 'GBP/USD' },
  { day: 'Qui', fullName: 'Quinta-feira', winCount: 8, lossCount: 1, totalSignals: 9, pips: 95, winRate: 88.9, topPair: 'AUD/USD' },
  { day: 'Sex', fullName: 'Sexta-feira', winCount: 6, lossCount: 1, totalSignals: 7, pips: 73, winRate: 85.7, topPair: 'EUR/USD' },
];

export const WeeklyPerformanceChart: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [metricView, setMetricView] = useState<'signals' | 'pips'>('signals');

  const totalWins = weeklyData.reduce((acc, d) => acc + d.winCount, 0);
  const totalSignals = weeklyData.reduce((acc, d) => acc + d.totalSignals, 0);
  const totalPips = weeklyData.reduce((acc, d) => acc + d.pips, 0);
  const avgWinRate = ((totalWins / totalSignals) * 100).toFixed(1);

  // Custom Dark HUD Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DayPerformance;
      return (
        <div className="bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 z-50 min-w-[170px]">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-1 font-mono">
            <span className="font-bold text-white">{data.fullName}</span>
            <span className="text-cyan-400 font-bold">{data.winRate}% Win</span>
          </div>
          <div className="space-y-1 font-mono pt-0.5">
            <div className="flex justify-between items-center text-neutral-400">
              <span>Sinais Bem-sucedidos:</span>
              <span className="font-bold text-[#00E676]">{data.winCount} / {data.totalSignals}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>Pips Gerados:</span>
              <span className="font-bold text-cyan-400">+{data.pips} pips</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>Destaque:</span>
              <span className="font-bold text-white">{data.topPair}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`w-full bg-[#161B26] border border-neutral-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl overflow-hidden relative ${className}`}
    >
      {/* Background glow spot */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-24 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header with title and view toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Performance Semanal da IA</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 font-bold">
                {avgWinRate}% Win Rate
              </span>
            </h3>
          </div>
          <p className="text-xs text-neutral-400">
            Histórico consolidado dos sinais executados com Take Profit atingido.
          </p>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 self-start sm:self-center">
          <button
            onClick={() => setMetricView('signals')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              metricView === 'signals'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Sinais no Alvo (TP)
          </button>
          <button
            onClick={() => setMetricView('pips')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              metricView === 'pips'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Pips (+{totalPips})
          </button>
        </div>
      </div>

      {/* 4 Summary Stats Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Sinais Totais</div>
            <div className="text-base sm:text-lg font-mono font-bold text-white">{totalSignals}</div>
          </div>
          <Zap className="w-4 h-4 text-cyan-400 opacity-80" />
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Take Profit (TP)</div>
            <div className="text-base sm:text-lg font-mono font-bold text-[#00E676]">{totalWins}</div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-[#00E676] opacity-80" />
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Pips Ganhos</div>
            <div className="text-base sm:text-lg font-mono font-bold text-cyan-400">+{totalPips}</div>
          </div>
          <TrendingUp className="w-4 h-4 text-cyan-400 opacity-80" />
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Precisão Média</div>
            <div className="text-base sm:text-lg font-mono font-bold text-[#00E676]">{avgWinRate}%</div>
          </div>
          <Target className="w-4 h-4 text-[#00E676] opacity-80" />
        </div>
      </div>

      {/* Recharts Bar/Composed Chart Canvas */}
      <div className="w-full h-48 sm:h-56 min-h-[190px] select-none pt-1">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="winBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E676" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#00BCD4" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="lossBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5252" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#FF5252" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="pipsBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00BCD4" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#00838F" stopOpacity={0.5} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#262b36" strokeDasharray="3 3" vertical={false} opacity={0.5} />

            <XAxis
              dataKey="day"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#27272a' }}
            />

            <YAxis
              stroke="#71717a"
              fontSize={11}
              orientation="right"
              tickLine={false}
              axisLine={{ stroke: '#27272a' }}
            />

            <Tooltip content={<CustomTooltip />} />

            {metricView === 'signals' ? (
              <>
                {/* Sinais Bem-sucedidos */}
                <Bar
                  dataKey="winCount"
                  name="Sinais no Alvo (TP)"
                  fill="url(#winBarGrad)"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                  animationDuration={800}
                />
                {/* Sinais Stop Loss */}
                <Bar
                  dataKey="lossCount"
                  name="Stop Loss (SL)"
                  fill="url(#lossBarGrad)"
                  radius={[6, 6, 0, 0]}
                  barSize={12}
                  animationDuration={800}
                />
                {/* Taxa de Acerto em linha de tendência */}
                <Line
                  type="monotone"
                  dataKey="winRate"
                  stroke="#00E5FF"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#00E5FF', strokeWidth: 0 }}
                  yAxisId={0}
                  animationDuration={1000}
                  hide
                />
              </>
            ) : (
              /* Pips Conquistados por dia */
              <Bar
                dataKey="pips"
                name="Pips Ganhos"
                fill="url(#pipsBarGrad)"
                radius={[6, 6, 0, 0]}
                barSize={28}
                animationDuration={800}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info line */}
      <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 pt-2 border-t border-neutral-800/80">
        <span className="flex items-center gap-1.5 text-neutral-400">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#00E676]" /> Sinais no Alvo (TP)
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#FF5252]/60 ml-2" /> Stop Loss (SL)
        </span>
        <span className="text-cyan-400 font-mono font-medium">
          Média: +{(totalPips / weeklyData.length).toFixed(0)} pips/dia
        </span>
      </div>
    </div>
  );
};
