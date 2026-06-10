/* ============================================================
   AI Vocabulary Lab — app.js
   Corduroy Intelligence
   ============================================================ */

/* ============================================================
   DATA
   ============================================================ */

// 40 flashcard terms
const TERMS = [
  { term: 'Artificial Intelligence', abbr: 'AI', def: 'Software that performs tasks that normally require human intelligence — language, recognition, planning, decision-making. The umbrella term.' },
  { term: 'Machine Learning', abbr: 'ML', def: 'A subset of AI where the system learns patterns from data instead of being explicitly programmed. Dominant approach for 15 years.' },
  { term: 'Deep Learning', abbr: '', def: 'Machine learning using neural networks with many layers. The breakthrough behind virtually all modern AI.' },
  { term: 'Neural Network', abbr: '', def: 'A mathematical model loosely inspired by the brain — layers of "neurons" with adjustable weights that learn patterns.' },
  { term: 'Generative AI', abbr: '', def: 'Models that create new content — text, images, audio, video, code — rather than just classifying or predicting from existing data.' },
  { term: 'Large Language Model', abbr: 'LLM', def: 'A generative model trained on huge text corpora to predict the next word, scaled until it can write, reason, and converse. The thing behind ChatGPT, Claude, Gemini.' },
  { term: 'Foundation Model', abbr: '', def: 'A large, general-purpose model trained once on broad data, then adapted to many downstream uses. "Foundation" because everything else builds on it.' },
  { term: 'Frontier Model', abbr: '', def: 'The current most-capable generation of foundation models — what the industry pushes the limits with (Claude Opus, GPT-5, Gemini Ultra).' },
  { term: 'Training', abbr: '', def: 'The (very expensive) process of feeding a model data so it learns. A frontier model costs $100M–$1B+ and burns months of GPU time.' },
  { term: 'Inference', abbr: '', def: 'Running a trained model to actually answer a question. What happens every time you press send. Cheap per call, huge in aggregate.' },
  { term: 'Parameters', abbr: '', def: 'The internal "dials" the model adjusts during training. Frontier LLMs have hundreds of billions to trillions. More ≠ always better.' },
  { term: 'Tokens', abbr: '', def: 'How text is chopped up before the model sees it. Roughly ¾ of a word each. Vendor pricing is almost always per token.' },
  { term: 'Context Window', abbr: '', def: 'How much text a model can "see" at once. 200K tokens ≈ 500 pages. Bigger context = more documents in one shot.' },
  { term: 'Embeddings', abbr: '', def: 'Numerical fingerprints of meaning. The model turns every word, sentence, or document into a vector so it can compare ideas mathematically.' },
  { term: 'Transformer', abbr: '', def: 'The neural-network architecture (invented at Google in 2017) behind every modern LLM. The "T" in GPT.' },
  { term: 'Compute', abbr: '', def: 'Raw processing power — almost always GPUs from Nvidia. The scarce, expensive resource that gates the entire industry.' },
  { term: 'Prompt', abbr: '', def: 'The instructions you give the model. "Prompt engineering" is the craft of writing them well — it matters more than people expect.' },
  { term: 'System Prompt', abbr: '', def: 'Hidden instructions a developer sets to shape behavior across every conversation — "you are a tax-research assistant…"' },
  { term: 'RAG', abbr: 'Retrieval-Augmented Generation', def: 'Let the model look things up in your documents before answering, instead of relying only on training data. The standard pattern for working with private data.' },
  { term: 'Fine-Tuning', abbr: '', def: 'Continuing to train an existing model on your data so it specializes. Cheaper than training from scratch; less needed now that prompts and RAG are powerful.' },
  { term: 'Agent', abbr: '', def: 'An AI that takes multi-step actions on its own — plans, calls tools, checks results, iterates. "Agentic" workflows are the 2025–26 frontier.' },
  { term: 'Tool Use', abbr: 'Function Calling', def: 'A model\'s ability to call external software — search, calculators, databases, APIs — rather than just produce text. What makes an agent useful.' },
  { term: 'MCP', abbr: 'Model Context Protocol', def: 'An open standard (from Anthropic, now industry-adopted) for connecting AI models to data sources and tools. Think "USB-C for AI integrations."' },
  { term: 'Multimodal', abbr: '', def: 'Models that handle multiple input types at once: text + images + audio + video. Increasingly the default for frontier models.' },
  { term: 'Hallucination', abbr: '', def: 'When a model produces plausible-sounding but false content. The #1 reliability problem in production AI.' },
  { term: 'Benchmark', abbr: '', def: 'A standardized test for model capability — MMLU, GPQA, SWE-Bench, HumanEval. Useful, but watch for "benchmaxing."' },
  { term: 'Open vs. Closed', abbr: '', def: 'Closed: you call a vendor\'s API (Claude, GPT). Open weights: you download and run the model yourself (Llama, Mistral, DeepSeek).' },
  { term: 'Alignment', abbr: '', def: 'The work of making models behave the way humans want them to — helpful, honest, harmless. Both a research field and a product property.' },
  { term: 'RLHF', abbr: 'Reinforcement Learning from Human Feedback', def: 'The standard technique that turns a raw LLM into a polite, useful assistant.' },
  { term: 'Guardrails', abbr: '', def: 'Rules and filters that constrain what a model will do — refuse certain content, redact PII, stay in-policy.' },
  { term: 'Jailbreak', abbr: '', def: 'A prompt that tricks a model into bypassing its guardrails. The cat-and-mouse game of AI security.' },
  { term: 'Inference Cost', abbr: '', def: 'What you pay per token to use a model. Frontier models run roughly $1–$75 per million tokens; pricing drops ~10× per year.' },
  { term: 'Anthropic', abbr: 'US · Founded 2021', def: 'Builds the Claude family (Opus, Sonnet, Haiku). Safety- and reliability-focused. Backed by Amazon and Google.' },
  { term: 'OpenAI', abbr: 'US · Founded 2015', def: 'Builds GPT and ChatGPT, plus DALL-E (image) and Sora (video). Backed primarily by Microsoft.' },
  { term: 'Google DeepMind', abbr: 'US/UK · Google', def: 'Google\'s AI division. Builds Gemini, Veo (video), Imagen (image), and the underlying transformer research.' },
  { term: 'Meta AI', abbr: 'US · Meta Platforms', def: 'Builds the Llama family. The leader in "open-weights" models you can download and run yourself.' },
  { term: 'xAI', abbr: 'US · Founded 2023', def: 'Elon Musk\'s lab. Builds Grok, integrated into X (formerly Twitter). Fewer guardrails by design.' },
  { term: 'Mistral AI', abbr: 'France · Founded 2023', def: 'European frontier lab. Strong open-weights options; the EU\'s flagship AI player.' },
  { term: 'DeepSeek', abbr: 'China · Founded 2023', def: 'Chinese lab famous for matching frontier performance at a small fraction of the training cost. Open weights.' },
  { term: 'Alibaba (Qwen)', abbr: 'China · Alibaba Cloud', def: 'Strong multilingual frontier models from a Chinese tech giant. Open weights; popular outside the US.' },
];

