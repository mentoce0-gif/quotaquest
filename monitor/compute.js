'use strict';
/**
 * compute.js — EnergyHUD Engine core (v2, multi-provider "party").
 *
 * Turns per-provider usage events into a state.json describing a PARTY of AIs.
 * Each connected AI/provider is a party member with its own HP/MP/EXP, Regen,
 * Recovery and FullRecover. An `aggregate` rolls the party up for compact skins,
 * and top-level hp/mp/exp mirror the aggregate for backward compatibility.
 *
 * Pure & deterministic given (providers, cfg, now). The renderer does no math.
 */
const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;
const SESSION_MIN = 300; // 5-hour rolling window, in minutes

const clampPct = (n) => Math.max(0, Math.min(100, Math.round(n)));
const toHours = (tok, tph) => +(tok / tph).toFixed(1);

function humanTokens(tok) {
  tok = Math.round(tok);
  if (tok >= 1e9) return (tok / 1e9).toFixed(1) + 'B';
  if (tok >= 1e6) return (tok / 1e6).toFixed(1) + 'M';
  if (tok >= 1e3) return Math.round(tok / 1e3) + 'k';
  return String(tok);
}
function humanDuration(ms) {
  if (ms <= 0) return '0m';
  const t = Math.floor(ms / 60000), h = Math.floor(t / 60), m = t % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}
function sumTokens(events, sinceMs, nowMs) {
  let t = 0, cost = 0;
  for (const e of events) if (e.ts >= sinceMs && e.ts <= nowMs) { t += e.tokens || 0; cost += e.costUsd || 0; }
  return { tokens: t, cost };
}
function burnLevel(tpm, lv) {
  if (tpm <= 0 || tpm < lv.low) return 'LOW';
  if (tpm < lv.moderate) return 'MODERATE';
  if (tpm < lv.high) return 'HIGH';
  return 'EXTREME';
}
function statusRank(s) { return s === 'CRITICAL' ? 2 : s === 'WARNING' ? 1 : 0; }
function rankStatus(r) { return r === 2 ? 'CRITICAL' : r === 1 ? 'WARNING' : 'NORMAL'; }

/** earliest event still inside the 5h window -> when the window STARTS to free */
function sessionPartialReset(events, nowMs) {
  const since = nowMs - 5 * HOUR; let e0 = null;
  for (const e of events) if (e.ts >= since && e.ts <= nowMs && (e0 === null || e.ts < e0)) e0 = e.ts;
  return e0 === null ? nowMs : e0 + 5 * HOUR;
}
/** latest event in the 5h window -> when the session is FULLY recovered */
function sessionFullReset(events, nowMs) {
  const since = nowMs - 5 * HOUR; let e1 = null;
  for (const e of events) if (e.ts >= since && e.ts <= nowMs && (e1 === null || e.ts > e1)) e1 = e.ts;
  return e1 === null ? nowMs : e1 + 5 * HOUR;
}
function nextWeeklyReset(nowMs) {
  const d = new Date(nowMs), day = d.getDay(), du = ((8 - day) % 7) || 7;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + du, 0, 0, 0, 0).getTime();
}

