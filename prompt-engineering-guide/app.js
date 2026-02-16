// Prompt Engineering Masterclass — Dashboard Module
const modules = [
    { id: "intro", title: "Introduction to Prompt Engineering", icon: "🎯", category: "Foundations", description: "What prompt engineering is, why it matters, and core principles" },
    { id: "structure", title: "Prompt Structure", icon: "🧱", category: "Foundations", description: "Building blocks: role, context, task, and format components" },
    { id: "clarity", title: "Clarity & Specificity", icon: "🔍", category: "Foundations", description: "Writing precise, unambiguous prompts that get exact results" },
    { id: "context", title: "Context & Background", icon: "📋", category: "Foundations", description: "Providing the right information and constraints" },
    { id: "output", title: "Output Format", icon: "📐", category: "Techniques", description: "Specifying structure, length, tone, and formatting" },
    { id: "refinement", title: "Iterative Refinement", icon: "🔄", category: "Techniques", description: "Testing, evaluating, and improving prompts over time" },
    { id: "advanced", title: "Advanced Techniques", icon: "⚙️", category: "Advanced", description: "Chain-of-thought, few-shot, system prompts, and more" },
    { id: "applications", title: "Real-World Applications", icon: "🌍", category: "Advanced", description: "Applying prompt engineering across domains" },
    { id: "claude", title: "Claude Prompt Mastery", icon: "🟣", category: "Provider — Anthropic", description: "XML tags, thinking blocks, prefilling, prompt chaining" },
    { id: "gemini", title: "Google Gemini Prompting", icon: "🔵", category: "Provider — Google", description: "System instructions, multimodal, JSON Schema, ReAct" },
    { id: "openai", title: "OpenAI GPT Best Practices", icon: "🟢", category: "Provider — OpenAI", description: "Delimiters, function calling, RAG, context engineering" },
    { id: "comparison", title: "Provider Comparison", icon: "⚡", category: "Strategy", description: "Claude vs Gemini vs GPT — when to use what" }
];

