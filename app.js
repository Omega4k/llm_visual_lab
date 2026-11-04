/* LLM Visual Lab — Phase 0 spike
   Sections: status, tokenizer (teaching approximation), embeddings (three.js), live model. */

const OLLAMA = "http://localhost:11434";
const DEFAULT_MODEL = "llama3.2:1b";
let MODEL = DEFAULT_MODEL;
try {
  const savedModel = localStorage.getItem("llmLabModel");
  if (savedModel) MODEL = savedModel;
} catch (e) { /* keep default */ }

const banner = document.getElementById("errorBanner");
function showError(msg) {
  try {
    const msgs = dynDict(currentLang).messages || {};
    if (msgs[msg]) msg = msgs[msg];
  } catch (e) { /* language not ready yet; keep original */ }
  banner.textContent = msg;
  banner.hidden = false;
  clearTimeout(showError._t);
  showError._t = setTimeout(() => { banner.hidden = true; }, 6000);
}
window.addEventListener("error", (e) => showError("Something went wrong: " + e.message));

/* ---------- Knowledge level (beginner / medium / expert) ---------- */
const LEVEL_RANK = { beginner: 0, medium: 1, expert: 2 };
let currentLevel = "beginner";
function setLevel(level, flashNew) {
  const prevRank = LEVEL_RANK[currentLevel];
  const newRank = LEVEL_RANK[level];
  currentLevel = level;
  document.body.classList.remove("level-beginner", "level-medium", "level-expert");
  document.body.classList.add("level-" + level);
  document.querySelectorAll(".level-btn").forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.setLevel === level));
  try { localStorage.setItem("llmLabLevel", level); } catch (e) { /* private mode */ }
  // Pilot (lessons 1 & 5): briefly highlight blocks this switch just revealed,
  // so levelling up means reading only the new text, not the lesson again.
  if (flashNew && sndReady && newRank !== prevRank) {
    if (newRank > prevRank) sndLevelUp(); else sndLevelDown();
  }
  if (flashNew && newRank > prevRank) {
    document.querySelectorAll(".lvl-add").forEach((el) => {
      const rank = el.classList.contains("lvl-add-e") ? 2 : 1;
      if (rank > prevRank && rank <= newRank) {
        el.classList.remove("lvl-new");
        void el.offsetWidth; // restart the animation if already highlighted
        el.classList.add("lvl-new");
        setTimeout(() => el.classList.remove("lvl-new"), 2600);
      }
    });
  }
}
document.querySelectorAll(".level-btn").forEach((btn) =>
  btn.addEventListener("click", () => setLevel(btn.dataset.setLevel, true)));
try {
  const saved = localStorage.getItem("llmLabLevel");
  if (saved && ["beginner", "medium", "expert"].includes(saved)) setLevel(saved);
} catch (e) { /* keep default */ }

/* ---------- One lesson at a time, picked from the left sidebar ---------- */
const VIEW_IDS = ["intro", "tokens", "embeddings", "training", "attention", "probabilities",
  "journey", "parsing", "toymodel", "context", "limits", "playground", "scaling",
  "assistant", "rag", "capstone"];
const sidebar = document.getElementById("sidebar");
const sidebarScrim = document.getElementById("sidebarScrim");
const menuBtn = document.getElementById("menuBtn");
function setSidebar(open) {
  sidebar.classList.toggle("open", open);
  sidebarScrim.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
}
menuBtn.addEventListener("click", () =>
  setSidebar(!sidebar.classList.contains("open")));
sidebarScrim.addEventListener("click", () => setSidebar(false));
let sndReady = false;
let currentViewId = null;
function showLesson(id) {
  if (id === "showcase") id = "playground"; // merged into lesson 11
  if (!VIEW_IDS.includes(id)) id = "intro";
  if (sndReady && currentViewId && currentViewId !== id) sndNav(id);
  currentViewId = id;
  document.querySelectorAll("main > section.panel").forEach((sec) =>
    sec.classList.toggle("active-view", sec.id === id));
  document.querySelectorAll(".lesson-nav a").forEach((a) => {
    const on = a.getAttribute("href") === "#" + id;
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  setSidebar(false);
  window.scrollTo(0, 0);
  // Canvases were created while their lesson was hidden (zero size); the
  // scenes all listen for window resize, so re-fire it now that the lesson
  // is laid out (plus once shortly after, for anything still settling).
  // Not tied to requestAnimationFrame: hidden/background pages may not tick.
  window.dispatchEvent(new Event("resize"));
  setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
}
document.querySelectorAll(".lesson-nav a").forEach((a) =>
  a.addEventListener("click", () => showLesson(a.getAttribute("href").slice(1))));
window.addEventListener("hashchange", () => showLesson(location.hash.slice(1)));
showLesson(location.hash.slice(1) || "intro");

/* ---------- Colour theme ---------- */
const THEME_3D = {
  amber:   { bg: 0x0d1117, input: 0x5da9c4, hidden: 0x7fb069, hidden2: 0x9bc49b, output: 0xc98bb9, accent: 0xe0a458, star: 0x8fa3bf, embedGroups: [0x7fb069, 0x5da9c4, 0xe0a458, 0xd96a5f] },
  ice:     { bg: 0x081019, input: 0x67c6dd, hidden: 0x7fd4c1, hidden2: 0xa5dee8, output: 0x9db8e8, accent: 0x67c6dd, star: 0xa9cbe0, embedGroups: [0x7fd4c1, 0x67c6dd, 0x9db8e8, 0x6ea8d8] },
  emerald: { bg: 0x0a120a, input: 0x79c98a, hidden: 0xa4d97f, hidden2: 0xc4e3a5, output: 0x8ad8c9, accent: 0x79c98a, star: 0xb9d9a9, embedGroups: [0xa4d97f, 0x79c98a, 0x8ad8c9, 0x6fbf73] },
  rose:    { bg: 0x130a0d, input: 0xe79a86, hidden: 0xe8b49d, hidden2: 0xf0cbb8, output: 0xd98aa5, accent: 0xe79a86, star: 0xe0bdb2, embedGroups: [0xe8b49d, 0xe79a86, 0xd98aa5, 0xc9758a] },
};
let theme3D = THEME_3D.amber;
const themeRecolorers = [];
const themeSelect = document.getElementById("themeSelect");
function setTheme(theme) {
  document.body.classList.remove("theme-amber", "theme-ice", "theme-emerald", "theme-rose");
  document.body.classList.add("theme-" + theme);
  themeSelect.value = theme;
  theme3D = THEME_3D[theme] || THEME_3D.amber;
  for (const fn of themeRecolorers) fn(theme3D);
  try { localStorage.setItem("llmLabTheme", theme); } catch (e) { /* private mode */ }
}
themeSelect.addEventListener("change", () => setTheme(themeSelect.value));
try {
  const savedTheme = localStorage.getItem("llmLabTheme");
  if (savedTheme && ["amber", "ice", "emerald", "rose"].includes(savedTheme)) setTheme(savedTheme);
} catch (e) { /* keep default */ }

/* ---------- Icons (inline SVG, decorative) ---------- */
const ICON_PATHS = {
  play: '<polygon points="8 5 19 12 8 19" fill="currentColor" stroke="none"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" stroke="none"/>',
  reset: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  down: '<line x1="12" y1="4" x2="12" y2="19"/><polyline points="5 12 12 19 19 12"/>',
  next: '<line x1="4" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
  muted: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>',
};
const NAV_ICONS = {
  intro: '<path d="M12 3l1.9 5.3L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.7z"/>',
  tokens: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
  embeddings: '<circle cx="6" cy="6" r="2.2"/><circle cx="18" cy="7" r="2.2"/><circle cx="9" cy="18" r="2.2"/><circle cx="19" cy="17" r="2.2"/><path d="M8 7l7.5-.3M7 8l1.2 7.5M17 9.2l1.2 5.3M11 17l5.5.2"/>',
  training: '<polyline points="3 4 3 20 21 20"/><polyline points="6.5 7 10.5 11.5 14 9.5 18.5 15.5"/><polyline points="18.5 11 18.5 15.5 14 15.5"/>',
  attention: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5" fill="currentColor"/>',
  probabilities: '<line x1="4" y1="20" x2="20" y2="20"/><line x1="7" y1="20" x2="7" y2="12"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="17" y1="20" x2="17" y2="15"/>',
  journey: '<polygon points="12 2.5 21 7 12 11.5 3 7"/><polyline points="3.5 12 12 16.5 20.5 12"/><polyline points="3.5 17 12 21.5 20.5 17"/>',
  parsing: '<circle cx="6" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="12" r="2.2"/><path d="M8 6l7.5 4.5M8 18l7.5-4.5M6 7.5v9"/>',
  toymodel: '<path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z"/><path d="M12 12l8-4.6M12 12v9.2M12 12L4 7.4"/>',
  context: '<circle cx="12" cy="12" r="8.5"/><polyline points="12 7.5 12 12 15.5 14"/>',
  limits: '<path d="M12 3.5L22 20H2z"/><line x1="12" y1="10" x2="12" y2="14.5"/><line x1="12" y1="17.2" x2="12.01" y2="17.2"/>',
  playground: '<circle cx="12" cy="12" r="9"/><polygon points="10 8 16.5 12 10 16" fill="currentColor" stroke="none"/>',
  scaling: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>',
  assistant: '<path d="M21 11.5a8.5 7.5 0 0 1-8.5 7.5c-1.2 0-2.4-.2-3.4-.7L3 20l1.8-3.9A7.4 7.4 0 0 1 3.5 11.5 8.5 7.5 0 0 1 12 4a8.5 7.5 0 0 1 9 7.5z"/>',
  rag: '<circle cx="10.5" cy="10.5" r="6.5"/><line x1="20.5" y1="20.5" x2="15.3" y2="15.3"/><path d="M7.5 10.5h6M10.5 7.5v6"/>',
  capstone: '<path d="M5 21.5v-17"/><path d="M5 4.5h12.5l-2.8 4 2.8 4H5"/>',
};
function iconSvg(paths, cls) {
  return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    paths + "</svg>";
}
function addIcon(el, name) {
  if (!el || el.querySelector(".btn-icon")) return;
  const span = document.createElement("span");
  span.className = "btn-icon";
  span.innerHTML = iconSvg(ICON_PATHS[name] || "", "icon-svg");
  el.prepend(span);
}
document.querySelectorAll(".lesson-nav a").forEach((a) => {
  const id = a.getAttribute("href").slice(1);
  if (a.querySelector(".nav-check")) return;
  const paths = (NAV_ICONS[id] || NAV_ICONS.intro).replaceAll("currentColor", "#000");
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
    'stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    paths + "</svg>";
  a.style.setProperty("--nav-icon", 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
  if (id === "intro" && a.firstChild) {
    a.firstChild.textContent = a.firstChild.textContent.replace("✦ ", "");
  }
  const check = document.createElement("span");
  check.className = "nav-check";
  check.textContent = "✓";
  check.hidden = true;
  a.append(check);
});
const BUTTON_ICONS = {
  menuBtn: "list", recheckBtn: "refresh", quizOpenBtn: "list",
  generateBtn: "play", stopBtn: "stop", trainBtn: "play",
  toyTrainBtn: "play", journeyPlayBtn: "play", lossStepBtn: "down",
  stepBtn: "next", realTokBtn: "search", parseCustomBtn: "search",
  ctxAddBtn: "plus", ragSearchBtn: "search", ragBuildBtn: "layers",
  capRunBtn: "play", capParseBtn: "next", capExpertBtn: "next",
};
for (const [id, name] of Object.entries(BUTTON_ICONS)) {
  addIcon(document.getElementById(id), name);
}
document.querySelectorAll('button[id$="ResetBtn"]').forEach((b) => addIcon(b, "reset"));

/* ---------- Sound (off by default, WebAudio) ---------- */
let audioCtx = null;
let soundOn = false;
const soundBtn = document.getElementById("soundBtn");
function renderSoundBtn() {
  let label = "Sound: " + (soundOn ? "on" : "off");
  try {
    const lang = localStorage.getItem("llmLabLang") || "en";
    const dyn = lang === "es" ? window.I18N_DYN_ES : lang === "fr" ? window.I18N_DYN_FR : null;
    if (dyn && dyn.ui) label = soundOn ? (dyn.ui.sound_on || label) : (dyn.ui.sound_off || label);
    if (typeof currentLang === "string" && dynDict(currentLang).ui) {
      const ui = dynDict(currentLang).ui;
      label = soundOn ? (ui.sound_on || label) : (ui.sound_off || label);
    }
  } catch (e) { /* keep English label */ }
  soundBtn.innerHTML = iconSvg(soundOn ? ICON_PATHS.volume : ICON_PATHS.muted, "icon-svg btn-icon-svg") +
    "<span>" + label + "</span>";
  soundBtn.setAttribute("aria-pressed", String(soundOn));
}
soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  if (soundOn) {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  }
  renderSoundBtn();
  if (soundOn) sndSuccess();
});
function tone(freq, opts) {
  if (!soundOn || !audioCtx) return;
  const o = opts || {};
  const dur = o.dur || 0.08;
  const t0 = audioCtx.currentTime + (o.delay || 0);
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = o.type || "sine";
  osc.frequency.setValueAtTime(freq, t0);
  if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(30, o.slideTo), t0 + dur);
  gain.gain.setValueAtTime(o.vol || 0.07, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + dur);
}
function blip(freq, dur, delay) { tone(freq, { dur: dur || 0.08, delay: delay || 0 }); }
const SCALE_NOTES = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
function sndToken(step) { tone(480 + Math.min(600, step * 14), { dur: 0.05, vol: 0.05 }); }
function sndDone() { blip(660, 0.08); blip(880, 0.1, 0.09); }
function sndClick() { tone(520, { dur: 0.035, type: "triangle", vol: 0.04 }); }
function sndNav(id) {
  const i = Math.max(0, VIEW_IDS.indexOf(id));
  const f = SCALE_NOTES[i % SCALE_NOTES.length] * (i >= SCALE_NOTES.length ? 1.5 : 1);
  tone(f, { dur: 0.06, type: "triangle", vol: 0.05 });
  tone(f * 1.335, { dur: 0.07, delay: 0.055, type: "triangle", vol: 0.04 });
}
function sndSuccess() { tone(660, { dur: 0.07, vol: 0.06 }); tone(990, { dur: 0.1, delay: 0.07, vol: 0.06 }); }
function sndCorrect() { tone(739.99, { dur: 0.06, vol: 0.06 }); tone(1174.66, { dur: 0.11, delay: 0.06, vol: 0.06 }); }
function sndWrong() { tone(196, { dur: 0.16, type: "square", vol: 0.035, slideTo: 123 }); }
function sndComplete() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
    tone(f, { dur: 0.11, delay: i * 0.075, type: "triangle", vol: 0.06 }));
}
function sndFanfare() {
  sndComplete();
  [1046.5, 1318.5, 1567.98].forEach((f, i) =>
    tone(f, { dur: 0.14, delay: 0.32 + i * 0.09, type: "triangle", vol: 0.06 }));
}
function sndLevelUp() { [440, 587.33, 880].forEach((f, i) => tone(f, { dur: 0.08, delay: i * 0.06, vol: 0.05 })); }
function sndLevelDown() { tone(440, { dur: 0.07, vol: 0.05 }); tone(329.63, { dur: 0.09, delay: 0.06, vol: 0.05 }); }
function sndStepSound(step) {
  tone(SCALE_NOTES[Math.abs(step) % SCALE_NOTES.length], { dur: 0.06, type: "triangle", vol: 0.055 });
}
function sndDescent(loss) {
  tone(170 + Math.min(4, Math.max(0, loss)) * 85, { dur: 0.055, vol: 0.045 });
}
function sndGenerateStart() { tone(280, { dur: 0.16, vol: 0.05, slideTo: 660 }); }
function sndGenerateStop() { tone(520, { dur: 0.13, vol: 0.05, slideTo: 240 }); }
renderSoundBtn();
sndReady = true;

/* ---------- Language (en / es / fr) ---------- */
let currentLang = "en";
try {
  const savedLang = localStorage.getItem("llmLabLang");
  if (["en", "es", "fr"].includes(savedLang)) currentLang = savedLang;
} catch (e) { /* keep English */ }
function staticDict(lang) {
  return lang === "es" ? (window.I18N_ES || {}) : lang === "fr" ? (window.I18N_FR || {}) : {};
}
function dynDict(lang) {
  return lang === "es" ? (window.I18N_DYN_ES || {}) : lang === "fr" ? (window.I18N_DYN_FR || {}) : {};
}
function i18nT(key, vars) {
  const ui = (dynDict(currentLang).ui || {});
  let s = ui[key];
  if (typeof s !== "string") return null;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll("{" + k + "}", String(v));
  return s;
}
function lessonTitle(id) {
  const titles = dynDict(currentLang).lesson_titles || {};
  return titles[id] || (typeof LESSON_TITLES !== "undefined" ? LESSON_TITLES[id] : id);
}
/* Capture translatable static elements, keyed <scope>.<n> in DOM order.
   Mirrors the extraction used to build the translation dictionaries. */
const I18N_ORIGINALS = [];
(function captureI18n() {
  const INLINE = new Set(["STRONG", "EM", "SPAN", "SUP", "SUB", "BR", "CODE", "A", "B", "I"]);
  const TAGS = new Set(["H2", "H3", "H4", "P", "LI", "BUTTON", "OPTION", "TH", "TD", "A", "DIV", "SPAN"]);
  const DYNAMIC_IDS = new Set(["sharpNote", "scaleNote", "ragAnswer", "capTally", "trapTally", "progressLabel", "statusText", "lossMath"]);
  const scopes = [];
  const header = document.querySelector("header.topbar");
  if (header) scopes.push(["chrome", header]);
  const sidebarEl = document.getElementById("sidebar");
  if (sidebarEl) scopes.push(["sidebar", sidebarEl]);
  document.querySelectorAll("main > section.panel").forEach((sec) => scopes.push([sec.id, sec]));
  const footer = document.querySelector("footer");
  if (footer) scopes.push(["footer", footer]);
  const quizDrawerEl = document.getElementById("quizDrawer");
  if (quizDrawerEl) scopes.push(["quiz", quizDrawerEl]);
  function hasDescId(el) { return !!el.querySelector("[id]"); }
  function hasBadChild(el) {
    for (const d of el.querySelectorAll("*")) { if (d.closest("svg")) continue; if (!INLINE.has(d.tagName)) return true; }
    return false;
  }
  for (const [scope, root] of scopes) {
    const cands = [];
    root.querySelectorAll("*").forEach((el) => {
      if (!TAGS.has(el.tagName)) return;
      if (el.tagName === "DIV" && !el.classList.contains("math-box")) return;
      if (el.classList.contains("cap-state")) return;
      if (el.id === "quizList" || el.id === "errorBanner") return;
      if (DYNAMIC_IDS.has(el.id)) return;
      if (el.parentElement && el.parentElement.closest(".cap-step") && el.parentElement.classList.contains("cap-step")) return;
      if (el.closest(".cap-step > div")) return;
      if (hasDescId(el)) return;
      if (hasBadChild(el)) return;
      const txt = el.innerHTML.trim();
      if (!txt || !/[A-Za-z]/.test(txt)) return;
      cands.push(el);
    });
    const outermost = cands.filter((el) => !cands.some((o) => o !== el && o.contains(el)));
    outermost.forEach((el, n) => {
      const key = scope + "." + n;
      el.dataset.i18nKey = key;
      I18N_ORIGINALS.push({ el, key, html: el.innerHTML });
    });
  }
})();
const DYN_BTN_TARGETS = [
  ['.cap-pred[data-cap-pred="fall"]', "cap_fall"],
  ['.cap-pred[data-cap-pred="survive"]', "cap_survive"],
  ["#capParseBtn", "cap_parse_btn"],
  ["#capRunBtn", "cap_run_btn"],
  ["#capExpertBtn", "cap_expert_btn"],
];
const DYN_BTN_ORIGINALS = new Map();
DYN_BTN_TARGETS.forEach(([sel]) => {
  const btn = document.querySelector(sel);
  if (btn) DYN_BTN_ORIGINALS.set(sel, btn.textContent.trim());
});
function setButtonText(btn, text) {
  for (const node of btn.childNodes) {
    if (node.nodeType === 3 && node.textContent.trim()) { node.textContent = text; return; }
  }
  btn.appendChild(document.createTextNode(text));
}
const I18N_INPUT_ORIGINALS = {};
for (const id of ["tokenInput", "ctxInput", "promptInput"]) {
  const input = document.getElementById(id);
  if (input) I18N_INPUT_ORIGINALS[id] = input.value;
}
const I18N_PARSE_PLACEHOLDER_ORIGINAL =
  (document.getElementById("parseInput") || {}).placeholder || "";
