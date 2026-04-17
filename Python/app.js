const modules = [
    {
        id: "python-fundamentals",
        title: "Python Fundamentals for DS",
        icon: "🐍",
        category: "Foundations",
        description: "Data structures, comprehensions, file I/O, virtual environments"
    },
    {
        id: "numpy",
        title: "NumPy & Scientific Computing",
        icon: "🔢",
        category: "Scientific",
        description: "ndarrays, broadcasting, vectorization, linear algebra"
    },
    {
        id: "pandas",
        title: "Pandas & Data Manipulation",
        icon: "🐼",
        category: "Data Wrangling",
        description: "DataFrames, groupby, pivot, time series, merging"
    },
    {
        id: "visualization",
        title: "Data Visualization",
        icon: "📊",
        category: "Visualization",
        description: "Matplotlib, Seaborn, Plotly — from basics to publication-ready"
    },
    {
        id: "advanced-python",
        title: "Advanced Python",
        icon: "🎯",
        category: "Advanced",
        description: "OOP, decorators, async, multiprocessing, type hints"
    },
    {
        id: "sklearn",
        title: "Python for ML (Scikit-learn)",
        icon: "🤖",
        category: "Machine Learning",
        description: "Pipelines, transformers, cross-validation, hyperparameter tuning"
    },
    {
        id: "pytorch",
        title: "Deep Learning with PyTorch",
        icon: "🔥",
        category: "Deep Learning",
        description: "Tensors, autograd, nn.Module, training loops, transfer learning"
    },
    {
        id: "tensorflow",
        title: "TensorFlow & Keras",
        icon: "🧠",
        category: "Deep Learning",
        description: "Sequential/Functional API, callbacks, TensorBoard, deployment"
    },
    {
        id: "production",
        title: "Production Python",
        icon: "📦",
        category: "Engineering",
        description: "Testing, packaging, logging, FastAPI for model serving"
    },
    {
        id: "optimization",
        title: "Performance & Optimization",
        icon: "⚡",
        category: "Optimization",
        description: "Profiling, Numba, Cython, memory optimization, Dask"
    }
];


