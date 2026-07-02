/* =====================================================
   ABINASH PRASANA SELVANATHAN — Glacial / liquid glass portfolio (v2)
   Vanilla JS. No frameworks.
   ===================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Intro splash ---------- */
  var intro = document.getElementById('intro');
  window.setTimeout(function () {
    if (intro) intro.classList.add('done');
  }, reducedMotion ? 400 : 2300);

  /* ---------- Theme toggle (persisted) ---------- */
  var toggle = document.getElementById('theme-toggle');
  var saved = null;
  try { saved = localStorage.getItem('ap-theme'); } catch (e) {}
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  }
  function themeLabel() {
    var t = document.documentElement.getAttribute('data-theme');
    if (toggle) toggle.textContent = t === 'light' ? 'MODE ▸ FROST' : 'MODE ▸ DEEP';
  }
  themeLabel();
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('ap-theme', next); } catch (e) {}
      themeLabel();
    });
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = document.querySelectorAll('.header-nav a');
  if ('IntersectionObserver' in window && navLinks.length) {
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && linkFor[entry.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove('active'); });
          linkFor[entry.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(function (s) { navIo.observe(s); });
  }

  /* ---------- Depth readout + progress bar ---------- */
  var depthEl = document.getElementById('depth-readout');
  var barEl = document.getElementById('progress-bar');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (depthEl) depthEl.textContent = String(Math.round(pct * 100)).padStart(3, '0') + '%';
    if (barEl) barEl.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Count-up stats ---------- */
  var statEls = document.querySelectorAll('.stat-num[data-count]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reducedMotion) { el.textContent = String(target); return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && statEls.length) {
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statEls.forEach(function (el) { statIo.observe(el); });
  } else {
    statEls.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- Pointer parallax on hero bento tiles ---------- */
  var bento = document.getElementById('hero-bento');
  if (bento && finePointer && !reducedMotion) {
    var tiles = bento.querySelectorAll('.tile');
    var px = 0, py = 0, rafPending = false;
    function applyParallax() {
      rafPending = false;
      tiles.forEach(function (t) {
        var depth = parseFloat(t.getAttribute('data-parallax')) || 4;
        t.style.transform = 'translate(' + (px * depth).toFixed(1) + 'px,' + (py * depth).toFixed(1) + 'px)';
      });
    }
    bento.addEventListener('mousemove', function (e) {
      var r = bento.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2 * -1;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2 * -1;
      if (!rafPending) { rafPending = true; window.requestAnimationFrame(applyParallax); }
    }, { passive: true });
    bento.addEventListener('mouseleave', function () {
      px = 0; py = 0;
      if (!rafPending) { rafPending = true; window.requestAnimationFrame(applyParallax); }
    });
  }

  /* ---------- Copy email + toast ---------- */
  var copyBtn = document.getElementById('copy-email');
  var toast = document.getElementById('toast');
  var toastTimer = null;
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || '';
      function done() {
        if (!toast) return;
        toast.classList.add('show');
        if (toastTimer) window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(function () { toast.classList.remove('show'); }, 2200);
      }
      function legacyCopy() {
        var ta = document.createElement('textarea');
        ta.value = email; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) {}
        ta.remove();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, legacyCopy);
      } else {
        legacyCopy();
      }
    });
  }

  /* ---------- Frost motes: slow-rising particles, like silt in still water ---------- */
  var canvas = document.getElementById('motes');
  if (canvas && !reducedMotion && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var motes = [];
    var W = 0, H = 0;
    var running = true;

    function moteColor() {
      var v = getComputedStyle(document.documentElement).getPropertyValue('--mote').trim();
      return v || '168,220,255';
    }

    function sizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      var target = Math.min(56, Math.round((W * H) / 26000));
      while (motes.length < target) motes.push(newMote(true));
      motes.length = target;
    }

    function newMote(anywhere) {
      return {
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : H + 6,
        r: 0.6 + Math.random() * 1.7,
        vy: 0.08 + Math.random() * 0.22,
        drift: 0.5 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        tw: 0.4 + Math.random() * 0.45
      };
    }

    window.addEventListener('resize', sizeCanvas);
    sizeCanvas();

    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) window.requestAnimationFrame(drawMotes);
    });

    var t0 = performance.now();
    function drawMotes(now) {
      if (!running) return;
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      var col = moteColor();
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.y -= m.vy;
        var x = m.x + Math.sin(t * 0.5 + m.phase) * m.drift * 8;
        if (m.y < -8) motes[i] = m = newMote(false);
        var twinkle = 0.5 + 0.5 * Math.sin(t * m.tw * 2 + m.phase);
        ctx.beginPath();
        ctx.arc(x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + col + ',' + (0.10 + twinkle * 0.28).toFixed(3) + ')';
        ctx.fill();
      }
      window.requestAnimationFrame(drawMotes);
    }
    window.requestAnimationFrame(drawMotes);
  }

  /* ---------- Click ripple: two expanding water rings ---------- */
  if (!reducedMotion) {
    window.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      for (var i = 0; i < 2; i++) {
        var r = document.createElement('span');
        r.className = 'ripple' + (i ? ' r2' : '');
        var size = i ? 190 : 130;
        r.style.left = e.clientX + 'px';
        r.style.top = e.clientY + 'px';
        r.style.width = size + 'px';
        r.style.height = size + 'px';
        document.body.appendChild(r);
        window.setTimeout(function (el) { return function () { el.remove(); }; }(r), 1100);
      }
    }, { passive: true });
  }

  /* ---------- Specular highlight follows the pointer across glass ---------- */
  if (finePointer) {
    document.addEventListener('mousemove', function (e) {
      var card = e.target && e.target.closest ? e.target.closest('.glass') : null;
      if (!card) return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
    }, { passive: true });
  }

  /* ---------- Custom cursor: instant dot + liquid-lag glass ring ---------- */
  if (finePointer) {
    document.body.classList.add('cursor-fx');
    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    var tx = -100, ty = -100, cx = -100, cy = -100;
    var scale = 1, tscale = 1;

    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (dot) dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
    }, { passive: true });

    window.addEventListener('mouseover', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('a, button') : null;
      tscale = t ? 1.9 : 1;
    }, { passive: true });

    window.addEventListener('mousedown', function () { tscale = 0.7; }, { passive: true });
    window.addEventListener('mouseup', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('a, button') : null;
      tscale = t ? 1.9 : 1;
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', function () {
      tx = -100; ty = -100;
      if (dot) dot.style.transform = 'translate(-100px,-100px)';
    });

    (function loop() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      scale += (tscale - scale) * 0.18;
      if (ring) ring.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')';
      window.requestAnimationFrame(loop);
    })();
  }

  /* ---------- Typewriter role line ---------- */
  var words = ['Data Analyst', 'Data Scientist', 'AI / ML Graduate', 'Python Developer'];
  var roleEl = document.getElementById('role-word');
  var word = 0, chr = words[0].length, del = true;
  function tick() {
    var delay = 70;
    if (del) {
      chr -= 1; delay = 38;
      if (chr <= 0) { chr = 0; del = false; word = (word + 1) % words.length; delay = 350; }
    } else {
      chr += 1;
      if (chr >= words[word].length) { chr = words[word].length; del = true; delay = 1800; }
    }
    if (roleEl) roleEl.textContent = words[word].slice(0, chr) || ' ';
    window.setTimeout(tick, delay);
  }
  if (!reducedMotion) {
    window.setTimeout(tick, 3000);
  }
})();