/** Build one party member (one AI provider). */
function buildMember(provider, cfg, nowMs) {
  const events = provider.events || [];
  const caps = cfg.plans[provider.plan || cfg.plan] || cfg.plans.custom;
  const useHrs = cfg.unit === 'hrs';
  const tph = cfg.tokensPerHour || 2200000;
  const unit = useHrs ? 'hrs' : 'tok';
  const fmt = (tok) => useHrs ? toHours(tok, tph) : Math.round(tok);
  const leftStr = (tok) => useHrs ? `${toHours(tok, tph)}h left` : `${humanTokens(tok)} left`;

  const week = sumTokens(events, nowMs - 7 * DAY, nowMs);
  const session = sumTokens(events, nowMs - 5 * HOUR, nowMs);
  const startOfDay = new Date(nowMs); startOfDay.setHours(0, 0, 0, 0);
  const today = sumTokens(events, startOfDay.getTime(), nowMs);

  const hpRemain = 100 - clampPct(week.tokens / caps.weeklyTokens * 100);
  const mpRemain = 100 - clampPct(session.tokens / caps.sessionTokens * 100);
  const expPct = clampPct(today.tokens / caps.dailyTargetTokens * 100);
  const remHp = Math.max(0, caps.weeklyTokens - week.tokens);
  const remMp = Math.max(0, caps.sessionTokens - session.tokens);

  const thr = cfg.thresholds;
  let status = 'NORMAL';
  if (hpRemain <= thr.critical || mpRemain <= 5) status = 'CRITICAL';
  else if (hpRemain <= thr.warning || mpRemain <= 20) status = 'WARNING';

  // burn (last 10 min) and regen (avg rate the 5h window frees up)
  const burnWin = sumTokens(events, nowMs - 10 * 60 * 1000, nowMs);
  const burnTpm = Math.round(burnWin.tokens / 10);
  const regenTpm = Math.round(session.tokens / SESSION_MIN);

  const partial = sessionPartialReset(events, nowMs);
  const full = sessionFullReset(events, nowMs);
  const weekly = nextWeeklyReset(nowMs);

  return {
    id: provider.id, name: provider.name, model: provider.model || 'unknown',
    source: provider.source || 'jsonl', status,
    hp: { bar: hpRemain, line: `${hpRemain}% · ${leftStr(remHp)}`, label: 'WEEKLY',
          percent: hpRemain, used: fmt(week.tokens), remaining: fmt(remHp), max: fmt(caps.weeklyTokens), unit },
    mp: { bar: mpRemain, line: `${mpRemain}% · ${leftStr(remMp)}`, label: 'SESSION',
          percent: mpRemain, used: fmt(session.tokens), remaining: fmt(remMp), max: fmt(caps.sessionTokens), unit },
    exp: { bar: expPct, line: `${expPct}% of target`, label: 'TODAY', tokens: today.tokens, costUsd: +today.cost.toFixed(2) },
    regen: { tokensPerMin: regenTpm, line: `+${regenTpm.toLocaleString('en-US')} tok/min` },
    burn: { tokensPerMin: burnTpm, usdPerHour: +(burnWin.cost * 6).toFixed(2), level: burnLevel(burnTpm, cfg.burnLevels) },
    recovery: {
      human: humanDuration(partial - nowMs),                  // next partial reset (window starts freeing)
      secondsRemaining: Math.max(0, Math.round((partial - nowMs) / 1000)),
      fullHuman: humanDuration(full - nowMs),                 // FULL session recover
      fullSecondsRemaining: Math.max(0, Math.round((full - nowMs) / 1000)),
      weeklyHuman: humanDuration(weekly - nowMs),             // weekly (HP) full reset
      nextResetIso: new Date(partial).toISOString(),
      fullRecoverIso: new Date(full).toISOString(),
      weeklyResetIso: new Date(weekly).toISOString(),
    },
  };
}

