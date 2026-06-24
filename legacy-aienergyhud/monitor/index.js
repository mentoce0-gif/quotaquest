#!/usr/bin/env node
'use strict';
/*
 * AI Energy HUD — Monitor
 * Reads local Claude Code / Codex usage logs and writes state.json
 * for the Rainmeter skin. Zero dependencies. Read-only, offline, no telemetry.
 *
 * Usage:
 *   node index.js                 # poll forever (default config.json or config.example.json)
 *   node index.js --once          # write once and exit
 *   node index.js --mock          # emit demo data (no logs needed) — great for screenshots/streams
 *   node index.js --config path   # custom config file
 */

const fs = require('fs');
const path = require('path');
const { collectAgent } = require('./src/parsers');
const { computeAgent } = require('./src/compute');
const { buildState, writeState } = require('./src/state');
const { maybeNotify } = require('./src/notify');

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const argVal = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };

function loadConfig() {
  const explicit = argVal('--config');
  const candidates = [explicit, path.join(__dirname, 'config.json'),
    path.join(__dirname, 'config.example.json')].filter(Boolean);
  for (const c of candidates) {
    try { if (fs.existsSync(c)) return JSON.parse(fs.readFileSync(c, 'utf8')); } catch (e) {
      console.error(`[config] failed to parse ${c}: ${e.message}`);
    }
  }
  throw new Error('No config file found (config.json / config.example.json).');
}

function mockState(cfg) {
  // Deterministic-ish demo that gently drains so the bar visibly moves.
  const t = (Date.now() / 1000) % 600;
  const claudeHp = Math.round(40 + 47 * Math.abs(Math.cos(t / 95)));
  const codexHp = Math.round(20 + 40 * Math.abs(Math.sin(t / 70)));
  const mk = (hp, max, unknown) => ({
    hpPercent: hp, hpCurrent: Math.round(max * hp / 100), hpMax: max,
    mpPercent: Math.round(35 + 30 * Math.abs(Math.sin(t / 120))),
    mpMinutes: 186, mpMaxMinutes: 300,
    regenPerMin: Math.round(max / 300), burnPerHour: 12400,
    recovery: '01:52:18', expToday: 1820000, expWeek: 8730000, expMonth: 32410000,
    status: hp < 15 ? 'CRITICAL' : hp < 40 ? 'WARNING' : 'NORMAL',
    unknown: !!unknown, model: 'Claude Sonnet 4.6',
  });
  return {
    claude: mk(claudeHp, 500000, false),
    codex: mk(codexHp, 500000, codexHp < 30), // simulate silent-consumption unknown
  };
}

function realState(cfg) {
  const lookbackMs = 32 * 24 * 3600 * 1000; // ~month for EXP windows
  const out = {};
  for (const [name, a] of Object.entries(cfg.agents)) {
    if (!a.enabled) continue;
    // Adapter fallback: tools without parseable logs (Cursor/Copilot) can report
    // a manual/estimated percentage so they still appear in the party.
    if (typeof a.manualPercent === 'number' && !a.logDir) {
      const hp = Math.max(0, Math.min(100, a.manualPercent));
      const th = cfg.thresholds || { warningBelowPercent: 40, criticalBelowPercent: 15 };
      out[name] = {
        hpPercent: hp, hpCurrent: Math.round((a.hpMaxTokens || 0) * hp / 100),
        hpMax: a.hpMaxTokens || 0, mpPercent: hp, mpMinutes: 0, mpMaxMinutes: cfg.windowMinutes || 300,
        regenPerMin: 0, burnPerHour: 0, recovery: '00:00:00',
        expToday: 0, expWeek: 0, expMonth: 0,
        status: hp < th.criticalBelowPercent ? 'CRITICAL' : hp < th.warningBelowPercent ? 'WARNING' : 'NORMAL',
        unknown: false, model: name, manual: true,
      };
      continue;
    }
    const { events, hasUnknown, missing } = collectAgent(a.logDir, lookbackMs);
    out[name] = computeAgent(events, {
      hpMaxTokens: a.hpMaxTokens,
      windowMinutes: cfg.windowMinutes,
      thresholds: cfg.thresholds,
      hasUnknown, missing,
    });
    out[