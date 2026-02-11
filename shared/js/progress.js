/**
 * DataScience Masterclass - Progress Tracking
 * Persists user progress across all modules using localStorage
 * Version: 2.0.0
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'ds-masterclass-progress';
    const VERSION = '2.0.0';

    // Module definitions
    const moduleConfig = {
        'deep-learning': {
            name: 'Deep Learning',
            icon: '🧠',
            totalTopics: 12,
            path: '/DeepLearning/index.html'
        },
        'machine-learning': {
            name: 'Machine Learning',
            icon: '🤖',
            totalTopics: 42,
            path: '/ml_complete-all-topics/index.html'
        },
        'statistics': {
            name: 'Statistics',
            icon: '📊',
            totalTopics: 41,
            path: '/complete-statistics/index.html'
        },
        'mathematics': {
            name: 'Mathematics',
            icon: '📐',
            totalTopics: 15,
            path: '/math-ds-complete/index.html'
        },
        'feature-engineering': {
            name: 'Feature Engineering',
            icon: '⚙️',
            totalTopics: 12,
            path: '/feature-engineering/index.html'
        },
        'visualization': {
            name: 'Visualization',
            icon: '📈',
            totalTopics: 8,
            path: '/Visualization/index.html'
        },
        'prompt-engineering': {
            name: 'Prompt Engineering',
            icon: '💬',
            totalTopics: 12,
            path: '/prompt-engineering-guide/index.html'
        }
    };

    let progressData = null;

    /**
     * Initialize progress tracking
     */
    function init() {
        loadProgress();
        detectCurrentModule();
        updateUI();
        bindEvents();
        console.log('📊 Progress tracking initialized');
    }

    /**
     * Load progress from localStorage
     */
    function loadProgress() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.version === VERSION) {
                    progressData = data;
                } else {
                    // Migrate or reset if version mismatch
                    progressData = createInitialProgress();
                }
            } else {
                progressData = createInitialProgress();
            }
        } catch (e) {
            console.error('Failed to load progress:', e);
            progressData = createInitialProgress();
        }
    }

    /**
     * Create initial progress structure
     */
    function createInitialProgress() {
        const progress = {
            version: VERSION,
            lastUpdated: new Date().toISOString(),
            lastVisited: null,
            modules: {}
        };

        Object.keys(moduleConfig).forEach(moduleId => {
            progress.modules[moduleId] = {
                completed: [],
                lastTopic: null,
                timeSpent: 0
            };
        });

        return progress;
    }

    /**
     * Save progress to localStorage
     */
    function saveProgress() {
        try {
            progressData.lastUpdated = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    /**
     * Detect current module from URL
     */
    function detectCurrentModule() {
        const path = window.location.pathname;

        if (path.includes('DeepLearning')) return 'deep-learning';
        if (path.includes('ml_complete')) return 'machine-learning';
        if (path.includes('complete-statistics')) return 'statistics';
        if (path.includes('math-ds-complete')) return 'mathematics';
        if (path.includes('feature-engineering')) return 'feature-engineering';
        if (path.includes('Visualization')) return 'visualization';
        if (path.includes('prompt-engineering')) return 'prompt-engineering';

        return null;
    }

    /**
     * Mark a topic as completed
     */
    function markCompleted(moduleId, topicId) {
        if (!progressData.modules[moduleId]) return;

        const completed = progressData.modules[moduleId].completed;
        if (!completed.includes(topicId)) {
            completed.push(topicId);
            progressData.modules[moduleId].lastTopic = topicId;
            progressData.lastVisited = {
                module: moduleId,
                topic: topicId,
                timestamp: new Date().toISOString()
            };
            saveProgress();
            updateUI();
            showCompletionToast(moduleId, topicId);
        }
    }

    /**
     * Mark a topic as incomplete
     */
    function markIncomplete(moduleId, topicId) {
        if (!progressData.modules[moduleId]) return;

        const completed = progressData.modules[moduleId].completed;
        const index = completed.indexOf(topicId);
        if (index > -1) {
            completed.splice(index, 1);
            saveProgress();
            updateUI();
        }
    }

    /**
     * Toggle topic completion
     */
    function toggleCompleted(moduleId, topicId) {
        if (!progressData.modules[moduleId]) return;

        if (isCompleted(moduleId, topicId)) {
            markIncomplete(moduleId, topicId);
        } else {
            markCompleted(moduleId, topicId);
        }
    }

    /**
     * Check if a topic is completed
     */
    function isCompleted(moduleId, topicId) {
        if (!progressData.modules[moduleId]) return false;
        return progressData.modules[moduleId].completed.includes(topicId);
    }

    /**
     * Get module progress
     */
    function getModuleProgress(moduleId) {
        if (!progressData.modules[moduleId] || !moduleConfig[moduleId]) {
            return { completed: 0, total: 0, percentage: 0 };
        }

        const completed = progressData.modules[moduleId].completed.length;
        const total = moduleConfig[moduleId].totalTopics;
        const percentage = Math.round((completed / total) * 100);

        return { completed, total, percentage };
    }

    /**
     * Get overall progress
     */
    function getOverallProgress() {
        let totalCompleted = 0;
        let totalTopics = 0;

        Object.keys(moduleConfig).forEach(moduleId => {
            if (progressData.modules[moduleId]) {
                totalCompleted += progressData.modules[moduleId].completed.length;
            }
            totalTopics += moduleConfig[moduleId].totalTopics;
        });

        const percentage = Math.round((totalCompleted / totalTopics) * 100);
        return { completed: totalCompleted, total: totalTopics, percentage };
    }

    /**
     * Get last visited info
     */
    function getLastVisited() {
        return progressData.lastVisited;
    }

    /**
     * Reset all progress
     */
    function resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            progressData = createInitialProgress();
            saveProgress();
            updateUI();
        }
    }

    /**
     * Reset module progress
     */
    function resetModuleProgress(moduleId) {
        if (progressData.modules[moduleId]) {
            progressData.modules[moduleId] = {
                completed: [],
                lastTopic: null,
                timeSpent: 0
            };
            saveProgress();
            updateUI();
        }
    }

    /**
     * Update UI elements with progress
     */
    function updateUI() {
        // Update progress bars
        document.querySelectorAll('[data-progress-module]').forEach(el => {
            const moduleId = el.dataset.progressModule;
            const progress = getModuleProgress(moduleId);

            const bar = el.querySelector('.progress-bar');
            const label = el.querySelector('.progress-label-value');

            if (bar) bar.style.width = progress.percentage + '%';
            if (label) label.textContent = `${progress.completed}/${progress.total}`;
        });

        // Update overall progress
        document.querySelectorAll('[data-progress-overall]').forEach(el => {
            const progress = getOverallProgress();

            const bar = el.querySelector('.progress-bar');
            const label = el.querySelector('.progress-label-value');

            if (bar) bar.style.width = progress.percentage + '%';
            if (label) label.textContent = `${progress.percentage}%`;
        });

        // Update topic checkboxes
        document.querySelectorAll('[data-topic-id]').forEach(el => {
            const topicId = el.dataset.topicId;
            const moduleId = el.dataset.moduleId || detectCurrentModule();

            if (moduleId) {
                el.classList.toggle('completed', isCompleted(moduleId, topicId));
            }
        });

        // Update continue button
        updateContinueButton();
    }

    /**
     * Update "Continue where you left off" button
     */
    function updateContinueButton() {
        const continueBtn = document.getElementById('continue-learning-btn');
        if (!continueBtn) return;

        const lastVisited = getLastVisited();
        if (lastVisited && moduleConfig[lastVisited.module]) {
            const config = moduleConfig[lastVisited.module];
            continueBtn.href = config.path + '#' + lastVisited.topic;
            continueBtn.querySelector('.continue-module-name').textContent = config.name;
            continueBtn.style.display = 'flex';
        } else {
            continueBtn.style.display = 'none';
        }
    }

    /**
     * Show completion toast notification
     */
    function showCompletionToast(moduleId, topicId) {
        const toast = document.createElement('div');
        toast.className = 'progress-toast';
        toast.innerHTML = `
            <span class="toast-icon">✅</span>
            <span class="toast-message">Topic completed!</span>
        `;

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    /**
     * Bind event listeners
     */
    function bindEvents() {
        // Mark topic complete when clicking checkbox
        document.addEventListener('click', (e) => {
            const topicEl = e.target.closest('[data-topic-id]');
            if (topicEl && e.target.classList.contains('topic-checkbox')) {
                const topicId = topicEl.dataset.topicId;
                const moduleId = topicEl.dataset.moduleId || detectCurrentModule();
                if (moduleId) {
                    toggleCompleted(moduleId, topicId);
                }
            }
        });

        // Track time spent (basic implementation)
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const moduleId = detectCurrentModule();
            if (moduleId && progressData.modules[moduleId]) {
                const elapsed = Math.round((Date.now() - startTime) / 1000);
                progressData.modules[moduleId].timeSpent += elapsed;
                saveProgress();
            }
        });
    }

    /**
     * Export progress data
     */
    function exportProgress() {
        const dataStr = JSON.stringify(progressData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'ds-masterclass-progress.json';
        a.click();

        URL.revokeObjectURL(url);
    }

    /**
     * Import progress data
     */
    function importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.version && data.modules) {
                    progressData = data;
                    saveProgress();
                    updateUI();
                    alert('Progress imported successfully!');
                } else {
                    alert('Invalid progress file');
                }
            } catch (err) {
                alert('Failed to import progress: ' + err.message);
            }
        };
        reader.readAsText(file);
    }

    // Expose API
    window.DSProgress = {
        init,
        markCompleted,
        markIncomplete,
        toggleCompleted,
        isCompleted,
        getModuleProgress,
        getOverallProgress,
        getLastVisited,
        resetProgress,
        resetModuleProgress,
        exportProgress,
        importProgress
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
