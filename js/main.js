/* =====================================================
   ABINASH PRASANA SELVANATHAN — Glacial / liquid glass portfolio (v2)
   Vanilla JS. No frameworks.
   ===================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var spawnBubblesAt = null; /* set by the water canvas, used by click ripples */

  /* ---------- Intro splash: full defog once per session, quick after ---------- */
  var intro = document.getElementById('intro');
  var seenIntro = false;
  try { seenIntro = sessionStorage.getItem('ap-seen') === '1'; } catch (e) {}
  try { sessionStorage.setItem('ap-seen', '1'); } catch (e) {}
  if (intro && seenIntro) intro.classList.add('quick');
  if (seenIntro) document.body.classList.add('quick-intro');
  window.setTimeout(function () {
    if (!intro) return;
    intro.classList.add('done');
    if (!reducedMotion && !seenIntro) {
      for (var ri = 0; ri < 2; ri++) {
        var rp = document.createElement('span');
        rp.className = 'intro-ripple' + (ri ? ' r2' : '');
        document.body.appendChild(rp);
        window.setTimeout(function (el) { return function () { el.remove(); }; }(rp), 2100);
      }
    }
  }, reducedMotion ? 300 : (seenIntro ? 450 : 2300));

  /* ---------- Theme toggle (persisted) ---------- */
  var toggle = document.getElementById('theme-toggle');
  var saved = null;
  try { saved = localStorage.getItem('ap-theme'); } catch (e) {}
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  }
  function themeLabel() {
    var t = document.documentElement.getAttribute('data-theme');
    if (toggle) toggle.textContent = t === 'light' ? 'THEME ▸ LIGHT' : 'THEME ▸ DARK';
  }
  themeLabel();
  function applyTheme(next) {
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ap-theme', next); } catch (e) {}
    themeLabel();
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      /* ripple-wipe theme switch, expanding from the toggle button */
      if (document.startViewTransition && !reducedMotion) {
        var r = toggle.getBoundingClientRect();
        var x = r.left + r.width / 2, y = r.top + r.height / 2;
        var endR = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        var vt = document.startViewTransition(function () { applyTheme(next); });
        vt.ready.then(function () {
          document.documentElement.animate(
            { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + endR + 'px at ' + x + 'px ' + y + 'px)'] },
            { duration: 650, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
          );
        }).catch(function () {});
      } else {
        applyTheme(next);
      }
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

  /* ---------- Hamburger menu ---------- */
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      mobileNav.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target && e.target.closest('a')) {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        mobileNav.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Certificate modal ---------- */
  var CERTS = [
    {
      title: 'JPMorgan Chase & Co. Software Engineering Job Simulation',
      issuer: 'FORAGE · JANUARY 2026',
      image: 'assets/jpmorgan-cert.png',
      verify: 'https://www.theforage.com/completion-certificates/Sj7temL583QAYpHXD/E6McHJDKsQYh79moz_Sj7temL583QAYpHXD_696807b3afb60a1158b52c05_1768583777280_completion_certificate.pdf',
      desc: 'A virtual job simulation developed by JPMorgan Chase that gives hands-on software engineering experience by working with real-world technologies used in industry. Through this simulation, I completed practical tasks involving backend development with tools like Spring Boot, Kafka integration, REST APIs, and database interaction, which strengthened my understanding of building scalable services and enterprise software practices.'
    },
    {
      title: 'IBM Data Science Professional Certificate (V3)',
      issuer: 'COURSERA · NOVEMBER 2025',
      image: 'assets/ibm-data-science-cert.png',
      verify: 'https://www.credly.com/badges/babf18dc-fa2a-4ab4-ad3e-e728752e5098/linked_in_profile',
      desc: 'An online professional certificate from IBM that covers core data science and machine learning skills used in real industry roles. The program includes training in Python programming, databases and SQL, data visualization, exploratory data analysis, and machine learning, and it culminates in hands-on projects that showcase applied data science techniques and tools.'
    },
    {
      title: 'AWS Cloud Practitioner Essentials',
      issuer: 'AWS TRAINING & CERTIFICATION · MAY 2026',
      image: 'assets/aws-cloud-practitioner-cert.png',
      verify: '',
      desc: 'A completion certificate from AWS Training and Certification covering foundational cloud computing concepts and core AWS services. The course covers essential areas including cloud architecture, security and compliance, pricing models, storage, compute, and networking on the AWS platform, providing a solid grounding in how modern cloud infrastructure is designed and operated.'
    },
    {
      title: 'Claude Code in Action',
      issuer: 'ANTHROPIC · MARCH 2026',
      image: 'assets/claude-code-cert.png',
      verify: 'https://verify.skilljar.com/c/ng4mrdhdsa4b',
      desc: 'A certificate of completion from Anthropic for the Claude Code in Action course, which provides hands-on training in using Claude Code as an AI-powered development tool. The course covers practical workflows for building, debugging, and iterating on real software projects using Claude as an intelligent coding assistant, reflecting a growing skillset at the intersection of AI and software engineering.'
    },
    {
      title: 'SAS Programming 1: Essentials',
      issuer: 'SAS · CREDLY BADGE',
      image: 'assets/sas-programming-cert.png',
      verify: 'https://www.credly.com/badges/bc6d1521-488c-431d-b4ec-1eb6f386e08a/linked_in_profile',
      desc: 'A verified digital badge issued through Credly by SAS, recognising completion of SAS Programming 1: Essentials. The course covers the fundamentals of the SAS programming language for data access, manipulation, and analysis, building practical skills in writing SAS programs, working with SAS data sets, producing formatted reports, and applying basic statistical procedures within the SAS environment.'
    },
    {
      title: 'SQL (Intermediate)',
      issuer: 'HACKERRANK · JUNE 2026',
      image: 'assets/sql-intermediate-cert.png',
      verify: 'https://www.hackerrank.com/certificates/iframe/a0a9acf47083',
      desc: 'A skill certification from HackerRank awarded for passing the SQL Intermediate assessment. The test evaluates practical knowledge of relational databases and query writing, covering complex joins, aggregations, subqueries, set operations, and working with multiple tables to extract and analyse structured data. Certificate ID: A0A9ACF47083.'
    }
  ];

  var certModal = document.getElementById('cert-modal');
  var certModalBody = document.getElementById('cert-modal-body');
  var certModalCloseBtn = certModal ? certModal.querySelector('.cm-close') : null;
  var certModalLastFocus = null;
  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (certModalLastFocus && certModalLastFocus.focus) {
      certModalLastFocus.focus();
      certModalLastFocus = null;
    }
  }
  function openCertModal(i) {
    var cert = CERTS[i];
    if (!cert || !certModal || !certModalBody) return;
    certModalBody.innerHTML = '';
    var img = document.createElement('img');
    img.src = cert.image; img.alt = cert.title; img.loading = 'lazy';
    var h = document.createElement('h3'); h.textContent = cert.title;
    var iss = document.createElement('p'); iss.className = 'cm-issuer'; iss.textContent = cert.issuer;
    var p = document.createElement('p'); p.textContent = cert.desc;
    certModalBody.appendChild(img);
    certModalBody.appendChild(h);
    certModalBody.appendChild(iss);
    certModalBody.appendChild(p);
    var full = document.createElement('a');
    full.className = 'cm-verify';
    full.href = cert.verify || cert.image;
    full.target = '_blank'; full.rel = 'noopener';
    full.textContent = cert.verify ? 'Verify certificate ↗' : 'Open full view ↗';
    certModalBody.appendChild(full);
    certModalLastFocus = document.activeElement;
    certModal.classList.add('open');
    document.body.classList.add('modal-open');
    if (certModalCloseBtn) certModalCloseBtn.focus();
  }
  if (certModal) {
    document.querySelectorAll('.certs-grid .cert-card').forEach(function (card, i) {
      card.addEventListener('click', function (e) {
        e.preventDefault();
        openCertModal(i);
      });
    });
    certModal.addEventListener('click', function (e) {
      if (e.target === certModal) closeCertModal();
    });
    if (certModalCloseBtn) certModalCloseBtn.addEventListener('click', closeCertModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCertModal();
      if (e.key === 'Tab' && certModal.classList.contains('open')) {
        var focusables = certModal.querySelectorAll('button, a[href]');
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
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

  /* ---------- Depth readout, progress bar, scroll-linked motion ---------- */
  var depthEl = document.getElementById('depth-readout');
  var barEl = document.getElementById('progress-bar');
  var depthVal = 0;
  var ghosts = document.querySelectorAll('.sec-ghost');
  var marqueeTrack = document.querySelector('.marquee-track');
  var heroSide = document.querySelector('.hero-side');
  var toTop = document.getElementById('to-top');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    depthVal = pct;
    if (depthEl) depthEl.textContent = String(Math.round(pct * 100)).padStart(3, '0') + '%';
    if (barEl) barEl.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
    document.documentElement.style.setProperty('--depth', pct.toFixed(3));
    if (toTop) toTop.classList.toggle('show', pct > 0.45);
    if (!reducedMotion) {
      /* ghost numerals drift slower than the page */
      for (var gi = 0; gi < ghosts.length; gi++) {
        var gr = ghosts[gi].parentNode.getBoundingClientRect();
        ghosts[gi].style.transform = 'translateY(' + (gr.top * 0.12).toFixed(1) + 'px)';
      }
      /* marquee phase nudges with scroll */
      if (marqueeTrack) marqueeTrack.style.animationDelay = '-' + (pct * 10).toFixed(2) + 's';
      /* hero side column lags a touch behind the text */
      if (heroSide && window.scrollY < h.clientHeight * 1.3) {
        heroSide.style.transform = 'translateY(' + (window.scrollY * 0.07).toFixed(1) + 'px)';
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Back-to-top bubble ---------- */
  if (toTop) {
    toTop.addEventListener('click', function () {
      if (!reducedMotion) {
        toTop.classList.add('fly');
        window.setTimeout(function () { toTop.classList.remove('fly'); }, 750);
      }
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

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

  /* ---------- Magnetic pull on buttons ---------- */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll('.btn-primary, .btn-glass, .social-btn, .header-resume, #theme-toggle').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        var my = (e.clientY - (r.top + r.height / 2)) * 0.3;
        mx = Math.max(-6, Math.min(6, mx));
        my = Math.max(-5, Math.min(5, my));
        el.style.transform = 'translate(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px)';
      }, { passive: true });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Tilt on the hero photo ---------- */
  var heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto && finePointer && !reducedMotion) {
    heroPhoto.style.transition = 'transform .45s cubic-bezier(.22,.61,.21,1)';
    heroPhoto.addEventListener('mousemove', function (e) {
      var r = heroPhoto.getBoundingClientRect();
      var rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
      var ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
      heroPhoto.style.transform = 'perspective(700px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    }, { passive: true });
    heroPhoto.addEventListener('mouseleave', function () { heroPhoto.style.transform = ''; });
  }

  /* ---------- Copy email + toast ---------- */
  var copyBtn = document.getElementById('copy-email');
  var toast = document.getElementById('toast');
  var toastTimer = null;
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || '';
      function done() {
        copyBtn.classList.add('copied');
        window.setTimeout(function () { copyBtn.classList.remove('copied'); }, 2200);
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

  /* ---------- Water canvas: rising motes + a luminous wake that trails the cursor ---------- */
  var canvas = document.getElementById('motes');
  if (canvas && !reducedMotion && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var motes = [];
    var W = 0, H = 0;
    var running = true;
    var mouseX = -1000, mouseY = -1000;
    var wake = { x: -1000, y: -1000 };
    var wake2 = { x: -1000, y: -1000 };

    function moteColor() {
      var v = getComputedStyle(document.documentElement).getPropertyValue('--mote').trim();
      return v || '168,220,255';
    }

    var moteTarget = 0;
    function sizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      moteTarget = Math.min(56, Math.round((W * H) / 26000));
      while (motes.length < moteTarget) motes.push(newMote(true));
      motes.length = moteTarget;
    }

    function newMote(anywhere) {
      var bubble = Math.random() < 0.3;
      var r = bubble ? 2 + Math.random() * 4.5 : 0.6 + Math.random() * 1.7;
      return {
        bubble: bubble,
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : H + 8,
        ox: 0, oy: 0,
        r: r,
        vy: bubble ? 0.25 + r * 0.08 + Math.random() * 0.2 : 0.08 + Math.random() * 0.22,
        drift: 0.5 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        tw: 0.4 + Math.random() * 0.45
      };
    }

    /* a handful of bubbles burst upward from a point (used on click) */
    spawnBubblesAt = function (bx, by) {
      if (motes.length > moteTarget + 30) return;
      var n = 4 + Math.floor(Math.random() * 3);
      for (var bi = 0; bi < n; bi++) {
        var r = 1.5 + Math.random() * 3;
        motes.push({
          bubble: true, burst: true,
          x: bx + (Math.random() - 0.5) * 26,
          y: by + (Math.random() - 0.5) * 14,
          ox: 0, oy: 0,
          r: r,
          vy: 0.8 + r * 0.12 + Math.random() * 0.6,
          drift: 0.8 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2,
          tw: 0.6 + Math.random() * 0.5
        });
      }
    };

    window.addEventListener('resize', sizeCanvas);
    sizeCanvas();

    if (finePointer) {
      window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX; mouseY = e.clientY;
      }, { passive: true });
      document.documentElement.addEventListener('mouseleave', function () {
        mouseX = -1000; mouseY = -1000;
      });
    }

    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) window.requestAnimationFrame(drawWater);
    });

    function glow(x, y, radius, alpha, col) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, 'rgba(' + col + ',' + alpha + ')');
      g.addColorStop(1, 'rgba(' + col + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    var t0 = performance.now();
    function drawWater(now) {
      if (!running) return;
      var t = (now - t0) / 1000;
      var col = moteColor();

      /* fade the previous frame instead of clearing: everything leaves a watery trail */
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      /* cursor wake: two lagging lights, like light bending through stirred water */
      if (finePointer && mouseX > -500) {
        wake.x += (mouseX - wake.x) * 0.055;
        wake.y += (mouseY - wake.y) * 0.055;
        wake2.x += (mouseX - wake2.x) * 0.12;
        wake2.y += (mouseY - wake2.y) * 0.12;
        var wobX = Math.sin(t * 1.7) * 7, wobY = Math.cos(t * 1.3) * 7;
        glow(wake.x + wobX, wake.y + wobY, 120, 0.05, col);
        glow(wake2.x, wake2.y, 60, 0.045, col);
      }

      /* motes and bubbles: rise, wobble, twinkle, and get pushed aside near the cursor */
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.y -= m.vy;
        if (m.y < -10) {
          if (m.burst) { motes.splice(i, 1); i--; continue; }
          motes[i] = m = newMote(false);
        }
        var x = m.bubble
          ? m.x + Math.sin(t * (1.1 + m.r * 0.12) + m.phase) * (2 + m.r * 0.6)
          : m.x + Math.sin(t * 0.5 + m.phase) * m.drift * 8;

        if (finePointer && mouseX > -500) {
          var dx = x + m.ox - mouseX, dy = m.y + m.oy - mouseY;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140 && d > 0.1) {
            var push = (1 - d / 140) * 2.2;
            m.ox += (dx / d) * push;
            m.oy += (dy / d) * push;
          }
        }
        m.ox *= 0.94; m.oy *= 0.94;

        var twinkle = 0.5 + 0.5 * Math.sin(t * m.tw * 2 + m.phase);
        var px = x + m.ox, py = m.y + m.oy;

        if (m.bubble) {
          /* an air bubble: rim-lit shell, faint body, specular glint */
          var ba = 0.16 + twinkle * 0.18;
          if (py < H * 0.14) ba *= Math.max(0, py / (H * 0.14));
          if (ba <= 0.01) continue;
          ctx.beginPath();
          ctx.arc(px, py, m.r, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(' + col + ',' + Math.min(1, ba * 1.2).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(px, py + m.r * 0.15, m.r * 0.82, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + col + ',' + (ba * 0.14).toFixed(3) + ')';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px - m.r * 0.35, py - m.r * 0.38, Math.max(0.6, m.r * 0.22), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, ba * 1.5).toFixed(3) + ')';
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, m.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + col + ',' + (0.10 + twinkle * 0.28).toFixed(3) + ')';
          ctx.fill();
        }
      }
      window.requestAnimationFrame(drawWater);
    }
    window.requestAnimationFrame(drawWater);
  }

  /* ---------- WebGL water: real caustics that bend toward the cursor ---------- */
  (function initWater() {
    if (reducedMotion) return;
    var c = document.getElementById('water');
    if (!c) return;
    var gl;
    try {
      gl = c.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
    } catch (e) { return; }
    if (!gl) return;

    var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var FS = [
      'precision mediump float;',
      'uniform float uT;uniform vec2 uRes;uniform vec2 uMouse;uniform float uLight;uniform float uDepth;',
      'vec2 h2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}',
      'float voro(vec2 x,float t){vec2 n=floor(x);vec2 f=fract(x);float m=8.0;',
      'for(int j=-1;j<=1;j++){for(int i=-1;i<=1;i++){vec2 g=vec2(float(i),float(j));vec2 o=h2(n+g);o=0.5+0.5*sin(t+6.2831*o);vec2 r=g+o-f;m=min(m,dot(r,r));}}return m;}',
      'void main(){',
      'vec2 uv=gl_FragCoord.xy/uRes;vec2 asp=vec2(uRes.x/uRes.y,1.0);',
      'vec2 m=uMouse/uRes;float md=distance(uv*asp,m*asp);',
      'vec2 p=uv*asp*3.2;',
      'p+=(m-uv)*asp*0.45*smoothstep(0.5,0.0,md);',
      'float v1=voro(p+vec2(0.0,uT*0.05),uT*0.55);',
      'float v2=voro(p*1.9+vec2(uT*0.03,uT*0.02),uT*0.4+2.0);',
      'float c1=pow(clamp(1.0-v1,0.0,1.0),5.0);',
      'float c2=pow(clamp(1.0-v2,0.0,1.0),6.0);',
      'float ca=c1*0.75+c2*0.45;',
      'ca*=0.75+0.7*smoothstep(0.45,0.0,md);',
      'float ray1=pow(0.5+0.5*sin((uv.x*1.6-uv.y*0.35)*12.0+uT*0.18),8.0);',
      'float ray2=pow(0.5+0.5*sin((uv.x*2.3+uv.y*0.2)*9.0-uT*0.12),10.0);',
      'ca+=(ray1*0.7+ray2*0.5)*smoothstep(0.15,0.95,uv.y)*0.4;',
      'vec3 col=mix(vec3(0.36,0.72,1.0),vec3(0.55,0.5,1.0),clamp(uv.y+0.2*sin(uT*0.1),0.0,1.0));',
      'float a=ca*0.16*(1.0-uDepth*0.45)+0.045*smoothstep(0.35,0.0,md);',
      'if(uLight>0.5){col=mix(vec3(0.05,0.35,0.55),vec3(0.25,0.2,0.6),uv.y);a*=0.55;}',
      'gl_FragColor=vec4(col*a,a);}'
    ].join('\n');

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
      return s;
    }
    var vs = compile(gl.VERTEX_SHADER, VS);
    var fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var locP = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(locP);
    gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

    var uT = gl.getUniformLocation(prog, 'uT');
    var uRes = gl.getUniformLocation(prog, 'uRes');
    var uMouse = gl.getUniformLocation(prog, 'uMouse');
    var uLight = gl.getUniformLocation(prog, 'uLight');
    var uDepth = gl.getUniformLocation(prog, 'uDepth');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    var RES_SCALE = 0.5;
    function sizeWater() {
      c.width = Math.max(2, Math.round(window.innerWidth * RES_SCALE));
      c.height = Math.max(2, Math.round(window.innerHeight * RES_SCALE));
      gl.viewport(0, 0, c.width, c.height);
    }
    window.addEventListener('resize', sizeWater);
    sizeWater();

    var wmx = window.innerWidth / 2, wmy = window.innerHeight / 2;
    var wtx = wmx, wty = wmy;
    if (finePointer) {
      window.addEventListener('mousemove', function (e) {
        wtx = e.clientX; wty = e.clientY;
      }, { passive: true });
    }

    var waterRunning = true;
    document.addEventListener('visibilitychange', function () {
      waterRunning = !document.hidden;
      if (waterRunning) window.requestAnimationFrame(drawWaterGL);
    });

    var wt0 = performance.now();
    function drawWaterGL(now) {
      if (!waterRunning) return;
      wmx += (wtx - wmx) * 0.06;
      wmy += (wty - wmy) * 0.06;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uT, (now - wt0) / 1000);
      gl.uniform2f(uRes, c.width, c.height);
      gl.uniform2f(uMouse, wmx * RES_SCALE, c.height - wmy * RES_SCALE);
      gl.uniform1f(uLight, document.documentElement.getAttribute('data-theme') === 'light' ? 1 : 0);
      gl.uniform1f(uDepth, depthVal);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      window.requestAnimationFrame(drawWaterGL);
    }
    window.requestAnimationFrame(drawWaterGL);
    document.body.classList.add('webgl-water');
  })();

  /* ---------- Background drift: the light field sways toward the cursor ---------- */
  var driftLayer = document.querySelector('.bg-drift');
  if (driftLayer && finePointer && !reducedMotion) {
    var dTx = 0, dTy = 0, dX = 0, dY = 0;
    window.addEventListener('mousemove', function (e) {
      dTx = (e.clientX / window.innerWidth - 0.5) * 44;
      dTy = (e.clientY / window.innerHeight - 0.5) * 30;
    }, { passive: true });
    (function driftLoop() {
      dX += (dTx - dX) * 0.03;
      dY += (dTy - dY) * 0.03;
      driftLayer.style.transform = 'translate3d(' + dX.toFixed(2) + 'px,' + dY.toFixed(2) + 'px,0)';
      window.requestAnimationFrame(driftLoop);
    })();
  }

  /* ---------- Click ripple: two expanding water rings ---------- */
  function spawnRipple(x, y, size, extraClass) {
    var r = document.createElement('span');
    r.className = 'ripple' + (extraClass ? ' ' + extraClass : '');
    r.style.left = x + 'px';
    r.style.top = y + 'px';
    r.style.width = size + 'px';
    r.style.height = size + 'px';
    document.body.appendChild(r);
    window.setTimeout(function () { r.remove(); }, 1150);
  }
  if (!reducedMotion) {
    window.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      spawnRipple(e.clientX, e.clientY, 130, '');
      spawnRipple(e.clientX, e.clientY, 190, 'r2');
      if (spawnBubblesAt) spawnBubblesAt(e.clientX, e.clientY);
    }, { passive: true });
  }

  /* ---------- Micro-ripples trail the moving pointer, like a finger through water ---------- */
  if (finePointer && !reducedMotion) {
    var rLastX = null, rLastY = 0, rDist = 0, rLastSpawn = 0;
    window.addEventListener('mousemove', function (e) {
      if (rLastX === null) { rLastX = e.clientX; rLastY = e.clientY; return; }
      rDist += Math.hypot(e.clientX - rLastX, e.clientY - rLastY);
      rLastX = e.clientX; rLastY = e.clientY;
      var now = performance.now();
      if (rDist > 120 && now - rLastSpawn > 150) {
        rDist = 0; rLastSpawn = now;
        spawnRipple(e.clientX, e.clientY, 40 + Math.random() * 26, 'ripple-move');
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

  /* ---------- Custom cursor: droplet ring that stretches, snaps and breathes ---------- */
  if (finePointer) {
    document.body.classList.add('cursor-fx');
    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    var labelEl = document.getElementById('cursor-label');
    var tx = -100, ty = -100, cx = -100, cy = -100;
    var scale = 1, tscale = 1;
    var ringW = 38, ringH = 38, ringR = 19, tW = 38, tH = 38, tR = 19;
    var snapEl = null;
    var lastMove = performance.now();

    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      lastMove = performance.now();
      if (dot) dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
    }, { passive: true });

    function cursorTargetScale(e) {
      var el = e.target && e.target.closest ? e.target : null;
      var lab = '';
      snapEl = null;
      if (el) {
        if (el.closest('.cert-card')) lab = 'OPEN';
        else if (el.closest('.copy-email')) lab = 'COPY';
        else if (el.closest('.pc-link.pc-live')) lab = 'LIVE';
        snapEl = el.closest('.social-btn, #theme-toggle, #burger, .cm-close, #to-top');
      }
      if (labelEl) labelEl.textContent = lab;
      if (ring) ring.classList.toggle('labeled', !!lab);
      var t = el && el.closest('a, button');
      return lab ? 2.5 : (t && !snapEl ? 1.9 : 1);
    }
    window.addEventListener('mouseover', function (e) {
      tscale = cursorTargetScale(e);
    }, { passive: true });

    window.addEventListener('mousedown', function () { tscale = 0.7; }, { passive: true });
    window.addEventListener('mouseup', function (e) {
      tscale = cursorTargetScale(e);
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', function () {
      tx = -100; ty = -100;
      if (dot) dot.style.transform = 'translate(-100px,-100px)';
    });

    (function loop() {
      var now = performance.now();
      var t = now / 1000;
      var ttx = tx, tty = ty;
      /* snap: the ring morphs to wrap small buttons */
      if (snapEl) {
        var sr = snapEl.getBoundingClientRect();
        if (sr.width > 0) {
          tW = sr.width + 12; tH = sr.height + 12;
          tR = Math.min(parseFloat(getComputedStyle(snapEl).borderRadius) + 6 || 14, tH / 2);
          ttx = sr.left + sr.width / 2; tty = sr.top + sr.height / 2;
          tscale = 1;
        }
      } else {
        tW = 38; tH = 38; tR = 19;
      }
      var vx = (ttx - cx) * 0.16, vy = (tty - cy) * 0.16;
      cx += vx; cy += vy;
      ringW += (tW - ringW) * 0.22;
      ringH += (tH - ringH) * 0.22;
      ringR += (tR - ringR) * 0.22;
      scale += (tscale - scale) * 0.18;
      /* idle: the droplet breathes gently */
      var eff = scale;
      if (!snapEl && now - lastMove > 4000) eff = scale * (1 + 0.05 * Math.sin(t * 1.8));
      /* droplet physics: stretch along the direction of travel */
      var v = Math.sqrt(vx * vx + vy * vy);
      var stretch = snapEl ? 0 : Math.min(v * 0.02, 0.3);
      var ang = Math.atan2(vy, vx);
      if (ring) {
        ring.style.width = ringW.toFixed(1) + 'px';
        ring.style.height = ringH.toFixed(1) + 'px';
        ring.style.borderRadius = ringR.toFixed(1) + 'px';
        ring.style.borderWidth = (1.5 / Math.max(eff, 0.5)).toFixed(2) + 'px';
        ring.style.transform =
          'translate(' + (cx - ringW / 2).toFixed(1) + 'px,' + (cy - ringH / 2).toFixed(1) + 'px) ' +
          'rotate(' + ang.toFixed(3) + 'rad) ' +
          'scale(' + (eff * (1 + stretch)).toFixed(3) + ',' + (eff * (1 - stretch * 0.55)).toFixed(3) + ') ' +
          'rotate(' + (-ang).toFixed(3) + 'rad)';
      }
      if (labelEl) labelEl.style.transform = 'scale(' + (1 / Math.max(eff, 0.1)).toFixed(3) + ')';
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
