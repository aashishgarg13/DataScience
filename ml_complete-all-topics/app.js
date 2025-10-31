// Data
const data = {
  linearRegression: [
    { experience: 1, salary: 39.764 },
    { experience: 2, salary: 48.900 },
    { experience: 3, salary: 56.978 },
    { experience: 4, salary: 68.290 },
    { experience: 5, salary: 77.867 },
    { experience: 6, salary: 85.022 }
  ],
  logistic: [
    { height: 150, label: 0, prob: 0.2 },
    { height: 160, label: 0, prob: 0.35 },
    { height: 170, label: 0, prob: 0.5 },
    { height: 180, label: 1, prob: 0.65 },
    { height: 190, label: 1, prob: 0.8 },
    { height: 200, label: 1, prob: 0.9 }
  ],
  svm: [
    { label: 'A', x1: 2, x2: 7, class: 1 },
    { label: 'B', x1: 3, x2: 8, class: 1 },
    { label: 'C', x1: 4, x2: 7, class: 1 },
    { label: 'D', x1: 6, x2: 2, class: -1 },
    { label: 'E', x1: 7, x2: 3, class: -1 },
    { label: 'F', x1: 8, x2: 2, class: -1 }
  ],
  knn: [
    { x: 1, y: 2, class: 'orange' },
    { x: 0.9, y: 1.7, class: 'orange' },
    { x: 1.5, y: 2.5, class: 'orange' },
    { x: 4, y: 5, class: 'yellow' },
    { x: 4.2, y: 4.8, class: 'yellow' },
    { x: 3.8, y: 5.2, class: 'yellow' }
  ],
  roc: [
    { id: 'A', true_label: 1, score: 0.95 },
    { id: 'B', true_label: 0, score: 0.70 },
    { id: 'C', true_label: 1, score: 0.60 },
    { id: 'D', true_label: 0, score: 0.40 },
    { id: 'E', true_label: 1, score: 0.20 }
  ]
};

// State
let state = {
  slope: 7.5,
  intercept: 32,
  learningRate: 0.1,
  gdIterations: [],
  testPoint: { x: 2, y: 1 },
  svm: {
    w1: 1,
    w2: 1,
    b: -10,
    C: 1,
    kernel: 'linear',
    kernelParam: 1,
    training: {
      w: [0, 0],
      b: 0,
      step: 0,
      learningRate: 0.01,
      isTraining: false
    }
  }
};

// Initialize collapsible sections
function initSections() {
  const sections = document.querySelectorAll('.section');
  
  sections.forEach(section => {
    const header = section.querySelector('.section-header');
    const toggle = section.querySelector('.section-toggle');
    const body = section.querySelector('.section-body');
    
    // Start with first section expanded
    if (section.id === 'intro') {
      body.classList.add('expanded');
      toggle.classList.remove('collapsed');
    } else {
      toggle.classList.add('collapsed');
    }
    
    header.addEventListener('click', () => {
      const isExpanded = body.classList.contains('expanded');
      
      if (isExpanded) {
        body.classList.remove('expanded');
        toggle.classList.add('collapsed');
      } else {
        body.classList.add('expanded');
        toggle.classList.remove('collapsed');
        
        // Initialize visualizations when section opens
        if (section.id === 'linear-regression') initLinearRegression();
        if (section.id === 'gradient-descent') initGradientDescent();
        if (section.id === 'logistic-regression') initLogistic();
        if (section.id === 'svm') initSVM();
        if (section.id === 'knn') initKNN();
        if (section.id === 'model-evaluation') initModelEvaluation();
        if (section.id === 'regularization') initRegularization();
        if (section.id === 'bias-variance') initBiasVariance();
        if (section.id === 'cross-validation') initCrossValidation();
        if (section.id === 'preprocessing') initPreprocessing();
        if (section.id === 'loss-functions') initLossFunctions();
        if (section.id === 'optimal-k') initOptimalK();
        if (section.id === 'hyperparameter-tuning') initHyperparameterTuning();
        if (section.id === 'naive-bayes') initNaiveBayes();
        if (section.id === 'decision-trees') initDecisionTrees();
        if (section.id === 'ensemble-methods') initEnsembleMethods();
      }
    });
  });
}

// Smooth scroll for TOC links
function initTOCLinks() {
  const links = document.querySelectorAll('.toc-link');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        // Remove active from all links
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Scroll to target
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Expand the section
        const toggle = target.querySelector('.section-toggle');
        const body = target.querySelector('.section-body');
        body.classList.add('expanded');
        toggle.classList.remove('collapsed');
      }
    });
  });
  
  // Update active link on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  });
}

