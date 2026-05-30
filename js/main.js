/**
 * Portfolio Main JavaScript
 */
(function () {
    'use strict';

    // Config
    const CONFIG = {
        typewriterWords: ['Data Analyst', 'Data Scientist', 'AI / ML Graduate', 'Python Developer'],
        typeSpeed: 100,
        deleteSpeed: 50,
        pauseTime: 2000,
        // Particle system
        particles: {
            maxCount: 60,
            density: 20000,
            connectionDistance: 100,
            baseSize: 0.5,
            sizeVariation: 2,
            baseOpacity: 0.1,
            opacityVariation: 0.3,
            baseSpeed: 0.5,
            speedVariation: 0.4
        },
        // Cursor animation
        cursor: {
            cursorEasing: 0.14,     // outer ring lag (slower = more dramatic trail)
            followerEasing: 0.55,   // inner dot snappy follow
            cursorOffset: 9,        // half of 18px outer ring
            followerOffset: 2.5,    // half of 5px dot
            repelRadius: 130,       // particle repulsion radius in px
            repelStrength: 0.9      // force multiplier
        },
        // Magnetic effect
        magnetic: {
            strength: 0.2
        },
        // Performance
        throttleDelay: 16, // ~60fps
        mobileBreakpoint: 768,
        // Animations
        countDuration: 1500,
        toastDuration: 3000,
        scrollOffset: 100,
        navScrollOffset: 200
    };

    // DOM Cache
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // Global mouse — shared between cursor and particle repulsion
    let _mouseX = 0, _mouseY = 0;
    document.addEventListener('mousemove', e => { _mouseX = e.clientX; _mouseY = e.clientY; }, { passive: true });

    /**
     * Utility: Throttle function execution
     * @param {Function} func - Function to throttle
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} Throttled function
     */
    function throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }

    /**
     * Utility: Check if device is mobile
     * @returns {boolean}
     */
    function isMobile() {
        return window.innerWidth < CONFIG.mobileBreakpoint;
    }

    /**
     * Utility: Request Animation Frame with fallback
     * @param {Function} callback - Function to execute
     * @returns {number} Request ID
     */
    const requestFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) { return setTimeout(callback, 16); };

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.PORTFOLIO_DATA) {
            console.error('Portfolio data not found');
            return;
        }

        initIntro();
        initTheme();
        initCursor();
        initScrollProgress();
        initHeader();
        initMobileMenu();
        initSmoothScroll();
        initTypewriter();
        initParticles();
        initMagnetic();
        initReveal();
        initCopyEmail();
        initCountUp();
        initCardGlowEffect();

        renderProjects(window.PORTFOLIO_DATA.projects);
        renderSkills(window.PORTFOLIO_DATA.skills);
        initProjectsCarousel();
        initCertCarousel();
        initFloatingBadges();

        $('#year').textContent = new Date().getFullYear();
    });

    /**
     * Inject floating tech-badge decorations around the hero profile card.
     * Each badge is positioned with CSS custom-properties that the stylesheet
     * reads for placement and stagger timing.
     */
    function initFloatingBadges() {
        const heroCard = $('.hero-card');
        if (!heroCard) return;

        const badges = [
            { label: 'Python',        icon: '🐍', pos: 'tl', delay: 0   },
            { label: 'TensorFlow',    icon: '🧠', pos: 'tr', delay: 0.6 },
            { label: 'NLP',           icon: '💬', pos: 'ml', delay: 1.1 },
            { label: 'RAG + LLMs',    icon: '🔗', pos: 'mr', delay: 0.3 },
            { label: 'Data Science',  icon: '📊', pos: 'bl', delay: 0.8 },
            { label: 'Scikit-learn',  icon: '⚙️', pos: 'br', delay: 1.4 },
        ];

        const wrap = document.createElement('div');
        wrap.className = 'hero-badge-ring';
        wrap.setAttribute('aria-hidden', 'true');

        badges.forEach(b => {
            const el = document.createElement('span');
            el.className = `hero-badge hero-badge--${b.pos}`;
            el.style.animationDelay = `${b.delay}s`;
            el.innerHTML = `<span class="hero-badge-icon">${b.icon}</span><span class="hero-badge-label">${escapeHtml(b.label)}</span>`;
            wrap.appendChild(el);
        });

        heroCard.appendChild(wrap);
    }

    /**
     * Intro splash — locks scroll, waits for animations, then slides out
     */
    function initIntro() {
        const intro = $('#intro');
        if (!intro) return;

        // Lock scroll while intro is visible
        document.body.style.overflow = 'hidden';

        // Reduced motion users skip straight to content
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            intro.remove();
            document.body.style.overflow = '';
            return;
        }

        // Wait for the bar fill (2.0s delay 0.3s = 2.3s) then exit
        setTimeout(() => {
            intro.classList.add('exit');
            intro.addEventListener('animationend', () => {
                intro.remove();
                document.body.style.overflow = '';
            }, { once: true });
        }, 2400);
    }

    /**
     * Initialize theme toggle — cycles: dark → cream → light → dark
     */
    function initTheme() {
        const btn = $('#themeBtn');
        if (!btn) return;

        const themes = ['dark', 'cream', 'light'];
        const labels = { dark: 'Switch to cream editorial theme', cream: 'Switch to light theme', light: 'Switch to dark theme' };

        try {
            const saved = localStorage.getItem('theme');
            if (saved && themes.includes(saved)) {
                document.documentElement.dataset.theme = saved;
            }
        } catch (error) {
            console.warn('localStorage not available:', error);
        }

        function updateAriaLabel() {
            const current = document.documentElement.dataset.theme || 'dark';
            btn.setAttribute('aria-label', labels[current] || 'Toggle theme');
        }

        updateAriaLabel();

        btn.addEventListener('click', () => {
            const current = document.documentElement.dataset.theme || 'dark';
            const idx = themes.indexOf(current);
            const next = themes[(idx + 1) % themes.length];
            document.documentElement.dataset.theme = next;
            updateAriaLabel();

            try {
                localStorage.setItem('theme', next);
            } catch (error) {
                console.warn('Failed to save theme preference:', error);
            }
        });
    }

    /**
     * Initialize custom cursor — slow spring, velocity stretch, water trail, magic sparks
     */
    function initCursor() {
        const cursor   = $('.cursor');
        const follower = $('.cursor-follower');
        const trails   = [...$$('.cursor-trail')];
        if (!cursor || !follower || isMobile()) return;

        // Spring state — outer ring (slow, liquid)
        let cx = _mouseX, cy = _mouseY, cvx = 0, cvy = 0;
        // Spring state — inner dot (faster, precise)
        let fx = _mouseX, fy = _mouseY, fvx = 0, fvy = 0;

        // Circular position history for trail drops
        const HIST = 26;
        const hx = new Float32Array(HIST).fill(_mouseX);
        const hy = new Float32Array(HIST).fill(_mouseY);
        let head = 0;

        // Trail: [history-lag frames, size-px, opacity]
        const TRAIL_CFG = [
            [3,  4.5, 0.52],
            [6,  4.0, 0.36],
            [10, 3.5, 0.24],
            [15, 2.5, 0.14],
            [21, 2.0, 0.07],
        ];
        trails.forEach((el, i) => {
            const c = TRAIL_CFG[i];
            if (!c) return;
            el.style.width  = `${c[1]}px`;
            el.style.height = `${c[1]}px`;
        });

        // Sparkle state
        let lastSparkleMs = 0;
        let prevSparkleX = _mouseX, prevSparkleY = _mouseY;

        // Sparkle color palette — accent, cyan, amber, white flash
        const SPARK_COLORS = ['var(--accent)', 'var(--accent)', 'var(--accent-2)', 'var(--amber)', '#ffffff'];
        // Sparkle shapes — circle, rounded-square (rotates into diamond), tiny sliver
        const SPARK_SHAPES = ['50%', '50%', '50%', '3px', '3px', '50% 20%'];

        function spawnSparkles(x, y, speed) {
            const count = speed > 20 ? 5 : speed > 13 ? 4 : speed > 7 ? 3 : 2;
            for (let n = 0; n < count; n++) {
                const el = document.createElement('div');
                el.className = 'cursor-sparkle';
                const size  = 2.5 + Math.random() * 5.5;               // 2.5–8 px
                const angle = Math.random() * Math.PI * 2;
                const dist  = 14 + Math.random() * 36;                  // 14–50 px burst radius
                const dur   = 300 + Math.random() * 380;                // 300–680 ms
                const rot   = (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 270);
                const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
                const shape = SPARK_SHAPES[Math.floor(Math.random() * SPARK_SHAPES.length)];
                const glow1 = (size * 3.5).toFixed(0);
                const glow2 = (size * 7).toFixed(0);
                el.style.cssText =
                    `left:${x}px;top:${y}px;` +
                    `width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;` +
                    `background:${color};border-radius:${shape};` +
                    `box-shadow:0 0 ${glow1}px ${color},0 0 ${glow2}px ${color},0 0 ${(size * 12).toFixed(0)}px rgba(139,92,246,0.12);` +
                    `--dx:${(Math.cos(angle) * dist).toFixed(1)}px;` +
                    `--dy:${(Math.sin(angle) * dist).toFixed(1)}px;` +
                    `--dur:${dur.toFixed(0)}ms;` +
                    `--rot:${rot.toFixed(0)}deg;`;
                document.body.appendChild(el);
                el.addEventListener('animationend', () => el.remove(), { once: true });
            }
        }

        let isHovering = false;

        function animate() {
            const { cursorOffset, followerOffset } = CONFIG.cursor;

            // — Ring: very slow viscous spring — honey-thick drag
            cvx += (_mouseX - cx) * 0.042;
            cvy += (_mouseY - cy) * 0.042;
            cvx *= 0.87;
            cvy *= 0.87;
            cx  += cvx;
            cy  += cvy;

            // — Dot: snappier but still slightly behind
            fvx += (_mouseX - fx) * 0.18;
            fvy += (_mouseY - fy) * 0.18;
            fvx *= 0.79;
            fvy *= 0.79;
            fx  += fvx;
            fy  += fvy;

            // — Velocity stretch: elongates like a water droplet in motion
            const speed   = Math.sqrt(cvx * cvx + cvy * cvy);
            const stretch = Math.min(1 + speed * 0.052, 1.6);
            const squeeze = 1 / Math.sqrt(stretch);
            const angle   = Math.atan2(cvy, cvx) * (180 / Math.PI);

            cursor.style.transform =
                `translate(${cx - cursorOffset}px,${cy - cursorOffset}px) ` +
                `rotate(${angle.toFixed(2)}deg) scale(${stretch.toFixed(3)},${squeeze.toFixed(3)})`;

            follower.style.transform =
                `translate(${fx - followerOffset}px,${fy - followerOffset}px)`;

            // — Write ring position to circular buffer
            hx[head] = cx;
            hy[head] = cy;
            head = (head + 1) % HIST;

            // — Position trail drops from history
            trails.forEach((el, i) => {
                const c = TRAIL_CFG[i];
                if (!c) return;
                if (isHovering) { el.style.opacity = '0'; return; }
                const idx  = (head - c[0] + HIST) % HIST;
                const half = c[1] / 2;
                el.style.transform = `translate(${hx[idx] - half}px,${hy[idx] - half}px)`;
                el.style.opacity   = String(c[2]);
            });

            requestAnimationFrame(animate);
        }
        animate();

        // Click — triple ripple burst
        document.addEventListener('mousedown', () => {
            cursor.classList.add('clicking');
            [1, 2, 3].forEach((ring, i) => {
                setTimeout(() => {
                    const r = document.createElement('div');
                    r.className = 'cursor-ripple';
                    r.dataset.ring = String(ring);
                    r.style.left = `${_mouseX}px`;
                    r.style.top  = `${_mouseY}px`;
                    document.body.appendChild(r);
                    r.addEventListener('animationend', () => r.remove(), { once: true });
                }, i * 70);
            });
        });
        document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

        // Hover states + sparkle throttle on mousemove
        const interactiveSelector = 'a, button, .card, .skill-chip, .contact-link-card, .cert-view-btn, .carousel-btn, .project-card';
        document.addEventListener('mousemove', e => {
            isHovering = !!e.target.closest(interactiveSelector);
            cursor.classList.toggle('hovering', isHovering);
            follower.classList.toggle('hovering', isHovering);

            // Spark emission — throttled, speed-gated
            const now = Date.now();
            const dx  = e.clientX - prevSparkleX;
            const dy  = e.clientY - prevSparkleY;
            const spd = Math.sqrt(dx * dx + dy * dy);
            prevSparkleX = e.clientX;
            prevSparkleY = e.clientY;

            if (spd > 3 && now - lastSparkleMs > 32) {
                lastSparkleMs = now;
                spawnSparkles(e.clientX, e.clientY, spd);
            }
        }, { passive: true });

        // Leave / enter window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity   = '0';
            follower.style.opacity = '0';
            trails.forEach(el => { el.style.opacity = '0'; });
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity   = '1';
            follower.style.opacity = '1';
        });
    }

    /**
     * Initialize scroll progress indicator
     * Updates progress bar based on scroll position
     */
    function initScrollProgress() {
        const bar = $('.scroll-progress');
        if (!bar) return;

        const updateProgress = throttle(() => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.round((scrollTop / docHeight) * 100);
            bar.style.width = `${progress}%`;
            bar.setAttribute('aria-valuenow', progress);
        }, CONFIG.throttleDelay);

        window.addEventListener('scroll', updateProgress, { passive: true });
    }

    /**
     * Initialize header scroll effects
     * Adds/removes 'scrolled' class and updates active navigation links
     */
    function initHeader() {
        const header = $('#header');
        if (!header) return;

        const handleScroll = throttle(() => {
            header.classList.toggle('scrolled', window.scrollY > 50);
            updateNavActive();
        }, CONFIG.throttleDelay);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * Update active navigation link based on current scroll position
     */
    function updateNavActive() {
        const sections = $$('section[id]');
        const links = $$('.nav-link');
        const scrollPos = window.scrollY + CONFIG.navScrollOffset;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.id;

            if (scrollPos >= top && scrollPos < top + height) {
                links.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    /**
     * Initialize mobile menu toggle functionality
     * Handles burger menu click and navigation link clicks
     */
    function initMobileMenu() {
        const burger = $('#burger');
        const nav = $('#mobileNav');
        if (!burger || !nav) return;

        burger.addEventListener('click', () => {
            const isOpen = !nav.hidden;
            nav.hidden = isOpen;
            burger.classList.toggle('active', !isOpen);
            burger.setAttribute('aria-expanded', !isOpen);
            nav.setAttribute('aria-hidden', isOpen);
        });

        $$('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.hidden = true;
                burger.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
                nav.setAttribute('aria-hidden', 'true');
            });
        });
    }

    /**
     * Initialize smooth scrolling for anchor links
     * Handles navigation to sections with offset for fixed header
     */
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = $(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - CONFIG.scrollOffset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Initialize typewriter effect
     * Cycles through career titles with typing/deleting animation
     */
    function initTypewriter() {
        const el = $('#typewriter');
        if (!el) return;

        const words = CONFIG.typewriterWords;
        let wordIdx = 0, charIdx = 0, isDeleting = false;

        function type() {
            const word = words[wordIdx];

            if (isDeleting) {
                charIdx--;
                el.textContent = word.substring(0, charIdx);
            } else {
                charIdx++;
                el.textContent = word.substring(0, charIdx);
            }

            // Update aria-label for screen readers
            el.setAttribute('aria-label', `Current role: ${word}`);

            let delay = isDeleting ? CONFIG.deleteSpeed : CONFIG.typeSpeed;

            if (!isDeleting && charIdx === word.length) {
                delay = CONFIG.pauseTime;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % words.length;
                delay = 500;
            }

            setTimeout(type, delay);
        }

        setTimeout(type, 1000);
    }

    /**
     * Initialize particle animation system with spatial partitioning
     * Creates animated background with connected particles (optimized for performance)
     */
    /**
     * Initialize particle animation system with spatial partitioning
     * Creates animated background with connected particles (optimized for performance)
     */
    function initParticles() {
        const canvas = $('#particles');
        if (!canvas) return;

        // Disable particles on mobile for performance
        if (isMobile()) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        const cfg = CONFIG.particles;

        let accentRgb = '139, 92, 246'; // Default
        let accent2Rgb = '6, 182, 212'; // Default

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            updateThemeColors();
            initializeParticles();
        }

        function updateThemeColors() {
            const style = getComputedStyle(document.documentElement);
            accentRgb = hexToRgb(style.getPropertyValue('--accent').trim());
            accent2Rgb = hexToRgb(style.getPropertyValue('--accent-2').trim());
        }

        function hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '139, 92, 246';
        }

        resize();
        window.addEventListener('resize', throttle(resize, 250));

        // Listen for theme changes specifically for particles
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    updateThemeColors();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        /**
         * Create particle instances — includes a few larger "star" particles
         */
        function initializeParticles() {
            const count = Math.min(cfg.maxCount, Math.floor((canvas.width * canvas.height) / cfg.density));
            particles = [];

            for (let i = 0; i < count; i++) {
                const isStar = i < Math.floor(count * 0.1); // 10% are star particles
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: isStar
                        ? Math.random() * 1.5 + 1.5
                        : Math.random() * cfg.sizeVariation + cfg.baseSize,
                    speedX: (Math.random() - cfg.baseSpeed) * cfg.speedVariation * (isStar ? 0.5 : 1),
                    speedY: (Math.random() - cfg.baseSpeed) * cfg.speedVariation * (isStar ? 0.5 : 1),
                    opacity: isStar
                        ? Math.random() * 0.25 + 0.2
                        : Math.random() * cfg.opacityVariation + cfg.baseOpacity,
                    isStar,
                    // original speed — used to restore after repulsion
                    baseSpeedX: 0,
                    baseSpeedY: 0
                });
                particles[i].baseSpeedX = particles[i].speedX;
                particles[i].baseSpeedY = particles[i].speedY;
            }
        }

        /**
         * Build spatial hash grid for optimized collision detection
         * Reduces O(n²) to approximately O(n)
         */
        function buildSpatialGrid() {
            const cellSize = cfg.connectionDistance;
            const cols = Math.ceil(canvas.width / cellSize);
            const rows = Math.ceil(canvas.height / cellSize);
            const grid = Array.from({ length: cols * rows }, () => []);

            particles.forEach((p, idx) => {
                const col = Math.floor(p.x / cellSize);
                const row = Math.floor(p.y / cellSize);
                const cell = row * cols + col;
                if (cell >= 0 && cell < grid.length) {
                    grid[cell].push(idx);
                }
            });

            return { grid, cols, rows, cellSize };
        }

        /**
         * Main animation loop — with mouse repulsion and gradient connectors
         */
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const repelR  = CONFIG.cursor.repelRadius;
            const repelRSq = repelR * repelR;
            const repelStr = CONFIG.cursor.repelStrength;

            // Update positions + apply mouse repulsion
            particles.forEach(p => {
                // Drift toward base speed (spring back after repulsion)
                p.speedX += (p.baseSpeedX - p.speedX) * 0.05;
                p.speedY += (p.baseSpeedY - p.speedY) * 0.05;

                // Mouse repulsion
                if (_mouseX > 0 || _mouseY > 0) {
                    const rdx = p.x - _mouseX;
                    const rdy = p.y - _mouseY;
                    const rdSq = rdx * rdx + rdy * rdy;
                    if (rdSq < repelRSq && rdSq > 0.01) {
                        const rd = Math.sqrt(rdSq);
                        const force = ((repelR - rd) / repelR) * repelStr;
                        p.speedX += (rdx / rd) * force;
                        p.speedY += (rdy / rd) * force;
                    }
                }

                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Draw — stars get a subtle glow
                if (p.isStar) {
                    ctx.save();
                    ctx.shadowColor = `rgba(${accentRgb}, 0.6)`;
                    ctx.shadowBlur = 6;
                    ctx.fillStyle = `rgba(${accentRgb}, ${p.opacity})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                } else {
                    ctx.fillStyle = `rgba(${accentRgb}, ${p.opacity})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Build spatial grid
            const { grid, cols, cellSize } = buildSpatialGrid();

            // Gradient connector lines
            particles.forEach((p, i) => {
                const col = Math.floor(p.x / cellSize);
                const row = Math.floor(p.y / cellSize);

                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const cell = (row + dy) * cols + (col + dx);
                        if (cell < 0 || cell >= grid.length) continue;

                        grid[cell].forEach(j => {
                            if (i >= j) return;
                            const ex = p.x - particles[j].x;
                            const ey = p.y - particles[j].y;
                            const distSq = ex * ex + ey * ey;
                            const maxDistSq = cfg.connectionDistance * cfg.connectionDistance;
                            if (distSq >= maxDistSq) return;

                            const dist = Math.sqrt(distSq);
                            const proximity = 1 - dist / cfg.connectionDistance;

                            // Boost opacity when either endpoint is near mouse
                            let mouseBoost = 1;
                            const mpx = (p.x + particles[j].x) / 2 - _mouseX;
                            const mpy = (p.y + particles[j].y) / 2 - _mouseY;
                            const mouseDist = Math.sqrt(mpx * mpx + mpy * mpy);
                            if (mouseDist < repelR * 1.5) {
                                mouseBoost = 1 + (1 - mouseDist / (repelR * 1.5)) * 2.5;
                            }

                            const baseOpacity = 0.12 * proximity * mouseBoost;

                            // Gradient line: accent → accent-2
                            const grad = ctx.createLinearGradient(p.x, p.y, particles[j].x, particles[j].y);
                            grad.addColorStop(0, `rgba(${accentRgb},  ${baseOpacity})`);
                            grad.addColorStop(1, `rgba(${accent2Rgb}, ${baseOpacity * 0.7})`);

                            ctx.strokeStyle = grad;
                            ctx.lineWidth = proximity * 1.2;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        });
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    /**
     * Initialize magnetic button effect
     * Buttons follow mouse position on hover (desktop only)
     */
    function initMagnetic() {
        if (isMobile()) return;

        $$('.magnetic').forEach(el => {
            const handleMouseMove = throttle((e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * CONFIG.magnetic.strength}px, ${y * CONFIG.magnetic.strength}px)`;
            }, CONFIG.throttleDelay);

            el.addEventListener('mousemove', handleMouseMove);

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    /**
     * Initialize scroll reveal animations
     * Elements fade in when scrolled into view
     * @returns {IntersectionObserver} Observer instance for reuse
     */
    function initReveal() {
        // Prevent creating multiple observers for the same elements
        if (initReveal.observer) {
            return initReveal.observer;
        }

        // Stagger delays — each .reveal in a section gets 70ms increments
        $$('section').forEach(section => {
            const revealEls = section.querySelectorAll('.reveal');
            revealEls.forEach((el, i) => {
                if (!el.style.transitionDelay) {
                    el.style.transitionDelay = `${i * 70}ms`;
                }
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        $$('.reveal').forEach(el => observer.observe(el));

        // Store observer instance to prevent duplicate initialization
        initReveal.observer = observer;
        return observer;
    }

    /**
     * Initialize email copy functionality
     * Copies email to clipboard with fallback for older browsers
     */
    function initCopyEmail() {
        const btns = $$('.copy-btn');
        if (!btns.length) return;

        btns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                // Prevent default if it's a link (though we should use buttons)
                e.preventDefault();

                const email = btn.dataset.email;
                if (!email) {
                    showToast('No email address found', 'error');
                    return;
                }

                try {
                    await navigator.clipboard.writeText(email);
                    showToast('Email copied!', 'success');
                } catch (error) {
                    // Fallback for browsers without clipboard API
                    try {
                        const textarea = document.createElement('textarea');
                        textarea.value = email;
                        textarea.style.position = 'fixed';
                        textarea.style.left = '-9999px';
                        textarea.setAttribute('readonly', '');
                        document.body.appendChild(textarea);
                        textarea.select();
                        const success = document.execCommand('copy');
                        document.body.removeChild(textarea);

                        if (success) {
                            showToast('Email copied!', 'success');
                        } else {
                            showToast('Failed to copy email', 'error');
                        }
                    } catch (fallbackError) {
                        console.error('Copy failed:', fallbackError);
                        showToast('Failed to copy email', 'error');
                    }
                }
            });
        });
    }

    /**
     * Show toast notification
     * @param {string} msg - Message to display
     * @param {string} type - Toast type ('success' or 'error')
     */
    function showToast(msg, type = 'success') {
        const toast = $('#toast');
        const msgEl = $('#toastMsg');
        if (!toast || !msgEl) return;

        msgEl.textContent = msg;
        toast.classList.add('show');
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');

        setTimeout(() => {
            toast.classList.remove('show');
        }, CONFIG.toastDuration);
    }

    /**
     * Initialize count-up animation for statistics
     * Numbers animate from 0 to target value when scrolled into view
     */
    function initCountUp() {
        const stats = $$('.stat-value[data-count]');
        if (!stats.length) return;

        const animated = new WeakSet();

        function runCount(el) {
            if (animated.has(el)) return;
            animated.add(el);
            const target = parseInt(el.dataset.count, 10);
            if (isNaN(target)) {
                console.warn('Invalid count value:', el.dataset.count);
                return;
            }
            animateCount(el, target);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => {
            // If already visible on page load, animate immediately
            const rect = stat.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (inView) {
                runCount(stat);
            } else {
                observer.observe(stat);
            }
        });
    }

    /**
     * Animate counter from 0 to target value
     * @param {HTMLElement} el - Element to animate
     * @param {number} target - Target number
     */
    function animateCount(el, target) {
        const start = performance.now();

        function update(time) {
            const elapsed = time - start;
            const progress = Math.min(elapsed / CONFIG.countDuration, 1);
            // Ease-out cubic function for smooth animation
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * target);

            el.textContent = current;
            el.setAttribute('aria-valuenow', current);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
                el.setAttribute('aria-valuenow', target);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Render project cards dynamically in carousel
     * @param {Array} projects - Array of project objects
     */
    function renderProjects(projects) {
        const carousel = $('#projectsCarousel');
        if (!carousel || !projects) return;

        try {
            carousel.innerHTML = projects.map((p, i) => `
                <article class="card project-card" data-index="${i}">
                    <div class="project-header">
                        <h3 class="project-title">${escapeHtml(p.title)}</h3>
                        <a href="${escapeHtml(p.repo)}" target="_blank" rel="noopener noreferrer" class="project-github-box magnetic" aria-label="View ${escapeHtml(p.title)} on GitHub">
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 .5a11.5 11.5 0 00-3.64 22.4c.58.1.8-.26.8-.57v-2c-3.26.7-3.95-1.36-3.95-1.36-.53-1.36-1.3-1.72-1.3-1.72-1.07-.72.08-.7.08-.7 1.18.08 1.8 1.22 1.8 1.22 1.05 1.8 2.76 1.28 3.44.98.1-.76.4-1.28.73-1.57-2.6-.3-5.34-1.3-5.34-5.8 0-1.28.46-2.32 1.22-3.14-.12-.3-.53-1.52.12-3.16 0 0 1-.32 3.3 1.2a11.3 11.3 0 016 0c2.3-1.52 3.3-1.2 3.3-1.2.65 1.64.24 2.86.12 3.16.76.82 1.22 1.86 1.22 3.14 0 4.52-2.75 5.5-5.37 5.8.42.36.8 1.08.8 2.18v3.23c0 .32.22.68.8.57A11.5 11.5 0 0012 .5z" />
                            </svg>
                        </a>
                    </div>
                    <p class="project-desc">${escapeHtml(p.description)}</p>
                    <div class="project-tags" role="list">
                        ${p.tags.map(t => `<span class="tag" role="listitem">${escapeHtml(t)}</span>`).join('')}
                    </div>
                    <div class="project-footer">
                        <a href="${escapeHtml(p.repo)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block magnetic">
                            View Source
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </article>
            `).join('');

            // Reinitialize features for new elements
            initMagnetic();
            initCardGlowEffect();
        } catch (error) {
            console.error('Failed to render projects:', error);
        }
    }

    /**
     * Initialize projects carousel functionality
     */
    function initProjectsCarousel() {
        const carousel = $('#projectsCarousel');
        const prevBtn = $('#projectsPrev');
        const nextBtn = $('#projectsNext');
        const dotsContainer = $('#projectsDots');

        if (!carousel || !prevBtn || !nextBtn) return;

        const cards = Array.from(carousel.querySelectorAll('.project-card'));
        if (cards.length === 0) return;

        let currentIndex = 0;
        let cardsPerView = getCardsPerView();
        // Allow navigation to show each card as active
        const maxIndex = cards.length - 1;

        // Create dots - one per card
        for (let i = 0; i < cards.length; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to project ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(i);
                stopAutoRotate();
            });
            dotsContainer.appendChild(dot);
        }

        function getCardsPerView() {
            const width = window.innerWidth;
            if (width < 768) return 1;
            if (width < 1024) return 2;
            return 3;
        }

        function updateCarousel() {
            // Update card positions and states
            cards.forEach((card, i) => {
                card.classList.remove('active', 'side');

                if (i === currentIndex) {
                    card.classList.add('active');
                } else if (i === currentIndex - 1 || i === currentIndex + 1) {
                    card.classList.add('side');
                }
            });

            // Calculate offset to center the active card
            const cardWidth = cards[0].offsetWidth;
            const gap = 32;
            const carouselWrapper = carousel.parentElement;
            const wrapperWidth = carouselWrapper.offsetWidth;

            // Always center the active card
            const totalOffset = currentIndex * (cardWidth + gap);
            const centerPosition = (wrapperWidth / 2) - (cardWidth / 2);
            const offset = centerPosition - totalOffset;
            carousel.style.transform = `translateX(${offset}px)`;

            // Update dots
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
                dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
            });
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            updateCarousel();
        }

        function nextSlide() {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            } else {
                // Loop back to start for auto-rotate
                currentIndex = 0;
                updateCarousel();
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                prevSlide();
            } else {
                currentIndex = maxIndex;
                updateCarousel();
            }
            stopAutoRotate();
        });
        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                nextSlide();
            } else {
                currentIndex = 0;
                updateCarousel();
            }
            stopAutoRotate();
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoRotate();
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
            startAutoRotate();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left -> next
                    if (currentIndex < maxIndex) {
                        nextSlide();
                    }
                } else {
                    // Swipe right -> prev
                    prevSlide();
                }
            }
        }

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newCardsPerView = getCardsPerView();
                if (newCardsPerView !== cardsPerView) {
                    cardsPerView = newCardsPerView;
                }
                updateCarousel();
            }, 250);
        });

        // Auto-rotate logic
        let autoRotateInterval;
        const autoRotateDelay = 5000; // 5 seconds

        function startAutoRotate() {
            stopAutoRotate(); // Clear existing to avoid multiples
            autoRotateInterval = setInterval(() => {
                nextSlide();
            }, autoRotateDelay);
        }

        function stopAutoRotate() {
            clearInterval(autoRotateInterval);
        }

        // Pause auto-rotate on hover
        carousel.addEventListener('mouseenter', stopAutoRotate);
        carousel.addEventListener('mouseleave', startAutoRotate);

        // Also pause on dots container hover
        dotsContainer.addEventListener('mouseenter', stopAutoRotate);
        dotsContainer.addEventListener('mouseleave', startAutoRotate);

        // Initialize with animation
        setTimeout(() => {
            updateCarousel();
            startAutoRotate();
        }, 100);
    }

    /**
     * Render skill chips grouped by category
     * @param {Array} skills - Array of skill objects with optional .category field
     */
    function renderSkills(skills) {
        const grid = $('#skillsGrid');
        if (!grid || !skills) return;

        // Category accent colors  (CSS variable names for easy theming)
        const categoryMeta = {
            'Languages & Core':  { color: 'var(--accent)',   short: 'LANG' },
            'ML & AI':           { color: '#f59e0b',         short: 'ML'   },
            'Data & Analytics':  { color: 'var(--accent-3)', short: 'DATA' },
            'Tools & Workflow':  { color: 'var(--accent-2)', short: 'TOOLS'},
        };

        try {
            // Group skills by category
            const hasCats = skills.some(s => s.category);

            if (!hasCats) {
                // Fallback: flat render (original behaviour)
                grid.innerHTML = skills.map((s, i) => `
                    <span class="skill-chip reveal" style="transition-delay: ${i * 30}ms" role="listitem">
                        <span class="skill-icon" aria-hidden="true">${s.icon}</span>
                        <span>${escapeHtml(s.name)}</span>
                    </span>
                `).join('');
            } else {
                // Group by category
                const groups = {};
                skills.forEach(s => {
                    const cat = s.category || 'Other';
                    if (!groups[cat]) groups[cat] = [];
                    groups[cat].push(s);
                });

                let chipIndex = 0;
                grid.innerHTML = Object.entries(groups).map(([cat, items]) => {
                    const meta = categoryMeta[cat] || { color: 'var(--accent)', short: '—' };
                    const chips = items.map(s => {
                        const delay = chipIndex++ * 40;
                        return `
                        <span class="skill-chip reveal" style="transition-delay:${delay}ms;--chip-color:${meta.color}" role="listitem">
                            <span class="skill-icon" aria-hidden="true">${s.icon}</span>
                            <span>${escapeHtml(s.name)}</span>
                        </span>`;
                    }).join('');

                    return `
                    <div class="skill-category reveal" role="group" aria-label="${escapeHtml(cat)}">
                        <div class="skill-category-label" style="--cat-color:${meta.color}">
                            <span class="skill-cat-dot"></span>
                            <span>${escapeHtml(cat)}</span>
                        </div>
                        <div class="skills-chip-row">${chips}</div>
                    </div>`;
                }).join('');
            }

            // Reuse existing observer
            const observer = initReveal();
            $$('#skillsGrid .reveal').forEach(el => {
                if (observer && !el.classList.contains('visible')) {
                    observer.observe(el);
                }
            });
        } catch (error) {
            console.error('Failed to render skills:', error);
        }
    }

    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Initialize card glow effect
     * Creates gradient glow that follows mouse position
     */
    function initCardGlowEffect() {
        if (isMobile()) return; // Disable on mobile for performance

        const cards = $$('.card');
        cards.forEach(card => {
            const handleMouseMove = throttle((e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                const glow = card.querySelector('.card-glow');
                if (glow) {
                    glow.style.setProperty('--x', `${x}%`);
                    glow.style.setProperty('--y', `${y}%`);
                }
            }, CONFIG.throttleDelay);

            card.addEventListener('mousemove', handleMouseMove);
        });
    }

    /**
     * Initialize certifications carousel functionality
     */
    function initCertCarousel() {
        const carousel = $('#certCarousel');
        const prevBtn = $('#certPrev');
        const nextBtn = $('#certNext');
        const dotsContainer = $('#certDots');

        if (!carousel || !prevBtn || !nextBtn || !dotsContainer) return;

        const cards = Array.from(carousel.querySelectorAll('.cert-card'));
        if (cards.length === 0) return;

        let currentIndex = 0;

        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to certificate ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(i);
                stopAutoRotate();
            });
            dotsContainer.appendChild(dot);
        });

        function updateCarousel() {
            // Update card states for visual hierarchy
            cards.forEach((card, i) => {
                card.classList.remove('active', 'side');

                if (i === currentIndex) {
                    card.classList.add('active');
                    card.setAttribute('aria-current', 'true');
                } else {
                    card.removeAttribute('aria-current');
                    if (i === currentIndex - 1 || i === currentIndex + 1) {
                        card.classList.add('side');
                    }
                }
            });

            // Calculate precise offset to center the active card
            const cardWidth = cards[0].offsetWidth;
            const gap = 32;
            const carouselWrapper = carousel.parentElement;
            const wrapperWidth = carouselWrapper.offsetWidth;

            // Center the active card by calculating its position
            const totalOffset = currentIndex * (cardWidth + gap);
            const centerPosition = (wrapperWidth / 2) - (cardWidth / 2);
            const offset = centerPosition - totalOffset;

            carousel.style.transform = `translateX(${offset}px)`;

            // Update navigation buttons state
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === cards.length - 1;
            prevBtn.setAttribute('aria-disabled', currentIndex === 0);
            nextBtn.setAttribute('aria-disabled', currentIndex === cards.length - 1);

            // Update dots to reflect current position
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
                dot.setAttribute('aria-current', i === currentIndex);
            });
        }

        function goToSlide(index) {
            const newIndex = Math.max(0, Math.min(index, cards.length - 1));
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateCarousel();
            }
        }

        function nextSlide() {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                updateCarousel();
            } else {
                // Loop back to start for auto-rotate
                currentIndex = 0;
                updateCarousel();
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }

        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoRotate();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoRotate();
        });

        // Touch/swipe support for mobile users
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoRotate();
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
            // Restart auto-rotate after a delay
            setTimeout(startAutoRotate, 3000);
        }, { passive: true });

        function handleSwipe() {
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left -> next
                    if (currentIndex < cards.length - 1) {
                        nextSlide();
                    }
                } else {
                    // Swipe right -> prev
                    if (currentIndex > 0) {
                        prevSlide();
                    }
                }
            }
        }

        // Handle window resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCarousel();
            }, 250);
        });

        // Auto-rotate functionality
        let autoRotateInterval;
        const autoRotateDelay = 5000; // 5 seconds

        function startAutoRotate() {
            stopAutoRotate(); // Clear any existing interval
            autoRotateInterval = setInterval(() => {
                nextSlide(); // nextSlide now handles looping
            }, autoRotateDelay);
        }

        function stopAutoRotate() {
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
                autoRotateInterval = null;
            }
        }

        // Pause auto-rotate on user interaction
        carousel.addEventListener('mouseenter', stopAutoRotate);
        carousel.addEventListener('mouseleave', startAutoRotate);

        // Also pause when hovering over controls
        dotsContainer.addEventListener('mouseenter', stopAutoRotate);
        dotsContainer.addEventListener('mouseleave', startAutoRotate);

        // Track whether the certifications section is visible
        let isCertSectionVisible = false;
        const certSection = $('#certifications');
        if (certSection) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isCertSectionVisible = entry.isIntersecting;
                });
            }, { threshold: 0.1 });
            sectionObserver.observe(certSection);
        }

        // Keyboard navigation — only active when cert section is in view and modal is closed
        document.addEventListener('keydown', (e) => {
            if (!isCertSectionVisible) return;
            const modal = $('#certModal');
            if (modal && modal.classList.contains('active')) return;

            if (e.key === 'ArrowLeft') {
                prevSlide();
                stopAutoRotate();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                stopAutoRotate();
            }
        });

        // Initialize carousel with smooth animation
        setTimeout(() => {
            updateCarousel();
            startAutoRotate();
        }, 100);
    }

    /**
     * Certificate data for modal
     */
    const CERT_DATA = [
        {
            title: 'JPMorgan Chase & Co. Software Engineering Job Simulation',
            issuer: 'Forage • January 2026',
            image: 'assets/jpmorgan-cert.png',
            verifyUrl: 'https://www.theforage.com/completion-certificates/Sj7temL583QAYpHXD/E6McHJDKsQYh79moz_Sj7temL583QAYpHXD_696807b3afb60a1158b52c05_1768583777280_completion_certificate.pdf',
            description: 'A virtual job simulation developed by JPMorgan Chase that gives hands-on software engineering experience by working with real-world technologies used in industry. Through this simulation, I completed practical tasks involving backend development with tools like Spring Boot, Kafka integration, REST APIs, and database interaction, which strengthened my understanding of building scalable services and enterprise software practices.'
        },
        {
            title: 'IBM Data Science Professional Certificate (V3)',
            issuer: 'Coursera • November 2025',
            image: 'assets/ibm-data-science-cert.png',
            verifyUrl: 'https://www.credly.com/badges/babf18dc-fa2a-4ab4-ad3e-e728752e5098/linked_in_profile',
            description: 'An online professional certificate from IBM that covers core data science and machine learning skills used in real industry roles. The program includes training in Python programming, databases and SQL, data visualization, exploratory data analysis, and machine learning, and it culminates in hands-on projects that showcase applied data science techniques and tools.'
        },
        {
            title: 'AWS Cloud Practitioner Essentials',
            issuer: 'AWS Training & Certification • May 2026',
            image: 'assets/aws-cloud-practitioner-cert.png',
            description: 'A completion certificate from AWS Training and Certification covering foundational cloud computing concepts and core AWS services. The course covers essential areas including cloud architecture, security and compliance, pricing models, storage, compute, and networking on the AWS platform, providing a solid grounding in how modern cloud infrastructure is designed and operated.'
        },
        {
            title: 'Claude Code in Action',
            issuer: 'Anthropic • March 2026',
            image: 'assets/claude-code-cert.png',
            verifyUrl: 'https://verify.skilljar.com/c/ng4mrdhdsa4b',
            description: 'A certificate of completion from Anthropic for the Claude Code in Action course, which provides hands-on training in using Claude Code as an AI-powered development tool. The course covers practical workflows for building, debugging, and iterating on real software projects using Claude as an intelligent coding assistant, reflecting a growing skillset at the intersection of AI and software engineering.'
        }
    ];

    /**
     * Open certificate modal
     * @param {number} certIndex - Index of certificate to display
     */
    window.openCertModal = function (certIndex) {
        const modal = $('#certModal');
        const modalBody = $('#certModalBody');

        if (!modal || !modalBody || !CERT_DATA[certIndex]) return;

        const cert = CERT_DATA[certIndex];

        modalBody.innerHTML = `
            ${cert.image ? `<img src="${escapeHtml(cert.image)}" alt="${escapeHtml(cert.title)}" loading="lazy" decoding="async">` : ''}
            <h3>${escapeHtml(cert.title)}</h3>
            <p style="color: var(--accent); font-weight: 500; margin-bottom: 16px;">${escapeHtml(cert.issuer)}</p>
            <p>${escapeHtml(cert.description)}</p>
            ${cert.verifyUrl ? `<a href="${escapeHtml(cert.verifyUrl)}" target="_blank" rel="noopener noreferrer" class="cert-verify-link">Verify Certificate ↗</a>` : ''}
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    /**
     * Close certificate modal
     */
    window.closeCertModal = function () {
        const modal = $('#certModal');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeCertModal();
        }
    });

    // Close modal on backdrop click
    const modal = $('#certModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.closeCertModal();
            }
        });
    }
})();
