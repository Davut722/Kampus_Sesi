/* ========================================
   Kampüs Sesi — Shared JavaScript (SPA Architecture + FastAPI Backend)
   ======================================== */

import { api } from './api.js';
import { TEMPLATES } from './templates.js';

function getInitials(name) {
    if (!name) return 'MS';
    const words = name.trim().split(' ');
    let initials = words[0][0].toUpperCase();
    if (words.length > 1) initials += words[words.length - 1][0].toUpperCase();
    return initials;
}

// ─── SPA Router State ─────────────────────
let currentRoute = 'home';
let currentParams = new URLSearchParams();
let selectedUniState = 'Boğaziçi Üniversitesi';

const activeRenderers = {
    university: null,
    profile: null,
    compare: null
};

export function parseHash() {
    const hash = window.location.hash || '#/home';
    const cleanHash = hash.replace(/^#\/?/, '') || 'home';
    const [path, queryString] = cleanHash.split('?');
    const params = new URLSearchParams(queryString || '');
    let route = path.toLowerCase();
    if (!route || route === '/' || route === 'index.html' || route === 'home') route = 'home';
    return { route, params };
}

export function navigateTo(targetRoute, paramsObj = null) {
    let hash = `#/${targetRoute}`;
    if (paramsObj) {
        const query = new URLSearchParams(paramsObj).toString();
        if (query) hash += `?${query}`;
    }
    if (window.location.hash !== hash) {
        window.location.hash = hash;
    } else {
        renderCurrentRoute();
    }
}

function checkProtected() {
    const { route, params } = parseHash();
    const protectedRoutes = ['review-form', 'degerlendir'];
    if (route === 'profile' && !params.get('user')) {
        protectedRoutes.push('profile');
    }
    if (protectedRoutes.includes(route)) {
        if (CURRENT_USER && CURRENT_USER.uid !== 'guest') return;
        showToast('⚠️ Bu sayfayı görüntülemek için lütfen giriş yapın.');
        navigateTo('login');
    }
}

// ─── User State & Auth Handlers ───────────
let CURRENT_USER = { uid: 'guest', name: 'Misafir', initials: 'MS', email: '' };

window.signUpBackend = async function(name, email, pass) {
    const user = await api.register(name, email, pass);
    CURRENT_USER = {
        uid: user.id,
        name: user.name,
        initials: user.initials || getInitials(user.name),
        email: user.email
    };
    updateNavForUser(CURRENT_USER);
    showToast(`🎉 Hoş geldin, ${user.name}!`);
    navigateTo('home');
    return user;
};

window.signInBackend = async function(email, pass) {
    const user = await api.login(email, pass);
    CURRENT_USER = {
        uid: user.id,
        name: user.name,
        initials: user.initials || getInitials(user.name),
        email: user.email
    };
    updateNavForUser(CURRENT_USER);
    showToast(`👋 Tekrar hoş geldin, ${user.name}!`);
    navigateTo('home');
    return user;
};

window.signOutBackend = async function() {
    api.logout();
    CURRENT_USER = { uid: 'guest', name: 'Misafir', initials: 'MS', email: '' };
    updateNavForUser(null);
    showToast('👋 Başarıyla çıkış yapıldı.');
    navigateTo('home');
};

function updateNavForUser(user) {
    const navActions = document.getElementById('nav-actions');
    if (!navActions) return;

    let actionsHtml = '';

    if (user && user.uid !== 'guest') {
        actionsHtml = `
            <a href="#/profile" class="btn btn--outline btn--sm"><i data-lucide="user" class="icon-xs"></i> <span>Profilim</span></a>
            <a href="#/home" id="logout-btn" class="btn btn--outline btn--sm" style="border-color: rgba(248, 113, 113, 0.3); color: var(--color-danger);"><i data-lucide="log-out" class="icon-xs"></i> <span>Çıkış</span></a>
        `;
    } else {
        actionsHtml = `
            <a href="#/login" class="btn btn--primary btn--sm"><i data-lucide="log-in" class="icon-xs"></i> <span>Giriş Yap</span></a>
        `;
    }

    navActions.innerHTML = actionsHtml;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Logout logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await window.signOutBackend();
        });
    }
}

// ─── Global State & API Sync ──────────────
let globalReviewsState = [];
let globalInteractionsState = {};

export async function refreshAppData() {
    try {
        const [reviews, interactions] = await Promise.all([
            api.getReviews(),
            api.getInteractions()
        ]);
        globalReviewsState = reviews || [];
        globalInteractionsState = interactions || {};

        if (currentRoute === 'university' && activeRenderers.university) activeRenderers.university();
        if (currentRoute === 'profile' && activeRenderers.profile) activeRenderers.profile();
        if (currentRoute === 'compare' && activeRenderers.compare) activeRenderers.compare();
    } catch (e) {
        console.warn("Veri yüklenirken hata oluştu:", e);
    }
}

function getSavedReviews() {
    return globalReviewsState;
}

window.saveReview = async function(review) {
    const created = await api.createReview(review);
    globalReviewsState.unshift(created);
    if (currentRoute === 'university' && activeRenderers.university) activeRenderers.university();
    if (currentRoute === 'compare' && activeRenderers.compare) activeRenderers.compare();
    return created;
};

window.removeSavedReview = async function(id) {
    await api.deleteReview(id);
    globalReviewsState = globalReviewsState.filter(r => String(r.id) !== String(id));
};

function getInteractions() {
    return globalInteractionsState;
}

function getReviewScore(id) {
    const ints = getInteractions()[id] || { likes: [], dislikes: [] };
    return ints.likes.length - ints.dislikes.length;
}

window.toggleLike = async function (id) {
    if (CURRENT_USER.uid === 'guest') {
        showToast('⚠️ Beğenmek için lütfen giriş yapın.');
        navigateTo('login');
        return;
    }
    try {
        const res = await api.toggleLike(id);
        globalInteractionsState[String(id)] = res;
        updateInteractionUI(id, res);
    } catch(e) {
        console.error(e);
        showToast('❌ İşlem başarısız.');
    }
};

window.toggleDislike = async function (id) {
    if (CURRENT_USER.uid === 'guest') {
        showToast('⚠️ Oy vermek için lütfen giriş yapın.');
        navigateTo('login');
        return;
    }
    try {
        const res = await api.toggleDislike(id);
        globalInteractionsState[String(id)] = res;
        updateInteractionUI(id, res);
    } catch(e) {
        console.error(e);
        showToast('❌ İşlem başarısız.');
    }
};

function updateInteractionUI(id, data) {
    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (!card) return;

    const userIdentifier = CURRENT_USER.name;
    const isLiked = data.likes.includes(userIdentifier);
    const isDisliked = data.dislikes.includes(userIdentifier);

    const likeBtn = card.querySelector('.btn-interaction-like');
    const dislikeBtn = card.querySelector('.btn-interaction-dislike');

    if (likeBtn) {
        likeBtn.className = `btn-interaction btn-interaction-like ${isLiked ? 'btn-interaction--active-like' : ''}`;
        likeBtn.innerHTML = `<i data-lucide="thumbs-up" class="icon-xs"></i> <span>${data.likes.length}</span>`;
    }
    if (dislikeBtn) {
        dislikeBtn.className = `btn-interaction btn-interaction-dislike ${isDisliked ? 'btn-interaction--active-dislike' : ''}`;
        dislikeBtn.innerHTML = `<i data-lucide="thumbs-down" class="icon-xs"></i> <span>${data.dislikes.length}</span>`;
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

document.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.btn-interaction-like');
    if (likeBtn) {
        const id = likeBtn.dataset.id;
        window.toggleLike(id);
    }

    const dislikeBtn = e.target.closest('.btn-interaction-dislike');
    if (dislikeBtn) {
        const id = dislikeBtn.dataset.id;
        window.toggleDislike(id);
    }
});

// ─── Utility Functions ───────────────────
const AVAILABLE_TAGS = [
    { id: 'kampus', label: 'Kampüs', icon: 'building-2' },
    { id: 'yemekhane', label: 'Yemekhane', icon: 'utensils' },
    { id: 'egitim', label: 'Eğitim', icon: 'graduation-cap' },
    { id: 'kutuphane', label: 'Kütüphane', icon: 'book-open' },
    { id: 'sosyal', label: 'Sosyal Hayat', icon: 'sparkles' },
    { id: 'ulasim', label: 'Ulaşım', icon: 'bus' },
    { id: 'yurt', label: 'Yurt Olanakları', icon: 'home' },
];

function getTagLabel(tagId) {
    const tag = AVAILABLE_TAGS.find(t => t.id === tagId);
    return tag ? tag.label : tagId;
}

function renderStars(rating, interactive = false) {
    let html = `<div class="stars${interactive ? ' stars--interactive' : ''}">`;
    for (let i = 1; i <= 5; i++) {
        html += `<span class="stars__item${i <= rating ? ' stars__item--filled' : ''}" data-value="${i}"><i data-lucide="star"></i></span>`;
    }
    html += '</div>';
    return html;
}

function renderTags(tagIds) {
    if (!tagIds) return '';
    return tagIds.map(id => {
        const tag = AVAILABLE_TAGS.find(t => t.id === id);
        const iconHtml = tag ? `<i data-lucide="${tag.icon}" class="icon-xs"></i> ` : '';
        const label = tag ? tag.label : id;
        return `<span class="tag">${iconHtml}<span>${label}</span></span>`;
    }).join('');
}

window.submitReply = async function (e, reviewId) {
    e.preventDefault();
    if (CURRENT_USER.uid === 'guest') {
        showToast('⚠️ Yanıt yazmak için lütfen giriş yapın.');
        navigateTo('login');
        return;
    }
    const form = e.target;
    const input = form.querySelector('input');
    const text = input.value.trim();
    if (!text) return;

    try {
        const newReply = await api.addReply(reviewId, text);
        const review = globalReviewsState.find(r => String(r.id) === String(reviewId));
        if (review) {
            if (!review.replies) review.replies = [];
            review.replies.push(newReply);
        }
        showToast('✅ Yanıt eklendi!');
        form.reset();

        if (currentRoute === 'university' && activeRenderers.university) activeRenderers.university();
        if (currentRoute === 'profile' && activeRenderers.profile) activeRenderers.profile();
    } catch(err) {
        console.error(err);
        showToast('❌ Yanıt eklenemedi!');
    }
};

