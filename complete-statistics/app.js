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
let animationFrames = {};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initInteractiveElements();
    setupScrollObserver();
    initializeAllVisualizations();
});

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
    // Topic 2: Population vs Sample
    initPopulationSampleViz();
    
    // Topic 5: Central Tendency
    initCentralTendencyViz();
    
    // Add more visualizations as needed
    // Each topic with a canvas gets its own initialization function
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
console.log('%c📊 Statistics Mastery Platform Loaded', 'color: #64ffda; font-size: 16px; font-weight: bold;');
console.log('%cReady to explore 41 comprehensive statistics topics!', 'color: #4a90e2; font-size: 14px;');