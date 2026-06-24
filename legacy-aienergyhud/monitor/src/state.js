'use strict';
/*
 * state.js — build the flat state.json contract and write it atomically.
 * Flat + fixed key order so Rainmeter's WebParser RegExp stays robust.
 */

const fs = require('fs');
const path = require('path');

/** Assemble the flat state object from per-agent computed gauges. */
function buildState(primaryAgent, agents) {
  const p = agents[primaryAgent] || Object.values(agents)[0] || {};
  const state = {
    schema: 1,
    updated: new Date().toISOString(),
    status: p.status || 'NO DATA',
    model: p.model || primaryAgent,
    primary_agent: primaryAgent,
    hp_percent: p.hpPercent ?? 0,
    hp_current: p.hpCurrent ?? 0,
    hp_max: p.hpMax ?? 0,
    mp_percent: p.mpPercent ?? 0,
    mp_minutes: p.mpMinutes ?? 0,
    mp_max_minutes: p.mpMaxMinutes ?? 300,
    regen_per_min: p.regenPerMin ?? 0,
    burn_per_hour: p.burnPerHour ?? 0,
    recovery: p.recovery || '00:00:00',
    exp_today: p.expToday ?? 0,
    exp_week: p.expWeek ?? 0,
    exp_month: p.expMonth ?? 0,
  };
  // Party fields: <agent>_hp_percent / <agent>_status
  for (const [name, g] of Object.entries(agents)) {
    state[`${name}_hp_percent`] = g.unknown ? -1 : (g.hpPercent ?? 0);
    state[`${name}_status`] = g.unknown ? 'UNKNOWN' : (g.status || 'NO DATA');
  }
  return state;
}

/** Atomic write: tmp file then rename, so Rainmeter never reads a half file. */
function writeState(outputPath, state) {
  const abs = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const tmp = abs + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2), 'utf8');
  fs.renameSync(tmp, abs);
  return abs;
}

module.exports = { buildState, writeState };