// 54-question bank
const QUESTION_BANK = [
  // Core terms
  { type: 'mc', q: "What does LLM stand for?", options: ["Large Logic Machine","Large Language Model","Layered Learning Method","Low-Latency Module"], correct: 1 },
  { type: 'mc', q: "What is a 'token' in the context of AI?", options: ["A security key for API access","Roughly ¾ of a word — how text is chunked for the model","A unit of GPU processing time","A type of neural network layer"], correct: 1 },
  { type: 'tf', q: "RAG lets a model look things up in your documents before answering, rather than relying only on training data.", correct: true },
  { type: 'mc', q: "What is 'inference' in AI?", options: ["The process of building the model by feeding it data","Running a trained model to answer a question","A technique for improving model accuracy","The cost of training a new model"], correct: 1 },
  { type: 'tf', q: "A 'frontier model' refers to the cheapest and most efficient AI models available.", correct: false },
  { type: 'mc', q: "What does the context window determine?", options: ["How fast the model responds","How much text the model can 'see' at once","How many users can access the model simultaneously","The cost of running the model"], correct: 1 },
  { type: 'mc', q: "Which architecture powers virtually every modern LLM?", options: ["Recurrent Neural Network (RNN)","Convolutional Neural Network (CNN)","Transformer","Generative Adversarial Network (GAN)"], correct: 2 },
  { type: 'tf', q: "Hallucination in AI means the model responds too slowly.", correct: false },
  { type: 'mc', q: "What is 'fine-tuning'?", options: ["Adjusting the model's font and display","Continuing to train an existing model on your data so it specializes","Resetting a model to factory settings","Compressing a model to run faster"], correct: 1 },
  { type: 'mc', q: "What does MCP stand for?", options: ["Multi-Channel Processing","Model Context Protocol","Machine Compute Pipeline","Modular Chat Platform"], correct: 1 },
  { type: 'tf', q: "MCP is often described as 'USB-C for AI integrations.'", correct: true },
  { type: 'mc', q: "What is 'compute' in AI?", options: ["The algorithm a model uses to reason","The training dataset size","Raw processing power, almost always Nvidia GPUs","The number of parameters in a model"], correct: 2 },
  { type: 'tf', q: "RLHF is the technique that turns a raw LLM into a helpful, polite assistant.", correct: true },
  { type: 'mc', q: "What is a 'guardrail' in an AI system?", options: ["A performance benchmark test","Rules and filters that constrain what a model will say or do","A type of fine-tuning approach","The model's context window limit"], correct: 1 },
  { type: 'tf', q: "Deep Learning is a subset of Machine Learning.", correct: true },
  { type: 'mc', q: "What is a 'jailbreak' in AI?", options: ["Switching from a closed model to an open-weights model","A prompt designed to trick a model into bypassing its guardrails","Releasing a model as open source","A benchmark for testing model security"], correct: 1 },
  { type: 'mc', q: "What is 'alignment' in AI?", options: ["Making sure model text is left-aligned in output","The work of making models behave in ways humans want — helpful, honest, harmless","Syncing a model's training data with new information","Aligning multiple models to work together"], correct: 1 },
  { type: 'tf', q: "Generative AI models only produce text output.", correct: false },
  { type: 'mc', q: "What are 'embeddings'?", options: ["Images embedded inside AI prompts","Numerical fingerprints of meaning that let models compare ideas mathematically","Hidden instructions set by developers","The layers of a neural network"], correct: 1 },
  { type: 'tf', q: "An AI 'agent' only ever performs a single action in response to a prompt.", correct: false },
  { type: 'mc', q: "Which term describes a model's ability to call external software like search or databases?", options: ["Fine-Tuning","RAG","Tool Use / Function Calling","Embeddings"], correct: 2 },
  { type: 'mc', q: "What does 'training' a model involve?", options: ["Writing rules that the model follows","Feeding the model data so it learns patterns by adjusting its parameters","Running the model to answer user questions","Connecting the model to the internet"], correct: 1 },
  { type: 'tf', q: "Inference cost refers to what you pay per token to use a model in production.", correct: true },
  { type: 'mc', q: "What is a 'system prompt'?", options: ["The first message a user sends to start a conversation","Hidden instructions a developer sets to shape model behavior across all conversations","A prompt used only during training","A benchmark test for model performance"], correct: 1 },
  { type: 'tf', q: "A 'benchmark' in AI always accurately reflects real-world model performance.", correct: false },
  { type: 'mc', q: "The Transformer architecture was invented at which company?", options: ["OpenAI","Anthropic","Google","Meta"], correct: 2 },
  { type: 'tf', q: "Parameters are the internal 'dials' a model adjusts during training to learn patterns.", correct: true },
  { type: 'mc', q: "Roughly how many pages is a 200K-token context window?", options: ["50 pages","150 pages","500 pages","2,000 pages"], correct: 2 },
  { type: 'tf', q: "Frontier model training costs roughly $100M–$1B+ in compute.", correct: true },
  // Labs
  { type: 'mc', q: "Which company builds the Claude family of models?", options: ["OpenAI","Google DeepMind","Anthropic","Meta AI"], correct: 2 },
  { type: 'mc', q: "Anthropic is backed by which two tech giants?", options: ["Microsoft and Apple","Amazon and Google","Meta and Nvidia","Tesla and Oracle"], correct: 1 },
  { type: 'tf', q: "OpenAI is backed primarily by Microsoft.", correct: true },
  { type: 'mc', q: "Which lab is known for its open-weights Llama models?", options: ["Anthropic","OpenAI","xAI","Meta AI"], correct: 3 },
  { type: 'mc', q: "Which lab builds Grok, integrated into X (formerly Twitter)?", options: ["DeepSeek","xAI","Mistral AI","OpenAI"], correct: 1 },
  { type: 'tf', q: "Mistral AI is the EU's flagship frontier AI lab, based in France.", correct: true },
  { type: 'mc', q: "DeepSeek is famous for what achievement?", options: ["Building the first video generation model","Matching frontier performance at a small fraction of the training cost","Inventing the transformer architecture","Having the largest context window"], correct: 1 },
  { type: 'mc', q: "Qwen models are built by which company?", options: ["Tencent","ByteDance","Alibaba","Baidu"], correct: 2 },
  { type: 'tf', q: "Of the eight frontier labs, two are based in China.", correct: true },
  // Models
  { type: 'mc', q: "Which model family is described as 'the default for safety-sensitive work'?", options: ["Grok","Llama","Claude","Qwen"], correct: 2 },
  { type: 'mc', q: "Which model family has native multimodality and a 1M+ token context window?", options: ["GPT-4o","Gemini 2.5","Mistral Large","DeepSeek V3"], correct: 1 },
  { type: 'tf', q: "Llama models require you to pay a per-token vendor bill to use.", correct: false },
  { type: 'mc', q: "OpenAI's o3 line of models specializes in what?", options: ["Image generation","Step-by-step reasoning","Voice synthesis","Real-time data from X"], correct: 1 },
  { type: 'tf', q: "Grok's distinguishing feature is real-time data from X (Twitter).", correct: true },
  { type: 'mc', q: "DeepSeek R1 was reportedly trained for approximately how much?", options: ["$5 million","$100 million","$500 million","$1 billion"], correct: 0 },
  { type: 'mc', q: "Which model family is best-in-class for Chinese and multilingual tasks?", options: ["Llama","Mistral","Qwen","Claude"], correct: 2 },
  // Categories
  { type: 'mc', q: "Which of these is a video generation model?", options: ["Whisper","Sora","DALL-E 3","Cursor"], correct: 1 },
  { type: 'mc', q: "Midjourney is a leader in which category?", options: ["Voice & audio","Code assistants","Image generation","Reasoning models"], correct: 2 },
  { type: 'tf', q: "ElevenLabs is known for voice synthesis.", correct: true },
  { type: 'mc', q: "Which of these is a code-specific tool?", options: ["Veo 3","Suno","GitHub Copilot","Imagen 4"], correct: 2 },
  { type: 'mc', q: "Suno is an AI tool for generating what?", options: ["Video","Music","Code","Images"], correct: 1 },
  { type: 'tf', q: "Reasoning models are faster and cheaper than standard models.", correct: false },
  { type: 'mc', q: "Whisper, OpenAI's speech-to-text model, belongs to which category?", options: ["Voice & audio","Video generation","Image generation","Reasoning"], correct: 0 },
  { type: 'tf', q: "Claude Code and Cursor are both coding tools.", correct: true },
  { type: 'mc', q: "Which category is described as 'the fastest-moving category in 2025–26'?", options: ["Image generation","Video generation","Voice & audio","Code tools"], correct: 1 },
];

