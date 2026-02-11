/**
 * DataScience Masterclass - Global Search
 * Keyboard shortcut: Ctrl/Cmd + K
 * Uses Fuse.js for fuzzy search
 * Version: 2.0.0
 */

(function () {
    'use strict';

    // Search index - populated on load
    let searchIndex = [];
    let fuse = null;
    let searchModal = null;
    let searchInput = null;
    let resultsContainer = null;
    let selectedIndex = -1;

    // Module definitions with their topics
    const modules = [
        {
            id: 'deep-learning',
            name: 'Deep Learning',
            path: '/DeepLearning/index.html',
            icon: '🧠',
            color: '#ff6b35',
            topics: [
                { title: 'Neural Networks Basics', section: 'nn-basics' },
                { title: 'Activation Functions', section: 'activation' },
                { title: 'Backpropagation', section: 'backprop' },
                { title: 'Optimizers (SGD, Adam)', section: 'optimizers' },
                { title: 'CNNs - Convolutional Networks', section: 'cnn' },
                { title: 'RNNs - Recurrent Networks', section: 'rnn' },
                { title: 'LSTMs', section: 'lstm' },
                { title: 'Transformers & Attention', section: 'transformers' },
                { title: 'GANs - Generative Adversarial Networks', section: 'gans' },
                { title: 'Diffusion Models', section: 'diffusion' },
                { title: 'Regularization & Dropout', section: 'regularization' },
                { title: 'Batch Normalization', section: 'batchnorm' }
            ]
        },
        {
            id: 'machine-learning',
            name: 'Machine Learning',
            path: '/ml_complete-all-topics/index.html',
            icon: '🤖',
            color: '#00d4ff',
            topics: [
                { title: 'Linear Regression', section: 'linear-regression' },
                { title: 'Polynomial Regression', section: 'polynomial-regression' },
                { title: 'Logistic Regression', section: 'logistic-regression' },
                { title: 'Gradient Descent', section: 'gradient-descent' },
                { title: 'Decision Trees', section: 'decision-trees' },
                { title: 'Random Forest', section: 'random-forest' },
                { title: 'Support Vector Machines', section: 'svm' },
                { title: 'K-Nearest Neighbors', section: 'knn' },
                { title: 'Naive Bayes', section: 'naive-bayes' },
                { title: 'K-Means Clustering', section: 'kmeans' },
                { title: 'Hierarchical Clustering', section: 'hierarchical-clustering' },
                { title: 'DBSCAN', section: 'dbscan' },
                { title: 'PCA - Principal Component Analysis', section: 'pca' },
                { title: 'XGBoost', section: 'xgboost' },
                { title: 'Ensemble Methods', section: 'ensemble-methods' },
                { title: 'Cross-Validation', section: 'cross-validation' },
                { title: 'Bias-Variance Tradeoff', section: 'bias-variance' },
                { title: 'Regularization (L1/L2)', section: 'regularization' }
            ]
        },
        {
            id: 'statistics',
            name: 'Statistics',
            path: '/complete-statistics/index.html',
            icon: '📊',
            color: '#2ecc71',
            topics: [
                { title: 'What is Statistics', section: 'topic-1' },
                { title: 'Population vs Sample', section: 'topic-2' },
                { title: 'Central Tendency (Mean, Median, Mode)', section: 'topic-5' },
                { title: 'Variance & Standard Deviation', section: 'topic-7' },
                { title: 'Normal Distribution', section: 'topic-24' },
                { title: 'Hypothesis Testing', section: 'topic-25' },
                { title: 'P-Value', section: 'topic-30' },
                { title: 'T-Test', section: 'topic-32' },
                { title: 'Chi-Squared Test', section: 'topic-35' },
                { title: 'Confidence Intervals', section: 'topic-39' },
                { title: 'Bayes Theorem', section: 'topic-18' },
                { title: 'Correlation', section: 'topic-12' }
            ]
        },
        {
            id: 'mathematics',
            name: 'Mathematics',
            path: '/math-ds-complete/index.html',
            icon: '📐',
            color: '#a371f7',
            topics: [
                { title: 'Linear Algebra Basics', section: 'linear-algebra' },
                { title: 'Vectors & Matrices', section: 'vectors' },
                { title: 'Matrix Operations', section: 'matrix-ops' },
                { title: 'Eigenvalues & Eigenvectors', section: 'eigen' },
                { title: 'Calculus - Derivatives', section: 'derivatives' },
                { title: 'Chain Rule', section: 'chain-rule' },
                { title: 'Partial Derivatives', section: 'partial' },
                { title: 'Gradient', section: 'gradient' },
                { title: 'Probability Basics', section: 'probability' }
            ]
        },
        {
            id: 'feature-engineering',
            name: 'Feature Engineering',
            path: '/feature-engineering/index.html',
            icon: '⚙️',
            color: '#ffce56',
            topics: [
                { title: 'Data Cleaning', section: 'cleaning' },
                { title: 'Missing Values', section: 'missing' },
                { title: 'Feature Scaling', section: 'scaling' },
                { title: 'Encoding Categorical Variables', section: 'encoding' },
                { title: 'Feature Selection', section: 'selection' },
                { title: 'Dimensionality Reduction', section: 'dim-reduction' }
            ]
        },
        {
            id: 'visualization',
            name: 'Visualization',
            path: '/Visualization/index.html',
            icon: '📈',
            color: '#ffce56',
            topics: [
                { title: 'Matplotlib Basics', section: 'matplotlib' },
                { title: 'Seaborn', section: 'seaborn' },
                { title: 'Plotly', section: 'plotly' },
                { title: 'Chart Types', section: 'chart-types' }
            ]
        },
        {
            id: 'prompt-engineering',
            name: 'Prompt Engineering',
            path: '/prompt-engineering-guide/index.html',
            icon: '💬',
            color: '#f771b6',
            topics: [
                { title: 'Prompt Basics', section: 'topic-1' },
                { title: 'Zero-Shot Prompting', section: 'topic-2' },
                { title: 'Few-Shot Prompting', section: 'topic-3' },
                { title: 'Chain of Thought', section: 'topic-4' },
                { title: 'System Prompts', section: 'topic-5' }
            ]
        }
    ];

    /**
     * Initialize the search system
     */
    function init() {
        buildSearchIndex();
        createSearchModal();
        initFuse();
        bindKeyboardShortcuts();
        console.log('🔍 Search initialized with', searchIndex.length, 'items');
    }

    /**
     * Build flat search index from modules
     */
    function buildSearchIndex() {
        searchIndex = [];
        modules.forEach(module => {
            // Add module itself
            searchIndex.push({
                type: 'module',
                title: module.name,
                path: module.path,
                icon: module.icon,
                color: module.color,
                keywords: module.name.toLowerCase()
            });

            // Add each topic
            module.topics.forEach(topic => {
                searchIndex.push({
                    type: 'topic',
                    title: topic.title,
                    module: module.name,
                    moduleIcon: module.icon,
                    path: module.path + '#' + topic.section,
                    color: module.color,
                    keywords: topic.title.toLowerCase() + ' ' + module.name.toLowerCase()
                });
            });
        });
    }

    /**
     * Initialize Fuse.js for fuzzy search
     */
    function initFuse() {
        // Load Fuse.js from CDN if not available
        if (typeof Fuse === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';
            script.onload = () => {
                createFuseInstance();
            };
            document.head.appendChild(script);
        } else {
            createFuseInstance();
        }
    }

    function createFuseInstance() {
        fuse = new Fuse(searchIndex, {
            keys: ['title', 'keywords', 'module'],
            threshold: 0.3,
            distance: 100,
            includeMatches: true
        });
    }

    /**
     * Create the search modal HTML
     */
    function createSearchModal() {
        const modal = document.createElement('div');
        modal.id = 'global-search-modal';
        modal.className = 'search-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Search');

        modal.innerHTML = `
            <div class="search-modal-content" role="document">
                <div class="search-modal-header">
                    <div class="search-container">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="M21 21l-4.35-4.35"></path>
                        </svg>
                        <input 
                            type="text" 
                            class="search-input" 
                            id="global-search-input"
                            placeholder="Search topics, modules..."
                            autocomplete="off"
                            spellcheck="false"
                        >
                        <span class="search-shortcut">ESC</span>
                    </div>
                </div>
                <div class="search-results" id="search-results" role="listbox">
                    <div class="search-empty">
                        <p>Start typing to search across all modules...</p>
                        <div class="search-hints">
                            <span class="search-hint">💡 Try: "gradient descent", "CNN", "hypothesis testing"</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Cache DOM references
        searchModal = modal;
        searchInput = document.getElementById('global-search-input');
        resultsContainer = document.getElementById('search-results');

        // Bind events
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeSearch();
        });

        searchInput.addEventListener('input', debounce(handleSearch, 150));
        searchInput.addEventListener('keydown', handleKeydown);
    }

    /**
     * Handle search input
     */
    function handleSearch(e) {
        const query = searchInput.value.trim();

        if (!query) {
            showEmptyState();
            return;
        }

        if (!fuse) {
            resultsContainer.innerHTML = '<div class="search-loading"><div class="spinner"></div></div>';
            return;
        }

        const results = fuse.search(query).slice(0, 10);
        selectedIndex = -1;
        renderResults(results);
    }

    /**
     * Render search results
     */
    function renderResults(results) {
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <p>No results found</p>
                    <span>Try different keywords</span>
                </div>
            `;
            return;
        }

        const html = results.map((result, index) => {
            const item = result.item;
            const isModule = item.type === 'module';

            return `
                <div class="search-result-item" 
                     data-index="${index}" 
                     data-path="${item.path}"
                     role="option"
                     tabindex="-1">
                    <span class="search-result-icon" style="color: ${item.color}">${item.icon || item.moduleIcon}</span>
                    <div class="search-result-info">
                        <div class="search-result-title">${highlightMatch(item.title, result.matches)}</div>
                        ${!isModule ? `<div class="search-result-module">${item.module}</div>` : ''}
                    </div>
                    <span class="search-result-type">${isModule ? 'Module' : 'Topic'}</span>
                </div>
            `;
        }).join('');

        resultsContainer.innerHTML = html;

        // Bind click events
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => navigateToResult(item.dataset.path));
        });
    }

    /**
     * Highlight matched text
     */
    function highlightMatch(text, matches) {
        if (!matches || matches.length === 0) return text;

        const titleMatch = matches.find(m => m.key === 'title');
        if (!titleMatch) return text;

        let result = text;
        const indices = titleMatch.indices.sort((a, b) => b[0] - a[0]);

        indices.forEach(([start, end]) => {
            result = result.slice(0, start) +
                '<mark>' + result.slice(start, end + 1) + '</mark>' +
                result.slice(end + 1);
        });

        return result;
    }

    /**
     * Show empty state
     */
    function showEmptyState() {
        resultsContainer.innerHTML = `
            <div class="search-empty">
                <p>Start typing to search across all modules...</p>
                <div class="search-hints">
                    <span class="search-hint">💡 Try: "gradient descent", "CNN", "hypothesis testing"</span>
                </div>
            </div>
        `;
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeydown(e) {
        const items = resultsContainer.querySelectorAll('.search-result-item');

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                updateSelection(items);
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                updateSelection(items);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && items[selectedIndex]) {
                    navigateToResult(items[selectedIndex].dataset.path);
                }
                break;
            case 'Escape':
                e.preventDefault();
                closeSearch();
                break;
        }
    }

    /**
     * Update visual selection
     */
    function updateSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });

        if (items[selectedIndex]) {
            items[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    /**
     * Navigate to a result
     */
    function navigateToResult(path) {
        closeSearch();

        // Determine base path
        const currentPath = window.location.pathname;
        const basePath = currentPath.includes('DataScience-v2') ? '/DataScience-v2' : '/DataScience';

        window.location.href = basePath + path;
    }

    /**
     * Open search modal
     */
    function openSearch() {
        searchModal.classList.add('open');
        searchInput.value = '';
        searchInput.focus();
        showEmptyState();
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close search modal
     */
    function closeSearch() {
        searchModal.classList.remove('open');
        document.body.style.overflow = '';
        selectedIndex = -1;
    }

    /**
     * Bind keyboard shortcuts
     */
    function bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + K to open search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (searchModal.classList.contains('open')) {
                    closeSearch();
                } else {
                    openSearch();
                }
            }
        });
    }

    /**
     * Debounce utility
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Expose API
    window.DSSearch = {
        open: openSearch,
        close: closeSearch,
        init: init
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
