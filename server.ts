/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { defaultHistoricalData } from "./src/data/historicalData.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Memory cache to hold FRED data or custom simulation data
let macroDataStore = [...defaultHistoricalData];

// 1. Get Macro Data
app.get("/api/data", (req, res) => {
  res.json({
    data: macroDataStore,
    hasFredKey: !!process.env.FRED_API_KEY,
    hasGeminiKey: !!process.env.GEMINI_API_KEY
  });
});

// 2. Fetch/Refresh real data from FRED if API key is present
app.post("/api/fred/refresh", async (req, res) => {
  const fredKey = process.env.FRED_API_KEY || req.body.fredApiKey;
  
  if (!fredKey) {
    return res.status(400).json({
      error: "FRED API Key is required. Please set FRED_API_KEY in your Secrets panel or provide it in the request."
    });
  }

  try {
    // Helper to fetch FRED series
    const fetchFredSeries = async (seriesId: string) => {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${fredKey}&file_type=json`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`FRED API returned status ${response.status} for series ${seriesId}`);
      }
      const json = await response.json();
      return json.observations || [];
    };

    // Fetch three key economic series from FRED
    // FEDFUNDS: Effective Federal Funds Rate (Monthly)
    // REAINTRATREARAT10Y: Natural Rate of Interest (Quarterly, HLW 10-Year model)
    // CPILFESL: Core CPI (Monthly, Index value)
    console.log("Fetching series from FRED...");
    const [fedfundsObs, rstarObs, coreCpiObs] = await Promise.all([
      fetchFredSeries("FEDFUNDS"),
      fetchFredSeries("REAINTRATREARAT10Y"),
      fetchFredSeries("CPILFESL")
    ]);

    // Parse and map FRED observations by YYYY-MM
    const effrMap = new Map<string, number>();
    const rstarMap = new Map<string, number>();
    const cpiIndexMap = new Map<string, number>();

    fedfundsObs.forEach((o: any) => {
      const val = parseFloat(o.value);
      if (!isNaN(val) && o.date) {
        effrMap.set(o.date.substring(0, 7), val);
      }
    });

    rstarObs.forEach((o: any) => {
      const val = parseFloat(o.value);
      if (!isNaN(val) && o.date) {
        rstarMap.set(o.date.substring(0, 7), val);
      }
    });

    coreCpiObs.forEach((o: any) => {
      const val = parseFloat(o.value);
      if (!isNaN(val) && o.date) {
        cpiIndexMap.set(o.date.substring(0, 7), val);
      }
    });

    // Calculate YoY Inflation and compile everything starting from 2000-01-01
    const combinedData: any[] = [];
    const keys = Array.from(effrMap.keys()).sort();
    
    // Find r* values with forward-fill for quarterly gaps
    let lastKnownRStar = 2.0; // Fallback starter

    keys.forEach((yearMonth) => {
      const dateParts = yearMonth.split("-");
      const year = parseInt(dateParts[0]);
      if (year < 2000 || year > 2026) return; // Keep standard bounds for comparison

      const fullDate = `${yearMonth}-01`;
      const effr = effrMap.get(yearMonth) ?? 0;

      // Forward-fill quarterly r*
      const rStarVal = rstarMap.get(yearMonth);
      if (rStarVal !== undefined) {
        lastKnownRStar = rStarVal;
      }
      const rStar = lastKnownRStar;

      // Calculate Core Inflation YoY: (CPI_t - CPI_{t-12}) / CPI_{t-12} * 100
      let coreInflation = 2.0; // Fallback
      const currentCPI = cpiIndexMap.get(yearMonth);
      
      const prevYear = year - 1;
      const prevYearMonth = `${prevYear}-${dateParts[1]}`;
      const prevCPI = cpiIndexMap.get(prevYearMonth);

      if (currentCPI !== undefined && prevCPI !== undefined && prevCPI > 0) {
        coreInflation = parseFloat(((currentCPI - prevCPI) / prevCPI * 100).toFixed(2));
      }

      const fisherNeutral = parseFloat((rStar + coreInflation).toFixed(2));
      const spread = parseFloat((effr - fisherNeutral).toFixed(2));
      
      let stance: 'Accommodative' | 'Restrictive' | 'Neutral' = 'Neutral';
      if (spread > 0.05) {
        stance = 'Restrictive';
      } else if (spread < -0.05) {
        stance = 'Accommodative';
      }

      combinedData.push({
        date: fullDate,
        effr,
        rStar,
        coreInflation,
        fisherNeutral,
        spread,
        stance
      });
    });

    if (combinedData.length > 0) {
      macroDataStore = combinedData;
      return res.json({
        success: true,
        message: `Successfully ingested and calculated ${combinedData.length} records from FRED API!`,
        data: combinedData
      });
    } else {
      throw new Error("No overlapping data found starting from 2000.");
    }

  } catch (error: any) {
    console.error("FRED Fetch Error:", error);
    res.status(500).json({
      error: "Failed to fetch/calculate indicators from FRED API",
      details: error.message
    });
  }
});

// 3. Reset/Restore Data
app.post("/api/data/reset", (req, res) => {
  macroDataStore = [...defaultHistoricalData];
  res.json({ success: true, message: "Restored built-in historical data successfully.", data: macroDataStore });
});

// 4. Update/Override single data point (for custom scenarios/interactivity)
app.post("/api/data/override", (req, res) => {
  const { date, effr, rStar, coreInflation } = req.body;
  if (!date) return res.status(400).json({ error: "Date is required." });

  const idx = macroDataStore.findIndex(d => d.date === date);
  
  const updatedPoint = {
    date,
    effr: parseFloat(effr),
    rStar: parseFloat(rStar),
    coreInflation: parseFloat(coreInflation),
    fisherNeutral: parseFloat((parseFloat(rStar) + parseFloat(coreInflation)).toFixed(2)),
    spread: parseFloat((parseFloat(effr) - (parseFloat(rStar) + parseFloat(coreInflation))).toFixed(2)),
    stance: 'Neutral' as 'Accommodative' | 'Restrictive' | 'Neutral'
  };

  if (updatedPoint.spread > 0.05) {
    updatedPoint.stance = 'Restrictive';
  } else if (updatedPoint.spread < -0.05) {
    updatedPoint.stance = 'Accommodative';
  }

  if (idx !== -1) {
    macroDataStore[idx] = updatedPoint;
  } else {
    macroDataStore.push(updatedPoint);
    macroDataStore.sort((a, b) => a.date.localeCompare(b.date));
  }

  res.json({ success: true, message: "Scenario updated.", data: macroDataStore });
});

// Helper function to generate high-fidelity local macroeconomic commentary as a fallback
function generateLocalFallbackAnalysis(selectedPoint: any, fullTrendSummary: any) {
  const date = selectedPoint.date || "the selected period";
  const effr = selectedPoint.effr !== undefined ? `${selectedPoint.effr}%` : "the policy rate";
  const rStar = selectedPoint.rStar !== undefined ? `${selectedPoint.rStar}%` : "the natural rate";
  const coreInflation = selectedPoint.coreInflation !== undefined ? `${selectedPoint.coreInflation}%` : "the core inflation rate";
  const fisherNeutral = selectedPoint.fisherNeutral !== undefined ? `${selectedPoint.fisherNeutral}%` : "the neutral rate";
  const spread = selectedPoint.spread !== undefined ? `${selectedPoint.spread > 0 ? '+' : ''}${selectedPoint.spread}%` : "the policy spread";
  const stance = selectedPoint.stance || "Neutral";

  const totalMonths = fullTrendSummary ? fullTrendSummary.totalMonths : 318;
  const restrictiveMonths = fullTrendSummary ? fullTrendSummary.restrictiveMonths : 105;
  const accommodativeMonths = fullTrendSummary ? fullTrendSummary.accommodativeMonths : 185;

  let p1 = "";
  let p2 = "";
  let p3 = "";
  let sentiment = "neutral";
  let recommendation = "";

  if (stance === 'Restrictive') {
    sentiment = "hawkish";
    p1 = `During ${date}, the Federal Reserve's policy stance registered as distinctly Restrictive, with the Effective Fed Funds Rate (EFFR) of ${effr} hovering above the Fisher Neutral Boundary of ${fisherNeutral} (r* of ${rStar} plus Core Inflation of ${coreInflation}). This policy spread of ${spread} reflects a deliberate central bank strategy to cool economic activity and curb demand-side pressures. Viewed against a broader historical context where the Fed spent ${restrictiveMonths} months in restrictive territory out of ${totalMonths} months on record, this posture demonstrates a disciplined commitment to policy normalization. To steer the economy toward a non-disruptive 'soft landing', the Federal Reserve must carefully balance the lag effects of these high rates against the pace of disinflation, ensuring that the restrictive stance does not trigger a premature cyclical contraction.`;
    p2 = `For the commercial banking sector, this restrictive stance poses distinct challenges and opportunities. The elevated EFFR alters the liability side of bank balance sheets, driving up the cost of interest-bearing deposits and putting pressure on Net Interest Margins (NIM) as the yield curve remains flat or inverted. In response, commercial lending institutions have tightened underwriting standards, demanding higher credit risk premiums and displaying greater selectivity in credit risk pricing. Commercial and industrial loan volume typically slows under these conditions as corporate borrowers face increased refinancing hurdles. Bankers must actively manage asset-liability mismatches, optimizing loan-to-deposit ratios and hedging against potential portfolio depreciation to preserve equity capital in a high-rate regime.`;
    p3 = `Regarding the labor market and long-term price stability, the restrictive rate structure works to cool wage-push inflation by aligning labor demand with available supply. While wage growth has shown signs of moderation, gains must be accompanied by corresponding labor productivity improvements to prevent a wage-price spiral. Anchoring long-term inflation expectations remains a vital priority for the Federal Reserve; a credible commitment to a restrictive stance helps solidify public confidence that inflation will return to target. As labor market vacancy-to-unemployed ratios normalize, the risk of structural inflation embedding itself decreases, ensuring that the real purchasing power of consumer incomes is preserved over the policy cycle.`;
    recommendation = "Prioritize high-liquidity assets, tighten commercial lending underwriting criteria, and favor high-quality corporate bonds to mitigate credit risk during policy restriction.";
  } else if (stance === 'Accommodative') {
    sentiment = "dovish";
    p1 = `During ${date}, the Federal Reserve maintained a highly Accommodative policy stance, positioning the Effective Fed Funds Rate (EFFR) at ${effr}, significantly below the calculated Fisher Neutral Boundary of ${fisherNeutral} (r* of ${rStar} plus Core Inflation of ${coreInflation}). The resulting negative policy spread of ${spread} illustrates an expansionary posture designed to support economic growth, inject liquidity, and guard against downside growth risks. This accommodative stance, which fits within the ${accommodativeMonths} months of historical accommodation out of the total ${totalMonths} months on record, highlights the Fed's responsive pivot to bolster macroeconomic activity. As policymakers pursue an orderly normalization trajectory, they face the delicate challenge of maintaining credit flow while preventing the accumulation of speculative imbalances that could destabilize long-term price stability.`;
    p2 = `In an accommodative environment, the banking sector experiences a boost in credit demand as low policy rates lower the hurdle rate for commercial and industrial loans. Net Interest Margins (NIM) may initially expand or stabilize as banks enjoy low funding costs on short-term deposits, though a persistently flat, low-yield curve can eventually compress long-term interest margins. Credit risk pricing becomes more aggressive, with commercial banks loosening lending criteria and actively competing for high-quality middle-market borrowers. While this accelerates asset growth and fee-income generation, risk officers must remain vigilant against underpricing credit risk. The abundance of cheap capital encourages leverage, meaning commercial bankers must prioritize credit quality and stress-test loan books against future interest rate hikes.`;
    p3 = `Under accommodative conditions, the labor market typically operates at or near full employment, which can drive up wage growth as businesses compete for scarce labor. To prevent wage-push inflation from translating into persistent consumer price increases, wage gains must be backed by solid gains in labor productivity. The Fed's primary objective during accommodative cycles is to catalyze employment without allowing long-term inflation expectations to become unanchored. Continuous monitoring of consumer sentiment and inflation breakeven rates is required to ensure that the stimulative policy does not inadvertently bake high inflation expectations into corporate and consumer planning.`;
    recommendation = "Extend asset portfolio duration, selectively increase exposure to high-yield credit, and actively originate commercial loans to capitalize on low funding costs.";
  } else {
    sentiment = "neutral";
    p1 = `In ${date}, the Federal Reserve's policy was balanced near neutral, with the Effective Fed Funds Rate (EFFR) of ${effr} aligning closely with the Fisher Neutral Boundary of ${fisherNeutral} (representing r* of ${rStar} and Core Inflation of ${coreInflation}). This narrow policy spread of ${spread} reflects an equilibrium setting where monetary policy is neither actively constraining nor expanding the economic engine. Placed in the context of our historical trajectory across ${totalMonths} months, this neutral stance serves as an inflection point for monetary policy normalization. By aligning policy rates with the natural rate plus inflation, the Federal Reserve seeks to anchor the economy in a sustainable soft-landing pattern, allowing organic market dynamics to dictate growth without heavy-handed central bank intervention.`;
    p2 = `With policy rates set at neutral, the commercial banking sector benefits from a more predictable interest rate environment, which helps stabilize yield curve dynamics and support a steady Net Interest Margin (NIM). Short-term funding costs and asset yields converge toward sustainable spreads, reducing the volatility associated with sudden policy shifts. Underwriting standards remain balanced, with lenders pricing credit risk based on standard microeconomic fundamentals rather than macro-driven emergency parameters. This environment fosters a healthy credit transmission mechanism, allowing banks to support corporate investments without the distortions of aggressive policy easing or the borrowing friction of excessive policy restriction.`;
    p3 = `In the labor market, a neutral policy setting allows employment to expand in tandem with the economy's natural rate of growth, minimizing the risk of labor market overheating or severe labor demand contraction. Wage growth tends to align closely with labor productivity gains, creating a sustainable non-inflationary path for household incomes. This stability is critical for keeping long-term inflation expectations firmly anchored. With inflation expectations stabilized and the policy rate aligned with structural neutrals, the Federal Reserve achieves its dual mandate, setting the stage for steady, non-inflationary economic expansion.`;
    recommendation = "Maintain a balanced asset-liability duration posture and focus on micro-level credit fundamentals rather than macro-driven interest rate bets.";
  }

  return {
    analysis: `${p1}\n\n${p2}\n\n${p3}`,
    sentiment,
    recommendation,
    isLocalFallback: true
  };
}

// 5. Generate AI Macro Insights using Gemini
app.post("/api/gemini/analysis", async (req, res) => {
  const { selectedPoint, fullTrendSummary } = req.body;

  if (!selectedPoint) {
    return res.status(400).json({ error: "Selected data point is required for analysis." });
  }

  // If Gemini client is not configured, fall back to high-fidelity local macro engine immediately
  if (!ai) {
    console.warn("Gemini client not initialized. Using high-fidelity local fallback engine.");
    const fallbackResponse = generateLocalFallbackAnalysis(selectedPoint, fullTrendSummary);
    return res.json(fallbackResponse);
  }

  const prompt = `
You are an elite Federal Reserve macroeconomic expert and financial market strategist.
Provide an ultra-high-quality, highly professional, and visually engaging institutional-grade analysis of the Federal Reserve's monetary policy stance for the following snapshot:

--- SNAPSHOT ---
Date: ${selectedPoint.date}
Effective Federal Funds Rate (EFFR): ${selectedPoint.effr}%
Natural Rate of Interest (r*): ${selectedPoint.rStar}%
Core Inflation Rate: ${selectedPoint.coreInflation}%
Fisher Neutral Boundary (r* + Core Inflation): ${selectedPoint.fisherNeutral}%
Policy Spread (EFFR - Fisher Neutral): ${selectedPoint.spread}%
Fisher Stance Condition: ${selectedPoint.stance}

--- GLOBAL CONTEXT ---
${fullTrendSummary ? `Current trends highlight that out of ${fullTrendSummary.totalMonths} months on record, the Federal Reserve spent ${fullTrendSummary.restrictiveMonths} months in a Restrictive stance and ${fullTrendSummary.accommodativeMonths} months in an Accommodative stance.` : ''}

You MUST follow these strict formatting and density requirements to write a masterpiece of financial commentary:
1. Provide exactly 3 highly detailed, sophisticated paragraphs in the "analysis" field (approx. 350-450 words total).
2. Paragraph 1 MUST evaluate the policy alignment/divergence relative to the Fisher Neutral Boundary, placing the current stance in historical context (referencing the global months metrics) and commenting on central bank policy normalization and soft-landing trajectories.
3. Paragraph 2 MUST explicitly address the banking sector, Net Interest Margin (NIM) compression, commercial lending criteria, credit risk pricing, and yield curve dynamics.
4. Paragraph 3 MUST address the labor market equilibrium, wage-push inflation vs. productivity gains, and the anchoring of long-term inflation expectations.
5. Do NOT summarize or shorten this. Make it dense, articulate, and authoritative in Wall Street style.

Provide your expert response as a clean JSON object containing the following keys:
- "analysis": A highly comprehensive 3-paragraph macroeconomic review following the instructions above. Use newline characters (\\n\\n) between paragraphs.
- "sentiment": Exactly "hawkish", "dovish", or "neutral" based on the stance of the selected period.
- "recommendation": A short, highly sophisticated 1-sentence action recommendation for commercial bankers/investors during this specific stance.

Return ONLY the JSON. Do not include markdown code block characters like \`\`\`json or \`\`\`. Start your response directly with the opening curly brace.
`;

  // Try calling the Gemini API with up to 2 attempts
  let lastError: any = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const textContent = response.text || "{}";
      const cleanedText = textContent.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      try {
        const parsed = JSON.parse(cleanedText);
        return res.json(parsed);
      } catch (parseErr) {
        console.warn("Failed to parse clean JSON from Gemini response, returning text wrapper", cleanedText);
        return res.json({
          analysis: cleanedText,
          sentiment: selectedPoint.stance === 'Restrictive' ? 'hawkish' : (selectedPoint.stance === 'Accommodative' ? 'dovish' : 'neutral'),
          recommendation: "Monitor Federal Reserve communications closely for policy shifts."
        });
      }
    } catch (error: any) {
      lastError = error;
      console.warn(`Gemini API Attempt ${attempt} failed with error:`, error.message);
      if (attempt < 2) {
        // Wait 300ms before retrying
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
  }

  // If both Gemini attempts fail, gracefully fall back to local high-fidelity macro analysis engine
  console.warn("Gemini API call failed after multiple attempts. Gracefully falling back to high-fidelity local macro engine.", lastError?.message);
  const fallbackResponse = generateLocalFallbackAnalysis(selectedPoint, fullTrendSummary);
  res.json(fallbackResponse);
});

// Setup Vite Dev Server / Static Asset Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fisher Stance Server running on http://localhost:${PORT}`);
  });
}

startServer();