/* ============================================================
   UTILITIES
   ============================================================ */

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */

const scrollProgressEl = document.getElementById('scroll-progress');

function updateScrollProgress() {
  if (prefersReducedMotion) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgressEl.style.width = pct + '%';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ============================================================
   TAB / PAGE SWITCHING
   ============================================================ */

const navTabs = document.querySelectorAll('.nav-tab');
const pages = document.querySelectorAll('.page');
let currentPage = 'library';

navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.page;
    if (target === currentPage) return;
    currentPage = target;

    navTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    pages.forEach(p => {
      p.classList.remove('active', 'page-entering');
    });

    const targetPage = document.getElementById('page-' + target);
    targetPage.classList.add('active');
    requestAnimationFrame(() => {
      targetPage.classList.add('page-entering');
    });

    window.scrollTo({ top: 0, behavior: 'instant' });

    // Re-init things when switching to specific pages
    if (target === 'practice') {
      initMatchGameIfNeeded();
    }
  });
});

/* Back to library button in exam */
document.getElementById('back-to-library-btn').addEventListener('click', () => {
  document.querySelector('.nav-tab[data-page="library"]').click();
});

/* ============================================================
   HERO PARALLAX (Library only)
   ============================================================ */

const libraryHeroInner = document.getElementById('library-hero-inner');

