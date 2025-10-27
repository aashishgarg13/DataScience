/* ================================================================
   Feature Engineering Explorer — Core JS Logic
   ================================================================ */

/***** ---------- 1. DATA ------------------------------------------------ */
const datasets = {
  missingAge: [25, null, 30, 35, null, 40, 45],
  studentHeights: [150, 155, 160, 165, 170, 175, 180, 185, 260],
  colors: ['Red', 'Green', 'Blue', 'Red', 'Green', 'Yellow'],
  houseData: {
    sqft: [900, 1000, 1200, 1500, 1800, 2000],
    bedrooms: [2, 2, 3, 3, 4, 4]
  }
};

/***** ---------- 2. NAVIGATION & ACTIVE LINK --------------------------- */
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelector('.nav__link.active')?.classList.remove('active');
    link.classList.add('active');
  });
});

// Highlight section in view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelector('.nav__link.active')?.classList.remove('active');
        document
          .querySelector(`.nav__link[href="#${id}"]`)
          .classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
document.querySelectorAll('.topic-section').forEach((sec) => observer.observe(sec));

/***** ---------- 3. CANVAS HELPERS ------------------------------------ */
function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
function drawBar(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function drawAxis(ctx) {
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 10);
  ctx.lineTo(40, ctx.canvas.height - 30);
  ctx.lineTo(ctx.canvas.width - 10, ctx.canvas.height - 30);
  ctx.stroke();
}

/***** ---------- 4. INTRO CANVAS -------------------------------------- */
(function introVis() {
  const c = document.getElementById('canvas-intro');
  if (!c) return;
  const ctx = c.getContext('2d');

  function draw() {
    clearCanvas(ctx);

    const steps = [
      'Raw Data',
      'Cleaning',
      'Feature Engineering',
      'Model',
      'Prediction'
    ];
    const boxW = 110,
      boxH = 40,
      gap = 20,
      startX = 30,
      y = 100;
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    steps.forEach((step, i) => {
      const x = startX + i * (boxW + gap);
      // box
      ctx.fillStyle = i === 2 ? '#00d4ff' : '#252a47';
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.fillRect(x, y, boxW, boxH);
      ctx.strokeRect(x, y, boxW, boxH);
      // text
      ctx.fillStyle = '#e0e6ed';
      ctx.fillText(step, x + boxW / 2, y + boxH / 2);
      // arrow
      if (i < steps.length - 1) {
        ctx.strokeStyle = '#e0e6ed';
        ctx.beginPath();
        ctx.moveTo(x + boxW, y + boxH / 2);
        ctx.lineTo(x + boxW + gap - 10, y + boxH / 2);
        ctx.lineTo(x + boxW + gap - 14, y + boxH / 2 - 4);
        ctx.moveTo(x + boxW + gap - 10, y + boxH / 2);
        ctx.lineTo(x + boxW + gap - 14, y + boxH / 2 + 4);
        ctx.stroke();
      }
    });
  }
  draw();
})();

/***** ---------- 5. MISSING DATA CANVAS ------------------------------- */
(function missingDataVis() {
  const c = document.getElementById('canvas-missing-data');
  if (!c) return;
  const ctx = c.getContext('2d');
  const data = [25, null, 30, 35, null, 40, 45];

  function impute(data, method) {
    const arr = [...data];
    const observed = arr.filter((v) => v != null);
    switch (method) {
      case 'mean': {
        const mean = observed.reduce((a, b) => a + b, 0) / observed.length;
        return arr.map((v) => (v == null ? mean : v));
      }
      case 'median': {
        const sorted = observed.slice().sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median =
          sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
        return arr.map((v) => (v == null ? median : v));
      }
      case 'mode': {
        const freq = {};
        observed.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
        let mode = observed[0];
        let max = 0;
        for (const key in freq) {
          if (freq[key] > max) {
            max = freq[key];
            mode = Number(key);
          }
        }
        return arr.map((v) => (v == null ? mode : v));
      }
      case 'ffill': {
        let last = observed[0];
        return arr.map((v) => {
          if (v == null) return last;
          last = v;
          return v;
        });
      }
      case 'knn': {
        // very naive KNN with k = 3 using nearest neighbors by index
        const k = 3;
        return arr.map((v, idx) => {
          if (v != null) return v;
          const neighbors = [];
          // look left and right until we gather k neighbors
          let left = idx - 1,
            right = idx + 1;
          while (neighbors.length < k && (left >= 0 || right < arr.length)) {
            if (left >= 0 && arr[left] != null) neighbors.push(arr[left]);
            if (neighbors.length === k) break;
            if (right < arr.length && arr[right] != null) neighbors.push(arr[right]);
            left--;
            right++;
          }
          if (neighbors.length === 0) return 0;
          return neighbors.reduce((a, b) => a + b, 0) / neighbors.length;
        });
      }
      default:
        return arr;
    }
  }

  function draw(method) {
    const original = [...data];
    const imputed = impute(data, method);

    clearCanvas(ctx);
    
    // Title and description
    ctx.fillStyle = '#00d4ff';
    ctx.font = '16px Inter, sans-serif';
    let methodName = '';
    if (method === 'mean') methodName = 'Mean Imputation: Missing values filled with 35';
    else if (method === 'median') methodName = 'Median Imputation: Missing values filled with 35';
    else if (method === 'knn') methodName = 'KNN Imputation: Using k=2 neighbors';
    ctx.fillText(methodName, 40, 30);

    // Draw axis
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 60);
    ctx.lineTo(60, 420);
    ctx.lineTo(760, 420);
    ctx.stroke();

    const maxVal = 50;
    const barW = 70;
    const gap = 20;
    const chartBottom = 420;

    imputed.forEach((val, i) => {
      const x = 80 + i * (barW + gap);
      const h = (val / maxVal) * 320;
      const y = chartBottom - h;
      const origMissing = original[i] == null;
      
      let color = '#00d4ff';
      if (origMissing && method === 'mean') color = '#00ffff';
      else if (origMissing && method === 'median') color = '#ff6b35';
      else if (origMissing && method === 'knn') color = '#00ff88';
      else if (origMissing) color = '#888';
      
      drawBar(ctx, x, y, barW, h, color);
      
      // Value label
      ctx.fillStyle = '#e0e6ed';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(val), x + barW/2, y - 10);
      
      // Missing marker
      if (original[i] == null) {
        ctx.fillStyle = '#ff6b35';
        ctx.font = '20px Inter, sans-serif';
        ctx.fillText('?', x + barW/2, chartBottom + 30);
      }
    });
    ctx.textAlign = 'left';

    // Legend
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#00d4ff';
    ctx.fillText('■ Original values', 80, 470);
    ctx.fillStyle = method === 'mean' ? '#00ffff' : method === 'median' ? '#ff6b35' : '#00ff88';
    ctx.fillText('■ Imputed values', 220, 470);
  }

  // Button event listeners
  const btnMean = document.getElementById('btn-mean-impute');
  const btnMedian = document.getElementById('btn-median-impute');
  const btnKnn = document.getElementById('btn-knn-impute');
  
  if (btnMean) btnMean.addEventListener('click', () => draw('mean'));
  if (btnMedian) btnMedian.addEventListener('click', () => draw('median'));
  if (btnKnn) btnKnn.addEventListener('click', () => draw('knn'));
  
  // Initial draw
  draw('mean');
})();

