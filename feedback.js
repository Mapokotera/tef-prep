// ═══════════════════════════════════════════════════════════════════
// feedback.js — Claude API integration for real-time TEF feedback
// ═══════════════════════════════════════════════════════════════════

// ─── API KEY MANAGEMENT ──────────────────────────────────────────
function getApiKey() {
  try { return localStorage.getItem('tef_api_key') || ''; } catch(e) { return ''; }
}
function saveApiKey(key) {
  try { localStorage.setItem('tef_api_key', key.trim()); } catch(e) {}
}
function clearApiKey() {
  try { localStorage.removeItem('tef_api_key'); } catch(e) {}
}

// ─── ERROR LOG (persistent pattern tracking) ─────────────────────
function getErrorLog() {
  try {
    const saved = localStorage.getItem('tef_error_log');
    return saved ? JSON.parse(saved) : [];
  } catch(e) { return []; }
}
function appendErrorLog(entry) {
  try {
    const log = getErrorLog();
    log.push({ ...entry, date: new Date().toISOString() });
    // Keep last 50 entries
    if (log.length > 50) log.splice(0, log.length - 50);
    localStorage.setItem('tef_error_log', JSON.stringify(log));
  } catch(e) {}
}
function getErrorPatterns() {
  const log = getErrorLog();
  const counts = {};
  log.forEach(entry => {
    if (entry.patterns) {
      entry.patterns.forEach(p => {
        counts[p] = (counts[p] || 0) + 1;
      });
    }
  });
  return Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,8);
}

