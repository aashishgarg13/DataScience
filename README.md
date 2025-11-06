# 📊 DataScience Learning Hub

Welcome — a single repo that hosts several static, interactive learning resources for data science. Everything here is pure HTML/CSS/JS and works either by opening the `index.html` files in your browser or by serving the repo with a simple static server.

## 🎯 Live demos (GitHub Pages)

Open the projects directly (after you enable GitHub Pages for the repo):

- 📈 Interactive Statistics Course — https://aashishgarg13.github.io/DataScience/complete-statistics/
- 🤖 Machine Learning Guide — https://aashishgarg13.github.io/DataScience/ml_complete-all-topics/
- 📊 Data Visualization — https://aashishgarg13.github.io/DataScience/Visualization/
- 🔢 Mathematics for Data Science — https://aashishgarg13.github.io/DataScience/math-ds-complete/
- ⚙️ Feature Engineering Guide — https://aashishgarg13.github.io/DataScience/feature-engineering/

If you want me to set up a small demo page that lists these and includes thumbnails, I can add it.

## 🔗 Prompt engineering resources

This repo focuses on data science, but many workflows now rely on well-crafted prompts. Useful prompt-engineering references:

- Learn Prompting (interactive guide): https://learnprompting.org/
- Prompt Engineering Guide (community-maintained): https://github.com/dair-ai/Prompt-Engineering-Guide

Add one of these links to your docs or course materials where you introduce LLMs and prompts.

---

## 📚 What’s inside (folders)

Each folder contains a standalone static site (open `index.html`). Brief overview:

- `complete-statistics/` — Interactive Statistics Course (40+ topics, visualizations, canvas demos).
- `ml_complete-all-topics/` — Large Mathematics / ML / Statistics learning platform (125+ topics across subjects; uses many canvas visualizations and interactive examples).
- `Visualization/` — Data visualization examples and interactive charts.
- `math-ds-complete/` — Mathematics for data science: linear algebra, calculus, optimization.
- `feature-engineering/` — Feature engineering notes and interactive examples.

All folders are static. No server-side code.

## 🚀 Quick start — view locally

Option 1 — open file directly:

1. In Finder or your OS file manager, double-click the folder you want and open `index.html`.

Option 2 — run a local static server (recommended):

```bash
# from repository root
python3 -m http.server 8000

# then open one of:
http://localhost:8000/complete-statistics/
http://localhost:8000/ml_complete-all-topics/
http://localhost:8000/Visualization/
http://localhost:8000/math-ds-complete/
http://localhost:8000/feature-engineering/
```

Tip: using a local server avoids some browser restrictions (CORS, file:// quirks) and provides consistent behaviour for the JS visualizations.

## ✅ Local file checks I ran

- Verified `ml_complete-all-topics/` contains `index.html`, `style.css`, and `app.js` (these are referenced by the page).
- No external CDN dependencies are required by the core sites (the pages use local CSS/JS and canvas APIs).
- No image assets referenced directly inside `ml_complete-all-topics/index.html` (no missing .png/.jpg/.svg references found).

If you'd like, I can add a tiny verification script (Python) that scans each `index.html` for href/src and confirms the referenced files exist.

## 📁 Project file layout (example)

complete-statistics/
├── index.html
├── style.css
└── app.js

ml_complete-all-topics/
├── index.html
├── style.css
└── app.js

Visualization/
├── index.html
├── style.css
└── app.js

math-ds-complete/
├── index.html
├── style.css
└── app.js

feature-engineering/
├── index.html
├── style.css
└── app.js

## ⚙️ Deploying (GitHub Pages)

1. Push the `main` branch to GitHub (already done for this repo).
2. In the repository on GitHub -> Settings -> Pages, set the source to `main` branch and `/ (root)` or use `docs/` if you prefer.
3. Wait a few minutes; the site will be available at `https://<username>.github.io/<repo>/` (e.g. the links at the top of this README).

Note: the sites use relative paths (`style.css`, `app.js`), so they work fine when served from a subpath such as `/DataScience/complete-statistics/`.

## 🧹 Notes about cleanup

During repo cleanup I removed macOS Finder resource files (`._*`) and added a `.gitignore` entry to prevent them from being re-added. Example entries:

```
._*
.DS_Store
__MACOSX/
```

If you see `.git.broken_<timestamp>` directories, they contain backups of previous `.git` metadata.

## 🙋 Next steps (I can help)

- Add screenshots/thumbnails to the README and to each project folder.
- Add an automated verification script that scans all `index.html` files and confirms local assets exist. I can create a small `scripts/verify_assets.py`.
- Split very long single-page projects into per-topic pages (if you want better maintainability).
- Add a small 'demo index' page that lists live links and embeds screenshots.

Tell me which of the above you'd like and I'll implement it.

## Contributing

PRs, suggestions and fixes welcome. If you want me to add more documentation for a folder (detailed topic list, how-to-edit, or tests), say which folder and I'll add it.

## License

No license file is included. If you'd like one (MIT, Apache-2.0, CC BY, etc.), tell me and I will add it.

