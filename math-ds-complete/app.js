// ===== CONFIGURATION & CONSTANTS =====
const COLORS = {
    primary: '#4a90e2',
    cyan: '#64ffda',
    orange: '#ff6b6b',
    green: '#51cf66',
    background: '#0f3460',
    text: '#e1e1e1',
    textSecondary: '#a0a0a0'
};

const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// ===== STATE MANAGEMENT =====
let currentTopic = 1;
let currentSubject = 'statistics';
let animationFrames = {};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Core initialization
    initNavigation();
    initSubjectTabs();
    initInteractiveElements();
    setupScrollObserver();
    initializeAllVisualizations();

    // Enhanced features
    initSearch();
    initProgressTracking();
    initKeyboardShortcuts();
    initLazyLoading();

    // Fix Show Answer buttons (Remove inline handlers to avoid conflicts)
    document.querySelectorAll('.show-answers-btn, .show-answer-btn').forEach(btn => {
        btn.removeAttribute('onclick');
    });

    // Show initial subject
    switchSubject('statistics');

    // Log features
    console.log('%c🚀 Enhanced Features Active:', 'color: #64ffda; font-size: 14px; font-weight: bold;');
    console.log('%c  ✓ Global Search (Ctrl/Cmd+K)', 'color: #4a90e2;');
    console.log('%c  ✓ Progress Tracking (saved locally)', 'color: #4a90e2;');
    console.log('%c  ✓ MathJax Formula Rendering', 'color: #4a90e2;');
    console.log('%c  ✓ Keyboard Navigation (Alt+↑/↓)', 'color: #4a90e2;');
});

// ===== SUBJECT SWITCHING =====
function initSubjectTabs() {
    const tabs = document.querySelectorAll('.subject-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const subject = tab.dataset.subject;
            switchSubject(subject);
        });
    });
}

