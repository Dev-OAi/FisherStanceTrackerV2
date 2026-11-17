/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MacroDataPoint } from '../types';
import { Activity, Sliders, Eye, EyeOff, BarChart2, Calendar, TrendingUp } from 'lucide-react';

interface RealRateChartViewProps {
  data: MacroDataPoint[];
  onBackToMaster: () => void;
}

interface QuarterPoint {
  quarterLabel: string; // e.g. "20-Q1" or "2020-Q1"
  year: number;
  quarter: number;
  nominalEffr: number;
  corePce: number;
  realEffr: number; // nominalEffr - corePce
  rStar: number;
  stance: 'Accommodative' | 'Restrictive' | 'Neutral';
}

export const RealRateChartView: React.FC<RealRateChartViewProps> = ({ data, onBackToMaster }) => {
  // Aggregate monthly data into quarters
  const quarters = useMemo(() => {
    const map = new Map<string, { year: number; q: number; effrs: number[]; infs: number[]; rStars: number[] }>();

    data.forEach((p) => {
      const parts = p.date.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const q = Math.ceil(month / 3);
      const qKey = `${year}-Q${q}`;

      if (!map.has(qKey)) {
        map.set(qKey, { year, q, effrs: [], infs: [], rStars: [] });
      }
      const entry = map.get(qKey)!;
      entry.effrs.push(p.effr);
      entry.infs.push(p.coreInflation);
      entry.rStars.push(p.rStar);
    });

    const result: QuarterPoint[] = [];
    map.forEach((val, key) => {
      const avgEffr = val.effrs.reduce((a, b) => a + b, 0) / val.effrs.length;
      const avgInf = val.infs.reduce((a, b) => a + b, 0) / val.infs.length;
      const avgRStar = val.rStars.reduce((a, b) => a + b, 0) / val.rStars.length;
      const realEffr = avgEffr - avgInf;

      let stance: 'Accommodative' | 'Restrictive' | 'Neutral' = 'Neutral';
      const spread = avgEffr - (avgRStar + avgInf);
      if (spread > 0.05) stance = 'Restrictive';
      else if (spread < -0.05) stance = 'Accommodative';

      // Short label like "20-Q1" or "2026-Q4"
      const shortYear = String(val.year).slice(-2);
      const quarterLabel = `${shortYear}-Q${val.q}`;

      result.push({
        quarterLabel,
        year: val.year,
        quarter: val.q,
        nominalEffr: parseFloat(avgEffr.toFixed(2)),
        corePce: parseFloat(avgInf.toFixed(2)),
        realEffr: parseFloat(realEffr.toFixed(2)),
        rStar: parseFloat(avgRStar.toFixed(2)),
        stance
      });
    });

    // Sort chronologically
    return result.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.quarter - b.quarter;
    });
  }, [data]);

  const [selectedIndex, setSelectedIndex] = useState<number>(quarters.length > 0 ? quarters.length - 1 : 0);
  
  // Visibility toggles for series
  const [showNominal, setShowNominal] = useState<boolean>(true);
  const [showPce, setShowPce] = useState<boolean>(true);
  const [showRealEffr, setShowRealEffr] = useState<boolean>(true);
  const [showRStar, setShowRStar] = useState<boolean>(true);

  if (quarters.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 font-sans">
        No quarterly data available.
      </div>
    );
  }

  const currentQ = quarters[Math.min(selectedIndex, quarters.length - 1)];
  const realNetGap = parseFloat((currentQ.realEffr - currentQ.rStar).toFixed(2));

  // SVG Chart dimensions
  const svgWidth = 850;
  const svgHeight = 320;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Min/Max for Y Axis
  const allValues: number[] = [];
  quarters.forEach((q) => {
    if (showNominal) allValues.push(q.nominalEffr);
    if (showPce) allValues.push(q.corePce);
    if (showRealEffr) allValues.push(q.realEffr);
    if (showRStar) allValues.push(q.rStar);
  });
  const minY = Math.floor(Math.min(...allValues, -6));
  const maxY = Math.ceil(Math.max(...allValues, 6));

  const yScale = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return padding.top + chartHeight - ((clamped - minY) / (maxY - minY)) * chartHeight;
  };

  const xScale = (idx: number) => {
    if (quarters.length <= 1) return padding.left;
    return padding.left + (idx / (quarters.length - 1)) * chartWidth;
  };

  // Build SVG path strings
  const makePath = (accessor: (q: QuarterPoint) => number) => {
    return quarters
      .map((q, idx) => {
        const x = xScale(idx);
        const y = yScale(accessor(q));
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const nominalPath = makePath((q) => q.nominalEffr);
  const pcePath = makePath((q) => q.corePce);
  const realEffrPath = makePath((q) => q.realEffr);
  const rStarPath = makePath((q) => q.rStar);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 font-sans">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-lg shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-widest font-bold">
                Quarterly Analytical View
              </span>
              <span className="text-[10px] text-slate-400 font-mono">2020 – 2026</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight mt-0.5">
              Real Fed Rate & R-Star Trajectory
            </h3>
          </div>
        </div>

        <button
          onClick={onBackToMaster}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition-all cursor-pointer uppercase tracking-wider self-start sm:self-center"
        >
          &larr; Back to Master Stance View
        </button>
      </div>

      {/* Toggle Filter Pills */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Toggle Series:</span>
        <button
          onClick={() => setShowNominal(!showNominal)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
            showNominal
              ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
              : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span>Nominal Fed Funds Rate</span>
          {showNominal ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setShowPce(!showPce)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
            showPce
              ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
              : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
          <span>Core PCE Inflation</span>
          {showPce ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setShowRealEffr(!showRealEffr)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
            showRealEffr
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
              : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>Real Fed Funds Rate</span>
          {showRealEffr ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setShowRStar(!showRStar)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
            showRStar
              ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-xs'
              : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
          <span>Real R-Star</span>
          {showRStar ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main SVG Chart */}
      <div className="relative bg-slate-900 rounded-xl p-4 overflow-hidden border border-slate-800 shadow-inner">
        {/* Inspecting Header Pill */}
        <div className="absolute top-6 left-6 z-10 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg text-white text-xs font-mono shadow-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{currentQ.year}-Q{currentQ.quarter} (Inspecting)</span>
        </div>

        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
          {/* Horizontal Grid lines */}
          {Array.from({ length: Math.floor((maxY - minY) / 2) + 1 }).map((_, i) => {
            const val = minY + i * 2;
            const y = yScale(val);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val > 0 ? `+${val}%` : `${val}%`}
                </text>
              </g>
            );
          })}

          {/* Zero Line */}
          <line
            x1={padding.left}
            y1={yScale(0)}
            x2={svgWidth - padding.right}
            y2={yScale(0)}
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {/* Series Paths */}
          {showNominal && (
            <path
              d={nominalPath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {showPce && (
            <path
              d={pcePath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {showRealEffr && (
            <path
              d={realEffrPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {showRStar && (
            <path
              d={rStarPath}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Vertical Inspector Line for Selected Quarter */}
          {(() => {
            const x = xScale(selectedIndex);
            return (
              <g>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={svgHeight - padding.bottom}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
                {/* Dots on lines */}
                {showNominal && (
                  <circle cx={x} cy={yScale(currentQ.nominalEffr)} r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                )}
                {showPce && (
                  <circle cx={x} cy={yScale(currentQ.corePce)} r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                )}
                {showRealEffr && (
                  <circle cx={x} cy={yScale(currentQ.realEffr)} r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                )}
                {showRStar && (
                  <circle cx={x} cy={yScale(currentQ.rStar)} r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                )}
              </g>
            );
          })()}

          {/* X Axis Labels */}
          {quarters.map((q, idx) => {
            // Show label every few quarters to avoid crowding
            if (idx % 2 === 0 || idx === quarters.length - 1) {
              const x = xScale(idx);
              return (
                <text
                  key={idx}
                  x={x}
                  y={svgHeight - 12}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {q.quarterLabel}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Summary Cards below chart */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Real Net Gap</span>
          <div className={`text-xl font-bold font-mono ${realNetGap >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {realNetGap >= 0 ? `+${realNetGap}%` : `${realNetGap}%`}
          </div>
          <span className="text-[10px] text-slate-400 block">Real Rate minus R-Star</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Stance Zone</span>
          <div className={`text-sm font-extrabold uppercase tracking-tight font-sans mt-1 ${
            currentQ.stance === 'Restrictive' 
              ? 'text-rose-600' 
              : currentQ.stance === 'Accommodative' 
                ? 'text-emerald-600' 
                : 'text-slate-600'
          }`}>
            {currentQ.stance}
          </div>
          <span className="text-[10px] text-slate-400 block">Monetary Policy Regime</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Real Fed Rate</span>
          <div className="text-xl font-bold font-mono text-emerald-600">
            {currentQ.realEffr >= 0 ? `+${currentQ.realEffr}%` : `${currentQ.realEffr}%`}
          </div>
          <span className="text-[10px] text-slate-400 block">Nominal EFFR minus PCE</span>
        </div>
      </div>

      {/* Scrub Time Period Slider */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Scrub Time Period (Quarterly Data Pointer)</span>
          </span>
          <span className="font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md text-xs">
            {currentQ.year} Quarter {currentQ.quarter} ({currentQ.quarterLabel})
          </span>
        </div>

        <input
          type="range"
          min="0"
          max={quarters.length - 1}
          step="1"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>{quarters[0]?.quarterLabel}</span>
          <span>{quarters[Math.floor(quarters.length / 2)]?.quarterLabel}</span>
          <span>{quarters[quarters.length - 1]?.quarterLabel}</span>
        </div>
      </div>
    </div>
  );
};
