// HASHING HELPERS
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// SUPABASE CONFIGURATION (Fill these after creating Supabase project)
const SUPABASE_URL = "https://vlmwrkjfdvbwndffbhhm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbXdya2pmZHZid25kZmZiaGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MTg1NDEsImV4cCI6MjA4NzQ5NDU0MX0.i4oQGKRBA8hpk_A5OKd7qwHtlNT8zh7TYvIfZMyKXyE";
let supabase = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// SECURE CODES (Hashed SHA-256)
const VIEW_HASH = "d5202e6904b89534425e3e52d9173445bf493805ad2c40edddd1529d497cde18";
const ADMIN_HASH = "ea544d16cb34fa2d9a187c0784f0a58eda0cb147b34628611668efd869baf326";

async function handleLogin() {
  const code = document.getElementById('access-code').value.trim();
  const error = document.getElementById('login-error');
  if (!code) return;

  const hash = await sha256(code);

  if (hash === ADMIN_HASH) {
    enterApp('admin');
  } else if (hash === VIEW_HASH) {
    enterApp('view');
  } else {
    error.style.display = 'block';
    setTimeout(() => error.style.display = 'none', 3000);
  }
}

// Event listener for Enter key
document.getElementById('access-code').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});

function enterApp(mode) {
  const screen = document.getElementById('login-screen');
  const badge = document.getElementById('mode-badge');
  const app = document.getElementById('app');

  screen.style.opacity = '0';
  setTimeout(() => {
    screen.style.display = 'none';
    app.style.display = 'block';
    if (mode === 'admin') {
      document.body.classList.add('edit-mode');
      badge.textContent = 'ADMIN MODE';
      document.getElementById('edit-hint').style.display = 'block';
      document.getElementById('admin-toolbar').style.display = 'flex';
      makeEditable();
    }
  }, 500);
}

function makeEditable() {
  document.querySelectorAll('[data-editable]').forEach(el => {
    el.contentEditable = true;
  });
}

function logout() {
  location.reload();
}

function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  btn.classList.add('active');
}

function toggleProj(header) {
  const card = header.parentElement;
  card.classList.toggle('open');
}

function toggleCd(header) {
  const item = header.parentElement;
  item.classList.toggle('open');
}

// STRUCTURAL EDITING
function addItem(type, sectionId) {
  const template = document.getElementById('tpl-' + type);
  const container = document.getElementById(sectionId);

  // Find proper target container inside section
  let target = container.querySelector('.career-container, .edu-container, .activity-container, .proj-container, .cd-career-container');
  if (!target) {
    // Fallback: look for generic container or just the section
    target = container;
  }

  const clone = template.content.cloneNode(true);
  target.appendChild(clone);

  // Make new elements editable
  makeEditable();
  showToast("새 항목이 추가되었습니다.");
}

function removeItem(btn) {
  if (confirm("이 항목을 삭제하시겠습니까?")) {
    // Find the closest item container
    const item = btn.closest('.career-item, .edu-item, .activity-item, .proj-card, .cd-career-item');
    if (item) {
      item.classList.add('removing');
      setTimeout(() => {
        item.remove();
        showToast("항목이 삭제되었습니다.");
      }, 300);
    }
  }
}

// SAVING
async function saveEdits() {
  const appContent = document.getElementById('app').innerHTML;

  // 1. LocalStorage Logic (Fallback)
  localStorage.setItem('portfolio_content', appContent);

  // 2. Supabase Logic
  if (supabase) {
    const { data, error } = await supabase
      .from('portfolio_data')
      .upsert({ id: 1, html_content: appContent, updated_at: new Date() });

    if (error) {
      console.error("Supabase Save Error:", error);
      showToast("DB 저장 중 오류가 발생했습니다. (Local 저장됨)");
    } else {
      showToast("클라우드 DB에 동기화되었습니다!");
    }
  } else {
    showToast("변경 사항이 로컬에 저장되었습니다! (DB 미설정)");
  }
}

function discardEdits() {
  if (confirm("저장하지 않은 모든 변경사항이 사라집니다. 취소하시겠습니까?")) {
    location.reload();
  }
}

// SPOTLIGHT EFFECT
document.addEventListener('mousemove', e => {
  const spotlight = document.getElementById('spotlight');
  if (spotlight) {
    spotlight.style.setProperty('--x', e.clientX + 'px');
    spotlight.style.setProperty('--y', e.clientY + 'px');
  }
});

// REVEAL ON SCROLL
const observerOptions = {
  threshold: 0.15
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const counters = entry.target.querySelectorAll('.counter');
      counters.forEach(c => animateCounter(c));
    }
  });
}, observerOptions);

function initReveals() {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// COUNTER ANIMATION
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = "true";

  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  const duration = 2000;
  let start = 0;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = (ease * target).toFixed(target % 1 === 0 ? 0 : 1);
    el.textContent = current + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// PREMIUM TAB SWITCH
function switchTab(tabId, btn) {
  const panels = document.querySelectorAll('.tab-panel');
  const tabs = document.querySelectorAll('.nav-tab');

  panels.forEach(p => {
    p.classList.remove('active', 'tab-transitioning');
  });
  tabs.forEach(b => b.classList.remove('active'));

  const targetPanel = document.getElementById('tab-' + tabId);
  targetPanel.classList.add('active', 'tab-transitioning');
  btn.classList.add('active');

  // Scroll to top when switching tabs
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Re-init scroll reveals for the new tab
  initReveals();
}

// Load saved content and init
window.addEventListener('DOMContentLoaded', async () => {
  // Version management for LocalStorage
  if (localStorage.getItem('storage_version') !== '1.6') {
    localStorage.removeItem('portfolio_content');
    localStorage.setItem('storage_version', '1.6');
  }

  // 1. Try Supabase Load
  if (supabase) {
    const { data, error } = await supabase
      .from('portfolio_data')
      .select('html_content')
      .eq('id', 1)
      .single();

    if (data && data.html_content) {
      document.getElementById('app').innerHTML = data.html_content;
      localStorage.setItem('portfolio_content', data.html_content); // Sync local
      console.log("Loaded from Supabase");
    } else if (error) {
      console.warn("Supabase Load Error, using LocalStorage:", error);
      loadFromLocal();
    }
  } else {
    loadFromLocal();
  }

  function loadFromLocal() {
    const saved = localStorage.getItem('portfolio_content');
    if (saved) {
      document.getElementById('app').innerHTML = saved;
      console.log("Loaded from LocalStorage");
    }
  }

  initReveals();
});

function enterApp(mode) {
  const screen = document.getElementById('login-screen');
  const badge = document.getElementById('mode-badge');
  const app = document.getElementById('app');

  screen.style.opacity = '0';
  setTimeout(() => {
    screen.style.display = 'none';
    app.style.display = 'block';
    initReveals(); // Init animations on entry
    if (mode === 'admin') {
      document.body.classList.add('edit-mode');
      badge.textContent = 'ADMIN MODE';
      document.getElementById('edit-hint').style.display = 'block';
      document.getElementById('admin-toolbar').style.display = 'flex';
      makeEditable();
    }
  }, 500);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