// ─── CORE API CALL ───────────────────────────────────────────────
async function callClaude(systemPrompt, userMessage, maxTokens = 1000) {
  const key = getApiKey();
  if (!key) throw new Error('NO_KEY');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error('INVALID_KEY');
    if (response.status === 429) throw new Error('RATE_LIMIT');
    if (response.status === 403) throw new Error('BILLING_ERROR');
    // Surface the actual API error message
    const msg = err.error?.message || `API error ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

// ─── SYSTEM PROMPTS ──────────────────────────────────────────────
const PROMPTS = {

  writing: (taskType, targetWords) => `You are a TEF Canada examiner providing detailed writing feedback. 
The student is a native English speaker targeting CLB 7. They started at CLB 4-5 and are reactivating French learned 10+ years ago.
Task type: ${taskType === 1 ? 'Task 1 — Informal message (target: ' + targetWords + ' words)' : 'Task 2 — Formal text (target: ' + targetWords + ' words)'}.

Respond in this EXACT JSON format (no markdown, no extra text):
{
  "overall_score": <number 0-20>,
  "clb_estimate": "<e.g. CLB 5-6>",
  "scores": {
    "task_completion": <0-5>,
    "vocabulary": <0-5>,
    "grammar": <0-5>,
    "register_cohesion": <0-5>
  },
  "strengths": ["<strength 1>", "<strength 2>"],
  "corrections": [
    {"original": "<exact text from student>", "corrected": "<correction>", "explanation": "<why>"}
  ],
  "patterns": ["<error category>"],
  "overall_comment": "<2-3 sentence encouraging but honest summary>",
  "priority_fix": "<the single most important thing to work on next>"
}
Corrections: list the 3-5 most important errors only. Patterns should be categories like 'passé composé agreement', 'missing accents', 'wrong register', etc.`,

  grammar: () => `You are a French grammar teacher for a TEF Canada student targeting CLB 7. 
Analyse the French text for errors. Be thorough but encouraging.

Respond in this EXACT JSON format (no markdown, no extra text):
{
  "error_count": <number>,
  "corrected_text": "<full corrected version>",
  "errors": [
    {"original": "<error>", "corrected": "<fix>", "type": "<error type>", "explanation": "<clear explanation in English>"}
  ],
  "patterns": ["<error category>"],
  "positive": "<one genuine strength observed>",
  "tip": "<one actionable tip for improvement>"
}
Error types: tense, agreement, article, preposition, vocabulary, word order, accent, spelling, register.`,

  speaking: (taskType) => `You are a TEF Canada oral examiner reviewing a written transcript of a student's spoken response.
The student is targeting CLB 7. Task type: ${['', 'Task 1 (photo description)', 'Task 2 (opinion)', 'Task 3 (dialogue/role-play)'][taskType]}.

Respond in this EXACT JSON format (no markdown, no extra text):
{
  "overall_score": <0-20>,
  "clb_estimate": "<e.g. CLB 5>",
  "scores": {
    "task_completion": <0-5>,
    "fluency_coherence": <0-5>,
    "vocabulary": <0-5>,
    "grammar_accuracy": <0-5>
  },
  "strengths": ["<strength>", "<strength>"],
  "improvements": [
    {"issue": "<what to improve>", "suggestion": "<how to improve it>", "example": "<better phrasing>"}
  ],
  "patterns": ["<error category>"],
  "structure_feedback": "<was the response well structured? specific advice>",
  "overall_comment": "<2-3 sentence honest encouraging summary>"
}`,

  progress: () => `You are a French language coach reviewing a student's error log to identify progress and priorities.
The student is targeting TEF Canada CLB 7, starting from CLB 4-5.
Analyse the error patterns and respond in this EXACT JSON format (no markdown, no extra text):
{
  "improving_areas": ["<area getting better>"],
  "persistent_issues": ["<recurring problem>"],
  "clb_trajectory": "<honest assessment of trajectory>",
  "top_priorities": ["<most important thing to fix>", "<second priority>", "<third priority>"],
  "encouragement": "<genuine specific encouragement based on the data>",
  "weekly_focus": "<one specific grammar or vocabulary area to focus on this week>"
}`
};

// ─── FEEDBACK PAGE UI ────────────────────────────────────────────
function renderFeedbackPage() {
  const hasKey = !!getApiKey();
  const patterns = getErrorPatterns();
  const log = getErrorLog();

  document.getElementById('page-feedback').innerHTML = `
    <!-- API Key Setup -->
    <div id="api-setup-section">
      ${!hasKey ? renderKeySetup() : renderKeyStatus()}
    </div>

    ${hasKey ? `
    ${renderSyncSection()}
    <!-- Tab navigation -->
    <div style="display:flex;gap:6px;margin-bottom:24px;border-bottom:1px solid var(--border);padding-bottom:16px;flex-wrap:wrap">
      <button class="fb-tab active" data-tab="writing" onclick="switchFbTab('writing')">✍️ Writing</button>
      <button class="fb-tab" data-tab="grammar" onclick="switchFbTab('grammar')">🔬 Grammar Check</button>
      <button class="fb-tab" data-tab="speaking" onclick="switchFbTab('speaking')">🗣️ Speaking</button>
      <button class="fb-tab" data-tab="progress" onclick="switchFbTab('progress')">📈 Progress</button>
    </div>

    <!-- Writing Tab -->
    <div id="fb-writing" class="fb-panel">
      <div class="card" style="margin-bottom:16px">
        <div class="card-title" style="margin-bottom:4px">Writing Feedback</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:16px">Submit your TEF writing task for detailed scoring and corrections</div>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <button class="btn btn-sm" id="wfb-t1" onclick="setWFBTask(1)" style="background:rgba(79,142,247,0.15);color:var(--accent2);border:1px solid var(--accent)">Task 1 — Informal</button>
          <button class="btn btn-sm" id="wfb-t2" onclick="setWFBTask(2)" style="background:var(--bg3);border:1px solid var(--border2);color:var(--text2)">Task 2 — Formal</button>
        </div>
        <div id="wfb-target" style="font-size:13px;color:var(--text3);margin-bottom:12px;font-family:var(--font-mono)">Target: 60–80 words</div>
        <textarea id="wfb-input" rows="8" placeholder="Paste your French writing here..."></textarea>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div id="wfb-wordcount" style="font-size:12px;color:var(--text3);font-family:var(--font-mono)">0 words</div>
          <button class="btn btn-primary" onclick="submitWritingFeedback()" id="wfb-submit">Get feedback →</button>
        </div>
      </div>
      <div id="wfb-result"></div>
    </div>

    <!-- Grammar Tab -->
    <div id="fb-grammar" class="fb-panel" style="display:none">
      <div class="card" style="margin-bottom:16px">
        <div class="card-title" style="margin-bottom:4px">Grammar Checker</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:16px">Paste any French text — journal entry, writing practice, a paragraph — and get every error explained</div>
        <textarea id="gfb-input" rows="8" placeholder="Collez votre texte français ici..."></textarea>
        <div style="text-align:right;margin-top:8px">
          <button class="btn btn-primary" onclick="submitGrammarCheck()" id="gfb-submit">Check grammar →</button>
        </div>
      </div>
      <div id="gfb-result"></div>
    </div>

    <!-- Speaking Tab -->
    <div id="fb-speaking" class="fb-panel" style="display:none">
      <div class="card" style="margin-bottom:16px">
        <div class="card-title" style="margin-bottom:4px">Speaking Feedback</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:16px">Type or paste what you said during your speaking practice. Claude will give you TEF examiner-style feedback.</div>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          ${[1,2,3].map(n => `<button class="btn btn-sm sfb-task" id="sfb-t${n}" onclick="setSFBTask(${n})" style="${n===1?'background:rgba(155,127,232,0.15);color:var(--purple);border:1px solid var(--purple)':'background:var(--bg3);border:1px solid var(--border2);color:var(--text2)'}">Task ${n}</button>`).join('')}
        </div>
        <div id="sfb-desc" style="font-size:13px;color:var(--text3);margin-bottom:12px">Task 1 — Photo description (2 minutes)</div>
        <textarea id="sfb-input" rows="8" placeholder="Type what you said during your speaking practice..."></textarea>
        <div style="text-align:right;margin-top:8px">
          <button class="btn btn-primary" onclick="submitSpeakingFeedback()" id="sfb-submit">Get feedback →</button>
        </div>
      </div>
      <div id="sfb-result"></div>
    </div>

    <!-- Progress Tab -->
    <div id="fb-progress" class="fb-panel" style="display:none">
      <div class="grid-2" style="margin-bottom:20px">
        <div class="card">
          <div class="card-title" style="margin-bottom:12px;font-size:18px">Sessions logged</div>
          <div style="font-family:var(--font-display);font-size:48px;color:var(--accent)">${log.length}</div>
          <div style="font-size:13px;color:var(--text2);margin-top:4px">feedback sessions total</div>
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom:12px;font-size:18px">Top error patterns</div>
          ${patterns.length ? patterns.slice(0,5).map(([pattern, count]) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);font-size:14px">
              <span style="color:var(--text2)">${pattern}</span>
              <span style="font-family:var(--font-mono);font-size:12px;color:var(--amber)">${count}×</span>
            </div>`).join('') : '<div style="color:var(--text3);font-size:14px">No errors logged yet — submit some feedback sessions first.</div>'}
        </div>
      </div>
      ${log.length >= 3 ? `
      <div class="card" style="margin-bottom:16px">
        <div class="card-title" style="margin-bottom:12px">AI Progress Analysis</div>
        <div style="font-size:14px;color:var(--text2);margin-bottom:12px">Based on your last ${Math.min(log.length, 20)} feedback sessions</div>
        <button class="btn btn-primary" onclick="submitProgressAnalysis()" id="prog-submit">Analyse my progress →</button>
        <div id="prog-result" style="margin-top:16px"></div>
      </div>` : `
      <div class="card">
        <div style="color:var(--text2);font-size:14px;text-align:center;padding:16px">Complete at least 3 feedback sessions to unlock AI progress analysis.</div>
      </div>`}

      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div class="card-title" style="font-size:18px">Recent sessions</div>
          <button class="btn btn-secondary btn-sm" onclick="clearErrorLog()" style="color:var(--red);border-color:var(--red)">Clear log</button>
        </div>
        ${log.length ? [...log].reverse().slice(0,10).map(e => `
          <div style="padding:10px 0;border-bottom:1px solid var(--border);font-size:13px">
            <div style="display:flex;justify-content:space-between">
              <span style="color:var(--text2);font-weight:500">${e.type || 'Session'}</span>
              <span style="color:var(--text3);font-family:var(--font-mono)">${new Date(e.date).toLocaleDateString()}</span>
            </div>
            ${e.patterns?.length ? `<div style="color:var(--text3);margin-top:3px">${e.patterns.join(' · ')}</div>` : ''}
          </div>`).join('') : '<div style="color:var(--text3);font-size:14px">No sessions yet.</div>'}
      </div>
    </div>
    ` : ''}
  `;

  // Attach word count listener
  const wfbInput = document.getElementById('wfb-input');
  if (wfbInput) {
    wfbInput.addEventListener('input', () => {
      const words = wfbInput.value.trim().split(/\s+/).filter(Boolean).length;
      document.getElementById('wfb-wordcount').textContent = `${words} words`;
    });
  }
}