function handleParallax() {
  if (prefersReducedMotion) return;
  if (currentPage !== 'library') return;
  const y = window.scrollY;
  const translateY = y * 0.18;
  const opacity = Math.max(0, 1 - y / 480);
  libraryHeroInner.style.transform = `translateY(${translateY}px)`;
  libraryHeroInner.style.opacity = opacity;
}

window.addEventListener('scroll', handleParallax, { passive: true });

/* ============================================================
   STAT COUNT-UP
   ============================================================ */

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCountUp(el, target, duration) {
  if (prefersReducedMotion) { el.textContent = target; return; }
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutCubic(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNums.forEach(el => {
        animateCountUp(el, parseInt(el.dataset.target), 900);
      });
      statObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

statObserver.observe(document.querySelector('.stat-strip'));

/* ============================================================
   SCROLL-REVEAL (.sr elements)
   ============================================================ */

let srObserver = null;

function createSRObserver() {
  if (srObserver) srObserver.disconnect();
  srObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        srObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  return srObserver;
}

function observeSubPage(subPageEl) {
  if (prefersReducedMotion) {
    subPageEl.querySelectorAll('.sr').forEach(el => el.classList.add('in'));
    return;
  }
  const obs = createSRObserver();
  subPageEl.querySelectorAll('.sr').forEach(el => obs.observe(el));
}

// Initial observe on library page load
observeSubPage(document.getElementById('sub-core-terms'));

/* ============================================================
   SUB-TAB SWITCHING (Library)
   ============================================================ */

const subtabs = document.querySelectorAll('.subtab');
const subPages = document.querySelectorAll('.sub-page');
let currentSub = 'core-terms';

subtabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.sub;
    if (target === currentSub) return;
    currentSub = target;

    subtabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    subPages.forEach(p => p.classList.remove('active-sub'));
    const targetSub = document.getElementById('sub-' + target);
    targetSub.classList.add('active-sub');

    // Replay scroll-reveal animations
    if (!prefersReducedMotion) {
      targetSub.querySelectorAll('.sr').forEach(el => el.classList.remove('in'));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          observeSubPage(targetSub);
        });
      });
    }
  });
});

