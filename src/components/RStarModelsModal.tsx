/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Landmark, ExternalLink, Search, BookOpen, Calculator, ShieldAlert, Cpu } from 'lucide-react';
import { rStarModels, RStarModelInfo } from '../data/rStarModelsData';

interface RStarModelsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RStarModelsModal({ isOpen, onClose }: RStarModelsModalProps) {
  const [selectedModel, setSelectedModel] = useState<RStarModelInfo>(rStarModels[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('All');

  if (!isOpen) return null;

  const methodologyTypes = ['All', 'Semi-Structural', 'DSGE General Equilibrium', 'Time-Varying VAR', 'Term Structure / Financial Cycle'];

  const filteredModels = rStarModels.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || m.methodologyType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Positioning */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-5xl border border-slate-100 flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                  The 8 Published Federal Reserve & Academic R-Star Models
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Referenced in Dallas Fed President Lorie Logan's Speech (Range: 1.0% – 1.85%)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content (Scrollable Split View) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden bg-slate-50 text-slate-700">
            
            {/* Left Sidebar List (5 Cols) */}
            <div className="lg:col-span-5 border-r border-slate-200 bg-white p-4 overflow-y-auto flex flex-col gap-3">
              
              {/* Search & Filter */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search models or institutions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {methodologyTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        filterType === t
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Cards List */}
              <div className="space-y-2 pt-2">
                {filteredModels.map(model => {
                  const isSelected = selectedModel.id === model.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px]">{model.acronym}</span>
                          {model.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {model.estimateRange}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{model.institution}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Detail Pane (7 Cols) */}
            <div className="lg:col-span-7 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold">
                        {selectedModel.acronym}
                      </span>
                      <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                        Range: {selectedModel.estimateRange}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 font-sans">
                      {selectedModel.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">
                      {selectedModel.institution}
                    </p>
                  </div>

                  <a
                    href={selectedModel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors font-mono self-start sm:self-center"
                  >
                    <span>Source Hub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  </a>
                </div>

                {/* Methodology type badge */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Methodology Class:</span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-bold font-mono text-[11px]">
                    {selectedModel.methodologyType}
                  </span>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">Model Overview</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    {selectedModel.summary}
                  </p>
                </div>

                {/* Mechanism / Equation */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">Core Estimation Mechanism</span>
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs border border-slate-800 leading-relaxed">
                    {selectedModel.keyEquationOrMechanism}
                  </div>
                </div>

                {/* Citation */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">Official Citation & Publication</span>
                  <p className="text-xs text-slate-600 italic font-sans border-l-2 border-emerald-500 pl-3 py-1">
                    {selectedModel.citation}
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-slate-100 px-6 py-4 flex items-center justify-between border-t border-slate-200 sticky bottom-0">
            <span className="text-xs text-slate-500 font-mono">
              Displaying {rStarModels.length} Federal Reserve & Academic Models (1.0% – 1.85% span)
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              Close Explorer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
