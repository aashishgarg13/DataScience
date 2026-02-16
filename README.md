---
title: DataScience Learning Hub
emoji: 📊
colorFrom: blue
colorTo: purple
sdk: static
pinned: false
---

# 📊 DataScience Learning Hub v2.0

Welcome to a comprehensive collection of educational web projects for learning data science! This repository contains multiple interactive courses covering statistics, machine learning, deep learning, visualization, mathematics, and feature engineering.

## ✨ What's New in v2.0

- 🔍 **Global Search** - Press `Ctrl/Cmd + K` to search across all modules
- 📊 **Progress Tracking** - Track your learning journey with persistent progress
- 🌙 **Light/Dark Mode** - Toggle between themes or follow system preference
- 📱 **PWA Support** - Install as an app for offline access
- ♿ **Accessibility** - ARIA labels, keyboard navigation, skip links
- 🎨 **Unified Design System** - Consistent look and feel across all modules
- ⚡ **Performance** - Optimized loading with service worker caching

---

## 🎯 Live Demos

Visit our courses directly in your browser:

| Course | Link | Topics |
|--------|------|--------|
| 🧠 Deep Learning | [Launch](https://aashishgarg13.github.io/DataScience-v2/DeepLearning/) | 12 |
| 🤖 Machine Learning | [Launch](https://aashishgarg13.github.io/DataScience-v2/ml_complete-all-topics/) | 42 |
| 📊 Statistics | [Launch](https://aashishgarg13.github.io/DataScience-v2/complete-statistics/) | 41 |
| 📐 Mathematics | [Launch](https://aashishgarg13.github.io/DataScience-v2/math-ds-complete/) | 15 |
| ⚙️ Feature Engineering | [Launch](https://aashishgarg13.github.io/DataScience-v2/feature-engineering/) | 12 |
| 📈 Visualization | [Launch](https://aashishgarg13.github.io/DataScience-v2/Visualization/) | 8 |
| 🐍 Python | [Launch](https://aashishgarg13.github.io/DataScience-v2/Python/) | 10 |
| 💬 Prompt Engineering | [Launch](https://aashishgarg13.github.io/DataScience-v2/prompt-engineering-guide/) | 12 |

---

## 🧠 Course Overview

### Deep Learning Masterclass 🔥

**The flagship course**. Zero to Hero journey through neural networks.

**Topics include:**
- Neural Network Foundations (Architecture, Activation Functions)
- Backpropagation & Gradient Descent (with full math derivations)
- Convolutional Neural Networks (CNNs)
- Recurrent Neural Networks (RNNs, LSTMs, GRUs)
- Transformers & Attention Mechanisms
- Generative Adversarial Networks (GANs)
- Diffusion Models
- Regularization & Optimization Techniques

**Methodology:** "Paper & Pain" - rigorous mathematical derivations with step-by-step worked examples.

---

### Machine Learning Complete Guide

The foundational course covering all classical ML algorithms.

**Topics include:**
- Supervised Learning (Linear/Logistic Regression, Trees, SVMs, Ensembles)
- Unsupervised Learning (K-Means, DBSCAN, Hierarchical Clustering, PCA)
- Reinforcement Learning Fundamentals
- NLP & GenAI (Word Embeddings, Transformers, RAG)
- Model Evaluation & Selection

---

### Statistics Course

41 interactive topics covering probability and statistical inference.

**Topics include:**
- Descriptive Statistics (Mean, Median, Mode, Variance)
- Probability Distributions (Normal, Binomial, Poisson)
- Hypothesis Testing (T-test, Chi-squared, ANOVA)
- Confidence Intervals
- Bayesian Statistics

---

### Mathematics for Data Science

The engine room of AI and ML.

**Topics include:**
- Linear Algebra (Vectors, Matrices, Eigenvalues)
- Calculus (Derivatives, Gradients, Chain Rule)
- Probability Theory
- Optimization

---

### Feature Engineering Guide

The art of data preparation.

**Topics include:**
- Data Cleaning & Missing Values
- Feature Scaling & Normalization
- Encoding Categorical Variables
- Feature Selection & Dimensionality Reduction

---

### Data Visualization

Communicating insights effectively.

**Topics include:**
- Matplotlib Fundamentals
- Seaborn Statistical Visualizations
- Plotly Interactive Charts
- Best Practices for Data Storytelling

---

### Prompt Engineering Guide

Mastering LLMs and AI assistants.

**Topics include:**
- Prompt Fundamentals
- Zero-shot & Few-shot Learning
- Chain of Thought Prompting
- System Prompts & Personas
- Advanced Techniques (ReAct, ToT)

---

## 📁 Project Structure

```
DataScience-v2/
├── index.html              # Enhanced landing page
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline caching
├── offline.html            # Offline fallback
├── shared/                 # Shared resources
│   ├── css/
│   │   ├── design-system.css   # Core styles & tokens
│   │   └── components.css      # Reusable components
│   ├── js/
│   │   ├── search.js           # Global search (Cmd+K)
│   │   ├── progress.js         # Progress tracking
│   │   └── theme.js            # Theme toggle
│   └── icons/
│       └── favicon.svg
├── DeepLearning/           # Deep Learning course
├── ml_complete-all-topics/ # Machine Learning course
├── complete-statistics/    # Statistics course
├── math-ds-complete/       # Mathematics course
├── feature-engineering/    # Feature Engineering
├── Visualization/          # Data Visualization
├── prompt-engineering-guide/ # Prompt Engineering
├── ML/                     # Experiments & datasets
└── README.md               # This file
```

---

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/aashishgarg13/DataScience.git
cd DataScience-v2

# Serve locally (any of these options)
python -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000

# Open in browser
open http://localhost:8000
```

### Deploy to GitHub Pages

```bash
# Push to main branch
git add .
git commit -m "Deploy"
git push origin main

# Enable GitHub Pages in repository settings
# Settings > Pages > Source: main branch
```

### Deploy to Hugging Face Spaces

1. Create a new Space with "Static HTML" SDK
2. Push this repository:
```bash
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/DataScience
git push hf main
```

---

## 🛠️ Features

### Global Search (Ctrl/Cmd + K)

Search across all modules instantly. Uses Fuse.js for fuzzy matching.

### Progress Tracking

- Persistent localStorage-based tracking
- Per-module progress bars
- "Continue where you left off" feature
- Export/Import progress data

### Theme Toggle

- Light and Dark modes
- Respects system preference
- Smooth transitions
- Persisted choice

### PWA Support

- Install as standalone app
- Offline access to cached pages
- Background sync
- App shortcuts

### Accessibility

- Skip to main content links
- ARIA labels on interactive elements
- Keyboard navigation
- Focus indicators
- Reduced motion support

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- The Data Science and ML community
- Contributors and students worldwide
- Open source projects that made this possible

---

**Made with ❤️ by [Aashish Garg](https://github.com/aashishgarg13)**