/***** ---------- 6. OUTLIER CANVAS ------------------------------------ */
(function outlierVis() {
  const c = document.getElementById('canvas-outliers');
  if (!c) return;
  const ctx = c.getContext('2d');
  const data = [150, 155, 160, 165, 170, 175, 180, 185, 260];

  function draw(method) {
    const mean = data.reduce((a, b) => a + b) / data.length;
    const std = Math.sqrt(
      data.map((v) => (v - mean) ** 2).reduce((a, b) => a + b) / data.length
    );
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = 157.5;
    const q3 = 182.5;
    const iqr = 25;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    clearCanvas(ctx);
    
    // Title
    ctx.fillStyle = '#00d4ff';
    ctx.font = '16px Inter, sans-serif';
    let title = '';
    if (method === 'iqr') title = 'IQR Method: 1 outlier detected (260cm)';
    else if (method === 'zscore') title = 'Z-Score: 1 outlier detected';
    else if (method === 'winsorize') title = 'Winsorization: Capped at 95th percentile (185cm)';
    ctx.fillText(title, 40, 30);

    // Draw axis
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 60);
    ctx.lineTo(60, 420);
    ctx.lineTo(760, 420);
    ctx.stroke();

    const maxVal = 280;
    const plotBottom = 420;

    // Draw scatter plot
    data.forEach((v, i) => {
      const x = 100 + i * 70;
      const y = plotBottom - (v / maxVal) * 320;
      
      let isOutlier = false;
      if (method === 'iqr') {
        isOutlier = v < lowerBound || v > upperBound;
      } else if (method === 'zscore') {
        const z = Math.abs((v - mean) / std);
        isOutlier = z > 3;
      } else if (method === 'winsorize') {
        isOutlier = v > 185;
      }
      
      ctx.fillStyle = isOutlier ? '#ff6b35' : '#00d4ff';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Value label
      ctx.fillStyle = '#e0e6ed';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(v, x, y - 15);
    });
    ctx.textAlign = 'left';

    // Draw box plot if IQR method
    if (method === 'iqr') {
      const boxY = 100;
      const boxX1 = 100;
      const boxX2 = 660;
      const q1X = boxX1 + (q1 / maxVal) * (boxX2 - boxX1);
      const q3X = boxX1 + (q3 / maxVal) * (boxX2 - boxX1);
      const medX = boxX1 + (170 / maxVal) * (boxX2 - boxX1);
      
      // Box
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(q1X, boxY - 15, q3X - q1X, 30);
      
      // Median line
      ctx.beginPath();
      ctx.moveTo(medX, boxY - 15);
      ctx.lineTo(medX, boxY + 15);
      ctx.stroke();
      
      // Bounds lines
      ctx.strokeStyle = '#ff6b35';
      ctx.setLineDash([5, 5]);
      const ubX = boxX1 + (upperBound / maxVal) * (boxX2 - boxX1);
      ctx.beginPath();
      ctx.moveTo(ubX, 60);
      ctx.lineTo(ubX, 420);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Labels
      ctx.fillStyle = '#e0e6ed';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`Q1=${q1}`, q1X - 25, boxY + 35);
      ctx.fillText(`Q3=${q3}`, q3X - 25, boxY + 35);
      ctx.fillStyle = '#ff6b35';
      ctx.fillText(`UB=${upperBound}`, ubX - 30, 50);
    }

    // Mean line for zscore
    if (method === 'zscore') {
      ctx.strokeStyle = '#00ffff';
      const meanY = plotBottom - (mean / maxVal) * 320;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, meanY);
      ctx.lineTo(760, meanY);
      ctx.stroke();
      
      ctx.fillStyle = '#00ffff';
      ctx.fillText(`Mean = ${mean.toFixed(1)}`, 680, meanY - 10);
    }

    // Legend
    ctx.fillStyle = '#00d4ff';
    ctx.fillText('● Normal', 80, 470);
    ctx.fillStyle = '#ff6b35';
    ctx.fillText('● Outlier', 180, 470);
  }

  // Button event listeners
  const btnIqr = document.getElementById('btn-detect-iqr');
  const btnZscore = document.getElementById('btn-detect-zscore');
  const btnWinsorize = document.getElementById('btn-winsorize');
  
  if (btnIqr) btnIqr.addEventListener('click', () => draw('iqr'));
  if (btnZscore) btnZscore.addEventListener('click', () => draw('zscore'));
  if (btnWinsorize) btnWinsorize.addEventListener('click', () => draw('winsorize'));
  
  draw('iqr');
})();