function updateActiveLink() {
  const sections = document.querySelectorAll('.section');
  const scrollPos = window.scrollY + 100;
  
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    
    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.toc-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Linear Regression Visualization
function initLinearRegression() {
  const canvas = document.getElementById('lr-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  
  const slopeSlider = document.getElementById('slope-slider');
  const interceptSlider = document.getElementById('intercept-slider');
  const slopeVal = document.getElementById('slope-val');
  const interceptVal = document.getElementById('intercept-val');
  
  if (slopeSlider) {
    slopeSlider.addEventListener('input', (e) => {
      state.slope = parseFloat(e.target.value);
      slopeVal.textContent = state.slope.toFixed(1);
      drawLinearRegression();
    });
  }
  
  if (interceptSlider) {
    interceptSlider.addEventListener('input', (e) => {
      state.intercept = parseFloat(e.target.value);
      interceptVal.textContent = state.intercept.toFixed(1);
      drawLinearRegression();
    });
  }
  
  drawLinearRegression();
}

function drawLinearRegression() {
  const canvas = document.getElementById('lr-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const xMin = 0, xMax = 7;
  const yMin = 0, yMax = 100;
  
  // Draw axes
  ctx.strokeStyle = '#2a3544';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Grid
  ctx.strokeStyle = 'rgba(42, 53, 68, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const x = padding + (chartWidth / 5) * i;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
    
    const y = height - padding - (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  
  const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth;
  const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight;
  
  // Draw data points
  ctx.fillStyle = '#6aa9ff';
  data.linearRegression.forEach(point => {
    const x = scaleX(point.experience);
    const y = scaleY(point.salary);
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  // Draw regression line
  ctx.strokeStyle = '#ff8c6a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  const y1 = state.slope * xMin + state.intercept;
  const y2 = state.slope * xMax + state.intercept;
  ctx.moveTo(scaleX(xMin), scaleY(y1));
  ctx.lineTo(scaleX(xMax), scaleY(y2));
  ctx.stroke();
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Experience (years)', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Salary ($k)', 0, 0);
  ctx.restore();
  
  // Calculate MSE
  let mse = 0;
  data.linearRegression.forEach(point => {
    const predicted = state.slope * point.experience + state.intercept;
    const error = point.salary - predicted;
    mse += error * error;
  });
  mse /= data.linearRegression.length;
  
  // Display MSE
  ctx.fillStyle = '#7ef0d4';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`MSE: ${mse.toFixed(2)}`, width - padding, padding + 20);
}

// Gradient Descent Visualization
function initGradientDescent() {
  const canvas = document.getElementById('gd-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  
  const runBtn = document.getElementById('run-gd');
  const resetBtn = document.getElementById('reset-gd');
  const lrSlider = document.getElementById('lr-slider');
  const lrVal = document.getElementById('lr-val');
  
  if (lrSlider) {
    lrSlider.addEventListener('input', (e) => {
      state.learningRate = parseFloat(e.target.value);
      lrVal.textContent = state.learningRate.toFixed(2);
    });
  }
  
  if (runBtn) {
    runBtn.addEventListener('click', runGradientDescent);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.gdIterations = [];
      drawGradientDescent();
    });
  }
  
  drawGradientDescent();
}

function runGradientDescent() {
  state.gdIterations = [];
  let m = 0, c = 20; // Start with poor values
  const alpha = state.learningRate;
  const iterations = 50;
  
  for (let i = 0; i < iterations; i++) {
    let dm = 0, dc = 0;
    const n = data.linearRegression.length;
    
    // Calculate gradients
    data.linearRegression.forEach(point => {
      const predicted = m * point.experience + c;
      const error = predicted - point.salary;
      dm += (2 / n) * error * point.experience;
      dc += (2 / n) * error;
    });
    
    // Update parameters
    m -= alpha * dm;
    c -= alpha * dc;
    
    // Calculate loss
    let loss = 0;
    data.linearRegression.forEach(point => {
      const predicted = m * point.experience + c;
      const error = point.salary - predicted;
      loss += error * error;
    });
    loss /= n;
    
    state.gdIterations.push({ m, c, loss });
  }
  
  animateGradientDescent();
}

function animateGradientDescent() {
  let step = 0;
  const interval = setInterval(() => {
    if (step >= state.gdIterations.length) {
      clearInterval(interval);
      return;
    }
    
    const iteration = state.gdIterations[step];
    state.slope = iteration.m;
    state.intercept = iteration.c;
    
    // Update linear regression chart
    drawLinearRegression();
    drawGradientDescent(step);
    
    step++;
  }, 50);
}

function drawGradientDescent(currentStep = -1) {
  const canvas = document.getElementById('gd-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  
  if (state.gdIterations.length === 0) {
    ctx.fillStyle = '#a9b4c2';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Click "Run Gradient Descent" to see the algorithm in action', width / 2, height / 2);
    return;
  }
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const maxLoss = Math.max(...state.gdIterations.map(i => i.loss));
  const minLoss = Math.min(...state.gdIterations.map(i => i.loss));
  
  // Draw axes
  ctx.strokeStyle = '#2a3544';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  const scaleX = (i) => padding + (i / (state.gdIterations.length - 1)) * chartWidth;
  const scaleY = (loss) => height - padding - ((loss - minLoss) / (maxLoss - minLoss)) * chartHeight;
  
  // Draw loss curve
  ctx.strokeStyle = '#7ef0d4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  state.gdIterations.forEach((iter, i) => {
    const x = scaleX(i);
    const y = scaleY(iter.loss);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  
  // Highlight current step
  if (currentStep >= 0 && currentStep < state.gdIterations.length) {
    const iter = state.gdIterations[currentStep];
    const x = scaleX(currentStep);
    const y = scaleY(iter.loss);
    
    ctx.fillStyle = '#ff8c6a';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Display current values
    ctx.fillStyle = '#e8eef6';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Step: ${currentStep + 1}`, padding + 10, padding + 20);
    ctx.fillText(`Loss: ${iter.loss.toFixed(2)}`, padding + 10, padding + 40);
  }
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Iterations', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Loss (MSE)', 0, 0);
  ctx.restore();
}

// Initialize everything when DOM is ready
function init() {
  initSections();
  initTOCLinks();
  
  // Initialize first section visualizations
  setTimeout(() => {
    initLinearRegression();
  }, 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// SVM Visualizations
function initSVM() {
  initSVMBasic();
  initSVMMargin();
  initSVMCParameter();
  initSVMTraining();
  initSVMKernel();
}

function initSVMBasic() {
  const canvas = document.getElementById('svm-basic-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  
  const w1Slider = document.getElementById('svm-w1-slider');
  const w2Slider = document.getElementById('svm-w2-slider');
  const bSlider = document.getElementById('svm-b-slider');
  
  if (w1Slider) {
    w1Slider.addEventListener('input', (e) => {
      state.svm.w1 = parseFloat(e.target.value);
      document.getElementById('svm-w1-val').textContent = state.svm.w1.toFixed(1);
      drawSVMBasic();
    });
  }
  
  if (w2Slider) {
    w2Slider.addEventListener('input', (e) => {
      state.svm.w2 = parseFloat(e.target.value);
      document.getElementById('svm-w2-val').textContent = state.svm.w2.toFixed(1);
      drawSVMBasic();
    });
  }
  
  if (bSlider) {
    bSlider.addEventListener('input', (e) => {
      state.svm.b = parseFloat(e.target.value);
      document.getElementById('svm-b-val').textContent = state.svm.b.toFixed(1);
      drawSVMBasic();
    });
  }
  
  drawSVMBasic();
}

function drawSVMBasic() {
  const canvas = document.getElementById('svm-basic-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const xMin = 0, xMax = 10;
  const yMin = 0, yMax = 10;
  
  const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth;
  const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight;
  
  // Draw grid
  ctx.strokeStyle = 'rgba(42, 53, 68, 0.5)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const x = scaleX(i);
    const y = scaleY(i);
    
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  
  // Draw axes
  ctx.strokeStyle = '#2a3544';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Draw decision boundary
  const w1 = state.svm.w1;
  const w2 = state.svm.w2;
  const b = state.svm.b;
  
  if (Math.abs(w2) > 0.01) {
    ctx.strokeStyle = '#6aa9ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const x1 = xMin;
    const y1 = -(w1 * x1 + b) / w2;
    const x2 = xMax;
    const y2 = -(w1 * x2 + b) / w2;
    
    ctx.moveTo(scaleX(x1), scaleY(y1));
    ctx.lineTo(scaleX(x2), scaleY(y2));
    ctx.stroke();
  }
  
  // Draw data points
  data.svm.forEach(point => {
    const x = scaleX(point.x1);
    const y = scaleY(point.x2);
    const score = w1 * point.x1 + w2 * point.x2 + b;
    
    ctx.fillStyle = point.class === 1 ? '#7ef0d4' : '#ff8c6a';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(point.label, x, y - 15);
    
    // Score
    ctx.font = '11px monospace';
    ctx.fillStyle = '#a9b4c2';
    ctx.fillText(score.toFixed(2), x, y + 20);
  });
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('X₁', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('X₂', 0, 0);
  ctx.restore();
  
  // Equation
  ctx.fillStyle = '#7ef0d4';
  ctx.font = '14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`w·x + b = ${w1.toFixed(1)}x₁ + ${w2.toFixed(1)}x₂ + ${b.toFixed(1)}`, padding + 10, padding + 25);
}

function initSVMMargin() {
  const canvas = document.getElementById('svm-margin-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  drawSVMMargin();
}

function drawSVMMargin() {
  const canvas = document.getElementById('svm-margin-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const xMin = 0, xMax = 10;
  const yMin = 0, yMax = 10;
  
  const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth;
  const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight;
  
  // Use good values for visualization
  const w1 = 0.5, w2 = -1, b = 5.5;
  
  // Draw margin lines
  if (Math.abs(w2) > 0.01) {
    // Positive margin line
    ctx.strokeStyle = '#ff8c6a';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    let x1 = xMin, y1 = -(w1 * x1 + b - 1) / w2;
    let x2 = xMax, y2 = -(w1 * x2 + b - 1) / w2;
    ctx.moveTo(scaleX(x1), scaleY(y1));
    ctx.lineTo(scaleX(x2), scaleY(y2));
    ctx.stroke();
    
    // Negative margin line
    ctx.beginPath();
    y1 = -(w1 * x1 + b + 1) / w2;
    y2 = -(w1 * x2 + b + 1) / w2;
    ctx.moveTo(scaleX(x1), scaleY(y1));
    ctx.lineTo(scaleX(x2), scaleY(y2));
    ctx.stroke();
    
    // Decision boundary
    ctx.setLineDash([]);
    ctx.strokeStyle = '#6aa9ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    y1 = -(w1 * x1 + b) / w2;
    y2 = -(w1 * x2 + b) / w2;
    ctx.moveTo(scaleX(x1), scaleY(y1));
    ctx.lineTo(scaleX(x2), scaleY(y2));
    ctx.stroke();
  }
  
  // Draw data points
  data.svm.forEach(point => {
    const x = scaleX(point.x1);
    const y = scaleY(point.x2);
    const score = w1 * point.x1 + w2 * point.x2 + b;
    const isSupport = Math.abs(Math.abs(score) - 1) < 0.5;
    
    ctx.fillStyle = point.class === 1 ? '#7ef0d4' : '#ff8c6a';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Highlight support vectors
    if (isSupport) {
      ctx.strokeStyle = '#7ef0d4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(point.label, x, y - 20);
  });
  
  // Show margin width
  const wNorm = Math.sqrt(w1 * w1 + w2 * w2);
  const marginWidth = 2 / wNorm;
  
  ctx.fillStyle = '#7ef0d4';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Margin Width: ${marginWidth.toFixed(2)}`, padding + 10, padding + 25);
  ctx.fillText('Support vectors highlighted with cyan ring', padding + 10, padding + 50);
}

function initSVMCParameter() {
  const canvas = document.getElementById('svm-c-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  
  const cSlider = document.getElementById('svm-c-slider');
  if (cSlider) {
    cSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.svm.C = Math.pow(10, val);
      document.getElementById('svm-c-val').textContent = state.svm.C.toFixed(state.svm.C < 10 ? 1 : 0);
      drawSVMCParameter();
    });
  }
  
  drawSVMCParameter();
}

function drawSVMCParameter() {
  const canvas = document.getElementById('svm-c-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const xMin = 0, xMax = 10;
  const yMin = 0, yMax = 10;
  
  const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth;
  const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight;
  
  // Adjust margin based on C
  const C = state.svm.C;
  const marginFactor = Math.min(1, 10 / C);
  const w1 = 0.5 * marginFactor, w2 = -1 * marginFactor, b = 5.5;
  
  // Calculate violations
  let violations = 0;
  data.svm.forEach(point => {
    const score = w1 * point.x1 + w2 * point.x2 + b;
    if (point.class * score < 1) violations++;
  });
  
  // Draw margin lines
  if (Math.abs(w2) > 0.01) {
    ctx.strokeStyle = '#ff8c6a';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    let x1 = xMin, y1 = -(w1 * x1 + b - 1) / w2;
    let x2 = xMax, y2 = -(w1 * x2 + b - 1) / w2;
    ctx.moveTo(scaleX(x1), scaleY(y1));
    ctx.lineTo(scaleX(x2), scaleY(y2));
    ctx.stroke();
    
    ctx.beginPath();
    y1 = -(w1 * x1 + b + 1) / w2;
    y2 = -(w1 * x2 + b + 1) / w2;
    ctx.moveTo(scaleX(x1), scaleY(y1));
    ctx.lineTo(scaleX(x2), scaleY(y2));
    ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.strokeStyle = '#6aa9ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    y1 = -(w1 * x1 + b) / w2;
    y2 = -(w1 * x2 + b) / w2;
    ctx.moveTo(scaleX(x1), scaleY(y1));
    ctx.lineTo(scaleX(x2), scaleY(y2));
    ctx.stroke();
  }
  
  // Draw points
  data.svm.forEach(point => {
    const x = scaleX(point.x1);
    const y = scaleY(point.x2);
    const score = w1 * point.x1 + w2 * point.x2 + b;
    const violates = point.class * score < 1;
    
    ctx.fillStyle = point.class === 1 ? '#7ef0d4' : '#ff8c6a';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    if (violates) {
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });
  
  // Update info
  const wNorm = Math.sqrt(w1 * w1 + w2 * w2);
  const marginWidth = 2 / wNorm;
  document.getElementById('margin-width').textContent = marginWidth.toFixed(2);
  document.getElementById('violations-count').textContent = violations;
}

function initSVMTraining() {
  const canvas = document.getElementById('svm-train-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  
  const trainBtn = document.getElementById('svm-train-btn');
  const stepBtn = document.getElementById('svm-step-btn');
  const resetBtn = document.getElementById('svm-reset-btn');
  
  if (trainBtn) {
    trainBtn.addEventListener('click', () => {
      state.svm.training.step = 0;
      state.svm.training.w = [0, 0];
      state.svm.training.b = 0;
      state.svm.training.isTraining = true;
      autoTrain();
    });
  }
  
  if (stepBtn) {
    stepBtn.addEventListener('click', () => {
      if (state.svm.training.step < data.svm.length) {
        trainStep();
      }
    });
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.svm.training.step = 0;
      state.svm.training.w = [0, 0];
      state.svm.training.b = 0;
      state.svm.training.isTraining = false;
      updateTrainingInfo();
      drawSVMTraining();
    });
  }
  
  drawSVMTraining();
}

function trainStep() {
  if (state.svm.training.step >= data.svm.length) return;
  
  const point = data.svm[state.svm.training.step];
  const w = state.svm.training.w;
  const b = state.svm.training.b;
  const lr = state.svm.training.learningRate;
  const C = 1;
  
  const score = w[0] * point.x1 + w[1] * point.x2 + b;
  const violation = point.class * score < 1;
  
  if (violation) {
    w[0] = w[0] - lr * (w[0] - C * point.class * point.x1);
    w[1] = w[1] - lr * (w[1] - C * point.class * point.x2);
    state.svm.training.b = b + lr * C * point.class;
  } else {
    w[0] = w[0] - lr * w[0];
    w[1] = w[1] - lr * w[1];
  }
  
  state.svm.training.step++;
  updateTrainingInfo(point, violation);
  drawSVMTraining();
}

function autoTrain() {
  if (!state.svm.training.isTraining) return;
  
  if (state.svm.training.step < data.svm.length) {
    trainStep();
    setTimeout(autoTrain, 800);
  } else {
    state.svm.training.isTraining = false;
  }
}

function updateTrainingInfo(point = null, violation = null) {
  document.getElementById('train-step').textContent = state.svm.training.step;
  document.getElementById('train-point').textContent = point ? `${point.label} (${point.x1}, ${point.x2})` : '-';
  document.getElementById('train-w').textContent = `${state.svm.training.w[0].toFixed(2)}, ${state.svm.training.w[1].toFixed(2)}`;
  document.getElementById('train-b').textContent = state.svm.training.b.toFixed(2);
  document.getElementById('train-violation').textContent = violation === null ? '-' : (violation ? 'YES ❌' : 'NO ✓');
}

function drawSVMTraining() {
  const canvas = document.getElementById('svm-train-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const xMin = 0, xMax = 10;
  const yMin = 0, yMax = 10;
  
  const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth;
  const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight;
  
  const w = state.svm.training.w;
  const b = state.svm.training.b;
  
  // Draw boundary if weights are non-zero
  if (Math.abs(w[1]) > 0.01) {
    ctx.strokeStyle = '#6aa9ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const x1 = xMin, y1 = -(w[0] * x1 + b) / w[1];
    const x2 = xMax, y2 = -(w[0] * x2 + b) / w[1];
    ctx.moveTo(scaleX(x1), scaleY(y1));
    ctx.lineTo(scaleX(x2), scaleY(y2));
    ctx.stroke();
  }
  
  // Draw points
  data.svm.forEach((point, i) => {
    const x = scaleX(point.x1);
    const y = scaleY(point.x2);
    const processed = i < state.svm.training.step;
    const current = i === state.svm.training.step - 1;
    
    ctx.fillStyle = point.class === 1 ? '#7ef0d4' : '#ff8c6a';
    ctx.globalAlpha = processed ? 1 : 0.3;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    if (current) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(point.label, x, y - 15);
  });
}

function initSVMKernel() {
  const canvas = document.getElementById('svm-kernel-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  
  const kernelRadios = document.querySelectorAll('input[name="kernel"]');
  kernelRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.svm.kernel = e.target.value;
      const paramGroup = document.getElementById('kernel-param-group');
      if (paramGroup) {
        paramGroup.style.display = state.svm.kernel === 'linear' ? 'none' : 'block';
      }
      drawSVMKernel();
    });
  });
  
  const paramSlider = document.getElementById('kernel-param-slider');
  if (paramSlider) {
    paramSlider.addEventListener('input', (e) => {
      state.svm.kernelParam = parseFloat(e.target.value);
      document.getElementById('kernel-param-val').textContent = state.svm.kernelParam.toFixed(1);
      drawSVMKernel();
    });
  }
  
  drawSVMKernel();
}

function drawSVMKernel() {
  const canvas = document.getElementById('svm-kernel-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 500;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Generate circular data
  const innerPoints = [];
  const outerPoints = [];
  
  for (let i = 0; i < 15; i++) {
    const angle = (i / 15) * 2 * Math.PI;
    innerPoints.push({ x: 5 + 1.5 * Math.cos(angle), y: 5 + 1.5 * Math.sin(angle), class: 1 });
  }
  
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * 2 * Math.PI;
    const r = 3.5 + Math.random() * 0.5;
    outerPoints.push({ x: 5 + r * Math.cos(angle), y: 5 + r * Math.sin(angle), class: -1 });
  }
  
  const allPoints = [...innerPoints, ...outerPoints];
  
  const xMin = 0, xMax = 10;
  const yMin = 0, yMax = 10;
  
  const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth;
  const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight;
  
  // Draw decision boundary based on kernel
  if (state.svm.kernel === 'linear') {
    // Linear can't separate circular data well
    ctx.strokeStyle = 'rgba(106, 169, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scaleX(2), scaleY(2));
    ctx.lineTo(scaleX(8), scaleY(8));
    ctx.stroke();
  } else if (state.svm.kernel === 'polynomial' || state.svm.kernel === 'rbf') {
    // Draw circular boundary
    ctx.strokeStyle = '#6aa9ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const radius = state.svm.kernel === 'polynomial' ? 2.5 : 2.3 + state.svm.kernelParam * 0.1;
    ctx.arc(scaleX(5), scaleY(5), radius * (chartWidth / 10), 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  // Draw points
  allPoints.forEach(point => {
    const x = scaleX(point.x);
    const y = scaleY(point.y);
    
    ctx.fillStyle = point.class === 1 ? '#7ef0d4' : '#ff8c6a';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  // Draw kernel info
  ctx.fillStyle = '#7ef0d4';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'left';
  const kernelName = state.svm.kernel === 'linear' ? 'Linear Kernel' :
                     state.svm.kernel === 'polynomial' ? 'Polynomial Kernel' : 'RBF Kernel';
  ctx.fillText(kernelName, padding + 10, padding + 25);
  
  if (state.svm.kernel === 'linear') {
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#ff8c6a';
    ctx.fillText('❌ Linear kernel cannot separate circular data!', padding + 10, padding + 50);
  } else {
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#7ef0d4';
    ctx.fillText('✓ Non-linear kernel successfully separates the data', padding + 10, padding + 50);
  }
}

// Logistic Regression Visualizations
function initLogistic() {
  initSigmoid();
  initLogisticClassification();
}

function initSigmoid() {
  const canvas = document.getElementById('sigmoid-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  drawSigmoid();
}

function drawSigmoid() {
  const canvas = document.getElementById('sigmoid-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 350;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const zMin = -10, zMax = 10;
  const scaleX = (z) => padding + ((z - zMin) / (zMax - zMin)) * chartWidth;
  const scaleY = (sig) => height - padding - sig * chartHeight;
  
  // Draw grid
  ctx.strokeStyle = 'rgba(42, 53, 68, 0.5)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const x = padding + (chartWidth / 10) * i;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
    
    const y = padding + (chartHeight / 10) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  
  // Draw axes
  ctx.strokeStyle = '#2a3544';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Draw threshold line at 0.5
  ctx.strokeStyle = '#ff8c6a';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(padding, scaleY(0.5));
  ctx.lineTo(width - padding, scaleY(0.5));
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw sigmoid curve
  ctx.strokeStyle = '#7ef0d4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let z = zMin; z <= zMax; z += 0.1) {
    const sig = 1 / (1 + Math.exp(-z));
    const x = scaleX(z);
    const y = scaleY(sig);
    if (z === zMin) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('z (input)', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('σ(z) probability', 0, 0);
  ctx.restore();
  
  // Annotations
  ctx.fillStyle = '#7ef0d4';
  ctx.textAlign = 'left';
  ctx.fillText('σ(z) = 1/(1+e⁻ᶻ)', padding + 10, padding + 25);
  ctx.fillStyle = '#ff8c6a';
  ctx.fillText('Threshold = 0.5', padding + 10, scaleY(0.5) - 10);
}

function initLogisticClassification() {
  const canvas = document.getElementById('logistic-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  drawLogisticClassification();
}

function drawLogisticClassification() {
  const canvas = document.getElementById('logistic-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const hMin = 140, hMax = 210;
  const scaleX = (h) => padding + ((h - hMin) / (hMax - hMin)) * chartWidth;
  const scaleY = (p) => height - padding - p * chartHeight;
  
  // Draw sigmoid curve
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let h = hMin; h <= hMax; h += 1) {
    const z = (h - 170) / 10; // Simple linear transformation
    const p = 1 / (1 + Math.exp(-z));
    const x = scaleX(h);
    const y = scaleY(p);
    if (h === hMin) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  
  // Draw threshold line
  ctx.strokeStyle = '#ff8c6a';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(padding, scaleY(0.5));
  ctx.lineTo(width - padding, scaleY(0.5));
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw data points
  data.logistic.forEach(point => {
    const x = scaleX(point.height);
    const y = scaleY(point.prob);
    
    ctx.fillStyle = point.label === 1 ? '#7ef0d4' : '#ff8c6a';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Label
    ctx.fillStyle = '#e8eef6';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(point.height, x, height - padding + 20);
  });
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Height (cm)', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('P(Tall)', 0, 0);
  ctx.restore();
}

// KNN Visualization
let knnState = { testPoint: { x: 2.5, y: 2.5 }, k: 3, distanceMetric: 'euclidean', dragging: false };

function initKNN() {
  const canvas = document.getElementById('knn-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  
  const kSlider = document.getElementById('knn-k-slider');
  if (kSlider) {
    kSlider.addEventListener('input', (e) => {
      knnState.k = parseInt(e.target.value);
      document.getElementById('knn-k-val').textContent = knnState.k;
      drawKNN();
    });
  }
  
  const distanceRadios = document.querySelectorAll('input[name="knn-distance"]');
  distanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      knnState.distanceMetric = e.target.value;
      drawKNN();
    });
  });
  
  canvas.addEventListener('mousedown', startDragKNN);
  canvas.addEventListener('mousemove', dragKNN);
  canvas.addEventListener('mouseup', stopDragKNN);
  
  drawKNN();
}

function startDragKNN(e) {
  const canvas = document.getElementById('knn-canvas');
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  
  const padding = 60;
  const chartWidth = canvas.width - 2 * padding;
  const chartHeight = canvas.height - 2 * padding;
  
  const tx = padding + (knnState.testPoint.x / 6) * chartWidth;
  const ty = canvas.height - padding - (knnState.testPoint.y / 6) * chartHeight;
  
  if (Math.abs(mx - tx) < 15 && Math.abs(my - ty) < 15) {
    knnState.dragging = true;
  }
}

function dragKNN(e) {
  if (!knnState.dragging) return;
  
  const canvas = document.getElementById('knn-canvas');
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  
  const padding = 60;
  const chartWidth = canvas.width - 2 * padding;
  const chartHeight = canvas.height - 2 * padding;
  
  knnState.testPoint.x = Math.max(0, Math.min(6, ((mx - padding) / chartWidth) * 6));
  knnState.testPoint.y = Math.max(0, Math.min(6, ((canvas.height - padding - my) / chartHeight) * 6));
  
  drawKNN();
}

function stopDragKNN() {
  knnState.dragging = false;
}

function drawKNN() {
  const canvas = document.getElementById('knn-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const scaleX = (x) => padding + (x / 6) * chartWidth;
  const scaleY = (y) => height - padding - (y / 6) * chartHeight;
  
  // Calculate distances
  const distances = data.knn.map(point => {
    let d;
    if (knnState.distanceMetric === 'euclidean') {
      d = Math.sqrt(Math.pow(point.x - knnState.testPoint.x, 2) + Math.pow(point.y - knnState.testPoint.y, 2));
    } else {
      d = Math.abs(point.x - knnState.testPoint.x) + Math.abs(point.y - knnState.testPoint.y);
    }
    return { ...point, distance: d };
  });
  
  distances.sort((a, b) => a.distance - b.distance);
  const kNearest = distances.slice(0, knnState.k);
  
  // Count votes
  const votes = {};
  kNearest.forEach(p => {
    votes[p.class] = (votes[p.class] || 0) + 1;
  });
  const prediction = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
  
  // Draw lines to K nearest
  kNearest.forEach(point => {
    ctx.strokeStyle = 'rgba(126, 240, 212, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(scaleX(knnState.testPoint.x), scaleY(knnState.testPoint.y));
    ctx.lineTo(scaleX(point.x), scaleY(point.y));
    ctx.stroke();
  });
  
  // Draw training points
  distances.forEach(point => {
    const x = scaleX(point.x);
    const y = scaleY(point.y);
    const isNearest = kNearest.includes(point);
    
    ctx.fillStyle = point.class === 'orange' ? '#ff8c6a' : '#ffeb3b';
    ctx.globalAlpha = isNearest ? 1 : 0.5;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    if (isNearest) {
      ctx.strokeStyle = '#7ef0d4';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
  
  // Draw test point
  const tx = scaleX(knnState.testPoint.x);
  const ty = scaleY(knnState.testPoint.y);
  ctx.fillStyle = prediction === 'orange' ? '#ff8c6a' : '#ffeb3b';
  ctx.beginPath();
  ctx.arc(tx, ty, 12, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Info
  ctx.fillStyle = '#7ef0d4';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`K=${knnState.k} | Prediction: ${prediction}`, padding + 10, padding + 25);
  ctx.fillText(`Votes: Orange=${votes.orange || 0}, Yellow=${votes.yellow || 0}`, padding + 10, padding + 50);
}

// Model Evaluation
function initModelEvaluation() {
  initConfusionMatrix();
  initROC();
  initR2();
}

function initConfusionMatrix() {
  const canvas = document.getElementById('confusion-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  drawConfusionMatrix();
}

function drawConfusionMatrix() {
  const canvas = document.getElementById('confusion-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 300;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const size = Math.min(width, height) - 100;
  const cellSize = size / 2;
  const startX = (width - size) / 2;
  const startY = 50;
  
  const cm = { tp: 600, fp: 100, fn: 300, tn: 900 };
  
  // Draw cells
  const cells = [
    { x: startX, y: startY, val: cm.tp, label: 'TP', color: '#7ef0d4' },
    { x: startX + cellSize, y: startY, val: cm.fn, label: 'FN', color: '#ff8c6a' },
    { x: startX, y: startY + cellSize, val: cm.fp, label: 'FP', color: '#ff8c6a' },
    { x: startX + cellSize, y: startY + cellSize, val: cm.tn, label: 'TN', color: '#7ef0d4' }
  ];
  
  cells.forEach(cell => {
    ctx.fillStyle = cell.color + '22';
    ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
    ctx.strokeStyle = cell.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(cell.x, cell.y, cellSize, cellSize);
    
    ctx.fillStyle = cell.color;
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(cell.label, cell.x + cellSize / 2, cell.y + cellSize / 2 - 10);
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(cell.val, cell.x + cellSize / 2, cell.y + cellSize / 2 + 25);
  });
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Predicted Positive', startX + cellSize / 2, startY - 15);
  ctx.fillText('Predicted Negative', startX + cellSize * 1.5, startY - 15);
  ctx.save();
  ctx.translate(startX - 30, startY + cellSize / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Actual Positive', 0, 0);
  ctx.restore();
  ctx.save();
  ctx.translate(startX - 30, startY + cellSize * 1.5);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Actual Negative', 0, 0);
  ctx.restore();
}

let rocState = { threshold: 0.5 };

function initROC() {
  const canvas = document.getElementById('roc-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  
  const slider = document.getElementById('roc-threshold-slider');
  if (slider) {
    slider.addEventListener('input', (e) => {
      rocState.threshold = parseFloat(e.target.value);
      document.getElementById('roc-threshold-val').textContent = rocState.threshold.toFixed(1);
      drawROC();
    });
  }
  
  drawROC();
}

function drawROC() {
  const canvas = document.getElementById('roc-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartSize = Math.min(width - 2 * padding, height - 2 * padding);
  const chartX = (width - chartSize) / 2;
  const chartY = (height - chartSize) / 2;
  
  // Calculate ROC points
  const rocPoints = [];
  for (let t = 0; t <= 1; t += 0.1) {
    let tp = 0, fp = 0, tn = 0, fn = 0;
    data.roc.forEach(e => {
      const pred = e.score >= t ? 1 : 0;
      if (e.true_label === 1 && pred === 1) tp++;
      else if (e.true_label === 0 && pred === 1) fp++;
      else if (e.true_label === 1 && pred === 0) fn++;
      else tn++;
    });
    const tpr = tp / (tp + fn) || 0;
    const fpr = fp / (fp + tn) || 0;
    rocPoints.push({ t, tpr, fpr });
  }
  
  // Current threshold point
  let tp = 0, fp = 0, tn = 0, fn = 0;
  data.roc.forEach(e => {
    const pred = e.score >= rocState.threshold ? 1 : 0;
    if (e.true_label === 1 && pred === 1) tp++;
    else if (e.true_label === 0 && pred === 1) fp++;
    else if (e.true_label === 1 && pred === 0) fn++;
    else tn++;
  });
  const tpr = tp / (tp + fn) || 0;
  const fpr = fp / (fp + tn) || 0;
  
  // Draw diagonal (random)
  ctx.strokeStyle = 'rgba(255, 140, 106, 0.5)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(chartX, chartY + chartSize);
  ctx.lineTo(chartX + chartSize, chartY);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw ROC curve
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  rocPoints.forEach((p, i) => {
    const x = chartX + p.fpr * chartSize;
    const y = chartY + chartSize - p.tpr * chartSize;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Draw current point
  const cx = chartX + fpr * chartSize;
  const cy = chartY + chartSize - tpr * chartSize;
  ctx.fillStyle = '#7ef0d4';
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw axes
  ctx.strokeStyle = '#2a3544';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(chartX, chartY, chartSize, chartSize);
  ctx.stroke();
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FPR (False Positive Rate)', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('TPR (True Positive Rate)', 0, 0);
  ctx.restore();
  
  // Info
  ctx.fillStyle = '#7ef0d4';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`TPR: ${tpr.toFixed(2)} | FPR: ${fpr.toFixed(2)}`, chartX + 10, chartY + 25);
  ctx.fillText(`TP=${tp} FP=${fp} TN=${tn} FN=${fn}`, chartX + 10, chartY + 50);
}

function initR2() {
  const canvas = document.getElementById('r2-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  drawR2();
}

function drawR2() {
  const canvas = document.getElementById('r2-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 350;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  // Dummy R² data
  const r2data = [
    { x: 150, y: 50, pred: 52 },
    { x: 160, y: 60, pred: 61 },
    { x: 170, y: 70, pred: 69 },
    { x: 180, y: 80, pred: 78 },
    { x: 190, y: 90, pred: 87 }
  ];
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const xMin = 140, xMax = 200, yMin = 40, yMax = 100;
  const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth;
  const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight;
  
  // Mean
  const mean = r2data.reduce((sum, p) => sum + p.y, 0) / r2data.length;
  
  // Draw mean line
  ctx.strokeStyle = '#ff8c6a';
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, scaleY(mean));
  ctx.lineTo(width - padding, scaleY(mean));
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw regression line
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(scaleX(xMin), scaleY(40));
  ctx.lineTo(scaleX(xMax), scaleY(95));
  ctx.stroke();
  
  // Draw points
  r2data.forEach(p => {
    // Residual line
    ctx.strokeStyle = 'rgba(126, 240, 212, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(scaleX(p.x), scaleY(p.y));
    ctx.lineTo(scaleX(p.x), scaleY(p.pred));
    ctx.stroke();
    
    // Actual point
    ctx.fillStyle = '#7ef0d4';
    ctx.beginPath();
    ctx.arc(scaleX(p.x), scaleY(p.y), 6, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  // Calculate R²
  let ssRes = 0, ssTot = 0;
  r2data.forEach(p => {
    ssRes += Math.pow(p.y - p.pred, 2);
    ssTot += Math.pow(p.y - mean, 2);
  });
  const r2 = 1 - (ssRes / ssTot);
  
  // Info
  ctx.fillStyle = '#7ef0d4';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`R² = ${r2.toFixed(3)}`, padding + 10, padding + 25);
  ctx.fillText(`Model explains ${(r2 * 100).toFixed(1)}% of variance`, padding + 10, padding + 50);
}

// Regularization
let regState = { lambda: 0.1 };

function initRegularization() {
  const canvas = document.getElementById('regularization-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  
  const slider = document.getElementById('reg-lambda-slider');
  if (slider) {
    slider.addEventListener('input', (e) => {
      regState.lambda = parseFloat(e.target.value);
      document.getElementById('reg-lambda-val').textContent = regState.lambda.toFixed(1);
      drawRegularization();
    });
  }
  
  drawRegularization();
}

function drawRegularization() {
  const canvas = document.getElementById('regularization-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const features = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8', 'x9', 'x10'];
  const vanilla = [100, 200, 300, 50, 150, 250, 80, 120, 90, 180];
  
  // Simulate L1 and L2 effects
  const l1 = vanilla.map(v => Math.abs(v) > 50 / regState.lambda ? v * (1 - regState.lambda * 0.5) : 0);
  const l2 = vanilla.map(v => v / (1 + regState.lambda));
  
  const barWidth = chartWidth / (features.length * 3.5);
  const maxVal = Math.max(...vanilla);
  
  features.forEach((f, i) => {
    const x = padding + (i * chartWidth / features.length);
    
    // Vanilla
    const h1 = (vanilla[i] / maxVal) * chartHeight * 0.8;
    ctx.fillStyle = '#a9b4c2';
    ctx.fillRect(x, height - padding - h1, barWidth, h1);
    
    // L1
    const h2 = (l1[i] / maxVal) * chartHeight * 0.8;
    ctx.fillStyle = '#ff8c6a';
    ctx.fillRect(x + barWidth * 1.2, height - padding - h2, barWidth, h2);
    
    // L2
    const h3 = (l2[i] / maxVal) * chartHeight * 0.8;
    ctx.fillStyle = '#6aa9ff';
    ctx.fillRect(x + barWidth * 2.4, height - padding - h3, barWidth, h3);
    
    // Feature label
    ctx.fillStyle = '#a9b4c2';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(f, x + barWidth * 1.5, height - padding + 20);
  });
  
  // Legend
  const legendY = padding + 20;
  ctx.fillStyle = '#a9b4c2';
  ctx.fillRect(padding + 10, legendY, 15, 15);
  ctx.fillStyle = '#e8eef6';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Vanilla', padding + 30, legendY + 12);
  
  ctx.fillStyle = '#ff8c6a';
  ctx.fillRect(padding + 100, legendY, 15, 15);
  ctx.fillStyle = '#e8eef6';
  ctx.fillText('L1 (Lasso)', padding + 120, legendY + 12);
  
  ctx.fillStyle = '#6aa9ff';
  ctx.fillRect(padding + 210, legendY, 15, 15);
  ctx.fillStyle = '#e8eef6';
  ctx.fillText('L2 (Ridge)', padding + 230, legendY + 12);
}

// Bias-Variance
function initBiasVariance() {
  const canvas = document.getElementById('bias-variance-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  drawBiasVariance();
  
  const canvas2 = document.getElementById('complexity-canvas');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawComplexityCurve();
  }
}

function drawBiasVariance() {
  const canvas = document.getElementById('bias-variance-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const sectionWidth = width / 3;
  const padding = 40;
  const chartHeight = height - 2 * padding;
  
  // Generate curved data
  const trueData = [];
  for (let x = 0; x <= 10; x += 0.5) {
    trueData.push({ x, y: 50 + 30 * Math.sin(x / 2) });
  }
  
  // Draw three scenarios
  const scenarios = [
    { title: 'High Bias\n(Underfit)', color: '#ff8c6a', degree: 1 },
    { title: 'Good Fit', color: '#7ef0d4', degree: 2 },
    { title: 'High Variance\n(Overfit)', color: '#ff8c6a', degree: 8 }
  ];
  
  scenarios.forEach((scenario, idx) => {
    const offsetX = idx * sectionWidth;
    const scaleX = (x) => offsetX + padding + (x / 10) * (sectionWidth - 2 * padding);
    const scaleY = (y) => padding + chartHeight - ((y - 20) / 80) * chartHeight;
    
    // Draw true curve
    ctx.strokeStyle = 'rgba(106, 169, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    trueData.forEach((p, i) => {
      if (i === 0) ctx.moveTo(scaleX(p.x), scaleY(p.y));
      else ctx.lineTo(scaleX(p.x), scaleY(p.y));
    });
    ctx.stroke();
    
    // Draw model fit
    ctx.strokeStyle = scenario.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (scenario.degree === 1) {
      // Straight line
      ctx.moveTo(scaleX(0), scaleY(50));
      ctx.lineTo(scaleX(10), scaleY(65));
    } else if (scenario.degree === 2) {
      // Good fit
      trueData.forEach((p, i) => {
        const noise = (Math.random() - 0.5) * 3;
        if (i === 0) ctx.moveTo(scaleX(p.x), scaleY(p.y + noise));
        else ctx.lineTo(scaleX(p.x), scaleY(p.y + noise));
      });
    } else {
      // Wiggly overfit
      for (let x = 0; x <= 10; x += 0.2) {
        const y = 50 + 30 * Math.sin(x / 2) + 15 * Math.sin(x * 2);
        if (x === 0) ctx.moveTo(scaleX(x), scaleY(y));
        else ctx.lineTo(scaleX(x), scaleY(y));
      }
    }
    ctx.stroke();
    
    // Title
    ctx.fillStyle = scenario.color;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    const lines = scenario.title.split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, offsetX + sectionWidth / 2, 20 + i * 18);
    });
  });
}

function drawComplexityCurve() {
  const canvas = document.getElementById('complexity-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 350;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const scaleX = (x) => padding + (x / 10) * chartWidth;
  const scaleY = (y) => padding + chartHeight - (y / 100) * chartHeight;
  
  // Draw curves
  ctx.strokeStyle = '#ff8c6a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x <= 10; x += 0.1) {
    const trainError = 80 * Math.exp(-x / 2) + 5;
    if (x === 0) ctx.moveTo(scaleX(x), scaleY(trainError));
    else ctx.lineTo(scaleX(x), scaleY(trainError));
  }
  ctx.stroke();
  
  ctx.strokeStyle = '#6aa9ff';
  ctx.beginPath();
  for (let x = 0; x <= 10; x += 0.1) {
    const testError = 80 * Math.exp(-x / 2) + 5 + 15 * (x / 10) ** 2;
    if (x === 0) ctx.moveTo(scaleX(x), scaleY(testError));
    else ctx.lineTo(scaleX(x), scaleY(testError));
  }
  ctx.stroke();
  
  // Sweet spot
  ctx.fillStyle = '#7ef0d4';
  ctx.beginPath();
  ctx.arc(scaleX(5), scaleY(18), 8, 0, 2 * Math.PI);
  ctx.fill();
  
  // Legend
  ctx.fillStyle = '#ff8c6a';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Training Error', padding + 10, padding + 20);
  ctx.fillStyle = '#6aa9ff';
  ctx.fillText('Test Error', padding + 10, padding + 40);
  ctx.fillStyle = '#7ef0d4';
  ctx.fillText('● Sweet Spot', padding + 10, padding + 60);
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.textAlign = 'center';
  ctx.fillText('Model Complexity →', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Error', 0, 0);
  ctx.restore();
}

// Cross-Validation
function initCrossValidation() {
  const canvas = document.getElementById('cv-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  drawCrossValidation();
}

function drawCrossValidation() {
  const canvas = document.getElementById('cv-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const blockSize = 50;
  const gap = 10;
  const numBlocks = 12;
  const k = 3;
  const blocksPerFold = numBlocks / k;
  
  const startX = (width - (numBlocks * blockSize + (numBlocks - 1) * gap)) / 2;
  
  const folds = [0.96, 0.84, 0.90];
  
  for (let fold = 0; fold < k; fold++) {
    const offsetY = 80 + fold * 120;
    
    // Fold label
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Fold ${fold + 1}:`, startX - 20, offsetY + blockSize / 2 + 5);
    
    // Draw blocks
    for (let i = 0; i < numBlocks; i++) {
      const x = startX + i * (blockSize + gap);
      const isFold = i >= fold * blocksPerFold && i < (fold + 1) * blocksPerFold;
      
      ctx.fillStyle = isFold ? '#6aa9ff' : '#7ef0d4';
      ctx.fillRect(x, offsetY, blockSize, blockSize);
      
      // Label
      ctx.fillStyle = '#1a2332';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String.fromCharCode(65 + i), x + blockSize / 2, offsetY + blockSize / 2 + 5);
    }
    
    // Accuracy
    ctx.fillStyle = '#7ef0d4';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Acc: ${folds[fold].toFixed(2)}`, startX + numBlocks * (blockSize + gap) + 20, offsetY + blockSize / 2 + 5);
  }
  
  // Legend
  ctx.fillStyle = '#6aa9ff';
  ctx.fillRect(startX, 30, 30, 20);
  ctx.fillStyle = '#e8eef6';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Test Set', startX + 40, 45);
  
  ctx.fillStyle = '#7ef0d4';
  ctx.fillRect(startX + 120, 30, 30, 20);
  ctx.fillText('Training Set', startX + 160, 45);
  
  // Final result
  const mean = folds.reduce((a, b) => a + b) / folds.length;
  const std = Math.sqrt(folds.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / folds.length);
  
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Final Score: ${mean.toFixed(2)} ± ${std.toFixed(3)}`, width / 2, height - 20);
}

// Preprocessing
function initPreprocessing() {
  const canvas = document.getElementById('scaling-canvas');
  if (canvas && !canvas.dataset.initialized) {
    canvas.dataset.initialized = 'true';
    drawScaling();
  }
  
  const canvas2 = document.getElementById('pipeline-canvas');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawPipeline();
  }
}

function drawScaling() {
  const canvas = document.getElementById('scaling-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 350;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const before = [10, 20, 30, 40, 50];
  const standard = [-1.26, -0.63, 0, 0.63, 1.26];
  const minmax = [0, 0.25, 0.5, 0.75, 1.0];
  
  const sectionWidth = width / 3;
  const padding = 40;
  const barWidth = 30;
  
  const datasets = [
    { data: before, title: 'Original', maxVal: 60 },
    { data: standard, title: 'StandardScaler', maxVal: 2 },
    { data: minmax, title: 'MinMaxScaler', maxVal: 1.2 }
  ];
  
  datasets.forEach((dataset, idx) => {
    const offsetX = idx * sectionWidth;
    const centerX = offsetX + sectionWidth / 2;
    
    // Title
    ctx.fillStyle = '#7ef0d4';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dataset.title, centerX, 30);
    
    // Draw bars
    dataset.data.forEach((val, i) => {
      const barHeight = Math.abs(val) / dataset.maxVal * 200;
      const x = centerX - barWidth / 2;
      const y = val >= 0 ? 200 - barHeight : 200;
      
      ctx.fillStyle = '#6aa9ff';
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Value label
      ctx.fillStyle = '#a9b4c2';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(val.toFixed(2), centerX, val >= 0 ? y - 5 : y + barHeight + 15);
      
      centerX += 35;
    });
  });
}

function drawPipeline() {
  const canvas = document.getElementById('pipeline-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 300;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const steps = ['Raw Data', 'Handle Missing', 'Encode Categories', 'Scale Features', 'Train Model'];
  const stepWidth = (width - 100) / steps.length;
  const y = height / 2;
  
  steps.forEach((step, i) => {
    const x = 50 + i * stepWidth;
    
    // Box
    ctx.fillStyle = '#2a3544';
    ctx.fillRect(x, y - 30, stepWidth - 40, 60);
    ctx.strokeStyle = '#6aa9ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y - 30, stepWidth - 40, 60);
    
    // Text
    ctx.fillStyle = '#e8eef6';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    const words = step.split(' ');
    words.forEach((word, j) => {
      ctx.fillText(word, x + (stepWidth - 40) / 2, y + j * 15 - 5);
    });
    
    // Arrow
    if (i < steps.length - 1) {
      ctx.strokeStyle = '#7ef0d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + stepWidth - 40, y);
      ctx.lineTo(x + stepWidth - 10, y);
      ctx.stroke();
      
      // Arrowhead
      ctx.fillStyle = '#7ef0d4';
      ctx.beginPath();
      ctx.moveTo(x + stepWidth - 10, y);
      ctx.lineTo(x + stepWidth - 20, y - 5);
      ctx.lineTo(x + stepWidth - 20, y + 5);
      ctx.fill();
    }
  });
}

// Loss Functions
function initLossFunctions() {
  const canvas = document.getElementById('loss-comparison-canvas');
  if (canvas && !canvas.dataset.initialized) {
    canvas.dataset.initialized = 'true';
    drawLossComparison();
  }
  
  const canvas2 = document.getElementById('loss-curves-canvas');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawLossCurves();
  }
}

function drawLossComparison() {
  const canvas = document.getElementById('loss-comparison-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const actual = [10, 20, 30, 40, 50];
  const predicted = [12, 19, 32, 38, 51];
  
  // Calculate losses
  let mse = 0, mae = 0;
  actual.forEach((a, i) => {
    const error = a - predicted[i];
    mse += error * error;
    mae += Math.abs(error);
  });
  mse /= actual.length;
  mae /= actual.length;
  const rmse = Math.sqrt(mse);
  
  // Display
  const padding = 60;
  const barHeight = 60;
  const startY = 100;
  const maxWidth = width - 2 * padding;
  
  const losses = [
    { name: 'MSE', value: mse, color: '#ff8c6a' },
    { name: 'MAE', value: mae, color: '#6aa9ff' },
    { name: 'RMSE', value: rmse, color: '#7ef0d4' }
  ];
  
  const maxLoss = Math.max(...losses.map(l => l.value));
  
  losses.forEach((loss, i) => {
    const y = startY + i * (barHeight + 30);
    const barWidth = (loss.value / maxLoss) * maxWidth;
    
    // Bar
    ctx.fillStyle = loss.color;
    ctx.fillRect(padding, y, barWidth, barHeight);
    
    // Label
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(loss.name, padding + 10, y + barHeight / 2 + 5);
    
    // Value
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(loss.value.toFixed(2), padding + barWidth - 10, y + barHeight / 2 + 5);
  });
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Regression Loss Comparison', width / 2, 50);
}

function drawLossCurves() {
  const canvas = document.getElementById('loss-curves-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 350;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const scaleX = (x) => padding + (x / 10) * chartWidth;
  const scaleY = (y) => height - padding - (y / 100) * chartHeight;
  
  // Draw MSE curve
  ctx.strokeStyle = '#ff8c6a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = -10; x <= 10; x += 0.2) {
    const y = x * x;
    if (x === -10) ctx.moveTo(scaleX(x + 10), scaleY(y));
    else ctx.lineTo(scaleX(x + 10), scaleY(y));
  }
  ctx.stroke();
  
  // Draw MAE curve
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = -10; x <= 10; x += 0.2) {
    const y = Math.abs(x) * 10;
    if (x === -10) ctx.moveTo(scaleX(x + 10), scaleY(y));
    else ctx.lineTo(scaleX(x + 10), scaleY(y));
  }
  ctx.stroke();
  
  // Legend
  ctx.fillStyle = '#ff8c6a';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('MSE (quadratic penalty)', padding + 10, padding + 20);
  ctx.fillStyle = '#6aa9ff';
  ctx.fillText('MAE (linear penalty)', padding + 10, padding + 40);
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.textAlign = 'center';
  ctx.fillText('Error', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Loss', 0, 0);
  ctx.restore();
}

// Topic 13: Finding Optimal K in KNN
function initOptimalK() {
  const canvas1 = document.getElementById('elbow-canvas');
  if (canvas1 && !canvas1.dataset.initialized) {
    canvas1.dataset.initialized = 'true';
    drawElbowCurve();
  }
  
  const canvas2 = document.getElementById('cv-k-canvas');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawCVKHeatmap();
  }
}

function drawElbowCurve() {
  const canvas = document.getElementById('elbow-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Data from application_data_json
  const kValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  const accuracies = [0.96, 0.94, 0.93, 0.91, 0.89, 0.87, 0.85, 0.84, 0.83, 0.82, 0.81, 0.80, 0.79, 0.78, 0.77, 0.76, 0.75, 0.74, 0.73];
  const optimalK = 3;
  
  const scaleX = (k) => padding + ((k - 1) / (kValues.length - 1)) * chartWidth;
  const scaleY = (acc) => height - padding - ((acc - 0.7) / 0.3) * chartHeight;
  
  // Draw axes
  ctx.strokeStyle = '#2a3544';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Draw curve
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  kValues.forEach((k, i) => {
    const x = scaleX(k);
    const y = scaleY(accuracies[i]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Draw points
  kValues.forEach((k, i) => {
    const x = scaleX(k);
    const y = scaleY(accuracies[i]);
    ctx.fillStyle = k === optimalK ? '#7ef0d4' : '#6aa9ff';
    ctx.beginPath();
    ctx.arc(x, y, k === optimalK ? 8 : 4, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  // Highlight optimal K
  const optX = scaleX(optimalK);
  const optY = scaleY(accuracies[optimalK - 1]);
  ctx.strokeStyle = '#7ef0d4';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(optX, optY);
  ctx.lineTo(optX, height - padding);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('K (Number of Neighbors)', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Accuracy', 0, 0);
  ctx.restore();
  
  // Optimal K label
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Optimal K = ${optimalK}`, optX, padding + 30);
  ctx.fillText(`Accuracy: ${accuracies[optimalK - 1].toFixed(2)}`, optX, padding + 50);
}

function drawCVKHeatmap() {
  const canvas = document.getElementById('cv-k-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 80;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const kValues = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const folds = ['Fold 1', 'Fold 2', 'Fold 3'];
  const fold1 = [0.98, 0.92, 0.88, 0.85, 0.83, 0.81, 0.79, 0.77, 0.75, 0.73];
  const fold2 = [0.96, 0.91, 0.87, 0.83, 0.81, 0.79, 0.77, 0.75, 0.73, 0.71];
  const fold3 = [0.94, 0.90, 0.86, 0.82, 0.79, 0.77, 0.75, 0.73, 0.71, 0.69];
  const allData = [fold1, fold2, fold3];
  
  const cellWidth = chartWidth / kValues.length;
  const cellHeight = chartHeight / folds.length;
  
  // Draw heatmap
  folds.forEach((fold, i) => {
    kValues.forEach((k, j) => {
      const acc = allData[i][j];
      const x = padding + j * cellWidth;
      const y = padding + i * cellHeight;
      
      // Color based on accuracy
      const intensity = (acc - 0.65) / 0.35;
      const r = Math.floor(106 + (126 - 106) * intensity);
      const g = Math.floor(169 + (240 - 169) * intensity);
      const b = Math.floor(255 + (212 - 255) * intensity);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, cellWidth, cellHeight);
      
      // Border
      ctx.strokeStyle = '#1a2332';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellWidth, cellHeight);
      
      // Text
      ctx.fillStyle = '#1a2332';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(acc.toFixed(2), x + cellWidth / 2, y + cellHeight / 2 + 4);
    });
  });
  
  // Row labels
  ctx.fillStyle = '#e8eef6';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';
  folds.forEach((fold, i) => {
    const y = padding + i * cellHeight + cellHeight / 2;
    ctx.fillText(fold, padding - 10, y + 4);
  });
  
  // Column labels
  ctx.textAlign = 'center';
  kValues.forEach((k, j) => {
    const x = padding + j * cellWidth + cellWidth / 2;
    ctx.fillText(`K=${k}`, x, padding - 10);
  });
  
  // Mean accuracy
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  const meanAccs = kValues.map((k, j) => {
    const sum = fold1[j] + fold2[j] + fold3[j];
    return sum / 3;
  });
  const maxMean = Math.max(...meanAccs);
  const optIdx = meanAccs.indexOf(maxMean);
  ctx.fillText(`Best K = ${kValues[optIdx]} (Mean Acc: ${maxMean.toFixed(3)})`, padding, height - 20);
}

// Topic 14: Hyperparameter Tuning
function initHyperparameterTuning() {
  const canvas1 = document.getElementById('gridsearch-heatmap');
  if (canvas1 && !canvas1.dataset.initialized) {
    canvas1.dataset.initialized = 'true';
    drawGridSearchHeatmap();
  }
  
  const canvas2 = document.getElementById('param-surface');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawParamSurface();
  }
  
  const radios = document.querySelectorAll('input[name="grid-model"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      drawGridSearchHeatmap();
    });
  });
}

function drawGridSearchHeatmap() {
  const canvas = document.getElementById('gridsearch-heatmap');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 80;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const cValues = [0.1, 1, 10, 100];
  const gammaValues = [0.001, 0.01, 0.1, 1];
  
  // Simulate accuracy grid
  const accuracies = [
    [0.65, 0.82, 0.88, 0.75],
    [0.78, 0.91, 0.95, 0.89],
    [0.85, 0.93, 0.92, 0.87],
    [0.80, 0.88, 0.84, 0.82]
  ];
  
  const cellWidth = chartWidth / cValues.length;
  const cellHeight = chartHeight / gammaValues.length;
  
  let bestAcc = 0, bestI = 0, bestJ = 0;
  
  // Draw heatmap
  gammaValues.forEach((gamma, i) => {
    cValues.forEach((c, j) => {
      const acc = accuracies[i][j];
      if (acc > bestAcc) {
        bestAcc = acc;
        bestI = i;
        bestJ = j;
      }
      
      const x = padding + j * cellWidth;
      const y = padding + i * cellHeight;
      
      // Color gradient
      const intensity = (acc - 0.6) / 0.35;
      const r = Math.floor(255 - 149 * intensity);
      const g = Math.floor(140 + 100 * intensity);
      const b = Math.floor(106 + 106 * intensity);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, cellWidth, cellHeight);
      
      // Border
      ctx.strokeStyle = '#1a2332';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cellWidth, cellHeight);
      
      // Text
      ctx.fillStyle = '#1a2332';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(acc.toFixed(2), x + cellWidth / 2, y + cellHeight / 2 + 5);
    });
  });
  
  // Highlight best
  const bestX = padding + bestJ * cellWidth;
  const bestY = padding + bestI * cellHeight;
  ctx.strokeStyle = '#7ef0d4';
  ctx.lineWidth = 4;
  ctx.strokeRect(bestX, bestY, cellWidth, cellHeight);
  
  // Labels
  ctx.fillStyle = '#e8eef6';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';
  gammaValues.forEach((gamma, i) => {
    const y = padding + i * cellHeight + cellHeight / 2;
    ctx.fillText(`γ=${gamma}`, padding - 10, y + 5);
  });
  
  ctx.textAlign = 'center';
  cValues.forEach((c, j) => {
    const x = padding + j * cellWidth + cellWidth / 2;
    ctx.fillText(`C=${c}`, x, padding - 10);
  });
  
  // Axis labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('C Parameter', width / 2, height - 30);
  ctx.save();
  ctx.translate(25, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Gamma Parameter', 0, 0);
  ctx.restore();
  
  // Best params
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Best: C=${cValues[bestJ]}, γ=${gammaValues[bestI]} → Acc=${bestAcc.toFixed(2)}`, padding, height - 30);
}

function drawParamSurface() {
  const canvas = document.getElementById('param-surface');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Draw 3D-ish surface using contour lines
  const levels = [0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95];
  const colors = ['#ff8c6a', '#ffa07a', '#ffb490', '#ffc8a6', '#7ef0d4', '#6aa9ff', '#5a99ef'];
  
  levels.forEach((level, i) => {
    const radius = 150 - i * 20;
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.6, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = colors[i];
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(level.toFixed(2), centerX + radius + 10, centerY);
  });
  
  // Center point (optimum)
  ctx.fillStyle = '#7ef0d4';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Optimal Point', centerX, centerY - 20);
  ctx.fillText('(C=1, γ=scale)', centerX, centerY + 35);
  
  // Axis labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.fillText('C Parameter →', width - 80, height - 20);
  ctx.save();
  ctx.translate(30, 60);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('← Gamma', 0, 0);
  ctx.restore();
  
  ctx.fillStyle = '#e8eef6';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Performance Surface (3D Contour View)', width / 2, 30);
}

// Topic 15: Naive Bayes
function initNaiveBayes() {
  const canvas1 = document.getElementById('bayes-theorem-viz');
  if (canvas1 && !canvas1.dataset.initialized) {
    canvas1.dataset.initialized = 'true';
    drawBayesTheorem();
  }
  
  const canvas2 = document.getElementById('spam-classification');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawSpamClassification();
  }
}

function drawBayesTheorem() {
  const canvas = document.getElementById('bayes-theorem-viz');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Draw formula components as boxes
  const boxes = [
    { x: centerX - 300, y: centerY - 80, w: 120, h: 60, text: 'P(C|F)', label: 'Posterior', color: '#7ef0d4' },
    { x: centerX - 100, y: centerY - 80, w: 120, h: 60, text: 'P(F|C)', label: 'Likelihood', color: '#6aa9ff' },
    { x: centerX + 100, y: centerY - 80, w: 100, h: 60, text: 'P(C)', label: 'Prior', color: '#ffb490' },
    { x: centerX - 50, y: centerY + 60, w: 100, h: 60, text: 'P(F)', label: 'Evidence', color: '#ff8c6a' }
  ];
  
  boxes.forEach(box => {
    ctx.fillStyle = box.color + '33';
    ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.strokeStyle = box.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.w, box.h);
    
    ctx.fillStyle = box.color;
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(box.text, box.x + box.w / 2, box.y + box.h / 2);
    
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#a9b4c2';
    ctx.fillText(box.label, box.x + box.w / 2, box.y + box.h + 20);
  });
  
  // Draw arrows and operators
  ctx.fillStyle = '#e8eef6';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('=', centerX - 160, centerY - 40);
  ctx.fillText('×', centerX + 40, centerY - 40);
  ctx.fillText('÷', centerX, centerY + 20);
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText("Bayes' Theorem Breakdown", centerX, 40);
}

function drawSpamClassification() {
  const canvas = document.getElementById('spam-classification');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 40;
  const stepHeight = 70;
  const startY = 60;
  
  // Step 1: Features
  ctx.fillStyle = '#6aa9ff';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Step 1: Email Features', padding, startY);
  ctx.fillStyle = '#e8eef6';
  ctx.font = '13px sans-serif';
  ctx.fillText('Words: ["free", "winner", "click"]', padding + 20, startY + 25);
  
  // Step 2: Calculate P(spam)
  const y2 = startY + stepHeight;
  ctx.fillStyle = '#6aa9ff';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Step 2: P(spam | features)', padding, y2);
  ctx.fillStyle = '#e8eef6';
  ctx.font = '12px monospace';
  ctx.fillText('= P("free"|spam) × P("winner"|spam) × P("click"|spam) × P(spam)', padding + 20, y2 + 25);
  ctx.fillText('= 0.8 × 0.7 × 0.6 × 0.3', padding + 20, y2 + 45);
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('= 0.1008', padding + 20, y2 + 65);
  
  // Step 3: Calculate P(not spam)
  const y3 = y2 + stepHeight + 50;
  ctx.fillStyle = '#6aa9ff';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Step 3: P(not-spam | features)', padding, y3);
  ctx.fillStyle = '#e8eef6';
  ctx.font = '12px monospace';
  ctx.fillText('= P("free"|not-spam) × P("winner"|not-spam) × P("click"|not-spam) × P(not-spam)', padding + 20, y3 + 25);
  ctx.fillText('= 0.1 × 0.05 × 0.2 × 0.7', padding + 20, y3 + 45);
  ctx.fillStyle = '#ff8c6a';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('= 0.0007', padding + 20, y3 + 65);
  
  // Step 4: Decision
  const y4 = y3 + stepHeight + 50;
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Decision: 0.1008 > 0.0007', padding, y4);
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('→ SPAM! 📧❌', padding, y4 + 30);
  
  // Visual comparison
  const barY = y4 + 60;
  const barMaxWidth = width - 2 * padding - 100;
  ctx.fillStyle = '#7ef0d4';
  ctx.fillRect(padding, barY, 0.1008 / 0.1008 * barMaxWidth, 20);
  ctx.fillStyle = '#e8eef6';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Spam', padding + barMaxWidth + 80, barY + 15);
  
  ctx.fillStyle = '#ff8c6a';
  ctx.fillRect(padding, barY + 30, 0.0007 / 0.1008 * barMaxWidth, 20);
  ctx.fillStyle = '#e8eef6';
  ctx.fillText('Not Spam', padding + barMaxWidth + 80, barY + 45);
}

// Topic 16: Decision Trees
function initDecisionTrees() {
  const canvas1 = document.getElementById('decision-tree-viz');
  if (canvas1 && !canvas1.dataset.initialized) {
    canvas1.dataset.initialized = 'true';
    drawDecisionTree();
  }
  
  const canvas2 = document.getElementById('entropy-viz');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawEntropyViz();
  }
  
  const canvas3 = document.getElementById('split-comparison');
  if (canvas3 && !canvas3.dataset.initialized) {
    canvas3.dataset.initialized = 'true';
    drawSplitComparison();
  }
  
  const canvas4 = document.getElementById('tree-boundary');
  if (canvas4 && !canvas4.dataset.initialized) {
    canvas4.dataset.initialized = 'true';
    drawTreeBoundary();
  }
}

function drawDecisionTree() {
  const canvas = document.getElementById('decision-tree-viz');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const centerX = width / 2;
  
  // Node structure
  const nodes = [
    { x: centerX, y: 60, text: 'Has "free"?', type: 'root' },
    { x: centerX - 150, y: 160, text: 'Has link?', type: 'internal' },
    { x: centerX + 150, y: 160, text: 'Sender new?', type: 'internal' },
    { x: centerX - 220, y: 260, text: 'SPAM', type: 'leaf', class: 'spam' },
    { x: centerX - 80, y: 260, text: 'NOT SPAM', type: 'leaf', class: 'not-spam' },
    { x: centerX + 80, y: 260, text: 'SPAM', type: 'leaf', class: 'spam' },
    { x: centerX + 220, y: 260, text: 'NOT SPAM', type: 'leaf', class: 'not-spam' }
  ];
  
  const edges = [
    { from: 0, to: 1, label: 'Yes' },
    { from: 0, to: 2, label: 'No' },
    { from: 1, to: 3, label: 'Yes' },
    { from: 1, to: 4, label: 'No' },
    { from: 2, to: 5, label: 'Yes' },
    { from: 2, to: 6, label: 'No' }
  ];
  
  // Draw edges
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 2;
  edges.forEach(edge => {
    const from = nodes[edge.from];
    const to = nodes[edge.to];
    ctx.beginPath();
    ctx.moveTo(from.x, from.y + 25);
    ctx.lineTo(to.x, to.y - 25);
    ctx.stroke();
    
    // Edge label
    ctx.fillStyle = '#7ef0d4';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    ctx.fillText(edge.label, midX + 15, midY);
  });
  
  // Draw nodes
  nodes.forEach(node => {
    if (node.type === 'leaf') {
      ctx.fillStyle = node.class === 'spam' ? '#ff8c6a33' : '#7ef0d433';
      ctx.strokeStyle = node.class === 'spam' ? '#ff8c6a' : '#7ef0d4';
    } else {
      ctx.fillStyle = '#6aa9ff33';
      ctx.strokeStyle = '#6aa9ff';
    }
    
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(node.x - 60, node.y - 20, 120, 40);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = node.type === 'leaf' ? 'bold 13px sans-serif' : '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(node.text, node.x, node.y + 5);
  });
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Decision Tree: Email Spam Classifier', centerX, 30);
  
  // Example path
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Example: Email with "free" + link → SPAM', 40, height - 20);
}

function drawEntropyViz() {
  const canvas = document.getElementById('entropy-viz');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Draw entropy curve
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let p = 0.01; p <= 0.99; p += 0.01) {
    const entropy = -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
    const x = padding + p * chartWidth;
    const y = height - padding - entropy * chartHeight;
    if (p === 0.01) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  
  // Mark key points
  const points = [
    { p: 0.1, label: 'Pure\n(low)' },
    { p: 0.5, label: 'Maximum\n(high)' },
    { p: 0.9, label: 'Pure\n(low)' }
  ];
  
  points.forEach(point => {
    const entropy = -point.p * Math.log2(point.p) - (1 - point.p) * Math.log2(1 - point.p);
    const x = padding + point.p * chartWidth;
    const y = height - padding - entropy * chartHeight;
    
    ctx.fillStyle = '#7ef0d4';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#7ef0d4';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    const lines = point.label.split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, x, y - 15 - (lines.length - 1 - i) * 12);
    });
  });
  
  // Axes
  ctx.strokeStyle = '#2a3544';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Proportion of Positive Class (p)', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Entropy H(p)', 0, 0);
  ctx.restore();
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Entropy: Measuring Disorder', width / 2, 30);
}

function drawSplitComparison() {
  const canvas = document.getElementById('split-comparison');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const splits = [
    { name: 'Split A: "Contains FREE"', ig: 0.034, color: '#ff8c6a' },
    { name: 'Split B: "Has Link"', ig: 0.156, color: '#7ef0d4' },
    { name: 'Split C: "Urgent"', ig: 0.089, color: '#ffb490' }
  ];
  
  const padding = 60;
  const barHeight = 60;
  const maxWidth = width - 2 * padding - 200;
  const maxIG = Math.max(...splits.map(s => s.ig));
  
  splits.forEach((split, i) => {
    const y = 80 + i * (barHeight + 40);
    const barWidth = (split.ig / maxIG) * maxWidth;
    
    // Bar
    ctx.fillStyle = split.color;
    ctx.fillRect(padding, y, barWidth, barHeight);
    
    // Border
    ctx.strokeStyle = split.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, y, barWidth, barHeight);
    
    // Label
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(split.name, padding, y - 10);
    
    // Value
    ctx.fillStyle = '#1a2332';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`IG = ${split.ig.toFixed(3)}`, padding + barWidth / 2, y + barHeight / 2 + 6);
  });
  
  // Winner
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓ Best split: Highest Information Gain!', width / 2, height - 30);
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Comparing Split Quality', width / 2, 40);
}

function drawTreeBoundary() {
  const canvas = document.getElementById('tree-boundary');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Draw regions
  const regions = [
    { x1: 0, y1: 0, x2: 0.5, y2: 0.6, class: 'orange' },
    { x1: 0.5, y1: 0, x2: 1, y2: 0.6, class: 'yellow' },
    { x1: 0, y1: 0.6, x2: 0.3, y2: 1, class: 'yellow' },
    { x1: 0.3, y1: 0.6, x2: 1, y2: 1, class: 'orange' }
  ];
  
  regions.forEach(region => {
    const x = padding + region.x1 * chartWidth;
    const y = padding + region.y1 * chartHeight;
    const w = (region.x2 - region.x1) * chartWidth;
    const h = (region.y2 - region.y1) * chartHeight;
    
    ctx.fillStyle = region.class === 'orange' ? 'rgba(255, 140, 106, 0.2)' : 'rgba(255, 235, 59, 0.2)';
    ctx.fillRect(x, y, w, h);
    
    ctx.strokeStyle = region.class === 'orange' ? '#ff8c6a' : '#ffeb3b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  });
  
  // Generate random points
  const orangePoints = [];
  const yellowPoints = [];
  for (let i = 0; i < 15; i++) {
    if (Math.random() < 0.3) {
      orangePoints.push({ x: Math.random() * 0.5, y: Math.random() * 0.6 });
    }
    if (Math.random() < 0.3) {
      yellowPoints.push({ x: 0.5 + Math.random() * 0.5, y: Math.random() * 0.6 });
    }
    if (Math.random() < 0.3) {
      orangePoints.push({ x: 0.3 + Math.random() * 0.7, y: 0.6 + Math.random() * 0.4 });
    }
    if (Math.random() < 0.3) {
      yellowPoints.push({ x: Math.random() * 0.3, y: 0.6 + Math.random() * 0.4 });
    }
  }
  
  // Draw points
  orangePoints.forEach(p => {
    ctx.fillStyle = '#ff8c6a';
    ctx.beginPath();
    ctx.arc(padding + p.x * chartWidth, padding + p.y * chartHeight, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  yellowPoints.forEach(p => {
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(padding + p.x * chartWidth, padding + p.y * chartHeight, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  // Labels
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Feature 1', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Feature 2', 0, 0);
  ctx.restore();
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Decision Tree Creates Rectangular Regions', width / 2, 30);
}

// Topic 17: Ensemble Methods
function initEnsembleMethods() {
  const canvas1 = document.getElementById('bagging-viz');
  if (canvas1 && !canvas1.dataset.initialized) {
    canvas1.dataset.initialized = 'true';
    drawBaggingViz();
  }
  
  const canvas2 = document.getElementById('boosting-viz');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawBoostingViz();
  }
  
  const canvas3 = document.getElementById('random-forest-viz');
  if (canvas3 && !canvas3.dataset.initialized) {
    canvas3.dataset.initialized = 'true';
    drawRandomForestViz();
  }
}

function drawBaggingViz() {
  const canvas = document.getElementById('bagging-viz');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const boxWidth = 150;
  const boxHeight = 60;
  const startY = 60;
  const spacing = (width - 3 * boxWidth) / 4;
  
  // Original data
  ctx.fillStyle = '#6aa9ff33';
  ctx.fillRect(width / 2 - 100, startY, 200, boxHeight);
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(width / 2 - 100, startY, 200, boxHeight);
  ctx.fillStyle = '#e8eef6';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Original Dataset', width / 2, startY + boxHeight / 2 + 5);
  
  // Bootstrap samples
  const sampleY = startY + boxHeight + 60;
  for (let i = 0; i < 3; i++) {
    const x = spacing + i * (boxWidth + spacing);
    
    // Arrow
    ctx.strokeStyle = '#7ef0d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2, startY + boxHeight);
    ctx.lineTo(x + boxWidth / 2, sampleY);
    ctx.stroke();
    
    // Sample box
    ctx.fillStyle = '#7ef0d433';
    ctx.fillRect(x, sampleY, boxWidth, boxHeight);
    ctx.strokeStyle = '#7ef0d4';
    ctx.strokeRect(x, sampleY, boxWidth, boxHeight);
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Bootstrap ${i + 1}`, x + boxWidth / 2, sampleY + boxHeight / 2 - 5);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#a9b4c2';
    ctx.fillText('(random sample)', x + boxWidth / 2, sampleY + boxHeight / 2 + 10);
    
    // Model
    const modelY = sampleY + boxHeight + 40;
    ctx.fillStyle = '#ffb49033';
    ctx.fillRect(x, modelY, boxWidth, boxHeight);
    ctx.strokeStyle = '#ffb490';
    ctx.strokeRect(x, modelY, boxWidth, boxHeight);
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Model ${i + 1}`, x + boxWidth / 2, modelY + boxHeight / 2 + 5);
    
    // Arrow to final
    ctx.strokeStyle = '#ffb490';
    ctx.beginPath();
    ctx.moveTo(x + boxWidth / 2, modelY + boxHeight);
    ctx.lineTo(width / 2, height - 60);
    ctx.stroke();
  }
  
  // Final prediction
  ctx.fillStyle = '#ff8c6a33';
  ctx.fillRect(width / 2 - 100, height - 60, 200, boxHeight);
  ctx.strokeStyle = '#ff8c6a';
  ctx.lineWidth = 3;
  ctx.strokeRect(width / 2 - 100, height - 60, 200, boxHeight);
  ctx.fillStyle = '#e8eef6';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Average / Vote', width / 2, height - 60 + boxHeight / 2 + 5);
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Bagging: Bootstrap Aggregating', width / 2, 30);
}

function drawBoostingViz() {
  const canvas = document.getElementById('boosting-viz');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const iterY = [80, 180, 280];
  const dataX = 100;
  const modelX = width / 2;
  const predX = width - 150;
  
  for (let i = 0; i < 3; i++) {
    const y = iterY[i];
    const alpha = i === 0 ? 1 : (i === 1 ? 0.7 : 0.5);
    
    // Iteration label
    ctx.fillStyle = '#7ef0d4';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Iteration ${i + 1}`, 20, y + 30);
    
    // Data with weights
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#6aa9ff33';
    ctx.fillRect(dataX, y, 120, 60);
    ctx.strokeStyle = '#6aa9ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(dataX, y, 120, 60);
    ctx.globalAlpha = 1;
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Weighted Data', dataX + 60, y + 25);
    ctx.fillStyle = i > 0 ? '#ff8c6a' : '#7ef0d4';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(i > 0 ? '↑ Focus on errors' : 'Equal weights', dataX + 60, y + 45);
    
    // Arrow
    ctx.strokeStyle = '#7ef0d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(dataX + 120, y + 30);
    ctx.lineTo(modelX - 60, y + 30);
    ctx.stroke();
    
    // Model
    ctx.fillStyle = '#ffb49033';
    ctx.fillRect(modelX - 60, y, 120, 60);
    ctx.strokeStyle = '#ffb490';
    ctx.strokeRect(modelX - 60, y, 120, 60);
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Model ${i + 1}`, modelX, y + 35);
    
    // Arrow
    ctx.strokeStyle = '#ffb490';
    ctx.beginPath();
    ctx.moveTo(modelX + 60, y + 30);
    ctx.lineTo(predX - 60, y + 30);
    ctx.stroke();
    
    // Predictions
    ctx.fillStyle = '#7ef0d433';
    ctx.fillRect(predX - 60, y, 120, 60);
    ctx.strokeStyle = '#7ef0d4';
    ctx.strokeRect(predX - 60, y, 120, 60);
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = '11px sans-serif';
    ctx.fillText('Predictions', predX, y + 25);
    ctx.fillStyle = i < 2 ? '#ff8c6a' : '#7ef0d4';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(i < 2 ? 'Some errors' : 'Better!', predX, y + 45);
    
    // Feedback arrow
    if (i < 2) {
      ctx.strokeStyle = '#ff8c6a';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(predX - 60, y + 60);
      ctx.lineTo(dataX + 60, y + 90);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#ff8c6a';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Increase weights for errors', width / 2, y + 80);
    }
  }
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Boosting: Sequential Learning from Mistakes', width / 2, 30);
  
  // Final
  ctx.fillStyle = '#ff8c6a';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Final Prediction = Weighted Combination of All Models', width / 2, height - 20);
}

function drawRandomForestViz() {
  const canvas = document.getElementById('random-forest-viz');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const treeY = 120;
  const numTrees = 5;
  const treeSpacing = (width - 100) / numTrees;
  const treeSize = 50;
  
  // Original data
  ctx.fillStyle = '#6aa9ff33';
  ctx.fillRect(width / 2 - 100, 40, 200, 50);
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(width / 2 - 100, 40, 200, 50);
  ctx.fillStyle = '#e8eef6';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Training Data', width / 2, 70);
  
  // Trees
  for (let i = 0; i < numTrees; i++) {
    const x = 50 + i * treeSpacing + treeSpacing / 2;
    
    // Arrow from data
    ctx.strokeStyle = '#7ef0d4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 90);
    ctx.lineTo(x, treeY - 20);
    ctx.stroke();
    
    // Tree icon (triangle)
    ctx.fillStyle = '#7ef0d4';
    ctx.beginPath();
    ctx.moveTo(x, treeY - 20);
    ctx.lineTo(x - treeSize / 2, treeY + treeSize - 20);
    ctx.lineTo(x + treeSize / 2, treeY + treeSize - 20);
    ctx.closePath();
    ctx.fill();
    
    // Trunk
    ctx.fillStyle = '#ffb490';
    ctx.fillRect(x - 8, treeY + treeSize - 20, 16, 30);
    
    // Tree label
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Tree ${i + 1}`, x, treeY + treeSize + 25);
    
    // Random features note
    if (i === 0) {
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#a9b4c2';
      ctx.fillText('Random', x, treeY + treeSize + 40);
      ctx.fillText('subset', x, treeY + treeSize + 52);
    }
    
    // Prediction
    const predY = treeY + treeSize + 70;
    ctx.fillStyle = i < 3 ? '#ff8c6a' : '#7ef0d4';
    ctx.beginPath();
    ctx.arc(x, predY, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#1a2332';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(i < 3 ? '1' : '0', x, predY + 4);
    
    // Arrow to vote
    ctx.strokeStyle = i < 3 ? '#ff8c6a' : '#7ef0d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, predY + 12);
    ctx.lineTo(width / 2, height - 80);
    ctx.stroke();
  }
  
  // Vote box
  ctx.fillStyle = '#7ef0d433';
  ctx.fillRect(width / 2 - 80, height - 80, 160, 60);
  ctx.strokeStyle = '#7ef0d4';
  ctx.lineWidth = 3;
  ctx.strokeRect(width / 2 - 80, height - 80, 160, 60);
  
  ctx.fillStyle = '#e8eef6';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Majority Vote', width / 2, height - 60);
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#ff8c6a';
  ctx.fillText('Class 1 wins (3 vs 2)', width / 2, height - 35);
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Random Forest: Ensemble of Decision Trees', width / 2, 25);
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    drawLinearRegression();
    drawGradientDescent();
    drawSigmoid();
    drawLogisticClassification();
    drawKNN();
    drawConfusionMatrix();
    drawROC();
    drawR2();
    drawRegularization();
    drawBiasVariance();
    drawComplexityCurve();
    drawCrossValidation();
    drawScaling();
    drawPipeline();
    drawLossComparison();
    drawLossCurves();
    drawSVMBasic();
    drawSVMMargin();
    drawSVMCParameter();
    drawSVMTraining();
    drawSVMKernel();
    // New topics
    drawElbowCurve();
    drawCVKHeatmap();
    drawGridSearchHeatmap();
    drawParamSurface();
    drawBayesTheorem();
    drawSpamClassification();
    drawDecisionTree();
    drawEntropyViz();
    drawSplitComparison();
    drawTreeBoundary();
    drawBaggingViz();
    drawBoostingViz();
    drawRandomForestViz();
  }, 250);
});
