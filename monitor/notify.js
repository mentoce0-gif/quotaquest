'use strict';
/*
 * notify.js — edge-triggered desktop notifications when AI energy runs low.
 * Ported from the AI Energy HUD build and adapted to EnergyHUD v2 state.
 * Fires only when status WORSENS (NORMAL→WARNING→CRITICAL), with a cooldown.
 * Zero npm deps:  Windows PowerShell balloon · macOS osascript · Linux notify-send.
 */
const { spawn } = require('child_process');
function safeSpawn(cmd, args, opts) {
  try { const c = spawn(cmd, args, opts); c.on('error', () => {}); if (c.unref) c.unref(); } catch (e) {}
}
const RANK = { 'NO DATA': -1, NORMAL: 0, WARNING: 1, CRITICAL: 2 };
let lastRank = 0, lastFiredAt = 0;
function psStr(s) { return "'" + String(s).replace(/'/g, "''") + "'"; }
function q(s) { return '"' + String(s).replace(/"/g, '\\"') + '"'; }
function fireWindows(title, message, level) {
  const icon = level === 'CRITICAL' ? 'Error' : 'Warning';
  const ps = ['Add-Type -AssemblyName System.Windows.Forms;',
    '$n = New-Object System.Windows.Forms.NotifyIcon;',
    `$n.Icon = [System.Drawing.SystemIcons]::${icon};`, '$n.Visible = $true;',
    `$n.ShowBalloonTip(6000, ${psStr(title)}, ${psStr(message)}, '${icon}');`,
    'Start-Sleep -Seconds 7; $n.Dispose();'].join(' ');
  safeSpawn('powershell', ['-NoProfile', '-WindowStyle', 'Hidden', '-Command', ps], { detached: true, stdio: 'ignore', windowsHide: true });
}
function fireMac(title, message) { safeSpawn('osascript', ['-e', `display notification ${q(message)} with title ${q(title)}`], { detached: true, stdio: 'ignore' }); }
function fireLinux(title, message, level) { safeSpawn('notify-send', ['-u', level === 'CRITICAL' ? 'critical' : 'normal', title, message], { detached: true, stdio: 'ignore' }); }
function dispatch(title, message, level) {
  try { if (process.platform === 'win32') fireWindows(title, message, level);
    else if (process.platform === 'darwin') fireMac(title, message); else fireLinux(title, message, level); } catch (e) {}
}
/** Call once per tick with the v2 state object. Uses cfg.notify {enabled, cooldownMinutes, onWarning}. */
function maybeNotify(state, cfg) {
  const n = (cfg && cfg.notify) || {};
  if (n.enabled === false) return;
  const rank = RANK[state.status] != null ? RANK[state.status] : 0;
  const worsened = rank > lastRank; lastRank = rank;
  if (!worsened || rank < 1) return;
  if (rank === 1 && n.onWarning === false) return;
  const cooldownMs = Math.max(0, n.cooldownMinutes != null ? n.cooldownMinutes : 10) * 60000;
  const now = Date.now(); if (now - lastFiredAt < cooldownMs) return; lastFiredAt = now;
  const level = state.status;
  const title = `QuotaQuest — ${level}`;
  const hp = state.hp && state.hp.percent != null ? state.hp.percent : '?';
  const rec = state.recovery && state.recovery.human ? state.recovery.human : '—';
  const msg = level === 'CRITICAL'
    ? `Party HP ${hp}% — almost out. Recovery in ${rec}.`
    : `Party HP ${hp}% — running low. Recovery in ${rec}.`;
  dispatch(title, msg, level);
}
module.exports = { maybeNotify };
