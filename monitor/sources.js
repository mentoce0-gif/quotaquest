'use strict';
/**
 * sources.js — EnergyHUD Engine :: PROVIDER REGISTRY.
 *
 * The engine is provider-agnostic. Each AI tool is an "adapter" that returns a
 * normalized event stream { ts, tokens, model, costUsd }. To support a new tool
 * (Cursor, Copilot, Windsurf, OpenAI, …) you only add an adapter here — the
 * compute core, schema and renderers never change. This is the platform seam.
 *
 * Adapter contract:
 *   { id, name, defaultModel, fetch(cfg, providerCfg) -> { source, model, events } | null }
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

function tokensOf(u) {
  if (!u) return 0;
  return (u.input_tokens || 0) + (u.output_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
}

// ---------- Claude adapter (ccusage -> JSONL -> demo) ------------------------
function claudeDir() { return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude'); }
function walk(dir, acc) {
  let entries; try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return acc; }
  for (const e of entries) { const p = path.join(dir, e.name); if (e.isDirectory()) walk(p, acc); else if (e.isFile() && p.endsWith('.jsonl')) acc.push(p); }
  return acc;
}
function claudeCcusage() {
  try {
    const out = execSync('npx -y ccusage@latest session --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 20000 });
    const data = JSON.parse(out); const rows = data.sessions || data.daily || data.data || []; const events = [];
    for (const r of rows) { const ts = Date.parse(r.lastActivity || r.timestamp || r.date || Date.now()); events.push({ ts: isNaN(ts) ? Date.now() : ts, tokens: r.totalTokens || tokensOf(r), model: r.model || 'unknown', costUsd: r.totalCost || r.costUSD || 0 }); }
    if (events.length) return { source: 'ccusage', events };
  } catch (e) { /* fall through */ }
  return null;
}
function claudeJsonl(sinceMs) {
  const files = walk(path.join(claudeDir(), 'projects'), []); if (!files.length) return null; const events = [];
  for (const f of files) { let text; try { text = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
    for (const line of text.split('\n')) { if (!line.trim()) continue; let o; try { o = JSON.parse(line); } catch (e) { continue; }
      if (o.type !== 'assistant' || !o.message || !o.message.usage) continue;
      const ts = Date.parse(o.timestamp || o.message.timestamp || 0) || Date.now(); if (sinceMs && ts < sinceMs) continue;
      events.push({ ts, tokens: tokensOf(o.message.usage), model: o.message.model || 'unknown', costUsd: 0 }); } }
  return events.length ? { source: 'jsonl', events } : null;
}
const claudeAdapter = {
  id: 'claude-code', name: 'Claude Code', defaultModel: 'claude-sonnet',
  fetch(cfg) { const wk = Date.now() - 7 * 24 * 3600 * 1000; return claudeCcusage() || claudeJsonl(wk); },
};

// ---------- Generic local-file adapter (Cursor / Copilot / Windsurf / any) ----
// These tools don't all expose a clean local token log yet, so the engine reads
// a NORMALIZED usage export: a .json array or .jsonl of records shaped like
//   { ts|timestamp, tokens|usage, model?, costUsd? }
// Point a provider at the file via config (providerCfg.path) or an env var.
// Returns null when the file is absent, so the member is simply skipped.
function readEventsFromFile(p) {
  let text; try { text = fs.readFileSync(p, 'utf8'); } catch (e) { return null; }
  const norm = (o) => ({
    ts: Number(o.ts) || Date.parse(o.timestamp || o.date || 0) || Date.now(),
    tokens: Number(o.tokens) || tokensOf(o.usage) || 0,
    model: o.model || 'unknown',
    costUsd: Number(o.costUsd || o.cost || 0),
  });
  const events = [];
  if (p.endsWith('.jsonl')) {
    for (const line of text.split('\n')) { if (!line.trim()) continue; try { events.push(norm(JSON.parse(line))); } catch (e) {} }
  } else {
    try { const arr = JSON.parse(text); if (Array.isArray(arr)) for (const o of arr) events.push(norm(o)); } catch (e) { return null; }
  }
  return events.filter((e) => e.tokens > 0);
}
function makeFileAdapter(id, name, defaultModel, envVar, defaultPath) {
  return {
    id, name, defaultModel,
    fetch(cfg, pc) {
      const p = (pc && pc.path) || process.env[envVar] || defaultPath;
      const events = p ? readEventsFromFile(p) : null;
      return events && events.length ? { source: id, model: defaultModel, events } : null;
    },
  };
}
const cursorAdapter   = makeFileAdapter('cursor',   'Cursor',          'cursor',  'CURSOR_USAGE_FILE',   path.join(os.homedir(), '.cursor', 'usage.json'));
const copilotAdapter  = makeFileAdapter('copilot',  'GitHub Copilot',  'gpt',     'COPILOT_USAGE_FILE',  path.join(os.homedir(), '.copilot', 'usage.json'));
const windsurfAdapter = makeFileAdapter('windsurf', 'Windsurf',        'cascade', 'WINDSURF_USAGE_FILE', path.join(os.homedir(), '.windsurf', 'usage.json'));

const REGISTRY = {
  claude: claudeAdapter, claude_code: claudeAdapter,
  cursor: cursorAdapter, copilot: copilotAdapter, windsurf: windsurfAdapter,
};

// ---------- Demo party (2 AIs) ----------------------------------------------
function demoEvents(level) {
  const now = Date.now(), M = 1e6, ev = (m, t, mdl) => ({ ts: now - m * 60000, tokens: t, model: mdl, costUsd: +(t / M * 0.9).toFixed(2) });
  const e = [];
  // 'low'  -> healthy member  (Claude/max20x: HP ~63%, MP ~30% -> NORMAL)
  // 'high' -> stressed member (Cursor/pro:    HP ~20%, MP ~38% -> WARNING)
  const weekScale = level === 'low' ? 24 : 7;     // weekly tokens per event (M)
  const sessTok   = (level === 'low' ? 8.4 : 1.5) * M;
  for (let d = 2; d <= 6; d++) for (let k = 0; k < 8; k++) e.push(ev(d * 1440 + k * 60, weekScale * M, 'sonnet'));
  [180, 150, 120, 90, 60].forEach((m) => e.push(ev(m, sessTok, 'opus')));
  e.push(ev(2, 150000, 'sonnet'));
  return e;
}
function demoProviders() {
  return [
    { id: 'claude-code', name: 'Claude Code', model: 'claude-sonnet', source: 'demo', plan: 'max20x', events: demoEvents('low') },
    { id: 'cursor', name: 'Cursor', model: 'cursor', source: 'demo', plan: 'pro', events: demoEvents('high') },
  ];
}

/**
 * getProviders(cfg, opts) -> [{ id, name, model, plan, source, events }]
 * Honors cfg.providers[] (enabled adapters). Falls back to a single Claude
 * provider, then demo. opts.force='demo' returns the demo party.
 */
function getProviders(cfg, opts) {
  opts = opts || {};
  if (opts.force === 'demo') return demoProviders();
  const out = [];
  const list = (cfg.providers && cfg.providers.length) ? cfg.providers : [{ id: 'claude-code', adapter: 'claude', name: 'Claude Code', plan: cfg.plan }];
  for (const pc of list) {
    const ad = REGISTRY[pc.adapter || pc.id]; if (!ad) continue;
    const got = ad.fetch(cfg, pc);
    if (got && got.events && got.events.length) {
      out.push({ id: pc.id || ad.id, name: pc.name || ad.name, model: got.model || ad.defaultModel, plan: pc.plan || cfg.plan, source: got.source, events: got.events });
    }
  }
  return out.length ? out : demoProviders();
}

module.exports = { getProviders, REGISTRY, tokensOf };
