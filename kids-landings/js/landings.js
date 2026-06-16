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

})();
