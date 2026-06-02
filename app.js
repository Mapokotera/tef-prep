// ═══════════════════════════════════════════════════════════════════
// app.js — Application logic for TEF Prep site
// ═══════════════════════════════════════════════════════════════════

// ─── STATE ────────────────────────────────────────────────────────
let state = {
  streak: 0,
  sessions: 0,
  lastVisit: null,
  todaySkills: { reading: false, listening: false, writing: false, speaking: false },
  grammarStats: { done: 0, correct: 0, streak: 0 },
  readingStats: { done: 0, correct: 0 },
  vocabStats: { seen: 0, known: 0, review: 0 },
  clbLevel: 4.5,
};

function loadState() {
  try {
    const saved = localStorage.getItem('tef_state');
    if (saved) state = { ...state, ...JSON.parse(saved) };
    // Reset daily skills if new day
    const today = new Date().toDateString();
    if (state.lastVisit !== today) {
      state.todaySkills = { reading: false, listening: false, writing: false, speaking: false };
      if (state.lastVisit) {
        const last = new Date(state.lastVisit);
        const now = new Date();
        const diff = Math.floor((now - last) / 86400000);
        if (diff > 1) state.streak = 0;
      }
      state.lastVisit = today;
      state.sessions = (state.sessions || 0) + 1;
      saveState();
    }
  } catch(e) {}
}

function saveState() {
  try { localStorage.setItem('tef_state', JSON.stringify(state)); } catch(e) {}
}

// ─── NAVIGATION ───────────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.getAttribute('onclick')?.includes(name)) l.classList.add('active');
  });
  // Init page
  if (name === 'reading' && !readingInitialised) initReading();
  if (name === 'grammar' && !grammarInitialised) initGrammar();
  if (name === 'vocab' && !vocabInitialised) initVocab();
  if (name === 'speaking' && !speakingInitialised) initSpeaking();
  if (name === 'writing' && !writingInitialised) initWriting();
  if (name === 'listening') initListening();
  if (name === 'feedback') { renderFeedbackPage(); }
}

// ─── COUNTDOWN ────────────────────────────────────────────────────
function updateCountdown() {
  const exam = new Date('2026-10-31');
  const now = new Date();
  const diff = Math.ceil((exam - now) / 86400000);
  const txt = diff > 0 ? diff + ' days' : 'EXAM DAY';
  document.getElementById('days-left').textContent = diff > 0 ? diff : '🎯';
  document.getElementById('nav-countdown').textContent = txt;
}

