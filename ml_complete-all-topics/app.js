// ========== VISUALIZATION VERIFICATION SYSTEM ==========
const vizLog = {
  success: [],
  failed: [],
  warnings: []
};

function logViz(module, name, status, error = null) {
  const log = {
    module: module,
    name: name,
    status: status,
    timestamp: new Date().toLocaleTimeString(),
    error: error
  };
  
  if (status === 'success') {
    vizLog.success.push(log);
    console.log(`✓ ${module} - ${name}`);
  } else if (status === 'failed') {
    vizLog.failed.push(log);
    console.error(`✗ ${module} - ${name}: ${error}`);
  } else {
    vizLog.warnings.push(log);
    console.warn(`⚠ ${module} - ${name}: ${error}`);
  }
}

function createVerifiedVisualization(canvasId, chartConfig, moduleName, vizName) {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      logViz(moduleName, vizName, 'failed', 'Canvas not found');
      showFallback(canvasId, 'error');
      return null;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      logViz(moduleName, vizName, 'failed', 'Cannot get context');
      showFallback(canvasId, 'error');
      return null;
    }
    
    if (typeof Chart === 'undefined') {
      logViz(moduleName, vizName, 'failed', 'Chart.js not loaded');
      showFallback(canvasId, 'error');
      return null;
    }
    
    const chart = new Chart(ctx, chartConfig);
    logViz(moduleName, vizName, 'success');
    return chart;
    
  } catch (error) {
    logViz(moduleName, vizName, 'failed', error.message);
    showFallback(canvasId, 'error');
    return null;
  }
}

function showFallback(elementId, type) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const container = element.parentElement;
  if (!container) return;
  
  if (type === 'error') {
    container.innerHTML = '<div style="padding: 40px; text-align: center; color: #ff8c6a; background: rgba(255, 140, 106, 0.1); border-radius: 8px; border: 2px solid #ff8c6a;">⚠️ Visualization temporarily unavailable<br><small style="color: #a9b4c2; margin-top: 8px; display: block;">Data is still accessible via diagnostic tools</small></div>';
  }
}

// Show report on load
window.addEventListener('load', () => {
  setTimeout(() => {
    console.log('\n=== VISUALIZATION VERIFICATION REPORT ===');
    console.log(`✓ Success: ${vizLog.success.length}`);
    console.log(`✗ Failed: ${vizLog.failed.length}`);
    console.log(`⚠ Warnings: ${vizLog.warnings.length}`);
    
    if (vizLog.failed.length > 0) {
      console.error('Failed visualizations:', vizLog.failed);
    }
    
    if (vizLog.success.length > 0) {
      console.log('\nSuccessful visualizations:');
      vizLog.success.forEach(v => console.log(`  ✓ ${v.module} - ${v.name}`));
    }
    
    console.log('\n=========================================');
  }, 2000);
});

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

// Initialize category navigation
function initCategories() {
  const categoryHeaders = document.querySelectorAll('.toc-category-header');
  
  categoryHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const category = header.getAttribute('data-category');
      const content = document.getElementById(`${category}-content`);
      const toggle = header.querySelector('.category-toggle');
      
      if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggle.classList.remove('collapsed');
      } else {
        content.classList.add('collapsed');
        toggle.classList.add('collapsed');
      }
    });
  });
  
  // Start with all categories expanded
  document.querySelectorAll('.toc-category-content').forEach(content => {
    content.classList.remove('collapsed');
  });
}

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
        if (section.id === 'kmeans') initKMeans();
        if (section.id === 'decision-tree-regression') initDecisionTreeRegression();
        if (section.id === 'decision-trees') initDecisionTrees();
        if (section.id === 'gradient-boosting') initGradientBoosting();
        if (section.id === 'xgboost') initXGBoost();
        if (section.id === 'bagging') initBagging();
        if (section.id === 'boosting-adaboost') initBoostingAdaBoost();
        if (section.id === 'random-forest') initRandomForest();
        if (section.id === 'ensemble-methods') initEnsembleMethods();
        if (section.id === 'gradient-boosting-classification') initGradientBoostingClassification();
        if (section.id === 'xgboost-classification') initXGBoostClassification();
        if (section.id === 'hierarchical-clustering') initHierarchicalClustering();
        if (section.id === 'dbscan') initDBSCAN();
        if (section.id === 'clustering-evaluation') initClusteringEvaluation();
        if (section.id === 'diagnostics') {
          // Wait for all visualizations to initialize
          setTimeout(showDiagnostics, 500);
        }
        if (section.id === 'rl-intro') { /* No viz for intro */ }
        if (section.id === 'q-learning') { /* Add Q-learning viz if needed */ }
        if (section.id === 'policy-gradient') { /* Add policy gradient viz if needed */ }
        if (section.id === 'algorithm-comparison') initAlgorithmComparison();
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
  }, 'Gradient Descent', 'Loss Curve');
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

let lrChart = null;

function drawLinearRegression() {
  const canvas = document.getElementById('lr-canvas');
  if (!canvas) return;
  
  // Destroy existing chart
  if (lrChart) {
    lrChart.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  
  // Calculate fitted line points
  const fittedLine = [];
  for (let x = 0; x <= 7; x += 0.1) {
    fittedLine.push({ x: x, y: state.slope * x + state.intercept });
  }
  
  // Calculate MSE
  let mse = 0;
  data.linearRegression.forEach(point => {
    const predicted = state.slope * point.experience + state.intercept;
    const error = point.salary - predicted;
    mse += error * error;
  });
  mse /= data.linearRegression.length;
  
  // Destroy existing chart
  if (lrChart) {
    lrChart.destroy();
  }
  
  lrChart = createVerifiedVisualization('lr-canvas', {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Data Points',
          data: data.linearRegression.map(p => ({ x: p.experience, y: p.salary })),
          backgroundColor: '#6aa9ff',
          pointRadius: 8,
          pointHoverRadius: 10
        },
        {
          label: 'Fitted Line',
          data: fittedLine,
          type: 'line',
          borderColor: '#ff8c6a',
          borderWidth: 3,
          fill: false,
          pointRadius: 0,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Experience vs Salary (MSE: ${mse.toFixed(2)})`,
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: {
          labels: { color: '#a9b4c2' }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Years of Experience', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          title: { display: true, text: 'Salary ($k)', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        }
      }
    }
  }, 'Linear Regression', 'Scatter + Line');
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

let gdChart = null;

function drawGradientDescent(currentStep = -1) {
  const canvas = document.getElementById('gd-canvas');
  if (!canvas) return;
  
  if (state.gdIterations.length === 0) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#a9b4c2';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Click "Run Gradient Descent" to see the algorithm in action', canvas.width / 2, canvas.height / 2);
    return;
  }
  
  // Destroy existing chart
  if (gdChart) {
    gdChart.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  const lossData = state.gdIterations.map((iter, i) => ({ x: i + 1, y: iter.loss }));
  
  // Destroy existing chart
  if (gdChart) {
    gdChart.destroy();
  }
  
  gdChart = createVerifiedVisualization('gd-canvas', {
    type: 'line',
    data: {
      datasets: [{
        label: 'Training Loss',
        data: lossData,
        borderColor: '#7ef0d4',
        backgroundColor: 'rgba(126, 240, 212, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: currentStep >= 0 ? lossData.map((_, i) => i === currentStep ? 8 : 2) : 4,
        pointBackgroundColor: currentStep >= 0 ? lossData.map((_, i) => i === currentStep ? '#ff8c6a' : '#7ef0d4') : '#7ef0d4'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: currentStep >= 0 ? `Gradient Descent Progress (Step ${currentStep + 1}/${state.gdIterations.length})` : 'Gradient Descent Progress',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: {
          labels: { color: '#a9b4c2' }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Iterations', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          title: { display: true, text: 'Loss (MSE)', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        }
      }
    }
  });
}

// Safe chart creation with error handling
function safeCreateChart(ctx, config, chartName) {
  try {
    if (!ctx) {
      console.warn(`Canvas context not found for ${chartName}`);
      return null;
    }
    const chart = new Chart(ctx, config);
    console.log(`✓ Chart created: ${chartName}`);
    return chart;
  } catch (error) {
    console.error(`Chart creation failed for ${chartName}:`, error);
    return null;
  }
}

// Link Verification System
function verifyAllLinks() {
  const links = document.querySelectorAll('a[href^="#"]');
  const broken = [];
  let working = 0;
  
  links.forEach(link => {
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    
    if (!target) {
      broken.push({
        text: link.textContent,
        href: link.getAttribute('href')
      });
      link.style.color = 'red';
      link.title = 'Broken link';
    } else {
      working++;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        
        // Highlight section
        const originalBg = target.style.backgroundColor;
        target.style.backgroundColor = 'rgba(106, 169, 255, 0.2)';
        setTimeout(() => {
          target.style.backgroundColor = originalBg;
        }, 1000);
      });
    }
  });
  
  console.log(`\n=== LINK VERIFICATION ===`);
  console.log(`✓ Working: ${working}/${links.length}`);
  console.log(`✗ Broken: ${broken.length}`);
  if (broken.length > 0) {
    console.error('Broken links:', broken);
  }
  console.log('==========================\n');
}

// Initialize everything when DOM is ready
function init() {
  initCategories();
  initSections();
  initTOCLinks();
  
  // Initialize first section visualizations
  setTimeout(() => {
    initLinearRegression();
  }, 100);
  
  // Verify all links on load
  setTimeout(verifyAllLinks, 1000);
  
  // Initialize diagnostics refresh
  setInterval(() => {
    const diagSection = document.getElementById('diagnostics');
    if (diagSection && diagSection.querySelector('.section-body').classList.contains('expanded')) {
      showDiagnostics();
    }
  }, 3000);
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
  if (!canvas) {
    logViz('SVM', 'Basic Decision Boundary', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('Could not get canvas context for svm-basic-canvas');
    return;
  }
  
  const width = canvas.width = canvas.offsetWidth || 600;
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
  
  logViz('SVM', 'Basic Decision Boundary', 'success');
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
  if (!canvas) {
    logViz('SVM', 'Margin Visualization', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('Could not get canvas context for svm-margin-canvas');
    return;
  }
  
  const width = canvas.width = canvas.offsetWidth || 600;
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

let svmCChart = null;

function drawSVMCParameter() {
  const canvas = document.getElementById('svm-c-canvas');
  if (!canvas) {
    logViz('SVM', 'C Parameter Effect', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('Could not get canvas context for svm-c-canvas');
    return;
  }
  
  const width = canvas.width = canvas.offsetWidth || 600;
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
  const marginEl = document.getElementById('margin-width');
  const violEl = document.getElementById('violations-count');
  if (marginEl) marginEl.textContent = marginWidth.toFixed(2);
  if (violEl) violEl.textContent = violations;
  
  logViz('SVM', 'Margin Visualization', 'success');
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
  if (!canvas) {
    logViz('SVM', 'Training Animation', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('Could not get canvas context for svm-train-canvas');
    return;
  }
  
  const width = canvas.width = canvas.offsetWidth || 600;
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
  
  logViz('SVM', 'Training Animation', 'success');
}

let svmKernelChart = null;

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
      const paramVal = document.getElementById('kernel-param-val');
      if (paramVal) paramVal.textContent = state.svm.kernelParam.toFixed(1);
      drawSVMKernel();
    });
  }
  
  drawSVMKernel();
}

function drawSVMKernel() {
  const canvas = document.getElementById('svm-kernel-canvas');
  if (!canvas) {
    logViz('SVM', 'Kernel Comparison', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('SVM', 'Kernel Comparison', 'success');
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
  if (!canvas) {
    logViz('Logistic Regression', 'Sigmoid Curve', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Logistic Regression', 'Sigmoid Curve', 'success');
}

function initLogisticClassification() {
  const canvas = document.getElementById('logistic-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  drawLogisticClassification();
}

function drawLogisticClassification() {
  const canvas = document.getElementById('logistic-canvas');
  if (!canvas) {
    logViz('Logistic Regression', 'Classification Boundary', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Logistic Regression', 'Classification Boundary', 'success');
  
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
  if (!canvas) {
    logViz('KNN', 'Draggable Point', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('KNN', 'Draggable Point', 'success');
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
  if (!canvas) {
    logViz('Model Evaluation', 'Confusion Matrix', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Model Evaluation', 'Confusion Matrix', 'success');
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
  if (!canvas) {
    logViz('Model Evaluation', 'ROC Curve', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Model Evaluation', 'ROC Curve', 'success');
}

function initR2() {
  const canvas = document.getElementById('r2-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  drawR2();
}

function drawR2() {
  const canvas = document.getElementById('r2-canvas');
  if (!canvas) {
    logViz('Model Evaluation', 'R² Score', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Model Evaluation', 'R² Score', 'success');
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
  if (!canvas) {
    logViz('Regularization', 'L1 vs L2 Comparison', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Regularization', 'L1 vs L2 Comparison', 'success');
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
  if (!canvas) {
    logViz('Bias-Variance', 'Three Models', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Bias-Variance', 'Three Models', 'success');
}

function drawComplexityCurve() {
  const canvas = document.getElementById('complexity-canvas');
  if (!canvas) {
    logViz('Bias-Variance', 'Complexity Curve', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Bias-Variance', 'Complexity Curve', 'success');
  
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
  if (!canvas) {
    logViz('Cross-Validation', 'K-Fold Visualization', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Cross-Validation', 'K-Fold Visualization', 'success');
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
  if (!canvas) {
    logViz('Preprocessing', 'Feature Scaling', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Preprocessing', 'Feature Scaling', 'success');
}

function drawPipeline() {
  const canvas = document.getElementById('pipeline-canvas');
  if (!canvas) {
    logViz('Preprocessing', 'Pipeline Flow', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Preprocessing', 'Pipeline Flow', 'success');
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
  if (!canvas) {
    logViz('Loss Functions', 'Loss Comparison', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Loss Functions', 'Loss Comparison', 'success');
}

function drawLossCurves() {
  const canvas = document.getElementById('loss-curves-canvas');
  if (!canvas) {
    logViz('Loss Functions', 'Loss Curves', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Loss Functions', 'Loss Curves', 'success');
}

// Topic 13: Finding Optimal K in KNN
let elbowChart = null;
let cvKChart = null;

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
  
  // Destroy existing chart
  if (elbowChart) {
    elbowChart.destroy();
  }
  
  // Use Chart.js
  // Destroy existing chart
  if (elbowChart) {
    elbowChart.destroy();
  }
  
  elbowChart = createVerifiedVisualization('elbow-canvas', {
    type: 'line',
    data: {
      labels: kValues,
      datasets: [{
        label: 'Accuracy',
        data: accuracies,
        borderColor: '#6aa9ff',
        backgroundColor: 'rgba(106, 169, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: kValues.map(k => k === optimalK ? 10 : 5),
        pointBackgroundColor: kValues.map(k => k === optimalK ? '#7ef0d4' : '#6aa9ff'),
        pointBorderColor: kValues.map(k => k === optimalK ? '#7ef0d4' : '#6aa9ff'),
        pointBorderWidth: kValues.map(k => k === optimalK ? 3 : 2)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Elbow Method: Optimal K = ${optimalK} (Accuracy: ${accuracies[optimalK - 1].toFixed(2)})`,
          color: '#7ef0d4',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          labels: { color: '#a9b4c2' }
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              xMin: optimalK,
              xMax: optimalK,
              borderColor: '#7ef0d4',
              borderWidth: 2,
              borderDash: [5, 5]
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'K (Number of Neighbors)', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          title: { display: true, text: 'Accuracy', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' },
          min: 0.7,
          max: 1.0
        }
      }
    }
  }, 'KNN', 'Elbow Method');
}

