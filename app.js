/* LLM Visual Lab — Phase 0 spike
   Sections: status, tokenizer (teaching approximation), embeddings (three.js), live model. */

const OLLAMA = "http://localhost:11434";
const MODEL = "llama3.2:1b";

const banner = document.getElementById("errorBanner");
function showError(msg) {
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

/* ---------- Sound (off by default, WebAudio blips) ---------- */
let audioCtx = null;
let soundOn = false;
const soundBtn = document.getElementById("soundBtn");
soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "Sound: on" : "Sound: off";
  soundBtn.setAttribute("aria-pressed", String(soundOn));
  if (soundOn) {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    blip(660, 0.07);
  }
});
function blip(freq, dur, delay) {
  if (!soundOn || !audioCtx) return;
  const t0 = audioCtx.currentTime + (delay || 0);
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.08, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + dur);
}
function sndToken(step) { blip(480 + Math.min(600, step * 14), 0.05); }
function sndDone() { blip(660, 0.08); blip(880, 0.1, 0.09); }
function sndClick() { blip(520, 0.04); }
document.addEventListener("click", (e) => {
  if (e.target.closest("button") && e.target.id !== "soundBtn") sndClick();
});

/* ---------- Corner telemetry labels ---------- */
const TELEMETRY = {
  tokens: "SYS · TOK-01 · OK", embeddings: "VEC · EMB-02 · OK",
  training: "TRN · GDES-03 · OK", attention: "ATT · HEAD-04 · OK",
  probabilities: "PRB · SAMP-05 · OK", journey: "TRF · LYR-06 · OK",
  toymodel: "TOY · REAL-07 · OK", context: "CTX · MEM-08 · OK",
  limits: "LIM · HALL-09 · WARN", playground: "LIVE · LLM-10 · OK",
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

function renderTokens() {
  const text = tokenInput.value;
  const tokens = splitTokens(text);
  tokenRow.innerHTML = "";
  tokens.forEach((tok, i) => {
    if (/^\s+$/.test(tok)) return;
    const span = document.createElement("span");
    span.className = "token";
    span.style.background = PALETTE[i % PALETTE.length];
    span.textContent = tok.replace(/ /g, "␣");
    span.title = "token " + (i + 1);
    tokenRow.appendChild(span);
  });
  const visible = tokens.filter((t) => !/^\s+$/.test(t)).length;
  document.getElementById("tokenCount").textContent = visible;
  document.getElementById("charCount").textContent = text.length;
  document.getElementById("ratio").textContent =
    visible ? (text.length / visible).toFixed(1) : "0";
}
tokenInput.addEventListener("input", renderTokens);
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
    document.getElementById("stickyDot").className = "dot dot-on";
    document.getElementById("stickyStatus").textContent = names.length ? "Model online" : "No model pulled";
    statusText.textContent = names.length
      ? "Local model online: " + names.join(", ")
      : "Ollama online — no models pulled yet";
    offlineHelp.hidden = names.length > 0;
    if (!names.length) statusText.textContent += " (run: ollama pull " + MODEL + ")";
  } catch (err) {
    modelOnline = false;
    statusDot.className = "dot dot-off";
    document.getElementById("stickyDot").className = "dot dot-off";
    document.getElementById("stickyStatus").textContent = "Model offline";
    statusText.textContent = "Local model offline";
    offlineHelp.hidden = false;
  }
}
document.getElementById("recheckBtn").addEventListener("click", checkModel);
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
  // Same text can appear as several token ids — keep only its best entry.
  const byToken = new Map();
  for (const t of entry.top) {
    const p = Math.exp(t.logprob);
    if (!byToken.has(t.token) || byToken.get(t.token).p < p) {
      byToken.set(t.token, { token: t.token, p });
    }
  }
  const cands = [...byToken.values()].sort((a, b) => b.p - a.p);
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
  if (candidateUpdate3D) candidateUpdate3D(cands, entry.token);
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
  if (!modelOnline) {
    output.textContent = "";
    offlineHelp.hidden = false;
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
  currentAbort = new AbortController();
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
          spawnParticles(json.response.length);
          sndToken(chunkCount);
          if (lp) selectLiveToken(idx);
        }
        if (json.done) { finalData = json; break; }
      }
    }
    if (!output.textContent) output.textContent = "(the model returned nothing — try a different prompt)";
    if (finalData) renderDebug(finalData);
  } catch (err) {
    if (err.name === "AbortError") {
      output.appendChild(document.createTextNode("\n[stopped]"));
    } else {
      showError("Generation failed: " + err.message);
      checkModel();
    }
  } finally {
    generateBtn.disabled = false;
    stopBtn.disabled = true;
    currentAbort = null;
    const secs = ((performance.now() - genStarted) / 1000).toFixed(1);
    if (chunkCount > 0) {
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
stopBtn.addEventListener("click", () => { if (currentAbort) currentAbort.abort(); });

/* ---------- Lesson 10: candidate towers in 3D (real logprobs) ---------- */
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
    if (composer) composer.render(); else renderer.render(scene, camera);
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

/* ---------- Showcase: live token journey through 16 layers in 3D ---------- */
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
    if (composer) composer.render(); else renderer.render(scene, camera);
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

const journeyBtn = document.getElementById("journeyBtn");
const journeyStatus = document.getElementById("journeyStatus");
const journeyOut = document.getElementById("journeyOut");
journeyBtn.addEventListener("click", async () => {
  const prompt = document.getElementById("journeyPrompt").value.trim();
  if (!prompt) { showError("Write a prompt first."); return; }
  if (!modelOnline) {
    showError("The local model is offline. Start Ollama, then Re-check in lesson 10.");
    journeyStatus.textContent = "Model offline.";
    return;
  }
  const tokens = splitTokens(prompt).filter((t) => !/^\s+$/.test(t)).slice(0, 10);
  if (journeyStart3D) journeyStart3D(tokens);
  if (journeySetCandidates3D) journeySetCandidates3D([], null);
  journeyOut.textContent = "";
  journeyBtn.disabled = true;
  journeyStatus.textContent = "Sending " + tokens.length + " tokens through the layers…";
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 90000);
  let first = true;
  try {
    const res = await fetch(OLLAMA + "/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: MODEL, prompt, stream: true,
        logprobs: true, top_logprobs: 5,
        options: { temperature: parseFloat(tempRange.value), num_predict: 48 },
      }),
    });
    if (!res.ok) throw new Error("Model returned HTTP " + res.status);
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
          journeyOut.textContent += json.response;
          if (first) {
            first = false;
            const lp = (json.logprobs || [])[0];
            if (lp && journeySetCandidates3D) {
              const byToken = new Map();
              for (const t of lp.top_logprobs) {
                const p = Math.exp(t.logprob);
                if (!byToken.has(t.token) || byToken.get(t.token).p < p) {
                  byToken.set(t.token, { token: t.token, p });
                }
              }
              journeySetCandidates3D(
                [...byToken.values()].sort((a, b) => b.p - a.p), lp.token);
            }
            journeyStatus.textContent = "First prediction is in the towers — model still writing…";
            sndToken(1);
          }
        }
      }
    }
    journeyStatus.textContent = "Done. Towers show the first prediction; every token is analysed in lesson 10.";
    sndDone();
  } catch (err) {
    journeyStatus.textContent = "Generation failed: " + err.message;
  } finally {
    clearTimeout(timeout);
    journeyBtn.disabled = false;
  }
});

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