/** Render a single review card */
function renderReviewCard(review, options = {}) {
    const { showUni = false, showDelete = false } = options;
    const ints = getInteractions()[review.id] || { likes: [], dislikes: [] };
    const userIdentifier = CURRENT_USER.name;
    const isLiked = ints.likes.includes(userIdentifier);
    const isDisliked = ints.dislikes.includes(userIdentifier);

    // Process replies
    const replies = review.replies || [];
    let repliesHtml = '';
    if (replies.length > 0) {
        repliesHtml = `
            <div class="card__replies">
                ${replies.map(r => `
                    <div class="reply-item">
                        <div class="reply-item__header">
                            <span class="reply-item__user">${r.user}</span>
                            <span class="reply-item__date">${r.date}</span>
                        </div>
                        <div class="reply-item__text">${r.text}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    const replyFormHtml = CURRENT_USER.uid !== 'guest' ? `
        <form class="reply-form" data-review-id="${review.id}" onsubmit="window.submitReply(event, ${review.id})">
            <input type="text" class="form__input form__input--sm" placeholder="Yanıt yaz..." required>
            <button type="submit" class="btn btn--primary btn--sm">Gönder</button>
        </form>
    ` : `<div style="font-size:0.8rem; color: var(--color-text-muted); padding-top: 5px;">Yanıt yazmak için <a href="#/login">giriş yapın</a>.</div>`;

    return `
    <article class="card" data-id="${review.id}" data-tags="${review.tags.join(',')}">
      <div class="card__header">
        <a href="#/profile?user=${encodeURIComponent(review.user)}" class="card__user card__user--clickable">
          <div class="card__avatar">${review.initials}</div>
          <div>
            <div class="card__username">${review.user}</div>
            <div class="card__date">${review.date}</div>
          </div>
        </a>
        ${renderStars(review.rating)}
      </div>
      ${showUni ? `<div class="card__uni-name"><i data-lucide="map-pin" class="icon-xs"></i> ${review.university}</div>` : ''}
      <div class="card__body">${review.text}</div>
      <div class="card__footer">
        <div class="card__tags">${renderTags(review.tags)}</div>
        <div class="card__actions">
            <div class="card__interactions">
                <button class="btn-interaction btn-interaction-like ${isLiked ? 'btn-interaction--active-like' : ''}" data-id="${review.id}">
                    <i data-lucide="thumbs-up" class="icon-xs"></i> <span>${ints.likes.length}</span>
                </button>
                <button class="btn-interaction btn-interaction-dislike ${isDisliked ? 'btn-interaction--active-dislike' : ''}" data-id="${review.id}">
                    <i data-lucide="thumbs-down" class="icon-xs"></i> <span>${ints.dislikes.length}</span>
                </button>
            </div>
            ${showDelete ? `<button class="btn btn--danger btn--sm" onclick="deleteReview('${review.id}')"><i data-lucide="trash-2" class="icon-xs"></i> Sil</button>` : ''}
        </div>
      </div>
      <div class="card__thread">
        ${repliesHtml}
        ${replyFormHtml}
      </div>
    </article>
  `;
}

/** Show toast notification with modern monochrome icon */
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    // Clean any legacy emoji from message
    const cleanMsg = message.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

    let icon = 'info';
    let iconColor = 'color: var(--color-accent);';
    if (message.includes('✅') || message.toLowerCase().includes('başarı') || message.toLowerCase().includes('eklendi')) {
        icon = 'check-circle';
        iconColor = 'color: var(--color-success);';
    } else if (message.includes('❌') || message.toLowerCase().includes('hata') || message.toLowerCase().includes('başarısız')) {
        icon = 'alert-circle';
        iconColor = 'color: var(--color-danger);';
    } else if (message.includes('⚠️') || message.toLowerCase().includes('lütfen') || message.toLowerCase().includes('giriş')) {
        icon = 'alert-triangle';
        iconColor = 'color: var(--color-star);';
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="${icon}" class="icon-sm" style="${iconColor}"></i> <span>${cleanMsg}</span>`;
    document.body.appendChild(toast);

    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => toast.remove(), 3200);
}


// ─── Navigation ───────────────────────────

function setupNavEvents() {
    const hamburger = document.querySelector('.nav__hamburger');
    const sideDrawer = document.getElementById('side-drawer');
    const sideDrawerOverlay = document.getElementById('side-drawer-overlay');
    const sideDrawerClose = document.getElementById('side-drawer-close');

    function toggleDrawer() {
        if (sideDrawer && sideDrawerOverlay) {
            sideDrawer.classList.toggle('active');
            sideDrawerOverlay.classList.toggle('active');
        }
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleDrawer);
    }
    
    if (sideDrawerClose) {
        sideDrawerClose.addEventListener('click', toggleDrawer);
    }
    
    if (sideDrawerOverlay) {
        sideDrawerOverlay.addEventListener('click', toggleDrawer);
    }
    
    // Close drawer when a link is clicked
    if (sideDrawer) {
        const links = sideDrawer.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                sideDrawer.classList.remove('active');
                if (sideDrawerOverlay) sideDrawerOverlay.classList.remove('active');
            });
        });
    }

    // Setup Theme Switcher inside 3-dots drawer menu
    setupThemeToggle();
}

function setupThemeToggle() {
    const drawerThemeBtn = document.getElementById('drawer-theme-btn');
    const drawerThemeText = document.getElementById('drawer-theme-text');
    const drawerThemePill = document.getElementById('drawer-theme-pill');

    function syncThemeUI(theme) {
        const isLight = theme === 'light';
        if (isLight) {
            document.documentElement.setAttribute('data-theme', 'light');
            if (drawerThemeText) drawerThemeText.textContent = 'Koyu Tema';
            if (drawerThemePill) drawerThemePill.textContent = 'Açık';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (drawerThemeText) drawerThemeText.textContent = 'Açık Tema';
            if (drawerThemePill) drawerThemePill.textContent = 'Koyu';
        }
        const iconWrap = document.getElementById('drawer-theme-icon-wrap');
        if (iconWrap) {
            iconWrap.innerHTML = `<i data-lucide="${isLight ? 'moon' : 'sun'}" class="icon-sm"></i>`;
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    const savedTheme = localStorage.getItem('kampus_sesi_theme') || 'dark';
    syncThemeUI(savedTheme);

    if (drawerThemeBtn) {
        drawerThemeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('kampus_sesi_theme', nextTheme);
            syncThemeUI(nextTheme);
        });
    }
}


// ─── University Meta ──────────────────────

const UNI_DETAILS = {
    'Orta Doğu Teknik Üniversitesi (ODTÜ)': {
        subtitle: 'Ankara, Türkiye · 1956\'dan beri eğitim',
        rank: 'Top 3',
        image: 'img/orta-dogu-teknik-universitesi.jpg',
        aboutShort: 'ODTÜ, Türkiye ve Orta Doğu ülkelerinin kalkınmalarına katkıda bulunmak amacı ile kurulan ve araştırma odaklı vizyonuyla öne çıkan devlet üniversitesidir.',
        aboutLong: 'Geniş ormanlık alanı ve Eymir Gölü\'nü barındıran Ankara yerleşkesi, öğrencilere benzersiz bir kampüs hayatı sunar. Güçlü mühendislik ve sosyal bilimler eğitimi, zengin kulüp kültürü ve uluslararası rekabetçi mezun ağıyla Türkiye\'nin en prestijli eğitim kurumlarındandır.',
        transport: [
            { from: 'İstanbul', type: 'YHT', icon: 'train', route: 'İstanbul - Ankara', duration: '~4 Saat 20 Dk' },
            { from: 'İzmir', type: 'Otobüs', icon: 'bus', route: 'İzmir - Ankara', duration: '~8 Saat' },
            { from: 'Eskişehir', type: 'YHT', icon: 'train', route: 'Eskişehir - Ankara', duration: '~1.5 Saat' }
        ]
    },
    'İstanbul Teknik Üniversitesi': {
        subtitle: 'İstanbul, Türkiye · 1773\'ten beri eğitim',
        rank: 'Top 5',
        image: 'img/i̇stanbul-teknik-universitesi.jpg',
        aboutShort: 'İTÜ, dünyanın en eski ve köklü teknik üniversitelerinden biri olarak mimarlık ve mühendislik alanlarında öncü konumdadır.',
        aboutLong: 'Maslak, Taşkışla, Maçka ve Gümüşsuyu gibi merkezi yerleşkelere yayılan İTÜ, öğrencilere İstanbul\'un kalbinde tarihi atmosferle harmanlanmış bir eğitim sunar. Güçlü sanayi işbirlikleri ve teknokentiyle inovasyon merkezidir.',
        transport: [
            { from: 'Ankara', type: 'YHT', icon: 'train', route: 'Ankara - İstanbul', duration: '~4 Saat 20 Dk' },
            { from: 'Bursa', type: 'Feribot', icon: 'ferry', route: 'Mudanya - Yenikapı', duration: '~1 Saat 45 Dk' },
            { from: 'Kocaeli', type: 'Tren', icon: 'train', route: 'İzmit - Söğütlüçeşme', duration: '~1 Saat 15 Dk' }
        ]
    },
    'Hacettepe Üniversitesi': {
        subtitle: 'Ankara, Türkiye · 1967\'den beri eğitim',
        rank: 'Top 5',
        image: 'img/hacettepe-universitesi.jpg',
        aboutShort: 'Hacettepe Üniversitesi, özellikle tıp ve sağlık bilimleri, mühendislik ve güzel sanatlar alanlarındaki başarılarıyla tanınan önde gelen araştırma üniversitesidir.',
        aboutLong: 'Sıhhiye ve Beytepe kampüsleriyle geniş bir öğrenci kitlesine hitap eder. Beytepe kampüsü doğayla iç içe yapısı ve geniş sosyal olanaklarıyla bilinirken tıp kampüsü şehrin merkezindedir.',
        transport: [
            { from: 'İstanbul', type: 'YHT', icon: 'train', route: 'YHT Gar - Kampüs Servisi', duration: '~4 Saat 20 Dk' },
            { from: 'Kırıkkale', type: 'Otobüs', icon: 'bus', route: 'AŞTİ - Kampüs Metro', duration: '~1 Şaat' }
        ]
    },
    'Boğaziçi Üniversitesi': {
        subtitle: 'İstanbul, Türkiye · 1863\'ten beri eğitim',
        rank: 'Top 3',
        image: 'img/bogazici-universitesi.jpg',
        aboutShort: 'Boğaziçi Üniversitesi, İstanbul Boğazı\'na hakim manzarası ve üstün eğitim kalitesiyle Türkiye\'nin en çok tercih edilen üniversitelerinden biridir.',
        aboutLong: 'Güney Kampüs\'ün tarihi binaları ve eşsiz manzarası öğrencilere muazzam bir ilham kaynağı olur. Özgürlükçü kampüs kültürü, İngilizce eğitim veren yetkin akademik kadrosu ve çok uluslu yapısıyla dikkat çeker.',
        transport: [
            { from: 'Ankara', type: 'YHT + Metro', icon: 'train', route: 'Söğütlüçeşme - Hisarüstü', duration: '~5 Saat' },
            { from: 'İzmir', type: 'Uçak + Metro', icon: 'plane', route: 'Sabiha Gökçen - Kampüs', duration: '~2.5 Saat' }
        ]
    },
    'Bandırma Onyedi Eylül Üniversitesi': {
        subtitle: 'Balıkesir, Türkiye · 2015\'ten beri eğitim',
        rank: 'Top 70',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2070',
        aboutShort: 'Bandırma Onyedi Eylül Üniversitesi (BANÜ), genişleyen kampüs alanları ve dinamik akademik kadrosuyla gelecek vaat eden bir devlet üniversitesidir.',
        aboutLong: 'Denizcilik, iktisat ve sağlık bilimleri gibi alanlarda öne çıkan BANÜ, Marmara Denizi kıyısında konumlanmasının avantajıyla öğrencilerine sakin ama aktif bir üniversite şehri deneyimi sunar.',
        transport: [
            { from: 'İstanbul', type: 'Feribot', icon: 'ferry', route: 'Yenikapı - Bandırma', duration: '~2.5 Saat' },
            { from: 'Bursa', type: 'Otobüs', icon: 'bus', route: 'Terminal - Bandırma', duration: '~1.5 Saat' },
            { from: 'İzmir', type: 'Tren', icon: 'train', route: 'Basmane - Bandırma (Mavi Tren)', duration: '~5.5 Saat' }
        ]
    },
    'Ankara Üniversitesi': {
        subtitle: 'Ankara, Türkiye · 1946\'dan beri eğitim',
        rank: 'Top 10',
        image: 'img/placeholder.jpg',
        aboutShort: 'Ankara Üniversitesi, Türkiye Cumhuriyeti\'nin ilk üniversitesi olma özelliği taşıyan köklü bir eğitim kurumudur.',
        aboutLong: 'Tandoğan, Cebeci ve Dışkapı gibi şehrin çeşitli merkezlerine yayılmış kampüsleriyle öğrencilere tam bir şehir üniversitesi deneyimi sunar. Hukuk, Siyasal Bilgiler ve Tıp alanlarında Türkiye\'nin en prestijli fakültelerinden bazılarına ev sahipliği yapar.',
        transport: [
            { from: 'İstanbul', type: 'YHT', icon: 'train', route: 'İstanbul - Ankara (YHT Garı)', duration: '~4.5 Saat' },
            { from: 'Konya', type: 'YHT', icon: 'train', route: 'Konya - Ankara', duration: '~1 Saat 50 Dk' },
            { from: 'Eskişehir', type: 'YHT', icon: 'train', route: 'Eskişehir - Ankara', duration: '~1.5 Saat' }
        ]
    },
    'Ege Üniversitesi': {
        subtitle: 'İzmir, Türkiye · 1955\'ten beri eğitim',
        rank: 'Top 10',
        image: 'img/ege-universitesi.jpg',
        aboutShort: 'Ege Üniversitesi, İzmir\'in Bornova ilçesinde yer alan, Türkiye\'nin en eski ve köklü üniversitelerinden biridir.',
        aboutLong: 'Geniş ve yaşaması keyifli Bornova yerleşkesi, öğrencilere hem kaliteli bir eğitim hem de renkli bir sosyal hayat sunar. Tıp, botanik ve ziraat alanlarında güçlü bir altyapıya sahiptir. Kampüs içerisinden geçen metro hattı sayesinde ulaşım son derece rahattır.',
        transport: [
            { from: 'Manisa', type: 'Otobüs', icon: 'bus', route: 'Manisa - İzmir (Bornova)', duration: '~45 Dk' },
            { from: 'Aydın', type: 'Tren', icon: 'train', route: 'Aydın - İzmir (Basmane) + Metro', duration: '~2.5 Saat' },
            { from: 'İstanbul', type: 'Uçak', icon: 'plane', route: 'Sabiha Gökçen - Adnan Menderes', duration: '~1 Saat' }
        ]
    },
    'Dokuz Eylül Üniversitesi': {
        subtitle: 'İzmir, Türkiye · 1982\'den beri eğitim',
        rank: 'Top 15',
        image: 'img/placeholder.jpg',
        aboutShort: 'Dokuz Eylül Üniversitesi, İzmir\'in çeşitli bölgelerine yayılmış kampüsleriyle çok yönlü ve köklü bir eğitim sunan bir devlet üniversitesidir.',
        aboutLong: 'Buca\'daki merkez yerleşkesinin yanı sıra Tınaztepe, İnciraltı ve Balçova gibi İzmir\'in dört bir yanına dağılmış fakülteleriyle bilinir. Güzel sanatlar, denizcilik ve tıp alanlarında Türkiye\'nin önde gelen akademik çalışmalarına imza atar.',
        transport: [
            { from: 'Balıkesir', type: 'Tren', icon: 'train', route: 'Balıkesir - İzmir (Basmane)', duration: '~3.5 Saat' },
            { from: 'Muğla', type: 'Otobüs', icon: 'bus', route: 'Muğla - İzmir Otogar', duration: '~3 Saat' },
            { from: 'Denizli', type: 'Tren', icon: 'train', route: 'Denizli - İzmir (Basmane)', duration: '~4 Saat' }
        ]
    },
    'Yıldız Teknik Üniversitesi (YTÜ)': {
        subtitle: 'İstanbul, Türkiye · 1911\'den beri eğitim',
        rank: 'Top 10',
        image: 'img/yildiz-teknik-universitesi.jpg',
        aboutShort: 'Yıldız Teknik Üniversitesi, İstanbul\'un en gözde mühendislik ve mimarlık eğitim kurumlarından biri olan tarihi bir araştırma üniversitesidir.',
        aboutLong: 'Tarihi Yıldız Kampüsü ve modern Davutpaşa Kampüsü olmak üzere iki ana yerleşkede eğitim verir. Öğrenciler tarihi miras ile modern teknolojiyi harmanlayan bir kampüs hayatı deneyimler, Teknopark imkanları ile güçlü bir staj ağına ulaşırlar.',
        transport: [
            { from: 'Kocaeli', type: 'Otobüs', icon: 'bus', route: 'İzmit - İstanbul (Esenler)', duration: '~2 Saat' },
            { from: 'Bursa', type: 'Feribot + Metro', icon: 'ferry', route: 'Mudanya - Eminönü - Davutpaşa', duration: '~2.5 Saat' },
            { from: 'Tekirdağ', type: 'Otobüs', icon: 'bus', route: 'Tekirdağ - İstanbul Otogar', duration: '~2.5 Saat' }
        ]
    },
    'Marmara Üniversitesi': {
        subtitle: 'İstanbul, Türkiye · 1883\'ten beri eğitim',
        rank: 'Top 15',
        image: 'img/placeholder.jpg',
        aboutShort: 'Marmara Üniversitesi, Türkiye\'nin en çok fakülteye sahip ve en geniş öğrenci tabanlı köklü devlet üniversitelerinden biridir.',
        aboutLong: 'İstanbul\'un Asya ve Avrupa yakalarına dağılmış kampüsleriyle ünlüdür; Göztepe Kampüsü ana merkez olmak üzere Recep Tayyip Erdoğan Külliyesi (Maltepe) gibi yeni yerleşkelere genişlemektedir. İktisat, İlahiyat, İletişim ve Tıp fakülteleri oldukça aktiftir.',
        transport: [
            { from: 'Ankara', type: 'YHT + Marmaray', icon: 'train', route: 'Ankara - Söğütlüçeşme', duration: '~4.5 Saat' },
            { from: 'Sakarya', type: 'Tren', icon: 'train', route: 'Adapazarı - Pendik - Göztepe', duration: '~2 Saat' },
            { from: 'Yalova', type: 'Feribot', icon: 'ferry', route: 'Yalova - Pendik + Metro', duration: '~1.5 Saat' }
        ]
    },
    'Bilkent Üniversitesi': {
        subtitle: 'Ankara, Türkiye · 1984\'ten beri eğitim',
        rank: 'Top 5',
        image: 'https://images.unsplash.com/photo-1549488344-c7823f99335a?auto=format&fit=crop&q=80&w=2070',
        aboutShort: 'Türkiye\'nin ilk vakıf üniversitesi olan İhsan Doğramacı Bilkent Üniversitesi, üst düzey eğitim standartları ve devasa kütüphanesi ile tanınır.',
        aboutLong: 'Dünya üniversite sıralamalarında Türkiye\'yi başarıyla temsil eden Bilkent, Bilkent Cyberpark ile öğrencilerine uluslararası kariyere giden yolda büyük destek sağlar. Kampüsteki sanatsal ve kültürel etkinlikler, Bilkent Senfoni Orkestrası ile taçlanmaktadır.',
        transport: [
            { from: 'Eskişehir', type: 'YHT', icon: 'train', route: 'Eskişehir - Ankara + Servis', duration: '~1.5 Saat' },
            { from: 'İstanbul', type: 'Uçak', icon: 'plane', route: 'İstanbul (IST) - Ankara (ESB)', duration: '~1 Saat' }
        ]
    },
    'Koç Üniversitesi': {
        subtitle: 'İstanbul, Türkiye · 1993\'ten beri eğitim',
        rank: 'Top 3',
        image: 'https://images.unsplash.com/photo-1579970420790-2aa4057e0e78?auto=format&fit=crop&q=80&w=2070',
        aboutShort: 'Koç Üniversitesi, İstanbul\'un kuzeyinde Sarıyer\'de geniş bir orman arazisinde eğitim veren, araştırma ve inovasyon odaklı prestijli bir vakıf üniversitesidir.',
        aboutLong: 'Türkiye\'nin en parlak öğrencilerini bir araya getiren kurum, liberal art eğitim modeli, düşük öğrenci/öğretim üyesi oranı ve benzersiz burs imkanlarıyla donatılmıştır. Çapraz disiplin araştırmalarına ve global işbirliklerine çok önem verilir.',
        transport: [
            { from: 'İzmir', type: 'Uçak + Metro', icon: 'plane', route: 'İzmir (ADB) - İst (IST) - Sarıyer', duration: '~3 Saat' },
            { from: 'Kocaeli', type: 'Otobüs + Metro', icon: 'bus', route: 'İzmit - Hacıosman + Kampüs Servisi', duration: '~2.5 Saat' }
        ]
    }
};

const GENERIC_UNI_DATA = {
    subtitle: 'Türkiye',
    rank: '—',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2070',
    aboutShort: 'Alanında önde gelen ve yenilikçi eğitim vizyonuyla dikkat çeken saygın bir yükseköğretim kurumudur.',
    aboutLong: 'Modern yerleşkeleri, gelişmiş laboratuvarları ve geniş kütüphanesiyle öğrencilere zengin bir araştırma ve sosyal yaşam ortamı sunar. Sektör odaklı staj olanakları, uluslararası öğrenci değişim programları ve aktif öğrenci kulüpleri ile akademik başarının yanında sosyal becerilerin gelişimini de destekler.',
    transport: [
        { from: 'Merkez', type: 'Belediye Otobüsü', icon: 'bus', route: 'Merkez Otogar - Kampüs', duration: '~30 Dk' }
    ]
};

// Extra mock reviews integrated above


// ─── Global Reviews Helper ────────────────
/** Get all unique reviews globally across the app */
function getAllReviewsGlobal() {
    return getSavedReviews();
}

// ─── Custom Select Helper ────────────────

function initCustomSelect(containerId, optionsList, onSelectCallback, initialValue = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const trigger = container.querySelector('.custom-select__trigger');
    const triggerText = container.querySelector('.custom-select__text');
    const searchInput = container.querySelector('.custom-select__search');
    const optionsContainer = container.querySelector('.custom-select__options');

    let selectedValue = initialValue;

    if (initialValue) {
        triggerText.textContent = initialValue;
        triggerText.style.color = 'var(--color-text)';
    }

    function renderOptions(query = '') {
        const lowerQuery = query.toLowerCase();
        const filtered = optionsList.filter(o => o.toLowerCase().includes(lowerQuery));

        if (filtered.length === 0) {
            optionsContainer.innerHTML = '<li class="custom-select__no-results">Sonuç bulunamadı</li>';
            return;
        }

        optionsContainer.innerHTML = filtered.map(opt => `
            <li class="custom-select__option ${opt === selectedValue ? 'selected' : ''}" data-value="${opt}">
                ${opt}
            </li>
        `).join('');

        // Attach clicks
        optionsContainer.querySelectorAll('.custom-select__option').forEach(li => {
            li.addEventListener('click', (e) => {
                selectedValue = li.dataset.value;
                triggerText.textContent = selectedValue;
                triggerText.style.color = 'var(--color-text)';
                container.classList.remove('open');
                if (onSelectCallback) onSelectCallback(selectedValue);
            });
        });
    }

    trigger.addEventListener('click', () => {
        const isOpen = container.classList.contains('open');
        document.querySelectorAll('.custom-select.open').forEach(el => el.classList.remove('open'));
        if (!isOpen) {
            container.classList.add('open');
            renderOptions(); // Reset list
            searchInput.value = '';
            setTimeout(() => searchInput.focus(), 100);
        }
    });

    searchInput.addEventListener('input', (e) => {
        renderOptions(e.target.value);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            container.classList.remove('open');
        }
    });

    renderOptions();
}

// ─── University Detail Page (university) ──

function initUniversityPage(initialUni) {
    const reviewsContainer = document.getElementById('reviews-container');
    const filterBar = document.getElementById('filter-bar');
    const heroTitle = document.getElementById('uni-hero-title');
    const heroSubtitle = document.getElementById('uni-hero-subtitle');

    if (!reviewsContainer) return () => {};

    // All reviews pool
    const ALL_MOCK = [];

    // Default to initialUni or selectedUniState or Boğaziçi
    let selectedUni = initialUni || selectedUniState || (typeof TURKISH_UNIVERSITIES !== 'undefined' ?
        'Boğaziçi Üniversitesi' : 'Boğaziçi Üniversitesi');
    selectedUniState = selectedUni;

    // Initialize custom select
    initCustomSelect('custom-uni-select', typeof TURKISH_UNIVERSITIES !== 'undefined' ? TURKISH_UNIVERSITIES : [], (newUni) => {
        selectedUni = newUni;
        selectedUniState = newUni;
        updateHero();
        // Reset tag filter
        if (filterBar) {
            filterBar.querySelectorAll('.tag--filter').forEach(b => b.classList.remove('tag--active'));
            const allBtn = filterBar.querySelector('[data-filter="all"]');
            if (allBtn) allBtn.classList.add('tag--active');
        }
        renderReviews('all');
    }, selectedUni);


    // Render filter buttons
    let filterHTML = `<button class="tag tag--filter tag--active" data-filter="all"><i data-lucide="layers" class="icon-xs"></i> <span>Tümü</span></button>`;
    AVAILABLE_TAGS.forEach(tag => {
        filterHTML += `<button class="tag tag--filter" data-filter="${tag.id}"><i data-lucide="${tag.icon}" class="icon-xs"></i> <span>${tag.label}</span></button>`;
    });
    filterBar.innerHTML = filterHTML;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Get reviews for the selected university
    function getAllReviews() {
        const userReviews = getSavedReviews().filter(r => r.university === selectedUni);
        const mockReviews = ALL_MOCK.filter(r => r.university === selectedUni);
        return [...userReviews, ...mockReviews];
    }

    // Render review cards
    function renderReviews(filter = 'all') {
        const allReviews = getAllReviews();
        let filtered = filter === 'all'
            ? allReviews
            : allReviews.filter(r => r.tags.includes(filter));

        // Sort by popularity (likes - dislikes) descending
        filtered.sort((a, b) => {
            const scoreA = getReviewScore(a.id);
            const scoreB = getReviewScore(b.id);
            return scoreB - scoreA;
        });

        if (filtered.length === 0) {
            reviewsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon"><i data-lucide="message-square" class="icon-md"></i></div>
          <h4 style="font-weight: 600; color: var(--color-text); margin-bottom: 4px;">Henüz değerlendirme bulunamadı</h4>
          <p style="color: var(--color-text-dim); font-size: 0.88rem; margin-bottom: var(--space-md);">Bu üniversite veya kategori için ilk deneyimi sen paylaş.</p>
          <a href="#/review-form" class="btn btn--primary btn--sm">İlk Değerlendirmeyi Sen Yaz</a>
        </div>
      `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            updateStats(allReviews);
            return;
        }

        reviewsContainer.innerHTML = filtered.map(r => renderReviewCard(r)).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
        updateStats(allReviews);
    }

    async function fetchWikipediaImage(uniName) {
        try {
            const searchUrl = `https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(uniName)}&utf8=&format=json&origin=*`;
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json();
            if (!searchData.query.search.length) return null;
            
            const title = searchData.query.search[0].title;
            const imgUrl = `https://tr.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&origin=*`;
            const imgRes = await fetch(imgUrl);
            const imgData = await imgRes.json();
            const pages = imgData.query.pages;
            const pageId = Object.keys(pages)[0];
            
            if (!pages[pageId].pageimage) return null;
            const filename = pages[pageId].pageimage;
            
            const fileUrl = `https://tr.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
            const fileRes = await fetch(fileUrl);
            const fileData = await fileRes.json();
            const imgPages = fileData.query.pages;
            const imgPageId = Object.keys(imgPages)[0];
            
            return imgPages[imgPageId].imageinfo[0].url;
        } catch (e) {
            console.error("Wikipedia image fetch failed:", e);
            return null;
        }
    }

    // Update hero section and profile metadata
    function updateHero() {
        // Fetch specific or fallback data
        let details = UNI_DETAILS[selectedUni] ? { ...UNI_DETAILS[selectedUni] } : { ...GENERIC_UNI_DATA };

        // 1. Update Title and Location
        const heroTitleEl = document.getElementById('uni-hero-title');
        const heroSubtitleEl = document.getElementById('uni-hero-subtitle');
        if (heroTitleEl) heroTitleEl.innerHTML = selectedUni;
        if (heroSubtitleEl) heroSubtitleEl.innerHTML = `<i data-lucide="map-pin" class="icon-sm"></i> ${details.subtitle}`;

        // 2. Default Image Settings
        const heroImg = document.getElementById('hero-img');
        const heroBlurImg = document.getElementById('hero-blur-img');
        if (heroImg) heroImg.src = details.image;
        if (heroBlurImg) heroBlurImg.src = details.image;

        // 3. Update Text Content
        const textShort = document.getElementById('about-text-short');
        const textLong = document.getElementById('about-text-long');
        if (textShort) {
            textShort.textContent = typeof UNI_DETAILS[selectedUni] !== 'undefined' ? `${details.aboutShort}` : `${selectedUni}, ${details.aboutShort}`;
        }
        if (textLong) {
            textLong.textContent = details.aboutLong;
        }

        // 3.5 Default Website
        const websiteBtn = document.getElementById('uni-website-btn');
        if (websiteBtn) {
            if (details.website) {
                websiteBtn.href = details.website;
                websiteBtn.style.display = 'inline-flex';
            } else {
                websiteBtn.style.display = 'none';
            }
        }

        // 3.6 Favorite Button Sync
        const favBtn = document.getElementById('uni-fav-btn');
        const favText = document.getElementById('uni-fav-text');
        const favIcon = document.getElementById('uni-fav-icon');
        if (favBtn) {
            async function checkIsFav() {
                let favs = [];
                if (CURRENT_USER && CURRENT_USER.uid !== 'guest') {
                    try { favs = await api.getFavorites(); } catch(e) { }
                } else {
                    favs = JSON.parse(localStorage.getItem('kampus_sesi_favorites') || '[]');
                }
                const isFav = favs.includes(selectedUni);
                if (favText) favText.textContent = isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle';
                if (favBtn) {
                    favBtn.classList.toggle('btn--primary', isFav);
                    favBtn.classList.toggle('btn--outline', !isFav);
                }
                if (favIcon) {
                    favIcon.setAttribute('fill', isFav ? 'currentColor' : 'none');
                }
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return isFav;
            }
            checkIsFav();

            favBtn.onclick = async (e) => {
                e.preventDefault();
                favBtn.disabled = true;
                try {
                    let favs = [];
                    if (CURRENT_USER && CURRENT_USER.uid !== 'guest') {
                        try {
                            favs = await api.getFavorites();
                        } catch(e) {
                            favs = JSON.parse(localStorage.getItem('kampus_sesi_favorites') || '[]');
                        }
                    } else {
                        favs = JSON.parse(localStorage.getItem('kampus_sesi_favorites') || '[]');
                    }
                    const isFav = favs.includes(selectedUni);
                    if (isFav) {
                        if (CURRENT_USER && CURRENT_USER.uid !== 'guest') {
                            await api.removeFavorite(selectedUni);
                        }
                        favs = favs.filter(u => u !== selectedUni);
                        localStorage.setItem('kampus_sesi_favorites', JSON.stringify(favs));
                        showToast(`🗑️ "${selectedUni}" favorilerden çıkarıldı.`);
                    } else {
                        if (CURRENT_USER && CURRENT_USER.uid !== 'guest') {
                            await api.addFavorite(selectedUni);
                        }
                        favs.push(selectedUni);
                        localStorage.setItem('kampus_sesi_favorites', JSON.stringify(favs));
                        showToast(`❤️ "${selectedUni}" favorilere eklendi!`);
                    }
                    await checkIsFav();
                } catch(err) {
                    showToast(`❌ Hata: ${err.message || 'Favori işlemi başarısız.'}`);
                } finally {
                    favBtn.disabled = false;
                }
            };
        }

        // 4. Fetch dynamic data from API (MySQL)
        api.getUniversity(selectedUni).then(uniDb => {
            if (uniDb) {
                const currentTitle = document.getElementById('uni-hero-title');
                // Sadece hala ayni universite seciliyse DOM'u guncelle
                if (currentTitle && currentTitle.textContent.trim() === selectedUni.trim()) {
                    if (uniDb.image_url && uniDb.image_url.trim() !== '') {
                        if (heroImg) heroImg.src = uniDb.image_url;
                        if (heroBlurImg) heroBlurImg.src = uniDb.image_url;
                    } else {
                        // API'de yoksa Wikipedia fallback
                        fetchWikipediaImage(selectedUni).then(url => {
                            if (url && currentTitle && currentTitle.textContent.trim() === selectedUni.trim()) {
                                if (heroImg) heroImg.src = url;
                                if (heroBlurImg) heroBlurImg.src = url;
                            }
                        });
                    }

                    if (uniDb.website_url && uniDb.website_url.trim() !== '') {
                        if (websiteBtn) {
                            websiteBtn.href = uniDb.website_url;
                            websiteBtn.style.display = 'inline-flex';
                        }
                    }

                    // KYK Render (Ayrı API çağrısı ile ID üzerinden)
                    api.getDorms(uniDb.id).then(dorms => {
                        renderKykSection(dorms);
                    }).catch(err => {
                        console.warn("Yurtlar çekilirken hata:", err);
                        renderKykSection([]);
                    });
                }
            }
        }).catch(err => {
            console.warn("DB'den universite bilgisi cekilirken hata:", err);
            // Fallback wikipedia
            fetchWikipediaImage(selectedUni).then(url => {
                const currentTitle = document.getElementById('uni-hero-title');
                if (url && currentTitle && currentTitle.textContent.trim() === selectedUni.trim()) {
                    if (heroImg) heroImg.src = url;
                    if (heroBlurImg) heroBlurImg.src = url;
                }
            });
            api.getDorms(selectedUni).then(dorms => {
                renderKykSection(dorms);
            }).catch(() => {
                renderKykSection([]);
            });
        });

        // 5. Update Transportation Cards based on structured array
        const transportGrid = document.getElementById('transport-grid');
        if (transportGrid) {
            let transportHTML = '';

            const routes = details.transport;
            routes.forEach(route => {
                // map icon to bg class
                let iconClass = 'is-bus';
                if (route.icon === 'train') iconClass = 'is-train';
                if (route.icon === 'ferry') iconClass = 'is-ferry';
                if (route.icon === 'plane') iconClass = 'is-ferry'; // Reuse blue for plane

                transportHTML += `
                    <div class="transport-card">
                        <div class="transport-card__icon-wrapper ${iconClass}">
                            <i data-lucide="${route.icon}"></i>
                        </div>
                        <div class="transport-card__info">
                            <h3 class="transport-card__route">${route.from} <i data-lucide="arrow-right" class="icon-xs"></i> Kampüs</h3>
                            <p class="transport-card__type"><strong style="color:var(--color-text); font-weight: 500;">${route.type}</strong> • ${route.route}</p>
                        </div>
                        <div class="transport-card__duration">
                            <i data-lucide="clock" class="icon-xs"></i>
                            <span>${route.duration}</span>
                        </div>
                    </div>
                `;
            });

            transportGrid.innerHTML = transportHTML;
        }

        // Reconnect icons logic since we injected them raw
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        const statRank = document.getElementById('stat-rank');
        if (statRank) statRank.textContent = details.rank;
    }

    // Render KYK Info
    function renderKykSection(yurtlar) {
        const grid = document.getElementById('kyk-grid');
        if (!grid) return;

        if (!yurtlar || yurtlar.length === 0) {
            grid.innerHTML = '<div style="color: var(--color-text-muted);">Bu üniversite için henüz yurt bilgisi eklenmedi.</div>';
            return;
        }

        let html = '';
        yurtlar.forEach(yurt => {
            let badgeClass = 'kyk-badge--karma';
            if (yurt.tip.toLowerCase() === 'kız') badgeClass = 'kyk-badge--kiz';
            else if (yurt.tip.toLowerCase() === 'erkek') badgeClass = 'kyk-badge--erkek';

            html += `
                <div class="kyk-card">
                    <div class="kyk-card__header">
                        <h3 class="kyk-card__title">${yurt.ad}</h3>
                        <span class="kyk-badge ${badgeClass}">${yurt.tip}</span>
                    </div>
                    <div class="kyk-detail">
                        <i data-lucide="map-pin" class="icon-sm"></i>
                        <span>${yurt.mesafe}</span>
                    </div>
                    <div class="kyk-detail">
                        <i data-lucide="wallet" class="icon-sm"></i>
                        <span>${yurt.ucret}</span>
                    </div>
                    <div class="kyk-detail">
                        <i data-lucide="users" class="icon-sm"></i>
                        <span>Kapasite: ${yurt.kapasite}</span>
                    </div>
                </div>
            `;
        });
        
        grid.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Initialize Page-Specific Logic (Animations & Toggles)
    function initProfileUI() {
        // 1. Intersection Observer for Scroll Animations
        const revealElements = document.querySelectorAll('.reveal-up');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // 2. About Section Toggle
        const aboutToggleBtn = document.getElementById('about-toggle-btn');
        const aboutExtended = document.getElementById('about-extended');

        if (aboutToggleBtn && aboutExtended) {
            aboutToggleBtn.addEventListener('click', () => {
                const isOpen = aboutExtended.classList.contains('is-open');
                if (isOpen) {
                    aboutExtended.classList.remove('is-open');
                    aboutToggleBtn.classList.remove('is-open');
                    aboutToggleBtn.innerHTML = `Daha Fazla Oku <i data-lucide="chevron-down" class="icon-sm"></i>`;
                } else {
                    aboutExtended.classList.add('is-open');
                    aboutToggleBtn.classList.add('is-open');
                    aboutToggleBtn.innerHTML = `Daha Az Göster <i data-lucide="chevron-up" class="icon-sm"></i>`;
                }
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        }

        // 3. Dummy Comments Logic
        const commentForm = document.getElementById('profile-comment-form');
        const commentInput = document.getElementById('comment-input');
        const commentStatus = document.getElementById('comment-status');
        const commentsCount = document.getElementById('comments-count');

        // Handle new comment submission (Dummy local only for demo)
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = commentInput.value.trim();
                if (!text) return;

                const submitBtn = commentForm.querySelector('.comment-submit-btn');
                const originalBtnHtml = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i data-lucide="loader-2" class="icon-sm" style="animation: spin 1s linear infinite;"></i> Gönderiliyor...';
                if (typeof lucide !== 'undefined') lucide.createIcons();
                submitBtn.disabled = true;

                setTimeout(() => {
                    // Update count artificially if present
                    if (commentsCount) {
                        const currentCountStr = commentsCount.textContent;
                        const match = currentCountStr.match(/\d+/);
                        if (match) {
                            const count = parseInt(match[0]) + 1;
                            commentsCount.textContent = `${count} Yorum`;
                        }
                    }

                    commentInput.value = '';
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.disabled = false;
                    if (typeof lucide !== 'undefined') lucide.createIcons();

                    commentStatus.textContent = "Yorumunuz eklendi!";
                    commentStatus.style.color = "var(--color-success)";

                    // Actually add it to the real reviews list to show up at the bottom
                    const saved = getSavedReviews();
                    const newRev = {
                        id: Date.now(),
                        user: CURRENT_USER.name,
                        initials: CURRENT_USER.initials,
                        university: selectedUni, // bind to current uni
                        date: 'Şimdi',
                        rating: 5, // default fake rating for quick comment
                        tags: ['genel'],
                        text: text
                    };
                    saved.unshift(newRev); // Add to top
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

                    // Re-render the reviews below
                    const activeFilter = filterBar.querySelector('.tag--active')?.dataset.filter || 'all';
                    renderReviews(activeFilter);

                    setTimeout(() => { commentStatus.textContent = ""; }, 3000);
                }, 800);
            });
        }
    }

    // Update stats
    function updateStats(reviews) {
        const statAvg = document.getElementById('stat-avg');
        const statCount = document.getElementById('stat-count');
        if (reviews.length > 0) {
            const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
            if (statAvg) statAvg.textContent = avg;
        } else {
            if (statAvg) statAvg.textContent = '—';
        }
        if (statCount) statCount.textContent = reviews.length;
    }

    renderReviews();
    updateHero();

    // Filter click handler
    filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.tag--filter');
        if (!btn) return;

        filterBar.querySelectorAll('.tag--filter').forEach(b => b.classList.remove('tag--active'));
        btn.classList.add('tag--active');
        renderReviews(btn.dataset.filter);
    });

    initProfileUI();

    // Return renderReviews so updates can re-render without full re-init
    return () => renderReviews();
}


// ─── Review Form Page ─────────────────────

function initReviewForm() {
    const form = document.getElementById('add-review-form');
    if (!form) return;

    const uniSelectHidden = document.getElementById('form-uni-hidden');

    // Initialize custom select
    initCustomSelect('custom-uni-select-form', typeof TURKISH_UNIVERSITIES !== 'undefined' ? TURKISH_UNIVERSITIES : [], (newUni) => {
        if (uniSelectHidden) uniSelectHidden.value = newUni;
    });

    // Render tag buttons
    const tagsContainer = document.getElementById('form-tags');
    const selectedTags = new Set();

    AVAILABLE_TAGS.forEach(tag => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tag tag--selectable';
        btn.dataset.tagId = tag.id;
        btn.textContent = tag.label;
        btn.addEventListener('click', () => {
            if (selectedTags.has(tag.id)) {
                selectedTags.delete(tag.id);
                btn.classList.remove('tag--selected');
            } else {
                selectedTags.add(tag.id);
                btn.classList.add('tag--selected');
            }
        });
        tagsContainer.appendChild(btn);
    });

    // Character counter
    const textarea = document.getElementById('form-text');
    const charCount = document.getElementById('char-count');
    const maxChars = 500;

    textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        charCount.textContent = `${len} / ${maxChars}`;
        if (len > maxChars) {
            charCount.style.color = 'var(--color-danger)';
        } else {
            charCount.style.color = '';
        }
    });

    // Star rating
    let selectedRating = 0;
    const starsContainer = document.getElementById('star-rating');
    starsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'stars__item';
        star.dataset.value = i;
        star.textContent = '★';
        star.addEventListener('click', () => {
            selectedRating = i;
            updateStarDisplay();
        });
        star.addEventListener('mouseenter', () => {
            highlightStars(i);
        });
        starsContainer.appendChild(star);
    }

    starsContainer.addEventListener('mouseleave', () => {
        updateStarDisplay();
    });

    function highlightStars(upTo) {
        starsContainer.querySelectorAll('.stars__item').forEach(s => {
            s.classList.toggle('stars__item--filled', parseInt(s.dataset.value) <= upTo);
        });
    }

    function updateStarDisplay() {
        highlightStars(selectedRating);
    }

    // Preview section
    const previewContainer = document.getElementById('preview-container');

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const university = uniSelectHidden.value;
        const text = textarea.value.trim();

        // Validation
        if (!university) { showToast('⚠️ Lütfen bir üniversite seçin.'); return; }
        if (!text) { showToast('⚠️ Lütfen bir yorum yazın.'); return; }
        if (text.length > maxChars) { showToast('⚠️ Yorum çok uzun.'); return; }
        if (selectedRating === 0) { showToast('⚠️ Lütfen bir puan verin.'); return; }
        if (selectedTags.size === 0) { showToast('⚠️ Lütfen en az bir etiket seçin.'); return; }

        // Build review object
        const newReview = {
            id: Date.now(), // Fallback ID
            user: CURRENT_USER.name,
            initials: CURRENT_USER.initials,
            university: university,
            date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
            rating: selectedRating,
            tags: Array.from(selectedTags),
            text: text,
        };

        // Save to Database
        window.saveReview(newReview).then(saved => {
            // Show preview
            previewContainer.innerHTML = `
              <h3 class="section-title" style="margin-top: var(--space-xl);">✅ Değerlendirmeniz <span>gönderildi!</span></h3>
              ${renderReviewCard(saved || newReview, { showUni: true })}
            `;
            previewContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Reset form
            form.reset();
            selectedTags.clear();
            document.querySelectorAll('.tag--selected').forEach(t => t.classList.remove('tag--selected'));
            selectedRating = 0;
            updateStarDisplay();
            charCount.textContent = '0 / 500';

            showToast('✅ Değerlendirme başarıyla gönderildi!');
        }).catch(err => {
            console.error(err);
            showToast(`❌ Hata: ${err.message}`);
        });
    });
}


// ─── Profile Page ─────────────────────────

function initProfilePage(params) {
    const listContainer = document.getElementById('user-reviews-list');
    if (!listContainer) return () => {};

    const targetUser = params.get('user') || CURRENT_USER.name;
    const isCurrentUser = !params.get('user') || targetUser === CURRENT_USER.name;
    const settingsTab = document.getElementById('profile-settings-tab');
    const settingsPanel = document.getElementById('profile-settings-panel');
    const logoutButton = document.getElementById('profile-logout-btn');
    const settingsForm = document.getElementById('profile-settings-form');
    const settingsMessage = document.getElementById('profile-settings-message');
    let profile = null;
    let reviews = isCurrentUser ? [] : getAllReviewsGlobal().filter(review => review.user === targetUser);

    if (!isCurrentUser) {
        settingsTab.hidden = true;
        settingsPanel.hidden = true;
        logoutButton.hidden = true;
    }

    function setActiveTab(tabName) {
        document.querySelectorAll('[data-profile-tab]').forEach(tab => {
            const selected = tab.dataset.profileTab === tabName;
            tab.classList.toggle('is-active', selected);
            tab.setAttribute('aria-selected', String(selected));
        });
        document.getElementById('profile-reviews-panel').hidden = tabName !== 'reviews';
        settingsPanel.hidden = tabName !== 'settings' || !isCurrentUser;
    }

    document.querySelectorAll('[data-profile-tab]').forEach(tab => {
        tab.addEventListener('click', () => setActiveTab(tab.dataset.profileTab));
    });

    function render() {
        const targetReviews = reviews;
        const reviewLikeCount = targetReviews.reduce((sum, review) => {
            const interactions = getInteractions()[review.id] || { likes: [], dislikes: [] };
            return sum + interactions.likes.length;
        }, 0);
        const displayName = profile?.name || targetReviews[0]?.user || targetUser;
        const displayInitials = profile?.initials || targetReviews[0]?.initials || getInitials(displayName);
        const academicInfo = [profile?.university, profile?.department].filter(Boolean).join(' · ');

        document.getElementById('profile-avatar').textContent = displayInitials;
        document.getElementById('profile-name').textContent = displayName;
        document.getElementById('profile-academic-info').textContent = academicInfo || 'Üniversite ve bölüm bilgisi eklenmemiş.';
        document.getElementById('stat-review-count').textContent = profile?.stats?.review_count ?? targetReviews.length;
        document.getElementById('stat-upvotes').textContent = profile?.stats?.upvote_count ?? reviewLikeCount;

        if (isCurrentUser && profile) {
            document.getElementById('settings-name').value = profile.name || '';
            document.getElementById('settings-university').value = profile.university || '';
            document.getElementById('settings-department').value = profile.department || '';
        }

        if (targetReviews.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon">📝</div>
                    <p>${isCurrentUser ? 'Henüz bir değerlendirmeniz yok.' : 'Bu kullanıcının henüz bir değerlendirmesi yok.'}</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = targetReviews
            .map(review => renderReviewCard(review, { showUni: true, showDelete: isCurrentUser }))
            .join('');
    }

    if (isCurrentUser) {
        listContainer.innerHTML = '<p class="profile-loading">Değerlendirmeler yükleniyor...</p>';
        Promise.all([api.getMyProfile(), api.getMyReviews()])
            .then(([userProfile, userReviews]) => {
                profile = userProfile;
                reviews = userReviews || [];
                render();
            })
            .catch(error => {
                listContainer.innerHTML = `<p class="profile-loading profile-loading--error">${error.message}</p>`;
            });
    } else {
        render();
    }

    window.deleteReview = async function (id) {
        if (!isCurrentUser) return;
        try {
            await window.removeSavedReview(id);
            reviews = reviews.filter(review => String(review.id) !== String(id));
            profile = await api.getMyProfile();
            render();
            showToast('Değerlendirme silindi.');
        } catch (error) {
            showToast(`Silme başarısız: ${error.message}`);
        }
    };

    if (settingsForm && isCurrentUser) {
        settingsForm.addEventListener('submit', async event => {
            event.preventDefault();
            settingsMessage.textContent = '';

            const formData = new FormData(settingsForm);
            const update = {
                name: formData.get('name').trim(),
                university: formData.get('university').trim(),
                department: formData.get('department').trim()
            };
            const newPassword = formData.get('new_password');
            if (newPassword) {
                update.current_password = formData.get('current_password');
                update.new_password = newPassword;
            }

            const submitButton = settingsForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            try {
                const updated = await api.updateMyProfile(update);
                profile = { ...profile, ...updated };
                CURRENT_USER = {
                    ...CURRENT_USER,
                    name: updated.name,
                    initials: updated.initials,
                    email: updated.email
                };
                updateNavForUser(CURRENT_USER);
                settingsForm.reset();
                render();
                settingsMessage.textContent = 'Profil bilgileri güncellendi.';
            } catch (error) {
                settingsMessage.textContent = error.message;
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    logoutButton?.addEventListener('click', () => window.signOutBackend());
    return render;
}


// ─── Login Page ───────────────────────────

function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.auth-tab');

    if (!loginForm || !registerForm) return;

    // Redirect to home if already logged in natively
    if (CURRENT_USER.uid !== 'guest') {
        navigateTo('home');
        return;
    }

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update tab styles
            tabs.forEach(t => {
                if (t.classList.contains('active')) {
                    t.style.background = 'var(--color-surface)';
                    t.style.borderColor = 'var(--color-accent)';
                    t.style.color = 'var(--color-text)';
                } else {
                    t.style.background = 'transparent';
                    t.style.borderColor = 'transparent';
                    t.style.color = 'var(--color-text-muted)';
                }
            });

            if (tab.dataset.tab === 'login') {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            }
        });
    });

    // Login Handle
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value;
        const errDiv = document.getElementById('login-error');
        const btn = loginForm.querySelector('button');

        btn.textContent = 'Giriş Yapılıyor...';
        btn.disabled = true;

        try {
            await window.signInBackend(email, pass);
        } catch (error) {
            errDiv.textContent = 'Giriş başarısız: ' + error.message;
            btn.textContent = 'Giriş Yap ✨';
            btn.disabled = false;
        }
    });

    // Register Handle
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-password').value;
        const errDiv = document.getElementById('reg-error');
        const btn = registerForm.querySelector('button');

        btn.textContent = 'Hesap Oluşturuluyor...';
        btn.disabled = true;

        try {
            await window.signUpBackend(name, email, pass);
        } catch (error) {
            errDiv.textContent = 'Kayıt başarısız: ' + error.message;
            btn.textContent = 'Hesap Oluştur 🚀';
            btn.disabled = false;
        }
    });
}

// ─── Compare Page ─────────────────────────

function initComparePage() {
    const res1 = document.getElementById('compare-result-1');
    const res2 = document.getElementById('compare-result-2');

    if (!res1 || !res2) return () => {};

    let uni1 = 'Boğaziçi Üniversitesi';
    let uni2 = 'Orta Doğu Teknik Üniversitesi (ODTÜ)';

    function renderCol(uniName, container) {
        if (!uniName || !container) return;
        let details = UNI_DETAILS[uniName] ? { ...UNI_DETAILS[uniName] } : { ...GENERIC_UNI_DATA };

        // Fetch async image from API
        api.getUniversity(uniName).then(uniDb => {
            if (uniDb && uniDb.image_url && uniDb.image_url.trim() !== '') {
                const imgEl = container.querySelector('.compare-img');
                if (imgEl && imgEl.alt === uniName) {
                    imgEl.src = uniDb.image_url;
                }
            } else {
                fetchWikipediaImage(uniName).then(url => {
                    const imgEl = container.querySelector('.compare-img');
                    if (url && imgEl && imgEl.alt === uniName) {
                        imgEl.src = url;
                    }
                });
            }
        }).catch(err => console.warn("API universite resmi çekilirken hata:", err));

        // Compute avg rating
        const allReviews = getAllReviewsGlobal().filter(r => r.university === uniName);
        let statHtml = '';
        if (allReviews.length > 0) {
            const avg = (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1);
            statHtml = `<div style="font-size: 2rem; font-weight: bold; color: var(--color-star);">★ ${avg}</div>
                        <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 10px;">${allReviews.length} değerlendirme</div>`;
        } else {
            statHtml = `<div style="color: var(--color-text-muted); margin-bottom:10px;">Henüz değerlendirme yok</div>`;
        }

        container.innerHTML = `
            <img src="${details.image}" class="compare-img" alt="${uniName}">
            <h2 style="margin-top: 15px; font-size: 1.2rem; min-height: 55px;">${uniName}</h2>
            <div style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: 15px;">📍 ${details.subtitle}</div>
            
            <div class="compare-section">
                ${statHtml}
                <div style="padding: 5px 10px; background: var(--color-tag-bg); display: inline-block; border-radius: 4px; color: var(--color-accent); font-weight: bold; margin-bottom: 15px;">Sıralama: ${details.rank}</div>
            </div>
            
            <div class="compare-section">
                <h3 style="font-size: 1rem; margin-bottom: 10px;">Hakkında</h3>
                <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.5;">${details.aboutShort}</p>
            </div>
            
            <div class="compare-section">
                <h3 style="font-size: 1rem; margin-bottom: 10px;">Ulaşım Özet</h3>
                <ul style="list-style: none; padding: 0;">
                    ${details.transport.map(t => `
                        <li style="font-size: 0.85rem; margin-bottom: 8px; color: var(--color-text-muted);">
                            <strong>${t.from}</strong> ➔ ${t.duration} (${t.type})
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    initCustomSelect('custom-uni-select-1', typeof TURKISH_UNIVERSITIES !== 'undefined' ? TURKISH_UNIVERSITIES : [], (newUni) => {
        uni1 = newUni;
        renderCol(uni1, res1);
    }, uni1);

    initCustomSelect('custom-uni-select-2', typeof TURKISH_UNIVERSITIES !== 'undefined' ? TURKISH_UNIVERSITIES : [], (newUni) => {
        uni2 = newUni;
        renderCol(uni2, res2);
    }, uni2);

    renderCol(uni1, res1);
    renderCol(uni2, res2);

    return () => {
        renderCol(uni1, res1);
        renderCol(uni2, res2);
    };
}