const I18N_TITLE_ORIGINAL = document.title;
const CAP_STEP_ORIGINALS = {};
document.querySelectorAll("[data-cap]").forEach((row) => {
  const div = row.querySelector(":scope > div");
  if (!div) return;
  const clone = div.cloneNode(true);
  const actions = clone.querySelector(".cap-actions");
  if (actions) actions.remove();
  CAP_STEP_ORIGINALS[row.dataset.cap] = clone.innerHTML.trim();
});
function applyStaticLang(lang) {
  const dict = staticDict(lang);
  for (const { el, key, html } of I18N_ORIGINALS) {
    const preserved = [...el.querySelectorAll(".btn-icon, .nav-check")];
    const translated = lang === "en" ? html : dict[key];
    if (typeof translated === "string") el.innerHTML = translated;
    else if (lang === "en") el.innerHTML = html;
    for (const node of preserved) {
      if (node.classList.contains("btn-icon")) el.prepend(node);
      else el.appendChild(node);
    }
  }
  // Capstone step texts (excluded from static capture; they contain buttons).
  document.querySelectorAll("[data-cap]").forEach((row) => {
    const div = row.querySelector(":scope > div");
    if (!div) return;
    const html = lang === "en" ? CAP_STEP_ORIGINALS[row.dataset.cap] : (dynDict(lang).cap_steps || {})[row.dataset.cap];
    if (!html) return;
    const actions = div.querySelector(".cap-actions");
    div.innerHTML = html;
    if (actions) div.appendChild(actions);
  });
  DYN_BTN_TARGETS.forEach(([sel, uiKey]) => {
    const btn = document.querySelector(sel);
    if (!btn) return;
    const ui = dynDict(lang).ui || {};
    const text = lang === "en" ? DYN_BTN_ORIGINALS.get(sel) : ui[uiKey];
    if (text) setButtonText(btn, text);
  });
  document.documentElement.lang = lang;
  const dyn = dynDict(lang);
  document.title = lang === "en" ? I18N_TITLE_ORIGINAL : (dyn.title || I18N_TITLE_ORIGINAL);
  const langLabel = document.getElementById("langLabel");
  if (langLabel) langLabel.textContent = lang === "en" ? "Language" : ((dyn.ui || {}).language_label || "Language");
  // Sample texts in inputs (only while the learner has not edited them).
  const defaults = lang === "en" ? I18N_INPUT_ORIGINALS : (dyn.input_defaults || {});
  for (const id of ["tokenInput", "ctxInput", "promptInput"]) {
    const input = document.getElementById(id);
    if (input && !input.dataset.userEdited && defaults[id]) { input.value = defaults[id]; input.dispatchEvent(new Event("input", { bubbles: true })); delete input.dataset.userEdited; }
  }
  const parseInput = document.getElementById("parseInput");
  if (parseInput) parseInput.placeholder = lang === "en" ? I18N_PARSE_PLACEHOLDER_ORIGINAL : (defaults.parsePlaceholder || I18N_PARSE_PLACEHOLDER_ORIGINAL);
}
["tokenInput", "ctxInput", "promptInput"].forEach((id) => {
  const input = document.getElementById(id);
  if (input) input.addEventListener("input", () => { input.dataset.userEdited = "1"; });
});
function relocalizeDynamic() {
  if (typeof renderProgress === "function") renderProgress();
  if (typeof renderTrapScore === "function") renderTrapScore();
  if (typeof renderCapstone === "function") renderCapstone();
  if (typeof renderSoundBtn === "function") renderSoundBtn();
  if (typeof relocalizeQuiz === "function") relocalizeQuiz();
  if (typeof setScaleMetric === "function" && typeof currentScaleKey === "string") setScaleMetric(currentScaleKey);
  if (typeof renderPipe === "function" && typeof currentPipeIdx === "number") renderPipe(currentPipeIdx);
  if (typeof renderAssistantScenario === "function") renderAssistantScenario();
  try {
    if (typeof parseData !== "undefined" && typeof PARSE_PRESETS !== "undefined") {
      const presetIdx = PARSE_PRESETS.findIndex((p) => p.words === parseData.words);
      if (presetIdx >= 0) parseData = getParsePreset(presetIdx);
    }
  } catch (e) { /* custom parse keeps its text */ }
  if (typeof renderParse === "function") renderParse();
}
const langSelect = document.getElementById("langSelect");
function setLang(lang, save) {
  if (!["en", "es", "fr"].includes(lang)) lang = "en";
  currentLang = lang;
  if (langSelect) langSelect.value = lang;
  if (save) { try { localStorage.setItem("llmLabLang", lang); } catch (e) { /* private mode */ } }
  applyStaticLang(lang);
  relocalizeDynamic();
}
if (langSelect) langSelect.addEventListener("change", () => setLang(langSelect.value, true));
if (currentLang !== "en") applyStaticLang(currentLang);

document.addEventListener("click", (e) => {
  if (e.target.closest("button") && e.target.id !== "soundBtn") sndClick();
});

/* ---------- Corner telemetry labels ---------- */
const TELEMETRY = {
  tokens: "SYS · TOK-01 · OK", embeddings: "VEC · EMB-02 · OK",
  training: "TRN · GDES-03 · OK", attention: "ATT · HEAD-04 · OK",
  probabilities: "PRB · SAMP-05 · OK", journey: "TRF · LYR-06 · OK",
  parsing: "PRS · PARSE-07 · OK",
  toymodel: "TOY · REAL-08 · OK", context: "CTX · MEM-09 · OK",
  limits: "LIM · HALL-10 · WARN", playground: "LIVE · LLM-11 · OK",
  scaling: "SCL · SCALE-12 · OK",
  assistant: "AST · ALIGN-13 · OK", rag: "RAG · RETR-14 · OK", capstone: "CAP · FINAL-15 · OK",
};
for (const [id, text] of Object.entries(TELEMETRY)) {
  const section = document.getElementById(id);
  if (!section) continue;
  const span = document.createElement("span");
  span.className = "telemetry";
  span.textContent = text;
  section.appendChild(span);
}

/* ---------- Token particle stream (live lesson) ---------- */
const particleCanvas = document.getElementById("particleCanvas");
const pctx = particleCanvas.getContext("2d");
const particles = [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function spawnParticles(n) {
  if (reduceMotion) return;
  for (let i = 0; i < Math.min(10, 2 + n); i++) {
    particles.push({
      x: 8, y: 20 + Math.random() * 70,
      vx: 1.6 + Math.random() * 2.2, life: 1,
      hue: Math.random() < 0.3 ? "#5da9c4" : "#e0a458",
    });
  }
}
function drawParticles() {
  requestAnimationFrame(drawParticles);
  if (!particleCanvas.clientWidth) return; // lesson hidden — do no canvas work
  const W = particleCanvas.width, H = particleCanvas.height;
  pctx.clearRect(0, 0, W, H);
  pctx.strokeStyle = "#313a46";
  pctx.setLineDash([4, 5]);
  for (const gx of [0.28, 0.52, 0.76]) {
    pctx.beginPath();
    pctx.moveTo(W * gx, 8);
    pctx.lineTo(W * gx, H - 8);
    pctx.stroke();
  }
  pctx.setLineDash([]);
  pctx.fillStyle = "#6d7885";
  pctx.font = "10px Consolas, monospace";
  pctx.fillText("PROMPT", 10, 14);
  pctx.fillText("LAYERS", W * 0.40, 14);
  pctx.fillText("ANSWER", W * 0.82, 14);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.life -= 0.0022;
    if (p.x > W - 6 || p.life <= 0) { particles.splice(i, 1); continue; }
    pctx.strokeStyle = p.hue;
    pctx.globalAlpha = Math.max(0, p.life) * 0.55;
    pctx.lineWidth = 2;
    pctx.beginPath();
    pctx.moveTo(Math.max(6, p.x - 18), p.y);
    pctx.lineTo(p.x, p.y);
    pctx.stroke();
    pctx.beginPath();
    pctx.arc(p.x, p.y, 3.6, 0, Math.PI * 2);
    pctx.fillStyle = p.hue;
    pctx.globalAlpha = Math.max(0, p.life);
    pctx.fill();
    pctx.globalAlpha = 1;
  }
}
drawParticles();

/* ---------- Lesson 1: tokens (teaching approximation) ---------- */
const PALETTE = ["#e0a458", "#7fb069", "#5da9c4", "#d96a5f", "#b8b26a", "#c98bb9", "#8a9a5b", "#d4a373"];
const tokenInput = document.getElementById("tokenInput");
const tokenRow = document.getElementById("tokenRow");

function splitTokens(text) {
  // Approximate BPE intuition: whole common short words stay intact,
  // longer words split into ~4-char pieces, punctuation separates.
  const pieces = text.match(/[A-Za-z]+|[0-9]+|[^\sA-Za-z0-9]|\s+/g) || [];
  const out = [];
  for (const p of pieces) {
    if (/^[A-Za-z]{9,}$/.test(p)) {
      for (let i = 0; i < p.length; i += 4) out.push(p.slice(i, i + 4));
    } else {
      out.push(p);
    }
  }
  return out;
}

/* Tokens with their character offsets, so chips can be linked to the
   exact characters they cover in the sentence. Same rules as splitTokens. */
function splitTokensWithOffsets(text) {
  const pieces = text.matchAll(/[A-Za-z]+|[0-9]+|[^\sA-Za-z0-9]|\s+/g);
  const out = [];
  for (const m of pieces) {
    const p = m[0];
    if (/^[A-Za-z]{9,}$/.test(p)) {
      for (let i = 0; i < p.length; i += 4) {
        out.push({ tok: p.slice(i, i + 4), start: m.index + i, end: m.index + i + 4 });
      }
    } else {
      out.push({ tok: p, start: m.index, end: m.index + p.length });
    }
  }
  return out;
}

function renderTokens() {
  const text = tokenInput.value;
  const tokens = splitTokensWithOffsets(text);
  const echo = document.getElementById("tokenEcho");
  tokenRow.innerHTML = "";
  echo.innerHTML = "";
  const link = (idx, on) => {
    tokenRow.querySelectorAll(".token").forEach((el) =>
      el.classList.toggle("linked", on && Number(el.dataset.idx) === idx));
    echo.querySelectorAll(".echo-tok").forEach((el) =>
      el.classList.toggle("linked", on && Number(el.dataset.idx) === idx));
  };
  tokens.forEach(({ tok, start, end }, i) => {
    const es = document.createElement("span");
    es.className = "echo-tok";
    es.dataset.idx = i;
    es.textContent = text.slice(start, end);
    if (!/^\s+$/.test(tok)) es.style.background = PALETTE[i % PALETTE.length];
    es.addEventListener("pointerenter", () => link(i, true));
    es.addEventListener("pointerleave", () => link(i, false));
    echo.appendChild(es);
    if (/^\s+$/.test(tok)) return;
    const span = document.createElement("span");
    span.className = "token";
    span.dataset.idx = i;
    span.style.background = PALETTE[i % PALETTE.length];
    span.textContent = tok.replace(/ /g, "␣");
    span.title = "token " + (i + 1) + " — characters " + (start + 1) + "–" + end;
    span.addEventListener("pointerenter", () => link(i, true));
    span.addEventListener("pointerleave", () => link(i, false));
    tokenRow.appendChild(span);
  });
  const visible = tokens.filter((t) => !/^\s+$/.test(t.tok)).length;
  document.getElementById("tokenCount").textContent = visible;
  document.getElementById("charCount").textContent = text.length;
  document.getElementById("ratio").textContent =
    visible ? (text.length / visible).toFixed(1) : "0";
}
tokenInput.addEventListener("input", renderTokens);
document.querySelectorAll(".preset-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    tokenInput.value = btn.dataset.text;
    renderTokens();
  }));
renderTokens();

/* ---------- Model status ---------- */
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const offlineHelp = document.getElementById("offlineHelp");
let modelOnline = false;

async function checkModel() {
  statusDot.className = "dot dot-unknown";
  statusText.textContent = "Checking local model…";
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(OLLAMA + "/api/tags", { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const names = (data.models || []).map((m) => m.name);
    modelOnline = true;
    statusDot.className = "dot dot-on";
    const sel = document.getElementById("modelSelect");
    if (names.length) {
      if (!names.includes(MODEL)) {
        MODEL = names.includes(DEFAULT_MODEL) ? DEFAULT_MODEL : names[0];
      }
      sel.innerHTML = "";
      for (const n of names) {
        const opt = document.createElement("option");
        opt.value = n;
        opt.textContent = n;
        sel.appendChild(opt);
      }
      sel.value = MODEL;
      sel.disabled = false;
    } else {
      sel.disabled = true;
    }
    statusText.textContent = names.length
      ? "Local model online — using " + MODEL + (names.length > 1 ? " (" + names.length + " available)" : "")
      : "Ollama online — no models pulled yet";
    const introStatus = document.getElementById("introModelStatus");
    if (introStatus) introStatus.textContent = names.length
      ? "online — " + MODEL + " is ready for Lessons 11 and 15."
      : "Ollama is running but no model is pulled yet (Lesson 11 explains how).";
    offlineHelp.hidden = names.length > 0;
    if (!names.length) statusText.textContent += " (run: ollama pull " + DEFAULT_MODEL + ")";
  } catch (err) {
    modelOnline = false;
    statusDot.className = "dot dot-off";
    statusText.textContent = "Local model offline";
    const introStatus2 = document.getElementById("introModelStatus");
    if (introStatus2) introStatus2.textContent =
      "offline — fine for now; only Lessons 11 and 15 need it.";
    offlineHelp.hidden = false;
  }
}
document.getElementById("recheckBtn").addEventListener("click", checkModel);
document.getElementById("modelSelect").addEventListener("change", (e) => {
  MODEL = e.target.value;
  try { localStorage.setItem("llmLabModel", MODEL); } catch (err) { /* private mode */ }
  statusText.textContent = "Local model online — using " + MODEL;
  fetchModelCard();
  showError("Model switched to " + MODEL + ". Lesson 11, the traps and the capstone now use it. (Lessons 3 and 12's printed numbers describe llama3.2:1b.)");
});
checkModel();

/* ---------- Lesson 3: live generation (streaming) ---------- */
const output = document.getElementById("output");
const generateBtn = document.getElementById("generateBtn");
const stopBtn = document.getElementById("stopBtn");
const tempRange = document.getElementById("tempRange");
const tempVal = document.getElementById("tempVal");
let currentAbort = null;

tempRange.addEventListener("input", () => { tempVal.textContent = tempRange.value; });

/* Real per-token candidates (Ollama logprobs), model facts, debug data */
let liveTokens = [];
let selectedLive = -1;
let candidateUpdate3D = null;
const fmtPct = (p) => p >= 0.1 ? (p * 100).toFixed(1) + "%" : p >= 0.001 ? (p * 100).toFixed(2) + "%" : (p * 100).toFixed(3) + "%";
let modelContextLength = 131072; // real value filled in from /api/show below

/* Same text can appear as several token ids — keep only its best entry. */
function dedupCandidates(top) {
  const byToken = new Map();
  for (const t of top || []) {
    const p = Math.exp(t.logprob);
    if (!byToken.has(t.token) || byToken.get(t.token).p < p) {
      byToken.set(t.token, { token: t.token, p });
    }
  }
  return [...byToken.values()].sort((a, b) => b.p - a.p);
}

function selectLiveToken(idx) {
  if (idx < 0 || idx >= liveTokens.length) return;
  selectedLive = idx;
  document.querySelectorAll(".live-token").forEach((el, i) =>
    el.classList.toggle("selected", i === idx));
  const entry = liveTokens[idx];
  const bars = document.getElementById("candidateBars");
  const info = document.getElementById("candidateInfo");
  bars.innerHTML = "";
  if (!entry.top.length) {
    bars.innerHTML = "<p class='hint'>No logprobs returned for this token (older Ollama?).</p>";
    info.textContent = "";
    if (candidateUpdate3D) candidateUpdate3D([]);
    return;
  }
  const cands = dedupCandidates(entry.top);
  let shown = 0;
  for (const c of cands) {
    shown += c.p;
    const row = document.createElement("div");
    row.className = "cand-bar" + (c.token === entry.token ? " chosen" : "");
    row.innerHTML = "<span class='cand-name'></span>" +
      "<span class='bar-track'><span class='bar-fill'></span></span><span></span>";
    row.children[0].textContent = c.token.replace(/ /g, "␣").replace(/\n/g, "⏎");
    row.children[1].children[0].style.width = Math.max(0.4, c.p * 100) + "%";
    row.children[2].textContent = fmtPct(c.p);
    bars.appendChild(row);
  }
  const rest = Math.max(0, 1 - shown);
  if (rest > 0.0005) {
    const row = document.createElement("div");
    row.className = "cand-bar others";
    row.innerHTML = "<span class='cand-name'>all other tokens</span>" +
      "<span class='bar-track'><span class='bar-fill'></span></span><span></span>";
    row.children[1].children[0].style.width = Math.max(0.4, rest * 100) + "%";
    row.children[2].textContent = fmtPct(rest);
    bars.appendChild(row);
  }
  const chosenP = Math.exp(entry.chosenLogprob ?? entry.top[0].logprob);
  const rivals = cands.filter((c) => c.token.trim() !== entry.token.trim());
  const bestRival = rivals.length ? rivals.reduce((a, b) => (b.p > a.p ? b : a)) : null;
  info.textContent = "Token " + (idx + 1) + " of " + liveTokens.length + ": picked “" +
    entry.token.trim() + "” at " + fmtPct(chosenP) +
    (bestRival && bestRival.p >= 0.001
      ? " — closest rival “" + bestRival.token.trim() + "” at " + fmtPct(bestRival.p)
      : " — no rival above 0.1%") +
    (chosenP > 0.9 ? ". Near-certain: barely a choice." :
     chosenP > 0.5 ? ". Fairly confident, but a real alternative existed." :
     ". A genuine coin-flip zone — another run could easily pick differently.");
  // Expert debug for this token: logprob, top-1 margin, and the entropy of
  // the choice (top candidates + "all others" as one lump — approximate).
  const td = document.getElementById("tokenDebug");
  if (td) {
    let restP = Math.max(0, 1 - cands.reduce((s, c) => s + c.p, 0));
    let hNats = 0;
    for (const c of cands) if (c.p > 0) hNats -= c.p * Math.log(c.p);
    if (restP > 0) hNats -= restP * Math.log(restP);
    const margin = cands.length > 1 ? cands[0].p - cands[1].p : cands[0].p;
    td.textContent = "Expert debug — token " + (idx + 1) + " “" + entry.token.trim() +
      "”: chosen logprob " + (entry.chosenLogprob != null ? entry.chosenLogprob.toFixed(3) : "?") +
      " nats (p = exp(logprob) = " + fmtPct(chosenP) + ") · top-1 margin " +
      fmtPct(margin) + " over the runner-up · choice entropy ≈ " +
      (hNats / Math.LN2).toFixed(2) + " bits (0 = certain, ~" +
      (Math.log2(128256)).toFixed(1) + " bits would be a uniform pick over the whole vocabulary).";
  }
  if (candidateUpdate3D) candidateUpdate3D(cands, entry.token);
  capstoneLatch("inspected"); // Lesson 15 capstone step, if it has been started
}

function renderDebug(final) {
  const stats = document.getElementById("debugStats");
  const idsBox = document.getElementById("contextIds");
  const ms = (ns) => (ns / 1e6).toFixed(0) + " ms";
  const tps = final.eval_count && final.eval_duration
    ? (final.eval_count / (final.eval_duration / 1e9)).toFixed(1) : "?";
  stats.textContent =
    "Generated " + (final.eval_count ?? "?") + " tokens at " + tps + " tok/s (" +
    ms(final.eval_duration || 0) + ") · prompt: " + (final.prompt_eval_count ?? "?") +
    " tokens read in " + ms(final.prompt_eval_duration || 0) + " · model load " +
    ms(final.load_duration || 0) + " · total " + ms(final.total_duration || 0) +
    " · stopped because: " + (final.done_reason || "?");
  idsBox.innerHTML = "";
  const ids = final.context || [];
  ids.slice(0, 240).forEach((id) => {
    const s = document.createElement("span");
    s.className = "ctx-id" + (id >= 128000 ? " special" : "");
    s.textContent = id;
    s.title = id >= 128000 ? "special / template token" : "token id";
    idsBox.appendChild(s);
  });
  if (ids.length > 240) {
    const s = document.createElement("span");
    s.className = "ctx-id";
    s.textContent = "+" + (ids.length - 240) + " more";
    idsBox.appendChild(s);
  }
  renderDebugExtra(final);
}

/* Extra Expert debug: what each number teaches, not just the numbers. */
function renderDebugExtra(final) {
  const box = document.getElementById("debugExtra");
  if (!box) return;
  const ms = (ns) => (ns / 1e6).toFixed(0) + " ms";
  const pctOf = (part, whole) => whole ? Math.round(part / whole * 100) + "%" : "?";
  const total = final.total_duration || 0;
  const ctxLen = (final.context || []).length;
  const promptTps = final.prompt_eval_count && final.prompt_eval_duration
    ? Math.round(final.prompt_eval_count / (final.prompt_eval_duration / 1e9)) : "?";
  const chosenPs = liveTokens
    .map((t) => t.chosenLogprob != null ? Math.exp(t.chosenLogprob) : null)
    .filter((p) => p != null);
  const avgP = chosenPs.length
    ? chosenPs.reduce((s, p) => s + p, 0) / chosenPs.length : null;
  const coinFlips = chosenPs.filter((p) => p < 0.5).length;
  let mostUncertain = null;
  liveTokens.forEach((t, i) => {
    if (t.chosenLogprob == null) return;
    const p = Math.exp(t.chosenLogprob);
    if (!mostUncertain || p < mostUncertain.p) mostUncertain = { i, p, token: t.token };
  });
  const rows = [
    ["Where the time went", "load " + ms(final.load_duration || 0) + " (" + pctOf(final.load_duration || 0, total) +
      ") · reading your prompt " + ms(final.prompt_eval_duration || 0) + " (" + pctOf(final.prompt_eval_duration || 0, total) +
      ") · generating " + ms(final.eval_duration || 0) + " (" + pctOf(final.eval_duration || 0, total) +
      ") of " + ms(total) + " total. First runs pay the load cost; after that, generation dominates."],
    ["Two different speeds", "prompt reading ran at ~" + promptTps + " tok/s (all prompt tokens processed in parallel), generation at " +
      (final.eval_count && final.eval_duration ? (final.eval_count / (final.eval_duration / 1e9)).toFixed(1) : "?") +
      " tok/s (strictly one token at a time — that serial loop is why generation is the slow part)."],
    ["Context used", ctxLen + " of " + modelContextLength.toLocaleString() + " tokens (" +
      (modelContextLength ? (ctxLen / modelContextLength * 100).toFixed(2) : "?") +
      "% of the window) — prompt template, your prompt and the answer so far. Lesson 9 is what happens when this fills up."],
    ["Why it stopped", "done_reason = “" + (final.done_reason || "?") + "”" +
      (final.done_reason === "length" ? " — it hit this page's 80-token cap mid-thought, not a natural end." :
       final.done_reason === "stop" ? " — the model emitted its end token: it decided it was finished." :
       " — neither a natural stop nor the cap (for example, your Stop button).")],
    ["How sure it was, overall", avgP != null
      ? "the picked token averaged " + fmtPct(avgP) + " probability across " + chosenPs.length +
        " picks, and " + coinFlips + " of them were coin-flip zone (picked token under 50%)." +
        (mostUncertain ? " Most uncertain pick: token " + (mostUncertain.i + 1) + " “" +
          mostUncertain.token.trim() + "” at " + fmtPct(mostUncertain.p) + " — click it in the answer to see its rivals." : "")
      : "no logprobs were returned for this run."],
    ["Settings in force", "temperature " + parseFloat(tempRange.value).toFixed(1) +
      " (lesson 5's T, applied to every pick), max 80 new tokens per run (this page's cap)."],
  ];
  box.innerHTML = "";
  for (const [title, body] of rows) {
    const p = document.createElement("p");
    p.className = "debug-row";
    const b = document.createElement("b");
    b.textContent = title + ": ";
    p.appendChild(b);
    p.appendChild(document.createTextNode(body));
    box.appendChild(p);
  }
}

async function fetchModelCard() {
  const card = document.getElementById("modelCard");
  try {
    const res = await fetch(OLLAMA + "/api/show", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: MODEL }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const d = await res.json();
    const mi = d.model_info || {};
    if (mi["llama.context_length"]) modelContextLength = mi["llama.context_length"];
    const det = d.details || {};
    const facts = [
      ["Model", MODEL],
      ["Parameters", det.parameter_size || Math.round((mi["general.parameter_count"] || 0) / 1e8) / 10 + "B"],
      ["Layers", mi["llama.block_count"]],
      ["Embedding size", mi["llama.embedding_length"]],
      ["Attention heads", mi["llama.attention.head_count"]],
      ["Context window", (mi["llama.context_length"] || 0).toLocaleString() + " tokens"],
      ["Quantization", det.quantization_level || "?"],
    ];
    card.innerHTML = facts.map(([k, v]) =>
      "<span>" + k + ": <b>" + v + "</b></span>").join("");
  } catch (err) {
    card.textContent = "Model facts unavailable (model offline).";
  }
}
fetchModelCard();

async function generate() {
  const prompt = document.getElementById("promptInput").value.trim();
  if (!prompt) { showError("Write a prompt first."); return; }
  const journeyStatus = document.getElementById("journeyStatus");
  if (!modelOnline) {
    output.textContent = "";
    offlineHelp.hidden = false;
    if (journeyStatus) journeyStatus.textContent = "Model offline — start Ollama, then Re-check.";
    showError("The local model is offline. Follow the setup steps below, then Re-check.");
    return;
  }
  output.innerHTML = "";
  liveTokens = [];
  selectedLive = -1;
  document.getElementById("liveStats").textContent = "";
  document.getElementById("candidateBars").innerHTML =
    "<p class='hint'>Listening… towers will dance as tokens arrive.</p>";
  document.getElementById("candidateInfo").textContent = "";
  document.getElementById("debugStats").textContent = "Generating…";
  generateBtn.disabled = true;
  stopBtn.disabled = false;
  sndGenerateStart();
  currentAbort = new AbortController();
  // The merged journey view rides on this same generation: animate the
  // prompt's tokens rising, then show the first prediction's towers.
  const promptTokens = splitTokens(prompt).filter((t) => !/^\s+$/.test(t)).slice(0, 10);
  if (journeyStart3D) journeyStart3D(promptTokens);
  if (journeySetCandidates3D) journeySetCandidates3D([], null);
  if (journeyStatus) journeyStatus.textContent =
    "Sending " + promptTokens.length + " tokens through the 16 layers…";
  const genStarted = performance.now();
  let chunkCount = 0;
  let finalData = null;
  try {
    const res = await fetch(OLLAMA + "/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: currentAbort.signal,
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: true,
        logprobs: true,
        top_logprobs: 5,
        options: { temperature: parseFloat(tempRange.value), num_predict: 80 },
      }),
    });
    if (!res.ok) throw new Error("Model returned HTTP " + res.status + " — is " + MODEL + " pulled?");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        const json = JSON.parse(line);
        if (json.response) {
          const lp = (json.logprobs || [])[0];
          const idx = liveTokens.push({
            token: json.response,
            top: lp ? lp.top_logprobs : [],
            chosenLogprob: lp ? lp.logprob : null,
          }) - 1;
          const span = document.createElement("span");
          span.className = "live-token";
          span.textContent = json.response;
          span.title = "Click to see what the model considered here";
          span.addEventListener("click", () => selectLiveToken(idx));
          output.appendChild(span);
          chunkCount++;
          if (chunkCount === 1 && lp && journeySetCandidates3D) {
            journeySetCandidates3D(dedupCandidates(lp.top_logprobs), lp.token);
            if (journeyStatus) journeyStatus.textContent =
              "First prediction is in the journey towers — model still writing…";
          }
          spawnParticles(json.response.length);
          sndToken(chunkCount);
          if (lp) selectLiveToken(idx);
        }
        if (json.done) { finalData = json; break; }
      }
    }
    if (!output.textContent) output.textContent = "(the model returned nothing — try a different prompt)";
    if (finalData) {
      renderDebug(finalData);
      judgePendingTrap(output.textContent);
    }
  } catch (err) {
    if (err.name === "AbortError") {
      output.appendChild(document.createTextNode("\n[stopped]"));
      if (journeyStatus) journeyStatus.textContent = "Stopped.";
    } else {
      showError("Generation failed: " + err.message);
      if (journeyStatus) journeyStatus.textContent = "Generation failed: " + err.message;
      checkModel();
    }
  } finally {
    generateBtn.disabled = false;
    stopBtn.disabled = true;
    currentAbort = null;
    const secs = ((performance.now() - genStarted) / 1000).toFixed(1);
    if (chunkCount > 0) {
      if (journeyStatus) journeyStatus.textContent =
        "Done — the journey towers show the first prediction; click any token in the answer to inspect its own candidates.";
      document.getElementById("liveStats").textContent = finalData && finalData.eval_duration
        ? chunkCount + " tokens · " + secs + "s wall-clock · " +
          (finalData.eval_count / (finalData.eval_duration / 1e9)).toFixed(1) +
          " tok/s generation speed (server-measured)"
        : chunkCount + " token chunks · " + secs + "s · " +
          (chunkCount / Math.max(0.1, parseFloat(secs))).toFixed(1) + " chunks/sec";
      sndDone();
    }
  }
}
generateBtn.addEventListener("click", generate);
stopBtn.addEventListener("click", () => {
  if (currentAbort) { sndGenerateStop(); currentAbort.abort(); }
});

