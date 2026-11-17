/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { MacroDataPoint } from '../types';
import { ArrowUpDown, Download, Search, X, FileSpreadsheet, ArrowLeft, Check, HelpCircle } from 'lucide-react';

interface ExcelTableViewProps {
  data: MacroDataPoint[];
  selectedPoint: MacroDataPoint | null;
  onSelectPoint: (point: MacroDataPoint) => void;
  onClose: () => void;
  onOpenHelp?: () => void;
}

type SortKey = 'date' | 'effr' | 'rStar' | 'coreInflation' | 'fisherNeutral' | 'spread' | 'stance';
type SortDirection = 'asc' | 'desc';

export function ExcelTableView({ data, selectedPoint, onSelectPoint, onClose, onOpenHelp }: ExcelTableViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Search filter
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const dateMatch = row.date.toLowerCase().includes(searchTerm.toLowerCase());
      const stanceMatch = row.stance.toLowerCase().includes(searchTerm.toLowerCase());
      const valMatch = 
        row.effr.toFixed(2).includes(searchTerm) ||
        row.rStar.toFixed(2).includes(searchTerm) ||
        row.coreInflation.toFixed(2).includes(searchTerm) ||
        row.fisherNeutral.toFixed(2).includes(searchTerm) ||
        row.spread.toFixed(2).includes(searchTerm);
      
      return dateMatch || stanceMatch || valMatch;
    });
  }, [data, searchTerm]);

  // Sort logic
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        return sortDirection === 'asc' 
          ? (valA as number) - (valB as number) 
          : (valB as number) - (valA as number);
      }
    });
    return sorted;
  }, [filteredData, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  // CSV Exporter
  const handleExportCSV = () => {
    const headers = ['Row', 'Date', 'Fed Funds Rate (EFFR %)', 'Natural Rate (r* %)', 'Core Inflation/CPI (%)', 'Fisher Neutral (r*+Inflation %)', 'Spread (pts)', 'Stance'];
    const csvRows = [headers.join(',')];

    data.forEach((row, idx) => {
      const csvLine = [
        idx + 1,
        row.date,
        row.effr.toFixed(2),
        row.rStar.toFixed(2),
        row.coreInflation.toFixed(2),
        row.fisherNeutral.toFixed(2),
        row.spread.toFixed(2),
        row.stance
      ];
      csvRows.push(csvLine.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fisher_stance_data_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans flex flex-col">
      {/* Excel Header */}
      <div className="bg-slate-950 border-b border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Back to Interactive Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider text-white">
                Fisher Stance Matrix
              </h1>
              <p className="text-[10px] text-slate-400">
                Data Sheet • {data.length} Total Records • Live Excel View
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-3">
          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-all uppercase tracking-wider cursor-pointer shadow-sm animate-pulse"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Help Guide */}
          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded text-xs font-bold transition-all uppercase tracking-wider cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              title="Open Manual Calculation & Verification Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Help Guide</span>
            </button>
          )}

          {/* Close Excel View Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Excel Formula Bar / Search row */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-2.5 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded w-16 text-center select-none font-mono text-slate-400">
          fx
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search spreadsheet matrix (e.g. 2026, Restrictive, 5.25)..."
            className="block w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
          />
        </div>
        {selectedPoint && (
          <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded font-mono">
            Active Snapshot: <span className="font-bold">{selectedPoint.date}</span> (EFFR: {selectedPoint.effr.toFixed(2)}%)
          </div>
        )}
      </div>

      {/* Grid view container */}
      <div className="flex-1 overflow-auto bg-slate-900 max-w-full">
        <table className="w-full text-left border-collapse table-auto">
          {/* Excel headers A, B, C... */}
          <thead>
            <tr className="bg-slate-950 text-slate-500 font-mono text-[9px] border-b border-slate-800">
              <th className="px-3 py-1 text-center bg-slate-950/80 sticky top-0 left-0 z-40 border-r border-slate-800 w-12 select-none"></th>
              <th className="px-4 py-1 border-r border-slate-800 select-none">A</th>
              <th className="px-4 py-1 border-r border-slate-800 select-none">B</th>
              <th className="px-4 py-1 border-r border-slate-800 select-none">C</th>
              <th className="px-4 py-1 border-r border-slate-800 select-none">D</th>
              <th className="px-4 py-1 border-r border-slate-800 select-none">E</th>
              <th className="px-4 py-1 border-r border-slate-800 select-none">F</th>
              <th className="px-4 py-1 select-none">G</th>
            </tr>
            {/* Real Data Columns */}
            <tr className="bg-slate-950 text-slate-300 font-mono text-[11px] border-b border-slate-800 uppercase tracking-wider font-bold select-none shadow-sm">
              {/* Corner row index indicator */}
              <th className="px-3 py-2 text-center bg-slate-950 sticky top-0 left-0 z-40 border-r border-slate-800 w-12 font-bold text-[10px]">#</th>
              
              <th 
                onClick={() => handleSort('date')}
                className="px-4 py-2 border-r border-slate-800 cursor-pointer hover:bg-slate-800 hover:text-white sticky top-0 bg-slate-950 z-30 transition-all"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span>Date (YYYY-MM-DD)</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortKey === 'date' ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
              </th>

              <th 
                onClick={() => handleSort('effr')}
                className="px-4 py-2 border-r border-slate-800 cursor-pointer hover:bg-slate-800 hover:text-white sticky top-0 bg-slate-950 z-30 transition-all"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span>Fed Funds Rate (EFFR %)</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortKey === 'effr' ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
              </th>

              <th 
                onClick={() => handleSort('rStar')}
                className="px-4 py-2 border-r border-slate-800 cursor-pointer hover:bg-slate-800 hover:text-white sticky top-0 bg-slate-950 z-30 transition-all"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span>Natural Rate (r* %)</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortKey === 'rStar' ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
              </th>

              <th 
                onClick={() => handleSort('coreInflation')}
                className="px-4 py-2 border-r border-slate-800 cursor-pointer hover:bg-slate-800 hover:text-white sticky top-0 bg-slate-950 z-30 transition-all"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span>Core CPI YoY (%)</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortKey === 'coreInflation' ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
              </th>

              <th 
                onClick={() => handleSort('fisherNeutral')}
                className="px-4 py-2 border-r border-slate-800 cursor-pointer hover:bg-slate-800 hover:text-white sticky top-0 bg-slate-950 z-30 transition-all"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span>Fisher Neutral (r*+CPI %)</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortKey === 'fisherNeutral' ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
              </th>

              <th 
                onClick={() => handleSort('spread')}
                className="px-4 py-2 border-r border-slate-800 cursor-pointer hover:bg-slate-800 hover:text-white sticky top-0 bg-slate-950 z-30 transition-all"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span>Policy Spread (pts)</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortKey === 'spread' ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
              </th>

              <th 
                onClick={() => handleSort('stance')}
                className="px-4 py-2 cursor-pointer hover:bg-slate-800 hover:text-white sticky top-0 bg-slate-950 z-30 transition-all"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span>Stance Badge</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortKey === 'stance' ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No matching cells found. Try adjusting your FX search filter.
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => {
                const isSelected = selectedPoint?.date === row.date;
                return (
                  <tr 
                    key={row.date} 
                    onClick={() => onSelectPoint(row)}
                    className={`group transition-all hover:bg-slate-800/40 cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/15' 
                        : index % 2 === 0 
                          ? 'bg-slate-900' 
                          : 'bg-slate-900/50'
                    }`}
                  >
                    {/* Excel sticky Row Number column */}
                    <td className={`px-3 py-2 text-center bg-slate-950/90 text-[10px] font-bold border-r border-slate-800 sticky left-0 z-20 group-hover:bg-slate-800 transition-all ${
                      isSelected ? 'text-emerald-400' : 'text-slate-600'
                    }`}>
                      <div className="flex items-center justify-center gap-1">
                        {isSelected && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                        <span>{index + 1}</span>
                      </div>
                    </td>

                    {/* Column A: Date */}
                    <td className="px-4 py-2 border-r border-slate-800 text-slate-300 font-bold">
                      {row.date}
                    </td>

                    {/* Column B: EFFR */}
                    <td className="px-4 py-2 border-r border-slate-800 text-white font-medium text-right">
                      {row.effr.toFixed(2)}%
                    </td>

                    {/* Column C: rStar */}
                    <td className="px-4 py-2 border-r border-slate-800 text-slate-300 text-right">
                      {row.rStar.toFixed(2)}%
                    </td>

                    {/* Column D: Core CPI */}
                    <td className="px-4 py-2 border-r border-slate-800 text-slate-300 text-right">
                      {row.coreInflation.toFixed(2)}%
                    </td>

                    {/* Column E: Fisher Neutral */}
                    <td className="px-4 py-2 border-r border-slate-800 text-blue-400 font-medium text-right">
                      {row.fisherNeutral.toFixed(2)}%
                    </td>

                    {/* Column F: Spread */}
                    <td className={`px-4 py-2 border-r border-slate-800 font-bold text-right ${
                      row.spread > 0 ? 'text-rose-400' : row.spread < 0 ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {row.spread > 0 ? `+${row.spread.toFixed(2)}` : row.spread.toFixed(2)}
                    </td>

                    {/* Column G: Stance Badge */}
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        row.stance === 'Restrictive' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : row.stance === 'Accommodative' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {row.stance}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Excel status bar */}
      <div className="bg-slate-950 border-t border-slate-800 px-6 py-2 flex items-center justify-between text-[10px] text-slate-400 select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Ready
          </span>
          <span>Filtered: {filteredData.length} / {data.length} cells</span>
        </div>
        <div>
          <span>Scroll horizontally or vertically to explore complete series</span>
        </div>
      </div>
    </div>
  );
}