// ─── SPA Route Renderer ───────────────────

export function renderCurrentRoute() {
    const { route, params } = parseHash();
    currentRoute = route;
    currentParams = params;

    // Check protected routes
    const protectedRoutes = ['review-form', 'degerlendir'];
    if (route === 'profile' && !params.get('user')) {
        protectedRoutes.push('profile');
    }

    if (protectedRoutes.includes(route) && CURRENT_USER.uid === 'guest') {
        showToast('⚠️ Bu sayfayı görüntülemek için lütfen giriş yapın.');
        window.location.hash = '#/login';
        return;
    }

    if (route === 'login' && CURRENT_USER.uid !== 'guest') {
        window.location.hash = '#/home';
        return;
    }

    const root = document.getElementById('app-root');
    if (!root) return;

    // Page templates mapping
    const templateMap = {
        'home': TEMPLATES.home,
        'university': TEMPLATES.university,
        'compare': TEMPLATES.compare,
        'review-form': TEMPLATES.reviewForm,
        'degerlendir': TEMPLATES.reviewForm,
        'profile': TEMPLATES.profile,
        'login': TEMPLATES.login,
        'blog': TEMPLATES.blog,
        'yayin-ilkeleri': TEMPLATES.yayinIlkeleri,
        'guide': TEMPLATES.yayinIlkeleri,
        'okul-oner': TEMPLATES.okulOner,
        'suggest': TEMPLATES.okulOner,
        'yazi-gonder': TEMPLATES.yaziGonder,
        'topluluk-kurallari': TEMPLATES.toplulukKurallari,
        'rules': TEMPLATES.toplulukKurallari,
        'hakkimizda': TEMPLATES.hakkimizda,
        'about': TEMPLATES.hakkimizda,
        'iletisim': TEMPLATES.iletisim,
        'contact': TEMPLATES.iletisim,
        'gizlilik': TEMPLATES.gizlilik,
        'privacy': TEMPLATES.gizlilik,
        'kullanim-sartlari': TEMPLATES.kullanimSartlari,
        'terms': TEMPLATES.kullanimSartlari,
        'favorites': TEMPLATES.favorites,
        'cities': TEMPLATES.cities,
        'ranking': TEMPLATES.ranking,
        'departments': TEMPLATES.departments
    };

    const template = templateMap[route] || TEMPLATES.home;
    root.innerHTML = template;

    // Update Nav active classes
    document.querySelectorAll('.nav__link').forEach(link => {
        const nav = link.dataset.nav;
        if (nav) {
            link.classList.toggle('nav__link--active', nav === route);
        }
    });

    // Close mobile hamburger menu
    const navLinks = document.querySelector('.nav__links');
    const hamburger = document.querySelector('.nav__hamburger');
    if (navLinks) navLinks.classList.remove('nav__links--open');
    if (hamburger) hamburger.classList.remove('nav__hamburger--active');
    
    // Call GSAP initialization if on home or blog route
    if (route === 'home' || route === 'blog') {
        setTimeout(() => {
            if (typeof initGSAPHome === 'function') initGSAPHome();
        }, 100);
    }

    // Update document title
    const titles = {
        'home': 'Kampüs Sesi — Üniversite Değerlendirme Platformu',
        'university': 'Üniversite Detay — Kampüs Sesi',
        'compare': 'Karşılaştır — Kampüs Sesi',
        'review-form': 'Değerlendir — Kampüs Sesi',
        'degerlendir': 'Değerlendir — Kampüs Sesi',
        'profile': 'Profilim — Kampüs Sesi',
        'login': 'Giriş Yap — Kampüs Sesi',
        'blog': 'Blog & Rehberler — Kampüs Sesi',
        'yayin-ilkeleri': 'Yayın İlkeleri — Kampüs Sesi',
        'guide': 'Yayın İlkeleri — Kampüs Sesi',
        'okul-oner': 'Okul Öner — Kampüs Sesi',
        'suggest': 'Okul Öner — Kampüs Sesi',
        'yazi-gonder': 'Yazı Gönder — Kampüs Sesi',
        'topluluk-kurallari': 'Topluluk Kuralları — Kampüs Sesi',
        'rules': 'Topluluk Kuralları — Kampüs Sesi',
        'hakkimizda': 'Hakkımızda — Kampüs Sesi',
        'about': 'Hakkımızda — Kampüs Sesi',
        'iletisim': 'İletişim & Destek — Kampüs Sesi',
        'contact': 'İletişim & Destek — Kampüs Sesi',
        'gizlilik': 'Gizlilik Politikası — Kampüs Sesi',
        'privacy': 'Gizlilik Politikası — Kampüs Sesi',
        'kullanim-sartlari': 'Kullanım Şartları — Kampüs Sesi',
        'terms': 'Kullanım Şartları — Kampüs Sesi',
        'favorites': 'Favorilerim — Kampüs Sesi',
        'cities': 'Şehirler — Kampüs Sesi',
        'ranking': 'Sıralama — Kampüs Sesi',
        'departments': 'Bölümler — Kampüs Sesi'
    };
    document.title = titles[route] || 'Kampüs Sesi';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize Route-Specific Logic
    if (route === 'university') {
        const initialUni = params.get('name') || selectedUniState || 'Boğaziçi Üniversitesi';
        activeRenderers.university = initUniversityPage(initialUni);
    } else if (route === 'cities') {
        initCitiesPage();
    } else if (route === 'ranking') {
        initRankingPage();
    } else if (route === 'departments') {
        initDepartmentsPage();
    } else if (route === 'compare') {
        activeRenderers.compare = initComparePage();
    } else if (route === 'review-form' || route === 'degerlendir') {
        initReviewForm();
    } else if (route === 'profile') {
        activeRenderers.profile = initProfilePage(params);
    } else if (route === 'login') {
        initLoginPage();
    } else if (route === 'home') {
        initHomePage();
    } else if (route === 'blog') {
        initBlogPage();
    } else if (route === 'okul-oner' || route === 'suggest') {
        initOkulOnerPage();
    } else if (route === 'yazi-gonder') {
        initYaziGonderPage();
    } else if (route === 'iletisim' || route === 'contact') {
        initIletisimPage();
    } else if (route === 'favorites') {
        initFavoritesPage();
    }
}