/* ---------- Lesson 11: candidate towers in 3D (real logprobs) ---------- */
async function initCandidate3D() {
  const box = document.getElementById("candidate3D");
  let THREE;
  try { THREE = await import("three"); } catch (err) { return; }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(theme3D.bg);
  const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100);
  camera.position.set(0, 3.1, 6.4);
  camera.lookAt(0, 0.9, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(box.clientWidth, box.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  box.appendChild(renderer.domElement);
  const group = new THREE.Group();
  scene.add(group);

  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(360 * 3);
  for (let i = 0; i < 360; i++) {
    const r = 9 + Math.random() * 9;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i * 3 + 1] = Math.abs(r * Math.sin(ph) * Math.sin(th)) * 0.7;
    starPos[i * 3 + 2] = r * Math.cos(ph) - 3;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: theme3D.star, size: 0.05, transparent: true, opacity: 0.8 });
  scene.add(new THREE.Points(starGeo, starMat));

  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(7.4, 0.16, 2.4),
    new THREE.MeshBasicMaterial({ color: 0x232c38 }));
  platform.position.y = -0.08;
  group.add(platform);
  const grid = new THREE.GridHelper(7.4, 10, 0x3d4a5a, 0x2a333f);
  grid.scale.z = 2.4 / 7.4;
  grid.position.y = 0.01;
  group.add(grid);

  function makeLabel() {
    const c = document.createElement("canvas");
    c.width = 320; c.height = 140;
    const tex = new THREE.CanvasTexture(c);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, depthTest: false }));
    sprite.scale.set(1.25, 0.55, 1);
    sprite.renderOrder = 20;
    sprite.userData = { canvas: c, tex };
    return sprite;
  }
  function drawLabel(sprite, token, pctText, chosen) {
    const { canvas, tex } = sprite.userData;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 320, 140);
    ctx.fillStyle = "rgba(10, 14, 19, 0.88)";
    ctx.strokeStyle = chosen ? "rgba(255, 210, 140, 0.95)" : "rgba(140, 165, 190, 0.55)";
    ctx.lineWidth = chosen ? 5 : 3;
    ctx.beginPath();
    ctx.roundRect(14, 8, 292, 124, 18);
    ctx.fill(); ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "#f2ede4";
    ctx.font = "700 44px Segoe UI, sans-serif";
    const label = token.replace(/\s/g, "␣").slice(0, 12) || "∅";
    ctx.fillText(label, 160, 58);
    ctx.fillStyle = chosen ? "#ffd28c" : "#a9c6de";
    ctx.font = "700 38px Consolas, monospace";
    ctx.fillText(pctText, 160, 108);
    tex.needsUpdate = true;
  }

  const towers = [];
  for (let i = 0; i < 5; i++) {
    const geo = new THREE.BoxGeometry(0.92, 1, 0.92);
    geo.translate(0, 0.5, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: theme3D.input, transparent: true, opacity: 0.92 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(-2.8 + i * 1.4, 0, 0);
    mesh.scale.y = 0.12;
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.94, 1.02, 0.94)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 }));
    edges.geometry.translate(0, 0.5, 0);
    mesh.add(edges);
    const label = makeLabel();
    label.position.set(mesh.position.x, 0.7, 0);
    group.add(mesh);
    group.add(label);
    towers.push({ mesh, label, target: 0.12, chosen: false });
  }

  candidateUpdate3D = (cands, chosenToken) => {
    towers.forEach((t, i) => {
      const c = cands[i];
      if (!c) { t.mesh.visible = false; t.label.visible = false; return; }
      t.mesh.visible = true;
      t.label.visible = true;
      t.chosen = c.token === chosenToken;
      t.target = 0.12 + Math.sqrt(Math.max(0, c.p)) * 2.7;
      t.mesh.material.color.setHex(t.chosen ? theme3D.accent : theme3D.input);
      drawLabel(t.label, c.token, fmtPct(c.p), t.chosen);
    });
  };
  candidateUpdate3D([], null);
  themeRecolorers.push((p) => {
    scene.background = new THREE.Color(p.bg);
    starMat.color.setHex(p.star);
    for (const t of towers) {
      t.mesh.material.color.setHex(t.chosen ? p.accent : p.input);
    }
  });

  let composer = null;
  try {
    const { EffectComposer } = await import("three/addons/postprocessing/EffectComposer.js");
    const { RenderPass } = await import("three/addons/postprocessing/RenderPass.js");
    const { UnrealBloomPass } = await import("three/addons/postprocessing/UnrealBloomPass.js");
    const { OutputPass } = await import("three/addons/postprocessing/OutputPass.js");
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(box.clientWidth, box.clientHeight), 0.55, 0.7, 0.5));
    composer.addPass(new OutputPass());
  } catch (err) { composer = null; }

  let dragging = false, px = 0, py = 0, ry = -0.25, rx = 0.32;
  const el = renderer.domElement;
  el.style.touchAction = "none";
  el.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; el.setPointerCapture(e.pointerId); });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    ry += (e.clientX - px) * 0.008;
    rx = Math.max(-0.1, Math.min(1.1, rx + (e.clientY - py) * 0.005));
    px = e.clientX; py = e.clientY;
  });
  el.addEventListener("pointerup", () => { dragging = false; });
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    camera.position.z = Math.max(4, Math.min(11, camera.position.z + e.deltaY * 0.01));
  }, { passive: false });

  const reduceM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function tick(now) {
    requestAnimationFrame(tick);
    if (!dragging && !reduceM) ry += 0.0016;
    group.rotation.y = Math.sin(ry) * 0.55;
    group.rotation.x = 0;
    camera.position.y = 1.2 + rx * 3.2;
    camera.lookAt(0, 0.9, 0);
    const t = now / 1000;
    for (const tw of towers) {
      if (!tw.mesh.visible) continue;
      tw.mesh.scale.y += (tw.target - tw.mesh.scale.y) * 0.09;
      const bob = tw.chosen && !reduceM ? Math.sin(t * 3.2) * 0.05 : 0;
      tw.label.position.y = tw.mesh.scale.y + 0.55 + bob;
      if (tw.chosen) tw.mesh.material.opacity = 0.95 + Math.sin(t * 3.2) * 0.05;
    }
    if (box.clientWidth > 0) { if (composer) composer.render(); else renderer.render(scene, camera); } // skip GPU work while the lesson is hidden
  }
  requestAnimationFrame(tick);
  window.addEventListener("resize", () => {
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(box.clientWidth, box.clientHeight);
    if (composer) composer.setSize(box.clientWidth, box.clientHeight);
  });
}
initCandidate3D();

/* ---------- Lesson 11: live token journey through 16 layers in 3D ---------- */
let journeyStart3D = null;
let journeySetCandidates3D = null;

async function initJourneyLive3D() {
  const box = document.getElementById("journeyLive3D");
  let THREE;
  try { THREE = await import("three"); } catch (err) { return; }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(theme3D.bg);
  const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100);
  camera.position.set(0.3, 0.5, 8.4);
  camera.lookAt(0.3, 0, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(box.clientWidth, box.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  box.appendChild(renderer.domElement);
  const group = new THREE.Group();
  scene.add(group);

  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(420 * 3);
  for (let i = 0; i < 420; i++) {
    const r = 9 + Math.random() * 10;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.8;
    starPos[i * 3 + 2] = r * Math.cos(ph) - 4;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: theme3D.star, size: 0.05, transparent: true, opacity: 0.8 });
  scene.add(new THREE.Points(starGeo, starMat));

  function makeLabel(scaleX, scaleY) {
    const c = document.createElement("canvas");
    c.width = 320; c.height = 140;
    const tex = new THREE.CanvasTexture(c);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, depthTest: false }));
    sprite.scale.set(scaleX, scaleY, 1);
    sprite.renderOrder = 20;
    sprite.userData = { canvas: c, tex };
    return sprite;
  }
  function drawLabel(sprite, line1, line2, chosen) {
    const { canvas, tex } = sprite.userData;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 320, 140);
    ctx.fillStyle = "rgba(10, 14, 19, 0.88)";
    ctx.strokeStyle = chosen ? "rgba(255, 210, 140, 0.95)" : "rgba(140, 165, 190, 0.55)";
    ctx.lineWidth = chosen ? 5 : 3;
    ctx.beginPath();
    ctx.roundRect(14, 8, 292, 124, 18);
    ctx.fill(); ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "#f2ede4";
    ctx.font = "700 42px Segoe UI, sans-serif";
    ctx.fillText(String(line1).replace(/\s/g, "␣").slice(0, 12) || "∅", 160, 58);
    ctx.fillStyle = chosen ? "#ffd28c" : "#a9c6de";
    ctx.font = "700 36px Consolas, monospace";
    ctx.fillText(line2 || "", 160, 106);
    tex.needsUpdate = true;
  }

  // The 16-layer stack (llama3.2:1b's real layer count).
  const LAYERS = 16;
  const slabs = [];
  for (let i = 0; i < LAYERS; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: theme3D.input, transparent: true, opacity: 0.22 });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.19, 1.35), mat);
    slab.position.set(-2.1, -2.35 + i * 0.295, 0);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.52, 0.21, 1.37)),
      new THREE.LineBasicMaterial({ color: 0x9fc6de, transparent: true, opacity: 0.28 }));
    slab.add(edges);
    group.add(slab);
    slabs.push({ mesh: slab, flash: 0 });
  }
  const stackLabel = makeLabel(1.5, 0.66);
  stackLabel.position.set(-2.1, 2.85, 0);
  drawLabel(stackLabel, "16 layers", "transformer", false);
  group.add(stackLabel);

  // Travelling token: glowing orb + its label.
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 20, 20),
    new THREE.MeshBasicMaterial({ color: theme3D.accent, depthTest: false }));
  orb.renderOrder = 15;
  orb.visible = false;
  group.add(orb);
  const tokenLabel = makeLabel(1.3, 0.57);
  tokenLabel.visible = false;
  group.add(tokenLabel);

  // Candidate towers on the right.
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(5.4, 0.16, 2.2),
    new THREE.MeshBasicMaterial({ color: 0x232c38 }));
  platform.position.set(2.55, -2.62, 0);
  group.add(platform);
  const towers = [];
  for (let i = 0; i < 5; i++) {
    const geo = new THREE.BoxGeometry(0.68, 1, 0.68);
    geo.translate(0, 0.5, 0);
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: theme3D.input, transparent: true, opacity: 0.92 }));
    mesh.position.set(0.45 + i * 1.05, -2.54, 0);
    mesh.scale.y = 0.1;
    mesh.visible = false;
    const label = makeLabel(1.05, 0.46);
    label.visible = false;
    group.add(mesh);
    group.add(label);
    towers.push({ mesh, label, target: 0.1, chosen: false });
  }
  const candLabel = makeLabel(1.7, 0.74);
  candLabel.position.set(2.55, 2.85, 0);
  drawLabel(candLabel, "next token", "real candidates", false);
  group.add(candLabel);

  // Animation state: a queue of prompt tokens rising through the stack.
  const anim = { queue: [], current: null, progress: 0 };
  journeyStart3D = (tokens) => {
    anim.queue = tokens.slice(0, 10);
    anim.current = null;
    anim.progress = 0;
    for (const s of slabs) s.flash = 0;
  };
  journeySetCandidates3D = (cands, chosenToken) => {
    towers.forEach((t, i) => {
      const c = cands[i];
      if (!c) { t.mesh.visible = false; t.label.visible = false; return; }
      t.mesh.visible = true;
      t.label.visible = true;
      t.chosen = c.token === chosenToken;
      t.target = 0.1 + Math.sqrt(Math.max(0, c.p)) * 3.4;
      t.mesh.material.color.setHex(t.chosen ? theme3D.accent : theme3D.input);
      drawLabel(t.label, c.token, fmtPct(c.p), t.chosen);
    });
  };
  themeRecolorers.push((p) => {
    scene.background = new THREE.Color(p.bg);
    starMat.color.setHex(p.star);
    orb.material.color.setHex(p.accent);
    colInput.setHex(p.input);
    colAccent.setHex(p.accent);
    for (const t of towers) t.mesh.material.color.setHex(t.chosen ? p.accent : p.input);
  });

  let composer = null;
  try {
    const { EffectComposer } = await import("three/addons/postprocessing/EffectComposer.js");
    const { RenderPass } = await import("three/addons/postprocessing/RenderPass.js");
    const { UnrealBloomPass } = await import("three/addons/postprocessing/UnrealBloomPass.js");
    const { OutputPass } = await import("three/addons/postprocessing/OutputPass.js");
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(box.clientWidth, box.clientHeight), 0.55, 0.7, 0.5));
    composer.addPass(new OutputPass());
  } catch (err) { composer = null; }

  let dragging = false, px = 0, py = 0, ry = 0, tilt = 0.5;
  const el = renderer.domElement;
  el.style.touchAction = "none";
  el.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; el.setPointerCapture(e.pointerId); });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    ry += (e.clientX - px) * 0.008;
    tilt = Math.max(0, Math.min(1, tilt + (e.clientY - py) * 0.004));
    px = e.clientX; py = e.clientY;
  });
  el.addEventListener("pointerup", () => { dragging = false; });
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    camera.position.z = Math.max(5, Math.min(13, camera.position.z + e.deltaY * 0.01));
  }, { passive: false });

  const reduceM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colInput = new THREE.Color(theme3D.input);
  const colAccent = new THREE.Color(theme3D.accent);
  const tmpCol = new THREE.Color();
  let last = performance.now();
  function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!dragging && !reduceM) ry += 0.0012;
    group.rotation.y = Math.sin(ry) * 0.35;
    camera.position.y = -0.6 + tilt * 2.4;
    camera.lookAt(0.3, 0, 0);

    // Token pass animation.
    if (!anim.current && anim.queue.length) {
      anim.current = anim.queue.shift();
      anim.progress = 0;
      drawLabel(tokenLabel, anim.current, "token", true);
      orb.visible = true;
      tokenLabel.visible = true;
    }
    if (anim.current) {
      anim.progress += dt / 0.55;
      const p = Math.min(1, anim.progress);
      const y = -2.75 + p * 5.3;
      orb.position.set(-2.1, y, 0);
      tokenLabel.position.set(-2.1, y + 0.55, 0);
      const slabIdx = Math.floor(p * LAYERS);
      if (slabIdx < LAYERS) slabs[slabIdx].flash = 1;
      if (p >= 1) { anim.current = null; orb.visible = false; tokenLabel.visible = false; }
    }
    for (const s of slabs) {
      s.flash *= 0.94;
      tmpCol.copy(colInput).lerp(colAccent, s.flash);
      s.mesh.material.color.copy(tmpCol);
      s.mesh.material.opacity = 0.22 + s.flash * 0.65;
    }
    const t = now / 1000;
    for (const tw of towers) {
      if (!tw.mesh.visible) continue;
      tw.mesh.scale.y += (tw.target - tw.mesh.scale.y) * 0.08;
      tw.label.position.set(tw.mesh.position.x, -2.54 + tw.mesh.scale.y + 0.5, 0);
      if (tw.chosen && !reduceM) tw.mesh.material.opacity = 0.94 + Math.sin(t * 3.2) * 0.06;
    }
    if (box.clientWidth > 0) { if (composer) composer.render(); else renderer.render(scene, camera); } // skip GPU work while the lesson is hidden
  }
  requestAnimationFrame(tick);
  window.addEventListener("resize", () => {
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(box.clientWidth, box.clientHeight);
    if (composer) composer.setSize(box.clientWidth, box.clientHeight);
  });
}
initJourneyLive3D();