/* ---------- Lesson 6: context window ---------- */
const CTX_SIZE = 18;
let ctxTokens = ["Hello,", "my", "name", "is", "Alex."];
let ctxDropped = 0;
const ctxWindowEl = document.getElementById("ctxWindow");
function renderContext() {
  ctxWindowEl.innerHTML = "";
  ctxTokens.forEach((tok, i) => {
    const span = document.createElement("span");
    span.className = "ctx-token" + (i < 5 ? " old" : "");
    span.textContent = tok;
    ctxWindowEl.appendChild(span);
  });
  document.getElementById("ctxCount").textContent = ctxTokens.length;
  document.getElementById("ctxDropped").textContent = ctxDropped;
  const fill = document.getElementById("ctxGaugeFill");
  const pct = Math.round((ctxTokens.length / CTX_SIZE) * 100);
  fill.style.width = pct + "%";
  fill.style.background = pct >= 90 ? "#d96a5f" : pct >= 65 ? "#e0a458" : "#6fbf73";
}
document.getElementById("ctxAddBtn").addEventListener("click", () => {
  const words = document.getElementById("ctxInput").value.trim().split(/\s+/).filter(Boolean);
  ctxTokens = ctxTokens.concat(words);
  if (ctxTokens.length > CTX_SIZE) {
    ctxDropped += ctxTokens.length - CTX_SIZE;
    ctxTokens = ctxTokens.slice(ctxTokens.length - CTX_SIZE);
  }
  renderContext();
});
document.getElementById("ctxResetBtn").addEventListener("click", () => {
  ctxTokens = ["Hello,", "my", "name", "is", "Alex."];
  ctxDropped = 0;
  renderContext();
});
renderContext();

