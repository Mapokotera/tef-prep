// ═══════════════════════════════════════════════════════════════════
// sync.js — Firebase Firestore real-time sync
// ═══════════════════════════════════════════════════════════════════

// ─── FIREBASE CONFIG ─────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCBHvcEpkT3qLIc6eY4IyEzf6bXPXgrFWo",
  authDomain: "tef-prep-41adf.firebaseapp.com",
  projectId: "tef-prep-41adf",
  storageBucket: "tef-prep-41adf.firebasestorage.app",
  messagingSenderId: "539253949655",
  appId: "1:539253949655:web:925220073de7f423e4dc92"
};

// ─── FIREBASE SDK (loaded via CDN in index.html) ──────────────────
// We use the compat (global) SDK so no bundler is needed
let db = null;
let syncUserId = null;
let syncEnabled = false;
let syncUnsubscribe = null; // for real-time listener

// ─── INIT ─────────────────────────────────────────────────────────
function initSync() {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    syncEnabled = true;
    console.log('[Sync] Firebase initialised');
  } catch(e) {
    console.warn('[Sync] Firebase init failed:', e.message);
    syncEnabled = false;
  }
}

// ─── USER ID ──────────────────────────────────────────────────────
// We use a self-generated UUID stored in localStorage.
// No authentication needed — each device gets a stable ID.
// The user links devices by entering the same User ID on each one.

function getSyncUserId() {
  try {
    let id = localStorage.getItem('tef_sync_user_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem('tef_sync_user_id', id);
    }
    return id;
  } catch(e) { return null; }
}

function setSyncUserId(id) {
  try {
    localStorage.setItem('tef_sync_user_id', id.trim());
    syncUserId = id.trim();
  } catch(e) {}
}

// ─── WHAT WE SYNC ─────────────────────────────────────────────────
// We sync the main state object + error log + writing drafts.
// API key is intentionally excluded.

function getLocalSyncData() {
  try {
    return {
      state:          JSON.parse(localStorage.getItem('tef_state') || '{}'),
      error_log:      JSON.parse(localStorage.getItem('tef_error_log') || '[]'),
      writing_1:      localStorage.getItem('tef_writing_1') || '',
      writing_2:      localStorage.getItem('tef_writing_2') || '',
      listening_notes:localStorage.getItem('tef_listening_notes') || '',
      updated_at:     new Date().toISOString(),
    };
  } catch(e) { return {}; }
}

function applyRemoteData(data) {
  try {
    if (data.state)           localStorage.setItem('tef_state', JSON.stringify(data.state));
    if (data.error_log)       localStorage.setItem('tef_error_log', JSON.stringify(data.error_log));
    if (data.writing_1)       localStorage.setItem('tef_writing_1', data.writing_1);
    if (data.writing_2)       localStorage.setItem('tef_writing_2', data.writing_2);
    if (data.listening_notes) localStorage.setItem('tef_listening_notes', data.listening_notes);
  } catch(e) {}
}

// ─── PUSH (local → cloud) ─────────────────────────────────────────
async function pushToCloud() {
  if (!syncEnabled || !db || !syncUserId) return false;
  try {
    const data = getLocalSyncData();
    await db.collection('tef_users').doc(syncUserId).set(data, { merge: true });
    updateSyncStatus('synced');
    return true;
  } catch(e) {
    console.warn('[Sync] Push failed:', e.message);
    updateSyncStatus('error', e.message);
    return false;
  }
}

// ─── PULL (cloud → local) ─────────────────────────────────────────
async function pullFromCloud() {
  if (!syncEnabled || !db || !syncUserId) return false;
  try {
    const doc = await db.collection('tef_users').doc(syncUserId).get();
    if (doc.exists) {
      applyRemoteData(doc.data());
      updateSyncStatus('synced');
      return true;
    }
    return false;
  } catch(e) {
    console.warn('[Sync] Pull failed:', e.message);
    updateSyncStatus('error', e.message);
    return false;
  }
}

