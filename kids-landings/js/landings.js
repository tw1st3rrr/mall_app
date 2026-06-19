(function () {
  'use strict';

  /* ===== LIGHTBOX ===== */
  var lightbox = document.getElementById('lightbox');
  var lbImg    = document.getElementById('lbImg');
  var lbClose  = document.getElementById('lbClose');
  var lbPrev   = document.getElementById('lbPrev');
  var lbNext   = document.getElementById('lbNext');
  var lbCounter = document.getElementById('lbCounter');
  var galleryItems = Array.from(document.querySelectorAll('.kids-gallery__item'));
  var currentIdx = 0;

  if (lightbox && galleryItems.length) {
    function openLightbox(idx) {
      currentIdx = idx;
      var img = galleryItems[idx].querySelector('img');
      lbImg.src = img.getAttribute('data-full') || img.src;
      if (lbCounter) lbCounter.textContent = (idx + 1) + ' / ' + galleryItems.length;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function navLightbox(dir) {
      currentIdx = (currentIdx + dir + galleryItems.length) % galleryItems.length;
      openLightbox(currentIdx);
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function () { openLightbox(i); });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    if (lbPrev) lbPrev.addEventListener('click', function (e) { e.stopPropagation(); navLightbox(-1); });
    if (lbNext) lbNext.addEventListener('click', function (e) { e.stopPropagation(); navLightbox(1); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   navLightbox(-1);
      if (e.key === 'ArrowRight')  navLightbox(1);
    });
  }

  /* ===== REVIEWS SLIDER ===== */
  var track   = document.getElementById('reviewsTrack');
  var btnPrev = document.getElementById('reviewsPrev');
  var btnNext = document.getElementById('reviewsNext');
  var dots    = Array.from(document.querySelectorAll('.reviews-dot'));

  if (track) {
    var cards = Array.from(track.children);
    var current = 0;

    function getPerView() {
      return window.innerWidth >= 900 ? 3 : (window.innerWidth >= 560 ? 2 : 1);
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getPerView());
    }

    function updateSlider() {
      var pv = getPerView();
      var max = getMaxIndex();
      current = Math.min(current, max);

      var w = track.parentElement.offsetWidth;
      var gap = 24;
      var cardW = (w - gap * (pv - 1)) / pv;
      track.style.transform = 'translateX(-' + (current * (cardW + gap)) + 'px)';

      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }

    if (btnPrev) btnPrev.addEventListener('click', function () {
      current = Math.max(0, current - 1);
      updateSlider();
    });
    if (btnNext) btnNext.addEventListener('click', function () {
      current = Math.min(getMaxIndex(), current + 1);
      updateSlider();
    });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        current = Math.min(i, getMaxIndex());
        updateSlider();
      });
    });

    window.addEventListener('resize', updateSlider);
    updateSlider();
  }

  /* ===== HEADER SCROLL BORDER ===== */
  (function () {
    var header = document.querySelector('.kids-header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('kids-header--scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ===== SMOOTH SCROLL ===== */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) !== '#' || href.length < 2) return;
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ===== SOCIAL POPUP ===== */
  (function () {
    if (sessionStorage.getItem('socialPopupShown')) return;

    var popup = document.createElement('div');
    popup.className = 'social-popup';
    popup.innerHTML =
      '<button class="social-popup__close" aria-label="Закрыть">&times;</button>' +
      '<div class="social-popup__label">Мы в соцсетях</div>' +
      '<div class="social-popup__btns">' +
        '<a href="#" class="social-popup__btn social-popup__btn--tg" target="_blank" rel="noopener">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.25-2.01 9.49c-.15.66-.54.82-1.09.51l-3-2.21-1.45 1.39c-.16.16-.3.3-.61.3l.21-3.05 5.56-5.02c.24-.21-.05-.33-.37-.12L7.09 14.07l-2.95-.92c-.64-.2-.65-.64.13-.95L16.77 7.7c.54-.19 1 .13.79.55z"/></svg>' +
          'Telegram' +
        '</a>' +
        '<a href="#" class="social-popup__btn social-popup__btn--vk" target="_blank" rel="noopener">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.68 0H8.32C1.59 0 0 1.59 0 8.32v7.36C0 22.41 1.59 24 8.32 24h7.36C22.41 24 24 22.41 24 15.68V8.32C24 1.59 22.39 0 15.68 0zm3.69 17.12h-1.74c-.66 0-.86-.52-2.05-1.71-1.03-1.01-1.49-1.15-1.74-1.15-.36 0-.46.1-.46.59v1.56c0 .42-.14.68-1.25.68-1.85 0-3.9-1.12-5.34-3.2C4.62 10.86 4.03 8.57 4.03 8.1c0-.25.1-.49.59-.49h1.74c.44 0 .61.2.78.68.86 2.49 2.3 4.67 2.9 4.67.22 0 .32-.1.32-.66V9.72c-.07-1.19-.7-1.29-.7-1.71 0-.2.17-.41.44-.41h2.74c.37 0 .51.2.51.64v3.47c0 .37.17.51.27.51.22 0 .41-.14.81-.54 1.25-1.41 2.15-3.57 2.15-3.57.12-.25.32-.49.76-.49h1.74c.53 0 .64.27.53.64-.22 1.02-2.35 4.03-2.35 4.03-.19.31-.25.44 0 .78.19.25.8.78 1.2 1.25.75.85 1.32 1.56 1.47 2.05.17.47-.08.71-.58.71z"/></svg>' +
          'ВКонтакте' +
        '</a>' +
      '</div>';

    document.body.appendChild(popup);

    setTimeout(function () { popup.classList.add('open'); }, 1200);
    sessionStorage.setItem('socialPopupShown', '1');

    popup.querySelector('.social-popup__close').addEventListener('click', function () {
      popup.classList.remove('open');
    });
  })();

})();