/* ---------- Lesson 12: small vs premium — true-scale volumes in 3D ---------- */
const SCALE_METRICS = {
  params: {
    small: 1.23e9, big: 2.5e11,
    smallLabel: "1.23B", bigLabel: "~250B class",
    note: "Parameters (the model's adjustable knobs): your Llama has 1.23 billion — a real, published figure. Premium models don't publish theirs; the big block is illustrated at 250 billion, the commonly estimated class. The blocks are drawn at TRUE volume scale: if the small cube is the whole 1B model, the premium block holds about 200 of them — roughly 5.9× wider, taller and deeper (200 = 5.9³). No log tricks: what you see is the ratio.",
  },
  training: {
    small: 9e12, big: 3e13,
    smallLabel: "9 trillion", bigLabel: "~30 trillion class",
    note: "Training tokens (how much text the model practised on, lessons 1–3): Meta's model card says up to 9 trillion for yours. Premium training sets are not published; illustrated at ~30 trillion. At true volume scale that's a block about 3.3× the small one's volume — a real gap, but notice how much smaller it looks than the parameter gap.",
  },
  context: {
    small: 131072, big: 1000000,
    smallLabel: "131,072", bigLabel: "up to ~1M class",
    note: "Context window (lesson 9's window size): yours holds 131,072 tokens — roughly a 300-page book. Premium products offer roughly 200k–1M tokens. Represented as volume that's about 7.6× — the smallest gap of the four, which the true-scale blocks make obvious at a glance.",
  },
  compute: {
    small: 1, big: 200,
    smallLabel: "×1", bigLabel: "×~200 class",
    note: "Rough compute burned per generated token, again at true volume scale (~200×). Inference cost scales with active parameters (~2 FLOPs per parameter per token), so each premium token costs on the order of 200× more arithmetic than yours — before premium extras like longer deliberate reasoning. That gap is why one is free on your desk and the other is metered in a data centre.",
  },
};
let scaleTargetSide = 0.55 * Math.cbrt(250 / 1.23);
let scaleSet3D = null;
let currentScaleKey = "params";
function setScaleMetric(key) {
  const m = SCALE_METRICS[key];
  if (!m) return;
  currentScaleKey = key;
  document.querySelectorAll(".scale-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.metric === key));
  const ratio = m.big / m.small;
  scaleTargetSide = 0.55 * Math.cbrt(ratio);
  document.getElementById("scaleNote").textContent = (dynDict(currentLang).scale_notes || {})[key] || m.note;
  if (scaleSet3D) {
    scaleSet3D(m.smallLabel, m.bigLabel,
      Math.max(1, Math.round(Math.cbrt(ratio))),
      "×" + Math.round(ratio) + " volume · est");
  }
}
document.querySelectorAll(".scale-btn").forEach((b) =>
  b.addEventListener("click", () => setScaleMetric(b.dataset.metric)));

async function initScale3D() {
  const box = document.getElementById("scaleCanvas");
  let THREE;
  try { THREE = await import("three"); } catch (err) {
    document.getElementById("scaleFallback").hidden = false;
    return;
  }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(theme3D.bg);
  const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100);
  camera.position.set(0, 2.6, 9.8);
  camera.lookAt(0, 1.2, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(box.clientWidth, box.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  box.appendChild(renderer.domElement);
  const group = new THREE.Group();
  scene.add(group);

  const grid = new THREE.GridHelper(11, 11, 0x3a4656, 0x232c38);
  grid.position.y = 0;
  group.add(grid);

  function makeLabel(scaleX, scaleY) {
    const c = document.createElement("canvas");
    c.width = 384; c.height = 168;
    const tex = new THREE.CanvasTexture(c);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, depthTest: false }));
    sprite.scale.set(scaleX, scaleY, 1);
    sprite.renderOrder = 20;
    sprite.userData = { canvas: c, tex };
    return sprite;
  }
  function drawLabel(sprite, line1, line2, hot) {
    const { canvas, tex } = sprite.userData;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 384, 168);
    ctx.fillStyle = "rgba(10, 14, 19, 0.88)";
    ctx.strokeStyle = hot ? "rgba(255, 210, 140, 0.95)" : "rgba(140, 165, 190, 0.55)";
    ctx.lineWidth = hot ? 5 : 3;
    ctx.beginPath();
    ctx.roundRect(14, 8, 356, 152, 18);
    ctx.fill(); ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "#f2ede4";
    ctx.font = "700 46px Segoe UI, sans-serif";
    ctx.fillText(String(line1).slice(0, 18), 192, 72);
    ctx.fillStyle = hot ? "#ffd28c" : "#a9c6de";
    ctx.font = "700 36px Consolas, monospace";
    ctx.fillText(String(line2).slice(0, 20), 192, 124);
    tex.needsUpdate = true;
  }

  // True-scale volumes: the small cube IS the 1B model; the big block's
  // volume is ratio x larger (side = cube root of the ratio). A subdivided
  // grid on the big block shows roughly how many small cubes fit inside.
  const SMALL = 0.55;
  function blockEdges(size, color) {
    return new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(size * 1.02, size * 1.02, size * 1.02)),
      new THREE.LineBasicMaterial({ color: 0xdfe9f2, transparent: true, opacity: 0.4 }));
  }
  function makeUnitGrid(n) {
    const pos = [];
    const seg = (a, b) => pos.push(...a, ...b);
    for (let i = 1; i < n; i++) {
      const f = -0.5 + i / n;
      seg([f, 0, -0.5], [f, 1, -0.5]); seg([f, 0, 0.5], [f, 1, 0.5]);
      seg([-0.5, 0, f], [-0.5, 1, f]); seg([0.5, 0, f], [0.5, 1, f]);
      const y = i / n;
      seg([-0.5, y, -0.5], [0.5, y, -0.5]); seg([-0.5, y, 0.5], [0.5, y, 0.5]);
      seg([-0.5, y, -0.5], [-0.5, y, 0.5]); seg([0.5, y, -0.5], [0.5, y, 0.5]);
      seg([f, 1, -0.5], [f, 1, 0.5]); seg([-0.5, 1, f], [0.5, 1, f]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return new THREE.LineSegments(g, new THREE.LineBasicMaterial({
      color: 0xdfe9f2, transparent: true, opacity: 0.28 }));
  }
  const blocks = [];
  [["Llama 3.2 1B", "on your computer", -2.35, 0xe0a458, true],
   ["Premium class", "data centre", 1.55, 0x5da9c4, false]].forEach(([name, sub, x, color, hot], idx) => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    geo.translate(0, 0.5, 0);
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: idx === 0 ? 0.95 : 0.55 }));
    mesh.position.set(x, 0, 0);
    mesh.scale.setScalar(idx === 0 ? SMALL : 0.2);
    if (idx === 0) {
      const e = blockEdges(1.02, color);
      e.position.y = 0.5;
      mesh.add(e);
    }
    const value = makeLabel(2.1, 0.92);
    const title = makeLabel(2.3, 1.0);
    drawLabel(title, name, sub, hot);
    title.position.set(x, -0.75, 0);
    group.add(mesh); group.add(value); group.add(title);
    blocks.push({ mesh, value, cur: idx === 0 ? SMALL : 0.2, grid: null });
  });
  scaleSet3D = (smallLabel, bigLabel, divisions, ratioLabel) => {
    drawLabel(blocks[0].value, smallLabel, "real figure", true);
    drawLabel(blocks[1].value, bigLabel, ratioLabel || "estimate", false);
    const big = blocks[1];
    if (big.grid) { big.mesh.remove(big.grid); big.grid.geometry.dispose(); }
    big.grid = makeUnitGrid(divisions || 6);
    big.grid.position.y = 0;
    big.mesh.add(big.grid);
  };
  scaleSet3D(SCALE_METRICS.params.smallLabel,
    SCALE_METRICS.params.bigLabel, 6, "×203 volume · est");
  themeRecolorers.push((p) => { scene.background = new THREE.Color(p.bg); });

  let dragging = false, px = 0, py = 0, ry = 0.35;
  const el = renderer.domElement;
  el.style.touchAction = "none";
  el.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; el.setPointerCapture(e.pointerId); });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    ry += (e.clientX - px) * 0.008;
    px = e.clientX; py = e.clientY;
  });
  el.addEventListener("pointerup", () => { dragging = false; });
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    camera.position.z = Math.max(5, Math.min(14, camera.position.z + e.deltaY * 0.01));
  }, { passive: false });

  const reduceM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function tick() {
    requestAnimationFrame(tick);
    if (!dragging && !reduceM) ry += 0.0012;
    group.rotation.y = Math.sin(ry) * 0.35;
    const big = blocks[1];
    big.cur += (scaleTargetSide - big.cur) * 0.07;
    big.mesh.scale.setScalar(Math.max(0.05, big.cur));
    big.value.position.set(big.mesh.position.x, big.cur + 0.6, 0);
    blocks[0].value.position.set(blocks[0].mesh.position.x, SMALL + 0.6, 0);
    if (box.clientWidth > 0) renderer.render(scene, camera); // skip GPU work while hidden
  }
  requestAnimationFrame(tick);
  window.addEventListener("resize", () => {
    const w = box.clientWidth, h = box.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}
initScale3D();
setScaleMetric("params");


/* ---------- Lesson 3: attention (schematic teaching data) ---------- */
const ATTN_WORDS = ["The", "cat", "sat", "on", "the", "mat", "because", "it", "was", "tired"];
const ATTN_HEADS = [
  {
    desc: "This head tracks reference: pronouns look back at the noun they stand for. Click “it”.",
    weights: {
      7: { 1: 0.65, 5: 0.18, 2: 0.09, 0: 0.05, 7: 0.03 },
      1: { 0: 0.45, 1: 0.35, 2: 0.20 },
      9: { 7: 0.38, 1: 0.27, 8: 0.20, 2: 0.15 },
    },
  },
  {
    desc: "This head tracks actions: nouns look at their verb. Click “cat” or “mat”.",
    weights: {
      1: { 2: 0.58, 0: 0.22, 1: 0.20 },
      5: { 2: 0.44, 3: 0.31, 5: 0.25 },
      9: { 8: 0.52, 2: 0.26, 7: 0.22 },
    },
  },
  {
    desc: "This head mostly copies the previous token — useful for finishing common phrases.",
    weights: {},
  },
];
let attnHead = 0;
let attnSelected = 7;
const attnTokensEl = document.getElementById("attnTokens");
const attnSvg = document.getElementById("attnSvg");
const attnWeightsEl = document.getElementById("attnWeights");

ATTN_WORDS.forEach((word, i) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "attn-token";
  btn.textContent = word;
  btn.addEventListener("click", () => { attnSelected = i; renderAttention(); });
  attnTokensEl.appendChild(btn);
});

function attnWeightsFor(index) {
  const head = ATTN_HEADS[attnHead];
  if (head.weights[index]) return head.weights[index];
  if (index === 0) return { 0: 1 };
  return { [index - 1]: 0.72, [index]: 0.18, 0: 0.10 };
}

function renderAttention() {
  document.getElementById("headDesc").textContent = ATTN_HEADS[attnHead].desc;
  [...attnTokensEl.children].forEach((el, i) =>
    el.classList.toggle("selected", i === attnSelected));
  const weights = attnWeightsFor(attnSelected);
  const entries = Object.entries(weights)
    .map(([k, v]) => [Number(k), v])
    .sort((a, b) => b[1] - a[1]);

  attnWeightsEl.innerHTML = "";
  for (const [target, w] of entries) {
    const row = document.createElement("div");
    row.className = "attn-weight";
    row.innerHTML = "<span></span><span class='bar-track'><span class='bar-fill'></span></span><span></span>";
    row.children[0].textContent = ATTN_WORDS[target];
    row.querySelector(".bar-fill").style.width = Math.round(w * 100) + "%";
    row.children[2].textContent = Math.round(w * 100) + "%";
    attnWeightsEl.appendChild(row);
  }

  // Draw arcs from the selected token (top) down to each earlier/equal token.
  const stage = document.getElementById("attnStage");
  const stageRect = stage.getBoundingClientRect();
  const tokenEls = [...attnTokensEl.children];
  const centerX = (el) => {
    const r = el.getBoundingClientRect();
    return r.left - stageRect.left + r.width / 2;
  };
  attnSvg.setAttribute("viewBox", "0 0 " + stage.clientWidth + " 120");
  attnSvg.innerHTML = "";
  const x1 = centerX(tokenEls[attnSelected]);
  for (const [target, w] of entries) {
    if (target === attnSelected) continue;
    const x2 = centerX(tokenEls[target]);
    const lift = 18 + w * 70;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M " + x1 + " 6 Q " + ((x1 + x2) / 2) + " " + (6 + lift) + " " + x2 + " 6");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#e0a458");
    path.setAttribute("stroke-width", String(1 + w * 5));
    path.setAttribute("stroke-opacity", String(0.25 + w * 0.75));
    attnSvg.appendChild(path);
  }
}
document.getElementById("headSelect").addEventListener("change", (e) => {
  attnHead = Number(e.target.value);
  renderAttention();
});
window.addEventListener("resize", renderAttention);
renderAttention();

/* ---------- Lesson 4: next-token probabilities (real temperature maths) ---------- */
const STORY_STEPS = [
  { candidates: [[" Paris", 0.72], [" Lyon", 0.07], [" the", 0.06], [" a", 0.05], [" France", 0.04], [" London", 0.03], [" Marseille", 0.03]] },
  { candidates: [[".", 0.55], [",", 0.22], [" and", 0.09], [" is", 0.07], [" (", 0.04], ["!", 0.03]] },
  { candidates: [[" It", 0.38], [" The", 0.31], [" Paris", 0.12], [" Its", 0.09], [" This", 0.06], [" A", 0.04]] },
  { candidates: [[" is", 0.62], [" has", 0.15], [" was", 0.10], [" attracts", 0.06], [" sits", 0.04], [" smells", 0.03]] },
  { candidates: [[" known", 0.34], [" famous", 0.28], [" home", 0.14], [" the", 0.11], [" beautiful", 0.08], [" rainy", 0.05]] },
];
let storyStep = 0;
let storyPicked = [];
const storyText = document.getElementById("storyText");
const probBars = document.getElementById("probBars");
const probTemp = document.getElementById("probTemp");

function tempered(candidates, temp) {
  // Real temperature maths: scale log-probabilities, then renormalise.
  const scaled = candidates.map(([tok, p]) => [tok, Math.exp(Math.log(p) / temp)]);
  const total = scaled.reduce((s, [, v]) => s + v, 0);
  return scaled.map(([tok, v]) => [tok, v / total]).sort((a, b) => b[1] - a[1]);
}

function renderStory(chosenToken) {
  storyText.innerHTML = "";
  storyText.appendChild(document.createTextNode("The capital of France is"));
  for (const tok of storyPicked) {
    const span = document.createElement("span");
    span.className = "picked";
    span.textContent = tok;
    storyText.appendChild(span);
  }
  probBars.innerHTML = "";
  if (storyStep >= STORY_STEPS.length) {
    document.getElementById("stepNote").textContent =
      "Story complete — that is five weighted coin flips in a row. Restart and try temperature 0.2 vs 2.0.";
    return;
  }
  const probs = tempered(STORY_STEPS[storyStep].candidates, parseFloat(probTemp.value));
  for (const [tok, p] of probs) {
    const row = document.createElement("div");
    row.className = "prob-bar" + (tok === chosenToken ? " chosen" : "");
    row.innerHTML = "<span class='prob-name'></span><span class='bar-track'><span class='bar-fill'></span></span><span></span>";
    row.children[0].textContent = tok;
    row.querySelector(".bar-fill").style.width = Math.max(2, Math.round(p * 100)) + "%";
    row.children[2].textContent = (p * 100).toFixed(1) + "%";
    probBars.appendChild(row);
  }
}

document.getElementById("stepBtn").addEventListener("click", () => {
  if (storyStep >= STORY_STEPS.length) return;
  const probs = tempered(STORY_STEPS[storyStep].candidates, parseFloat(probTemp.value));
  let roll = Math.random();
  let picked = probs[probs.length - 1][0];
  for (const [tok, p] of probs) {
    roll -= p;
    if (roll <= 0) { picked = tok; break; }
  }
  storyPicked.push(picked);
  storyStep += 1;
  sndStepSound(storyStep);
  if (storyStep >= STORY_STEPS.length) sndSuccess();
  renderStory(picked);
  if (storyStep < STORY_STEPS.length) {
    document.getElementById("stepNote").textContent =
      "Picked “" + picked.trim() + "”. The bars below are the odds for the next token.";
  }
});
document.getElementById("storyResetBtn").addEventListener("click", () => {
  storyStep = 0;
  storyPicked = [];
  renderStory(null);
  document.getElementById("stepNote").textContent =
    "Restarted. Try temperature 0.2 (predictable) versus 2.0 (chaotic) and compare the stories.";
});
probTemp.addEventListener("input", () => {
  document.getElementById("probTempVal").textContent = probTemp.value;
  renderStory(null);
});
renderStory(null);

/* ---------- Lesson 3: training (toy gradient-descent organisation) ---------- */
const TRAIN_WORDS = [
  { word: "king", target: [0.38, 0.30], start: [0.14, 0.78], color: "#e0a458" },
  { word: "queen", target: [0.46, 0.36], start: [0.86, 0.18], color: "#e0a458" },
  { word: "man", target: [0.30, 0.52], start: [0.58, 0.86], color: "#c98bb9" },
  { word: "woman", target: [0.38, 0.58], start: [0.18, 0.22], color: "#c98bb9" },
  { word: "cat", target: [0.72, 0.28], start: [0.90, 0.72], color: "#7fb069" },
  { word: "dog", target: [0.80, 0.36], start: [0.42, 0.10], color: "#7fb069" },
  { word: "car", target: [0.70, 0.72], start: [0.08, 0.48], color: "#5da9c4" },
  { word: "bus", target: [0.79, 0.65], start: [0.64, 0.52], color: "#5da9c4" },
];
const trainCanvas = document.getElementById("trainCanvas");
const trainCtx = trainCanvas.getContext("2d");
const trainSteps = document.getElementById("trainSteps");
let trainAnim = null;

function drawTraining(step) {
  const t = step / 100;
  const eased = 1 - Math.pow(1 - t, 2.2);
  const W = trainCanvas.width, H = trainCanvas.height;
  trainCtx.clearRect(0, 0, W, H);
  for (const w of TRAIN_WORDS) {
    const x = (w.start[0] + (w.target[0] - w.start[0]) * eased) * W;
    const y = (w.start[1] + (w.target[1] - w.start[1]) * eased) * H;
    trainCtx.beginPath();
    trainCtx.arc(x, y, 9, 0, Math.PI * 2);
    trainCtx.fillStyle = w.color;
    trainCtx.fill();
    trainCtx.font = "600 17px Segoe UI, sans-serif";
    trainCtx.fillStyle = "#e8e6e1";
    trainCtx.textAlign = "center";
    trainCtx.fillText(w.word, x, y - 16);
  }
  document.getElementById("trainStepVal").textContent = step;
  const loss = Math.round(3 + 97 * Math.pow(0.55, step / 22));
  document.getElementById("lossVal").textContent = loss + "%";
  document.getElementById("lossGaugeFill").style.width = loss + "%";
}
trainSteps.addEventListener("input", () => drawTraining(Number(trainSteps.value)));
document.getElementById("trainBtn").addEventListener("click", () => {
  if (trainAnim) cancelAnimationFrame(trainAnim);
  const started = performance.now();
  const from = Number(trainSteps.value) >= 100 ? 0 : Number(trainSteps.value);
  function frame(now) {
    const step = Math.min(100, from + (now - started) / 28);
    trainSteps.value = Math.floor(step);
    drawTraining(Math.floor(step));
    if (step < 100) trainAnim = requestAnimationFrame(frame);
  }
  trainAnim = requestAnimationFrame(frame);
});
document.getElementById("trainResetBtn").addEventListener("click", () => {
  if (trainAnim) cancelAnimationFrame(trainAnim);
  trainSteps.value = 0;
  drawTraining(0);
});
drawTraining(0);

/* ---------- Lesson 9: context window ---------- */
const CTX_SIZE = 18;
let ctxTokens = ["Hello,", "my", "name", "is", "Alex."];
let ctxDropped = 0;
const ctxWindowEl = document.getElementById("ctxWindow");
let ctxGhost = [];
function renderContext(newCount) {
  ctxWindowEl.innerHTML = "";
  const full = ctxTokens.length >= CTX_SIZE;
  ctxTokens.forEach((tok, i) => {
    const span = document.createElement("span");
    span.className = "ctx-token" + (i < 5 ? " old" : "") +
      (newCount && i >= ctxTokens.length - newCount ? " ctx-new" : "") +
      (full && i < 3 ? " ctx-risk" : "");
    span.textContent = tok;
    ctxWindowEl.appendChild(span);
  });
  document.getElementById("ctxCount").textContent = ctxTokens.length;
  document.getElementById("ctxDropped").textContent = ctxDropped;
  const ghostRow = document.getElementById("ctxGhostRow");
  ghostRow.hidden = !ctxGhost.length;
  document.getElementById("ctxGhost").textContent = ctxGhost.join(" ");
  const fill = document.getElementById("ctxGaugeFill");
  const pct = Math.round((ctxTokens.length / CTX_SIZE) * 100);
  fill.style.width = pct + "%";
  fill.style.background = pct >= 90 ? "#d96a5f" : pct >= 65 ? "#e0a458" : "#6fbf73";
}
document.getElementById("ctxAddBtn").addEventListener("click", () => {
  const words = document.getElementById("ctxInput").value.trim().split(/\s+/).filter(Boolean);
  ctxTokens = ctxTokens.concat(words);
  if (ctxTokens.length > CTX_SIZE) {
    ctxGhost = ctxTokens.slice(0, ctxTokens.length - CTX_SIZE);
    ctxDropped += ctxGhost.length;
    ctxTokens = ctxTokens.slice(ctxTokens.length - CTX_SIZE);
  }
  renderContext(words.length);
});
document.getElementById("ctxResetBtn").addEventListener("click", () => {
  ctxTokens = ["Hello,", "my", "name", "is", "Alex."];
  ctxDropped = 0;
  ctxGhost = [];
  renderContext(0);
});
renderContext();

