// ═══════════════════════════════════════════════════════════════════
// app.js — TEF Prep Site v3
// ═══════════════════════════════════════════════════════════════════

// ─── STATE ───────────────────────────────────────────────────────
let state = {
  streak:0, sessions:0, lastVisit:null,
  todaySkills:{reading:0,listening:0,writing:0,speaking:0,grammar:0,vocab:0},
  grammarStats:{done:0,correct:0,streak:0},
  readingStats:{done:0,correct:0},
  vocabStats:{seen:0,correct:0,review:0},
  clbLevel:4.5,
};

function loadState(){
  try{
    const s=localStorage.getItem('tef_state');
    if(s) state={...state,...JSON.parse(s)};
    const today=new Date().toDateString();
    if(state.lastVisit!==today){
      if(state.lastVisit){
        const diff=Math.floor((new Date()-new Date(state.lastVisit))/86400000);
        if(diff>1) state.streak=0;
      }
      state.todaySkills={reading:0,listening:0,writing:0,speaking:0,grammar:0,vocab:0};
      state.lastVisit=today;
      state.sessions=(state.sessions||0)+1;
      saveState();
    }
  }catch(e){}
}

function saveState(){
  try{localStorage.setItem('tef_state',JSON.stringify(state));}catch(e){}
  if(typeof schedulePush==='function') schedulePush();
}

// ─── DAILY GOALS ─────────────────────────────────────────────────
// Weekday: ~1hr. Weekend: ~2hr.
function isWeekend(){ const d=new Date().getDay(); return d===0||d===6; }

const GOALS = {
  reading:  { wd:1, we:2, label:'Reading passages',    icon:'📖', color:'rgba(79,142,247,.15)',  fill:'var(--accent)' },
  listening:{ wd:1, we:1, label:'Listening sessions',  icon:'🎧', color:'rgba(62,207,207,.15)',  fill:'var(--teal)' },
  writing:  { wd:1, we:2, label:'Writing tasks',       icon:'✍️', color:'rgba(62,207,142,.15)',  fill:'var(--green)' },
  speaking: { wd:1, we:2, label:'Speaking tasks',      icon:'🗣️', color:'rgba(155,127,232,.15)', fill:'var(--purple)' },
  grammar:  { wd:15,we:25,label:'Grammar questions',   icon:'🔤', color:'rgba(245,166,35,.15)',  fill:'var(--amber)' },
  vocab:    { wd:10,we:15,label:'Vocab cards',         icon:'📚', color:'rgba(240,96,96,.15)',   fill:'var(--red)' },
};

function getGoal(skill){ return isWeekend()?GOALS[skill].we:GOALS[skill].wd; }

function progressSkill(skill, amount=1){
  state.todaySkills[skill]=(state.todaySkills[skill]||0)+amount;
  const goal=getGoal(skill);
  const done=Math.min(state.todaySkills[skill],goal);
  // Update dashboard mini-bar
  const fillEl=document.getElementById(`ds-fill-${skill}`);
  const countEl=document.getElementById(`ds-count-${skill}`);
  const itemEl=document.getElementById(`ds-item-${skill}`);
  if(fillEl) fillEl.style.width=Math.min(100,(done/goal)*100)+'%';
  if(countEl){ countEl.textContent=`${done}/${goal}`; countEl.className=done>=goal?'ds-status done':'ds-status';}
  if(itemEl&&done>=goal) itemEl.classList.add('done');
  // Update goal bar inside the tab
  renderGoalBar(skill);
  // Check if all done
  const allDone=Object.keys(GOALS).every(k=>state.todaySkills[k]>=getGoal(k));
  if(allDone){ state.streak=(state.streak||0)+1; document.getElementById('stat-streak').textContent=state.streak; }
  saveState();
  updateDashboardStats();
}

function renderGoalBar(skill){
  const el=document.getElementById(`${skill}-goal-bar`);
  if(!el) return;
  const goal=getGoal(skill);
  const done=Math.min(state.todaySkills[skill]||0,goal);
  const pct=Math.min(100,(done/goal)*100);
  const complete=done>=goal;
  el.innerHTML=`
    <div class="goal-bar" style="border-color:${complete?'rgba(62,207,142,.3)':''};background:${complete?'rgba(62,207,142,.04)':''}">
      <div class="goal-bar-top">
        <span class="goal-bar-label">${GOALS[skill].icon} ${GOALS[skill].label} today</span>
        <span class="goal-bar-count ${complete?'done':''}">${done} / ${goal}</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${complete?'var(--green)':GOALS[skill].fill}"></div></div>
      <div class="goal-complete-banner ${complete?'show':''}">✅ Goal complete for today! Great work.</div>
    </div>`;
}