/* ---------- Lesson 7: trap buttons load the live prompt ---------- */
document.querySelectorAll(".trap-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("promptInput").value = btn.dataset.prompt;
    document.getElementById("playground").scrollIntoView({ behavior: "smooth" });
    showError("Trap loaded below — press Generate when you have made your prediction.");
  });
});

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
  const nextWord = tokenIdx < ATTN_WORDS.length - 1 ? ATTN_WORDS[tokenIdx + 1] : ".";
  const confidence = 0.16 + (layer / 15) * 0.62;
  [[nextWord, confidence], ["the", 0.30 - (layer / 15) * 0.18], ["a", 0.18 - (layer / 15) * 0.08], ["cat", 0.14]]
    .sort((a, b) => b[1] - a[1])
    .forEach(([tok, p]) => {
      const row = document.createElement("div");
      row.className = "attn-weight";
      row.innerHTML = "<span></span><span class='bar-track'><span class='bar-fill'></span></span><span></span>";
      row.children[0].textContent = tok;
      row.querySelector(".bar-fill").style.width = Math.max(2, Math.round(p * 100)) + "%";
      row.children[2].textContent = Math.round(p * 100) + "%";
      predEl.appendChild(row);
    });
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

/* ---------- Lesson 7: a real toy model (trained in the page) ---------- */
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
    if (composer) composer.render(); else renderer.render(scene, camera);
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
  "journey", "toymodel", "context", "limits", "playground"];
const LESSON_TITLES = {
  tokens: "Tokens", embeddings: "Embeddings", training: "Training", attention: "Attention",
  probabilities: "Next token", journey: "Inside the model", toymodel: "Toy model 3D",
  context: "Context", limits: "Limits", playground: "Live model",
};
let completedLessons = new Set();
try {
  completedLessons = new Set(JSON.parse(localStorage.getItem("llmLabProgress") || "[]"));
} catch (e) { /* fresh start */ }

function renderProgress() {
  document.getElementById("progressLabel").textContent =
    "Progress " + completedLessons.size + "/" + LESSON_ORDER.length;
  document.getElementById("progressFill").style.width =
    (completedLessons.size / LESSON_ORDER.length * 100) + "%";
  document.querySelectorAll(".complete-btn").forEach((btn) => {
    const done = completedLessons.has(btn.dataset.lesson);
    btn.classList.toggle("is-complete", done);
    btn.textContent = done ? "Completed ✓ — click to undo" : "Mark lesson complete";
  });
  document.querySelectorAll(".lesson-nav a").forEach((a) => {
    const id = a.getAttribute("href").slice(1);
    a.textContent = a.textContent.replace(/ ✓$/, "") +
      (completedLessons.has(id) ? " ✓" : "");
  });
  const quizCount = document.getElementById("quizOpenCount");
  if (quizCount) quizCount.textContent = completedLessons.size + "/" + LESSON_ORDER.length;
  document.querySelectorAll(".quiz-group-status").forEach((el) => {
    const done = completedLessons.has(el.dataset.lesson);
    el.classList.toggle("done", done);
    el.textContent = done ? "Completed ✓" : "Not completed";
  });
}
function markComplete(id, silent) {
  if (completedLessons.has(id)) return;
  completedLessons.add(id);
  try { localStorage.setItem("llmLabProgress", JSON.stringify([...completedLessons])); } catch (e) {}
  renderProgress();
  if (!silent) showError("Lesson complete: " + LESSON_TITLES[id] + " — " +
    completedLessons.size + " of " + LESSON_ORDER.length + " done.");
}

