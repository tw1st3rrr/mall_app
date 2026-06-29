/* popup-engine.js — main runtime: targeting → trigger → render → analytics
   Requires: popup-frequency.js, popup-analytics.js, popup-triggers.js (loaded before) */
(function () {
  'use strict';

  var MALL_ID   = window.POPUP_MALL_ID   || 'unknown';
  var PAGE_TYPE = window.POPUP_PAGE_TYPE || 'kids-club';
  var isMobile  = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  var STORE_KEY = 'afisha_popup_v3';

  /* ─── CSS (same classes used in admin preview) ─── */
  var CARD_CSS = [
    '@keyframes ppFadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}',
    '@keyframes ppSlideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:none}}',
    '.pp-ov{box-sizing:border-box;position:fixed;inset:0;z-index:9999;display:flex;padding:16px}',
    '.pp-ov--center{align-items:center;justify-content:center}',
    '.pp-ov--bottom{align-items:flex-end;justify-content:center;padding:0}',
    '.pp-ov--top{align-items:flex-start;justify-content:center;padding-top:60px}',
    '.pp-ov--right{align-items:center;justify-content:flex-end}',
    '.pp-ov--left{align-items:center;justify-content:flex-start}',
    '.pp-card{background:#fff;border-radius:20px;overflow:hidden;position:relative;box-shadow:0 24px 80px rgba(0,0,0,.38);width:100%}',
    '.pp-card--center{animation:ppFadeUp .32s cubic-bezier(.22,.9,.36,1) both}',
    '.pp-card--bottom{border-radius:20px 20px 0 0!important;animation:ppSlideUp .35s cubic-bezier(.22,.9,.36,1) both;max-width:100%!important}',
    '.pp-card--slide{animation:ppFadeUp .32s cubic-bezier(.22,.9,.36,1) both}',
    '.pp-close{position:absolute;top:0;right:0;min-width:44px;min-height:44px;background:rgba(0,0,0,.1);border:none;font-size:18px;cursor:pointer;color:#444;display:flex;align-items:center;justify-content:center;border-bottom-left-radius:12px;z-index:2;line-height:1}',
    '.pp-banner{padding:28px;text-align:center}',
    '.pp-banner--tg{background:linear-gradient(135deg,#0088cc,#29b6f6)}',
    '.pp-banner--kids{background:linear-gradient(135deg,#f39200,#f8c900)}',
    '.pp-banner--neutral{background:linear-gradient(135deg,#2E47A6,#6c5ce7)}',
    '.pp-icon{font-size:52px;line-height:1}',
    '.pp-body{padding:22px 24px;text-align:center}',
    '.pp-title{font-family:Fredoka,sans-serif;font-size:20px;font-weight:600;color:#1c1c1c;margin-bottom:8px}',
    '.pp-desc{font-size:13px;color:#787878;line-height:1.6;margin-bottom:18px}',
    '.pp-cta{display:block;padding:14px;background:#2E47A6;color:#fff;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;font-family:Fredoka,sans-serif;border:none;cursor:pointer;width:100%;text-align:center;box-sizing:border-box}',
    '.pp-cta--tg{background:linear-gradient(135deg,#0088cc,#29b6f6)}',
    '.pp-img{width:100%;max-height:200px;object-fit:cover;display:block}',
    /* Sticky bar */
    '.pp-sticky{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#fff;border-top:1px solid #e5e5e5;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 -4px 24px rgba(0,0,0,.1)}',
    '.pp-sticky__text{font-size:13px;font-weight:600;color:#20243a;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.pp-sticky__cta{padding:9px 18px;background:#2E47A6;color:#fff;border:none;border-radius:10px;font-family:Fredoka,sans-serif;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;text-decoration:none;display:inline-block}',
    '.pp-sticky__cta--tg{background:linear-gradient(135deg,#0088cc,#29b6f6)}',
    '.pp-sticky__close{min-width:44px;min-height:44px;border:none;background:none;font-size:20px;cursor:pointer;color:#787878;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
    /* Teaser */
    '.pp-teaser{position:fixed;bottom:20px;right:20px;z-index:9999;background:#fff;border-radius:16px;padding:16px;box-shadow:0 8px 32px rgba(0,0,0,.2);max-width:240px;animation:ppFadeUp .3s ease both}',
    '.pp-teaser__title{font-family:Fredoka,sans-serif;font-size:15px;font-weight:600;color:#1c1c1c;margin-bottom:6px}',
    '.pp-teaser__desc{font-size:12px;color:#787878;line-height:1.5;margin-bottom:12px}',
    '.pp-teaser__cta{display:block;padding:9px;background:#2E47A6;color:#fff;border-radius:10px;font-size:12px;font-weight:700;text-align:center;text-decoration:none;border:none;cursor:pointer;width:100%;box-sizing:border-box}',
    '.pp-teaser__cta--tg{background:linear-gradient(135deg,#0088cc,#29b6f6)}',
    '.pp-teaser__close{position:absolute;top:6px;right:6px;min-width:36px;min-height:36px;border:none;background:rgba(0,0,0,.08);border-radius:50%;font-size:14px;cursor:pointer;color:#555;display:flex;align-items:center;justify-content:center}',
    '@media(max-width:600px){.pp-body{padding:16px 18px}.pp-title{font-size:17px}.pp-cta{padding:12px}}'
  ].join('\n');

  function injectCss() {
    if (document.getElementById('ppEngineStyle')) return;
    var s = document.createElement('style');
    s.id = 'ppEngineStyle';
    s.textContent = CARD_CSS;
    document.head.appendChild(s);
  }

  /* ─── Config ─── */
  function getConfigs() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch (e) { return []; }
  }

  /* Migrate from afisha_popup_v2 on first run */
  function migrate() {
    if (localStorage.getItem(STORE_KEY)) return;
    try {
      var v2 = JSON.parse(localStorage.getItem('afisha_popup_v2') || 'null');
      if (!v2) return;
      var FREQ = { session: 'session', daily: 'perDay', weekly: 'perWeek' };
      localStorage.setItem(STORE_KEY, JSON.stringify(v2.map(function (c) {
        return {
          id: c.id, enabled: !!c.enabled, priority: c.id === 'telegram' ? 10 : 5,
          format: 'modal',
          device: {
            desktop: { size: c.size || 'medium', position: 'center', backdrop: c.blur ? 'blur' : 'dim' },
            mobile:  { size: 'medium',            position: 'bottom', backdrop: c.blur ? 'blur' : 'dim' }
          },
          targeting: { mallId: 'all', pageType: ['kids-club'], utm: [] },
          trigger:   { type: c.trigger || 'scroll', value: parseInt(c.triggerValue, 10) || 60, minTimeOnPageMs: 5000 },
          frequency: { showCap: FREQ[c.frequency] || 'session', dismissCooldownDays: 1, audience: 'all' },
          content: {
            headline: c.id === 'telegram' ? 'Будьте в курсе событий!' : 'Приходите в детский клуб!',
            body:     c.id === 'telegram' ? 'Подпишитесь на наш Telegram-канал и получайте анонсы первыми' : 'Мастер-классы, квизы и праздники каждые выходные',
            image: null,
            cta: { text: c.id === 'telegram' ? 'Подписаться ✈️' : 'Узнать расписание 🎯', action: c.id === 'telegram' ? 'telegram' : 'url', target: c.url || (c.id === 'telegram' ? 'https://t.me/enkatc' : '#') }
          },
          experiment: null
        };
      })));
    } catch (e) {}
  }

  /* ─── Targeting ─── */
  function matchesMall(cfg) {
    var t = cfg.targeting;
    if (!t || t.mallId === 'all') return true;
    var ids = Array.isArray(t.mallId) ? t.mallId : [t.mallId];
    return ids.indexOf(MALL_ID) !== -1;
  }
  function matchesPage(cfg) {
    var t = cfg.targeting;
    if (!t || !t.pageType || !t.pageType.length) return true;
    return t.pageType.indexOf(PAGE_TYPE) !== -1;
  }
  function matchesUtm(cfg) {
    var t = cfg.targeting;
    if (!t || !t.utm || !t.utm.length) return true;
    try { return t.utm.indexOf(new URLSearchParams(location.search).get('utm_source') || '') !== -1; } catch (e) { return false; }
  }

  function selectPopup(configs) {
    var eligible = configs.filter(function (c) {
      return c.enabled && matchesMall(c) && matchesPage(c) && matchesUtm(c) && PopupFrequency.canShow(c);
    });
    if (!eligible.length) return null;
    return eligible.sort(function (a, b) { return (b.priority || 0) - (a.priority || 0); })[0];
  }

  /* ─── DOM helpers ─── */
  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  var SIZES = { small: '340px', medium: '440px', large: '580px', full: '100%' };

  function bannerMod(action) {
    return action === 'telegram' ? '--tg' : action === 'kids-form' ? '--kids' : '--neutral';
  }
  function bannerIcon(action) {
    return action === 'telegram' ? '✈️' : action === 'kids-form' ? '🎨' : '🎯';
  }

  function buildCardInner(cfg) {
    var c = cfg.content || {}, cta = c.cta || {};
    var html = c.image
      ? '<img class="pp-img" src="' + esc(c.image) + '" alt="">'
      : '<div class="pp-banner pp-banner' + bannerMod(cta.action) + '"><div class="pp-icon">' + bannerIcon(cta.action) + '</div></div>';
    var isLink = cta.action === 'telegram' || cta.action === 'url' || cta.action === 'app-install';
    var tag = isLink ? 'a' : 'button';
    var href = isLink ? ' href="' + esc(cta.target || '#') + '" target="_blank" rel="noopener"' : '';
    html += '<div class="pp-body">';
    html += '<div class="pp-title">' + esc(c.headline || '') + '</div>';
    html += '<div class="pp-desc">'  + esc(c.body     || '') + '</div>';
    html += '<' + tag + ' class="pp-cta' + (cta.action === 'telegram' ? ' pp-cta--tg' : '') + '"' + href + ' data-pp-action="' + esc(cta.action) + '">' + esc(cta.text || 'Перейти') + '</' + tag + '>';
    html += '</div>';
    return html;
  }

  /* ─── State ─── */
  var _active    = null;
  var _activeCfg = null;

  function openPopup(cfg) {
    if (_active) return;
    injectCss();

    PopupFrequency.recordShown(cfg.id);
    PopupAnalytics.trackEvent('impression', cfg.id);

    var devCfg  = (isMobile ? cfg.device.mobile : cfg.device.desktop) || {};
    var format  = cfg.format  || 'modal';
    var pos     = devCfg.position || 'center';
    var backdrop = devCfg.backdrop || 'blur';
    var maxW    = SIZES[devCfg.size] || '440px';

    /* Sticky bar */
    if (format === 'sticky-bar') {
      var c = cfg.content || {}, cta = c.cta || {};
      var bar = document.createElement('div');
      bar.className = 'pp-sticky';
      bar.innerHTML =
        '<div class="pp-sticky__text">' + esc(c.headline || '') + '</div>' +
        '<a class="pp-sticky__cta' + (cta.action === 'telegram' ? ' pp-sticky__cta--tg' : '') + '" href="' + esc(cta.target || '#') + '" target="_blank" data-pp-action="' + esc(cta.action) + '">' + esc(cta.text || 'Перейти') + '</a>' +
        '<button class="pp-sticky__close" aria-label="Закрыть">×</button>';
      document.body.appendChild(bar);
      _active = bar; _activeCfg = cfg;
      bar.querySelector('.pp-sticky__close').addEventListener('click', function () { dismissPopup('close'); });
      bar.querySelector('.pp-sticky__cta').addEventListener('click', function () { handleConversion(cfg); });
      bar.addEventListener('click', function () { PopupAnalytics.trackEvent('interaction', cfg.id); });
      document.addEventListener('keydown', onKeyDown);
      return;
    }

    /* Teaser */
    if (format === 'teaser') {
      var c = cfg.content || {}, cta = c.cta || {};
      var t = document.createElement('div');
      t.className = 'pp-teaser';
      t.setAttribute('role', 'dialog');
      t.innerHTML =
        '<button class="pp-teaser__close" aria-label="Закрыть">×</button>' +
        '<div class="pp-teaser__title">' + esc(c.headline || '') + '</div>' +
        '<div class="pp-teaser__desc">'  + esc(c.body     || '') + '</div>' +
        '<a class="pp-teaser__cta' + (cta.action === 'telegram' ? ' pp-teaser__cta--tg' : '') + '" href="' + esc(cta.target || '#') + '" target="_blank" data-pp-action="' + esc(cta.action) + '">' + esc(cta.text || 'Перейти') + '</a>';
      document.body.appendChild(t);
      _active = t; _activeCfg = cfg;
      t.querySelector('.pp-teaser__close').addEventListener('click', function () { dismissPopup('close'); });
      t.querySelector('.pp-teaser__cta').addEventListener('click', function () { handleConversion(cfg); });
      t.addEventListener('click', function () { PopupAnalytics.trackEvent('interaction', cfg.id); });
      document.addEventListener('keydown', onKeyDown);
      return;
    }

    /* Modal / slide-in */
    var bgClr = backdrop === 'blur'    ? 'rgba(20,24,58,.55)'
              : backdrop === 'dim'     ? 'rgba(20,24,58,.72)'
              :                          'rgba(0,0,0,0)';
    var bgStyle = 'background:' + bgClr + ';';
    if (backdrop === 'blur') bgStyle += 'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);';

    var isMobileBottom = isMobile && pos === 'bottom';
    var ov = document.createElement('div');
    ov.className = 'pp-ov pp-ov--' + (isMobileBottom ? 'bottom' : pos);
    ov.setAttribute('style', bgStyle);
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');

    var card = document.createElement('div');
    card.className = 'pp-card pp-card--' + (isMobileBottom ? 'bottom' : (format === 'slide-in' ? 'slide' : 'center'));
    card.style.maxWidth = isMobileBottom ? '100%' : maxW;
    card.innerHTML = '<button class="pp-close" aria-label="Закрыть">×</button>' + buildCardInner(cfg);
    ov.appendChild(card);
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';

    _active = ov; _activeCfg = cfg;

    var firstFocusable = ov.querySelector('button, a');
    if (firstFocusable) setTimeout(function () { firstFocusable.focus(); }, 50);

    ov.addEventListener('click', function (e) { if (e.target === ov) dismissPopup('backdrop'); });
    card.querySelector('.pp-close').addEventListener('click', function () { dismissPopup('close'); });
    var ctaEl = card.querySelector('.pp-cta');
    if (ctaEl) ctaEl.addEventListener('click', function () { handleConversion(cfg); });
    card.addEventListener('click', function () { PopupAnalytics.trackEvent('interaction', cfg.id); });
    document.addEventListener('keydown', onKeyDown);
  }

  function handleConversion(cfg) {
    PopupAnalytics.trackEvent('conversion', cfg.id);
    PopupFrequency.recordConversion(cfg.id);
    // kids-form action: keep popup open so user can fill in (TODO: inject form)
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') dismissPopup('esc');
  }

  function dismissPopup(reason) {
    if (!_active) return;
    if (reason !== 'conversion') {
      PopupFrequency.recordDismissed(_activeCfg.id);
      PopupAnalytics.trackEvent('dismiss', _activeCfg.id, { reason: reason });
    }
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeyDown);
    try { _active.remove(); } catch (e) {}
    _active = null; _activeCfg = null;
  }

  /* ─── Boot ─── */
  function init() {
    PopupFrequency.recordVisit();
    migrate();

    var configs = getConfigs();
    var popup   = selectPopup(configs);
    if (!popup) return;

    var trig    = popup.trigger || {};
    var minTime = trig.minTimeOnPageMs || 5000;

    function fire() { openPopup(popup); }

    switch (trig.type) {
      case 'delay':       PopupTriggers.onDelay(trig.value, minTime, fire);      break;
      case 'exit-intent': PopupTriggers.onExitIntent(minTime, fire);              break;
      case 'second-page': PopupTriggers.onSecondPage(minTime, fire);              break;
      default:            PopupTriggers.onScroll(trig.value || 60, minTime, fire);
    }
  }

  init();
})();