// ─── NAV ─────────────────────────────────────────────────────────
let pageInitialised={};

function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-link').forEach(l=>l.classList.remove('active'));
  document.getElementById('page-'+name)?.classList.add('active');
  document.querySelectorAll(`.nav-link`).forEach(l=>{if(l.getAttribute('onclick')?.includes(`'${name}'`))l.classList.add('active');});
  document.querySelectorAll(`.mobile-nav-link`).forEach(l=>{if(l.getAttribute('onclick')?.includes(`'${name}'`))l.classList.add('active');});
  if(!pageInitialised[name]){
    pageInitialised[name]=true;
    if(name==='reading') initReading();
    if(name==='listening') initListening();
    if(name==='writing') initWriting();
    if(name==='speaking') initSpeaking();
    if(name==='grammar') initGrammar();
    if(name==='vocab') initVocab();
  }
  if(name==='feedback') renderFeedbackPage();
  // Always refresh goal bars
  if(GOALS[name]) renderGoalBar(name);
}

function toggleMobileMenu(){
  const m=document.getElementById('mobile-menu');
  m.classList.toggle('open');
}
function closeMobileMenu(){
  document.getElementById('mobile-menu')?.classList.remove('open');
}

// ─── COUNTDOWN ───────────────────────────────────────────────────
function updateCountdown(){
  const diff=Math.ceil((new Date('2026-10-31')-new Date())/86400000);
  const txt=diff>0?diff+' days':'EXAM DAY 🎃';
  document.getElementById('days-left').textContent=diff>0?diff:'🎃';
  document.getElementById('nav-countdown').textContent=txt;
  const mc=document.getElementById('mobile-countdown');
  if(mc) mc.textContent=txt;
}

// ─── DASHBOARD ───────────────────────────────────────────────────
function initDashboard(){
  updateCountdown();
  updateDashboardStats();
  renderDailySkills();
}

function updateDashboardStats(){
  document.getElementById('stat-streak').textContent=state.streak||0;
  document.getElementById('stat-sessions').textContent=state.sessions||1;
  const gPct=state.grammarStats?.done>0?Math.round((state.grammarStats.correct/state.grammarStats.done)*100)+'%':'—';
  const rPct=state.readingStats?.done>0?Math.round((state.readingStats.correct/state.readingStats.done)*100)+'%':'—';
  document.getElementById('stat-grammar').textContent=gPct;
  document.getElementById('stat-reading').textContent=rPct;
  // CLB estimate
  const g=state.grammarStats?.done>0?state.grammarStats.correct/state.grammarStats.done:0;
  const r=state.readingStats?.done>0?state.readingStats.correct/state.readingStats.done:0;
  const avg=(g+r)/2;
  state.clbLevel=Math.min(4.5+avg*3,8);
  const pct=((state.clbLevel-1)/9)*100;
  document.getElementById('clb-bar').style.width=pct+'%';
  const badge=document.getElementById('clb-badge');
  if(state.clbLevel<5){badge.textContent='CLB 4–5';badge.className='badge badge-amber';}
  else if(state.clbLevel<6){badge.textContent='CLB 5';badge.className='badge badge-amber';}
  else if(state.clbLevel<7){badge.textContent='CLB 6';badge.className='badge badge-blue';}
  else{badge.textContent='CLB 7+ ✓';badge.className='badge badge-green';}
}