// ─── DASHBOARD ───────────────────────────────────────────────────
function initDashboard() {
  updateCountdown();

  // Streak
  document.getElementById('stat-streak').textContent = state.streak || 0;
  document.getElementById('stat-sessions').textContent = state.sessions || 1;
  document.getElementById('stat-grammar').textContent =
    state.grammarStats.done > 0 ? Math.round((state.grammarStats.correct / state.grammarStats.done) * 100) + '%' : '—';
  document.getElementById('stat-reading').textContent =
    state.readingStats.done > 0 ? Math.round((state.readingStats.correct / state.readingStats.done) * 100) + '%' : '—';

  // CLB bar
  const clb = state.clbLevel || 4.5;
  const pct = ((clb - 1) / 9) * 100;
  document.getElementById('clb-bar').style.width = pct + '%';
  const badge = document.getElementById('clb-badge');
  if (clb < 5) { badge.textContent = 'CLB 4–5'; badge.className = 'badge badge-amber'; }
  else if (clb < 6) { badge.textContent = 'CLB 5'; badge.className = 'badge badge-amber'; }
  else if (clb < 7) { badge.textContent = 'CLB 6'; badge.className = 'badge badge-blue'; }
  else { badge.textContent = 'CLB 7+ ✓'; badge.className = 'badge badge-green'; }

  // Skills checklist
  Object.keys(state.todaySkills).forEach(skill => {
    if (state.todaySkills[skill]) {
      document.getElementById('chk-' + skill)?.classList.add('done');
    }
  });

  // Daily targets
  const targetsEl = document.getElementById('daily-targets');
  targetsEl.innerHTML = DAILY_TARGETS.map((t, i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="width:20px;height:20px;border-radius:50%;border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;color:var(--text3)">${i+1}</div>
      <div style="font-size:14px;color:var(--text2)">${t}</div>
    </div>
  `).join('');
}

function markSkill(skill) {
  state.todaySkills[skill] = !state.todaySkills[skill];
  document.getElementById('chk-' + skill)?.classList.toggle('done');

  // Update streak if all 4 done
  const allDone = Object.values(state.todaySkills).every(v => v);
  if (allDone) {
    state.streak = (state.streak || 0) + 1;
    document.getElementById('stat-streak').textContent = state.streak;
    updateCLB();
  }
  saveState();
}

function updateCLB() {
  const gPct = state.grammarStats.done > 0 ? state.grammarStats.correct / state.grammarStats.done : 0;
  const rPct = state.readingStats.done > 0 ? state.readingStats.correct / state.readingStats.done : 0;
  const avg = (gPct + rPct) / 2;
  // Rough CLB estimate: starts at 4.5, max 8
  const improvement = Math.min(avg * 3, 3);
  state.clbLevel = Math.min(4.5 + improvement, 8);
  saveState();
}

// ─── READING ─────────────────────────────────────────────────────
let readingInitialised = false;
let currentPassage = null;
let readingTimer = null;
let readingSeconds = 900;
let readingAnswers = [];

function initReading() {
  readingInitialised = true;
  loadPassage();
}

function loadPassage() {
  clearInterval(readingTimer);
  readingSeconds = 900;
  document.getElementById('reading-timer').textContent = '15:00';
  document.getElementById('reading-timer').className = 'timer-display';
  document.getElementById('reading-start-btn').textContent = 'Start timer';
  document.getElementById('reading-result').innerHTML = '';
  document.getElementById('reading-submit-btn').style.display = 'none';

  const diff = document.getElementById('reading-difficulty').value;
  const pool = PASSAGES[diff] || PASSAGES.b2;
  currentPassage = pool[Math.floor(Math.random() * pool.length)];
  readingAnswers = new Array(currentPassage.questions.length).fill(-1);

  document.getElementById('passage-topic').textContent = currentPassage.topic;
  document.getElementById('passage-source').textContent = currentPassage.source;
  document.getElementById('reading-score-badge').innerHTML = '';
  document.getElementById('passage-text').innerHTML = currentPassage.text.replace(/\n\n/g, '</p><p style="margin-top:12px">').replace(/^/, '<p>').replace(/$/, '</p>');

  renderQuestions();
}

function renderQuestions() {
  const container = document.getElementById('questions-container');
  container.innerHTML = currentPassage.questions.map((q, qi) => `
    <div class="card" style="margin-bottom:12px">
      <div style="font-weight:500;font-size:15px;margin-bottom:12px;color:var(--text)">${qi+1}. ${q.q}</div>
      ${q.options.map((opt, oi) => `
        <div class="mcq-option" id="opt-${qi}-${oi}" onclick="selectOption(${qi},${oi})">
          <div class="mcq-letter">${String.fromCharCode(65+oi)}</div>
          <div style="font-size:14px">${opt}</div>
        </div>
      `).join('')}
    </div>
  `).join('') + `<button class="btn btn-primary" onclick="submitReading()" style="margin-top:8px">Submit answers</button>`;
}

function selectOption(qi, oi) {
  // Deselect others in this question
  currentPassage.questions[qi].options.forEach((_, i) => {
    document.getElementById(`opt-${qi}-${i}`)?.classList.remove('selected');
  });
  document.getElementById(`opt-${qi}-${oi}`)?.classList.add('selected');
  readingAnswers[qi] = oi;
}

function startReadingTimer() {
  clearInterval(readingTimer);
  document.getElementById('reading-start-btn').textContent = 'Running...';
  document.getElementById('reading-start-btn').disabled = true;
  readingTimer = setInterval(() => {
    readingSeconds--;
    const m = Math.floor(readingSeconds / 60);
    const s = readingSeconds % 60;
    const display = `${m}:${s.toString().padStart(2,'0')}`;
    document.getElementById('reading-timer').textContent = display;
    if (readingSeconds <= 120) document.getElementById('reading-timer').className = 'timer-display urgent';
    if (readingSeconds <= 0) {
      clearInterval(readingTimer);
      submitReading();
    }
  }, 1000);
}

function resetReading() {
  clearInterval(readingTimer);
  loadPassage();
}

function submitReading() {
  clearInterval(readingTimer);
  let correct = 0;
  currentPassage.questions.forEach((q, qi) => {
    const userAns = readingAnswers[qi];
    q.options.forEach((_, oi) => {
      const el = document.getElementById(`opt-${qi}-${oi}`);
      if (!el) return;
      el.style.cursor = 'default';
      el.onclick = null;
      if (oi === q.answer) el.classList.add('correct');
      else if (oi === userAns && userAns !== q.answer) el.classList.add('wrong');
    });
    if (userAns === q.answer) correct++;
  });

  const pct = Math.round((correct / currentPassage.questions.length) * 100);
  const color = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--amber)' : 'var(--red)';

  document.getElementById('reading-result').innerHTML = `
    <div class="card" style="text-align:center;margin-top:16px">
      <div style="font-family:var(--font-display);font-size:48px;color:${color}">${correct}/${currentPassage.questions.length}</div>
      <div style="font-size:16px;color:var(--text2);margin-top:4px">${pct}% — ${pct>=80?'Excellent!':pct>=60?'Good effort — keep going!':'Keep practising — review the passage.'}</div>
      <button class="btn btn-secondary btn-sm" onclick="loadPassage()" style="margin-top:16px">Try another passage →</button>
    </div>
  `;

  // Update stats
  state.readingStats.done += currentPassage.questions.length;
  state.readingStats.correct += correct;
  document.getElementById('stat-reading').textContent = Math.round((state.readingStats.correct / state.readingStats.done) * 100) + '%';
  updateCLB();
  saveState();
  markSkill('reading');
}

// ─── WRITING ──────────────────────────────────────────────────────
let writingInitialised = false;
let currentWritingTask = 1;
let writingTimerInterval = null;
let writingSeconds = 3600;

function initWriting() {
  writingInitialised = true;
  setWritingTask(1);
  renderRubric(1);

  // Restore saved text
  try {
    const saved = localStorage.getItem('tef_writing_' + currentWritingTask);
    if (saved) document.getElementById('writing-textarea').value = saved;
  } catch(e) {}
}

function setWritingTask(n) {
  currentWritingTask = n;
  document.getElementById('task1-btn').style.borderColor = n === 1 ? 'var(--accent)' : '';
  document.getElementById('task1-btn').style.color = n === 1 ? 'var(--accent2)' : '';
  document.getElementById('task2-btn').style.borderColor = n === 2 ? 'var(--accent)' : '';
  document.getElementById('task2-btn').style.color = n === 2 ? 'var(--accent2)' : '';

  const target = n === 1 ? '60–80 words' : '120–150 words';
  document.getElementById('task-type-badge').textContent = `Task ${n}`;
  document.getElementById('task-target-words').textContent = `Target: ${target}`;

  newWritingPrompt();
  renderRubric(n);
  document.getElementById('writing-textarea').value = '';
  document.getElementById('word-count').textContent = '0 words';
  document.getElementById('word-count').className = 'word-count';
}

function newWritingPrompt() {
  const pool = WRITING_PROMPTS[currentWritingTask];
  const prompt = pool[Math.floor(Math.random() * pool.length)];
  document.getElementById('writing-prompt-text').textContent = prompt.text;
}

function updateWordCount() {
  const text = document.getElementById('writing-textarea').value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const el = document.getElementById('word-count');
  const min = currentWritingTask === 1 ? 60 : 120;
  const max = currentWritingTask === 1 ? 80 : 150;
  el.textContent = `${words} words`;
  el.className = 'word-count' + (words >= min && words <= max ? ' ok' : '');
}

function renderRubric(taskNum) {
  const criteria = RUBRIC_CRITERIA[taskNum];
  document.getElementById('rubric-container').innerHTML = criteria.map((c, i) => `
    <div class="rubric-item">
      <div class="rubric-name">${c.name}</div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px">${c.hint}</div>
      <div class="rubric-stars" id="rubric-${i}">
        ${[1,2,3,4,5].map(s => `<div class="rubric-star" id="star-${i}-${s}" onclick="setRubricStar(${i},${s})"></div>`).join('')}
      </div>
    </div>
  `).join('');
}

function setRubricStar(criterion, score) {
  for (let s = 1; s <= 5; s++) {
    const el = document.getElementById(`star-${criterion}-${s}`);
    if (el) el.className = 'rubric-star' + (s <= score ? ' lit' : '');
  }
}

function saveWriting() {
  try {
    localStorage.setItem('tef_writing_' + currentWritingTask, document.getElementById('writing-textarea').value);
  } catch(e) {}
  const el = document.getElementById('writing-saved');
  el.style.opacity = '1';
  setTimeout(() => el.style.opacity = '0', 2000);
  markSkill('writing');
}

function clearWriting() {
  document.getElementById('writing-textarea').value = '';
  document.getElementById('word-count').textContent = '0 words';
  document.getElementById('word-count').className = 'word-count';
}

// ─── SPEAKING ────────────────────────────────────────────────────
let speakingInitialised = false;
let currentSpeakingTask = 1;
let speakingTimer = null;
let speakingSeconds = 120;
let speakingRunning = false;

function initSpeaking() {
  speakingInitialised = true;
  setSpeakingTask(1);
  renderUsefulPhrases();
}

function setSpeakingTask(n) {
  currentSpeakingTask = n;
  [1,2,3].forEach(i => {
    const btn = document.getElementById(`speak${i}-btn`);
    btn.style.borderColor = i === n ? 'var(--purple)' : '';
    btn.style.color = i === n ? 'var(--purple)' : '';
  });

  const descs = {
    1: 'Task 1 — Describe a photo or scene in detail (2 minutes)',
    2: 'Task 2 — Give and justify your opinion on a topic (2–3 minutes)',
    3: 'Task 3 — Dialogue or role-play scenario (3–4 minutes)'
  };
  const durations = { 1: 120, 2: 150, 3: 210 };
  document.getElementById('speaking-task-desc').textContent = descs[n];
  speakingSeconds = durations[n];

  const m = Math.floor(speakingSeconds / 60);
  const s = speakingSeconds % 60;
  document.getElementById('speak-time-display').textContent = `${m}:${s.toString().padStart(2,'0')}`;
  document.getElementById('speak-circle').className = 'speak-circle';
  document.getElementById('speak-status').textContent = 'Press Start when ready';
  document.getElementById('speak-start-btn').textContent = '▶ Start';

  clearInterval(speakingTimer);
  speakingRunning = false;
  newSpeakingPrompt();
  renderSpeakingTips(n);
}

function newSpeakingPrompt() {
  const pool = SPEAKING_PROMPTS[currentSpeakingTask];
  const prompt = pool[Math.floor(Math.random() * pool.length)];
  document.getElementById('speaking-prompt-text').innerHTML = prompt.replace(/([.?!])\s+/g, '$1<br><br>');
}

function startSpeakingTimer() {
  if (speakingRunning) return;
  speakingRunning = true;
  document.getElementById('speak-circle').className = 'speak-circle running';
  document.getElementById('speak-status').textContent = 'Speaking...';
  document.getElementById('speak-start-btn').disabled = true;

  speakingTimer = setInterval(() => {
    speakingSeconds--;
    const m = Math.floor(speakingSeconds / 60);
    const s = speakingSeconds % 60;
    document.getElementById('speak-time-display').textContent = `${m}:${s.toString().padStart(2,'0')}`;

    if (speakingSeconds <= 0) {
      clearInterval(speakingTimer);
      document.getElementById('speak-circle').className = 'speak-circle done';
      document.getElementById('speak-time-display').textContent = '0:00';
      document.getElementById('speak-status').textContent = 'Time\'s up! Great work.';
      markSkill('speaking');
    }
  }, 1000);
}

function resetSpeaking() {
  clearInterval(speakingTimer);
  speakingRunning = false;
  setSpeakingTask(currentSpeakingTask);
}

function renderSpeakingTips(n) {
  const tips = SPEAKING_TIPS[n] || [];
  document.getElementById('speaking-tips').innerHTML = tips.map(t =>
    `<div class="tip-item">${t}</div>`
  ).join('');
}

function renderUsefulPhrases() {
  document.getElementById('useful-phrases').innerHTML = USEFUL_PHRASES.map(p => `
    <div style="padding:8px 12px;background:var(--bg3);border-radius:8px;border-left:2px solid var(--purple)">
      <div style="font-style:italic;color:var(--text);font-size:14px">${p.fr}</div>
      <div style="font-size:12px;color:var(--text3);margin-top:2px">${p.en}</div>
    </div>
  `).join('');
}

// ─── GRAMMAR ─────────────────────────────────────────────────────
let grammarInitialised = false;
let currentGrammarQ = null;
let grammarAnswered = false;
let gStats = { done: 0, correct: 0, streak: 0 };

const ACCENTS_LIST = ['é','è','ê','ë','à','â','î','ô','û','ù','ç','œ'];

function initGrammar() {
  grammarInitialised = true;
  gStats = state.grammarStats || { done: 0, correct: 0, streak: 0 };

  // Accent buttons
  const row = document.querySelector('.accent-row');
  ACCENTS_LIST.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'acc';
    btn.textContent = a;
    btn.onclick = () => insertAccent(a);
    row.appendChild(btn);
  });

  document.getElementById('g-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') grammarAnswered ? newConjQuestion() : checkGrammar();
  });

  updateGrammarStats();
  newConjQuestion();
}

function insertAccent(a) {
  const inp = document.getElementById('g-input');
  const p = inp.selectionStart;
  inp.value = inp.value.slice(0, p) + a + inp.value.slice(p);
  inp.focus();
  inp.setSelectionRange(p + 1, p + 1);
}

function getFilteredVerbs() {
  const tense = document.getElementById('grammar-tense').value;
  const group = document.getElementById('grammar-group').value;
  const qs = [];
  VERBS.forEach(verb => {
    if (group !== 'all' && verb.g !== group) return;
    const tenses = tense === 'all' ? Object.keys(TENSE_LABELS) : [tense];
    tenses.forEach(t => {
      const forms = verb[t];
      if (!forms) return;
      SUBJECTS.forEach((subj, i) => {
        if (forms[i] === null) return;
        qs.push({ verb, tense: t, subjIdx: i, subj, answer: forms[i] });
      });
    });
  });
  return qs;
}

function newConjQuestion() {
  const qs = getFilteredVerbs();
  if (!qs.length) return;
  currentGrammarQ = qs[Math.floor(Math.random() * qs.length)];
  grammarAnswered = false;

  document.getElementById('g-verb').textContent = currentGrammarQ.verb.v;
  document.getElementById('g-eng').textContent = currentGrammarQ.verb.e;
  document.getElementById('g-tense').textContent = TENSE_LABELS[currentGrammarQ.tense];
  const subj = currentGrammarQ.tense === 'subjonctif'
    ? `que ${currentGrammarQ.subj}` : currentGrammarQ.subj;
  document.getElementById('g-subject').textContent = subj;

  const inp = document.getElementById('g-input');
  inp.value = '';
  inp.style.borderColor = '';
  inp.disabled = false;
  inp.focus();

  document.getElementById('g-feedback').innerHTML = '';
  document.getElementById('g-full-conj').innerHTML = '';
  document.getElementById('g-next-btn').style.display = 'none';
}

function normalize(s) {
  return s.trim().toLowerCase().replace(/\(e\)/g,'').replace(/\(s\)/g,'').replace(/\(es\)/g,'').replace(/\s+/g,' ').trim();
}

function checkGrammar() {
  if (grammarAnswered) { newConjQuestion(); return; }
  const inp = document.getElementById('g-input');
  const user = inp.value;
  const correct = normalize(currentGrammarQ.answer);
  const isCorrect = normalize(user) === correct;
  grammarAnswered = true;

  gStats.done++;
  if (isCorrect) {
    gStats.correct++;
    gStats.streak++;
    inp.style.borderColor = 'var(--green)';
    const streakTxt = gStats.streak >= 5 ? ` 🔥 ${gStats.streak} in a row!` : '';
    document.getElementById('g-feedback').innerHTML = `<div class="conj-feedback correct">Correct!${streakTxt}</div>`;
  } else {
    gStats.streak = 0;
    inp.style.borderColor = 'var(--red)';
    document.getElementById('g-feedback').innerHTML = `<div class="conj-feedback wrong">The answer is: <strong>${currentGrammarQ.answer}</strong></div>`;
  }

  inp.disabled = true;
  renderFullConj();
  document.getElementById('g-next-btn').style.display = 'inline-flex';

  // Save stats
  state.grammarStats = gStats;
  updateGrammarStats();
  document.getElementById('stat-grammar').textContent =
    gStats.done > 0 ? Math.round((gStats.correct / gStats.done) * 100) + '%' : '—';
  updateCLB();
  saveState();
}

function renderFullConj() {
  const q = currentGrammarQ;
  const forms = q.verb[q.tense];
  let html = `<div class="full-conj-grid" style="margin-top:16px">`;
  SUBJECTS.forEach((s, i) => {
    if (forms[i] === null) return;
    const hl = i === q.subjIdx;
    const sub = q.tense === 'subjonctif' ? `que ${s}` : s;
    html += `<div class="fc-row${hl?' hl':''}"><span class="fc-s">${sub}</span><span class="fc-f${hl?' hl':''}">${forms[i]}</span></div>`;
  });
  html += '</div>';
  document.getElementById('g-full-conj').innerHTML = html;
}

function updateGrammarStats() {
  document.getElementById('g-done').textContent = gStats.done;
  document.getElementById('g-correct').textContent = gStats.correct;
  document.getElementById('g-pct').textContent = gStats.done > 0 ? Math.round((gStats.correct / gStats.done) * 100) + '%' : '—';
  document.getElementById('g-streak').textContent = gStats.streak;
}

// ─── VOCAB ───────────────────────────────────────────────────────
let vocabInitialised = false;
let currentVocabCard = null;
let vocabStats = { seen: 0, known: 0, review: 0 };

function initVocab() {
  vocabInitialised = true;
  vocabStats = state.vocabStats || { seen: 0, known: 0, review: 0 };
  updateVocabStats();
  loadVocabCard();
}

function loadVocabCard() {
  document.getElementById('flashcard').classList.remove('flipped');
  document.getElementById('vocab-result-row').style.display = 'none';

  const theme = document.getElementById('vocab-theme').value;
  let pool = [];
  if (theme === 'all') {
    Object.values(VOCAB).forEach(arr => pool.push(...arr));
  } else {
    pool = VOCAB[theme] || [];
  }
  if (!pool.length) return;

  currentVocabCard = pool[Math.floor(Math.random() * pool.length)];
  document.getElementById('fc-word').textContent = currentVocabCard.fr;
  document.getElementById('fc-type').textContent = currentVocabCard.type;
  document.getElementById('fc-translation').textContent = currentVocabCard.en;
  document.getElementById('fc-example').textContent = currentVocabCard.ex || '';
}

function flipCard() {
  document.getElementById('flashcard').classList.toggle('flipped');
  const flipped = document.getElementById('flashcard').classList.contains('flipped');
  if (flipped) {
    vocabStats.seen++;
    document.getElementById('vocab-result-row').style.display = 'flex';
    updateVocabStats();
    state.vocabStats = vocabStats;
    saveState();
  }
}

function vocabResult(result) {
  if (result === 'known') vocabStats.known++;
  else if (result === 'review') vocabStats.review++;
  state.vocabStats = vocabStats;
  updateVocabStats();
  saveState();
  loadVocabCard();
}

function updateVocabStats() {
  document.getElementById('v-seen').textContent = vocabStats.seen;
  document.getElementById('v-known').textContent = vocabStats.known;
  document.getElementById('v-review').textContent = vocabStats.review;
  document.getElementById('v-pct').textContent = vocabStats.seen > 0
    ? Math.round((vocabStats.known / vocabStats.seen) * 100) + '%' : '—';
}

// ─── LISTENING ───────────────────────────────────────────────────
function initListening() {
  newListeningTask();
  // Restore notes
  try {
    const saved = localStorage.getItem('tef_listening_notes');
    if (saved) document.getElementById('listening-notes').value = saved;
  } catch(e) {}
}

function newListeningTask() {
  const task = LISTENING_TASKS[Math.floor(Math.random() * LISTENING_TASKS.length)];
  document.getElementById('listening-task').textContent = task;
}

function saveListeningNotes() {
  try { localStorage.setItem('tef_listening_notes', document.getElementById('listening-notes').value); } catch(e) {}
  const el = document.getElementById('notes-saved');
  el.style.opacity = '1';
  setTimeout(() => el.style.opacity = '0', 2000);
  markSkill('listening');
}

// ─── INIT ────────────────────────────────────────────────────────
loadState();
initDashboard();

// Update countdown every minute
setInterval(updateCountdown, 60000);
