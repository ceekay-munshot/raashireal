# Rashi Peripherals · Peer Intelligence

A visual, comparable, **buy-side** dashboard on Rashi Peripherals (RPTECH) and its true
distribution peers — built for a peer-founder meeting. Light, colourful, chart- and
table-heavy, insight-first. No walls of text.

## The thesis it argues
In IT-product distribution **margins are near-identical for everyone (~5% gross, ~1.5–2.5%
net)** — so the game is **capital efficiency** (ROCE, cash-conversion cycle) and **product
mix**, not the P&L. Every tab is built to make that visible at a glance.

## Peer set (true peers only)
Chosen on **business model + product lines + KPI shape**, not sector labels:

| Company | Role |
|---|---|
| **Rashi Peripherals** ⭐ | the subject |
| **Redington** | main listed peer (scale + efficiency benchmark) |
| **Creative Newtech** | closest listed peer by model (mix/margin story) |
| **Compuage Infocom** | cautionary contrast — collapsed FY23–24; shown at FY22 |

Deliberately **excluded** (uploaded but not real peers): Control Print (printer maker),
D-Link (networking brand/OEM), MosChip (chip design), Nelco (satellite-comms), GNG (refurb).

## Tabs
1. **Overview** — the story, flywheel, revenue trajectory, peer snapshot
2. **Growth & Margins** — revenue, YoY growth, the margin-convergence punchline
3. **Capital Engine** — cash-conversion cycle decomposed, ROCE, the "growth eats cash" catch
4. **Peer Scorecard** — one colour-graded heatmap, who leads what
5. **Operations & Scale** — brands, channel reach, productivity per relationship
6. **Product & Whitespace** — positioning matrix + where the open space is

Compare bar (Rashi pinned, 1-vs-1 / 1-vs-all), chart⇄table toggles, and centred drill-down
modals throughout.

## Data
- **Financials:** Screener.in (paid) Excel exports → `data-raw/` (FY19–FY26 + 10 quarters).
- **Operational KPIs:** Screener "Insights" screenshots → hand-keyed into the generator.
- All derived metrics (EBITDA, ROCE, working-capital days, cash cycle) are **computed** in
  `scripts/build_dataset.py`, which writes `src/data/dataset.js`. EBITDA was reconciled
  against reported PBT to the rupee.

To regenerate the dataset after adding/updating source files:
```bash
python3 scripts/build_dataset.py
```

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
```

## Deploy (Cloudflare Pages)
- **Build command:** `npm run build`
- **Output directory:** `dist`

Vite is configured with `base: './'` so assets resolve correctly on Pages.

## Stack
React + Vite + Recharts, one hand-built CSS design system (light, warm, Rashi-brand accent).
Company colours are fixed per entity and validated colour-blind-safe.