function switchSubject(subject) {
    currentSubject = subject;

    // Update active tab
    document.querySelectorAll('.subject-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.subject === subject) {
            tab.classList.add('active');
        }
    });

    // Update sidebar title
    const titles = {
        'statistics': 'Statistics Content',
        'linear-algebra': 'Linear Algebra Content',
        'calculus': 'Calculus Content',
        'data-science': 'Data Science Content',
        'machine-learning': 'Machine Learning Algorithms'
    };
    const sidebarTitle = document.getElementById('sidebarTitle');
    if (sidebarTitle) {
        sidebarTitle.textContent = titles[subject];
    }

    // Show/hide sidebar modules
    document.querySelectorAll('.module').forEach(module => {
        const moduleSubject = module.dataset.subject;
        if (moduleSubject) {
            module.style.display = moduleSubject === subject ? 'block' : 'none';
        } else {
            // Statistics modules (no data-subject attribute)
            module.style.display = subject === 'statistics' ? 'block' : 'none';
        }
    });

    // Show/hide topic sections
    document.querySelectorAll('.topic-section').forEach(section => {
        const sectionSubject = section.dataset.subject || 'statistics';
        section.style.display = sectionSubject === subject ? 'block' : 'none';
    });

    // Scroll to first topic of subject
    const firstTopic = document.querySelector(`.topic-section[data-subject="${subject}"], .topic-section:not([data-subject])`);
    if (firstTopic && subject !== 'statistics') {
        setTimeout(() => {
            firstTopic.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else if (subject === 'statistics') {
        const statsFirst = document.getElementById('topic-1');
        if (statsFirst) {
            setTimeout(() => {
                statsFirst.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Topic link navigation
    const topicLinks = document.querySelectorAll('.topic-link');
    topicLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const topicId = link.getAttribute('data-topic');

            // Handle both 'topic-X' and 'ml-topic-X' formats
            let target = document.getElementById(topicId);
            if (!target && !topicId.includes('-')) {
                target = document.getElementById(`topic-${topicId}`);
            }

            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateActiveLink(topicId);

                // Close mobile menu if open
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });
}

function updateActiveLink(topicId) {
    document.querySelectorAll('.topic-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[data-topic="${topicId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    currentTopic = parseInt(topicId);
}

// ===== SCROLL OBSERVER =====
function setupScrollObserver() {
    const options = {
        root: null,
        rootMargin: '-100px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Handle both 'topic-X' and 'ml-topic-X' formats
                const fullId = entry.target.id;
                updateActiveLink(fullId);
            }
        });
    }, options);

    document.querySelectorAll('.topic-section').forEach(section => {
        observer.observe(section);
    });
}

// ===== CANVAS UTILITIES =====
function clearCanvas(ctx, canvas) {
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawText(ctx, text, x, y, fontSize = 14, color = COLORS.text, align = 'center') {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px 'Segoe UI', sans-serif`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
}

function drawCircle(ctx, x, y, radius, color, filled = true) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (filled) {
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawLine(ctx, x1, y1, x2, y2, color = COLORS.text, width = 1) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

function drawRect(ctx, x, y, width, height, color, filled = true) {
    if (filled) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }
}

// ===== STATISTICAL CALCULATIONS =====
function calculateMean(data) {
    return data.reduce((sum, val) => sum + val, 0) / data.length;
}

function calculateMedian(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}

function calculateMode(data) {
    const frequency = {};
    let maxFreq = 0;

    data.forEach(val => {
        frequency[val] = (frequency[val] || 0) + 1;
        maxFreq = Math.max(maxFreq, frequency[val]);
    });

    if (maxFreq === 1) return 'None';

    const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq);
    return modes.join(', ');
}

function calculateVariance(data, isSample = true) {
    const mean = calculateMean(data);
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    const divisor = isSample ? data.length - 1 : data.length;
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / divisor;
}

function calculateStdDev(data, isSample = true) {
    return Math.sqrt(calculateVariance(data, isSample));
}

function calculateQuartiles(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const q2 = calculateMedian(sorted);
    const midIndex = Math.floor(sorted.length / 2);

    const lowerHalf = sorted.length % 2 === 0
        ? sorted.slice(0, midIndex)
        : sorted.slice(0, midIndex);
    const upperHalf = sorted.length % 2 === 0
        ? sorted.slice(midIndex)
        : sorted.slice(midIndex + 1);

    const q1 = calculateMedian(lowerHalf);
    const q3 = calculateMedian(upperHalf);

    return { q1, q2, q3 };
}

function calculateIQR(data) {
    const { q1, q3 } = calculateQuartiles(data);
    const iqr = q3 - q1;
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    return { q1, q3, iqr, lowerFence, upperFence };
}

function detectOutliers(data) {
    const { lowerFence, upperFence } = calculateIQR(data);
    return data.filter(val => val < lowerFence || val > upperFence);
}

function calculateCovariance(x, y) {
    const meanX = calculateMean(x);
    const meanY = calculateMean(y);
    let sum = 0;

    for (let i = 0; i < x.length; i++) {
        sum += (x[i] - meanX) * (y[i] - meanY);
    }

    return sum / (x.length - 1);
}

function calculateCorrelation(x, y) {
    const cov = calculateCovariance(x, y);
    const stdX = calculateStdDev(x);
    const stdY = calculateStdDev(y);
    return cov / (stdX * stdY);
}

// ===== VISUALIZATION FUNCTIONS =====

// Population vs Sample Visualization
function initPopulationSampleViz() {
    const canvas = document.getElementById('populationSampleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let population = [];
    let sample = [];
    let sampleSize = 30;

    // Initialize population
    for (let i = 0; i < 200; i++) {
        population.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            inSample: false
        });
    }

    function draw() {
        clearCanvas(ctx, canvas);

        // Draw title
        drawText(ctx, 'Population (All dots) vs Sample (Highlighted)', canvas.width / 2, 30, 16, COLORS.cyan);

        // Draw population
        population.forEach(point => {
            const color = point.inSample ? COLORS.orange : COLORS.primary;
            const radius = point.inSample ? 6 : 4;
            drawCircle(ctx, point.x, point.y, radius, color);
        });

        // Draw statistics
        const popCount = population.length;
        const sampleCount = population.filter(p => p.inSample).length;
        drawText(ctx, `Population Size: N = ${popCount}`, 150, canvas.height - 20, 14, COLORS.text, 'center');
        drawText(ctx, `Sample Size: n = ${sampleCount}`, canvas.width - 150, canvas.height - 20, 14, COLORS.orange, 'center');
    }

    function takeSample() {
        // Reset all
        population.forEach(p => p.inSample = false);

        // Randomly select sample
        const shuffled = [...population].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(sampleSize, population.length); i++) {
            shuffled[i].inSample = true;
        }

        draw();
    }

    // Event listeners
    const sampleBtn = document.getElementById('sampleBtn');
    const resetBtn = document.getElementById('resetPopBtn');
    const sizeSlider = document.getElementById('sampleSizeSlider');
    const sizeLabel = document.getElementById('sampleSizeLabel');

    if (sampleBtn) {
        sampleBtn.addEventListener('click', takeSample);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            population.forEach(p => p.inSample = false);
            draw();
        });
    }

    if (sizeSlider) {
        sizeSlider.addEventListener('input', (e) => {
            sampleSize = parseInt(e.target.value);
            if (sizeLabel) {
                sizeLabel.textContent = sampleSize;
            }
        });
    }

    draw();
}

// Central Tendency Visualization
function initCentralTendencyViz() {
    const canvas = document.getElementById('centralTendencyCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let data = [10, 20, 30, 40, 50];

    function parseInput(input) {
        return input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    }

    function draw() {
        clearCanvas(ctx, canvas);

        if (data.length === 0) {
            drawText(ctx, 'Please enter valid numbers', canvas.width / 2, canvas.height / 2, 16, COLORS.orange);
            return;
        }

        const sorted = [...data].sort((a, b) => a - b);
        const min = Math.min(...sorted);
        const max = Math.max(...sorted);
        const range = max - min || 1;
        const padding = 80;
        const width = canvas.width - 2 * padding;

        // Calculate statistics
        const mean = calculateMean(data);
        const median = calculateMedian(data);
        const mode = calculateMode(data);

        // Update results display
        document.getElementById('meanResult').textContent = mean.toFixed(2);
        document.getElementById('medianResult').textContent = median.toFixed(2);
        document.getElementById('modeResult').textContent = mode;

        // Draw axis
        const axisY = canvas.height / 2;
        drawLine(ctx, padding, axisY, canvas.width - padding, axisY, COLORS.text, 2);

        // Draw data points
        sorted.forEach((val, idx) => {
            const x = padding + ((val - min) / range) * width;
            drawCircle(ctx, x, axisY, 8, COLORS.primary);
            drawText(ctx, val.toString(), x, axisY + 30, 12, COLORS.text);
        });

        // Draw mean
        const meanX = padding + ((mean - min) / range) * width;
        drawLine(ctx, meanX, axisY - 60, meanX, axisY + 60, COLORS.cyan, 3);
        drawText(ctx, `Mean: ${mean.toFixed(2)}`, meanX, axisY - 70, 14, COLORS.cyan);

        // Draw median
        const medianX = padding + ((median - min) / range) * width;
        drawLine(ctx, medianX, axisY - 50, medianX, axisY + 50, COLORS.orange, 2);
        drawText(ctx, `Median: ${median.toFixed(2)}`, medianX, axisY - 55, 12, COLORS.orange);
    }

    // Event listeners
    const input = document.getElementById('centralTendencyInput');
    const calcBtn = document.getElementById('calculateCentralBtn');
    const randomBtn = document.getElementById('randomDataBtn');

    if (calcBtn && input) {
        calcBtn.addEventListener('click', () => {
            data = parseInput(input.value);
            draw();
        });
    }

    if (randomBtn && input) {
        randomBtn.addEventListener('click', () => {
            data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
            input.value = data.join(', ');
            draw();
        });
    }

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                data = parseInput(input.value);
                draw();
            }
        });
    }

    draw();
}

// ===== INITIALIZE ALL VISUALIZATIONS =====
function initializeAllVisualizations() {
    // Statistics visualizations
    initPopulationSampleViz();
    initCentralTendencyViz();

    // Linear Algebra visualizations
    initVectorCanvas();
    initSpanCanvas();
    initTransformationGrid();
    initEigenvectorCanvas(); // This now calls the updated version

    // Advanced Stats (New)
    initSkewnessVisualization();
    initCovarianceVisualization();
    initPDFCDFVisualization();
    initNormalRuleVisualization();
    initCorrelationVisualization();

    // Calculus visualizations
    initCircleAreaCanvas();
    initDerivativeCanvas();
    initRiemannSumCanvas();
    initTaylorSeriesCanvas();

    // Data Science visualizations
    initSimpleRegressionCanvas();
    initLogisticRegressionCanvas();
    initPolynomialRegressionCanvas();
    initPCACanvas();
    initGradientDescentCanvas();
    initLossLandscapeCanvas();

    // Machine Learning (New)
    initDecisionTreeVisualization();

    // Machine Learning visualizations
    initMLLinearRegressionCanvas();
    initMLKMeansCanvas();
    initMLSVMCanvas();
    initMLRandomForestCanvas();
    initMLGradientBoostingCanvas();
    initMLNeuralNetworkCanvas();
}

// ===== MACHINE LEARNING VISUALIZATIONS =====

function initMLLinearRegressionCanvas() {
    const canvas = document.getElementById('canvas-ml-1');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let showLine = false;

    // House price data from worked example
    const data = [
        { x: 1000, y: 150 },
        { x: 1500, y: 200 },
        { x: 2000, y: 250 },
        { x: 3000, y: 350 }
    ];

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 80;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;

        const maxX = 3500;
        const maxY = 400;

        // Draw axes
        drawLine(ctx, padding, canvas.height - padding, canvas.width - padding, canvas.height - padding, COLORS.text, 2);
        drawLine(ctx, padding, padding, padding, canvas.height - padding, COLORS.text, 2);

        // Draw grid
        for (let i = 0; i <= 7; i++) {
            const x = padding + (i / 7) * width;
            const xVal = (i * 500).toString();
            drawLine(ctx, x, canvas.height - padding, x, canvas.height - padding + 5, COLORS.textSecondary, 1);
            drawText(ctx, xVal, x, canvas.height - padding + 20, 10, COLORS.textSecondary);
        }

        for (let i = 0; i <= 8; i++) {
            const y = canvas.height - padding - (i / 8) * height;
            const yVal = (i * 50).toString();
            drawLine(ctx, padding - 5, y, padding, y, COLORS.textSecondary, 1);
            drawText(ctx, yVal, padding - 15, y + 4, 10, COLORS.textSecondary, 'right');
        }

        // Draw labels
        drawText(ctx, 'Size (sq ft)', canvas.width / 2, canvas.height - 10, 12, COLORS.cyan);
        ctx.save();
        ctx.translate(20, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        drawText(ctx, 'Price ($1000s)', 0, 0, 12, COLORS.cyan);
        ctx.restore();

        // Draw data points
        data.forEach(point => {
            const px = padding + (point.x / maxX) * width;
            const py = canvas.height - padding - (point.y / maxY) * height;
            drawCircle(ctx, px, py, 8, COLORS.cyan);
            drawText(ctx, `${point.y}k`, px + 15, py - 10, 10, COLORS.cyan, 'left');
        });

        // Draw regression line if enabled
        if (showLine) {
            // From worked example: y = 50 + 0.1x
            const slope = 0.1;
            const intercept = 50;

            const x1 = 0;
            const y1 = intercept;
            const x2 = maxX;
            const y2 = intercept + slope * x2;

            const px1 = padding + (x1 / maxX) * width;
            const py1 = canvas.height - padding - (y1 / maxY) * height;
            const px2 = padding + (x2 / maxX) * width;
            const py2 = canvas.height - padding - (y2 / maxY) * height;

            drawLine(ctx, px1, py1, px2, py2, COLORS.orange, 3);

            // Show equation
            drawText(ctx, 'y = 50 + 0.10x', canvas.width / 2, 30, 16, COLORS.orange);
            drawText(ctx, 'R² = 1.00 (Perfect Fit!)', canvas.width / 2, 50, 14, COLORS.green);

            // Highlight prediction point (2500, 300)
            const predX = 2500;
            const predY = 50 + 0.1 * predX;
            const ppx = padding + (predX / maxX) * width;
            const ppy = canvas.height - padding - (predY / maxY) * height;
            drawCircle(ctx, ppx, ppy, 10, COLORS.green);
            drawText(ctx, '2500 sq ft → $300k', ppx - 80, ppy - 15, 12, COLORS.green, 'left');
        }
    }

    const fitBtn = document.getElementById('btn-ml-1-fit');
    const resetBtn = document.getElementById('btn-ml-1-reset');

    if (fitBtn) {
        fitBtn.addEventListener('click', () => {
            showLine = true;
            draw();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            showLine = false;
            draw();
        });
    }

    draw();
}

function initMLKMeansCanvas() {
    const canvas = document.getElementById('canvas-ml-15');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let clustered = false;

    // Customer data from worked example
    const customers = [
        { name: 'A', age: 25, income: 40, cluster: null },
        { name: 'B', age: 30, income: 50, cluster: null },
        { name: 'C', age: 28, income: 45, cluster: null },
        { name: 'D', age: 55, income: 80, cluster: null },
        { name: 'E', age: 60, income: 90, cluster: null },
        { name: 'F', age: 52, income: 75, cluster: null }
    ];

    let centroids = [
        { age: 25, income: 40, color: COLORS.cyan },
        { age: 60, income: 90, color: COLORS.orange }
    ];

    function assignClusters() {
        customers.forEach(customer => {
            // Calculate distance to each centroid
            const d1 = Math.sqrt(Math.pow(customer.age - centroids[0].age, 2) + Math.pow(customer.income - centroids[0].income, 2));
            const d2 = Math.sqrt(Math.pow(customer.age - centroids[1].age, 2) + Math.pow(customer.income - centroids[1].income, 2));

            customer.cluster = d1 < d2 ? 0 : 1;
        });

        // Update centroids
        const cluster0 = customers.filter(c => c.cluster === 0);
        const cluster1 = customers.filter(c => c.cluster === 1);

        if (cluster0.length > 0) {
            centroids[0].age = cluster0.reduce((s, c) => s + c.age, 0) / cluster0.length;
            centroids[0].income = cluster0.reduce((s, c) => s + c.income, 0) / cluster0.length;
        }
        if (cluster1.length > 0) {
            centroids[1].age = cluster1.reduce((s, c) => s + c.age, 0) / cluster1.length;
            centroids[1].income = cluster1.reduce((s, c) => s + c.income, 0) / cluster1.length;
        }
    }

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 80;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;

        const minAge = 20, maxAge = 70;
        const minIncome = 30, maxIncome = 100;

        // Draw axes
        drawLine(ctx, padding, canvas.height - padding, canvas.width - padding, canvas.height - padding, COLORS.text, 2);
        drawLine(ctx, padding, padding, padding, canvas.height - padding, COLORS.text, 2);

        // Draw grid
        for (let age = 20; age <= 70; age += 10) {
            const x = padding + ((age - minAge) / (maxAge - minAge)) * width;
            drawLine(ctx, x, canvas.height - padding, x, canvas.height - padding + 5, COLORS.textSecondary, 1);
            drawText(ctx, age.toString(), x, canvas.height - padding + 20, 10, COLORS.textSecondary);
        }

        for (let income = 30; income <= 100; income += 10) {
            const y = canvas.height - padding - ((income - minIncome) / (maxIncome - minIncome)) * height;
            drawLine(ctx, padding - 5, y, padding, y, COLORS.textSecondary, 1);
            drawText(ctx, `$${income}k`, padding - 40, y + 4, 10, COLORS.textSecondary, 'right');
        }

        // Draw labels
        drawText(ctx, 'Age', canvas.width / 2, canvas.height - 10, 12, COLORS.cyan);
        ctx.save();
        ctx.translate(20, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        drawText(ctx, 'Income ($k)', 0, 0, 12, COLORS.cyan);
        ctx.restore();

        // Draw customers
        customers.forEach(customer => {
            const px = padding + ((customer.age - minAge) / (maxAge - minAge)) * width;
            const py = canvas.height - padding - ((customer.income - minIncome) / (maxIncome - minIncome)) * height;

            const color = clustered ? (customer.cluster === 0 ? COLORS.cyan : COLORS.orange) : COLORS.primary;
            drawCircle(ctx, px, py, 10, color);
            drawText(ctx, customer.name, px, py - 15, 12, COLORS.text);
        });

        // Draw centroids if clustered
        if (clustered) {
            centroids.forEach((centroid, i) => {
                const cx = padding + ((centroid.age - minAge) / (maxAge - minAge)) * width;
                const cy = canvas.height - padding - ((centroid.income - minIncome) / (maxIncome - minIncome)) * height;

                // Draw X marker for centroid
                ctx.strokeStyle = centroid.color;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(cx - 12, cy - 12);
                ctx.lineTo(cx + 12, cy + 12);
                ctx.moveTo(cx + 12, cy - 12);
                ctx.lineTo(cx - 12, cy + 12);
                ctx.stroke();

                drawText(ctx, `C${i + 1} [${centroid.age.toFixed(1)}, ${centroid.income.toFixed(1)}]`,
                    cx + 20, cy, 11, centroid.color, 'left');
            });

            drawText(ctx, 'Cluster 1 (Young, Lower Income)', 150, 30, 12, COLORS.cyan);
            drawText(ctx, 'Cluster 2 (Mature, Higher Income)', 150, 50, 12, COLORS.orange);
        }
    }

    const clusterBtn = document.getElementById('btn-ml-15-cluster');
    const resetBtn = document.getElementById('btn-ml-15-reset');

    if (clusterBtn) {
        clusterBtn.addEventListener('click', () => {
            clustered = true;
            assignClusters();
            draw();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            clustered = false;
            customers.forEach(c => c.cluster = null);
            centroids = [
                { age: 25, income: 40, color: COLORS.cyan },
                { age: 60, income: 90, color: COLORS.orange }
            ];
            draw();
        });
    }

    draw();
}

// ===== LINEAR ALGEBRA VISUALIZATIONS =====

function initVectorCanvas() {
    const canvas = document.getElementById('canvas-42');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let vx = 3, vy = 2;

    function draw() {
        clearCanvas(ctx, canvas);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 40;

        // Draw axes
        drawLine(ctx, 0, centerY, canvas.width, centerY, '#555', 1);
        drawLine(ctx, centerX, 0, centerX, canvas.height, '#555', 1);

        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        for (let i = -10; i <= 10; i++) {
            if (i !== 0) {
                drawLine(ctx, centerX + i * scale, 0, centerX + i * scale, canvas.height, '#333', 0.5);
                drawLine(ctx, 0, centerY + i * scale, canvas.width, centerY + i * scale, '#333', 0.5);
            }
        }

        // Draw vector
        const endX = centerX + vx * scale;
        const endY = centerY - vy * scale;

        // Arrow shaft
        drawLine(ctx, centerX, centerY, endX, endY, COLORS.cyan, 3);

        // Arrow head
        const angle = Math.atan2(vy, vx);
        const arrowSize = 15;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY + arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY + arrowSize * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = COLORS.cyan;
        ctx.fill();

        // Draw vector label
        drawText(ctx, `v = [${vx.toFixed(1)}, ${vy.toFixed(1)}]`, endX + 20, endY - 10, 14, COLORS.cyan, 'left');

        // Draw magnitude
        const magnitude = Math.sqrt(vx * vx + vy * vy);
        drawText(ctx, `|v| = ${magnitude.toFixed(2)}`, canvas.width / 2, 30, 14, COLORS.text);
    }

    const sliderX = document.getElementById('slider42x');
    const sliderY = document.getElementById('slider42y');
    const labelX = document.getElementById('vec42x');
    const labelY = document.getElementById('vec42y');

    if (sliderX) {
        sliderX.addEventListener('input', (e) => {
            vx = parseFloat(e.target.value);
            if (labelX) labelX.textContent = vx.toFixed(1);
            draw();
        });
    }

    if (sliderY) {
        sliderY.addEventListener('input', (e) => {
            vy = parseFloat(e.target.value);
            if (labelY) labelY.textContent = vy.toFixed(1);
            draw();
        });
    }

    const resetBtn = document.getElementById('btn42reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            vx = 3; vy = 2;
            if (sliderX) sliderX.value = vx;
            if (sliderY) sliderY.value = vy;
            if (labelX) labelX.textContent = vx;
            if (labelY) labelY.textContent = vy;
            draw();
        });
    }

    draw();
}

function initSpanCanvas() {
    const canvas = document.getElementById('canvas-43');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animating = false;
    let t = 0;

    function draw() {
        clearCanvas(ctx, canvas);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 50;

        // Draw axes
        drawLine(ctx, 0, centerY, canvas.width, centerY, '#555', 1);
        drawLine(ctx, centerX, 0, centerX, canvas.height, '#555', 1);

        // Basis vectors
        const v1 = { x: 2, y: 1 };
        const v2 = { x: -1, y: 1.5 };

        // Draw basis vectors
        drawLine(ctx, centerX, centerY, centerX + v1.x * scale, centerY - v1.y * scale, COLORS.cyan, 3);
        drawLine(ctx, centerX, centerY, centerX + v2.x * scale, centerY - v2.y * scale, COLORS.orange, 3);

        if (animating) {
            // Draw span (multiple linear combinations)
            ctx.globalAlpha = 0.3;
            for (let a = -2; a <= 2; a += 0.3) {
                for (let b = -2; b <= 2; b += 0.3) {
                    const x = centerX + (a * v1.x + b * v2.x) * scale;
                    const y = centerY - (a * v1.y + b * v2.y) * scale;
                    drawCircle(ctx, x, y, 2, COLORS.primary);
                }
            }
            ctx.globalAlpha = 1;
        }

        drawText(ctx, 'v₁', centerX + v1.x * scale + 20, centerY - v1.y * scale, 16, COLORS.cyan);
        drawText(ctx, 'v₂', centerX + v2.x * scale - 20, centerY - v2.y * scale, 16, COLORS.orange);
    }

    const animateBtn = document.getElementById('btn43animate');
    const resetBtn = document.getElementById('btn43reset');

    if (animateBtn) {
        animateBtn.addEventListener('click', () => {
            animating = true;
            draw();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            animating = false;
            draw();
        });
    }

    draw();
}

function initTransformationGrid() {
    const canvas = document.getElementById('canvas-44');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let matrix = [[1, 0], [0, 1]]; // Identity

    function drawGrid(transform = false) {
        clearCanvas(ctx, canvas);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 40;
        const gridSize = 5;

        ctx.strokeStyle = transform ? COLORS.cyan : '#555';
        ctx.lineWidth = 1;

        // Draw grid lines
        for (let i = -gridSize; i <= gridSize; i++) {
            for (let j = -gridSize; j <= gridSize; j++) {
                let x1 = i, y1 = j;
                let x2 = i + 1, y2 = j;
                let x3 = i, y3 = j + 1;

                if (transform) {
                    [x1, y1] = [matrix[0][0] * i + matrix[0][1] * j, matrix[1][0] * i + matrix[1][1] * j];
                    [x2, y2] = [matrix[0][0] * (i + 1) + matrix[0][1] * j, matrix[1][0] * (i + 1) + matrix[1][1] * j];
                    [x3, y3] = [matrix[0][0] * i + matrix[0][1] * (j + 1), matrix[1][0] * i + matrix[1][1] * (j + 1)];
                }

                drawLine(ctx, centerX + x1 * scale, centerY - y1 * scale, centerX + x2 * scale, centerY - y2 * scale, ctx.strokeStyle, 1);
                drawLine(ctx, centerX + x1 * scale, centerY - y1 * scale, centerX + x3 * scale, centerY - y3 * scale, ctx.strokeStyle, 1);
            }
        }

        // Draw i-hat and j-hat
        const iHat = transform ? [matrix[0][0], matrix[1][0]] : [1, 0];
        const jHat = transform ? [matrix[0][1], matrix[1][1]] : [0, 1];

        drawLine(ctx, centerX, centerY, centerX + iHat[0] * scale, centerY - iHat[1] * scale, COLORS.orange, 3);
        drawLine(ctx, centerX, centerY, centerX + jHat[0] * scale, centerY - jHat[1] * scale, COLORS.green, 3);
    }

    const select = document.getElementById('select44');
    const applyBtn = document.getElementById('btn44apply');

    if (applyBtn && select) {
        applyBtn.addEventListener('click', () => {
            const type = select.value;
            switch (type) {
                case 'rotation':
                    matrix = [[0, -1], [1, 0]];
                    break;
                case 'shear':
                    matrix = [[1, 1], [0, 1]];
                    break;
                case 'reflection':
                    matrix = [[1, 0], [0, -1]];
                    break;
                default:
                    matrix = [[1, 0], [0, 1]];
            }
            drawGrid(true);
        });
    }

    drawGrid(false);
}

// ===== EIGENVECTOR VISUALIZATION (UPDATED) =====
function initEigenvectorCanvas() {
    const canvas = document.getElementById('canvas-54');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let transformed = false;

    // Matrix A = [[2, 0], [0, 1]]
    const matrix = [[2, 0], [0, 1]];

    // Test vectors
    const vectors = [
        { x: 1, y: 1, color: '#4a90e2', label: '[1,1] Not Eigenvector', isEigen: false },
        { x: 1, y: 0, color: '#51cf66', label: '[1,0] Eigenvector \u03bb=2', isEigen: true, lambda: 2 },
        { x: 0, y: 1, color: '#ffd93d', label: '[0,1] Eigenvector \u03bb=1', isEigen: true, lambda: 1 }
    ];

    function applyMatrix(v) {
        return {
            x: matrix[0][0] * v.x + matrix[0][1] * v.y,
            y: matrix[1][0] * v.x + matrix[1][1] * v.y
        };
    }

    function draw() {
        clearCanvas(ctx, canvas);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 80;

        // Title
        drawText(ctx, transformed ? 'After: A \u00d7 v (Matrix Applied)' : 'Before: Original Vectors', centerX, 25, 16, COLORS.cyan);
        drawText(ctx, 'Matrix A = [[2, 0], [0, 1]] \u2014 Stretches x-axis by 2', centerX, 45, 12, COLORS.textSecondary);

        // Draw grid
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        for (let i = -4; i <= 4; i++) {
            drawLine(ctx, centerX + i * scale, 60, centerX + i * scale, canvas.height - 40, 'rgba(255,255,255,0.1)', 1);
            drawLine(ctx, 40, centerY + i * scale, canvas.width - 40, centerY + i * scale, 'rgba(255,255,255,0.1)', 1);
        }

        // Draw axes
        drawLine(ctx, 40, centerY, canvas.width - 40, centerY, COLORS.text, 2);
        drawLine(ctx, centerX, 60, centerX, canvas.height - 40, COLORS.text, 2);

        // Draw vectors
        vectors.forEach((v, idx) => {
            let displayV = transformed ? applyMatrix(v) : v;

            const endX = centerX + displayV.x * scale;
            const endY = centerY - displayV.y * scale;

            // Draw vector arrow
            ctx.beginPath();
            ctx.strokeStyle = v.color;
            ctx.lineWidth = 3;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Arrow head
            const angle = Math.atan2(centerY - endY, endX - centerX);
            ctx.beginPath();
            ctx.fillStyle = v.color;
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - 15 * Math.cos(angle - 0.3), endY + 15 * Math.sin(angle - 0.3));
            ctx.lineTo(endX - 15 * Math.cos(angle + 0.3), endY + 15 * Math.sin(angle + 0.3));
            ctx.closePath();
            ctx.fill();

            // Label
            const labelX = endX + 20;
            const labelY = endY - 10;
            drawText(ctx, `[${displayV.x.toFixed(1)}, ${displayV.y.toFixed(1)}]`, labelX, labelY, 11, v.color, 'left');
        });

        // Legend
        const legendY = canvas.height - 25;
        vectors.forEach((v, idx) => {
            const x = 80 + idx * 220;
            drawCircle(ctx, x, legendY, 6, v.color);
            drawText(ctx, v.label, x + 15, legendY + 4, 10, COLORS.text, 'left');
        });
    }

    const transformBtn = document.getElementById('btn54transform');
    const resetBtn = document.getElementById('btn54reset');

    if (transformBtn) {
        transformBtn.addEventListener('click', () => {
            transformed = true;
            draw();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            transformed = false;
            draw();
        });
    }

    draw();
}

// ===== CALCULUS VISUALIZATIONS =====

function initCircleAreaCanvas() {
    const canvas = document.getElementById('canvas-58');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let unwrapping = false;
    let progress = 0;

    function draw() {
        clearCanvas(ctx, canvas);

        const centerX = canvas.width / 4;
        const centerY = canvas.height / 2;
        const radius = 100;

        if (!unwrapping) {
            // Draw circle
            drawCircle(ctx, centerX, centerY, radius, COLORS.cyan, false);
            drawText(ctx, 'Circle: Area = πr²', centerX, centerY + radius + 30, 14, COLORS.cyan);
        } else {
            // Draw unwrapped rings
            const rings = 20;
            for (let i = 0; i < rings * progress; i++) {
                const r = (i / rings) * radius;
                const rectX = canvas.width / 2 + i * 3;
                const rectY = centerY - r;
                const rectHeight = 2 * r;
                const dr = radius / rings;

                ctx.fillStyle = COLORS.cyan;
                ctx.globalAlpha = 0.6;
                ctx.fillRect(rectX, rectY, 2, rectHeight);
            }
            ctx.globalAlpha = 1;

            if (progress >= 0.99) {
                drawText(ctx, 'Integrated! Area = πr²', canvas.width * 0.7, centerY + 50, 14, COLORS.green);
            }
        }
    }

    const animateBtn = document.getElementById('btn58animate');
    const resetBtn = document.getElementById('btn58reset');

    if (animateBtn) {
        animateBtn.addEventListener('click', () => {
            unwrapping = true;
            progress = 0;
            const interval = setInterval(() => {
                progress += 0.02;
                draw();
                if (progress >= 1) {
                    clearInterval(interval);
                }
            }, 50);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            unwrapping = false;
            progress = 0;
            draw();
        });
    }

    draw();
}

function initDerivativeCanvas() {
    const canvas = document.getElementById('canvas-59');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let dx = 1.0;

    function f(x) {
        return 0.02 * x * x;
    }

    function draw() {
        clearCanvas(ctx, canvas);

        const scale = 50;
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.8;

        // Draw axes
        drawLine(ctx, 50, centerY, canvas.width - 50, centerY, '#555', 1);
        drawLine(ctx, centerX, 50, centerX, canvas.height - 50, '#555', 1);

        // Draw function
        ctx.beginPath();
        for (let x = -canvas.width / 2; x < canvas.width / 2; x += 2) {
            const px = centerX + x;
            const py = centerY - f(x) * scale;
            if (x === -canvas.width / 2) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.strokeStyle = COLORS.cyan;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw secant line
        const x0 = 0;
        const x1 = dx * scale;
        const y0 = centerY - f(x0) * scale;
        const y1 = centerY - f(x1) * scale;

        drawLine(ctx, centerX + x0 - 50, y0 - (y1 - y0) / x1 * 50, centerX + x1 + 50, y1 + (y1 - y0) / x1 * 50, COLORS.orange, 2);
        drawCircle(ctx, centerX + x0, y0, 5, COLORS.green);
        drawCircle(ctx, centerX + x1, y1, 5, COLORS.green);

        const slope = (f(x1 / scale) - f(0)) / (x1 / scale);
        drawText(ctx, `Slope = ${slope.toFixed(3)}`, canvas.width / 2, 40, 14, COLORS.orange);
        drawText(ctx, `As Δx → 0, slope → derivative`, canvas.width / 2, 60, 12, COLORS.text);
    }

    const slider = document.getElementById('slider59dx');
    const label = document.getElementById('label59dx');

    if (slider) {
        slider.addEventListener('input', (e) => {
            dx = parseFloat(e.target.value);
            if (label) label.textContent = dx.toFixed(1);
            draw();
        });
    }

    draw();
}

function initRiemannSumCanvas() {
    const canvas = document.getElementById('canvas-64');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let n = 8;

    function f(x) {
        return 50 + 50 * Math.sin(x / 30);
    }

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 50;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;

        // Draw axes
        drawLine(ctx, padding, height + padding, canvas.width - padding, height + padding, '#555', 2);
        drawLine(ctx, padding, padding, padding, height + padding, '#555', 2);

        // Draw function
        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
            const px = padding + x;
            const py = height + padding - f(x);
            if (x === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.strokeStyle = COLORS.cyan;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw rectangles
        const rectWidth = width / n;
        let totalArea = 0;

        for (let i = 0; i < n; i++) {
            const x = i * rectWidth;
            const rectHeight = f(x);
            totalArea += rectWidth * rectHeight;

            ctx.fillStyle = COLORS.orange;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(padding + x, height + padding - rectHeight, rectWidth, rectHeight);
            ctx.strokeStyle = COLORS.orange;
            ctx.globalAlpha = 1;
            ctx.strokeRect(padding + x, height + padding - rectHeight, rectWidth, rectHeight);
        }

        drawText(ctx, `Rectangles: ${n}`, canvas.width / 2, 30, 14, COLORS.text);
        drawText(ctx, `Approximate Area: ${(totalArea / 100).toFixed(2)}`, canvas.width / 2, 50, 12, COLORS.orange);
    }

    const slider = document.getElementById('slider64n');
    const label = document.getElementById('label64n');

    if (slider) {
        slider.addEventListener('input', (e) => {
            n = parseInt(e.target.value);
            if (label) label.textContent = n;
            draw();
        });
    }

    draw();
}

function initTaylorSeriesCanvas() {
    const canvas = document.getElementById('canvas-68');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let degree = 1;
    let func = 'sin';

    function draw() {
        clearCanvas(ctx, canvas);

        const scale = 50;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Draw axes
        drawLine(ctx, 50, centerY, canvas.width - 50, centerY, '#555', 1);
        drawLine(ctx, centerX, 50, centerX, canvas.height - 50, '#555', 1);

        // Draw actual function
        ctx.beginPath();
        for (let x = -canvas.width / 2; x < canvas.width / 2; x += 2) {
            const t = x / scale;
            let y;
            if (func === 'sin') y = Math.sin(t);
            else if (func === 'cos') y = Math.cos(t);
            else y = Math.exp(t);

            const px = centerX + x;
            const py = centerY - y * scale;
            if (x === -canvas.width / 2) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.strokeStyle = COLORS.cyan;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Taylor approximation
        ctx.beginPath();
        for (let x = -canvas.width / 2; x < canvas.width / 2; x += 2) {
            const t = x / scale;
            let y = 0;

            if (func === 'sin') {
                for (let n = 0; n <= degree; n++) {
                    const term = Math.pow(-1, n) * Math.pow(t, 2 * n + 1) / factorial(2 * n + 1);
                    y += term;
                }
            } else if (func === 'cos') {
                for (let n = 0; n <= degree; n++) {
                    const term = Math.pow(-1, n) * Math.pow(t, 2 * n) / factorial(2 * n);
                    y += term;
                }
            } else {
                for (let n = 0; n <= degree; n++) {
                    y += Math.pow(t, n) / factorial(n);
                }
            }

            const px = centerX + x;
            const py = centerY - y * scale;
            if (x === -canvas.width / 2) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.strokeStyle = COLORS.orange;
        ctx.lineWidth = 3;
        ctx.stroke();

        drawText(ctx, `Function: ${func}(x)`, canvas.width / 2, 30, 14, COLORS.cyan);
        drawText(ctx, `Taylor degree: ${degree}`, canvas.width / 2, 50, 14, COLORS.orange);
    }

    function factorial(n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    const slider = document.getElementById('slider68degree');
    const label = document.getElementById('label68degree');
    const select = document.getElementById('select68func');

    if (slider) {
        slider.addEventListener('input', (e) => {
            degree = parseInt(e.target.value);
            if (label) label.textContent = degree;
            draw();
        });
    }

    if (select) {
        select.addEventListener('change', (e) => {
            func = e.target.value;
            draw();
        });
    }

    draw();
}

// ===== INTERACTIVE ELEMENTS =====
function initInteractiveElements() {
    // Add any additional interactive elements here
    // Such as tooltips, modals, etc.
}

// ===== HELPER FUNCTIONS =====
function generateRandomData(count, min, max) {
    return Array.from({ length: count }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

function formatNumber(num, decimals = 2) {
    return Number(num).toFixed(decimals);
}

// ===== ANIMATION LOOP =====
function startAnimation(canvasId, animationFunction) {
    if (animationFrames[canvasId]) {
        cancelAnimationFrame(animationFrames[canvasId]);
    }

    function animate() {
        animationFunction();
        animationFrames[canvasId] = requestAnimationFrame(animate);
    }

    animate();
}

function stopAnimation(canvasId) {
    if (animationFrames[canvasId]) {
        cancelAnimationFrame(animationFrames[canvasId]);
        delete animationFrames[canvasId];
    }
}

// ===== CONSOLE LOG =====

// ===== ADDITIONAL ML VISUALIZATIONS =====

function initMLSVMCanvas() {
    const canvas = document.getElementById('canvas-ml-9');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Generate two-class data
    const class1 = Array.from({ length: 20 }, () => ({
        x: Math.random() * 100 + 50,
        y: Math.random() * 100 + 50
    }));
    const class2 = Array.from({ length: 20 }, () => ({
        x: Math.random() * 100 + 200,
        y: Math.random() * 100 + 200
    }));

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 50;

        // Draw decision boundary (simplified)
        drawLine(ctx, padding, canvas.height - padding, canvas.width - padding, padding, COLORS.orange, 3);
        drawText(ctx, 'Decision Boundary', canvas.width / 2, 30, 14, COLORS.orange);

        // Draw margin lines
        drawLine(ctx, padding, canvas.height - padding - 30, canvas.width - padding, padding - 30, COLORS.green, 1);
        drawLine(ctx, padding, canvas.height - padding + 30, canvas.width - padding, padding + 30, COLORS.green, 1);
        drawText(ctx, 'Maximum Margin', canvas.width / 2, 50, 12, COLORS.green);

        // Draw data points
        class1.forEach(p => drawCircle(ctx, p.x, p.y, 6, COLORS.cyan));
        class2.forEach(p => drawCircle(ctx, p.x, p.y, 6, COLORS.primary));
    }

    draw();
}

function initMLRandomForestCanvas() {
    const canvas = document.getElementById('canvas-ml-12');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function draw() {
        clearCanvas(ctx, canvas);

        drawText(ctx, 'Random Forest: Ensemble of Decision Trees', canvas.width / 2, 50, 16, COLORS.cyan);

        // Draw multiple trees
        const treeCount = 5;
        const treeWidth = (canvas.width - 100) / treeCount;

        for (let i = 0; i < treeCount; i++) {
            const x = 50 + i * treeWidth + treeWidth / 2;
            const y = 100;

            // Draw simple tree structure
            drawLine(ctx, x, y, x - 30, y + 60, COLORS.green, 2);
            drawLine(ctx, x, y, x + 30, y + 60, COLORS.green, 2);
            drawCircle(ctx, x, y, 8, COLORS.cyan);
            drawCircle(ctx, x - 30, y + 60, 6, COLORS.orange);
            drawCircle(ctx, x + 30, y + 60, 6, COLORS.orange);

            drawText(ctx, `Tree ${i + 1}`, x, y + 100, 12, COLORS.text);
        }

        // Draw voting arrow
        drawLine(ctx, canvas.width / 2, 200, canvas.width / 2, 280, COLORS.orange, 3);
        drawText(ctx, '↓ Majority Vote', canvas.width / 2 + 10, 250, 14, COLORS.orange, 'left');

        drawRect(ctx, canvas.width / 2 - 80, 280, 160, 40, COLORS.green);
        drawText(ctx, 'Final Prediction', canvas.width / 2, 305, 14, '#000');
    }

    draw();
}

function initMLGradientBoostingCanvas() {
    const canvas = document.getElementById('canvas-ml-13');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function draw() {
        clearCanvas(ctx, canvas);

        drawText(ctx, 'Gradient Boosting: Sequential Error Correction', canvas.width / 2, 40, 16, COLORS.cyan);

        const stages = 4;
        const stageWidth = (canvas.width - 100) / stages;

        for (let i = 0; i < stages; i++) {
            const x = 50 + i * stageWidth;
            const y = canvas.height / 2;

            // Draw tree
            drawRect(ctx, x, y - 40, stageWidth - 40, 80, i === 0 ? COLORS.cyan : COLORS.orange, false);
            drawText(ctx, `Tree ${i + 1}`, x + (stageWidth - 40) / 2, y, 12, COLORS.text);
            drawText(ctx, i === 0 ? 'Base' : 'Fix Errors', x + (stageWidth - 40) / 2, y + 20, 10, COLORS.textSecondary);

            // Draw arrow
            if (i < stages - 1) {
                drawLine(ctx, x + stageWidth - 40, y, x + stageWidth, y, COLORS.green, 2);
                drawText(ctx, '+', x + stageWidth - 20, y - 10, 16, COLORS.green);
            }
        }

        drawText(ctx, 'Each tree learns from previous mistakes', canvas.width / 2, canvas.height - 30, 12, COLORS.text);
    }

    draw();
}

function initMLNeuralNetworkCanvas() {
    const canvas = document.getElementById('canvas-ml-14');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function draw() {
        clearCanvas(ctx, canvas);

        drawText(ctx, 'Neural Network Architecture', canvas.width / 2, 30, 16, COLORS.cyan);

        const layers = [3, 5, 4, 2]; // neurons per layer
        const layerSpacing = (canvas.width - 100) / (layers.length - 1);

        // Draw connections
        ctx.globalAlpha = 0.3;
        for (let l = 0; l < layers.length - 1; l++) {
            const x1 = 50 + l * layerSpacing;
            const x2 = 50 + (l + 1) * layerSpacing;

            for (let i = 0; i < layers[l]; i++) {
                const y1 = canvas.height / 2 - (layers[l] - 1) * 15 + i * 30;
                for (let j = 0; j < layers[l + 1]; j++) {
                    const y2 = canvas.height / 2 - (layers[l + 1] - 1) * 15 + j * 30;
                    drawLine(ctx, x1, y1, x2, y2, COLORS.textSecondary, 1);
                }
            }
        }
        ctx.globalAlpha = 1;

        // Draw neurons
        layers.forEach((count, l) => {
            const x = 50 + l * layerSpacing;
            for (let i = 0; i < count; i++) {
                const y = canvas.height / 2 - (count - 1) * 15 + i * 30;
                drawCircle(ctx, x, y, 12, l === 0 ? COLORS.cyan : (l === layers.length - 1 ? COLORS.green : COLORS.orange));
            }

            const layerNames = ['Input', 'Hidden 1', 'Hidden 2', 'Output'];
            drawText(ctx, layerNames[l], x, canvas.height - 30, 12, COLORS.text);
        });
    }

    draw();
}

// ===== DATA SCIENCE VISUALIZATIONS =====

function initSimpleRegressionCanvas() {
    const canvas = document.getElementById('canvas-70');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let showLine = false;

    // Sample data
    const data = [
        { x: 1, y: 2.1 }, { x: 2, y: 4.2 }, { x: 3, y: 5.8 }, { x: 4, y: 8.1 },
        { x: 5, y: 10.3 }, { x: 6, y: 12.1 }, { x: 7, y: 13.9 }, { x: 8, y: 16.2 },
        { x: 9, y: 18.1 }, { x: 10, y: 20.0 }
    ];

    function calculateRegression() {
        const n = data.length;
        const sumX = data.reduce((s, p) => s + p.x, 0);
        const sumY = data.reduce((s, p) => s + p.y, 0);
        const sumXY = data.reduce((s, p) => s + p.x * p.y, 0);
        const sumX2 = data.reduce((s, p) => s + p.x * p.x, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return { slope, intercept };
    }

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 60;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;

        const maxX = 11;
        const maxY = 22;

        // Draw axes
        drawLine(ctx, padding, canvas.height - padding, canvas.width - padding, canvas.height - padding, COLORS.text, 2);
        drawLine(ctx, padding, padding, padding, canvas.height - padding, COLORS.text, 2);

        // Draw grid
        for (let i = 0; i <= 10; i++) {
            const x = padding + (i / maxX) * width;
            const y = canvas.height - padding - (i * 2 / maxY) * height;
            drawLine(ctx, x, canvas.height - padding, x, canvas.height - padding + 5, COLORS.textSecondary, 1);
            drawText(ctx, i.toString(), x, canvas.height - padding + 20, 10, COLORS.textSecondary);

            if (i * 2 <= maxY) {
                drawLine(ctx, padding - 5, y, padding, y, COLORS.textSecondary, 1);
                drawText(ctx, (i * 2).toString(), padding - 15, y + 4, 10, COLORS.textSecondary, 'right');
            }
        }

        // Draw labels
        drawText(ctx, 'X', canvas.width - padding + 20, canvas.height - padding + 4, 12, COLORS.cyan);
        drawText(ctx, 'Y', padding - 4, padding - 20, 12, COLORS.cyan);

        // Draw data points
        data.forEach(point => {
            const x = padding + (point.x / maxX) * width;
            const y = canvas.height - padding - (point.y / maxY) * height;
            drawCircle(ctx, x, y, 6, COLORS.cyan);
        });

        // Draw regression line
        if (showLine) {
            const { slope, intercept } = calculateRegression();
            const x1 = 0;
            const y1 = intercept;
            const x2 = maxX;
            const y2 = slope * x2 + intercept;

            const px1 = padding + (x1 / maxX) * width;
            const py1 = canvas.height - padding - (y1 / maxY) * height;
            const px2 = padding + (x2 / maxX) * width;
            const py2 = canvas.height - padding - (y2 / maxY) * height;

            drawLine(ctx, px1, py1, px2, py2, COLORS.orange, 3);

            // Calculate R²
            const meanY = data.reduce((s, p) => s + p.y, 0) / data.length;
            let ssTot = 0, ssRes = 0;
            data.forEach(point => {
                const predicted = slope * point.x + intercept;
                ssRes += Math.pow(point.y - predicted, 2);
                ssTot += Math.pow(point.y - meanY, 2);
            });
            const r2 = 1 - (ssRes / ssTot);

            drawText(ctx, `y = ${intercept.toFixed(2)} + ${slope.toFixed(2)}x`, canvas.width / 2, 30, 14, COLORS.orange);
            drawText(ctx, `R² = ${r2.toFixed(4)}`, canvas.width / 2, 50, 14, COLORS.green);
        } else {
            drawText(ctx, 'Click "Fit Regression Line" to see the best fit', canvas.width / 2, 30, 14, COLORS.text);
        }
    }

    const fitBtn = document.getElementById('btn70fit');
    const resetBtn = document.getElementById('btn70reset');

    if (fitBtn) {
        fitBtn.addEventListener('click', () => {
            showLine = true;
            draw();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            showLine = false;
            draw();
        });
    }

    draw();
}

function initLogisticRegressionCanvas() {
    const canvas = document.getElementById('canvas-72');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let threshold = 0.5;

    function sigmoid(z) {
        return 1 / (1 + Math.exp(-z));
    }

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 60;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;

        // Draw axes
        const centerY = canvas.height / 2;
        drawLine(ctx, padding, centerY, canvas.width - padding, centerY, COLORS.text, 2);
        drawLine(ctx, canvas.width / 2, padding, canvas.width / 2, canvas.height - padding, COLORS.text, 2);

        // Draw sigmoid curve
        ctx.beginPath();
        for (let x = -6; x <= 6; x += 0.1) {
            const px = canvas.width / 2 + (x / 6) * (width / 2);
            const y = sigmoid(x);
            const py = canvas.height - padding - y * height;
            if (x === -6) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.strokeStyle = COLORS.cyan;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw threshold line
        const thresholdY = canvas.height - padding - threshold * height;
        drawLine(ctx, padding, thresholdY, canvas.width - padding, thresholdY, COLORS.orange, 2);
        drawText(ctx, `Threshold = ${threshold.toFixed(2)}`, canvas.width - 100, thresholdY - 10, 12, COLORS.orange);

        // Draw labels
        drawText(ctx, 'P(y=1) = σ(z) = 1/(1+e^(-z))', canvas.width / 2, 30, 14, COLORS.cyan);
        drawText(ctx, 'Class 1 (if P ≥ threshold)', canvas.width - 150, thresholdY - 30, 12, COLORS.green);
        drawText(ctx, 'Class 0 (if P < threshold)', canvas.width - 150, thresholdY + 30, 12, COLORS.textSecondary);

        // Draw axis labels
        drawText(ctx, '0', canvas.width / 2 + 5, centerY + 20, 10, COLORS.text, 'left');
        drawText(ctx, '1', padding - 20, padding + 10, 10, COLORS.text);
    }

    const slider = document.getElementById('slider72');
    const label = document.getElementById('label72');

    if (slider) {
        slider.addEventListener('input', (e) => {
            threshold = parseFloat(e.target.value);
            if (label) label.textContent = threshold.toFixed(2);
            draw();
        });
    }

    draw();
}

function initPolynomialRegressionCanvas() {
    const canvas = document.getElementById('canvas-74');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let degree = 1;

    // Generate sample data with some noise
    const trueFunc = (x) => 0.5 * x * x - 3 * x + 5;
    const data = [];
    for (let x = 0; x <= 10; x += 0.5) {
        data.push({ x, y: trueFunc(x) + (Math.random() - 0.5) * 2 });
    }

    function fitPolynomial(degree) {
        // Simple polynomial fit (not production-quality)
        return (x) => {
            if (degree === 1) return 0.5 * x + 1;
            if (degree === 2) return 0.5 * x * x - 3 * x + 5;
            if (degree === 3) return 0.05 * x * x * x - 0.2 * x * x - 2 * x + 5;
            return trueFunc(x);
        };
    }

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 60;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;

        const maxX = 10;
        const maxY = 15;

        // Draw axes
        drawLine(ctx, padding, canvas.height - padding, canvas.width - padding, canvas.height - padding, COLORS.text, 2);
        drawLine(ctx, padding, padding, padding, canvas.height - padding, COLORS.text, 2);

        // Draw data points
        data.forEach(point => {
            const px = padding + (point.x / maxX) * width;
            const py = canvas.height - padding - (point.y / maxY) * height;
            drawCircle(ctx, px, py, 4, COLORS.cyan);
        });

        // Draw polynomial fit
        const polyFunc = fitPolynomial(degree);
        ctx.beginPath();
        for (let x = 0; x <= maxX; x += 0.1) {
            const px = padding + (x / maxX) * width;
            const y = polyFunc(x);
            const py = canvas.height - padding - (y / maxY) * height;
            if (x === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.strokeStyle = COLORS.orange;
        ctx.lineWidth = 3;
        ctx.stroke();

        drawText(ctx, `Polynomial Degree: ${degree}`, canvas.width / 2, 30, 14, COLORS.orange);

        if (degree > 5) {
            drawText(ctx, 'High degree may overfit!', canvas.width / 2, 50, 12, COLORS.orange);
        }
    }

    const slider = document.getElementById('slider74');
    const label = document.getElementById('label74');

    if (slider) {
        slider.addEventListener('input', (e) => {
            degree = parseInt(e.target.value);
            if (label) label.textContent = degree;
            draw();
        });
    }

    draw();
}

function initPCACanvas() {
    const canvas = document.getElementById('canvas-77');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let showPCs = false;

    // Generate 2D data
    const data = [];
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * 4 - 2;
        const y = 0.8 * x + Math.random() * 0.5;
        data.push({ x, y });
    }

    function draw() {
        clearCanvas(ctx, canvas);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 80;

        // Draw axes
        drawLine(ctx, 0, centerY, canvas.width, centerY, '#555', 1);
        drawLine(ctx, centerX, 0, centerX, canvas.height, '#555', 1);

        // Draw data points
        data.forEach(point => {
            const px = centerX + point.x * scale;
            const py = centerY - point.y * scale;
            drawCircle(ctx, px, py, 5, COLORS.cyan);
        });

        if (showPCs) {
            // Draw PC1 (main direction)
            const pc1Angle = Math.atan(0.8);
            const pc1Length = 150;
            drawLine(ctx,
                centerX - pc1Length * Math.cos(pc1Angle),
                centerY + pc1Length * Math.sin(pc1Angle),
                centerX + pc1Length * Math.cos(pc1Angle),
                centerY - pc1Length * Math.sin(pc1Angle),
                COLORS.orange, 3
            );
            drawText(ctx, 'PC1 (80% variance)', centerX + 100, centerY - 80, 14, COLORS.orange);

            // Draw PC2 (perpendicular)
            const pc2Angle = pc1Angle + Math.PI / 2;
            const pc2Length = 80;
            drawLine(ctx,
                centerX - pc2Length * Math.cos(pc2Angle),
                centerY + pc2Length * Math.sin(pc2Angle),
                centerX + pc2Length * Math.cos(pc2Angle),
                centerY - pc2Length * Math.sin(pc2Angle),
                COLORS.green, 3
            );
            drawText(ctx, 'PC2 (20% variance)', centerX - 100, centerY - 80, 14, COLORS.green);
        }

        drawText(ctx, 'PCA finds directions of maximum variance', canvas.width / 2, 30, 14, COLORS.cyan);
    }

    const projectBtn = document.getElementById('btn77project');
    const resetBtn = document.getElementById('btn77reset');

    if (projectBtn) {
        projectBtn.addEventListener('click', () => {
            showPCs = true;
            draw();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            showPCs = false;
            draw();
        });
    }

    draw();
}

function initGradientDescentCanvas() {
    const canvas = document.getElementById('canvas-80');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let learningRate = 0.1;
    let animating = false;
    let path = [];

    // Simple quadratic function
    const f = (x) => (x - 3) * (x - 3) + 2;
    const df = (x) => 2 * (x - 3);

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 60;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;
        const xMin = 0, xMax = 6;
        const yMax = 12;

        // Draw axes
        drawLine(ctx, padding, canvas.height - padding, canvas.width - padding, canvas.height - padding, COLORS.text, 2);
        drawLine(ctx, padding, padding, padding, canvas.height - padding, COLORS.text, 2);

        // Draw function
        ctx.beginPath();
        for (let x = xMin; x <= xMax; x += 0.05) {
            const px = padding + ((x - xMin) / (xMax - xMin)) * width;
            const y = f(x);
            const py = canvas.height - padding - (y / yMax) * height;
            if (x === xMin) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.strokeStyle = COLORS.cyan;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw path
        if (path.length > 0) {
            ctx.beginPath();
            path.forEach((point, i) => {
                const px = padding + ((point.x - xMin) / (xMax - xMin)) * width;
                const py = canvas.height - padding - (point.y / yMax) * height;

                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
                drawCircle(ctx, px, py, 5, COLORS.orange);
            });
            ctx.strokeStyle = COLORS.orange;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        drawText(ctx, 'Gradient Descent: Following negative gradient to minimum', canvas.width / 2, 30, 14, COLORS.cyan);
        drawText(ctx, `Learning Rate: ${learningRate.toFixed(2)}`, canvas.width / 2, 50, 12, COLORS.text);
    }

    function startDescent() {
        if (animating) return;
        animating = true;
        path = [{ x: 0.5, y: f(0.5) }];

        const interval = setInterval(() => {
            const current = path[path.length - 1];
            const grad = df(current.x);
            const nextX = current.x - learningRate * grad;

            if (Math.abs(grad) < 0.01 || path.length > 50) {
                clearInterval(interval);
                animating = false;
                return;
            }

            path.push({ x: nextX, y: f(nextX) });
            draw();
        }, 200);
    }

    const slider = document.getElementById('slider80');
    const label = document.getElementById('label80');
    const startBtn = document.getElementById('btn80start');
    const resetBtn = document.getElementById('btn80reset');

    if (slider) {
        slider.addEventListener('input', (e) => {
            learningRate = parseFloat(e.target.value);
            if (label) label.textContent = learningRate.toFixed(2);
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', startDescent);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            path = [];
            animating = false;
            draw();
        });
    }

    draw();
}

function initLossLandscapeCanvas() {
    const canvas = document.getElementById('canvas-85');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let lossType = 'mse';

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 60;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;

        // True value
        const trueVal = 5;

        // Draw axes
        drawLine(ctx, padding, canvas.height - padding, canvas.width - padding, canvas.height - padding, COLORS.text, 2);
        drawLine(ctx, padding, padding, padding, canvas.height - padding, COLORS.text, 2);

        // Draw loss function
        ctx.beginPath();
        for (let pred = 0; pred <= 10; pred += 0.1) {
            let loss;
            if (lossType === 'mse') {
                loss = Math.pow(trueVal - pred, 2);
            } else if (lossType === 'mae') {
                loss = Math.abs(trueVal - pred);
            } else {
                // Simplified cross-entropy
                loss = -Math.log(Math.max(0.01, 1 - Math.abs(trueVal - pred) / 10));
            }

            const px = padding + (pred / 10) * width;
            const py = canvas.height - padding - (loss / 30) * height;

            if (pred === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.strokeStyle = COLORS.cyan;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw minimum
        const minX = padding + (trueVal / 10) * width;
        drawLine(ctx, minX, canvas.height - padding, minX, padding, COLORS.orange, 2);
        drawText(ctx, 'Minimum', minX + 10, padding + 20, 12, COLORS.orange);

        const lossNames = {
            'mse': 'Mean Squared Error: (y - ŷ)²',
            'mae': 'Mean Absolute Error: |y - ŷ|',
            'cross': 'Cross-Entropy Loss'
        };

        drawText(ctx, lossNames[lossType], canvas.width / 2, 30, 14, COLORS.cyan);
        drawText(ctx, 'Predicted Value →', canvas.width - 100, canvas.height - 30, 12, COLORS.text);
        drawText(ctx, 'Loss ↑', padding - 40, padding, 12, COLORS.text);
    }

    const select = document.getElementById('select85');
    if (select) {
        select.addEventListener('change', (e) => {
            lossType = e.target.value;
            draw();
        });
    }

    draw();
}

// ========== SEARCH FUNCTIONALITY ==========
function initSearch() {
    const searchInput = document.getElementById('globalSearch');
    const searchResults = document.getElementById('searchResults');

    if (!searchInput || !searchResults) return;

    // Build search index from all topics
    const searchIndex = [];
    document.querySelectorAll('.topic-section').forEach(section => {
        const id = section.id;
        const header = section.querySelector('h2');
        const subtitle = section.querySelector('.topic-subtitle');
        const content = section.textContent.substring(0, 500);
        const subject = section.dataset.subject || 'statistics';

        if (header) {
            searchIndex.push({
                id: id,
                title: header.textContent,
                subtitle: subtitle ? subtitle.textContent : '',
                content: content,
                subject: subject
            });
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }

        const results = searchIndex.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.subtitle.toLowerCase().includes(query) ||
            item.content.toLowerCase().includes(query)
        ).slice(0, 8);

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No topics found for "' + query + '"</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" data-topic-id="${result.id}" data-subject="${result.subject}">
                    <div class="search-result-title">${highlightMatch(result.title, query)}</div>
                    <div class="search-result-subject">${result.subject.replace('-', ' ')}</div>
                </div>
            `).join('');
        }

        searchResults.classList.add('active');
    });

    // Handle result clicks
    searchResults.addEventListener('click', (e) => {
        const item = e.target.closest('.search-result-item');
        if (item) {
            const topicId = item.dataset.topicId;
            const subject = item.dataset.subject;

            // Switch to correct subject first
            switchSubject(subject);

            // Then scroll to topic
            setTimeout(() => {
                const target = document.getElementById(topicId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 200);

            searchResults.classList.remove('active');
            searchInput.value = '';
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });

    // Close on Escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchResults.classList.remove('active');
            searchInput.blur();
        }
    });
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// ========== PROGRESS TRACKING ==========
const STORAGE_KEY = 'math_mastery_progress';

