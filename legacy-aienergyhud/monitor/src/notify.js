'use strict';
/*
 * notify.js — edge-triggered desktop notifications when AI energy runs low.
 * Fires only when the primary agent's status WORSENS (NORMAL→WARNING→CRITICAL),
 * never on every poll, and respects a cooldown. Zero npm dependencies:
 *   Windows : PowerShell tray balloon (System.Windows.Forms.NotifyIcon)
 *   macOS   : osascript "display notification"
 *   Linux   : notify-send (if available)
 */

const { spawn } = require('child_process');

// spawn that never throws or crashes the monitor (missing binary -> async 'error' event)
function safeSpawn(cmd, args, opts) {
  try {
    const c = spawn(cmd, args, opts);
    c.on('error', () => {}); // swallow ENOENT etc.
    if (c.unref) c.unref();
  } catch (e) { /* ignore */ }
}

const RANK = { 'NO DATA': -1, NORMAL: 0, WARNING: 1, CRITICAL: 2 };
let lastRank = 0;          // last status rank we saw
let lastFiredAt = 0;       // epoch ms of last notification

function fireWindows(title, message, level) {
  const icon = level === 'CRITICAL' ? 'Error' : 'Warning';
  const ps = [
    'Add-Type -AssemblyName System.Windows.Forms;',
    '$n = New-Object System.Windows.Forms.NotifyIcon;',
    `$n.Icon = [System.Drawing.SystemIcons]::${icon};`,
    '$n.Visible = $true;',
    `$n.ShowBalloonTip(6000, ${psStr(title)}, ${psStr(message)}, '${icon}');`,
    'Start-Sleep -Seconds 7; $n.Dispose();',
  ].join(' ');
  safeSpawn('powershell', ['-NoProfile', '-WindowStyle', 'Hidden', '-Command', ps],
    { detached: true, stdio: 'ignore', windowsHide: true });
}
function psStr(s) { return "'" + String(s).replace(/'/g, "''") + "'"; }

function fireMac(title, message) {
  const script = `display notification ${q(message)} with title ${q(title)}`;
  safeSpawn('osascript', ['-e', script], { detached: true, stdio: 'ignore' });
}
function q(s) { return '"' + String(s).replace(/"/g, '\\"') + '"'; }

function fireLinux(title, message, level) {
  const urgency = level === 'CRITICAL' ? 'critical' : 'normal';
  safeSpawn('notify-send', ['-u', urgency, title, message],
    { detached: true, stdio: 'ignore' });
}

function dispatch(title, message, level) {
  try {
    if (process.platform === 'win32') fireWindows(title, message, level);
    else if (process.platform === 'darwin') fireMac(title, message);
    else fireLinux(title, message, level);
  } catch (e) { /* notifications are best-effort, never crash the monitor */ }
}

/**
 * Call once per tick with the assembled flat state.
 * @param state  flat state.json object
 * @param cfg    config (uses cfg.notify {enabled, cooldownMinutes, onWarning})
 */
function maybeNotify(state, cfg) {
  const n = cfg.notify || {};
  if (n.enabled === false) return;
  const rank = RANK[state.status] ?? 0;
  const worsened = rank > lastRank;
  lastRank = rank;
  if (!worsened) return;

  const fireWarning = n.onWarning !== false; // notify on WARNING by default
  if (rank === 1 && !fireWarning) return;
  if (rank < 1) return; // only WARNING/CRITICAL

  const cooldownMs = Math.max(0, (n.cooldownMinutes ?? 10)) * 60000;
  const now = Date.now();
  if (now - lastFiredAt < cooldownMs) return;
  lastFiredAt = now;

  const level = state.status;
  const title = `AI Energy HUD — ${level}`;
  const msg = level === 'CRITICAL'
    ? `HP ${state.hp_percent}% — almost out. Recovery in ${state.recovery}.`
    : `HP ${state.hp_percent}% — running low. Recovery in ${state.recovery}.`;
  dispatch(title, msg, level);
  console.log(`[notify] ${level} fired (HP ${state.hp_percent}%)`);
}

// test helper
function _reset() { lastRank = 0; lastFiredAt = 0; }

module.exports = { maybeNotify, _reset };
