/* popup-frequency.js — timestamp-based show caps & dismiss cooldown */
(function (global) {
  'use strict';

  var PREFIX   = 'enka_pp_freq_';
  var VISIT_KEY = 'enka_pp_visits';

  function getStore(id) {
    try {
      var raw = localStorage.getItem(PREFIX + id);
      return raw ? JSON.parse(raw) : { shownCount: 0, lastShown: 0, lastDismissed: 0, lastConverted: 0 };
    } catch (e) {
      return { shownCount: 0, lastShown: 0, lastDismissed: 0, lastConverted: 0 };
    }
  }

  function setStore(id, data) {
    try { localStorage.setItem(PREFIX + id, JSON.stringify(data)); } catch (e) {}
  }

  function getTotalVisits() {
    return parseInt(localStorage.getItem(VISIT_KEY) || '0', 10);
  }

  function recordVisit() {
    try { localStorage.setItem(VISIT_KEY, String(getTotalVisits() + 1)); } catch (e) {}
  }

  function isNewVisitor() {
    return getTotalVisits() <= 1;
  }

  function canShow(cfg) {
    var now   = Date.now();
    var freq  = cfg.frequency || {};
    var store = getStore(cfg.id);

    var audience = freq.audience || 'all';
    if (audience === 'new'       && !isNewVisitor()) return false;
    if (audience === 'returning' &&  isNewVisitor()) return false;

    // Dismiss cooldown: x days after user clicked ×
    var coolDays = parseFloat(freq.dismissCooldownDays) || 0;
    if (coolDays > 0 && store.lastDismissed) {
      if (now - store.lastDismissed < coolDays * 864e5) return false;
    }

    var cap = freq.showCap || 'session';

    if (cap === 'session') {
      return !sessionStorage.getItem('pp_s_' + cfg.id);
    }
    if (cap === 'perDay') {
      if (!store.lastShown) return true;
      var dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
      return store.lastShown < dayStart.getTime();
    }
    if (cap === 'perWeek') {
      return !store.lastShown || (now - store.lastShown) >= 7 * 864e5;
    }
    return true;
  }

  function recordShown(id) {
    var s = getStore(id);
    s.shownCount++;
    s.lastShown = Date.now();
    setStore(id, s);
    try { sessionStorage.setItem('pp_s_' + id, '1'); } catch (e) {}
  }

  function recordDismissed(id) {
    var s = getStore(id);
    s.lastDismissed = Date.now();
    setStore(id, s);
  }

  function recordConversion(id) {
    var s = getStore(id);
    s.lastConverted = Date.now();
    setStore(id, s);
  }

  global.PopupFrequency = {
    canShow:          canShow,
    recordShown:      recordShown,
    recordDismissed:  recordDismissed,
    recordConversion: recordConversion,
    recordVisit:      recordVisit,
    isNewVisitor:     isNewVisitor,
    getStore:         getStore
  };
})(window);
