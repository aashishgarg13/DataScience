/**
 * DataScience Masterclass - Theme Toggle
 * Supports light/dark mode with system preference detection
 * Version: 2.0.0
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'ds-masterclass-theme';
    const THEMES = ['light', 'dark', 'system'];

    let currentTheme = 'system';

    /**
     * Initialize theme system
     */
    function init() {
        loadTheme();
        applyTheme();
        createToggleButton();
        watchSystemPreference();
        console.log('🎨 Theme system initialized:', currentTheme);
    }

    /**
     * Load theme preference from storage
     */
    function loadTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && THEMES.includes(stored)) {
            currentTheme = stored;
        }
    }

    /**
     * Save theme preference
     */
    function saveTheme() {
        localStorage.setItem(STORAGE_KEY, currentTheme);
    }

    /**
     * Get effective theme (resolving 'system')
     */
    function getEffectiveTheme() {
        if (currentTheme === 'system') {
            return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        return currentTheme;
    }

    /**
     * Apply theme to document
     */
    function applyTheme() {
        const effectiveTheme = getEffectiveTheme();
        document.documentElement.setAttribute('data-theme', effectiveTheme);

        // Update meta theme-color
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = effectiveTheme === 'dark' ? '#0d1117' : '#ffffff';

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: effectiveTheme }
        }));
    }

    /**
     * Set theme
     */
    function setTheme(theme) {
        if (!THEMES.includes(theme)) return;
        currentTheme = theme;
        saveTheme();
        applyTheme();
        updateToggleButton();
    }

    /**
     * Toggle between light and dark
     */
    function toggle() {
        const effective = getEffectiveTheme();
        setTheme(effective === 'dark' ? 'light' : 'dark');
    }

    /**
     * Cycle through all themes
     */
    function cycle() {
        const currentIndex = THEMES.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % THEMES.length;
        setTheme(THEMES[nextIndex]);
    }

    /**
     * Watch for system preference changes
     */
    function watchSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            if (currentTheme === 'system') {
                applyTheme();
            }
        });
    }

    /**
     * Create theme toggle button
     */
    function createToggleButton() {
        // Only create if container exists
        const container = document.getElementById('theme-toggle-container');
        if (!container) return;

        const button = document.createElement('button');
        button.id = 'theme-toggle';
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Toggle theme');
        button.setAttribute('title', 'Toggle light/dark mode');

        button.innerHTML = `
            <div class="theme-toggle-track">
                <span class="theme-icon theme-icon-dark">🌙</span>
                <span class="theme-icon theme-icon-light">☀️</span>
                <div class="theme-toggle-thumb"></div>
            </div>
        `;

        button.addEventListener('click', toggle);
        container.appendChild(button);
        updateToggleButton();
    }

    /**
     * Update toggle button state
     */
    function updateToggleButton() {
        const button = document.getElementById('theme-toggle');
        if (!button) return;

        const effective = getEffectiveTheme();
        button.dataset.theme = effective;
        button.setAttribute('aria-pressed', effective === 'light');
    }

    /**
     * Add inline styles for toggle (ensures it works before CSS loads)
     */
    function addInlineStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .theme-toggle {
                position: relative;
                width: 64px;
                height: 32px;
                background: var(--color-bg-tertiary, #1a1f2e);
                border: 1px solid var(--color-border-default, #30363d);
                border-radius: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                padding: 0;
            }

            .theme-toggle:hover {
                border-color: var(--color-border-hover, #8b949e);
            }

            .theme-toggle-track {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 6px;
            }

            .theme-icon {
                font-size: 14px;
                transition: opacity 0.3s ease;
            }

            .theme-toggle-thumb {
                position: absolute;
                top: 3px;
                left: 3px;
                width: 24px;
                height: 24px;
                background: var(--color-accent-ml, #00d4ff);
                border-radius: 50%;
                transition: transform 0.3s ease, background 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            [data-theme="light"] .theme-toggle-thumb {
                transform: translateX(32px);
                background: var(--color-warning, #f39c12);
            }

            [data-theme="dark"] .theme-icon-light {
                opacity: 0.4;
            }

            [data-theme="light"] .theme-icon-dark {
                opacity: 0.4;
            }

            /* Progress toast styles */
            .progress-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 20px;
                background: var(--color-bg-elevated, #21262d);
                border: 1px solid var(--color-success, #2ecc71);
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
            }

            .progress-toast.show {
                opacity: 1;
                transform: translateY(0);
            }

            .toast-icon {
                font-size: 18px;
            }

            .toast-message {
                font-size: 14px;
                font-weight: 500;
                color: var(--color-text-primary, #e4e6eb);
            }

            /* Search modal additional styles */
            .search-modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 15vh;
                z-index: 500;
                opacity: 0;
                visibility: hidden;
                transition: all 0.2s ease;
            }

            .search-modal.open {
                opacity: 1;
                visibility: visible;
            }

            .search-modal-content {
                width: 100%;
                max-width: 600px;
                background: var(--color-bg-secondary, #161b22);
                border: 1px solid var(--color-border-default, #30363d);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                overflow: hidden;
            }

            .search-modal-header {
                padding: 16px;
                border-bottom: 1px solid var(--color-border-default, #30363d);
            }

            .search-results {
                max-height: 400px;
                overflow-y: auto;
            }

            .search-empty,
            .search-no-results {
                padding: 40px 20px;
                text-align: center;
                color: var(--color-text-secondary, #8b949e);
            }

            .search-hints {
                margin-top: 16px;
            }

            .search-hint {
                font-size: 13px;
                color: var(--color-text-muted, #6e7681);
            }

            .search-result-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                cursor: pointer;
                transition: background 0.15s ease;
            }

            .search-result-item:hover,
            .search-result-item.selected {
                background: var(--color-bg-tertiary, #1a1f2e);
            }

            .search-result-icon {
                font-size: 20px;
                width: 32px;
                text-align: center;
            }

            .search-result-info {
                flex: 1;
                min-width: 0;
            }

            .search-result-title {
                font-weight: 500;
                color: var(--color-text-primary, #e4e6eb);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .search-result-title mark {
                background: rgba(0, 212, 255, 0.3);
                color: inherit;
                border-radius: 2px;
                padding: 0 2px;
            }

            .search-result-module {
                font-size: 12px;
                color: var(--color-text-muted, #6e7681);
            }

            .search-result-type {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--color-text-muted, #6e7681);
                padding: 2px 8px;
                background: var(--color-bg-tertiary, #1a1f2e);
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    // Expose API
    window.DSTheme = {
        init,
        setTheme,
        getTheme: () => currentTheme,
        getEffectiveTheme,
        toggle,
        cycle
    };

    // Add inline styles immediately
    addInlineStyles();

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
