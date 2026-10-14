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
    const protectedRoutes = ['review-form'];
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

    // Build the actions HTML based on auth state
    let actionsHtml = `
        <button id="theme-btn" style="background:transparent; border:none; color:var(--color-text); cursor:pointer; font-size:1.2rem; display:flex; align-items:center;" aria-label="Temayı Değiştir">
            <span id="theme-icon">🌞</span>
        </button>
    `;

    if (user && user.uid !== 'guest') {
        actionsHtml += `
            <a href="#/profile" class="btn btn--outline" style="padding: 6px 12px; font-size:0.9rem;">Profilim</a>
            <a href="#/home" id="logout-btn" class="btn btn--outline" style="padding: 6px 12px; font-size:0.9rem; border-color: var(--color-danger); color: var(--color-danger);">Çıkış</a>
        `;
    } else {
        actionsHtml += `
            <a href="#/login" class="btn btn--primary" style="padding: 6px 16px; font-size:0.9rem;">Giriş Yap</a>
        `;
    }

    navActions.innerHTML = actionsHtml;

    // Theme logic
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = document.getElementById('theme-icon');

    const savedTheme = localStorage.getItem('kampus_sesi_theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('kampus_sesi_theme', 'light');
            themeIcon.textContent = '🌙';
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('kampus_sesi_theme', 'dark');
            themeIcon.textContent = '🌞';
        }
    });

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
        likeBtn.innerHTML = `👍 <span>${data.likes.length}</span>`;
    }
    if (dislikeBtn) {
        dislikeBtn.className = `btn-interaction btn-interaction-dislike ${isDisliked ? 'btn-interaction--active-dislike' : ''}`;
        dislikeBtn.innerHTML = `👎 <span>${data.dislikes.length}</span>`;
    }
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
    { id: 'kampus', label: '🏫 Kampüs', icon: '🏫' },
    { id: 'yemekhane', label: '🍽️ Yemekhane', icon: '🍽️' },
    { id: 'egitim', label: '📚 Eğitim', icon: '📚' },
    { id: 'kutuphane', label: '📖 Kütüphane', icon: '📖' },
    { id: 'sosyal', label: '🎉 Sosyal Hayat', icon: '🎉' },
    { id: 'ulasim', label: '🚌 Ulaşım', icon: '🚌' },
    { id: 'yurt', label: '🏠 Yurt Olanakları', icon: '🏠' },
];

function getTagLabel(tagId) {
    const tag = AVAILABLE_TAGS.find(t => t.id === tagId);
    return tag ? tag.label : tagId;
}

function renderStars(rating, interactive = false) {
    let html = `<div class="stars${interactive ? ' stars--interactive' : ''}">`;
    for (let i = 1; i <= 5; i++) {
        html += `<span class="stars__item${i <= rating ? ' stars__item--filled' : ''}" data-value="${i}">★</span>`;
    }
    html += '</div>';
    return html;
}

function renderTags(tagIds) {
    if (!tagIds) return '';
    return tagIds.map(id => `<span class="tag">${getTagLabel(id)}</span>`).join('');
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
      ${showUni ? `<div class="card__uni-name">📍 ${review.university}</div>` : ''}
      <div class="card__body">${review.text}</div>
      <div class="card__footer">
        <div class="card__tags">${renderTags(review.tags)}</div>
        <div class="card__actions">
            <div class="card__interactions">
                <button class="btn-interaction btn-interaction-like ${isLiked ? 'btn-interaction--active-like' : ''}" data-id="${review.id}">
                    👍 <span>${ints.likes.length}</span>
                </button>
                <button class="btn-interaction btn-interaction-dislike ${isDisliked ? 'btn-interaction--active-dislike' : ''}" data-id="${review.id}">
                    👎 <span>${ints.dislikes.length}</span>
                </button>
            </div>
            ${showDelete ? `<button class="btn btn--danger btn--sm" onclick="deleteReview('${review.id}')">🗑️ Sil</button>` : ''}
        </div>
      </div>
      <div class="card__thread">
        ${repliesHtml}
        ${replyFormHtml}
      </div>
    </article>
  `;
}

/** Show toast notification */
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

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
    let filterHTML = `<button class="tag tag--filter tag--active" data-filter="all">🔖 Tümü</button>`;
    AVAILABLE_TAGS.forEach(tag => {
        filterHTML += `<button class="tag tag--filter" data-filter="${tag.id}">${tag.label}</button>`;
    });
    filterBar.innerHTML = filterHTML;

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
          <div class="empty-state__icon">🔍</div>
          <p>Bu üniversite/etiket için değerlendirme bulunamadı.</p>
        </div>
      `;
            updateStats(allReviews);
            return;
        }

        reviewsContainer.innerHTML = filtered.map(r => renderReviewCard(r)).join('');
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
            renderKykSection([]);
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
    const protectedRoutes = ['review-form'];
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
        'profile': TEMPLATES.profile,
        'login': TEMPLATES.login,
        'blog': TEMPLATES.blog
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
        'profile': 'Profilim — Kampüs Sesi',
        'login': 'Giriş Yap — Kampüs Sesi',
        'blog': 'Blog & Rehberler — Kampüs Sesi'
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
    } else if (route === 'compare') {
        activeRenderers.compare = initComparePage();
    } else if (route === 'review-form') {
        initReviewForm();
    } else if (route === 'profile') {
        activeRenderers.profile = initProfilePage(params);
    } else if (route === 'login') {
        initLoginPage();
    } else if (route === 'home') {
        initHomePage();
    } else if (route === 'blog') {
        initBlogPage();
    }
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
