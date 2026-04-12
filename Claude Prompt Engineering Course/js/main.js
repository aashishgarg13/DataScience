// ============ THEME TOGGLE ============
(function () {
  const html = document.documentElement;
  let theme = (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  html.setAttribute('data-theme', theme);

  function updateToggles() {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.innerHTML = theme === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      btn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateToggles();
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        theme = theme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', theme);
        // theme stored in memory only
        updateToggles();
      });
    });
  });
})();

// ============ MOBILE MENU ============
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // ============ CODE COPY ============
  document.querySelectorAll('.code-block__copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-block').querySelector('pre');
      navigator.clipboard.writeText(pre.textContent).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
      });
    });
  });

  // ============ PROMPT TABS ============
  document.querySelectorAll('.prompt-example__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const example = tab.closest('.prompt-example');
      example.querySelectorAll('.prompt-example__tab').forEach(t => t.classList.remove('active'));
      example.querySelectorAll('.prompt-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = example.querySelector('#' + tab.dataset.panel);
      if (target) target.classList.add('active');
    });
  });

  // ============ SCROLL ANIMATIONS ============
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animate-in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.lesson-card, .track-card, .feature-item, .technique-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    observer.observe(el);
  });

  document.addEventListener('animationend', (e) => {
    e.target.style.opacity = '';
    e.target.style.transform = '';
  });

  // ============ ACTIVE SIDEBAR LINK ============
  const sidebarLinks = document.querySelectorAll('.sidebar__item a');
  const hash = window.location.pathname.split('/').pop();
  sidebarLinks.forEach(a => {
    if (a.getAttribute('href') && a.getAttribute('href').includes(hash)) {
      a.closest('.sidebar__item').classList.add('active');
    }
  });
});

// ============ PLAYGROUND DEMO ============
window.runPlayground = function () {
  const input = document.getElementById('pg-input');
  const output = document.getElementById('pg-output');
  const technique = document.getElementById('pg-technique');
  if (!input || !output) return;

  const prompt = input.value.trim();
  if (!prompt) { output.textContent = 'Please enter a prompt first.'; return; }

  const t = technique ? technique.value : 'basic';
  const examples = {
    basic: `[Response to: "${prompt.slice(0, 50)}..."]\n\nThis is a simulated response demonstrating basic prompting. In a real Claude session, the model reads your exact words and generates a contextually appropriate reply.\n\nKey insight: The clearer your prompt, the better the response.`,
    roleplay: `[Role: Expert assigned]\nAs a domain expert, I'll answer: "${prompt.slice(0, 50)}..."\n\nRole prompting activates Claude's specialized knowledge modes. By assigning a persona, you frame the response context and get more authoritative, on-topic answers.`,
    cot: `[Chain-of-Thought activated]\nLet me think through this step by step:\n\n1. First, I identify the core question in: "${prompt.slice(0, 40)}..."\n2. I consider the relevant context and constraints\n3. I reason through potential approaches\n4. I arrive at a well-structured conclusion\n\nResult: CoT prompting dramatically improves accuracy on complex reasoning tasks.`,
    xml: `[XML-structured response]\n<answer>\n  <analysis>Understanding the prompt: "${prompt.slice(0, 40)}..."</analysis>\n  <reasoning>XML tags help Claude organize output and follow structured instructions precisely</reasoning>\n  <conclusion>Structured prompts yield structured, predictable outputs</conclusion>\n</answer>`,
    fewshot: `[Few-shot learning activated]\nBased on the patterns in your examples, I'm applying that template to: "${prompt.slice(0, 40)}..."\n\nFew-shot prompting shows Claude the exact format and style you want, eliminating ambiguity and dramatically improving output consistency.`
  };
  output.textContent = examples[t] || examples.basic;
};