function renderDailySkills(){
  const el=document.getElementById('daily-skills-list');
  const we=isWeekend();
  document.getElementById('daily-header').textContent=`Today's goals (${we?'weekend — 2 hrs':'weekday — 1 hr'})`;
  el.innerHTML=Object.entries(GOALS).map(([skill,g])=>{
    const goal=we?g.we:g.wd;
    const done=Math.min(state.todaySkills[skill]||0,goal);
    const pct=Math.min(100,(done/goal)*100);
    const complete=done>=goal;
    return `<div class="daily-skill ${complete?'done':''}" id="ds-item-${skill}" onclick="showPage('${skill}')">
      <div class="ds-icon" style="background:${g.color}">${g.icon}</div>
      <div class="ds-info">
        <div class="ds-name">${skill.charAt(0).toUpperCase()+skill.slice(1)}</div>
        <div class="ds-bar"><div class="ds-fill" id="ds-fill-${skill}" style="width:${pct}%;background:${complete?'var(--green)':g.fill}"></div></div>
      </div>
      <div class="ds-status ${complete?'done':''}" id="ds-count-${skill}">${done}/${goal}</div>
    </div>`;
  }).join('');
}

// ─── READING ─────────────────────────────────────────────────────
let currentPassage=null, readingTimer=null, readingSeconds=900, readingAnswers=[];

function initReading(){ renderGoalBar('reading'); loadPassage(); }

function loadPassage(){
  clearInterval(readingTimer);
  readingSeconds=900;
  document.getElementById('reading-timer').textContent='15:00';
  document.getElementById('reading-timer').className='timer-display';
  document.getElementById('reading-start-btn').textContent='Start timer';
  document.getElementById('reading-start-btn').disabled=false;
  document.getElementById('reading-result').innerHTML='';
  document.getElementById('passage-vocab-section').innerHTML='';
  const diff=document.getElementById('reading-difficulty').value;
  const pool=PASSAGES[diff]||PASSAGES.b2;
  currentPassage=pool[Math.floor(Math.random()*pool.length)];
  readingAnswers=new Array(currentPassage.questions.length).fill(-1);
  document.getElementById('passage-topic').textContent=currentPassage.topic;
  document.getElementById('passage-source').textContent=currentPassage.source;
  document.getElementById('reading-score-badge').innerHTML='';
  document.getElementById('passage-text').innerHTML=currentPassage.text.replace(/\n\n/g,'</p><p style="margin-top:11px">').replace(/^/,'<p>').replace(/$/,'</p>');
  renderQuestions();
}

function renderQuestions(){
  document.getElementById('questions-container').innerHTML=
    currentPassage.questions.map((q,qi)=>`
      <div class="card" style="margin-bottom:10px">
        <div style="font-weight:500;font-size:14px;margin-bottom:10px">${qi+1}. ${q.q}</div>
        ${q.options.map((opt,oi)=>`
          <div class="mcq-option" id="opt-${qi}-${oi}" onclick="selectOption(${qi},${oi})">
            <div class="mcq-letter">${String.fromCharCode(65+oi)}</div>
            <div style="font-size:14px">${opt}</div>
          </div>`).join('')}
      </div>`).join('')+
    `<button class="btn btn-primary" onclick="submitReading()" style="margin-top:6px">Submit answers</button>`;
}

function selectOption(qi,oi){
  currentPassage.questions[qi].options.forEach((_,i)=>document.getElementById(`opt-${qi}-${i}`)?.classList.remove('selected'));
  document.getElementById(`opt-${qi}-${oi}`)?.classList.add('selected');
  readingAnswers[qi]=oi;
}

function startReadingTimer(){
  clearInterval(readingTimer);
  document.getElementById('reading-start-btn').textContent='Running...';
  document.getElementById('reading-start-btn').disabled=true;
  readingTimer=setInterval(()=>{
    readingSeconds--;
    const m=Math.floor(readingSeconds/60), s=readingSeconds%60;
    document.getElementById('reading-timer').textContent=`${m}:${s.toString().padStart(2,'0')}`;
    if(readingSeconds<=120) document.getElementById('reading-timer').className='timer-display urgent';
    if(readingSeconds<=0){clearInterval(readingTimer);submitReading();}
  },1000);
}

function resetReading(){ clearInterval(readingTimer); loadPassage(); }