function initProgressTracking() {
    loadProgress();
    addCompletionButtons();
    updateProgressDisplay();
}

function loadProgress() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const completed = JSON.parse(saved);
            completed.forEach(topicId => {
                markTopicComplete(topicId, false);
            });
        }
    } catch (e) {
        console.warn('Could not load progress:', e);
    }
}

function saveProgress() {
    try {
        const completed = [];
        document.querySelectorAll('.topic-complete-btn.completed').forEach(btn => {
            completed.push(btn.dataset.topicId);
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch (e) {
        console.warn('Could not save progress:', e);
    }
}

function addCompletionButtons() {
    document.querySelectorAll('.topic-section').forEach(section => {
        const topicId = section.id;
        const summaryCard = section.querySelector('.summary-card');

        if (summaryCard && !section.querySelector('.topic-complete-btn')) {
            const btn = document.createElement('button');
            btn.className = 'topic-complete-btn';
            btn.dataset.topicId = topicId;
            btn.innerHTML = '<span class="check-icon"></span> Mark as Complete';

            btn.addEventListener('click', () => {
                toggleTopicComplete(topicId);
            });

            summaryCard.appendChild(btn);
        }
    });
}

function toggleTopicComplete(topicId) {
    const btn = document.querySelector(`.topic-complete-btn[data-topic-id="${topicId}"]`);
    if (btn) {
        const isCompleted = btn.classList.toggle('completed');
        btn.innerHTML = isCompleted
            ? '<span class="check-icon"></span> Completed!'
            : '<span class="check-icon"></span> Mark as Complete';

        // Update sidebar link
        const sidebarLink = document.querySelector(`[data-topic="${topicId}"], [data-topic="${topicId.replace('topic-', '')}"]`);
        if (sidebarLink) {
            sidebarLink.classList.toggle('completed', isCompleted);
        }

        saveProgress();
        updateProgressDisplay();
    }
}

function markTopicComplete(topicId, save = true) {
    const btn = document.querySelector(`.topic-complete-btn[data-topic-id="${topicId}"]`);
    if (btn && !btn.classList.contains('completed')) {
        btn.classList.add('completed');
        btn.innerHTML = '<span class="check-icon"></span> Completed!';

        const sidebarLink = document.querySelector(`[data-topic="${topicId}"], [data-topic="${topicId.replace('topic-', '')}"]`);
        if (sidebarLink) {
            sidebarLink.classList.add('completed');
        }

        if (save) {
            saveProgress();
            updateProgressDisplay();
        }
    }
}

function updateProgressDisplay() {
    // Progress bar removed - keeping function for compatibility
    // Can be used for console logging if needed
}

// ========== ROBUST CANVAS INITIALIZATION ==========
function ensureCanvasVisible(canvasId, callback) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Already initialized
    if (canvas.dataset.initialized === 'true') return;

    // Check visibility
    if (canvas.offsetWidth === 0) {
        setTimeout(() => ensureCanvasVisible(canvasId, callback), 100);
        return;
    }

    // Mark and execute
    canvas.dataset.initialized = 'true';
    callback();
}

// ========== LAZY LOADING FOR VISUALIZATIONS ==========
function initLazyLoading() {
    const observerOptions = {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    };

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const canvases = section.querySelectorAll('canvas:not([data-initialized="true"])');

                canvases.forEach(canvas => {
                    const initFn = canvas.dataset.initFn;
                    if (initFn && window[initFn]) {
                        ensureCanvasVisible(canvas.id, window[initFn]);
                    }
                });

                lazyObserver.unobserve(section);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.topic-section').forEach(section => {
        lazyObserver.observe(section);
    });
}

