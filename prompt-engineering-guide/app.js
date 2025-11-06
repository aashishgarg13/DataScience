// Topics data
const topics = [
    { id: 1, title: "Introduction to Prompt Engineering", subtitle: "What & Why" },
    { id: 2, title: "Prompt Structure", subtitle: "Building Blocks" },
    { id: 3, title: "Clarity & Specificity", subtitle: "Writing Precise Prompts" },
    { id: 4, title: "Context & Background", subtitle: "Providing Information" },
    { id: 5, title: "Output Format", subtitle: "Specifying Structure" },
    { id: 6, title: "Iterative Refinement", subtitle: "Testing & Improving" },
    { id: 7, title: "Advanced Techniques", subtitle: "Expert Methods" },
    { id: 8, title: "Real-World Applications", subtitle: "Putting It Together" }
];

// State management
let currentTopic = 1;
let completedTopics = [];

// Initialize app
function init() {
    renderTopicList();
    initializeCanvases();
    updateProgress();
    showContextExample('minimal');
    showFormatExample('list');
    showIteration(1);
    updateSpecificity();
    setChallenge('email');
}

// Render topic list in sidebar
function renderTopicList() {
    const topicList = document.getElementById('topicList');
    topicList.innerHTML = topics.map(topic => `
        <li class="topic-item ${topic.id === currentTopic ? 'active' : ''}" onclick="navigateTo(${topic.id})">
            <h3>${topic.id}. ${topic.title}</h3>
            <p>${topic.subtitle}</p>
        </li>
    `).join('');
}