function initOkulOnerPage() {
    const form = document.getElementById('suggest-uni-form');
    const submitBtn = document.getElementById('suggest-submit-btn');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const uniName = document.getElementById('suggest-uni-name')?.value.trim();
        const city = document.getElementById('suggest-city')?.value.trim();
        const campus = document.getElementById('suggest-campus')?.value.trim() || '';
        const website = document.getElementById('suggest-website')?.value.trim() || '';
        const email = document.getElementById('suggest-email')?.value.trim();
        const notes = document.getElementById('suggest-notes')?.value.trim() || '';

        if (!uniName || !city || !email) {
            showToast('⚠️ Lütfen zorunlu alanları (Üniversite adı, Şehir, E-posta) doldurun.');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Kaydediliyor...`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        try {
            await api.suggestSchool({
                uni_name: uniName,
                city,
                campus,
                website,
                email,
                notes
            });
            showToast(`🎉 "${uniName}" öneriniz veritabanımıza başarıyla kaydedildi!`);
            form.reset();
        } catch (err) {
            showToast(`❌ Hata: ${err.message || 'Öneri kaydedilemedi.'}`);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i data-lucide="send" class="w-4 h-4"></i> Öneriyi Gönder`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    });
}

function initYaziGonderPage() {
    const form = document.getElementById('post-submission-form');
    const submitBtn = document.getElementById('post-submit-btn');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title')?.value.trim();
        const category = document.getElementById('post-category')?.value;
        const readTime = document.getElementById('post-read-time')?.value.trim() || '4 dk okuma';
        const author = document.getElementById('post-author')?.value.trim();
        const authorDesc = document.getElementById('post-author-desc')?.value.trim();
        const summary = document.getElementById('post-summary')?.value.trim() || '';
        const content = document.getElementById('post-content')?.value.trim();

        if (!title || !category || !author || !authorDesc || !content) {
            showToast('⚠️ Lütfen gerekli tüm alanları doldurun.');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> İletiliyor...`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        try {
            await api.submitBlogPost({
                title,
                category,
                read_time: readTime,
                author_name: author,
                author_info: authorDesc,
                summary,
                content
            });
            showToast(`📝 "${title}" başlıklı yazınız veritabanımıza kaydedildi! İnceleme sonrası blogda yayınlanacak.`);
            form.reset();
        } catch (err) {
            showToast(`❌ Hata: ${err.message || 'Yazı kaydedilemedi.'}`);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i data-lucide="send" class="w-4 h-4"></i> Yazıyı Editörlere Gönder`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    });
}

function initIletisimPage() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name')?.value.trim();
        const email = document.getElementById('contact-email')?.value.trim();
        const subject = document.getElementById('contact-subject')?.value;
        const message = document.getElementById('contact-message')?.value.trim();

        if (!name || !email || !subject || !message) {
            showToast('⚠️ Lütfen tüm iletişim formu alanlarını doldurun.');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> İletiliyor...`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        try {
            await api.sendContactMessage({
                name,
                email,
                subject,
                message
            });
            showToast(`📨 Teşekkürler ${name}! Mesajınız veritabanımıza başarıyla kaydedildi. En geç 24 saat içinde dönüş yapacağız.`);
            form.reset();
        } catch (err) {
            showToast(`❌ Hata: ${err.message || 'Mesaj iletilemedi.'}`);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i data-lucide="send" class="w-4 h-4"></i> Gönder`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    });
}

