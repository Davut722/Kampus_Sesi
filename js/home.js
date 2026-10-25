/* ========================================
   Kampüs Sesi — Ana sayfa vitrini
   "Önce göster, sonra anlat": gerçek yorumlar ve üniversiteler.
   Veri kaynağı: mevcut API (/reviews, /universities). Uydurma veri yok;
   puanlar yalnızca gelen yorumlardan hesaplanır.
   ======================================== */

const TAG_LABELS = {
    kampus: 'Kampüs',
    egitim: 'Akademik',
    kutuphane: 'Kütüphane',
    sosyal: 'Sosyal Hayat',
    ulasim: 'Ulaşım',
    yurt: 'Yurt',
    yemekhane: 'Yemekhane'
};

const CRIT_ICONS = {
    genel: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    yurt: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    yemekhane: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v16"/><path d="M6 2v19"/><path d="M9 2a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3V2z"/></svg>`,
    ulasim: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.6 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>`,
    sosyal: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    egitim: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
};

const ICON_MAP_PIN = `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

const TABS = [
    { id: 'genel', label: 'Genel' },
    { id: 'yurt', label: 'Yurt' },
    { id: 'yemekhane', label: 'Yemekhane' },
    { id: 'ulasim', label: 'Ulaşım' }
];

// Karşılaştırma demosundaki kriter sırası (6 ana kriter)
const COMPARE_ROWS = [
    { id: 'genel', label: 'Genel Puan' },
    { id: 'yurt', label: 'Yurt' },
    { id: 'yemekhane', label: 'Yemekhane' },
    { id: 'ulasim', label: 'Ulaşım' },
    { id: 'sosyal', label: 'Sosyal Hayat' },
    { id: 'egitim', label: 'Akademik' }
];

const FALLBACK_COMPARE = ['Boğaziçi Üniversitesi', 'Orta Doğu Teknik Üniversitesi (ODTÜ)'];

// Harita projeksiyonu (Türkiye sınırları, enlem düzeltmeli equirectangular)
const MAP = { w: 560, h: 300, pad: 14, minLng: 25.8, maxLng: 44.9, minLat: 35.15, maxLat: 42.2, vbY: 22, vbH: 268 };

// Bayes ağırlığı: yorum sayısı az olan okulun puanı genel ortalamaya yaklaştırılır
const PRIOR_WEIGHT = 3;
const STRIP_COUNT = 8;
const FEATURED_COUNT = 6;
const CITY_COUNT = 8;

/* ---------- yardımcılar ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const baseKey = (s) => String(s || '').replace(/\s*\([^)]*\)/g, '').trim().toLocaleLowerCase('tr');
const fmt = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const uniHref = (name) => `#/university?name=${encodeURIComponent(name)}`;
const $ = (id) => document.getElementById(id);

function starsHtml(avg) {
    const full = Math.max(0, Math.min(5, Math.round(avg)));
    return `<span class="hm-stars" role="img" aria-label="5 üzerinden ${fmt(avg)}"><span class="hm-stars__on">${'★'.repeat(full)}</span><span class="hm-stars__off">${'★'.repeat(5 - full)}</span></span>`;
}

function emptyState(text, linkHref, linkText) {
    return `<div class="hm-empty"><p>${esc(text)}</p>${linkHref ? `<a class="hm-empty__link" href="${linkHref}">${esc(linkText)}</a>` : ''}</div>`;
}

/* ---------- üniversite evreni (statik liste + koordinatlar, API ile zenginleşir) ---------- */
let universeCache = null;       // API'den gelen /universities (oturum boyunca)
let universePromise = null;

function loadUniverseFromApi(api) {
    if (universeCache) return Promise.resolve(universeCache);
    if (!universePromise) {
        universePromise = api.getUniversities()
            .then((list) => { universeCache = Array.isArray(list) ? list : []; return universeCache; })
            .catch((err) => { universePromise = null; console.warn('Üniversite listesi alınamadı:', err); return []; });
    }
    return universePromise;
}

function buildUniverse(apiList) {
    const byKey = new Map();
    const dots = [];
    const dotKeys = new Set();

    const names = (typeof TURKISH_UNIVERSITIES !== 'undefined' && Array.isArray(TURKISH_UNIVERSITIES)) ? TURKISH_UNIVERSITIES : [];
    names.forEach((n) => {
        const k = baseKey(n);
        if (!byKey.has(k)) byKey.set(k, { key: k, name: n, city: '', logo: '' });
    });

    const addDot = (entry, lat, lng) => {
        lat = Number(lat); lng = Number(lng);
        if (!isFinite(lat) || !isFinite(lng) || lat < 35 || lat > 42.6 || lng < 25.5 || lng > 45) return;
        const id = `${entry.key}|${lat.toFixed(3)}|${lng.toFixed(3)}`;
        if (dotKeys.has(id)) return;
        dotKeys.add(id);
        dots.push({ key: entry.key, name: entry.name, lat, lng });
    };

    const db = (typeof window !== 'undefined' && window.UNIVERSITY_ADDRESSES_DB) || {};
    Object.entries(db).forEach(([k, v]) => {
        if (!v) return;
        const name = v.name || k;
        const key = baseKey(name);
        let e = byKey.get(key);
        if (!e) { e = { key, name, city: '', logo: '' }; byKey.set(key, e); }
        if (!e.city && v.city) e.city = String(v.city).trim();
        addDot(e, v.lat, v.lng);
    });

    (apiList || []).forEach((u) => {
        if (!u || !u.name) return;
        const key = baseKey(u.name);
        let e = byKey.get(key);
        if (!e) { e = { key, name: u.name, city: '', logo: '' }; byKey.set(key, e); }
        if (u.image_url && String(u.image_url).trim()) e.logo = String(u.image_url).trim();
        const a = u.address;
        if (a) {
            if (!e.city && a.city) e.city = String(a.city).trim();
            addDot(e, a.latitude ?? a.lat, a.longitude ?? a.lng);
        }
    });

    return { byKey, dots };
}

/* ---------- yorum toplulaştırma ---------- */
function aggregate(reviews, universe) {
    const agg = new Map();
    (reviews || []).forEach((r) => {
        const rating = Number(r && r.rating);
        if (!(rating >= 1)) return;
        const key = baseKey(r.university);
        if (!key) return;
        let e = universe.byKey.get(key);
        if (!e) { e = { key, name: r.university, city: '', logo: '' }; universe.byKey.set(key, e); }
        let a = agg.get(key);
        if (!a) { a = { key, name: e.name, n: 0, sum: 0, tags: {} }; agg.set(key, a); }
        a.n += 1;
        a.sum += rating;
        new Set(Array.isArray(r.tags) ? r.tags : []).forEach((t) => {
            const s = a.tags[t] || (a.tags[t] = { n: 0, sum: 0 });
            s.n += 1;
            s.sum += rating;
        });
    });
    return agg;
}

function statFor(a, crit) {
    if (!a) return null;
    if (crit === 'genel') return a.n ? { n: a.n, avg: a.sum / a.n } : null;
    if (crit === 'egitim') {
        const s1 = a.tags && a.tags['egitim'];
        const s2 = a.tags && a.tags['akademik'];
        const n = (s1?.n || 0) + (s2?.n || 0);
        const sum = (s1?.sum || 0) + (s2?.sum || 0);
        return n ? { n, avg: sum / n } : null;
    }
    const s = a.tags && a.tags[crit];
    return s && s.n ? { n: s.n, avg: s.sum / s.n } : null;
}

function rankFeatured(agg, crit) {
    const rows = [];
    let sumAll = 0, nAll = 0;
    agg.forEach((a) => {
        const s = statFor(a, crit);
        if (!s) return;
        rows.push({ a, n: s.n, avg: s.avg });
        sumAll += s.avg * s.n;
        nAll += s.n;
    });
    const prior = nAll ? sumAll / nAll : 0;
    rows.forEach((r) => { r.score = (r.n / (r.n + PRIOR_WEIGHT)) * r.avg + (PRIOR_WEIGHT / (r.n + PRIOR_WEIGHT)) * prior; });
    rows.sort((x, y) => (y.score - x.score) || (y.n - x.n) || x.a.name.localeCompare(y.a.name, 'tr'));
    return rows.slice(0, FEATURED_COUNT);
}

/* ---------- global dinleyiciler (bir kez) ---------- */
let globalsBound = false;
let activeCtl = null;

function bindGlobalsOnce() {
    if (globalsBound) return;
    globalsBound = true;
    document.addEventListener('click', (e) => {
        if (activeCtl && !(e.target.closest && e.target.closest('.ed-map'))) activeCtl.hideTip(true);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeCtl) activeCtl.hideTip(true);
    });
}

