'use strict';
/*
 * compute.js — turn raw usage events into HP/MP/regen/burn/recovery/status.
 * Pure functions, no I/O, fully unit-testable.
 */

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const HOUR = 3600000, MIN = 60000;

/** Format minutes as hh:mm:ss. */
function fmtClock(totalMin) {
  if (!isFinite(totalMin) || totalMin < 0) totalMin = 0;
  const totalSec = Math.round(totalMin * 60);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (x) => String(x).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * Compute one agent's gauge state.
 * @param events [{ts,tokens,known}]
 * @param opts {hpMaxTokens, windowMinutes, hasUnknown, thresholds, now}
 */
function computeAgent(events, opts) {
  const now = opts.now || Date.now();
  const windowMin = opts.windowMinutes || 300;
  const windowMs = windowMin * MIN;
  const hpMax = opts.hpMaxTokens || 500000;
  const th = opts.thresholds || { warningBelowPercent: 40, criticalBelowPercent: 15 };

  const windowStart = now - windowMs;
  const inWindow = events.filter(e => e.ts >= windowStart);
  const used = inWindow.reduce((a, e) => a + e.tokens, 0);

  // Block start = first event in window (proxy for the rolling window's anchor).
  const firstTs = inWindow.length ? Math.min(...inWindow.map(e => e.ts)) : now;
  const elapsedMin = clamp((now - firstTs) / MIN, 0, windowMin);

  const hpCurrent = clamp(hpMax - used, 0, hpMax);
  const hpPercent = Math.round(clamp(100 * hpCurrent / hpMax, 0, 100));
  const mpPercent = Math.round(clamp(100 * (windowMin - elapsedMin) / windowMin, 0, 100));
  const mpMinutes = Math.round(clamp(windowMin - elapsedMin, 0, windowMin));

  const regenPerMin = Math.round(hpMax / windowMin);
  const burnPerHour = Math.round(used / Math.max(elapsedMin, 1) * 60);
  const recoveryMin = regenPerMin > 0 ? used / regenPerMin : 0;

  let status = 'NORMAL';
  if (hpPercent < th.criticalBelowPercent) status = 'CRITICAL';
  else if (hpPercent < th.warningBelowPercent) status = 'WARNING';
  if (opts.missing) status = 'NO DATA';
  if (opts.hasUnknown && status === 'NORMAL') status = 'WARNING'; // silent consumption flag

  // EXP windows
  const sumSince = (ms) => events.filter(e => e.ts >= now - ms).reduce((a, e) => a + e.tokens, 0);
  const expToday = sumSince(24 * HOUR);
  const expWeek = sumSince(7 * 24 * HOUR);
  const expMonth = sumSince(30 * 24 * HOUR);

  return {
    hpPercent, hpCurrent, hpMax,
    mpPercent, mpMinutes, mpMaxMinutes: windowMin,
    regenPerMin, burnPerHour,
    recovery: fmtClock(recoveryMin),
    expToday, expWeek, expMonth,
    status,
    unknown: !!opts.hasUnknown,
  };
}

module.exports = { computeAgent, fmtClock, clamp };
