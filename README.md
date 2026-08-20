# reloscore

**▶ Live demo: [knikolaj.github.io/reloscore](https://knikolaj.github.io/reloscore/)**

An interactive, self-hosted decision matrix for choosing **where to live** —
scored as `[city, country]`, not just a country. You set the weights, rate each
city, and it ranks them, draws a radar comparison, and keeps a reference tab of
residency / permanent-residence tracks per country.

It's a single static page — no build step, no server, no accounts. Your edits
are saved in your browser, and you can export/import them as a JSON file.

## Use it

**Option A — just open it.** Download the repo and double-click `index.html`.

**Option B — host your own copy (free).** Fork this repo, then in
**Settings → Pages** set the source to the `main` branch. Your copy goes live at
`https://<your-username>.github.io/reloscore/`.

## What's in it

- **Ranking** — cities ordered by score, with a radar chart. Click a city to
  toggle it on the radar; click axes/blocks are colour-coded by category.
- **Matrix** — the full table: a weight per criterion (0–10), a per-city rating
  (1–5, or Yes/No), and optional hard thresholds. Click **i** on any criterion
  for its 1/3/5 rubric.
- **PR tracks** — a reference table of residence → permanent-residence routes per
  country (time, income, language, max. absence). Click a country for details.

## How scoring works

```
score = Σ (weight × rating/5)   →  normalized to 100
```

- **Weight** (0–10) — how much a criterion matters to you.
- **Rating** (1–5) — how a given city does on it. Binary criteria are Yes/No.
- **Threshold** — an optional hard floor. If a city rates *below* the threshold
  on that criterion, it's **excluded** entirely (non-compensable) — useful for
  deal-breakers a high score elsewhere shouldn't paper over.

Ranking answers *"where would I want to live"*, not *"where can I realistically
get status"* — the legal side lives in the separate **PR tracks** tab.

## Make it yours

Everything editable lives in **`data.js`** — criteria, weights, cities, ratings,
and the PR-tracks reference. The engine (`index.html`) never needs touching. The
file is commented; the shape is:

```js
// a criterion
{ id:"clim", name:"Climate", lvl:"city", wt:5,
  r:["what a 5 looks like", "a 3", "a 1"] }

// a city — ratings are in the order of the K array in data.js
mk("Lisbon", "Portugal", true, [3,4,2,5,4,2,3,2,2,3,2,3,4,2,5,1])
```

You can also do all of it **in the browser** (add cities, change weights and
ratings) and hit **Export** to save a JSON snapshot — then **Import** it on
another device or share it with a friend. No file editing required.

## A note on the defaults

The shipped weights and ratings are **one person's priors** — a starting point,
not objective truth. Fork them and make them yours.

The **PR tracks** data was researched for 2026 and immigration rules change
often — treat it as a pointer, and verify anything you'd actually rely on with
the official source.

## License

MIT — see [LICENSE](LICENSE).