const QUIZZES = {
  tokens: [
    { q: "What does the model actually read?", opts: ["Whole words", "Tokens (chunks of text)", "Letters"], a: 1, why: "It reads tokens — chunks that may be a word, part of a word, or punctuation." },
    { q: "Why do models often fail at counting letters in a word?", opts: ["They are bad at maths", "They see tokens, not letters", "The word is too long"], a: 1, why: "A word may be one token, so its letters were never separate inputs." },
  ],
  embeddings: [
    { q: "Two words sitting close in embedding space means…", opts: ["They are spelled alike", "They appear in similar sentences", "They are the same length"], a: 1, why: "Closeness = similar usage contexts, learned in training." },
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
    { q: "Sampling means the next token is chosen…", opts: ["Alphabetically", "By rolling a weighted dice over probabilities", "By a human"], a: 1, why: "Softmax gives odds; generation samples from them." },
  ],
  journey: [
    { q: "Which layers does a token pass through?", opts: ["Only the ones it needs", "Every layer, in order", "One random layer"], a: 1, why: "All tokens traverse the full stack; attention and MLP rewrite each one per layer." },
    { q: "What comes out of the final layer?", opts: ["A finished sentence", "Scores for the next token", "A picture"], a: 1, why: "The final representation becomes next-token probabilities." },
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

LESSON_ORDER.forEach((id, idx) => {
  const section = document.getElementById(id);
  if (!section) return;
  // Quiz block — built into the drawer, grouped per lesson, not in the lesson.
  const quiz = QUIZZES[id];
  const quizList = document.getElementById("quizList");
  if (quiz && quizList) {
    const group = document.createElement("div");
    group.className = "quiz-group";
    group.innerHTML = "<div class='quiz-group-head'><h3>" + (idx + 1) + " · " +
      LESSON_TITLES[id] + "</h3><span class='quiz-group-status' data-lesson='" +
      id + "'>Not completed</span></div>";
    const box = document.createElement("div");
    box.className = "quiz";
    box.innerHTML =
      "<p class='quiz-status'>Answer both questions to complete this lesson automatically.</p>";
    let answered = new Set();
    quiz.forEach((item, qi) => {
      const qEl = document.createElement("p");
      qEl.className = "quiz-q";
      qEl.textContent = (qi + 1) + ". " + item.q;
      const opts = document.createElement("div");
      opts.className = "quiz-opts";
      const feedback = document.createElement("p");
      feedback.className = "quiz-feedback";
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
        btn.textContent = item.opts[oi];
        btn.addEventListener("click", () => {
          const correct = oi === item.a;
          btn.classList.add(correct ? "correct" : "wrong");
          feedback.textContent = (correct ? "Correct. " : "Not quite. ") + item.why;
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
    next.textContent = "Next lesson: " + LESSON_TITLES[nextId] + " →";
    footer.appendChild(next);
  } else {
    const done = document.createElement("span");
    done.className = "quiz-status";
    done.textContent = "Final lesson — complete it to finish the course.";
    footer.appendChild(done);
  }
  section.appendChild(footer);
});
renderProgress();

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
const lossFn = (x, y) => 0.6 * x * x + 0.25 * y * y + 0.35 * Math.sin(x) * Math.cos(y) + 0.35;
const lossGrad = (x, y) => [
  1.2 * x + 0.35 * Math.cos(x) * Math.cos(y),
  0.5 * y - 0.35 * Math.sin(x) * Math.sin(y),
];
const lossState = { w: [-2.4, 2.0], steps: 0, timer: null };
let lossUpdate3D = null;

function lossRenderMath(prevW, grad, lr) {
  const [x, y] = lossState.w;
  document.getElementById("lossMath").textContent =
    "Step " + lossState.steps + ":\n" +
    "position w = (" + x.toFixed(3) + ", " + y.toFixed(3) + ")   loss L(w) = " + lossFn(x, y).toFixed(3) + "\n" +
    (prevW ? "gradient ∇L = (" + grad[0].toFixed(3) + ", " + grad[1].toFixed(3) + ")" +
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
  const g = lossGrad(lossState.w[0], lossState.w[1]);
  if (Math.hypot(g[0], g[1]) < 0.03) {
    document.getElementById("lossMath").textContent +=
      "\nGradient ≈ 0 — the ball has reached the valley floor. That is convergence.";
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
    if (composer) composer.render(); else renderer.render(scene, camera);
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
    if (composer) composer.render(); else renderer.render(scene, camera);
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