// ─── REAL-TIME LISTENER ───────────────────────────────────────────
// Listens for changes pushed from other devices and applies them live.
function startRealtimeSync() {
  if (!syncEnabled || !db || !syncUserId) return;
  if (syncUnsubscribe) syncUnsubscribe(); // clear old listener

  syncUnsubscribe = db.collection('tef_users').doc(syncUserId)
    .onSnapshot(doc => {
      if (doc.exists && doc.metadata.hasPendingWrites === false) {
        // Only apply changes that came from another device (not our own writes)
        const data = doc.data();
        if (data?.updated_at !== getLocalSyncData().updated_at) {
          applyRemoteData(data);
          updateSyncStatus('synced');
          // Refresh the dashboard stats silently
          if (typeof initDashboard === 'function') {
            try { loadState(); initDashboard(); } catch(e) {}
          }
        }
      }
    }, err => {
      console.warn('[Sync] Listener error:', err.message);
      updateSyncStatus('error', err.message);
    });

  console.log('[Sync] Real-time listener active for:', syncUserId);
}

// ─── STATUS INDICATOR ─────────────────────────────────────────────
function updateSyncStatus(status, detail = '') {
  const el = document.getElementById('sync-status-dot');
  const label = document.getElementById('sync-status-label');
  if (!el || !label) return;

  const states = {
    synced:    { color: '#3ecf8e', text: 'Synced',        dot: '●' },
    syncing:   { color: '#f5a623', text: 'Syncing...',    dot: '◌' },
    error:     { color: '#f06060', text: 'Sync error',    dot: '●' },
    offline:   { color: '#4B5563', text: 'Offline',       dot: '●' },
    disabled:  { color: '#4B5563', text: 'Sync off',      dot: '○' },
  };
  const s = states[status] || states.disabled;
  el.style.color = s.color;
  el.textContent = s.dot;
  label.textContent = detail ? `${s.text}: ${detail}` : s.text;
}

// ─── AUTO-PUSH ON STATE CHANGES ───────────────────────────────────
// Hook into the existing saveState() to auto-push after every save.
// We debounce to avoid hammering Firestore on rapid changes.
let pushDebounceTimer = null;
function schedulePush() {
  if (!syncEnabled || !syncUserId) return;
  clearTimeout(pushDebounceTimer);
  updateSyncStatus('syncing');
  pushDebounceTimer = setTimeout(() => pushToCloud(), 1500);
}

// ─── SYNC SETTINGS UI ─────────────────────────────────────────────
function renderSyncSettings() {
  const userId = getSyncUserId();
  const connected = syncEnabled && !!syncUserId;

  return `
    <div class="card" style="margin-bottom:20px;border-color:rgba(62,207,142,0.25);background:rgba(62,207,142,0.02)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <div class="card-title" style="font-size:18px">☁️ Cross-device sync</div>
        <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text2)">
          <span id="sync-status-dot" style="font-size:10px;color:${connected?'#3ecf8e':'#4B5563'}">●</span>
          <span id="sync-status-label">${connected ? 'Connected' : 'Not set up'}</span>
        </div>
      </div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:16px;line-height:1.6">
        Your progress syncs automatically across all your devices. 
        Use the same User ID on each device — laptop, phone, tablet.
      </div>

      <div style="margin-bottom:12px">
        <div style="font-size:12px;color:var(--text3);font-family:var(--font-mono);margin-bottom:6px">YOUR USER ID</div>
        <div style="display:flex;gap:8px">
          <input type="text" id="sync-id-input" value="${userId}" 
            style="flex:1;font-family:var(--font-mono);font-size:13px;letter-spacing:0.03em"
            placeholder="Your user ID appears here">
          <button class="btn btn-secondary btn-sm" onclick="copySyncId()" title="Copy to clipboard">📋 Copy</button>
        </div>
        <div style="font-size:12px;color:var(--text3);margin-top:6px">
          To sync a new device: open the site there, go to ⚡ Feedback → Sync, paste this ID and click Connect.
        </div>
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-green btn-sm" onclick="handleConnectSync()">
          ${connected ? '↺ Reconnect' : '⚡ Connect sync'}
        </button>
        ${connected ? `
        <button class="btn btn-secondary btn-sm" onclick="handleForcePush()">⬆ Push now</button>
        <button class="btn btn-secondary btn-sm" onclick="handleForcePull()">⬇ Pull from cloud</button>
        ` : ''}
        ${connected ? `<button class="btn btn-secondary btn-sm" onclick="handleDisconnectSync()" style="color:var(--red);border-color:rgba(240,96,96,0.3)">Disconnect</button>` : ''}
      </div>

      <div id="sync-message" style="display:none;margin-top:10px;padding:10px 14px;border-radius:8px;font-size:13px"></div>
    </div>
  `;
}

