/**
 * Data Visualization Masterclass - Interactive Canvas Visualizations
 * Demonstrates core visualization concepts through live examples
 */

(function() {
  'use strict';

  // Utility functions
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);
  
  // Color palette
  const COLORS = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    blue: '#3b82f6',
    orange: '#f97316',
    pink: '#ec4899',
    gray: '#6b7280',
    dark: '#1f2937',
    light: '#f3f4f6'
  };

  // ==================== ANSCOMBE'S QUARTET ====================
  function drawAnscombe() {
    const canvas = $('canvas-anscombe');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Anscombe's Quartet data
    const datasets = [
      { x: [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5], y: [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68] },
      { x: [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5], y: [9.14, 8.14, 8.74, 8.77, 9.26, 8.10, 6.13, 3.10, 9.13, 7.26, 4.74] },
      { x: [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5], y: [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73] },
      { x: [8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8], y: [6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.50, 5.56, 7.91, 6.89] }
    ];

    const titles = ['Dataset I', 'Dataset II', 'Dataset III', 'Dataset IV'];
    const panelWidth = canvas.width / 2 - 20;
    const panelHeight = canvas.height / 2 - 30;

    datasets.forEach((data, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const offsetX = col * (panelWidth + 20) + 40;
      const offsetY = row * (panelHeight + 40) + 30;

      // Draw axes
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + panelHeight - 20);
      ctx.lineTo(offsetX + panelWidth - 40, offsetY + panelHeight - 20);
      ctx.moveTo(offsetX, offsetY + panelHeight - 20);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();

      // Draw title
      ctx.fillStyle = COLORS.primary;
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(titles[i], offsetX + (panelWidth - 40) / 2, offsetY - 8);

      // Draw points
      const xMin = 2, xMax = 20, yMin = 2, yMax = 14;
      data.x.forEach((x, j) => {
        const px = offsetX + ((x - xMin) / (xMax - xMin)) * (panelWidth - 50);
        const py = offsetY + panelHeight - 25 - ((data.y[j] - yMin) / (yMax - yMin)) * (panelHeight - 40);
        
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success][i];
        ctx.fill();
      });
    });

    // Stats text
    ctx.fillStyle = COLORS.dark;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('All 4 datasets: Mean X = 9, Mean Y = 7.5, Variance = 11, Correlation = 0.816', 40, canvas.height - 10);
  }

  // ==================== VISUAL PERCEPTION ====================
  let perceptionMode = 'position';

  function drawPerception() {
    const canvas = $('canvas-perception');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const data = [45, 78, 32, 91, 56, 67, 23, 82, 41, 65];
    const categories = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    if (perceptionMode === 'position') {
      // Bar chart (position encoding)
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = COLORS.dark;
      ctx.textAlign = 'center';
      ctx.fillText('Position Encoding (Bar Chart) - Most Accurate!', canvas.width / 2, 25);

      const barWidth = 50;
      const startX = 50;
      data.forEach((v, i) => {
        const x = startX + i * (barWidth + 15);
        const height = v * 2.5;
        
        ctx.fillStyle = COLORS.primary;
        ctx.fillRect(x, 280 - height, barWidth, height);
        
        ctx.fillStyle = COLORS.dark;
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(categories[i], x + barWidth / 2, 300);
        ctx.fillText(v, x + barWidth / 2, 275 - height);
      });
    } else if (perceptionMode === 'color') {
      // Color encoding
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = COLORS.dark;
      ctx.textAlign = 'center';
      ctx.fillText('Color Encoding - Good for Categories', canvas.width / 2, 25);

      const squareSize = 60;
      const startX = 50;
      data.forEach((v, i) => {
        const x = startX + i * (squareSize + 10);
        const hue = (v / 100) * 240; // Blue to red gradient
        ctx.fillStyle = `hsl(${240 - hue}, 70%, 50%)`;
        ctx.fillRect(x, 80, squareSize, squareSize);
        
        ctx.fillStyle = COLORS.dark;
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(categories[i], x + squareSize / 2, 165);
        ctx.fillStyle = 'white';
        ctx.fillText(v, x + squareSize / 2, 115);
      });

      // Legend
      ctx.fillStyle = COLORS.dark;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Low', 50, 220);
      ctx.fillText('High', 650, 220);
      
      const gradWidth = 600;
      for (let i = 0; i < gradWidth; i++) {
        const hue = 240 - (i / gradWidth) * 240;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.fillRect(50 + i, 230, 1, 20);
      }
    } else if (perceptionMode === 'size') {
      // Size encoding (bubble)
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = COLORS.dark;
      ctx.textAlign = 'center';
      ctx.fillText('Size Encoding (Bubbles) - Humans Underestimate Area!', canvas.width / 2, 25);

      const startX = 60;
      data.forEach((v, i) => {
        const x = startX + i * 65;
        const radius = Math.sqrt(v) * 3.5;
        
        ctx.beginPath();
        ctx.arc(x, 150, radius, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.accent;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = COLORS.dark;
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(categories[i], x, 230);
        ctx.fillText(v, x, 155);
      });
    }
  }

  // ==================== GRAMMAR OF GRAPHICS ====================
  function drawGrammar() {
    const canvas = $('canvas-grammar');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const components = [
      { name: 'Data', icon: '📊', color: COLORS.primary },
      { name: 'Aesthetics', icon: '🎨', color: COLORS.secondary },
      { name: 'Geometry', icon: '◼️', color: COLORS.accent },
      { name: 'Facets', icon: '🔲', color: COLORS.success },
      { name: 'Statistics', icon: '📈', color: COLORS.warning },
      { name: 'Coordinates', icon: '📐', color: COLORS.danger },
      { name: 'Theme', icon: '🎭', color: COLORS.pink }
    ];

    // Draw connected layers
    const centerX = canvas.width / 2;
    const startY = 60;
    const layerHeight = 45;

    components.forEach((comp, i) => {
      const y = startY + i * layerHeight;
      const width = 180 - i * 10;
      
      // Layer rectangle
      ctx.fillStyle = comp.color;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.roundRect(centerX - width / 2, y, width, 35, 5);
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${comp.icon} ${comp.name}`, centerX, y + 22);
      
      // Connector
      if (i < components.length - 1) {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, y + 35);
        ctx.lineTo(centerX, y + layerHeight);
        ctx.stroke();
      }
    });

    // Right side - example
    ctx.fillStyle = COLORS.dark;
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Example in Python:', 450, 60);

    const code = [
      'ggplot(data=iris,',
      '  aes(x=sepal_length,',
      '      y=sepal_width,',
      '      color=species)) +',
      'geom_point(size=3) +',
      'facet_wrap(~species) +',
      'stat_smooth(method="lm") +',
      'coord_fixed() +',
      'theme_minimal()'
    ];

    ctx.font = '11px monospace';
    ctx.fillStyle = COLORS.gray;
    code.forEach((line, i) => {
      ctx.fillText(line, 450, 85 + i * 18);
    });
  }

  // ==================== CHOOSING CHARTS ====================
  let chartPurpose = 'comparison';

  function drawChoosingCharts() {
    const canvas = $('canvas-choosing');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillStyle = COLORS.dark;
    ctx.textAlign = 'center';

    if (chartPurpose === 'comparison') {
      ctx.fillText('Comparison: Bar Chart / Grouped Bar / Line', canvas.width / 2, 25);
      
      const data = [
        { name: 'Q1', values: [40, 55, 30] },
        { name: 'Q2', values: [65, 45, 50] },
        { name: 'Q3', values: [55, 70, 45] },
        { name: 'Q4', values: [75, 60, 70] }
      ];
      const colors = [COLORS.primary, COLORS.secondary, COLORS.accent];
      const barWidth = 35;
      const groupWidth = barWidth * 3 + 30;
      const startX = 100;

      data.forEach((group, i) => {
        const groupX = startX + i * groupWidth;
        group.values.forEach((v, j) => {
          const x = groupX + j * (barWidth + 5);
          const height = v * 3;
          ctx.fillStyle = colors[j];
          ctx.fillRect(x, 320 - height, barWidth, height);
        });
        ctx.fillStyle = COLORS.dark;
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(group.name, groupX + groupWidth / 2 - 15, 340);
      });

      // Legend
      ['Product A', 'Product B', 'Product C'].forEach((label, i) => {
        ctx.fillStyle = colors[i];
        ctx.fillRect(580, 60 + i * 25, 15, 15);
        ctx.fillStyle = COLORS.dark;
        ctx.textAlign = 'left';
        ctx.fillText(label, 600, 72 + i * 25);
      });
    } else if (chartPurpose === 'composition') {
      ctx.fillText('Composition: Stacked Bar / Pie Chart (use sparingly!)', canvas.width / 2, 25);
      
      // Stacked bar
      const data = [
        { name: '2020', values: [30, 25, 45] },
        { name: '2021', values: [35, 30, 35] },
        { name: '2022', values: [25, 40, 35] },
        { name: '2023', values: [40, 35, 25] }
      ];
      const colors = [COLORS.primary, COLORS.secondary, COLORS.accent];
      const barWidth = 60;
      const startX = 80;

      data.forEach((group, i) => {
        const x = startX + i * (barWidth + 40);
        let y = 320;
        group.values.forEach((v, j) => {
          const height = v * 2.5;
          ctx.fillStyle = colors[j];
          ctx.fillRect(x, y - height, barWidth, height);
          y -= height;
        });
        ctx.fillStyle = COLORS.dark;
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(group.name, x + barWidth / 2, 340);
      });

      // Simple pie
      const pieX = 550, pieY = 180, pieR = 80;
      const pieData = [0.4, 0.35, 0.25];
      let angle = -Math.PI / 2;
      pieData.forEach((v, i) => {
        ctx.beginPath();
        ctx.moveTo(pieX, pieY);
        ctx.arc(pieX, pieY, pieR, angle, angle + v * Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
        angle += v * Math.PI * 2;
      });
    } else if (chartPurpose === 'distribution') {
      ctx.fillText('Distribution: Histogram / Box Plot / Violin', canvas.width / 2, 25);
      
      // Simple histogram
      const bins = [5, 12, 25, 42, 55, 48, 30, 18, 8, 3];
      const barWidth = 50;
      const startX = 80;
      const maxVal = Math.max(...bins);

      bins.forEach((v, i) => {
        const x = startX + i * (barWidth + 8);
        const height = (v / maxVal) * 200;
        ctx.fillStyle = COLORS.primary;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(x, 300 - height, barWidth, height);
        ctx.globalAlpha = 1;
      });

      // Box plot representation
      ctx.fillStyle = COLORS.dark;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('← Histogram shows full distribution', 350, 340);
    } else if (chartPurpose === 'relationship') {
      ctx.fillText('Relationship: Scatter Plot / Bubble / Heatmap', canvas.width / 2, 25);
      
      // Random scatter with trend
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(60, 60 + i * 25);
        ctx.lineTo(700, 60 + i * 25);
        ctx.stroke();
      }

      const points = [];
      for (let i = 0; i < 50; i++) {
        const x = 80 + Math.random() * 580;
        const baseY = 300 - (x - 80) * 0.35;
        const y = baseY + (Math.random() - 0.5) * 80;
        points.push({ x, y, size: 4 + Math.random() * 8 });
      }

      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.accent;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Trend line
      ctx.strokeStyle = COLORS.danger;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(80, 300);
      ctx.lineTo(660, 80);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // ==================== MATPLOTLIB ANATOMY ====================
  function drawAnatomy() {
    const canvas = $('canvas-anatomy');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw figure border
    ctx.strokeStyle = COLORS.primary;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    ctx.setLineDash([]);

    // Label: Figure
    ctx.fillStyle = COLORS.primary;
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Figure (plt.figure())', 40, 25);

    // Draw axes area
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(100, 80, 550, 350);
    ctx.strokeStyle = COLORS.secondary;
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 80, 550, 350);

    // Label: Axes
    ctx.fillStyle = COLORS.secondary;
    ctx.fillText('Axes (ax = fig.add_subplot())', 110, 75);

    // Plot area
    ctx.fillStyle = 'white';
    ctx.fillRect(160, 100, 450, 280);
    ctx.strokeStyle = COLORS.accent;
    ctx.strokeRect(160, 100, 450, 280);

    // Sample line plot
    ctx.beginPath();
    ctx.moveTo(180, 330);
    const points = [[220, 280], [280, 200], [340, 240], [400, 150], [460, 180], [520, 120], [580, 140]];
    points.forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.strokeStyle = COLORS.primary;
    ctx.lineWidth = 3;
    ctx.stroke();

    // X-axis
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(160, 380);
    ctx.lineTo(610, 380);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(160, 100);
    ctx.lineTo(160, 380);
    ctx.stroke();

    // Tick marks
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = COLORS.gray;
    for (let i = 0; i <= 5; i++) {
      const x = 160 + i * 90;
      ctx.beginPath();
      ctx.moveTo(x, 380);
      ctx.lineTo(x, 390);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(i * 20, x, 405);
    }

    for (let i = 0; i <= 4; i++) {
      const y = 100 + i * 70;
      ctx.beginPath();
      ctx.moveTo(150, y);
      ctx.lineTo(160, y);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText((4 - i) * 25, 145, y + 4);
    }

    // Labels with arrows
    const annotations = [
      { x: 680, y: 100, label: 'Title', target: [400, 85] },
      { x: 680, y: 160, label: 'Y-axis Label', target: [130, 240] },
      { x: 680, y: 220, label: 'Line (Artist)', target: [400, 180] },
      { x: 680, y: 280, label: 'X-axis', target: [400, 395] },
      { x: 680, y: 340, label: 'Tick & Label', target: [250, 405] }
    ];

    ctx.font = '11px Inter, sans-serif';
    annotations.forEach(a => {
      ctx.fillStyle = COLORS.dark;
      ctx.textAlign = 'left';
      ctx.fillText(a.label, a.x, a.y);
      
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(a.x - 5, a.y - 4);
      ctx.lineTo(a.target[0], a.target[1]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Title
    ctx.fillStyle = COLORS.dark;
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sample Line Plot', 385, 60);

    // Axis labels
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('X Axis (Time)', 385, 440);
    ctx.save();
    ctx.translate(50, 240);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Y Axis (Value)', 0, 0);
    ctx.restore();
  }

  // ==================== BASIC PLOTS ====================
  let basicPlotType = 'line';

  function drawBasicPlots() {
    const canvas = $('canvas-basic');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = { top: 50, right: 50, bottom: 50, left: 70 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + width, y);
      ctx.stroke();
    }

    if (basicPlotType === 'line') {
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Line Plot: Time Series Data', canvas.width / 2, 25);

      const data = [20, 35, 28, 45, 52, 48, 65, 58, 72, 68, 85, 78];
      const xStep = width / (data.length - 1);

      ctx.beginPath();
      data.forEach((v, i) => {
        const x = margin.left + i * xStep;
        const y = margin.top + height - (v / 100) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = COLORS.primary;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Points
      data.forEach((v, i) => {
        const x = margin.left + i * xStep;
        const y = margin.top + height - (v / 100) * height;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = COLORS.primary;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    } else if (basicPlotType === 'scatter') {
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Scatter Plot: Two Variables Relationship', canvas.width / 2, 25);

      // Generate correlated data
      for (let i = 0; i < 60; i++) {
        const x = margin.left + Math.random() * width;
        const baseY = margin.top + height - ((x - margin.left) / width) * height * 0.7;
        const y = baseY + (Math.random() - 0.5) * 100;
        
        ctx.beginPath();
        ctx.arc(x, Math.max(margin.top, Math.min(margin.top + height, y)), 6, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.accent;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    } else if (basicPlotType === 'bar') {
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Bar Chart: Categorical Comparison', canvas.width / 2, 25);

      const data = [75, 52, 88, 45, 92, 67];
      const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const barWidth = width / data.length - 20;

      data.forEach((v, i) => {
        const x = margin.left + i * (barWidth + 20) + 10;
        const barHeight = (v / 100) * height;
        
        ctx.fillStyle = COLORS.primary;
        ctx.fillRect(x, margin.top + height - barHeight, barWidth, barHeight);
        
        ctx.fillStyle = COLORS.dark;
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(categories[i], x + barWidth / 2, margin.top + height + 20);
        ctx.fillText(v, x + barWidth / 2, margin.top + height - barHeight - 8);
      });
    } else if (basicPlotType === 'hist') {
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Histogram: Distribution of Values', canvas.width / 2, 25);

      // Normal-ish distribution
      const bins = [3, 8, 18, 35, 52, 48, 32, 15, 7, 2];
      const barWidth = width / bins.length - 2;
      const maxVal = Math.max(...bins);

      bins.forEach((v, i) => {
        const x = margin.left + i * (barWidth + 2);
        const barHeight = (v / maxVal) * height;
        
        ctx.fillStyle = COLORS.secondary;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(x, margin.top + height - barHeight, barWidth, barHeight);
        ctx.globalAlpha = 1;
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, margin.top + height - barHeight, barWidth, barHeight);
      });

      // KDE curve
      ctx.beginPath();
      ctx.strokeStyle = COLORS.danger;
      ctx.lineWidth = 2;
      bins.forEach((v, i) => {
        const x = margin.left + i * (barWidth + 2) + barWidth / 2;
        const y = margin.top + height - (v / maxVal) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    } else if (basicPlotType === 'pie') {
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Pie Chart: Part-to-Whole (Use Sparingly!)', canvas.width / 2, 25);

      const data = [35, 25, 20, 12, 8];
      const labels = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Others'];
      const colors = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, COLORS.gray];
      const centerX = canvas.width / 2 - 100;
      const centerY = canvas.height / 2 + 20;
      const radius = 120;

      let angle = -Math.PI / 2;
      data.forEach((v, i) => {
        const sliceAngle = (v / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        const labelAngle = angle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
        ctx.fillStyle = COLORS.dark;
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${labels[i]} (${v}%)`, labelX, labelY);

        angle += sliceAngle;
      });

      // Warning
      ctx.fillStyle = COLORS.warning;
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚠️ Bar charts are usually better!', 550, 300);
    }

    // Y-axis
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + height);
    ctx.lineTo(margin.left + width, margin.top + height);
    ctx.stroke();
  }

  // ==================== SEABORN DISTRIBUTION PLOTS ====================
  let distPlotType = 'histplot';

  function drawDistributions() {
    const canvas = $('canvas-distributions');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = { top: 50, right: 50, bottom: 50, left: 70 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    if (distPlotType === 'histplot') {
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('sns.histplot(data, kde=True)', canvas.width / 2, 25);

      const bins = [2, 5, 12, 22, 38, 45, 42, 35, 20, 10, 5, 2];
      const barWidth = width / bins.length - 4;
      const maxVal = Math.max(...bins);

      bins.forEach((v, i) => {
        const x = margin.left + i * (barWidth + 4);
        const barHeight = (v / maxVal) * height * 0.9;
        
        ctx.fillStyle = COLORS.primary;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(x, margin.top + height - barHeight, barWidth, barHeight);
        ctx.globalAlpha = 1;
      });

      // KDE overlay
      ctx.beginPath();
      ctx.strokeStyle = COLORS.primary;
      ctx.lineWidth = 3;
      bins.forEach((v, i) => {
        const x = margin.left + i * (barWidth + 4) + barWidth / 2;
        const y = margin.top + height - (v / maxVal) * height * 0.9;
        if (i === 0) ctx.moveTo(x, y);
        else {
          const prevX = margin.left + (i - 1) * (barWidth + 4) + barWidth / 2;
          const prevY = margin.top + height - (bins[i - 1] / maxVal) * height * 0.9;
          const cpX = (prevX + x) / 2;
          ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
        }
      });
      ctx.stroke();
    } else if (distPlotType === 'kdeplot') {
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('sns.kdeplot(data, fill=True, multiple="stack")', canvas.width / 2, 25);

      // Draw two overlapping KDEs
      const kde1 = [5, 15, 35, 55, 70, 60, 40, 20, 8, 3];
      const kde2 = [3, 8, 20, 40, 60, 75, 55, 35, 15, 5];
      const maxVal = Math.max(...kde1, ...kde2);
      const stepWidth = width / (kde1.length - 1);

      // Draw KDE 1
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top + height);
      kde1.forEach((v, i) => {
        const x = margin.left + i * stepWidth;
        const y = margin.top + height - (v / maxVal) * height * 0.8;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(margin.left + width, margin.top + height);
      ctx.fillStyle = COLORS.primary;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw KDE 2
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top + height);
      kde2.forEach((v, i) => {
        const x = margin.left + i * stepWidth;
        const y = margin.top + height - (v / maxVal) * height * 0.8;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(margin.left + width, margin.top + height);
      ctx.fillStyle = COLORS.secondary;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Legend
      ctx.fillStyle = COLORS.primary;
      ctx.fillRect(620, 60, 20, 12);
      ctx.fillStyle = COLORS.secondary;
      ctx.fillRect(620, 80, 20, 12);
      ctx.fillStyle = COLORS.dark;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Group A', 645, 70);
      ctx.fillText('Group B', 645, 90);
    } else if (distPlotType === 'ecdfplot') {
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('sns.ecdfplot(data) - Empirical CDF', canvas.width / 2, 25);

      // S-curve
      ctx.beginPath();
      ctx.strokeStyle = COLORS.primary;
      ctx.lineWidth = 3;
      for (let i = 0; i <= 100; i++) {
        const x = margin.left + (i / 100) * width;
        // Sigmoid-like curve
        const t = (i - 50) / 15;
        const y = margin.top + height - (1 / (1 + Math.exp(-t))) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Labels
      ctx.fillStyle = COLORS.gray;
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('1.0', margin.left - 10, margin.top + 5);
      ctx.fillText('0.5', margin.left - 10, margin.top + height / 2);
      ctx.fillText('0.0', margin.left - 10, margin.top + height);
    } else if (distPlotType === 'rugplot') {
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('sns.rugplot(data) - Shows Individual Data Points', canvas.width / 2, 25);

      // KDE
      const kde = [5, 15, 35, 55, 70, 75, 60, 40, 20, 8, 3];
      const maxVal = Math.max(...kde);
      const stepWidth = width / (kde.length - 1);

      ctx.beginPath();
      ctx.fillStyle = COLORS.primary;
      ctx.globalAlpha = 0.3;
      ctx.moveTo(margin.left, margin.top + height - 40);
      kde.forEach((v, i) => {
        const x = margin.left + i * stepWidth;
        const y = margin.top + height - 40 - (v / maxVal) * (height - 60);
        ctx.lineTo(x, y);
      });
      ctx.lineTo(margin.left + width, margin.top + height - 40);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Rug plot (vertical lines at bottom)
      ctx.strokeStyle = COLORS.primary;
      ctx.lineWidth = 1;
      for (let i = 0; i < 80; i++) {
        // Cluster around center
        const x = margin.left + width / 2 + (Math.random() - 0.5) * width * 0.8 * (1 - Math.abs((Math.random() - 0.5) * 1.5));
        ctx.beginPath();
        ctx.moveTo(x, margin.top + height - 35);
        ctx.lineTo(x, margin.top + height);
        ctx.stroke();
      }

      ctx.fillStyle = COLORS.gray;
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Each line = one data point', canvas.width / 2, margin.top + height + 25);
    }

    // Axes
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + height);
    ctx.lineTo(margin.left + width, margin.top + height);
    ctx.stroke();
  }

  // ==================== HEATMAPS ====================
  let heatmapType = 'basic';

  function drawHeatmaps() {
    const canvas = $('canvas-heatmaps');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (heatmapType === 'basic' || heatmapType === 'corr') {
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(heatmapType === 'basic' ? 'sns.heatmap(data, annot=True)' : 'Correlation Matrix (mask upper triangle)', canvas.width / 2, 25);

      const size = 6;
      const cellSize = 60;
      const startX = (canvas.width - size * cellSize) / 2;
      const startY = 60;
      const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

      // Generate correlation matrix
      const corr = [];
      for (let i = 0; i < size; i++) {
        corr[i] = [];
        for (let j = 0; j < size; j++) {
          if (i === j) corr[i][j] = 1;
          else if (j > i) {
            corr[i][j] = (Math.random() * 2 - 1).toFixed(2);
            if (heatmapType === 'corr') corr[i][j] = null; // mask
          } else {
            corr[i][j] = corr[j] ? corr[j][i] : (Math.random() * 2 - 1).toFixed(2);
          }
        }
      }

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const x = startX + j * cellSize;
          const y = startY + i * cellSize;
          const val = corr[i][j];

          if (val === null) {
            ctx.fillStyle = '#f3f4f6';
          } else {
            // Colormap: blue (negative) -> white (0) -> red (positive)
            const v = parseFloat(val);
            if (v < 0) {
              const intensity = Math.abs(v);
              ctx.fillStyle = `rgb(${66 + (1 - intensity) * 189}, ${102 + (1 - intensity) * 153}, ${241})`;
            } else {
              const intensity = v;
              ctx.fillStyle = `rgb(${239}, ${68 + (1 - intensity) * 187}, ${68 + (1 - intensity) * 187})`;
            }
          }
          ctx.fillRect(x, y, cellSize - 2, cellSize - 2);

          if (val !== null) {
            ctx.fillStyle = Math.abs(parseFloat(val)) > 0.5 ? 'white' : COLORS.dark;
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(val, x + cellSize / 2 - 1, y + cellSize / 2 + 4);
          }
        }
      }

      // Labels
      ctx.fillStyle = COLORS.dark;
      ctx.font = '12px Inter, sans-serif';
      labels.forEach((l, i) => {
        ctx.textAlign = 'center';
        ctx.fillText(l, startX + i * cellSize + cellSize / 2, startY + size * cellSize + 20);
        ctx.textAlign = 'right';
        ctx.fillText(l, startX - 10, startY + i * cellSize + cellSize / 2 + 4);
      });

      // Color bar
      const barX = startX + size * cellSize + 30;
      const barHeight = size * cellSize;
      for (let i = 0; i < barHeight; i++) {
        const v = 1 - (i / barHeight) * 2;
        if (v < 0) {
          const intensity = Math.abs(v);
          ctx.fillStyle = `rgb(${66 + (1 - intensity) * 189}, ${102 + (1 - intensity) * 153}, ${241})`;
        } else {
          const intensity = v;
          ctx.fillStyle = `rgb(${239}, ${68 + (1 - intensity) * 187}, ${68 + (1 - intensity) * 187})`;
        }
        ctx.fillRect(barX, startY + i, 20, 1);
      }
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = COLORS.dark;
      ctx.fillText('+1.0', barX + 25, startY + 10);
      ctx.fillText('0.0', barX + 25, startY + barHeight / 2);
      ctx.fillText('-1.0', barX + 25, startY + barHeight - 5);
    } else if (heatmapType === 'clustermap') {
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('sns.clustermap(data) - Hierarchically Clustered', canvas.width / 2, 25);

      // Draw dendrogram (simplified tree)
      ctx.strokeStyle = COLORS.gray;
      ctx.lineWidth = 1;
      
      // Top dendrogram
      const dendroY = 60;
      ctx.beginPath();
      ctx.moveTo(200, dendroY + 30);
      ctx.lineTo(200, dendroY + 15);
      ctx.lineTo(300, dendroY + 15);
      ctx.lineTo(300, dendroY + 30);
      ctx.moveTo(250, dendroY + 15);
      ctx.lineTo(250, dendroY);
      ctx.lineTo(450, dendroY);
      ctx.lineTo(450, dendroY + 30);
      ctx.moveTo(400, dendroY + 30);
      ctx.lineTo(400, dendroY + 15);
      ctx.lineTo(500, dendroY + 15);
      ctx.lineTo(500, dendroY + 30);
      ctx.stroke();

      // Heatmap body
      const startX = 180;
      const startY = 100;
      const cellSize = 50;
      const rows = 5;
      const cols = 6;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = startX + j * cellSize;
          const y = startY + i * cellSize;
          
          // Clustered pattern
          let val = Math.random();
          if ((i < 2 && j < 3) || (i >= 2 && j >= 3)) val = val * 0.3 + 0.7; // high values in clusters
          else val = val * 0.3;
          
          const hue = 240 - val * 240;
          ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
          ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
        }
      }

      // Side dendrogram (simplified)
      ctx.beginPath();
      ctx.moveTo(startX - 10, startY + 25);
      ctx.lineTo(startX - 25, startY + 25);
      ctx.lineTo(startX - 25, startY + 75);
      ctx.lineTo(startX - 10, startY + 75);
      ctx.moveTo(startX - 25, startY + 50);
      ctx.lineTo(startX - 40, startY + 50);
      ctx.lineTo(startX - 40, startY + 175);
      ctx.lineTo(startX - 10, startY + 175);
      ctx.stroke();

      ctx.fillStyle = COLORS.gray;
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Rows and columns reordered by similarity', canvas.width / 2, canvas.height - 30);
    }
  }

  // ==================== ANIMATIONS ====================
  let animationId = null;
  let animFrame = 0;

  function drawAnimation() {
    const canvas = $('canvas-animation');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = COLORS.dark;
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Gapminder-style Animation: GDP vs Life Expectancy over Time', canvas.width / 2, 25);

    const margin = { top: 50, right: 100, bottom: 50, left: 70 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + width, y);
      ctx.stroke();
    }

    // Countries (bubbles)
    const countries = [
      { name: 'USA', color: COLORS.primary, baseX: 0.85, baseY: 0.2, size: 35 },
      { name: 'China', color: COLORS.danger, baseX: 0.4, baseY: 0.25, size: 50 },
      { name: 'India', color: COLORS.warning, baseX: 0.2, baseY: 0.4, size: 45 },
      { name: 'Brazil', color: COLORS.success, baseX: 0.35, baseY: 0.35, size: 25 },
      { name: 'Nigeria', color: COLORS.secondary, baseX: 0.15, baseY: 0.55, size: 28 }
    ];

    // Animate movement
    const progress = (animFrame % 100) / 100;
    
    countries.forEach(country => {
      // Countries move up and right over time (improving)
      const xOffset = progress * 0.3 * Math.sin(progress * Math.PI);
      const yOffset = progress * 0.2;
      
      const x = margin.left + (country.baseX + xOffset) * width;
      const y = margin.top + (country.baseY - yOffset) * height;
      
      ctx.beginPath();
      ctx.arc(x, y, country.size * (1 + progress * 0.3), 0, Math.PI * 2);
      ctx.fillStyle = country.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = country.color;
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(country.name, x, y + 4);
    });

    // Year indicator
    const year = Math.floor(1960 + progress * 60);
    ctx.fillStyle = COLORS.gray;
    ctx.font = 'bold 60px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.globalAlpha = 0.3;
    ctx.fillText(year, canvas.width - 30, canvas.height - 30);
    ctx.globalAlpha = 1;

    // Axes
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + height);
    ctx.lineTo(margin.left + width, margin.top + height);
    ctx.stroke();

    ctx.fillStyle = COLORS.dark;
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GDP per Capita ($)', margin.left + width / 2, canvas.height - 10);
    ctx.save();
    ctx.translate(20, margin.top + height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Life Expectancy (years)', 0, 0);
    ctx.restore();

    if (animationId) {
      animFrame++;
      animationId = requestAnimationFrame(drawAnimation);
    }
  }

  function startAnimation() {
    if (!animationId) {
      animFrame = 0;
      animationId = requestAnimationFrame(drawAnimation);
    }
  }

  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // ==================== EVENT LISTENERS ====================
  function bindEvents() {
    // Perception buttons
    $('btn-position')?.addEventListener('click', () => { perceptionMode = 'position'; drawPerception(); });
    $('btn-color')?.addEventListener('click', () => { perceptionMode = 'color'; drawPerception(); });
    $('btn-size')?.addEventListener('click', () => { perceptionMode = 'size'; drawPerception(); });

    // Chart choosing buttons
    $('btn-comparison')?.addEventListener('click', () => { chartPurpose = 'comparison'; drawChoosingCharts(); });
    $('btn-composition')?.addEventListener('click', () => { chartPurpose = 'composition'; drawChoosingCharts(); });
    $('btn-distribution')?.addEventListener('click', () => { chartPurpose = 'distribution'; drawChoosingCharts(); });
    $('btn-relationship')?.addEventListener('click', () => { chartPurpose = 'relationship'; drawChoosingCharts(); });

    // Basic plot buttons
    $('btn-line')?.addEventListener('click', () => { basicPlotType = 'line'; drawBasicPlots(); });
    $('btn-scatter')?.addEventListener('click', () => { basicPlotType = 'scatter'; drawBasicPlots(); });
    $('btn-bar')?.addEventListener('click', () => { basicPlotType = 'bar'; drawBasicPlots(); });
    $('btn-hist')?.addEventListener('click', () => { basicPlotType = 'hist'; drawBasicPlots(); });
    $('btn-pie')?.addEventListener('click', () => { basicPlotType = 'pie'; drawBasicPlots(); });

    // Distribution buttons
    $('btn-histplot')?.addEventListener('click', () => { distPlotType = 'histplot'; drawDistributions(); });
    $('btn-kdeplot')?.addEventListener('click', () => { distPlotType = 'kdeplot'; drawDistributions(); });
    $('btn-ecdfplot')?.addEventListener('click', () => { distPlotType = 'ecdfplot'; drawDistributions(); });
    $('btn-rugplot')?.addEventListener('click', () => { distPlotType = 'rugplot'; drawDistributions(); });

    // Heatmap buttons
    $('btn-heatmap-basic')?.addEventListener('click', () => { heatmapType = 'basic'; drawHeatmaps(); });
    $('btn-corr-matrix')?.addEventListener('click', () => { heatmapType = 'corr'; drawHeatmaps(); });
    $('btn-clustermap')?.addEventListener('click', () => { heatmapType = 'clustermap'; drawHeatmaps(); });

    // Animation
    $('btn-animate')?.addEventListener('click', startAnimation);
    $('btn-stop')?.addEventListener('click', stopAnimation);

    // Smooth scroll for nav links
    $$('.nav__link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Update active state
        $$('.nav__link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  // ==================== INITIALIZATION ====================
  function init() {
    bindEvents();
    
    // Draw all initial visualizations
    drawAnscombe();
    perceptionMode = 'position';
    drawPerception();
    drawGrammar();
    chartPurpose = 'comparison';
    drawChoosingCharts();
    drawAnatomy();
    basicPlotType = 'line';
    drawBasicPlots();
    distPlotType = 'histplot';
    drawDistributions();
    heatmapType = 'basic';
    drawHeatmaps();
    drawAnimation();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
