/* popup-analytics.js — event buffer (localStorage) + console logging */
(function (global) {
  'use strict';

  var BUFFER_KEY = 'enka_pp_events';
  var isMobile   = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  function getBuffer() {
    try { return JSON.parse(localStorage.getItem(BUFFER_KEY) || '[]'); } catch (e) { return []; }
  }

  /* trackEvent(event, popupId, extra?)
     Events: 'impression' | 'interaction' | 'conversion' | 'dismiss'
     extra: { reason?, variant?, ... } */
  function trackEvent(eventName, popupId, extra) {
    var payload = {
      event:    eventName,
      popupId:  popupId,
      mallId:   window.POPUP_MALL_ID   || 'unknown',
      pageType: window.POPUP_PAGE_TYPE || 'unknown',
      variant:  null,
      device:   isMobile ? 'mobile' : 'desktop',
      ts:       Date.now()
    };
    if (extra) Object.keys(extra).forEach(function (k) { payload[k] = extra[k]; });

    var buf = getBuffer();
    buf.push(payload);
    if (buf.length > 500) buf = buf.slice(-500);
    try { localStorage.setItem(BUFFER_KEY, JSON.stringify(buf)); } catch (e) {}

    console.log('[PopupAnalytics]', payload);

    // TODO: flush to backend on conversion or page unload
    // Example:
    // fetch('/api/enka/popup-events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify([payload])
    // });
  }

  /* Returns { [popupId]: { impression, interaction, conversion, dismiss } } */
  function getStats() {
    var buf   = getBuffer();
    var stats = {};
    buf.forEach(function (e) {
      if (!stats[e.popupId]) stats[e.popupId] = { impression: 0, interaction: 0, conversion: 0, dismiss: 0 };
      if (stats[e.popupId].hasOwnProperty(e.event)) stats[e.popupId][e.event]++;
    });
    return stats;
  }

  function clearBuffer() {
    try { localStorage.removeItem(BUFFER_KEY); } catch (e) {}
  }

  global.PopupAnalytics = { trackEvent: trackEvent, getStats: getStats, clearBuffer: clearBuffer };
})(window);
