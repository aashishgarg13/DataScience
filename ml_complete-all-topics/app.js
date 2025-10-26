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
  }, 250);
});