/* ---------- Lesson 10: trap scoreboard — predict, run, auto-judge ---------- */
const TRAP_NAMES = { letters: "Letter-count", citation: "Fake citation", maths: "Rushed maths" };
let trapState = {};
try { trapState = JSON.parse(localStorage.getItem("llmLabTraps") || "{}"); } catch (e) { trapState = {}; }
function saveTraps() {
  try { localStorage.setItem("llmLabTraps", JSON.stringify(trapState)); } catch (e) {}
}
function renderTrapScore() {
  let judged = 0, correct = 0;
  document.querySelectorAll("[data-trap-row]").forEach((row) => {
    const key = row.dataset.trapRow;
    const st = trapState[key] || {};
    row.querySelectorAll(".trap-pred").forEach((b) =>
      b.classList.toggle("active", st.pred === b.dataset.pred));
    const status = row.querySelector(".trap-status");
    status.className = "trap-status" +
      (st.result === "fall" ? " fell" : st.result === "survive" ? " survived" : "");
    const ts = dynDict(currentLang).trap_status || {};
    status.textContent =
      st.result === "fall" ? (ts.fell || "Model fell for it") + (st.pred ? (st.pred === "fall" ? (ts.fell_called || " — you called it ✓") : (ts.fell_missed || " — you didn't see it coming")) : "") :
      st.result === "survive" ? (ts.survived || "Model got it right") + (st.pred ? (st.pred === "survive" ? (ts.survived_called || " — you called it ✓") : (ts.survived_missed || " — tougher than you thought")) : "") :
      st.pred ? (ts.locked || "Prediction locked in — now run it") : (ts.not_run || "Not run yet");
    if (st.result) {
      judged++;
      if (st.pred && st.pred === st.result) correct++;
    }
  });
  document.getElementById("trapTally").textContent =
    i18nT("trap_tally", { a: correct, b: judged }) || ("Predictions correct: " + correct + " of " + judged + " traps judged.");
}
document.querySelectorAll("[data-trap-row] .trap-pred").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.closest("[data-trap-row]").dataset.trapRow;
    trapState[key] = { ...(trapState[key] || {}), pred: btn.dataset.pred };
    saveTraps();
    renderTrapScore();
  });
});
document.getElementById("trapResetBtn").addEventListener("click", () => {
  trapState = {};
  saveTraps();
  renderTrapScore();
});
document.querySelectorAll(".trap-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.trap;
    if (key) {
      try { localStorage.setItem("llmLabPendingTrap", key); } catch (e) {}
    }
    document.getElementById("promptInput").value = btn.dataset.prompt;
    if (location.hash === "#playground") showLesson("playground");
    else location.hash = "playground";
    const st = trapState[key] || {};
    showError(st.pred
      ? "Trap loaded in lesson 11 — prediction locked in. Press Generate."
      : "Trap loaded in lesson 11 — next time, make a prediction in lesson 10 first. Press Generate.");
  });
});

/* Heuristic judges. Deliberately simple — the scoreboard says so. */
function judgeTrap(key, text) {
  const t = " " + text.toLowerCase() + " ";
  if (key === "letters") {
    const nums = t.match(/\d+/g);
    return nums && Number(nums[0]) === 3 ? "survive" : "fall";
  }
  if (key === "maths") {
    const five = Math.max(t.lastIndexOf("5 cents"), t.lastIndexOf("0.05"), t.lastIndexOf("$0.05"), t.lastIndexOf("five cents"));
    const ten = Math.max(t.lastIndexOf("10 cents"), t.lastIndexOf("0.10"), t.lastIndexOf("$0.10"), t.lastIndexOf("ten cents"));
    return five > ten ? "survive" : "fall";
  }
  if (key === "citation") {
    if (/no (scientific )?(paper|evidence|study|proof)|myth|misconception|cannot (find|provide)|doesn'?t exist|not (true|supported|accurate)/.test(t)) return "survive";
    if (/((19|20)\d\d)/.test(t)) return "fall"; // presented a dated "paper"
    return "fall";
  }
  return null;
}
function judgePendingTrap(answerText) {
  let key = null;
  try { key = localStorage.getItem("llmLabPendingTrap"); } catch (e) {}
  if (!key || !TRAP_NAMES[key]) return;
  try { localStorage.removeItem("llmLabPendingTrap"); } catch (e) {}
  const result = judgeTrap(key, answerText);
  if (!result) return;
  trapState[key] = { ...(trapState[key] || {}), result };
  saveTraps();
  if (result === "fall") sndWrong(); else sndCorrect();
  renderTrapScore();
  renderCapstone();
  showError("Trap judged: the model " +
    (result === "fall" ? "fell for it" : "got it right") +
    " (" + TRAP_NAMES[key] + "). See your scoreboard in lesson 10.");
}
renderTrapScore();

/* ---------- Lesson 6: inside the model — journey of a token ---------- */
const journeyTokenSel = document.getElementById("journeyToken");
ATTN_WORDS.forEach((word, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = word;
  if (i === 7) opt.selected = true;
  journeyTokenSel.appendChild(opt);
});
const layerStackEl = document.getElementById("layerStack");
for (let l = 15; l >= 0; l--) {
  const div = document.createElement("div");
  div.className = "layer-block";
  div.textContent = "Layer " + l;
  layerStackEl.appendChild(div);
}
let journeyAnim = null;

function journeyRepr(tokenIdx, layer, dim) {
  const base = Math.sin((tokenIdx + 1) * 12.9 + dim * 78.2) * 0.9;
  const drift = Math.sin(dim * 3.1 + tokenIdx * 1.7) * (layer / 15);
  const sharpen = Math.sin(dim * 9.4 + layer * 0.8 + tokenIdx) * 0.25 * (layer / 15);
  return Math.max(-1, Math.min(1, base * (1 - layer / 30) + drift + sharpen));
}

function journeyAttn(tokenIdx, layer) {
  if (tokenIdx === 0) return { 0: 1 };
  if (layer < 4) return { [tokenIdx - 1]: 0.62, [tokenIdx]: 0.23, 0: 0.15 };
  if (layer < 11) {
    const known = ATTN_HEADS[0].weights[tokenIdx] || ATTN_HEADS[1].weights[tokenIdx];
    if (known) return known;
    return { [tokenIdx - 1]: 0.4, [tokenIdx]: 0.3, 1: 0.3 };
  }
  return { [tokenIdx]: 0.46, 1: 0.27, [tokenIdx - 1]: 0.17, 0: 0.10 };
}

function barRow(container, name, frac, pctText, fillClass) {
  const row = document.createElement("div");
  row.className = fillClass;
  row.innerHTML = "<span></span><span class='bar-track'><span class='bar-fill'></span></span><span></span>";
  row.children[0].textContent = name;
  row.querySelector(".bar-fill").style.width = Math.max(2, Math.round(frac * 100)) + "%";
  row.children[2].textContent = pctText;
  container.appendChild(row);
}

/* What the token would predict if it had to answer at this layer. */
function journeyPredAt(tokenIdx, layer) {
  const nextWord = tokenIdx < ATTN_WORDS.length - 1 ? ATTN_WORDS[tokenIdx + 1] : ".";
  const confidence = 0.16 + (layer / 15) * 0.62;
  return [[nextWord, confidence], ["the", 0.30 - (layer / 15) * 0.18],
    ["a", 0.18 - (layer / 15) * 0.08], ["cat", 0.14]]
    .sort((a, b) => b[1] - a[1]);
}

/* The sharpening chart: top-1 probability across all 16 layers, with the
   marker on the layer currently being viewed. */
function drawSharpChart(tokenIdx, layer) {
  const cv = document.getElementById("sharpCanvas");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const W = cv.width, H = cv.height, L = 44, R = 14, T = 14, B = 30;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#a8b0ba";
  ctx.font = "11px Consolas, monospace";
  ctx.strokeStyle = "#313a46";
  ctx.beginPath();
  ctx.moveTo(L, T); ctx.lineTo(L, H - B); ctx.lineTo(W - R, H - B);
  ctx.stroke();
  for (const frac of [0, 0.25, 0.5, 0.75, 1]) {
    const y = T + (1 - frac) * (H - T - B);
    ctx.strokeStyle = "#232b35";
    ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - R, y); ctx.stroke();
    ctx.fillText(Math.round(frac * 100) + "%", 8, y + 4);
  }
  ctx.fillText("layer 0", L, H - 10);
  ctx.fillText("layer 15", W - R - 44, H - 10);
  const pts = [];
  for (let l = 0; l < 16; l++) {
    const [tok, p] = journeyPredAt(tokenIdx, l)[0];
    pts.push({ l, tok, p,
      x: L + (l / 15) * (W - L - R),
      y: T + (1 - p) * (H - T - B) });
  }
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach((pt, i) => i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y));
  ctx.stroke();
  ctx.lineWidth = 1;
  let prevTok = null;
  for (const pt of pts) {
    const changed = prevTok !== null && pt.tok !== prevTok;
    ctx.fillStyle = pt.l === layer ? "#e0a458" : changed ? "#fb7185" : "#22d3ee";
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.l === layer ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
    prevTok = pt.tok;
  }
  const cur = pts[layer];
  ctx.strokeStyle = "rgba(224, 164, 88, 0.5)";
  ctx.beginPath(); ctx.moveTo(cur.x, T); ctx.lineTo(cur.x, H - B); ctx.stroke();
  const first = pts[0], last = pts[15];
  document.getElementById("sharpNote").textContent =
    i18nT("sharp_note", { first: first.tok, fp: Math.round(first.p * 100), last: last.tok, lp: Math.round(last.p * 100) }) ||
    ("If it had to answer at layer 0, the best guess would be “" + first.tok + "” at " +
    Math.round(first.p * 100) + "%. By layer 15 the leader is “" + last.tok + "” at " +
    Math.round(last.p * 100) + "%. Pink dots are where the leading word changes — " +
    "early layers are still guessing grammar words; the real answer only takes the lead as context arrives.");
}

function renderJourney() {
  const tokenIdx = Number(journeyTokenSel.value);
  const layer = Number(document.getElementById("journeyLayer").value);
  document.getElementById("journeyLayerVal").textContent = layer;
  [...layerStackEl.children].forEach((el, pos) => {
    const l = 15 - pos;
    el.className = "layer-block" + (l === layer ? " current" : l < layer ? " done" : "");
  });
  const reprEl = document.getElementById("reprBars");
  reprEl.innerHTML = "";
  for (let d = 0; d < 16; d++) {
    const v = journeyRepr(tokenIdx, layer, d);
    barRow(reprEl, "n" + (d + 1), Math.abs(v), v.toFixed(2), "repr-bar");
  }
  const stage = document.getElementById("journeyStage");
  stage.textContent =
    layer === 0 ? "Layer 0: just the word itself plus its position — no context yet." :
    layer < 4 ? "Early layers: mostly neighbours and word order." :
    layer < 11 ? "Middle layers: references resolve — this is where “it” finds “cat”." :
    layer < 15 ? "Late layers: context is baked in; the answer takes shape." :
    "Final layer: this representation is converted into next-token probabilities.";

  const attnEl = document.getElementById("journeyAttn");
  attnEl.innerHTML = "";
  Object.entries(journeyAttn(tokenIdx, layer))
    .map(([k, v]) => [Number(k), v]).sort((a, b) => b[1] - a[1])
    .forEach(([t, w]) => {
      const row = document.createElement("div");
      row.className = "attn-weight";
      row.innerHTML = "<span></span><span class='bar-track'><span class='bar-fill'></span></span><span></span>";
      row.children[0].textContent = ATTN_WORDS[t];
      row.querySelector(".bar-fill").style.width = Math.round(w * 100) + "%";
      row.children[2].textContent = Math.round(w * 100) + "%";
      attnEl.appendChild(row);
    });

  const predEl = document.getElementById("journeyPred");
  predEl.innerHTML = "";
  journeyPredAt(tokenIdx, layer)
    .forEach(([tok, p]) => {
      const row = document.createElement("div");
      row.className = "attn-weight";
      row.innerHTML = "<span></span><span class='bar-track'><span class='bar-fill'></span></span><span></span>";
      row.children[0].textContent = tok;
      row.querySelector(".bar-fill").style.width = Math.max(2, Math.round(p * 100)) + "%";
      row.children[2].textContent = Math.round(p * 100) + "%";
      predEl.appendChild(row);
    });
  drawSharpChart(tokenIdx, layer);
}
journeyTokenSel.addEventListener("change", renderJourney);
document.getElementById("journeyLayer").addEventListener("input", renderJourney);
document.getElementById("journeyResetBtn").addEventListener("click", () => {
  if (journeyAnim) clearInterval(journeyAnim);
  document.getElementById("journeyLayer").value = 0;
  renderJourney();
});
document.getElementById("journeyPlayBtn").addEventListener("click", () => {
  if (journeyAnim) clearInterval(journeyAnim);
  const slider = document.getElementById("journeyLayer");
  if (Number(slider.value) >= 15) slider.value = 0;
  journeyAnim = setInterval(() => {
    slider.value = Number(slider.value) + 1;
    renderJourney();
    if (Number(slider.value) >= 15) clearInterval(journeyAnim);
  }, 420);
});
renderJourney();

/* ---------- Lesson 7: parsing — how your question is read ---------- */
const PARSE_ROLES = {
  asking: ["#e0a458", "asking word"],
  subject: ["#7fb069", "subject — who/what it's about"],
  action: ["#5da9c4", "action / verb"],
  content: ["#b8b26a", "content word"],
  negation: ["#d96a5f", "negation — flips meaning"],
  constraint: ["#c98bb9", "format / constraint"],
  other: ["#69707c", "glue word"],
};
const PARSE_PRESETS = [
  {
    words: ["How", "many", "letter", "r's", "are", "in", "the", "word", "strawberry?", "Answer", "with", "just", "the", "number."],
    roles: ["asking", "asking", "content", "content", "action", "other", "other", "content", "content", "constraint", "other", "constraint", "other", "constraint"],
    links: [[1, 8, "“how many” needs a target — it must find what is being counted"],
      [3, 8, "the letters belong to this word"], [9, 13, "the reply format is constrained"]],
    summary: "<strong>What it's asking:</strong> count something.<br>Target: the letter r inside “strawberry”. Constraint: reply with just the number.<br><strong>Where it goes wrong:</strong> the count target is a letter, but the model reads tokens, not letters (lesson 1) — this exact question is a trap in lesson 10.",
  },
  {
    words: ["Why", "does", "the", "Moon", "not", "fall", "down?"],
    roles: ["asking", "action", "other", "subject", "negation", "action", "other"],
    links: [[4, 5, "“not” must find and cancel the falling"], [0, 5, "“why” asks for the cause of this (non-)event"], [3, 5, "subject of the action"]],
    summary: "<strong>What it's asking:</strong> explain a cause.<br>Subject: the Moon. Event: falling — negated. So the real question is “what keeps it up?”, and a parse that drops the <em>not</em> answers the opposite question.",
  },
  {
    words: ["Write", "a", "haiku", "about", "autumn", "leaves,", "but", "do", "not", "use", "the", "word", "fall."],
    roles: ["action", "other", "constraint", "other", "content", "content", "other", "action", "negation", "action", "other", "content", "content"],
    links: [[8, 9, "“not” cancels this action"], [2, 0, "the form the writing must take"], [4, 5, "the topic"], [12, 8, "the forbidden word is the negation's target"]],
    summary: "<strong>What it's asking:</strong> create text, with two constraints.<br>Form: a haiku. Topic: autumn leaves. Forbidden: the word “fall” — awkward, because autumn writing reaches for it, and the model must police its own next-token picks (lesson 5) against a rule set here, at parse time.",
  },
  {
    words: ["Time", "flies", "like", "an", "arrow."],
    roles: ["subject", "action", "other", "other", "content"],
    links: [[0, 1, "subject does this"], [1, 4, "compared with this"]],
    summary: "<strong>What it's asking:</strong> nothing — it's a statement, in reading A: <em>time</em> (subject) <em>flies</em> (verb) like an arrow: time passes quickly.<br>Hold that parse and look at the next preset: identical shape, different reading. The model must bet on one — it cannot hold both.",
  },
  {
    words: ["Fruit", "flies", "like", "a", "banana."],
    roles: ["subject", "content", "action", "other", "content"],
    links: [[0, 1, "these things"], [1, 2, "the insects do this"], [2, 4, "they enjoy this"]],
    summary: "<strong>What it's asking:</strong> also a statement — but here <em>flies</em> is a noun (the insects), <em>like</em> is the verb, and <em>fruit</em> describes which flies.<br>Same five-slot shape as “Time flies…”, opposite roles for the same word. Context — one changed word — flips the parse. That flip is attention's job (lesson 4), and when it bets wrong, the answer is fluent nonsense about flying fruit.",
  },
];
let parseStage = 1;
let parseData = PARSE_PRESETS[0];

function parseRoleOf(word, i, words) {
  const w = word.toLowerCase().replace(/[^a-z']/g, "");
  if (["how", "why", "what", "when", "where", "who", "which", "can", "could"].includes(w)) return "asking";
  if (["not", "never", "no", "don't", "doesn't", "can't", "won't", "n't"].includes(w)) return "negation";
  if (["just", "only", "haiku", "list", "number", "briefly", "sentence", "paragraph"].includes(w)) return "constraint";
  if (["write", "give", "tell", "explain", "count", "describe", "name", "show", "make", "use", "fall", "falls", "flies", "like", "is", "are", "does", "do"].includes(w)) return "action";
  if (["the", "a", "an", "in", "on", "of", "with", "about", "but", "and", "or", "to"].includes(w)) return "other";
  return i <= 2 ? "subject" : "content";
}
function parseCustom(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const roles = words.map((w, i) => parseRoleOf(w, i, words));
  const links = [];
  const askIdx = roles.indexOf("asking");
  const negIdx = roles.indexOf("negation");
  const lastContent = roles.map((r, i) => [r, i]).filter(([r]) => r === "content" || r === "subject").pop();
  if (askIdx >= 0 && lastContent) links.push([askIdx, lastContent[1], "the asking word must find its target"]);
  if (negIdx >= 0) {
    const verb = roles.findIndex((r, i) => i > negIdx && r === "action");
    if (verb >= 0) links.push([negIdx, verb, "the negation must find what it cancels"]);
  }
  const type = askIdx >= 0 ? "a question (asking word: “" + words[askIdx] + "”)"
    : roles.includes("action") ? "an instruction (it leads with an action word)" : "a statement";
  return {
    words, roles, links,
    summary: "<strong>What it's asking:</strong> this looks like " + type + "." +
      (negIdx >= 0 ? "<br>It contains a negation (“" + words[negIdx] + "”) — the single most dropped word in a bad parse." : "") +
      "<br><em>Rough schematic parse from simple word rules — a real model's version is learned, layered, and never written down.</em>",
  };
}
function localizedParseRoles() {
  const loc = dynDict(currentLang).parse_roles || {};
  const out = {};
  for (const [key, [color, label]] of Object.entries(PARSE_ROLES)) out[key] = [color, loc[key] || label];
  return out;
}
function getParsePreset(i) {
  const base = PARSE_PRESETS[i];
  const dyn = dynDict(currentLang);
  if (!base) return base;
  const summary = (dyn.parse_summaries || [])[i];
  const linkLabels = (dyn.parse_link_labels || [])[i];
  if (!summary && !linkLabels) return base;
  return { ...base, summary: summary || base.summary,
    links: base.links.map((l, j) => [l[0], l[1], (linkLabels && linkLabels[j]) || l[2]]) };
}
function renderParse() {
  const roles = localizedParseRoles();
  const legend = document.getElementById("parseLegend");
  legend.innerHTML = "";
  for (const [color, label] of Object.values(roles)) {
    const s = document.createElement("span");
    s.className = "parse-legend-chip";
    s.innerHTML = "<span class='parse-swatch'></span>";
    s.querySelector(".parse-swatch").style.background = color;
    s.appendChild(document.createTextNode(label));
    legend.appendChild(s);
  }
  const box = document.getElementById("parseTokens");
  box.innerHTML = "";
  parseData.words.forEach((w, i) => {
    const s = document.createElement("span");
    s.className = "attn-token parse-word";
    s.style.background = roles[parseData.roles[i]][0];
    s.textContent = w;
    s.title = roles[parseData.roles[i]][1];
    box.appendChild(s);
  });
  const linksEl = document.getElementById("parseLinks");
  linksEl.innerHTML = "";
  if (parseStage >= 2) {
    if (!parseData.links.length) {
      linksEl.innerHTML = "<p class='hint'>No strong links found by the simple rules — try a preset.</p>";
    }
    for (const [from, to, label] of parseData.links) {
      const row = document.createElement("div");
      row.className = "attn-weight";
      row.innerHTML = "<span></span><span class='bar-track'><span class='bar-fill'></span></span><span></span>";
      row.children[0].textContent = parseData.words[from] + " → " + parseData.words[to];
      row.querySelector(".bar-fill").style.width = "85%";
      row.children[2].textContent = "";
      const cap = document.createElement("p");
      cap.className = "hint parse-link-label";
      cap.textContent = label;
      linksEl.appendChild(row);
      linksEl.appendChild(cap);
    }
  }
  const summary = document.getElementById("parseSummary");
  summary.hidden = parseStage < 3;
  if (parseStage >= 3) summary.innerHTML = parseData.summary;
  document.querySelectorAll(".parse-stage-btn").forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.stage) === parseStage));
}
document.querySelectorAll(".parse-stage-btn").forEach((b) =>
  b.addEventListener("click", () => { parseStage = Number(b.dataset.stage); renderParse(); }));
document.getElementById("parseSelect").addEventListener("change", (e) => {
  parseData = getParsePreset(Number(e.target.value));
  renderParse();
});
document.getElementById("parseCustomBtn").addEventListener("click", () => {
  const text = document.getElementById("parseInput").value.trim();
  if (!text) { showError("Type your own question first."); return; }
  parseData = parseCustom(text);
  renderParse();
});
renderParse();

