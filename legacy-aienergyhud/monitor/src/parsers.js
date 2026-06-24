'use strict';
/*
 * parsers.js — tolerant JSONL readers for Claude Code and Codex usage logs.
 *
 * Both tools store per-message usage as line-delimited JSON on the local disk:
 *   Claude Code : ~/.claude/projects/<slug>/<session>.jsonl
 *   Codex CLI   : ~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl  (token_count events, since 2025-09-06)
 *
 * We extract { ts: epochMs, tokens: number, known: bool } events. Schema drift is
 * absorbed here so the rest of the app never changes when a tool tweaks its format.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function expandHome(p) {
  if (!p) return p;
  if (p === '~') return os.homedir();
  if (p.startsWith('~/') || p.startsWith('~\\')) return path.join(os.homedir(), p.slice(2));
  return p;
}

/** Recursively collect *.jsonl files under dir (bounded, ignores errors). */
function findJsonlFiles(dir, maxFiles = 4000) {
  const out = [];
  let stack = [dir];
  while (stack.length && out.length < maxFiles) {
    const cur = stack.pop();
    let entries;
    try { entries = fs.readdirSync(cur, { withFileTypes: true }); }
    catch { continue; }
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && e.name.endsWith('.jsonl')) out.push(full);
    }
  }
  return out;
}

/** Pull the first plausible epoch-ms timestamp from a record. */
function extractTs(rec) {
  const candidates = [rec.timestamp, rec.ts, rec.time, rec.created_at,
    rec.message && rec.message.timestamp];
  for (const c of candidates) {
    if (typeof c === 'number') return c > 1e12 ? c : c * 1000;
    if (typeof c === 'string') {
      const t = Date.parse(c);
      if (!Number.isNaN(t)) return t;
    }
  }
  return null;
}

/** Sum token-ish fields found anywhere in a usage object. */
function sumUsage(usage) {
  if (!usage || typeof usage !== 'object') return 0;
  const keys = ['input_tokens', 'output_tokens', 'cache_creation_input_tokens',
    'cache_read_input_tokens', 'cached_input_tokens', 'total_tokens',
    'total_token_usage', 'reasoning_tokens'];
  let sum = 0;
  // avoid double counting when total_tokens is present
  if (typeof usage.total_tokens === 'number') return usage.total_tokens;
  if (typeof usage.total_token_usage === 'number') return usage.total_token_usage;
  for (const k of keys) if (typeof usage[k] === 'number') sum += usage[k];
  return sum;
}

/** Find a usage object inside an arbitrary record (Claude / Codex shapes). */
function extractTokens(rec) {
  // Claude Code: rec.message.usage  OR rec.usage
  if (rec.message && rec.message.usage) return { tokens: sumUsage(rec.message.usage), known: true };
  if (rec.usage) return { tokens: sumUsage(rec.usage), known: true };
  // Codex: token_count events  -> rec.payload.info / rec.info / rec.token_usage
  const info = (rec.payload && rec.payload.info) || rec.info || rec.token_usage;
  if (info) {
    const t = sumUsage(info.total_token_usage || info.last_token_usage || info);
    // turn_context missing -> model unknown but tokens still counted
    const known = !!(rec.model || (rec.payload && rec.payload.model) || info.model);
    return { tokens: t, known };
  }
  if (rec.type === 'token_count' || (rec.payload && rec.payload.type === 'token_count')) {
    return { tokens: 0, known: false };
  }
  return null;
}

/** Read one JSONL file into usage events. */
function readEvents(file, sinceMs) {
  const events = [];
  let text;
  try { text = fs.readFileSync(file, 'utf8'); } catch { return events; }
  for (const line of text.split('\n')) {
    const s = line.trim();
    if (!s || s[0] !== '{') continue;
    let rec;
    try { rec = JSON.parse(s); } catch { continue; }
    const tok = extractTokens(rec);
    if (!tok || tok.tokens <= 0) {
      if (tok && !tok.known) { /* unknown event noted via known flag below */ }
      if (!tok) continue;
    }
    const ts = extractTs(rec) || Date.now();
    if (sinceMs && ts < sinceMs) continue;
    events.push({ ts, tokens: tok.tokens || 0, known: tok.known !== false });
  }
  return events;
}

/**
 * Collect usage events for an agent's log directory.
 * @returns {events:[{ts,tokens,known}], hasUnknown:boolean, fileCount:number}
 */
function collectAgent(logDir, lookbackMs) {
  const dir = expandHome(logDir);
  if (!dir || !fs.existsSync(dir)) return { events: [], hasUnknown: false, fileCount: 0, missing: true };
  const sinceMs = Date.now() - lookbackMs;
  // Only scan recently modified files for speed.
  const files = findJsonlFiles(dir).filter(f => {
    try { return fs.statSync(f).mtimeMs >= sinceMs; } catch { return false; }
  });
  let events = [];
  let hasUnknown = false;
  for (const f of files) {
    const evs = readEvents(f, sinceMs);
    for (const e of evs) if (!e.known) hasUnknown = true;
    events = events.concat(evs);
  }
  return { events, hasUnknown, fileCount: files.length, missing: false };
}

module.exports = { collectAgent, expandHome, findJsonlFiles, readEvents };
