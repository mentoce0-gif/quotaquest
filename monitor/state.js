'use strict';
/**
 * state.js — JSON State Manager (schema v2). Atomic writes; validation.
 */
const fs = require('fs');
const path = require('path');

function validate(s) {
  for (const k of ['schemaVersion', 'status', 'party', 'aggregate', 'hp', 'mp']) if (!(k in s)) throw new Error('state missing field: ' + k);
  if (!['NORMAL', 'WARNING', 'CRITICAL'].includes(s.status)) throw new Error('invalid status: ' + s.status);
  if (!Array.isArray(s.party) || !s.party.length) throw new Error('party must be a non-empty array');
  for (const m of s.party) {
    for (const bar of ['hp', 'mp']) {
      const p = m[bar] && m[bar].percent;
      if (typeof p !== 'number' || p < 0 || p > 100) throw new Error(`party ${m.id} ${bar}.percent out of range`);
    }
  }
  for (const bar of ['hp', 'mp']) {
    const p = s[bar].percent;
    if (typeof p !== 'number' || p < 0 || p > 100) throw new Error(`aggregate ${bar}.percent out of range`);
  }
  return true;
}
function writeState(filePath, state) {
  validate(state);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2), 'utf8');
  fs.renameSync(tmp, filePath);
  return filePath;
}
function readState(filePath) { try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch (e) { return null; } }
module.exports = { writeState, readState, validate };
