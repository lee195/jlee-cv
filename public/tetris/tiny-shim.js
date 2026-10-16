/*
 * Browser stand-in for the tiny.js bridge, so the Tetris frontend runs on the CV
 * site with sound and saves.
 *
 * The game's own code is untouched: it only ever calls `tiny.api.call(method,
 * params)` (and `tiny.win.show` in the bench path). This file answers those calls
 * the way the desktop backend (`~/ai-workspace/tetris/src/main.js`, e779bad)
 * does, but with localStorage instead of JSON files and Web Audio instead of the
 * native sampler. Neither needs a permission prompt.
 *
 * Loaded as a classic script before the module entry point, so `tiny` exists
 * before `js/main.js` runs.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------- limits (backend) */

  var MAX_REPLAYS = 100;
  var MAX_REPLAY_BYTES = 4 * 1024 * 1024;
  var MAX_SCORES_PER_MODE = 25;
  var SFX_NAME = /^[a-z][a-z0-9]{0,15}$/;
  var MAX_SFX_ENTRIES = 16;
  var MAX_SFX_BYTES = 256 * 1024;
  var MAX_SFX_B64 = Math.ceil(MAX_SFX_BYTES / 3) * 4;

  var KEY_SETTINGS = 'tetris:settings';
  var KEY_SCORES = 'tetris:scores';
  var KEY_REPLAYS = 'tetris:replays';
  var KEY_REPLAY = 'tetris:replay:';

  /* ------------------------------------------------------------------ storage */

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (err) {
      // Missing, corrupt or blocked storage all mean "start fresh".
      return fallback;
    }
  }

  // Throws on a full quota or blocked storage; the game's call() reports it.
  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  function removeKey(key) {
    try { localStorage.removeItem(key); } catch (err) { /* already gone */ }
  }

  /* ----------------------------------------------------- scores (ported as-is) */

  function isFiniteNumber(n) { return typeof n === 'number' && isFinite(n); }

  function validId(id) {
    return typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,63}$/.test(id);
  }

  function cleanScore(entry) {
    if (!entry || typeof entry !== 'object') return null;
    if (typeof entry.mode !== 'string' || entry.mode.length > 32) return null;
    if (!isFiniteNumber(entry.score) || entry.score < 0) return null;
    return {
      mode: entry.mode,
      score: Math.floor(entry.score),
      lines: isFiniteNumber(entry.lines) ? Math.floor(entry.lines) : 0,
      ticks: isFiniteNumber(entry.ticks) ? Math.floor(entry.ticks) : 0,
      reason: typeof entry.reason === 'string' ? entry.reason.slice(0, 16) : '',
      date: isFiniteNumber(entry.date) ? entry.date : Date.now(),
    };
  }

  function replayMeta(replay) {
    var r = replay && replay.result ? replay.result : {};
    return {
      id: replay.id,
      mode: typeof replay.mode === 'string' ? replay.mode : 'marathon',
      score: isFiniteNumber(r.score) ? r.score : 0,
      lines: isFiniteNumber(r.lines) ? r.lines : 0,
      ticks: isFiniteNumber(replay.ticks) ? replay.ticks : 0,
      reason: typeof r.reason === 'string' ? r.reason : '',
      date: isFiniteNumber(replay.date) ? replay.date : Date.now(),
    };
  }

  function sortScores(list) {
    return list.slice().sort(function (a, b) { return (b.score - a.score) || (b.date - a.date); });
  }

  function trimScores(list) {
    var byMode = new Map();
    list.forEach(function (s) {
      if (!byMode.has(s.mode)) byMode.set(s.mode, []);
      byMode.get(s.mode).push(s);
    });
    var out = [];
    byMode.forEach(function (group) {
      out.push.apply(out, sortScores(group).slice(0, MAX_SCORES_PER_MODE));
    });
    return sortScores(out);
  }

  function asArray(v) { return Array.isArray(v) ? v : []; }

  /* -------------------------------------------------------------------- audio */

  var ctx = null;
  var master = null;
  var masterValue = 1;
  var buffers = new Map();
  var active = new Set();

  function audio() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error('Web Audio unavailable');
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = masterValue;
    master.connect(ctx.destination);
    return ctx;
  }

  // Browsers start an AudioContext suspended until the page sees a user gesture.
  // Opening the game was one, but it happened in the parent page, so resume on
  // the first key or click in here. No prompt is involved.
  function unlock() {
    try {
      var c = audio();
      if (c.state === 'suspended') c.resume();
    } catch (err) { /* stays silent */ }
  }
  window.addEventListener('keydown', unlock, true);
  window.addEventListener('pointerdown', unlock, true);

  function b64ToBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function looksLikeWav(b) {
    return b.length >= 12 &&
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x41 && b[10] === 0x56 && b[11] === 0x45;
  }

  async function loadSfx(params) {
    var entries = params && params.entries;
    if (!Array.isArray(entries)) throw new Error('loadSfx: entries must be an array');
    if (entries.length > MAX_SFX_ENTRIES) throw new Error('loadSfx: too many entries');

    var loaded = 0;
    var failed = null;
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var name = e && typeof e.name === 'string' ? e.name : '';
      if (!SFX_NAME.test(name)) { failed = name || '(unnamed)'; break; }
      var b64 = typeof e.bytesB64 === 'string' ? e.bytesB64 : '';
      if (!b64) { failed = name + ' (no bytes)'; break; }
      if (b64.length > MAX_SFX_B64) { failed = name + ' (too large)'; break; }
      var bytes;
      try { bytes = b64ToBytes(b64); } catch (err) { failed = name + ' (bad base64)'; break; }
      if (!bytes.length || bytes.length > MAX_SFX_BYTES || !looksLikeWav(bytes)) {
        failed = name + ' (not a usable wav)';
        break;
      }
      try {
        // decodeAudioData detaches the buffer it is given, so hand it a copy.
        buffers.set(name, await audio().decodeAudioData(bytes.buffer.slice(0)));
      } catch (err) {
        failed = name + ' (' + (err && err.message ? err.message : String(err)) + ')';
        break;
      }
      loaded++;
    }
    return { loaded: loaded, total: entries.length, failed: failed };
  }

  function play(params) {
    var buf = buffers.get(params && params.name);
    if (!buf) throw new Error('sampler.play: unknown sound ' + (params && params.name));
    var c = audio();
    var src = c.createBufferSource();
    src.buffer = buf;
    if (isFiniteNumber(params.rate) && params.rate > 0) src.playbackRate.value = params.rate;
    var gain = c.createGain();
    gain.gain.value = isFiniteNumber(params.vol) ? Math.max(0, Math.min(1, params.vol)) : 1;
    src.connect(gain).connect(master);
    active.add(src);
    src.onended = function () { active.delete(src); };
    src.start();
    return true;
  }

  /* ---------------------------------------------------------------------- api */

  var api = {
    log: function (p) { console.debug('[tetris]', p && p.msg); return true; },
    bench: function () { return false; },
    quit: function () {
      try { parent.postMessage({ type: 'tetris:quit' }, location.origin); } catch (err) { /* standalone */ }
      return true;
    },
    'app.screens': function () { return []; },
    'win.show': function () { return true; },
    'win.setPosition': function () { return true; },
    'win.getState': function () { return {}; },

    getSettings: function () { return readJson(KEY_SETTINGS, null); },
    saveSettings: function (p) {
      if (!p || !p.settings || typeof p.settings !== 'object') throw new Error('settings: not an object');
      return writeJson(KEY_SETTINGS, p.settings);
    },

    getScores: function () { return asArray(readJson(KEY_SCORES, [])); },
    saveScore: function (p) {
      var clean = cleanScore(p && p.entry);
      if (!clean) throw new Error('score: malformed entry');
      var next = trimScores(asArray(readJson(KEY_SCORES, [])).concat([clean]));
      writeJson(KEY_SCORES, next);
      return next;
    },

    listReplays: function () { return asArray(readJson(KEY_REPLAYS, [])); },
    saveReplay: function (p) {
      var replay = p && p.replay;
      if (!replay || typeof replay !== 'object') throw new Error('replay: not an object');
      if (!Array.isArray(replay.log)) throw new Error('replay: no log');
      var body = JSON.stringify(replay);
      if (body.length > MAX_REPLAY_BYTES) throw new Error('replay: too large (' + body.length + ' bytes)');

      var id = Date.now().toString(36) + '-' + Math.floor(Math.random() * 1679616).toString(36);
      var stored = Object.assign({}, replay, { id: id, date: Date.now() });
      writeJson(KEY_REPLAY + id, stored);

      var index = asArray(readJson(KEY_REPLAYS, []));
      index.push(replayMeta(stored));
      var kept = sortScores(index).slice(0, MAX_REPLAYS);
      var keptIds = new Set(kept.map(function (m) { return m.id; }));
      index.forEach(function (m) {
        if (!keptIds.has(m.id) && validId(m.id)) removeKey(KEY_REPLAY + m.id);
      });
      writeJson(KEY_REPLAYS, kept);
      return replayMeta(stored);
    },
    loadReplay: function (p) {
      if (!validId(p && p.id)) throw new Error('replay: bad id');
      return readJson(KEY_REPLAY + p.id, null);
    },
    deleteReplay: function (p) {
      if (!validId(p && p.id)) throw new Error('replay: bad id');
      removeKey(KEY_REPLAY + p.id);
      writeJson(KEY_REPLAYS, asArray(readJson(KEY_REPLAYS, [])).filter(function (m) { return m.id !== p.id; }));
      return true;
    },

    loadSfx: loadSfx,
    'sampler.play': play,
    'sampler.master': function (p) {
      masterValue = isFiniteNumber(p && p.value) ? Math.max(0, Math.min(1, p.value)) : 1;
      if (master) master.gain.value = masterValue;
      return true;
    },
    'sampler.stopAll': function () {
      active.forEach(function (src) { try { src.stop(); } catch (err) { /* ended */ } });
      active.clear();
      return true;
    },
  };

  window.tiny = {
    api: {
      call: async function (method, params) {
        var fn = api[method];
        if (!fn) throw new Error('not available in the browser: ' + method);
        return fn(params || {});
      },
    },
    win: { show: async function () { return true; } },
  };
})();