// ========== INTERACTIVE ELEMENTS ==========
function initInteractiveElements() {
    // Toggle visibility for practice answers
    document.querySelectorAll('.show-answers-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const answers = btn.nextElementSibling;
            if (answers && answers.classList.contains('practice-answers')) {
                const isHidden = answers.style.display === 'none' || !answers.style.display;
                answers.style.display = isHidden ? 'block' : 'none';
                btn.textContent = isHidden ? 'Hide Answers' : 'Show Answers';
            }
        });
    });

    // Initialize formula tooltips
    document.querySelectorAll('.formula-var').forEach(el => {
        el.style.cursor = 'help';
    });
}

// ========== KEYBOARD SHORTCUTS ==========
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('globalSearch');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Arrow keys for topic navigation
        if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            navigateTopics(e.key === 'ArrowDown' ? 1 : -1);
        }
    });
}

function navigateTopics(direction) {
    const visibleTopics = Array.from(document.querySelectorAll('.topic-section'))
        .filter(t => t.style.display !== 'none');

    const currentActive = document.querySelector('.topic-link.active');
    let currentIndex = 0;

    if (currentActive) {
        const currentId = currentActive.getAttribute('data-topic');
        currentIndex = visibleTopics.findIndex(t =>
            t.id === currentId || t.id === `topic-${currentId}`
        );
    }

    const newIndex = Math.max(0, Math.min(visibleTopics.length - 1, currentIndex + direction));
    if (visibleTopics[newIndex]) {
        visibleTopics[newIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

console.log('%c📊 Ultimate Learning Platform Loaded', 'color: #64ffda; font-size: 16px; font-weight: bold;');
console.log('%cReady to explore 125+ comprehensive topics across 5 subjects!', 'color: #4a90e2; font-size: 14px;');
console.log('%c✓ Statistics (41) ✓ Linear Algebra (16) ✓ Calculus (12) ✓ Data Science (16) ✓ Machine Learning (40+)', 'color: #51cf66; font-size: 12px;');

// ===== TOGGLE ANSWER FUNCTION =====
/**
 * toggleAnswer - Robust Show/Hide Answer Function for practice problems
 * @param {string} answerId - The ID of the answer element to toggle
 */
function toggleAnswer(answerId) {
    const answerElement = document.getElementById(answerId);

    if (!answerElement) {
        console.warn(`Element with ID "${answerId}" not found.`);
        return;
    }

    // Find the button that triggered this
    const allButtons = document.querySelectorAll('.show-answer-btn');
    let triggerButton = null;

    allButtons.forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(answerId)) {
            triggerButton = btn;
        }
    });

    // Toggle display
    const isHidden = answerElement.style.display === 'none' ||
        getComputedStyle(answerElement).display === 'none' ||
        answerElement.style.display === '';

    if (isHidden) {
        answerElement.style.display = 'block';
        if (triggerButton) {
            triggerButton.textContent = 'Hide Answers';
            triggerButton.classList.add('active');
        }
    } else {
        answerElement.style.display = 'none';
        if (triggerButton) {
            triggerButton.textContent = 'Show Answers';
            triggerButton.classList.remove('active');
        }
    }
}