function submitReading(){
  clearInterval(readingTimer);
  let correct=0;
  currentPassage.questions.forEach((q,qi)=>{
    const ua=readingAnswers[qi];
    q.options.forEach((_,oi)=>{
      const el=document.getElementById(`opt-${qi}-${oi}`);
      if(!el) return;
      el.style.cursor='default'; el.onclick=null;
      if(oi===q.answer) el.classList.add('correct');
      else if(oi===ua&&ua!==q.answer) el.classList.add('wrong');
    });
    if(ua===q.answer) correct++;
  });
  const total=currentPassage.questions.length;
  const pct=Math.round((correct/total)*100);
  const col=pct>=80?'var(--green)':pct>=60?'var(--amber)':'var(--red)';
  document.getElementById('reading-result').innerHTML=`
    <div class="card" style="text-align:center;margin-top:14px">
      <div style="font-family:var(--font-display);font-size:44px;color:${col}">${correct}/${total}</div>
      <div style="font-size:15px;color:var(--text2);margin-top:4px">${pct}% · ${pct>=80?'Excellent!':pct>=60?'Good effort!':'Keep practising!'}</div>
      <button class="btn btn-secondary btn-sm" onclick="loadPassage()" style="margin-top:14px">Try another passage →</button>
    </div>`;
  // Show vocab + translation
  if(currentPassage.vocab?.length){
    document.getElementById('passage-vocab-section').innerHTML=`
      <div class="card" style="margin-top:14px">
        <div class="card-title" style="font-size:17px;margin-bottom:4px">Key vocabulary from this passage</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:12px">Study these words — they are all B2 level TEF vocabulary</div>
        <div class="vocab-reveal">
          ${currentPassage.vocab.map(v=>`
            <div class="vocab-row">
              <span class="vocab-fr">${v.fr}</span>
              <span style="color:var(--text3);font-size:12px">${v.type||''}</span>
              <span class="vocab-en">${v.en}</span>
            </div>`).join('')}
        </div>
        ${currentPassage.translation?`
        <div style="margin-top:14px">
          <div style="font-size:13px;font-weight:500;color:var(--text2);margin-bottom:8px">📘 Passage translation (English)</div>
          <div style="background:var(--bg3);border-radius:10px;padding:14px;font-size:14px;color:var(--text2);line-height:1.8">${currentPassage.translation.replace(/\n\n/g,'</p><p style="margin-top:10px">').replace(/^/,'<p>').replace(/$/,'</p>')}</div>
        </div>`:''}
      </div>`;
  }
  state.readingStats.done+=total;
  state.readingStats.correct+=correct;
  progressSkill('reading');
  updateDashboardStats();
  saveState();
}

// ─── LISTENING ───────────────────────────────────────────────────
const LISTENING_QUESTIONS=[
  ["Quel est le sujet principal de ce que vous avez écouté?","Citez deux informations importantes que vous avez retenues.","Y avait-il des opinions exprimées? Lesquelles?","Quel vocabulaire nouveau avez-vous entendu?","Quelle est votre réaction personnelle à ce contenu?"],
  ["De quoi parlait cette émission ou ce podcast?","Quels arguments ou faits importants ont été mentionnés?","Y avait-il plusieurs points de vue? Décrivez-les.","Avez-vous entendu des expressions françaises nouvelles? Lesquelles?","Ce contenu vous a-t-il appris quelque chose de surprenant?"],
  ["Résumez en deux phrases ce que vous avez compris.","Qui parlait et dans quel contexte?","Quelles informations chiffrées ou dates avez-vous entendues?","Quel registre de langue était utilisé — formel ou informel?","Comment ce sujet est-il lié à votre vie quotidienne au Canada?"],
];

function initListening(){
  renderGoalBar('listening');
  newListeningTask();
  newListeningQuestions();
  try{ const s=localStorage.getItem('tef_listening_notes'); if(s) document.getElementById('listening-answers').value=s; }catch(e){}
}

function newListeningTask(){
  const task=LISTENING_TASKS[Math.floor(Math.random()*LISTENING_TASKS.length)];
  document.getElementById('listening-task').textContent=task;
}

function newListeningQuestions(){
  const set=LISTENING_QUESTIONS[Math.floor(Math.random()*LISTENING_QUESTIONS.length)];
  document.getElementById('listening-questions').innerHTML=
    set.map((q,i)=>`<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:14px"><span style="color:var(--accent2);font-weight:500;margin-right:8px">${i+1}.</span>${q}</div>`).join('');
}

function submitListeningAnswers(){
  const v=document.getElementById('listening-answers').value.trim();
  if(!v){alert('Write your answers in French first.');return;}
  try{localStorage.setItem('tef_listening_notes',v);}catch(e){}
  const el=document.getElementById('listening-saved');
  el.style.opacity='1'; setTimeout(()=>el.style.opacity='0',2000);
  progressSkill('listening');
}