const MODULE_CONTENT = {
    "python-fundamentals": {
        concepts: `
            <div class="section">
                <h2>🐍 Python Fundamentals — Complete Deep Dive</h2>

                <div class="info-box">
                    <div class="box-title">⚡ Python Is Not What You Think</div>
                    <div class="box-content">Python is a <strong>dynamically-typed, garbage-collected, interpreted language</strong> with a C-based runtime (CPython). Everything is an object — integers, functions, even classes. Understanding this object model is what separates beginners from professionals.</div>
                </div>

                <h3>1. Data Structures — Complete Reference</h3>
                <table>
                    <tr><th>Type</th><th>Mutable</th><th>Ordered</th><th>Hashable</th><th>Use Case</th></tr>
                    <tr><td><strong>list</strong></td><td>✓</td><td>✓</td><td>✗</td><td>Sequential data, time series, feature lists</td></tr>
                    <tr><td><strong>tuple</strong></td><td>✗</td><td>✓</td><td>✓</td><td>Fixed records, dict keys, DataFrame rows</td></tr>
                    <tr><td><strong>dict</strong></td><td>✓</td><td>✓ (3.7+)</td><td>✗</td><td>Lookup tables, JSON, config, caches</td></tr>
                    <tr><td><strong>set</strong></td><td>✓</td><td>✗</td><td>✗</td><td>Unique values, membership testing O(1)</td></tr>
                    <tr><td><strong>frozenset</strong></td><td>✗</td><td>✗</td><td>✓</td><td>Immutable set, usable as dict keys</td></tr>
                    <tr><td><strong>deque</strong></td><td>✓</td><td>✓</td><td>✗</td><td>O(1) append/pop both ends, sliding windows</td></tr>
                    <tr><td><strong>bytes</strong></td><td>✗</td><td>✓</td><td>✓</td><td>Binary data, serialization, network I/O</td></tr>
                    <tr><td><strong>bytearray</strong></td><td>✓</td><td>✓</td><td>✗</td><td>Mutable binary buffers</td></tr>
                </table>

                <h3>2. Time Complexity — What Every Dev Must Know</h3>
                <table>
                    <tr><th>Operation</th><th>list</th><th>dict</th><th>set</th></tr>
                    <tr><td>Lookup by index/key</td><td>O(1)</td><td>O(1)</td><td>—</td></tr>
                    <tr><td>Search (x in ...)</td><td>O(n)</td><td>O(1)</td><td>O(1)</td></tr>
                    <tr><td>Insert/Append</td><td>O(1) end, O(n) middle</td><td>O(1)</td><td>O(1)</td></tr>
                    <tr><td>Delete</td><td>O(n)</td><td>O(1)</td><td>O(1)</td></tr>
                    <tr><td>Sort</td><td>O(n log n)</td><td>—</td><td>—</td></tr>
                    <tr><td>Iteration</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
                </table>
                <p><strong>Real-world impact:</strong> Checking if an item exists in a list of 1M elements = ~50ms. In a set = ~0.00005ms. That's <strong>1,000,000x faster</strong>. Always use sets/dicts for membership testing.</p>

                <h3>3. Python Memory Model</h3>
                <div class="info-box">
                    <div class="box-title">⚡ Everything Is An Object on the Heap</div>
                    <div class="box-content">Variables are <strong>references</strong> (pointers), not boxes. <code>a = [1,2,3]</code> creates a list on the heap; <code>a</code> points to it. <code>b = a</code> makes both point to the <strong>same list</strong>. This is <strong>aliasing</strong> — the #1 source of bugs in beginner Python code.</div>
                </div>
                <p><strong>Reference Counting:</strong> Each object tracks how many names reference it. When count = 0, freed immediately. <code>del</code> decrements the count, doesn't necessarily free memory.</p>
                <p><strong>Integer Interning:</strong> Python caches integers <strong>-5 to 256</strong>. So <code>a = 100; b = 100; a is b</code> → True. But <code>a = 1000; b = 1000; a is b</code> → may be False. Never use <code>is</code> for value comparison.</p>
                <p><strong>Garbage Collection:</strong> 3 generations (gen0, gen1, gen2). New objects in gen0. Survivors promoted. Use <code>gc.collect()</code> after deleting large ML models.</p>

                <h3>4. Generators & Iterators — The Heart of Python</h3>
                <div class="info-box">
                    <div class="box-title">🔄 Lazy Evaluation</div>
                    <div class="box-content"><code>yield</code> suspends state, <code>return</code> terminates. A list of 1B items = ~8GB. A generator = ~100 bytes. The <strong>Iterator Protocol</strong>: any object with <code>__iter__</code> + <code>__next__</code>. Generator expressions: <code>(x**2 for x in range(10**9))</code> — O(1) memory.</div>
                </div>
                <p><strong>yield from:</strong> Delegates to sub-generator. Forwards <code>send()</code> and <code>throw()</code>. Essential for building composable data pipelines.</p>
                <p><strong>send():</strong> Two-way communication with generators (coroutines). <code>value = yield result</code> — both receives and produces values.</p>

                <h3>5. Closures & First-Class Functions</h3>
                <p>Functions are first-class objects — passed as args, returned, assigned. A <strong>closure</strong> captures variables from enclosing scope. Foundation of decorators, callbacks, and functional programming.</p>

                <h3>6. Critical Python Gotchas for Projects</h3>
                <div class="callout warning">
                    <div class="callout-title">⚠️ The 5 Deadliest Python Traps</div>
                    <strong>1. Mutable Default Args:</strong> <code>def f(x, lst=[]):</code> — list shared across ALL calls. Fix: <code>lst=None</code>.<br>
                    <strong>2. Late Binding Closures:</strong> <code>[lambda: i for i in range(5)]</code> — all return 4! Fix: <code>lambda i=i: i</code>.<br>
                    <strong>3. Shallow Copy:</strong> <code>list(a)</code> copies outer list but shares inner objects.<br>
                    <strong>4. String Concatenation:</strong> <code>s += "text"</code> in a loop creates new string every time — O(n²). Use <code>''.join(parts)</code>.<br>
                    <strong>5. Circular Imports:</strong> Module A imports B, B imports A → ImportError. Fix: restructure or lazy import.
                </div>

                <h3>7. Error Handling for Production Projects</h3>
                <div class="info-box">
                    <div class="box-title">🛡️ Exception Hierarchy You Must Know</div>
                    <div class="box-content">
                        <code>BaseException</code> → <code>Exception</code> (catch this) → <code>ValueError</code>, <code>TypeError</code>, <code>KeyError</code>, <code>FileNotFoundError</code>, <code>ConnectionError</code>...<br>
                        <strong>Rules:</strong> (1) Never catch bare <code>except:</code>. (2) Catch specific exceptions. (3) Use <code>else</code> for success path. (4) <code>finally</code> always runs. (5) Create custom exceptions for your project.
                    </div>
                </div>

                <h3>8. collections Module — Power Tools</h3>
                <table>
                    <tr><th>Class</th><th>Purpose</th><th>Project Use Case</th></tr>
                    <tr><td><strong>defaultdict</strong></td><td>Dict with default factory</td><td>Group data: <code>defaultdict(list)</code></td></tr>
                    <tr><td><strong>Counter</strong></td><td>Count hashable objects</td><td>Label distribution, word frequency</td></tr>
                    <tr><td><strong>namedtuple</strong></td><td>Lightweight immutable class</td><td>Return multiple named values</td></tr>
                    <tr><td><strong>deque</strong></td><td>Double-ended queue</td><td>Sliding window, BFS, ring buffer</td></tr>
                    <tr><td><strong>ChainMap</strong></td><td>Stack multiple dicts</td><td>Config layers: defaults → env → CLI</td></tr>
                    <tr><td><strong>OrderedDict</strong></td><td>Ordered dict (legacy)</td><td><code>move_to_end()</code> for LRU cache</td></tr>
                </table>

                <h3>9. itertools — Memory-Efficient Pipelines</h3>
                <table>
                    <tr><th>Function</th><th>What It Does</th><th>Project Use</th></tr>
                    <tr><td><code>chain()</code></td><td>Concatenate iterables lazily</td><td>Merge data files</td></tr>
                    <tr><td><code>islice()</code></td><td>Slice any iterator</td><td>Take first N from generator</td></tr>
                    <tr><td><code>groupby()</code></td><td>Group consecutive elements</td><td>Process sorted logs by date</td></tr>
                    <tr><td><code>product()</code></td><td>Cartesian product</td><td>Hyperparameter grid</td></tr>
                    <tr><td><code>combinations()</code></td><td>All r-length combos</td><td>Feature interaction pairs</td></tr>
                    <tr><td><code>starmap()</code></td><td>map() with unpacked args</td><td>Apply function to paired data</td></tr>
                    <tr><td><code>accumulate()</code></td><td>Running accumulator</td><td>Cumulative sums, running max</td></tr>
                    <tr><td><code>tee()</code></td><td>Clone iterator N times</td><td>Multiple passes over stream</td></tr>
                </table>

                <h3>10. File I/O for Real Projects</h3>
                <table>
                    <tr><th>Format</th><th>Read</th><th>Write</th><th>Best For</th></tr>
                    <tr><td>JSON</td><td><code>json.load(f)</code></td><td><code>json.dump(obj, f)</code></td><td>Configs, API responses</td></tr>
                    <tr><td>CSV</td><td><code>csv.DictReader(f)</code></td><td><code>csv.DictWriter(f)</code></td><td>Tabular data (small)</td></tr>
                    <tr><td>YAML</td><td><code>yaml.safe_load(f)</code></td><td><code>yaml.dump(obj, f)</code></td><td>Config files</td></tr>
                    <tr><td>Pickle</td><td><code>pickle.load(f)</code></td><td><code>pickle.dump(obj, f)</code></td><td>Python objects, models</td></tr>
                    <tr><td>Parquet</td><td><code>pd.read_parquet()</code></td><td><code>df.to_parquet()</code></td><td>Large DataFrames (fast)</td></tr>
                    <tr><td>SQLite</td><td><code>sqlite3.connect()</code></td><td>SQL queries</td><td>Local database</td></tr>
                </table>

                <h3>11. pathlib — Modern File Handling</h3>
                <p>Stop using <code>os.path.join()</code>. Use <code>pathlib.Path</code>: <code>Path('data') / 'train' / 'images'</code>. Methods: <code>.glob()</code>, <code>.read_text()</code>, <code>.mkdir(parents=True)</code>, <code>.exists()</code>, <code>.suffix</code>, <code>.stem</code>. Cross-platform, readable, powerful.</p>

                <h3>12. Virtual Environments & Dependency Management</h3>
                <table>
                    <tr><th>Tool</th><th>Best For</th><th>Key Feature</th></tr>
                    <tr><td>venv</td><td>Simple projects</td><td>Built-in, lightweight</td></tr>
                    <tr><td>conda</td><td>DS/ML (C deps)</td><td>Handles CUDA, MKL, OpenCV</td></tr>
                    <tr><td>poetry</td><td>Modern packaging</td><td>Lock files, deterministic builds</td></tr>
                    <tr><td>uv</td><td>Speed</td><td>10-100x faster pip (Rust-based)</td></tr>
                    <tr><td>pip-tools</td><td>Requirements pinning</td><td><code>pip-compile</code> for lock files</td></tr>
                </table>

                <h3>13. Project Structure Template</h3>
                <div class="code-block">my_project/
├── src/
│   └── my_package/
│       ├── __init__.py
│       ├── data/           # Data loading & processing
│       ├── models/         # Model definitions
│       ├── training/       # Training loops
│       ├── evaluation/     # Metrics & evaluation
│       ├── serving/        # API endpoints
│       └── utils/          # Shared utilities
├── tests/
│   ├── conftest.py        # Shared fixtures
│   ├── test_data.py
│   └── test_models.py
├── configs/               # YAML/JSON configs
├── notebooks/             # EDA notebooks
├── scripts/               # CLI scripts
├── pyproject.toml         # Modern Python packaging
├── Dockerfile
├── Makefile               # Common commands
└── README.md</div>

                <h3>14. String Operations for Data Cleaning</h3>
                <p><strong>f-strings (3.6+):</strong> <code>f"{accuracy:.2%}"</code> → "95.23%". <code>f"{x=}"</code> (3.8+) → "x=42" for debugging. <code>f"{name!r}"</code> → shows repr. <strong>regex:</strong> <code>re.compile(pattern)</code> for repeated use. <code>re.sub()</code> for cleaning. <code>re.findall()</code> for extraction. Always compile patterns used in loops.</p>

                <h3>15. Command-Line Interface (CLI) Tools</h3>
                <p><strong>argparse:</strong> Built-in CLI parsing. <strong>click:</strong> Decorator-based, more Pythonic. <strong>typer:</strong> Modern, uses type hints. Every production project needs a CLI for: training, evaluation, data processing, deployment scripts.</p>
            </div>`,
        code: `
            <div class="section">
                <h2>💻 Python Fundamentals — Project Code</h2>

                <h3>1. Generator Pipeline — Process Any Size Data</h3>
                <div class="code-block"><span class="keyword">import</span> json
<span class="keyword">from</span> pathlib <span class="keyword">import</span> Path

<span class="keyword">def</span> <span class="function">read_jsonl</span>(filepath):
    <span class="string">"""Read JSON Lines file lazily — handles any size."""</span>
    <span class="keyword">with</span> <span class="function">open</span>(filepath) <span class="keyword">as</span> f:
        <span class="keyword">for</span> line <span class="keyword">in</span> f:
            <span class="keyword">yield</span> json.loads(line.strip())

<span class="keyword">def</span> <span class="function">filter_records</span>(records, min_score=<span class="number">0.5</span>):
    <span class="keyword">for</span> rec <span class="keyword">in</span> records:
        <span class="keyword">if</span> rec.get(<span class="string">'score'</span>, <span class="number">0</span>) >= min_score:
            <span class="keyword">yield</span> rec

<span class="keyword">def</span> <span class="function">batch</span>(iterable, size=<span class="number">64</span>):
    <span class="string">"""Batch any iterable into fixed-size chunks."""</span>
    <span class="keyword">from</span> itertools <span class="keyword">import</span> islice
    it = <span class="function">iter</span>(iterable)
    <span class="keyword">while</span> chunk := <span class="function">list</span>(islice(it, size)):
        <span class="keyword">yield</span> chunk

<span class="comment"># Compose into pipeline — still O(1) memory!</span>
pipeline = batch(filter_records(read_jsonl(<span class="string">"data.jsonl"</span>)), size=<span class="number">32</span>)
<span class="keyword">for</span> chunk <span class="keyword">in</span> pipeline:
    process(chunk)  <span class="comment"># Only 32 records in memory at a time</span></div>

                <h3>2. Coroutine Pattern — Running Statistics</h3>
                <div class="code-block"><span class="keyword">def</span> <span class="function">running_stats</span>():
    <span class="string">"""Coroutine that computes running mean & variance."""</span>
    n = <span class="number">0</span>
    mean = <span class="number">0.0</span>
    M2 = <span class="number">0.0</span>
    <span class="keyword">while</span> <span class="keyword">True</span>:
        x = <span class="keyword">yield</span> {<span class="string">'mean'</span>: mean, <span class="string">'var'</span>: M2/n <span class="keyword">if</span> n > <span class="number">0</span> <span class="keyword">else</span> <span class="number">0</span>, <span class="string">'n'</span>: n}
        n += <span class="number">1</span>
        delta = x - mean
        mean += delta / n
        M2 += delta * (x - mean)  <span class="comment"># Welford's algorithm — numerically stable</span>

stats = running_stats()
<span class="function">next</span>(stats)  <span class="comment"># Prime</span>
stats.send(<span class="number">10</span>)   <span class="comment"># {'mean': 10.0, 'var': 0, 'n': 1}</span>
stats.send(<span class="number">20</span>)   <span class="comment"># {'mean': 15.0, 'var': 25.0, 'n': 2}</span></div>

                <h3>3. Custom Exception Hierarchy for Projects</h3>
                <div class="code-block"><span class="comment"># Define project-specific exceptions</span>
<span class="keyword">class</span> <span class="class">ProjectError</span>(<span class="function">Exception</span>):
    <span class="string">"""Base exception for the project."""</span>

<span class="keyword">class</span> <span class="class">DataValidationError</span>(ProjectError):
    <span class="keyword">def</span> <span class="function">__init__</span>(self, column, expected, actual):
        self.column = column
        <span class="keyword">super</span>().__init__(
            <span class="string">f"Column '{column}': expected {expected}, got {actual}"</span>
        )

<span class="keyword">class</span> <span class="class">ModelNotTrainedError</span>(ProjectError):
    <span class="keyword">pass</span>

<span class="comment"># Usage with proper error handling</span>
<span class="keyword">def</span> <span class="function">load_and_validate</span>(path):
    <span class="keyword">try</span>:
        df = pd.read_csv(path)
    <span class="keyword">except</span> FileNotFoundError:
        <span class="keyword">raise</span> DataValidationError(<span class="string">"file"</span>, <span class="string">"exists"</span>, <span class="string">"missing"</span>)
    <span class="keyword">except</span> pd.errors.EmptyDataError:
        <span class="keyword">raise</span> DataValidationError(<span class="string">"data"</span>, <span class="string">"non-empty"</span>, <span class="string">"empty file"</span>)
    <span class="keyword">else</span>:
        <span class="function">print</span>(<span class="string">f"Loaded {len(df)} rows"</span>)
        <span class="keyword">return</span> df
    <span class="keyword">finally</span>:
        <span class="function">print</span>(<span class="string">"Load attempt complete"</span>)</div>

                <h3>4. Closures & Mutable Default Trap</h3>
                <div class="code-block"><span class="comment"># ⚠️ THE #1 PYTHON BUG — Mutable default argument</span>
<span class="keyword">def</span> <span class="function">bad_append</span>(item, lst=[]):  <span class="comment"># List shared across ALL calls!</span>
    lst.append(item)
    <span class="keyword">return</span> lst
bad_append(<span class="number">1</span>)  <span class="comment"># [1]</span>
bad_append(<span class="number">2</span>)  <span class="comment"># [1, 2] ← SURPRISE!</span>

<span class="comment"># ✅ CORRECT — use None sentinel</span>
<span class="keyword">def</span> <span class="function">good_append</span>(item, lst=<span class="keyword">None</span>):
    <span class="keyword">if</span> lst <span class="keyword">is</span> <span class="keyword">None</span>:
        lst = []
    lst.append(item)
    <span class="keyword">return</span> lst</div>

                <h3>5. collections in Action</h3>
                <div class="code-block"><span class="keyword">from</span> collections <span class="keyword">import</span> defaultdict, Counter, deque

<span class="comment"># defaultdict — group data without KeyError</span>
samples_by_label = defaultdict(<span class="keyword">list</span>)
<span class="keyword">for</span> feat, label <span class="keyword">in</span> <span class="function">zip</span>(features, labels):
    samples_by_label[label].append(feat)

<span class="comment"># Counter — class distribution + top-N</span>
dist = Counter(y_train)
<span class="function">print</span>(dist.most_common(<span class="number">3</span>))
imbalance_ratio = dist.most_common()[<span class="number">0</span>][<span class="number">1</span>] / dist.most_common()[-<span class="number">1</span>][<span class="number">1</span>]

<span class="comment"># deque — sliding window for streaming</span>
window = deque(maxlen=<span class="number">5</span>)
<span class="keyword">for</span> val <span class="keyword">in</span> data_stream:
    window.append(val)
    moving_avg = <span class="function">sum</span>(window) / <span class="function">len</span>(window)</div>

                <h3>6. CLI Tool with argparse</h3>
                <div class="code-block"><span class="keyword">import</span> argparse

<span class="keyword">def</span> <span class="function">main</span>():
    parser = argparse.ArgumentParser(description=<span class="string">"Train ML model"</span>)
    parser.add_argument(<span class="string">"--data"</span>, required=<span class="keyword">True</span>, help=<span class="string">"Path to data"</span>)
    parser.add_argument(<span class="string">"--model"</span>, choices=[<span class="string">"rf"</span>, <span class="string">"xgb"</span>, <span class="string">"lgbm"</span>], default=<span class="string">"rf"</span>)
    parser.add_argument(<span class="string">"--epochs"</span>, type=<span class="keyword">int</span>, default=<span class="number">10</span>)
    parser.add_argument(<span class="string">"--lr"</span>, type=<span class="keyword">float</span>, default=<span class="number">0.001</span>)
    parser.add_argument(<span class="string">"--dry-run"</span>, action=<span class="string">"store_true"</span>)
    args = parser.parse_args()
    
    <span class="function">print</span>(<span class="string">f"Training {args.model} on {args.data}"</span>)
    <span class="comment"># python train.py --data data.csv --model xgb --epochs 50</span>

<span class="keyword">if</span> __name__ == <span class="string">"__main__"</span>:
    main()</div>

                <h3>7. Advanced Comprehensions & Modern Python</h3>
                <div class="code-block"><span class="comment"># Walrus operator (:=) — assign + use (3.8+)</span>
<span class="keyword">if</span> (n := <span class="function">len</span>(data)) > <span class="number">1000</span>:
    <span class="function">print</span>(<span class="string">f"Large dataset: {n} samples"</span>)

<span class="comment"># Dict merge (3.9+)</span>
config = defaults | overrides

<span class="comment"># match-case — Structural Pattern Matching (3.10+)</span>
<span class="keyword">match</span> command:
    <span class="keyword">case</span> {<span class="string">"action"</span>: <span class="string">"train"</span>, <span class="string">"model"</span>: model_name}:
        train(model_name)
    <span class="keyword">case</span> {<span class="string">"action"</span>: <span class="string">"predict"</span>, <span class="string">"data"</span>: path}:
        predict(path)
    <span class="keyword">case</span> _:
        <span class="function">print</span>(<span class="string">"Unknown command"</span>)

<span class="comment"># Extended unpacking</span>
first, *middle, last = sorted(scores)

<span class="comment"># Nested dict comprehension</span>
metrics = {
    model: {metric: score <span class="keyword">for</span> metric, score <span class="keyword">in</span> results.items()}
    <span class="keyword">for</span> model, results <span class="keyword">in</span> all_results.items()
}</div>

                <h3>8. Regex for Data Cleaning</h3>
                <div class="code-block"><span class="keyword">import</span> re

<span class="comment"># Compile patterns used repeatedly (10x faster)</span>
EMAIL = re.compile(<span class="string">r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'</span>)
PHONE = re.compile(<span class="string">r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'</span>)

<span class="comment"># Extract all emails from text</span>
emails = EMAIL.findall(text)

<span class="comment"># Clean text for NLP</span>
<span class="keyword">def</span> <span class="function">clean_text</span>(text):
    text = re.sub(<span class="string">r'http\S+'</span>, <span class="string">''</span>, text)        <span class="comment"># Remove URLs</span>
    text = re.sub(<span class="string">r'[^a-zA-Z\s]'</span>, <span class="string">''</span>, text)    <span class="comment"># Keep only letters</span>
    text = re.sub(<span class="string">r'\s+'</span>, <span class="string">' '</span>, text).strip()   <span class="comment"># Normalize whitespace</span>
    <span class="keyword">return</span> text.lower()</div>

                <h3>9. Configuration Management</h3>
                <div class="code-block"><span class="keyword">import</span> json, yaml
<span class="keyword">from</span> pathlib <span class="keyword">import</span> Path
<span class="keyword">from</span> dataclasses <span class="keyword">import</span> dataclass, asdict

<span class="preprocessor">@dataclass</span>
<span class="keyword">class</span> <span class="class">Config</span>:
    model_name: <span class="keyword">str</span> = <span class="string">"random_forest"</span>
    learning_rate: <span class="keyword">float</span> = <span class="number">0.001</span>
    batch_size: <span class="keyword">int</span> = <span class="number">32</span>
    epochs: <span class="keyword">int</span> = <span class="number">100</span>
    data_path: <span class="keyword">str</span> = <span class="string">"data/train.csv"</span>
    
    <span class="preprocessor">@classmethod</span>
    <span class="keyword">def</span> <span class="function">from_yaml</span>(cls, path):
        <span class="keyword">with</span> <span class="function">open</span>(path) <span class="keyword">as</span> f:
            <span class="keyword">return</span> cls(**yaml.safe_load(f))
    
    <span class="keyword">def</span> <span class="function">save</span>(self, path):
        Path(path).write_text(json.dumps(asdict(self), indent=<span class="number">2</span>))

config = Config.from_yaml(<span class="string">"configs/experiment.yaml"</span>)</div>
            </div>`,
        interview: `
            <div class="section">
                <h2>🎯 Python Fundamentals — Interview Questions</h2>
                <div class="interview-box"><strong>Q1: List vs tuple — when to use which?</strong><p><strong>Answer:</strong> Tuples: immutable, hashable (dict keys), less memory. Lists: mutable, growable. Use tuples for fixed data (coordinates, config). Use lists for collections that change. Tuples signal "this shouldn't be modified."</p></div>
                <div class="interview-box"><strong>Q2: How does Python's GIL affect DS?</strong><p><strong>Answer:</strong> GIL prevents multi-threading for CPU-bound Python. But NumPy/Pandas release the GIL during C operations. For pure Python CPU work → multiprocessing. For I/O → threading works. For data science, the GIL rarely matters.</p></div>
                <div class="interview-box"><strong>Q3: Shallow vs deep copy?</strong><p><strong>Answer:</strong> <code>copy.copy()</code>: outer container copied, inner objects shared. <code>copy.deepcopy()</code>: everything copied recursively. Real trap: <code>df2 = df</code> is NOT a copy — it's aliasing. Use <code>df.copy()</code>.</p></div>
                <div class="interview-box"><strong>Q4: What is the mutable default argument trap?</strong><p><strong>Answer:</strong> <code>def f(x, lst=[]):</code> — default list created ONCE and shared. Fix: <code>lst=None; if lst is None: lst = []</code>. #1 Python interview gotcha.</p></div>
                <div class="interview-box"><strong>Q5: Why are generators critical for large data?</strong><p><strong>Answer:</strong> O(1) memory. 1B items as list = 8GB. As generator = 100 bytes. Use for: file processing, streaming, batch training. <code>yield from</code> for composition.</p></div>
                <div class="interview-box"><strong>Q6: Explain LEGB scope rule.</strong><p><strong>Answer:</strong> Name lookup order: Local → Enclosing → Global → Built-in. <code>nonlocal</code> for enclosing scope, <code>global</code> for module. <code>list = [1]</code> shadows built-in <code>list()</code>.</p></div>
                <div class="interview-box"><strong>Q7: How to handle a 10GB CSV?</strong><p><strong>Answer:</strong> (1) <code>pd.read_csv(chunksize=N)</code>, (2) <code>usecols=['needed']</code>, (3) <code>dtype={'col':'int32'}</code>, (4) Dask, (5) DuckDB for SQL on CSV, (6) Polars for Rust-speed.</p></div>
                <div class="interview-box"><strong>Q8: Dict lookup O(1) vs list search O(n)?</strong><p><strong>Answer:</strong> Dicts use hash tables. Key → hash → slot index. O(1) average. Lists scan linearly. <code>x in set</code> is O(1) but <code>x in list</code> is O(n). For 1M items: microseconds vs milliseconds.</p></div>
                <div class="interview-box"><strong>Q9: Explain Python's garbage collection.</strong><p><strong>Answer:</strong> (1) Reference counting — freed at count=0. (2) Cyclic GC — detects A→B→A cycles. 3 generations. <code>gc.collect()</code> after deleting large models.</p></div>
                <div class="interview-box"><strong>Q10: What is __slots__?</strong><p><strong>Answer:</strong> Replaces per-instance <code>__dict__</code> with fixed array. ~40% memory savings. Use for millions of small objects. Trade-off: no dynamic attributes.</p></div>
                <div class="interview-box"><strong>Q11: How do you structure a Python project?</strong><p><strong>Answer:</strong> <code>src/package/</code> layout. <code>pyproject.toml</code> for config. <code>tests/</code> with pytest. <code>configs/</code> for YAML. <code>Makefile</code> for common commands. Separate data, models, training, serving.</p></div>
                <div class="interview-box"><strong>Q12: What's the difference between <code>is</code> and <code>==</code>?</strong><p><strong>Answer:</strong> <code>==</code> checks value equality. <code>is</code> checks identity (same memory). Use <code>is</code> only for singletons: <code>x is None</code>, <code>x is True</code>. Integer interning makes <code>256 is 256</code> True but <code>1000 is 1000</code> may be False.</p></div>
            </div>`
    },

"numpy": {
    concepts: `
            <div class="section">
                <h2>🔢 NumPy — Complete Deep Dive</h2>

                <div class="info-box">
                    <div class="box-title">⚡ Why NumPy Is 50-100x Faster</div>
                    <div class="box-content">(1) <strong>Contiguous memory</strong> — CPU cache-friendly. (2) <strong>Compiled C loops</strong>. (3) <strong>SIMD instructions</strong> — 4-8 floats simultaneously. Python list: array of pointers to objects. NumPy: raw typed data in a block.</div>
                </div>

                <h3>1. ndarray Internals</h3>
                <table>
                    <tr><th>Feature</th><th>Python List</th><th>NumPy ndarray</th></tr>
                    <tr><td>Storage</td><td>Pointers to objects</td><td>Contiguous typed data</td></tr>
                    <tr><td>Memory per int</td><td>~28 bytes + pointer</td><td>8 bytes (int64)</td></tr>
                    <tr><td>Operations</td><td>Python loop</td><td>Compiled C/Fortran</td></tr>
                    <tr><td>SIMD</td><td>Impossible</td><td>CPU vector instructions</td></tr>
                </table>

                <h3>2. Memory Layout & Strides</h3>
                <div class="info-box">
                    <div class="box-title">🧠 Strides = The Secret Behind Views</div>
                    <div class="box-content">Every ndarray has <strong>strides</strong> — bytes to jump in each dimension. For (3,4) float64: strides = (32, 8). Slicing creates <strong>views</strong> (no copy) by adjusting strides. <code>arr[::2]</code> doubles row stride. <strong>C-order</strong> (row-major): rows contiguous. <strong>Fortran-order</strong>: columns contiguous. Iterate along last axis for best performance.</div>
                </div>

                <h3>3. Broadcasting Rules</h3>
                <div class="info-box">
                    <div class="box-title">🎯 Rules (Right to Left)</div>
                    <div class="box-content">Two arrays compatible when, for each trailing dim: dims are equal OR one is 1. (5,3,1) + (1,4) → (5,3,4). The "1" dims stretch virtually — no memory copied. Common: <code>X - X.mean(axis=0)</code> → (1000,5) - (5,) works!</div>
                </div>

                <h3>4. Universal Functions (ufuncs)</h3>
                <p>Vectorized element-wise functions. Advanced methods: <code>.reduce()</code> (fold), <code>.accumulate()</code> (running total), <code>.outer()</code> (outer product), <code>.at()</code> (unbuffered in-place). Create custom with <code>np.frompyfunc()</code>.</p>

                <h3>5. dtype Selection for Projects</h3>
                <table>
                    <tr><th>dtype</th><th>Bytes</th><th>When to Use</th></tr>
                    <tr><td>float32</td><td>4</td><td>Deep learning, GPU (50% less memory)</td></tr>
                    <tr><td>float64</td><td>8</td><td>Default. Statistics, scientific computing</td></tr>
                    <tr><td>float16</td><td>2</td><td>Mixed-precision inference</td></tr>
                    <tr><td>int32</td><td>4</td><td>Indices, counts</td></tr>
                    <tr><td>int8</td><td>1</td><td>Quantized models</td></tr>
                    <tr><td>bool</td><td>1</td><td>Masks for filtering</td></tr>
                </table>

                <h3>6. np.einsum — One Function for All Tensor Ops</h3>
                <p>Einstein summation: express ANY tensor operation. Matrix multiply: <code>'ik,kj->ij'</code>. Batch matmul: <code>'bij,bjk->bik'</code>. Trace: <code>'ii->'</code>. Often faster than chaining NumPy calls — avoids intermediate arrays.</p>

                <h3>7. Linear Algebra for ML Projects</h3>
                <ul>
                    <li><code>X.T @ X</code> → Gram matrix (basis of linear regression)</li>
                    <li><code>np.linalg.svd(X)</code> → PCA, dimensionality reduction</li>
                    <li><code>np.linalg.eigh(cov)</code> → Covariance eigenvectors</li>
                    <li><code>np.linalg.norm(X, axis=1)</code> → L2 norms for distances</li>
                    <li><code>np.linalg.lstsq(X, y)</code> → Stable linear regression</li>
                    <li><code>np.linalg.inv()</code> → AVOID! Use <code>solve()</code> instead (numerically stable)</li>
                </ul>

                <h3>8. Random Number Generation</h3>
                <p>Modern: <code>rng = np.random.default_rng(42)</code> (NumPy 1.17+). PCG64 algorithm, thread-safe. Old <code>np.random.seed(42)</code> is global, not thread-safe. Always use <code>default_rng()</code> in projects.</p>

                <h3>9. Image Processing with NumPy</h3>
                <p>Images are just 3D arrays: (height, width, channels). Crop: <code>img[100:200, 50:150]</code>. Resize: scipy. Normalize: <code>img / 255.0</code>. Augment: flip <code>img[:, ::-1]</code>, rotate with <code>scipy.ndimage</code>. Foundation of all computer vision.</p>
            </div>`,
        code: `
            <div class="section">
                <h2>💻 NumPy Project Code</h2>

                <h3>1. Feature Engineering with Broadcasting</h3>
                <div class="code-block"><span class="keyword">import</span> numpy <span class="keyword">as</span> np

<span class="comment"># Z-score normalization</span>
X = np.random.randn(<span class="number">1000</span>, <span class="number">5</span>)
X_norm = (X - X.mean(axis=<span class="number">0</span>)) / X.std(axis=<span class="number">0</span>)  <span class="comment"># (1000,5) - (5,)</span>

<span class="comment"># Min-Max scaling</span>
X_scaled = (X - X.min(<span class="number">0</span>)) / (X.max(<span class="number">0</span>) - X.min(<span class="number">0</span>) + <span class="number">1e-8</span>)

<span class="comment"># Pairwise Euclidean distance matrix</span>
diff = X[:, np.newaxis, :] - X[np.newaxis, :, :]  <span class="comment"># (N,1,D)-(1,N,D)</span>
dist_matrix = np.sqrt((diff ** <span class="number">2</span>).sum(axis=-<span class="number">1</span>))  <span class="comment"># (N,N)</span></div>

                <h3>2. Boolean Masking & Advanced Indexing</h3>
                <div class="code-block"><span class="comment"># Remove outliers (3-sigma rule)</span>
data = np.random.randn(<span class="number">10000</span>)
clean = data[np.abs(data - data.mean()) < <span class="number">3</span> * data.std()]

<span class="comment"># np.where — conditional replacement</span>
preds = np.array([<span class="number">0.3</span>, <span class="number">0.7</span>, <span class="number">0.1</span>, <span class="number">0.9</span>])
labels = np.where(preds > <span class="number">0.5</span>, <span class="number">1</span>, <span class="number">0</span>)

<span class="comment"># np.select — multiple conditions</span>
conditions = [data < -<span class="number">1</span>, data > <span class="number">1</span>]
choices = [<span class="string">'low'</span>, <span class="string">'high'</span>]
category = np.select(conditions, choices, default=<span class="string">'mid'</span>)

<span class="comment"># Fancy indexing — sample without replacement</span>
rng = np.random.default_rng(<span class="number">42</span>)
idx = rng.choice(<span class="function">len</span>(X), size=<span class="number">500</span>, replace=<span class="keyword">False</span>)
X_sample = X[idx]</div>

                <h3>3. einsum for Complex Operations</h3>
                <div class="code-block"><span class="comment"># Matrix multiply</span>
C = np.einsum(<span class="string">'ik,kj->ij'</span>, A, B)

<span class="comment"># Batch matrix multiply (deep learning)</span>
batch_result = np.einsum(<span class="string">'bij,bjk->bik'</span>, batch_A, batch_B)

<span class="comment"># Cosine similarity matrix</span>
norms = np.linalg.norm(X, axis=<span class="number">1</span>, keepdims=<span class="keyword">True</span>)
X_normed = X / norms
sim = np.einsum(<span class="string">'ij,kj->ik'</span>, X_normed, X_normed)</div>

                <h3>4. Implement Linear Regression from Scratch</h3>
                <div class="code-block"><span class="comment"># Normal equation: w = (X^T X)^(-1) X^T y</span>
<span class="comment"># Better: use lstsq for numerical stability</span>
X_b = np.c_[np.ones((<span class="function">len</span>(X), <span class="number">1</span>)), X]  <span class="comment"># Add bias column</span>
w, residuals, rank, sv = np.linalg.lstsq(X_b, y, rcond=<span class="keyword">None</span>)
y_pred = X_b @ w
mse = ((y - y_pred) ** <span class="number">2</span>).mean()
r2 = <span class="number">1</span> - ((y - y_pred)**<span class="number">2</span>).sum() / ((y - y.mean())**<span class="number">2</span>).sum()</div>

                <h3>5. Memory-Mapped Files for Huge Data</h3>
                <div class="code-block"><span class="comment"># Process arrays larger than RAM</span>
big = np.memmap(<span class="string">'huge.npy'</span>, dtype=np.float32,
    mode=<span class="string">'w+'</span>, shape=(<span class="number">1000000</span>, <span class="number">100</span>))
subset = big[<span class="number">5000</span>:<span class="number">6000</span>]  <span class="comment"># Only reads 1000 rows from disk</span>

<span class="comment"># Structured arrays — mixed types without Pandas</span>
dt = np.dtype([(<span class="string">'name'</span>, <span class="string">'U10'</span>), (<span class="string">'age'</span>, <span class="string">'i4'</span>), (<span class="string">'score'</span>, <span class="string">'f8'</span>)])
data = np.array([(<span class="string">'Alice'</span>, <span class="number">30</span>, <span class="number">95.5</span>)], dtype=dt)</div>

                <h3>6. Implement PCA from Scratch</h3>
                <div class="code-block"><span class="keyword">def</span> <span class="function">pca</span>(X, n_components):
    <span class="comment"># Center the data</span>
    X_centered = X - X.mean(axis=<span class="number">0</span>)
    <span class="comment"># Covariance matrix</span>
    cov = X_centered.T @ X_centered / (<span class="function">len</span>(X) - <span class="number">1</span>)
    <span class="comment"># Eigendecomposition</span>
    eigenvalues, eigenvectors = np.linalg.eigh(cov)
    <span class="comment"># Sort by largest eigenvalue</span>
    idx = eigenvalues.argsort()[::-<span class="number">1</span>][:n_components]
    components = eigenvectors[:, idx]
    <span class="comment"># Project data</span>
    X_pca = X_centered @ components
    explained_var = eigenvalues[idx] / eigenvalues.sum()
    <span class="keyword">return</span> X_pca, explained_var, components</div>
            </div>`,
            interview: `
            <div class="section">
                <h2>🎯 NumPy Interview Questions</h2>
                <div class="interview-box"><strong>Q1: Why is NumPy faster than Python lists?</strong><p><strong>Answer:</strong> (1) Contiguous memory (cache-friendly). (2) Compiled C loops. (3) SIMD instructions. Together: 50-100x speedup.</p></div>
                <div class="interview-box"><strong>Q2: View vs copy?</strong><p><strong>Answer:</strong> Slicing = view (shares data). Fancy indexing = copy. Check: <code>np.shares_memory(a, b)</code>. Views are dangerous: modifying view modifies original.</p></div>
                <div class="interview-box"><strong>Q3: Broadcasting rules?</strong><p><strong>Answer:</strong> Right-to-left: dims must equal or one is 1. (3,1) + (1,4) → (3,4). No memory copied. Gotcha: (3,) + (3,4) fails — reshape to (3,1).</p></div>
                <div class="interview-box"><strong>Q4: axis=0 vs axis=1?</strong><p><strong>Answer:</strong> axis=0: operate down rows (collapse rows). axis=1: across columns (collapse columns). (100,5): mean(axis=0)→(5,).  mean(axis=1)→(100,).</p></div>
                <div class="interview-box"><strong>Q5: Implement PCA with NumPy?</strong><p><strong>Answer:</strong> Center, compute covariance, eigendecompose (eigh), sort by eigenvalue, project onto top-k eigenvectors. Or SVD directly.</p></div>
                <div class="interview-box"><strong>Q6: np.dot vs @ vs einsum?</strong><p><strong>Answer:</strong> <code>@</code>: clean, broadcasts. <code>np.dot</code>: confusing for 3D+. <code>einsum</code>: most flexible, any tensor op. Use @ for readability.</p></div>
                <div class="interview-box"><strong>Q7: How to handle NaN?</strong><p><strong>Answer:</strong> <code>np.isnan()</code> detects. <code>np.nanmean()</code> ignores NaN. Gotcha: <code>NaN == NaN</code> is False (IEEE 754).</p></div>
                <div class="interview-box"><strong>Q8: C-order vs Fortran-order?</strong><p><strong>Answer:</strong> C: rows contiguous (default). Fortran: columns contiguous (LAPACK/BLAS). Iterate last axis for speed. Convert: <code>np.asfortranarray()</code>.</p></div>
            </div>`
},

"pandas": {
    concepts: `
            <div class="section">
                <h2>🐼 Pandas — Complete Deep Dive</h2>

                <div class="info-box">
                    <div class="box-title">⚡ DataFrame Internals — BlockManager</div>
                    <div class="box-content">A DataFrame is NOT a 2D array. Uses <strong>BlockManager</strong> — same-dtype columns stored in contiguous blocks. <strong>Column operations: fast</strong> (same block). <strong>Row iteration: slow</strong> (crosses blocks). This is why <code>df.iterrows()</code> is 100x slower than vectorized ops.</div>
                </div>

                <h3>1. The Golden Rules</h3>
                <div class="callout warning">
                    <div class="callout-title">⚠️ 5 Rules That Prevent 90% of Pandas Bugs</div>
                    <strong>1.</strong> Use <code>.loc</code> (label) and <code>.iloc</code> (position) — never chain indexing.<br>
                    <strong>2.</strong> <code>df.loc[0:5]</code> includes 5. <code>df.iloc[0:5]</code> excludes 5.<br>
                    <strong>3.</strong> <code>df[mask]['col'] = x</code> creates copy. Use <code>df.loc[mask, 'col'] = x</code>.<br>
                    <strong>4.</strong> <code>df2 = df</code> is NOT a copy. Use <code>df2 = df.copy()</code>.<br>
                    <strong>5.</strong> Always check <code>df.dtypes</code> and <code>df.isna().sum()</code> first.
                </div>

                <h3>2. GroupBy — Split-Apply-Combine</h3>
                <p>Most powerful Pandas operation. (1) Split → (2) Apply function → (3) Combine results. GroupBy is <strong>lazy</strong> — no computation until aggregation. Key methods:</p>
                <table>
                    <tr><th>Method</th><th>Output Shape</th><th>Use Case</th></tr>
                    <tr><td><code>agg()</code></td><td>Reduced (one row/group)</td><td>Sum, mean, count per group</td></tr>
                    <tr><td><code>transform()</code></td><td>Same as input</td><td>Fill with group mean, normalize within group</td></tr>
                    <tr><td><code>filter()</code></td><td>Subset of groups</td><td>Keep groups with N > 100</td></tr>
                    <tr><td><code>apply()</code></td><td>Flexible</td><td>Custom function per group</td></tr>
                </table>

                <h3>3. Pandas 2.0 — Major Changes</h3>
                <table>
                    <tr><th>Feature</th><th>Before (1.x)</th><th>After (2.0+)</th></tr>
                    <tr><td>Backend</td><td>NumPy only</td><td>Apache Arrow option</td></tr>
                    <tr><td>Copy semantics</td><td>Confusing</td><td>Copy-on-Write</td></tr>
                    <tr><td>String dtype</td><td><code>object</code></td><td><code>string[pyarrow]</code> (faster)</td></tr>
                    <tr><td>Nullable types</td><td>NaN for everything</td><td>pd.NA (proper null)</td></tr>
                </table>

                <h3>4. Polars vs Pandas</h3>
                <table>
                    <tr><th>Feature</th><th>Pandas</th><th>Polars</th></tr>
                    <tr><td>Speed</td><td>1x</td><td>5-50x (Rust)</td></tr>
                    <tr><td>Parallelism</td><td>Single-threaded</td><td>Multi-threaded auto</td></tr>
                    <tr><td>API</td><td>Eager</td><td>Lazy + Eager</td></tr>
                    <tr><td>Ecosystem</td><td>Massive</td><td>Growing fast</td></tr>
                    <tr><td>Use when</td><td>EDA, small-med data, legacy</td><td>Large data, production</td></tr>
                </table>

                <h3>5. Merge/Join Patterns</h3>
                <table>
                    <tr><th>Method</th><th>How</th><th>When</th></tr>
                    <tr><td><code>merge()</code></td><td>SQL-style joins on columns</td><td>Combine tables on shared keys</td></tr>
                    <tr><td><code>join()</code></td><td>Joins on index</td><td>Index-based combining</td></tr>
                    <tr><td><code>concat()</code></td><td>Stack along axis</td><td>Append rows/columns</td></tr>
                </table>
                <p><strong>Common pitfall:</strong> Merge produces more rows than expected = many-to-many join. Always check: <code>len(merged)</code> vs <code>len(left)</code>.</p>

                <h3>6. Memory Optimization Strategies</h3>
                <table>
                    <tr><th>Strategy</th><th>Savings</th><th>When</th></tr>
                    <tr><td>Category dtype</td><td>90%+</td><td>Few unique strings</td></tr>
                    <tr><td>Downcast numerics</td><td>50-75%</td><td>int64 → int32/int16</td></tr>
                    <tr><td>Sparse arrays</td><td>80%+</td><td>Mostly zeros/NaN</td></tr>
                    <tr><td>PyArrow backend</td><td>30-50%</td><td>String-heavy data</td></tr>
                    <tr><td>Read only needed columns</td><td>Variable</td><td><code>usecols=['a','b']</code></td></tr>
                </table>

                <h3>7. Window Functions for Time Series</h3>
                <p><code>.rolling(N)</code>: fixed sliding window. <code>.expanding()</code>: cumulative. <code>.ewm(span=N)</code>: exponentially weighted. All support <code>.mean()</code>, <code>.std()</code>, <code>.apply()</code>. Essential for: lag features, moving averages, volatility, Bollinger bands.</p>

                <h3>8. Pivot Tables & Crosstab</h3>
                <p><code>df.pivot_table(values, index, columns, aggfunc)</code> — summarize data by two categorical dimensions. <code>pd.crosstab()</code> — frequency table of two categorical columns. Essential for EDA and business reporting.</p>

                <h3>9. Method Chaining Pattern</h3>
                <p>Fluent API: <code>.assign()</code> instead of <code>df['col']=</code>. <code>.pipe(func)</code> for custom. <code>.query('col > 5')</code> for readable filters. No intermediate variables = cleaner, reproducible pipelines.</p>
            </div>`,
        code: `
            <div class="section">
                <h2>💻 Pandas Project Code</h2>

                <h3>1. Complete Data Loading & Cleaning Pipeline</h3>
                <div class="code-block"><span class="keyword">import</span> pandas <span class="keyword">as</span> pd
<span class="keyword">import</span> numpy <span class="keyword">as</span> np

<span class="keyword">def</span> <span class="function">load_and_clean</span>(path, config):
    <span class="string">"""Production data loading pipeline."""</span>
    df = (
        pd.read_csv(path, usecols=config[<span class="string">'columns'</span>],
            dtype=config.get(<span class="string">'dtypes'</span>, <span class="keyword">None</span>),
            parse_dates=config.get(<span class="string">'date_cols'</span>, []))
        .rename(columns=<span class="keyword">str</span>.lower)
        .drop_duplicates()
        .assign(
            date=<span class="keyword">lambda</span> df: pd.to_datetime(df[<span class="string">'date'</span>]),
            revenue=<span class="keyword">lambda</span> df: df[<span class="string">'price'</span>] * df[<span class="string">'qty'</span>]
        )
        .query(<span class="string">'revenue > 0'</span>)
        .pipe(optimize_dtypes)
    )
    <span class="keyword">return</span> df</div>

                <h3>2. GroupBy — Beyond Basics</h3>
                <div class="code-block"><span class="comment"># Named aggregation</span>
summary = df.groupby(<span class="string">'category'</span>).agg(
    total=(<span class="string">'revenue'</span>, <span class="string">'sum'</span>),
    avg_price=(<span class="string">'price'</span>, <span class="string">'mean'</span>),
    n_orders=(<span class="string">'order_id'</span>, <span class="string">'nunique'</span>),
    top_product=(<span class="string">'product'</span>, <span class="keyword">lambda</span> x: x.value_counts().index[<span class="number">0</span>])
)

<span class="comment"># Transform — normalize within groups</span>
df[<span class="string">'pct_of_group'</span>] = df.groupby(<span class="string">'cat'</span>)[<span class="string">'rev'</span>].transform(
    <span class="keyword">lambda</span> x: x / x.sum() * <span class="number">100</span>
)

<span class="comment"># Filter — keep only groups with enough data</span>
df_filtered = df.groupby(<span class="string">'user'</span>).filter(<span class="keyword">lambda</span> x: <span class="function">len</span>(x) >= <span class="number">5</span>)</div>

                <h3>3. Time Series Feature Engineering</h3>
                <div class="code-block"><span class="keyword">def</span> <span class="function">create_time_features</span>(df, date_col, target_col):
    <span class="string">"""Generate time series features for ML."""</span>
    df = df.sort_values(date_col).copy()
    
    <span class="comment"># Lag features</span>
    <span class="keyword">for</span> lag <span class="keyword">in</span> [<span class="number">1</span>, <span class="number">3</span>, <span class="number">7</span>, <span class="number">14</span>, <span class="number">30</span>]:
        df[<span class="string">f'lag_{lag}'</span>] = df[target_col].shift(lag)
    
    <span class="comment"># Rolling statistics</span>
    <span class="keyword">for</span> window <span class="keyword">in</span> [<span class="number">7</span>, <span class="number">14</span>, <span class="number">30</span>]:
        df[<span class="string">f'rolling_mean_{window}'</span>] = df[target_col].rolling(window).mean()
        df[<span class="string">f'rolling_std_{window}'</span>] = df[target_col].rolling(window).std()
    
    <span class="comment"># Date features</span>
    df[<span class="string">'dayofweek'</span>] = df[date_col].dt.dayofweek
    df[<span class="string">'month'</span>] = df[date_col].dt.month
    df[<span class="string">'is_weekend'</span>] = df[<span class="string">'dayofweek'</span>].isin([<span class="number">5</span>, <span class="number">6</span>]).astype(<span class="keyword">int</span>)
    
    <span class="comment"># Percentage change</span>
    df[<span class="string">'pct_change'</span>] = df[target_col].pct_change()
    
    <span class="keyword">return</span> df</div>

                <h3>4. Memory Optimization</h3>
                <div class="code-block"><span class="keyword">def</span> <span class="function">optimize_dtypes</span>(df):
    <span class="string">"""Reduce DataFrame memory by 60-80%."""</span>
    start_mem = df.memory_usage(deep=<span class="keyword">True</span>).sum() / <span class="number">1024</span>**<span class="number">2</span>
    
    <span class="keyword">for</span> col <span class="keyword">in</span> df.select_dtypes([<span class="string">'int'</span>]).columns:
        df[col] = pd.to_numeric(df[col], downcast=<span class="string">'integer'</span>)
    <span class="keyword">for</span> col <span class="keyword">in</span> df.select_dtypes([<span class="string">'float'</span>]).columns:
        df[col] = pd.to_numeric(df[col], downcast=<span class="string">'float'</span>)
    <span class="keyword">for</span> col <span class="keyword">in</span> df.select_dtypes([<span class="string">'object'</span>]).columns:
        <span class="keyword">if</span> df[col].nunique() / <span class="function">len</span>(df) < <span class="number">0.5</span>:
            df[col] = df[col].astype(<span class="string">'category'</span>)
    
    end_mem = df.memory_usage(deep=<span class="keyword">True</span>).sum() / <span class="number">1024</span>**<span class="number">2</span>
    <span class="function">print</span>(<span class="string">f"Memory: {start_mem:.1f}MB → {end_mem:.1f}MB ({100*(1-end_mem/start_mem):.0f}% reduction)"</span>)
    <span class="keyword">return</span> df</div>

                <h3>5. Merge with Validation</h3>
                <div class="code-block"><span class="comment"># LEFT JOIN with indicator for debugging</span>
merged = pd.merge(orders, customers, on=<span class="string">'customer_id'</span>,
    how=<span class="string">'left'</span>, indicator=<span class="keyword">True</span>, validate=<span class="string">'many_to_one'</span>)

<span class="comment"># Check for orphan records</span>
orphans = merged[merged[<span class="string">'_merge'</span>] == <span class="string">'left_only'</span>]
<span class="function">print</span>(<span class="string">f"Orphan orders: {len(orphans)}"</span>)

<span class="comment"># Multi-key merge</span>
result = pd.merge(df1, df2, on=[<span class="string">'date'</span>, <span class="string">'product_id'</span>],
    how=<span class="string">'inner'</span>, suffixes=(<span class="string">'_actual'</span>, <span class="string">'_predicted'</span>))</div>

                <h3>6. Pivot Table for Business Reporting</h3>
                <div class="code-block"><span class="comment"># Revenue by month and category</span>
pivot = df.pivot_table(
    values=<span class="string">'revenue'</span>,
    index=df[<span class="string">'date'</span>].dt.to_period(<span class="string">'M'</span>),
    columns=<span class="string">'category'</span>,
    aggfunc=[<span class="string">'sum'</span>, <span class="string">'count'</span>],
    margins=<span class="keyword">True</span>  <span class="comment"># Add totals row/column</span>
)

<span class="comment"># Crosstab — frequency of two categorical columns</span>
ct = pd.crosstab(df[<span class="string">'region'</span>], df[<span class="string">'product'</span>], normalize=<span class="string">'index'</span>)</div>
            </div>`,
            interview: `
            <div class="section">
                <h2>🎯 Pandas Interview Questions</h2>
                <div class="interview-box"><strong>Q1: SettingWithCopyWarning?</strong><p><strong>Answer:</strong> Chained indexing modifies copy. Fix: <code>df.loc[mask, 'col'] = val</code>. Pandas 2.0+ Copy-on-Write eliminates this.</p></div>
                <div class="interview-box"><strong>Q2: merge vs join vs concat?</strong><p><strong>Answer:</strong> merge: SQL joins on columns. join: on index. concat: stack along axis. Use merge for column joins, concat for appending.</p></div>
                <div class="interview-box"><strong>Q3: apply vs map vs transform?</strong><p><strong>Answer:</strong> map: Series element-wise. apply: rows/columns. transform: same-shape output. All slow — prefer vectorized when possible.</p></div>
                <div class="interview-box"><strong>Q4: GroupBy transform vs agg?</strong><p><strong>Answer:</strong> agg reduces. transform broadcasts back. Use transform for "fill with group mean" or "normalize within group" patterns.</p></div>
                <div class="interview-box"><strong>Q5: How to handle missing data?</strong><p><strong>Answer:</strong> (1) <code>dropna(thresh=N)</code>, (2) <code>fillna(method='ffill')</code> for time series, (3) <code>fillna(df.median())</code> for ML, (4) <code>interpolate(method='time')</code>. Always check <code>df.isna().sum()</code> first.</p></div>
                <div class="interview-box"><strong>Q6: Pandas vs Polars?</strong><p><strong>Answer:</strong> Polars: 5-50x faster (Rust), multi-threaded, lazy eval. Pandas: mature ecosystem, wide compatibility. New projects with big data → Polars.</p></div>
                <div class="interview-box"><strong>Q7: What is MultiIndex?</strong><p><strong>Answer:</strong> Hierarchical indexing. Use for pivot tables, panel data. Access with <code>.xs()</code> or tuple. Reset with <code>.reset_index()</code>.</p></div>
                <div class="interview-box"><strong>Q8: How to optimize a 5GB DataFrame?</strong><p><strong>Answer:</strong> (1) Read only needed columns. (2) Downcast dtypes. (3) Category for strings. (4) Sparse for zeros. (5) PyArrow backend. (6) Process in chunks. Can reduce 5GB to 1GB.</p></div>
            </div>`
},

"visualization": {
    concepts: `
            <div class="section">
                <h2>📊 Data Visualization — Complete Guide</h2>

                <div class="info-box">
                    <div class="box-title">⚡ The Grammar of Graphics</div>
                    <div class="box-content"><strong>Data</strong> + <strong>Aesthetics</strong> (x, y, color, size) + <strong>Geometry</strong> (bars, lines, points) + <strong>Statistics</strong> (binning, smoothing) + <strong>Coordinates</strong> (cartesian, polar) + <strong>Facets</strong> (subplots). Every chart = this framework.</div>
                </div>

                <h3>1. Choosing the Right Chart</h3>
                <table>
                    <tr><th>Question</th><th>Chart Type</th><th>Library</th></tr>
                    <tr><td>Distribution?</td><td>Histogram, KDE, Box, Violin</td><td>Seaborn</td></tr>
                    <tr><td>Relationship?</td><td>Scatter, Hexbin, Regression</td><td>Seaborn/Plotly</td></tr>
                    <tr><td>Comparison?</td><td>Bar, Grouped bar, Violin</td><td>Seaborn</td></tr>
                    <tr><td>Trend over time?</td><td>Line, Area chart</td><td>Plotly/Matplotlib</td></tr>
                    <tr><td>Correlation?</td><td>Heatmap</td><td>Seaborn</td></tr>
                    <tr><td>Part of whole?</td><td>Pie, Treemap, Sunburst</td><td>Plotly</td></tr>
                    <tr><td>Geographic?</td><td>Choropleth, Mapbox</td><td>Plotly/Folium</td></tr>
                    <tr><td>High-dimensional?</td><td>Parallel coords, UMAP</td><td>Plotly</td></tr>
                    <tr><td>ML results?</td><td>Confusion matrix, ROC, SHAP</td><td>Seaborn/SHAP</td></tr>
                </table>

                <h3>2. Matplotlib Architecture</h3>
                <p>Three layers: <strong>Backend</strong> (rendering), <strong>Artist</strong> (everything drawn), <strong>Scripting</strong> (pyplot). Figure → Axes (subplots) → Axis objects. Always use OO API: <code>fig, ax = plt.subplots()</code>.</p>
                <p><strong>rcParams:</strong> Global defaults. <code>plt.rcParams['font.size'] = 14</code>. Create style files for project consistency. <code>plt.style.use('seaborn-v0_8-whitegrid')</code>.</p>

                <h3>3. Color Theory for Data</h3>
                <div class="callout tip">
                    <div class="callout-title">💡 Color Guide</div>
                    <strong>Sequential:</strong> viridis, plasma (low→high).<br>
                    <strong>Diverging:</strong> RdBu, coolwarm (center matters).<br>
                    <strong>Categorical:</strong> Set2, tab10 (distinct groups).<br>
                    Never use rainbow/jet — bad for colorblind, perceptually non-uniform.
                </div>

                <h3>4. Seaborn — Statistical Visualization</h3>
                <p>Three API levels: <strong>Figure-level</strong> (relplot, catplot, displot), <strong>Axes-level</strong> (scatterplot, boxplot), <strong>Objects API</strong> (0.12+). Auto-computes regression lines, confidence intervals, density estimates.</p>

                <h3>5. Plotly — Interactive Dashboards</h3>
                <p>JavaScript-powered: hover, zoom, selection. <code>plotly.express</code> for quick plots. <code>plotly.graph_objects</code> for control. Integrates with <strong>Dash</strong> for production dashboards. Supports 3D, maps, animations. Export to HTML.</p>

                <h3>6. Visualization for ML Projects</h3>
                <table>
                    <tr><th>What to Visualize</th><th>Chart</th><th>Why</th></tr>
                    <tr><td>Class distribution</td><td>Bar chart</td><td>Detect imbalance</td></tr>
                    <tr><td>Feature distributions</td><td>Histogram/KDE grid</td><td>Find skew, outliers</td></tr>
                    <tr><td>Feature correlations</td><td>Heatmap (triangular)</td><td>Multicollinearity</td></tr>
                    <tr><td>Training curves</td><td>Line plot (loss/acc vs epoch)</td><td>Detect overfit/underfit</td></tr>
                    <tr><td>Model comparison</td><td>Box plot of CV scores</td><td>Compare variance</td></tr>
                    <tr><td>Confusion matrix</td><td>Annotated heatmap</td><td>Error analysis</td></tr>
                    <tr><td>ROC curve</td><td>Line plot + AUC</td><td>Threshold selection</td></tr>
                    <tr><td>Feature importance</td><td>Horizontal bar</td><td>Model interpretation</td></tr>
                    <tr><td>SHAP values</td><td>Beeswarm/waterfall</td><td>Individual predictions</td></tr>
                </table>

                <h3>7. Common Mistakes</h3>
                <ul>
                    <li>Truncated y-axis exaggerating differences</li>
                    <li>Pie charts for >5 categories — use bar instead</li>
                    <li>Rainbow/jet colormap — use viridis/cividis</li>
                    <li>Overplotting — use alpha, hexbin, KDE, or datashader</li>
                    <li>Missing labels, titles, units</li>
                    <li>3D charts without interaction — often misleading</li>
                    <li>Not saving high-DPI figures — use <code>dpi=300</code></li>
                </ul>
            </div>`,
        code: `
            <div class="section">
                <h2>💻 Visualization Project Code</h2>

                <h3>1. Publication-Quality Multi-Subplot Figure</h3>
                <div class="code-block"><span class="keyword">import</span> matplotlib.pyplot <span class="keyword">as</span> plt
<span class="keyword">import</span> numpy <span class="keyword">as</span> np

<span class="comment"># Professional style setup</span>
plt.rcParams.update({
    <span class="string">'font.size'</span>: <span class="number">12</span>, <span class="string">'axes.titlesize'</span>: <span class="number">14</span>,
    <span class="string">'figure.facecolor'</span>: <span class="string">'white'</span>,
    <span class="string">'axes.spines.top'</span>: <span class="keyword">False</span>, <span class="string">'axes.spines.right'</span>: <span class="keyword">False</span>
})

fig, axes = plt.subplots(<span class="number">2</span>, <span class="number">2</span>, figsize=(<span class="number">14</span>, <span class="number">10</span>))

<span class="comment"># Distribution</span>
axes[<span class="number">0</span>,<span class="number">0</span>].hist(data, bins=<span class="number">30</span>, alpha=<span class="number">0.7</span>, color=<span class="string">'steelblue'</span>, edgecolor=<span class="string">'white'</span>)
axes[<span class="number">0</span>,<span class="number">0</span>].axvline(data.mean(), color=<span class="string">'red'</span>, linestyle=<span class="string">'--'</span>, label=<span class="string">'Mean'</span>)
axes[<span class="number">0</span>,<span class="number">0</span>].set_title(<span class="string">'Distribution'</span>)

<span class="comment"># Scatter with colormap</span>
sc = axes[<span class="number">0</span>,<span class="number">1</span>].scatter(x, y, c=z, cmap=<span class="string">'viridis'</span>, alpha=<span class="number">0.7</span>)
plt.colorbar(sc, ax=axes[<span class="number">0</span>,<span class="number">1</span>])

<span class="comment"># Line with confidence interval</span>
axes[<span class="number">1</span>,<span class="number">0</span>].plot(x, y_mean, <span class="string">'b-'</span>, linewidth=<span class="number">2</span>)
axes[<span class="number">1</span>,<span class="number">0</span>].fill_between(x, y_mean-y_std, y_mean+y_std, alpha=<span class="number">0.2</span>)

<span class="comment"># Bar with error bars</span>
axes[<span class="number">1</span>,<span class="number">1</span>].bar(categories, values, yerr=errors, capsize=<span class="number">5</span>, color=<span class="string">'coral'</span>)

plt.tight_layout()
plt.savefig(<span class="string">'figure.png'</span>, dpi=<span class="number">300</span>, bbox_inches=<span class="string">'tight'</span>)</div>

                <h3>2. ML Evaluation Dashboard</h3>
                <div class="code-block"><span class="keyword">import</span> seaborn <span class="keyword">as</span> sns
<span class="keyword">from</span> sklearn.metrics <span class="keyword">import</span> confusion_matrix, roc_curve, auc

<span class="keyword">def</span> <span class="function">plot_model_evaluation</span>(y_true, y_pred, y_proba):
    fig, axes = plt.subplots(<span class="number">1</span>, <span class="number">3</span>, figsize=(<span class="number">18</span>, <span class="number">5</span>))
    
    <span class="comment"># Confusion Matrix</span>
    cm = confusion_matrix(y_true, y_pred)
    sns.heatmap(cm, annot=<span class="keyword">True</span>, fmt=<span class="string">'d'</span>, cmap=<span class="string">'Blues'</span>, ax=axes[<span class="number">0</span>])
    axes[<span class="number">0</span>].set_title(<span class="string">'Confusion Matrix'</span>)
    
    <span class="comment"># ROC Curve</span>
    fpr, tpr, _ = roc_curve(y_true, y_proba)
    axes[<span class="number">1</span>].plot(fpr, tpr, label=<span class="string">f'AUC={auc(fpr,tpr):.3f}'</span>)
    axes[<span class="number">1</span>].plot([<span class="number">0</span>,<span class="number">1</span>], [<span class="number">0</span>,<span class="number">1</span>], <span class="string">'k--'</span>)
    axes[<span class="number">1</span>].set_title(<span class="string">'ROC Curve'</span>)
    axes[<span class="number">1</span>].legend()
    
    <span class="comment"># Feature Importance</span>
    importance = model.feature_importances_
    idx = importance.argsort()
    axes[<span class="number">2</span>].barh(feature_names[idx], importance[idx])
    axes[<span class="number">2</span>].set_title(<span class="string">'Feature Importance'</span>)
    
    plt.tight_layout()</div>

                <h3>3. Seaborn — EDA in One Call</h3>
                <div class="code-block"><span class="comment"># Pair plot — all relationships at once</span>
sns.pairplot(df, hue=<span class="string">'target'</span>, diag_kind=<span class="string">'kde'</span>,
    plot_kws={<span class="string">'alpha'</span>: <span class="number">0.6</span>})

<span class="comment"># Correlation heatmap (upper triangle)</span>
mask = np.triu(np.ones_like(df.corr(), dtype=<span class="keyword">bool</span>))
sns.heatmap(df.corr(), mask=mask, annot=<span class="keyword">True</span>,
    fmt=<span class="string">'.2f'</span>, cmap=<span class="string">'RdBu_r'</span>, center=<span class="number">0</span>)</div>

                <h3>4. Plotly — Interactive Dashboard</h3>
                <div class="code-block"><span class="keyword">import</span> plotly.express <span class="keyword">as</span> px
<span class="keyword">from</span> plotly.subplots <span class="keyword">import</span> make_subplots
<span class="keyword">import</span> plotly.graph_objects <span class="keyword">as</span> go

<span class="comment"># Animated scatter (Gapminder style)</span>
fig = px.scatter(df, x=<span class="string">'gdp'</span>, y=<span class="string">'life_exp'</span>,
    animation_frame=<span class="string">'year'</span>, size=<span class="string">'pop'</span>,
    color=<span class="string">'continent'</span>, hover_name=<span class="string">'country'</span>)

<span class="comment"># Training curves dashboard</span>
fig = make_subplots(rows=<span class="number">1</span>, cols=<span class="number">2</span>,
    subplot_titles=[<span class="string">'Loss'</span>, <span class="string">'Accuracy'</span>])
fig.add_trace(go.Scatter(y=train_loss, name=<span class="string">'Train Loss'</span>), row=<span class="number">1</span>, col=<span class="number">1</span>)
fig.add_trace(go.Scatter(y=val_loss, name=<span class="string">'Val Loss'</span>), row=<span class="number">1</span>, col=<span class="number">1</span>)
fig.add_trace(go.Scatter(y=train_acc, name=<span class="string">'Train Acc'</span>), row=<span class="number">1</span>, col=<span class="number">2</span>)
fig.add_trace(go.Scatter(y=val_acc, name=<span class="string">'Val Acc'</span>), row=<span class="number">1</span>, col=<span class="number">2</span>)
fig.write_html(<span class="string">'training_dashboard.html'</span>)</div>
            </div>`,
            interview: `
            <div class="section">
                <h2>🎯 Visualization Interview Questions</h2>
                <div class="interview-box"><strong>Q1: Matplotlib vs Seaborn vs Plotly?</strong><p><strong>Answer:</strong> Matplotlib: full control, papers. Seaborn: statistical EDA, beautiful. Plotly: interactive, stakeholders. Rule: Seaborn→EDA, Matplotlib→papers, Plotly→stakeholders.</p></div>
                <div class="interview-box"><strong>Q2: How to visualize high-dimensional data?</strong><p><strong>Answer:</strong> (1) PCA/t-SNE/UMAP to 2D, (2) Pair plots, (3) Parallel coordinates, (4) Correlation heatmap, (5) SHAP plots.</p></div>
                <div class="interview-box"><strong>Q3: Handle overplotting?</strong><p><strong>Answer:</strong> alpha, hexbin, 2D KDE, random sampling, Datashader for millions of points.</p></div>
                <div class="interview-box"><strong>Q4: Good viz for non-technical audience?</strong><p><strong>Answer:</strong> Title states conclusion. One insight per chart. Annotate key points. Consistent color. Minimal chart junk. Tell a story.</p></div>
                <div class="interview-box"><strong>Q5: Figure vs Axes?</strong><p><strong>Answer:</strong> Figure = canvas. Axes = plot area. <code>fig, axes = plt.subplots(2,2)</code>. Use OO API: <code>ax.plot()</code> not <code>plt.plot()</code>.</p></div>
                <div class="interview-box"><strong>Q6: Accessible visualizations?</strong><p><strong>Answer:</strong> Colorblind palettes (viridis), shapes not just color, sufficient contrast, alt text, 12pt+ fonts.</p></div>
                <div class="interview-box"><strong>Q7: How to visualize model performance?</strong><p><strong>Answer:</strong> Training curves (loss/acc vs epoch), confusion matrix (heatmap), ROC/AUC, feature importance (horizontal bars), SHAP for interpretability.</p></div>
            </div>`
},

"advanced-python": {
    concepts: `
            <div class="section">
                <h2>🎯 Advanced Python — Complete Engineering Guide</h2>

                <h3>1. Decorators — Complete Patterns</h3>
                <div class="info-box">
                    <div class="box-title">⚡ Three Levels of Decorators</div>
                    <div class="box-content"><strong>Level 1:</strong> Simple wrapper (timing, logging). <strong>Level 2:</strong> With arguments (factory). <strong>Level 3:</strong> Class-based with state. Always use <code>functools.wraps</code>.</div>
                </div>
                <p><strong>Common patterns:</strong> Retry with exponential backoff, caching, rate limiting, authentication, input validation, deprecation warnings.</p>

                <h3>2. Context Managers</h3>
                <p>Guarantee resource cleanup. Two approaches: (1) Class-based (<code>__enter__/__exit__</code>), (2) <code>@contextlib.contextmanager</code> with yield. Use for: files, DB connections, GPU locks, temporary settings, timers.</p>

                <h3>3. Dataclasses vs namedtuple vs Pydantic vs attrs</h3>
                <table>
                    <tr><th>Feature</th><th>namedtuple</th><th>dataclass</th><th>Pydantic</th><th>attrs</th></tr>
                    <tr><td>Mutable</td><td>✗</td><td>✓</td><td>✓ (v2)</td><td>✓</td></tr>
                    <tr><td>Validation</td><td>✗</td><td>✗</td><td>✓ (auto)</td><td>✓ (validators)</td></tr>
                    <tr><td>JSON</td><td>✗</td><td>✗</td><td>✓ (built-in)</td><td>via cattrs</td></tr>
                    <tr><td>Performance</td><td>Fastest</td><td>Fast</td><td>Medium</td><td>Fast</td></tr>
                    <tr><td>Use for</td><td>Records</td><td>Data containers</td><td>API models</td><td>Complex classes</td></tr>
                </table>

                <h3>4. Type Hints — Complete Guide</h3>
                <div class="info-box">
                    <div class="box-title">🎯 Why Type Hints Matter for Projects</div>
                    <div class="box-content">Enable: IDE autocompletion, <strong>mypy</strong> static analysis, self-documenting code, Pydantic validation. Python doesn't enforce at runtime — they're for tools and humans.</div>
                </div>
                <table>
                    <tr><th>Hint</th><th>Meaning</th><th>Example</th></tr>
                    <tr><td><code>list[int]</code></td><td>List of ints (3.9+)</td><td><code>scores: list[int] = []</code></td></tr>
                    <tr><td><code>dict[str, Any]</code></td><td>Dict str keys</td><td><code>config: dict[str, Any]</code></td></tr>
                    <tr><td><code>int | None</code></td><td>Optional (3.10+)</td><td><code>x: int | None = None</code></td></tr>
                    <tr><td><code>Callable[[int], str]</code></td><td>Function type</td><td>Callbacks</td></tr>
                    <tr><td><code>TypeVar</code></td><td>Generic</td><td>Generic containers</td></tr>
                    <tr><td><code>Literal</code></td><td>Exact values</td><td><code>Literal['train','test']</code></td></tr>
                    <tr><td><code>TypedDict</code></td><td>Dict with typed keys</td><td>JSON schemas</td></tr>
                </table>

                <h3>5. async/await — Concurrent I/O</h3>
                <p>For I/O-bound tasks: API calls, DB queries, file reads. NOT for CPU (use multiprocessing). Event loop manages coroutines cooperatively. <code>asyncio.gather()</code> runs concurrently. Game changer: 100 API calls in ~1s vs 100s sequentially.</p>

                <h3>6. Design Patterns for ML Projects</h3>
                <table>
                    <tr><th>Pattern</th><th>Use Case</th><th>Python Implementation</th></tr>
                    <tr><td>Strategy</td><td>Swap algorithms</td><td>Pass function/class as argument</td></tr>
                    <tr><td>Factory</td><td>Create objects by name</td><td>Registry dict: <code>models['rf']</code></td></tr>
                    <tr><td>Observer</td><td>Training callbacks</td><td>Event system with hooks</td></tr>
                    <tr><td>Pipeline</td><td>Data transformations</td><td>Chain of <code>fit→transform</code></td></tr>
                    <tr><td>Singleton</td><td>Model cache, DB pool</td><td>Module-level or metaclass</td></tr>
                    <tr><td>Template</td><td>Training loop</td><td>ABC with abstract methods</td></tr>
                    <tr><td>Registry</td><td>Auto-register models</td><td>Class decorator + dict</td></tr>
                </table>

                <h3>7. Descriptors — How @property Works</h3>
                <p>Any object implementing <code>__get__/__set__/__delete__</code>. @property is a descriptor. Control attribute access at class level. Used in Django ORM, SQLAlchemy, dataclass fields.</p>

                <h3>8. Metaclasses — Advanced</h3>
                <p>Classes are objects. Metaclasses define how classes behave. <code>type</code> is the default. Use for: auto-registration, interface enforcement, singleton. Most should use class decorators instead.</p>

                <h3>9. __slots__ for Memory Efficiency</h3>
                <p>Replaces <code>__dict__</code> with fixed array. ~40% memory savings per instance. Use for millions of small objects. Trade-off: no dynamic attributes.</p>

                <h3>10. Multiprocessing for CPU-Bound Work</h3>
                <p><code>multiprocessing.Pool</code> or <code>concurrent.futures.ProcessPoolExecutor</code>. Each process has its own GIL. Share data via: <code>multiprocessing.Queue</code>, <code>shared_memory</code>, or serialize (pickle). Overhead: process creation ~100ms. Only use for expensive computations.</p>
            </div>`,
        code: `
            <div class="section">
                <h2>💻 Advanced Python Project Code</h2>

                <h3>1. Production Decorator — Retry with Backoff</h3>
                <div class="code-block"><span class="keyword">from</span> functools <span class="keyword">import</span> wraps
<span class="keyword">import</span> time, logging

<span class="keyword">def</span> <span class="function">retry</span>(max_attempts=<span class="number">3</span>, delay=<span class="number">1.0</span>, exceptions=(<span class="function">Exception</span>,)):
    <span class="keyword">def</span> <span class="function">decorator</span>(func):
        <span class="preprocessor">@wraps</span>(func)
        <span class="keyword">def</span> <span class="function">wrapper</span>(*args, **kwargs):
            <span class="keyword">for</span> attempt <span class="keyword">in</span> <span class="function">range</span>(max_attempts):
                <span class="keyword">try</span>:
                    <span class="keyword">return</span> func(*args, **kwargs)
                <span class="keyword">except</span> exceptions <span class="keyword">as</span> e:
                    <span class="keyword">if</span> attempt == max_attempts - <span class="number">1</span>:
                        <span class="keyword">raise</span>
                    wait = delay * (<span class="number">2</span> ** attempt)
                    logging.warning(<span class="string">f"Retry {attempt+1}/{max_attempts}: {e}, waiting {wait}s"</span>)
                    time.sleep(wait)
        <span class="keyword">return</span> wrapper
    <span class="keyword">return</span> decorator

<span class="preprocessor">@retry</span>(max_attempts=<span class="number">3</span>, delay=<span class="number">0.5</span>)
<span class="keyword">def</span> <span class="function">fetch_data</span>(url):
    <span class="keyword">return</span> requests.get(url, timeout=<span class="number">10</span>).json()</div>

                <h3>2. Dataclass for ML Experiments</h3>
                <div class="code-block"><span class="keyword">from</span> dataclasses <span class="keyword">import</span> dataclass, field, asdict
<span class="keyword">import</span> json
<span class="keyword">from</span> datetime <span class="keyword">import</span> datetime

<span class="preprocessor">@dataclass</span>
<span class="keyword">class</span> <span class="class">Experiment</span>:
    name: <span class="keyword">str</span>
    model: <span class="keyword">str</span>
    lr: <span class="keyword">float</span> = <span class="number">0.001</span>
    epochs: <span class="keyword">int</span> = <span class="number">100</span>
    batch_size: <span class="keyword">int</span> = <span class="number">32</span>
    tags: <span class="keyword">list</span>[<span class="keyword">str</span>] = field(default_factory=<span class="keyword">list</span>)
    timestamp: <span class="keyword">str</span> = field(default_factory=<span class="keyword">lambda</span>: datetime.now().isoformat())
    metrics: <span class="keyword">dict</span> = field(default_factory=<span class="keyword">dict</span>)
    
    <span class="keyword">def</span> <span class="function">__post_init__</span>(self):
        <span class="keyword">if</span> self.lr <= <span class="number">0</span>: <span class="keyword">raise</span> <span class="function">ValueError</span>(<span class="string">"lr must be positive"</span>)
    
    <span class="keyword">def</span> <span class="function">save</span>(self, path):
        <span class="keyword">with</span> <span class="function">open</span>(path, <span class="string">'w'</span>) <span class="keyword">as</span> f:
            json.dump(asdict(self), f, indent=<span class="number">2</span>)
    
    <span class="preprocessor">@classmethod</span>
    <span class="keyword">def</span> <span class="function">load</span>(cls, path):
        <span class="keyword">with</span> <span class="function">open</span>(path) <span class="keyword">as</span> f:
            <span class="keyword">return</span> cls(**json.load(f))</div>

                <h3>3. Model Registry Pattern</h3>
                <div class="code-block">MODEL_REGISTRY = {}

<span class="keyword">def</span> <span class="function">register_model</span>(name):
    <span class="keyword">def</span> <span class="function">decorator</span>(cls):
        MODEL_REGISTRY[name] = cls
        <span class="keyword">return</span> cls
    <span class="keyword">return</span> decorator

<span class="preprocessor">@register_model</span>(<span class="string">"random_forest"</span>)
<span class="keyword">class</span> <span class="class">RandomForestModel</span>:
    <span class="keyword">def</span> <span class="function">train</span>(self, X, y): ...

<span class="preprocessor">@register_model</span>(<span class="string">"xgboost"</span>)
<span class="keyword">class</span> <span class="class">XGBoostModel</span>:
    <span class="keyword">def</span> <span class="function">train</span>(self, X, y): ...

<span class="comment"># Create model by name from config</span>
model = MODEL_REGISTRY[config[<span class="string">"model_name"</span>]]()</div>

                <h3>4. async — Parallel API Calls</h3>
                <div class="code-block"><span class="keyword">import</span> asyncio
<span class="keyword">import</span> aiohttp

<span class="keyword">async def</span> <span class="function">fetch</span>(session, url):
    <span class="keyword">async with</span> session.get(url) <span class="keyword">as</span> resp:
        <span class="keyword">return</span> <span class="keyword">await</span> resp.json()

<span class="keyword">async def</span> <span class="function">fetch_all</span>(urls):
    <span class="keyword">async with</span> aiohttp.ClientSession() <span class="keyword">as</span> session:
        tasks = [fetch(session, url) <span class="keyword">for</span> url <span class="keyword">in</span> urls]
        <span class="keyword">return</span> <span class="keyword">await</span> asyncio.gather(*tasks, return_exceptions=<span class="keyword">True</span>)

<span class="comment"># 100 API calls in ~1 second vs 100 seconds</span>
results = asyncio.run(fetch_all(urls))</div>

                <h3>5. Pydantic for API Data Validation</h3>
                <div class="code-block"><span class="keyword">from</span> pydantic <span class="keyword">import</span> BaseModel, Field, field_validator

<span class="keyword">class</span> <span class="class">PredictionRequest</span>(BaseModel):
    features: <span class="keyword">list</span>[<span class="keyword">float</span>] = Field(..., min_length=<span class="number">1</span>)
    model_name: <span class="keyword">str</span> = <span class="string">"default"</span>
    threshold: <span class="keyword">float</span> = Field(<span class="number">0.5</span>, ge=<span class="number">0</span>, le=<span class="number">1</span>)
    
    <span class="preprocessor">@field_validator</span>(<span class="string">'features'</span>)
    <span class="preprocessor">@classmethod</span>
    <span class="keyword">def</span> <span class="function">check_features</span>(cls, v):
        <span class="keyword">if</span> <span class="function">any</span>(np.isnan(x) <span class="keyword">for</span> x <span class="keyword">in</span> v):
            <span class="keyword">raise</span> <span class="function">ValueError</span>(<span class="string">"NaN not allowed"</span>)
        <span class="keyword">return</span> v

<span class="comment"># Auto-validates on creation</span>
req = PredictionRequest(features=[<span class="number">1.0</span>, <span class="number">2.0</span>, <span class="number">3.0</span>])</div>

                <h3>6. Context Manager — Timer & GPU Lock</h3>
                <div class="code-block"><span class="keyword">from</span> contextlib <span class="keyword">import</span> contextmanager
<span class="keyword">import</span> time

<span class="preprocessor">@contextmanager</span>
<span class="keyword">def</span> <span class="function">timer</span>(name=<span class="string">"Block"</span>):
    start = time.perf_counter()
    <span class="keyword">try</span>:
        <span class="keyword">yield</span>
    <span class="keyword">finally</span>:
        elapsed = time.perf_counter() - start
        <span class="function">print</span>(<span class="string">f"{name}: {elapsed:.4f}s"</span>)

<span class="keyword">with</span> timer(<span class="string">"Training"</span>):
    model.fit(X_train, y_train)</div>
            </div>`,
            interview: `
            <div class="section">
                <h2>🎯 Advanced Python Interview Questions</h2>
                <div class="interview-box"><strong>Q1: Explain MRO.</strong><p><strong>Answer:</strong> C3 Linearization for multiple inheritance. <code>ClassName.mro()</code> shows order. Subclasses before bases, left-to-right.</p></div>
                <div class="interview-box"><strong>Q2: dataclass vs Pydantic?</strong><p><strong>Answer:</strong> dataclass: no validation, fast, standard library. Pydantic: auto-validation, JSON serialization, API models. Use Pydantic for external data, dataclass for internal.</p></div>
                <div class="interview-box"><strong>Q3: When async vs threading vs multiprocessing?</strong><p><strong>Answer:</strong> async: I/O-bound, 1000s connections. threading: I/O, simpler. multiprocessing: CPU-bound (bypasses GIL). NumPy releases GIL internally.</p></div>
                <div class="interview-box"><strong>Q4: How does @property work?</strong><p><strong>Answer:</strong> It's a descriptor with <code>__get__/__set__</code>. Attribute access triggers descriptor protocol. Used for computed attributes and validation.</p></div>
                <div class="interview-box"><strong>Q5: Decorator with parameters?</strong><p><strong>Answer:</strong> Three nested functions: factory(params) → decorator(func) → wrapper(*args). Use @wraps(func) always.</p></div>
                <div class="interview-box"><strong>Q6: What is __slots__?</strong><p><strong>Answer:</strong> Fixed array instead of __dict__. ~40% less memory. No dynamic attributes. Use for millions of objects.</p></div>
                <div class="interview-box"><strong>Q7: Explain closures with use case.</strong><p><strong>Answer:</strong> Function capturing enclosing scope variables. Use: factory functions, decorators, callbacks. <code>make_multiplier(3)</code> returns function multiplying by 3.</p></div>
                <div class="interview-box"><strong>Q8: Design patterns in Python vs Java?</strong><p><strong>Answer:</strong> Python makes many patterns trivial: Strategy = pass a function. Singleton = module variable. Factory = dict of classes. Observer = list of callables. Python prefers simplicity.</p></div>
            </div>`
},

"sklearn": {
    concepts: `
            <div class="section">
                <h2>🤖 Scikit-learn — Complete ML Engineering</h2>

                <div class="info-box">
                    <div class="box-title">⚡ The Estimator API</div>
                    <div class="box-content"><strong>Estimators:</strong> <code>fit(X, y)</code>. <strong>Transformers:</strong> <code>transform(X)</code>. <strong>Predictors:</strong> <code>predict(X)</code>. Consistency allows seamless swapping and composition via Pipelines.</div>
                </div>

                <h3>1. Pipelines — The Foundation of Production ML</h3>
                <div class="callout warning">
                    <div class="callout-title">⚠️ Data Leakage — The #1 ML Mistake</div>
                    Fitting scaler on ENTIRE dataset before split = test set info leaks into training. Fix: put ALL preprocessing inside Pipeline. Pipeline ensures fit only on training folds during CV.
                </div>

                <h3>2. ColumnTransformer — Real-World Data</h3>
                <p>Real data has mixed types. ColumnTransformer applies different transformations per column set: StandardScaler for numerics, OneHotEncoder for categoricals, TfidfVectorizer for text. All in one pipeline.</p>

                <h3>3. Custom Transformers</h3>
                <p>Inherit <code>BaseEstimator + TransformerMixin</code>. Implement <code>fit(X, y)</code> and <code>transform(X)</code>. TransformerMixin gives <code>fit_transform()</code> free. Use <code>check_is_fitted()</code> for safety.</p>

                <h3>4. Cross-Validation Strategies</h3>
                <table>
                    <tr><th>Strategy</th><th>When</th><th>Key Point</th></tr>
                    <tr><td>KFold</td><td>General</td><td>Doesn't preserve class ratios</td></tr>
                    <tr><td>StratifiedKFold</td><td>Imbalanced classification</td><td>Preserves class distribution</td></tr>
                    <tr><td>TimeSeriesSplit</td><td>Time-ordered data</td><td>Train always before test</td></tr>
                    <tr><td>GroupKFold</td><td>Grouped data (patients)</td><td>Same group never in train+test</td></tr>
                    <tr><td>RepeatedStratifiedKFold</td><td>Robust estimation</td><td>Multiple random splits</td></tr>
                </table>

                <h3>5. Hyperparameter Tuning</h3>
                <table>
                    <tr><th>Method</th><th>Pros</th><th>Cons</th></tr>
                    <tr><td>GridSearchCV</td><td>Exhaustive</td><td>Exponential with params</td></tr>
                    <tr><td>RandomizedSearchCV</td><td>Faster, continuous dists</td><td>May miss optimal</td></tr>
                    <tr><td>Optuna</td><td>Smart search, pruning</td><td>Extra dependency</td></tr>
                    <tr><td>HalvingSearchCV</td><td>Successive halving</td><td>Newer, less docs</td></tr>
                </table>

                <h3>6. Complete ML Workflow</h3>
                <div class="info-box">
                    <div class="box-title">🎯 The Steps</div>
                    <div class="box-content">
                        1. EDA → 2. Train/Val/Test split → 3. Build Pipeline (preprocess + model) → 4. Cross-validate multiple models → 5. Select best → 6. Tune hyperparameters → 7. Final evaluation on test set → 8. Save model → 9. Deploy
                    </div>
                </div>

                <h3>7. Feature Engineering</h3>
                <table>
                    <tr><th>Transformer</th><th>Purpose</th></tr>
                    <tr><td>PolynomialFeatures</td><td>Interaction & polynomial terms</td></tr>
                    <tr><td>FunctionTransformer</td><td>Apply any function (log, sqrt)</td></tr>
                    <tr><td>SplineTransformer</td><td>Non-linear feature basis</td></tr>
                    <tr><td>KBinsDiscretizer</td><td>Bin continuous into categories</td></tr>
                    <tr><td>TargetEncoder</td><td>Encode categoricals by target mean</td></tr>
                </table>

                <h3>8. Model Selection Guide</h3>
                <table>
                    <tr><th>Data Size</th><th>Model</th><th>Why</th></tr>
                    <tr><td><1K rows</td><td>Logistic/SVM/KNN</td><td>Simple, less overfitting</td></tr>
                    <tr><td>1K-100K</td><td>Random Forest, XGBoost</td><td>Best accuracy/speed tradeoff</td></tr>
                    <tr><td>100K+</td><td>XGBoost, LightGBM</td><td>Handles large data efficiently</td></tr>
                    <tr><td>Very large</td><td>SGDClassifier/online</td><td>Incremental learning</td></tr>
                    <tr><td>Tabular</td><td>Gradient Boosting</td><td>Almost always best for tabular</td></tr>
                </table>

                <h3>9. Handling Imbalanced Data</h3>
                <table>
                    <tr><th>Strategy</th><th>How</th></tr>
                    <tr><td>class_weight='balanced'</td><td>Built-in for most models</td></tr>
                    <tr><td>SMOTE</td><td>Synthetic oversampling (imblearn)</td></tr>
                    <tr><td>Threshold tuning</td><td>Adjust decision threshold from 0.5</td></tr>
                    <tr><td>Metrics</td><td>Use F1, Precision-Recall AUC (not accuracy)</td></tr>
                    <tr><td>Ensemble</td><td>BalancedRandomForest</td></tr>
                </table>

                <h3>10. Model Persistence</h3>
                <p><code>joblib.dump(model, 'model.pkl')</code> — faster than pickle for NumPy arrays. <code>model = joblib.load('model.pkl')</code>. Always save the entire pipeline (not just model) to include preprocessing. Version your models with timestamps.</p>
            </div>`,
        code: `
            <div class="section">
                <h2>💻 Scikit-learn Project Code</h2>

                <h3>1. Production Pipeline — Complete Template</h3>
                <div class="code-block"><span class="keyword">from</span> sklearn.pipeline <span class="keyword">import</span> Pipeline
<span class="keyword">from</span> sklearn.compose <span class="keyword">import</span> ColumnTransformer, make_column_selector
<span class="keyword">from</span> sklearn.preprocessing <span class="keyword">import</span> StandardScaler, OneHotEncoder
<span class="keyword">from</span> sklearn.impute <span class="keyword">import</span> SimpleImputer
<span class="keyword">from</span> sklearn.ensemble <span class="keyword">import</span> RandomForestClassifier
<span class="keyword">from</span> sklearn.model_selection <span class="keyword">import</span> cross_val_score

preprocessor = ColumnTransformer([
    (<span class="string">'num'</span>, Pipeline([
        (<span class="string">'imputer'</span>, SimpleImputer(strategy=<span class="string">'median'</span>)),
        (<span class="string">'scaler'</span>, StandardScaler())
    ]), make_column_selector(dtype_include=<span class="string">'number'</span>)),
    
    (<span class="string">'cat'</span>, Pipeline([
        (<span class="string">'imputer'</span>, SimpleImputer(strategy=<span class="string">'constant'</span>, fill_value=<span class="string">'missing'</span>)),
        (<span class="string">'encoder'</span>, OneHotEncoder(handle_unknown=<span class="string">'ignore'</span>, sparse_output=<span class="keyword">False</span>))
    ]), make_column_selector(dtype_include=<span class="string">'object'</span>))
])

pipe = Pipeline([
    (<span class="string">'preprocessor'</span>, preprocessor),
    (<span class="string">'classifier'</span>, RandomForestClassifier(n_estimators=<span class="number">100</span>, n_jobs=-<span class="number">1</span>))
])

<span class="comment"># No data leakage!</span>
scores = cross_val_score(pipe, X, y, cv=<span class="number">5</span>, scoring=<span class="string">'f1'</span>)
<span class="function">print</span>(<span class="string">f"F1: {scores.mean():.3f} ± {scores.std():.3f}"</span>)</div>

                <h3>2. Custom Transformer</h3>
                <div class="code-block"><span class="keyword">from</span> sklearn.base <span class="keyword">import</span> BaseEstimator, TransformerMixin
<span class="keyword">from</span> sklearn.utils.validation <span class="keyword">import</span> check_is_fitted

<span class="keyword">class</span> <span class="class">OutlierClipper</span>(BaseEstimator, TransformerMixin):
    <span class="keyword">def</span> <span class="function">__init__</span>(self, factor=<span class="number">1.5</span>):
        self.factor = factor
    
    <span class="keyword">def</span> <span class="function">fit</span>(self, X, y=<span class="keyword">None</span>):
        Q1 = np.percentile(X, <span class="number">25</span>, axis=<span class="number">0</span>)
        Q3 = np.percentile(X, <span class="number">75</span>, axis=<span class="number">0</span>)
        IQR = Q3 - Q1
        self.lower_ = Q1 - self.factor * IQR
        self.upper_ = Q3 + self.factor * IQR
        <span class="keyword">return</span> self
    
    <span class="keyword">def</span> <span class="function">transform</span>(self, X):
        check_is_fitted(self)
        <span class="keyword">return</span> np.clip(X, self.lower_, self.upper_)</div>

                <h3>3. Model Comparison Framework</h3>
                <div class="code-block"><span class="keyword">from</span> sklearn.model_selection <span class="keyword">import</span> cross_validate

models = {
    <span class="string">'Logistic'</span>: LogisticRegression(),
    <span class="string">'RF'</span>: RandomForestClassifier(n_estimators=<span class="number">100</span>),
    <span class="string">'XGBoost'</span>: XGBClassifier(n_estimators=<span class="number">100</span>),
    <span class="string">'LightGBM'</span>: LGBMClassifier(n_estimators=<span class="number">100</span>)
}

results = {}
<span class="keyword">for</span> name, model <span class="keyword">in</span> models.items():
    pipe = Pipeline([(<span class="string">'prep'</span>, preprocessor), (<span class="string">'model'</span>, model)])
    cv = cross_validate(pipe, X, y, cv=<span class="number">5</span>,
        scoring=[<span class="string">'accuracy'</span>, <span class="string">'f1'</span>, <span class="string">'roc_auc'</span>], n_jobs=-<span class="number">1</span>)
    results[name] = {k: v.mean() <span class="keyword">for</span> k, v <span class="keyword">in</span> cv.items()}
    <span class="function">print</span>(<span class="string">f"{name}: F1={cv['test_f1'].mean():.3f}"</span>)

pd.DataFrame(results).T.sort_values(<span class="string">'test_f1'</span>, ascending=<span class="keyword">False</span>)</div>

                <h3>4. Hyperparameter Tuning with Optuna</h3>
                <div class="code-block"><span class="keyword">import</span> optuna

<span class="keyword">def</span> <span class="function">objective</span>(trial):
    params = {
        <span class="string">'n_estimators'</span>: trial.suggest_int(<span class="string">'n_estimators'</span>, <span class="number">50</span>, <span class="number">500</span>),
        <span class="string">'max_depth'</span>: trial.suggest_int(<span class="string">'max_depth'</span>, <span class="number">3</span>, <span class="number">15</span>),
        <span class="string">'learning_rate'</span>: trial.suggest_float(<span class="string">'lr'</span>, <span class="number">1e-3</span>, <span class="number">0.3</span>, log=<span class="keyword">True</span>),
        <span class="string">'subsample'</span>: trial.suggest_float(<span class="string">'subsample'</span>, <span class="number">0.6</span>, <span class="number">1.0</span>)
    }
    model = XGBClassifier(**params)
    score = cross_val_score(model, X, y, cv=<span class="number">5</span>, scoring=<span class="string">'f1'</span>).mean()
    <span class="keyword">return</span> score

study = optuna.create_study(direction=<span class="string">'maximize'</span>)
study.optimize(objective, n_trials=<span class="number">100</span>)
<span class="function">print</span>(<span class="string">f"Best F1: {study.best_value:.3f}"</span>)
<span class="function">print</span>(<span class="string">f"Best params: {study.best_params}"</span>)</div>

                <h3>5. Save & Load Pipeline</h3>
                <div class="code-block"><span class="keyword">import</span> joblib
<span class="keyword">from</span> datetime <span class="keyword">import</span> datetime

<span class="comment"># Save entire pipeline (includes preprocessing!)</span>
version = datetime.now().strftime(<span class="string">'%Y%m%d_%H%M'</span>)
joblib.dump(pipe, <span class="string">f'models/pipeline_{version}.pkl'</span>)

<span class="comment"># Load and predict</span>
pipe = joblib.load(<span class="string">'models/pipeline_20240315_1430.pkl'</span>)
predictions = pipe.predict(new_data)  <span class="comment"># Preprocessing included!</span></div>
            </div>`,
            interview: `
            <div class="section">
                <h2>🎯 Scikit-learn Interview Questions</h2>
                <div class="interview-box"><strong>Q1: What is data leakage?</strong><p><strong>Answer:</strong> Test set info influencing training. Common: fitting scaler before split. Fix: Pipeline ensures fit only on train folds.</p></div>
                <div class="interview-box"><strong>Q2: Pipeline vs ColumnTransformer?</strong><p><strong>Answer:</strong> Pipeline: sequential (A→B→C). ColumnTransformer: parallel branches (different processing per column type). Usually CT inside Pipeline.</p></div>
                <div class="interview-box"><strong>Q3: Which cross-validation when?</strong><p><strong>Answer:</strong> KFold: general. Stratified: imbalanced. TimeSeriesSplit: temporal. GroupKFold: grouped data.</p></div>
                <div class="interview-box"><strong>Q4: Grid vs Random vs Bayesian?</strong><p><strong>Answer:</strong> Grid: exhaustive, exponential. Random: better for many params. Bayesian (Optuna): learns, most efficient for expensive models.</p></div>
                <div class="interview-box"><strong>Q5: Custom transformer?</strong><p><strong>Answer:</strong> BaseEstimator + TransformerMixin. Implement fit(X,y) and transform(X). TransformerMixin gives fit_transform free.</p></div>
                <div class="interview-box"><strong>Q6: How to handle imbalanced data?</strong><p><strong>Answer:</strong> (1) class_weight='balanced'. (2) SMOTE oversampling. (3) Adjust threshold. (4) Use F1/AUC not accuracy. (5) BalancedRandomForest.</p></div>
                <div class="interview-box"><strong>Q7: When to use which model?</strong><p><strong>Answer:</strong> Tabular: gradient boosting (XGBoost/LightGBM). Small data: Logistic/SVM. Interpretability: Logistic/trees. Speed: LightGBM. Baseline: Random Forest.</p></div>
                <div class="interview-box"><strong>Q8: fit() vs transform() vs predict()?</strong><p><strong>Answer:</strong> fit: learn params from data. transform: apply params. predict: generate predictions. fit on train only, transform/predict on both.</p></div>
            </div>`
},

"pytorch": {
    concepts: `
            <div class="section">
                <h2>🔥 Deep Learning with PyTorch — Complete Guide</h2>

                <div class="info-box">
                    <div class="box-title">⚡ PyTorch Philosophy: Define-by-Run</div>
                    <div class="box-content">PyTorch builds the computational graph <strong>dynamically</strong> as operations execute (eager mode). Debug with print(), breakpoints, standard Python control flow.</div>
                </div>

                <h3>1. Tensors — The Foundation</h3>
                <table>
                    <tr><th>Concept</th><th>What</th><th>Key Point</th></tr>
                    <tr><td>Tensor</td><td>N-dimensional array</td><td>Like NumPy but GPU-capable</td></tr>
                    <tr><td>requires_grad</td><td>Track for autograd</td><td>Only for learnable params</td></tr>
                    <tr><td>device</td><td>CPU or CUDA</td><td><code>.to('cuda')</code> moves to GPU</td></tr>
                    <tr><td>.detach()</td><td>Stop gradient tracking</td><td>Use for inference/metrics</td></tr>
                    <tr><td>.item()</td><td>Extract scalar</td><td>Use for logging loss</td></tr>
                    <tr><td>.contiguous()</td><td>Ensure contiguous memory</td><td>Required after transpose/permute</td></tr>
                </table>

                <h3>2. Autograd — How Backpropagation Works</h3>
                <div class="info-box">
                    <div class="box-title">🧠 Computational Graph (DAG)</div>
                    <div class="box-content">When <code>requires_grad=True</code>, every operation is recorded. Each tensor stores <code>grad_fn</code>. <code>.backward()</code> traverses graph in reverse (chain rule). Graph <strong>destroyed after backward()</strong> unless <code>retain_graph=True</code>. Gradients ACCUMULATE — must <code>optimizer.zero_grad()</code> before each backward.</div>
                </div>

                <h3>3. nn.Module — Building Blocks</h3>
                <p>Every model inherits <code>nn.Module</code>. Layers in <code>__init__</code>, computation in <code>forward()</code>. <code>model.train()</code>/<code>model.eval()</code> toggle BatchNorm/Dropout. <code>model.parameters()</code> for optimizer. <code>model.state_dict()</code> for save/load. Use <code>nn.Sequential</code> for simple stacks, <code>nn.ModuleList</code>/<code>nn.ModuleDict</code> for dynamic architectures.</p>

                <h3>4. Training Loop — The Standard Pattern</h3>
                <p>(1) Forward pass → (2) Compute loss → (3) <code>optimizer.zero_grad()</code> → (4) <code>loss.backward()</code> → (5) <code>optimizer.step()</code>. Add: gradient clipping, LR scheduling, mixed precision, logging, checkpointing.</p>

                <h3>5. Custom Datasets & DataLoaders</h3>
                <p><code>Dataset</code>: override <code>__len__</code> and <code>__getitem__</code>. <code>DataLoader</code>: batching, shuffling, multi-worker. <code>num_workers>0</code> for parallel loading. <code>pin_memory=True</code> for faster GPU transfer. Use <code>collate_fn</code> for variable-length sequences.</p>

                <h3>6. Learning Rate Scheduling</h3>
                <table>
                    <tr><th>Scheduler</th><th>Strategy</th><th>When</th></tr>
                    <tr><td>StepLR</td><td>Decay every N epochs</td><td>Simple baseline</td></tr>
                    <tr><td>CosineAnnealingLR</td><td>Cosine decay</td><td>Standard for vision</td></tr>
                    <tr><td>OneCycleLR</td><td>Warmup + decay</td><td>Best for fast training</td></tr>
                    <tr><td>ReduceLROnPlateau</td><td>Decay on stall</td><td>When loss plateaus</td></tr>
                    <tr><td>LinearLR</td><td>Linear warmup</td><td>Transformer models</td></tr>
                </table>

                <h3>7. Mixed Precision Training (AMP)</h3>
                <p><code>torch.cuda.amp</code>: forward in float16 (2x faster), gradients in float32. <code>GradScaler</code> prevents underflow. 2-3x speedup. Standard practice for any GPU training.</p>

                <h3>8. Transfer Learning Patterns</h3>
                <p>Load pretrained → Freeze base → Replace head → Fine-tune with smaller LR. <strong>Discriminative LR:</strong> lower LR for earlier layers. <strong>Progressive unfreezing:</strong> unfreeze layers one at a time. Both work better than fine-tuning everything at once.</p>

                <h3>9. Distributed Training (DDP)</h3>
                <p><code>DistributedDataParallel</code>: each GPU runs model copy, gradients averaged via all-reduce. Near-linear scaling. Use <code>torchrun</code> to launch. <code>DistributedSampler</code> for data splitting.</p>

                <h3>10. Debugging & Profiling</h3>
                <table>
                    <tr><th>Tool</th><th>Purpose</th></tr>
                    <tr><td>register_forward_hook</td><td>View intermediate activations</td></tr>
                    <tr><td>register_backward_hook</td><td>Monitor gradient magnitudes</td></tr>
                    <tr><td>torch.profiler</td><td>GPU/CPU profiling</td></tr>
                    <tr><td>torch.cuda.memory_summary()</td><td>GPU memory debugging</td></tr>
                    <tr><td>detect_anomaly()</td><td>Find NaN/Inf sources</td></tr>
                </table>

                <h3>11. torch.compile (2.x)</h3>
                <p>JIT compiles model for 30-60% speedup. <code>model = torch.compile(model)</code>. Uses TorchDynamo + Triton. Works on existing code. The future of PyTorch performance.</p>
            </div>`,
        code: `
            <div class="section">
                <h2>💻 PyTorch Project Code</h2>

                <h3>1. Complete Training Framework</h3>
                <div class="code-block"><span class="keyword">import</span> torch
<span class="keyword">import</span> torch.nn <span class="keyword">as</span> nn
<span class="keyword">from</span> torch.utils.data <span class="keyword">import</span> DataLoader

<span class="keyword">class</span> <span class="class">Trainer</span>:
    <span class="keyword">def</span> <span class="function">__init__</span>(self, model, optimizer, criterion, device=<span class="string">'cuda'</span>):
        self.model = model.to(device)
        self.optimizer = optimizer
        self.criterion = criterion
        self.device = device
        self.history = {<span class="string">'train_loss'</span>: [], <span class="string">'val_loss'</span>: []}
    
    <span class="keyword">def</span> <span class="function">train_epoch</span>(self, loader):
        self.model.train()
        total_loss = <span class="number">0</span>
        <span class="keyword">for</span> X, y <span class="keyword">in</span> loader:
            X, y = X.to(self.device), y.to(self.device)
            self.optimizer.zero_grad()
            loss = self.criterion(self.model(X), y)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(self.model.parameters(), <span class="number">1.0</span>)
            self.optimizer.step()
            total_loss += loss.item() * <span class="function">len</span>(X)
        <span class="keyword">return</span> total_loss / <span class="function">len</span>(loader.dataset)
    
    <span class="preprocessor">@torch.no_grad()</span>
    <span class="keyword">def</span> <span class="function">evaluate</span>(self, loader):
        self.model.eval()
        total_loss = <span class="number">0</span>
        <span class="keyword">for</span> X, y <span class="keyword">in</span> loader:
            X, y = X.to(self.device), y.to(self.device)
            total_loss += self.criterion(self.model(X), y).item() * <span class="function">len</span>(X)
        <span class="keyword">return</span> total_loss / <span class="function">len</span>(loader.dataset)
    
    <span class="keyword">def</span> <span class="function">fit</span>(self, train_loader, val_loader, epochs, patience=<span class="number">5</span>):
        best_loss = <span class="keyword">float</span>(<span class="string">'inf'</span>)
        wait = <span class="number">0</span>
        <span class="keyword">for</span> epoch <span class="keyword">in</span> <span class="function">range</span>(epochs):
            train_loss = self.train_epoch(train_loader)
            val_loss = self.evaluate(val_loader)
            self.history[<span class="string">'train_loss'</span>].append(train_loss)
            self.history[<span class="string">'val_loss'</span>].append(val_loss)
            <span class="function">print</span>(<span class="string">f"Epoch {epoch+1}: train={train_loss:.4f} val={val_loss:.4f}"</span>)
            <span class="keyword">if</span> val_loss < best_loss:
                best_loss = val_loss
                torch.save(self.model.state_dict(), <span class="string">'best_model.pt'</span>)
                wait = <span class="number">0</span>
            <span class="keyword">else</span>:
                wait += <span class="number">1</span>
                <span class="keyword">if</span> wait >= patience:
                    <span class="function">print</span>(<span class="string">"Early stopping!"</span>)
                    <span class="keyword">break</span></div>

                <h3>2. Custom Dataset for Any Tabular Data</h3>
                <div class="code-block"><span class="keyword">class</span> <span class="class">TabularDataset</span>(torch.utils.data.Dataset):
    <span class="keyword">def</span> <span class="function">__init__</span>(self, df, target, cat_cols=<span class="keyword">None</span>, num_cols=<span class="keyword">None</span>):
        self.target = torch.FloatTensor(df[target].values)
        self.num = torch.FloatTensor(df[num_cols].values) <span class="keyword">if</span> num_cols <span class="keyword">else</span> <span class="keyword">None</span>
        self.cat = torch.LongTensor(df[cat_cols].values) <span class="keyword">if</span> cat_cols <span class="keyword">else</span> <span class="keyword">None</span>
    
    <span class="keyword">def</span> <span class="function">__len__</span>(self):
        <span class="keyword">return</span> <span class="function">len</span>(self.target)
    
    <span class="keyword">def</span> <span class="function">__getitem__</span>(self, idx):
        x = {}
        <span class="keyword">if</span> self.num <span class="keyword">is not</span> <span class="keyword">None</span>: x[<span class="string">'num'</span>] = self.num[idx]
        <span class="keyword">if</span> self.cat <span class="keyword">is not</span> <span class="keyword">None</span>: x[<span class="string">'cat'</span>] = self.cat[idx]
        <span class="keyword">return</span> x, self.target[idx]</div>

                <h3>3. Mixed Precision + Gradient Accumulation</h3>
                <div class="code-block"><span class="keyword">from</span> torch.cuda.amp <span class="keyword">import</span> autocast, GradScaler

scaler = GradScaler()
accum_steps = <span class="number">4</span>  <span class="comment"># Effective batch = batch_size × 4</span>

<span class="keyword">for</span> i, (X, y) <span class="keyword">in</span> <span class="function">enumerate</span>(loader):
    <span class="keyword">with</span> autocast():
        loss = model(X.cuda(), y.cuda()) / accum_steps
    scaler.scale(loss).backward()
    
    <span class="keyword">if</span> (i + <span class="number">1</span>) % accum_steps == <span class="number">0</span>:
        scaler.unscale_(optimizer)
        torch.nn.utils.clip_grad_norm_(model.parameters(), <span class="number">1.0</span>)
        scaler.step(optimizer)
        scaler.update()
        optimizer.zero_grad()</div>

                <h3>4. Transfer Learning</h3>
                <div class="code-block"><span class="keyword">import</span> torchvision.models <span class="keyword">as</span> models

model = models.resnet50(weights=<span class="string">'IMAGENET1K_V2'</span>)
model.requires_grad_(<span class="keyword">False</span>)  <span class="comment"># Freeze all</span>
model.fc = nn.Sequential(
    nn.Dropout(<span class="number">0.3</span>),
    nn.Linear(<span class="number">2048</span>, <span class="number">512</span>),
    nn.ReLU(),
    nn.Linear(<span class="number">512</span>, num_classes)
)

<span class="comment"># Discriminative LR: lower for pretrained, higher for new head</span>
optimizer = torch.optim.AdamW([
    {<span class="string">'params'</span>: model.layer4.parameters(), <span class="string">'lr'</span>: <span class="number">1e-5</span>},
    {<span class="string">'params'</span>: model.fc.parameters(), <span class="string">'lr'</span>: <span class="number">1e-3</span>}
])</div>

                <h3>5. Model Save/Load Best Practices</h3>
                <div class="code-block"><span class="comment"># Save everything for resuming training</span>
checkpoint = {
    <span class="string">'epoch'</span>: epoch,
    <span class="string">'model_state'</span>: model.state_dict(),
    <span class="string">'optimizer_state'</span>: optimizer.state_dict(),
    <span class="string">'scheduler_state'</span>: scheduler.state_dict(),
    <span class="string">'best_loss'</span>: best_loss,
    <span class="string">'config'</span>: config
}
torch.save(checkpoint, <span class="string">'checkpoint.pt'</span>)

<span class="comment"># Resume training</span>
ckpt = torch.load(<span class="string">'checkpoint.pt'</span>, map_location=device)
model.load_state_dict(ckpt[<span class="string">'model_state'</span>])
optimizer.load_state_dict(ckpt[<span class="string">'optimizer_state'</span>])</div>
            </div>`,
            interview: `
            <div class="section">
                <h2>🎯 PyTorch Interview Questions</h2>
                <div class="interview-box"><strong>Q1: How does autograd work?</strong><p><strong>Answer:</strong> Records ops in DAG. .backward() traverses reverse, chain rule. Graph destroyed after backward. Dynamic = rebuilt each forward.</p></div>
                <div class="interview-box"><strong>Q2: Why zero_grad()?</strong><p><strong>Answer:</strong> Gradients accumulate. Without zeroing, previous batch adds to current. Intentional: enables gradient accumulation for larger effective batch.</p></div>
                <div class="interview-box"><strong>Q3: .detach() vs torch.no_grad()?</strong><p><strong>Answer:</strong> detach(): single tensor, shares data. no_grad(): context manager for all ops inside, saves memory. Use no_grad() for inference.</p></div>
                <div class="interview-box"><strong>Q4: How to debug vanishing gradients?</strong><p><strong>Answer:</strong> (1) Backward hooks for gradient magnitudes. (2) clip_grad_norm_. (3) TensorBoard histograms. (4) BatchNorm/LayerNorm. (5) Skip connections.</p></div>
                <div class="interview-box"><strong>Q5: DataLoader num_workers?</strong><p><strong>Answer:</strong> Rule: 4 × num_gpus. Too many = CPU overhead. pin_memory=True for faster transfers. Profile to find sweet spot.</p></div>
                <div class="interview-box"><strong>Q6: torch.compile vs eager?</strong><p><strong>Answer:</strong> compile JITs model via TorchDynamo+Triton. 30-60% faster. One line change. The future of PyTorch performance.</p></div>
                <div class="interview-box"><strong>Q7: How to save/load models?</strong><p><strong>Answer:</strong> state_dict (weights only) vs full checkpoint (weights + optimizer + epoch). Use state_dict for inference, checkpoint for resuming.</p></div>
                <div class="interview-box"><strong>Q8: Mixed precision — how and why?</strong><p><strong>Answer:</strong> autocast(fp16 forward) + GradScaler(fp32 grads). 2-3x speedup. Minimal accuracy loss. Standard for GPU training.</p></div>
            </div>`
},

"tensorflow": {
    concepts: `
            <div class="section">
                <h2>🧠 TensorFlow & Keras — Complete Guide</h2>

                <div class="info-box">
                    <div class="box-title">⚡ TF2 = Eager by Default + @tf.function for Speed</div>
                    <div class="box-content">TF2 defaults to eager mode (like PyTorch). <code>@tf.function</code> compiles to graph for production. Keras is the official API. TF handles full lifecycle: train → save → serve → monitor.</div>
                </div>

                <h3>1. Three Model APIs</h3>
                <table>
                    <tr><th>API</th><th>Use Case</th><th>Flexibility</th></tr>
                    <tr><td>Sequential</td><td>Linear stack</td><td>Low</td></tr>
                    <tr><td>Functional</td><td>Multi-input/output, branching</td><td>Medium (recommended)</td></tr>
                    <tr><td>Subclassing</td><td>Custom forward logic</td><td>High</td></tr>
                </table>

                <h3>2. tf.data Pipeline</h3>
                <p>Chains transformations lazily. <code>.map()</code>, <code>.batch()</code>, <code>.shuffle()</code>, <code>.prefetch(AUTOTUNE)</code>. Prefetching overlaps loading with GPU execution. <code>.cache()</code> for small datasets. <code>.interleave()</code> for reading multiple files. TFRecord format for large datasets.</p>

                <h3>3. Callbacks — Training Hooks</h3>
                <table>
                    <tr><th>Callback</th><th>Purpose</th></tr>
                    <tr><td>ModelCheckpoint</td><td>Save best model</td></tr>
                    <tr><td>EarlyStopping</td><td>Stop when metric plateaus</td></tr>
                    <tr><td>ReduceLROnPlateau</td><td>Reduce LR when stuck</td></tr>
                    <tr><td>TensorBoard</td><td>Visualize metrics</td></tr>
                    <tr><td>CSVLogger</td><td>Log to CSV</td></tr>
                    <tr><td>LambdaCallback</td><td>Custom per-epoch logic</td></tr>
                </table>

                <h3>4. GradientTape — Custom Training</h3>
                <p>Record ops → compute gradients → apply. Use for: GANs, RL, custom losses, gradient penalty, multi-loss weighting. Same concept as PyTorch's manual loop.</p>

                <h3>5. @tf.function — Production Speed</h3>
                <p>Trace Python → TF graph. Benefits: optimized execution, XLA, export. Gotchas: Python side effects only during tracing. Use <code>tf.print()</code> in graphs.</p>

                <h3>6. SavedModel — Universal Deployment</h3>
                <p><code>model.save('path')</code> exports architecture + weights + computation. Ready for: TF Serving (production), TF Lite (mobile), TF.js (browser). One model, any platform.</p>

                <h3>7. Keras Tuner — Automated Hyperparameter Search</h3>
                <p>Build model function → Tuner searches space. Strategies: Random, Hyperband, Bayesian. Integrates with TensorBoard. Alternative to Optuna for Keras models.</p>

                <h3>8. TF vs PyTorch — Decision Guide</h3>
                <table>
                    <tr><th>Choose TF When</th><th>Choose PyTorch When</th></tr>
                    <tr><td>Production deployment at scale</td><td>Research & prototyping</td></tr>
                    <tr><td>Mobile (TFLite mature)</td><td>Hugging Face ecosystem</td></tr>
                    <tr><td>TPU training</td><td>GPU research</td></tr>
                    <tr><td>Edge devices</td><td>Custom architectures</td></tr>
                    <tr><td>Browser (TF.js)</td><td>Academic papers</td></tr>
                </table>
            </div>`,
        code: `
            <div class="section">
                <h2>💻 TensorFlow Project Code</h2>

                <h3>1. Functional API — Multi-Input Model</h3>
                <div class="code-block"><span class="keyword">import</span> tensorflow <span class="keyword">as</span> tf
<span class="keyword">from</span> tensorflow <span class="keyword">import</span> keras

text_input = keras.Input(shape=(<span class="number">100</span>,), name=<span class="string">'text'</span>)
num_input = keras.Input(shape=(<span class="number">5</span>,), name=<span class="string">'features'</span>)

x1 = keras.layers.Embedding(<span class="number">10000</span>, <span class="number">64</span>)(text_input)
x1 = keras.layers.GlobalAveragePooling1D()(x1)
x2 = keras.layers.Dense(<span class="number">32</span>, activation=<span class="string">'relu'</span>)(num_input)

combined = keras.layers.Concatenate()([x1, x2])
x = keras.layers.Dense(<span class="number">64</span>, activation=<span class="string">'relu'</span>)(combined)
x = keras.layers.Dropout(<span class="number">0.3</span>)(x)
output = keras.layers.Dense(<span class="number">1</span>, activation=<span class="string">'sigmoid'</span>)(x)
model = keras.Model(inputs=[text_input, num_input], outputs=output)</div>

                <h3>2. Training with Callbacks</h3>
                <div class="code-block">callbacks = [
    keras.callbacks.ModelCheckpoint(<span class="string">'best.keras'</span>,
        monitor=<span class="string">'val_loss'</span>, save_best_only=<span class="keyword">True</span>),
    keras.callbacks.EarlyStopping(patience=<span class="number">5</span>,
        restore_best_weights=<span class="keyword">True</span>),
    keras.callbacks.ReduceLROnPlateau(factor=<span class="number">0.5</span>, patience=<span class="number">3</span>),
    keras.callbacks.TensorBoard(log_dir=<span class="string">'./logs'</span>)
]

model.compile(optimizer=<span class="string">'adam'</span>, loss=<span class="string">'binary_crossentropy'</span>,
    metrics=[<span class="string">'accuracy'</span>, keras.metrics.AUC()])
model.fit(X_train, y_train, epochs=<span class="number">50</span>,
    validation_split=<span class="number">0.2</span>, callbacks=callbacks)</div>

                <h3>3. Custom Training Loop (GradientTape)</h3>
                <div class="code-block"><span class="preprocessor">@tf.function</span>
<span class="keyword">def</span> <span class="function">train_step</span>(model, X, y, optimizer, loss_fn):
    <span class="keyword">with</span> tf.GradientTape() <span class="keyword">as</span> tape:
        preds = model(X, training=<span class="keyword">True</span>)
        loss = loss_fn(y, preds)
    grads = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(<span class="function">zip</span>(grads, model.trainable_variables))
    <span class="keyword">return</span> loss</div>

                <h3>4. tf.data Pipeline</h3>
                <div class="code-block">dataset = (
    tf.data.Dataset.from_tensor_slices((X, y))
    .shuffle(<span class="number">10000</span>)
    .batch(<span class="number">64</span>)
    .map(<span class="keyword">lambda</span> x, y: (augment(x), y),
        num_parallel_calls=tf.data.AUTOTUNE)
    .prefetch(tf.data.AUTOTUNE)
)</div>

                <h3>5. Custom Callback for Experiment Logging</h3>
                <div class="code-block"><span class="keyword">class</span> <span class="class">ExperimentLogger</span>(keras.callbacks.Callback):
    <span class="keyword">def</span> <span class="function">__init__</span>(self, log_path):
        self.log_path = log_path
        self.logs_data = []
    
    <span class="keyword">def</span> <span class="function">on_epoch_end</span>(self, epoch, logs=<span class="keyword">None</span>):
        self.logs_data.append({<span class="string">'epoch'</span>: epoch, **logs})
        pd.DataFrame(self.logs_data).to_csv(self.log_path, index=<span class="keyword">False</span>)
        <span class="keyword">if</span> logs[<span class="string">'val_loss'</span>] > logs[<span class="string">'loss'</span>] * <span class="number">1.5</span>:
            <span class="function">print</span>(<span class="string">f"⚠️ Possible overfitting at epoch {epoch}"</span>)</div>
            </div>`,
            interview: `
            <div class="section">
                <h2>🎯 TensorFlow Interview Questions</h2>
                <div class="interview-box"><strong>Q1: Sequential vs Functional vs Subclassing?</strong><p><strong>Answer:</strong> Sequential: linear. Functional: multi-I/O, branching. Subclassing: full Python control. Use Functional for most projects.</p></div>
                <div class="interview-box"><strong>Q2: What does @tf.function do?</strong><p><strong>Answer:</strong> Traces Python → TF graph. Faster, XLA, export. Gotcha: side effects only during tracing.</p></div>
                <div class="interview-box"><strong>Q3: tf.data performance?</strong><p><strong>Answer:</strong> prefetch(AUTOTUNE) overlaps loading+training. cache() for small data. interleave() for multiple files.</p></div>
                <div class="interview-box"><strong>Q4: EarlyStopping config?</strong><p><strong>Answer:</strong> monitor='val_loss', patience=5-10, restore_best_weights=True. Combine with ReduceLROnPlateau.</p></div>
                <div class="interview-box"><strong>Q5: When GradientTape?</strong><p><strong>Answer:</strong> GANs, RL, custom gradients, multi-loss. When .fit() is too restrictive.</p></div>
                <div class="interview-box"><strong>Q6: TF vs PyTorch?</strong><p><strong>Answer:</strong> TF: deployment (Serving, Lite, JS), mobile. PyTorch: research, HuggingFace. Both converging.</p></div>
                <div class="interview-box"><strong>Q7: How to deploy TF model?</strong><p><strong>Answer:</strong> SavedModel → TF Serving (REST/gRPC), TFLite (mobile), TF.js (browser). Docker + TF Serving for production.</p></div>
            </div>`
},

"production": {
    concepts: `
            <div class="section">
                <h2>📦 Production Python — Complete Engineering Guide</h2>

                <div class="info-box">
                    <div class="box-title">⚡ Production = Reliability + Reproducibility + Observability</div>
                    <div class="box-content">Production code must be <strong>tested</strong> (pytest), <strong>typed</strong> (mypy), <strong>logged</strong> (structured), <strong>packaged</strong> (pyproject.toml), <strong>containerized</strong> (Docker), and <strong>monitored</strong> (metrics). The gap between notebook and production is enormous.</div>
                </div>

                <h3>1. pytest — Professional Testing</h3>
                <table>
                    <tr><th>Feature</th><th>Purpose</th><th>Example</th></tr>
                    <tr><td>fixtures</td><td>Reusable test setup</td><td><code>@pytest.fixture</code></td></tr>
                    <tr><td>parametrize</td><td>Many inputs, same test</td><td><code>@pytest.mark.parametrize</code></td></tr>
                    <tr><td>conftest.py</td><td>Shared fixtures</td><td>DB connections, mock data</td></tr>
                    <tr><td>monkeypatch</td><td>Override functions/env</td><td>Mock API calls</td></tr>
                    <tr><td>tmp_path</td><td>Temp directory</td><td>Test file I/O</td></tr>
                    <tr><td>markers</td><td>Tag tests</td><td><code>pytest -m "not slow"</code></td></tr>
                    <tr><td>coverage</td><td>Measure test coverage</td><td><code>pytest --cov</code></td></tr>
                </table>

                <h3>2. Testing ML Code</h3>
                <div class="info-box">
                    <div class="box-title">🎯 What to Test in ML</div>
                    <div class="box-content">
                        <strong>Unit:</strong> data transforms, feature engineering, loss functions.<br>
                        <strong>Integration:</strong> full pipeline end-to-end.<br>
                        <strong>Model:</strong> output shape, range, determinism with seed.<br>
                        <strong>Data:</strong> schema validation, distribution shifts, missing patterns.
                    </div>
                </div>

                <h3>3. Logging Best Practices</h3>
                <table>
                    <tr><th>Level</th><th>When</th></tr>
                    <tr><td>DEBUG</td><td>Tensor shapes, intermediate values</td></tr>
                    <tr><td>INFO</td><td>Training started, epoch complete</td></tr>
                    <tr><td>WARNING</td><td>Unexpected but handled (fallback used)</td></tr>
                    <tr><td>ERROR</td><td>Model load failure, API error</td></tr>
                    <tr><td>CRITICAL</td><td>OOM, GPU crash</td></tr>
                </table>
                <p>Never use <code>print()</code>. Use structured logging (JSON format) for production — parseable by log aggregators (ELK, Datadog).</p>

                <h3>4. FastAPI for Model Serving</h3>
                <p>Modern async framework. Auto-generates OpenAPI docs. Pydantic validation. Deploy with Uvicorn + Docker. Add: health checks, input validation, error handling, rate limiting, request logging.</p>

                <h3>5. Docker for ML</h3>
                <p>Containerize everything: Python, CUDA, dependencies. Multi-stage builds: builder (install) → runtime (slim). Pin versions. NVIDIA Container Toolkit for GPU. <code>docker compose</code> for multi-service (API + Redis + DB).</p>

                <h3>6. pyproject.toml — Modern Packaging</h3>
                <p>Replaces setup.py/cfg. Project metadata, dependencies, build system, tool configs (pytest, mypy, ruff). <code>[project.optional-dependencies]</code> for dev/test extras. <code>pip install -e ".[dev]"</code> for editable installs.</p>

                <h3>7. Configuration Management</h3>
                <table>
                    <tr><th>Tool</th><th>Best For</th><th>Key Feature</th></tr>
                    <tr><td>Hydra</td><td>ML experiments</td><td>YAML, CLI overrides, multi-run</td></tr>
                    <tr><td>Pydantic Settings</td><td>App config</td><td>Env var loading, validation</td></tr>
                    <tr><td>python-dotenv</td><td>Simple projects</td><td>.env file loading</td></tr>
                </table>

                <h3>8. CI/CD for ML</h3>
                <p>GitHub Actions: lint (ruff) → type check (mypy) → test (pytest) → build (Docker) → deploy. Add model validation gate: new model must beat baseline on test metrics before deployment.</p>

                <h3>9. Code Quality Tools</h3>
                <table>
                    <tr><th>Tool</th><th>Purpose</th></tr>
                    <tr><td><strong>ruff</strong></td><td>Fast linter + formatter (replaces black, isort, flake8)</td></tr>
                    <tr><td><strong>mypy</strong></td><td>Static type checking</td></tr>
                    <tr><td><strong>pre-commit</strong></td><td>Git hooks for auto-formatting</td></tr>
                    <tr><td><strong>pytest-cov</strong></td><td>Test coverage</td></tr>
                    <tr><td><strong>bandit</strong></td><td>Security linting</td></tr>
                </table>

                <h3>10. MLOps — Model Lifecycle</h3>
                <table>
                    <tr><th>Tool</th><th>Purpose</th></tr>
                    <tr><td>MLflow</td><td>Experiment tracking, model registry</td></tr>
                    <tr><td>DVC</td><td>Data versioning (like Git for data)</td></tr>
                    <tr><td>Weights & Biases</td><td>Experiment tracking, visualization</td></tr>
                    <tr><td>Evidently</td><td>Data drift & model monitoring</td></tr>
                    <tr><td>Great Expectations</td><td>Data validation</td></tr>
                </table>

                <h3>11. Database for ML Projects</h3>
                <table>
                    <tr><th>DB</th><th>Use Case</th><th>Python Library</th></tr>
                    <tr><td>SQLite</td><td>Local, small data, prototyping</td><td>sqlite3 (built-in)</td></tr>
                    <tr><td>PostgreSQL</td><td>Production, ACID, JSON</td><td>psycopg2, SQLAlchemy</td></tr>
                    <tr><td>Redis</td><td>Caching, queues, sessions</td><td>redis-py</td></tr>
                    <tr><td>MongoDB</td><td>Flexible schema, documents</td><td>pymongo</td></tr>
                    <tr><td>Pinecone/Weaviate</td><td>Vector search (embeddings)</td><td>Official SDKs</td></tr>
                </table>
            </div>`,
        code: `
            <div class="section">
                <h2>💻 Production Python Project Code</h2>

                <h3>1. pytest — Complete ML Testing</h3>
                <div class="code-block"><span class="keyword">import</span> pytest
<span class="keyword">import</span> numpy <span class="keyword">as</span> np

<span class="comment"># conftest.py — shared fixtures</span>
<span class="preprocessor">@pytest.fixture</span>
<span class="keyword">def</span> <span class="function">sample_data</span>():
    np.random.seed(<span class="number">42</span>)
    X = np.random.randn(<span class="number">100</span>, <span class="number">10</span>)
    y = np.random.randint(<span class="number">0</span>, <span class="number">2</span>, <span class="number">100</span>)
    <span class="keyword">return</span> X, y

<span class="preprocessor">@pytest.fixture</span>
<span class="keyword">def</span> <span class="function">trained_model</span>(sample_data):
    X, y = sample_data
    model = RandomForestClassifier(n_estimators=<span class="number">10</span>)
    model.fit(X, y)
    <span class="keyword">return</span> model

<span class="comment"># Test multiple models with one function</span>
<span class="preprocessor">@pytest.mark.parametrize</span>(<span class="string">"model_cls"</span>, [
    LogisticRegression, RandomForestClassifier, GradientBoostingClassifier
])
<span class="keyword">def</span> <span class="function">test_model_output</span>(model_cls, sample_data):
    X, y = sample_data
    model = model_cls()
    model.fit(X, y)
    preds = model.predict(X)
    <span class="keyword">assert</span> preds.shape == y.shape
    <span class="keyword">assert</span> <span class="function">set</span>(np.unique(preds)).issubset({<span class="number">0</span>, <span class="number">1</span>})

<span class="comment"># Test data pipeline</span>
<span class="keyword">def</span> <span class="function">test_pipeline_no_leakage</span>(sample_data, pipeline):
    X, y = sample_data
    scores = cross_val_score(pipeline, X, y, cv=<span class="number">3</span>)
    <span class="keyword">assert</span> <span class="function">all</span>(s >= <span class="number">0</span> <span class="keyword">and</span> s <= <span class="number">1</span> <span class="keyword">for</span> s <span class="keyword">in</span> scores)</div>

                <h3>2. Structured Logging</h3>
                <div class="code-block"><span class="keyword">import</span> logging, json, sys

<span class="keyword">class</span> <span class="class">JSONFormatter</span>(logging.Formatter):
    <span class="keyword">def</span> <span class="function">format</span>(self, record):
        log = {
            <span class="string">'timestamp'</span>: self.formatTime(record),
            <span class="string">'level'</span>: record.levelname,
            <span class="string">'module'</span>: record.module,
            <span class="string">'message'</span>: record.getMessage()
        }
        <span class="keyword">if</span> record.exc_info:
            log[<span class="string">'exception'</span>] = self.formatException(record.exc_info)
        <span class="keyword">return</span> json.dumps(log)

<span class="keyword">def</span> <span class="function">setup_logging</span>(level=logging.INFO):
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    logging.root.handlers = [handler]
    logging.root.setLevel(level)

logger = logging.getLogger(__name__)
logger.info(<span class="string">"Training started"</span>, extra={<span class="string">'model'</span>: <span class="string">'xgb'</span>})</div>

                <h3>3. FastAPI — Complete ML API</h3>
                <div class="code-block"><span class="keyword">from</span> fastapi <span class="keyword">import</span> FastAPI, HTTPException
<span class="keyword">from</span> pydantic <span class="keyword">import</span> BaseModel, Field
<span class="keyword">import</span> joblib, numpy <span class="keyword">as</span> np

app = FastAPI(title=<span class="string">"ML Prediction API"</span>)
model = <span class="keyword">None</span>

<span class="preprocessor">@app.on_event</span>(<span class="string">"startup"</span>)
<span class="keyword">def</span> <span class="function">load_model</span>():
    <span class="keyword">global</span> model
    model = joblib.load(<span class="string">"models/pipeline.pkl"</span>)

<span class="keyword">class</span> <span class="class">PredictRequest</span>(BaseModel):
    features: <span class="keyword">list</span>[<span class="keyword">float</span>] = Field(..., min_length=<span class="number">1</span>)

<span class="keyword">class</span> <span class="class">PredictResponse</span>(BaseModel):
    prediction: <span class="keyword">int</span>
    probability: <span class="keyword">float</span>
    model_version: <span class="keyword">str</span>

<span class="preprocessor">@app.post</span>(<span class="string">"/predict"</span>, response_model=PredictResponse)
<span class="keyword">async def</span> <span class="function">predict</span>(req: PredictRequest):
    <span class="keyword">try</span>:
        X = np.array(req.features).reshape(<span class="number">1</span>, -<span class="number">1</span>)
        pred = model.predict(X)[<span class="number">0</span>]
        proba = model.predict_proba(X)[<span class="number">0</span>].max()
        <span class="keyword">return</span> PredictResponse(
            prediction=<span class="keyword">int</span>(pred), probability=<span class="keyword">float</span>(proba),
            model_version=<span class="string">"v2.1"</span>
        )
    <span class="keyword">except</span> <span class="function">Exception</span> <span class="keyword">as</span> e:
        <span class="keyword">raise</span> HTTPException(<span class="number">500</span>, detail=<span class="keyword">str</span>(e))

<span class="preprocessor">@app.get</span>(<span class="string">"/health"</span>)
<span class="keyword">async def</span> <span class="function">health</span>():
    <span class="keyword">return</span> {<span class="string">"status"</span>: <span class="string">"healthy"</span>, <span class="string">"model_loaded"</span>: model <span class="keyword">is not</span> <span class="keyword">None</span>}</div>

                <h3>4. Dockerfile for ML</h3>
                <div class="code-block"><span class="comment"># Multi-stage build</span>
FROM python:3.11-slim AS builder
COPY requirements.txt .
RUN pip install --no-cache-dir --target=/deps -r requirements.txt

FROM python:3.11-slim
COPY --from=builder /deps /usr/local/lib/python3.11/site-packages
COPY src/ /app/src/
COPY models/ /app/models/
WORKDIR /app
EXPOSE 8000
HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]</div>

                <h3>5. Makefile for Project Commands</h3>
                <div class="code-block"><span class="comment"># Makefile — run from project root</span>
.PHONY: install test lint train serve

install:
    pip install -e ".[dev]"

test:
    pytest tests/ -v --cov=src --cov-report=term-missing

lint:
    ruff check src/ tests/
    mypy src/

train:
    python -m src.training.train --config configs/default.yaml

serve:
    uvicorn src.api:app --reload --port 8000</div>

                <h3>6. MLflow Experiment Tracking</h3>
                <div class="code-block"><span class="keyword">import</span> mlflow

mlflow.set_experiment(<span class="string">"customer_churn"</span>)
<span class="keyword">with</span> mlflow.start_run():
    mlflow.log_params({<span class="string">"model"</span>: <span class="string">"xgb"</span>, <span class="string">"lr"</span>: <span class="number">0.01</span>})
    model.fit(X_train, y_train)
    mlflow.log_metrics({<span class="string">"f1"</span>: f1, <span class="string">"auc"</span>: auc_score})
    mlflow.sklearn.log_model(pipeline, <span class="string">"model"</span>)</div>
            </div>`,
            interview: `
            <div class="section">
                <h2>🎯 Production Python Interview Questions</h2>
                <div class="interview-box"><strong>Q1: How to test ML code?</strong><p><strong>Answer:</strong> Unit: transforms, features. Integration: full pipeline. Model: shape, range, determinism. Data: schema, distributions. Use pytest fixtures.</p></div>
                <div class="interview-box"><strong>Q2: print() vs logging?</strong><p><strong>Answer:</strong> Logging: levels, file output, structured (JSON), zero cost when disabled, thread-safe. Print: none. Production = logging.</p></div>
                <div class="interview-box"><strong>Q3: How to serve ML model?</strong><p><strong>Answer:</strong> FastAPI + Docker. Load model at startup. Add health checks, validation, error handling, logging. Async for throughput.</p></div>
                <div class="interview-box"><strong>Q4: pyproject.toml vs setup.py?</strong><p><strong>Answer:</strong> pyproject.toml: modern standard, all tools in one file. Pin deps. Use optional deps for dev/test. pip install -e ".[dev]".</p></div>
                <div class="interview-box"><strong>Q5: ML experiment configs?</strong><p><strong>Answer:</strong> Hydra: YAML + CLI overrides + multi-run sweeps. Version control configs. Never hardcode hyperparams.</p></div>
                <div class="interview-box"><strong>Q6: CI/CD for ML?</strong><p><strong>Answer:</strong> lint → type-check → test → build → deploy. Model validation gate: must beat baseline. GitHub Actions + Docker.</p></div>
                <div class="interview-box"><strong>Q7: How to handle model versioning?</strong><p><strong>Answer:</strong> MLflow model registry. DVC for data. Git for code. timestamp + metrics in model filename. A/B testing for rollout.</p></div>
                <div class="interview-box"><strong>Q8: What is data drift?</strong><p><strong>Answer:</strong> Input distribution changes post-deployment. Detect: Evidently, statistical tests. Monitor: feature distributions, prediction distributions. Retrain trigger.</p></div>
            </div>`
},

"optimization": {
    concepts: `
            <div class="section">
                <h2>⚡ Performance & Optimization — Complete Guide</h2>

                <div class="info-box">
                    <div class="box-title">⚡ The Optimization Hierarchy</div>
                    <div class="box-content"><strong>1. Algorithm</strong> (O(n²)→O(n log n)) > <strong>2. Data structures</strong> (list→set) > <strong>3. Vectorization</strong> (NumPy) > <strong>4. Compilation</strong> (Numba/Cython) > <strong>5. Parallelization</strong> (multiprocessing) > <strong>6. Hardware</strong> (GPU). Always start from the top.</div>
                </div>

                <h3>1. Profiling — Measure First</h3>
                <table>
                    <tr><th>Tool</th><th>Type</th><th>When</th><th>Overhead</th></tr>
                    <tr><td>cProfile</td><td>Function-level</td><td>Find slow functions</td><td>~2x</td></tr>
                    <tr><td>line_profiler</td><td>Line-by-line</td><td>Optimize hot function</td><td>Higher</td></tr>
                    <tr><td>Py-Spy</td><td>Sampling</td><td>Production profiling</td><td>Near zero</td></tr>
                    <tr><td>tracemalloc</td><td>Memory</td><td>Find leaks</td><td>Low</td></tr>
                    <tr><td>memory_profiler</td><td>Line memory</td><td>Memory per line</td><td>High</td></tr>
                    <tr><td>scalene</td><td>CPU+Memory+GPU</td><td>Comprehensive</td><td>Low</td></tr>
                </table>

                <h3>2. The GIL — What Every Python Dev Must Know</h3>
                <div class="info-box">
                    <div class="box-title">🔒 Global Interpreter Lock</div>
                    <div class="box-content">GIL prevents true multi-threading for CPU-bound Python. BUT: NumPy, Pandas, scikit-learn <strong>release the GIL</strong> during C operations. Python 3.13: experimental free-threaded CPython (no-GIL).</div>
                </div>
                <table>
                    <tr><th>Task Type</th><th>Solution</th><th>Why</th></tr>
                    <tr><td>I/O-bound</td><td>asyncio / threading</td><td>GIL released during I/O</td></tr>
                    <tr><td>CPU-bound Python</td><td>multiprocessing</td><td>Separate processes, separate GIL</td></tr>
                    <tr><td>CPU-bound NumPy</td><td>threading OK</td><td>NumPy releases GIL</td></tr>
                    <tr><td>Many tasks</td><td>concurrent.futures</td><td>Simple Pool interface</td></tr>
                </table>

                <h3>3. Numba — JIT Compilation</h3>
                <p><code>@numba.jit(nopython=True)</code>: compile to machine code. 10-100x speedup for loops. Supports NumPy, math. <code>@numba.vectorize</code>: custom ufuncs. <code>@cuda.jit</code>: GPU kernels. Best for: tight loops that can't be vectorized.</p>

                <h3>4. Dask — Parallel Computing</h3>
                <p>Pandas/NumPy API for data bigger than memory. <code>dask.dataframe</code>, <code>dask.array</code>, <code>dask.delayed</code>. Lazy execution. Task graph scheduler. Scales from laptop to cluster. Alternative: Polars for single-machine parallel.</p>

                <h3>5. Ray — Distributed ML</h3>
                <p>General-purpose distributed framework. Ray Tune (hyperparameter tuning), Ray Serve (model serving), Ray Data. Easier than Dask for ML. Used by OpenAI, Uber.</p>

                <h3>6. Memory Optimization</h3>
                <ul>
                    <li><strong>__slots__:</strong> 40% memory savings per instance</li>
                    <li><strong>Generators:</strong> O(1) memory vs O(n) for lists</li>
                    <li><strong>dtype downcasting:</strong> float64→float32 = 50% savings</li>
                    <li><strong>Category dtype:</strong> Repeated strings → 90% savings</li>
                    <li><strong>Memory-mapped files:</strong> Process files > RAM</li>
                    <li><strong>del + gc.collect():</strong> Free large objects</li>
                    <li><strong>array module:</strong> For simple typed arrays (no NumPy overhead)</li>
                </ul>

                <h3>7. Caching Strategies</h3>
                <table>
                    <tr><th>Tool</th><th>Scope</th><th>Use Case</th></tr>
                    <tr><td>@functools.lru_cache</td><td>In-memory, function</td><td>Expensive computations</td></tr>
                    <tr><td>@functools.cache</td><td>Unbounded cache</td><td>Pure functions</td></tr>
                    <tr><td>joblib.Memory</td><td>Disk cache</td><td>Data processing pipelines</td></tr>
                    <tr><td>Redis</td><td>External cache</td><td>Multi-process, API responses</td></tr>
                    <tr><td>diskcache</td><td>Pure Python disk</td><td>Simple persistent cache</td></tr>
                </table>

                <h3>8. Python 3.12-3.13 Performance</h3>
                <p><strong>3.12:</strong> 5-15% faster, better errors, per-interpreter GIL. <strong>3.13:</strong> Free-threaded (no-GIL experimental), JIT compiler (experimental). The future of Python performance is exciting.</p>

                <h3>9. Common Performance Anti-Patterns</h3>
                <table>
                    <tr><th>Anti-Pattern</th><th>Fix</th><th>Speedup</th></tr>
                    <tr><td><code>for row in df.iterrows()</code></td><td>Vectorized ops</td><td>100-1000x</td></tr>
                    <tr><td><code>s += "text"</code> in loop</td><td><code>''.join(parts)</code></td><td>100x</td></tr>
                    <tr><td><code>x in big_list</code></td><td><code>x in big_set</code></td><td>1000x</td></tr>
                    <tr><td>Python list of floats</td><td>NumPy array</td><td>50-100x</td></tr>
                    <tr><td>Global imports in function</td><td>Import at top</td><td>Variable</td></tr>
                    <tr><td>Not using built-ins</td><td><code>sum()</code>, <code>min()</code></td><td>5-10x</td></tr>
                </table>
            </div>`,
        code: `
            <div class="section">
                <h2>💻 Performance Code Examples</h2>

                <h3>1. Profiling Workflow</h3>
                <div class="code-block"><span class="keyword">import</span> cProfile, pstats

<span class="comment"># Profile and find bottlenecks</span>
<span class="keyword">with</span> cProfile.Profile() <span class="keyword">as</span> pr:
    result = expensive_pipeline(data)

stats = pstats.Stats(pr)
stats.sort_stats(<span class="string">'cumulative'</span>)
stats.print_stats(<span class="number">10</span>)  <span class="comment"># Top 10 slow functions</span>

<span class="comment"># Memory profiling</span>
<span class="keyword">import</span> tracemalloc
tracemalloc.start()
<span class="comment"># ... process data ...</span>
snapshot = tracemalloc.take_snapshot()
<span class="keyword">for</span> stat <span class="keyword">in</span> snapshot.statistics(<span class="string">'filename'</span>)[:<span class="number">5</span>]:
    <span class="function">print</span>(stat)</div>

                <h3>2. Numba JIT</h3>
                <div class="code-block"><span class="keyword">import</span> numba
<span class="keyword">import</span> numpy <span class="keyword">as</span> np

<span class="preprocessor">@numba.jit</span>(nopython=<span class="keyword">True</span>)
<span class="keyword">def</span> <span class="function">pairwise_distance</span>(X):
    n = X.shape[<span class="number">0</span>]
    D = np.empty((n, n))
    <span class="keyword">for</span> i <span class="keyword">in</span> <span class="function">range</span>(n):
        <span class="keyword">for</span> j <span class="keyword">in</span> <span class="function">range</span>(i+<span class="number">1</span>, n):
            d = <span class="number">0.0</span>
            <span class="keyword">for</span> k <span class="keyword">in</span> <span class="function">range</span>(X.shape[<span class="number">1</span>]):
                d += (X[i,k] - X[j,k]) ** <span class="number">2</span>
            D[i,j] = D[j,i] = d ** <span class="number">0.5</span>
    <span class="keyword">return</span> D
<span class="comment"># 100x faster than pure Python!</span></div>

                <h3>3. concurrent.futures — Parallel Processing</h3>
                <div class="code-block"><span class="keyword">from</span> concurrent.futures <span class="keyword">import</span> ProcessPoolExecutor, ThreadPoolExecutor

<span class="comment"># CPU-bound: processes</span>
<span class="keyword">with</span> ProcessPoolExecutor(max_workers=<span class="number">8</span>) <span class="keyword">as</span> ex:
    results = <span class="keyword">list</span>(ex.map(process_chunk, data_chunks))

<span class="comment"># I/O-bound: threads</span>
<span class="keyword">with</span> ThreadPoolExecutor(max_workers=<span class="number">32</span>) <span class="keyword">as</span> ex:
    results = <span class="keyword">list</span>(ex.map(fetch_url, urls))</div>

                <h3>4. Dask for Large Data</h3>
                <div class="code-block"><span class="keyword">import</span> dask.dataframe <span class="keyword">as</span> dd

<span class="comment"># Read 100GB of CSVs — lazy!</span>
ddf = dd.read_csv(<span class="string">'data/*.csv'</span>)

<span class="comment"># Same Pandas API — but parallel</span>
result = (
    ddf.groupby(<span class="string">'category'</span>)
    .agg({<span class="string">'revenue'</span>: <span class="string">'sum'</span>, <span class="string">'qty'</span>: <span class="string">'mean'</span>})
    .compute()  <span class="comment"># Only here does it execute</span>
)</div>

                <h3>5. functools.lru_cache — Memoization</h3>
                <div class="code-block"><span class="keyword">from</span> functools <span class="keyword">import</span> lru_cache

<span class="preprocessor">@lru_cache</span>(maxsize=<span class="number">1024</span>)
<span class="keyword">def</span> <span class="function">expensive_feature</span>(customer_id: <span class="keyword">int</span>) -> <span class="keyword">dict</span>:
    <span class="comment"># DB query, computation, etc.</span>
    <span class="keyword">return</span> compute_features(customer_id)

<span class="comment"># First call: computes. Second call: instant from cache</span>
<span class="function">print</span>(expensive_feature.cache_info())  <span class="comment"># hits, misses, size</span></div>

                <h3>6. __slots__ for Memory</h3>
                <div class="code-block"><span class="keyword">class</span> <span class="class">Point</span>:
    __slots__ = (<span class="string">'x'</span>, <span class="string">'y'</span>, <span class="string">'z'</span>)
    <span class="keyword">def</span> <span class="function">__init__</span>(self, x, y, z):
        self.x, self.y, self.z = x, y, z

<span class="comment"># 1M instances: ~60MB vs ~160MB without __slots__</span>
points = [Point(i, i*<span class="number">2</span>, i*<span class="number">3</span>) <span class="keyword">for</span> i <span class="keyword">in</span> <span class="function">range</span>(<span class="number">1_000_000</span>)]</div>

                <h3>7. String Performance</h3>
                <div class="code-block"><span class="comment"># ❌ O(n²) — creates new string each iteration</span>
result = <span class="string">""</span>
<span class="keyword">for</span> word <span class="keyword">in</span> words:
    result += word + <span class="string">" "</span>

<span class="comment"># ✅ O(n) — single allocation at end</span>
result = <span class="string">" "</span>.join(words)</div>
            </div>`,
            interview: `
            <div class="section">
                <h2>🎯 Performance Interview Questions</h2>
                <div class="interview-box"><strong>Q1: Why the GIL?</strong><p><strong>Answer:</strong> Simplifies reference counting. Makes single-threaded faster. Easier C extensions. Python 3.13 has experimental no-GIL mode.</p></div>
                <div class="interview-box"><strong>Q2: Optimize nested loop?</strong><p><strong>Answer:</strong> (1) NumPy vectorize. (2) Numba JIT. (3) Cython. (4) multiprocessing if independent.</p></div>
                <div class="interview-box"><strong>Q3: Threading vs multiprocessing?</strong><p><strong>Answer:</strong> Threading: I/O-bound (shared memory). Multiprocessing: CPU-bound (bypasses GIL). Downloads→threads. Matrix math→processes.</p></div>
                <div class="interview-box"><strong>Q4: What is Numba?</strong><p><strong>Answer:</strong> JIT compiler: Python→machine code via LLVM. @jit(nopython=True). 10-100x for NumPy loops. No Pandas/strings.</p></div>
                <div class="interview-box"><strong>Q5: How to profile Python?</strong><p><strong>Answer:</strong> cProfile: functions. line_profiler: lines. Py-Spy: production. tracemalloc: memory. scalene: all-in-one. Profile FIRST, optimize second.</p></div>
                <div class="interview-box"><strong>Q6: Dask vs Ray vs Spark?</strong><p><strong>Answer:</strong> Dask: Pandas API, Python-native. Ray: ML-focused. Spark: JVM, TB+ data. Python ML: Dask/Ray. Big data ETL: Spark.</p></div>
                <div class="interview-box"><strong>Q7: Top 3 Python performance tips?</strong><p><strong>Answer:</strong> (1) Use sets not lists for lookups. (2) NumPy not Python loops. (3) Generator expressions for memory. Bonus: lru_cache for expensive functions.</p></div>
                <div class="interview-box"><strong>Q8: How does lru_cache work?</strong><p><strong>Answer:</strong> Hash-based memoization. Args must be hashable. maxsize=None for unlimited. cache_info() shows hits/misses. Perfect for pure functions.</p></div>
            </div>`
}
};
function renderDashboard() {
    const grid = document.getElementById('modulesGrid');
    grid.innerHTML = modules.map(module => `
        <div class="card" onclick="showModule('${module.id}')">
            <div class="card-icon">${module.icon}</div>
            <h3>${module.title}</h3>
            <p>${module.description}</p>
            <span class="category-label">${module.category}</span>
        </div>
    `).join('');
}