function renderKeySetup() {
  return `
    <div class="card" style="margin-bottom:24px;border-color:rgba(79,142,247,0.3);background:rgba(79,142,247,0.03)">
      <div style="display:flex;gap:16px;align-items:flex-start">
        <div style="font-size:32px">🔑</div>
        <div style="flex:1">
          <div style="font-weight:600;font-size:16px;margin-bottom:6px">Connect your Anthropic API key</div>
          <div style="font-size:14px;color:var(--text2);margin-bottom:16px;line-height:1.6">
            To get real-time feedback from Claude, you need an API key from Anthropic. 
            Your key is stored only in your browser — never sent anywhere except directly to Anthropic.
          </div>
          <div style="font-size:13px;color:var(--text3);margin-bottom:16px">
            👉 Get your key at <a href="https://console.anthropic.com" target="_blank" style="color:var(--accent)">console.anthropic.com</a> → API Keys → Create Key<br>
            💰 Cost: roughly $0.01–0.03 per feedback session. Well under $5/month for daily use.
          </div>
          <div style="display:flex;gap:8px">
            <input type="password" id="api-key-input" placeholder="sk-ant-..." style="flex:1;font-family:var(--font-mono);font-size:13px">
            <button class="btn btn-primary" onclick="handleSaveKey()">Save key</button>
          </div>
          <div id="key-error" style="font-size:13px;color:var(--red);margin-top:8px;display:none"></div>
        </div>
      </div>
    </div>
  `;
}

function renderKeyStatus() {
  const key = getApiKey();
  const masked = key.substring(0, 10) + '••••••••••••••••••••••••••••••';
  return `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;background:rgba(62,207,142,0.05);border:1px solid rgba(62,207,142,0.2);border-radius:10px;margin-bottom:20px">
      <div style="width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0"></div>
      <div style="font-size:13px;color:var(--text2);font-family:var(--font-mono);flex:1">${masked}</div>
      <button class="btn btn-secondary btn-sm" onclick="handleRemoveKey()" style="color:var(--red);border-color:rgba(240,96,96,0.3)">Remove key</button>
    </div>
  `;
}