// ===== FIX ALL SHOW ANSWER BUTTONS (EVENT DELEGATION) =====
document.addEventListener('DOMContentLoaded', function () {
    // Use event delegation to handle all show answer buttons
    document.addEventListener('click', function (e) {
        // Check if clicked element is a show-answers button
        if (e.target.classList.contains('show-answers-btn') ||
            e.target.classList.contains('show-answer-btn')) {

            e.preventDefault();
            e.stopPropagation();

            const btn = e.target;
            const answerDiv = btn.nextElementSibling;

            if (answerDiv && (answerDiv.classList.contains('practice-answers') ||
                answerDiv.classList.contains('answer-content') ||
                answerDiv.id && answerDiv.id.includes('answer'))) {

                // Toggle display
                if (answerDiv.style.display === 'none' || answerDiv.style.display === '') {
                    answerDiv.style.display = 'block';
                    btn.textContent = 'Hide Answers';
                    btn.classList.add('active');
                } else {
                    answerDiv.style.display = 'none';
                    btn.textContent = 'Show Answers';
                    btn.classList.remove('active');
                }
            }
        }
    });

    // Ensure all answer divs start hidden
    document.querySelectorAll('.practice-answers, .answer-content').forEach(el => {
        el.style.display = 'none';
    });

    // Fix button text (remove line breaks)
    document.querySelectorAll('.show-answers-btn, .show-answer-btn').forEach(btn => {
        const text = btn.textContent.trim();
        if (text.includes('Show') && text.includes('Answers')) {
            btn.textContent = 'Show Answers';
        }
    });

    console.log('%c✓ Show Answer Buttons Fixed', 'color: #51cf66;');
});

