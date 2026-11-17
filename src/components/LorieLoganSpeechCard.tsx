/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, ExternalLink, Sliders, BookOpen } from 'lucide-react';
import { MacroDataPoint } from '../types';

interface LorieLoganSpeechCardProps {
  onLoadLoganScenario: () => void;
  onOpenRStarModelsModal?: () => void;
}

export const LorieLoganSpeechCard: React.FC<LorieLoganSpeechCardProps> = ({ onLoadLoganScenario, onOpenRStarModelsModal }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-xl p-6 shadow-xl border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest font-bold">
                Dallas Fed Outlook
              </span>
              <span className="text-[10px] text-slate-400 font-mono">November 10, 2026</span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mt-1">
              President Lorie Logan Speech: Economic & Monetary Policy Outlook
            </h3>
          </div>
        </div>

        <a
          href="https://www.dallasfed.org/news/speeches/logan/2026/lkl261110"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors self-start sm:self-center font-mono"
        >
          <span>Official Speech</span>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-lg space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nominal Fed Funds</span>
          <div className="text-xl font-bold font-mono text-white">3.88%</div>
          <span className="text-[10px] text-slate-400 block">Current policy rate level</span>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-lg space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expected PCE Inflation</span>
          <div className="text-xl font-bold font-mono text-amber-400">3.10%</div>
          <span className="text-[10px] text-slate-400 block">Baker's dozen survey median</span>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-lg space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calculated Real Rate</span>
          <div className="text-xl font-bold font-mono text-emerald-400">0.78%</div>
          <span className="text-[10px] text-slate-400 block">3.88% minus 3.10% inflation</span>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-lg space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Neutral Rate Estimates</span>
          <div className="text-xl font-bold font-mono text-indigo-400">1.0% – 1.85%</div>
          <span className="text-[10px] text-slate-400 block">Across 8 published models (r*)</span>
        </div>
      </div>

      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-4 space-y-2.5 text-xs text-slate-300 font-sans leading-relaxed">
        <p>
          <strong className="text-white">Key Quote Analysis:</strong> &ldquo;In my view, accommodative monetary policy is adding to inflationary pressures... That makes the real fed funds rate 78 basis points, or a quarter-percentage-point below the lowest estimate of neutral.&rdquo;
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-400">
            Clicking the button loads President Logan's November 2026 data point into the Scenario Simulator and chart.
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {onOpenRStarModelsModal && (
              <button
                type="button"
                onClick={onOpenRStarModelsModal}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer border border-slate-700 font-mono"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Explore 8 R-Star Models</span>
              </button>
            )}
            <button
              onClick={onLoadLoganScenario}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Load Nov 2026 Logan Preset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