async function initFavoritesPage() {
    const container = document.getElementById('favorites-container');
    if (!container) return;

    let favorites = [];
    if (CURRENT_USER && CURRENT_USER.uid !== 'guest') {
        try {
            favorites = await api.getFavorites();
        } catch (e) {
            favorites = JSON.parse(localStorage.getItem('kampus_sesi_favorites') || '[]');
        }
    } else {
        favorites = JSON.parse(localStorage.getItem('kampus_sesi_favorites') || '[]');
    }

    if (!favorites || favorites.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-16 text-center">
                <div class="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center mb-4">
                    <i data-lucide="heart-off" class="w-8 h-8"></i>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">Henüz favori üniversiteniz yok</h3>
                <p class="text-zinc-400 text-sm max-w-md mx-auto mb-6">
                    İncelediğiniz üniversiteleri detay sayfasındaki "Favorilere Ekle" butonuna basarak listenize kaydedebilirsiniz.
                </p>
                <a href="#/university" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold transition-all shadow-lg shadow-cyan-500/20">
                    <i data-lucide="building-2" class="w-4 h-4"></i> Üniversiteleri Keşfet
                </a>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    container.innerHTML = favorites.map(uni => `
        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all">
            <div>
                <div class="flex items-center justify-between gap-2 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/60 border border-rose-500/30 text-rose-400">
                        <i data-lucide="heart" class="w-3 h-3 fill-rose-400"></i> Favori
                    </span>
                    <button class="remove-fav-btn text-zinc-500 hover:text-rose-400 transition-colors p-1" data-uni="${encodeURIComponent(uni)}" title="Favorilerden Çıkar">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
                <h3 class="text-lg font-bold text-white mb-2 line-clamp-2">${uni}</h3>
                <p class="text-zinc-400 text-xs mb-4">Öğrenci yorumları, yurt olanakları ve ulaşım rehberi mevcut.</p>
            </div>
            <div class="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <a href="#/university?name=${encodeURIComponent(uni)}" class="text-xs font-semibold text-cyan-400 hover:underline inline-flex items-center gap-1">
                    İncele &rarr;
                </a>
                <a href="#/compare" class="text-xs text-zinc-500 hover:text-zinc-300">
                    Karşılaştır
                </a>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Event listeners for remove buttons
    container.querySelectorAll('.remove-fav-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const uniName = decodeURIComponent(btn.dataset.uni);
            if (CURRENT_USER && CURRENT_USER.uid !== 'guest') {
                try {
                    await api.removeFavorite(uniName);
                } catch (err) { }
            }
            let localFavs = JSON.parse(localStorage.getItem('kampus_sesi_favorites') || '[]');
            localFavs = localFavs.filter(u => u !== uniName);
            localStorage.setItem('kampus_sesi_favorites', JSON.stringify(localFavs));
            showToast(`🗑️ "${uniName}" favorilerden çıkarıldı.`);
            initFavoritesPage();
        });
    });
}


// ─── Şehirler Sayfası Mantığı (Cities) ───────────────────

function initCitiesPage() {
    const grid = document.getElementById('cities-grid');
    const searchInput = document.getElementById('city-search-input');
    const filterPills = document.querySelectorAll('#city-filter-pills .city-filter-pill');
    
    // Modal elements
    const modal = document.getElementById('city-unis-modal');
    const modalBox = document.getElementById('city-unis-modal-box');
    const modalCloseBtn = document.getElementById('city-modal-close-btn');
    const modalCloseFooter = document.getElementById('city-modal-close-footer');
    const modalTitle = document.getElementById('city-modal-title');
    const modalBadge = document.getElementById('city-modal-badge');
    const modalDesc = document.getElementById('city-modal-desc');
    const modalSearch = document.getElementById('city-modal-search');
    const modalList = document.getElementById('city-modal-unis-list');
    const modalCount = document.getElementById('city-modal-count');

    if (!grid) return;

    const CITIES_DATA = [
        {
            id: 'istanbul',
            name: 'İstanbul',
            category: 'metropol',
            categoryLabel: 'Büyükşehir / Metropol',
            tagline: 'Kültür, Staj ve Dünya Başkenti',
            unisCount: '59 Üniversite',
            studentsCount: '820.000+ Öğrenci',
            kykCount: '48 KYK Yurdu',
            rentIndex: 'Yüksek Maliyet',
            rentColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
            rating: 4.8,
            description: 'Türkiye\'nin kültür, teknoloji, finans ve sanat kalbi. Sayısız global şirket genel merkeziyle staj ve kariyer olanakları sınırsız.',
            highlights: ['Metro & Metrobüs Ağı', 'Sonsuz Sosyal Etkinlik', 'Global Staj İmkanları'],
            topUnis: ['Boğaziçi Üniversitesi', 'İstanbul Teknik Üniversitesi', 'Yıldız Teknik Üniversitesi', 'Koç Üniversitesi', 'Sabancı Üniversitesi'],
            allUnis: [
                "Boğaziçi Üniversitesi",
                "İstanbul Teknik Üniversitesi",
                "Yıldız Teknik Üniversitesi",
                "Galatasaray Üniversitesi",
                "İstanbul Üniversitesi",
                "İstanbul Üniversitesi-Cerrahpaşa",
                "Marmara Üniversitesi",
                "Mimar Sinan Güzel Sanatlar Üniversitesi",
                "Türk-Alman Üniversitesi",
                "İstanbul Medeniyet Üniversitesi",
                "Sağlık Bilimleri Üniversitesi",
                "Koç Üniversitesi",
                "Sabancı Üniversitesi",
                "İstanbul Bilgi Üniversitesi",
                "Bahçeşehir Üniversitesi",
                "Özyeğin Üniversitesi",
                "Kadir Has Üniversitesi",
                "Yeditepe Üniversitesi",
                "Acıbadem Mehmet Ali Aydınlar Üniversitesi",
                "Altınbaş Üniversitesi",
                "Beykent Üniversitesi",
                "Beykoz Üniversitesi",
                "Bezmialem Vakıf Üniversitesi",
                "Biruni Üniversitesi",
                "Demiroğlu Bilim Üniversitesi",
                "Doğuş Üniversitesi",
                "Fatih Sultan Mehmet Vakıf Üniversitesi",
                "Fenerbahçe Üniversitesi",
                "Haliç Üniversitesi",
                "Işık Üniversitesi",
                "İbn Haldun Üniversitesi",
                "İstanbul 29 Mayıs Üniversitesi",
                "İstanbul Arel Üniversitesi",
                "İstanbul Atlas Üniversitesi",
                "İstanbul Aydın Üniversitesi",
                "İstanbul Ayvansaray Üniversitesi",
                "İstanbul Bilim Üniversitesi",
                "İstanbul Esenyurt Üniversitesi",
                "İstanbul Gedik Üniversitesi",
                "İstanbul Gelişim Üniversitesi",
                "İstanbul Kent Üniversitesi",
                "İstanbul Kültür Üniversitesi",
                "İstanbul Medipol Üniversitesi",
                "İstanbul Okan Üniversitesi",
                "İstanbul Rumeli Üniversitesi",
                "İstanbul Sabahattin Zaim Üniversitesi",
                "İstanbul Sağlık ve Sosyal Bilimler Meslek Yüksekokulu",
                "İstanbul Sağlık ve Teknoloji Üniversitesi",
                "İstanbul Ticaret Üniversitesi",
                "İstanbul Topkapı Üniversitesi",
                "İstanbul Yeni Yüzyıl Üniversitesi",
                "İstinye Üniversitesi",
                "Maltepe Üniversitesi",
                "MEF Üniversitesi",
                "Nişantaşı Üniversitesi",
                "Piri Reis Üniversitesi",
                "Türk Hava Kurumu Üniversitesi (İstanbul Kampüsü)",
                "Türk-Japon Bilim ve Teknoloji Üniversitesi",
                "Üsküdar Üniversitesi"
            ]
        },
        {
            id: 'ankara',
            name: 'Ankara',
            category: 'student',
            categoryLabel: 'Öğrenci Kenti / Başkent',
            tagline: 'Bürokrasi, Bilim ve Dev Kampüsler',
            unisCount: '20 Üniversite',
            studentsCount: '340.000+ Öğrenci',
            kykCount: '36 KYK Yurdu',
            rentIndex: 'Dengeli / Orta',
            rentColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            rating: 4.9,
            description: 'Cumhuriyetin ve eğitimin başkenti. ODTÜ, Hacettepe ve Bilkent gibi devasa ormanlık kampüsleri, sakin kütüphane hayatı ve düzenli toplu taşımasıyla tam bir öğrenci kenti.',
            highlights: ['Düzenli Metro & Ego Ağı', 'Millet Kütüphanesi', 'Köklü Kampüs Kültürü'],
            topUnis: ['Orta Doğu Teknik Üniversitesi', 'Hacettepe Üniversitesi', 'Bilkent Üniversitesi', 'Ankara Üniversitesi'],
            allUnis: [
                "Orta Doğu Teknik Üniversitesi",
                "Hacettepe Üniversitesi",
                "İhsan Doğramacı Bilkent Üniversitesi",
                "Ankara Üniversitesi",
                "Gazi Üniversitesi",
                "Ankara Yıldırım Beyazıt Üniversitesi",
                "Ankara Sosyal Bilimler Üniversitesi",
                "Ankara Hacı Bayram Veli Üniversitesi",
                "Ankara Müzik ve Güzel Sanatlar Üniversitesi",
                "TOBB Ekonomi ve Teknoloji Üniversitesi",
                "Başkent Üniversitesi",
                "Çankaya Üniversitesi",
                "TED Üniversitesi",
                "Atılım Üniversitesi",
                "Ankara Bilim Üniversitesi",
                "Ankara Medipol Üniversitesi",
                "Lokman Hekim Üniversitesi",
                "OSTİM Teknik Üniversitesi",
                "Ufuk Üniversitesi",
                "Yüksek İhtisas Üniversitesi"
            ]
        },
        {
            id: 'izmir',
            name: 'İzmir',
            category: 'coast',
            categoryLabel: 'Ege & Sahil Yaşamı',
            tagline: 'Özgürlük, Hoşgörü ve Sahil Meltemi',
            unisCount: '10 Üniversite',
            studentsCount: '190.000+ Öğrenci',
            kykCount: '22 KYK Yurdu',
            rentIndex: 'Orta / Yüksek',
            rentColor: 'text-sky-400 bg-sky-950/40 border-sky-500/30',
            rating: 4.8,
            description: 'Kordon boyu, Alsancak kafeleri, ferah bisiklet yolları ve sıcacık insanlarıyla öğrencilere Türkiye\'nin en rahat ve huzurlu sosyal atmosferini sunan sahil kenti.',
            highlights: ['Kordon & Sahil Yaşamı', 'İzban & Vapur Ulaşımı', 'Dinamik Kulüp Etkinlikleri'],
            topUnis: ['Ege Üniversitesi', 'Dokuz Eylül Üniversitesi', 'İzmir Yüksek Teknoloji Enstitüsü (İYTE)', 'Yaşar Üniversitesi'],
            allUnis: [
                "Ege Üniversitesi",
                "Dokuz Eylül Üniversitesi",
                "İzmir Yüksek Teknoloji Enstitüsü",
                "İzmir Katip Çelebi Üniversitesi",
                "İzmir Bakırçay Üniversitesi",
                "İzmir Demokrasi Üniversitesi",
                "İzmir Ekonomi Üniversitesi",
                "Yaşar Üniversitesi",
                "İzmir Tınaztepe Üniversitesi",
                "İzmir Kavram Meslek Yüksekokulu"
            ]
        },
        {
            id: 'eskisehir',
            name: 'Eskişehir',
            category: 'student',
            categoryLabel: 'Öğrenci Dostu Başkent',
            tagline: 'Avrupa Havasında, Tamamen Gençlik Şehri',
            unisCount: '3 Üniversite',
            studentsCount: '95.000+ Öğrenci',
            kykCount: '16 KYK Yurdu',
            rentIndex: 'Uygun / Ekonomik',
            rentColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            rating: 4.9,
            description: 'Porsuk Çayı etrafında şekillenen kafe ve parkları, bisikletli ulaşımı, her bütçeye uygun mekanları ve canlı tiyatro/konser kültürüyle tartışmasız Türkiye\'nin 1 numaralı öğrenci şehri.',
            highlights: ['Bisiklet & Estram Tramvay', 'Porsuk Çayı & Adalar', 'Düşük Yaşam Maliyeti'],
            topUnis: ['Anadolu Üniversitesi', 'Eskişehir Osmangazi Üniversitesi', 'Eskişehir Teknik Üniversitesi'],
            allUnis: [
                "Anadolu Üniversitesi",
                "Eskişehir Osmangazi Üniversitesi",
                "Eskişehir Teknik Üniversitesi"
            ]
        },
        {
            id: 'antalya',
            name: 'Antalya',
            category: 'coast',
            categoryLabel: 'Akdeniz & Sahil',
            tagline: 'Güneş, Turizm ve Palmiye Kampüsü',
            unisCount: '5 Üniversite',
            studentsCount: '90.000+ Öğrenci',
            kykCount: '14 KYK Yurdu',
            rentIndex: 'Orta / Yüksek',
            rentColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
            rating: 4.6,
            description: 'Akdeniz Üniversitesi\'nin sahil şeridine ve Konyaaltı Plajı\'na yakın yeşil kampüsü, yıl boyu süren ılıman iklimi ve uluslararası turizm ortamı ile enerjik bir öğrencilik vadediyor.',
            highlights: ['Konyaaltı Plajına Yakınlık', 'Sıcak & Güneşli İklim', 'Uluslararası Turizm Stajları'],
            topUnis: ['Akdeniz Üniversitesi', 'Antalya Bilim Üniversitesi', 'Alanya Alaaddin Keykubat Üniversitesi'],
            allUnis: [
                "Akdeniz Üniversitesi",
                "Alanya Alaaddin Keykubat Üniversitesi",
                "Alanya Hamdullah Emin Paşa Üniversitesi",
                "Antalya Akev Üniversitesi",
                "Antalya Bilim Üniversitesi"
            ]
        },
        {
            id: 'bursa',
            name: 'Bursa',
            category: 'metropol',
            categoryLabel: 'Sanayi & Üniversite',
            tagline: 'Otomotiv Başkenti ve Uludağ Etekleri',
            unisCount: '3 Üniversite',
            studentsCount: '80.000+ Öğrenci',
            kykCount: '15 KYK Yurdu',
            rentIndex: 'Dengeli / Orta',
            rentColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            rating: 4.5,
            description: 'Görükle öğrenci yerleşkesinin 24 saat yaşayan dinamik atmosferi, Uludağ Üniversitesi\'nin devasa orman kampüsü ve otomotiv/makine sanayisinin sunduğu güçlü staj olanakları.',
            highlights: ['Görükle Öğrenci Mahallesi', 'Bursaray Raylı Sistem', 'Otomotiv Sanayi Stajları'],
            topUnis: ['Bursa Uludağ Üniversitesi', 'Bursa Teknik Üniversitesi', 'Mudanya Üniversitesi'],
            allUnis: [
                "Bursa Uludağ Üniversitesi",
                "Bursa Teknik Üniversitesi",
                "Mudanya Üniversitesi"
            ]
        },
        {
            id: 'canakkale',
            name: 'Çanakkale',
            category: 'coast',
            categoryLabel: 'Sahil & Butik',
            tagline: 'Boğaz Kıyısında Sakin ve Özgür Yaşam',
            unisCount: '1 Üniversite',
            studentsCount: '52.000+ Öğrenci',
            kykCount: '10 KYK Yurdu',
            rentIndex: 'Ekonomik / Uygun',
            rentColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            rating: 4.7,
            description: 'ÇOMÜ Terzioğlu Kampüsü\'nden izlenen boğaz manzarası, yürünebilir sakin sokakları ve öğrencilerin güven içinde yaşadığı samimi sahil kenti.',
            highlights: ['Boğaz Manzaralı Kampüs', 'Yürünebilir & Güvenli Şehir', 'Ekonomik Mekanlar'],
            topUnis: ['Çanakkale Onsekiz Mart Üniversitesi'],
            allUnis: [
                "Çanakkale Onsekiz Mart Üniversitesi"
            ]
        },
        {
            id: 'trabzon',
            name: 'Trabzon',
            category: 'anadolu',
            categoryLabel: 'Karadeniz & Teknik',
            tagline: 'Köklü Teknik Gelenek & Karadeniz',
            unisCount: '3 Üniversite',
            studentsCount: '48.000+ Öğrenci',
            kykCount: '12 KYK Yurdu',
            rentIndex: 'Ekonomik',
            rentColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            rating: 4.4,
            description: '1955 kuruluşlu Karadeniz Teknik Üniversitesi (KTÜ), Türkiye\'nin köklü teknik üniversitelerindendir. Deniz kıyısındaki yemyeşil kampüsü ve güçlü mühendislik mezun ağıyla bilinir.',
            highlights: ['Deniz Kıyısı Kanuni Kampüsü', 'Güçlü Mühendislik Mezun Ağı', 'Kalkınma Öğrenci Yaşamı'],
            topUnis: ['Karadeniz Teknik Üniversitesi', 'Trabzon Üniversitesi', 'Avrasya Üniversitesi'],
            allUnis: [
                "Karadeniz Teknik Üniversitesi",
                "Trabzon Üniversitesi",
                "Avrasya Üniversitesi"
            ]
        },
        {
            id: 'konya',
            name: 'Konya',
            category: 'anadolu',
            categoryLabel: 'Geniş Kampüsler & Anadolu',
            tagline: 'Geniş Kampüs, Bisiklet ve Uygun Yaşam',
            unisCount: '5 Üniversite',
            studentsCount: '125.000+ Öğrenci',
            kykCount: '24 KYK Yurdu',
            rentIndex: 'Çok Uygun / Ekonomik',
            rentColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            rating: 4.3,
            description: 'Selçuk Üniversitesi Alaeddin Keykubat Kampüsü kendi başına devasa bir kasaba gibidir. Düz ayak coğrafyası, Türkiye\'nin en uzun bisiklet yolları ve düşük yaşam maliyeti öne çıkar.',
            highlights: ['550 km Bisiklet Yolu Ağı', 'Tramvay ile Kampüs Ulaşımı', 'Hesaplı Yurt ve Kira Seçenekleri'],
            topUnis: ['Selçuk Üniversitesi', 'Konya Teknik Üniversitesi (KTÜN)', 'Necmettin Erbakan Üniversitesi'],
            allUnis: [
                "Selçuk Üniversitesi",
                "Konya Teknik Üniversitesi",
                "Necmettin Erbakan Üniversitesi",
                "KTO Karatay Üniversitesi",
                "Konya Gıda ve Tarım Üniversitesi"
            ]
        },
        {
            id: 'kayseri',
            name: 'Kayseri',
            category: 'anadolu',
            categoryLabel: 'Anadolu & Girişimcilik',
            tagline: 'Erciyes Dağı Eteklerinde Teknoloji ve Kampüs',
            unisCount: '4 Üniversite',
            studentsCount: '70.000+ Öğrenci',
            kykCount: '13 KYK Yurdu',
            rentIndex: 'Çok Uygun / Ekonomik',
            rentColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            rating: 4.4,
            description: 'Erciyes Üniversitesi\'nin araştırma üniversiteleri arasında yer alması ve Abdullah Gül Üniversitesi\'nin modern İngilizce odaklı yapısı şehri önemli bir akademi merkezine dönüştürmüştür.',
            highlights: ['Erciyes Kayak Merkezine 25 Dk', 'Araştırma Üniversitesi Altyapısı', 'Modern Tramvay Ulaşımı'],
            topUnis: ['Erciyes Üniversitesi', 'Abdullah Gül Üniversitesi (AGÜ)', 'Kayseri Üniversitesi'],
            allUnis: [
                "Erciyes Üniversitesi",
                "Abdullah Gül Üniversitesi",
                "Kayseri Üniversitesi",
                "Nuh Naci Yazgan Üniversitesi"
            ]
        },
        {
            id: 'balikesir',
            name: 'Balıkesir',
            category: 'student',
            categoryLabel: 'Öğrenci Kenti & Marmara',
            tagline: 'Bandırma Sahili ve Çağış Kampüsü',
            unisCount: '2 Üniversite',
            studentsCount: '45.000+ Öğrenci',
            kykCount: '11 KYK Yurdu',
            rentIndex: 'Ekonomik / Uygun',
            rentColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            rating: 4.3,
            description: 'İstanbul ve Bursa\'ya komşu stratejik konumu, Bandırma Onyedi Eylül Üniversitesi\'nin deniz kenarındaki canlılığı ve sakin yaşam temposu ile öne çıkar.',
            highlights: ['İstanbul\'a İDO Deniz Otobüsü', 'Sakin & Masrafsız Şehir Yaşamı', 'Bandırma Sahil Şeridi'],
            topUnis: ['Balıkesir Üniversitesi', 'Bandırma Onyedi Eylül Üniversitesi'],
            allUnis: [
                "Balıkesir Üniversitesi",
                "Bandırma Onyedi Eylül Üniversitesi"
            ]
        },
        {
            id: 'gaziantep',
            name: 'Gaziantep',
            category: 'anadolu',
            categoryLabel: 'Sanayi & Kültür',
            tagline: 'Güneydoğu\'nun Sanayi ve Gastronomi Devi',
            unisCount: '4 Üniversite',
            studentsCount: '60.000+ Öğrenci',
            kykCount: '12 KYK Yurdu',
            rentIndex: 'Dengeli / Uygun',
            rentColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            rating: 4.5,
            description: 'Gaziantep Üniversitesi\'nin uluslararası öğrenci çeşitliliği, Teknopark ve Organize Sanayi Bölgesi ile entegre staj programları ve dünyaca ünlü mutfağıyla dinamik bir üniversite deneyimi.',
            highlights: ['UNESCO Tescilli Gastronomi', 'Sanayi Entegre Mühendislik', 'Tramvay & Kampüs Yaşamı'],
            topUnis: ['Gaziantep Üniversitesi', 'Gaziantep İslam Bilim ve Teknoloji Üniversitesi', 'SANKO Üniversitesi'],
            allUnis: [
                "Gaziantep Üniversitesi",
                "Gaziantep İslam Bilim ve Teknoloji Üniversitesi",
                "Hasan Kalyoncu Üniversitesi",
                "SANKO Üniversitesi"
            ]
        }
    ];

    let currentCategory = 'all';
    let searchQuery = '';
    let activeModalCity = null;

    // ─── Modal Functions ───

    function openCityModal(city) {
        if (!modal || !city) return;
        activeModalCity = city;

        if (modalBadge) modalBadge.textContent = city.name;
        if (modalTitle) modalTitle.textContent = `${city.name}'daki Tüm Üniversiteler (${city.allUnis.length})`;
        if (modalDesc) modalDesc.textContent = `${city.name} bünyesinde yer alan tüm devlet ve vakıf üniversiteleri listeleniyor. İncelemek istediğiniz üniversiteye tıklayarak detay sayfasına gidebilirsiniz.`;
        if (modalSearch) modalSearch.value = '';

        renderModalUnis('');

        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100');
        if (modalBox) {
            modalBox.classList.remove('scale-95');
            modalBox.classList.add('scale-100');
        }

        if (modalSearch) {
            setTimeout(() => modalSearch.focus(), 150);
        }
    }

    function closeCityModal() {
        if (!modal) return;
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.classList.remove('opacity-100');
        if (modalBox) {
            modalBox.classList.add('scale-95');
            modalBox.classList.remove('scale-100');
        }
        activeModalCity = null;
    }

    function renderModalUnis(query) {
        if (!modalList || !activeModalCity) return;
        const q = query.toLowerCase().trim();
        const filtered = activeModalCity.allUnis.filter(u => !q || u.toLowerCase().includes(q));

        if (modalCount) {
            modalCount.textContent = `${filtered.length} / ${activeModalCity.allUnis.length} üniversite listeleniyor`;
        }

        if (filtered.length === 0) {
            modalList.innerHTML = `
                <div class="py-12 text-center text-zinc-500">
                    <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
                    <p class="text-sm font-medium text-zinc-400">"${query}" ile eşleşen üniversite bulunamadı.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        modalList.innerHTML = filtered.map((uni, idx) => `
            <a href="#/university?name=${encodeURIComponent(uni)}" class="city-modal-uni-link p-3 sm:p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/50 hover:bg-zinc-800 hover:border-cyan-500/40 text-zinc-200 hover:text-white transition-all flex items-center justify-between group">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:border-cyan-400 group-hover:bg-cyan-500/10">
                        <i data-lucide="graduation-cap" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <div class="text-sm font-semibold group-hover:text-cyan-300 transition-colors">${uni}</div>
                        <div class="text-[11px] text-zinc-500">${activeModalCity.name} · Öğrenci Yorumları & Rehber</div>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0">
                    <span class="hidden sm:inline">İncele</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </div>
            </a>
        `).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Close modal on item selection
        modalList.querySelectorAll('.city-modal-uni-link').forEach(link => {
            link.addEventListener('click', () => {
                closeCityModal();
            });
        });
    }

    // Modal Event Listeners
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCityModal);
    if (modalCloseFooter) modalCloseFooter.addEventListener('click', closeCityModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCityModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('pointer-events-none')) {
            closeCityModal();
        }
    });

    if (modalSearch) {
        modalSearch.addEventListener('input', (e) => {
            renderModalUnis(e.target.value);
        });
    }

    // ─── Render Main Cities Grid ───

    function renderCities() {
        const filtered = CITIES_DATA.filter(city => {
            const matchesCat = currentCategory === 'all' || city.category === currentCategory;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || 
                city.name.toLowerCase().includes(q) ||
                city.tagline.toLowerCase().includes(q) ||
                city.description.toLowerCase().includes(q) ||
                city.allUnis.some(u => u.toLowerCase().includes(q));
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-16 text-center">
                    <div class="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center mb-4">
                        <i data-lucide="map-pin-off" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">Eşleşen öğrenci şehri bulunamadı</h3>
                    <p class="text-zinc-400 text-sm max-w-md mx-auto">
                        Farklı bir arama terimi veya kategori filtresi deneyebilirsiniz.
                    </p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        grid.innerHTML = filtered.map(city => `
            <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all hover:bg-zinc-900/90 group shadow-lg">
                <div>
                    <!-- Header -->
                    <div class="flex items-start justify-between gap-3 mb-3">
                        <div>
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-1.5">
                                <i data-lucide="map-pin" class="w-3 h-3 text-cyan-400"></i> ${city.categoryLabel}
                            </span>
                            <h3 class="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">${city.name}</h3>
                        </div>
                        <div class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-400 font-bold text-xs shrink-0">
                            <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i> ${city.rating.toFixed(1)}
                        </div>
                    </div>

                    <p class="text-xs font-medium text-cyan-400/90 mb-2 italic">"${city.tagline}"</p>
                    <p class="text-zinc-400 text-xs leading-relaxed mb-4">${city.description}</p>

                    <!-- Metrics Grid -->
                    <div class="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 mb-4 text-xs">
                        <div class="flex items-center gap-2 text-zinc-300">
                            <i data-lucide="building-2" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
                            <span class="font-medium">${city.unisCount}</span>
                        </div>
                        <div class="flex items-center gap-2 text-zinc-300">
                            <i data-lucide="users" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
                            <span class="font-medium">${city.studentsCount}</span>
                        </div>
                        <div class="flex items-center gap-2 text-zinc-300">
                            <i data-lucide="home" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
                            <span class="font-medium">${city.kykCount}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i data-lucide="wallet" class="w-3.5 h-3.5 text-zinc-400 shrink-0"></i>
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold border ${city.rentColor}">${city.rentIndex}</span>
                        </div>
                    </div>

                    <!-- Highlights pills -->
                    <div class="flex flex-wrap gap-1.5 mb-4">
                        ${city.highlights.map(h => `
                            <span class="px-2 py-0.5 rounded-md text-[11px] bg-zinc-800/60 text-zinc-300 border border-zinc-700/50 flex items-center gap-1">
                                <i data-lucide="check" class="w-3 h-3 text-cyan-400"></i> ${h}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <!-- Footer Action & Top Unis -->
                <div class="pt-4 border-t border-zinc-800/80">
                    <div class="text-[11px] text-zinc-500 mb-2 font-medium">Öne Çıkan Üniversiteler:</div>
                    <div class="flex flex-wrap gap-1 mb-3">
                        ${city.topUnis.slice(0, 3).map(u => `
                            <a href="#/university?name=${encodeURIComponent(u)}" class="text-[11px] text-zinc-400 hover:text-cyan-400 bg-zinc-800/40 hover:bg-zinc-800 px-2 py-0.5 rounded transition-colors truncate max-w-[200px]" title="${u}">
                                ${u}
                            </a>
                        `).join('')}
                        ${city.allUnis.length > 3 ? `<span class="text-[10px] text-cyan-400 font-semibold self-center cursor-pointer open-city-modal-pill" data-city-id="${city.id}">+${city.allUnis.length - 3} daha</span>` : ''}
                    </div>
                    <button type="button" class="open-city-modal-btn w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-cyan-400 hover:text-zinc-950 text-zinc-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group/btn cursor-pointer" data-city-id="${city.id}">
                        <i data-lucide="building-2" class="w-3.5 h-3.5"></i>
                        <span>Şehirdeki Üniversiteleri İncele (${city.allUnis.length})</span>
                        <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform"></i>
                    </button>
                </div>
            </div>
        `).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Attach click events to "Şehirdeki Üniversiteleri İncele" buttons & pills
        grid.querySelectorAll('.open-city-modal-btn, .open-city-modal-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const cityId = btn.dataset.cityId;
                const foundCity = CITIES_DATA.find(c => c.id === cityId);
                if (foundCity) {
                    openCityModal(foundCity);
                }
            });
        });
    }

    // Filter pills event listeners
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => {
                p.classList.remove('bg-cyan-950/40', 'text-cyan-400', 'border-cyan-500/40', 'active-pill');
                p.classList.add('bg-zinc-900', 'text-zinc-400', 'border-zinc-800');
            });
            pill.classList.remove('bg-zinc-900', 'text-zinc-400', 'border-zinc-800');
            pill.classList.add('bg-cyan-950/40', 'text-cyan-400', 'border-cyan-500/40', 'active-pill');

            currentCategory = pill.dataset.category || 'all';
            renderCities();
        });
    });

    // Search input listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderCities();
        });
    }

    renderCities();
}