/* ============================================================
   TERM CARD EXPAND / COLLAPSE
   ============================================================ */

let revealAllOpen = false;

document.querySelectorAll('.term-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.term-card');
    const def = card.querySelector('.term-def');
    const isOpen = def.classList.contains('open');
    def.classList.toggle('open', !isOpen);
    btn.textContent = isOpen ? '+ Definition' : '− Collapse';
  });
});

document.getElementById('reveal-all-btn').addEventListener('click', function() {
  revealAllOpen = !revealAllOpen;
  document.querySelectorAll('.term-def').forEach(d => d.classList.toggle('open', revealAllOpen));
  document.querySelectorAll('.term-toggle').forEach(btn => {
    btn.textContent = revealAllOpen ? '− Collapse' : '+ Definition';
  });
  this.textContent = revealAllOpen ? 'Collapse all definitions' : 'Reveal all definitions';
});

/* ============================================================
   PRACTICE — FLASHCARDS
   ============================================================ */

let fcDeck = [];
let fcCurrent = -1;
let fcKnown = 0;
let fcMissed = [];
let fcFlipped = false;
let fcCanFlip = true;

const flipCardInner = document.getElementById('flip-card-inner');
const fcTermName = document.getElementById('fc-term-name');
const fcDefText = document.getElementById('fc-def-text');
const fcKnownEl = document.getElementById('fc-known');
const fcRemainingEl = document.getElementById('fc-remaining');
const fcDeckSizeEl = document.getElementById('fc-deck-size');
const fcButtons = document.getElementById('fc-buttons');
const flipHint = document.getElementById('flip-hint');
const flipCard = document.getElementById('flip-card');
const fcStartScreen = document.getElementById('flashcard-start-screen');
const fcGame = document.getElementById('flashcard-game');
const fcComplete = document.getElementById('flashcard-complete');

function fcUpdateScore() {
  fcKnownEl.textContent = fcKnown;
  fcRemainingEl.textContent = fcDeck.length - fcCurrent - 1;
  fcDeckSizeEl.textContent = fcDeck.length;
}

function fcShowCard(idx) {
  const item = fcDeck[idx];
  if (!item) return;
  fcTermName.textContent = item.term;
  fcDefText.textContent = item.def;
  fcFlipped = false;
  fcCanFlip = true;
  flipCardInner.classList.remove('flipped');
  fcButtons.style.display = 'none';
  flipHint.style.display = '';
  fcUpdateScore();
}

function fcAdvance(gotIt) {
  if (gotIt) {
    fcKnown++;
  } else {
    fcMissed.push(fcDeck[fcCurrent]);
  }
  fcCurrent++;
  if (fcCurrent >= fcDeck.length) {
    fcEndDeck();
    return;
  }
  // Un-flip first, then swap content after 280ms
  fcCanFlip = false;
  flipCardInner.classList.remove('flipped');
  fcFlipped = false;
  fcButtons.style.display = 'none';
  flipHint.style.display = '';
  setTimeout(() => {
    fcShowCard(fcCurrent);
    fcCanFlip = true;
  }, 280);
}