// ─── WRITING ─────────────────────────────────────────────────────
let currentWritingTask=1;

function initWriting(){
  renderGoalBar('writing');
  setWritingTask(1);
  // Check if API key available
  const hasKey=!!getApiKey();
  document.getElementById('writing-api-status').textContent=hasKey?'✅ AI feedback ready':'⚠️ Add API key in Feedback tab for instant AI feedback';
  document.getElementById('writing-api-status').style.color=hasKey?'var(--green)':'var(--amber)';
}

function setWritingTask(n){
  currentWritingTask=n;
  ['task1-btn','task2-btn'].forEach((id,i)=>{
    const btn=document.getElementById(id);
    btn.style.borderColor=i+1===n?'var(--accent)':'';
    btn.style.color=i+1===n?'var(--accent2)':'';
  });
  document.getElementById('task-type-badge').textContent=`Task ${n}`;
  document.getElementById('task-target-words').textContent=n===1?'Target: 60–80 words':'Target: 120–150 words';
  newWritingPrompt();
  document.getElementById('writing-textarea').value='';
  document.getElementById('word-count').textContent='0 words';
  document.getElementById('writing-feedback-result').innerHTML='';
}

function newWritingPrompt(){
  const pool=WRITING_PROMPTS[currentWritingTask];
  document.getElementById('writing-prompt-text').textContent=pool[Math.floor(Math.random()*pool.length)].text;
}

function updateWordCount(){
  const words=document.getElementById('writing-textarea').value.trim().split(/\s+/).filter(Boolean).length;
  const el=document.getElementById('word-count');
  const min=currentWritingTask===1?60:120, max=currentWritingTask===1?80:150;
  el.textContent=`${words} words`;
  el.className='word-count'+(words>=min&&words<=max?' ok':'');
}

async function submitWritingWithFeedback(){
  const text=document.getElementById('writing-textarea').value.trim();
  if(!text||text.length<20){alert('Please write your response first.');return;}
  try{localStorage.setItem('tef_writing_'+currentWritingTask,text);}catch(e){}
  const savedEl=document.getElementById('writing-saved');
  savedEl.style.opacity='1'; setTimeout(()=>savedEl.style.opacity='0',2000);
  progressSkill('writing');
  const hasKey=!!getApiKey();
  if(!hasKey){
    document.getElementById('writing-feedback-result').innerHTML=`
      <div style="padding:14px;background:rgba(245,166,35,.08);border:1px solid rgba(245,166,35,.2);border-radius:10px;font-size:14px;color:var(--amber)">
        ✍️ Response saved! Add your API key in the ⚡ Feedback tab to get instant AI corrections and scoring.
      </div>`;
    return;
  }
  // Use the feedback module
  document.getElementById('writing-feedback-result').innerHTML=`<div style="text-align:center;padding:20px;color:var(--text2);font-size:14px">Analysing your French... ⚙️</div>`;
  document.getElementById('writing-submit-btn').disabled=true;
  try{
    const target=currentWritingTask===1?'60–80 words':'120–150 words';
    const raw=await callClaude(PROMPTS.writing(currentWritingTask,target),`Student writing (Task ${currentWritingTask}):\n\n${text}`,1200);
    const data=JSON.parse(raw.replace(/```json|```/g,'').trim());
    renderWritingResult('writing-feedback-result',data,text);
    appendErrorLog({type:`Writing Task ${currentWritingTask}`,patterns:data.patterns||[],score:data.overall_score});
  }catch(e){
    document.getElementById('writing-feedback-result').innerHTML=`<div style="padding:12px;background:rgba(240,96,96,.08);border:1px solid rgba(240,96,96,.2);border-radius:10px;font-size:14px;color:var(--red)">Feedback error: ${e.message}</div>`;
  }finally{
    document.getElementById('writing-submit-btn').disabled=false;
  }
}

function clearWriting(){
  document.getElementById('writing-textarea').value='';
  document.getElementById('word-count').textContent='0 words';
  document.getElementById('word-count').className='word-count';
  document.getElementById('writing-feedback-result').innerHTML='';
}