// ===== TOPIC 10: SKEWNESS VISUALIZATION =====
function initSkewnessVisualization() {
    const canvas = document.getElementById('skewnessCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animating = false;

    function normalPDF(x, mean, std) {
        return Math.exp(-0.5 * Math.pow((x - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
    }

    function betaPDF(x, alpha, beta) {
        if (x <= 0 || x >= 1) return 0;
        const B = (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1));
        return B * 3; // Scale for visibility
    }

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 50;
        const chartWidth = (canvas.width - padding * 4) / 3;
        const chartHeight = canvas.height - padding * 3;

        // Title
        drawText(ctx, 'Types of Skewness: Where Mean, Median, and Mode Fall', canvas.width / 2, 25, 16, COLORS.cyan);

        const charts = [
            { title: 'NEGATIVE (Left) Skew', color: '#64ffda', type: 'left', meanPos: 0.35, medianPos: 0.5, modePos: 0.65 },
            { title: 'SYMMETRIC (No Skew)', color: '#4a90e2', type: 'symmetric', meanPos: 0.5, medianPos: 0.5, modePos: 0.5 },
            { title: 'POSITIVE (Right) Skew', color: '#ff6b6b', type: 'right', meanPos: 0.65, medianPos: 0.5, modePos: 0.35 }
        ];

        charts.forEach((chart, i) => {
            const startX = padding + i * (chartWidth + padding);
            const startY = padding + 30;

            // Draw axes
            drawLine(ctx, startX, startY + chartHeight, startX + chartWidth, startY + chartHeight, COLORS.text, 2);

            // Draw distribution curve
            ctx.beginPath();
            ctx.strokeStyle = chart.color;
            ctx.lineWidth = 3;

            for (let px = 0; px <= chartWidth; px++) {
                const x = px / chartWidth;
                let y;

                if (chart.type === 'left') {
                    y = betaPDF(x, 5, 2);
                } else if (chart.type === 'right') {
                    y = betaPDF(x, 2, 5);
                } else {
                    y = normalPDF(x, 0.5, 0.15) * 0.15;
                }

                const plotX = startX + px;
                const plotY = startY + chartHeight - y * chartHeight * 0.8;

                if (px === 0) ctx.moveTo(plotX, plotY);
                else ctx.lineTo(plotX, plotY);
            }
            ctx.stroke();

            // Fill under curve
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = chart.color;
            ctx.lineTo(startX + chartWidth, startY + chartHeight);
            ctx.lineTo(startX, startY + chartHeight);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;

            // Draw Mean, Median, Mode lines
            const measures = [
                { pos: chart.modePos, label: 'Mode', color: '#ff6b6b', dash: [5, 5] },
                { pos: chart.medianPos, label: 'Median', color: '#ffd93d', dash: [10, 5] },
                { pos: chart.meanPos, label: 'Mean', color: '#51cf66', dash: [2, 2] }
            ];

            measures.forEach((m, idx) => {
                const lineX = startX + m.pos * chartWidth;
                ctx.setLineDash(m.dash);
                drawLine(ctx, lineX, startY + 20, lineX, startY + chartHeight, m.color, 2);
                ctx.setLineDash([]);
                drawText(ctx, m.label, lineX, startY + 10 + idx * 12, 10, m.color);
            });

            // Title
            drawText(ctx, chart.title, startX + chartWidth / 2, startY + chartHeight + 25, 12, chart.color);

            // Relationship text
            let relText = '';
            if (chart.type === 'left') relText = 'Mean < Median < Mode';
            else if (chart.type === 'right') relText = 'Mode < Median < Mean';
            else relText = 'Mean = Median = Mode';
            drawText(ctx, relText, startX + chartWidth / 2, startY + chartHeight + 45, 10, COLORS.text);
        });
    }

    const animateBtn = document.getElementById('skewnessAnimateBtn');
    const resetBtn = document.getElementById('skewnessResetBtn');

    if (animateBtn) animateBtn.addEventListener('click', draw);
    if (resetBtn) resetBtn.addEventListener('click', draw);

    draw();
}

// ===== TOPIC 20: PDF vs CDF VISUALIZATION =====
function initPDFCDFVisualization() {
    const canvas = document.getElementById('pdfCdfCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let rangeStart = 3, rangeEnd = 7;

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 60;
        const chartWidth = (canvas.width - padding * 3) / 2;
        const chartHeight = canvas.height - padding * 2.5;

        // Title
        drawText(ctx, 'PDF vs CDF: Uniform Distribution [0, 10]', canvas.width / 2, 25, 16, COLORS.cyan);

        // PDF (Left side)
        const pdfStartX = padding;
        const pdfStartY = padding + 20;

        drawText(ctx, 'PDF: Probability Density Function', pdfStartX + chartWidth / 2, pdfStartY - 5, 14, '#64ffda');

        // Axes
        drawLine(ctx, pdfStartX, pdfStartY + chartHeight, pdfStartX + chartWidth, pdfStartY + chartHeight, COLORS.text, 2);
        drawLine(ctx, pdfStartX, pdfStartY, pdfStartX, pdfStartY + chartHeight, COLORS.text, 2);

        // X-axis labels
        for (let i = 0; i <= 10; i += 2) {
            const x = pdfStartX + (i / 10) * chartWidth;
            drawText(ctx, i.toString(), x, pdfStartY + chartHeight + 15, 10, COLORS.textSecondary);
        }

        // PDF rectangle (height = 0.1 for uniform [0,10])
        const pdfHeight = chartHeight * 0.4;
        ctx.fillStyle = 'rgba(100, 255, 218, 0.2)';
        ctx.fillRect(pdfStartX, pdfStartY + chartHeight - pdfHeight, chartWidth, pdfHeight);
        ctx.strokeStyle = '#64ffda';
        ctx.lineWidth = 2;
        ctx.strokeRect(pdfStartX, pdfStartY + chartHeight - pdfHeight, chartWidth, pdfHeight);

        // Shade the selected range
        const rangeX1 = pdfStartX + (rangeStart / 10) * chartWidth;
        const rangeX2 = pdfStartX + (rangeEnd / 10) * chartWidth;
        ctx.fillStyle = 'rgba(255, 107, 107, 0.5)';
        ctx.fillRect(rangeX1, pdfStartY + chartHeight - pdfHeight, rangeX2 - rangeX1, pdfHeight);

        // Labels
        drawText(ctx, 'Height = 0.1', pdfStartX + chartWidth + 10, pdfStartY + chartHeight - pdfHeight / 2, 10, COLORS.cyan, 'left');
        const prob = ((rangeEnd - rangeStart) / 10).toFixed(2);
        drawText(ctx, `P(${rangeStart} ≤ X ≤ ${rangeEnd}) = ${prob}`, pdfStartX + chartWidth / 2, pdfStartY + chartHeight - pdfHeight - 15, 12, '#ff6b6b');
        drawText(ctx, `Area = (${rangeEnd}-${rangeStart}) × 0.1 = ${prob}`, pdfStartX + chartWidth / 2, pdfStartY + chartHeight - pdfHeight / 2, 11, '#ff6b6b');

        // CDF (Right side)
        const cdfStartX = padding * 2 + chartWidth;
        const cdfStartY = pdfStartY;

        drawText(ctx, 'CDF: Cumulative Distribution Function', cdfStartX + chartWidth / 2, cdfStartY - 5, 14, '#ff6b6b');

        // Axes
        drawLine(ctx, cdfStartX, cdfStartY + chartHeight, cdfStartX + chartWidth, cdfStartY + chartHeight, COLORS.text, 2);
        drawLine(ctx, cdfStartX, cdfStartY, cdfStartX, cdfStartY + chartHeight, COLORS.text, 2);

        // X-axis labels
        for (let i = 0; i <= 10; i += 2) {
            const x = cdfStartX + (i / 10) * chartWidth;
            drawText(ctx, i.toString(), x, cdfStartY + chartHeight + 15, 10, COLORS.textSecondary);
        }

        // Y-axis labels
        for (let i = 0; i <= 1; i += 0.2) {
            const y = cdfStartY + chartHeight - i * chartHeight;
            drawText(ctx, i.toFixed(1), cdfStartX - 20, y + 4, 10, COLORS.textSecondary);
        }

        // CDF ramp line
        ctx.beginPath();
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.moveTo(cdfStartX, cdfStartY + chartHeight);
        ctx.lineTo(cdfStartX + chartWidth, cdfStartY);
        ctx.stroke();

        // Mark points for selected range
        const cdfY1 = cdfStartY + chartHeight - (rangeStart / 10) * chartHeight;
        const cdfY2 = cdfStartY + chartHeight - (rangeEnd / 10) * chartHeight;
        const cdfX1 = cdfStartX + (rangeStart / 10) * chartWidth;
        const cdfX2 = cdfStartX + (rangeEnd / 10) * chartWidth;

        drawCircle(ctx, cdfX1, cdfY1, 6, '#ffd93d');
        drawCircle(ctx, cdfX2, cdfY2, 6, '#ffd93d');

        // Dashed lines to points
        ctx.setLineDash([5, 5]);
        drawLine(ctx, cdfX1, cdfY1, cdfX1, cdfStartY + chartHeight, '#ffd93d', 1);
        drawLine(ctx, cdfX2, cdfY2, cdfX2, cdfStartY + chartHeight, '#ffd93d', 1);
        drawLine(ctx, cdfStartX, cdfY1, cdfX1, cdfY1, '#ffd93d', 1);
        drawLine(ctx, cdfStartX, cdfY2, cdfX2, cdfY2, '#ffd93d', 1);
        ctx.setLineDash([]);

        drawText(ctx, `F(${rangeStart}) = ${(rangeStart / 10).toFixed(1)}`, cdfX1 + 10, cdfY1 - 10, 10, '#ffd93d', 'left');
        drawText(ctx, `F(${rangeEnd}) = ${(rangeEnd / 10).toFixed(1)}`, cdfX2 + 10, cdfY2 - 10, 10, '#ffd93d', 'left');

        // Relationship
        drawText(ctx, `P(${rangeStart}≤X≤${rangeEnd}) = F(${rangeEnd}) - F(${rangeStart}) = ${prob}`,
            cdfStartX + chartWidth / 2, cdfStartY + chartHeight / 2, 11, '#64ffda');

        // Key insight
        drawText(ctx, '💡 Area under PDF = Height on CDF', canvas.width / 2, canvas.height - 20, 14, COLORS.cyan);
    }

    const slider1 = document.getElementById('pdfRangeSlider');
    const slider2 = document.getElementById('pdfRangeSlider2');
    const label = document.getElementById('pdfRangeLabel');
    const animateBtn = document.getElementById('pdfCdfAnimateBtn');

    function updateSliders() {
        rangeStart = parseFloat(slider1.value);
        rangeEnd = parseFloat(slider2.value);
        if (rangeEnd < rangeStart) {
            const temp = rangeStart;
            rangeStart = rangeEnd;
            rangeEnd = temp;
        }
        if (label) label.textContent = `[${rangeStart}, ${rangeEnd}]`;
        draw();
    }

    if (slider1) slider1.addEventListener('input', updateSliders);
    if (slider2) slider2.addEventListener('input', updateSliders);
    if (animateBtn) animateBtn.addEventListener('click', draw);

    draw();
}

// ===== TOPIC 24: NORMAL DISTRIBUTION 68-95-99.7 RULE =====
function initNormalRuleVisualization() {
    const canvas = document.getElementById('normalRuleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let showLevel = 'all'; // '1', '2', '3', or 'all'

    function normalPDF(x) {
        return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    }

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 60;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;
        const centerX = canvas.width / 2;
        const centerY = padding + height * 0.85;
        const scale = width / 8; // -4 to +4 std devs

        // Title
        drawText(ctx, 'The 68-95-99.7 Rule (Empirical Rule)', canvas.width / 2, 25, 18, COLORS.cyan);

        // Draw axes
        drawLine(ctx, padding, centerY, canvas.width - padding, centerY, COLORS.text, 2);

        // Draw standard deviation markers
        for (let i = -3; i <= 3; i++) {
            const x = centerX + i * scale;
            const label = i === 0 ? 'μ' : (i > 0 ? `+${i}σ` : `${i}σ`);
            drawLine(ctx, x, centerY, x, centerY + 10, COLORS.text, 1);
            drawText(ctx, label, x, centerY + 25, 12, i === 0 ? '#ffd93d' : COLORS.textSecondary);
        }

        // Fill regions based on showLevel
        const regions = [
            { sigma: 3, color: 'rgba(153, 102, 255, 0.3)', percent: '99.7%', show: showLevel === '3' || showLevel === 'all' },
            { sigma: 2, color: 'rgba(255, 107, 107, 0.4)', percent: '95%', show: showLevel === '2' || showLevel === 'all' },
            { sigma: 1, color: 'rgba(100, 255, 218, 0.5)', percent: '68%', show: showLevel === '1' || showLevel === 'all' }
        ];

        regions.forEach(region => {
            if (!region.show) return;

            ctx.beginPath();
            ctx.fillStyle = region.color;

            for (let px = -region.sigma * scale; px <= region.sigma * scale; px++) {
                const x = px / scale;
                const y = normalPDF(x);
                const plotX = centerX + px;
                const plotY = centerY - y * height * 2;

                if (px === -region.sigma * scale) {
                    ctx.moveTo(plotX, centerY);
                    ctx.lineTo(plotX, plotY);
                } else {
                    ctx.lineTo(plotX, plotY);
                }
            }
            ctx.lineTo(centerX + region.sigma * scale, centerY);
            ctx.closePath();
            ctx.fill();
        });

        // Draw the curve
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;

        for (let px = -4 * scale; px <= 4 * scale; px++) {
            const x = px / scale;
            const y = normalPDF(x);
            const plotX = centerX + px;
            const plotY = centerY - y * height * 2;

            if (px === -4 * scale) ctx.moveTo(plotX, plotY);
            else ctx.lineTo(plotX, plotY);
        }
        ctx.stroke();

        // Draw percentage labels
        const labelY = centerY - height * 0.4;
        if (showLevel === '1' || showLevel === 'all') {
            drawText(ctx, '68%', centerX, labelY + 60, 24, '#64ffda');
        }
        if (showLevel === '2' || showLevel === 'all') {
            drawText(ctx, '95%', centerX, labelY + 30, 18, '#ff6b6b');
        }
        if (showLevel === '3' || showLevel === 'all') {
            drawText(ctx, '99.7%', centerX, labelY, 14, '#9966ff');
        }

        // Legend
        const legendY = canvas.height - 40;
        drawRect(ctx, padding, legendY, 15, 15, 'rgba(100, 255, 218, 0.5)');
        drawText(ctx, '±1σ = 68%', padding + 25, legendY + 12, 11, COLORS.text, 'left');

        drawRect(ctx, padding + 120, legendY, 15, 15, 'rgba(255, 107, 107, 0.4)');
        drawText(ctx, '±2σ = 95%', padding + 145, legendY + 12, 11, COLORS.text, 'left');

        drawRect(ctx, padding + 240, legendY, 15, 15, 'rgba(153, 102, 255, 0.3)');
        drawText(ctx, '±3σ = 99.7%', padding + 265, legendY + 12, 11, COLORS.text, 'left');

        // Example
        drawText(ctx, 'Example: IQ (μ=100, σ=15) → 68% between 85-115', canvas.width - padding - 150, legendY + 12, 11, '#ffd93d');
    }

    const show68Btn = document.getElementById('normalShow68Btn');
    const show95Btn = document.getElementById('normalShow95Btn');
    const show997Btn = document.getElementById('normalShow997Btn');
    const showAllBtn = document.getElementById('normalShowAllBtn');

    if (show68Btn) show68Btn.addEventListener('click', () => { showLevel = '1'; draw(); });
    if (show95Btn) show95Btn.addEventListener('click', () => { showLevel = '2'; draw(); });
    if (show997Btn) show997Btn.addEventListener('click', () => { showLevel = '3'; draw(); });
    if (showAllBtn) showAllBtn.addEventListener('click', () => { showLevel = 'all'; draw(); });

    draw();
}

// ===== ML-10: DECISION TREE VISUALIZATION =====
function initDecisionTreeVisualization() {
    const canvas = document.getElementById('decisionTreeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let testHeight = 175;
    let classifying = false;
    let classificationPath = null;

    function draw() {
        clearCanvas(ctx, canvas);

        const centerX = canvas.width / 2;

        // Title
        drawText(ctx, 'Decision Tree: Is a Person Tall? (Height > 170 cm)', centerX, 30, 18, COLORS.cyan);

        // Root node (decision node)
        const rootX = centerX, rootY = 100;
        const nodeWidth = 180, nodeHeight = 60;

        // Draw root node
        ctx.fillStyle = classifying ? '#21262d' : '#1a365d';
        ctx.strokeStyle = COLORS.cyan;
        ctx.lineWidth = 3;
        roundRect(ctx, rootX - nodeWidth / 2, rootY - nodeHeight / 2, nodeWidth, nodeHeight, 10, true, true);

        drawText(ctx, 'Height > 170?', rootX, rootY - 5, 16, COLORS.cyan);
        drawText(ctx, '(Root Node)', rootX, rootY + 15, 11, COLORS.textSecondary);

        // Branches
        const leafY = 280;
        const leftX = centerX - 180;
        const rightX = centerX + 180;

        // Left branch (NO)
        ctx.strokeStyle = classificationPath === 'left' ? '#ff6b6b' : COLORS.text;
        ctx.lineWidth = classificationPath === 'left' ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(rootX - nodeWidth / 4, rootY + nodeHeight / 2);
        ctx.lineTo(leftX, leafY - nodeHeight / 2);
        ctx.stroke();

        drawText(ctx, 'NO (≤ 170)', leftX + 40, rootY + 80, 14, '#ff6b6b');

        // Right branch (YES)
        ctx.strokeStyle = classificationPath === 'right' ? '#51cf66' : COLORS.text;
        ctx.lineWidth = classificationPath === 'right' ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(rootX + nodeWidth / 4, rootY + nodeHeight / 2);
        ctx.lineTo(rightX, leafY - nodeHeight / 2);
        ctx.stroke();

        drawText(ctx, 'YES (> 170)', rightX - 40, rootY + 80, 14, '#51cf66');

        // Left leaf node (NOT TALL)
        const leafActive = classificationPath === 'left';
        ctx.fillStyle = leafActive ? '#4a1c1c' : '#21262d';
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = leafActive ? 4 : 2;
        roundRect(ctx, leftX - nodeWidth / 2, leafY - nodeHeight / 2, nodeWidth, nodeHeight, 10, true, true);

        drawText(ctx, '🔴 Class: 0', leftX, leafY - 8, 16, '#ff6b6b');
        drawText(ctx, 'NOT TALL', leftX, leafY + 12, 12, '#ff6b6b');

        // Right leaf node (TALL)
        const rightActive = classificationPath === 'right';
        ctx.fillStyle = rightActive ? '#1c4a1c' : '#21262d';
        ctx.strokeStyle = '#51cf66';
        ctx.lineWidth = rightActive ? 4 : 2;
        roundRect(ctx, rightX - nodeWidth / 2, leafY - nodeHeight / 2, nodeWidth, nodeHeight, 10, true, true);

        drawText(ctx, '🟢 Class: 1', rightX, leafY - 8, 16, '#51cf66');
        drawText(ctx, 'TALL', rightX, leafY + 12, 12, '#51cf66');

        // Show test input
        if (classifying) {
            const resultText = testHeight > 170 ? `${testHeight} cm → TALL (Class 1)` : `${testHeight} cm → NOT TALL (Class 0)`;
            const resultColor = testHeight > 170 ? '#51cf66' : '#ff6b6b';
            drawText(ctx, `Test Input: ${testHeight} cm`, centerX, 380, 16, COLORS.text);
            drawText(ctx, `Result: ${resultText}`, centerX, 410, 18, resultColor);
        }

        // Legend
        drawText(ctx, '📋 Components: Root Node (Question) → Branches (Yes/No) → Leaf Nodes (Predictions)', centerX, canvas.height - 20, 12, COLORS.textSecondary);
    }

    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
    }

    const slider = document.getElementById('heightTestSlider');
    const label = document.getElementById('heightTestLabel');
    const classifyBtn = document.getElementById('treeClassifyBtn');
    const resetBtn = document.getElementById('treeResetBtn');

    if (slider) {
        slider.addEventListener('input', (e) => {
            testHeight = parseInt(e.target.value);
            if (label) label.textContent = testHeight;
        });
    }

    if (classifyBtn) {
        classifyBtn.addEventListener('click', () => {
            classifying = true;
            classificationPath = testHeight > 170 ? 'right' : 'left';
            draw();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            classifying = false;
            classificationPath = null;
            draw();
        });
    }

    draw();
}



// ===== TOPIC 12: CORRELATION VISUALIZATION =====
function initCorrelationVisualization() {
    const canvas = document.getElementById('correlationCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let r = 0.7;

    function generateCorrelatedData(rho) {
        const data = [];
        const n = 50;
        for (let i = 0; i < n; i++) {
            const x = (Math.random() - 0.5) * 2;
            const noise = (Math.random() - 0.5) * 2;
            const y = rho * x + Math.sqrt(1 - rho * rho) * noise;
            data.push({ x: x * 40 + 50, y: y * 40 + 50 });
        }
        return data;
    }

    function draw() {
        clearCanvas(ctx, canvas);
        const padding = 60, width = canvas.width - padding * 2, height = canvas.height - padding * 2;
        const data = generateCorrelatedData(r);

        let statusText = '';
        let color = '#fff';
        if (r > 0.7) { statusText = 'Strong Positive'; color = '#51cf66'; }
        else if (r > 0.3) { statusText = 'Moderate Positive'; color = '#64ffda'; }
        else if (r > -0.3) { statusText = 'Weak / No Correlation'; color = '#ffd93d'; }
        else if (r > -0.7) { statusText = 'Moderate Negative'; color = '#ffa94d'; }
        else { statusText = 'Strong Negative'; color = '#ff6b6b'; }

        drawText(ctx, `r = ${r.toFixed(2)} (${statusText})`, canvas.width / 2, 30, 20, color);

        // Axes
        drawLine(ctx, padding, height + padding, width + padding, height + padding, COLORS.text, 2);
        drawLine(ctx, padding, padding, padding, height + padding, COLORS.text, 2);

        data.forEach(p => {
            const px = padding + (p.x / 100) * width;
            const py = padding + height - (p.y / 100) * height;
            drawCircle(ctx, px, py, 5, color);
        });

        drawText(ctx, 'Standardized X', canvas.width / 2, canvas.height - 15, 12, COLORS.textSecondary);
    }
    const s = document.getElementById('corrSlider'), l = document.getElementById('corrLabel');
    if (s) s.addEventListener('input', (e) => {
        r = e.target.value / 100;
        if (l) l.textContent = r.toFixed(2);
        draw();
    });
    draw();
}

console.log('%c\u2713 Ultimate Learning Platform Fully Initialized', 'color: #51cf66; font-size: 14px; font-weight: bold;');


// ===== TOPIC 10: SKEWNESS VISUALIZATION =====
function initSkewnessVisualization() {
    const canvas = document.getElementById('skewnessCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function normalPDF(x, mean, std) {
        return Math.exp(-0.5 * Math.pow((x - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
    }

    function betaPDF(x, alpha, beta) {
        if (x <= 0 || x >= 1) return 0;
        const B = (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1));
        return B * 3; // Scale for visibility
    }

    function draw() {
        clearCanvas(ctx, canvas);

        const padding = 50;
        const chartWidth = (canvas.width - padding * 4) / 3;
        const chartHeight = canvas.height - 120;

        const charts = [
            { type: 'negative', title: 'Negative Skew (Left Skewed)', color: '#ff6b6b', alpha: 5, beta: 2 },
            { type: 'symmetric', title: 'Symmetric (Normal)', color: '#64ffda', mean: 0.5, std: 0.15 },
            { type: 'positive', title: 'Positive Skew (Right Skewed)', color: '#51cf66', alpha: 2, beta: 5 }
        ];

        charts.forEach((chart, idx) => {
            const startX = padding + idx * (chartWidth + padding);
            const centerY = canvas.height - 40;

            drawText(ctx, chart.title, startX + chartWidth / 2, 40, 14, chart.color);
            drawLine(ctx, startX, centerY, startX + chartWidth, centerY, COLORS.text, 2);
            drawLine(ctx, startX, centerY - chartHeight, startX, centerY, COLORS.text, 2);

            ctx.beginPath();
            ctx.strokeStyle = chart.color;
            ctx.lineWidth = 3;

            for (let i = 0; i <= 100; i++) {
                const x = i / 100;
                let y = chart.type === 'symmetric' ? normalPDF(x, chart.mean, chart.std) : betaPDF(x, chart.alpha, chart.beta);
                const px = startX + x * chartWidth;
                const py = centerY - y * chartHeight / 3;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();

            let modePos, medianPos, meanPos;
            if (chart.type === 'negative') { modePos = 0.75; medianPos = 0.65; meanPos = 0.55; }
            else if (chart.type === 'positive') { modePos = 0.25; medianPos = 0.35; meanPos = 0.45; }
            else { modePos = medianPos = meanPos = 0.5; }

            if (chart.type === 'symmetric') {
                const x = startX + 0.5 * chartWidth;
                drawLine(ctx, x, centerY, x, centerY - chartHeight * 0.8, '#fff', 1);
                drawText(ctx, 'Mean=Median=Mode', x, centerY + 20, 10, '#fff');
            } else {
                const ann = [
                    { pos: modePos, label: 'Mode', color: '#ff6b6b' },
                    { pos: medianPos, label: 'Median', color: '#ffd93d' },
                    { pos: meanPos, label: 'Mean', color: '#4a90e2' }
                ];
                ann.forEach((a, i) => {
                    const x = startX + a.pos * chartWidth;
                    const h = centerY - (chart.type === 'negative' ? betaPDF(a.pos, 5, 2) : betaPDF(a.pos, 2, 5)) * chartHeight / 3;
                    drawLine(ctx, x, centerY, x, h, a.color, 1);
                    drawText(ctx, a.label, x, centerY + 15 + (i * 12), 10, a.color);
                });
            }
        });
        drawText(ctx, 'Rule: Skew pulls Mean towards the tail!', canvas.width / 2, canvas.height - 10, 12, COLORS.textSecondary);
    }
    const btn = document.getElementById('skewnessAnimateBtn');
    if (btn) btn.addEventListener('click', draw);
    draw();
}

// ===== TOPIC 20: PDF VS CDF VISUALIZATION =====
function initPDFCDFVisualization() {
    const canvas = document.getElementById('pdfCdfCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rangeStart = 2, rangeEnd = 6;

    function draw() {
        clearCanvas(ctx, canvas);
        const padding = 60;
        const chartWidth = (canvas.width - padding * 3) / 2;
        const chartHeight = canvas.height - 150;
        const pdfStartX = padding, cdfStartX = padding * 2 + chartWidth, chartStartY = 100;

        drawText(ctx, 'PDF: Relative Likelihood (height)', pdfStartX + chartWidth / 2, 50, 16, COLORS.cyan);
        drawLine(ctx, pdfStartX, chartStartY + chartHeight, pdfStartX + chartWidth, chartStartY + chartHeight, COLORS.text, 2);
        drawLine(ctx, pdfStartX, chartStartY, pdfStartX, chartStartY + chartHeight, COLORS.text, 2);
        ctx.fillStyle = 'rgba(100, 255, 218, 0.2)';
        ctx.fillRect(pdfStartX, chartStartY + chartHeight * 0.7, chartWidth, chartHeight * 0.3);
        ctx.strokeStyle = COLORS.cyan;
        ctx.strokeRect(pdfStartX, chartStartY + chartHeight * 0.7, chartWidth, chartHeight * 0.3);

        const shadeX1 = pdfStartX + (rangeStart / 10) * chartWidth;
        const shadeX2 = pdfStartX + (rangeEnd / 10) * chartWidth;
        ctx.fillStyle = 'rgba(255, 107, 107, 0.5)';
        ctx.fillRect(shadeX1, chartStartY + chartHeight * 0.7, shadeX2 - shadeX1, chartHeight * 0.3);
        drawText(ctx, 'Area = Probability', (shadeX1 + shadeX2) / 2, chartStartY + chartHeight * 0.85, 12, '#ff6b6b');

        drawText(ctx, 'CDF: Cumulative Probability (area)', cdfStartX + chartWidth / 2, 50, 16, COLORS.orange);
        drawLine(ctx, cdfStartX, chartStartY + chartHeight, cdfStartX + chartWidth, chartStartY + chartHeight, COLORS.text, 2);
        drawLine(ctx, cdfStartX, chartStartY, cdfStartX, chartStartY + chartHeight, COLORS.text, 2);
        ctx.beginPath();
        ctx.strokeStyle = COLORS.orange; ctx.lineWidth = 3;
        ctx.moveTo(cdfStartX, chartStartY + chartHeight); ctx.lineTo(cdfStartX + chartWidth, chartStartY);
        ctx.stroke();

        const cdfX1 = cdfStartX + (rangeStart / 10) * chartWidth;
        const cdfY1 = chartStartY + chartHeight - (rangeStart / 10) * chartHeight;
        const cdfX2 = cdfStartX + (rangeEnd / 10) * chartWidth;
        const cdfY2 = chartStartY + chartHeight - (rangeEnd / 10) * chartHeight;
        drawCircle(ctx, cdfX1, cdfY1, 6, '#ffd93d');
        drawCircle(ctx, cdfX2, cdfY2, 6, '#ffd93d');
        ctx.setLineDash([5, 5]);
        drawLine(ctx, cdfX1, cdfY1, cdfX1, chartStartY + chartHeight, '#ffd93d', 1);
        drawLine(ctx, cdfX2, cdfY2, cdfX2, chartStartY + chartHeight, '#ffd93d', 1);
        ctx.setLineDash([]);
        drawText(ctx, `F(${rangeStart}) = ${(rangeStart / 10).toFixed(1)}`, cdfX1, cdfY1 - 10, 10, '#ffd93d');
        drawText(ctx, `F(${rangeEnd}) = ${(rangeEnd / 10).toFixed(1)}`, cdfX2, cdfY2 - 10, 10, '#ffd93d');
    }
    const s1 = document.getElementById('pdfRangeSlider'), s2 = document.getElementById('pdfRangeSlider2'), l = document.getElementById('pdfRangeLabel');
    const update = () => { rangeStart = Math.min(s1.value, s2.value); rangeEnd = Math.max(s1.value, s2.value); if (l) l.textContent = `Range: [${rangeStart}, ${rangeEnd}]`; draw(); };
    if (s1) s1.addEventListener('input', update); if (s2) s2.addEventListener('input', update);
    draw();
}

// ===== TOPIC 24: NORMAL DISTRIBUTION 68-95-99.7 RULE =====
function initNormalRuleVisualization() {
    const canvas = document.getElementById('normalRuleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let showLevel = 'all';

    function normalPDF(x) { return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI); }

    function draw() {
        clearCanvas(ctx, canvas);
        const padding = 60, width = canvas.width - padding * 2, height = canvas.height - padding * 2;
        const centerX = canvas.width / 2, centerY = padding + height * 0.85, scale = width / 8;

        drawText(ctx, 'The 68-95-99.7 Rule (Empirical Rule)', centerX, 25, 18, COLORS.cyan);
        drawLine(ctx, padding, centerY, canvas.width - padding, centerY, COLORS.text, 2);

        for (let i = -3; i <= 3; i++) {
            const x = centerX + i * scale;
            const label = i === 0 ? '\u03bc' : (i > 0 ? `+${i}\u03c3` : `${i}\u03c3`);
            drawLine(ctx, x, centerY, x, centerY + 10, COLORS.text, 1);
            drawText(ctx, label, x, centerY + 25, 12, i === 0 ? '#ffd93d' : COLORS.textSecondary);
        }

        const regions = [
            { sigma: 3, color: 'rgba(153, 102, 255, 0.3)', show: showLevel === '3' || showLevel === 'all' },
            { sigma: 2, color: 'rgba(255, 107, 107, 0.4)', show: showLevel === '2' || showLevel === 'all' },
            { sigma: 1, color: 'rgba(100, 255, 218, 0.5)', show: showLevel === '1' || showLevel === 'all' }
        ];

        regions.forEach(r => {
            if (!r.show) return;
            ctx.beginPath(); ctx.fillStyle = r.color;
            for (let px = -r.sigma * scale; px <= r.sigma * scale; px++) {
                const x = px / scale, y = normalPDF(x);
                const plotX = centerX + px, plotY = centerY - y * height * 2;
                if (px === -r.sigma * scale) ctx.moveTo(plotX, centerY);
                ctx.lineTo(plotX, plotY);
            }
            ctx.lineTo(centerX + r.sigma * scale, centerY); ctx.closePath(); ctx.fill();
        });

        ctx.beginPath(); ctx.strokeStyle = 'white'; ctx.lineWidth = 3;
        for (let px = -4 * scale; px <= 4 * scale; px++) {
            const x = px / scale, y = normalPDF(x);
            const plotX = centerX + px, plotY = centerY - y * height * 2;
            if (px === -4 * scale) ctx.moveTo(plotX, plotY);
            else ctx.lineTo(plotX, plotY);
        }
        ctx.stroke();
    }
    const b1 = document.getElementById('normalShow68Btn'), b2 = document.getElementById('normalShow95Btn'), b3 = document.getElementById('normalShow997Btn'), b4 = document.getElementById('normalShowAllBtn');
    if (b1) b1.addEventListener('click', () => { showLevel = '1'; draw(); });
    if (b2) b2.addEventListener('click', () => { showLevel = '2'; draw(); });
    if (b3) b3.addEventListener('click', () => { showLevel = '3'; draw(); });
    if (b4) b4.addEventListener('click', () => { showLevel = 'all'; draw(); });
    draw();
}

// ===== ML-10: DECISION TREE VISUALIZATION =====
function initDecisionTreeVisualization() {
    const canvas = document.getElementById('decisionTreeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let testHeight = 165, classifying = false, classificationPath = null;

    function draw() {
        clearCanvas(ctx, canvas);
        const centerX = canvas.width / 2, rootY = 80, leafY = 280, leftX = centerX - 180, rightX = centerX + 180;
        const nodeWidth = 140, nodeHeight = 60;

        drawLine(ctx, centerX, rootY, leftX, leafY, COLORS.textSecondary, 2);
        drawLine(ctx, centerX, rootY, rightX, leafY, COLORS.textSecondary, 2);

        ctx.fillStyle = '#21262d'; ctx.strokeStyle = COLORS.cyan; ctx.lineWidth = 3;
        roundRect(ctx, centerX - nodeWidth / 2, rootY - nodeHeight / 2, nodeWidth, nodeHeight, 10, true, true);
        drawText(ctx, 'ROOT NODE: Height > 170?', centerX, rootY + 5, 14, '#fff');

        const lActive = classificationPath === 'left', rActive = classificationPath === 'right';
        ctx.fillStyle = lActive ? '#4a1c1c' : '#21262d'; ctx.strokeStyle = '#ff6b6b';
        roundRect(ctx, leftX - nodeWidth / 2, leafY - nodeHeight / 2, nodeWidth, nodeHeight, 10, true, true);
        drawText(ctx, 'Class 0: NOT TALL', leftX, leafY + 5, 14, '#ff6b6b');

        ctx.fillStyle = rActive ? '#1c4a1c' : '#21262d'; ctx.strokeStyle = '#51cf66';
        roundRect(ctx, rightX - nodeWidth / 2, leafY - nodeHeight / 2, nodeWidth, nodeHeight, 10, true, true);
        drawText(ctx, 'Class 1: TALL', rightX, leafY + 5, 14, '#51cf66');

        if (classifying) {
            drawText(ctx, `Test: ${testHeight} cm \u2192 ${testHeight > 170 ? 'TALL' : 'NOT TALL'}`, centerX, 400, 18, COLORS.cyan);
        }
    }

    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        ctx.beginPath(); ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius); ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius); ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y); ctx.closePath();
        if (fill) ctx.fill(); if (stroke) ctx.stroke();
    }

    const s = document.getElementById('heightTestSlider'), b = document.getElementById('treeClassifyBtn');
    if (s) s.addEventListener('input', (e) => { testHeight = e.target.value; draw(); });
    if (b) b.addEventListener('click', () => { classifying = true; classificationPath = testHeight > 170 ? 'right' : 'left'; draw(); });
    draw();
}

// ===== TOPIC 11: COVARIANCE VISUALIZATION =====
function initCovarianceVisualization() {
    const canvas = document.getElementById('covarianceCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let covType = 'positive';

    function generateData(type) {
        let data = [];
        for (let i = 0; i < 30; i++) {
            let x = Math.random() * 80 + 10, y;
            if (type === 'positive') y = x + (Math.random() - 0.5) * 30;
            else if (type === 'negative') y = 100 - x + (Math.random() - 0.5) * 30;
            else y = Math.random() * 80 + 10;
            data.push({ x, y });
        }
        return data;
    }

    function draw() {
        clearCanvas(ctx, canvas);
        const padding = 60, width = canvas.width - padding * 2, height = canvas.height - padding * 2;
        const data = generateData(covType);
        const meanX = data.reduce((s, p) => s + p.x, 0) / data.length;
        const meanY = data.reduce((s, p) => s + p.y, 0) / data.length;
        const cov = data.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0) / (data.length - 1);

        drawText(ctx, `${covType.toUpperCase()} Covariance: ${cov.toFixed(2)}`, canvas.width / 2, 25, 18, COLORS.cyan);
        drawLine(ctx, padding, height + padding, width + padding, height + padding, COLORS.text, 2);
        drawLine(ctx, padding, padding, padding, height + padding, COLORS.text, 2);

        data.forEach(p => {
            drawCircle(ctx, padding + (p.x / 100) * width, padding + height - (p.y / 100) * height, 6, COLORS.cyan);
        });
    }
    const b1 = document.getElementById('covPositiveBtn'), b2 = document.getElementById('covNegativeBtn'), b3 = document.getElementById('covZeroBtn');
    if (b1) b1.addEventListener('click', () => { covType = 'positive'; draw(); });
    if (b2) b2.addEventListener('click', () => { covType = 'negative'; draw(); });
    if (b3) b3.addEventListener('click', () => { covType = 'zero'; draw(); });
    draw();
}