function fcEndDeck() {
  fcGame.style.display = 'none';
  fcComplete.style.display = 'flex';
  document.getElementById('fc-review-missed-btn').disabled = fcMissed.length === 0;
}

function fcStart(deck) {
  fcDeck = shuffle(deck.slice());
  fcCurrent = 0;
  fcKnown = 0;
  fcMissed = [];
  fcStartScreen.style.display = 'none';
  fcComplete.style.display = 'none';
  fcGame.style.display = 'flex';
  fcShowCard(0);
  fcDeckSizeEl.textContent = fcDeck.length;
}

document.getElementById('fc-start-btn').addEventListener('click', () => fcStart(TERMS));
document.getElementById('fc-restart-btn').addEventListener('click', () => fcStart(TERMS));
document.getElementById('fc-review-missed-btn').addEventListener('click', () => {
  if (fcMissed.length > 0) fcStart(fcMissed);
});

flipCard.addEventListener('click', () => {
  if (!fcCanFlip) return;
  if (fcFlipped) return;
  fcFlipped = true;
  flipCardInner.classList.add('flipped');
  flipHint.style.display = 'none';
  fcButtons.style.display = 'flex';
});

// Keyboard: space to flip, left/right arrows for got-it/still-learning
document.addEventListener('keydown', (e) => {
  if (currentPage !== 'practice') return;
  if (document.getElementById('flashcard-mode').style.display === 'none') return;
  if (e.key === ' ' && fcGame.style.display !== 'none') {
    e.preventDefault();
    if (!fcFlipped && fcCanFlip) flipCard.click();
  }
  if (fcFlipped && e.key === 'ArrowRight') { e.preventDefault(); fcAdvance(true); }
  if (fcFlipped && e.key === 'ArrowLeft') { e.preventDefault(); fcAdvance(false); }
});

document.getElementById('fc-right-btn').addEventListener('click', () => fcAdvance(true));
document.getElementById('fc-wrong-btn').addEventListener('click', () => fcAdvance(false));

/* ============================================================
   PRACTICE — MATCH GAME
   ============================================================ */

let mgSelected = [];
let mgMatched = 0;
let mgAttempts = 0;
let mgTimerInterval = null;
let mgSeconds = 0;
let mgLocked = false;
let mgTerms = [];
let mgInitialized = false;

const mgMatchedEl = document.getElementById('mg-matched');
const mgAttemptsEl = document.getElementById('mg-attempts');
const mgTimeEl = document.getElementById('mg-time');
const matchGrid = document.getElementById('match-grid');
const matchComplete = document.getElementById('match-complete');

function truncateDef(def, maxLen) {
  if (def.length <= maxLen) return def;
  return def.slice(0, maxLen).trimEnd() + '…';
}

function mgStartTimer() {
  clearInterval(mgTimerInterval);
  mgSeconds = 0;
  mgTimeEl.textContent = 0;
  mgTimerInterval = setInterval(() => {
    mgSeconds++;
    mgTimeEl.textContent = mgSeconds;
  }, 1000);
}

function mgStopTimer() {
  clearInterval(mgTimerInterval);
}

function mgBuildGame() {
  matchGrid.innerHTML = '';
  matchComplete.style.display = 'none';
  mgSelected = [];
  mgMatched = 0;
  mgAttempts = 0;
  mgLocked = false;
  mgMatchedEl.textContent = 0;
  mgAttemptsEl.textContent = 0;

  // Pick 6 random terms
  mgTerms = shuffle(TERMS).slice(0, 6);

  // Build 12 cards: 6 term cards + 6 def cards
  const cards = [];
  mgTerms.forEach((item, i) => {
    cards.push({ id: i, type: 'term', text: item.term, pairId: i });
    cards.push({ id: i + 6, type: 'def', text: truncateDef(item.def, 85), pairId: i });
  });

  const shuffled = shuffle(cards);

  shuffled.forEach(card => {
    const el = document.createElement('button');
    el.className = 'match-card' + (card.type === 'term' ? ' is-term' : '');
    el.textContent = card.text;
    el.dataset.pairId = card.pairId;
    el.dataset.cardId = card.id;
    el.setAttribute('aria-label', card.text);

    el.addEventListener('click', () => mgHandleClick(el));
    matchGrid.appendChild(el);
  });

  mgStartTimer();
}

