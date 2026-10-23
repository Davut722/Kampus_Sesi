/* ==========================================================================
   Kampüs Sesi — Merkezi Animasyon Motoru (animations.js)
   --------------------------------------------------------------------------
   Harici kütüphane yok. Veri attribute'larıyla çalışır (bkz. animations.css).

   Genel API:
     window.initAnimations(root = document, { pageEnter: false })
        root içindeki animasyonlu elemanları bağlar. Router her sayfa
        render'ından sonra çağırır; MutationObserver ise sonradan eklenenleri
        (API'den gelen kartlar, listeler) otomatik yakalar. Aynı eleman iki
        kez animasyonlanmaz.
     window.AnimUtils.reviewSkeleton(n)   yükleme iskeleti HTML'i
   ========================================================================== */
(function () {
    'use strict';

    // IntersectionObserver yoksa hiçbir şey gizlenmesin: js-anim eklenmez.
    if (!('IntersectionObserver' in window)) {
        window.initAnimations = function () {};
        window.AnimUtils = { reviewSkeleton: function () { return ''; } };
        return;
    }

    var htmlEl = document.documentElement;
    htmlEl.classList.add('js-anim');

    /* ---------- Ortam / tercih takibi ---------- */
    function watchMedia(query, cb) {
        var mq = window.matchMedia(query);
        var handler = function (e) { cb(e.matches); };
        if (mq.addEventListener) mq.addEventListener('change', handler);
        else if (mq.addListener) mq.addListener(handler);
        cb(mq.matches);
        return mq;
    }

    var reduced = false;
    var desktop = true;
    watchMedia('(prefers-reduced-motion: reduce)', function (v) { reduced = v; });
    watchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)', function (v) { desktop = v; });

    var STAGGER_CAP = 10;       // bir grupta en fazla kaç adım gecikme
    var DEFAULT_STEP = 90;      // ms
    var LEAVE_MS = 400;         // sayfa çıkış süresi (css --anim-leave ile aynı)
    var FINISH_PAD = 900;       // süre + gecikme sonrası temizlik payı (ms)

    var bound = new WeakSet();

    /* ======================================================================
       1. SCROLL REVEAL (data-anim, data-stagger, data-counter, data-bar...)
       ====================================================================== */
    var io = new IntersectionObserver(onIntersect, { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0 });

    function onIntersect(entries) {
        var visible = entries.filter(function (e) { return e.isIntersecting; });
        if (!visible.length) return;

        // Görünüş sırasına göre (üstten alta, soldan sağa)
        visible.sort(function (a, b) {
            return (a.boundingClientRect.top - b.boundingClientRect.top) ||
                   (a.boundingClientRect.left - b.boundingClientRect.left);
        });

        var perParent = new Map();
        visible.forEach(function (entry) {
            var el = entry.target;
            io.unobserve(el);
            var extra = 0;
            var parent = el.__animParent;
            if (parent) {
                var n = perParent.get(parent) || 0;
                perParent.set(parent, n + 1);
                extra = Math.min(n, STAGGER_CAP) * (parent.__animStep || DEFAULT_STEP);
            }
            reveal(el, extra);
        });
    }

    function reveal(el, extra) {
        var attrDelay = el.hasAttribute('data-anim-delay') ? parseInt(el.getAttribute('data-anim-delay'), 10) : (el.__animBase || 0);
        var delay = (attrDelay || 0) + extra;
        el.style.setProperty('--anim-delay', delay + 'ms');

        if (el.hasAttribute('data-counter')) runCounter(el, delay);

        requestAnimationFrame(function () { el.classList.add('is-in'); });

        setTimeout(function () { finish(el); }, delay + FINISH_PAD);
    }

    // Animasyon bitince data-anim kaldırılır: eleman kendi (hover/transition) stillerine döner.
    function finish(el) {
        if (el.hasAttribute('data-anim')) el.removeAttribute('data-anim');
        if (el.hasAttribute('data-split')) el.classList.add('anim-words-done');
    }

    function observe(el) { io.observe(el); }

    /* ----- Stagger ----- */
    function skipStaggerChild(child) {
        var cl = child.classList;
        return child.hasAttribute('data-no-anim') ||
               cl.contains('skeleton') || cl.contains('anim-skeleton') || cl.contains('anim-skel-card') ||
               cl.contains('anim-spotlight') || cl.contains('anim-tilt-glow') || cl.contains('nav__indicator');
    }

    function bindStaggerChild(child, container) {
        if (child.nodeType !== 1 || bound.has(child) || skipStaggerChild(child)) return;
        var tag = child.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE') return;

        container.__animStep = parseInt(container.getAttribute('data-stagger'), 10) || DEFAULT_STEP;
        child.__animParent = container;
        child.__animBase = parseInt(container.getAttribute('data-anim-delay'), 10) || 0;
        if (!child.hasAttribute('data-anim')) child.setAttribute('data-anim', 'fade-up');
        bindEl(child);
    }

    function bindStaggerContainer(container) {
        Array.prototype.forEach.call(container.children, function (child) {
            bindStaggerChild(child, container);
        });
    }

    /* ----- Tek elemanı bağla ----- */
    function bindEl(el) {
        if (bound.has(el)) return;
        bound.add(el);

        if (el.hasAttribute('data-typewriter')) bindTypewriter(el);
        if (el.hasAttribute('data-spotlight')) bindSpotlight(el);

        if (el.hasAttribute('data-split')) bindSplit(el);
        if (el.hasAttribute('data-counter')) bindCounter(el);
        if (el.hasAttribute('data-bar')) bindBar(el);

        var animated = el.hasAttribute('data-anim') || el.hasAttribute('data-split') ||
                       el.hasAttribute('data-counter') || el.hasAttribute('data-bar');
        if (!animated) return;

        if (reduced) {
            el.classList.add('is-in');
            if (el.hasAttribute('data-counter')) runCounter(el, 0);
            if (el.hasAttribute('data-anim')) el.removeAttribute('data-anim');
            return;
        }
        observe(el);
    }

    /* ----- Yıldızlar (JS ile basılan .stars) ----- */
    function bindStars(starsEl) {
        if (bound.has(starsEl) || starsEl.classList.contains('stars--interactive')) return;
        bound.add(starsEl);
        starsEl.setAttribute('data-anim-stars', '');
        var items = starsEl.querySelectorAll('.stars__item');
        for (var i = 0; i < items.length; i++) items[i].style.setProperty('--star-i', i);
        if (reduced) { starsEl.classList.add('is-in'); return; }
        observe(starsEl);
    }

    /* ======================================================================
       2. SAYAÇLAR
       ====================================================================== */
    function counterFormat(el) {
        var dec = parseInt(el.getAttribute('data-counter-decimals'), 10) || 0;
        var fmt = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
        var prefix = el.getAttribute('data-counter-prefix') || '';
        var suffix = el.getAttribute('data-counter-suffix') || '';
        return function (v) { return prefix + fmt.format(v) + suffix; };
    }

    function bindCounter(el) {
        var target = parseFloat(el.getAttribute('data-counter'));
        if (isNaN(target)) { el.removeAttribute('data-counter'); return; }
        if (!reduced) el.textContent = counterFormat(el)(0);
    }

    function runCounter(el, delay) {
        var target = parseFloat(el.getAttribute('data-counter'));
        if (isNaN(target)) return;
        var format = counterFormat(el);
        if (reduced) { el.textContent = format(target); return; }

        var DURATION = 1600;
        setTimeout(function () {
            var t0 = performance.now();
            (function step(now) {
                var p = Math.min(1, (now - t0) / DURATION);
                var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);   // easeOutExpo
                el.textContent = format(target * eased);
                if (p < 1) requestAnimationFrame(step);
            })(t0);
        }, delay);
    }

    /* ======================================================================
       3. BARLAR (yalnızca transform: scaleX)
       ====================================================================== */
    function bindBar(el) {
        var pct = Math.max(0, Math.min(100, parseFloat(el.getAttribute('data-bar')) || 0));
        el.style.setProperty('--bar-scale', (pct / 100).toString());
    }

    /* ======================================================================
       4. BAŞLIK KELİME KELİME (data-split="words")
       ====================================================================== */
    function bindSplit(el) {
        if (reduced || el.getAttribute('data-split') !== 'words') return;
        el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
        splitNode(el, { n: 0 }, false);
    }

    function splitNode(node, idx, inGrad) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
            if (child.nodeType === 3) {
                var frag = document.createDocumentFragment();
                child.textContent.split(/(\s+)/).forEach(function (part) {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
                    var word = document.createElement('span');
                    word.className = 'anim-word' + (inGrad ? ' anim-word--grad' : '');
                    word.setAttribute('aria-hidden', 'true');
                    word.style.setProperty('--w', String(idx.n++));
                    var inner = document.createElement('span');
                    inner.className = 'anim-word__inner';
                    inner.textContent = part;
                    word.appendChild(inner);
                    frag.appendChild(word);
                });
                node.replaceChild(frag, child);
            } else if (child.nodeType === 1) {
                var grad = inGrad || /bg-clip-text|text-transparent/.test(child.className || '');
                if (grad) child.classList.add('anim-word-group');
                splitNode(child, idx, grad);
            }
        });
    }

    /* ======================================================================
       5. PLACEHOLDER DAKTİLO (data-typewriter="a|b|c")
       ====================================================================== */
    function bindTypewriter(input) {
        if (reduced) return;
        var items = (input.getAttribute('data-typewriter') || '').split('|').map(function (s) { return s.trim(); }).filter(Boolean);
        if (!items.length) return;
        var prefix = input.getAttribute('data-typewriter-prefix') || '';
        var i = 0, pos = 0, mode = 'type', timer = null;

        function schedule(ms) { timer = setTimeout(tick, ms); }

        function tick() {
            if (!input.isConnected) return;                 // sayfa değişti: dur
            if (document.hidden || input.value.length > 0) { // kullanıcı yazıyor / sekme gizli: bekle
                return schedule(600);
            }
            var word = items[i];
            if (mode === 'type') {
                pos++;
                input.placeholder = prefix + word.slice(0, pos) + '|';
                if (pos >= word.length) { mode = 'hold'; return schedule(1700); }
                return schedule(75 + Math.random() * 45);
            }
            if (mode === 'hold') { mode = 'erase'; return schedule(0); }
            pos--;
            input.placeholder = prefix + word.slice(0, Math.max(pos, 0)) + '|';
            if (pos <= 0) { mode = 'type'; i = (i + 1) % items.length; return schedule(380); }
            schedule(38);
        }

        schedule(900);
    }

    /* ======================================================================
       6. SPOTLIGHT (data-spotlight) — yalnızca masaüstü
       ====================================================================== */
    function bindSpotlight(container) {
        var spot = document.createElement('div');
        spot.className = 'anim-spotlight';
        spot.setAttribute('aria-hidden', 'true');
        container.appendChild(spot);

        var x = 0, y = 0, raf = 0;
        container.addEventListener('pointermove', function (e) {
            if (reduced || !desktop || e.pointerType === 'touch') return;
            var r = container.getBoundingClientRect();
            x = e.clientX - r.left;
            y = e.clientY - r.top;
            if (!raf) raf = requestAnimationFrame(function () {
                raf = 0;
                spot.style.transform = 'translate3d(' + (x - 260) + 'px,' + (y - 260) + 'px,0)';
                spot.classList.add('is-on');
            });
        }, { passive: true });
        container.addEventListener('pointerleave', function () { spot.classList.remove('is-on'); });
    }

    /* ======================================================================
       7. 3D TILT + KENAR GLOW (data-tilt) — olay delegasyonu, tek rAF
       ====================================================================== */
    var MAX_TILT = 6;
    var tiltEl = null, tiltX = 0, tiltY = 0, tiltRaf = 0;

    function ensureGlow(el) {
        if (el.__glow) return;
        var g = document.createElement('span');
        g.className = 'anim-tilt-glow';
        g.setAttribute('aria-hidden', 'true');
        el.appendChild(g);
        el.__glow = g;
        if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
    }

    function resetTilt(el) {
        if (!el) return;
        el.style.transform = '';
        el.style.setProperty('--tilt-o', '0');
    }

    function applyTilt() {
        tiltRaf = 0;
        if (!tiltEl) return;
        var r = tiltEl.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var px = (tiltX - r.left) / r.width;
        var py = (tiltY - r.top) / r.height;
        ensureGlow(tiltEl);
        tiltEl.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        tiltEl.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        tiltEl.style.setProperty('--tilt-o', '1');
        tiltEl.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 2 * MAX_TILT).toFixed(2) +
            'deg) rotateY(' + ((px - 0.5) * 2 * MAX_TILT).toFixed(2) + 'deg) translate3d(0,-2px,0)';
    }

    document.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch' || reduced || !desktop) {
            if (tiltEl) { resetTilt(tiltEl); tiltEl = null; }
            return;
        }
        var el = e.target.closest ? e.target.closest('[data-tilt]') : null;
        if (el !== tiltEl) { resetTilt(tiltEl); tiltEl = el; }
        // Giriş animasyonu sürerken (data-anim hâlâ varken) tilt uygulanmaz
        if (!el || el.hasAttribute('data-anim')) return;
        tiltX = e.clientX;
        tiltY = e.clientY;
        if (!tiltRaf) tiltRaf = requestAnimationFrame(applyTilt);
    }, { passive: true });

    document.addEventListener('pointerout', function (e) {
        if (!e.relatedTarget && tiltEl) { resetTilt(tiltEl); tiltEl = null; }
    }, { passive: true });

    /* ======================================================================
       8. TARAMA (scan) + MutationObserver
       ====================================================================== */
    var SELECTOR = '[data-anim],[data-stagger],[data-split],[data-counter],[data-bar],[data-typewriter],[data-spotlight]';

    function scan(scope) {
        if (!scope) return;
        var list = [];
        if (scope.nodeType === 1) list.push(scope);
        if (scope.querySelectorAll) {
            Array.prototype.push.apply(list, scope.querySelectorAll(SELECTOR));
        }

        // Önce stagger kapsayıcıları (çocuklara data-anim atar)
        list.forEach(function (el) {
            if (el.nodeType === 1 && el.hasAttribute('data-stagger')) bindStaggerContainer(el);
        });
        list.forEach(function (el) {
            if (el.nodeType === 1) bindEl(el);
        });

        // Yıldızlar
        if (scope.nodeType === 1 && scope.classList.contains('stars')) bindStars(scope);
        if (scope.querySelectorAll) {
            Array.prototype.forEach.call(scope.querySelectorAll('.stars'), bindStars);
        }
    }

    function processAdded(node) {
        if (node.nodeType !== 1) return;
        if (node.closest && node.closest('.leaflet-container')) return;   // harita karoları
        var parent = node.parentElement;
        if (parent && parent.hasAttribute('data-stagger')) bindStaggerChild(node, parent);
        scan(node);
    }

    var mo = null;
    function startObserver() {
        var appRoot = document.getElementById('app-root');
        if (!appRoot || mo || !('MutationObserver' in window)) return;
        // Callback mikro-görevdir: boyamadan önce çalışır, gizleme için titreme olmaz.
        mo = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var added = mutations[i].addedNodes;
                for (var j = 0; j < added.length; j++) {
                    if (added[j].isConnected) processAdded(added[j]);
                }
            }
        });
        mo.observe(appRoot, { childList: true, subtree: true });
    }

    /* ======================================================================
       9. SAYFA GEÇİŞLERİ
       ====================================================================== */
    var leaving = false;
    var bypass = false;
    var enterTimer = null;
    var leaveGuard = null;

    function pageEnter() {
        var r = document.getElementById('app-root');
        if (!r) return;
        leaving = false;
        clearTimeout(leaveGuard);
        r.classList.remove('anim-leaving');
        if (reduced) return;
        r.classList.remove('anim-page-enter');
        void r.offsetWidth;   // animasyonu yeniden başlat
        r.classList.add('anim-page-enter');
        clearTimeout(enterTimer);
        enterTimer = setTimeout(function () { r.classList.remove('anim-page-enter'); }, 800);
    }

    function isRouteLink(a, e) {
        if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
        if ((a.target && a.target !== '_self') || a.hasAttribute('download') ||
            a.hasAttribute('data-no-transition') || a.hasAttribute('data-legal-modal')) return false;
        var href = a.getAttribute('href');
        if (!href || href === '#' || /^(javascript:|mailto:|tel:|sms:)/i.test(href)) return false;
        var url;
        try { url = new URL(a.href, window.location.href); } catch (err) { return false; }
        if (url.origin !== window.location.origin) return false;                       // harici
        if (url.pathname === window.location.pathname && url.hash && url.hash.indexOf('#/') !== 0) return false; // sayfa içi çıpa
        return true;
    }

    // Capture: app.js'teki link dinleyicisinden önce çalışır.
    window.addEventListener('click', function (e) {
        if (bypass || reduced) return;
        var a = e.target.closest ? e.target.closest('a[href]') : null;
        if (!isRouteLink(a, e)) return;
        var r = document.getElementById('app-root');
        if (!r) return;

        e.preventDefault();
        e.stopPropagation();
        if (leaving) return;
        leaving = true;
        r.classList.add('anim-leaving');

        setTimeout(function () {
            bypass = true;
            try { a.click(); } finally { bypass = false; }   // app.js yönlendirmeyi normal yapar
        }, LEAVE_MS);

        // Güvenlik ağı: render tetiklenmezse içerik görünür kalsın
        clearTimeout(leaveGuard);
        leaveGuard = setTimeout(function () {
            leaving = false;
            r.classList.remove('anim-leaving');
        }, LEAVE_MS + 1500);
    }, true);

    /* ======================================================================
       10. NAVBAR: scroll glass, kayan aktif çizgi, scroll progress
       ====================================================================== */
    var navEl = null, progressEl = null, indicator = null, scrollTick = false;

    function onScroll() {
        if (scrollTick) return;
        scrollTick = true;
        requestAnimationFrame(function () {
            scrollTick = false;
            var y = window.pageYOffset || htmlEl.scrollTop || 0;
            var h = htmlEl.scrollHeight - window.innerHeight;
            if (progressEl) progressEl.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0).toFixed(4) + ')';
            if (navEl) navEl.classList.toggle('nav--scrolled', y > 8);
        });
    }

    function updateNavIndicator() {
        var ul = document.querySelector('.nav__links');
        if (!ul) return;
        if (!indicator || !indicator.isConnected) {
            indicator = document.createElement('span');
            indicator.className = 'nav__indicator no-anim';
            indicator.setAttribute('aria-hidden', 'true');
            ul.appendChild(indicator);
            ul.classList.add('nav__links--indicator');
        }
        var active = ul.querySelector('.nav__link--active');
        var ulRect = ul.getBoundingClientRect();
        if (!active || !ulRect.width) { indicator.classList.remove('is-ready'); return; }

        var r = active.getBoundingClientRect();
        var first = !indicator.classList.contains('is-ready');
        if (first) indicator.classList.add('no-anim');
        indicator.style.top = (r.bottom - ulRect.top + 2) + 'px';
        indicator.style.setProperty('--ind-x', (r.left - ulRect.left) + 'px');
        indicator.style.setProperty('--ind-w', String(r.width));
        indicator.classList.add('is-ready');
        if (first) {
            void indicator.offsetWidth;
            requestAnimationFrame(function () { indicator.classList.remove('no-anim'); });
        }
    }

    function setupChrome() {
        navEl = document.querySelector('.nav');
        progressEl = document.createElement('div');
        progressEl.className = 'anim-scroll-progress';
        progressEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(progressEl);

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', function () { onScroll(); updateNavIndicator(); });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateNavIndicator);
        onScroll();
    }

    /* ======================================================================
       11. DIŞA AÇIK API
       ====================================================================== */
    window.initAnimations = function (root, opts) {
        root = root || document;
        opts = opts || {};
        if (opts.pageEnter) pageEnter();
        startObserver();
        scan(root);
        updateNavIndicator();
    };

    window.AnimUtils = {
        reviewSkeleton: function (n) {
            var out = '';
            for (var i = 0; i < (n || 3); i++) {
                out += '<div class="card anim-skel-card" aria-hidden="true">' +
                    '<div class="anim-skel-row"><span class="anim-skeleton anim-skel-avatar"></span>' +
                    '<div style="flex:1"><span class="anim-skeleton anim-skel-line w40"></span>' +
                    '<span class="anim-skeleton anim-skel-line w25" style="margin-bottom:0"></span></div></div>' +
                    '<span class="anim-skeleton anim-skel-line w100"></span>' +
                    '<span class="anim-skeleton anim-skel-line w70" style="margin-bottom:0"></span></div>';
            }
            return out;
        }
    };

    /* ---------- Başlat ---------- */
    function boot() {
        setupChrome();
        startObserver();
        scan(document);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();