// Show specific module
function showModule(moduleId) {
    const module = modules.find(m => m.id === moduleId);
    const content = MODULE_CONTENT[moduleId];

    document.getElementById('dashboard').classList.remove('active');

    const moduleHTML = `
        <div class="module active" id="module-${moduleId}">
            <button class="btn-back" onclick="backToDashboard()">← Back to Dashboard</button>
            <header>
                <h1>${module.icon} ${module.title}</h1>
                <p class="subtitle">${module.description}</p>
            </header>
            
            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab('${moduleId}', 'concepts', event)">📖 Key Concepts</button>
                <button class="tab-btn" onclick="switchTab('${moduleId}', 'code', event)">💻 Code Examples</button>
                <button class="tab-btn" onclick="switchTab('${moduleId}', 'interview', event)">🎯 Interview Questions</button>
            </div>
            
            <div id="${moduleId}-concepts" class="tab active">${content.concepts}</div>
            <div id="${moduleId}-code" class="tab">${content.code}</div>
            <div id="${moduleId}-interview" class="tab">${content.interview}</div>
        </div>
    `;

    document.getElementById('modulesContainer').innerHTML = moduleHTML;
}

// Switch tabs
function switchTab(moduleId, tabName, e) {
    const moduleEl = document.getElementById(`module-${moduleId}`);

    // Update tab buttons
    moduleEl.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (e && e.target) {
        e.target.classList.add('active');
    } else {
        // Fallback: find the button by tab name
        const tabNames = ['concepts', 'code', 'interview'];
        const idx = tabNames.indexOf(tabName);
        if (idx !== -1) moduleEl.querySelectorAll('.tab-btn')[idx]?.classList.add('active');
    }

    // Update tab content
    moduleEl.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${moduleId}-${tabName}`).classList.add('active');
}

// Back to dashboard
function backToDashboard() {
    document.querySelectorAll('.module').forEach(m => m.remove());
    document.getElementById('dashboard').classList.add('active');
}

// Initialize

document.addEventListener('DOMContentLoaded', renderDashboard);