function mgHandleClick(el) {
  if (mgLocked) return;
  if (el.classList.contains('matched') || el.classList.contains('selected')) return;

  el.classList.add('selected');
  mgSelected.push(el);

  if (mgSelected.length < 2) return;

  mgLocked = true;
  mgAttempts++;
  mgAttemptsEl.textContent = mgAttempts;

  const [a, b] = mgSelected;
  const pairA = parseInt(a.dataset.pairId);
  const pairB = parseInt(b.dataset.pairId);
  const typeA = a.classList.contains('is-term') ? 'term' : 'def';
  const typeB = b.classList.contains('is-term') ? 'term' : 'def';

  const isMatch = pairA === pairB && typeA !== typeB;

  if (isMatch) {
    a.classList.remove('selected');
    b.classList.remove('selected');
    a.classList.add('matched');
    b.classList.add('matched');
    mgMatched++;
    mgMatchedEl.textContent = mgMatched;
    mgSelected = [];
    mgLocked = false;

    if (mgMatched === 6) {
      mgStopTimer();
      matchComplete.style.display = 'flex';
      document.getElementById('match-result-detail').textContent =
        mgSeconds + 's · ' + mgAttempts + ' attempt' + (mgAttempts === 1 ? '' : 's');
    }
  } else {
    a.classList.add('wrong');
    b.classList.add('wrong');
    setTimeout(() => {
      a.classList.remove('selected', 'wrong');
      b.classList.remove('selected', 'wrong');
      mgSelected = [];
      mgLocked = false;
    }, 650);
  }
}

document.getElementById('mg-play-again-btn').addEventListener('click', mgBuildGame);

function initMatchGameIfNeeded() {
  if (!mgInitialized) {
    mgInitialized = true;
    mgBuildGame();
  }
}

/* ---- Mode pill switching ---- */
const flashcardMode = document.getElementById('flashcard-mode');
const matchMode = document.getElementById('match-mode');

document.getElementById('mode-flashcards').addEventListener('click', function() {
  this.classList.add('active');
  document.getElementById('mode-match').classList.remove('active');
  flashcardMode.style.display = '';
  matchMode.style.display = 'none';
});

document.getElementById('mode-match').addEventListener('click', function() {
  this.classList.add('active');
  document.getElementById('mode-flashcards').classList.remove('active');
  flashcardMode.style.display = 'none';
  matchMode.style.display = '';
  if (!mgInitialized) {
    mgInitialized = true;
    mgBuildGame();
  }
});

/* ============================================================
   EXAM
   ============================================================ */

let examQuestions = [];
let examCurrent = 0;
let examTotal = 0;
let examAnswers = []; // { correct: bool, answer: string, correctAnswer: string, question: string }
let examAnswered = false;

const examStart = document.getElementById('exam-start');
const examProgressWrap = document.getElementById('exam-progress-bar-wrap');
const examProgressFill = document.getElementById('exam-progress-fill');
const examCounter = document.getElementById('exam-counter');
const examQuestionArea = document.getElementById('exam-question-area');
const examResults = document.getElementById('exam-results');
const qTypeLabel = document.getElementById('q-type-label');
const qText = document.getElementById('q-text');
const qOptions = document.getElementById('q-options');
const qFeedback = document.getElementById('q-feedback');
const qNextBtn = document.getElementById('q-next-btn');

function startExam(count) {
  examTotal = count;
  examQuestions = shuffle(QUESTION_BANK).slice(0, count);
  examCurrent = 0;
  examAnswers = [];

  examStart.style.display = 'none';
  examResults.style.display = 'none';
  examProgressWrap.style.display = '';
  examQuestionArea.style.display = '';

  showQuestion();
}

function showQuestion() {
  const q = examQuestions[examCurrent];
  examAnswered = false;

  // Update progress
  const pct = (examCurrent / examTotal) * 100;
  examProgressFill.style.width = pct + '%';
  examCounter.textContent = (examCurrent + 1) + ' / ' + examTotal;

  qTypeLabel.textContent = q.type === 'mc' ? '◆ Multiple Choice' : '◆ True / False';
  qText.textContent = q.q;
  qOptions.innerHTML = '';
  qFeedback.style.display = 'none';
  qNextBtn.style.display = 'none';

  if (q.type === 'mc') {
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'q-option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleMCAnswer(i, q));
      qOptions.appendChild(btn);
    });
  } else {
    // True/False
    const wrap = document.createElement('div');
    wrap.className = 'tf-buttons';

    const trueBtn = document.createElement('button');
    trueBtn.className = 'tf-btn';
    trueBtn.textContent = 'True';
    trueBtn.addEventListener('click', () => handleTFAnswer(true, q));

    const falseBtn = document.createElement('button');
    falseBtn.className = 'tf-btn';
    falseBtn.textContent = 'False';
    falseBtn.addEventListener('click', () => handleTFAnswer(false, q));

    wrap.appendChild(trueBtn);
    wrap.appendChild(falseBtn);
    qOptions.appendChild(wrap);
  }
}