function drawCVKHeatmap() {
  const canvas = document.getElementById('cv-k-canvas');
  if (!canvas) {
    logViz('Optimal K', 'CV Heatmap', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Optimal K', 'CV Heatmap', 'success');
}

// Topic 14: Hyperparameter Tuning
let gridSearchChart = null;

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
  if (!canvas) {
    logViz('Hyperparameter Tuning', 'GridSearch Heatmap', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  // Best params - Use Chart.js for bar comparison instead
  const compareData = [];
  cValues.forEach((c, j) => {
    gammaValues.forEach((g, i) => {
      compareData.push({
        c: c,
        gamma: g,
        acc: accuracies[i][j],
        label: `C=${c}, γ=${g}`
      });
    });
  });
  
  // Sort and get top 5
  compareData.sort((a, b) => b.acc - a.acc);
  const top5 = compareData.slice(0, 5);
  
  // Add annotation for best
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Best: C=${cValues[bestJ]}, γ=${gammaValues[bestI]} → Acc=${bestAcc.toFixed(2)}`, padding, height - 30);
  
  logViz('Hyperparameter Tuning', 'GridSearch Heatmap', 'success');
}

function drawParamSurface() {
  const canvas = document.getElementById('param-surface');
  if (!canvas) {
    logViz('Hyperparameter Tuning', 'Parameter Surface', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Hyperparameter Tuning', 'Parameter Surface', 'success');
}

// Topic 15: Naive Bayes
let bayesComparisonChart = null;
let categoricalNBChart = null;
let gaussianNBChart = null;

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
  
  const canvas3 = document.getElementById('categorical-nb-canvas');
  if (canvas3 && !canvas3.dataset.initialized) {
    canvas3.dataset.initialized = 'true';
    drawCategoricalNB();
  }
  
  const canvas4 = document.getElementById('gaussian-nb-canvas');
  if (canvas4 && !canvas4.dataset.initialized) {
    canvas4.dataset.initialized = 'true';
    drawGaussianNB();
  }
}

function drawBayesTheorem() {
  const canvas = document.getElementById('bayes-theorem-viz');
  if (!canvas) {
    logViz('Naive Bayes', 'Bayes Theorem Flow', 'failed', 'Canvas not found');
    return;
  }
  
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

function drawCategoricalNB() {
  const canvas = document.getElementById('categorical-nb-canvas');
  if (!canvas) return;
  
  if (categoricalNBChart) {
    categoricalNBChart.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  
  if (categoricalNBChart) {
    categoricalNBChart.destroy();
  }
  
  categoricalNBChart = createVerifiedVisualization('categorical-nb-canvas', {
    type: 'bar',
    data: {
      labels: ['P(Yes|Rainy,Hot)', 'P(No|Rainy,Hot)'],
      datasets: [{
        label: 'Without Smoothing',
        data: [0.0833, 0],
        backgroundColor: 'rgba(255, 140, 106, 0.6)',
        borderColor: '#ff8c6a',
        borderWidth: 2
      }, {
        label: 'With Laplace Smoothing',
        data: [0.0818, 0.0266],
        backgroundColor: 'rgba(126, 240, 212, 0.6)',
        borderColor: '#7ef0d4',
        borderWidth: 2
      }, {
        label: 'Normalized Probability',
        data: [0.755, 0.245],
        backgroundColor: 'rgba(106, 169, 255, 0.8)',
        borderColor: '#6aa9ff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Categorical Naive Bayes: Probability Comparison',
          color: '#e8eef6',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          labels: { color: '#a9b4c2' }
        }
      },
      scales: {
        x: {
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          title: { display: true, text: 'Probability', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' },
          min: 0,
          max: 1
        }
      }
    }
  }, 'Naive Bayes', 'Categorical Calculation');
}

function drawGaussianNB() {
  const canvas = document.getElementById('gaussian-nb-canvas');
  if (!canvas) {
    logViz('Naive Bayes', 'Gaussian NB Boundary', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const xMin = 0, xMax = 5, yMin = 0, yMax = 4;
  const scaleX = (x) => padding + (x / xMax) * chartWidth;
  const scaleY = (y) => height - padding - (y / yMax) * chartHeight;
  
  // Draw decision boundary (approximate)
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 3;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(scaleX(2.5), scaleY(0));
  ctx.lineTo(scaleX(2.5), scaleY(4));
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw "Yes" points
  const yesPoints = [{x: 1.0, y: 2.0}, {x: 2.0, y: 1.0}, {x: 1.5, y: 1.8}];
  yesPoints.forEach(p => {
    ctx.fillStyle = '#7ef0d4';
    ctx.beginPath();
    ctx.arc(scaleX(p.x), scaleY(p.y), 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Draw "No" points
  const noPoints = [{x: 3.0, y: 3.0}, {x: 3.5, y: 2.8}, {x: 2.9, y: 3.2}];
  noPoints.forEach(p => {
    ctx.fillStyle = '#ff8c6a';
    ctx.beginPath();
    ctx.arc(scaleX(p.x), scaleY(p.y), 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Draw test point
  ctx.fillStyle = '#ffeb3b';
  ctx.beginPath();
  ctx.arc(scaleX(2.0), scaleY(2.0), 12, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Label test point
  ctx.fillStyle = '#e8eef6';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Test [2.0, 2.0]', scaleX(2.0), scaleY(2.0) - 20);
  ctx.fillStyle = '#7ef0d4';
  ctx.fillText('→ YES', scaleX(2.0), scaleY(2.0) + 30);
  
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
  ctx.fillText('X₁', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('X₂', 0, 0);
  ctx.restore();
  
  // Legend
  ctx.fillStyle = '#7ef0d4';
  ctx.beginPath();
  ctx.arc(padding + 20, 30, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#e8eef6';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Class: Yes', padding + 30, 35);
  
  ctx.fillStyle = '#ff8c6a';
  ctx.beginPath();
  ctx.arc(padding + 120, 30, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#e8eef6';
  ctx.fillText('Class: No', padding + 130, 35);
  
  ctx.fillStyle = '#6aa9ff';
  ctx.fillText('| Decision Boundary', padding + 210, 35);
  
  logViz('Naive Bayes', 'Gaussian NB Boundary', 'success');
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
  
  // Create comparison chart at bottom
  if (!bayesComparisonChart) {
    const compCanvas = document.createElement('canvas');
    compCanvas.id = 'bayes-comparison-chart';
    compCanvas.style.marginTop = '20px';
    canvas.parentElement.appendChild(compCanvas);
    
    if (bayesComparisonChart) {
      bayesComparisonChart.destroy();
    }
    
    bayesComparisonChart = createVerifiedVisualization('bayes-comparison-chart', {
      type: 'bar',
      data: {
        labels: ['Spam Probability', 'Not-Spam Probability'],
        datasets: [{
          label: 'Probability',
          data: [0.1008, 0.0007],
          backgroundColor: ['#7ef0d4', '#ff8c6a'],
          borderColor: ['#7ef0d4', '#ff8c6a'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          title: {
            display: true,
            text: 'Probability Comparison',
            color: '#e8eef6',
            font: { size: 14 }
          },
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: '#2a3544' },
            ticks: { color: '#a9b4c2' }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#a9b4c2' }
          }
        }
      }
    }, 'Naive Bayes', 'Spam Classification');
    if (bayesComparisonChart) compCanvas.style.height = '150px';
  }
  
  logViz('Naive Bayes', 'Bayes Theorem Flow', 'success');
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
  if (!canvas) {
    logViz('Decision Trees', 'Tree Structure', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Decision Trees', 'Tree Structure', 'success');
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
  
  logViz('Decision Trees', 'Information Gain', 'success');
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Comparing Split Quality', width / 2, 40);
}

function drawEntropyViz() {
  const canvas = document.getElementById('entropy-viz');
  if (!canvas) {
    logViz('Decision Trees', 'Entropy Visualization', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Decision Trees', 'Entropy Visualization', 'success');
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

function drawTreeBoundary() {
  const canvas = document.getElementById('tree-boundary');
  if (!canvas) {
    logViz('Decision Trees', 'Decision Regions', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Decision Trees', 'Decision Regions', 'success');
}

// Topic 16b: Decision Tree Regression Visualization
function initDecisionTreeRegression() {
  const canvas1 = document.getElementById('dt-regression-canvas');
  if (canvas1 && !canvas1.dataset.initialized) {
    canvas1.dataset.initialized = 'true';
    drawDTRegression();
  }
  
  const canvas2 = document.getElementById('dt-splits-canvas');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawDTSplits();
  }
}

function drawDTRegression() {
  const canvas = document.getElementById('dt-regression-canvas');
  if (!canvas) {
    logViz('Decision Tree Regression', 'Splits & Predictions', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const xMin = 700, xMax = 1800;
  const yMin = 40, yMax = 110;
  const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth;
  const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight;
  
  // Data points
  const data = [
    {x: 800, y: 50}, {x: 850, y: 52}, {x: 900, y: 54},
    {x: 1500, y: 90}, {x: 1600, y: 95}, {x: 1700, y: 100}
  ];
  
  // Draw decision boundaries
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 3;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(scaleX(1200), padding);
  ctx.lineTo(scaleX(1200), height - padding);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(scaleX(1550), padding);
  ctx.lineTo(scaleX(1550), height - padding);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw regions with predictions
  ctx.fillStyle = 'rgba(126, 240, 212, 0.1)';
  ctx.fillRect(scaleX(700), scaleY(52), scaleX(1200) - scaleX(700), height - padding - scaleY(52));
  ctx.fillStyle = 'rgba(255, 140, 106, 0.1)';
  ctx.fillRect(scaleX(1200), scaleY(90), scaleX(1550) - scaleX(1200), height - padding - scaleY(90));
  ctx.fillStyle = 'rgba(106, 169, 255, 0.1)';
  ctx.fillRect(scaleX(1550), scaleY(97.5), scaleX(1800) - scaleX(1550), height - padding - scaleY(97.5));
  
  // Draw prediction lines
  ctx.strokeStyle = '#7ef0d4';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(scaleX(700), scaleY(52));
  ctx.lineTo(scaleX(1200), scaleY(52));
  ctx.stroke();
  
  ctx.strokeStyle = '#ff8c6a';
  ctx.beginPath();
  ctx.moveTo(scaleX(1200), scaleY(90));
  ctx.lineTo(scaleX(1550), scaleY(90));
  ctx.stroke();
  
  ctx.strokeStyle = '#6aa9ff';
  ctx.beginPath();
  ctx.moveTo(scaleX(1550), scaleY(97.5));
  ctx.lineTo(scaleX(1800), scaleY(97.5));
  ctx.stroke();
  
  // Draw data points
  data.forEach(point => {
    ctx.fillStyle = '#e8eef6';
    ctx.beginPath();
    ctx.arc(scaleX(point.x), scaleY(point.y), 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Labels
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Predict: ₹52L', scaleX(950), scaleY(52) - 10);
  ctx.fillStyle = '#ff8c6a';
  ctx.fillText('Predict: ₹90L', scaleX(1375), scaleY(90) - 10);
  ctx.fillStyle = '#6aa9ff';
  ctx.fillText('Predict: ₹97.5L', scaleX(1650), scaleY(97.5) - 10);
  
  // Axes
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Square Feet', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Price (Lakhs)', 0, 0);
  ctx.restore();
  
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Split at 1200', scaleX(1200), 30);
  ctx.fillText('Split at 1550', scaleX(1550), 30);
  
  logViz('Decision Tree Regression', 'Splits & Predictions', 'success');
}

function drawDTSplits() {
  const canvas = document.getElementById('dt-splits-canvas');
  if (!canvas) {
    logViz('Decision Tree Regression', 'Split Comparison', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const splits = [
    {value: 825, varReduction: 120, color: '#ff8c6a'},
    {value: 875, varReduction: 180, color: '#ffb490'},
    {value: 1200, varReduction: 462.25, color: '#7ef0d4'},
    {value: 1550, varReduction: 95, color: '#ffb490'},
    {value: 1650, varReduction: 65, color: '#ff8c6a'}
  ];
  
  const padding = 60;
  const barHeight = 50;
  const maxWidth = width - 2 * padding - 200;
  const maxVR = Math.max(...splits.map(s => s.varReduction));
  
  splits.forEach((split, i) => {
    const y = 60 + i * (barHeight + 25);
    const barWidth = (split.varReduction / maxVR) * maxWidth;
    
    ctx.fillStyle = split.color;
    ctx.fillRect(padding, y, barWidth, barHeight);
    ctx.strokeStyle = split.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, y, barWidth, barHeight);
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Split at ${split.value}`, padding, y - 8);
    
    ctx.fillStyle = '#1a2332';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`VR = ${split.varReduction.toFixed(1)}`, padding + barWidth / 2, y + barHeight / 2 + 5);
  });
  
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓ Split at 1200: Maximum Variance Reduction!', width / 2, height - 20);
  
  logViz('Decision Tree Regression', 'Split Comparison', 'success');
}