// ─── Sıralama Sayfası Mantığı (Ranking) ───────────────────

function initRankingPage() {
    const podiumContainer = document.getElementById('top-podium-cards');
    const listContainer = document.getElementById('ranking-list');
    const searchInput = document.getElementById('ranking-search-input');
    const tabButtons = document.querySelectorAll('#ranking-filter-tabs .rank-tab-btn');
    if (!podiumContainer || !listContainer) return;

    const RANKING_DATA = [
        {
            id: 'odtu',
            name: 'Orta Doğu Teknik Üniversitesi (ODTÜ)',
            shortName: 'ODTÜ',
            city: 'Ankara',
            type: 'Devlet',
            overall: 9.8,
            academic: 9.9,
            campus: 9.8,
            dorm: 9.4,
            transport: 9.6,
            reviewsCount: 1420,
            badge: 'Türkiye 1.si',
            quote: 'Yalıncak ormanı, Eymir Gölü, devrim stadyumu ve ödün vermeyen mühendislik disiplini.',
            logoLetter: 'O'
        },
        {
            id: 'boun',
            name: 'Boğaziçi Üniversitesi',
            shortName: 'Boğaziçi',
            city: 'İstanbul',
            type: 'Devlet',
            overall: 9.7,
            academic: 9.8,
            campus: 9.9,
            dorm: 8.8,
            transport: 9.5,
            reviewsCount: 1180,
            badge: 'Türkiye 2.si',
            quote: 'Güney Meydan manzarası, özgür düşünce ortamı ve dünya çapında mezun ağı.',
            logoLetter: 'B'
        },
        {
            id: 'itu',
            name: 'İstanbul Teknik Üniversitesi (İTÜ)',
            shortName: 'İTÜ',
            city: 'İstanbul',
            type: 'Devlet',
            overall: 9.6,
            academic: 9.8,
            campus: 9.4,
            dorm: 9.2,
            transport: 9.8,
            reviewsCount: 1650,
            badge: 'Türkiye 3.sü',
            quote: '250 yılı aşkın mühendislik hafızası, Arı Teknokent ve Ayazağa metro avantajı.',
            logoLetter: 'İ'
        },
        {
            id: 'bilkent',
            name: 'Bilkent Üniversitesi',
            shortName: 'Bilkent',
            city: 'Ankara',
            type: 'Vakıf',
            overall: 9.5,
            academic: 9.8,
            campus: 9.6,
            dorm: 9.6,
            transport: 9.1,
            reviewsCount: 890,
            badge: 'Vakıf Lideri',
            quote: 'Kütüphane olanakları, uluslararası yayın ortalaması ve kusursuz kampüs yönetimi.',
            logoLetter: 'B'
        },
        {
            id: 'koc',
            name: 'Koç Üniversitesi',
            shortName: 'Koç Üni',
            city: 'İstanbul',
            type: 'Vakıf',
            overall: 9.5,
            academic: 9.8,
            campus: 9.7,
            dorm: 9.7,
            transport: 8.4,
            reviewsCount: 760,
            badge: 'Öne Çıkan',
            quote: 'Sarıyer sırtlarında dünya standartlarında laboratuvarlar ve yüksek burs olanakları.',
            logoLetter: 'K'
        },
        {
            id: 'sabanci',
            name: 'Sabancı Üniversitesi',
            shortName: 'Sabancı',
            city: 'İstanbul',
            type: 'Vakıf',
            overall: 9.4,
            academic: 9.7,
            campus: 9.5,
            dorm: 9.6,
            transport: 8.3,
            reviewsCount: 680,
            badge: 'Yenilikçi',
            quote: 'Bölüm seçme özgürlüğü, disiplinlerarası müfredat ve güçlü teknoloji merkezi.',
            logoLetter: 'S'
        },
        {
            id: 'hacettepe',
            name: 'Hacettepe Üniversitesi',
            shortName: 'Hacettepe',
            city: 'Ankara',
            type: 'Devlet',
            overall: 9.3,
            academic: 9.6,
            campus: 9.2,
            dorm: 8.9,
            transport: 9.1,
            reviewsCount: 1340,
            badge: 'Sağlık & Tıp Lideri',
            quote: 'Beytepe yeşilliği, Sıhhiye tıp geleneği ve Türkiye\'nin en başarılı sağlık kadroları.',
            logoLetter: 'H'
        },
        {
            id: 'ytu',
            name: 'Yıldız Teknik Üniversitesi (YTÜ)',
            shortName: 'YTÜ',
            city: 'İstanbul',
            type: 'Devlet',
            overall: 9.2,
            academic: 9.3,
            campus: 9.1,
            dorm: 8.7,
            transport: 9.6,
            reviewsCount: 1450,
            badge: 'Teknopark Öncüsü',
            quote: 'Davutpaşa tarihi kışla yerleşkesi, devasa Yıldız Teknopark ve sanayi entegrasyonu.',
            logoLetter: 'Y'
        },
        {
            id: 'gsu',
            name: 'Galatasaray Üniversitesi (GSÜ)',
            shortName: 'GSÜ',
            city: 'İstanbul',
            type: 'Devlet',
            overall: 9.1,
            academic: 9.5,
            campus: 8.9,
            dorm: 7.9,
            transport: 9.7,
            reviewsCount: 520,
            badge: 'Butik Frankofon',
            quote: 'Ortaköy boğaz kıyısında Fransızca eğitim, güçlü hukuk ve diplomasi ekolü.',
            logoLetter: 'G'
        },
        {
            id: 'ege',
            name: 'Ege Üniversitesi',
            shortName: 'Ege Üni',
            city: 'İzmir',
            type: 'Devlet',
            overall: 9.0,
            academic: 9.1,
            campus: 9.3,
            dorm: 8.8,
            transport: 9.5,
            reviewsCount: 1120,
            badge: 'Ege\'nin İncisi',
            quote: 'Bornova kampüsünün metro bağlantısı, dev hastane kompleksi ve Akdeniz yaşam enerjisi.',
            logoLetter: 'E'
        },
        {
            id: 'anadolu',
            name: 'Anadolu Üniversitesi',
            shortName: 'Anadolu Üni',
            city: 'Eskişehir',
            type: 'Devlet',
            overall: 8.9,
            academic: 8.8,
            campus: 9.6,
            dorm: 9.2,
            transport: 9.4,
            reviewsCount: 960,
            badge: 'Öğrenci Kenti',
            quote: 'Yunus Emre Kampüsü\'nün sanatsal atmosferi, yeşil çimleri ve Eskişehir sosyal hayatı.',
            logoLetter: 'A'
        },
        {
            id: 'deu',
            name: 'Dokuz Eylül Üniversitesi',
            shortName: 'DEÜ',
            city: 'İzmir',
            type: 'Devlet',
            overall: 8.8,
            academic: 8.9,
            campus: 8.7,
            dorm: 8.4,
            transport: 9.0,
            reviewsCount: 880,
            badge: 'Köklü Devlet',
            quote: 'Tınaztepe kampüsü, Alsancak rektörlük çevresi ve Denizcilik/Tıp başarıları.',
            logoLetter: 'D'
        },
        {
            id: 'gtu',
            name: 'Gebze Teknik Üniversitesi (GTÜ)',
            shortName: 'GTÜ',
            city: 'Kocaeli',
            type: 'Devlet',
            overall: 8.7,
            academic: 9.4,
            campus: 8.2,
            dorm: 8.5,
            transport: 8.9,
            reviewsCount: 580,
            badge: 'Araştırma Odağı',
            quote: 'Marmaray durağı hemen kampüsün içinde; sanayinin kalbinde yüksek akademik yayın performansı.',
            logoLetter: 'G'
        }
    ];

    const metricLabels = {
        'overall': 'Genel Memnuniyet',
        'academic': 'Akademik Kalite',
        'campus': 'Kampüs & Sosyal',
        'dorm': 'Yurt & Yemekhane',
        'transport': 'Ulaşım & Lokasyon'
    };

    let activeSort = 'overall';
    let searchQuery = '';

    function renderRanking() {
        // 1. Filter
        const q = searchQuery.toLowerCase().trim();
        const filtered = RANKING_DATA.filter(uni => {
            return !q ||
                uni.name.toLowerCase().includes(q) ||
                uni.city.toLowerCase().includes(q) ||
                uni.quote.toLowerCase().includes(q);
        });

        // 2. Sort
        const sorted = [...filtered].sort((a, b) => {
            if (b[activeSort] !== a[activeSort]) {
                return b[activeSort] - a[activeSort];
            }
            return b.reviewsCount - a.reviewsCount;
        });

        if (sorted.length === 0) {
            podiumContainer.innerHTML = '';
            listContainer.innerHTML = `
                <div class="py-16 text-center">
                    <div class="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center mb-4">
                        <i data-lucide="search-x" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">Aramanızla eşleşen üniversite bulunamadı</h3>
                    <p class="text-zinc-400 text-sm max-w-md mx-auto">
                        Farklı bir okul adı veya şehir arayarak tekrar deneyebilirsiniz.
                    </p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        // Render Podium if not searching or if at least 3 items exist
        if (!q && sorted.length >= 3) {
            podiumContainer.style.display = 'grid';
            const first = sorted[0];
            const second = sorted[1];
            const third = sorted[2];

            podiumContainer.innerHTML = `
                <!-- 2. Sıra (Gümüş) -->
                <div class="order-2 md:order-1 rounded-2xl border border-zinc-700 bg-zinc-900/70 p-6 flex flex-col justify-between hover:border-zinc-500 transition-all shadow-xl">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-4">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 border border-zinc-600 text-zinc-300">
                                <i data-lucide="medal" class="w-3.5 h-3.5 text-zinc-300"></i> 2. Sıra
                            </span>
                            <span class="text-xs text-zinc-400 font-medium">${second.city} · ${second.type}</span>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-1">${second.name}</h3>
                        <p class="text-xs text-zinc-400 italic mb-4">"${second.quote}"</p>
                    </div>
                    <div class="pt-4 border-t border-zinc-800">
                        <div class="flex items-end justify-between mb-3">
                            <div>
                                <span class="text-[11px] text-zinc-500 uppercase block font-semibold">${metricLabels[activeSort]}</span>
                                <span class="text-3xl font-black text-zinc-200">${second[activeSort].toFixed(1)}<span class="text-xs text-zinc-500 font-normal"> /10</span></span>
                            </div>
                            <span class="text-xs text-zinc-400 flex items-center gap-1">
                                <i data-lucide="message-square" class="w-3.5 h-3.5 text-cyan-400"></i> ${second.reviewsCount} Yorum
                            </span>
                        </div>
                        <a href="#/university?name=${encodeURIComponent(second.name)}" class="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5">
                            <span>Okulu İncele</span>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </a>
                    </div>
                </div>

                <!-- 1. Sıra (Altın - Zirve) -->
                <div class="order-1 md:order-2 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-950/20 via-zinc-900/90 to-zinc-900 p-6 flex flex-col justify-between hover:border-amber-400 transition-all shadow-2xl relative -translate-y-2 md:-translate-y-4">
                    <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs shadow-lg uppercase tracking-wider flex items-center gap-1.5">
                        <i data-lucide="trophy" class="w-3.5 h-3.5"></i> Lider Şampiyon
                    </div>
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-4 mt-2">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 border border-amber-500/40 text-amber-300">
                                <i data-lucide="crown" class="w-3.5 h-3.5 text-amber-400"></i> 1. Sıra
                            </span>
                            <span class="text-xs text-zinc-400 font-medium">${first.city} · ${first.type}</span>
                        </div>
                        <h3 class="text-2xl font-black text-white mb-1">${first.name}</h3>
                        <p class="text-xs text-amber-200/80 italic mb-4">"${first.quote}"</p>
                    </div>
                    <div class="pt-4 border-t border-amber-500/20">
                        <div class="flex items-end justify-between mb-3">
                            <div>
                                <span class="text-[11px] text-amber-400/90 uppercase block font-semibold">${metricLabels[activeSort]}</span>
                                <span class="text-4xl font-black text-amber-400">${first[activeSort].toFixed(1)}<span class="text-xs text-zinc-400 font-normal"> /10</span></span>
                            </div>
                            <span class="text-xs text-zinc-300 flex items-center gap-1">
                                <i data-lucide="message-square" class="w-3.5 h-3.5 text-amber-400"></i> ${first.reviewsCount} Yorum
                            </span>
                        </div>
                        <a href="#/university?name=${encodeURIComponent(first.name)}" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20">
                            <span>Okulu İncele</span>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </a>
                    </div>
                </div>

                <!-- 3. Sıra (Bronz) -->
                <div class="order-3 md:order-3 rounded-2xl border border-amber-900/60 bg-zinc-900/70 p-6 flex flex-col justify-between hover:border-amber-700 transition-all shadow-xl">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-4">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/60 border border-amber-800/60 text-amber-400">
                                <i data-lucide="award" class="w-3.5 h-3.5 text-amber-500"></i> 3. Sıra
                            </span>
                            <span class="text-xs text-zinc-400 font-medium">${third.city} · ${third.type}</span>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-1">${third.name}</h3>
                        <p class="text-xs text-zinc-400 italic mb-4">"${third.quote}"</p>
                    </div>
                    <div class="pt-4 border-t border-zinc-800">
                        <div class="flex items-end justify-between mb-3">
                            <div>
                                <span class="text-[11px] text-zinc-500 uppercase block font-semibold">${metricLabels[activeSort]}</span>
                                <span class="text-3xl font-black text-amber-500/90">${third[activeSort].toFixed(1)}<span class="text-xs text-zinc-500 font-normal"> /10</span></span>
                            </div>
                            <span class="text-xs text-zinc-400 flex items-center gap-1">
                                <i data-lucide="message-square" class="w-3.5 h-3.5 text-cyan-400"></i> ${third.reviewsCount} Yorum
                            </span>
                        </div>
                        <a href="#/university?name=${encodeURIComponent(third.name)}" class="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5">
                            <span>Okulu İncele</span>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </a>
                    </div>
                </div>
            `;
        } else {
            podiumContainer.style.display = 'none';
        }

        // Render List for remaining ranks (or all if searched)
        const itemsForList = (!q && sorted.length >= 3) ? sorted.slice(3) : sorted;
        const startIndex = (!q && sorted.length >= 3) ? 3 : 0;

        listContainer.innerHTML = itemsForList.map((item, idx) => {
            const rank = startIndex + idx + 1;
            return `
                <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-zinc-700 hover:bg-zinc-900/90 transition-all group">
                    <!-- Left: Rank & Uni Info -->
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 text-zinc-300 font-bold flex items-center justify-center text-sm shrink-0 group-hover:border-cyan-400 group-hover:text-cyan-400 transition-colors">
                            #${rank}
                        </div>
                        <div>
                            <div class="flex flex-wrap items-center gap-2 mb-1">
                                <h4 class="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">${item.name}</h4>
                                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/50">${item.city}</span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/40 text-cyan-400 border border-cyan-500/30">${item.type}</span>
                            </div>
                            <p class="text-xs text-zinc-400 line-clamp-1 italic">"${item.quote}"</p>
                        </div>
                    </div>

                    <!-- Right: Scores & CTA -->
                    <div class="flex flex-wrap items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800/80">
                        <!-- Sub scores -->
                        <div class="hidden sm:grid grid-cols-4 gap-3 text-center text-[11px]">
                            <div>
                                <div class="text-zinc-500 text-[10px]">Akademik</div>
                                <div class="font-bold text-zinc-200">${item.academic.toFixed(1)}</div>
                            </div>
                            <div>
                                <div class="text-zinc-500 text-[10px]">Kampüs</div>
                                <div class="font-bold text-zinc-200">${item.campus.toFixed(1)}</div>
                            </div>
                            <div>
                                <div class="text-zinc-500 text-[10px]">Yurt/Yemek</div>
                                <div class="font-bold text-zinc-200">${item.dorm.toFixed(1)}</div>
                            </div>
                            <div>
                                <div class="text-zinc-500 text-[10px]">Ulaşım</div>
                                <div class="font-bold text-zinc-200">${item.transport.toFixed(1)}</div>
                            </div>
                        </div>

                        <!-- Highlighted Score -->
                        <div class="text-right shrink-0">
                            <div class="text-xs text-zinc-500">${metricLabels[activeSort]}</div>
                            <div class="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-1 justify-end">
                                <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>
                                <span>${item[activeSort].toFixed(1)}</span>
                                <span class="text-xs text-zinc-500 font-normal">/10</span>
                            </div>
                            <div class="text-[10px] text-zinc-500 flex items-center gap-1 justify-end">
                                <i data-lucide="check-circle" class="w-3 h-3 text-emerald-400"></i> ${item.reviewsCount} onaylı yorum
                            </div>
                        </div>

                        <a href="#/university?name=${encodeURIComponent(item.name)}" class="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-cyan-400 hover:text-zinc-950 text-zinc-200 font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0">
                            <span>İncele</span>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Tabs listener
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => {
                b.classList.remove('bg-cyan-400', 'text-zinc-950', 'active-tab');
                b.classList.add('bg-zinc-800', 'text-zinc-300');
            });
            btn.classList.remove('bg-zinc-800', 'text-zinc-300');
            btn.classList.add('bg-cyan-400', 'text-zinc-950', 'active-tab');

            activeSort = btn.dataset.sort || 'overall';
            renderRanking();
        });
    });

    // Search input listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderRanking();
        });
    }

    renderRanking();
}