// Navigate to topic
function navigateTo(topicId) {
    // Hide current section
    const currentSection = document.querySelector('.content-section.active');
    if (currentSection) {
        currentSection.classList.remove('active');
    }

    // Show new section
    const newSection = document.getElementById(`topic-${topicId}`);
    if (newSection) {
        newSection.classList.add('active');
        currentTopic = topicId;
        
        // Mark previous topics as completed
        if (!completedTopics.includes(topicId - 1) && topicId > 1) {
            completedTopics.push(topicId - 1);
        }
        
        renderTopicList();
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Update progress bar
function updateProgress() {
    const progress = (currentTopic / topics.length) * 100;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${progress}%`;
}

// Prompt quality evaluation
function updatePromptQuality() {
    const role = document.getElementById('roleInput').value;
    const context = document.getElementById('contextInput').value;
    const task = document.getElementById('taskInput').value;
    const format = document.getElementById('formatInput').value;

    const components = [role, context, task, format];
    const filledComponents = components.filter(c => c.trim().length > 0).length;

    const qualityGrade = document.getElementById('qualityGrade');
    const combinedPrompt = document.getElementById('combinedPrompt');

    let gradeText = '';
    let gradeClass = '';

    if (filledComponents === 0) {
        gradeText = 'Quality: Poor';
        gradeClass = 'grade-poor';
        combinedPrompt.textContent = 'Start filling in the components above...';
    } else if (filledComponents <= 2) {
        gradeText = 'Quality: Poor';
        gradeClass = 'grade-poor';
    } else if (filledComponents === 3) {
        gradeText = 'Quality: Good';
        gradeClass = 'grade-good';
    } else {
        gradeText = 'Quality: Excellent';
        gradeClass = 'grade-excellent';
    }

    qualityGrade.textContent = gradeText;
    qualityGrade.className = 'quality-grade ' + gradeClass;

    if (filledComponents > 0) {
        const parts = [];
        if (role) parts.push(role);
        if (context) parts.push(context);
        if (task) parts.push(task);
        if (format) parts.push(format);
        combinedPrompt.textContent = parts.join(' ');
    }
}

// Specificity slider
const specificityLevels = [
    {
        level: 1,
        prompt: "Write about AI.",
        quality: "Poor - Too vague, could mean anything"
    },
    {
        level: 2,
        prompt: "Write about machine learning.",
        quality: "Poor - Still too broad, no specific focus"
    },
    {
        level: 3,
        prompt: "Explain how machine learning works in simple terms.",
        quality: "Good - More specific, mentions simplicity"
    },
    {
        level: 4,
        prompt: "Explain how machine learning works in 200 words, using simple terms for beginners.",
        quality: "Very Good - Specifies length and audience"
    },
    {
        level: 5,
        prompt: "Write a 200-word beginner's guide explaining how machine learning works, using a coffee shop analogy. Keep language simple for 10th graders.",
        quality: "Excellent - Specific length, audience, analogy, and complexity level"
    }
];

function updateSpecificity() {
    const slider = document.getElementById('specificitySlider');
    const value = parseInt(slider.value);
    document.getElementById('specificityValue').textContent = value;

    const level = specificityLevels[value - 1];
    document.getElementById('specificityPrompt').textContent = level.prompt;
    document.getElementById('specificityQuality').textContent = level.quality;
}

// Context examples
const contextExamples = {
    minimal: {
        prompt: "Write a marketing email.",
        quality: "⚠️ Poor - No context about product, audience, or goal"
    },
    moderate: {
        prompt: "Write a marketing email for our new coffee subscription service. Target coffee enthusiasts.",
        quality: "⚡ Good - Has product and audience, but could use more details"
    },
    rich: {
        prompt: "Write a marketing email for our new coffee subscription service. We're a sustainable brand targeting environmentally-conscious coffee enthusiasts aged 25-40. The service delivers ethically-sourced beans monthly. Tone should be warm and knowledgeable. Email should introduce the service, highlight sustainability, and include a 20% off first order offer. Keep it under 200 words.",
        quality: "✓ Excellent - Complete context with audience, brand voice, key points, and constraints"
    }
};

function showContextExample(level) {
    // Update button states
    const buttons = document.querySelectorAll('#topic-4 .scenario-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const example = contextExamples[level];
    document.getElementById('contextPromptText').textContent = example.prompt;
    document.getElementById('contextQuality').textContent = example.quality;
}

// Format examples
const formatExamples = {
    list: {
        prompt: "Provide the information as a numbered list with brief explanations for each point.",
        output: "1. First Point\n   Brief explanation here\n\n2. Second Point\n   Brief explanation here\n\n3. Third Point\n   Brief explanation here"
    },
    table: {
        prompt: "Create a comparison table with columns: Feature, Pros, Cons",
        output: "| Feature    | Pros              | Cons              |\n|------------|-------------------|-------------------|\n| Feature A  | Advantage 1       | Disadvantage 1    |\n| Feature B  | Advantage 2       | Disadvantage 2    |"
    },
    narrative: {
        prompt: "Write the response as a 3-paragraph narrative with introduction, body, and conclusion.",
        output: "Introduction paragraph setting context...\n\nBody paragraph with main information and details...\n\nConclusion paragraph summarizing key points..."
    },
    code: {
        prompt: "Provide Python code with inline comments explaining each step.",
        output: "# Calculate factorial of a number\ndef factorial(n):\n    # Base case: factorial of 0 or 1 is 1\n    if n <= 1:\n        return 1\n    # Recursive case\n    return n * factorial(n - 1)"
    },
    json: {
        prompt: "Return the data as a JSON object with proper structure.",
        output: "{\n  \"name\": \"Example\",\n  \"items\": [\n    { \"id\": 1, \"value\": \"Item 1\" },\n    { \"id\": 2, \"value\": \"Item 2\" }\n  ]\n}"
    }
};

function showFormatExample(format) {
    // Update button states
    const buttons = document.querySelectorAll('#topic-5 .scenario-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const example = formatExamples[format];
    document.getElementById('formatPromptText').textContent = example.prompt;
    document.getElementById('formatOutputExample').textContent = example.output;
}

// Iteration examples
const iterations = [
    {
        iteration: 1,
        prompt: "Help me with my website.",
        score: "25/100 - Very Poor",
        notes: "❌ Issues: No context, unclear task, no specifics. AI won't know what kind of help you need."
    },
    {
        iteration: 2,
        prompt: "I have an e-commerce website and need help improving the checkout process. Can you suggest improvements?",
        score: "65/100 - Good",
        notes: "✓ Better: Added context (e-commerce) and specific area (checkout). ⚠️ Still missing: What problems exist? What's the current user experience?"
    },
    {
        iteration: 3,
        prompt: "I run an e-commerce website selling handmade jewelry. Our checkout abandonment rate is 70%. Users complain it takes too long (5+ steps). Analyze this and suggest 3-5 specific improvements to reduce friction. Format as: Problem → Solution → Expected Impact.",
        score: "95/100 - Excellent",
        notes: "✓ Excellent: Clear context, specific problem with data, defined task, output format specified. AI has everything needed for quality response."
    }
];

function showIteration(num) {
    const iteration = iterations[num - 1];
    document.getElementById('iterationPrompt').textContent = iteration.prompt;
    document.getElementById('iterationScore').textContent = iteration.score;
    document.getElementById('iterationNotes').innerHTML = `<p style="color: #ccc; margin: 0;">${iteration.notes}</p>`;
}

// Challenge scenarios
const challenges = {
    email: {
        scenario: "Your manager asked you to write a follow-up email to a client who attended yesterday's product demo. The client seemed interested but had concerns about pricing and implementation timeline."
    },
    code: {
        scenario: "You need to create a JavaScript function that validates email addresses and returns detailed error messages for invalid formats. It should handle edge cases like missing @ symbols, invalid domains, and special characters."
    },
    creative: {
        scenario: "Create a compelling Instagram caption for a new eco-friendly water bottle launch. Your brand targets young professionals who care about sustainability. The post should encourage engagement and include a call-to-action."
    },
    analysis: {
        scenario: "You have sales data from Q1-Q4 showing declining revenue in Q3. Analyze what might have caused this dip and provide actionable recommendations. Consider seasonality, marketing spend, and competition."
    }
};

let currentChallenge = 'email';

function setChallenge(type) {
    currentChallenge = type;
    
    // Update button states
    const buttons = document.querySelectorAll('.challenge-box .scenario-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    document.getElementById('challengeScenario').textContent = challenges[type].scenario;
    document.getElementById('challengeInput').value = '';
    document.getElementById('challengeFeedback').classList.remove('show');
}

function evaluateChallenge() {
    const input = document.getElementById('challengeInput').value;
    const feedback = document.getElementById('challengeFeedback');

    if (!input.trim()) {
        feedback.innerHTML = '<p style="color: #FF6B35;">⚠️ Please write a prompt first!</p>';
        feedback.classList.add('show');
        return;
    }

    // Simple evaluation based on key elements
    const hasRole = /you are|act as|as a/i.test(input);
    const hasContext = input.length > 100;
    const hasFormat = /format|structure|provide|return|list|table/i.test(input);
    const hasConstraints = /words|length|tone|style|keep/i.test(input);

    let score = 0;
    let feedbackItems = [];

    if (hasRole) {
        score += 25;
        feedbackItems.push('✓ Good: Includes role/persona');
    } else {
        feedbackItems.push('⚠️ Consider: Adding a role or persona');
    }

    if (hasContext) {
        score += 25;
        feedbackItems.push('✓ Good: Provides context');
    } else {
        feedbackItems.push('⚠️ Consider: Adding more context and background');
    }

    if (hasFormat) {
        score += 25;
        feedbackItems.push('✓ Good: Specifies output format');
    } else {
        feedbackItems.push('⚠️ Consider: Specifying the desired output format');
    }

    if (hasConstraints) {
        score += 25;
        feedbackItems.push('✓ Good: Includes constraints');
    } else {
        feedbackItems.push('⚠️ Consider: Adding constraints like length, tone, or style');
    }

    let grade = '';
    let color = '';
    if (score >= 75) {
        grade = 'Excellent';
        color = '#00FF88';
    } else if (score >= 50) {
        grade = 'Good';
        color = '#FFB800';
    } else {
        grade = 'Needs Improvement';
        color = '#FF6B35';
    }

    feedback.innerHTML = `
        <h4 style="color: ${color}; margin-bottom: 12px;">Score: ${score}/100 - ${grade}</h4>
        ${feedbackItems.map(item => `<p style="margin: 8px 0; font-size: 14px;">${item}</p>`).join('')}
        ${score >= 75 ? '<p style="margin-top: 15px; color: #00D9FF;">🎉 Great job! Your prompt includes all key components.</p>' : ''}
    `;
    feedback.classList.add('show');
}

function resetChallenge() {
    document.getElementById('challengeInput').value = '';
    document.getElementById('challengeFeedback').classList.remove('show');
}

// Practice challenge
function startPractice(topicId) {
    alert('Practice mode: Try building a prompt for a simple task like \"Write a product description for noise-canceling headphones\" and include all four components: Role, Context, Task, and Format!');
}

// Template copy
function copyTemplate(element) {
    const template = element.querySelector('pre').textContent;
    
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = template;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        // Show feedback
        const originalHTML = element.innerHTML;
        element.style.borderColor = '#00FF88';
        setTimeout(() => {
            element.style.borderColor = '#333';
        }, 1000);
    } catch (err) {
        console.error('Copy failed:', err);
    }
    
    document.body.removeChild(textarea);
}

// Canvas visualizations
function initializeCanvases() {
    // Structure Canvas - Component visualization
    const structureCanvas = document.getElementById('structureCanvas');
    if (structureCanvas) {
        const ctx = structureCanvas.getContext('2d');
        drawStructureVisualization(ctx, structureCanvas);
    }

    // Context Canvas - Information layers
    const contextCanvas = document.getElementById('contextCanvas');
    if (contextCanvas) {
        const ctx = contextCanvas.getContext('2d');
        drawContextVisualization(ctx, contextCanvas);
    }

    // Refinement Canvas - Improvement curve
    const refinementCanvas = document.getElementById('refinementCanvas');
    if (refinementCanvas) {
        const ctx = refinementCanvas.getContext('2d');
        drawRefinementVisualization(ctx, refinementCanvas);
    }

    // Techniques Canvas - Pattern comparison
    const techniquesCanvas = document.getElementById('techniquesCanvas');
    if (techniquesCanvas) {
        const ctx = techniquesCanvas.getContext('2d');
        drawTechniquesVisualization(ctx, techniquesCanvas);
    }
}

function drawStructureVisualization(ctx, canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const components = [
        { name: 'Role', color: '#0066FF', y: 80 },
        { name: 'Context', color: '#00D9FF', y: 160 },
        { name: 'Task', color: '#FFB800', y: 240 },
        { name: 'Format', color: '#00FF88', y: 320 }
    ];

    const centerX = canvas.width / 2;

    // Draw connecting lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 60);
    ctx.lineTo(centerX, 340);
    ctx.stroke();

    // Draw components
    components.forEach(comp => {
        // Circle
        ctx.fillStyle = comp.color;
        ctx.beginPath();
        ctx.arc(centerX, comp.y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(comp.name, centerX, comp.y + 5);
    });

    // Title
    ctx.fillStyle = '#00D9FF';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Prompt Structure Components', centerX, 30);
}

function drawContextVisualization(ctx, canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const layers = [
        { name: 'Task Only', width: 100, color: '#FF6B35' },
        { name: '+ Basic Context', width: 200, color: '#FFB800' },
        { name: '+ Full Context', width: 350, color: '#00FF88' }
    ];

    const startY = 100;
    const layerHeight = 60;
    const spacing = 30;

    layers.forEach((layer, index) => {
        const y = startY + (index * (layerHeight + spacing));
        
        // Draw rectangle
        ctx.fillStyle = layer.color + '44';
        ctx.fillRect(50, y, layer.width, layerHeight);
        
        // Draw border
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(50, y, layer.width, layerHeight);
        
        // Draw text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(layer.name, 60, y + 35);
    });

    // Title
    ctx.fillStyle = '#00D9FF';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Context Layers: From Minimal to Rich', 50, 50);
}

function drawRefinementVisualization(ctx, canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const points = [
        { x: 100, y: 300, label: 'Iteration 1' },
        { x: 300, y: 200, label: 'Iteration 2' },
        { x: 500, y: 120, label: 'Iteration 3' },
        { x: 700, y: 80, label: 'Final' }
    ];

    // Draw curve
    ctx.strokeStyle = '#0066FF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
        const xMid = (points[i - 1].x + points[i].x) / 2;
        ctx.quadraticCurveTo(xMid, points[i - 1].y, points[i].x, points[i].y);
    }
    ctx.stroke();

    // Draw points
    points.forEach((point, index) => {
        ctx.fillStyle = '#00D9FF';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(point.label, point.x, point.y + 25);
    });

    // Y-axis label
    ctx.save();
    ctx.translate(30, 200);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#888';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Quality', 0, 0);
    ctx.restore();

    // X-axis label
    ctx.fillStyle = '#888';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Iterations', canvas.width / 2, canvas.height - 20);

    // Title
    ctx.fillStyle = '#00D9FF';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Prompt Improvement Through Iteration', canvas.width / 2, 30);
}

function drawTechniquesVisualization(ctx, canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const techniques = [
        { name: 'Basic', score: 40, color: '#FF6B35', x: 150 },
        { name: 'Chain-of-Thought', score: 75, color: '#FFB800', x: 350 },
        { name: 'Few-Shot', score: 85, color: '#00D9FF', x: 550 },
        { name: 'Combined', score: 95, color: '#00FF88', x: 750 }
    ];

    const maxHeight = 250;
    const barWidth = 80;
    const baseY = 320;

    techniques.forEach(tech => {
        const barHeight = (tech.score / 100) * maxHeight;
        
        // Draw bar
        ctx.fillStyle = tech.color + '88';
        ctx.fillRect(tech.x - barWidth / 2, baseY - barHeight, barWidth, barHeight);
        
        // Draw border
        ctx.strokeStyle = tech.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(tech.x - barWidth / 2, baseY - barHeight, barWidth, barHeight);
        
        // Score text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(tech.score + '%', tech.x, baseY - barHeight - 10);
        
        // Technique name
        ctx.font = '12px sans-serif';
        ctx.fillText(tech.name, tech.x, baseY + 25);
    });

    // Title
    ctx.fillStyle = '#00D9FF';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Technique Effectiveness Comparison', canvas.width / 2, 30);

    // Y-axis
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 70);
    ctx.lineTo(80, baseY);
    ctx.stroke();

    // Y-axis label
    ctx.fillStyle = '#888';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('0%', 75, baseY + 5);
    ctx.fillText('50%', 75, baseY - 125);
    ctx.fillText('100%', 75, baseY - 250);
}

// Checklist interaction
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'LI' && e.target.parentElement.classList.contains('checklist')) {
        e.target.classList.toggle('checked');
    }
});

// Initialize on load
window.addEventListener('load', init);

// Handle window resize for canvases
window.addEventListener('resize', function() {
    initializeCanvases();
});