const MODULE_CONTENT = {
    "intro": {
        concepts: `
            <div class="section">
                <h2>What is Prompt Engineering?</h2>
                <p>Prompt engineering is the art of writing clear, specific instructions to AI models to produce desired outputs. Think of it as learning to communicate effectively with an intelligent assistant.</p>
                <div class="info-box">
                    <div class="box-title">💡 The difference between a vague and specific prompt can be 10x in output quality</div>
                    <div class="box-content">Just like giving directions to a colleague, the more precise you are, the better the result.</div>
                </div>
                <h3>Real-World Analogy: Ordering Food</h3>
                <div class="comparison">
                    <div class="comparison-bad">
                        <h4>❌ Vague Order</h4>
                        <p>"Give me something to eat"</p>
                        <p style="color:#888;margin-top:8px">Result: Random item, probably not what you wanted</p>
                    </div>
                    <div class="comparison-good">
                        <h4>✓ Detailed Order</h4>
                        <p>"I'd like a medium margherita pizza with extra basil, thin crust, no olives"</p>
                        <p style="color:#888;margin-top:8px">Result: Exactly what you wanted</p>
                    </div>
                </div>
                <h3>Why Does It Matter?</h3>
                <table>
                    <tr><th>Factor</th><th>Without PE</th><th>With PE</th></tr>
                    <tr><td>Output Quality</td><td>Inconsistent</td><td>Reliable & precise</td></tr>
                    <tr><td>Iterations Needed</td><td>5-10 tries</td><td>1-2 tries</td></tr>
                    <tr><td>Token Cost</td><td>Higher (retries)</td><td>Lower (first-shot)</td></tr>
                    <tr><td>Reproducibility</td><td>Low</td><td>High</td></tr>
                </table>
            </div>`,
        code: `
            <div class="section">
                <h2>Prompt Examples: Basic vs Engineered</h2>
                <h3>Example 1: Summarization</h3>
                <div class="code-block">❌ Bad: "Summarize this article"

✓ Good: "Summarize this article in 3 bullet points,
each under 20 words, focusing on key findings
and their business implications."</div>
                <h3>Example 2: Code Generation</h3>
                <div class="code-block">❌ Bad: "Write a Python function"

✓ Good: "Write a Python function called 'validate_email'
that takes a string parameter and returns True/False.
Use regex. Include docstring and type hints.
Handle edge cases: empty string, None, spaces."</div>
                <h3>Example 3: Analysis</h3>
                <div class="code-block">❌ Bad: "Analyze this data"

✓ Good: "Analyze the Q4 sales data below.
Identify the top 3 trends, calculate YoY growth
for each product line, and flag any anomalies
more than 2 standard deviations from the mean.
Present as a markdown table."</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: Prompt Engineering Basics</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: What is prompt engineering and why is it important?</div>
                    <div class="box-content">Prompt engineering is the practice of designing effective inputs for AI language models. It's important because the quality of AI output is directly proportional to the quality of the input prompt. Good prompts reduce costs (fewer retries), improve reliability, and enable consistent automation.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q2: What are the four components of an effective prompt?</div>
                    <div class="box-content"><strong>Role</strong> (who the AI should be), <strong>Context</strong> (background info), <strong>Task</strong> (specific action), and <strong>Format</strong> (how to structure output). Not all are required for every prompt, but complex tasks benefit from all four.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q3: How do you measure prompt quality?</div>
                    <div class="box-content">Key metrics: accuracy (correctness), relevance (on-topic), completeness (nothing missing), consistency (same prompt → similar results), and efficiency (tokens used). Use evaluation rubrics and A/B testing across multiple runs.</div>
                </div>
            </div>`
    },
    "structure": {
        concepts: `
            <div class="section">
                <h2>The Four Building Blocks</h2>
                <table>
                    <tr><th>Component</th><th>Purpose</th><th>Example</th></tr>
                    <tr><td><strong>Role</strong></td><td>Sets expertise level & perspective</td><td>"You are a senior data scientist..."</td></tr>
                    <tr><td><strong>Context</strong></td><td>Background information</td><td>"Given this dataset of 10K customer records..."</td></tr>
                    <tr><td><strong>Task</strong></td><td>Specific action to perform</td><td>"Identify the top 5 churn predictors"</td></tr>
                    <tr><td><strong>Format</strong></td><td>Output structure</td><td>"Present as a numbered list with confidence scores"</td></tr>
                </table>
                <h3>How Components Work Together</h3>
                <div class="info-box">
                    <div class="box-title">🧱 Think of it like building a house</div>
                    <div class="box-content">Role = architect's style, Context = site conditions, Task = what to build, Format = blueprint specs. Missing any one leads to suboptimal results.</div>
                </div>
            </div>`,
        code: `
            <div class="section">
                <h2>Prompt Structure Templates</h2>
                <h3>Full 4-Component Template</h3>
                <div class="code-block">ROLE: You are a [expertise] with [years] experience in [domain].

CONTEXT: [Background information, constraints, data description]

TASK: [Specific action — be precise about what to do]

FORMAT: [How to structure the output — bullets, table, JSON, etc.]</div>
                <h3>Minimal Template (simple tasks)</h3>
                <div class="code-block">As a [role], [task]. Output as [format].</div>
                <h3>Professional Email Template</h3>
                <div class="code-block">ROLE: You are a professional business writer.

CONTEXT: We're launching a new SaaS product for HR teams.
The audience is VP-level decision makers.
Tone: confident but not aggressive.

TASK: Write a cold outreach email under 150 words that
highlights 3 pain points and our solution.

FORMAT: Subject line + email body. Use short paragraphs.</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: Prompt Structure</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: When would you omit the Role component?</div>
                    <div class="box-content">For simple, factual questions ("What's the capital of France?") or when the default assistant behavior is sufficient. Role is most valuable for specialized tasks requiring domain expertise or a particular perspective.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q2: How does adding context affect token usage vs quality?</div>
                    <div class="box-content">More context uses more input tokens but typically reduces output tokens (fewer retries needed). The ROI is positive for complex tasks. For simple tasks, minimal context is fine — over-contextualizing can actually confuse models.</div>
                </div>
            </div>`
    },
    "clarity": {
        concepts: `
            <div class="section">
                <h2>Writing Precise Prompts</h2>
                <p>Ambiguity is the #1 cause of poor AI output. Every word in your prompt should serve a purpose.</p>
                <h3>5 Rules of Clarity</h3>
                <table>
                    <tr><th>#</th><th>Rule</th><th>Bad Example</th><th>Good Example</th></tr>
                    <tr><td>1</td><td>Be specific</td><td>"Make it better"</td><td>"Reduce word count by 30%"</td></tr>
                    <tr><td>2</td><td>Use numbers</td><td>"Write a short summary"</td><td>"Write a 50-word summary"</td></tr>
                    <tr><td>3</td><td>Define terms</td><td>"Analyze sentiment"</td><td>"Rate sentiment 1-5 (1=very negative)"</td></tr>
                    <tr><td>4</td><td>Set boundaries</td><td>"List some examples"</td><td>"List exactly 5 examples"</td></tr>
                    <tr><td>5</td><td>Specify format</td><td>"Give me the data"</td><td>"Return as CSV with headers"</td></tr>
                </table>
            </div>`,
        code: `
            <div class="section">
                <h2>Clarity Examples</h2>
                <div class="code-block">❌ Vague: "Help me with my resume"

✓ Clear: "Review my resume below for a Senior Data Engineer role.
Score each section 1-10: summary, experience, skills, education.
For any section scoring below 7, provide specific rewrite 
suggestions with before/after examples."</div>
                <div class="code-block">❌ Vague: "Make this code faster"

✓ Clear: "Optimize this Python function for speed.
Current: processes 10K records in 5 seconds.
Target: under 1 second.
Constraints: must maintain the same input/output interface.
Show benchmarks before and after."</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: Clarity & Specificity</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: How do you handle inherently ambiguous tasks?</div>
                    <div class="box-content">Break ambiguous tasks into specific sub-tasks. Ask the AI to first clarify assumptions, then proceed. Use constraints to narrow the scope. For creative tasks where some ambiguity is desired, control it with parameters like "creative but professional tone."</div>
                </div>
            </div>`
    },
    "context": {
        concepts: `
            <div class="section">
                <h2>Providing the Right Context</h2>
                <p>Context bridges the gap between what you know and what the AI knows. Too little = guessing. Too much = distraction.</p>
                <h3>Types of Context</h3>
                <table>
                    <tr><th>Type</th><th>When to Use</th><th>Example</th></tr>
                    <tr><td><strong>Domain</strong></td><td>Specialized fields</td><td>"In the context of Kubernetes orchestration..."</td></tr>
                    <tr><td><strong>Audience</strong></td><td>Tailoring output</td><td>"The audience is non-technical executives"</td></tr>
                    <tr><td><strong>Constraints</strong></td><td>Setting boundaries</td><td>"Must comply with HIPAA regulations"</td></tr>
                    <tr><td><strong>Data</strong></td><td>Working with specific info</td><td>"Given this JSON payload: {...}"</td></tr>
                    <tr><td><strong>History</strong></td><td>Multi-turn conversations</td><td>"Building on our previous analysis..."</td></tr>
                </table>
            </div>`,
        code: `
            <div class="section">
                <h2>Context Templates</h2>
                <div class="code-block">TEMPLATE: Data Analysis with Context

CONTEXT:
- Dataset: 50K rows of e-commerce transactions (Jan-Dec 2024)
- Columns: order_id, customer_id, product, amount, date, region
- Business goal: reduce cart abandonment by 15%
- Constraint: recommendations must be implementable within 30 days

TASK: Identify the top 3 actionable insights from this data.</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: Context</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: What's the difference between over-contextualization and under-contextualization?</div>
                    <div class="box-content"><strong>Under</strong>: AI fills gaps with assumptions (often wrong). <strong>Over</strong>: AI gets confused by irrelevant details, wastes tokens, and may focus on the wrong aspects. The sweet spot is providing only context that directly affects the desired output.</div>
                </div>
            </div>`
    },
    "output": {
        concepts: `
            <div class="section">
                <h2>Specifying Output Format</h2>
                <p>Format specifications eliminate guesswork and make AI output directly usable in your workflow.</p>
                <table>
                    <tr><th>Format Type</th><th>Use Case</th><th>Prompt Pattern</th></tr>
                    <tr><td>JSON</td><td>API responses, data pipelines</td><td>"Return valid JSON with keys: name, score, reasons"</td></tr>
                    <tr><td>Markdown</td><td>Documentation, reports</td><td>"Use ## headers, bullet points, code blocks"</td></tr>
                    <tr><td>Table</td><td>Comparisons, structured data</td><td>"Present as a table with columns: X, Y, Z"</td></tr>
                    <tr><td>Numbered List</td><td>Steps, rankings</td><td>"List as numbered steps, each under 20 words"</td></tr>
                    <tr><td>Code</td><td>Implementation</td><td>"Write in Python 3.11+ with type hints and docstrings"</td></tr>
                </table>
            </div>`,
        code: `
            <div class="section">
                <h2>Output Format Examples</h2>
                <div class="code-block">JSON Output:
"Analyze this product review and return JSON:
{
  'sentiment': 'positive|negative|neutral',
  'confidence': 0.0-1.0,
  'key_topics': ['topic1', 'topic2'],
  'summary': 'one sentence summary'
}"</div>
                <div class="code-block">Table Output:
"Compare React, Vue, and Angular. 
Format as a markdown table with columns:
Feature | React | Vue | Angular
Include rows for: learning curve, performance,
ecosystem, job market, best for."</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: Output Format</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: How do you ensure consistent JSON output from LLMs?</div>
                    <div class="box-content">1) Provide the exact schema in the prompt. 2) Use API features like OpenAI's function calling or Gemini's JSON Schema mode. 3) For Claude, use response prefilling starting with "{". 4) Include an example of the expected output. 5) Add "Return ONLY valid JSON, no other text" as a constraint.</div>
                </div>
            </div>`
    },
    "refinement": {
        concepts: `
            <div class="section">
                <h2>Iterative Prompt Refinement</h2>
                <p>Great prompts aren't written — they're refined. Use systematic testing to improve results.</p>
                <h3>The Refinement Loop</h3>
                <table>
                    <tr><th>Step</th><th>Action</th><th>Goal</th></tr>
                    <tr><td>1. Draft</td><td>Write initial prompt</td><td>Get a baseline result</td></tr>
                    <tr><td>2. Evaluate</td><td>Score output quality</td><td>Identify weaknesses</td></tr>
                    <tr><td>3. Diagnose</td><td>Find root cause</td><td>Understand why it failed</td></tr>
                    <tr><td>4. Refine</td><td>Modify prompt</td><td>Address specific issues</td></tr>
                    <tr><td>5. Test</td><td>Run again with variations</td><td>Verify improvement</td></tr>
                </table>
                <div class="callout tip">
                    <div class="callout-title">✅ Pro Tip</div>
                    <p>Keep a prompt journal — track what you changed and why. This builds your personal prompt library over time.</p>
                </div>
            </div>`,
        code: `
            <div class="section">
                <h2>Refinement in Practice</h2>
                <div class="code-block">Iteration 1 (Draft):
"Write a product description for headphones."
→ Result: Generic, bland, 200 words

Iteration 2 (Add specifics):
"Write a product description for Sony WH-1000XM5.
Target: audiophiles. Tone: technical but accessible."
→ Result: Better, but too long

Iteration 3 (Add constraints):
"Write a 60-word product description for Sony WH-1000XM5.
Target: audiophiles. Tone: technical but accessible.
Must mention: noise cancellation, 30-hour battery, LDAC codec.
End with a call to action."
→ Result: ✓ Excellent — concise, targeted, actionable</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: Refinement</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: How do you systematically A/B test prompts?</div>
                    <div class="box-content">1) Define clear evaluation criteria (accuracy, format, completeness). 2) Run both prompts on the same set of 10+ test inputs. 3) Score each output against criteria. 4) Use statistical significance tests if needed. 5) Keep the winning prompt and iterate further.</div>
                </div>
            </div>`
    },
    "advanced": {
        concepts: `
            <div class="section">
                <h2>Advanced Prompting Techniques</h2>
                <table>
                    <tr><th>Technique</th><th>What It Does</th><th>Best For</th></tr>
                    <tr><td><strong>Zero-Shot</strong></td><td>Direct instruction, no examples</td><td>Simple, well-defined tasks</td></tr>
                    <tr><td><strong>Few-Shot</strong></td><td>Provide 2-5 examples</td><td>Pattern replication, formatting</td></tr>
                    <tr><td><strong>Chain-of-Thought</strong></td><td>"Think step by step"</td><td>Math, logic, reasoning</td></tr>
                    <tr><td><strong>System Prompts</strong></td><td>Persistent role/rules</td><td>Chatbots, consistent behavior</td></tr>
                    <tr><td><strong>Self-Consistency</strong></td><td>Generate multiple answers, pick majority</td><td>High-stakes decisions</td></tr>
                    <tr><td><strong>Tree of Thoughts</strong></td><td>Explore multiple reasoning paths</td><td>Complex problem solving</td></tr>
                </table>
                <h3>Chain-of-Thought Deep Dive</h3>
                <div class="info-box">
                    <div class="box-title">🧠 Why CoT works</div>
                    <div class="box-content">By asking the model to show its reasoning, you force it to decompose the problem. This reduces errors in math, logic, and multi-step tasks by 30-50%.</div>
                </div>
            </div>`,
        code: `
            <div class="section">
                <h2>Advanced Techniques in Action</h2>
                <h3>Few-Shot Example</h3>
                <div class="code-block">Classify the sentiment of each review:

Review: "The battery life is incredible!"
Sentiment: Positive

Review: "Broke after 2 days, terrible quality"
Sentiment: Negative

Review: "It's okay, nothing special"
Sentiment: Neutral

Review: "Best purchase I've made this year!"
Sentiment:</div>
                <h3>Chain-of-Thought Example</h3>
                <div class="code-block">"A store has 45 apples. They sell 60% on Monday 
and half of the remainder on Tuesday. 
How many are left?

Think through this step by step before answering."

→ Step 1: 60% of 45 = 27 sold on Monday
→ Step 2: Remaining = 45 - 27 = 18
→ Step 3: Half of 18 = 9 sold on Tuesday
→ Step 4: Remaining = 18 - 9 = 9 apples</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: Advanced Techniques</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: When would you use few-shot over zero-shot?</div>
                    <div class="box-content">Use few-shot when: 1) The task has a specific format the model might not default to. 2) You need consistent output patterns. 3) The task is domain-specific and examples clarify expectations. Zero-shot is better when: the task is straightforward, examples might bias the output, or you want more creative/diverse responses.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q2: Explain self-consistency prompting.</div>
                    <div class="box-content">Generate multiple responses (3-5) to the same prompt using higher temperature, then take the majority answer. This is like polling multiple experts — reduces variance and improves reliability on reasoning tasks. Trade-off: costs more tokens.</div>
                </div>
            </div>`
    },
    "applications": {
        concepts: `
            <div class="section">
                <h2>Real-World Applications</h2>
                <table>
                    <tr><th>Domain</th><th>Use Case</th><th>Key Technique</th></tr>
                    <tr><td>Software Dev</td><td>Code review, debugging, documentation</td><td>Role + structured output</td></tr>
                    <tr><td>Marketing</td><td>Ad copy, SEO content, A/B variants</td><td>Few-shot + constraints</td></tr>
                    <tr><td>Data Science</td><td>EDA, feature engineering, reporting</td><td>Context + CoT</td></tr>
                    <tr><td>Education</td><td>Tutoring, quiz generation, explanations</td><td>Role + audience-aware</td></tr>
                    <tr><td>Legal</td><td>Contract analysis, compliance checks</td><td>RAG + structured output</td></tr>
                    <tr><td>Healthcare</td><td>Literature review, patient summaries</td><td>Context + safety constraints</td></tr>
                </table>
            </div>`,
        code: `
            <div class="section">
                <h2>Application Templates</h2>
                <h3>Code Review Prompt</h3>
                <div class="code-block">You are a senior software engineer (15 years, Python expert).

Review this code for:
1. Bugs and edge cases
2. Performance issues (O(n) analysis)
3. Security vulnerabilities (OWASP Top 10)
4. Code style (PEP 8 compliance)

For each issue found:
- Severity: Critical / Major / Minor
- Line number
- Description
- Fix with code example

Code to review:
"""
[paste code here]
"""</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: Applications</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: How do you design prompts for production systems vs ad-hoc use?</div>
                    <div class="box-content">Production prompts need: 1) Deterministic output (low temperature). 2) Structured format (JSON/schema). 3) Error handling instructions ("If input is invalid, return {error: ...}"). 4) Version control. 5) Evaluation metrics. Ad-hoc prompts can be more flexible and creative.</div>
                </div>
            </div>`
    },
    "claude": {
        concepts: `
            <div class="section">
                <h2>Why Claude Is Different</h2>
                <p>Claude is fine-tuned by Anthropic with emphasis on <strong>helpfulness, harmlessness, and honesty</strong>. It's specifically trained to respect <strong>XML-based structure</strong> in prompts.</p>
                <div class="info-box">
                    <div class="box-title">💡 Think of Claude as a brilliant new employee</div>
                    <div class="box-content">It has broad knowledge but needs explicit context about your specific situation.</div>
                </div>
                <h3>Key Claude Techniques</h3>
                <table>
                    <tr><th>Technique</th><th>What It Does</th><th>When to Use</th></tr>
                    <tr><td><strong>XML Tags</strong></td><td>Semantic structure for prompts</td><td>Always — Claude's killer feature</td></tr>
                    <tr><td><strong>Thinking Blocks</strong></td><td>Step-by-step reasoning scratchpad</td><td>Math, logic, complex analysis</td></tr>
                    <tr><td><strong>Response Prefilling</strong></td><td>Start Claude's response for you</td><td>Forcing JSON, controlling format</td></tr>
                    <tr><td><strong>Prompt Chaining</strong></td><td>Sequential subtask pipeline</td><td>Complex multi-step workflows</td></tr>
                    <tr><td><strong>Positive Framing</strong></td><td>Say "do X" not "don't do Y"</td><td>All Claude prompts</td></tr>
                    <tr><td><strong>Allow Uncertainty</strong></td><td>Let Claude say "I don't know"</td><td>Reducing hallucinations</td></tr>
                </table>
            </div>`,
        code: `
            <div class="section">
                <h2>Claude Prompt Templates</h2>
                <h3>XML-Structured Code Review</h3>
                <div class="code-block">&lt;role&gt;Expert Python code reviewer&lt;/role&gt;

&lt;code&gt;
def factorial(n):
    return n * factorial(n-1)
&lt;/code&gt;

&lt;instructions&gt;
1. Identify all bugs and edge cases
2. Suggest improvements with examples
3. Rate code quality (1-10)
&lt;/instructions&gt;

&lt;output_format&gt;markdown with code blocks&lt;/output_format&gt;</div>
                <h3>Response Prefilling (API)</h3>
                <div class="code-block">User: "Extract name, age, city from: 'John is 30, lives in NYC'"

Prefilled assistant response: {"name":

→ Claude continues: {"name": "John", "age": 30, "city": "NYC"}</div>
                <h3>Prompt Chaining Pipeline</h3>
                <div class="code-block">Step 1: "Read this document and extract the 5 main arguments."
         ↓ output feeds into...
Step 2: "For each argument: [step 1 output], evaluate strength 
         (1-10) and identify counterarguments."
         ↓ output feeds into...
Step 3: "Using this analysis: [step 2 output], write a balanced 
         500-word summary."</div>
                <h3>Document Analysis Template</h3>
                <div class="code-block">&lt;role&gt;Expert analyst&lt;/role&gt;

&lt;document&gt;
{{paste document here}}
&lt;/document&gt;

&lt;instructions&gt;
1. Summarize the key points
2. Identify potential issues
3. Provide recommendations
&lt;/instructions&gt;

&lt;output_format&gt;
Use headers for each section.
Keep each point under 50 words.
&lt;/output_format&gt;</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: Claude</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: Why does Claude respond better to XML tags than other models?</div>
                    <div class="box-content">Claude is specifically fine-tuned by Anthropic to parse XML tags as semantic structure. Unlike other models that treat XML as text, Claude understands that &lt;instructions&gt; contains directives and &lt;context&gt; contains background. This training makes XML-structured prompts significantly more effective with Claude.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q2: Explain Claude's Extended Thinking feature.</div>
                    <div class="box-content">Extended Thinking gives Claude a dedicated scratchpad for complex reasoning before producing a final answer. Enabled via API with {"thinking": {"type": "enabled", "budget_tokens": 10000}}. The thinking is visible to you but separate from the final response. Error rates drop 50%+ on reasoning tasks.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q3: What's Response Prefilling and when to use it?</div>
                    <div class="box-content">Prefilling starts Claude's response with specific text via the API. Use cases: 1) Force JSON output by prefilling with "{". 2) Prevent chatty preambles. 3) Guide output format. 4) Continue from a specific point. It's unique to Claude's API and not available in the web interface.</div>
                </div>
            </div>`
    },
    "gemini": {
        concepts: `
            <div class="section">
                <h2>The Gemini Difference</h2>
                <p>Google's Gemini is <strong>natively multimodal</strong> — it processes text, images, audio, and video in a single prompt. It also supports <strong>system instructions</strong> that persist across turns.</p>
                <div class="callout insight">
                    <div class="callout-title">💡 Key Insight</div>
                    <p>Gemini 2.0+ may over-analyze verbose prompts — keep instructions precise and direct.</p>
                </div>
                <h3>Key Gemini Techniques</h3>
                <table>
                    <tr><th>Technique</th><th>What It Does</th><th>Best For</th></tr>
                    <tr><td><strong>System Instructions</strong></td><td>Persistent rules across all turns</td><td>Chatbots, consistent AI apps</td></tr>
                    <tr><td><strong>JSON Schema Output</strong></td><td>Guaranteed structured responses</td><td>API integrations, data pipelines</td></tr>
                    <tr><td><strong>Multimodal Input</strong></td><td>Text + image + audio + video</td><td>Content analysis, accessibility</td></tr>
                    <tr><td><strong>Temperature/Top-K/Top-P</strong></td><td>Fine-grained randomness control</td><td>Tuning creativity vs accuracy</td></tr>
                    <tr><td><strong>Step-Back Prompting</strong></td><td>Abstract before solving</td><td>Complex domain questions</td></tr>
                    <tr><td><strong>ReAct Pattern</strong></td><td>Reason + Act loop</td><td>AI agents with tool use</td></tr>
                </table>
            </div>`,
        code: `
            <div class="section">
                <h2>Gemini Prompt Templates</h2>
                <h3>System Instruction Example</h3>
                <div class="code-block">System: You are a professional data analyst at a Fortune 500 company.

Rules:
- Always cite data sources
- Use metric units unless asked otherwise
- Present numbers with 2 decimal places for percentages
- If asked about topics outside data analysis, politely redirect
- Format responses with clear headers and bullet points

→ These rules apply to EVERY subsequent user message.</div>
                <h3>JSON Schema Output (API)</h3>
                <div class="code-block">// Set response_mime_type to "application/json"
// Provide response_schema:
{
  "product_name": "string",
  "rating": "number (1-5)",
  "pros": ["string"],
  "cons": ["string"],
  "would_recommend": "boolean"
}

→ Gemini GUARANTEES valid JSON matching this schema.</div>
                <h3>Step-Back Prompting</h3>
                <div class="code-block">Step 1: "What physics principle governs the relationship 
between pressure, temperature, and volume of gases?"

Step 2: "Using that principle, what happens to pressure 
if temperature is tripled and volume is halved?"

→ AI first recalls PV=nRT, then applies it correctly.</div>
                <h3>ReAct Agent Pattern</h3>
                <div class="code-block">Thought: I need to find the current stock price of NVIDIA
Action: search("NVIDIA stock price today")
Observation: NVIDIA (NVDA) is trading at $875.32

Thought: Now I need to calculate the market cap
Action: calculate(875.32 × 24.49 billion shares)
Observation: Market cap ≈ $21.4 trillion

Answer: NVIDIA's current market cap is approximately...</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: Gemini</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: How does Gemini's multimodal capability differ from other models?</div>
                    <div class="box-content">Gemini is natively multimodal — trained on text, images, audio, and video together from the start. Other models often bolt on vision/audio as separate modules. This means Gemini can process a video and answer questions about it in a single prompt, or analyze images alongside text naturally.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q2: Explain Temperature, Top-K, and Top-P tuning.</div>
                    <div class="box-content"><strong>Temperature</strong> (0-2): Controls randomness. 0 = deterministic, 2 = maximum creativity. <strong>Top-K</strong> (1-40): Limits token selection to most probable K tokens. <strong>Top-P</strong> (0-1): Nucleus sampling — selects from tokens whose cumulative probability reaches P. Use low temp for factual tasks, high for brainstorming.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q3: What is step-back prompting?</div>
                    <div class="box-content">A Google research technique where you ask the AI to first abstract/generalize the problem before solving it. Example: Before asking "What's 15% of $342?", first ask "What's the formula for calculating percentages?" This helps the model recall the right framework before applying it.</div>
                </div>
            </div>`
    },
    "openai": {
        concepts: `
            <div class="section">
                <h2>OpenAI's Prompting Philosophy</h2>
                <p>OpenAI's approach centers on <strong>six core strategies</strong>: write clear instructions, provide reference text, split complex tasks, give models time to think, use external tools, and test systematically.</p>
                <div class="callout insight">
                    <div class="callout-title">💡 Key Insight</div>
                    <p>For o1/o3 reasoning models, use SIMPLER prompts — they have built-in chain-of-thought. Over-prompting can hurt.</p>
                </div>
                <h3>Key OpenAI Techniques</h3>
                <table>
                    <tr><th>Technique</th><th>What It Does</th><th>Best For</th></tr>
                    <tr><td><strong>Delimiters</strong></td><td>### """ --- to separate sections</td><td>Preventing prompt injection</td></tr>
                    <tr><td><strong>Function Calling</strong></td><td>Structured JSON tool outputs</td><td>API integrations, data extraction</td></tr>
                    <tr><td><strong>RAG</strong></td><td>Ground responses in your docs</td><td>Reducing hallucinations</td></tr>
                    <tr><td><strong>Self-Improvement</strong></td><td>AI critiques & refines own output</td><td>High-quality content</td></tr>
                    <tr><td><strong>Multi-Perspective</strong></td><td>Simulate different expert views</td><td>Comprehensive analysis</td></tr>
                    <tr><td><strong>Context Engineering</strong></td><td>Curate entire context window</td><td>Production AI systems</td></tr>
                </table>
            </div>`,
        code: `
            <div class="section">
                <h2>OpenAI Prompt Templates</h2>
                <h3>Delimiter Pattern</h3>
                <div class="code-block">Summarize the text delimited by triple quotes.

"""
{{long article text here}}
"""

###
Rules:
- Keep summary under 100 words
- Focus on key findings
- Use bullet points
###</div>
                <h3>Recursive Self-Improvement (3-Step)</h3>
                <div class="code-block">Step 1 — Generate:
"Write a marketing email for our new SaaS product."

Step 2 — Critique:
"Review this email for: clarity, persuasiveness,
call-to-action effectiveness, and tone.
Score each dimension 1-10 and explain weaknesses."

Step 3 — Refine:
"Rewrite the email addressing these specific
weaknesses: [critique output].
Aim for 9+/10 on all dimensions."</div>
                <h3>Multi-Perspective Analysis</h3>
                <div class="code-block">Analyze this business proposal from three perspectives:

1. CFO: Focus on financial viability, ROI, cash flow
2. CTO: Focus on technical feasibility, scalability, risks
3. CMO: Focus on market opportunity, brand impact

For each perspective, provide:
- Top 3 concerns
- Top 3 opportunities
- Recommendation (Go / No-Go / Conditional)

Then synthesize a unified recommendation.</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: OpenAI GPT</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: What is function calling and how does it work?</div>
                    <div class="box-content">Function calling lets you define function signatures (name, description, parameters with types) in the API request. GPT decides when to call functions and returns structured JSON with arguments. You execute the function and return results. Supports parallel calling in GPT-4o. Perfect for building AI agents that interact with APIs.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q2: Explain RAG and its benefits.</div>
                    <div class="box-content">Retrieval-Augmented Generation: 1) Embed your docs as vectors. 2) On each query, retrieve relevant chunks. 3) Include them as context in the prompt. Benefits: reduces hallucinations, provides up-to-date info, enables domain-specific answers without fine-tuning, and you can cite sources.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q3: What is "context engineering"?</div>
                    <div class="box-content">The evolution beyond prompt engineering. Instead of crafting individual prompts, you curate the ENTIRE context window: system message (role/rules), tool definitions (available functions), retrieved context (RAG results), and conversation history (filtered/summarized). The prompt is just one piece of the bigger picture.</div>
                </div>
            </div>`
    },
    "comparison": {
        concepts: `
            <div class="section">
                <h2>Side-by-Side Comparison</h2>
                <table>
                    <tr>
                        <th>Feature</th>
                        <th style="color:#B07DFF">🟣 Claude</th>
                        <th style="color:#4285F4">🔵 Gemini</th>
                        <th style="color:#10A37F">🟢 GPT</th>
                    </tr>
                    <tr><td>Best Structuring</td><td>XML Tags</td><td>System Instructions</td><td>Delimiters (###/""")</td></tr>
                    <tr><td>Structured Output</td><td>Prefilling</td><td>JSON Schema</td><td>Function Calling</td></tr>
                    <tr><td>Reasoning</td><td>Extended Thinking</td><td>Step-Back Prompting</td><td>o1/o3 Models</td></tr>
                    <tr><td>Multimodal</td><td>Text + Images</td><td>Text+Image+Audio+Video</td><td>Text + Image + Audio</td></tr>
                    <tr><td>Context Window</td><td>200K tokens</td><td>1M+ tokens</td><td>128K tokens</td></tr>
                    <tr><td>Tool Use</td><td>Tool Use API</td><td>Function Declarations</td><td>Function Calling</td></tr>
                    <tr><td>Unique Strength</td><td>Long-form analysis</td><td>Multimodal + Google</td><td>Ecosystem + tools</td></tr>
                </table>
                <h3>When to Use Which Model</h3>
                <div class="info-box">
                    <div class="box-title">🟣 Choose Claude when...</div>
                    <div class="box-content">Long document analysis (200K context), nuanced writing, XML-structured prompts, complex reasoning, coding with explanations</div>
                </div>
                <div class="info-box">
                    <div class="box-title">🔵 Choose Gemini when...</div>
                    <div class="box-content">Multimodal tasks (image/audio/video), extremely long context (1M+), Google integration, guaranteed JSON output, grounding with Search</div>
                </div>
                <div class="info-box">
                    <div class="box-title">🟢 Choose GPT when...</div>
                    <div class="box-content">Building apps with API, complex tool-use, hard math/reasoning (o1/o3), existing OpenAI ecosystem, image generation (DALL-E)</div>
                </div>
            </div>`,
        code: `
            <div class="section">
                <h2>Cross-Platform Prompt Adaptation</h2>
                <p>The same task requires different prompt structures across providers:</p>
                <h3>Task: Code Review</h3>
                <div class="code-block">🟣 CLAUDE VERSION:
&lt;role&gt;Senior code reviewer&lt;/role&gt;
&lt;code language="python"&gt;
def process(data):
    return [x*2 for x in data if x > 0]
&lt;/code&gt;
&lt;instructions&gt;
Review for bugs, performance, readability.
Use &lt;thinking&gt; tags before responding.
&lt;/instructions&gt;</div>
                <div class="code-block">🔵 GEMINI VERSION:
System: You are a senior code reviewer.
Always respond in JSON format.

User: Review this Python code:
\`\`\`python
def process(data):
    return [x*2 for x in data if x > 0]
\`\`\`
Provide: bugs, performance, readability (1-10), improved version.</div>
                <div class="code-block">🟢 GPT VERSION:
You are a senior code reviewer.

Review the following code:
###
def process(data):
    return [x*2 for x in data if x > 0]
###

Evaluate:
1. Bugs or edge cases
2. Performance concerns
3. Readability (1-10)
4. Improved version with comments</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>Interview Questions: Provider Strategy</h2>
                <div class="interview-box">
                    <div class="box-title">Q1: How do you decide which AI provider to use for a project?</div>
                    <div class="box-content">Consider: 1) Task type — multimodal? Use Gemini. Long docs? Claude. API integration? GPT. 2) Context needs — 1M tokens? Gemini. 200K? Claude. 128K? GPT. 3) Output format — guaranteed JSON? Gemini Schema. Tool use? GPT Functions. 4) Budget and latency requirements. 5) Existing tech stack integration.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q2: What's the future of prompt engineering?</div>
                    <div class="box-content">Four key trends: 1) <strong>Context engineering</strong> — curating entire context windows, not just prompts. 2) <strong>Agentic workflows</strong> — prompts become policies for autonomous AI agents. 3) <strong>Multimodal-first</strong> — combining text, images, audio, video as standard. 4) <strong>Automated optimization</strong> — tools like DSPy auto-optimize prompts.</div>
                </div>
                <div class="interview-box">
                    <div class="box-title">Q3: How do you maintain a cross-platform prompt library?</div>
                    <div class="box-content">Keep a "prompt cookbook" with 3 versions of each template (Claude/Gemini/GPT). Version control prompts like code. Document: what each prompt does, which model it's for, expected input/output format, and performance metrics. Update when model versions change.</div>
                </div>
            </div>`
    }
};