function showSyncMessage(text, type = 'info') {
  const el = document.getElementById('sync-message');
  if (!el) return;
  const styles = {
    success: 'background:rgba(62,207,142,0.1);border:1px solid rgba(62,207,142,0.2);color:#3ecf8e',
    error:   'background:rgba(240,96,96,0.1);border:1px solid rgba(240,96,96,0.2);color:#f06060',
    info:    'background:rgba(79,142,247,0.1);border:1px solid rgba(79,142,247,0.2);color:#6ba3ff',
  };
  el.style.cssText = styles[type] || styles.info;
  el.textContent = text;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

async function handleConnectSync() {
  const input = document.getElementById('sync-id-input')?.value?.trim();
  if (!input) { showSyncMessage('Enter your User ID first.', 'error'); return; }

  setSyncUserId(input);
  updateSyncStatus('syncing');

  // Pull any existing cloud data first
  const pulled = await pullFromCloud();
  if (pulled) {
    showSyncMessage('✅ Connected! Progress pulled from cloud. Reloading...', 'success');
    setTimeout(() => window.location.reload(), 1500);
  } else {
    // No cloud data yet — push local data up
    const pushed = await pushToCloud();
    if (pushed) {
      showSyncMessage('✅ Connected! Your progress has been saved to the cloud.', 'success');
      startRealtimeSync();
      // Re-render to show connected state
      setTimeout(() => { if (typeof renderFeedbackPage === 'function') renderFeedbackPage(); }, 1000);
    } else {
      showSyncMessage('Connection failed — check your internet connection.', 'error');
    }
  }
}

async function handleForcePush() {
  updateSyncStatus('syncing');
  const ok = await pushToCloud();
  showSyncMessage(ok ? '✅ Progress pushed to cloud.' : '❌ Push failed.', ok ? 'success' : 'error');
}

async function handleForcePull() {
  updateSyncStatus('syncing');
  const ok = await pullFromCloud();
  if (ok) {
    showSyncMessage('✅ Progress pulled. Reloading...', 'success');
    setTimeout(() => window.location.reload(), 1200);
  } else {
    showSyncMessage('❌ Pull failed or no cloud data found.', 'error');
  }
}

function handleDisconnectSync() {
  if (!confirm('Disconnect sync? Your local progress stays. You can reconnect anytime.')) return;
  if (syncUnsubscribe) syncUnsubscribe();
  syncUserId = null;
  syncEnabled = false;
  updateSyncStatus('disabled');
  if (typeof renderFeedbackPage === 'function') renderFeedbackPage();
}

function copySyncId() {
  const id = document.getElementById('sync-id-input')?.value;
  if (!id) return;
  navigator.clipboard.writeText(id).then(() => {
    showSyncMessage('User ID copied to clipboard! Paste it on your other device.', 'success');
  }).catch(() => {
    // Fallback for mobile
    document.getElementById('sync-id-input').select();
    document.execCommand('copy');
    showSyncMessage('User ID copied!', 'success');
  });
}

// ─── STARTUP ──────────────────────────────────────────────────────
function startupSync() {
  initSync();
  syncUserId = getSyncUserId();

  if (syncEnabled && syncUserId) {
    // Pull latest on page load, then start listening
    pullFromCloud().then(() => {
      startRealtimeSync();
    });
  }
}
