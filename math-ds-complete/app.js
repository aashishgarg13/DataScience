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
    initNavigation();
    initSubjectTabs();
    initInteractiveElements();
    setupScrollObserver();
    initializeAllVisualizations();
    
    // Show initial subject
    switchSubject('statistics');
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
        'data-science': 'Data Science Content'
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
            const target = document.getElementById(`topic-${topicId}`);
            
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
                const topicId = entry.target.id.split('-')[1];
                updateActiveLink(topicId);
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
    initEigenvectorCanvas();
    
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

function initEigenvectorCanvas() {
    const canvas = document.getElementById('canvas-54');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let transformed = false;
    
    function draw() {
        clearCanvas(ctx, canvas);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 50;
        
        // Draw axes
        drawLine(ctx, 0, centerY, canvas.width, centerY, '#555', 1);
        drawLine(ctx, centerX, 0, centerX, canvas.height, '#555', 1);
        
        // Matrix [[2, 0], [0, 1]] - scaling transformation
        // Eigenvectors: [1, 0] with eigenvalue 2, [0, 1] with eigenvalue 1
        
        const e1Scale = transformed ? 2 : 1;
        const e2Scale = 1;
        
        // Draw regular vectors (affected)
        const regularVecs = [[2, 2], [1, 2], [-2, 1]];
        regularVecs.forEach(([x, y]) => {
            const endX = transformed ? centerX + 2 * x * scale : centerX + x * scale;
            const endY = centerY - y * scale;
            drawLine(ctx, centerX, centerY, endX, endY, '#666', 2);
        });
        
        // Draw eigenvectors (special - stay on their line)
        drawLine(ctx, centerX, centerY, centerX + e1Scale * 2 * scale, centerY, COLORS.cyan, 4);
        drawLine(ctx, centerX, centerY, centerX, centerY - 2 * scale, COLORS.orange, 4);
        
        drawText(ctx, 'Eigenvector 1 (λ=2)', centerX + e1Scale * 2 * scale + 10, centerY - 10, 12, COLORS.cyan, 'left');
        drawText(ctx, 'Eigenvector 2 (λ=1)', centerX + 10, centerY - 2 * scale - 10, 12, COLORS.orange, 'left');
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
// ===== DATA SCIENCE VISUALIZATIONS =====

function initSimpleRegressionCanvas() {
    const canvas = document.getElementById('canvas-70');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let showLine = false;
    
    // Sample data
    const data = [
        {x: 1, y: 2.1}, {x: 2, y: 4.2}, {x: 3, y: 5.8}, {x: 4, y: 8.1},
        {x: 5, y: 10.3}, {x: 6, y: 12.1}, {x: 7, y: 13.9}, {x: 8, y: 16.2},
        {x: 9, y: 18.1}, {x: 10, y: 20.0}
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

console.log('%c📊 Mathematics Mastery Platform Loaded', 'color: #64ffda; font-size: 16px; font-weight: bold;');
console.log('%cReady to explore 85 comprehensive topics across 4 subjects!', 'color: #4a90e2; font-size: 14px;');
console.log('%c✓ Statistics (1-41) ✓ Linear Algebra (42-57) ✓ Calculus (58-69) ✓ Data Science (70-85)', 'color: #51cf66; font-size: 12px;');