// Topic 17a: Gradient Boosting (NEW)
function initGradientBoosting() {
  const canvases = [
    { id: 'gb-sequential-canvas', fn: drawGBSequential },
    { id: 'gb-residuals-canvas', fn: drawGBResiduals },
    { id: 'gb-learning-rate-canvas', fn: drawGBLearningRate },
    { id: 'gb-stumps-canvas', fn: drawGBStumps },
    { id: 'gb-predictions-canvas', fn: drawGBPredictions }
  ];
  
  canvases.forEach(c => {
    const canvas = document.getElementById(c.id);
    if (canvas && !canvas.dataset.initialized) {
      canvas.dataset.initialized = 'true';
      c.fn();
    }
  });
}

function drawGBSequential() {
  const canvas = document.getElementById('gb-sequential-canvas');
  if (!canvas) return;
  
  const gbData = [
    { iteration: 0, f: 154, residual: 29.6 },
    { iteration: 1, f: 151.93, residual: 26.8 },
    { iteration: 2, f: 149.5, residual: 24.1 },
    { iteration: 3, f: 147.2, residual: 21.5 },
    { iteration: 4, f: 145.1, residual: 19.2 },
    { iteration: 5, f: 143.2, residual: 17.1 },
    { iteration: 6, f: 141.5, residual: 15.3 },
    { iteration: 7, f: 140.0, residual: 13.7 },
    { iteration: 8, f: 138.6, residual: 12.2 },
    { iteration: 9, f: 137.4, residual: 10.9 },
    { iteration: 10, f: 136.3, residual: 9.8 }
  ];
  
  createVerifiedVisualization('gb-sequential-canvas', {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Mean Prediction F(t)',
          data: gbData.map(d => ({ x: d.iteration, y: d.f })),
          borderColor: '#6aa9ff',
          backgroundColor: 'rgba(106, 169, 255, 0.1)',
          borderWidth: 3,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Mean Absolute Residual',
          data: gbData.map(d => ({ x: d.iteration, y: d.residual })),
          borderColor: '#ff8c6a',
          backgroundColor: 'rgba(255, 140, 106, 0.1)',
          borderWidth: 3,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Gradient Boosting: Sequential Learning',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: { labels: { color: '#a9b4c2' } }
      },
      scales: {
        x: {
          title: { display: true, text: 'Iteration', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Prediction F(t)', color: '#6aa9ff' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Residual', color: '#ff8c6a' },
          grid: { display: false },
          ticks: { color: '#a9b4c2' }
        }
      }
    }
  }, 'Gradient Boosting', 'Sequential Trees');
}

