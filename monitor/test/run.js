'use strict';
const assert = require('assert');
const { buildState, humanDuration, burnLevel } = require('../compute');
const { validate } = require('../state');
const cfg = require('../config.json');
let pass = 0;
const ok = (n, f) => { try { f(); pass++; console.log('  ✓', n); } catch (e) { console.error('  ✗', n, '\n   ', e.message); process.exit(1); } };
const now = Date.now(), HOUR = 3600e3;

ok('humanDuration', () => { assert.strictEqual(humanDuration(2 * HOUR), '2h 00m'); assert.strictEqual(humanDuration(0), '0m'); });
ok('burnLevel', () => { assert.strictEqual(burnLevel(0, cfg.burnLevels), 'LOW'); assert.strictEqual(burnLevel(999999, cfg.burnLevels), 'EXTREME'); });

ok('single provider (back-compat events array) -> valid v2', () => {
  const s = buildState([], cfg, now, 'jsonl');
  assert.strictEqual(s.schemaVersion, 2);
  assert.strictEqual(s.party.length, 1);
  assert.strictEqual(s.hp.percent, 100);
  validate(s);
});

ok('multi-provider party rolls up + aggregate worst status', () => {
  const caps = cfg.plans[cfg.plan];
  const providers = [
    { id: 'a', name: 'Claude Code', model: 'x', plan: 'max20x', events: [] },                                   // healthy
    { id: 'b', name: 'Cursor', model: 'y', plan: 'pro', events: [{ ts: now - HOUR, tokens: cfg.plans.pro.weeklyTokens * 0.95, model: 'y', costUsd: 1 }] }, // critical
  ];
  const s = buildState(providers, cfg, now, 'demo');
  assert.strictEqual(s.party.length, 2);
  assert.strictEqual(s.status, 'CRITICAL');                 // worst member wins
  assert.ok(s.aggregate.hp.percent >= 0 && s.aggregate.hp.percent <= 100);
  validate(s);
});

ok('member exposes regen + recovery.fullHuman', () => {
  const caps = cfg.plans[cfg.plan];
  const providers = [{ id: 'a', name: 'A', plan: 'max20x', events: [{ ts: now - 2 * HOUR, tokens: caps.sessionTokens * 0.5, model: 'x', costUsd: 0.5 }] }];
  const s = buildState(providers, cfg, now, 'demo');
  const m = s.party[0];
  assert.ok('tokensPerMin' in m.regen);
  assert.ok(typeof m.recovery.fullHuman === 'string');
  assert.ok(m.recovery.fullSecondsRemaining >= m.recovery.secondsRemaining); // full >= partial
});

ok('percent bounds across party', () => {
  const providers = [{ id: 'a', name: 'A', plan: 'pro', events: [{ ts: now, tokens: 9e12, model: 'x', costUsd: 1 }] }];
  const s = buildState(providers, cfg, now, 'demo');
  for (const m of s.party) { assert.ok(m.hp.percent >= 0 && m.hp.percent <= 100); assert.ok(m.mp.percent >= 0 && m.mp.percent <= 100); }
});

console.log(`\nAll ${pass} tests passed.`);
