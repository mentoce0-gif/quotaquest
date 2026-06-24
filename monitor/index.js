#!/usr/bin/env node
'use strict';
/**
 * QuotaQuest — EnergyHUD Engine entry point (v2, multi-provider).
 *
 *   node index.js              # poll forever, write state.json
 *   node index.js --once       # compute once and exit
 *   node index.js --demo       # synthetic 2-AI party (screenshots / offline)
 *   node index.js --plan max5x # override default plan
 *   node index.js --interval 15
 */
const fs = require('fs');
const path = require('path');
const { getProviders } = require('./sources');
const { buildState } = require('./compute');
const { writeState } = require('./state');
const { maybeNotify } = require('./notify');

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d; };

let cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
if (val('--plan')) cfg.plan = val('--plan');
if (val('--interval')) cfg.intervalSeconds = parseInt(val('--interval'), 10);

const statePath = path.resolve(__dirname, cfg.statePath);
const logPath = path.resolve(__dirname, cfg.logPath || './monitor.log');
const force = has('--demo') ? 'demo' : undefined;

function log(m) { try { fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${m}\n`); } catch (e) {} }

function tick() {
  try {
    const providers = getProviders(cfg, { force });
    const state = buildState(providers, cfg, Date.now());
    writeState(statePath, state);
    maybeNotify(state, cfg);
    const names = state.party.map((m) => `${m.name}(${m.status} HP${m.hp.percent}%)`).join(', ');
    log(`ok providers=${state.providerCount} status=${state.status} | ${names}`);
    if (has('--once') || has('--verbose')) {
      console.log(`[HUD] PARTY ${state.status} (${state.providerCount} AIs)  aggHP ${state.hp.percent}% aggMP ${state.mp.percent}%  regen ${state.regen.line}  recover ${state.recovery.human} (full ${state.recovery.fullHuman})`);
      state.party.forEach((m) => console.log(`   - ${m.name}: ${m.status}  HP ${m.hp.line} | MP ${m.mp.line} | regen ${m.regen.line} | recover ${m.recovery.human} full ${m.recovery.fullHuman}`));
    }
  } catch (err) { log('ERROR ' + err.message); if (has('--once')) { console.error('[HUD] error:', err.message); process.exit(1); } }
}

tick();
if (!has('--once')) {
  const ms = Math.max(5, cfg.intervalSeconds || 30) * 1000;
  console.log(`[HUD] EnergyHUD engine running every ${ms / 1000}s -> ${statePath}  (Ctrl+C to stop)`);
  setInterval(tick, ms);
}