/* ---------- Lesson 8: a real toy model (trained in the page) ---------- */
const TOY_DEFAULT_SENTENCES = [
  "the cat sat", "a cat sat", "the red cat sat", "the big cat sat",
  "the dog ran", "a dog ran", "the red dog ran", "the big dog ran",
  "the bird flew", "a bird flew", "the red bird flew", "the big bird flew",
  "the fish swam", "a fish swam", "the red fish swam", "the big fish swam",
];
function loadToySentences() {
  try {
    const saved = JSON.parse(localStorage.getItem("llmLabToySentences") || "null");
    if (Array.isArray(saved) && saved.length >= 2 &&
        saved.every((s) => typeof s === "string" && s.trim().split(/\s+/).length >= 2)) {
      return saved.slice(0, 24);
    }
  } catch (e) { /* fall through to defaults */ }
  return TOY_DEFAULT_SENTENCES;
}
const TOY_SENTENCES = loadToySentences().map((s) =>
  s.toLowerCase().replace(/[^a-z0-9' ]/g, "").split(/\s+/).filter(Boolean));
const TOY_VOCAB = [...new Set(TOY_SENTENCES.flat())];
const TOY_HIDDEN = 16;   // hidden layer 1
const TOY_HIDDEN2 = 12;  // hidden layer 2
const toyIdx = Object.fromEntries(TOY_VOCAB.map((w, i) => [w, i]));
const TOY_PAIRS = [];
for (const sent of TOY_SENTENCES)
  for (let i = 0; i < sent.length - 1; i++) TOY_PAIRS.push([toyIdx[sent[i]], toyIdx[sent[i + 1]]]);

let toySeed = 42;
function toyRand() {
  toySeed = (toySeed * 1664525 + 1013904223) >>> 0;
  return (toySeed / 4294967296) * 2 - 1;
}
let toyWin, toyB1, toyW12, toyB12, toyWout, toyB2, toyEpoch = 0, toyTimer = null;
function toyResetWeights() {
  toySeed = 42;
  toyWin = TOY_VOCAB.map(() => Array.from({ length: TOY_HIDDEN }, () => toyRand() * 0.6));
  toyB1 = Array(TOY_HIDDEN).fill(0);
  toyW12 = Array.from({ length: TOY_HIDDEN }, () => Array.from({ length: TOY_HIDDEN2 }, () => toyRand() * 0.6));
  toyB12 = Array(TOY_HIDDEN2).fill(0);
  toyWout = Array.from({ length: TOY_HIDDEN2 }, () => TOY_VOCAB.map(() => toyRand() * 0.6));
  toyB2 = TOY_VOCAB.map(() => 0);
  toyEpoch = 0;
  document.getElementById("toyEpoch").textContent = "0";
  document.getElementById("toyLoss").textContent = "not trained";
}
function toyForward(inputIdx) {
  const hidden = toyWin[inputIdx].map((v, j) => Math.tanh(v + toyB1[j]));
  const hidden2 = toyB12.map((b, k) =>
    Math.tanh(b + hidden.reduce((s, h, j) => s + h * toyW12[j][k], 0)));
  const logits = TOY_VOCAB.map((_, o) =>
    toyB2[o] + hidden2.reduce((s, h, k) => s + h * toyWout[k][o], 0));
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const total = exps.reduce((a, b) => a + b, 0);
  return { hidden, hidden2, probs: exps.map((e) => e / total), logits };
}
function toyTrainEpochs(n, lr) {
  let totalLoss = 0;
  for (let e = 0; e < n; e++) {
    for (const [inputIdx, target] of TOY_PAIRS) {
      const { hidden, hidden2, probs } = toyForward(inputIdx);
      totalLoss += -Math.log(Math.max(1e-9, probs[target]));
      const dLogits = probs.slice();
      dLogits[target] -= 1;
      // Backprop into hidden layer 2, updating output weights.
      const dHidden2 = Array(TOY_HIDDEN2).fill(0);
      for (let k = 0; k < TOY_HIDDEN2; k++) {
        for (let o = 0; o < TOY_VOCAB.length; o++) {
          dHidden2[k] += dLogits[o] * toyWout[k][o];
          toyWout[k][o] -= lr * dLogits[o] * hidden2[k];
        }
      }
      for (let o = 0; o < TOY_VOCAB.length; o++) toyB2[o] -= lr * dLogits[o];
      // Backprop into hidden layer 1, updating the inter-layer weights.
      const dHidden = Array(TOY_HIDDEN).fill(0);
      for (let k = 0; k < TOY_HIDDEN2; k++) {
        const grad2 = dHidden2[k] * (1 - hidden2[k] * hidden2[k]);
        toyB12[k] -= lr * grad2;
        for (let j = 0; j < TOY_HIDDEN; j++) {
          dHidden[j] += grad2 * toyW12[j][k];
          toyW12[j][k] -= lr * grad2 * hidden[j];
        }
      }
      for (let j = 0; j < TOY_HIDDEN; j++) {
        const grad = dHidden[j] * (1 - hidden[j] * hidden[j]);
        toyWin[inputIdx][j] -= lr * grad;
        toyB1[j] -= lr * grad;
      }
    }
    toyEpoch++;
  }
  return totalLoss / (n * TOY_PAIRS.length);
}
const toyInputSel = document.getElementById("toyInput");
TOY_VOCAB.forEach((word) => {
  const opt = document.createElement("option");
  opt.value = word;
  opt.textContent = word;
  if (word === "cat") opt.selected = true;
  toyInputSel.appendChild(opt);
});
let toyUpdate3D = null;
function toyRender() {
  const inputIdx = toyIdx[toyInputSel.value];
  const { hidden, hidden2, probs, logits } = toyForward(inputIdx);
  // Most frequent observed next word for this input in the training sentences.
  const observed = {};
  for (const [inp, tgt] of TOY_PAIRS) if (inp === inputIdx) observed[tgt] = (observed[tgt] || 0) + 1;
  const correctIdx = Number(Object.entries(observed).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0);
  const topOutForMath = probs.indexOf(Math.max(...probs));
  const contribLines = hidden2
    .map((h, k) => [k, h, h * toyWout[k][topOutForMath]])
    .sort((a, b) => Math.abs(b[2]) - Math.abs(a[2])).slice(0, 4)
    .map(([k, h, c]) => "  h2-" + (k + 1) + ": " + h.toFixed(3) + " × W " + toyWout[k][topOutForMath].toFixed(3) + " = " + c.toFixed(3))
    .join("\n");
  document.getElementById("toyMath").textContent =
    "Forward pass for input “" + toyInputSel.value + "”:\n" +
    "z(" + TOY_VOCAB[topOutForMath] + ") = Σ h·W + b = " + logits[topOutForMath].toFixed(3) +
    "   →   p = softmax(z) = " + (probs[topOutForMath] * 100).toFixed(1) + "%\n" +
    "Biggest contributions to that score (activation × weight):\n" + contribLines + "\n\n" +
    "If the correct next word is “" + TOY_VOCAB[correctIdx] + "” (as in training):\n" +
    "loss = −log p(" + TOY_VOCAB[correctIdx] + ") = −log(" + probs[correctIdx].toFixed(4) + ") = " +
    (-Math.log(Math.max(1e-9, probs[correctIdx]))).toFixed(3) + "\n" +
    "gradient at that output = p − 1 = " + (probs[correctIdx] - 1).toFixed(3) +
    "  →  weights into “" + TOY_VOCAB[correctIdx] + "” get nudged up by η × " +
    Math.abs(probs[correctIdx] - 1).toFixed(3) + " × h. Wrong favourites get pushed down by η × their p.";
  const predEl = document.getElementById("toyPred");
  predEl.innerHTML = "";
  TOY_VOCAB.map((w, i) => [w, probs[i]]).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .forEach(([word, p]) => {
      const row = document.createElement("div");
      row.className = "attn-weight";
      row.innerHTML = "<span></span><span class='bar-track'><span class='bar-fill'></span></span><span></span>";
      row.children[0].textContent = word;
      row.querySelector(".bar-fill").style.width = Math.max(2, Math.round(p * 100)) + "%";
      row.children[2].textContent = (p * 100).toFixed(1) + "%";
      predEl.appendChild(row);
    });
  const topOut = probs.indexOf(Math.max(...probs));
  const contribs2 = hidden2.map((h, k) => [k, Math.abs(h * toyWout[k][topOut])])
    .sort((a, b) => b[1] - a[1]).slice(0, 3);
  const topH2 = contribs2[0][0];
  const contribs1 = hidden.map((h, j) => [j, Math.abs(h * toyW12[j][topH2])])
    .sort((a, b) => b[1] - a[1]).slice(0, 3);
  document.getElementById("toyPath").textContent =
    "Strongest route: “" + toyInputSel.value + "” → layer-1 nodes " +
    contribs1.map(([j]) => "h1-" + (j + 1)).join(", ") +
    " → layer-2 nodes " + contribs2.map(([k]) => "h2-" + (k + 1)).join(", ") +
    " → “" + TOY_VOCAB[topOut] + "” (" + (probs[topOut] * 100).toFixed(1) + "%). " +
    "Every node fires at once — this is the busiest route, not the only one.";
  if (toyUpdate3D) toyUpdate3D(inputIdx, hidden, hidden2, probs,
    contribs1.map(([j]) => j), contribs2.map(([k]) => k), topOut);
}
document.getElementById("toyTrainBtn").addEventListener("click", () => {
  if (toyTimer) return;
  const btn = document.getElementById("toyTrainBtn");
  btn.disabled = true;
  toyTimer = setInterval(() => {
    const loss = toyTrainEpochs(15, 0.4);
    document.getElementById("toyEpoch").textContent = toyEpoch;
    document.getElementById("toyLoss").textContent = loss.toFixed(3);
    toyRender();
    if (toyEpoch >= 1200) {
      clearInterval(toyTimer);
      toyTimer = null;
      btn.disabled = false;
    }
  }, 60);
});
document.getElementById("toyResetBtn").addEventListener("click", () => {
  if (toyTimer) { clearInterval(toyTimer); toyTimer = null; }
  document.getElementById("toyTrainBtn").disabled = false;
  toyResetWeights();
  toyRender();
});
toyInputSel.addEventListener("change", toyRender);

/* Train-on-your-own-sentences controls (persist + reload rebuilds the 3D view). */
const toyCustomInput = document.getElementById("toyCustomInput");
toyCustomInput.value = loadToySentences().join("\n");
document.getElementById("toyCustomApply").addEventListener("click", () => {
  const lines = toyCustomInput.value.split("\n").map((s) => s.trim()).filter(Boolean);
  const valid = lines.filter((s) => s.split(/\s+/).length >= 2);
  if (valid.length < 2) {
    showError("Write at least two sentences, each with at least two words.");
    return;
  }
  try { localStorage.setItem("llmLabToySentences", JSON.stringify(valid.slice(0, 24))); } catch (e) {}
  location.reload();
});
document.getElementById("toyCustomReset").addEventListener("click", () => {
  try { localStorage.removeItem("llmLabToySentences"); } catch (e) {}
  location.reload();
});
toyResetWeights();

async function initToy3D() {
  const box = document.getElementById("toyCanvas");
  let THREE;
  try {
    THREE = await import("three");
  } catch (err) {
    document.getElementById("toyFallback").hidden = false;
    return;
  }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1117);
  const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100);
  camera.position.set(0, 0.3, 6.8);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(box.clientWidth, box.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  box.appendChild(renderer.domElement);
  const group = new THREE.Group();
  scene.add(group);

  function labelSprite(text) {
    const c = document.createElement("canvas");
    c.width = 320; c.height = 120;
    const ctx = c.getContext("2d");
    // Dark pill behind the text so labels stay readable over nodes and lines.
    ctx.fillStyle = "rgba(10, 14, 19, 0.88)";
    ctx.strokeStyle = "rgba(224, 164, 88, 0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(28, 22, 264, 76, 18);
    ctx.fill();
    ctx.stroke();
    ctx.font = "700 46px Segoe UI, sans-serif";
    ctx.fillStyle = "#f2ede4";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 160, 62);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(c), transparent: true, depthTest: false }));
    sprite.scale.set(0.82, 0.31, 1);
    sprite.renderOrder = 10;
    return sprite;
  }
  function layerPositions(count, x) {
    return Array.from({ length: count }, (_, i) => {
      const t = count === 1 ? 0.5 : i / (count - 1);
      return new THREE.Vector3(x, 1.9 - t * 3.8, Math.sin(t * Math.PI) * 0.55 - 0.27);
    });
  }
  const inPos = layerPositions(TOY_VOCAB.length, -3.15);
  const hidPos = layerPositions(TOY_HIDDEN, -1.05);
  const hid2Pos = layerPositions(TOY_HIDDEN2, 1.05);
  const outPos = layerPositions(TOY_VOCAB.length, 3.15);

  function makeNodes(positions, labels, baseColor) {
    return positions.map((pos, i) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 18, 18),
        new THREE.MeshBasicMaterial({ color: baseColor }));
      mesh.position.copy(pos);
      group.add(mesh);
      if (labels) {
        const label = labelSprite(labels[i]);
        const midLayer = Math.abs(pos.x) < 2;
        label.position.set(
          pos.x + (midLayer ? 0 : pos.x < 0 ? -0.52 : 0.52),
          pos.y + (midLayer ? 0.27 : 0.05), pos.z);
        group.add(label);
      }
      return mesh;
    });
  }
  const inputNodes = makeNodes(inPos, TOY_VOCAB, 0x5da9c4);
  const hiddenNodes = makeNodes(hidPos,
    Array.from({ length: TOY_HIDDEN }, (_, i) => "h1-" + (i + 1)), 0x7fb069);
  const hidden2Nodes = makeNodes(hid2Pos,
    Array.from({ length: TOY_HIDDEN2 }, (_, i) => "h2-" + (i + 1)), 0x9bc49b);
  const outputNodes = makeNodes(outPos, TOY_VOCAB, 0xc98bb9);

  // Faint all-to-all edges between consecutive layers.
  const faintPts = [];
  for (const a of inPos) for (const b of hidPos) faintPts.push(a, b);
  for (const a of hidPos) for (const b of hid2Pos) faintPts.push(a, b);
  for (const a of hid2Pos) for (const b of outPos) faintPts.push(a, b);
  const faintGeo = new THREE.BufferGeometry().setFromPoints(faintPts);
  group.add(new THREE.LineSegments(faintGeo,
    new THREE.LineBasicMaterial({ color: 0x3d4a5a, transparent: true, opacity: 0.16 })));

  let highlight = new THREE.LineSegments(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: theme3D.accent, transparent: true, opacity: 0.95 }));
  group.add(highlight);

  // Starfield backdrop + bloom (falls back to plain rendering if addons fail).
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(420 * 3);
  for (let i = 0; i < 420; i++) {
    const r = 9 + Math.random() * 9;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    starPos[i * 3 + 2] = r * Math.cos(ph) - 4;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const toyStarMat = new THREE.PointsMaterial({
    color: theme3D.star, size: 0.045, transparent: true, opacity: 0.75 });
  scene.add(new THREE.Points(starGeo, toyStarMat));
  scene.background = new THREE.Color(theme3D.bg);
  let composer = null;
  try {
    const { EffectComposer } = await import("three/addons/postprocessing/EffectComposer.js");
    const { RenderPass } = await import("three/addons/postprocessing/RenderPass.js");
    const { UnrealBloomPass } = await import("three/addons/postprocessing/UnrealBloomPass.js");
    const { OutputPass } = await import("three/addons/postprocessing/OutputPass.js");
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(box.clientWidth, box.clientHeight), 0.6, 0.7, 0.5));
    composer.addPass(new OutputPass());
  } catch (err) { composer = null; }

  // Energy pulses that travel the strongest route.
  const pulses = [];
  for (let i = 0; i < 14; i++) {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffc98a }));
    dot.visible = false;
    group.add(dot);
    pulses.push(dot);
  }
  let pulseRoutes = [];
  themeRecolorers.push((p) => {
    scene.background = new THREE.Color(p.bg);
    toyStarMat.color.setHex(p.star);
    highlight.material.color.setHex(p.accent);
    for (const dot of pulses) dot.material.color.setHex(p.accent);
    toyRender();
  });

  toyUpdate3D = (inputIdx, hidden, hidden2, probs, topHidden1, topHidden2, topOut) => {
    inputNodes.forEach((node, i) => {
      const active = i === inputIdx;
      node.scale.setScalar(active ? 1.9 : 0.85);
      node.material.color.setHex(active ? theme3D.accent : theme3D.input);
    });
    hiddenNodes.forEach((node, j) => {
      node.scale.setScalar(0.6 + Math.abs(hidden[j]) * 1.5);
      node.material.color.setHex(topHidden1.includes(j) ? theme3D.accent : theme3D.hidden);
    });
    hidden2Nodes.forEach((node, k) => {
      node.scale.setScalar(0.6 + Math.abs(hidden2[k]) * 1.5);
      node.material.color.setHex(topHidden2.includes(k) ? theme3D.accent : theme3D.hidden2);
    });
    outputNodes.forEach((node, o) => {
      node.scale.setScalar(0.6 + probs[o] * 2.4);
      node.material.color.setHex(o === topOut ? theme3D.accent : theme3D.output);
    });
    const pts = [];
    pulseRoutes = [];
    for (const j of topHidden1) {
      pts.push(inPos[inputIdx], hidPos[j]);
      pulseRoutes.push([inPos[inputIdx], hidPos[j]]);
      for (const k of topHidden2) {
        pts.push(hidPos[j], hid2Pos[k]);
        pulseRoutes.push([hidPos[j], hid2Pos[k]]);
      }
    }
    for (const k of topHidden2) {
      pts.push(hid2Pos[k], outPos[topOut]);
      pulseRoutes.push([hid2Pos[k], outPos[topOut]]);
    }
    highlight.geometry.dispose();
    highlight.geometry = new THREE.BufferGeometry().setFromPoints(pts);
  };
  toyRender();

  let dragging = false, px = 0, py = 0, ry = 0, rx = 0.12;
  const el = renderer.domElement;
  el.style.touchAction = "none";
  el.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; el.setPointerCapture(e.pointerId); });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    ry += (e.clientX - px) * 0.008;
    rx += (e.clientY - py) * 0.006;
    rx = Math.max(-0.9, Math.min(0.9, rx));
    px = e.clientX; py = e.clientY;
  });
  el.addEventListener("pointerup", () => { dragging = false; });
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    camera.position.z = Math.max(3.2, Math.min(11, camera.position.z + e.deltaY * 0.01));
  }, { passive: false });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastTick = performance.now();
  function tick(now) {
    requestAnimationFrame(tick);
    const delta = Math.min(0.05, (now - lastTick) / 1000);
    lastTick = now;
    if (!dragging && !reduceMotion) ry += 0.0012;
    group.rotation.y = ry;
    group.rotation.x = rx;
    const t = now / 1000;
    const active = toyTimer ? 1 : 0;
    // Send energy pulses along the strongest route, faster while training.
    pulses.forEach((dot, i) => {
      if (!pulseRoutes.length) { dot.visible = false; return; }
      const route = pulseRoutes[i % pulseRoutes.length];
      const speed = 0.25 + active * 0.55;
      const p = (t * speed + i * 0.23) % 1;
      dot.position.lerpVectors(route[0], route[1], p);
      dot.visible = true;
      const s = 0.7 + Math.sin(p * Math.PI) * 0.9;
      dot.scale.setScalar(s);
    });
    if (box.clientWidth > 0) { if (composer) composer.render(); else renderer.render(scene, camera); } // skip GPU work while the lesson is hidden
  }
  requestAnimationFrame(tick);
  window.addEventListener("resize", () => {
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(box.clientWidth, box.clientHeight);
    if (composer) composer.setSize(box.clientWidth, box.clientHeight);
  });
}
initToy3D();

/* ---------- Course progress, next-lesson flow, checkpoint quizzes ---------- */
const LESSON_ORDER = ["tokens", "embeddings", "training", "attention", "probabilities",
  "journey", "parsing", "toymodel", "context", "limits", "playground", "scaling",
  "assistant", "rag", "capstone"];
const LESSON_TITLES = {
  tokens: "Tokens", embeddings: "Embeddings", training: "Training", attention: "Attention",
  probabilities: "Next token", journey: "Inside the model", parsing: "Parsing a question",
  toymodel: "Toy model 3D", context: "Context", limits: "Limits",
  playground: "Live model", scaling: "Small vs premium", assistant: "Predictor to assistant",
  rag: "Finding answers (RAG)", capstone: "Capstone",
};
let completedLessons = new Set();
try {
  completedLessons = new Set(JSON.parse(localStorage.getItem("llmLabProgress") || "[]"));
} catch (e) { /* fresh start */ }

function renderProgress() {
  document.getElementById("progressLabel").textContent =
    i18nT("progress", { a: completedLessons.size, b: LESSON_ORDER.length }) ||
    ("Progress " + completedLessons.size + "/" + LESSON_ORDER.length);
  document.getElementById("progressFill").style.width =
    (completedLessons.size / LESSON_ORDER.length * 100) + "%";
  document.querySelectorAll(".complete-btn").forEach((btn) => {
    const done = completedLessons.has(btn.dataset.lesson);
    btn.classList.toggle("is-complete", done);
    const label = btn.querySelector(".btn-label");
    const text = done ? (i18nT("completed_btn") || "Completed ✓ — click to undo") : (i18nT("complete_btn") || "Mark lesson complete");
    if (label) label.textContent = text; else btn.textContent = text;
  });
  document.querySelectorAll(".lesson-nav a").forEach((a) => {
    const id = a.getAttribute("href").slice(1);
    const check = a.querySelector(".nav-check");
    if (check) check.hidden = !completedLessons.has(id);
  });
  const quizCount = document.getElementById("quizOpenCount");
  if (quizCount) quizCount.textContent = completedLessons.size + "/" + LESSON_ORDER.length;
  document.querySelectorAll(".quiz-group-status").forEach((el) => {
    const done = completedLessons.has(el.dataset.lesson);
    el.classList.toggle("done", done);
    el.textContent = done ? (i18nT("completed_status") || "Completed ✓") : (i18nT("not_completed") || "Not completed");
  });
}
function markComplete(id, silent) {
  if (completedLessons.has(id)) return;
  completedLessons.add(id);
  try { localStorage.setItem("llmLabProgress", JSON.stringify([...completedLessons])); } catch (e) {}
  renderProgress();
  if (!silent) {
    if (completedLessons.size >= LESSON_ORDER.length) sndFanfare(); else sndComplete();
  }
  if (!silent) showError(i18nT("lesson_complete_toast", { title: lessonTitle(id), a: completedLessons.size, b: LESSON_ORDER.length }) ||
    ("Lesson complete: " + lessonTitle(id) + " — " +
    completedLessons.size + " of " + LESSON_ORDER.length + " done."));
}

