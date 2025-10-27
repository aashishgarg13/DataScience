# DataScience

A small collection of educational, static web projects for learning statistics and machine learning.

## Contents

- `complete-statistics/` — An interactive, browser-based Statistics course (HTML/CSS/JS). It includes 40+ topics (descriptive statistics, probability, distributions, hypothesis testing, visualizations and interactive canvases).
- `ml_complete-all-topics/` — A comprehensive Machine Learning guide with interactive demos and explanatory pages (static HTML/CSS).

There are no server-side components — each subproject is a static website you can open in a browser or serve with a simple static server.

## Quick Start (run locally)

Option A — open in your browser (double-click):

1. Navigate to the folder of the subproject you want to view (for example `complete-statistics/`).
2. Open `index.html` in your browser.

Option B — serve locally (recommended to avoid CORS/cache issues):

From the repository root, run one of the following in a terminal:

```bash
# Python 3 (simple static server, available on macOS):
python3 -m http.server 8000

# or using Node.js http-server (if installed):
npx http-server -c-1 . 8000
```

Then open http://localhost:8000/complete-statistics/ or http://localhost:8000/ml_complete-all-topics/ in your browser.

## Deploy to GitHub Pages

1. Push your changes to the `main` branch on GitHub (already done for this repo).
2. In your repository settings on GitHub, go to "Pages" and select the `main` branch and root (`/`) as the source, or set the `gh-pages` branch if you prefer.
3. Save — GitHub Pages will publish the site. For multi-site repos you can add a `docs/` folder or create separate branches, or create a small repo per site.

Because these are static sites you can also host them on Netlify, Vercel, or any static host.

## Files of interest

- `complete-statistics/index.html`, `complete-statistics/style.css`, `complete-statistics/app.js` — interactive statistics lessons and canvas visualizations
- `ml_complete-all-topics/index.html` — long-form machine learning guide with examples and UI controls

## Notes about repository cleanup

While repairing the repository I removed macOS Finder metadata files (names beginning with `._`) that had been added inside the `.git` metadata and working tree. Those `._*` files are resource-fork metadata and are not project code. A `.gitignore` entry was added to ignore these moving forward:

```
._*
.DS_Store
>__MACOSX/
```

If you want to inspect any backup I created of the original `.git`, look for directories named `.git.broken_<timestamp>` in the repository root — they contain the backed-up git metadata.

## Contributing

If you'd like me to expand this README with:

- per-subproject detailed run instructions and screenshots
- short descriptions of each interactive demo and what files to edit
- automated preview script to open both sites in the browser

Tell me which of the above you want and I will add it.

## License

Use or adapt however you like (no license file present; if you want one, tell me which license and I'll add it).