// ─── SPEAKING ────────────────────────────────────────────────────
let currentSpeakingTask=1,speakingTimer=null,speakingSeconds=120,speakingRunning=false;
const sfbDescs=['','Task 1 — Photo description (2 min)','Task 2 — Opinion monologue (2–3 min)','Task 3 — Dialogue / role-play (3–4 min)'];

function initSpeaking(){
  renderGoalBar('speaking');
  setSpeakingTask(1);
  renderUsefulPhrases();
}

function setSpeakingTask(n){
  currentSpeakingTask=n;
  [1,2,3].forEach(i=>{
    const btn=document.getElementById(`speak${i}-btn`);
    btn.style.borderColor=i===n?'var(--purple)':'';
    btn.style.color=i===n?'var(--purple)':'';
  });
  const descs={1:'Task 1 — Describe a photo or scene in detail (2 minutes)',2:'Task 2 — Give and justify your opinion (2–3 minutes)',3:'Task 3 — Dialogue or role-play scenario (3–4 minutes)'};
  document.getElementById('speaking-task-desc').textContent=descs[n];
  speakingSeconds={1:120,2:150,3:210}[n];
  const m=Math.floor(speakingSeconds/60), s=speakingSeconds%60;
  document.getElementById('speak-time-display').textContent=`${m}:${s.toString().padStart(2,'0')}`;
  document.getElementById('speak-circle').className='speak-circle';
  document.getElementById('speak-status').textContent='Press Start when ready';
  document.getElementById('speak-start-btn').disabled=false;
  clearInterval(speakingTimer); speakingRunning=false;
  newSpeakingPrompt();
  renderSpeakingTips(n);
}

function newSpeakingPrompt(){
  const pool=SPEAKING_PROMPTS[currentSpeakingTask];
  document.getElementById('speaking-prompt-text').textContent=pool[Math.floor(Math.random()*pool.length)];
}

function startSpeakingTimer(){
  if(speakingRunning) return;
  speakingRunning=true;
  document.getElementById('speak-circle').className='speak-circle running';
  document.getElementById('speak-status').textContent='Speaking now...';
  document.getElementById('speak-start-btn').disabled=true;
  speakingTimer=setInterval(()=>{
    speakingSeconds--;
    const m=Math.floor(speakingSeconds/60), s=speakingSeconds%60;
    document.getElementById('speak-time-display').textContent=`${m}:${s.toString().padStart(2,'0')}`;
    if(speakingSeconds<=0){
      clearInterval(speakingTimer);
      document.getElementById('speak-circle').className='speak-circle done';
      document.getElementById('speak-time-display').textContent='0:00';
      document.getElementById('speak-status').textContent="Time's up! Well done.";
      progressSkill('speaking');
    }
  },1000);
}

function resetSpeaking(){ clearInterval(speakingTimer); speakingRunning=false; setSpeakingTask(currentSpeakingTask); }

function renderSpeakingTips(n){
  document.getElementById('speaking-tips').innerHTML=(SPEAKING_TIPS[n]||[]).map(t=>`<div class="tip-item">${t}</div>`).join('');
}

function renderUsefulPhrases(){
  document.getElementById('useful-phrases').innerHTML=USEFUL_PHRASES.map(p=>`
    <div style="padding:7px 10px;background:var(--bg3);border-radius:7px;border-left:2px solid var(--purple)">
      <div style="font-style:italic;color:var(--text);font-size:13px">${p.fr}</div>
      <div style="font-size:12px;color:var(--text3);margin-top:1px">${p.en}</div>
    </div>`).join('');
}

// ─── GRAMMAR ─────────────────────────────────────────────────────
let currentGrammarQ=null, grammarAnswered=false;
const ACCENTS_LIST=['é','è','ê','ë','à','â','î','ô','û','ù','ç','œ'];