// ─── Bölümler Sayfası Mantığı (Departments) ───────────────

function initDepartmentsPage() {
    const grid = document.getElementById('departments-grid');
    const searchInput = document.getElementById('dept-search-input');
    const filterPills = document.querySelectorAll('#dept-filter-pills .dept-filter-pill');
    if (!grid) return;

    const DEPARTMENTS_DATA = [
        {
            id: 'ceng',
            name: 'Bilgisayar Mühendisliği',
            category: 'eng',
            categoryLabel: 'Mühendislik & Bilişim',
            icon: 'cpu',
            demand: '%95 İstihdam Oranı',
            demandBadge: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            satisfaction: 4.8,
            difficulty: '4.6 / 5.0 (Yüksek)',
            salary: '₺45.000 - ₺120.000+',
            description: 'Yapay zeka, bulut sistemler, büyük veri ve yazılım mimarisi üzerine modern mühendislik eğitimi. Yurt dışı uzaktan çalışma (remote) ve staj olanakları en geniş alan.',
            topUnis: ['ODTÜ', 'İTÜ', 'Boğaziçi', 'Bilkent', 'Koç'],
            skills: ['Python / Go / Rust', 'Yapay Zeka & ML', 'Sistem Mimarisi', 'Algoritmalar']
        },
        {
            id: 'tip',
            name: 'Tıp Fakültesi',
            category: 'health',
            categoryLabel: 'Sağlık & Tıp',
            icon: 'activity',
            demand: '%100 İstihdam Garantisi',
            demandBadge: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            satisfaction: 4.7,
            difficulty: '4.9 / 5.0 (Çok Zor)',
            salary: '₺55.000 - ₺140.000+',
            description: '6 yıllık yoğun anatomi, patoloji ve klinik staj eğitimi. TUS (Tıpta Uzmanlık Sınavı) ile cerrahi veya dahili branşlaşma. Mezuniyet anında doğrudan kamu ataması.',
            topUnis: ['Hacettepe Üniversitesi', 'İstanbul Üniversitesi-Cerrahpaşa', 'Ankara Üniversitesi', 'Koç Üniversitesi'],
            skills: ['Klinik Teşhis', 'Cerrahi Pratik', 'Hasta İletişimi', 'Tıbbi Araştırma']
        },
        {
            id: 'seng',
            name: 'Yazılım Mühendisliği',
            category: 'eng',
            categoryLabel: 'Mühendislik & Bilişim',
            icon: 'code',
            demand: '%93 İstihdam Oranı',
            demandBadge: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            satisfaction: 4.7,
            difficulty: '4.2 / 5.0 (Orta-Zor)',
            salary: '₺40.000 - ₺110.000+',
            description: 'Büyük ölçekli yazılım geliştirme süreçleri, test mühendisliği, DevOps ve mobil uygulama geliştirme odaklı. Sektör stajları lisans döneminde başlar.',
            topUnis: ['İTÜ', 'Bahçeşehir Üniversitesi', 'Yaşar Üniversitesi', 'KTÜ'],
            skills: ['Mobil & Web Geliştirme', 'DevOps & CI/CD', 'Yazılım Testi', 'Mikroservisler']
        },
        {
            id: 'ee',
            name: 'Elektrik-Elektronik Mühendisliği',
            category: 'eng',
            categoryLabel: 'Mühendislik & Bilişim',
            icon: 'zap',
            demand: '%91 İstihdam Oranı',
            demandBadge: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            satisfaction: 4.6,
            difficulty: '4.8 / 5.0 (Çok Zor)',
            salary: '₺45.000 - ₺115.000+',
            description: 'Savunma sanayii (Aselsan, Baykar, Roketsan, TUSAŞ), haberleşme, yarıiletken çipler ve gömülü sistemlerin omurgası olan en köklü mühendislik dalı.',
            topUnis: ['ODTÜ', 'İTÜ', 'Boğaziçi', 'Bilkent Üniversitesi'],
            skills: ['Gömülü Sistemler (C/C++)', 'Sinyal İşleme', 'Mikroelektronik', 'RF & Haberleşme']
        },
        {
            id: 'law',
            name: 'Hukuk Fakültesi',
            category: 'law',
            categoryLabel: 'Sosyal & Hukuk',
            icon: 'scale',
            demand: 'Rekabetçi / Yüksek',
            demandBadge: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
            satisfaction: 4.4,
            difficulty: '4.5 / 5.0 (Zor)',
            salary: '₺30.000 - ₺90.000+',
            description: 'Medeni hukuk, ceza, ticaret ve uluslararası hukuk. Hakimlik, savcılık, serbest avukatlık, kurum avukatlığı veya uluslararası şirket danışmanlığı.',
            topUnis: ['İstanbul Üniversitesi', 'Galatasaray Üniversitesi', 'Ankara Üniversitesi', 'Bilkent Üniversitesi'],
            skills: ['Ceza & Ticaret Hukuku', 'Dava & Savunma', 'Sözleşme Analizi', 'Müzakere']
        },
        {
            id: 'ie',
            name: 'Endüstri Mühendisliği',
            category: 'eng',
            categoryLabel: 'Mühendislik & Bilişim',
            icon: 'trending-up',
            demand: '%89 İstihdam Oranı',
            demandBadge: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            satisfaction: 4.6,
            difficulty: '4.0 / 5.0 (Orta)',
            salary: '₺38.000 - ₺100.000+',
            description: 'Tedarik zinciri, optimizasyon, veri analitiği ve yönetim danışmanlığı. Mühendislik ve iş dünyasını kusursuz harmanlayan en esnek mühendislik bölümü.',
            topUnis: ['Boğaziçi Üniversitesi', 'ODTÜ', 'İTÜ', 'Koç Üniversitesi', 'Sabancı Üniversitesi'],
            skills: ['Tedarik Zinciri', 'Veri Analitiği (SQL/Tableau)', 'Yöneylem Araştırması', 'Proje Yönetimi']
        },
        {
            id: 'dent',
            name: 'Diş Hekimliği',
            category: 'health',
            categoryLabel: 'Sağlık & Tıp',
            icon: 'smile',
            demand: '%88 İstihdam Oranı',
            demandBadge: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            satisfaction: 4.5,
            difficulty: '4.7 / 5.0 (Zor & El Becerisi)',
            salary: '₺40.000 - ₺120.000+',
            description: '5 yıllık yoğun preklinik ve klinik eğitimi. El becerisi, estetik görüş ve medikal anatominin birleştiği; özel klinik veya kamu istihdamı.',
            topUnis: ['Hacettepe Üniversitesi', 'Yeditepe Üniversitesi', 'Marmara Üniversitesi', 'Ege Üniversitesi'],
            skills: ['Endodonti & Protez', 'İmplant Cerrahi', 'Estetik Diş Hekimliği', 'Klinik Pratik']
        },
        {
            id: 'econ',
            name: 'İktisat / Ekonomi',
            category: 'econ',
            categoryLabel: 'İktisadi & İdari',
            icon: 'bar-chart-2',
            demand: '%84 İstihdam Oranı',
            demandBadge: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
            satisfaction: 4.5,
            difficulty: '4.1 / 5.0 (Orta-Zor)',
            salary: '₺35.000 - ₺95.000+',
            description: 'Makroekonomi, para piyasaları, ekonometri ve bankacılık. Merkez Bankası, yatırım fonları, SPK veya denetim (Big 4) şirketlerinde kariyer.',
            topUnis: ['Boğaziçi', 'Bilkent Üniversitesi', 'ODTÜ', 'Koç Üniversitesi'],
            skills: ['Ekonometrik Modelleme (R/Stata)', 'Finansal Analiz', 'Para Piyasaları', 'Strateji Geliştirme']
        },
        {
            id: 'bus',
            name: 'İşletme (İngilizce)',
            category: 'econ',
            categoryLabel: 'İktisadi & İdari',
            icon: 'briefcase',
            demand: '%86 İstihdam Oranı',
            demandBadge: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
            satisfaction: 4.5,
            difficulty: '3.7 / 5.0 (Dengeli)',
            salary: '₺35.000 - ₺100.000+',
            description: 'Pazarlama, insan kaynakları, kurumsal finans ve stratejik yönetim. FMCG devleri ve küresel yönetim danışmanlığı kariyerleri.',
            topUnis: ['Koç Üniversitesi', 'Boğaziçi Üniversitesi', 'Sabancı Üniversitesi', 'ODTÜ'],
            skills: ['Marka Yönetimi', 'Kurumsal Finans', 'Liderlik & Sunum', 'Dijital Pazarlama']
        },
        {
            id: 'psy',
            name: 'Psikoloji',
            category: 'law',
            categoryLabel: 'Sosyal & Hukuk',
            icon: 'heart-handshake',
            demand: 'Orta / Yüksek',
            demandBadge: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
            satisfaction: 4.4,
            difficulty: '3.8 / 5.0 (Orta)',
            salary: '₺28.000 - ₺80.000+',
            description: 'Klinik, gelişim, bilişsel ve endüstriyel psikoloji. Yüksek lisans sonrası klinik psikolog veya kurumsal İK danışmanı olma fırsatları.',
            topUnis: ['Boğaziçi Üniversitesi', 'ODTÜ', 'Koç Üniversitesi', 'İstanbul Bilgi Üniversitesi'],
            skills: ['Bilişsel Davranışçı Terapi', 'İstatistik & SPSS', 'Test Uygulama', 'Danışmanlık']
        },
        {
            id: 'arch',
            name: 'Mimarlık',
            category: 'design',
            categoryLabel: 'Mimarlık & Sanat',
            icon: 'compass',
            demand: '%74 İstihdam Oranı',
            demandBadge: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
            satisfaction: 4.3,
            difficulty: '4.8 / 5.0 (Yüksek Proje Yükü)',
            salary: '₺30.000 - ₺85.000+',
            description: 'Tasarım stüdyoları, yapı bilgisi, render ve mimari proje çizimi. Yaratıcılık, gece uykusuzluğu ve jüri eleştirileriyle yoğrulan bir sanat & teknik alanı.',
            topUnis: ['İTÜ', 'ODTÜ', 'Mimar Sinan Güzel Sanatlar (MSGSÜ)', 'Yıldız Teknik'],
            skills: ['AutoCAD & Revit BIM', 'Rhino / 3ds Max Render', 'Maket Tasarımı', 'Yapı Bilgisi']
        },
        {
            id: 'interior',
            name: 'İç Mimarlık ve Çevre Tasarımı',
            category: 'design',
            categoryLabel: 'Mimarlık & Sanat',
            icon: 'layout',
            demand: '%72 İstihdam Oranı',
            demandBadge: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
            satisfaction: 4.2,
            difficulty: '4.4 / 5.0 (Zorlu Çizimler)',
            salary: '₺28.000 - ₺75.000+',
            description: 'Mekan tasarımı, mobilya ergonomisi, aydınlatma ve malzeme detaylandırması. Konut, otel, kafe ve ofis projelerinde bağımsız veya stüdyo çalışması.',
            topUnis: ['Mimar Sinan Güzel Sanatlar', 'Bilkent Üniversitesi', 'Hacettepe Üniversitesi', 'İTÜ'],
            skills: ['Mekan Çözümleme', 'Malzeme & Detay', 'Mobilya Tasarımı', '3D Görselleştirme']
        },
        {
            id: 'nurse',
            name: 'Hemşirelik',
            category: 'health',
            categoryLabel: 'Sağlık & Tıp',
            icon: 'shield-plus',
            demand: '%98 İstihdam Oranı',
            demandBadge: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
            satisfaction: 4.4,
            difficulty: '4.1 / 5.0 (Nöbet Sistemi)',
            salary: '₺38.000 - ₺70.000+',
            description: 'Yoğun bakım, cerrahi ve acil servis bakım süreçleri. Yurt dışında (özellikle Almanya ve İngiltere) dil denkliği ile anında istihdam imkanı.',
            topUnis: ['Hacettepe Üniversitesi', 'Ege Üniversitesi', 'Marmara Üniversitesi', 'Dokuz Eylül'],
            skills: ['Acil Müdahale', 'Hasta Bakım Planı', 'İlaç Yönetimi', 'Klinik Etik']
        }
    ];

    let currentCategory = 'all';
    let searchQuery = '';

    function renderDepartments() {
        const q = searchQuery.toLowerCase().trim();
        const filtered = DEPARTMENTS_DATA.filter(dept => {
            const matchesCat = currentCategory === 'all' || dept.category === currentCategory;
            const matchesSearch = !q ||
                dept.name.toLowerCase().includes(q) ||
                dept.categoryLabel.toLowerCase().includes(q) ||
                dept.description.toLowerCase().includes(q) ||
                dept.skills.some(s => s.toLowerCase().includes(q)) ||
                dept.topUnis.some(u => u.toLowerCase().includes(q));
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-16 text-center">
                    <div class="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center mb-4">
                        <i data-lucide="graduation-cap" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">Eşleşen bölüm bulunamadı</h3>
                    <p class="text-zinc-400 text-sm max-w-md mx-auto">
                        Farklı bir arama terimi veya kategori filtresi deneyebilirsiniz.
                    </p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        grid.innerHTML = filtered.map(dept => `
            <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all hover:bg-zinc-900/90 group shadow-lg">
                <div>
                    <!-- Category & Demand Badges -->
                    <div class="flex items-start justify-between gap-2 mb-3">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.04] border border-white/10 text-cyan-300">
                            <i data-lucide="${dept.icon}" class="w-3.5 h-3.5 text-cyan-400"></i> ${dept.categoryLabel}
                        </span>
                        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${dept.demandBadge} shrink-0">
                            ${dept.demand}
                        </span>
                    </div>

                    <!-- Title -->
                    <h3 class="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">${dept.name}</h3>

                    <!-- Rating & Difficulty Stats -->
                    <div class="flex items-center gap-4 mb-3 text-xs">
                        <div class="flex items-center gap-1 text-amber-400 font-bold">
                            <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i> ${dept.satisfaction.toFixed(1)}
                            <span class="text-zinc-500 font-normal">Memnuniyet</span>
                        </div>
                        <div class="text-zinc-500">·</div>
                        <div class="text-zinc-400">
                            <span class="text-zinc-500">Zorluk:</span> <strong class="text-zinc-300">${dept.difficulty}</strong>
                        </div>
                    </div>

                    <!-- Description -->
                    <p class="text-zinc-400 text-xs leading-relaxed mb-4">${dept.description}</p>

                    <!-- Salary bracket -->
                    <div class="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 mb-4 flex items-center justify-between text-xs">
                        <div class="flex items-center gap-2 text-zinc-400">
                            <i data-lucide="briefcase" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
                            <span>Ort. Başlangıç Maaşı:</span>
                        </div>
                        <span class="font-bold text-emerald-400">${dept.salary}</span>
                    </div>

                    <!-- Skills pills -->
                    <div class="mb-4">
                        <div class="text-[11px] text-zinc-500 mb-1.5 font-medium">Temel Beceriler:</div>
                        <div class="flex flex-wrap gap-1.5">
                            ${dept.skills.map(s => `
                                <span class="px-2 py-0.5 rounded-md text-[11px] bg-zinc-800/60 text-zinc-300 border border-zinc-700/50">
                                    ${s}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Top Unis -->
                <div class="pt-4 border-t border-zinc-800/80">
                    <div class="text-[11px] text-zinc-500 mb-2 font-medium">Bu Alanda Öne Çıkan Üniversiteler:</div>
                    <div class="flex flex-wrap gap-1.5">
                        ${dept.topUnis.map(u => `
                            <a href="#/university?name=${encodeURIComponent(u)}" class="text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-950/30 hover:bg-cyan-950/60 border border-cyan-500/20 px-2.5 py-1 rounded-lg transition-colors font-medium inline-flex items-center gap-1">
                                <span>${u}</span>
                                <i data-lucide="arrow-up-right" class="w-3 h-3 text-cyan-500/70"></i>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Filter pills event listeners
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => {
                p.classList.remove('bg-cyan-950/40', 'text-cyan-400', 'border-cyan-500/40', 'active-pill');
                p.classList.add('bg-zinc-900', 'text-zinc-400', 'border-zinc-800');
            });
            pill.classList.remove('bg-zinc-900', 'text-zinc-400', 'border-zinc-800');
            pill.classList.add('bg-cyan-950/40', 'text-cyan-400', 'border-cyan-500/40', 'active-pill');

            currentCategory = pill.dataset.category || 'all';
            renderDepartments();
        });
    });

    // Search input listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderDepartments();
        });
    }

    renderDepartments();
}

function initBlogPage() {
    // 1. Article database for reading modal
    const BLOG_ARTICLES = {
        'feat-1': {
            title: 'Yeni Başlayanlar İçin Üniversite Hayatta Kalma Rehberi: İlk Yılda Yapılan 10 Hata',
            category: 'Kampüs Yaşamı',
            readTime: '5 dk okuma',
            author: 'Can Berk D. · ODTÜ Endüstri',
            initials: 'CB',
            date: '12 Ekim 2026',
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
            content: `
                <p class="text-zinc-300 mb-4">Üniversiteye adım attığınız ilk aylar, hayatınızın en heyecan verici ama bir o kadar da kafa karıştırıcı dönemi olabilir. Lisedeki gibi bir zil çalmıyor, kimse ödevinizi yapmadınız diye arkanızdan koşmuyor. Bu sınırsız özgürlük, doğru yönetilmediğinde ciddi bir vize şoku ve motivasyon kaybına yol açabiliyor.</p>
                
                <h4 class="text-lg font-bold text-white mt-6 mb-2">1. "Derslere Gitmesem de Slaytlardan Geçerim" Yanılgısı</h4>
                <p class="text-zinc-300 mb-4">Öğretim görevlilerinin sınavda sorduğu en can alıcı sorular genellikle slaytlarda yazmayan, derste tahtaya çizdikleri veya vurguladıkları küçük örneklerden gelir. Devamsızlık sınırını sonuna kadar tüketmek yerine derslere aktif katılmak, finallerde sabahlamaktan kurtarır.</p>

                <h4 class="text-lg font-bold text-white mt-6 mb-2">2. Kulüplerde Aşırı Sorumluluk Yüklenmek</h4>
                <p class="text-zinc-300 mb-4">İlk hafta oryantasyonda 10 farklı kulübe üye olmak çok yaygındır. Ancak bir anda 4 farklı komitede görev alıp vizeleri kaçırmak ilk sene ortalamanızı (GPA) telafi edilmesi güç seviyelere çekebilir. İlginizi çeken 1 veya 2 kulüpte derinleşin.</p>

                <h4 class="text-lg font-bold text-white mt-6 mb-2">3. Bütçe ve Yurt/Ev Dengesi</h4>
                <p class="text-zinc-300 mb-4">Ayın ilk haftası burs ya da harçlık yattığında dışarıda kontrolsüz harcama yapıp son iki haftayı sadece makarna yiyerek geçirmek klasik bir birinci sınıf hatasıdır. Aylık sabit giderlerinizi baştan ayırın ve acil durum fonu oluşturun.</p>

                <h4 class="text-lg font-bold text-white mt-6 mb-2">4. İletişimden Çekinmek</h4>
                <p class="text-zinc-300 mb-4">Üst sınıflarla, asistanlarla ve bölüm danışmanınızla tanışmaktan asla çekinmeyin. Onların vereceği bir çıkmış soru havuzu veya staj tavsiyesi, haftalarca sürecek arayışınızı bir günde çözebilir.</p>
            `
        },
        'feat-2': {
            title: 'KYK Yurt ve Burs Başvurularında Dikkat Edilmesi Gereken Kritik Detaylar',
            category: 'Burs & Barınma',
            readTime: '3 dk okuma',
            author: 'Büşra Y. · İTÜ Mimarlık',
            initials: 'BY',
            date: '10 Ekim 2026',
            image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
            content: `
                <p class="text-zinc-300 mb-4">Her yıl yüz binlerce öğrencinin beklediği KYK burs ve yurt başvuru takvimi başladığında en çok karşılaşılan sorun hatalı bilgi girişi ve yedek liste takipsizliğidir.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">Gelir Beyanında Dikkat Edilecekler</h4>
                <p class="text-zinc-300 mb-4">E-Devlet entegrasyonu sayesinde tapu, araç ve vergi kayıtları otomatik çekilir. Aile hanesindeki kişi sayısı ve okuyan kardeş bilgisi puanlamada belirleyicidir. Yanıltıcı beyan durumunda burs kesilebilir.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">Yedek Sıralamalar Çok Hızlı İlerler</h4>
                <p class="text-zinc-300 mb-4">İlk yerleştirmede yurt çıkmadıysa kesinlikle umutsuzluğa kapılmayın. İlk 3-4 yedek alımında sıralamalar binlerce kişi geriye doğru açılır. Yurt hakkı kazandığınızda depozito ödemesi ve taahhütname onayını belirtilen süre içinde tamamlamayı unutmayın.</p>
            `
        },
        'feat-3': {
            title: 'Teknoloji Sektöründe Staj Bulmanın En Etkili 5 Yolu: GitHub ve LinkedIn',
            category: 'Staj & Kariyer',
            readTime: '4 dk okuma',
            author: 'Mert S. · Boğaziçi Bilgisayar',
            initials: 'MS',
            date: '8 Ekim 2026',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
            content: `
                <p class="text-zinc-300 mb-4">"Deneyimim yok, nasıl staj bulacağım?" sorusu hemen her mühendislik ve bilişim öğrencisinin ortak kabusudur. Şirketler stajyer adaylarında bitmiş bir kariyer değil, öğrenme tutkusu ve somut çaba ararlar.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">1. GitHub'ı Boş Bırakmayın</h4>
                <p class="text-zinc-300 mb-4">Okul ödevlerinizi dahi temiz bir README dosyası, ekran görüntüleri ve düzgün commit mesajlarıyla paylaşın. Biten tek bir kaliteli proje, içi boş 5 sertifikadan daha ikna edicidir.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">2. LinkedIn Soğuk Mesajlar (Cold Outreach)</h4>
                <p class="text-zinc-300 mb-4">İlgilendiğiniz şirkette çalışan mühendislere "Bana staj verir misiniz?" diye değil, "Şirketinizde kullandığınız teknoloji stack'i hakkında 10 dakika fikir danışabilir miyim?" şeklinde samimi ve profesyonel yaklaşın.</p>
            `
        },
        'grid-1': {
            title: 'Öğrenci Evi Mi, KYK Mı, Özel Yurt Mu? 2026 Maliyet ve Konfor Kıyaslaması',
            category: 'Burs & Barınma',
            readTime: '4 dk okuma',
            author: 'Deniz A. · Hacettepe',
            initials: 'DA',
            date: '6 Ekim 2026',
            image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
            content: `
                <p class="text-zinc-300 mb-4">Büyükşehirlerde üniversite kazananların ilk ve en zorlu kararı: Nerede kalacağım? 2026 yılı güncel verileriyle üç alternatifi masaya yatırdık.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">KYK Yurtları</h4>
                <p class="text-zinc-300 mb-4">Ekonomik açıdan en rakipsiz seçenektir. Sabah kahvaltısı ve akşam yemeği desteği sayesinde bütçeyi korur. Dezavantajı: Çok kişilik odalar ve giriş-çıkış saati kısıtlamaları.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">Öğrenci Evi</h4>
                <p class="text-zinc-300 mb-4">Maksimum özgürlük ve kişisel alan sunar. Ancak kira, aidat, internet ve faturaların yanı sıra temizlik ve yemek sorumluluğu tamamen sizdedir. Ev arkadaşı seçimi hayatidir.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">Özel Yurtlar</h4>
                <p class="text-zinc-300 mb-4">Otel konforuna en yakın modeldir; fatura derdi yoktur, çalışma salonları geniştir ancak maliyetleri çoğu zaman ev kiralarını aşabilmektedir.</p>
            `
        },
        'grid-2': {
            title: 'Öğrenci Kulüpleri Gerçekten Kariyerine Katkı Sağlar Mı? Sosyalleşmenin Ötesi',
            category: 'Kampüs Yaşamı',
            readTime: '3 dk okuma',
            author: 'Selin K. · YTÜ',
            initials: 'SK',
            date: '4 Ekim 2026',
            image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
            content: `
                <p class="text-zinc-300 mb-4">Kulüpler yalnızca kampüs çimlerinde gitar çalmaktan ibaret değildir. Aktif bir kulüp yöneticiliği, kurumsal bir şirkette stajyerlikten çok daha fazla inisiyatif alma fırsatı verir.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">Kriz ve Bütçe Yönetimi</h4>
                <p class="text-zinc-300 mb-4">500 kişilik bir zirve düzenlerken konuşmacının uçağının rötar yapması veya ana sponsorun son anda çekilmesi gibi krizleri yönetmek, mülakatlarda anlatacağınız en güçlü başarı hikayesine dönüşür.</p>
            `
        },
        'grid-3': {
            title: 'Erasmus+ ve Yurt Dışı Staj Bursları: Başvuru Aşamasından Kabul Mektubuna',
            category: 'Staj & Kariyer',
            readTime: '5 dk okuma',
            author: 'Emre T. · Koç Üni',
            initials: 'ET',
            date: '2 Ekim 2026',
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
            content: `
                <p class="text-zinc-300 mb-4">Avrupa'da bir dönem okumak veya yaz stajı yapmak, vizyonunuzu ve yabancı dil akıcılığınızı bir üst seviyeye taşır.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">Puan Hesaplama</h4>
                <p class="text-zinc-300 mb-4">Genellikle %50 GANO (Genel Not Ortalaması) + %50 Yabancı Dil Sınavı puanı baz alınır. Dil sınavına hazırlanırken dinleme (listening) ve konuşma (speaking) pratiklerini ihmal etmeyin.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">Kabul Mektubu (Invitation Letter)</h4>
                <p class="text-zinc-300 mb-4">Staj hareketliliğinde en önemli adım Avrupa'daki bir laboratuvar veya şirketten davet mektubu almaktır. Kişiselleştirilmiş e-postalar gönderin.</p>
            `
        },
        'grid-4': {
            title: 'Çift Anadal (ÇAP) ve Yandal Yapmak İsteyenler İçin Stratejik Planlama',
            category: 'Akademik Rehberler',
            readTime: '4 dk okuma',
            author: 'Ayşe N. · Bilkent',
            initials: 'AN',
            date: '30 Eylül 2026',
            image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
            content: `
                <p class="text-zinc-300 mb-4">İki ayrı diploma ile mezun olmak kulağa çok prestijli gelse de dönem başına 7-8 ders almak ciddi bir disiplin gerektirir.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">Ortak Derslerin Tespiti</h4>
                <p class="text-zinc-300 mb-4">ÇAP yapacağınız bölümle kendi bölümünüzün ortak havuz derslerini (Matematik, Fizik, İktisat vb.) önceden analiz edin. Ortak ders sayısı ne kadar çoksa, ders çakışması ve dönem uzama riski o kadar azalır.</p>
            `
        },
        'grid-5': {
            title: 'Vize ve Final Döneminde Tükenmişliği Önleme: Pomodoro ve Not Tutma',
            category: 'Akademik Rehberler',
            readTime: '3 dk okuma',
            author: 'Kaan V. · Ankara Tıp',
            initials: 'KV',
            date: '28 Eylül 2026',
            image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
            content: `
                <p class="text-zinc-300 mb-4">Sınav haftalarında arka arkaya içilen enerji içecekleri ve uykusuz geçen geceler zihinsel performansı düşürür.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">Pomodoro ve Aktif Hatırlama</h4>
                <p class="text-zinc-300 mb-4">50 dakika odaklanma + 10 dakika mola döngüleri kurun. Sayfalarca notu sadece okumak yerine kendi cümlelerinizle birine anlatıyormuş gibi özetleyin (Feynman Tekniği).</p>
            `
        },
        'grid-6': {
            title: 'Şehir Değiştirecek Üniversitelilere Tavsiyeler: İstanbul, Ankara ve İzmir',
            category: 'Kampüs Yaşamı',
            readTime: '4 dk okuma',
            author: 'Ece D. · Ege Üniversitesi',
            initials: 'ED',
            date: '25 Eylül 2026',
            image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&q=80&w=800',
            content: `
                <p class="text-zinc-300 mb-4">Farklı bir şehre taşınmak bağımsız bir birey olmanın ilk adımıdır. Ancak her şehrin kendine has dinamikleri vardır.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">İstanbul: Fırsatlar ve Mesafe</h4>
                <p class="text-zinc-300 mb-4">Sektörün kalbidir, staj ve etkinlikler sınırsızdır. Ancak ulaşım sürelerini hesaba katmalı, kampüse yakın konaklama tercih edilmelidir.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">Ankara: Tam Bir Öğrenci Şehri</h4>
                <p class="text-zinc-300 mb-4">Milli Kütüphane, Tunalı, Kızılay hattı ve sakin yapısıyla öğrencilerin ders çalışmaya ve akademik üretime en kolay odaklandığı şehirdir.</p>
                <h4 class="text-lg font-bold text-white mt-6 mb-2">İzmir: Özgürlük ve Sakinlik</h4>
                <p class="text-zinc-300 mb-4">Bornova ve Alsancak hattı, keyifli iklimi ve öğrencilere kucak açan sıcak atmosferiyle eşsiz bir üniversite deneyimi sunar.</p>
            `
        }
    };

    // 2. Kategori Filtreleme
    const filterButtons = document.querySelectorAll('#blog-category-filters .ks-blog-pill');
    const allCards = document.querySelectorAll('.ks-blog-card');
    const countBadge = document.getElementById('blog-articles-count');
    const featuredSection = document.getElementById('blog-featured-section');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedCategory = btn.dataset.category;
            let visibleCount = 0;

            allCards.forEach(card => {
                const cardCategory = card.dataset.category;
                const match = selectedCategory === 'all' || cardCategory === selectedCategory;
                
                if (match) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Adjust featured section visibility if no featured cards match
            if (featuredSection) {
                const featuredCards = featuredSection.querySelectorAll('.ks-blog-card');
                const hasVisibleFeatured = Array.from(featuredCards).some(c => c.style.display !== 'none');
                featuredSection.style.display = hasVisibleFeatured ? '' : 'none';
            }

            if (countBadge) {
                countBadge.textContent = `${visibleCount} rehber listeleniyor`;
            }
        });
    });

    // 3. Okuma Modalı Mantığı
    const modal = document.getElementById('ks-blog-modal');
    const modalClose = document.getElementById('ks-modal-close');
    const modalBottomClose = document.getElementById('ks-modal-bottom-close');
    const modalImg = document.getElementById('ks-modal-img');
    const modalBadge = document.getElementById('ks-modal-badge');
    const modalReadtime = document.getElementById('ks-modal-readtime');
    const modalTitle = document.getElementById('ks-modal-title');
    const modalAuthor = document.getElementById('ks-modal-author');
    const modalAvatar = document.getElementById('ks-modal-avatar');
    const modalDate = document.getElementById('ks-modal-date');
    const modalBody = document.getElementById('ks-modal-body');

    function openModal(postId) {
        const post = BLOG_ARTICLES[postId];
        if (!post || !modal) return;

        modalImg.src = post.image;
        modalBadge.textContent = post.category;
        modalReadtime.innerHTML = `<i data-lucide="clock" class="w-3.5 h-3.5 text-cyan-400"></i> ${post.readTime}`;
        modalTitle.textContent = post.title;
        modalAuthor.textContent = post.author;
        modalAvatar.textContent = post.initials || 'KS';
        modalDate.textContent = post.date;
        modalBody.innerHTML = post.content;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Attach click events to blog cards
    allCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open if clicked on direct link or button inside card
            if (e.target.closest('a') && !e.target.closest('a').href.endsWith('#/blog')) return;
            const postId = card.dataset.postId;
            if (postId) {
                openModal(postId);
            }
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBottomClose) modalBottomClose.addEventListener('click', closeModal);

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
            closeModal();
        }
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function initHomePage() {
    // 1. Search Bar Functionality (Adım 1)
    const searchInput = document.getElementById('hero-search-input');
    const searchBtn = document.getElementById('hero-search-btn');

    function handleHeroSearch() {
        if (!searchInput) return;
        const q = searchInput.value.trim().toLowerCase();
        if (!q) {
            navigateTo('university');
            return;
        }
        if (typeof TURKISH_UNIVERSITIES !== 'undefined') {
            const match = TURKISH_UNIVERSITIES.find(u => u.toLowerCase().includes(q));
            if (match) {
                selectedUniState = match;
                navigateTo('university', { name: match });
                return;
            }
        }
        navigateTo('university');
    }

    if (searchBtn) searchBtn.addEventListener('click', handleHeroSearch);
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleHeroSearch();
        });
    }

    // 2. Tag Pills Navigation (#İTÜ, #ODTÜ vb.)
    document.querySelectorAll('.hero-tag-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const uni = pill.dataset.uni;
            if (uni) {
                selectedUniState = uni;
                navigateTo('university', { name: uni });
            }
        });
    });

    // 3. Existing university pill buttons
    document.querySelectorAll('[data-university]').forEach(btn => {
        btn.addEventListener('click', () => {
            const uniName = btn.dataset.university;
            if (uniName) {
                selectedUniState = uniName;
                navigateTo('university', { name: uniName });
            }
        });
    });

    // 4. Update live review count
    const statReviews = document.getElementById('stat-reviews');
    if (statReviews) {
        const count = getSavedReviews().length;
        statReviews.textContent = count > 0 ? count + '+' : '—';
    }
}

// ─── Click Interceptor for Seamless SPA Navigation ───

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore external or new tab
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || link.target === '_blank') {
        return;
    }

    let target = null;
    let query = '';

    if (href === 'index.html' || href === './' || href === '/' || href === '#' || href.startsWith('#/home')) {
        target = 'home';
    } else if (href.startsWith('university.html') || href.startsWith('#/university')) {
        target = 'university';
        if (href.includes('?')) query = href.substring(href.indexOf('?') + 1);
    } else if (href.startsWith('compare.html') || href.startsWith('#/compare')) {
        target = 'compare';
    } else if (href.startsWith('review-form.html') || href.startsWith('#/review-form')) {
        target = 'review-form';
    } else if (href.startsWith('profile.html') || href.startsWith('#/profile')) {
        target = 'profile';
        if (href.includes('?')) query = href.substring(href.indexOf('?') + 1);
    } else if (href.startsWith('login.html') || href.startsWith('#/login')) {
        target = 'login';
    } else if (href.startsWith('#/')) {
        const clean = href.substring(2);
        if (clean.includes('?')) {
            target = clean.substring(0, clean.indexOf('?'));
            query = clean.substring(clean.indexOf('?') + 1);
        } else {
            target = clean;
        }
    }

    if (target) {
        e.preventDefault();
        const hash = `#/${target}${query ? '?' + query : ''}`;
        if (window.location.hash === hash) {
            renderCurrentRoute();
        } else {
            window.location.hash = hash;
        }
    }
});

// ─── App Lifecycle ────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Setup Hamburger
    setupNavEvents();

    // 2. Restore User Session if Token Exists
    try {
        const me = await api.getMe();
        if (me) {
            CURRENT_USER = {
                uid: me.id,
                name: me.name,
                initials: me.initials || getInitials(me.name),
                email: me.email
            };
            updateNavForUser(CURRENT_USER);
        } else {
            updateNavForUser(null);
        }
    } catch (e) {
        updateNavForUser(null);
    }

    // 3. Render initial route immediately from JS templates
    renderCurrentRoute();

    // 4. Fetch Reviews and Interactions from FastAPI SQLite Database
    await refreshAppData();
});

window.addEventListener('hashchange', () => {
    renderCurrentRoute();
});

// Vanta.js removed for clean dark aesthetic