// ─── KEY HANDLERS ────────────────────────────────────────────────
async function handleSaveKey() {
  const key = document.getElementById('api-key-input')?.value?.trim();
  if (!key || !key.startsWith('sk-')) {
    document.getElementById('key-error').textContent = 'Key should start with sk-ant-...';
    document.getElementById('key-error').style.display = 'block';
    return;
  }
  // Quick validation test
  const btn = document.querySelector('#api-setup-section button.btn-primary');
  if (btn) { btn.textContent = 'Validating...'; btn.disabled = true; }
  try {
    saveApiKey(key);
    await callClaude('Say only: OK', 'test', 5);
    renderFeedbackPage();
  } catch(e) {
    clearApiKey();
    const errEl = document.getElementById('key-error');
    if (errEl) {
      const errMessages = {
        'INVALID_KEY': 'Invalid API key — double-check you copied the full key from console.anthropic.com.',
        'BILLING_ERROR': 'API key valid but no credits — add a payment method at console.anthropic.com → Billing.',
        'RATE_LIMIT': 'Rate limited — wait a moment and try again.',
      };
      errEl.textContent = errMessages[e.message] || `Error: ${e.message} — check console.anthropic.com for your key status.`;
      errEl.style.display = 'block';
    }
    if (btn) { btn.textContent = 'Save key'; btn.disabled = false; }
  }
}

function handleRemoveKey() {
  if (confirm('Remove your API key? You can re-add it anytime.')) {
    clearApiKey();
    renderFeedbackPage();
  }
}