function handleMCAnswer(selectedIdx, q) {
  if (examAnswered) return;
  examAnswered = true;

  const isCorrect = selectedIdx === q.correct;
  const btns = qOptions.querySelectorAll('.q-option-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    if (i === selectedIdx && !isCorrect) btn.classList.add('wrong');
  });

  showFeedback(isCorrect, q.options[q.correct]);
  examAnswers.push({ correct: isCorrect, question: q.q, yourAnswer: q.options[selectedIdx], correctAnswer: q.options[q.correct] });
}

function handleTFAnswer(selected, q) {
  if (examAnswered) return;
  examAnswered = true;

  const isCorrect = selected === q.correct;
  const btns = qOptions.querySelectorAll('.tf-btn');
  btns.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === 'True') {
      if (q.correct === true) btn.classList.add('correct');
      if (selected === true && !isCorrect) btn.classList.add('wrong');
    } else {
      if (q.correct === false) btn.classList.add('correct');
      if (selected === false && !isCorrect) btn.classList.add('wrong');
    }
  });

  const correctText = q.correct ? 'True' : 'False';
  showFeedback(isCorrect, correctText);
  examAnswers.push({ correct: isCorrect, question: q.q, yourAnswer: selected ? 'True' : 'False', correctAnswer: correctText });
}

function showFeedback(isCorrect, correctAnswer) {
  qFeedback.style.display = '';
  qFeedback.className = 'q-feedback ' + (isCorrect ? 'correct' : 'wrong');
  qFeedback.textContent = isCorrect ? '✓ Correct' : '✗ Answer: ' + correctAnswer;
  qNextBtn.style.display = '';
}

qNextBtn.addEventListener('click', () => {
  examCurrent++;
  if (examCurrent >= examTotal) {
    showResults();
  } else {
    showQuestion();
  }
});

function showResults() {
  examProgressWrap.style.display = 'none';
  examQuestionArea.style.display = 'none';
  examResults.style.display = '';

  const correct = examAnswers.filter(a => a.correct).length;
  const pct = Math.round((correct / examTotal) * 100);

  document.getElementById('results-score-num').textContent = correct;
  document.getElementById('results-score-denom').textContent = '/' + examTotal;
  document.getElementById('results-pct-label').textContent = pct + '% correct';

  const pill = document.getElementById('results-grade-pill');
  if (pct >= 90) {
    pill.textContent = 'Excellent — fluent';
    pill.className = 'results-grade-pill grade-green';
  } else if (pct >= 75) {
    pill.textContent = 'Good — nearly there';
    pill.className = 'results-grade-pill grade-orange';
  } else if (pct >= 50) {
    pill.textContent = 'Keep practicing';
    pill.className = 'results-grade-pill grade-red';
  } else {
    pill.textContent = 'Back to the library';
    pill.className = 'results-grade-pill grade-red';
  }

  // Build review list
  const reviewEl = document.getElementById('results-review');
  reviewEl.innerHTML = '';
  examAnswers.forEach(a => {
    const row = document.createElement('div');
    row.className = 'review-row ' + (a.correct ? 'r-correct' : 'r-wrong');

    const icon = document.createElement('span');
    icon.className = 'review-icon ' + (a.correct ? 'correct' : 'wrong');
    icon.textContent = a.correct ? '✓' : '✗';

    const qSpan = document.createElement('span');
    qSpan.textContent = a.question;

    row.appendChild(icon);
    row.appendChild(qSpan);

    if (!a.correct) {
      const hint = document.createElement('span');
      hint.className = 'review-correct-answer';
      hint.textContent = 'Correct answer: ' + a.correctAnswer;
      row.appendChild(hint);
    }

    reviewEl.appendChild(row);
  });

  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Exam length cards
document.querySelectorAll('.exam-length-card').forEach(card => {
  card.addEventListener('click', () => startExam(parseInt(card.dataset.count)));
});

// New exam button
document.getElementById('new-exam-btn').addEventListener('click', () => {
  examResults.style.display = 'none';
  examStart.style.display = '';
  window.scrollTo({ top: 0, behavior: 'instant' });
});

/* ============================================================
   INIT
   ============================================================ */

// Set initial scroll progress
updateScrollProgress();