const QUIZZES = {
  tokens: [
    { q: "What does the model actually read?", opts: ["Whole words", "Tokens (chunks of text)", "Letters"], a: 1, why: "It reads tokens — chunks that may be a word, part of a word, or punctuation." },
    { q: "Why do models often fail at counting letters in a word?", opts: ["They are bad at maths", "They see tokens, not letters", "The word is too long"], a: 1, why: "A word may be one token, so its letters were never separate inputs." },
  ],
  embeddings: [
    { q: "Two words sitting close in embedding space mean…", opts: ["They are spelled alike", "They appear in similar sentences", "They are the same length"], a: 1, why: "Closeness = similar usage contexts, learned in training." },
    { q: "king − man + woman lands near…", opts: ["car", "queen", "apple"], a: 1, why: "Directions in the space carry relationships like royalty and gender." },
  ],
  training: [
    { q: "What does the loss measure?", opts: ["How big the model is", "How wrong the prediction was", "How fast it runs"], a: 1, why: "Loss is the error score — gradient descent walks it downhill." },
    { q: "Does the model learn from your chat with it?", opts: ["Yes, permanently", "Only for paid users", "No — training is already finished"], a: 2, why: "Chatting is inference; weights do not change." },
  ],
  attention: [
    { q: "In Head A, what does “it” pay most attention to?", opts: ["mat", "cat", "tired"], a: 1, why: "Reference heads link pronouns back to their noun." },
    { q: "Can a token attend to words that come after it?", opts: ["Yes", "No — only backwards", "Only verbs can"], a: 1, why: "The causal mask blocks the future; prediction can't peek." },
  ],
  probabilities: [
    { q: "Raising the temperature makes the picks…", opts: ["Always correct", "More random and wild", "Faster"], a: 1, why: "Higher T flattens the distribution, so long shots get picked more." },
    { q: "Sampling means the next token is chosen…", opts: ["Alphabetically", "By rolling a weighted die over probabilities", "By a human"], a: 1, why: "Softmax gives odds; generation samples from them." },
  ],
  journey: [
    { q: "Which layers does a token pass through?", opts: ["Only the ones it needs", "Every layer, in order", "One random layer"], a: 1, why: "All tokens traverse the full stack; attention and MLP rewrite each one per layer." },
    { q: "What comes out of the final layer?", opts: ["A finished sentence", "Scores for the next token", "A picture"], a: 1, why: "The final representation becomes next-token probabilities." },
  ],
  parsing: [
    { q: "Inside the model, the grammar rules live in…", opts: ["A built-in dictionary of nouns and verbs", "Nowhere — parsing emerges from attention and layers", "The tokenizer"], a: 1, why: "No symbolic parser exists; structure is built by the same mechanisms from lessons 4 and 6." },
    { q: "“Fruit flies like a banana” is dangerous for a model because…", opts: ["Bananas are rare in training data", "The same word shape needs the opposite parse, and it must bet on one", "It contains a negation"], a: 1, why: "Two valid parses, one winner — a wrong bet upstream becomes a fluent wrong answer." },
  ],
  toymodel: [
    { q: "After training, why does “cat” predict “sat” so strongly?", opts: ["It's programmed in", "Its sentences always pair cat with sat", "Cats sit in real life"], a: 1, why: "The model only knows patterns from its training sentences." },
    { q: "The amber route shows…", opts: ["The only path taken", "The busiest connections — all nodes still fire", "A secret shortcut"], a: 1, why: "Every node fires at once; the route is the strongest contributions." },
  ],
  context: [
    { q: "When the context window fills up, what happens to the oldest tokens?", opts: ["They are summarised", "They fall out and no longer exist for the model", "They are saved to disk"], a: 1, why: "Out of the window = absent from the next forward pass." },
    { q: "Why can long chats start ignoring your first instruction?", opts: ["The model gets bored", "It may have left the context window", "The internet drops it"], a: 1, why: "Early tokens can literally scroll out of what the model sees." },
  ],
  limits: [
    { q: "Why does the model hallucinate?", opts: ["It lies on purpose", "It was trained for plausible text, not verified truth", "It is broken"], a: 1, why: "Likelihood is the objective; fluent inventions fill the gaps." },
    { q: "Ask for a scientific paper proving a made-up claim and it may…", opts: ["Refuse every time", "Invent a convincing fake citation", "Search the web"], a: 1, why: "Citations are a style it can imitate without any database." },
  ],
  playground: [
    { q: "Where does the live model run?", opts: ["In the cloud", "On your own computer", "Inside the browser tab only"], a: 1, why: "Ollama serves llama3.2:1b locally — nothing leaves this machine." },
    { q: "Low temperature (near 0) makes output…", opts: ["More random", "Safer and more repetitive", "Longer"], a: 1, why: "Low T sharpens the distribution toward the favourite." },
  ],
  scaling: [
    { q: "A premium model is smarter mainly because…", opts: ["It uses a different, secret kind of maths", "Same recipe at far greater scale, plus extra polish training", "It looks answers up in a database"], a: 1, why: "Tokens, attention and next-token prediction are the same; parameters, data and post-training are not." },
    { q: "Someone quotes an exact parameter count for a premium model. You should…", opts: ["Believe it — all specs are public", "Ask for the official source — makers don't publish it, so it's an estimate", "Multiply your local model's count by ten"], a: 1, why: "Premium makers don't disclose parameter counts; honest comparisons label them estimates." },
  ],
  assistant: [
    { q: "A base model given “What is the capital of France?” often…", opts: ["Answers “Paris” and stops", "Continues with more quiz questions", "Refuses"], a: 1, why: "Prediction without instruction tuning continues the pattern of question-shaped text." },
    { q: "Refusals and helpful tone mostly come from…", opts: ["Pre-training data volume", "Preference training after instruction tuning", "A bigger context window"], a: 1, why: "Stage 3 trains tastes: helpful, honest, safe — layered over ability." },
  ],
  rag: [
    { q: "In RAG, the retrieved chunks end up…", opts: ["Written into the model's weights", "Pasted into the context window as evidence", "Deleted after searching"], a: 1, why: "Retrieval stuffs evidence into the prompt; the weights never change." },
    { q: "Most “RAG doesn't work” failures are usually…", opts: ["The retriever fetched the wrong chunk", "The model forgot its training", "The context window was too honest"], a: 0, why: "If the gold chunk was never pasted in, generation never had a chance — check recall@k first." },
  ],
  capstone: [
    { q: "The first step of the capstone loop is to predict before running because…", opts: ["It makes generation faster", "A committed guess exposes your model of the model, so corrections stick", "The judge requires it"], a: 1, why: "Pre-registered expectations turn watching into evaluating." },
    { q: "A behavioural evaluation scaled up has to worry about…", opts: ["Judge reliability, contamination, and variance", "Font choices", "Nothing — one run proves everything"], a: 0, why: "One fluent run is an anecdote; reliability is a statistics problem." },
  ],
};

/* Quiz drawer: quizzes live apart from the lessons, in a slide-in panel. */
const quizDrawer = document.getElementById("quizDrawer");
const quizScrim = document.getElementById("quizScrim");
function setQuizDrawer(open) {
  quizDrawer.classList.toggle("open", open);
  quizDrawer.setAttribute("aria-hidden", String(!open));
  quizScrim.hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
}
document.getElementById("quizOpenBtn").addEventListener("click", () => setQuizDrawer(true));
document.getElementById("quizCloseBtn").addEventListener("click", () => setQuizDrawer(false));
quizScrim.addEventListener("click", () => setQuizDrawer(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && quizDrawer.classList.contains("open")) setQuizDrawer(false);
});

function quizItems(id) {
  const en = QUIZZES[id] || [];
  const loc = (dynDict(currentLang).quizzes || {})[id];
  return en.map((item, i) => {
    const t = Array.isArray(loc) ? loc[i] : null;
    if (!t) return item;
    return { q: t[0] || item.q, opts: item.opts.map((o, oi) => (t[1] && t[1][oi]) || o), a: item.a, why: t[2] || item.why };
  });
}
function relocalizeQuiz() {
  document.querySelectorAll(".quiz-group").forEach((group) => {
    const id = group.dataset.lesson;
    if (!id) return;
    const idx = LESSON_ORDER.indexOf(id);
    const head = group.querySelector(".quiz-group-head h3");
    if (head) head.textContent = (idx + 1) + " · " + lessonTitle(id);
    const intro = group.querySelector(".quiz-status");
    if (intro) intro.textContent = i18nT("quiz_intro") || "Answer both questions to complete this lesson automatically.";
    const items = quizItems(id);
    group.querySelectorAll(".quiz-q").forEach((qEl) => {
      const qi = Number(qEl.dataset.qi);
      if (items[qi]) qEl.textContent = (qi + 1) + ". " + items[qi].q;
    });
    group.querySelectorAll(".quiz-opt").forEach((btn) => {
      const qi = Number(btn.dataset.qi), oi = Number(btn.dataset.oi);
      if (items[qi] && items[qi].opts[oi]) btn.textContent = items[qi].opts[oi];
    });
    group.querySelectorAll(".quiz-feedback").forEach((fb) => {
      if (!fb.dataset.state) return;
      const qi = Number(fb.dataset.qi);
      const correct = fb.dataset.state === "correct";
      if (items[qi]) fb.textContent = ((correct ? i18nT("correct_prefix") : i18nT("wrong_prefix")) || (correct ? "Correct. " : "Not quite. ")) + items[qi].why;
    });
  });
  document.querySelectorAll(".next-btn").forEach((a) => {
    const nextId = (a.getAttribute("href") || "").slice(1);
    a.textContent = i18nT("next_lesson", { title: lessonTitle(nextId) }) || ("Next lesson: " + lessonTitle(nextId) + " →");
  });
  document.querySelectorAll(".final-note").forEach((el) => {
    el.textContent = i18nT("final_note") || "Final lesson — complete it to finish the course.";
  });
}
LESSON_ORDER.forEach((id, idx) => {
  const section = document.getElementById(id);
  if (!section) return;
  // Quiz block — built into the drawer, grouped per lesson, not in the lesson.
  const quiz = QUIZZES[id];
  const quizList = document.getElementById("quizList");
  if (quiz && quizList) {
    const localizedQuiz = quizItems(id);
    const group = document.createElement("div");
    group.className = "quiz-group";
    group.dataset.lesson = id;
    group.innerHTML = "<div class='quiz-group-head'><h3>" + (idx + 1) + " · " +
      lessonTitle(id) + "</h3><span class='quiz-group-status' data-lesson='" +
      id + "'>" + (i18nT("not_completed") || "Not completed") + "</span></div>";
    const box = document.createElement("div");
    box.className = "quiz";
    box.innerHTML =
      "<p class='quiz-status'>" + (i18nT("quiz_intro") || "Answer both questions to complete this lesson automatically.") + "</p>";
    let answered = new Set();
    localizedQuiz.forEach((item, qi) => {
      const qEl = document.createElement("p");
      qEl.className = "quiz-q";
      qEl.dataset.qi = String(qi);
      qEl.textContent = (qi + 1) + ". " + item.q;
      const opts = document.createElement("div");
      opts.className = "quiz-opts";
      const feedback = document.createElement("p");
      feedback.className = "quiz-feedback";
      feedback.dataset.qi = String(qi);
      // Shuffle option order so the correct answer is not always in the
      // same position; `oi` still refers to the original option index.
      const order = item.opts.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      order.forEach((oi) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-opt";
        btn.dataset.qi = String(qi);
        btn.dataset.oi = String(oi);
        btn.textContent = item.opts[oi];
        btn.addEventListener("click", () => {
          const correct = oi === item.a;
          const liveItem = quizItems(id)[qi] || item;
          btn.classList.add(correct ? "correct" : "wrong");
          feedback.dataset.state = correct ? "correct" : "wrong";
          feedback.textContent = ((correct ? i18nT("correct_prefix") : i18nT("wrong_prefix")) || (correct ? "Correct. " : "Not quite. ")) + liveItem.why;
          if (correct) sndCorrect(); else sndWrong();
          if (correct) {
            answered.add(qi);
            opts.querySelectorAll("button").forEach((b) => { b.disabled = true; });
            btn.disabled = false;
            if (answered.size === quiz.length) markComplete(id);
          }
        });
        opts.appendChild(btn);
      });
      box.appendChild(qEl);
      box.appendChild(opts);
      box.appendChild(feedback);
    });
    group.appendChild(box);
    quizList.appendChild(group);
  }
  // Footer: complete toggle + next lesson
  const footer = document.createElement("div");
  footer.className = "lesson-footer";
  const completeBtn = document.createElement("button");
  completeBtn.type = "button";
  completeBtn.className = "complete-btn";
  completeBtn.dataset.lesson = id;
  addIcon(completeBtn, "check");
  const completeLabel = document.createElement("span");
  completeLabel.className = "btn-label";
  completeLabel.textContent = i18nT("complete_btn") || "Mark lesson complete";
  completeBtn.appendChild(completeLabel);
  completeBtn.addEventListener("click", () => {
    if (completedLessons.has(id)) {
      completedLessons.delete(id);
      try { localStorage.setItem("llmLabProgress", JSON.stringify([...completedLessons])); } catch (e) {}
      renderProgress();
    } else {
      markComplete(id);
    }
  });
  footer.appendChild(completeBtn);
  if (idx < LESSON_ORDER.length - 1) {
    const next = document.createElement("a");
    const nextId = LESSON_ORDER[idx + 1];
    next.className = "next-btn";
    next.href = "#" + nextId;
    next.textContent = i18nT("next_lesson", { title: lessonTitle(nextId) }) || ("Next lesson: " + lessonTitle(nextId) + " →");
    footer.appendChild(next);
  } else {
    const done = document.createElement("span");
    done.className = "quiz-status final-note";
    done.textContent = i18nT("final_note") || "Final lesson — complete it to finish the course.";
    footer.appendChild(done);
  }
  section.appendChild(footer);
});
renderProgress();

/* Returning visitors (any completed lesson) resume at their first unfinished
   lesson instead of the Introduction — unless they arrived via a link. */
if (!location.hash && completedLessons.size) {
  const next = LESSON_ORDER.find((id) => !completedLessons.has(id));
  if (next) showLesson(next);
}

/* ---------- Lesson 1: real BPE tokenizer comparison (loaded on demand) ---------- */
let realTokenizer = null;
document.getElementById("realTokBtn").addEventListener("click", async () => {
  const stats = document.getElementById("realTokStats");
  const row = document.getElementById("realTokenRow");
  const text = tokenInput.value;
  if (!text.trim()) { showError("Write some text in lesson 1 first."); return; }
  try {
    stats.textContent = "Loading the real tokenizer (one-time download)…";
    if (!realTokenizer) {
      realTokenizer = await import("https://cdn.jsdelivr.net/npm/gpt-tokenizer/+esm");
    }
    const ids = realTokenizer.encode(text);
    row.innerHTML = "";
    ids.forEach((tokenId, i) => {
      const piece = realTokenizer.decode([tokenId]);
      const span = document.createElement("span");
      span.className = "token";
      span.style.background = PALETTE[i % PALETTE.length];
      span.textContent = piece.replace(/ /g, "␣").replace(/\n/g, "⏎");
      span.title = "token id " + tokenId;
      row.appendChild(span);
    });
    const approx = splitTokens(text).filter((t) => !/^\s+$/.test(t)).length;
    stats.textContent = "Real BPE tokenizer: " + ids.length + " tokens · teaching approximation above: " +
      approx + " tokens. Hover a chip for its vocabulary ID.";
  } catch (err) {
    stats.textContent = "";
    showError("Could not load the real tokenizer — it needs an internet connection once. " + err.message);
  }
});

/* ---------- Lesson 3b: loss landscape — gradient descent in 3D ---------- */
/* A gentle bowl minus three Gaussian wells: three real local minima, the
   east one deepest. Minima (found numerically): west (-1.68, 1.15) L=1.43,
   south (0.19, -1.51) L=1.36, global (1.76, 0.79) L=0.83. */
const LOSS_WELLS = [
  [-1.9, 1.3, 2.6, 0.85],
  [0.2, -1.7, 2.2, 0.75],
  [2.0, 0.9, 3.1, 0.95],
];
const LOSS_MINIMA = [
  { name: "west dip — a LOCAL minimum", w: [-1.682, 1.152], loss: 1.43 },
  { name: "south dip — a LOCAL minimum", w: [0.188, -1.510], loss: 1.36 },
  { name: "east dip — the GLOBAL minimum", w: [1.764, 0.793], loss: 0.83 },
];
function lossFn(x, y) {
  let v = 0.22 * (x * x + y * y) + 3;
  for (const [a, b, d, s] of LOSS_WELLS) {
    v -= d * Math.exp(-((x - a) ** 2 + (y - b) ** 2) / (2 * s * s));
  }
  return v;
}
function lossGrad(x, y) {
  let gx = 0.44 * x, gy = 0.44 * y;
  for (const [a, b, d, s] of LOSS_WELLS) {
    const e = d * Math.exp(-((x - a) ** 2 + (y - b) ** 2) / (2 * s * s));
    gx += e * (x - a) / (s * s);
    gy += e * (y - b) / (s * s);
  }
  return [gx, gy];
}
const lossState = { w: [-2.4, 2.0], steps: 0, timer: null };
let lossUpdate3D = null;

function lossRenderMath(prevW, grad, lr) {
  const [x, y] = lossState.w;
  document.getElementById("lossMath").textContent =
    "Step " + lossState.steps + ":\n" +
    "position w = (" + x.toFixed(3) + ", " + y.toFixed(3) + ")   loss L(w) = " + lossFn(x, y).toFixed(3) + "\n" +
    (prevW ? "gradient ∇L = (" + grad[0].toFixed(3) + ", " + grad[1].toFixed(3) + ")" +
      "   |∇L| = " + Math.hypot(grad[0], grad[1]).toFixed(3) +
      "   →   step = −η·∇L = (" + (-lr * grad[0]).toFixed(3) + ", " + (-lr * grad[1]).toFixed(3) + ")\n" +
      "w_new = (" + prevW[0].toFixed(3) + ", " + prevW[1].toFixed(3) + ") − η·∇L = (" +
      x.toFixed(3) + ", " + y.toFixed(3) + ")" +
      (lossFn(x, y) > lossFn(prevW[0], prevW[1]) ? "\nLoss went UP — the step overshot the valley. Lower η." : "")
    : "Press “Take one step” — the gradient at the ball will appear here.");
}
function lossStep() {
  const lr = parseFloat(document.getElementById("lrRange").value);
  const prevW = lossState.w.slice();
  const grad = lossGrad(prevW[0], prevW[1]);
  lossState.w = [prevW[0] - lr * grad[0], prevW[1] - lr * grad[1]];
  lossState.steps++;
  if (Math.abs(lossState.w[0]) > 3.4 || Math.abs(lossState.w[1]) > 3.4) {
    lossRenderMath(prevW, grad, lr);
    document.getElementById("lossMath").textContent +=
      "\nThe ball left the landscape — η is far too big here. Reset and try smaller steps.";
    lossStopAuto();
    if (lossUpdate3D) lossUpdate3D(true);
    return;
  }
  lossRenderMath(prevW, grad, lr);
  if (lossUpdate3D) lossUpdate3D(false);
  sndDescent(lossFn(lossState.w[0], lossState.w[1]));
  const g = lossGrad(lossState.w[0], lossState.w[1]);
  if (Math.hypot(g[0], g[1]) < 0.03) {
    const near = LOSS_MINIMA.reduce((best, m) => {
      const d = Math.hypot(lossState.w[0] - m.w[0], lossState.w[1] - m.w[1]);
      return !best || d < best.d ? { m, d } : best;
    }, null);
    document.getElementById("lossMath").textContent +=
      "\nGradient ≈ 0 — convergence. The ball settled in the " +
      (near && near.d < 0.4 ? near.m.name + " (loss ≈ " + near.m.loss + ")."
        : "valley floor.") +
      (near && near.d < 0.4 && near.m.loss > 0.9
        ? " It feels exactly like success from down here — only the map (which the ball doesn't have) shows the east dip is deeper. Start from the North ridge to find it."
        : "");
    lossStopAuto();
    sndDone();
  }
}
function lossStopAuto() {
  if (lossState.timer) { clearInterval(lossState.timer); lossState.timer = null; }
  document.getElementById("lossPlayBtn").textContent = "Auto-descend";
}
document.getElementById("lrRange").addEventListener("input", (e) => {
  document.getElementById("lrVal").textContent = e.target.value;
});
document.getElementById("lossStepBtn").addEventListener("click", lossStep);
document.getElementById("lossPlayBtn").addEventListener("click", () => {
  if (lossState.timer) { lossStopAuto(); return; }
  document.getElementById("lossPlayBtn").textContent = "Stop";
  lossState.timer = setInterval(() => {
    if (lossState.steps > 80) { lossStopAuto(); return; }
    lossStep();
  }, 380);
});
document.getElementById("lossResetBtn").addEventListener("click", () => {
  lossStopAuto();
  lossState.w = [-2.4, 2.0];
  lossState.steps = 0;
  lossRenderMath(null, null, 0);
  if (lossUpdate3D) lossUpdate3D(true);
});
document.querySelectorAll("[data-loss-start]").forEach((btn) => {
  btn.addEventListener("click", () => {
    lossStopAuto();
    lossState.w = btn.dataset.lossStart.split(",").map(Number);
    lossState.steps = 0;
    lossRenderMath(null, null, 0);
    if (lossUpdate3D) lossUpdate3D(true);
  });
});

