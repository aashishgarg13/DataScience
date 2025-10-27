# 📊 DataScience Learning Hub

Welcome to a comprehensive collection of educational web projects for learning data science! This repository contains multiple interactive courses and resources covering statistics, machine learning, visualization, mathematics, and feature engineering.

## 🎯 Live Demos

Visit our courses directly in your browser:

- [📈 Interactive Statistics Course](https://aashishgarg13.github.io/DataScience/complete-statistics/)
- [🤖 Machine Learning Guide](https://aashishgarg13.github.io/DataScience/ml_complete-all-topics/)
- [📊 Data Visualization](https://aashishgarg13.github.io/DataScience/Visualization/)
- [🔢 Mathematics for Data Science](https://aashishgarg13.github.io/DataScience/math-ds-complete/)
- [⚙️ Feature Engineering Guide](https://aashishgarg13.github.io/DataScience/feature-engineering/)

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

> 💡 Both projects are pure static websites - no server needed! Open directly in your browser or use a simple static server.

## 🚀 Quick Start

### Option A: View Online
Visit our GitHub Pages hosted versions:
1. [Statistics Course](https://aashishgarg13.github.io/DataScience/complete-statistics/)
2. [Machine Learning Guide](https://aashishgarg13.github.io/DataScience/ml_complete-all-topics/)

### Option B: Run Locally (Recommended for Development)

#### Simple Browser Opening:
1. Clone this repository
2. Navigate to either project folder
3. Double-click `index.html`

#### Using Local Server (Recommended to avoid CORS issues):

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

## 📁 Project Structure

### Statistics Course
```
complete-statistics/
├── index.html  # Main course interface
├── style.css   # Course styling
└── app.js      # Interactive visualizations
```

### Machine Learning Guide
```
ml_complete-all-topics/
├── index.html  # Main guide interface
├── style.css   # Guide styling
└── app.js      # Interactive components
```

### Data Visualization
```
Visualization/
├── index.html  # Visualization examples
├── style.css   # Visualization styling
└── app.js      # Interactive charts
```

### Mathematics for Data Science
```
math-ds-complete/
├── index.html  # Mathematics course interface
├── style.css   # Course styling
└── app.js      # Interactive math demonstrations
```

### Feature Engineering Guide
```
feature-engineering/
├── index.html  # Feature engineering guide
├── style.css   # Guide styling
└── app.js      # Interactive examples
```

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