function drawGBResiduals() {
  const canvas = document.getElementById('gb-residuals-canvas');
  if (!canvas) return;
  
  const residuals = [
    { id: 1, iter0: -34, iter1: -31.93, iter5: -12, iter10: -3 },
    { id: 2, iter0: -24, iter1: -21.93, iter5: -8, iter10: -2 },
    { id: 3, iter0: -4, iter1: -1.93, iter5: -1, iter10: 0 },
    { id: 4, iter0: 16, iter1: 12.90, iter5: 5, iter10: 1 },
    { id: 5, iter0: 46, iter1: 42.90, iter5: 18, iter10: 4 }
  ];
  
  createVerifiedVisualization('gb-residuals-canvas', {
    type: 'bar',
    data: {
      labels: ['ID 1', 'ID 2', 'ID 3', 'ID 4', 'ID 5'],
      datasets: [
        {
          label: 'Iteration 0',
          data: residuals.map(r => r.iter0),
          backgroundColor: '#ff8c6a'
        },
        {
          label: 'Iteration 1',
          data: residuals.map(r => r.iter1),
          backgroundColor: '#ffb490'
        },
        {
          label: 'Iteration 5',
          data: residuals.map(r => r.iter5),
          backgroundColor: '#6aa9ff'
        },
        {
          label: 'Iteration 10',
          data: residuals.map(r => r.iter10),
          backgroundColor: '#7ef0d4'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Residual Reduction Over Iterations',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: { labels: { color: '#a9b4c2' } }
      },
      scales: {
        x: {
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          title: { display: true, text: 'Residual Value', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        }
      }
    }
  }, 'Gradient Boosting', 'Residual Reduction');
}

function drawGBLearningRate() {
  const canvas = document.getElementById('gb-learning-rate-canvas');
  if (!canvas) return;
  
  const iterations = Array.from({length: 21}, (_, i) => i);
  
  const lr01 = iterations.map(i => 154 - 18 * (1 - Math.exp(-i * 0.01)));
  const lr10 = iterations.map(i => 154 - 18 * (1 - Math.exp(-i * 0.1)));
  const lr100 = iterations.map(i => {
    if (i === 0) return 154;
    if (i < 5) return 154 - 18 * (1 - Math.exp(-i * 1.0));
    return 136 + Math.sin(i) * 2;
  });
  
  createVerifiedVisualization('gb-learning-rate-canvas', {
    type: 'line',
    data: {
      labels: iterations,
      datasets: [
        {
          label: 'lr = 0.01 (slow)',
          data: lr01,
          borderColor: '#ff8c6a',
          borderWidth: 3,
          pointRadius: 2
        },
        {
          label: 'lr = 0.1 (good)',
          data: lr10,
          borderColor: '#7ef0d4',
          borderWidth: 3,
          pointRadius: 2
        },
        {
          label: 'lr = 1.0 (too fast)',
          data: lr100,
          borderColor: '#6aa9ff',
          borderWidth: 3,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Learning Rate Effect on Convergence',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: { labels: { color: '#a9b4c2' } }
      },
      scales: {
        x: {
          title: { display: true, text: 'Iteration', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          title: { display: true, text: 'Mean Prediction', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        }
      }
    }
  }, 'Gradient Boosting', 'Learning Rate Effect');
}

function drawGBStumps() {
  const canvas = document.getElementById('gb-stumps-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const stumps = [
    { name: 'h1', split: 1050, left: -20.66, right: 31.0, color: '#6aa9ff' },
    { name: 'h2', split: 950, left: -15.2, right: 22.5, color: '#7ef0d4' },
    { name: 'h3', split: 1150, left: -8.5, right: 14.8, color: '#ffb490' }
  ];
  
  const stumpWidth = width / 3;
  
  stumps.forEach((stump, idx) => {
    const offsetX = idx * stumpWidth;
    const centerX = offsetX + stumpWidth / 2;
    
    // Title
    ctx.fillStyle = stump.color;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(stump.name, centerX, 30);
    
    // Root node
    ctx.fillStyle = stump.color + '33';
    ctx.fillRect(centerX - 40, 60, 80, 50);
    ctx.strokeStyle = stump.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - 40, 60, 80, 50);
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = '12px sans-serif';
    ctx.fillText('Size &lt;', centerX, 80);
    ctx.fillText(stump.split, centerX, 95);
    
    // Left child
    ctx.strokeStyle = stump.color;
    ctx.beginPath();
    ctx.moveTo(centerX, 110);
    ctx.lineTo(centerX - 50, 180);
    ctx.stroke();
    
    ctx.fillStyle = '#7ef0d4' + '33';
    ctx.fillRect(centerX - 85, 180, 70, 50);
    ctx.strokeStyle = '#7ef0d4';
    ctx.strokeRect(centerX - 85, 180, 70, 50);
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(stump.left.toFixed(2), centerX - 50, 210);
    
    // Right child
    ctx.strokeStyle = stump.color;
    ctx.beginPath();
    ctx.moveTo(centerX, 110);
    ctx.lineTo(centerX + 50, 180);
    ctx.stroke();
    
    ctx.fillStyle = '#ff8c6a' + '33';
    ctx.fillRect(centerX + 15, 180, 70, 50);
    ctx.strokeStyle = '#ff8c6a';
    ctx.strokeRect(centerX + 15, 180, 70, 50);
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(stump.right.toFixed(2), centerX + 50, 210);
    
    // Labels
    ctx.fillStyle = '#a9b4c2';
    ctx.font = '10px sans-serif';
    ctx.fillText('≤', centerX - 50, 150);
    ctx.fillText('&gt;', centerX + 50, 150);
  });
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Weak Learner Stumps (Depth = 1)', width / 2, height - 20);
  
  logViz('Gradient Boosting', 'Weak Learner Stumps', 'success');
}

function drawGBPredictions() {
  const canvas = document.getElementById('gb-predictions-canvas');
  if (!canvas) return;
  
  const actual = [120, 130, 150, 170, 200];
  const iter0 = [154, 154, 154, 154, 154];
  const iter5 = [125, 135, 148, 165, 195];
  const iter10 = [121, 131, 149, 169, 199];
  
  createVerifiedVisualization('gb-predictions-canvas', {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Actual',
          data: actual.map((y, i) => ({ x: i + 1, y: y })),
          backgroundColor: '#7ef0d4',
          pointRadius: 8
        },
        {
          label: 'Iteration 0',
          data: iter0.map((y, i) => ({ x: i + 1, y: y })),
          backgroundColor: '#ff8c6a',
          pointRadius: 6
        },
        {
          label: 'Iteration 5',
          data: iter5.map((y, i) => ({ x: i + 1, y: y })),
          backgroundColor: '#ffb490',
          pointRadius: 6
        },
        {
          label: 'Iteration 10',
          data: iter10.map((y, i) => ({ x: i + 1, y: y })),
          backgroundColor: '#6aa9ff',
          pointRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Predictions Approaching Actual Values',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: { labels: { color: '#a9b4c2' } }
      },
      scales: {
        x: {
          title: { display: true, text: 'Sample ID', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2', stepSize: 1 }
        },
        y: {
          title: { display: true, text: 'Price (₹ Lakhs)', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        }
      }
    }
  }, 'Gradient Boosting', 'Predictions vs Actual');
}

// Topic 17b: XGBoost (NEW)
function initXGBoost() {
  const canvases = [
    { id: 'xgb-gain-canvas', fn: drawXGBGain },
    { id: 'xgb-regularization-canvas', fn: drawXGBRegularization },
    { id: 'xgb-hessian-canvas', fn: drawXGBHessian },
    { id: 'xgb-leaf-weights-canvas', fn: drawXGBLeafWeights },
    { id: 'xgb-comparison-canvas', fn: drawXGBComparison }
  ];
  
  canvases.forEach(c => {
    const canvas = document.getElementById(c.id);
    if (canvas && !canvas.dataset.initialized) {
      canvas.dataset.initialized = 'true';
      c.fn();
    }
  });
}

function drawXGBGain() {
  const canvas = document.getElementById('xgb-gain-canvas');
  if (!canvas) return;
  
  const splits = [
    { threshold: 850, gl: -58, gr: 0, hl: 2, hr: 3, gain: 1121 },
    { threshold: 950, gl: -58, gr: 58, hl: 2, hr: 3, gain: 1962 },
    { threshold: 1050, gl: -62, gr: 62, hl: 3, hr: 2, gain: 1842 },
    { threshold: 1150, gl: -4, gr: 4, hl: 4, hr: 1, gain: 892 }
  ];
  
  createVerifiedVisualization('xgb-gain-canvas', {
    type: 'bar',
    data: {
      labels: splits.map(s => `Split ${s.threshold}`),
      datasets: [
        {
          label: 'GL (Left Gradient)',
          data: splits.map(s => s.gl),
          backgroundColor: '#ff8c6a',
          stack: 'gradient'
        },
        {
          label: 'GR (Right Gradient)',
          data: splits.map(s => s.gr),
          backgroundColor: '#6aa9ff',
          stack: 'gradient'
        },
        {
          label: 'Gain Score',
          data: splits.map(s => s.gain),
          backgroundColor: '#7ef0d4',
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'XGBoost Gain Calculation for Different Splits',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: { labels: { color: '#a9b4c2' } }
      },
      scales: {
        x: {
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          title: { display: true, text: 'Gradient Sum', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Gain', color: '#7ef0d4' },
          grid: { display: false },
          ticks: { color: '#a9b4c2' }
        }
      }
    }
  }, 'XGBoost', 'Gain Calculation');
}

function drawXGBRegularization() {
  const canvas = document.getElementById('xgb-regularization-canvas');
  if (!canvas) return;
  
  const lambdas = ['λ=0', 'λ=1', 'λ=10'];
  const trainAcc = [0.99, 0.95, 0.88];
  const testAcc = [0.82, 0.93, 0.91];
  
  createVerifiedVisualization('xgb-regularization-canvas', {
    type: 'bar',
    data: {
      labels: lambdas,
      datasets: [
        {
          label: 'Training Accuracy',
          data: trainAcc,
          backgroundColor: '#6aa9ff'
        },
        {
          label: 'Test Accuracy',
          data: testAcc,
          backgroundColor: '#7ef0d4'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Regularization Effect: λ Controls Overfitting',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: { labels: { color: '#a9b4c2' } }
      },
      scales: {
        x: {
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          title: { display: true, text: 'Accuracy', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' },
          min: 0.7,
          max: 1.0
        }
      }
    }
  }, 'XGBoost', 'Regularization Effect');
}

function drawXGBHessian() {
  const canvas = document.getElementById('xgb-hessian-canvas');
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
  
  // Draw surface comparison
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Hessian Provides Curvature Information', width / 2, 30);
  
  // Draw gradient only curve
  ctx.strokeStyle = '#ff8c6a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x <= 10; x += 0.2) {
    const y = 200 - 100 * Math.exp(-Math.pow(x - 5, 2) / 8);
    if (x === 0) ctx.moveTo(padding + x * chartWidth / 10, y);
    else ctx.lineTo(padding + x * chartWidth / 10, y);
  }
  ctx.stroke();
  
  // Draw gradient + hessian curve
  ctx.strokeStyle = '#7ef0d4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x <= 10; x += 0.2) {
    const y = 200 - 120 * Math.exp(-Math.pow(x - 5, 2) / 5);
    if (x === 0) ctx.moveTo(padding + x * chartWidth / 10, y);
    else ctx.lineTo(padding + x * chartWidth / 10, y);
  }
  ctx.stroke();
  
  // Optimum point
  ctx.fillStyle = '#7ef0d4';
  ctx.beginPath();
  ctx.arc(padding + 5 * chartWidth / 10, 80, 8, 0, 2 * Math.PI);
  ctx.fill();
  
  // Legend
  ctx.fillStyle = '#ff8c6a';
  ctx.fillRect(padding + 10, height - 80, 20, 3);
  ctx.fillStyle = '#e8eef6';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('1st order only (slower)', padding + 40, height - 75);
  
  ctx.fillStyle = '#7ef0d4';
  ctx.fillRect(padding + 10, height - 55, 20, 3);
  ctx.fillStyle = '#e8eef6';
  ctx.fillText('1st + 2nd order (faster)', padding + 40, height - 50);
  
  logViz('XGBoost', 'Hessian Contribution', 'success');
}

function drawXGBLeafWeights() {
  const canvas = document.getElementById('xgb-leaf-weights-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 350;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 40;
  const boxWidth = 300;
  const boxHeight = 120;
  
  // Left leaf
  const leftX = width / 4 - boxWidth / 2;
  ctx.fillStyle = '#7ef0d4' + '22';
  ctx.fillRect(leftX, 80, boxWidth, boxHeight);
  ctx.strokeStyle = '#7ef0d4';
  ctx.lineWidth = 3;
  ctx.strokeRect(leftX, 80, boxWidth, boxHeight);
  
  ctx.fillStyle = '#e8eef6';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Left Leaf (Size ≤ 950):', leftX + 10, 105);
  ctx.font = '12px monospace';
  ctx.fillText('w = -G / (H + λ)', leftX + 10, 130);
  ctx.fillText('  = -(-58) / (2 + 1)', leftX + 10, 150);
  ctx.fillText('  = 58 / 3', leftX + 10, 170);
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#7ef0d4';
  ctx.fillText('  = 19.33', leftX + 10, 190);
  
  // Right leaf
  const rightX = 3 * width / 4 - boxWidth / 2;
  ctx.fillStyle = '#ff8c6a' + '22';
  ctx.fillRect(rightX, 80, boxWidth, boxHeight);
  ctx.strokeStyle = '#ff8c6a';
  ctx.lineWidth = 3;
  ctx.strokeRect(rightX, 80, boxWidth, boxHeight);
  
  ctx.fillStyle = '#e8eef6';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Right Leaf (Size &gt; 950):', rightX + 10, 105);
  ctx.font = '12px monospace';
  ctx.fillText('w = -G / (H + λ)', rightX + 10, 130);
  ctx.fillText('  = -(58) / (3 + 1)', rightX + 10, 150);
  ctx.fillText('  = -58 / 4', rightX + 10, 170);
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#ff8c6a';
  ctx.fillText('  = -14.5', rightX + 10, 190);
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Leaf Weight Calculation (λ = 1)', width / 2, 40);
  
  // Formula reminder
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '13px sans-serif';
  ctx.fillText('Negative gradient divided by (Hessian + regularization)', width / 2, height - 20);
  
  logViz('XGBoost', 'Leaf Weight Calculation', 'success');
}

function drawXGBComparison() {
  const canvas = document.getElementById('xgb-comparison-canvas');
  if (!canvas) return;
  
  createVerifiedVisualization('xgb-comparison-canvas', {
    type: 'radar',
    data: {
      labels: ['Accuracy', 'Speed', 'Robustness', 'Ease of Use', 'Scalability', 'Interpretability'],
      datasets: [
        {
          label: 'Gradient Boosting',
          data: [4.5, 3, 3.5, 4, 3, 3],
          borderColor: '#ff8c6a',
          backgroundColor: 'rgba(255, 140, 106, 0.2)',
          borderWidth: 2
        },
        {
          label: 'XGBoost',
          data: [5, 4.5, 5, 4, 5, 3],
          borderColor: '#7ef0d4',
          backgroundColor: 'rgba(126, 240, 212, 0.2)',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Gradient Boosting vs XGBoost: Comprehensive Comparison',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: {
          position: 'top',
          labels: { color: '#a9b4c2', padding: 15 }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 5,
          ticks: { color: '#a9b4c2', backdropColor: 'transparent' },
          grid: { color: '#2a3544' },
          pointLabels: { color: '#e8eef6', font: { size: 12 } }
        }
      }
    }
  }, 'XGBoost', 'GB vs XGB Comparison');
}

function initBagging() {
  const canvas = document.getElementById('bagging-complete-canvas');
  if (canvas && !canvas.dataset.initialized) {
    canvas.dataset.initialized = 'true';
    drawBaggingCompleteViz();
  }
}

function initBoostingAdaBoost() {
  const canvas = document.getElementById('boosting-complete-canvas');
  if (canvas && !canvas.dataset.initialized) {
    canvas.dataset.initialized = 'true';
    drawBoostingCompleteViz();
  }
}

function initRandomForest() {
  const canvas = document.getElementById('rf-complete-canvas');
  if (canvas && !canvas.dataset.initialized) {
    canvas.dataset.initialized = 'true';
    drawRandomForestCompleteViz();
  }
}

// Topic 17: Ensemble Methods
function initEnsembleMethods() {
  const canvasNew1 = document.getElementById('bagging-complete-canvas');
  if (canvasNew1 && !canvasNew1.dataset.initialized) {
    canvasNew1.dataset.initialized = 'true';
    drawBaggingCompleteViz();
  }
  
  const canvasNew2 = document.getElementById('boosting-complete-canvas');
  if (canvasNew2 && !canvasNew2.dataset.initialized) {
    canvasNew2.dataset.initialized = 'true';
    drawBoostingCompleteViz();
  }
  
  const canvasNew3 = document.getElementById('rf-complete-canvas');
  if (canvasNew3 && !canvasNew3.dataset.initialized) {
    canvasNew3.dataset.initialized = 'true';
    drawRandomForestCompleteViz();
  }
  
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

function drawBaggingCompleteViz() {
  const canvas = document.getElementById('bagging-complete-canvas');
  if (!canvas) {
    logViz('Ensemble Methods', 'Bagging Complete', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 400;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const treeY = 100;
  const predY = 280;
  const finalY = 350;
  
  // Three trees
  for (let i = 0; i < 3; i++) {
    const x = 150 + i * 250;
    const preds = [75, 72, 78];
    
    // Tree box
    ctx.fillStyle = '#7ef0d433';
    ctx.fillRect(x - 50, treeY, 100, 60);
    ctx.strokeStyle = '#7ef0d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 50, treeY, 100, 60);
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Tree ${i + 1}`, x, treeY + 35);
    
    // Prediction
    ctx.fillStyle = '#6aa9ff33';
    ctx.fillRect(x - 40, predY, 80, 50);
    ctx.strokeStyle = '#6aa9ff';
    ctx.strokeRect(x - 40, predY, 80, 50);
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`₹${preds[i]}L`, x, predY + 32);
    
    // Arrow to final
    ctx.strokeStyle = '#7ef0d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, predY + 50);
    ctx.lineTo(width / 2, finalY - 10);
    ctx.stroke();
  }
  
  // Final average
  ctx.fillStyle = '#ff8c6a33';
  ctx.fillRect(width / 2 - 80, finalY, 160, 50);
  ctx.strokeStyle = '#ff8c6a';
  ctx.lineWidth = 3;
  ctx.strokeRect(width / 2 - 80, finalY, 160, 50);
  
  ctx.fillStyle = '#e8eef6';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Avg = ₹75L ✓', width / 2, finalY + 32);
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Bagging: Average of 3 Trees', width / 2, 30);
  
  logViz('Ensemble Methods', 'Bagging Complete', 'success');
}

function drawBoostingCompleteViz() {
  const canvas = document.getElementById('boosting-complete-canvas');
  if (!canvas) {
    logViz('Ensemble Methods', 'Boosting Complete', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const rounds = [
    {label: 'Round 1', weights: [1, 1, 1, 1, 1, 1], errors: [20, 20, 21, 2, 3, 2]},
    {label: 'Round 2', weights: [1, 1, 1, 2.5, 3, 2.5], errors: [21, 21, 20, 0, 1, 0]},
    {label: 'Round 3', weights: [2, 2, 2, 1, 1, 1], errors: [20, 20, 21, 1, 2, 1]}
  ];
  
  const startX = 60;
  const barWidth = 30;
  const gap = 10;
  
  rounds.forEach((round, r) => {
    const y = 80 + r * 120;
    
    ctx.fillStyle = '#7ef0d4';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(round.label, 10, y + 20);
    
    // Weight bars
    round.weights.forEach((w, i) => {
      const x = startX + i * (barWidth + gap);
      const h = w * 20;
      
      ctx.fillStyle = w > 1.5 ? '#ff8c6a' : '#6aa9ff';
      ctx.fillRect(x, y + 40 - h, barWidth, h);
      
      // Error text
      ctx.fillStyle = '#a9b4c2';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`e=${round.errors[i]}`, x + barWidth / 2, y + 55);
    });
  });
  
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Boosting: Sequential Weight Updates', width / 2, 30);
  ctx.fillText('Final: α₁×M₁ + α₂×M₂ + α₃×M₃ = ₹74.7L', width / 2, height - 20);
}

function drawRandomForestCompleteViz() {
  const canvas = document.getElementById('rf-complete-canvas');
  if (!canvas) {
    logViz('Ensemble Methods', 'Random Forest Complete', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 500;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  // Show 3 trees with feature randomness
  const trees = [
    {features: ['Sq Ft', 'Age'], pred: 74},
    {features: ['Sq Ft', 'Beds'], pred: 76},
    {features: ['Beds', 'Age'], pred: 75}
  ];
  
  trees.forEach((tree, i) => {
    const x = 120 + i * 260;
    const y = 100;
    
    // Bootstrap
    ctx.fillStyle = '#6aa9ff33';
    ctx.fillRect(x - 60, y, 120, 50);
    ctx.strokeStyle = '#6aa9ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 60, y, 120, 50);
    ctx.fillStyle = '#e8eef6';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Bootstrap', x, y + 25);
    ctx.fillText(`Sample ${i + 1}`, x, y + 40);
    
    // Tree with random features
    ctx.fillStyle = '#7ef0d433';
    ctx.fillRect(x - 60, y + 80, 120, 70);
    ctx.strokeStyle = '#7ef0d4';
    ctx.strokeRect(x - 60, y + 80, 120, 70);
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`Tree ${i + 1}`, x, y + 105);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#ffb490';
    ctx.fillText('Random:', x, y + 123);
    ctx.fillText(tree.features.join(', '), x, y + 138);
    
    // Prediction
    ctx.fillStyle = '#ff8c6a33';
    ctx.fillRect(x - 50, y + 180, 100, 50);
    ctx.strokeStyle = '#ff8c6a';
    ctx.strokeRect(x - 50, y + 180, 100, 50);
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`₹${tree.pred}L`, x, y + 210);
    
    // Arrow to final
    ctx.strokeStyle = '#7ef0d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + 230);
    ctx.lineTo(width / 2, y + 300);
    ctx.stroke();
  });
  
  // Final average
  ctx.fillStyle = '#7ef0d433';
  ctx.fillRect(width / 2 - 100, 400, 200, 70);
  ctx.strokeStyle = '#7ef0d4';
  ctx.lineWidth = 3;
  ctx.strokeRect(width / 2 - 100, 400, 200, 70);
  ctx.fillStyle = '#e8eef6';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Average of 100 Trees', width / 2, 425);
  ctx.fillText('= ₹75.2L ± ₹2.3L ✓', width / 2, 450);
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Random Forest: Bootstrap + Feature Randomness', width / 2, 30);
  
  logViz('Ensemble Methods', 'Random Forest Complete', 'success');
}

function drawBaggingViz() {
  const canvas = document.getElementById('bagging-viz');
  if (!canvas) {
    logViz('Ensemble Methods', 'Bagging Viz', 'failed', 'Canvas not found');
    return;
  }
  
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
  
  logViz('Ensemble Methods', 'Boosting Complete', 'success');
}

function drawGBLearningRate() {
  // Implementation moved to Gradient Boosting section
}

function drawGBStumps() {
  // Implementation moved to Gradient Boosting section
}

function drawGBPredictions() {
  // Implementation moved to Gradient Boosting section
}

function drawXGBGain() {
  // Implementation moved to XGBoost section
}

function drawXGBRegularization() {
  // Implementation moved to XGBoost section
}

function drawXGBHessian() {
  // Implementation moved to XGBoost section
}

function drawXGBLeafWeights() {
  // Implementation moved to XGBoost section
}

function drawXGBComparison() {
  // Implementation moved to XGBoost section
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
  
  logViz('Ensemble Methods', 'Bagging Viz', 'success');
}

// Topic 16: K-means Clustering
let kmeansVizChart = null;
let kmeansElbowChart = null;

function initKMeans() {
  const canvas1 = document.getElementById('kmeans-viz-canvas');
  if (canvas1 && !canvas1.dataset.initialized) {
    canvas1.dataset.initialized = 'true';
    drawKMeansVisualization();
  }
  
  const canvas2 = document.getElementById('kmeans-elbow-canvas');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawKMeansElbow();
  }
}

function drawKMeansVisualization() {
  const canvas = document.getElementById('kmeans-viz-canvas');
  if (!canvas) {
    logViz('K-means', 'Scatter + Centroids', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const xMin = 0, xMax = 10, yMin = 0, yMax = 12;
  const scaleX = (x) => padding + (x / xMax) * chartWidth;
  const scaleY = (y) => height - padding - (y / yMax) * chartHeight;
  
  // Data points
  const points = [
    {id: 'A', x: 1, y: 2, cluster: 1},
    {id: 'B', x: 1.5, y: 1.8, cluster: 1},
    {id: 'C', x: 5, y: 8, cluster: 2},
    {id: 'D', x: 8, y: 8, cluster: 2},
    {id: 'E', x: 1, y: 0.6, cluster: 1},
    {id: 'F', x: 9, y: 11, cluster: 2}
  ];
  
  // Final centroids
  const centroids = [
    {x: 1.17, y: 1.47, color: '#7ef0d4'},
    {x: 7.33, y: 9.0, color: '#ff8c6a'}
  ];
  
  // Draw lines from points to centroids
  points.forEach(p => {
    const c = centroids[p.cluster - 1];
    ctx.strokeStyle = p.cluster === 1 ? 'rgba(126, 240, 212, 0.3)' : 'rgba(255, 140, 106, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(scaleX(p.x), scaleY(p.y));
    ctx.lineTo(scaleX(c.x), scaleY(c.y));
    ctx.stroke();
  });
  
  // Draw points
  points.forEach(p => {
    ctx.fillStyle = p.cluster === 1 ? '#7ef0d4' : '#ff8c6a';
    ctx.beginPath();
    ctx.arc(scaleX(p.x), scaleY(p.y), 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.id, scaleX(p.x), scaleY(p.y) - 15);
  });
  
  // Draw centroids
  centroids.forEach((c, i) => {
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.arc(scaleX(c.x), scaleY(c.y), 12, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#e8eef6';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw X
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scaleX(c.x) - 6, scaleY(c.y) - 6);
    ctx.lineTo(scaleX(c.x) + 6, scaleY(c.y) + 6);
    ctx.moveTo(scaleX(c.x) + 6, scaleY(c.y) - 6);
    ctx.lineTo(scaleX(c.x) - 6, scaleY(c.y) + 6);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`c${i+1}`, scaleX(c.x), scaleY(c.y) + 25);
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
  ctx.fillText('X', width / 2, height - 20);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Y', 0, 0);
  ctx.restore();
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('K-means Clustering (K=2) - Final State', width / 2, 30);
  
  // WCSS
  ctx.fillStyle = '#6aa9ff';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('WCSS = 15.984', padding, height - padding + 30);
  
  logViz('K-means', 'Scatter + Centroids', 'success');
}

function drawKMeansElbow() {
  const canvas = document.getElementById('kmeans-elbow-canvas');
  if (!canvas) return;
  
  if (kmeansElbowChart) {
    kmeansElbowChart.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  
  const kValues = [1, 2, 3, 4, 5];
  const wcssValues = [50, 18, 10, 8, 7];
  
  kmeansElbowChart = createVerifiedVisualization('kmeans-elbow-canvas', {
    type: 'line',
    data: {
      labels: kValues,
      datasets: [{
        label: 'WCSS',
        data: wcssValues,
        borderColor: '#6aa9ff',
        backgroundColor: 'rgba(106, 169, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: kValues.map(k => k === 3 ? 10 : 6),
        pointBackgroundColor: kValues.map(k => k === 3 ? '#7ef0d4' : '#6aa9ff'),
        pointBorderColor: kValues.map(k => k === 3 ? '#7ef0d4' : '#6aa9ff'),
        pointBorderWidth: kValues.map(k => k === 3 ? 3 : 2)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Elbow Method: Optimal K = 3 (Elbow Point)',
          color: '#7ef0d4',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          labels: { color: '#a9b4c2' }
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              xMin: 3,
              xMax: 3,
              borderColor: '#7ef0d4',
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                display: true,
                content: 'Elbow!',
                position: 'start'
              }
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Number of Clusters (K)', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2', stepSize: 1 }
        },
        y: {
          title: { display: true, text: 'Within-Cluster Sum of Squares (WCSS)', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' },
          min: 0
        }
      }
    }
  }, 'K-means', 'Elbow Method');
}

// Topic 18: Algorithm Comparison
let comparisonState = {
  selectedAlgorithms: [],
  algorithmData: {
    'Linear Regression': {
      category: 'Supervised - Regression',
      speed: 5, accuracy: 3, dataRequired: 1, interpretability: 5, scalability: 3,
      featureScaling: 'Required', nonLinear: 'No', trainingTime: 'Fast', memoryUsage: 'Low',
      bestFor: 'Linear trends, forecasting',
      pros: ['Very fast', 'Highly interpretable', 'Works with little data', 'No tuning needed'],
      cons: ['Assumes linearity', 'Sensitive to outliers', 'No complex patterns'],
      useCases: { regression: 5, classification: 0, clustering: 0, speed: 5, interpretability: 5 }
    },
    'Logistic Regression': {
      category: 'Supervised - Classification',
      speed: 5, accuracy: 4, dataRequired: 2, interpretability: 4, scalability: 4,
      featureScaling: 'Required', nonLinear: 'No', trainingTime: 'Fast', memoryUsage: 'Low',
      bestFor: 'Binary classification, probabilities',
      pros: ['Fast', 'Probabilistic output', 'Interpretable', 'Works well'],
      cons: ['Binary only', 'Assumes linearity', 'Limited complexity'],
      useCases: { regression: 0, classification: 5, clustering: 0, speed: 5, interpretability: 4 }
    },
    'SVM': {
      category: 'Supervised - Classification',
      speed: 2, accuracy: 5, dataRequired: 2, interpretability: 2, scalability: 2,
      featureScaling: 'Required', nonLinear: 'Yes', trainingTime: 'Slow', memoryUsage: 'Medium',
      bestFor: 'High accuracy, complex boundaries',
      pros: ['Very high accuracy', 'Handles non-linear', 'Effective in high dims'],
      cons: ['Slow training', 'Hard to interpret', 'Needs tuning'],
      useCases: { regression: 2, classification: 5, clustering: 0, speed: 2, interpretability: 2 }
    },
    'KNN': {
      category: 'Supervised - Classification',
      speed: 1, accuracy: 4, dataRequired: 3, interpretability: 3, scalability: 1,
      featureScaling: 'Required', nonLinear: 'Yes', trainingTime: 'None', memoryUsage: 'High',
      bestFor: 'Local patterns, small datasets',
      pros: ['Simple', 'No training', 'Handles non-linear'],
      cons: ['Very slow prediction', 'Needs lots of memory', 'Needs scaling'],
      useCases: { regression: 3, classification: 4, clustering: 3, speed: 1, interpretability: 3 }
    },
    'Naive Bayes': {
      category: 'Supervised - Classification',
      speed: 5, accuracy: 3, dataRequired: 2, interpretability: 5, scalability: 5,
      featureScaling: 'Not needed', nonLinear: 'Yes', trainingTime: 'Fast', memoryUsage: 'Low',
      bestFor: 'Quick models, text classification',
      pros: ['Very fast', 'Interpretable', 'Works with little data'],
      cons: ['Independence assumption wrong', 'Often biased', 'Limited accuracy'],
      useCases: { regression: 2, classification: 4, clustering: 0, speed: 5, interpretability: 5 }
    },
    'Decision Trees': {
      category: 'Supervised - Classification',
      speed: 3, accuracy: 4, dataRequired: 2, interpretability: 5, scalability: 3,
      featureScaling: 'Not needed', nonLinear: 'Yes', trainingTime: 'Medium', memoryUsage: 'Low',
      bestFor: 'Interpretability, complex decisions',
      pros: ['Very interpretable', 'No scaling needed', 'Handles non-linear'],
      cons: ['Prone to overfitting', 'Unstable', 'Biased to dominant class'],
      useCases: { regression: 3, classification: 4, clustering: 0, speed: 3, interpretability: 5 }
    },
    'Random Forest': {
      category: 'Supervised - Classification',
      speed: 2, accuracy: 5, dataRequired: 3, interpretability: 3, scalability: 3,
      featureScaling: 'Not needed', nonLinear: 'Yes', trainingTime: 'Slow', memoryUsage: 'Medium',
      bestFor: 'High accuracy with complex data',
      pros: ['Very high accuracy', 'No scaling', 'Handles non-linear'],
      cons: ['Slow', 'Less interpretable', 'Black box'],
      useCases: { regression: 3, classification: 5, clustering: 0, speed: 3, interpretability: 2 }
    },
    'K-means': {
      category: 'Unsupervised - Clustering',
      speed: 4, accuracy: 3, dataRequired: 3, interpretability: 4, scalability: 4,
      featureScaling: 'Required', nonLinear: 'No', trainingTime: 'Medium', memoryUsage: 'Low',
      bestFor: 'Customer segmentation, grouping',
      pros: ['Fast', 'Simple', 'Scalable'],
      cons: ['Need to specify K', 'Sensitive to init', 'Assumes spherical'],
      useCases: { regression: 0, classification: 0, clustering: 5, speed: 4, interpretability: 4 }
    },
    'PCA': {
      category: 'Unsupervised - Dimensionality Reduction',
      speed: 3, accuracy: 4, dataRequired: 2, interpretability: 2, scalability: 4,
      featureScaling: 'Required', nonLinear: 'No', trainingTime: 'Medium', memoryUsage: 'Medium',
      bestFor: 'High-dimensional data reduction',
      pros: ['Reduces dimensions', 'Preserves variance', 'Fast after trained'],
      cons: ['Components not interpretable', 'Linear only', 'Assumes normality'],
      useCases: { regression: 0, classification: 0, clustering: 0, speed: 4, interpretability: 2 }
    }
  }
};

function initAlgorithmComparison() {
  const container = document.getElementById('algorithm-checkboxes');
  if (!container || container.dataset.initialized) return;
  container.dataset.initialized = 'true';
  
  populateAlgorithmCheckboxes();
  initComparisonListeners();
  initQuiz();
}

function populateAlgorithmCheckboxes() {
  const container = document.getElementById('algorithm-checkboxes');
  if (!container) return;
  
  const categoryRadios = document.querySelectorAll('input[name="category"]');
  
  function updateCheckboxes() {
    const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || 'all';
    container.innerHTML = '';
    
    Object.keys(comparisonState.algorithmData).forEach(name => {
      const algo = comparisonState.algorithmData[name];
      const category = algo.category.toLowerCase();
      
      if (selectedCategory === 'all' || 
          (selectedCategory === 'supervised' && category.includes('supervised')) ||
          (selectedCategory === 'unsupervised' && category.includes('unsupervised'))) {
        
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '8px';
        label.style.cursor = 'pointer';
        label.style.padding = '8px';
        label.style.borderRadius = '6px';
        label.style.transition = 'background 0.2s';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = name;
        checkbox.addEventListener('change', updateSelection);
        
        const text = document.createTextNode(name);
        
        label.appendChild(checkbox);
        label.appendChild(text);
        label.addEventListener('mouseenter', () => label.style.background = 'var(--color-secondary)');
        label.addEventListener('mouseleave', () => label.style.background = 'transparent');
        
        container.appendChild(label);
      }
    });
  }
  
  categoryRadios.forEach(radio => radio.addEventListener('change', updateCheckboxes));
  updateCheckboxes();
}

function updateSelection() {
  const checkboxes = document.querySelectorAll('#algorithm-checkboxes input[type="checkbox"]:checked');
  comparisonState.selectedAlgorithms = Array.from(checkboxes).map(cb => cb.value);
  
  const count = comparisonState.selectedAlgorithms.length;
  const countEl = document.getElementById('selection-count');
  const compareBtn = document.getElementById('compare-btn');
  
  if (countEl) {
    countEl.textContent = `Selected: ${count} algorithm${count !== 1 ? 's' : ''}`;
    countEl.style.color = count >= 2 && count <= 5 ? 'var(--color-success)' : 'var(--color-error)';
  }
  
  if (compareBtn) {
    compareBtn.disabled = count < 2 || count > 5;
  }
}

function initComparisonListeners() {
  const compareBtn = document.getElementById('compare-btn');
  if (compareBtn) {
    compareBtn.addEventListener('click', showComparison);
  }
  
  const viewBtns = document.querySelectorAll('.view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const view = btn.dataset.view;
      document.querySelectorAll('.comparison-view').forEach(v => v.style.display = 'none');
      const targetView = document.getElementById(`view-${view}`);
      if (targetView) targetView.style.display = 'block';
    });
  });
}

function showComparison() {
  const resultsDiv = document.getElementById('comparison-results');
  if (!resultsDiv) return;
  
  resultsDiv.style.display = 'block';
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  renderComparisonTable();
  renderRadarChart();
  renderHeatmap();
  renderUseCaseMatrix();
  renderDetailedCards();
}

function renderComparisonTable() {
  const table = document.getElementById('comparison-table');
  if (!table) return;
  
  const metrics = [
    { key: 'speed', label: 'Speed', format: (v) => '⭐'.repeat(v) },
    { key: 'accuracy', label: 'Accuracy', format: (v) => '⭐'.repeat(v) },
    { key: 'dataRequired', label: 'Data Required', format: (v) => ['Small', 'Small', 'Medium', 'Large', 'Very Large'][v] },
    { key: 'interpretability', label: 'Interpretability', format: (v) => '⭐'.repeat(v) },
    { key: 'featureScaling', label: 'Feature Scaling' },
    { key: 'nonLinear', label: 'Handles Non-linear' },
    { key: 'trainingTime', label: 'Training Time' },
    { key: 'memoryUsage', label: 'Memory Usage' },
    { key: 'bestFor', label: 'Best For' }
  ];
  
  let html = '<thead><tr><th>Metric</th>';
  comparisonState.selectedAlgorithms.forEach(name => {
    html += `<th>${name}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  metrics.forEach(metric => {
    html += `<tr><td><strong>${metric.label}</strong></td>`;
    comparisonState.selectedAlgorithms.forEach(name => {
      const algo = comparisonState.algorithmData[name];
      const value = algo[metric.key];
      const display = metric.format ? metric.format(value) : value;
      html += `<td>${display}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody>';
  table.innerHTML = html;
  
  logViz('Algorithm Comparison', 'Comparison Table', 'success');
}

let radarComparisonChart = null;

function renderRadarChart() {
  const canvas = document.getElementById('radar-comparison-canvas');
  if (!canvas) return;
  
  if (radarComparisonChart) {
    radarComparisonChart.destroy();
    radarComparisonChart = null;
  }
  
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = 500;
  
  const colors = ['#6aa9ff', '#7ef0d4', '#ff8c6a', '#ffeb3b', '#ffb490'];
  
  const datasets = comparisonState.selectedAlgorithms.map((name, i) => {
    const algo = comparisonState.algorithmData[name];
    return {
      label: name,
      data: [algo.speed, algo.accuracy, 5 - algo.dataRequired, algo.interpretability, algo.scalability],
      borderColor: colors[i],
      backgroundColor: colors[i] + '33',
      borderWidth: 2,
      pointRadius: 4
    };
  });
  
  if (radarComparisonChart) {
    radarComparisonChart.destroy();
    radarComparisonChart = null;
  }
  
  radarComparisonChart = createVerifiedVisualization('radar-comparison-canvas', {
    type: 'radar',
    data: {
      labels: ['Speed', 'Accuracy', 'Data Efficiency', 'Interpretability', 'Scalability'],
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#a9b4c2', padding: 15 }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 5,
          ticks: { color: '#a9b4c2', backdropColor: 'transparent' },
          grid: { color: '#2a3544' },
          pointLabels: { color: '#e8eef6', font: { size: 12 } }
        }
      }
    }
  }, 'Algorithm Comparison', 'Radar Chart');
}

function renderHeatmap() {
  const container = document.getElementById('view-heatmap');
  if (!container) return;
  
  // Remove canvas, use HTML table instead for 100% browser compatibility
  const metrics = ['Speed', 'Accuracy', 'Data Efficiency', 'Interpretability', 'Scalability'];
  const algos = comparisonState.selectedAlgorithms;
  
  // Helper function to get color based on value
  function getHeatmapColor(value) {
    const intensity = value / 5;
    const r = Math.floor(255 - 149 * intensity);
    const g = Math.floor(140 + 100 * intensity);
    const b = Math.floor(106 + 106 * intensity);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // Build HTML table heatmap
  let html = '<h3 style="margin-bottom: 20px; text-align: center; color: #7ef0d4;">Performance Heatmap (Higher is Better)</h3>';
  html += '<div style="overflow-x: auto;">';
  html += '<table style="width: 100%; border-collapse: collapse; margin: 20px auto; max-width: 1000px;">';
  
  // Header row
  html += '<thead><tr style="background: #2a3544; border-bottom: 2px solid #6aa9ff;">';
  html += '<th style="padding: 12px; text-align: left; color: #7ef0d4; border: 1px solid #3a4554; min-width: 150px;">Algorithm</th>';
  metrics.forEach(metric => {
    html += `<th style="padding: 12px; text-align: center; color: #7ef0d4; border: 1px solid #3a4554; min-width: 80px;">${metric}</th>`;
  });
  html += '</tr></thead>';
  
  // Data rows
  html += '<tbody>';
  algos.forEach((name, i) => {
    const algo = comparisonState.algorithmData[name];
    const values = [algo.speed, algo.accuracy, 5 - algo.dataRequired, algo.interpretability, algo.scalability];
    
    html += `<tr style="border-bottom: 1px solid #3a4554;">`;
    html += `<td style="padding: 12px; font-weight: 600; background: #2a3544; color: #e8eef6; border: 1px solid #3a4554;">${name}</td>`;
    
    values.forEach((value, j) => {
      const color = getHeatmapColor(value);
      const stars = '⭐'.repeat(Math.round(value));
      html += `<td style="padding: 12px; text-align: center; background: ${color}; border: 1px solid #1a2332; color: #1a2332; font-weight: bold; font-size: 16px;">`;
      html += `<div style="margin-bottom: 4px;">${value.toFixed(0)}</div>`;
      html += `<div style="font-size: 12px;">${stars}</div>`;
      html += `</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody>';
  html += '</table>';
  html += '</div>';
  
  logViz('Algorithm Comparison', 'Heatmap', 'success');
  
  // Legend
  html += '<div style="text-align: center; margin-top: 24px; padding: 16px; background: var(--color-bg-2); border-radius: 8px;">';
  html += '<strong style="color: #e8eef6;">Legend:</strong> ';
  html += '<span style="margin-left: 16px;">🔴 Low (1-2)</span> ';
  html += '<span style="margin-left: 16px;">🟡 Medium (3)</span> ';
  html += '<span style="margin-left: 16px;">🟢 High (4-5)</span>';
  html += '</div>';
  
  // Find the canvas and replace with our HTML
  const oldCanvas = container.querySelector('#heatmap-canvas');
  if (oldCanvas) {
    oldCanvas.parentElement.innerHTML = html;
  } else {
    container.innerHTML = html;
  }
}

function renderUseCaseMatrix() {
  const table = document.getElementById('matrix-table');
  if (!table) return;
  
  const useCases = [
    { key: 'regression', label: 'Regression' },
    { key: 'classification', label: 'Classification' },
    { key: 'clustering', label: 'Clustering' },
    { key: 'speed', label: 'Speed' },
    { key: 'interpretability', label: 'Interpretability' }
  ];
  
  let html = '<thead><tr><th>Use Case</th>';
  comparisonState.selectedAlgorithms.forEach(name => {
    html += `<th>${name}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  useCases.forEach(useCase => {
    html += `<tr><td><strong>${useCase.label}</strong></td>`;
    comparisonState.selectedAlgorithms.forEach(name => {
      const algo = comparisonState.algorithmData[name];
      const value = algo.useCases[useCase.key];
      const check = '✓'.repeat(value);
      html += `<td style="color: ${value > 3 ? 'var(--color-success)' : value > 0 ? 'var(--color-warning)' : 'var(--color-error)'}">${check || '✗'}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody>';
  table.innerHTML = html;
  
  logViz('Algorithm Comparison', 'Use Case Matrix', 'success');
}

function renderDetailedCards() {
  const container = document.getElementById('detailed-cards');
  if (!container) return;
  
  let html = '<h3 style="margin-bottom: 24px; text-align: center;">Detailed Comparison</h3>';
  html += '<div style="display: grid; gap: 24px;">';
  
  comparisonState.selectedAlgorithms.forEach(name => {
    const algo = comparisonState.algorithmData[name];
    html += `
      <div class="info-card" style="background: var(--color-bg-1); padding: 24px;">
        <h4 style="font-size: 20px; margin-bottom: 16px; color: var(--color-primary);">${name}</h4>
        <p style="margin-bottom: 12px; color: var(--color-text-secondary);">${algo.category}</p>
        
        <div style="margin: 20px 0;">
          <strong style="color: var(--color-success);">✓ Pros:</strong>
          <ul style="margin: 8px 0 0 20px; color: var(--color-text);">
            ${algo.pros.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        
        <div style="margin: 20px 0;">
          <strong style="color: var(--color-error);">✗ Cons:</strong>
          <ul style="margin: 8px 0 0 20px; color: var(--color-text);">
            ${algo.cons.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
        
        <div style="padding: 12px; background: var(--color-secondary); border-radius: 6px; margin-top: 16px;">
          <strong style="color: var(--color-text);">⚡ Best For:</strong> ${algo.bestFor}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
  
  logViz('Algorithm Comparison', 'Detailed Cards', 'success');
}

function initQuiz() {
  const questions = document.querySelectorAll('.quiz-question');
  const resultDiv = document.getElementById('quiz-result');
  
  questions.forEach((q, idx) => {
    const radios = q.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (idx < questions.length - 1) {
          questions[idx + 1].style.display = 'block';
        }
        
        if (idx === questions.length - 1) {
          showQuizResult();
        }
      });
    });
  });
  
  function showQuizResult() {
    const q1 = document.querySelector('input[name="q1"]:checked')?.value;
    const q2 = document.querySelector('input[name="q2"]:checked')?.value;
    const q3 = document.querySelector('input[name="q3"]:checked')?.value;
    const q4 = document.querySelector('input[name="q4"]:checked')?.value;
    
    let recommendation = '';
    let alternatives = [];
    
    if (q1 === 'no') {
      recommendation = 'K-means';
      alternatives = ['PCA', 'DBSCAN'];
    } else if (q2 === 'numbers') {
      if (q3 === 'little') {
        recommendation = 'Linear Regression';
        alternatives = ['Decision Trees'];
      } else {
        recommendation = 'Random Forest';
        alternatives = ['XGBoost', 'Linear Regression'];
      }
    } else if (q2 === 'categories') {
      if (q4 === 'very') {
        recommendation = 'Decision Trees';
        alternatives = ['Logistic Regression', 'Naive Bayes'];
      } else if (q3 === 'little') {
        recommendation = 'Naive Bayes';
        alternatives = ['Logistic Regression'];
      } else {
        recommendation = 'Random Forest';
        alternatives = ['SVM', 'XGBoost'];
      }
    } else {
      recommendation = 'K-means';
      alternatives = ['PCA'];
    }
    
    if (resultDiv) {
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = `
        <h4 style="font-size: 18px; color: var(--color-success); margin-bottom: 12px;">🎯 Recommendation: ${recommendation}</h4>
        <p style="margin-bottom: 12px;">Based on your answers, <strong>${recommendation}</strong> is the best fit for your use case.</p>
        <p style="margin-bottom: 8px;"><strong>Other good choices:</strong></p>
        <ul style="margin-left: 20px;">
          ${alternatives.map(a => `<li>${a}</li>`).join('')}
        </ul>
      `;
      resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function drawDecisionFlowchart() {
  const canvas = document.getElementById('decision-flowchart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 500;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const nodes = [
    { x: width/2, y: 50, text: 'Start:\nWhat problem?', w: 140, h: 60, color: '#7ef0d4', type: 'start' },
    { x: width/4, y: 160, text: 'Classification', w: 120, h: 50, color: '#6aa9ff', type: 'decision' },
    { x: width/2, y: 160, text: 'Regression', w: 120, h: 50, color: '#6aa9ff', type: 'decision' },
    { x: 3*width/4, y: 160, text: 'Clustering', w: 120, h: 50, color: '#6aa9ff', type: 'decision' },
    { x: width/8, y: 270, text: 'Linear?', w: 100, h: 50, color: '#ffb490', type: 'question' },
    { x: 3*width/8, y: 270, text: 'Fast?', w: 100, h: 50, color: '#ffb490', type: 'question' },
    { x: width/2, y: 270, text: 'Linear?', w: 100, h: 50, color: '#ffb490', type: 'question' },
    { x: 3*width/4, y: 270, text: 'Known K?', w: 100, h: 50, color: '#ffb490', type: 'question' },
    { x: width/16, y: 380, text: 'Logistic\nRegression', w: 90, h: 50, color: '#7ef0d4', type: 'result' },
    { x: 3*width/16, y: 380, text: 'SVM', w: 90, h: 50, color: '#7ef0d4', type: 'result' },
    { x: 5*width/16, y: 380, text: 'Naive\nBayes', w: 90, h: 50, color: '#7ef0d4', type: 'result' },
    { x: 7*width/16, y: 380, text: 'Random\nForest', w: 90, h: 50, color: '#7ef0d4', type: 'result' },
    { x: 9*width/16, y: 380, text: 'Linear\nRegression', w: 90, h: 50, color: '#7ef0d4', type: 'result' },
    { x: 11*width/16, y: 380, text: 'XGBoost', w: 90, h: 50, color: '#7ef0d4', type: 'result' },
    { x: 13*width/16, y: 380, text: 'K-means', w: 90, h: 50, color: '#7ef0d4', type: 'result' },
    { x: 15*width/16, y: 380, text: 'DBSCAN', w: 90, h: 50, color: '#7ef0d4', type: 'result' }
  ];
  
  const edges = [
    { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
    { from: 1, to: 4 }, { from: 1, to: 5 },
    { from: 2, to: 6 },
    { from: 3, to: 7 },
    { from: 4, to: 8, label: 'Yes' }, { from: 4, to: 9, label: 'No' },
    { from: 5, to: 10, label: 'Yes' }, { from: 5, to: 11, label: 'No' },
    { from: 6, to: 12, label: 'Yes' }, { from: 6, to: 13, label: 'No' },
    { from: 7, to: 14, label: 'Yes' }, { from: 7, to: 15, label: 'No' }
  ];
  
  // Draw edges
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 2;
  edges.forEach(edge => {
    const from = nodes[edge.from];
    const to = nodes[edge.to];
    
    ctx.beginPath();
    ctx.moveTo(from.x, from.y + from.h/2);
    ctx.lineTo(to.x, to.y - to.h/2);
    ctx.stroke();
    
    if (edge.label) {
      ctx.fillStyle = '#7ef0d4';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      ctx.fillText(edge.label, midX + 12, midY);
    }
  });
  
  // Draw nodes
  nodes.forEach(node => {
    const x = node.x - node.w/2;
    const y = node.y - node.h/2;
    
    ctx.fillStyle = node.color + '33';
    ctx.fillRect(x, y, node.w, node.h);
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, node.w, node.h);
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = node.type === 'result' ? 'bold 11px sans-serif' : '11px sans-serif';
    ctx.textAlign = 'center';
    const lines = node.text.split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, node.x, node.y - (lines.length - 1) * 6 + i * 12);
    });
  });
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Algorithm Selection Flowchart', width/2, 25);
}

// Diagnostic Functions
function showDiagnostics() {
  const browserDetails = document.getElementById('browser-details');
  if (browserDetails) {
    browserDetails.innerHTML = `
      <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); color: var(--color-text);">Browser: ${navigator.userAgent.split(' ').slice(-2).join(' ')}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); color: var(--color-text);">Platform: ${navigator.platform}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); color: var(--color-text);">Language: ${navigator.language}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); color: var(--color-text);">Online: ${navigator.onLine ? '✓ Yes' : '✗ No'}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); color: var(--color-text);">Cookies Enabled: ${navigator.cookieEnabled ? '✓ Yes' : '✗ No'}</li>
    `;
  }
  
  const libraryDetails = document.getElementById('library-details');
  if (libraryDetails) {
    const chartJsLoaded = typeof Chart !== 'undefined';
    const canvasSupport = !!document.createElement('canvas').getContext('2d');
    
    libraryDetails.innerHTML = `
      <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); color: var(--color-text);">Chart.js: ${chartJsLoaded ? '✓ Loaded (v' + (Chart.version || '4.x') + ')' : '✗ Missing'}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); color: var(--color-text);">Canvas Support: ${canvasSupport ? '✓ Yes' : '✗ No'}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); color: var(--color-text);">Device Pixel Ratio: ${window.devicePixelRatio || 1}</li>
      <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); color: var(--color-text);">Screen Resolution: ${window.screen.width}x${window.screen.height}</li>
    `;
  }
  
  const successCount = document.getElementById('diag-success-count');
  const failedCount = document.getElementById('diag-failed-count');
  const warningCount = document.getElementById('diag-warning-count');
  
  if (successCount) successCount.textContent = vizLog.success.length;
  if (failedCount) failedCount.textContent = vizLog.failed.length;
  if (warningCount) warningCount.textContent = vizLog.warnings.length;
}

function showDiagnosticDetails(filter) {
  const container = document.getElementById('viz-details');
  if (!container) return;
  
  let items = [];
  if (filter === 'success') items = vizLog.success;
  else if (filter === 'failed') items = vizLog.failed;
  else items = [...vizLog.success, ...vizLog.failed, ...vizLog.warnings];
  
  if (items.length === 0) {
    container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 20px;">No items to display</p>';
    return;
  }
  
  let html = '<table class="data-table" style="font-size: 12px;">';
  html += '<thead><tr><th>Module</th><th>Visualization</th><th>Status</th><th>Time</th></tr></thead>';
  html += '<tbody>';
  
  items.forEach(item => {
    const statusIcon = item.status === 'success' ? '✓' : (item.status === 'failed' ? '✗' : '⚠');
    const statusColor = item.status === 'success' ? 'var(--color-success)' : (item.status === 'failed' ? 'var(--color-error)' : 'var(--color-warning)');
    
    html += `<tr>`;
    html += `<td>${item.module}</td>`;
    html += `<td>${item.name}</td>`;
    html += `<td style="color: ${statusColor}; font-weight: bold;">${statusIcon} ${item.status.toUpperCase()}</td>`;
    html += `<td>${item.timestamp}</td>`;
    html += `</tr>`;
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

// NEW VISUALIZATIONS FOR ADDED TOPICS

// Gradient Boosting Classification
function initGradientBoostingClassification() {
  const canvas1 = document.getElementById('gb-class-sequential-canvas');
  if (canvas1 && !canvas1.dataset.initialized) {
    canvas1.dataset.initialized = 'true';
    drawGBClassSequential();
  }
  
  const canvas2 = document.getElementById('gb-class-gradients-canvas');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawGBClassGradients();
  }
}

function drawGBClassSequential() {
  const canvas = document.getElementById('gb-class-sequential-canvas');
  if (!canvas) return;
  
  const iterations = [0, 1, 2, 3, 4, 5, 10];
  const house1 = [0.4, 0.39, 0.37, 0.35, 0.33, 0.31, 0.22];
  const house4 = [0.4, 0.43, 0.47, 0.52, 0.57, 0.62, 0.78];
  
  createVerifiedVisualization('gb-class-sequential-canvas', {
    type: 'line',
    data: {
      labels: iterations,
      datasets: [
        {
          label: 'House 1 (y=0): Probability ↓',
          data: house1,
          borderColor: '#7ef0d4',
          backgroundColor: 'rgba(126, 240, 212, 0.1)',
          borderWidth: 3,
          fill: true
        },
        {
          label: 'House 4 (y=1): Probability ↑',
          data: house4,
          borderColor: '#6aa9ff',
          backgroundColor: 'rgba(106, 169, 255, 0.1)',
          borderWidth: 3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Gradient Boosting Classification: Probability Updates',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: { labels: { color: '#a9b4c2' } }
      },
      scales: {
        x: {
          title: { display: true, text: 'Iteration', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          title: { display: true, text: 'P(y=1)', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' },
          min: 0,
          max: 1
        }
      }
    }
  }, 'GB Classification', 'Sequential Updates');
}

function drawGBClassGradients() {
  const canvas = document.getElementById('gb-class-gradients-canvas');
  if (!canvas) return;
  
  createVerifiedVisualization('gb-class-gradients-canvas', {
    type: 'bar',
    data: {
      labels: ['House 1', 'House 2', 'House 3', 'House 4', 'House 5'],
      datasets: [
        {
          label: 'Iteration 0 Gradients',
          data: [0.4, 0.4, 0.4, -0.6, -0.6],
          backgroundColor: '#ff8c6a'
        },
        {
          label: 'Iteration 5 Gradients',
          data: [0.1, 0.08, 0.09, -0.15, -0.12],
          backgroundColor: '#7ef0d4'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Gradient Values: Shrinking Over Iterations',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: { labels: { color: '#a9b4c2' } }
      },
      scales: {
        x: {
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          title: { display: true, text: 'Gradient (p - y)', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        }
      }
    }
  }, 'GB Classification', 'Gradient Values');
}

// XGBoost Classification
function initXGBoostClassification() {
  const canvas = document.getElementById('xgb-class-hessian-canvas');
  if (canvas && !canvas.dataset.initialized) {
    canvas.dataset.initialized = 'true';
    drawXGBClassHessian();
  }
}

function drawXGBClassHessian() {
  const canvas = document.getElementById('xgb-class-hessian-canvas');
  if (!canvas) return;
  
  const houses = ['House 1', 'House 2', 'House 3', 'House 4', 'House 5'];
  const gradients = [0.4, 0.4, 0.4, -0.6, -0.6];
  const hessians = [0.24, 0.24, 0.24, 0.24, 0.24];
  
  createVerifiedVisualization('xgb-class-hessian-canvas', {
    type: 'bar',
    data: {
      labels: houses,
      datasets: [
        {
          label: 'Gradient (g)',
          data: gradients,
          backgroundColor: '#6aa9ff',
          yAxisID: 'y'
        },
        {
          label: 'Hessian (h)',
          data: hessians,
          backgroundColor: '#7ef0d4',
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'XGBoost: Gradient + Hessian Information',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: { labels: { color: '#a9b4c2' } }
      },
      scales: {
        x: {
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Gradient', color: '#6aa9ff' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Hessian', color: '#7ef0d4' },
          grid: { display: false },
          ticks: { color: '#a9b4c2' }
        }
      }
    }
  }, 'XGBoost Classification', 'Hessian Values');
}

// Hierarchical Clustering
function initHierarchicalClustering() {
  const canvas = document.getElementById('hierarchical-dendrogram-canvas');
  if (canvas && !canvas.dataset.initialized) {
    canvas.dataset.initialized = 'true';
    drawHierarchicalDendrogram();
  }
}

function drawHierarchicalDendrogram() {
  const canvas = document.getElementById('hierarchical-dendrogram-canvas');
  if (!canvas) {
    logViz('Hierarchical Clustering', 'Dendrogram', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const numPoints = 6;
  const pointSpacing = (width - 2 * padding) / numPoints;
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  // Draw points at bottom
  const pointY = height - 40;
  labels.forEach((label, i) => {
    const x = padding + i * pointSpacing + pointSpacing / 2;
    
    ctx.fillStyle = '#7ef0d4';
    ctx.beginPath();
    ctx.arc(x, pointY, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#e8eef6';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, pointY + 20);
  });
  
  // Draw dendrogram merges
  const merges = [
    { points: [0, 1], height: 320 },
    { points: [3, 4], height: 330 },
    { points: [0, 1, 2], height: 220 },
    { points: [3, 4, 5], height: 200 },
    { points: [0, 1, 2, 3, 4, 5], height: 80 }
  ];
  
  ctx.strokeStyle = '#6aa9ff';
  ctx.lineWidth = 2;
  
  // Merge A-B
  let x1 = padding + 0 * pointSpacing + pointSpacing / 2;
  let x2 = padding + 1 * pointSpacing + pointSpacing / 2;
  ctx.beginPath();
  ctx.moveTo(x1, pointY);
  ctx.lineTo(x1, merges[0].height);
  ctx.lineTo(x2, merges[0].height);
  ctx.lineTo(x2, pointY);
  ctx.stroke();
  
  // Merge D-E
  x1 = padding + 3 * pointSpacing + pointSpacing / 2;
  x2 = padding + 4 * pointSpacing + pointSpacing / 2;
  ctx.beginPath();
  ctx.moveTo(x1, pointY);
  ctx.lineTo(x1, merges[1].height);
  ctx.lineTo(x2, merges[1].height);
  ctx.lineTo(x2, pointY);
  ctx.stroke();
  
  // Merge (A-B)-C
  x1 = padding + 0.5 * pointSpacing + pointSpacing / 2;
  x2 = padding + 2 * pointSpacing + pointSpacing / 2;
  ctx.beginPath();
  ctx.moveTo(x1, merges[0].height);
  ctx.lineTo(x1, merges[2].height);
  ctx.lineTo(x2, merges[2].height);
  ctx.lineTo(x2, pointY);
  ctx.stroke();
  
  // Merge (D-E)-F
  x1 = padding + 3.5 * pointSpacing + pointSpacing / 2;
  x2 = padding + 5 * pointSpacing + pointSpacing / 2;
  ctx.beginPath();
  ctx.moveTo(x1, merges[1].height);
  ctx.lineTo(x1, merges[3].height);
  ctx.lineTo(x2, merges[3].height);
  ctx.lineTo(x2, pointY);
  ctx.stroke();
  
  // Final merge
  x1 = padding + 1.5 * pointSpacing;
  x2 = padding + 4.5 * pointSpacing;
  ctx.beginPath();
  ctx.moveTo(x1, merges[2].height);
  ctx.lineTo(x1, merges[4].height);
  ctx.lineTo(x2, merges[4].height);
  ctx.lineTo(x2, merges[3].height);
  ctx.stroke();
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Dendrogram: Cluster Merging History', width / 2, 30);
  
  // Y-axis label
  ctx.fillStyle = '#a9b4c2';
  ctx.font = '12px sans-serif';
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Distance', 0, 0);
  ctx.restore();
  
  logViz('Hierarchical Clustering', 'Dendrogram', 'success');
}

// DBSCAN
function initDBSCAN() {
  const canvas = document.getElementById('dbscan-clusters-canvas');
  if (canvas && !canvas.dataset.initialized) {
    canvas.dataset.initialized = 'true';
    drawDBSCANClusters();
  }
}

function drawDBSCANClusters() {
  const canvas = document.getElementById('dbscan-clusters-canvas');
  if (!canvas) {
    logViz('DBSCAN', 'Clusters Visualization', 'failed', 'Canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 450;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, width, height);
  
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  const scaleX = (x) => padding + (x / 10) * chartWidth;
  const scaleY = (y) => height - padding - (y / 10) * chartHeight;
  
  const eps = 1.5;
  const epsPixels = (eps / 10) * chartWidth;
  
  // Core points (cluster 1)
  const core1 = [{x: 1, y: 1}, {x: 1.2, y: 1.5}, {x: 1.5, y: 1.2}];
  // Core points (cluster 2)
  const core2 = [{x: 8, y: 8}, {x: 8.2, y: 8.5}, {x: 8.5, y: 8.2}];
  // Border points
  const border = [{x: 2.2, y: 2}];
  // Outliers
  const outliers = [{x: 5, y: 5}, {x: 4.5, y: 6}];
  
  // Draw eps circles around core points
  ctx.strokeStyle = 'rgba(126, 240, 212, 0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  core1.forEach(p => {
    ctx.beginPath();
    ctx.arc(scaleX(p.x), scaleY(p.y), epsPixels, 0, 2 * Math.PI);
    ctx.stroke();
  });
  ctx.setLineDash([]);
  
  // Draw core points
  core1.forEach(p => {
    ctx.fillStyle = '#7ef0d4';
    ctx.beginPath();
    ctx.arc(scaleX(p.x), scaleY(p.y), 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  core2.forEach(p => {
    ctx.fillStyle = '#6aa9ff';
    ctx.beginPath();
    ctx.arc(scaleX(p.x), scaleY(p.y), 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Draw border points
  border.forEach(p => {
    ctx.fillStyle = '#ffb490';
    ctx.beginPath();
    ctx.arc(scaleX(p.x), scaleY(p.y), 8, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  // Draw outliers
  outliers.forEach(p => {
    ctx.strokeStyle = '#ff8c6a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(scaleX(p.x), scaleY(p.y), 8, 0, 2 * Math.PI);
    ctx.stroke();
  });
  
  // Legend
  ctx.fillStyle = '#7ef0d4';
  ctx.beginPath();
  ctx.arc(padding + 20, 30, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#e8eef6';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Core points', padding + 35, 35);
  
  ctx.fillStyle = '#ffb490';
  ctx.beginPath();
  ctx.arc(padding + 140, 30, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#e8eef6';
  ctx.fillText('Border points', padding + 155, 35);
  
  ctx.strokeStyle = '#ff8c6a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(padding + 270, 30, 8, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = '#e8eef6';
  ctx.fillText('Outliers', padding + 285, 35);
  
  // Title
  ctx.fillStyle = '#7ef0d4';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DBSCAN: Core, Border, and Outlier Points', width / 2, height - 10);
  
  logViz('DBSCAN', 'Clusters Visualization', 'success');
}

// Clustering Evaluation
function initClusteringEvaluation() {
  const canvas1 = document.getElementById('silhouette-plot-canvas');
  if (canvas1 && !canvas1.dataset.initialized) {
    canvas1.dataset.initialized = 'true';
    drawSilhouettePlot();
  }
  
  const canvas2 = document.getElementById('ch-index-canvas');
  if (canvas2 && !canvas2.dataset.initialized) {
    canvas2.dataset.initialized = 'true';
    drawCHIndex();
  }
}

function drawSilhouettePlot() {
  const canvas = document.getElementById('silhouette-plot-canvas');
  if (!canvas) return;
  
  createVerifiedVisualization('silhouette-plot-canvas', {
    type: 'bar',
    data: {
      labels: ['Cluster 1 Avg', 'Cluster 2 Avg', 'Cluster 3 Avg', 'Overall'],
      datasets: [{
        label: 'Silhouette Coefficient',
        data: [0.72, 0.68, 0.81, 0.74],
        backgroundColor: ['#7ef0d4', '#6aa9ff', '#ffb490', '#ff8c6a'],
        borderColor: ['#7ef0d4', '#6aa9ff', '#ffb490', '#ff8c6a'],
        borderWidth: 2
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Silhouette Coefficients: All Above 0.7 = Excellent!',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: { display: false }
      },
      scales: {
        x: {
          title: { display: true, text: 'Silhouette Coefficient', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' },
          min: 0,
          max: 1
        },
        y: {
          grid: { display: false },
          ticks: { color: '#a9b4c2' }
        }
      }
    }
  }, 'Clustering Evaluation', 'Silhouette Plot');
}

function drawCHIndex() {
  const canvas = document.getElementById('ch-index-canvas');
  if (!canvas) return;
  
  const kValues = [2, 3, 4, 5, 6, 7, 8];
  const chScores = [89, 234, 187, 145, 112, 95, 78];
  
  createVerifiedVisualization('ch-index-canvas', {
    type: 'line',
    data: {
      labels: kValues,
      datasets: [{
        label: 'Calinski-Harabasz Index',
        data: chScores,
        borderColor: '#6aa9ff',
        backgroundColor: 'rgba(106, 169, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        pointRadius: kValues.map(k => k === 3 ? 10 : 6),
        pointBackgroundColor: kValues.map(k => k === 3 ? '#7ef0d4' : '#6aa9ff'),
        pointBorderWidth: kValues.map(k => k === 3 ? 3 : 2)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Calinski-Harabasz Index: Optimal k = 3',
          color: '#e8eef6',
          font: { size: 16 }
        },
        legend: { labels: { color: '#a9b4c2' } }
      },
      scales: {
        x: {
          title: { display: true, text: 'Number of Clusters (k)', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' }
        },
        y: {
          title: { display: true, text: 'CH Index (higher is better)', color: '#a9b4c2' },
          grid: { color: '#2a3544' },
          ticks: { color: '#a9b4c2' },
          min: 0
        }
      }
    }
  }, 'Clustering Evaluation', 'CH Index');
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
    if (document.getElementById('elbow-canvas')) drawElbowCurve();
    if (document.getElementById('cv-k-canvas')) drawCVKHeatmap();
    if (document.getElementById('gridsearch-heatmap')) drawGridSearchHeatmap();
    if (document.getElementById('param-surface')) drawParamSurface();
    if (document.getElementById('bayes-theorem-viz')) drawBayesTheorem();
    if (document.getElementById('spam-classification')) drawSpamClassification();
    if (document.getElementById('decision-tree-viz')) drawDecisionTree();
    if (document.getElementById('entropy-viz')) drawEntropyViz();
    if (document.getElementById('split-comparison')) drawSplitComparison();
    if (document.getElementById('tree-boundary')) drawTreeBoundary();
    if (document.getElementById('bagging-viz')) drawBaggingViz();
    if (document.getElementById('boosting-viz')) drawBoostingViz();
    if (document.getElementById('random-forest-viz')) drawRandomForestViz();
    if (document.getElementById('categorical-nb-canvas')) drawCategoricalNB();
    if (document.getElementById('gaussian-nb-canvas')) drawGaussianNB();
    if (document.getElementById('kmeans-viz-canvas')) drawKMeansVisualization();
    if (document.getElementById('kmeans-elbow-canvas')) drawKMeansElbow();
    if (document.getElementById('decision-flowchart')) drawDecisionFlowchart();
  }, 250);
});

// Add global function for diagnostic details (needed by onclick)
window.showDiagnosticDetails = showDiagnosticDetails;