function initGrammar(){
  renderGoalBar('grammar');
  const row=document.querySelector('#page-grammar .acc')?.parentElement;
  if(row){
    ACCENTS_LIST.forEach(a=>{
      const btn=document.createElement('button');
      btn.className='acc'; btn.textContent=a;
      btn.onclick=()=>insertAccent(a);
      row.appendChild(btn);
    });
  } else {
    // Build accent row
    const accRow=document.createElement('div');
    accRow.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px';
    accRow.innerHTML='<span style="font-size:12px;color:var(--text3);align-self:center">Accents:</span>';
    ACCENTS_LIST.forEach(a=>{
      const btn=document.createElement('button');
      btn.className='acc'; btn.textContent=a;
      btn.onclick=()=>insertAccent(a);
      accRow.appendChild(btn);
    });
    document.querySelector('#page-grammar .card')?.prepend(accRow);
  }
  document.getElementById('g-input').addEventListener('keydown',e=>{
    if(e.key==='Enter') grammarAnswered?newConjQuestion():checkGrammar();
  });
  newConjQuestion();
}

function insertAccent(a){
  const inp=document.getElementById('g-input');
  const p=inp.selectionStart;
  inp.value=inp.value.slice(0,p)+a+inp.value.slice(p);
  inp.focus(); inp.setSelectionRange(p+1,p+1);
}

function getFilteredVerbs(){
  const tense=document.getElementById('grammar-tense').value;
  const group=document.getElementById('grammar-group').value;
  const qs=[];
  VERBS.forEach(verb=>{
    if(group!=='all'&&verb.g!==group) return;
    const tenses=tense==='all'?Object.keys(TENSE_LABELS):[tense];
    tenses.forEach(t=>{
      const forms=verb[t];
      if(!forms) return;
      SUBJECTS.forEach((subj,i)=>{if(forms[i]!==null) qs.push({verb,tense:t,subjIdx:i,subj,answer:forms[i]});});
    });
  });
  return qs;
}

function newConjQuestion(){
  const qs=getFilteredVerbs();
  if(!qs.length) return;
  currentGrammarQ=qs[Math.floor(Math.random()*qs.length)];
  grammarAnswered=false;
  document.getElementById('g-verb').textContent=currentGrammarQ.verb.v;
  document.getElementById('g-eng').textContent=currentGrammarQ.verb.e;
  document.getElementById('g-tense').textContent=TENSE_LABELS[currentGrammarQ.tense];
  const subj=currentGrammarQ.tense==='subjonctif'?`que ${currentGrammarQ.subj}`:currentGrammarQ.subj;
  document.getElementById('g-subject').textContent=subj;
  const inp=document.getElementById('g-input');
  inp.value=''; inp.style.borderColor=''; inp.disabled=false; inp.focus();
  document.getElementById('g-feedback').innerHTML='';
  document.getElementById('g-full-conj').innerHTML='';
  document.getElementById('g-next-btn').style.display='none';
}

function normalize(s){return s.trim().toLowerCase().replace(/\(e\)/g,'').replace(/\(s\)/g,'').replace(/\(es\)/g,'').replace(/\s+/g,' ').trim();}

function checkGrammar(){
  if(grammarAnswered){newConjQuestion();return;}
  const inp=document.getElementById('g-input');
  const isCorrect=normalize(inp.value)===normalize(currentGrammarQ.answer);
  grammarAnswered=true;
  state.grammarStats.done++;
  if(isCorrect){
    state.grammarStats.correct++;
    state.grammarStats.streak++;
    inp.style.borderColor='var(--green)';
    const streak=state.grammarStats.streak>=5?` 🔥 ${state.grammarStats.streak} in a row!`:'';
    document.getElementById('g-feedback').innerHTML=`<div class="conj-feedback correct">Correct!${streak}</div>`;
  } else {
    state.grammarStats.streak=0;
    inp.style.borderColor='var(--red)';
    document.getElementById('g-feedback').innerHTML=`<div class="conj-feedback wrong">The answer is: <strong>${currentGrammarQ.answer}</strong></div>`;
  }
  inp.disabled=true;
  // Full conjugation
  const forms=currentGrammarQ.verb[currentGrammarQ.tense];
  let html='<div class="full-conj-grid">';
  SUBJECTS.forEach((s,i)=>{
    if(forms[i]===null) return;
    const hl=i===currentGrammarQ.subjIdx;
    const sub=currentGrammarQ.tense==='subjonctif'?`que ${s}`:s;
    html+=`<div class="fc-row${hl?' hl':''}"><span class="fc-s">${sub}</span><span class="fc-f${hl?' hl':''}">${forms[i]}</span></div>`;
  });
  document.getElementById('g-full-conj').innerHTML=html+'</div>';
  document.getElementById('g-next-btn').style.display='inline-flex';
  // Update stats
  document.getElementById('g-done').textContent=state.grammarStats.done;
  document.getElementById('g-correct').textContent=state.grammarStats.correct;
  document.getElementById('g-pct').textContent=Math.round((state.grammarStats.correct/state.grammarStats.done)*100)+'%';
  document.getElementById('g-streak').textContent=state.grammarStats.streak;
  progressSkill('grammar');
  updateDashboardStats();
  saveState();
}

