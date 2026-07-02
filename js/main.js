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
    if (toggle) toggle.textContent = t === 'light' ? 'THEME ▸ LIGHT' : 'THEME ▸ DARK';
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

  /* ---------- Depth readout + progress bar ---------- */
  var depthEl = document.getElementById('depth-readout');
  var barEl = document.getElementById('progress-bar');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (depthEl) depthEl.textContent = String(Math.round(pct * 100)).padStart(3, '0') + '%';
    if (barEl) barEl.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
    document.documentElement.style.setProperty('--depth', pct.toFixed(3));
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
        ox: 0, oy: 0,
        r: 0.6 + Math.random() * 1.7,
        vy: 0.08 + Math.random() * 0.22,
        drift: 0.5 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        tw: 0.4 + Math.random() * 0.45
      };
    }

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

      /* motes: rise slowly, twinkle, and get pushed aside near the cursor */
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.y -= m.vy;
        if (m.y < -8) motes[i] = m = newMote(false);
        var x = m.x + Math.sin(t * 0.5 + m.phase) * m.drift * 8;

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
        ctx.beginPath();
        ctx.arc(x + m.ox, m.y + m.oy, m.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + col + ',' + (0.10 + twinkle * 0.28).toFixed(3) + ')';
        ctx.fill();
      }
      window.requestAnimationFrame(drawWater);
    }
    window.requestAnimationFrame(drawWater);
  }

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

    var labelEl = document.getElementById('cursor-label');
    function cursorTargetScale(e) {
      var el = e.target && e.target.closest ? e.target : null;
      var lab = '';
      if (el) {
        if (el.closest('.cert-card')) lab = 'OPEN';
        else if (el.closest('.copy-email')) lab = 'COPY';
        else if (el.closest('.pc-link.pc-live')) lab = 'LIVE';
      }
      if (labelEl) labelEl.textContent = lab;
      if (ring) ring.classList.toggle('labeled', !!lab);
      var t = el && el.closest('a, button');
      return lab ? 2.5 : (t ? 1.9 : 1);
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
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      scale += (tscale - scale) * 0.18;
      if (ring) ring.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')';
      if (labelEl) labelEl.style.transform = 'scale(' + (1 / Math.max(scale, 0.1)).toFixed(3) + ')';
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
