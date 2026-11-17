/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  X, 
  HelpCircle, 
  ExternalLink, 
  Calculator, 
  BookOpen, 
  Landmark, 
  ChevronRight, 
  TrendingUp, 
  Sliders, 
  Activity, 
  Info, 
  BookOpen as GlossaryIcon, 
  FileText, 
  Calendar, 
  Zap 
} from 'lucide-react';

interface HelpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRStarModelsModal?: () => void;
}

export function HelpVerificationModal({ isOpen, onClose, onOpenRStarModelsModal }: HelpVerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Positioning */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-slate-100 flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                  Macroeconomic & Monetary Policy Verification Guide
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Calculations, Official Federal Reserve/FRED Sources & Historical Milestones
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

          {/* Content (Scrollable) */}
          <div className="overflow-y-auto p-6 space-y-6 bg-slate-50 text-slate-700">
            
            {/* Intro Alert */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-xs text-emerald-800 leading-relaxed font-sans">
              <strong>Interactive Verification Protocol:</strong> The Federal Reserve bases its interest rate stance on raw macroeconomic indices published monthly. Follow this comprehensive guide to retrieve official datasets, verify mathematical stance formulas, understand key transmission effects, and learn about major policy milestones.
            </div>

            {/* SECTION 1: Glossary of Key Terms */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>1. Glossary of Core Macroeconomic Indicators</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-xs shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 font-mono text-[11px] block">Effective Federal Funds Rate (EFFR)</span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      The volume-weighted median of overnight transactions in the federal funds market. This represents the primary short-term policy interest rate of the U.S. central bank.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 font-mono text-[11px] block">Natural Rate of Interest (r-star / r*)</span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      The inflation-neutral real interest rate that would prevail if the economy were operating at its long-run potential with stable prices. It cannot be directly measured and is estimated via econometric modeling.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 font-mono text-[11px] block">Fisher Neutral Rate</span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      The nominal neutral rate calculated using the classical Fisher relationship (<strong>r* + Core Inflation</strong>). If the Fed Funds rate matches this value, policy is considered neutral.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 font-mono text-[11px] block">Policy Spread & Stance</span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      The difference between the EFFR and the Fisher Neutral Rate. A positive spread signifies <strong>restrictive policy</strong> (cooling growth), while a negative spread signifies <strong>accommodative policy</strong> (stimulating growth).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: FRED Data Codes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-600" />
                <span>2. FRED Database Series Codes (Raw Government Access)</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-xs shadow-xs">
                <p className="leading-relaxed text-slate-600 font-sans">
                  Our high-fidelity database replicates key series compiled from Federal Reserve Economic Data (FRED). You can lookup these exact Series IDs on FRED to verify the raw data points:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Effective Federal Funds Rate</span>
                      <span className="text-emerald-600 font-bold block text-xs mt-1">Series ID: FEDFUNDS (Monthly)</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Source: Board of Governors of the Federal Reserve System.</span>
                    </div>
                    <a href="https://fred.stlouisfed.org/series/FEDFUNDS" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[10px] flex items-center gap-1 mt-2 font-sans font-medium">
                      View on FRED <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Core CPI Inflation (Less Food & Energy)</span>
                      <span className="text-emerald-600 font-bold block text-xs mt-1">Series ID: CPILFESL (YoY Change)</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Source: U.S. Bureau of Labor Statistics.</span>
                    </div>
                    <a href="https://fred.stlouisfed.org/series/CPILFESL" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[10px] flex items-center gap-1 mt-2 font-sans font-medium">
                      View on FRED <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Core PCE Price Index (Fed Target)</span>
                      <span className="text-emerald-600 font-bold block text-xs mt-1">Series ID: PCEPILFE (YoY Change)</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Source: U.S. Bureau of Economic Analysis.</span>
                    </div>
                    <a href="https://fred.stlouisfed.org/series/PCEPILFE" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[10px] flex items-center gap-1 mt-2 font-sans font-medium">
                      View on FRED <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Natural Rate of Interest (r*) Model</span>
                      <span className="text-emerald-600 font-bold block text-xs mt-1">Holston-Laubach-Williams NY Fed</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Source: Federal Reserve Bank of New York.</span>
                    </div>
                    <a href="https://www.newyorkfed.org/research/policy/rstar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[10px] flex items-center gap-1 mt-2 font-sans font-medium">
                      View NY Fed Estimates <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: The 8 Published R-Star Models */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>3. The 8 Published R-Star Models (1.0%–1.85% Range)</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-xs shadow-xs">
                <p className="leading-relaxed text-slate-600 font-sans">
                  In Dallas Fed President Lorie Logan's speech, she noted: <em>&ldquo;Across eight published models, estimates of the neutral real interest rate currently range from 1 to 1.85 percent.&rdquo;</em> These models span Federal Reserve System staff models and academic frameworks (HLW, DGGT, Bayesian VARs, term structure models, and DSGE frameworks).
                </p>
                {onOpenRStarModelsModal && (
                  <button
                    type="button"
                    onClick={onOpenRStarModelsModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Launch Interactive 8 R-Star Models Explorer</span>
                  </button>
                )}
              </div>
            </div>

            {/* SECTION 3: The Core CPI Metric Verification */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-500" />
                <span>3. Consumer Price Index Verification (Latest Release)</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-xs shadow-xs">
                <p className="leading-relaxed text-slate-600 font-sans">
                  The Bureau of Labor Statistics (BLS) publishes the Consumer Price Index on the second week of every month. 
                </p>
                <div className="border-l-2 border-slate-200 pl-3.5 space-y-2">
                  <div className="flex items-start gap-1.5 font-sans">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>Where to look:</strong> Navigate directly to the official <a href="https://www.bls.gov/cpi/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-bold">BLS CPI News Release <ExternalLink className="w-2.5 h-2.5" /></a>.</span>
                  </div>
                  <div className="flex items-start gap-1.5 font-sans">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>How to read the table:</strong> Scroll down to <strong>Table A</strong>. Look for the row labeled <strong>"All items less food and energy"</strong> (this is the Core CPI index which strips volatile sectors).</span>
                  </div>
                  <div className="flex items-start gap-1.5 font-sans">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>The Verification:</strong> The final column on the right shows the <strong>"Unadjusted 12-mos. ended June 2026"</strong>, which officially reads <strong>2.6%</strong>. The monthly change column shows <strong>0.0%</strong>.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Core PCE Verification */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>4. Personal Consumption Expenditures (PCE - Fed Preferred Target)</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 text-xs shadow-xs">
                <p className="leading-relaxed text-slate-600 font-sans">
                  The Federal Reserve targets the <strong>Personal Consumption Expenditures (PCE)</strong> index rather than CPI for its official 2.0% mandate, as it adapts to consumer substitution behaviors. This is published by the <strong>U.S. Bureau of Economic Analysis (BEA)</strong>.
                </p>
                <div className="border-l-2 border-slate-200 pl-3.5 space-y-2 text-slate-600 font-sans">
                  <div className="flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>Where to look:</strong> Visit the official <a href="https://www.bea.gov/data/personal-consumption-expenditures-price-index" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-bold">BEA Personal Income and Outlays release <ExternalLink className="w-2.5 h-2.5" /></a>.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>How to read:</strong> Filter or search the report tables for the specific line tracking <strong>"PCE price index less food and energy"</strong>.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: Stance Impact & Transmission Guide */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>5. Policy Stance Transmission & Real-World Impacts</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-xs shadow-xs">
                <p className="leading-relaxed text-slate-600 font-sans">
                  The policy spread has powerful, multi-quarter lags that transmit directly into commercial banks and corporate balances:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 space-y-1.5">
                    <span className="font-bold text-rose-900 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      Restrictive Stance (Spread &gt; 0)
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-rose-800 text-[11px] leading-relaxed">
                      <li><strong>Credit Cost:</strong> Borrowing costs rise significantly for mortgages, auto loans, and corporate debt.</li>
                      <li><strong>Stimulus Effect:</strong> High interest rates incentivize saving over consumption, decelerating money velocity.</li>
                      <li><strong>Asset Impact:</strong> Standard equity valuations compress due to higher discount rates; bond yields rise.</li>
                      <li><strong>Economic Goal:</strong> Purposefully slows demand to pull stubborn inflation back to the Fed's 2.0% target.</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 space-y-1.5">
                    <span className="font-bold text-emerald-900 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Accommodative Stance (Spread &lt; 0)
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-emerald-800 text-[11px] leading-relaxed">
                      <li><strong>Credit Cost:</strong> Lower cost of credit makes it cheap for commercial entities and consumers to borrow.</li>
                      <li><strong>Stimulus Effect:</strong> Low interest rates penalize cash balances, forcing liquidity into active business capital.</li>
                      <li><strong>Asset Impact:</strong> Drives stock market multiples higher and stimulates real estate valuations.</li>
                      <li><strong>Economic Goal:</strong> Jumpstarts capital spending, job creation, and aggregate demand during recessions.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: The Fisher Policy Stance Mathematics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-500" />
                <span>6. The Fisher Policy Stance Mathematics</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3.5 text-xs shadow-xs">
                <p className="leading-relaxed text-slate-600 font-sans">
                  The chart establishes a boundary separating <strong>restrictive</strong> monetary policy from <strong>accommodative</strong> monetary policy using the classic Fisher relation. Here are the core formulas calculated behind the scenes:
                </p>
                
                {/* Formulas List */}
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[11.5px] space-y-3 border border-slate-800 leading-relaxed">
                  <div className="border-b border-slate-800 pb-2">
                    <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider">Formula 1: Fisher Neutral Boundary</span>
                    <span className="text-emerald-400 font-bold">Neutral Boundary = r* + Core Inflation</span>
                    <span className="text-slate-400 block text-[9.5px] mt-0.5">Calculates the nominal interest rate required to keep the economy stable.</span>
                  </div>
                  <div className="border-b border-slate-800 pb-2">
                    <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider">Formula 2: Monetary Policy Spread</span>
                    <span className="text-emerald-400 font-bold">Policy Spread = EFFR - Neutral Boundary</span>
                    <span className="text-slate-400 block text-[9.5px] mt-0.5">Measures the degree of monetary tightness.</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider">Formula 3: Stance Classification</span>
                    <span className="text-emerald-400 font-bold">If Spread &gt; 0 &rarr; Restrictive Stance (Red Shade)</span>
                    <span className="text-emerald-400 font-bold block">If Spread &lt; 0 &rarr; Accommodative Stance (Green Shade)</span>
                  </div>
                </div>

                {/* June 2026 Walkthrough */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Historical June 2026 Calculations (Actuals)</span>
                  <p className="text-slate-600 leading-normal font-sans">
                    Applying the formulas to the actual economic indicators shown at the far-right end of the chart:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 font-mono text-[11px]">
                    <li>Natural Rate (r*): <strong>1.20%</strong></li>
                    <li>Core Inflation: <strong>2.60%</strong></li>
                    <li>Federal Funds Rate (EFFR): <strong>3.25%</strong></li>
                  </ul>
                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200 font-mono text-[11px] leading-relaxed space-y-2.5">
                    <div>
                      <span className="text-slate-500 block">Step 1: Calculate the Fisher Neutral Boundary</span>
                      Neutral Boundary = 1.20% (r*) + 2.60% (Inflation) = <strong className="text-blue-600 font-bold">3.80%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Step 2: Calculate the Policy Spread</span>
                      Spread = 3.25% (EFFR) - 3.80% (Neutral Boundary) = <strong className="text-rose-600 font-bold">-0.55% (pts)</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Step 3: Stance Classification</span>
                      Since Spread (-0.55%) is less than 0.00%, the monetary policy is classified as <strong className="text-emerald-600 font-bold">Accommodative</strong>. The shaded region at the end of the chart switches to green.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 7: Math Behind YoY Percentage Change */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-500" />
                <span>7. Math Behind YoY Percentage Change</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3.5 text-xs shadow-xs">
                <p className="leading-relaxed text-slate-600 font-sans">
                  To calculate the annual inflation rate yourself from raw index levels (such as BLS Consumer Price Index index points), use the standard Year-over-Year (YoY) percentage change formula:
                </p>
                
                {/* Formula Block */}
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-center space-y-2 border border-slate-800">
                  <div className="text-[13px] font-bold text-emerald-400">
                    YoY Inflation Rate = [ (Current Index - Prior Year Index) / Prior Year Index ] &times; 100
                  </div>
                </div>

                {/* Example Walkthrough */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Example Index Walkthrough: June 2026 Core CPI</span>
                  <p className="text-slate-600 leading-normal font-sans">
                    Let's assume the raw BLS Consumer Price Index values for "All items less food and energy" are:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 font-mono text-[11px]">
                    <li>June 2026 Raw Core Index (Current): <strong>318.452</strong></li>
                    <li>June 2025 Raw Core Index (Prior): <strong>310.382</strong></li>
                  </ul>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono text-[11px] leading-relaxed">
                    <span className="text-slate-500 block">Step 1: Compute raw index difference</span>
                    318.452 - 310.382 = <strong className="text-slate-800">8.070</strong>
                    
                    <span className="text-slate-500 block mt-2">Step 2: Divide by prior year base index</span>
                    8.070 / 310.382 = <strong className="text-slate-800">0.0259999</strong>
                    
                    <span className="text-slate-500 block mt-2">Step 3: Multiply by 100 for percentage rate</span>
                    0.0259999 * 100 = <strong className="text-emerald-600 font-bold">2.60% YoY (Rounded)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 8: Historical Policy Milestones Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>8. Key Historical Monetary Policy Milestones (2000–2026)</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-xs shadow-xs">
                <p className="leading-relaxed text-slate-600 font-sans">
                  Look back at how the spread has reacted during core historical epochs to observe patterns of monetary policy:
                </p>
                <div className="space-y-3">
                  <div className="relative pl-5 border-l-2 border-slate-200">
                    <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                    <strong className="text-slate-800 block font-mono text-[11px]">2000–2001: The Dotcom Crash & ZIRP Transition</strong>
                    <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5 font-sans">
                      The Fed rapidly cut the target funds rate from 6.50% down to 1.00% to support a collapsing tech sector, driving the spread into deeply accommodative territory.
                    </p>
                  </div>
                  <div className="relative pl-5 border-l-2 border-slate-200">
                    <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                    <strong className="text-slate-800 block font-mono text-[11px]">2004–2006: Pre-GFC Tightening Cycle</strong>
                    <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5 font-sans">
                      Fearing a housing bubble and steady inflationary builds, the Fed executed 17 consecutive quarter-point hikes, pushing the stance into highly restrictive territory.
                    </p>
                  </div>
                  <div className="relative pl-5 border-l-2 border-slate-200">
                    <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                    <strong className="text-slate-800 block font-mono text-[11px]">2008–2015: The Great Financial Crisis (GFC) & ZIRP Era</strong>
                    <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5 font-sans">
                      The collapse of Lehman Brothers initiated a massive accommodative regime. The Fed pinned rates at 0.00%–0.25% (Zero Interest Rate Policy) and engaged in massive asset purchases (Quantitative Easing).
                    </p>
                  </div>
                  <div className="relative pl-5 border-l-2 border-slate-200">
                    <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                    <strong className="text-slate-800 block font-mono text-[11px]">2022–2023: Post-COVID Anti-Inflationary Hikes</strong>
                    <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5 font-sans">
                      Prompted by post-pandemic supply constraints and immense stimulus liquidity, inflation spiked to 9.1%. The Fed initiated its fastest tightening cycle in 40 years, bringing EFFR over 5.25% to trigger a highly restrictive stance.
                    </p>
                  </div>
                  <div className="relative pl-5 border-l-2 border-slate-200">
                    <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                    <strong className="text-slate-800 block font-mono text-[11px]">2025–2026: Normalization & Pivot Phase</strong>
                    <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5 font-sans">
                      With core inflation moderating back toward 2.60% and economic parameters leveling out, the Fed pivoted to normalize rates downward to a more balanced, slightly accommodative posture to ensure a smooth economic soft landing.
                    </p>
                  </div>
                  <div className="relative pl-5 border-l-2 border-emerald-500">
                    <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <strong className="text-slate-800 block font-mono text-[11px]">November 2026: Dallas Fed President Lorie Logan Speech</strong>
                    <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5 font-sans">
                      Highlighting that nominal EFFR at 3.88% minus ~3.1% expected PCE inflation yields a real rate of 0.78% (78 bps) — which sits a quarter-percentage-point below the lowest estimate of neutral (1.0%–1.85%) across published models, adding to ongoing inflationary pressures.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 9: Scenario Builder & Modeling (Interactive Playground) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <span>9. Modeling Custom Scenarios & Testing Limits</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 text-xs shadow-xs">
                <p className="leading-relaxed text-slate-600 font-sans">
                  The application is designed to function as an interactive economic simulation playground. You can toggle to the <strong>Scenario Builder</strong> tab to create custom macroeconomic conditions:
                </p>
                <div className="border-l-2 border-slate-200 pl-3.5 space-y-2 text-slate-600 font-sans">
                  <div className="flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>Simulate Shock Events:</strong> Increase Core Inflation to 5.0% and watch the Fisher Neutral Boundary jump upward. See if your current Fed Funds Rate is restrictive enough.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>Adjust the Natural Rate (r*):</strong> Shift r* to see how secular stagnation (low r*) or high productivity gains (high r*) change the threshold of neutral monetary settings.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>Manual Adjustments:</strong> Rather than automatic generations, you can configure your parameters first, then click <strong>"Generate"</strong> inside the AI Strategist Review panel to receive tailored macroeconomic guidelines and asset allocations without wasting API quotas.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 10: Fast Aggregators */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-purple-500" />
                <span>10. Fast Financial Aggregators</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 text-xs shadow-xs">
                <p className="leading-relaxed text-slate-600 font-sans">
                  Instead of downloading heavy government PDF reports, you can browse fully formatted charts and historic metrics in real time via high-speed aggregators:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                  <a 
                    href="https://tradingeconomics.com/united-states/core-inflation-rate" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Trading Economics</span>
                    <span className="text-[10px] text-slate-400 mt-1">Interactive core inflation tables and real-time releases.</span>
                  </a>
                  <a 
                    href="https://www.usinflationcalculator.com/inflation/historical-inflation-rates/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">U.S. Inflation Calculator</span>
                    <span className="text-[10px] text-slate-400 mt-1">Convenient comparative lookup tables since 1913.</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-slate-100 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200 sticky bottom-0">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              Close Guide
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
