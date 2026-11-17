/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RStarModelInfo {
  id: string;
  name: string;
  acronym: string;
  institution: string;
  estimateRange: string;
  methodologyType: 'Semi-Structural' | 'DSGE General Equilibrium' | 'Time-Varying VAR' | 'Term Structure / Financial Cycle' | 'Local Projections';
  summary: string;
  keyEquationOrMechanism: string;
  citation: string;
  url: string;
}

export const rStarModels: RStarModelInfo[] = [
  {
    id: 'hlw',
    name: 'Holston-Laubach-Williams Model',
    acronym: 'HLW',
    institution: 'Federal Reserve Bank of New York / Board of Governors',
    estimateRange: '1.05% – 1.45%',
    methodologyType: 'Semi-Structural',
    summary: 'The preeminent unobserved components model linking output gap to real interest rate gaps and inflation to output gaps via an IS curve and Phillips curve framework.',
    keyEquationOrMechanism: 'State-space filtering estimating potential GDP growth and neutral real rate r* simultaneously.',
    citation: 'Holston, K., Laubach, T., & Williams, J. C. (2017). Measuring the natural rate of interest: International trends and determinants.',
    url: 'https://www.newyorkfed.org/research/policy/rstar'
  },
  {
    id: 'dggt',
    name: 'Del Negro-Giannone-Giannoni-Tambalotti Model',
    acronym: 'DGGT',
    institution: 'Federal Reserve Bank of New York',
    estimateRange: '1.10% – 1.60%',
    methodologyType: 'DSGE General Equilibrium',
    summary: 'A medium-scale Dynamic Stochastic General Equilibrium (DSGE) model incorporating financial market frictions, habit formation, and nominal rigidities.',
    keyEquationOrMechanism: 'Derives r* from household intertemporal substitution Euler equations and balanced growth paths.',
    citation: 'Del Negro, M., Giannone, D., Giannoni, M. P., & Tambalotti, A. (2019). Global r*. Federal Reserve Bank of New York Staff Reports, No. 896.',
    url: 'https://www.newyorkfed.org/research/staff_reports/sr896'
  },
  {
    id: 'beyer-wieland',
    name: 'Beyer-Wieland Term Structure Model',
    acronym: 'BW',
    institution: 'European Central Bank / Fed Academic Network',
    estimateRange: '1.20% – 1.70%',
    methodologyType: 'Term Structure / Financial Cycle',
    summary: 'Combines macroeconomic unobserved components with arbitrage-free term structure models of interest rates across maturities.',
    keyEquationOrMechanism: 'Joint estimation of yield curve term premia and macroeconomic fundamentals.',
    citation: 'Beyer, A., & Wieland, V. (2019). Instability, inflation and the natural rate of interest. CEPR Discussion Papers.',
    url: 'https://cepr.org/active/publications/discussion_papers/dp.php?dpno=13745'
  },
  {
    id: 'lubik-matthes',
    name: 'Lubik-Matthes Time-Varying VAR Model',
    acronym: 'LM',
    institution: 'Federal Reserve Bank of Richmond',
    estimateRange: '1.00% – 1.50%',
    methodologyType: 'Time-Varying VAR',
    summary: 'Employs a Vector Autoregression with time-varying parameters and stochastic volatility to capture shifting macroeconomic transmission mechanisms.',
    keyEquationOrMechanism: 'Identifies permanent shocks to productivity and demographic trends affecting trend growth.',
    citation: 'Lubik, T. A., & Matthes, C. (2016). Time-varying parameter vector autoregressions: Specification and estimation. Richmond Fed.',
    url: 'https://www.richmondfed.org/'
  },
  {
    id: 'jorda-taylor',
    name: 'Jordà-Taylor Financial Crisis Model',
    acronym: 'JT',
    institution: 'Federal Reserve Bank of San Francisco / Academic',
    estimateRange: '1.15% – 1.80%',
    methodologyType: 'Local Projections',
    summary: 'Applies local projection econometric estimators across 150 years of macroeconomic history to evaluate the dragging effects of debt overhang on natural rates.',
    keyEquationOrMechanism: 'Non-parametric impulse response estimation following systemic financial shocks.',
    citation: 'Jordà, Ò., & Taylor, A. M. (2019). The rate of return on everything, 1870–2015. Quarterly Journal of Economics.',
    url: 'https://www.frbsf.org/'
  },
  {
    id: 'bbp',
    name: 'Brand-Bielecki-Penalver Global Model',
    acronym: 'BBP',
    institution: 'Eurosystem / Federal Reserve Board',
    estimateRange: '1.25% – 1.85%',
    methodologyType: 'Semi-Structural',
    summary: 'A multi-country Bayesian structural model accounting for global savings gluts, demographic aging, and capital scarcity.',
    keyEquationOrMechanism: 'Cross-border spillover estimation of natural rates across advanced economies.',
    citation: 'Brand, C., Bielecki, M., & Penalver, A. (2018). The natural rate of interest: estimates, drivers, and policy challenges. ECB Occasional Paper.',
    url: 'https://www.ecb.europa.eu/'
  },
  {
    id: 'pescatori-turunen',
    name: 'Pescatori-Turunen Growth & Potential Model',
    acronym: 'PT',
    institution: 'International Monetary Fund / Federal Reserve Board',
    estimateRange: '1.10% – 1.55%',
    methodologyType: 'Semi-Structural',
    summary: 'Focuses on the interplay between potential output growth, labor force participation, and total factor productivity (TFP) trends.',
    keyEquationOrMechanism: 'Production function decomposition linking TFP growth directly to equilibrium real rates.',
    citation: 'Pescatori, A., & Turunen, J. (2016). Lower for longer: Neutral rates in the United States. IMF Working Papers.',
    url: 'https://www.imf.org/'
  },
  {
    id: 'fort',
    name: 'Fuhrer-Olivei-Rosengren-Tootell (FORT) Model',
    acronym: 'FORT',
    institution: 'Federal Reserve Bank of Boston',
    estimateRange: '1.15% – 1.75%',
    methodologyType: 'DSGE General Equilibrium',
    summary: 'Boston Fed general equilibrium model featuring sticky wages, sticky prices, and imperfect financial market pass-through.',
    keyEquationOrMechanism: 'Optimizing agents with staggered wage and price contracts determining medium-run equilibrium.',
    citation: 'Fuhrer, J., Olivei, G., Rosengren, E., & Tootell, G. (2018). Should the Fed regularly adjust its monetary policy framework? Boston Fed.',
    url: 'https://www.bostonfed.org/'
  }
];