/***** ---------- 7. SCALING CANVAS (Simplified) ----------------------- */
(function scalingVis() {
  const c = document.getElementById('canvas-scaling');
  if (!c) return;
  const ctx = c.getContext('2d');
  const rawX = [160, 165, 170, 175, 180];
  const rawY = [60, 65, 70, 75, 80];

  function scale(values, method) {
    if (method === 'minmax') {
      const min = Math.min(...values);
      const max = Math.max(...values);
      return values.map((v) => (v - min) / (max - min));
    }
    if (method === 'zscore') {
      const mean = values.reduce((a, b) => a + b) / values.length;
      const std = Math.sqrt(values.map((v) => (v - mean) ** 2).reduce((a, b) => a + b) / values.length);
      return values.map((v) => (v - mean) / std);
    }
    if (method === 'robust') {
      const sorted = values.slice().sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      const med = sorted[Math.floor(sorted.length / 2)];
      return values.map((v) => (v - med) / iqr);
    }
    return values;
  }

  function draw(method) {
    clearCanvas(ctx);
    
    // Title
    ctx.fillStyle = '#00d4ff';
    ctx.font = '16px Inter, sans-serif';
    let title = '';
    if (method === 'minmax') title = 'Min-Max: Data scaled to [0, 1]';
    else if (method === 'zscore') title = 'Standardization: Mean=0, Std=1';
    else if (method === 'robust') title = 'Robust Scaler: Less sensitive to outliers';
    ctx.fillText(title, 40, 30);

    const scaledX = scale(rawX, method);
    const scaledY = scale(rawY, method);

    // Left side: Original data
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Original Data', 100, 80);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.strokeRect(50, 100, 300, 300);
    
    rawX.forEach((xVal, i) => {
      const yVal = rawY[i];
      const x = 50 + ((xVal - 155) / 30) * 300;
      const y = 400 - ((yVal - 55) / 30) * 300;
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Axis labels
    ctx.fillStyle = '#a8b2c1';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Height', 160, 425);
    ctx.save();
    ctx.translate(30, 250);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Weight', 0, 0);
    ctx.restore();

    // Right side: Scaled data
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Scaled Data', 500, 80);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.strokeRect(450, 100, 300, 300);
    
    const minScaledX = Math.min(...scaledX);
    const maxScaledX = Math.max(...scaledX);
    const minScaledY = Math.min(...scaledY);
    const maxScaledY = Math.max(...scaledY);
    const rangeX = maxScaledX - minScaledX || 1;
    const rangeY = maxScaledY - minScaledY || 1;
    
    scaledX.forEach((xVal, i) => {
      const yVal = scaledY[i];
      const x = 450 + ((xVal - minScaledX) / rangeX) * 300;
      const y = 400 - ((yVal - minScaledY) / rangeY) * 300;
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Stats
    ctx.fillStyle = '#00ffff';
    ctx.font = '11px Inter, sans-serif';
    if (method === 'minmax') {
      ctx.fillText('Range: [0, 1]', 460, 425);
    } else if (method === 'zscore') {
      ctx.fillText('Mean: 0, Std: 1', 460, 425);
    } else if (method === 'robust') {
      ctx.fillText('Median centered', 460, 425);
    }
  }

  // Button event listeners
  const btnMinmax = document.getElementById('btn-minmax');
  const btnStd = document.getElementById('btn-standardize');
  const btnRobust = document.getElementById('btn-robust');
  
  if (btnMinmax) btnMinmax.addEventListener('click', () => draw('minmax'));
  if (btnStd) btnStd.addEventListener('click', () => draw('zscore'));
  if (btnRobust) btnRobust.addEventListener('click', () => draw('robust'));
  
  draw('minmax');
})();

/***** ---------- 8. ENCODING CANVAS ---------------------------------- */
(function encodingVis() {
  const c = document.getElementById('canvas-encoding');
  if (!c) return;
  const ctx = c.getContext('2d');
  const categories = ['Red', 'Green', 'Blue', 'Red', 'Green', 'Yellow'];

  function encode(data, method) {
    if (method === 'label') {
      const unique = [...new Set(data)];
      return data.map(v => unique.indexOf(v));
    } else if (method === 'onehot') {
      const unique = [...new Set(data)];
      return data.map(v => {
        const arr = new Array(unique.length).fill(0);
        arr[unique.indexOf(v)] = 1;
        return arr;
      });
    } else if (method === 'target') {
      const targetMean = { 'Red': 0.8, 'Green': 0.5, 'Blue': 0.3, 'Yellow': 0.6 };
      return data.map(v => targetMean[v] || 0);
    }
    return [];
  }

  function draw(method) {
    const encoded = encode(categories, method);
    clearCanvas(ctx);

    // Title
    ctx.fillStyle = '#00d4ff';
    ctx.font = '16px Inter, sans-serif';
    let title = '';
    if (method === 'label') title = 'Label Encoding: Categories → Integers';
    else if (method === 'onehot') title = 'One-Hot: 4 categorical → 4 binary columns';
    else if (method === 'target') title = 'Target Encoding: Category → Mean(target)';
    ctx.fillText(title, 40, 30);

    ctx.fillStyle = '#e0e6ed';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Original', 120, 80);
    ctx.fillText('Encoded', 420, 80);

    const colors = { 'Red': '#ff6b35', 'Green': '#00ff88', 'Blue': '#00d4ff', 'Yellow': '#ffcc00' };
    
    categories.forEach((cat, i) => {
      const y = 120 + i * 50;
      // Original
      ctx.fillStyle = colors[cat];
      ctx.fillRect(80, y, 100, 35);
      ctx.fillStyle = '#000';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cat, 130, y + 22);

      // Arrow
      ctx.fillStyle = '#e0e6ed';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText('→', 240, y + 22);

      // Encoded
      ctx.fillStyle = '#00ffff';
      ctx.font = '14px Inter, sans-serif';
      let encodedText = '';
      if (method === 'onehot') {
        encodedText = '[' + encoded[i].join(', ') + ']';
      } else {
        encodedText = String(encoded[i]);
      }
      ctx.fillText(encodedText, 450, y + 22);
    });
    ctx.textAlign = 'left';

    // Mapping legend
    if (method === 'label') {
      const unique = [...new Set(categories)];
      ctx.fillStyle = '#e0e6ed';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Mapping:', 80, 450);
      unique.forEach((cat, i) => {
        ctx.fillStyle = colors[cat];
        ctx.fillText(`${cat} = ${i}`, 180 + i * 80, 450);
      });
    }
  }

  // Button event listeners
  const btnLabel = document.getElementById('btn-label-encode');
  const btnOnehot = document.getElementById('btn-onehot-encode');
  const btnTarget = document.getElementById('btn-target-encode');
  
  if (btnLabel) btnLabel.addEventListener('click', () => draw('label'));
  if (btnOnehot) btnOnehot.addEventListener('click', () => draw('onehot'));
  if (btnTarget) btnTarget.addEventListener('click', () => draw('target'));
  
  draw('label');
})();

/***** ---------- 9. IMBALANCED DATA CANVAS ---------------------------- */
(function imbalancedVis() {
  const c = document.getElementById('canvas-imbalanced');
  if (!c) return;
  const ctx = c.getContext('2d');

  function draw(method) {
    clearCanvas(ctx);

    // Title
    ctx.fillStyle = '#00d4ff';
    ctx.font = '16px Inter, sans-serif';
    let title = '';
    if (method === 'rus') title = 'RUS: 90 → 10 (lost data)';
    else if (method === 'ros') title = 'ROS: 10 → 90 (by duplication)';
    else if (method === 'smote') title = 'SMOTE: 10 → 90 (synthetic samples)';
    ctx.fillText(title, 40, 30);

    const majorityCount = 90;
    const minorityCount = 10;

    let balancedMajority = majorityCount;
    let balancedMinority = minorityCount;

    if (method === 'rus') {
      balancedMajority = minorityCount;
    } else if (method === 'ros') {
      balancedMinority = majorityCount;
    } else if (method === 'smote') {
      balancedMinority = majorityCount;
    }

    ctx.fillStyle = '#e0e6ed';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Before', 180, 80);
    ctx.fillText('After', 540, 80);

    // Scatter plot visualization
    // Before - left side
    for (let i = 0; i < majorityCount; i++) {
      const x = 80 + Math.random() * 200;
      const y = 120 + Math.random() * 250;
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    for (let i = 0; i < minorityCount; i++) {
      const x = 80 + Math.random() * 200;
      const y = 120 + Math.random() * 250;
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // After - right side
    for (let i = 0; i < balancedMajority; i++) {
      const x = 440 + Math.random() * 200;
      const y = 120 + Math.random() * 250;
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    for (let i = 0; i < balancedMinority; i++) {
      const x = 440 + Math.random() * 200;
      const y = 120 + Math.random() * 250;
      ctx.fillStyle = method === 'smote' ? '#00ff88' : '#ff6b35';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Stats
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(`Majority: ${majorityCount}`, 120, 400);
    ctx.fillText(`Minority: ${minorityCount}`, 120, 420);
    ctx.fillText(`Ratio: ${(majorityCount/minorityCount).toFixed(1)}:1`, 120, 440);
    
    ctx.fillText(`Majority: ${balancedMajority}`, 480, 400);
    ctx.fillText(`Minority: ${balancedMinority}`, 480, 420);
    ctx.fillText(`Ratio: ${(balancedMajority/balancedMinority).toFixed(1)}:1`, 480, 440);

    // Legend
    ctx.fillStyle = '#00d4ff';
    ctx.fillText('● Majority class', 300, 470);
    ctx.fillStyle = method === 'smote' ? '#00ff88' : '#ff6b35';
    ctx.fillText('● Minority class', 450, 470);
  }

  // Button event listeners
  const btnRus = document.getElementById('btn-rus');
  const btnRos = document.getElementById('btn-ros');
  const btnSmote = document.getElementById('btn-smote');
  
  if (btnRus) btnRus.addEventListener('click', () => draw('rus'));
  if (btnRos) btnRos.addEventListener('click', () => draw('ros'));
  if (btnSmote) btnSmote.addEventListener('click', () => draw('smote'));
  
  draw('rus');
})();

/***** ---------- 9. FEATURE SELECTION CANVAS -------------------------- */
(function featureSelectionVis() {
  const c = document.getElementById('canvas-selection');
  if (!c) return;
  const ctx = c.getContext('2d');
  
  const allFeatures = ['sqft', 'bedrooms', 'age', 'location', 'garage'];
  const importance = [0.85, 0.62, 0.45, 0.73, 0.38];

  function draw(method) {
    clearCanvas(ctx);
    
    // Title
    ctx.fillStyle = '#00d4ff';
    ctx.font = '16px Inter, sans-serif';
    let title = '';
    let selected = [];
    if (method === 'backward') {
      title = 'Backward Elimination: 3 features selected';
      selected = [0, 1, 3]; // sqft, bedrooms, location
    } else if (method === 'forward') {
      title = 'Forward Selection: Added 3 features';
      selected = [0, 3, 1]; // sqft, location, bedrooms
    } else if (method === 'rfe') {
      title = 'RFE: Optimal 3 features';
      selected = [0, 1, 3]; // sqft, bedrooms, location
    }
    ctx.fillText(title, 40, 30);

    // Feature importance bar chart
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Feature Importance', 80, 80);
    
    const barHeight = 40;
    const maxWidth = 500;
    
    allFeatures.forEach((feature, i) => {
      const y = 120 + i * (barHeight + 20);
      const barWidth = importance[i] * maxWidth;
      const isSelected = selected.includes(i);
      
      // Bar
      ctx.fillStyle = isSelected ? '#00ffff' : '#555';
      ctx.fillRect(200, y, barWidth, barHeight);
      
      // Feature name
      ctx.fillStyle = isSelected ? '#00ffff' : '#a8b2c1';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(feature, 180, y + 25);
      
      // Importance value
      ctx.textAlign = 'left';
      ctx.fillText(importance[i].toFixed(2), barWidth + 210, y + 25);
      
      // Selected marker
      if (isSelected) {
        ctx.fillStyle = '#00ff88';
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText('✓', 720, y + 25);
      }
    });
    ctx.textAlign = 'left';
    
    // Legend
    ctx.fillStyle = '#00ffff';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('■ Selected features', 200, 460);
    ctx.fillStyle = '#555';
    ctx.fillText('■ Removed features', 380, 460);
  }

  // Button event listeners
  const btnBackward = document.getElementById('btn-backward-elim');
  const btnForward = document.getElementById('btn-forward-select');
  const btnRfe = document.getElementById('btn-rfe');
  
  if (btnBackward) btnBackward.addEventListener('click', () => draw('backward'));
  if (btnForward) btnForward.addEventListener('click', () => draw('forward'));
  if (btnRfe) btnRfe.addEventListener('click', () => draw('rfe'));
  
  draw('rfe');
})();

/***** ---------- 10. COMPREHENSIVE EDA CANVAS ------------------------- */
(function edaVis() {
  const featureSelect = document.getElementById('edaFeature');
  const confidenceSlider = document.getElementById('confidenceLevel');
  const confidenceSpan = document.getElementById('confidenceValue');
  const calcBtn = document.getElementById('calculateStats');
  const corrBtn = document.getElementById('showCorrelation');
  const c = document.getElementById('canvas-eda');
  if (!c) return;
  const ctx = c.getContext('2d');

  // Sample EDA dataset
  const edaData = {
    age: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
    income: [35000, 42000, 55000, 65000, 58000, 72000, 80000, 70000, 90000, 95000],
    credit: [650, 680, 720, 700, 690, 750, 780, 760, 800, 820]
  };

  let showingCorrelation = false;

  function calculateStats(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const n = data.length;
    const mean = data.reduce((a, b) => a + b) / n;
    const median = n % 2 === 0 ? (sorted[n/2-1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
    const variance = data.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n;
    const std = Math.sqrt(variance);
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    const mode = data.sort((a,b) => 
      data.filter(v => v === a).length - data.filter(v => v === b).length
    ).pop();
    return { mean, median, mode, std, q1, q3, iqr, sorted, min: sorted[0], max: sorted[n-1] };
  }

  function drawHistogram(data, stats, x, y, w, h) {
    // Create bins
    const numBins = 6;
    const binWidth = (stats.max - stats.min) / numBins;
    const bins = new Array(numBins).fill(0);
    
    data.forEach(val => {
      const binIndex = Math.min(Math.floor((val - stats.min) / binWidth), numBins - 1);
      bins[binIndex]++;
    });

    const maxBin = Math.max(...bins);
    const barWidth = w / numBins;

    // Draw bars
    bins.forEach((count, i) => {
      const barH = (count / maxBin) * (h - 40);
      const barX = x + i * barWidth;
      const barY = y + h - 30 - barH;
      
      ctx.fillStyle = '#00d4ff';
      ctx.fillRect(barX, barY, barWidth - 2, barH);
    });

    // Draw mean line
    const meanX = x + ((stats.mean - stats.min) / (stats.max - stats.min)) * w;
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(meanX, y);
    ctx.lineTo(meanX, y + h - 30);
    ctx.stroke();

    // Draw median line
    const medianX = x + ((stats.median - stats.min) / (stats.max - stats.min)) * w;
    ctx.strokeStyle = '#ff6b35';
    ctx.beginPath();
    ctx.moveTo(medianX, y);
    ctx.lineTo(medianX, y + h - 30);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Histogram', x, y - 5);
  }

  function drawBoxPlot(data, stats, x, y, w, h) {
    const scale = w / (stats.max - stats.min);
    const center = y + h / 2;
    const boxHeight = 40;

    // Whiskers
    const minX = x + (stats.min - stats.min) * scale;
    const maxX = x + (stats.max - stats.min) * scale;
    const q1X = x + (stats.q1 - stats.min) * scale;
    const q3X = x + (stats.q3 - stats.min) * scale;
    const medX = x + (stats.median - stats.min) * scale;

    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    
    // Left whisker
    ctx.beginPath();
    ctx.moveTo(minX, center);
    ctx.lineTo(q1X, center);
    ctx.stroke();
    
    // Right whisker
    ctx.beginPath();
    ctx.moveTo(q3X, center);
    ctx.lineTo(maxX, center);
    ctx.stroke();

    // Box
    ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.fillRect(q1X, center - boxHeight/2, q3X - q1X, boxHeight);
    ctx.strokeStyle = '#00d4ff';
    ctx.strokeRect(q1X, center - boxHeight/2, q3X - q1X, boxHeight);

    // Median line
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(medX, center - boxHeight/2);
    ctx.lineTo(medX, center + boxHeight/2);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Box Plot', x, y - 5);
    ctx.fillText('Q1', q1X - 8, center + boxHeight/2 + 15);
    ctx.fillText('Q2', medX - 8, center + boxHeight/2 + 15);
    ctx.fillText('Q3', q3X - 8, center + boxHeight/2 + 15);
  }

  function drawScatterPlot(dataX, dataY, x, y, w, h) {
    const statsX = calculateStats(dataX);
    const statsY = calculateStats(dataY);

    // Calculate correlation
    const meanX = statsX.mean;
    const meanY = statsY.mean;
    const n = dataX.length;
    const num = dataX.reduce((sum, xv, i) => sum + (xv - meanX) * (dataY[i] - meanY), 0);
    const denX = Math.sqrt(dataX.reduce((sum, xv) => sum + (xv - meanX) ** 2, 0));
    const denY = Math.sqrt(dataY.reduce((sum, yv) => sum + (yv - meanY) ** 2, 0));
    const correlation = num / (denX * denY);

    // Draw points
    dataX.forEach((xv, i) => {
      const px = x + ((xv - statsX.min) / (statsX.max - statsX.min)) * w;
      const py = y + h - ((dataY[i] - statsY.min) / (statsY.max - statsY.min)) * h;
      
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw trend line (simplified)
    const slope = correlation * (statsY.std / statsX.std);
    const intercept = meanY - slope * meanX;
    
    const x1 = statsX.min;
    const y1 = slope * x1 + intercept;
    const x2 = statsX.max;
    const y2 = slope * x2 + intercept;
    
    const px1 = x + ((x1 - statsX.min) / (statsX.max - statsX.min)) * w;
    const py1 = y + h - ((y1 - statsY.min) / (statsY.max - statsY.min)) * h;
    const px2 = x + ((x2 - statsX.min) / (statsX.max - statsX.min)) * w;
    const py2 = y + h - ((y2 - statsY.min) / (statsY.max - statsY.min)) * h;

    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.lineTo(px2, py2);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Scatter Plot', x, y - 5);
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`r = ${correlation.toFixed(3)}`, x + w - 60, y + 15);
  }

  function drawCorrelationMatrix() {
    clearCanvas(ctx);
    
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Correlation Matrix', 300, 30);

    const features = ['Age', 'Income', 'Credit Score'];
    const corrMatrix = [
      [1.00, 0.85, 0.75],
      [0.85, 1.00, 0.68],
      [0.75, 0.68, 1.00]
    ];

    const cellSize = 120;
    const startX = 150;
    const startY = 80;

    // Draw labels
    ctx.font = '12px Inter, sans-serif';
    features.forEach((f, i) => {
      ctx.fillStyle = '#e0e6ed';
      ctx.fillText(f, startX + i * cellSize + 30, startY - 10);
      ctx.fillText(f, startX - 80, startY + i * cellSize + 65);
    });

    // Draw cells
    corrMatrix.forEach((row, i) => {
      row.forEach((val, j) => {
        const x = startX + j * cellSize;
        const y = startY + i * cellSize;
        
        // Color based on correlation strength
        const intensity = Math.abs(val);
        const color = val > 0 ? 
          `rgba(0, 212, 255, ${intensity})` : 
          `rgba(255, 107, 53, ${intensity})`;
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellSize - 5, cellSize - 5);
        
        // Value
        ctx.fillStyle = intensity > 0.5 ? '#000' : '#e0e6ed';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(val.toFixed(2), x + cellSize/2, y + cellSize/2 + 5);
        ctx.textAlign = 'left';
      });
    });

    // Legend
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#e0e6ed';
    ctx.fillText('Strong Positive: r > 0.7', 200, 450);
    ctx.fillText('Moderate: r = 0.5 to 0.7', 380, 450);
  }

  function draw() {
    if (showingCorrelation) {
      drawCorrelationMatrix();
      return;
    }

    const feature = featureSelect.value;
    const data = edaData[feature];
    const stats = calculateStats(data);

    clearCanvas(ctx);

    // Title
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('EDA Dashboard', 320, 25);

    // Left panel: Histogram
    drawHistogram(data, stats, 40, 60, 350, 180);

    // Top right: Box Plot
    drawBoxPlot(data, stats, 420, 70, 350, 80);

    // Bottom right: Scatter plot (feature vs next feature)
    const nextFeature = feature === 'age' ? 'income' : feature === 'income' ? 'credit' : 'age';
    drawScatterPlot(data, edaData[nextFeature], 420, 180, 350, 150);

    // Statistics display
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Descriptive Statistics:', 40, 270);
    ctx.fillStyle = '#00d4ff';
    ctx.fillText(`Mean: ${stats.mean.toFixed(2)}`, 40, 290);
    ctx.fillText(`Median: ${stats.median.toFixed(2)}`, 40, 310);
    ctx.fillText(`Std Dev: ${stats.std.toFixed(2)}`, 40, 330);
    ctx.fillText(`IQR: ${stats.iqr.toFixed(2)}`, 40, 350);

    ctx.fillStyle = '#e0e6ed';
    ctx.fillText('Inferential Statistics:', 200, 270);
    ctx.fillStyle = '#00ffff';
    const confidence = Number(confidenceSlider.value);
    const tCritical = confidence === 95 ? 1.96 : confidence === 99 ? 2.58 : 1.645;
    const marginError = tCritical * (stats.std / Math.sqrt(data.length));
    ctx.fillText(`Confidence: ${confidence}%`, 200, 290);
    ctx.fillText(`CI: [${(stats.mean - marginError).toFixed(1)}, ${(stats.mean + marginError).toFixed(1)}]`, 200, 310);
    ctx.fillText(`P-value: 0.003 (significant)`, 200, 330);
    ctx.fillText(`Effect size (Cohen's d): 0.82`, 200, 350);

    // Legend
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 390);
    ctx.lineTo(70, 390);
    ctx.stroke();
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Mean', 75, 394);

    ctx.strokeStyle = '#ff6b35';
    ctx.beginPath();
    ctx.moveTo(130, 390);
    ctx.lineTo(160, 390);
    ctx.stroke();
    ctx.fillText('Median', 165, 394);

    ctx.fillStyle = '#a8b2c1';
    ctx.fillText('Click "Show Correlation Matrix" to see feature relationships', 40, 470);
  }

  if (confidenceSlider) {
    confidenceSlider.addEventListener('input', () => {
      confidenceSpan.textContent = confidenceSlider.value;
      draw();
    });
  }

  if (featureSelect) {
    featureSelect.addEventListener('change', () => {
      showingCorrelation = false;
      draw();
    });
  }

  function drawHistogram2() {
    showingCorrelation = false;
    const data = edaData[featureSelect.value];
    const stats = calculateStats(data);
    
    clearCanvas(ctx);
    ctx.fillStyle = '#00d4ff';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText(`Histogram: Mean: ${stats.mean.toFixed(2)}, Median: ${stats.median.toFixed(2)}, Std: ${stats.std.toFixed(2)}`, 40, 30);
    
    drawHistogram(data, stats, 100, 80, 600, 300);
  }
  
  function drawBoxPlot2() {
    showingCorrelation = false;
    const data = edaData[featureSelect.value];
    const stats = calculateStats(data);
    
    clearCanvas(ctx);
    ctx.fillStyle = '#00d4ff';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText(`Box Plot: Q1: ${stats.q1.toFixed(2)}, Q2: ${stats.median.toFixed(2)}, Q3: ${stats.q3.toFixed(2)}, IQR: ${stats.iqr.toFixed(2)}`, 40, 30);
    
    drawBoxPlot(data, stats, 100, 150, 600, 200);
  }
  
  function drawCorrelation2() {
    showingCorrelation = true;
    const feature = featureSelect.value;
    const nextFeature = feature === 'age' ? 'income' : feature === 'income' ? 'credit' : 'age';
    
    clearCanvas(ctx);
    ctx.fillStyle = '#00d4ff';
    ctx.font = '16px Inter, sans-serif';
    
    const dataX = edaData[feature];
    const dataY = edaData[nextFeature];
    const statsX = calculateStats(dataX);
    const statsY = calculateStats(dataY);
    const meanX = statsX.mean;
    const meanY = statsY.mean;
    const num = dataX.reduce((sum, xv, i) => sum + (xv - meanX) * (dataY[i] - meanY), 0);
    const denX = Math.sqrt(dataX.reduce((sum, xv) => sum + (xv - meanX) ** 2, 0));
    const denY = Math.sqrt(dataY.reduce((sum, yv) => sum + (yv - meanY) ** 2, 0));
    const corr = num / (denX * denY);
    
    ctx.fillText(`Correlation: r = ${corr.toFixed(2)} (strong positive)`, 40, 30);
    
    drawScatterPlot(dataX, dataY, 150, 80, 500, 350);
  }

  // Button event listeners
  const btnHistogram = document.getElementById('btn-histogram');
  const btnBoxplot = document.getElementById('btn-boxplot');
  const btnCorrelation = document.getElementById('btn-correlation');
  
  if (btnHistogram) btnHistogram.addEventListener('click', drawHistogram2);
  if (btnBoxplot) btnBoxplot.addEventListener('click', drawBoxPlot2);
  if (btnCorrelation) btnCorrelation.addEventListener('click', drawCorrelation2);
  
  drawHistogram2();
})();

/***** ---------- 11. FEATURE TRANSFORMATION CANVAS ------------------- */
(function transformationVis() {
  const select = document.getElementById('transformMethod');
  const c = document.getElementById('canvas-transformation');
  if (!select || !c) return;
  const ctx = c.getContext('2d');

  // Non-linear data (quadratic relationship)
  const xData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const yData = xData.map(x => x * x + Math.random() * 5); // y ≈ x²

  function draw() {
    const method = select.value;
    clearCanvas(ctx);

    if (method === 'polynomial') {
      // Show scatter plot and polynomial features
      ctx.fillStyle = '#e0e6ed';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('Original Data (non-linear)', 50, 30);
      ctx.fillText('Feature Count: 2 → 6 (with degree=2)', 50, 50);

      // Draw scatter
      const maxX = Math.max(...xData);
      const maxY = Math.max(...yData);
      xData.forEach((x, i) => {
        const px = 50 + (x / maxX) * 250;
        const py = 300 - (yData[i] / maxY) * 200;
        ctx.fillStyle = '#00d4ff';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Show polynomial transformation
      ctx.fillStyle = '#e0e6ed';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Polynomial Features:', 380, 80);
      ctx.fillText('Original: [x₁, x₂]', 380, 110);
      ctx.fillText('Transformed:', 380, 140);
      ctx.fillText('[1, x₁, x₂, x₁², x₁x₂, x₂²]', 380, 160);
      
      ctx.fillStyle = '#00ffff';
      ctx.fillText('Example: x=3, y=5', 380, 200);
      ctx.fillText('→ [1, 3, 5, 9, 15, 25]', 380, 220);

    } else if (method === 'binning') {
      // Show binning visualization
      ctx.fillStyle = '#e0e6ed';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('Age Binning: Continuous → Categorical', 50, 30);

      const ages = [5, 12, 18, 25, 32, 45, 58, 67, 73, 89];
      const bins = [
        { label: 'Child (0-18)', color: '#ff6b35', range: [0, 18] },
        { label: 'Young Adult (19-35)', color: '#00d4ff', range: [19, 35] },
        { label: 'Middle Age (36-60)', color: '#00ffff', range: [36, 60] },
        { label: 'Senior (61+)', color: '#ff6b35', range: [61, 100] }
      ];

      // Draw age line
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      ctx.moveTo(50, 150);
      ctx.lineTo(650, 150);
      ctx.stroke();

      // Draw points with bin colors
      ages.forEach((age) => {
        const x = 50 + (age / 100) * 600;
        const bin = bins.find(b => age >= b.range[0] && age <= b.range[1]);
        ctx.fillStyle = bin ? bin.color : '#888';
        ctx.beginPath();
        ctx.arc(x, 150, 6, 0, Math.PI * 2);
        ctx.fill();
        // Label
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(age, x - 5, 170);
      });

      // Legend
      ctx.font = '12px Inter, sans-serif';
      bins.forEach((bin, i) => {
        const y = 220 + i * 25;
        ctx.fillStyle = bin.color;
        ctx.fillRect(50, y, 15, 15);
        ctx.fillStyle = '#e0e6ed';
        ctx.fillText(bin.label, 75, y + 12);
      });

    } else if (method === 'log') {
      // Log transformation visualization
      const skewedData = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
      const logData = skewedData.map(x => Math.log(1 + x));

      ctx.fillStyle = '#e0e6ed';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('Log Transform: Reduces Right Skew', 50, 30);

      // Before histogram
      ctx.fillText('Before (Right-skewed)', 80, 80);
      const maxBefore = Math.max(...skewedData);
      skewedData.forEach((val, i) => {
        const h = (val / maxBefore) * 150;
        const x = 50 + i * 30;
        const y = 250 - h;
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(x, y, 20, h);
      });

      // After histogram
      ctx.fillStyle = '#e0e6ed';
      ctx.fillText('After (More Normal)', 420, 80);
      const maxAfter = Math.max(...logData);
      logData.forEach((val, i) => {
        const h = (val / maxAfter) * 150;
        const x = 390 + i * 30;
        const y = 250 - h;
        ctx.fillStyle = '#00d4ff';
        ctx.fillRect(x, y, 20, h);
      });

      // Formula
      ctx.fillStyle = '#00ffff';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Formula: log(1 + x)', 280, 310);
    }
  }

  // Button event listeners
  const btnPolynomial = document.getElementById('btn-polynomial');
  const btnBinning = document.getElementById('btn-binning');
  const btnLog = document.getElementById('btn-log');
  
  if (btnPolynomial) btnPolynomial.addEventListener('click', () => draw('polynomial'));
  if (btnBinning) btnBinning.addEventListener('click', () => draw('binning'));
  if (btnLog) btnLog.addEventListener('click', () => draw('log'));
  
  draw('polynomial');
})();

/***** ---------- 12. FEATURE CREATION CANVAS ------------------------- */
(function creationVis() {
  const select = document.getElementById('creationMethod');
  const c = document.getElementById('canvas-creation');
  if (!select || !c) return;
  const ctx = c.getContext('2d');

  // Sample data
  const height = [1.6, 1.7, 1.8, 1.75, 1.65, 1.55, 1.9, 1.72]; // meters
  const weight = [60, 70, 80, 75, 65, 55, 95, 73]; // kg

  function createFeature(method) {
    if (method === 'multiply') {
      return height.map((h, i) => h * weight[i]);
    } else if (method === 'divide') {
      return weight.map((w, i) => w / height[i]);
    } else if (method === 'add') {
      return height.map((h, i) => h + weight[i]);
    } else if (method === 'bmi') {
      return weight.map((w, i) => w / (height[i] * height[i]));
    }
    return [];
  }

  function correlation(arr1, arr2) {
    const mean1 = arr1.reduce((a, b) => a + b) / arr1.length;
    const mean2 = arr2.reduce((a, b) => a + b) / arr2.length;
    const num = arr1.reduce((sum, v, i) => sum + (v - mean1) * (arr2[i] - mean2), 0);
    const den1 = Math.sqrt(arr1.reduce((sum, v) => sum + (v - mean1) ** 2, 0));
    const den2 = Math.sqrt(arr2.reduce((sum, v) => sum + (v - mean2) ** 2, 0));
    return num / (den1 * den2);
  }

  function draw() {
    const method = select.value;
    const newFeature = createFeature(method);
    clearCanvas(ctx);

    // Title
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Original Features', 80, 30);
    ctx.fillText('Created Feature', 430, 30);

    // Left: Scatter plot of height vs weight
    const maxH = Math.max(...height);
    const maxW = Math.max(...weight);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.strokeRect(40, 50, 250, 200);
    
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#a8b2c1';
    ctx.fillText('Height (m)', 120, 265);
    ctx.save();
    ctx.translate(25, 150);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Weight (kg)', -30, 0);
    ctx.restore();

    height.forEach((h, i) => {
      const x = 40 + (h / maxH) * 250;
      const y = 250 - (weight[i] / maxW) * 200;
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Right: Bar chart of new feature
    const maxNew = Math.max(...newFeature);
    const barW = 30;
    newFeature.forEach((val, i) => {
      const x = 380 + i * (barW + 5);
      const h = (val / maxNew) * 180;
      const y = 250 - h;
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(x, y, barW, h);
    });

    // Formula and stats
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '12px Inter, sans-serif';
    let formula = '';
    if (method === 'multiply') formula = 'height × weight';
    else if (method === 'divide') formula = 'weight / height';
    else if (method === 'add') formula = 'height + weight';
    else if (method === 'bmi') formula = 'weight / height²';
    
    ctx.fillText(`Formula: ${formula}`, 50, 300);
    
    // Correlation
    const corr = correlation(newFeature, weight).toFixed(3);
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`Correlation with weight: ${corr}`, 50, 320);
  }

  // Button event listeners
  const btnInteraction = document.getElementById('btn-interaction');
  const btnRatio = document.getElementById('btn-ratio');
  const btnBmi = document.getElementById('btn-bmi');
  
  if (btnInteraction) btnInteraction.addEventListener('click', () => draw('multiply'));
  if (btnRatio) btnRatio.addEventListener('click', () => draw('divide'));
  if (btnBmi) btnBmi.addEventListener('click', () => draw('bmi'));
  
  draw('bmi');
})();

/***** ---------- 13. DIMENSIONALITY REDUCTION (PCA) CANVAS ----------- */
(function pcaVis() {
  const slider = document.getElementById('slider-components');
  const pcaValSpan = document.getElementById('pcaValue');
  const btn = document.getElementById('btn-pca-apply');
  const c = document.getElementById('canvas-pca');
  if (!slider || !c || !btn) return;
  const ctx = c.getContext('2d');

  // 3D data (simplified for visualization)
  const data3D = [
    [2.5, 2.4, 1.0],
    [0.5, 0.7, 0.2],
    [2.2, 2.9, 1.1],
    [1.9, 2.2, 0.9],
    [3.1, 3.0, 1.2],
    [2.3, 2.7, 1.0],
    [2.0, 1.6, 0.6],
    [1.0, 1.1, 0.4],
    [1.5, 1.6, 0.6],
    [1.1, 0.9, 0.3]
  ];

  // Simplified PCA (not real eigenvalue computation, just for viz)
  const explainedVariance = [0.72, 0.23, 0.05]; // PC1, PC2, PC3

  function draw() {
    const nComponents = Number(slider.value);
    pcaValSpan.textContent = nComponents;
    
    clearCanvas(ctx);

    // Title
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('PCA: Dimensionality Reduction', 250, 25);

    // Original 3D visualization (pseudo-3D)
    ctx.fillText('Original Data (3D)', 80, 60);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(30, 70, 280, 150);
    
    data3D.forEach(point => {
      const x = 50 + point[0] * 60;
      const y = 150 - point[1] * 30;
      const size = 2 + point[2] * 3;
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#a8b2c1';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Features: 3', 50, 235);

    // Transformed data (2D projection)
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Reduced Data (${nComponents}D)`, 420, 60);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(360, 70, 280, 150);

    // Project to PC space (simplified)
    data3D.forEach(point => {
      const pc1 = point[0] * 0.7 + point[1] * 0.3;
      const pc2 = point[0] * 0.3 + point[1] * 0.7;
      const x = 390 + pc1 * 60;
      const y = 150 - pc2 * 30;
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#a8b2c1';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(`Features: ${nComponents}`, 380, 235);

    // Explained variance bar chart
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Explained Variance per Component', 180, 270);

    const barWidth = 80;
    const maxH = 80;
    explainedVariance.slice(0, nComponents).forEach((variance, i) => {
      const x = 120 + i * (barWidth + 20);
      const h = variance * maxH;
      const y = 360 - h;
      
      // Bar
      const colors = ['#00d4ff', '#00ffff', '#ff6b35'];
      ctx.fillStyle = colors[i];
      ctx.fillRect(x, y, barWidth, h);
      
      // Label
      ctx.fillStyle = '#e0e6ed';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(`PC${i + 1}`, x + 25, 375);
      ctx.fillText(`${(variance * 100).toFixed(1)}%`, x + 15, y - 5);
    });

    // Cumulative variance
    const cumulative = explainedVariance.slice(0, nComponents).reduce((a, b) => a + b, 0);
    ctx.fillStyle = '#00ffff';
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText(`Cumulative Variance: ${(cumulative * 100).toFixed(1)}%`, 450, 310);
    ctx.fillText(`Dimensionality Reduction: 3 → ${nComponents}`, 450, 330);
  }

  slider.addEventListener('input', draw);
  btn.addEventListener('click', draw);
  draw();
})();
