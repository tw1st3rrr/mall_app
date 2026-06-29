/* popup-triggers.js — scroll / delay / exit-intent / second-page */
(function (global) {
  'use strict';

  var isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  /* Fire when user scrolled ≥ value% AND minTimeMs has passed */
  function onScroll(value, minTimeMs, callback) {
    var started   = Date.now();
    var threshold = (parseFloat(value) || 60) / 100;

    function check() {
      if (Date.now() - started < minTimeMs) return;
      var h  = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? window.scrollY / h : 0;
      if (pct >= threshold) {
        window.removeEventListener('scroll', check);
        callback();
      }
    }
    window.addEventListener('scroll', check, { passive: true });
  }

  /* Fire after max(value * 1000, minTimeMs) milliseconds */
  function onDelay(value, minTimeMs, callback) {
    var ms = Math.max((parseFloat(value) || 5) * 1000, minTimeMs);
    setTimeout(callback, ms);
  }

  /* Desktop: cursor leaves viewport through top edge
     Mobile: page hides → returns (back button / tab switch) OR idle 60s */
  function onExitIntent(minTimeMs, callback) {
    var started = Date.now();
    var fired   = false;

    function fire() {
      if (fired) return;
      if (Date.now() - started < minTimeMs) return;
      fired = true;
      callback();
    }

    if (!isMobile) {
      document.addEventListener('mouseleave', function (e) {
        if (e.clientY <= 0) fire();
      });
      return;
    }

    // Mobile: visibility hidden → visible means user came back (back nav / switcher)
    var hiddenAt = 0;
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        hiddenAt = Date.now();
      } else if (hiddenAt > 0 && Date.now() - hiddenAt < 5000) {
        // quick return = back button tap
        fire();
      }
    });

    // Mobile fallback: 60s idle (no touch/scroll)
    var idleTimer;
    function resetIdle() {
      clearTimeout(idleTimer);
      var elapsed = Date.now() - started;
      var waitFor = Math.max(0, minTimeMs - elapsed);
      idleTimer = setTimeout(function () {
        idleTimer = setTimeout(fire, 60000);
      }, waitFor);
    }
    ['touchstart', 'touchmove', 'scroll'].forEach(function (ev) {
      document.addEventListener(ev, resetIdle, { passive: true });
    });
    resetIdle();
  }

  /* Fire on the 2nd+ page view within the same session */
  function onSecondPage(minTimeMs, callback) {
    var KEY   = 'enka_pp_pv';
    var count = parseInt(sessionStorage.getItem(KEY) || '0', 10) + 1;
    sessionStorage.setItem(KEY, String(count));
    if (count >= 2) {
      setTimeout(callback, Math.max(500, minTimeMs));
    }
  }

  global.PopupTriggers = {
    onScroll:     onScroll,
    onDelay:      onDelay,
    onExitIntent: onExitIntent,
    onSecondPage: onSecondPage
  };
})(window);