/** Aggregate the party into a single rollup for compact skins. */
function aggregate(party, cfg, nowMs) {
  if (!party.length) return null;
  const useHrs = cfg.unit === 'hrs';
  const tph = cfg.tokensPerHour || 2200000;
  const unit = useHrs ? 'hrs' : 'tok';
  const fmt = (tok) => useHrs ? toHours(tok, tph) : Math.round(tok);
  const leftStr = (tok) => useHrs ? `${toHours(tok, tph)}h left` : `${humanTokens(tok)} left`;

  let remHp = 0, maxHp = 0, remMp = 0, maxMp = 0, expSum = 0, burn = 0, regen = 0, rank = 0, soonest = Infinity, fullSoonest = Infinity;
  for (const m of party) {
    const caps = cfg.plans[m._plan] || cfg.plans[cfg.plan] || cfg.plans.custom;
    // reconstruct token remainders from member display is lossy; recompute from percent*max
    const hpMaxTok = caps.weeklyTokens, mpMaxTok = caps.sessionTokens;
    remHp += hpMaxTok * (m.hp.bar / 100); maxHp += hpMaxTok;
    remMp += mpMaxTok * (m.mp.bar / 100); maxMp += mpMaxTok;
    expSum += m.exp.bar; burn += m.burn.tokensPerMin; regen += m.regen.tokensPerMin;
    rank = Math.max(rank, statusRank(m.status));
    if (m.recovery.secondsRemaining > 0) soonest = Math.min(soonest, m.recovery.secondsRemaining);
    if (m.recovery.fullSecondsRemaining > 0) fullSoonest = Math.min(fullSoonest, m.recovery.fullSecondsRemaining);
  }
  const hpBar = clampPct(remHp / maxHp * 100);
  const mpBar = clampPct(remMp / maxMp * 100);
  const expBar = clampPct(expSum / party.length);
  const secs = soonest === Infinity ? 0 : soonest;
  const fsecs = fullSoonest === Infinity ? 0 : fullSoonest;
  return {
    status: rankStatus(rank),
    hp: { bar: hpBar, line: `${hpBar}% · ${leftStr(remHp)}`, label: 'PARTY HP', percent: hpBar, remaining: fmt(remHp), max: fmt(maxHp), unit },
    mp: { bar: mpBar, line: `${mpBar}% · ${leftStr(remMp)}`, label: 'PARTY MP', percent: mpBar, remaining: fmt(remMp), max: fmt(maxMp), unit },
    exp: { bar: expBar, line: `${expBar}% of target`, label: 'TODAY' },
    regen: { tokensPerMin: regen, line: `+${regen.toLocaleString('en-US')} tok/min` },
    burn: { tokensPerMin: burn, level: burnLevel(burn, cfg.burnLevels) },
    recovery: { human: humanDuration(secs * 1000), secondsRemaining: secs, fullHuman: humanDuration(fsecs * 1000) },
  };
}

/**
 * buildState(providers, cfg, now, mode)
 *   providers: array of { id, name, model, plan?, source?, events:[...] }
 *   (a single {events} object is also accepted for back-compat)
 */
function buildState(providers, cfg, nowMs = Date.now(), mode = 'jsonl') {
  // Back-compat: accept a raw events array (or empty) as a single Claude provider.
  const looksLikeEvents = !Array.isArray(providers) || providers.length === 0 || (providers[0] && 'ts' in providers[0]);
  if (looksLikeEvents) providers = [{ id: 'claude-code', name: 'Claude Code', model: 'claude', source: mode, events: Array.isArray(providers) ? providers : [] }];
  const party = providers.map((p) => { const m = buildMember(p, cfg, nowMs); m._plan = p.plan || cfg.plan; return m; });
  const agg = aggregate(party, cfg, nowMs) || {};
  party.forEach((m) => delete m._plan);

  return {
    schemaVersion: 2,
    updatedAt: new Date(nowMs).toISOString(),
    engine: 'energyhud',
    providerCount: party.length,
    status: agg.status || 'NORMAL',
    // top-level mirrors aggregate; ORDER MATTERS for the skin's WebParser regex:
    // status, hp{bar,line}, mp{bar,line}, exp{bar,line}, regen{line}, recovery{human,fullHuman}, burn{level}
    hp: agg.hp, mp: agg.mp, exp: agg.exp,
    regen: agg.regen, recovery: agg.recovery, burn: agg.burn,
    party,
    aggregate: agg,
    thresholds: cfg.thresholds,
  };
}

module.exports = { buildState, buildMember, aggregate, humanDuration, burnLevel, humanTokens,
  sessionPartialReset, sessionFullReset, nextWeeklyReset };