// ─── TAB SWITCHER ────────────────────────────────────────────────
function switchFbTab(tab) {
  document.querySelectorAll('.fb-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.fb-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('fb-' + tab).style.display = 'block';
  document.querySelector(`.fb-tab[data-tab="${tab}"]`)?.classList.add('active');
}

let wfbTaskNum = 1;
function setWFBTask(n) {
  wfbTaskNum = n;
  document.getElementById('wfb-t1').style.background = n===1?'rgba(79,142,247,0.15)':'var(--bg3)';
  document.getElementById('wfb-t1').style.color = n===1?'var(--accent2)':'var(--text2)';
  document.getElementById('wfb-t1').style.borderColor = n===1?'var(--accent)':'var(--border2)';
  document.getElementById('wfb-t2').style.background = n===2?'rgba(79,142,247,0.15)':'var(--bg3)';
  document.getElementById('wfb-t2').style.color = n===2?'var(--accent2)':'var(--text2)';
  document.getElementById('wfb-t2').style.borderColor = n===2?'var(--accent)':'var(--border2)';
  document.getElementById('wfb-target').textContent = n===1?'Target: 60–80 words':'Target: 120–150 words';
}

let sfbTaskNum = 1;
const sfbDescs = ['','Task 1 — Photo description (2 minutes)','Task 2 — Opinion monologue (2–3 minutes)','Task 3 — Dialogue / role-play (3–4 minutes)'];
function setSFBTask(n) {
  sfbTaskNum = n;
  [1,2,3].forEach(i => {
    const btn = document.getElementById(`sfb-t${i}`);
    btn.style.background = i===n?'rgba(155,127,232,0.15)':'var(--bg3)';
    btn.style.color = i===n?'var(--purple)':'var(--text2)';
    btn.style.borderColor = i===n?'var(--purple)':'var(--border2)';
  });
  document.getElementById('sfb-desc').textContent = sfbDescs[n];
}

// ─── LOADING SPINNER ─────────────────────────────────────────────
function showLoading(containerId, message='Analysing your French...') {
  document.getElementById(containerId).innerHTML = `
    <div style="text-align:center;padding:32px;color:var(--text2)">
      <div style="font-size:24px;margin-bottom:12px;animation:spin 1s linear infinite;display:inline-block">⚙️</div>
      <div style="font-size:14px">${message}</div>
    </div>
    <style>@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}</style>
  `;
}

function showError(containerId, message) {
  document.getElementById(containerId).innerHTML = `
    <div style="padding:16px;background:rgba(240,96,96,0.08);border:1px solid rgba(240,96,96,0.2);border-radius:10px;color:var(--red);font-size:14px">
      ⚠️ ${message}
    </div>
  `;
}

// ─── WRITING FEEDBACK ────────────────────────────────────────────
async function submitWritingFeedback() {
  const text = document.getElementById('wfb-input').value.trim();
  if (!text || text.length < 20) { alert('Please write at least a few sentences first.'); return; }

  const target = wfbTaskNum === 1 ? '60–80 words' : '120–150 words';
  const btn = document.getElementById('wfb-submit');
  btn.disabled = true; btn.textContent = 'Analysing...';
  showLoading('wfb-result', 'Reading your French carefully...');

  try {
    const raw = await callClaude(PROMPTS.writing(wfbTaskNum, target), `Student writing (Task ${wfbTaskNum}):\n\n${text}`, 1200);
    const data = JSON.parse(raw.replace(/```json|```/g, '').trim());
    renderWritingResult('wfb-result', data, text);
    appendErrorLog({ type: `Writing Task ${wfbTaskNum}`, patterns: data.patterns || [], score: data.overall_score });
  } catch(e) {
    const userMsg = {
      'NO_KEY': 'No API key saved — click ⚡ Feedback in the nav and add your key.',
      'INVALID_KEY': 'Invalid API key — go to ⚡ Feedback tab to re-enter it.',
      'BILLING_ERROR': 'No API credits — add billing at console.anthropic.com.',
      'RATE_LIMIT': 'Rate limited — wait 30 seconds and try again.',
    };
    showError('wfb-result', userMsg[e.message] || `Error: ${e.message}`);
  } finally {
    btn.disabled = false; btn.textContent = 'Get feedback →';
  }
}

function renderWritingResult(containerId, data, original) {
  const scoreColor = data.overall_score >= 16 ? 'var(--green)' : data.overall_score >= 12 ? 'var(--amber)' : 'var(--red)';
  const criteria = ['task_completion','vocabulary','grammar','register_cohesion'];
  const criteriaLabels = ['Task completion','Vocabulary','Grammar','Register & cohesion'];

  document.getElementById(containerId).innerHTML = `
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
        <div>
          <div style="font-family:var(--font-display);font-size:48px;color:${scoreColor};line-height:1">${data.overall_score}<span style="font-size:24px;color:var(--text3)">/20</span></div>
          <div style="margin-top:4px"><span class="badge badge-blue">${data.clb_estimate}</span></div>
        </div>
        <div style="text-align:right;max-width:55%">
          <div style="font-size:14px;color:var(--text2);line-height:1.6">${data.overall_comment}</div>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:16px">
        ${criteria.map((c,i) => {
          const score = data.scores?.[c] || 0;
          const pct = (score/5)*100;
          const col = score >= 4 ? 'var(--green)' : score >= 3 ? 'var(--amber)' : 'var(--red)';
          return `<div style="background:var(--bg3);border-radius:8px;padding:12px">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:13px;color:var(--text2)">${criteriaLabels[i]}</span>
              <span style="font-family:var(--font-mono);font-size:13px;color:${col}">${score}/5</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${col}"></div></div>
          </div>`;
        }).join('')}
      </div>

      ${data.strengths?.length ? `
      <div style="margin-bottom:16px">
        <div style="font-size:13px;color:var(--green);font-weight:500;margin-bottom:6px">✓ What you did well</div>
        ${data.strengths.map(s => `<div style="font-size:14px;color:var(--text2);padding:4px 0;padding-left:12px;border-left:2px solid var(--green)5 margin-bottom:4px">${s}</div>`).join('')}
      </div>` : ''}

      ${data.corrections?.length ? `
      <div style="margin-bottom:16px">
        <div style="font-size:13px;color:var(--red);font-weight:500;margin-bottom:10px">✗ Key corrections</div>
        ${data.corrections.map(c => `
          <div style="background:var(--bg3);border-radius:8px;padding:12px;margin-bottom:8px;border-left:3px solid var(--red)">
            <div style="display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap;margin-bottom:6px">
              <span style="font-style:italic;color:var(--red);text-decoration:line-through;font-size:14px">${c.original}</span>
              <span style="color:var(--text3)">→</span>
              <span style="font-style:italic;color:var(--green);font-size:14px;font-weight:500">${c.corrected}</span>
            </div>
            <div style="font-size:13px;color:var(--text2)">${c.explanation}</div>
          </div>`).join('')}
      </div>` : ''}

      <div style="background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.2);border-radius:8px;padding:12px">
        <div style="font-size:12px;color:var(--amber);font-weight:500;margin-bottom:4px">🎯 Priority fix for next time</div>
        <div style="font-size:14px;color:var(--text)">${data.priority_fix}</div>
      </div>
    </div>
  `;
}

// ─── GRAMMAR CHECK ───────────────────────────────────────────────
async function submitGrammarCheck() {
  const text = document.getElementById('gfb-input').value.trim();
  if (!text || text.length < 10) { alert('Please enter some French text first.'); return; }

  const btn = document.getElementById('gfb-submit');
  btn.disabled = true; btn.textContent = 'Checking...';
  showLoading('gfb-result', 'Checking every word...');

  try {
    const raw = await callClaude(PROMPTS.grammar(), `Check this French text:\n\n${text}`, 1200);
    const data = JSON.parse(raw.replace(/```json|```/g, '').trim());
    renderGrammarResult('gfb-result', data);
    appendErrorLog({ type: 'Grammar Check', patterns: data.patterns || [] });
  } catch(e) {
    const gMsg = {
      'NO_KEY': 'No API key saved — click ⚡ Feedback in the nav and add your key.',
      'INVALID_KEY': 'Invalid API key — go to ⚡ Feedback tab to re-enter it.',
      'BILLING_ERROR': 'No API credits — add billing at console.anthropic.com.',
      'RATE_LIMIT': 'Rate limited — wait 30 seconds and try again.',
    };
    showError('gfb-result', gMsg[e.message] || `Error: ${e.message}`);
  } finally {
    btn.disabled = false; btn.textContent = 'Check grammar →';
  }
}

function renderGrammarResult(containerId, data) {
  const errorColor = data.error_count === 0 ? 'var(--green)' : data.error_count <= 3 ? 'var(--amber)' : 'var(--red)';
  const errorLabel = data.error_count === 0 ? 'No errors found!' : `${data.error_count} error${data.error_count > 1 ? 's' : ''} found`;

  const typeColors = {
    tense:'rgba(155,127,232,0.2)', agreement:'rgba(240,96,96,0.2)', article:'rgba(79,142,247,0.2)',
    preposition:'rgba(62,207,207,0.2)', vocabulary:'rgba(245,166,35,0.2)', 'word order':'rgba(62,207,142,0.2)',
    accent:'rgba(190,24,93,0.2)', spelling:'rgba(245,166,35,0.2)', register:'rgba(107,163,255,0.2)'
  };

  document.getElementById(containerId).innerHTML = `
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="font-family:var(--font-display);font-size:36px;color:${errorColor}">${errorLabel}</div>
      </div>

      ${data.corrected_text ? `
      <div style="margin-bottom:16px">
        <div style="font-size:13px;color:var(--green);font-weight:500;margin-bottom:8px">✓ Corrected version</div>
        <div style="background:rgba(62,207,142,0.05);border:1px solid rgba(62,207,142,0.2);border-radius:8px;padding:14px;font-size:15px;line-height:1.8;font-style:italic;color:var(--text)">${data.corrected_text}</div>
      </div>` : ''}

      ${data.errors?.length ? `
      <div style="margin-bottom:16px">
        <div style="font-size:13px;color:var(--text2);font-weight:500;margin-bottom:10px">Errors explained:</div>
        ${data.errors.map(e => {
          const bg = typeColors[e.type?.toLowerCase()] || 'rgba(255,255,255,0.05)';
          return `<div style="background:var(--bg3);border-radius:8px;padding:12px;margin-bottom:8px;display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <div style="font-size:11px;font-family:var(--font-mono);padding:2px 8px;border-radius:4px;background:${bg};display:inline-block;margin-bottom:6px;color:var(--text2)">${e.type || 'error'}</div>
              <div style="font-size:14px"><span style="color:var(--red);text-decoration:line-through;font-style:italic">${e.original}</span> → <span style="color:var(--green);font-style:italic;font-weight:500">${e.corrected}</span></div>
            </div>
            <div style="font-size:13px;color:var(--text2);line-height:1.5">${e.explanation}</div>
          </div>`;
        }).join('')}
      </div>` : ''}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="background:rgba(62,207,142,0.05);border:1px solid rgba(62,207,142,0.2);border-radius:8px;padding:12px">
          <div style="font-size:12px;color:var(--green);font-weight:500;margin-bottom:4px">✓ What's good</div>
          <div style="font-size:13px;color:var(--text2)">${data.positive}</div>
        </div>
        <div style="background:rgba(245,166,35,0.05);border:1px solid rgba(245,166,35,0.2);border-radius:8px;padding:12px">
          <div style="font-size:12px;color:var(--amber);font-weight:500;margin-bottom:4px">💡 Tip</div>
          <div style="font-size:13px;color:var(--text2)">${data.tip}</div>
        </div>
      </div>
    </div>
  `;
}

// ─── SPEAKING FEEDBACK ───────────────────────────────────────────
async function submitSpeakingFeedback() {
  const text = document.getElementById('sfb-input').value.trim();
  if (!text || text.length < 30) { alert('Please type more of what you said — even a rough transcript helps.'); return; }

  const btn = document.getElementById('sfb-submit');
  btn.disabled = true; btn.textContent = 'Analysing...';
  showLoading('sfb-result', 'Reviewing your oral performance...');

  try {
    const raw = await callClaude(PROMPTS.speaking(sfbTaskNum), `Student spoken transcript (${sfbDescs[sfbTaskNum]}):\n\n${text}`, 1200);
    const data = JSON.parse(raw.replace(/```json|```/g, '').trim());
    renderSpeakingResult('sfb-result', data);
    appendErrorLog({ type: `Speaking Task ${sfbTaskNum}`, patterns: data.patterns || [], score: data.overall_score });
  } catch(e) {
    const sMsg = {
      'NO_KEY': 'No API key saved — click ⚡ Feedback in the nav and add your key.',
      'INVALID_KEY': 'Invalid API key — go to ⚡ Feedback tab to re-enter it.',
      'BILLING_ERROR': 'No API credits — add billing at console.anthropic.com.',
      'RATE_LIMIT': 'Rate limited — wait 30 seconds and try again.',
    };
    showError('sfb-result', sMsg[e.message] || `Error: ${e.message}`);
  } finally {
    btn.disabled = false; btn.textContent = 'Get feedback →';
  }
}

function renderSpeakingResult(containerId, data) {
  const scoreColor = data.overall_score >= 16 ? 'var(--green)' : data.overall_score >= 12 ? 'var(--amber)' : 'var(--red)';
  const criteria = ['task_completion','fluency_coherence','vocabulary','grammar_accuracy'];
  const criteriaLabels = ['Task completion','Fluency & coherence','Vocabulary','Grammar accuracy'];

  document.getElementById(containerId).innerHTML = `
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
        <div>
          <div style="font-family:var(--font-display);font-size:48px;color:${scoreColor};line-height:1">${data.overall_score}<span style="font-size:24px;color:var(--text3)">/20</span></div>
          <div style="margin-top:4px"><span class="badge badge-purple">${data.clb_estimate}</span></div>
        </div>
        <div style="text-align:right;max-width:55%">
          <div style="font-size:14px;color:var(--text2);line-height:1.6">${data.overall_comment}</div>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:16px">
        ${criteria.map((c,i) => {
          const score = data.scores?.[c] || 0;
          const pct = (score/5)*100;
          const col = score >= 4 ? 'var(--green)' : score >= 3 ? 'var(--amber)' : 'var(--red)';
          return `<div style="background:var(--bg3);border-radius:8px;padding:12px">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:13px;color:var(--text2)">${criteriaLabels[i]}</span>
              <span style="font-family:var(--font-mono);font-size:13px;color:${col}">${score}/5</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${col}"></div></div>
          </div>`;
        }).join('')}
      </div>

      ${data.strengths?.length ? `
      <div style="margin-bottom:16px">
        <div style="font-size:13px;color:var(--green);font-weight:500;margin-bottom:8px">✓ Strengths</div>
        ${data.strengths.map(s => `<div style="font-size:14px;color:var(--text2);padding:5px 0;padding-left:12px;border-left:2px solid var(--green);margin-bottom:4px">${s}</div>`).join('')}
      </div>` : ''}

      ${data.improvements?.length ? `
      <div style="margin-bottom:16px">
        <div style="font-size:13px;color:var(--amber);font-weight:500;margin-bottom:10px">↑ Areas to improve</div>
        ${data.improvements.map(imp => `
          <div style="background:var(--bg3);border-radius:8px;padding:12px;margin-bottom:8px;border-left:3px solid var(--amber)">
            <div style="font-size:14px;color:var(--text);font-weight:500;margin-bottom:4px">${imp.issue}</div>
            <div style="font-size:13px;color:var(--text2);margin-bottom:6px">${imp.suggestion}</div>
            ${imp.example ? `<div style="font-size:13px;color:var(--teal);font-style:italic">💬 "${imp.example}"</div>` : ''}
          </div>`).join('')}
      </div>` : ''}

      ${data.structure_feedback ? `
      <div style="background:rgba(79,142,247,0.05);border:1px solid rgba(79,142,247,0.2);border-radius:8px;padding:12px">
        <div style="font-size:12px;color:var(--accent2);font-weight:500;margin-bottom:4px">Structure feedback</div>
        <div style="font-size:14px;color:var(--text2)">${data.structure_feedback}</div>
      </div>` : ''}
    </div>
  `;
}

// ─── PROGRESS ANALYSIS ───────────────────────────────────────────
async function submitProgressAnalysis() {
  const log = getErrorLog();
  const patterns = getErrorPatterns();
  const btn = document.getElementById('prog-submit');
  btn.disabled = true; btn.textContent = 'Analysing...';
  showLoading('prog-result', 'Reviewing your learning journey...');

  const summary = {
    total_sessions: log.length,
    error_patterns: patterns.map(([p, c]) => ({ pattern: p, count: c })),
    recent_scores: log.filter(e => e.score).slice(-10).map(e => ({ type: e.type, score: e.score, date: e.date })),
  };

  try {
    const raw = await callClaude(PROMPTS.progress(), `Student error log summary:\n${JSON.stringify(summary, null, 2)}`, 800);
    const data = JSON.parse(raw.replace(/```json|```/g, '').trim());
    renderProgressResult('prog-result', data);
  } catch(e) {
    showError('prog-result', `Something went wrong: ${e.message}`);
  } finally {
    btn.disabled = false; btn.textContent = 'Analyse my progress →';
  }
}

function renderProgressResult(containerId, data) {
  document.getElementById(containerId).innerHTML = `
    <div style="background:rgba(62,207,142,0.05);border:1px solid rgba(62,207,142,0.2);border-radius:10px;padding:16px;margin-bottom:12px">
      <div style="font-size:13px;color:var(--green);font-weight:500;margin-bottom:8px">📈 Trajectory</div>
      <div style="font-size:14px;color:var(--text)">${data.clb_trajectory}</div>
    </div>

    <div class="grid-2" style="margin-bottom:12px">
      ${data.improving_areas?.length ? `
      <div style="background:var(--bg3);border-radius:8px;padding:12px">
        <div style="font-size:12px;color:var(--green);font-weight:500;margin-bottom:8px">✓ Improving</div>
        ${data.improving_areas.map(a => `<div style="font-size:13px;color:var(--text2);padding:3px 0">${a}</div>`).join('')}
      </div>` : ''}
      ${data.persistent_issues?.length ? `
      <div style="background:var(--bg3);border-radius:8px;padding:12px">
        <div style="font-size:12px;color:var(--red);font-weight:500;margin-bottom:8px">⚠ Still recurring</div>
        ${data.persistent_issues.map(i => `<div style="font-size:13px;color:var(--text2);padding:3px 0">${i}</div>`).join('')}
      </div>` : ''}
    </div>

    ${data.top_priorities?.length ? `
    <div style="background:var(--bg3);border-radius:8px;padding:12px;margin-bottom:12px">
      <div style="font-size:12px;color:var(--amber);font-weight:500;margin-bottom:8px">🎯 Top priorities right now</div>
      ${data.top_priorities.map((p,i) => `<div style="font-size:14px;color:var(--text);padding:5px 0;padding-left:12px;border-left:2px solid var(--amber);margin-bottom:4px"><strong>${i+1}.</strong> ${p}</div>`).join('')}
    </div>` : ''}

    <div style="background:rgba(155,127,232,0.05);border:1px solid rgba(155,127,232,0.2);border-radius:8px;padding:12px;margin-bottom:12px">
      <div style="font-size:12px;color:var(--purple);font-weight:500;margin-bottom:4px">📚 This week, focus on</div>
      <div style="font-size:14px;color:var(--text)">${data.weekly_focus}</div>
    </div>

    <div style="background:rgba(62,207,142,0.05);border:1px solid rgba(62,207,142,0.2);border-radius:8px;padding:12px">
      <div style="font-size:14px;color:var(--text2);line-height:1.6;font-style:italic">"${data.encouragement}"</div>
    </div>
  `;
}

function clearErrorLog() {
  if (confirm('Clear all feedback history? This cannot be undone.')) {
    try { localStorage.removeItem('tef_error_log'); } catch(e) {}
    renderFeedbackPage();
    switchFbTab('progress');
  }
}

// ─── CROSS-DEVICE SYNC ───────────────────────────────────────────

function exportProgress() {
  try {
    const data = {
      version: 1,
      exported: new Date().toISOString(),
      state: JSON.parse(localStorage.getItem('tef_state') || '{}'),
      error_log: JSON.parse(localStorage.getItem('tef_error_log') || '[]'),
      listening_notes: localStorage.getItem('tef_listening_notes') || '',
      writing_1: localStorage.getItem('tef_writing_1') || '',
      writing_2: localStorage.getItem('tef_writing_2') || '',
    };
    // Don't export API key for security
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tef-progress-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch(e) {
    alert('Export failed: ' + e.message);
  }
}

function importProgress(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.version) throw new Error('Not a valid TEF progress file');
      if (data.state) localStorage.setItem('tef_state', JSON.stringify(data.state));
      if (data.error_log) localStorage.setItem('tef_error_log', JSON.stringify(data.error_log));
      if (data.listening_notes) localStorage.setItem('tef_listening_notes', data.listening_notes);
      if (data.writing_1) localStorage.setItem('tef_writing_1', data.writing_1);
      if (data.writing_2) localStorage.setItem('tef_writing_2', data.writing_2);
      alert('✅ Progress imported! Reloading...');
      window.location.reload();
    } catch(err) {
      alert('Import failed: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function renderSyncSection() {
  return `
    <div class="card" style="margin-bottom:20px;border-color:rgba(62,207,142,0.2);background:rgba(62,207,142,0.02)">
      <div class="card-title" style="margin-bottom:4px;font-size:18px">📱 Cross-device sync</div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:16px;line-height:1.6">
        Your progress is saved in this browser. To use it on another device (phone, work laptop, etc.), 
        export your progress here and import it there. Takes 10 seconds.
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-green btn-sm" onclick="exportProgress()">⬇ Export progress</button>
        <label class="btn btn-secondary btn-sm" style="cursor:pointer">
          ⬆ Import progress
          <input type="file" accept=".json" style="display:none" onchange="importProgress(event)">
        </label>
      </div>
      <div style="margin-top:12px;padding:10px 14px;background:var(--bg3);border-radius:8px;font-size:13px;color:var(--text3)">
        💡 <strong style="color:var(--text2)">Tip:</strong> Export from your laptop, send the file to yourself (email, AirDrop, WhatsApp), then import on your phone. 
        Your API key is <strong style="color:var(--text2)">not</strong> included in exports for security — re-enter it on each device.
      </div>
    </div>
  `;
}