// ============== Rendering Functions ==============
function renderDashboard() {
    document.getElementById('modulesGrid').innerHTML = modules.map(m => `
        <div class="card" onclick="showModule('${m.id}')">
            <div class="card-icon">${m.icon}</div>
            <h3>${m.title}</h3>
            <p>${m.description}</p>
            <span class="category-label">${m.category}</span>
        </div>
    `).join('');
}

function showModule(moduleId) {
    const module = modules.find(m => m.id === moduleId);
    const content = MODULE_CONTENT[moduleId];
    document.getElementById('dashboard').classList.remove('active');

    document.getElementById('modulesContainer').innerHTML = `
        <div class="module active" id="module-${moduleId}">
            <button class="btn-back" onclick="backToDashboard()">← Back to Dashboard</button>
            <header>
                <h1>${module.icon} ${module.title}</h1>
                <p class="subtitle">${module.description}</p>
            </header>
            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab('${moduleId}', 'concepts', event)">📖 Key Concepts</button>
                <button class="tab-btn" onclick="switchTab('${moduleId}', 'code', event)">💻 Prompt Templates</button>
                <button class="tab-btn" onclick="switchTab('${moduleId}', 'interview', event)">🎯 Interview Questions</button>
            </div>
            <div id="${moduleId}-concepts" class="tab active">${content.concepts}</div>
            <div id="${moduleId}-code" class="tab">${content.code}</div>
            <div id="${moduleId}-interview" class="tab">${content.interview}</div>
        </div>
    `;
}

function switchTab(moduleId, tabName, e) {
    const moduleEl = document.getElementById(`module-${moduleId}`);
    moduleEl.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (e && e.target) {
        e.target.classList.add('active');
    } else {
        const tabNames = ['concepts', 'code', 'interview'];
        const idx = tabNames.indexOf(tabName);
        if (idx !== -1) moduleEl.querySelectorAll('.tab-btn')[idx]?.classList.add('active');
    }
    moduleEl.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${moduleId}-${tabName}`).classList.add('active');
}

function backToDashboard() {
    document.querySelectorAll('.module').forEach(m => m.remove());
    document.getElementById('dashboard').classList.add('active');
}

renderDashboard();