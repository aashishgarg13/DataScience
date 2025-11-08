# 📊 DataScience Learning Hub

Welcome — a small collection of interactive, static web projects for learning statistics, machine learning, visualization and maths. Each project is a standalone static site you can open directly in the browser or serve with a tiny static server.

## 🎯 Quick access (deployed + local)

Below are direct links you can use after deploying the repository to GitHub Pages (or any static host). Each also shows the local/relative path you can use while previewing from the repo root.

GitHub Pages base: https://aashishgarg13.github.io/DataScience/

- 📈 Interactive Statistics Course — Deployed: https://aashishgarg13.github.io/DataScience/complete-statistics/  | Local: `complete-statistics/`
- 🤖 Machine Learning Guide — Deployed: https://aashishgarg13.github.io/DataScience/ml_complete-all-topics/  | Local: `ml_complete-all-topics/`
- 📊 Data Visualization — Deployed: https://aashishgarg13.github.io/DataScience/Visualization/  | Local: `Visualization/`
- 🔢 Mathematics for Data Science — Deployed: https://aashishgarg13.github.io/DataScience/math-ds-complete/  | Local: `math-ds-complete/`
- ⚙️ Feature Engineering Guide — Deployed: https://aashishgarg13.github.io/DataScience/feature-engineering/  | Local: `feature-engineering/`
- [🤔 Prompt Engineering Guide](https://aashishgarg13.github.io/DataScience/prompt-engineering-guide/) - Interactive AI prompting course

## 🔗 Prompt Engineering Resources

Essential resources for mastering AI prompt engineering:

- [Learn Prompting](https://learnprompting.org/) - Comprehensive interactive guide
- [Prompt Engineering Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) - Community-maintained resource
- [Anthropic's Claude Guide](https://www.anthropic.com/index/constitutional-ai-the-basics) - Advanced prompting techniques
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering) - Official guidelines

## 📚 Contents

### 📈 Complete Statistics Course
- **Location:** `complete-statistics/`
- **Features:**
  - 40+ Interactive Topics
  - Descriptive Statistics
  - Probability & Distributions
  - Hypothesis Testing
  - Interactive Visualizations & Canvas
  - Hands-on Learning Experience

### 🤖 Machine Learning Guide
- **Location:** `ml_complete-all-topics/`
- **Features:**
  - Comprehensive ML Topics
  - Interactive Demonstrations
  - Visual Learning Aids
  - Step-by-Step Explanations

### 📊 Data Visualization
- **Location:** `Visualization/`
- **Features:**
  - Interactive Data Visualization Examples
  - Chart Types and Best Practices
  - Dynamic Visualization Techniques
  - Data Presentation Guidelines

### 🔢 Mathematics for Data Science
- **Location:** `math-ds-complete/`
- **Features:**
  - Linear Algebra Fundamentals
  - Calculus for Machine Learning
  - Statistical Mathematics
  - Optimization Theory

### ⚙️ Feature Engineering Guide
- **Location:** `feature-engineering/`
- **Features:**
  - Data Preprocessing Techniques
  - Feature Selection Methods
  - Feature Transformation
  - Dimensionality Reduction

> 💡 All projects are pure static websites - no server needed! Open directly in your browser or use a simple static server.

## 🔄 Auto-Update & Integration

The repository supports automatic updates for:
- New AI prompting techniques and best practices
- Interactive visualization improvements
- Additional learning resources and examples
- Community contributions and fixes

## 🚀 Try locally (quick)

Option A — open a project's `index.html` directly from Finder (double-click the file). Some interactive features are more reliable when served via HTTP.

Option B — serve the repo root with a tiny static server (recommended):

```bash
# from repository root
python3 -m http.server 8000

# then open one of these in your browser (example):
http://localhost:8000/complete-statistics/
http://localhost:8000/ml_complete-all-topics/
http://localhost:8000/Visualization/
http://localhost:8000/math-ds-complete/
http://localhost:8000/feature-engineering/
```

Tip: Using a local server avoids browser file:// restrictions (CORS, modules, etc.) and ensures the JS visualizations behave the same as on a real host.

## 📦 Deploy (GitHub Pages)

1. Push `main` to GitHub.
2. In the repo on GitHub → Settings → Pages, set the Source to the `main` branch and the folder to `/ (root)`.
3. Save and wait a few minutes; your projects will be available under:

`https://<your-username>.github.io/DataScience/<folder>/` (for example the links above).

Note: these projects use relative paths for assets (`style.css`, `app.js`), so they work correctly when served from a subpath such as `/DataScience/complete-statistics/`.

## 📁 Project structure (example)

complete-statistics/
- `index.html` — main course interface
- `style.css`
- `app.js`

ml_complete-all-topics/
- `index.html` — machine learning guide
- `style.css`
- `app.js`

Visualization/
- `index.html` — visualization examples
- `style.css`
- `app.js`

math-ds-complete/
- `index.html` — mathematics for data science
- `style.css`
- `app.js`

feature-engineering/
- `index.html` — feature engineering notes and demos
- `style.css`
- `app.js`

## Notes about repository cleanup

While repairing the repository I removed macOS Finder metadata files (names beginning with `._`) that had been added inside the `.git` metadata and working tree. Those `._*` files are resource-fork metadata and are not project code. A `.gitignore` entry was added to ignore these moving forward:

```
._*
.DS_Store
>__MACOSX/
```

If you want to inspect any backup I created of the original `.git`, look for directories named `.git.broken_<timestamp>` in the repository root — they contain the backed-up git metadata.

## 🤝 Contributing & improvements

Helpful things you can do:

- Add screenshots or small thumbnails for each project folder (I can add these if you provide images).
- Add a `CONTRIBUTING.md` if you want contribution rules or a PR checklist.
- Add an automated `scripts/verify_assets.py` that checks every `href/src` referenced by `index.html` files and reports missing assets — I can add this for you.

Tell me which of these you'd like and I'll implement it.

2. **Technical Enhancements**
   - Optimize JavaScript performance
   - Add responsive design features
   - Improve accessibility
   - Create new interactive components

3. **Documentation**
   - Add topic descriptions
   - Create usage examples
   - Write tutorial content
   - Share prompt templates

Please check our [contribution guidelines](CONTRIBUTING.md) for detailed instructions.

## License

Use or adapt however you like (no license file present; if you want one, tell me which license and I'll add it).