/* ========================================
   Ana giriş
   ctx: { api, getReviews, isLoaded, hasFailed }
   Döner: render() — veri geldikçe app.js tarafından yeniden çağrılır.
   ======================================== */
export function initHomeShowcase(ctx) {
    const root = $('hm-root');
    if (!root) return () => {};

    bindGlobalsOnce();

    let universe = buildUniverse(universeCache);
    let agg = new Map();
    let activeTab = 'genel';
    let compareSel = [null, null];
    let userChoseCompare = false;
    let pinned = false;
    let hideTimer = 0;
    let lastFactsKey = '';
    let lastDotsKey = '';

    /* ----- 1. Harita ----- */
    function project(lat, lng) {
        const k = Math.cos(39 * Math.PI / 180);
        const spanX = (MAP.maxLng - MAP.minLng) * k;
        const spanY = MAP.maxLat - MAP.minLat;
        const scale = Math.min((MAP.w - 2 * MAP.pad) / spanX, (MAP.h - 2 * MAP.pad) / spanY);
        const offX = (MAP.w - spanX * scale) / 2;
        const offY = (MAP.h - spanY * scale) / 2;
        return [offX + (lng - MAP.minLng) * k * scale, offY + (MAP.maxLat - lat) * scale];
    }

    const svg = $('hm-map-svg');
    const tip = $('hm-tip');
    const IDLE_TIP_HTML = `<div class="hm-tip-slot__idle">
        <span class="hm-tip-slot__icon"><i data-lucide="map-pin" class="icon-xs"></i></span>
        <span>Her nokta bir yerleşke. Koyu noktalar yorum almış okullar; üzerine gel ya da tıkla.</span>
    </div>`;

    function renderMapDots() {
        if (!svg) return;
        const key = universe.dots.length + ':' + universe.byKey.size;
        if (key === lastDotsKey && svg.childElementCount) { paintDots(); return; }
        lastDotsKey = key;
        svg.innerHTML = universe.dots.map((d, i) => {
            const [x, y] = project(d.lat, d.lng);
            return `<circle class="hm-dot" data-i="${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" tabindex="0" role="link" aria-label="${esc(d.name)}"/>`;
        }).join('');
        paintDots();
    }

    function paintDots() {
        if (!svg) return;
        svg.querySelectorAll('circle[data-i]').forEach((c) => {
            const d = universe.dots[Number(c.dataset.i)];
            c.classList.toggle('hm-dot--rated', !!(d && agg.has(d.key)));
        });
    }

    function showTip(circle) {
        if (!tip || !circle) return;
        const d = universe.dots[Number(circle.dataset.i)];
        if (!d) return;
        clearTimeout(hideTimer);
        svg.querySelectorAll('.is-active').forEach((c) => c.classList.remove('is-active'));
        circle.classList.add('is-active');

        const entry = universe.byKey.get(d.key);
        const a = agg.get(d.key);
        const cityName = entry && entry.city ? esc(entry.city) : '';
        let rateHtml;
        if (a) {
            rateHtml = `<span class="hm-stars">${starsHtml(a.sum / a.n)}</span> <strong>${fmt(a.sum / a.n)}</strong> <small>(${a.n} yorum)</small>`;
        } else if (!ctx.isLoaded()) {
            rateHtml = `<small>Puan yükleniyor…</small>`;
        } else {
            rateHtml = `<small>Henüz yorum yok</small>`;
        }

        const metaParts = [];
        if (cityName) metaParts.push(`<span>${cityName}</span>`);
        if (cityName && rateHtml) metaParts.push(`<span class="hm-tip-slot__dot">•</span>`);
        if (rateHtml) metaParts.push(`<span>${rateHtml}</span>`);

        tip.innerHTML = `
            <div class="hm-tip-slot__info">
                <div class="hm-tip-slot__name" title="${esc(d.name)}">${esc(d.name)}</div>
                <div class="hm-tip-slot__meta">${metaParts.join(' ')}</div>
            </div>
            <a href="${uniHref(d.name)}" class="hm-tip-slot__btn" aria-label="${esc(d.name)} sayfasına git">
                <span>Sayfaya git</span>
                <i data-lucide="arrow-right" class="icon-xs"></i>
            </a>
        `;
        tip.classList.add('is-active');
        tip.hidden = false;
        tip.onclick = (e) => {
            if (!e.target.closest('a')) {
                window.location.hash = uniHref(d.name);
            }
        };

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function hideTip(force) {
        if (!tip) return;
        if (pinned && !force) return;
        if (force) pinned = false;
        clearTimeout(hideTimer);
        tip.classList.remove('is-active');
        tip.innerHTML = IDLE_TIP_HTML;
        tip.onclick = null;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        if (svg) svg.querySelectorAll('.is-active').forEach((c) => c.classList.remove('is-active'));
    }

    function scheduleHide() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => hideTip(false), 320);
    }

    if (svg && tip) {
        svg.addEventListener('pointerover', (e) => {
            const c = e.target.closest && e.target.closest('circle[data-i]');
            if (c) showTip(c);
        });
        svg.addEventListener('pointerout', (e) => {
            if (e.target.closest && e.target.closest('circle[data-i]')) scheduleHide();
        });
        svg.addEventListener('click', (e) => {
            const c = e.target.closest && e.target.closest('circle[data-i]');
            if (!c) return;
            const d = universe.dots[Number(c.dataset.i)];
            if (d && d.name) {
                window.location.hash = uniHref(d.name);
            }
        });
        svg.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const c = e.target.closest && e.target.closest('circle[data-i]');
                if (c) {
                    e.preventDefault();
                    const d = universe.dots[Number(c.dataset.i)];
                    if (d && d.name) {
                        window.location.hash = uniHref(d.name);
                    }
                }
            }
        });
        svg.addEventListener('focusin', (e) => {
            const c = e.target.closest && e.target.closest('circle[data-i]');
            if (c) showTip(c);
        });
        svg.addEventListener('focusout', (e) => {
            if (e.target.closest && e.target.closest('circle[data-i]')) scheduleHide();
        });
        tip.addEventListener('pointerenter', () => clearTimeout(hideTimer));
        tip.addEventListener('pointerleave', scheduleHide);
        activeCtl = { hideTip };
    }

    /* ----- Hero rakamları ----- */
    function renderFacts() {
        const box = $('hm-facts');
        if (!box) return;
        const cities = new Set();
        universe.byKey.forEach((e) => { if (e.city) cities.add(e.city); });
        const uniCount = universe.byKey.size;
        const reviewCount = ctx.isLoaded() ? (ctx.getReviews() || []).length : null;
        const key = [uniCount, cities.size, reviewCount].join('|');
        if (key === lastFactsKey) return;
        lastFactsKey = key;
        const item = (label, n) => `<div class="ed-facts__item"><dt>${label}</dt><dd ${n === null ? '' : `data-counter="${n}"`}>${n === null ? '—' : n}</dd></div>`;
        box.innerHTML = item('Üniversite', uniCount) + item('İl', cities.size) + item('Yorum', reviewCount);
    }

    /* ----- 2. Son yorumlar şeridi ----- */
    function reviewCard(r, hidden) {
        const text = String(r.text || '').replace(/\s+/g, ' ').trim();
        const short = text.length > 180 ? text.slice(0, 177).trimEnd() + '…' : text;
        const rating = Math.max(1, Math.min(5, Number(r.rating) || 0));
        let dateStr = r.date ? esc(r.date) : '';
        if (!dateStr && r.timestamp) {
            try { dateStr = new Date(Number(r.timestamp)).toLocaleDateString('tr-TR'); } catch(_) {}
        }
        return `<a class="hm-review" href="${uniHref(r.university)}"${hidden ? ' tabindex="-1" aria-hidden="true"' : ''}>
            <div class="hm-review__top">
                <span class="hm-review__stars">${starsHtml(rating)}</span>
                ${dateStr ? `<span class="hm-review__date">${dateStr}</span>` : ''}
            </div>
            <p class="hm-review__text">“${esc(short)}”</p>
            <div class="hm-review__uni">${esc(r.university)}</div>
        </a>`;
    }

    function renderReviewStrip() {
        const box = $('hm-reviews');
        if (!box) return;
        if (!ctx.isLoaded()) {
            box.innerHTML = '<div class="hm-skel-row">' + '<div class="hm-skel hm-skel--review"></div>'.repeat(4) + '</div>';
            return;
        }
        const list = (ctx.getReviews() || [])
            .filter((r) => r && r.university && Number(r.rating) >= 1 && String(r.text || '').trim().length >= 40)
            .sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0))
            .slice(0, STRIP_COUNT);

        if (!list.length) {
            box.innerHTML = ctx.hasFailed()
                ? emptyState('Yorumlar şu an yüklenemedi. Biraz sonra tekrar dene.')
                : emptyState('Henüz 40 karakterden uzun yorum yok. İlk detaylı yorumu sen yaz.', '#/review-form', 'Yorum yaz');
            return;
        }
        const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const canAnimate = list.length >= 3 && !prefersReducedMotion;
        const set = (hidden) => `<div class="hm-set"${hidden ? ' aria-hidden="true"' : ''}>${list.map((r) => reviewCard(r, hidden)).join('')}</div>`;
        box.innerHTML = `<div class="hm-marquee${canAnimate ? ' hm-marquee--loop' : ''}"><div class="hm-marquee__track" style="--hm-dur:${Math.max(26, list.length * 7)}s">${set(false)}${canAnimate ? set(true) : ''}</div></div>`;
    }

    /* ----- 3. Öne çıkan üniversiteler ----- */
    function logoHtml(entry) {
        const letter = esc((entry.name || '?').trim().charAt(0).toLocaleUpperCase('tr'));
        if (entry.logo) {
            return `<div class="hm-uni__logo-box"><img class="hm-uni__logo" src="${esc(entry.logo)}" alt="" loading="lazy" data-letter="${letter}"></div>`;
        }
        return `<div class="hm-uni__logo-box"><span class="hm-uni__logo--mono" aria-hidden="true">${letter}</span></div>`;
    }

    function renderFeatured() {
        const box = $('hm-featured');
        if (!box) return;
        if (!ctx.isLoaded()) {
            box.innerHTML = '<div class="hm-grid hm-grid--uni">' + '<div class="hm-skel hm-skel--uni"></div>'.repeat(6) + '</div>';
            return;
        }
        const rows = rankFeatured(agg, activeTab);
        if (!rows.length) {
            const msg = ctx.hasFailed()
                ? 'Üniversite puanları şu an yüklenemedi.'
                : (activeTab === 'genel' ? 'Henüz puanlanmış üniversite yok.' : 'Bu kriter için henüz yorum yok.');
            box.innerHTML = emptyState(msg, ctx.hasFailed() ? '' : '#/review-form', 'İlk yorumu yaz');
            return;
        }
        box.innerHTML = '<div class="hm-grid hm-grid--uni" data-stagger="70">' + rows.map((r) => {
            const entry = universe.byKey.get(r.a.key) || { name: r.a.name, city: '', logo: '' };
            const overall = r.a.sum / r.a.n;
            const crit = activeTab === 'genel' ? '' :
                `<div class="hm-uni__crit">${CRIT_ICONS[activeTab] || ''} <span>${TAG_LABELS[activeTab]} ${fmt(r.avg)}</span> <small>· ${r.n} yorum</small></div>`;
            return `<a class="hm-uni" href="${uniHref(r.a.name)}">
                ${logoHtml(entry)}
                <div class="hm-uni__body">
                    <div class="hm-uni__name">${esc(r.a.name)}</div>
                    <div class="hm-uni__city">${ICON_MAP_PIN} <span>${esc(entry.city || 'Türkiye')}</span></div>
                    ${crit}
                </div>
                <div class="hm-uni__score">
                    <div class="hm-uni__avg">${fmt(overall)}</div>
                    ${starsHtml(overall)}
                    <div class="hm-uni__count">${r.a.n} yorum</div>
                </div>
            </a>`;
        }).join('') + '</div>';
    }

    function syncTabs() {
        root.querySelectorAll('.hm-tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === activeTab)));
    }

    const tabs = $('hm-tabs');
    if (tabs) {
        tabs.addEventListener('click', (e) => {
            const b = e.target.closest && e.target.closest('.hm-tab');
            if (!b || b.dataset.tab === activeTab) return;
            activeTab = b.dataset.tab;
            syncTabs();
            renderFeatured();
        });
    }
    // Logo yüklenemezse baş harfli kutuya dön
    const featuredBox = $('hm-featured');
    if (featuredBox) {
        featuredBox.addEventListener('error', (e) => {
            const img = e.target;
            if (!img || img.tagName !== 'IMG' || !img.classList.contains('hm-uni__logo')) return;
            const span = document.createElement('span');
            span.className = 'hm-uni__logo hm-uni__logo--mono';
            span.setAttribute('aria-hidden', 'true');
            span.textContent = img.dataset.letter || '?';
            img.replaceWith(span);
        }, true);
    }

    /* ----- 4. Şehirler ----- */
    function renderCities() {
        const box = $('hm-cities');
        if (!box) return;
        const cities = new Map();
        universe.byKey.forEach((e) => {
            if (!e.city) return;
            const c = cities.get(e.city) || { name: e.city, unis: 0, reviews: 0 };
            c.unis += 1;
            const a = agg.get(e.key);
            if (a) c.reviews += a.n;
            cities.set(e.city, c);
        });
        const list = [...cities.values()]
            .sort((a, b) => (b.reviews - a.reviews) || (b.unis - a.unis) || a.name.localeCompare(b.name, 'tr'))
            .slice(0, CITY_COUNT);
        if (!list.length) { box.innerHTML = ''; return; }
        const showReviews = ctx.isLoaded();
        box.innerHTML = '<div class="hm-grid hm-grid--city" data-stagger="60">' + list.map((c) => `
            <a class="hm-city" href="#/cities?q=${encodeURIComponent(c.name)}">
                <span class="hm-city__name">${esc(c.name)}</span>
                <span class="hm-city__meta">${c.unis} üniversite${showReviews ? ` · ${c.reviews} yorum` : ''}</span>
            </a>`).join('') + '</div>';
    }

    /* ----- 5. Karşılaştırma demosu ----- */
    function compareChoices() {
        const reviewed = [...agg.values()].sort((a, b) => (b.n - a.n) || a.name.localeCompare(b.name, 'tr'));
        const rest = [...universe.byKey.values()]
            .filter((e) => !agg.has(e.key))
            .sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        return { reviewed, rest };
    }

    function ensureCompareDefaults(reviewed) {
        if (userChoseCompare) return;
        if (reviewed.length >= 2) {
            compareSel = [reviewed[0].name, reviewed[1].name];
            return;
        }
        const fallback = FALLBACK_COMPARE.filter((n) => universe.byKey.has(baseKey(n)));
        const all = [...universe.byKey.values()].map((e) => e.name);
        compareSel = [fallback[0] || all[0] || null, fallback[1] || all[1] || null];
    }

    function initHmCombobox(idx) {
        const container = $('hm-custom-select-' + idx);
        if (!container) return;
        const trigger = container.querySelector('.custom-select__trigger');
        const triggerText = container.querySelector('.custom-select__text');
        const searchInput = container.querySelector('.custom-select__search');
        const optionsList = container.querySelector('.custom-select__options');
        if (!trigger || !optionsList) return;

        const { reviewed, rest } = compareChoices();
        const allNames = [...reviewed.map((a) => a.name), ...rest.map((e) => e.name)];

        function fillList(q = '') {
            const query = q.trim().toLocaleLowerCase('tr');
            const filtered = allNames.filter((n) => !query || n.toLocaleLowerCase('tr').includes(query));
            if (!filtered.length) {
                optionsList.innerHTML = '<li class="custom-select__no-results">Sonuç bulunamadı</li>';
                return;
            }
            optionsList.innerHTML = filtered.slice(0, 50).map((n) => {
                const a = agg.get(baseKey(n));
                const badge = a ? ` <small style="color:var(--color-text-dim)">(${a.n} yorum)</small>` : '';
                const isSelected = baseKey(n) === baseKey(compareSel[idx]);
                return `<li class="custom-select__option${isSelected ? ' selected' : ''}" data-val="${esc(n)}">${esc(n)}${badge}</li>`;
            }).join('');
        }

        if (compareSel[idx]) {
            triggerText.textContent = compareSel[idx];
            triggerText.style.color = 'var(--color-text)';
        }

        trigger.onclick = (e) => {
            e.stopPropagation();
            const isOpen = container.classList.contains('open');
            document.querySelectorAll('.custom-select.open').forEach((c) => c.classList.remove('open'));
            if (!isOpen) {
                container.classList.add('open');
                fillList(searchInput ? searchInput.value : '');
                if (searchInput) {
                    searchInput.value = '';
                    setTimeout(() => searchInput.focus(), 20);
                }
            }
        };

        if (searchInput) {
            searchInput.oninput = (e) => fillList(e.target.value);
            searchInput.onclick = (e) => e.stopPropagation();
        }

        optionsList.onclick = (e) => {
            const li = e.target.closest && e.target.closest('.custom-select__option');
            if (!li) return;
            const val = li.dataset.val;
            if (val) {
                userChoseCompare = true;
                compareSel[idx] = val;
                triggerText.textContent = val;
                container.classList.remove('open');
                renderCompareBars();
            }
        };
    }

    function renderCompareSelects() {
        const { reviewed, rest } = compareChoices();
        ensureCompareDefaults(reviewed);
        [0, 1].forEach((i) => {
            initHmCombobox(i);
            const sel = $('hm-cmp-sel-' + i);
            if (sel) {
                const opt = (name, label) => `<option value="${esc(name)}"${baseKey(name) === baseKey(compareSel[i]) ? ' selected' : ''}>${esc(label)}</option>`;
                sel.innerHTML =
                    (reviewed.length ? `<optgroup label="Yorumu olanlar">${reviewed.map((a) => opt(a.name, `${a.name} (${a.n} yorum)`)).join('')}</optgroup>` : '') +
                    `<optgroup label="Tüm üniversiteler">${rest.map((e) => opt(e.name, e.name)).join('')}</optgroup>`;
            }
        });
    }

    function renderCompareBars() {
        [0, 1].forEach((i) => {
            const box = $('hm-cmp-rows-' + i);
            if (!box) return;
            const other = agg.get(baseKey(compareSel[1 - i]));
            const mine = agg.get(baseKey(compareSel[i]));
            box.innerHTML = COMPARE_ROWS.map((row) => {
                const s = statFor(mine, row.id);
                const o = statFor(other, row.id);
                const lead = s && (!o || s.avg > o.avg || (s.avg === o.avg && s.n >= (o.n || 0)));
                const icon = CRIT_ICONS[row.id] || '';
                if (!s) {
                    return `<div class="hm-row hm-row--empty">
                        <div class="hm-row__top">
                            <span class="hm-row__label">${icon} <span>${row.label}</span></span>
                            <span class="hm-insufficient">Yetersiz veri</span>
                        </div>
                    </div>`;
                }
                const pct = Math.min(100, Math.max(10, Math.round((s.avg / 5) * 100)));
                return `<div class="hm-row${lead ? ' is-lead' : ''}">
                    <div class="hm-row__top">
                        <span class="hm-row__label">${icon} <span>${row.label}</span></span>
                        <span class="hm-row__val">${fmt(s.avg)} <small>(${s.n})</small></span>
                    </div>
                    <div class="hm-bar" role="progressbar" aria-valuenow="${s.avg.toFixed(1)}" aria-valuemin="1" aria-valuemax="5">
                        <span style="width:${pct}%"></span>
                    </div>
                </div>`;
            }).join('');
        });
        const note = $('hm-cmp-note');
        if (note) {
            const none = !agg.has(baseKey(compareSel[0])) && !agg.has(baseKey(compareSel[1]));
            note.textContent = ctx.isLoaded() && none ? 'Seçilen okullar için henüz yorum yok; puanlar yorumlarla birlikte dolar.' : '';
        }
    }

    ['hm-cmp-sel-0', 'hm-cmp-sel-1'].forEach((id, i) => {
        const sel = $(id);
        if (!sel) return;
        sel.addEventListener('change', () => {
            userChoseCompare = true;
            compareSel[i] = sel.value;
            renderCompareBars();
        });
    });

    /* ----- Hepsini çiz ----- */
    function render() {
        if (!$('hm-root')) return;
        agg = aggregate(ctx.isLoaded() ? ctx.getReviews() : [], universe);
        renderMapDots();
        renderFacts();
        renderReviewStrip();
        syncTabs();
        renderFeatured();
        renderCities();
        renderCompareSelects();
        renderCompareBars();
    }

    render();

    // Üniversite listesini (logo, şehir, koordinat) API'den getir; gelince yeniden çiz
    loadUniverseFromApi(ctx.api).then((list) => {
        if (!$('hm-root') || !list.length) return;
        universe = buildUniverse(list);
        render();
    });

    return render;
}