async function initLoss3D() {
  const box = document.getElementById("lossCanvas");
  let THREE;
  try {
    THREE = await import("three");
  } catch (err) { return; }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(theme3D.bg);
  const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100);
  camera.position.set(3.6, 3.4, 4.8);
  camera.lookAt(0, 0.4, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(box.clientWidth, box.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  box.appendChild(renderer.domElement);
  const group = new THREE.Group();
  scene.add(group);

  const geo = new THREE.PlaneGeometry(6.4, 6.4, 54, 54);
  const posAttr = geo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    posAttr.setZ(i, lossFn(posAttr.getX(i), posAttr.getY(i)) * 0.55);
  }
  geo.computeVertexNormals();
  geo.rotateX(-Math.PI / 2);
  const surfaceSolid = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    color: theme3D.input, transparent: true, opacity: 0.20, side: THREE.DoubleSide }));
  const surfaceWire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    color: theme3D.bar ?? theme3D.input, wireframe: true, transparent: true, opacity: 0.5 }));
  group.add(surfaceSolid);
  group.add(surfaceWire);

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 22, 22),
    new THREE.MeshBasicMaterial({ color: theme3D.accent, depthTest: false }));
  ball.renderOrder = 999;
  group.add(ball);
  let pathLine = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: theme3D.accent, transparent: true, opacity: 0.95, depthTest: false }));
  pathLine.renderOrder = 998;
  group.add(pathLine);
  const pathPoints = [];
  const toWorld = (x, y) => new THREE.Vector3(x, lossFn(x, y) * 0.55 + 0.13, -y);

  lossUpdate3D = (reset) => {
    if (reset) pathPoints.length = 0;
    pathPoints.push(toWorld(lossState.w[0], lossState.w[1]));
    ball.position.copy(toWorld(lossState.w[0], lossState.w[1]));
    pathLine.geometry.dispose();
    pathLine.geometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
  };
  lossUpdate3D(true);
  themeRecolorers.push((p) => {
    scene.background = new THREE.Color(p.bg);
    surfaceSolid.material.color.setHex(p.input);
    surfaceWire.material.color.setHex(p.input);
    ball.material.color.setHex(p.accent);
    pathLine.material.color.setHex(p.accent);
  });

  // Bloom, same recipe as the other scenes.
  let composer = null;
  try {
    const { EffectComposer } = await import("three/addons/postprocessing/EffectComposer.js");
    const { RenderPass } = await import("three/addons/postprocessing/RenderPass.js");
    const { UnrealBloomPass } = await import("three/addons/postprocessing/UnrealBloomPass.js");
    const { OutputPass } = await import("three/addons/postprocessing/OutputPass.js");
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(box.clientWidth, box.clientHeight), 0.5, 0.7, 0.55));
    composer.addPass(new OutputPass());
  } catch (err) { composer = null; }

  // Camera: drag = orbit, right-drag / Shift+drag = pan (move), wheel = zoom.
  // Framed closer and lower than before so the surface fills the whole box,
  // not just the top half.
  let dragging = false, panning = false, px = 0, py = 0;
  let sph = { theta: 0.65, phi: 0.85, radius: 8.8 };
  const target = new THREE.Vector3(0, 0.85, 0);
  const el = renderer.domElement;
  el.style.touchAction = "none";
  function applyCam() {
    camera.position.set(
      target.x + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta),
      target.y + sph.radius * Math.cos(sph.phi),
      target.z + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta));
    camera.lookAt(target);
  }
  applyCam();
  el.addEventListener("contextmenu", (e) => e.preventDefault());
  el.addEventListener("pointerdown", (e) => {
    dragging = true;
    panning = e.button === 2 || e.shiftKey;
    px = e.clientX; py = e.clientY;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - px, dy = e.clientY - py;
    if (panning) {
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
      const scale = sph.radius * 0.0016;
      target.addScaledVector(right, -dx * scale).addScaledVector(up, dy * scale);
      target.x = Math.max(-3, Math.min(3, target.x));
      target.y = Math.max(-1.5, Math.min(2.5, target.y));
      target.z = Math.max(-3, Math.min(3, target.z));
    } else {
      sph.theta -= dx * 0.008;
      sph.phi = Math.max(0.15, Math.min(1.45, sph.phi - dy * 0.006));
    }
    px = e.clientX; py = e.clientY;
    applyCam();
  });
  el.addEventListener("pointerup", () => { dragging = false; panning = false; });
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    sph.radius = Math.max(3.5, Math.min(13, sph.radius + e.deltaY * 0.01));
    applyCam();
  }, { passive: false });
  el.addEventListener("dblclick", () => {
    sph = { theta: 0.65, phi: 0.85, radius: 8.8 };
    target.set(0, 0.85, 0);
    applyCam();
  });

  const reduceM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function tick() {
    requestAnimationFrame(tick);
    if (!dragging && !reduceM) { sph.theta += 0.0016; applyCam(); }
    if (box.clientWidth > 0) { if (composer) composer.render(); else renderer.render(scene, camera); } // skip GPU work while the lesson is hidden
  }
  tick();
  window.addEventListener("resize", () => {
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(box.clientWidth, box.clientHeight);
    if (composer) composer.setSize(box.clientWidth, box.clientHeight);
  });
}
initLoss3D();
lossRenderMath(null, null, 0);

/* ---------- Lesson 2: embeddings (three.js word cloud) ---------- */
const WORDS = [
  ["cat", [-1.2, 0.4, 0.2]], ["dog", [-1.0, 0.7, -0.3]], ["horse", [-1.4, 0.1, -0.5]],
  ["bird", [-0.8, 0.9, 0.4]], ["fish", [-1.1, -0.1, 0.6]],
  ["car", [1.3, -0.6, 0.1]], ["bus", [1.5, -0.4, -0.4]], ["train", [1.2, -0.9, -0.2]],
  ["king", [0.2, 1.3, -0.8]], ["queen", [0.45, 1.15, -0.65]],
  ["apple", [0.1, -1.3, 0.7]], ["bread", [-0.2, -1.5, 0.4]], ["cheese", [0.3, -1.2, 0.9]],
];

async function initEmbeddings() {
  const box = document.getElementById("embedCanvas");
  let THREE;
  try {
    THREE = await import("three");
  } catch (err) {
    document.getElementById("embedFallback").hidden = false;
    return;
  }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1117);
  const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100);
  camera.position.set(0, 0.2, 6.2);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(box.clientWidth, box.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  box.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);
  scene.background = new THREE.Color(theme3D.bg);
  const embedDots = [];
  WORDS.forEach(([word, pos], i) => {
    const groupIdx = Math.floor(i / 5) % theme3D.embedGroups.length;
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 20, 20),
      new THREE.MeshBasicMaterial({ color: theme3D.embedGroups[groupIdx] })
    );
    dot.position.set(pos[0], pos[1], pos[2]);
    group.add(dot);
    embedDots.push([dot, groupIdx]);

    const c = document.createElement("canvas");
    c.width = 256; c.height = 96;
    const ctx = c.getContext("2d");
    ctx.font = "600 44px Segoe UI, sans-serif";
    ctx.fillStyle = "#e8e6e1";
    ctx.textAlign = "center";
    ctx.fillText(word, 128, 58);
    const tex = new THREE.CanvasTexture(c);
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    label.scale.set(0.62, 0.23, 1);
    label.position.set(pos[0], pos[1] + 0.19, pos[2]);
    group.add(label);
  });

  const axes = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.6, 3.6, 2.4)),
    new THREE.LineBasicMaterial({ color: 0x313a46 })
  );
  group.add(axes);

  // Starfield backdrop + bloom (falls back to plain rendering if addons fail).
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(420 * 3);
  for (let i = 0; i < 420; i++) {
    const r = 9 + Math.random() * 9;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    starPos[i * 3 + 2] = r * Math.cos(ph) - 4;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const embedStarMat = new THREE.PointsMaterial({
    color: theme3D.star, size: 0.045, transparent: true, opacity: 0.75 });
  scene.add(new THREE.Points(starGeo, embedStarMat));
  let composer = null;
  try {
    const { EffectComposer } = await import("three/addons/postprocessing/EffectComposer.js");
    const { RenderPass } = await import("three/addons/postprocessing/RenderPass.js");
    const { UnrealBloomPass } = await import("three/addons/postprocessing/UnrealBloomPass.js");
    const { OutputPass } = await import("three/addons/postprocessing/OutputPass.js");
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(box.clientWidth, box.clientHeight), 0.55, 0.7, 0.55));
    composer.addPass(new OutputPass());
  } catch (err) { composer = null; }

  // Corner ornament: a small rotating cube (clean edges only) pinned to the
  // camera, so it always sits in the top-left corner, whatever the view does.
  const corner = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.23, 0.23, 0.23)),
    new THREE.LineBasicMaterial({ color: theme3D.accent, transparent: true, opacity: 0.9 }));
  corner.position.set(-1.78, 0.78, -2);
  camera.add(corner);
  scene.add(camera);
  themeRecolorers.push((p) => {
    scene.background = new THREE.Color(p.bg);
    embedStarMat.color.setHex(p.star);
    corner.material.color.setHex(p.accent);
    for (const [dot, groupIdx] of embedDots) dot.material.color.setHex(p.embedGroups[groupIdx]);
  });

  let dragging = false, px = 0, py = 0, ry = 0.4, rx = 0.25;
  const el = renderer.domElement;
  el.style.touchAction = "none";
  el.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; el.setPointerCapture(e.pointerId); });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    ry += (e.clientX - px) * 0.008;
    rx += (e.clientY - py) * 0.008;
    rx = Math.max(-1.2, Math.min(1.2, rx));
    px = e.clientX; py = e.clientY;
  });
  el.addEventListener("pointerup", () => { dragging = false; });
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    camera.position.z = Math.max(3.4, Math.min(12, camera.position.z + e.deltaY * 0.01));
  }, { passive: false });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastTick = performance.now();
  function tick(now) {
    requestAnimationFrame(tick);
    const delta = Math.min(0.05, (now - lastTick) / 1000);
    lastTick = now;
    if (!dragging && !reduceMotion) ry += 0.0016;
    group.rotation.y = ry;
    group.rotation.x = rx;
    // Keep the cube in the top-left corner of the view at any zoom/aspect.
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 2;
    corner.position.set(-(halfH * camera.aspect - 0.38), halfH - 0.38, -2);
    // Fixed rotation speed: 0.8 rad/s on Y, 0.5 rad/s on X, frame-rate
    // independent. The cube always turns — it is a small, user-requested
    // corner element; the word cloud's auto-rotation above still respects
    // the reduced-motion preference.
    corner.rotation.y += delta * 0.8;
    corner.rotation.x += delta * 0.5;
    if (box.clientWidth > 0) { if (composer) composer.render(); else renderer.render(scene, camera); } // skip GPU work while the lesson is hidden
  }
  requestAnimationFrame(tick);

  window.addEventListener("resize", () => {
    const w = box.clientWidth, h = box.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (composer) composer.setSize(w, h);
  });
}
initEmbeddings();

/* ---------- Lesson 13: from predictor to assistant ---------- */
const PIPE_DETAILS = [
  "<strong>Stage 1 — Pre-training.</strong> The machine from lessons 1–6: predict the next token over trillions of tokens. It absorbs facts, grammar, styles — and every bad habit in the data. Asked a question, it predicts what question-shaped text is usually followed by: often, more questions. It has no concept of “answering you”; there is not yet a “you”.",
  "<strong>Stage 2 — Instruction tuning (SFT).</strong> Train further on demonstration pairs: an instruction, then a good response. Same gradient descent, tiny data, huge behavioural effect: answer-shaped text now follows question-shaped input, formats are obeyed, and the model emits a stop token when done instead of rambling on. This is where “assistant” as a role is born.",
  "<strong>Stage 3 — Preference training.</strong> Sample several answers, have humans (or a trained reward model) rank them, and push the policy toward the winners: helpful over evasive, honest over confident-sounding, safe over harmful. This is where refusals, tone, and “show your working” come from — tastes, trained in, layered on top of ability.",
];
const ASSISTANT_SCENARIOS = [
  {
    base: "What is the capital of France? Answer in one word.\nWhat is the capital of Germany? Answer in one word.\nWhat is the capital of Italy? Answer in one word.\n(a) Paris (b) Berlin (c)…",
    asst: "Paris.",
    note: "The base model treats your prompt as the start of a quiz worksheet and continues the pattern — prediction working perfectly, assistance absent. The tuned model heard an instruction, obeyed the format, and stopped.",
  },
  {
    base: "Write a two-line poem about rain.\n\nRain falls soft on the old tin roof,\nCounting coins it cannot keep,\nAnd in the third verse the river wakes,\nWhile all the town is fast asleep,\n(From “Poems of the Valley”, 1911)…",
    asst: "Rain taps the window all night long,\na soft percussion, half a song.",
    note: "No instruction-following contract exists yet in the base model: a poem prompt predicts poem-shaped anthology text, so it keeps going and invents an attribution. The assistant gives you exactly two lines and stops.",
  },
  {
    base: "How do I pick a lock?\nHow do I hotwire a car?\nHow do I make a fake ID?\nChapter 4: Common questions about locks. A standard pin tumbler lock consists of…",
    asst: "I can't help with picking a lock that isn't yours. If you're locked out, a licensed locksmith can open it without damage — and if it's your own lock and you've lost the key, they may ask for proof of ownership first.",
    note: "The refusal is not knowledge the base model lacks — it's stage 3. Preference training made “don't help with wrongdoing, offer the legitimate alternative” the high-probability continuation. (This is a stylised reconstruction; real refusals vary.)",
  },
];
let currentPipeIdx = 0;
function renderPipe(idx) {
  currentPipeIdx = idx;
  document.getElementById("pipeDetail").innerHTML = (dynDict(currentLang).pipe_details || [])[idx] || PIPE_DETAILS[idx];
  document.querySelectorAll(".pipe-step").forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.pipe) === idx));
}
document.querySelectorAll(".pipe-step").forEach((b) =>
  b.addEventListener("click", () => renderPipe(Number(b.dataset.pipe))));
function renderAssistantScenario() {
  const scenarioIdx = Number(document.getElementById("assistantPrompt").value);
  const s = (dynDict(currentLang).assistant_scenarios || [])[scenarioIdx] || ASSISTANT_SCENARIOS[scenarioIdx];
  document.getElementById("baseOut").textContent = s.base;
  document.getElementById("assistantOut").textContent = s.asst;
  document.getElementById("assistantNote").textContent = s.note;
}
document.getElementById("assistantPrompt").addEventListener("change", renderAssistantScenario);
renderPipe(0);
renderAssistantScenario();

/* ---------- Lesson 14: retrieval (RAG) on a toy archive ---------- */
const RAG_DOCS = [
  "The harbour lighthouse is painted bright red with a white band near the top. It was built in 1889 and its lamp flashes twice every ten seconds.",
  "Ferry timetable: on weekdays the ferry leaves at 07:10, 12:40 and 18:05. On Sundays the first ferry leaves at 09:30 and the last return is at 20:15.",
  "Bicycle care: a squeaky chain wants cleaning first, then one drop of chain oil on each link. Wipe off the excess oil so the chain does not collect grit.",
  "The café on Pier Street serves soup from 11:00. Its famous fish soup sells out most Saturdays by two in the afternoon.",
  "Tide table for the harbour: high tide on Saturday at 06:12 and 18:44. The mud flats are walkable two hours either side of low tide.",
  "The little museum by the station opens Tuesday to Saturday, ten to four. Entry is free for children under twelve.",
  "Weather note: westerly winds bring rain over the harbour by evening. Fishermen mend nets under the awning on wet days.",
];
const RAG_ANSWERS = [
  "Bright red (with a white band) — that fact lives only in the archive; without retrieval the model would be guessing a plausible colour.",
  "On Sundays the first ferry leaves at 09:30. Without the timetable chunk, this is exactly the kind of specific fact a model invents confidently (lesson 10).",
  "Clean the chain, then one drop of oil per link, and wipe the excess. Retrieved, not remembered.",
];
let ragTop = [];
const ragWords = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/)
  .filter((w) => w.length > 2 && !["what", "when", "does", "the", "about", "should"].includes(w));
function ragCosine(a, b) {
  const va = new Map(), vb = new Map();
  a.forEach((w) => va.set(w, (va.get(w) || 0) + 1));
  b.forEach((w) => vb.set(w, (vb.get(w) || 0) + 1));
  let dot = 0, na = 0, nb = 0;
  va.forEach((v, w) => { na += v * v; if (vb.has(w)) dot += v * vb.get(w); });
  vb.forEach((v) => { nb += v * v; });
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}
function ragDocs() { return dynDict(currentLang).rag_docs || RAG_DOCS; }
function ragAnswers() { return dynDict(currentLang).rag_answers || RAG_ANSWERS; }
function renderRagAnswer() {
  const qi = Number(document.getElementById("ragQuery").value);
  document.getElementById("ragAnswer").textContent =
    (i18nT("rag_answer_prefix") || "With the evidence pasted in, the model can answer from the top chunk: ") + ragAnswers()[qi];
}
document.getElementById("ragSearchBtn").addEventListener("click", () => {
  const q = document.getElementById("ragQuery");
  const queryWords = ragWords(q.options[q.selectedIndex].text);
  const scored = ragDocs().map((doc, i) => ({ i, doc, score: ragCosine(queryWords, ragWords(doc)) }))
    .sort((a, b) => b.score - a.score);
  ragTop = scored.slice(0, 2);
  const box = document.getElementById("ragResults");
  box.innerHTML = "";
  for (const r of scored) {
    const row = document.createElement("div");
    row.className = "cand-bar" + (ragTop.includes(r) ? " chosen" : "");
    row.innerHTML = "<span class='cand-name'></span><span class='bar-track'><span class='bar-fill'></span></span><span></span>";
    row.children[0].textContent = "chunk " + (r.i + 1);
    row.children[1].children[0].style.width = Math.max(1, r.score * 100) + "%";
    row.children[2].textContent = r.score.toFixed(2);
    box.appendChild(row);
    const cap = document.createElement("p");
    cap.className = "hint";
    cap.textContent = r.doc;
    box.appendChild(cap);
  }
  document.getElementById("ragBuildBtn").disabled = false;
  document.getElementById("ragPrompt").hidden = true;
  document.getElementById("ragAnswer").textContent =
    i18nT("rag_top_msg") || "Top 2 chunks selected (highlighted). Now build the prompt the model would actually receive.";
});
document.getElementById("ragBuildBtn").addEventListener("click", () => {
  if (!ragTop.length) return;
  const q = document.getElementById("ragQuery");
  const question = q.options[q.selectedIndex].text;
  const box = document.getElementById("ragPrompt");
  box.hidden = false;
  box.textContent =
    (i18nT("rag_prompt_intro") || "Answer using only the evidence below. If it isn't there, say so.") + "\n\n" +
    ragTop.map((r, i) => "[chunk " + (r.i + 1) + "] " + r.doc).join("\n\n") +
    "\n\n" + (i18nT("rag_question_label") || "Question: ") + question;
  renderRagAnswer();
});

/* ---------- Lesson 15: capstone — predict, parse, run, dissect ---------- */
let capstoneState = { parsed: false, inspected: false, expert: false };
try {
  capstoneState = { ...capstoneState, ...JSON.parse(localStorage.getItem("llmLabCapstone") || "{}") };
} catch (e) { /* fresh */ }
function saveCapstone() {
  try { localStorage.setItem("llmLabCapstone", JSON.stringify(capstoneState)); } catch (e) {}
}
function capstoneLatch(key) {
  if (!capstoneState[key]) {
    capstoneState[key] = true;
    saveCapstone();
  }
  renderCapstone();
}
function renderCapstone() {
  const dbgRows = document.querySelectorAll("#debugExtra .debug-row").length;
  if (dbgRows && document.body.classList.contains("level-expert")) capstoneLatchSilent("expert");
  const done = {
    predict: !!(trapState.letters && trapState.letters.pred),
    parse: !!capstoneState.parsed,
    judged: !!(trapState.letters && trapState.letters.result),
    inspect: !!capstoneState.inspected,
    expert: !!capstoneState.expert,
  };
  let n = 0;
  document.querySelectorAll("[data-cap]").forEach((row) => {
    const on = !!done[row.dataset.cap];
    row.classList.toggle("done", on);
    row.querySelector(".cap-state").textContent = on ? "✓" : "○";
    if (on) n++;
  });
  document.querySelectorAll(".cap-pred").forEach((b) =>
    b.classList.toggle("active", !!(trapState.letters && trapState.letters.pred === b.dataset.capPred)));
  document.getElementById("capTally").textContent =
    (i18nT("cap_tally", { a: n }) || ("Capstone: " + n + " of 5 steps done.")) +
    (n === 5 ? (i18nT("cap_tally_all") || " All five — you've run the full loop: predict, parse, generate, inspect, debug.") : "");
}
function capstoneLatchSilent(key) {
  if (!capstoneState[key]) {
    capstoneState[key] = true;
    saveCapstone();
  }
}
document.querySelectorAll(".cap-pred").forEach((b) => {
  b.addEventListener("click", () => {
    trapState.letters = { ...(trapState.letters || {}), pred: b.dataset.capPred };
    saveTraps();
    renderTrapScore();
    renderCapstone();
  });
});
document.getElementById("capParseBtn").addEventListener("click", () => {
  const sel = document.getElementById("parseSelect");
  sel.value = "0";
  sel.dispatchEvent(new Event("change"));
  document.querySelector('[data-stage="3"]').click();
  capstoneLatch("parsed");
  showLesson("parsing");
  if (location.hash !== "#parsing") location.hash = "parsing";
});
document.getElementById("capRunBtn").addEventListener("click", () => {
  const btn = document.querySelector('.trap-btn[data-trap="letters"]');
  if (btn) btn.click();
});
document.getElementById("capExpertBtn").addEventListener("click", () => {
  setLevel("expert", true);
  showLesson("playground");
  if (location.hash !== "#playground") location.hash = "playground";
  setTimeout(renderCapstone, 120);
});
document.getElementById("capResetBtn").addEventListener("click", () => {
  capstoneState = { parsed: false, inspected: false, expert: false };
  if (trapState.letters) { delete trapState.letters; saveTraps(); renderTrapScore(); }
  saveCapstone();
  renderCapstone();
});
renderCapstone();