// ─── VOCAB ───────────────────────────────────────────────────────
let currentVocabCard=null;

function initVocab(){
  renderGoalBar('vocab');
  loadVocabCard();
}

function loadVocabCard(){
  document.getElementById('vocab-check-result').innerHTML='';
  document.getElementById('vocab-reveal-section').style.display='none';
  document.getElementById('vocab-answer-input').value='';
  document.getElementById('vocab-answer-input').style.borderColor='';
  const theme=document.getElementById('vocab-theme').value;
  let pool=theme==='all'?Object.values(VOCAB).flat():VOCAB[theme]||[];
  if(!pool.length) return;
  currentVocabCard=pool[Math.floor(Math.random()*pool.length)];
  document.getElementById('fc-word').textContent=currentVocabCard.fr;
  document.getElementById('fc-type').textContent=currentVocabCard.type||'';
  document.getElementById('fc-translation').textContent=currentVocabCard.en;
  document.getElementById('fc-example').textContent=currentVocabCard.ex||'';
  document.getElementById('vocab-theme-label').textContent=theme==='all'?'All themes':theme.charAt(0).toUpperCase()+theme.slice(1);
  // Update stats
  document.getElementById('v-seen').textContent=state.vocabStats?.seen||0;
  document.getElementById('v-correct').textContent=state.vocabStats?.correct||0;
  document.getElementById('v-review').textContent=state.vocabStats?.review||0;
  const seen=state.vocabStats?.seen||0;
  document.getElementById('v-pct').textContent=seen>0?Math.round(((state.vocabStats?.correct||0)/seen)*100)+'%':'—';
}

function checkVocabAnswer(){
  const input=document.getElementById('vocab-answer-input').value.trim().toLowerCase();
  if(!input){alert('Type your answer first.');return;}
  const correct=currentVocabCard.en.toLowerCase();
  // Fuzzy match — accept if any significant word matches
  const inputWords=input.split(/\s+/);
  const correctWords=correct.split(/[\s\/,]+/);
  const isCorrect=inputWords.some(w=>w.length>2&&correctWords.some(cw=>cw.includes(w)||w.includes(cw)));
  if(!state.vocabStats) state.vocabStats={seen:0,correct:0,review:0};
  state.vocabStats.seen++;
  const resultEl=document.getElementById('vocab-check-result');
  if(isCorrect){
    state.vocabStats.correct++;
    document.getElementById('vocab-answer-input').style.borderColor='var(--green)';
    resultEl.innerHTML=`<div class="vocab-check-result correct">✓ Correct! The answer is: <strong>${currentVocabCard.en}</strong></div>`;
  } else {
    state.vocabStats.review++;
    document.getElementById('vocab-answer-input').style.borderColor='var(--red)';
    resultEl.innerHTML=`<div class="vocab-check-result wrong">✗ Not quite — the answer is: <strong>${currentVocabCard.en}</strong></div>`;
  }
  document.getElementById('vocab-reveal-section').style.display='block';
  progressSkill('vocab');
  saveState();
  // Update counts
  document.getElementById('v-seen').textContent=state.vocabStats.seen;
  document.getElementById('v-correct').textContent=state.vocabStats.correct;
  document.getElementById('v-review').textContent=state.vocabStats.review;
  document.getElementById('v-pct').textContent=Math.round((state.vocabStats.correct/state.vocabStats.seen)*100)+'%';
}

function vocabResult(result){
  if(result==='known'&&state.vocabStats) state.vocabStats.correct=Math.max(0,(state.vocabStats.correct||0));
  saveState();
  loadVocabCard();
}

// ─── INIT ────────────────────────────────────────────────────────
loadState();
initDashboard();
setInterval(updateCountdown,60000);
if(typeof startupSync==='function') startupSync();
