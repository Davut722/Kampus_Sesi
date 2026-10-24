/* ========================================
   Kampüs Sesi — Shared JavaScript (SPA Architecture + FastAPI Backend)
   ======================================== */

import { api } from './api.js?v=83';
import { TEMPLATES } from './templates.js?v=87';
import { initHomeShowcase } from './home.js?v=1';

function getInitials(name) {
    if (!name) return 'MS';
    const words = name.trim().split(' ');
    let initials = words[0][0].toUpperCase();
    if (words.length > 1) initials += words[words.length - 1][0].toUpperCase();
    return initials;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ─── SPA Router State ─────────────────────
let currentRoute = 'home';
let currentParams = new URLSearchParams();
let selectedUniState = 'Bandırma Onyedi Eylül Üniversitesi';

const activeRenderers = {
    university: null,
    profile: null,
    compare: null,
    home: null
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
let CURRENT_USER = { uid: 'guest', name: 'Misafir', initials: 'MS', email: '', role: 'guest' };

window.signUpBackend = async function(name, email, pass) {
    const user = await api.register(name, email, pass);
    CURRENT_USER = {
        uid: user.id,
        name: user.name,
        initials: user.initials || getInitials(user.name),
        email: user.email,
        role: user.role || 'user'
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
        email: user.email,
        role: user.role || 'user'
    };
    updateNavForUser(CURRENT_USER);
    showToast(`👋 Tekrar hoş geldin, ${user.name}!`);
    navigateTo('home');
    return user;
};

window.signOutBackend = async function() {
    api.logout();
    CURRENT_USER = { uid: 'guest', name: 'Misafir', initials: 'MS', email: '', role: 'guest' };
    updateNavForUser(null);
    showToast('👋 Başarıyla çıkış yapıldı.');
    navigateTo('home');
};

function updateNavForUser(user) {
    const navActions = document.getElementById('nav-actions');
    const drawerAdminItem = document.getElementById('drawer-admin-item');
    if (drawerAdminItem) {
        if (user && (user.role === 'admin' || user.role === 'moderator')) {
            drawerAdminItem.style.display = 'block';
        } else {
            drawerAdminItem.style.display = 'none';
        }
    }

    if (!navActions) return;

    let actionsHtml = '';

    if (user && user.uid !== 'guest') {
        const isAdminOrMod = user.role === 'admin' || user.role === 'moderator';
        const adminBtnHtml = isAdminOrMod ? `
            <a href="#/admin" class="btn btn--outline btn--sm border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/30">
                <i data-lucide="shield" class="icon-xs"></i> <span>Admin Paneli</span>
            </a>
        ` : '';

        actionsHtml = `
            ${adminBtnHtml}
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
let appDataLoaded = false;   // ilk API verisi gelene kadar skeleton gösterilir
let appDataFailed = false;   // API'ye ulaşılamadıysa ana sayfa vitrini boş durum mesajı gösterir

export async function refreshAppData() {
    try {
        const [reviews, interactions] = await Promise.all([
            api.getReviews(),
            api.getInteractions()
        ]);
        globalReviewsState = reviews || [];
        globalInteractionsState = interactions || {};
        appDataFailed = false;
    } catch (e) {
        appDataFailed = true;
        console.warn("Veri yüklenirken hata oluştu:", e);
    } finally {
        appDataLoaded = true;
        if (currentRoute === 'home' && activeRenderers.home) activeRenderers.home();
        if (currentRoute === 'university' && activeRenderers.university) activeRenderers.university();
        if (currentRoute === 'profile' && activeRenderers.profile) activeRenderers.profile();
        if (currentRoute === 'compare' && activeRenderers.compare) activeRenderers.compare();
    }
}

function getSavedReviews() {
    return globalReviewsState;
}

window.saveReview = async function(review) {
    const created = await api.createReview(review);
    const savedObj = {
        ...review,
        ...(created || {}),
        rating_dorm: created && created.rating_dorm !== undefined && created.rating_dorm !== null ? created.rating_dorm : review.rating_dorm,
        rating_food: created && created.rating_food !== undefined && created.rating_food !== null ? created.rating_food : review.rating_food,
        rating_transport: created && created.rating_transport !== undefined && created.rating_transport !== null ? created.rating_transport : review.rating_transport,
        rating_social: created && created.rating_social !== undefined && created.rating_social !== null ? created.rating_social : review.rating_social,
        rating_academic: created && created.rating_academic !== undefined && created.rating_academic !== null ? created.rating_academic : review.rating_academic,
        criteria: (created && created.criteria) || review.criteria
    };
    globalReviewsState.unshift(savedObj);
    if (currentRoute === 'university' && activeRenderers.university) activeRenderers.university();
    if (currentRoute === 'compare' && activeRenderers.compare) activeRenderers.compare();
    return savedObj;
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
        likeBtn.innerHTML = `<i data-lucide="thumbs-up" class="icon-xs"></i> <span>Faydalı (${data.likes.length})</span>`;
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

/** Parse review text into structured pros/cons and meta badges */
function parseReviewContent(review) {
    let pros = (review.pros || '').trim();
    let cons = (review.cons || '').trim();
    let dept = (review.department || '').trim();
    let sClass = (review.student_class || '').trim();
    let scholarship = (review.scholarship || '').trim();
    let rawText = (review.text || '').trim();

    if (pros || cons) {
        return { pros, cons, dept, sClass, scholarship, isStructured: true, plainText: '' };
    }

    // Check for appended metadata: (Bölüm: ... • Sınıf: ... • Burs: ...)
    const metaMatch = rawText.match(/\((Bölüm:[^)]+)\)/);
    if (metaMatch) {
        const metaStr = metaMatch[1];
        const dMatch = metaStr.match(/Bölüm:\s*([^•\)]+)/);
        if (dMatch && !dept) dept = dMatch[1].trim();
        const cMatch = metaStr.match(/Sınıf:\s*([^•\)]+)/);
        if (cMatch && !sClass) sClass = cMatch[1].trim();
        const bMatch = metaStr.match(/Burs:\s*([^•\)]+)/);
        if (bMatch && !scholarship) scholarship = bMatch[1].trim();
        rawText = rawText.replace(metaMatch[0], '').trim();
    }

    if (rawText.includes('Beğendiklerim:') || rawText.includes('Geliştirilebilecek Yönler:')) {
        const parts = rawText.split('Geliştirilebilecek Yönler:');
        if (parts.length === 2) {
            pros = parts[0].replace('Beğendiklerim:', '').trim();
            cons = parts[1].trim();
            return { pros, cons, dept, sClass, scholarship, isStructured: true, plainText: '' };
        } else if (rawText.includes('Beğendiklerim:')) {
            pros = rawText.replace('Beğendiklerim:', '').trim();
            return { pros, cons: '', dept, sClass, scholarship, isStructured: true, plainText: '' };
        } else if (rawText.includes('Geliştirilebilecek Yönler:')) {
            cons = rawText.replace('Geliştirilebilecek Yönler:', '').trim();
            return { pros: '', cons, dept, sClass, scholarship, isStructured: true, plainText: '' };
        }
    }

    return { pros: '', cons: '', dept, sClass, scholarship, isStructured: false, plainText: rawText };
}

window.toggleReviewReplies = function(id) {
    const box = document.getElementById(`reply-box-${id}`);
    if (!box) return;
    const isHidden = box.style.display === 'none' || !box.style.display;
    box.style.display = isHidden ? 'block' : 'none';
};

window.reportReview = function(id) {
    showToast('Geri bildiriminiz alındı. Moderatör ekibine iletildi.');
};

/** Render a single review card */
function renderReviewCard(review, options = {}) {
    const { showUni = false, showDelete = false } = options;
    const ints = getInteractions()[review.id] || { likes: [], dislikes: [] };
    const userIdentifier = CURRENT_USER.name;
    const isLiked = ints.likes.includes(userIdentifier);
    const parsed = parseReviewContent(review);

    // Process replies
    const replies = review.replies || [];
    let repliesHtml = '';
    if (replies.length > 0) {
        repliesHtml = `
            <div class="card__replies">
                ${replies.map(r => `
                    <div class="reply-item">
                        <div class="reply-item__header">
                            <span class="reply-item__user">${escapeHtml(r.user)}</span>
                            <span class="reply-item__date">${escapeHtml(r.date)}</span>
                        </div>
                        <div class="reply-item__text">${escapeHtml(r.text)}</div>
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

    // Metadata Badges (Department, Class, Scholarship, Recommendation, Education Status)
    const recBadgeHtml = (review.is_recommended === true || review.is_recommended === 1)
        ? `<span class="ed-badge ed-badge--rec"><i data-lucide="thumbs-up" class="icon-xs"></i> Tavsiye Ediyor</span>`
        : ((review.is_recommended === false || review.is_recommended === 0)
            ? `<span class="ed-badge ed-badge--nonrec"><i data-lucide="thumbs-down" class="icon-xs"></i> Tavsiye Etmiyor</span>`
            : '');

    const eduBadgeHtml = review.education_status === 'graduate'
        ? `<span class="ed-badge"><i data-lucide="graduation-cap" class="icon-xs"></i> Mezun${review.graduation_year ? ` (${review.graduation_year})` : ''}</span>`
        : (review.education_status === 'student' ? `<span class="ed-badge"><i data-lucide="user-check" class="icon-xs"></i> Öğrenci</span>` : '');

    const badgesHtml = (parsed.dept || parsed.sClass || parsed.scholarship || recBadgeHtml || eduBadgeHtml) ? `
        <div class="card__meta-badges">
            ${recBadgeHtml}
            ${eduBadgeHtml}
            ${parsed.dept ? `<span class="ed-badge"><i data-lucide="book-open" class="icon-xs"></i> ${escapeHtml(parsed.dept)}</span>` : ''}
            ${parsed.sClass ? `<span class="ed-badge"><i data-lucide="graduation-cap" class="icon-xs"></i> ${escapeHtml(parsed.sClass)}${parsed.sClass !== 'Mezun' ? '. Sınıf' : ''}</span>` : ''}
            ${parsed.scholarship && parsed.scholarship !== 'Belirtmek istemiyorum' ? `<span class="ed-badge"><i data-lucide="award" class="icon-xs"></i> ${escapeHtml(parsed.scholarship)}</span>` : ''}
        </div>
    ` : '';

    // Body content: dual structured blocks vs clean single block
    let bodyHtml = '';
    if (parsed.isStructured) {
        bodyHtml = `
            <div class="card__body card__body--split">
                ${parsed.pros ? `
                    <div class="review-block review-block--pro">
                        <div class="review-block__title"><i data-lucide="check" class="icon-xs"></i> Beğendiklerim</div>
                        <div class="review-block__text">${escapeHtml(parsed.pros)}</div>
                    </div>
                ` : ''}
                ${parsed.cons ? `
                    <div class="review-block review-block--con">
                        <div class="review-block__title"><i data-lucide="alert-circle" class="icon-xs"></i> Geliştirilebilecek Yönler</div>
                        <div class="review-block__text">${escapeHtml(parsed.cons)}</div>
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        bodyHtml = `<div class="card__body">${escapeHtml(parsed.plainText || review.text)}</div>`;
    }

    return `
    <article class="card ed-card review-card" data-anim="fade-up" data-id="${review.id}" data-tags="${review.tags ? review.tags.join(',') : ''}">
      <div class="card__header">
        ${review.is_anonymous ? `
          <div class="card__user">
            <div class="card__avatar card__avatar--anon"><i data-lucide="user" class="icon-sm"></i></div>
            <div>
              <div class="card__username">Anonim öğrenci</div>
              <div class="card__date">${escapeHtml(review.date)}</div>
            </div>
          </div>
        ` : `
          <a href="#/profile?user=${encodeURIComponent(review.user)}" class="card__user card__user--clickable">
            <div class="card__avatar">${escapeHtml(review.initials || 'ÖG')}</div>
            <div>
              <div class="card__username">${escapeHtml(review.user)}</div>
              <div class="card__date">${escapeHtml(review.date)}</div>
            </div>
          </a>
        `}
        ${renderStars(review.rating)}
      </div>

      ${badgesHtml}
      ${showUni ? `<div class="card__uni-name"><i data-lucide="map-pin" class="icon-xs"></i> ${escapeHtml(review.university)}</div>` : ''}
      ${bodyHtml}

      <div class="card__footer">
        <div class="card__tags">${renderTags(review.tags || [])}</div>
        <div class="card__actions">
            <button class="btn-interaction btn-interaction-like ${isLiked ? 'btn-interaction--active-like' : ''}" data-id="${review.id}" type="button" title="Faydalı buldum">
                <i data-lucide="thumbs-up" class="icon-xs"></i> <span>Faydalı (${ints.likes.length})</span>
            </button>
            <button type="button" class="btn btn--text btn--sm btn-reply-toggle" onclick="window.toggleReviewReplies('${review.id}')" title="Yanıtlara göz at">
                <i data-lucide="message-square" class="icon-xs"></i> <span>Yanıtla${replies.length ? ` (${replies.length})` : ''}</span>
            </button>
            <button type="button" class="btn btn--text btn--sm btn-report-review" onclick="window.reportReview('${review.id}')" title="Bu yorumu bildir">
                <i data-lucide="flag" class="icon-xs"></i> <span>Şikayet et</span>
            </button>
            ${showDelete ? `<button class="btn btn--danger btn--sm" onclick="deleteReview('${review.id}')"><i data-lucide="trash-2" class="icon-xs"></i> Sil</button>` : ''}
        </div>
      </div>

      <div class="card__thread" id="reply-box-${review.id}" style="display: none;">
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

    const savedTheme = localStorage.getItem('kampus_sesi_theme') || 'light';
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
    },
    'Zonguldak Bülent Ecevit Üniversitesi': {
        subtitle: 'Zonguldak, Türkiye · 1992\'den beri eğitim',
        rank: 'Top 45',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2070',
        aboutShort: 'Zonguldak Bülent Ecevit Üniversitesi (BEÜN), Batı Karadeniz\'in köklü mühendislik, tıp ve denizcilik geleneğini sürdüren öncü devlet üniversitesidir.',
        aboutLong: 'Karadeniz kıyısına hakim Farabi Merkez Kampüsü ve İbn-i Sina Sağlık Kampüsü ile öğrencilere doğayla iç içe, yürünebilir ve samimi bir kampüs ortamı sunar.',
        transport: [
            { from: 'Ankara', type: 'Otobüs', icon: 'bus', route: 'AŞTİ - Zonguldak Otogar', duration: '~3.5 Saat' },
            { from: 'İstanbul', type: 'Otobüs', icon: 'bus', route: 'Esenler / Dudullu - Zonguldak', duration: '~5 Saat' },
            { from: 'Karabük', type: 'Tren', icon: 'train', route: 'Karabük - Zonguldak (Bölgesel Tren)', duration: '~2 Saat 15 Dk' }
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

// ─── Canlı Ulaşım Modülü: Leaflet.js Harita Veri Seti & Başlatıcı ───────────
// MySQL `university_addresses` tablosu ve Google Haritalar ile birebir senkronize çalışan harita veri kaynağı.
const CAMPUS_MAP_DATA = {
    'Bandırma Onyedi Eylül Üniversitesi': {
        name: 'Bandırma Onyedi Eylül Üniversitesi',
        campus: 'Merkez Yerleşke (Yeni Mahalle / Bandırma)',
        city: 'Balıkesir',
        district: 'Bandırma',
        lat: 40.3374521,
        lng: 27.9360007,
        zoom: 16,
        info: 'Marmara Denizi kıyısında, Bandırma İDO Feribot İskelesi ve şehir merkezine 10 dakika mesafede konumlanan ana yerleşke. Açık Adres: Yeni, Şehit Astsubay Mustafa Soner Varlık Caddesi No:77, 10250 Bandırma/Balıkesir',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=40.3374521,27.9360007&query_place_id=ChIJBfiUD6jUtRQRgxxbvGQQkAk'
    },
    ...(typeof window !== 'undefined' && window.UNIVERSITY_ADDRESSES_DB ? window.UNIVERSITY_ADDRESSES_DB : {})
};

function findCampusMapEntry(uniName) {
    if (!uniName) return null;
    const clean = uniName.trim();
    const dbMap = (typeof window !== 'undefined' && window.UNIVERSITY_ADDRESSES_DB) ? window.UNIVERSITY_ADDRESSES_DB : {};

    if (dbMap[clean]) return dbMap[clean];
    if (CAMPUS_MAP_DATA[clean]) return CAMPUS_MAP_DATA[clean];

    const baseName = clean.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
    const lowerClean = clean.toLowerCase();

    for (const [k, v] of Object.entries(dbMap)) {
        const kLow = k.toLowerCase();
        const kBase = k.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
        if (kLow === lowerClean || kBase === baseName || kLow.includes(baseName) || baseName.includes(kBase)) {
            return v;
        }
    }
    return null;
}

let campusMapInstance = null;
let campusMapMarker = null;

/**
 * Seçili üniversite için Leaflet.js haritasını başlatır veya mevcut haritayı günceller.
 * Veritabanındaki `university_addresses` tablosundan gelen koordinat ve adres verilerini birebir kullanır.
 */
function initOrUpdateCampusMap(uniName, dbAddress = null) {
    const mapContainer = document.getElementById('campus-transport-map');
    const mapLabel = document.getElementById('campus-map-label');
    const resetBtn = document.getElementById('campus-map-reset-btn');
    const edgeTitle = document.getElementById('campus-map-edge-title');
    const edgeDesc = document.getElementById('campus-map-edge-desc');
    const gmapsBtn = document.getElementById('campus-map-gmaps-btn');

    if (!mapContainer || typeof L === 'undefined') return;

    // 1. Öncelikle veritabanındaki university_addresses tablosundan gelen veriyi (dbAddress) veya
    // senkronize UNIVERSITY_ADDRESSES_DB / CAMPUS_MAP_DATA kaydını kullan
    const matchedEntry = findCampusMapEntry(uniName);
    const fallbackData = matchedEntry || {
        name: uniName || 'Bandırma Onyedi Eylül Üniversitesi',
        campus: 'Merkez Kampüs Yerleşkesi',
        lat: 40.3374521,
        lng: 27.9360007,
        zoom: 16,
        info: `${uniName || 'Bandırma Onyedi Eylül Üniversitesi'} ana yerleşkesi ve şehir içi toplu taşıma bağlantı noktası.`,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(uniName || 'Bandırma Onyedi Eylül Üniversitesi')}`
    };

    const mapData = dbAddress ? {
        name: dbAddress.university_name || uniName || fallbackData.name,
        campus: dbAddress.campus_name || dbAddress.campus || fallbackData.campus,
        city: dbAddress.city || fallbackData.city || '',
        district: dbAddress.district || fallbackData.district || '',
        lat: Number(dbAddress.latitude ?? dbAddress.lat ?? fallbackData.lat),
        lng: Number(dbAddress.longitude ?? dbAddress.lng ?? fallbackData.lng),
        zoom: Number(dbAddress.zoom_level ?? dbAddress.zoom ?? fallbackData.zoom ?? 15),
        info: dbAddress.transport_info || dbAddress.full_address || dbAddress.info || fallbackData.info,
        googleMapsUrl: dbAddress.google_maps_url || dbAddress.googleMapsUrl || fallbackData.googleMapsUrl
    } : fallbackData;

    if (mapLabel) {
        mapLabel.textContent = `${mapData.name} — ${mapData.campus}`;
    }

    // Haritanın sağ alt kenarındaki bilgi & Google Haritalar kartını güncelle
    if (edgeTitle) edgeTitle.textContent = mapData.name;
    if (edgeDesc) edgeDesc.textContent = mapData.info;
    if (gmapsBtn) gmapsBtn.href = mapData.googleMapsUrl;

    // Eğer container değişmişse (SPA rota geçişi) eski harita örneğini temizle
    if (campusMapInstance && campusMapInstance.getContainer() !== mapContainer) {
        campusMapInstance.remove();
        campusMapInstance = null;
        campusMapMarker = null;
    }

    // Pine tıklandığında açılacak kompakt bilgi penceresi
    const popupHTML = `
        <div class="map-popup">
            <span class="map-popup__badge">Merkez Yerleşke</span>
            <h4 class="map-popup__title">${escapeHtml(mapData.name)}</h4>
            <p class="map-popup__desc" style="margin-bottom:0;">${escapeHtml(mapData.campus)}</p>
        </div>
    `;

    // Özel SVG Pin (Marker) ikonu
    const customIcon = L.divIcon({
        className: 'campus-custom-pin',
        html: `
            <div class="campus-pin-inner">
                <span class="campus-pin-pulse"></span>
                <div class="campus-pin-core">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                </div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -18]
    });

    if (!campusMapInstance) {
        // 1. Haritayı oluştur (Normal scroll sayfa kaydırmasını bozmaz, yalnızca Ctrl + Scroll ile yakınlaştırır)
        campusMapInstance = L.map(mapContainer, {
            center: [mapData.lat, mapData.lng],
            zoom: mapData.zoom,
            scrollWheelZoom: false,     // Normal scroll kapatıldı (yalnızca Ctrl + Scroll ile zoom aktif)
            touchZoom: true,            // İki parmakla büyütme/küçültme aktif
            doubleClickZoom: true,      // Çift tıklama ile yakınlaştırma aktif
            dragging: true,             // Rahat sürükleme aktif
            boxZoom: true,
            keyboard: true,
            zoomControl: false,         // Sol üst köşeye eklenecek
            zoomAnimation: true,        // GPU hızlandırmalı yumuşak zoom animasyonu
            markerZoomAnimation: true,
            zoomSnap: 0.5,              // Yarım kademeli net ve takılmayan zoom adımları
            zoomDelta: 0.5              // + / - butonları için yumuşak adım
        });

        campusMapInstance._lastTargetLat = mapData.lat;
        campusMapInstance._lastTargetLng = mapData.lng;

        // Sadece Ctrl + Scroll (veya Mac'te Cmd + Scroll / Touchpad iki parmak pinch) ile yumuşak zoom
        let wheelAccum = 0;
        let wheelTimer = null;
        mapContainer.addEventListener('wheel', (e) => {
            const zoomHintBadge = document.getElementById('campus-map-zoom-hint');
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                e.stopPropagation();
                if (zoomHintBadge) zoomHintBadge.classList.remove('is-warning');

                const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
                wheelAccum += dy;
                const lastClientX = e.clientX;
                const lastClientY = e.clientY;

                if (!wheelTimer) {
                    wheelTimer = setTimeout(() => {
                        wheelTimer = null;
                        if (!campusMapInstance || Math.abs(wheelAccum) < 4) {
                            wheelAccum = 0;
                            return;
                        }
                        const currentZoom = campusMapInstance.getZoom();
                        const step = Math.min(1.0, Math.max(0.5, Math.round((Math.abs(wheelAccum) / 140) * 2) / 2));
                        const targetZoom = wheelAccum < 0
                            ? Math.min(campusMapInstance.getMaxZoom(), currentZoom + step)
                            : Math.max(campusMapInstance.getMinZoom(), currentZoom - step);
                        wheelAccum = 0;

                        const rect = mapContainer.getBoundingClientRect();
                        const containerPoint = L.point(lastClientX - rect.left, lastClientY - rect.top);
                        campusMapInstance.setZoomAround(containerPoint, targetZoom, { animate: true });
                    }, 55);
                }
            } else {
                // Ctrl basılmadan scroll yapıldığında sayfa normal kaymaya devam eder, köşedeki rozet parlayarak bilgi verir
                if (zoomHintBadge) {
                    zoomHintBadge.classList.add('is-warning');
                    clearTimeout(zoomHintBadge._warnTimeout);
                    zoomHintBadge._warnTimeout = setTimeout(() => {
                        zoomHintBadge.classList.remove('is-warning');
                    }, 1300);
                }
            }
        }, { passive: false });

        // Zoom (+ / -) butonlarını sol üst köşeye yerleştir (Sağ alt köşedeki Google Maps butonuyla çakışmaz)
        L.control.zoom({
            position: 'topleft',
            zoomInTitle: 'Yakınlaştır',
            zoomOutTitle: 'Uzaklaştır'
        }).addTo(campusMapInstance);

        // 2. Açık kaynaklı resmi OpenStreetMap (OSM) harita katmanını ekle
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> katkıda bulunanlar',
            maxZoom: 19
        }).addTo(campusMapInstance);

        // 3. Kampüs pinini ekle (Haritanın ortasını kapatmaması için popup sadece pine tıklanınca açılır)
        campusMapMarker = L.marker([mapData.lat, mapData.lng], { icon: customIcon })
            .addTo(campusMapInstance)
            .bindPopup(popupHTML, { maxWidth: 240, closeButton: true });

        // Harita boyutunu doğrula
        setTimeout(() => {
            if (campusMapInstance) {
                campusMapInstance.invalidateSize();
            }
        }, 200);
    } else {
        const prevLat = Number(campusMapInstance._lastTargetLat ?? 0);
        const prevLng = Number(campusMapInstance._lastTargetLng ?? 0);
        const isSameTarget = Math.abs(prevLat - mapData.lat) < 0.00005 && Math.abs(prevLng - mapData.lng) < 0.00005;

        campusMapInstance._lastTargetLat = mapData.lat;
        campusMapInstance._lastTargetLng = mapData.lng;

        if (!isSameTarget) {
            campusMapInstance.closePopup();
            campusMapInstance.flyTo([mapData.lat, mapData.lng], mapData.zoom, {
                duration: 1.0
            });
        }
        if (campusMapMarker) {
            campusMapMarker.setLatLng([mapData.lat, mapData.lng]);
            campusMapMarker.setPopupContent(popupHTML);
        }
    }

    // "Kampüse Odakla" butonu tıklama olayı
    if (resetBtn) {
        resetBtn.onclick = () => {
            if (campusMapInstance) {
                campusMapInstance.closePopup();
                campusMapInstance.flyTo([mapData.lat, mapData.lng], mapData.zoom, { duration: 0.8 });
            }
        };
    }
}

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
            <li class="custom-select__option ${opt === selectedValue ? 'selected' : ''}" data-value="${opt === 'Seçiniz...' ? '' : opt}">
                ${opt}
            </li>
        `).join('');

        // Attach clicks
        optionsContainer.querySelectorAll('.custom-select__option').forEach(li => {
            li.addEventListener('click', (e) => {
                selectedValue = li.dataset.value;
                if (!selectedValue) {
                    const defaultPlaceholder = containerId.includes('dept') ? 'Bölüm ara…' : 'Üniversite seçin...';
                    triggerText.textContent = defaultPlaceholder;
                    triggerText.style.color = '';
                } else {
                    triggerText.textContent = selectedValue;
                    triggerText.style.color = 'var(--color-text)';
                }
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

    if (!reviewsContainer) return () => {};

    // All reviews pool
    const ALL_MOCK = [];

    // Selected University
    let selectedUni = initialUni || selectedUniState || 'Bandırma Onyedi Eylül Üniversitesi';
    selectedUniState = selectedUni;

    // Filter & sort state
    let currentTagFilter = 'all';
    let currentSort = 'newest';

    // Dormitory state
    let rawDorms = [];
    let currentDormFilter = 'all';
    let dormsExpanded = false;

    // Get reviews for current uni
    function getAllReviews() {
        const norm = (s) => String(s || '').replace(/\s*\([^)]*\)/g, '').trim().toLocaleLowerCase('tr');
        const target = norm(selectedUni);
        const userReviews = getSavedReviews().filter(r => norm(r.university) === target || r.university === selectedUni);
        const mockReviews = ALL_MOCK.filter(r => norm(r.university) === target || r.university === selectedUni);
        return [...userReviews, ...mockReviews];
    }

    // Helper: parse distance string to meters for sorting
    function parseDistanceMeters(distStr) {
        if (!distStr) return 999999;
        const s = String(distStr).toLowerCase();
        const kmMatch = s.match(/([\d\.,]+)\s*km/);
        if (kmMatch) return parseFloat(kmMatch[1].replace(',', '.')) * 1000;
        const mMatch = s.match(/([\d\.,]+)\s*m\b/);
        if (mMatch) return parseFloat(mMatch[1].replace(',', '.'));
        const minMatch = s.match(/([\d\.,]+)\s*dk/);
        if (minMatch) return parseFloat(minMatch[1].replace(',', '.')) * 80;
        const anyNum = s.match(/([\d\.,]+)/);
        if (anyNum) return parseFloat(anyNum[1].replace(',', '.')) * 1000;
        return 999999;
    }

    // Helper: Devlet vs Vakıf
    function detectUniType(name) {
        const n = (name || '').toLowerCase();
        const vakifList = [
            'vakıf', 'koç', 'sabancı', 'bilkent', 'yeditepe', 'başkent', 'bahçeşehir',
            'özyeğin', 'tobb', 'kadir has', 'bilgi', 'çankaya', 'acıbadem', 'bezmialem',
            'doğuş', 'haliç', 'ışık', 'istinye', 'kültür', 'maltepe', 'medipol', 'okan',
            'ted', 'toros', 'ufuk', 'yaşar', 'üsküdar', 'fenerbahçe', 'lokman hekim'
        ];
        return vakifList.some(k => n.includes(k)) ? 'Vakıf Üniversitesi' : 'Devlet Üniversitesi';
    }

    // Helper: Extract founded year
    function extractFoundedYear(subtitle) {
        if (!subtitle) return '—';
        const match = subtitle.match(/(\d{4})/);
        return match ? match[1] : '—';
    }

    // Helper: Extract city name
    function extractCity(details, uniName) {
        if (details && details.subtitle) {
            const parts = details.subtitle.split(',');
            if (parts.length > 0 && parts[0].trim()) return parts[0].trim();
        }
        const mapEntry = findCampusMapEntry(uniName);
        if (mapEntry && mapEntry.city) return mapEntry.city;
        return 'Türkiye';
    }

    // Update Filter Buttons with Dynamic Counts
    function renderFilterBar() {
        if (!filterBar) return;
        const allReviews = getAllReviews();
        const totalCount = allReviews.length;

        let filterHTML = `
            <button class="tag tag--filter ${currentTagFilter === 'all' ? 'tag--active' : ''}" data-filter="all">
                <i data-lucide="layers" class="icon-xs"></i> <span>Tümü</span> <span class="tag-count">(${totalCount})</span>
            </button>
        `;

        AVAILABLE_TAGS.forEach(tag => {
            const tagCount = allReviews.filter(r => r.tags && r.tags.includes(tag.id)).length;
            filterHTML += `
                <button class="tag tag--filter ${currentTagFilter === tag.id ? 'tag--active' : ''}" data-filter="${tag.id}">
                    <i data-lucide="${tag.icon}" class="icon-xs"></i> <span>${tag.label}</span> <span class="tag-count">(${tagCount})</span>
                </button>
            `;
        });

        filterBar.innerHTML = filterHTML;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Render review cards with sorting and tag filtering
    function renderReviews() {
        if (!appDataLoaded && window.AnimUtils) {
            reviewsContainer.innerHTML = window.AnimUtils.reviewSkeleton(3);
            return;
        }

        const allReviews = getAllReviews();
        let filtered = currentTagFilter === 'all'
            ? allReviews
            : allReviews.filter(r => r.tags && r.tags.includes(currentTagFilter));

        // Sort reviews
        if (currentSort === 'helpful') {
            filtered.sort((a, b) => {
                const scoreA = getReviewScore(a.id);
                const scoreB = getReviewScore(b.id);
                return scoreB - scoreA;
            });
        } else if (currentSort === 'highest') {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (currentSort === 'lowest') {
            filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        } else {
            // newest
            filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        }

        if (filtered.length === 0) {
            reviewsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon"><i data-lucide="message-square" class="icon-md"></i></div>
                    <h4 style="font-weight: 600; color: var(--color-text); margin-bottom: 4px;">Henüz bu kategoride değerlendirme yok</h4>
                    <p style="color: var(--color-text-dim); font-size: 0.88rem; margin-bottom: var(--space-md);">Bu üniversite için ilk deneyim ve izlenimlerini paylaşarak adaylara rehber ol.</p>
                    <a href="#/review-form?uni=${encodeURIComponent(selectedUni)}" class="btn btn--primary btn--sm">
                        <i data-lucide="edit-3" class="icon-xs"></i> İlk Değerlendirmeyi Sen Yaz
                    </a>
                </div>
            `;
        } else {
            reviewsContainer.innerHTML = filtered.map(r => renderReviewCard(r)).join('');
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
        updateStats(allReviews);
        renderFilterBar();
    }

    // Render Criteria Progress Bars in Sticky Sidebar
    function renderCriteriaBars(allReviews) {
        const criteriaList = document.getElementById('uni-criteria-list');
        if (!criteriaList) return;

        const CRITERIA_CONFIG = [
            { id: 'akademik', key: 'rating_academic', altKey: 'egitim', label: 'Akademik Kalite', icon: 'graduation-cap' },
            { id: 'yurt', key: 'rating_dorm', altKey: 'yurt', label: 'Yurt Olanakları', icon: 'home' },
            { id: 'yemekhane', key: 'rating_food', altKey: 'yemekhane', label: 'Yemekhane & Beslenme', icon: 'utensils' },
            { id: 'ulasim', key: 'rating_transport', altKey: 'ulasim', label: 'Ulaşım Kolaylığı', icon: 'bus' },
            { id: 'sosyal', key: 'rating_social', altKey: 'sosyal', label: 'Sosyal Yaşam', icon: 'sparkles' }
        ];

        let html = '';
        CRITERIA_CONFIG.forEach(crit => {
            const scores = [];
            (allReviews || []).forEach(r => {
                // Sadece geçerli puan verilmiş (1-5) yorumlar hesaba katılır
                let score = r[crit.key];
                if ((score === null || score === undefined || score === 0) && r.criteria) {
                    score = r.criteria[crit.id] || r.criteria[crit.altKey];
                }
                const num = Number(score);
                if (num >= 1 && num <= 5) {
                    scores.push(num);
                }
            });

            if (scores.length > 0) {
                const count = scores.length;
                const avg = (scores.reduce((a, b) => a + b, 0) / count).toFixed(1);
                const pct = Math.min(100, Math.max(0, Math.round((parseFloat(avg) / 5) * 100)));
                html += `
                    <div class="uni-criterion-row">
                        <div class="uni-criterion-head">
                            <span class="uni-criterion-label">
                                <i data-lucide="${crit.icon}" class="icon-xs crit-icon"></i> ${crit.label}
                            </span>
                            <span class="uni-criterion-score">${avg} <span class="uni-criterion-count">(${count} yorum)</span></span>
                        </div>
                        <div class="uni-criterion-bar" role="progressbar" aria-valuenow="${avg}" aria-valuemin="0" aria-valuemax="5">
                            <div class="uni-criterion-fill" style="width: ${pct}%;"></div>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="uni-criterion-row uni-criterion-row--empty">
                        <div class="uni-criterion-head">
                            <span class="uni-criterion-label">
                                <i data-lucide="${crit.icon}" class="icon-xs crit-icon"></i> ${crit.label}
                            </span>
                            <span class="uni-criterion-score uni-criterion-score--none">Henüz puanlanmadı</span>
                        </div>
                        <div class="uni-criterion-bar uni-criterion-bar--empty">
                            <div class="uni-criterion-fill" style="width: 0%;"></div>
                        </div>
                    </div>
                `;
            }
        });

        criteriaList.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Render Dormitories (KYK & Private)
    function renderKykSection(yurtlar) {
        const grid = document.getElementById('kyk-grid');
        const expandWrap = document.getElementById('dorm-expand-wrap');
        const totalCountEl = document.getElementById('dorms-total-count');
        const tabDormCountEl = document.getElementById('tab-dorms-count');
        if (!grid) return;

        rawDorms = Array.isArray(yurtlar) ? yurtlar : [];
        if (tabDormCountEl) tabDormCountEl.textContent = rawDorms.length;

        if (rawDorms.length === 0) {
            grid.innerHTML = '<div class="empty-state-text" style="color: var(--color-text-muted); padding: 1.5rem 0;">Bu üniversite çevresinde henüz kayıtlı yurt bilgisi bulunmuyor.</div>';
            if (expandWrap) expandWrap.style.display = 'none';
            return;
        }

        // Distance sorted
        let sorted = [...rawDorms].sort((a, b) => parseDistanceMeters(a.mesafe) - parseDistanceMeters(b.mesafe));

        // Gender filter
        let filtered = currentDormFilter === 'all'
            ? sorted
            : sorted.filter(y => (y.tip || '').toLowerCase().includes(currentDormFilter.toLowerCase()));

        if (totalCountEl) totalCountEl.textContent = filtered.length;

        // Show first 4 cards or all
        const visibleDorms = dormsExpanded ? filtered : filtered.slice(0, 4);

        if (expandWrap) {
            if (filtered.length > 4) {
                expandWrap.style.display = 'block';
                const expandBtn = document.getElementById('dorms-expand-btn');
                if (expandBtn) {
                    expandBtn.innerHTML = dormsExpanded
                        ? `Daha Az Göster <i data-lucide="chevron-up" class="icon-xs"></i>`
                        : `Tümünü Gör (${filtered.length}) <i data-lucide="chevron-down" class="icon-xs"></i>`;
                }
            } else {
                expandWrap.style.display = 'none';
            }
        }

        let html = '';
        visibleDorms.forEach(yurt => {
            let badgeClass = 'kyk-badge--karma';
            const tipLower = (yurt.tip || '').toLowerCase();
            if (tipLower.includes('kız')) badgeClass = 'kyk-badge--kiz';
            else if (tipLower.includes('erkek')) badgeClass = 'kyk-badge--erkek';

            html += `
                <div class="kyk-card ed-card">
                    <div class="kyk-card__header">
                        <h3 class="kyk-card__title">${escapeHtml(yurt.ad)}</h3>
                        <span class="kyk-badge ${badgeClass}">${escapeHtml(yurt.tip)}</span>
                    </div>
                    <div class="kyk-details-grid">
                        <div class="kyk-detail">
                            <i data-lucide="map-pin" class="icon-sm"></i>
                            <span>${escapeHtml(yurt.mesafe || 'Mesafesi belirtilmedi')}</span>
                        </div>
                        <div class="kyk-detail">
                            <i data-lucide="wallet" class="icon-sm"></i>
                            <span>${escapeHtml(yurt.ucret || 'Ücret bilgisi yok')}</span>
                        </div>
                        <div class="kyk-detail">
                            <i data-lucide="users" class="icon-sm"></i>
                            <span>Kapasite: ${escapeHtml(yurt.kapasite || 'Belirtilmedi')}</span>
                        </div>
                        <div class="kyk-detail kyk-detail--date">
                            <i data-lucide="calendar" class="icon-sm"></i>
                            <span>Güncelleme: ${escapeHtml(yurt.guncelleme || 'Dönem Başı 2024')}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Wikipedia image fallback helper
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

    // Update Hero and Sidebar Metadata
    function updateHero() {
        let details = UNI_DETAILS[selectedUni] ? { ...UNI_DETAILS[selectedUni] } : { ...GENERIC_UNI_DATA };
        const initialMapEntry = findCampusMapEntry(selectedUni);
        if (!UNI_DETAILS[selectedUni] && initialMapEntry && initialMapEntry.city) {
            const distPart = (initialMapEntry.district && initialMapEntry.district.toLowerCase() !== initialMapEntry.city.toLowerCase() && initialMapEntry.district !== 'Merkez')
                ? ` (${initialMapEntry.district})`
                : '';
            details.subtitle = `${initialMapEntry.city}${distPart}, Türkiye`;
        }

        const city = extractCity(details, selectedUni);
        const foundedYear = extractFoundedYear(details.subtitle);
        const uniType = detectUniType(selectedUni);

        // 1. Breadcrumb
        const bcCity = document.getElementById('uni-bc-city');
        const bcName = document.getElementById('uni-bc-name');
        if (bcCity) bcCity.textContent = city;
        if (bcName) bcName.textContent = selectedUni;

        // 2. Hero Header
        const heroTitleEl = document.getElementById('uni-hero-title');
        const heroTypeEl = document.getElementById('uni-hero-type');
        const heroCityEl = document.getElementById('uni-hero-city');
        const heroYearEl = document.getElementById('uni-hero-year');
        if (heroTitleEl) heroTitleEl.textContent = selectedUni;
        if (heroTypeEl) heroTypeEl.textContent = uniType;
        if (heroCityEl) heroCityEl.textContent = city;
        if (heroYearEl) heroYearEl.textContent = foundedYear !== '—' ? `Kuruluş: ${foundedYear}` : 'Türkiye';

        // 3. Hero Logo
        const heroImg = document.getElementById('hero-img');
        if (heroImg) {
            heroImg.src = details.image;
            heroImg.onerror = () => {
                heroImg.src = 'img/placeholder.jpg';
            };
        }

        // 4. Hero Action Links
        const addRevBtn = document.getElementById('uni-add-review-btn');
        const compareBtn = document.getElementById('uni-compare-btn');
        const sidebarAddRevBtn = document.getElementById('sidebar-add-review-btn');
        const mobileCtaBtn = document.getElementById('mobile-cta-btn');
        const mobileCtaUni = document.getElementById('mobile-cta-uni-name');

        if (addRevBtn) addRevBtn.href = `#/review-form?uni=${encodeURIComponent(selectedUni)}`;
        if (compareBtn) compareBtn.href = `#/compare?uni1=${encodeURIComponent(selectedUni)}`;
        if (sidebarAddRevBtn) sidebarAddRevBtn.href = `#/review-form?uni=${encodeURIComponent(selectedUni)}`;
        if (mobileCtaBtn) mobileCtaBtn.href = `#/review-form?uni=${encodeURIComponent(selectedUni)}`;
        if (mobileCtaUni) mobileCtaUni.textContent = selectedUni;

        // 5. Website Links
        const websiteBtn = document.getElementById('uni-website-btn');
        const sidebarWeb = document.getElementById('sidebar-info-web');
        if (websiteBtn) {
            if (details.website) {
                websiteBtn.href = details.website;
                websiteBtn.style.display = 'inline-flex';
            } else {
                websiteBtn.style.display = 'none';
            }
        }
        if (sidebarWeb && details.website) {
            sidebarWeb.href = details.website;
        }

        // 6. Sidebar Quick Facts
        const sbType = document.getElementById('sidebar-info-type');
        const sbCity = document.getElementById('sidebar-info-city');
        const sbYear = document.getElementById('sidebar-info-year');
        const sbMapUni = document.getElementById('sidebar-map-uni');
        const sbMapCity = document.getElementById('sidebar-map-city');

        if (sbType) sbType.textContent = uniType;
        if (sbCity) sbCity.textContent = city;
        if (sbYear) sbYear.textContent = foundedYear;
        if (sbMapUni) sbMapUni.textContent = selectedUni;
        if (sbMapCity) sbMapCity.textContent = `${city}, Türkiye`;

        // 7. About Text
        const textShort = document.getElementById('about-text-short');
        const textLong = document.getElementById('about-text-long');
        if (textShort) {
            textShort.textContent = typeof UNI_DETAILS[selectedUni] !== 'undefined'
                ? details.aboutShort
                : `${selectedUni}, ${details.aboutShort}`;
        }
        if (textLong) {
            textLong.textContent = details.aboutLong;
        }

        // 8. Favorite Button
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
                        try { favs = await api.getFavorites(); } catch(e) {}
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
                        showToast(`"${selectedUni}" favorilerden çıkarıldı.`);
                    } else {
                        if (CURRENT_USER && CURRENT_USER.uid !== 'guest') {
                            await api.addFavorite(selectedUni);
                        }
                        favs.push(selectedUni);
                        localStorage.setItem('kampus_sesi_favorites', JSON.stringify(favs));
                        showToast(`"${selectedUni}" favorilere eklendi!`);
                    }
                    await checkIsFav();
                } catch(err) {
                    showToast(`Hata: ${err.message || 'Favori işlemi başarısız.'}`);
                } finally {
                    favBtn.disabled = false;
                }
            };
        }

        // 9. Fetch dynamic data from API
        api.getUniversity(selectedUni).then(uniDb => {
            if (uniDb) {
                const currentTitle = document.getElementById('uni-hero-title');
                if (currentTitle && currentTitle.textContent.trim() === selectedUni.trim()) {
                    if (uniDb.image_url && uniDb.image_url.trim() !== '') {
                        if (heroImg) heroImg.src = uniDb.image_url;
                    } else {
                        fetchWikipediaImage(selectedUni).then(url => {
                            if (url && currentTitle && currentTitle.textContent.trim() === selectedUni.trim()) {
                                if (heroImg) heroImg.src = url;
                            }
                        });
                    }

                    if (uniDb.website_url && uniDb.website_url.trim() !== '') {
                        if (websiteBtn) {
                            websiteBtn.href = uniDb.website_url;
                            websiteBtn.style.display = 'inline-flex';
                        }
                        if (sidebarWeb) sidebarWeb.href = uniDb.website_url;
                    }

                    if (uniDb.address) {
                        initOrUpdateCampusMap(selectedUni, uniDb.address);
                    } else if (typeof api.getUniversityAddress === 'function') {
                        api.getUniversityAddress(uniDb.id || selectedUni).then(addr => {
                            if (addr && currentTitle && currentTitle.textContent.trim() === selectedUni.trim()) {
                                initOrUpdateCampusMap(selectedUni, addr);
                            }
                        }).catch(() => {});
                    }

                    api.getDorms(uniDb.id).then(dorms => {
                        renderKykSection(dorms);
                    }).catch(() => {
                        renderKykSection([]);
                    });
                }
            }
        }).catch(err => {
            console.warn("DB'den universite bilgisi alinirken fallback:", err);
            api.getDorms(selectedUni).then(dorms => {
                renderKykSection(dorms);
            }).catch(() => {
                renderKykSection([]);
            });
        });

        // 10. Update Transportation Cards
        const transportGrid = document.getElementById('transport-grid');
        if (transportGrid) {
            let transportHTML = '';
            const routes = details.transport || [];
            routes.forEach(route => {
                let iconClass = 'is-bus';
                if (route.icon === 'train') iconClass = 'is-train';
                if (route.icon === 'ferry' || route.icon === 'ship') iconClass = 'is-ferry';
                if (route.icon === 'plane') iconClass = 'is-ferry';
                const lucideIcon = route.icon === 'ferry' ? 'ship' : route.icon;

                transportHTML += `
                    <div class="transport-card ed-card">
                        <div class="transport-card__icon-wrapper ${iconClass}">
                            <i data-lucide="${lucideIcon}"></i>
                        </div>
                        <div class="transport-card__info">
                            <h3 class="transport-card__route">${escapeHtml(route.from)} <i data-lucide="arrow-right" class="icon-xs"></i> Kampüs</h3>
                            <p class="transport-card__type"><strong style="color:var(--color-text); font-weight: 500;">${escapeHtml(route.type)}</strong> • ${escapeHtml(route.route)}</p>
                        </div>
                        <div class="transport-card__duration">
                            <i data-lucide="clock" class="icon-xs"></i>
                            <span>${escapeHtml(route.duration)}</span>
                        </div>
                    </div>
                `;
            });
            transportGrid.innerHTML = transportHTML;
        }

        // Initialize Leaflet Map
        initOrUpdateCampusMap(selectedUni);

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Update Statistics (Average Score, Counts, Recommendation Rate, Low Review Warning)
    function updateStats(reviews) {
        const statAvg = document.getElementById('stat-avg');
        const statCount = document.getElementById('stat-count');
        const recBadge = document.getElementById('hero-rec-badge');
        const recText = document.getElementById('hero-rec-text');
        const lowReviewsNote = document.getElementById('hero-low-reviews-note');
        const rankBadge = document.getElementById('stat-rank-badge');
        const statRank = document.getElementById('stat-rank');
        const starsDisplay = document.getElementById('hero-stars-display');
        const tabRevCount = document.getElementById('tab-reviews-count');
        const revHeaderCount = document.getElementById('reviews-header-count');

        const count = reviews.length;
        if (statCount) statCount.textContent = count;
        if (tabRevCount) tabRevCount.textContent = count;
        if (revHeaderCount) revHeaderCount.textContent = count;

        let details = UNI_DETAILS[selectedUni] || GENERIC_UNI_DATA;

        if (count > 0) {
            const avg = (reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1);
            if (statAvg) statAvg.textContent = avg;
            if (starsDisplay) {
                const rounded = Math.round(parseFloat(avg));
                starsDisplay.textContent = '★'.repeat(rounded) + '☆'.repeat(Math.max(0, 5 - rounded));
            }

            // Recommendation Rate (Gerçek tavsiye verisinden hesaplanır; veri yoksa rozet gizlenir)
            const recResponses = reviews.filter(r => r.is_recommended !== null && r.is_recommended !== undefined);
            if (recResponses.length > 0) {
                const positiveCount = recResponses.filter(r => r.is_recommended === true || r.is_recommended === 1).length;
                const recRate = Math.round((positiveCount / recResponses.length) * 100);
                if (recText) recText.textContent = `%${recRate} Tavsiye Ediyor`;
                if (recBadge) recBadge.style.display = 'inline-flex';
            } else {
                if (recBadge) recBadge.style.display = 'none';
            }
        } else {
            if (statAvg) statAvg.textContent = '—';
            if (starsDisplay) starsDisplay.textContent = '☆☆☆☆☆';
            if (recText) recText.textContent = '— Tavsiye';
            if (recBadge) recBadge.style.display = 'none';
        }

        // Less than 10 reviews rule: show warning, hide rank badge
        if (count < 10) {
            if (lowReviewsNote) lowReviewsNote.style.display = 'inline-flex';
            if (rankBadge) rankBadge.style.display = 'none';
        } else {
            if (lowReviewsNote) lowReviewsNote.style.display = 'none';
            if (details.rank && details.rank !== '—') {
                if (statRank) statRank.textContent = details.rank;
                if (rankBadge) rankBadge.style.display = 'inline-flex';
            } else {
                if (rankBadge) rankBadge.style.display = 'none';
            }
        }

        // Update Criteria Bars
        renderCriteriaBars(reviews);
    }

    // Initialize Sticky Tabs Scroll Spy & Navigation
    function initStickyTabs() {
        const tabs = document.querySelectorAll('.ed-uni-tab');
        const sections = ['sec-genel', 'sec-yorumlar', 'sec-yurtlar', 'sec-ulasim']
            .map(id => document.getElementById(id))
            .filter(Boolean);

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = tab.dataset.target;
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    const offset = 120;
                    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });

                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                }
            });
        });

        // Scroll spy
        function onScroll() {
            const scrollPos = window.pageYOffset + 140;
            let currentSecId = sections[0] ? sections[0].id : '';

            for (let i = 0; i < sections.length; i++) {
                const sec = sections[i];
                if (sec.offsetTop <= scrollPos) {
                    currentSecId = sec.id;
                }
            }

            tabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.target === currentSecId);
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Initialize Leaflet Map Collapsible & Sidebar Mini Map preview
    function initCampusMapToggle() {
        const mapWrapper = document.getElementById('campus-map-wrapper');
        const toggleBtn = document.getElementById('btn-toggle-campus-map');
        const toggleBtnText = document.getElementById('btn-toggle-campus-map-text');
        const sidebarExpandBtn = document.getElementById('sidebar-expand-map-btn');

        function openMap() {
            if (!mapWrapper) return;
            mapWrapper.style.display = 'block';
            mapWrapper.classList.remove('is-collapsed');
            if (toggleBtnText) toggleBtnText.textContent = 'Haritayı Gizle';
            if (toggleBtn) {
                toggleBtn.classList.add('active');
            }
            setTimeout(() => {
                if (typeof campusMapInstance !== 'undefined' && campusMapInstance) {
                    campusMapInstance.invalidateSize();
                }
            }, 180);
        }

        function closeMap() {
            if (!mapWrapper) return;
            mapWrapper.style.display = 'none';
            mapWrapper.classList.add('is-collapsed');
            if (toggleBtnText) toggleBtnText.textContent = 'Canlı Kampüs Haritasını Göster';
            if (toggleBtn) {
                toggleBtn.classList.remove('active');
            }
        }

        if (toggleBtn && mapWrapper) {
            toggleBtn.addEventListener('click', () => {
                const isHidden = mapWrapper.style.display === 'none' || mapWrapper.classList.contains('is-collapsed');
                if (isHidden) {
                    openMap();
                } else {
                    closeMap();
                }
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        }

        if (sidebarExpandBtn) {
            sidebarExpandBtn.addEventListener('click', () => {
                openMap();
                const ulasimSec = document.getElementById('sec-ulasim');
                if (ulasimSec) {
                    const top = ulasimSec.getBoundingClientRect().top + window.pageYOffset - 120;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        }
    }

    // Initialize Dormitory Filter Chips & Expand Button
    function initDormControls() {
        const chipsContainer = document.getElementById('dorm-filter-chips');
        const expandBtn = document.getElementById('dorms-expand-btn');

        if (chipsContainer) {
            chipsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.dorm-chip');
                if (!btn) return;

                chipsContainer.querySelectorAll('.dorm-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentDormFilter = btn.dataset.type || 'all';
                dormsExpanded = false; // reset expand on filter change
                renderKykSection(rawDorms);
            });
        }

        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                dormsExpanded = !dormsExpanded;
                renderKykSection(rawDorms);
            });
        }
    }

    // Initialize Sorting & Tag Filter Handlers for Reviews
    function initReviewControls() {
        // Tag filters
        if (filterBar) {
            filterBar.addEventListener('click', (e) => {
                const btn = e.target.closest('.tag--filter');
                if (!btn) return;

                filterBar.querySelectorAll('.tag--filter').forEach(b => b.classList.remove('tag--active'));
                btn.classList.add('tag--active');
                currentTagFilter = btn.dataset.filter || 'all';
                renderReviews();
            });
        }

        // Sort select
        const sortSelect = document.getElementById('reviews-sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                currentSort = e.target.value;
                renderReviews();
            });
        }
    }

    // Initialize About Read More Toggle
    function initAboutToggle() {
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
    }

    // Initialize University Search Combobox with Keyboard Navigation & Acronym Support
    function initUniCombobox() {
        const input = document.getElementById('uni-combobox-input');
        const listbox = document.getElementById('uni-combobox-listbox');
        const clearBtn = document.getElementById('uni-combobox-clear');
        if (!input || !listbox) return;

        const uniList = (typeof TURKISH_UNIVERSITIES !== 'undefined' && Array.isArray(TURKISH_UNIVERSITIES))
            ? TURKISH_UNIVERSITIES
            : Object.keys(UNI_DETAILS);

        const ACRONYM_MAP = {
            'odtu': 'Orta Doğu Teknik Üniversitesi (ODTÜ)',
            'odtü': 'Orta Doğu Teknik Üniversitesi (ODTÜ)',
            'itu': 'İstanbul Teknik Üniversitesi (İTÜ)',
            'itü': 'İstanbul Teknik Üniversitesi (İTÜ)',
            'ytu': 'Yıldız Teknik Üniversitesi (YTÜ)',
            'ytü': 'Yıldız Teknik Üniversitesi (YTÜ)',
            'boun': 'Boğaziçi Üniversitesi',
            'bogazici': 'Boğaziçi Üniversitesi',
            'boğaziçi': 'Boğaziçi Üniversitesi',
            'hacettepe': 'Hacettepe Üniversitesi',
            'deu': 'Dokuz Eylül Üniversitesi',
            'deü': 'Dokuz Eylül Üniversitesi',
            'ege': 'Ege Üniversitesi',
            'iu': 'İstanbul Üniversitesi',
            'iü': 'İstanbul Üniversitesi',
            'iuc': 'İstanbul Üniversitesi-Cerrahpaşa',
            'iüc': 'İstanbul Üniversitesi-Cerrahpaşa',
            'marmara': 'Marmara Üniversitesi',
            'gtu': 'Gebze Teknik Üniversitesi',
            'gtü': 'Gebze Teknik Üniversitesi',
            'iyte': 'İzmir Yüksek Teknoloji Enstitüsü (İYTE)',
            'anadolu': 'Anadolu Üniversitesi',
            'tobb': 'TOBB Ekonomi ve Teknoloji Üniversitesi',
            'koc': 'Koç Üniversitesi',
            'koç': 'Koç Üniversitesi',
            'sabanci': 'Sabancı Üniversitesi',
            'sabancı': 'Sabancı Üniversitesi',
            'bilkent': 'İhsan Doğramacı Bilkent Üniversitesi',
            'sau': 'Sakarya Üniversitesi',
            'saü': 'Sakarya Üniversitesi',
            'gazi': 'Gazi Üniversitesi',
            'baun': 'Balıkesir Üniversitesi',
            'baün': 'Balıkesir Üniversitesi',
            'banu': 'Bandırma Onyedi Eylül Üniversitesi',
            'banü': 'Bandırma Onyedi Eylül Üniversitesi',
            'ktu': 'Karadeniz Teknik Üniversitesi',
            'ktü': 'Karadeniz Teknik Üniversitesi',
            'esogu': 'Eskişehir Osmangazi Üniversitesi',
            'esogü': 'Eskişehir Osmangazi Üniversitesi',
            'pau': 'Pamukkale Üniversitesi',
            'paü': 'Pamukkale Üniversitesi',
            'msku': 'Muğla Sıtkı Koçman Üniversitesi',
            'mskü': 'Muğla Sıtkı Koçman Üniversitesi',
            'adu': 'Aydın Adnan Menderes Üniversitesi',
            'adü': 'Aydın Adnan Menderes Üniversitesi',
            'comu': 'Çanakkale Onsekiz Mart Üniversitesi',
            'çomü': 'Çanakkale Onsekiz Mart Üniversitesi',
            'beun': 'Zonguldak Bülent Ecevit Üniversitesi',
            'beün': 'Zonguldak Bülent Ecevit Üniversitesi',
            'omu': 'Ondokuz Mayıs Üniversitesi',
            'omü': 'Ondokuz Mayıs Üniversitesi',
            'cbu': 'Manisa Celal Bayar Üniversitesi',
            'cbü': 'Manisa Celal Bayar Üniversitesi',
            'neu': 'Necmettin Erbakan Üniversitesi',
            'neü': 'Necmettin Erbakan Üniversitesi',
            'tau': 'Türk-Alman Üniversitesi',
            'taü': 'Türk-Alman Üniversitesi',
            'medipol': 'İstanbul Medipol Üniversitesi',
            'yeditepe': 'Yeditepe Üniversitesi',
            'bau': 'Bahçeşehir Üniversitesi',
            'bahcesehir': 'Bahçeşehir Üniversitesi',
            'bahçeşehir': 'Bahçeşehir Üniversitesi',
            'ozyegin': 'Özyeğin Üniversitesi',
            'özyeğin': 'Özyeğin Üniversitesi',
            'khas': 'Kadir Has Üniversitesi',
            'kadir has': 'Kadir Has Üniversitesi',
            'cankaya': 'Çankaya Üniversitesi',
            'çankaya': 'Çankaya Üniversitesi',
            'baskent': 'Başkent Üniversitesi',
            'başkent': 'Başkent Üniversitesi',
            'bezmialem': 'Bezmialem Vakıf Üniversitesi',
            'ataturk': 'Atatürk Üniversitesi',
            'atatürk': 'Atatürk Üniversitesi',
            'akdeniz': 'Akdeniz Üniversitesi',
            'cukurova': 'Çukurova Üniversitesi',
            'çukurova': 'Çukurova Üniversitesi',
            'erciyes': 'Erciyes Üniversitesi',
            'firat': 'Fırat Üniversitesi',
            'fırat': 'Fırat Üniversitesi',
            'inonu': 'İnönü Üniversitesi',
            'inönü': 'İnönü Üniversitesi',
            'selcuk': 'Selçuk Üniversitesi',
            'selçuk': 'Selçuk Üniversitesi',
            'dicle': 'Dicle Üniversitesi',
            'trakya': 'Trakya Üniversitesi',
            'uludag': 'Bursa Uludağ Üniversitesi',
            'uludağ': 'Bursa Uludağ Üniversitesi'
        };

        function normalizeTr(s) {
            if (!s) return '';
            return s.toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9]/g, '');
        }

        function extractParenAcronym(name) {
            const m = name.match(/\(([^)]+)\)/);
            return m ? m[1].trim() : '';
        }

        function makeInitials(name) {
            const clean = name.replace(/\([^)]*\)/g, '').trim();
            const words = clean.split(/\s+/).filter(w => !['ve', '&', 'ile'].includes(w.toLowerCase()));
            return words.map(w => w[0] || '').join('');
        }

        let filteredUnis = [];
        let activeIndex = -1;

        function filterUniversities(rawQuery) {
            const q = (rawQuery || '').trim();
            if (!q) {
                const popular = [
                    'Orta Doğu Teknik Üniversitesi (ODTÜ)',
                    'İstanbul Teknik Üniversitesi (İTÜ)',
                    'Boğaziçi Üniversitesi',
                    'Yıldız Teknik Üniversitesi (YTÜ)',
                    'Hacettepe Üniversitesi',
                    'Koç Üniversitesi',
                    'Sabancı Üniversitesi',
                    'İhsan Doğramacı Bilkent Üniversitesi',
                    'Dokuz Eylül Üniversitesi',
                    'Bandırma Onyedi Eylül Üniversitesi'
                ];
                return uniList.filter(u => popular.some(p => u.includes(p) || p.includes(u))).slice(0, 8);
            }

            const qLower = q.toLowerCase();
            const qNorm = normalizeTr(q);
            const directAcronymMatch = ACRONYM_MAP[qLower] || ACRONYM_MAP[qNorm];

            const results = [];
            const addedSet = new Set();

            if (directAcronymMatch) {
                const found = uniList.find(u => u === directAcronymMatch || u.includes(directAcronymMatch) || directAcronymMatch.includes(u));
                if (found) {
                    results.push({ name: found, score: 100 });
                    addedSet.add(found);
                }
            }

            uniList.forEach(uni => {
                if (addedSet.has(uni)) return;

                const uLower = uni.toLowerCase();
                const uNorm = normalizeTr(uni);
                const paren = extractParenAcronym(uni);
                const parenNorm = normalizeTr(paren);
                const initials = makeInitials(uni);
                const initialsNorm = normalizeTr(initials);

                if (paren && (paren.toLowerCase() === qLower || parenNorm === qNorm)) {
                    results.push({ name: uni, score: 95 });
                    addedSet.add(uni);
                    return;
                }

                if (initialsNorm && (initialsNorm === qNorm || (initialsNorm.startsWith(qNorm) && qNorm.length >= 2))) {
                    results.push({ name: uni, score: 90 });
                    addedSet.add(uni);
                    return;
                }

                if (uLower.startsWith(qLower) || uNorm.startsWith(qNorm)) {
                    results.push({ name: uni, score: 80 });
                    addedSet.add(uni);
                    return;
                }

                if (paren && (paren.toLowerCase().startsWith(qLower) || parenNorm.startsWith(qNorm))) {
                    results.push({ name: uni, score: 75 });
                    addedSet.add(uni);
                    return;
                }

                if (uLower.includes(qLower) || uNorm.includes(qNorm)) {
                    results.push({ name: uni, score: 60 });
                    addedSet.add(uni);
                    return;
                }
            });

            results.sort((a, b) => b.score - a.score);
            return results.slice(0, 10).map(r => r.name);
        }

        function highlightMatch(text, query) {
            if (!query) return escapeHtml(text);
            const q = query.trim();
            const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return escapeHtml(text).replace(regex, '<mark class="uni-search-combobox__mark">$1</mark>');
        }

        function renderDropdown(items, query) {
            filteredUnis = items;
            activeIndex = -1;

            if (items.length === 0) {
                listbox.innerHTML = `
                    <li class="uni-search-combobox__empty">
                        <i data-lucide="help-circle" class="icon-xs"></i>
                        <span>"${escapeHtml(query)}" için üniversite bulunamadı</span>
                    </li>
                `;
                listbox.style.display = 'block';
                input.setAttribute('aria-expanded', 'true');
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }

            let html = '';
            items.forEach((uni, idx) => {
                const paren = extractParenAcronym(uni);
                html += `
                    <li class="uni-search-combobox__item"
                        role="option"
                        id="uni-combobox-opt-${idx}"
                        data-index="${idx}"
                        data-uni="${escapeHtml(uni)}"
                        aria-selected="false">
                        <div class="uni-search-combobox__item-content">
                            <i data-lucide="graduation-cap" class="icon-xs uni-search-combobox__item-icon"></i>
                            <span class="uni-search-combobox__item-name">${highlightMatch(uni, query)}</span>
                        </div>
                        ${paren ? `<span class="uni-search-combobox__item-badge">${escapeHtml(paren)}</span>` : ''}
                    </li>
                `;
            });

            listbox.innerHTML = html;
            listbox.style.display = 'block';
            input.setAttribute('aria-expanded', 'true');
            if (typeof lucide !== 'undefined') lucide.createIcons();

            listbox.querySelectorAll('.uni-search-combobox__item').forEach(item => {
                item.addEventListener('mouseenter', () => {
                    const idx = parseInt(item.dataset.index, 10);
                    setActiveIndex(idx);
                });
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    selectUniversity(item.dataset.uni);
                });
            });
        }

        function closeDropdown() {
            listbox.style.display = 'none';
            input.setAttribute('aria-expanded', 'false');
            input.removeAttribute('aria-activedescendant');
            activeIndex = -1;
        }

        function openDropdown() {
            const matches = filterUniversities(input.value);
            renderDropdown(matches, input.value);
        }

        function setActiveIndex(idx) {
            const items = listbox.querySelectorAll('.uni-search-combobox__item');
            if (items.length === 0) return;

            items.forEach(el => {
                el.classList.remove('uni-search-combobox__item--active');
                el.setAttribute('aria-selected', 'false');
            });

            activeIndex = idx;
            if (activeIndex >= 0 && activeIndex < items.length) {
                const activeEl = items[activeIndex];
                activeEl.classList.add('uni-search-combobox__item--active');
                activeEl.setAttribute('aria-selected', 'true');
                input.setAttribute('aria-activedescendant', activeEl.id);
                activeEl.scrollIntoView({ block: 'nearest' });
            } else {
                input.removeAttribute('aria-activedescendant');
            }
        }

        function selectUniversity(uniName) {
            if (!uniName) return;
            closeDropdown();
            input.value = '';
            if (clearBtn) clearBtn.style.display = 'none';
            window.location.hash = `#/university?name=${encodeURIComponent(uniName)}`;
        }

        input.addEventListener('input', () => {
            const val = input.value;
            if (clearBtn) clearBtn.style.display = val ? 'inline-flex' : 'none';
            const matches = filterUniversities(val);
            renderDropdown(matches, val);
        });

        input.addEventListener('focus', () => {
            openDropdown();
        });

        input.addEventListener('blur', () => {
            setTimeout(() => {
                closeDropdown();
            }, 200);
        });

        input.addEventListener('keydown', (e) => {
            const isOpen = listbox.style.display === 'block';

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!isOpen) {
                    openDropdown();
                    return;
                }
                const itemsCount = filteredUnis.length;
                if (itemsCount > 0) {
                    const nextIdx = (activeIndex + 1) % itemsCount;
                    setActiveIndex(nextIdx);
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!isOpen) {
                    openDropdown();
                    return;
                }
                const itemsCount = filteredUnis.length;
                if (itemsCount > 0) {
                    const prevIdx = activeIndex <= 0 ? itemsCount - 1 : activeIndex - 1;
                    setActiveIndex(prevIdx);
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (isOpen && activeIndex >= 0 && filteredUnis[activeIndex]) {
                    selectUniversity(filteredUnis[activeIndex]);
                } else if (isOpen && filteredUnis.length > 0) {
                    selectUniversity(filteredUnis[0]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeDropdown();
                input.blur();
            }
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                input.value = '';
                clearBtn.style.display = 'none';
                input.focus();
                openDropdown();
            });
        }
    }

    // Execute Initial Page Rendering
    updateHero();
    renderReviews();
    initStickyTabs();
    initCampusMapToggle();
    initDormControls();
    initReviewControls();
    initAboutToggle();
    initUniCombobox();

    if (typeof lucide !== 'undefined') lucide.createIcons();

    return () => renderReviews();
}


// ─── Review Form Page ─────────────────────

function initReviewForm() {
    const form = document.getElementById('add-review-form');
    if (!form) return;

    const uniSelectHidden = document.getElementById('form-uni-hidden');
    const uniWarning = document.getElementById('rf-uni-warning');
    const uniError = document.getElementById('rf-uni-error');

    const starContainer = document.getElementById('star-rating');
    const ratingHidden = document.getElementById('form-rating');
    const ratingLabel = document.getElementById('rf-rating-label');
    const ratingError = document.getElementById('rf-rating-error');

    const recYesBtn = document.getElementById('rf-rec-yes');
    const recNoBtn = document.getElementById('rf-rec-no');
    const recHidden = document.getElementById('form-recommend');
    const recError = document.getElementById('rf-recommend-error');

    const anonToggle = document.getElementById('rf-anonymous-toggle');
    const anonDesc = document.getElementById('rf-anon-desc');

    const eduStudentBtn = document.getElementById('rf-edu-student');
    const eduGraduateBtn = document.getElementById('rf-edu-graduate');
    const eduStatusHidden = document.getElementById('form-edu-status');
    const eduDetailsWrap = document.getElementById('rf-edu-details');
    const studentClassWrap = document.getElementById('rf-student-class-wrap');
    const gradYearWrap = document.getElementById('rf-grad-year-wrap');
    const gradYearSelect = document.getElementById('rf-grad-year-select');

    const progressText = document.getElementById('rf-progress-text');
    const bottomStatus = document.getElementById('rf-bottom-status');

    const deptHidden = document.getElementById('form-dept-hidden');
    const deptSearchInput = document.getElementById('rf-dept-input');
    const classSelect = document.getElementById('form-class-select');
    const scholarshipSelect = document.getElementById('form-scholarship-select');

    const reviewTextInput = document.getElementById('form-review-text');
    const charCountEl = document.getElementById('char-count');
    const charGuidanceEl = document.getElementById('rf-char-guidance');
    const textError = document.getElementById('rf-text-error');

    const consentCheckbox = document.getElementById('rf-consent');
    const consentError = document.getElementById('rf-consent-error');
    const submitBtn = document.getElementById('rf-submit-btn');

    const successCard = document.getElementById('rf-success-card');
    const btnNew = document.getElementById('rf-btn-new');
    const btnUni = document.getElementById('rf-btn-uni');

    const RATING_TEXTS = {
        0: 'Puan seçin (1-5)',
        1: '1: Çok kötü',
        2: '2: Kötü',
        3: '3: Orta',
        4: '4: İyi',
        5: '5: Mükemmel'
    };

    const COMMON_DEPARTMENTS = [
        'Bilgisayar Mühendisliği',
        'Yazılım Mühendisliği',
        'Elektrik-Elektronik Mühendisliği',
        'Endüstri Mühendisliği',
        'Makine Mühendisliği',
        'İnşaat Mühendisliği',
        'Tıp Fakültesi',
        'Diş Hekimliği',
        'Eczacılık',
        'Hukuk Fakültesi',
        'Psikoloji',
        'İşletme',
        'İktisat',
        'Siyaset Bilimi ve Uluslararası İlişkiler',
        'Mimarlık',
        'İç Mimarlık',
        'Halkla İlişkiler ve Tanıtım',
        'İletişim ve Tasarımı',
        'Beslenme ve Diyetetik',
        'Fizyoterapi ve Rehabilitasyon',
        'Hemşirelik',
        'Matematik',
        'Moleküler Biyoloji ve Genetik',
        'Sosyoloji',
        'Tarih',
        'Türk Dili ve Edebiyatı',
        'İngiliz Dili ve Edebiyatı',
        'Görsel İletişim Tasarımı'
    ];

    // State - Hiçbir alan önceden seçili gelmez
    let selectedRating = 0;
    let isRecommended = null; // null | true | false
    let isAnonymous = true;   // Varsayılan: anonim paylaş
    let educationStatus = ''; // '' | 'student' | 'graduate' (Boş başlar)
    let graduationYear = null;

    const criteriaRatings = {
        yurt: 0,
        yemekhane: 0,
        ulasim: 0,
        sosyal: 0,
        egitim: 0
    };
    const DRAFT_KEY = 'kampus_sesi_review_draft';

    // 1a. Tavsiye Durumu (Evet/Hayır)
    function setRecommendation(val) {
        isRecommended = val;
        if (recHidden) recHidden.value = val ? 'yes' : 'no';
        if (recYesBtn) recYesBtn.classList.toggle('active', val === true);
        if (recNoBtn) recNoBtn.classList.toggle('active', val === false);
        if (recError) recError.textContent = '';
        updatePowerMeter();
        validateForm(true);
        saveDraft();
    }
    if (recYesBtn) recYesBtn.addEventListener('click', () => setRecommendation(true));
    if (recNoBtn) recNoBtn.addEventListener('click', () => setRecommendation(false));

    // 1b. Paylaşım Tercihi / Anonimlik
    function setAnonymous(val) {
        isAnonymous = Boolean(val);
        if (anonToggle) anonToggle.checked = isAnonymous;
        if (anonDesc) {
            anonDesc.textContent = isAnonymous
                ? 'İsminiz gizlenir, yorumunuz "Anonim öğrenci" adıyla yayınlanır.'
                : 'İsminiz ve profil bilgileriniz yorum kartında açık olarak görünür.';
        }
        saveDraft();
    }
    if (anonToggle) {
        anonToggle.addEventListener('change', (e) => setAnonymous(e.target.checked));
    }

    // 1c. Öğrenim Durumu (Öğrenci / Mezun) - Koşullu Alanlar
    function setEducationStatus(status, year = null) {
        if (status === 'student') {
            educationStatus = 'student';
            if (eduStatusHidden) eduStatusHidden.value = 'student';
            if (eduStudentBtn) eduStudentBtn.classList.add('active');
            if (eduGraduateBtn) eduGraduateBtn.classList.remove('active');
            if (eduDetailsWrap) eduDetailsWrap.style.display = 'block';
            if (studentClassWrap) studentClassWrap.style.display = 'block';
            if (gradYearWrap) gradYearWrap.style.display = 'none';
            graduationYear = null;
            if (gradYearSelect) gradYearSelect.value = '';
        } else if (status === 'graduate') {
            educationStatus = 'graduate';
            if (eduStatusHidden) eduStatusHidden.value = 'graduate';
            if (eduGraduateBtn) eduGraduateBtn.classList.add('active');
            if (eduStudentBtn) eduStudentBtn.classList.remove('active');
            if (eduDetailsWrap) eduDetailsWrap.style.display = 'block';
            if (gradYearWrap) gradYearWrap.style.display = 'block';
            if (studentClassWrap) studentClassWrap.style.display = 'none';
            if (classSelect) classSelect.value = '';
            if (year !== null && gradYearSelect) {
                gradYearSelect.value = year;
                graduationYear = parseInt(year, 10) || null;
            }
        } else {
            educationStatus = '';
            if (eduStatusHidden) eduStatusHidden.value = '';
            if (eduStudentBtn) eduStudentBtn.classList.remove('active');
            if (eduGraduateBtn) eduGraduateBtn.classList.remove('active');
            if (eduDetailsWrap) eduDetailsWrap.style.display = 'none';
            if (studentClassWrap) studentClassWrap.style.display = 'none';
            if (gradYearWrap) gradYearWrap.style.display = 'none';
            graduationYear = null;
            if (gradYearSelect) gradYearSelect.value = '';
            if (classSelect) classSelect.value = '';
            if (deptHidden) deptHidden.value = '';
            if (deptSearchInput) deptSearchInput.value = '';
            const trig = document.querySelector('#custom-dept-select-form .custom-select__text');
            if (trig) {
                trig.textContent = 'Bölüm ara…';
                trig.style.color = '';
            }
            if (scholarshipSelect) scholarshipSelect.value = '';
        }
        updatePowerMeter();
        saveDraft();
    }
    if (eduStudentBtn) eduStudentBtn.addEventListener('click', () => setEducationStatus(educationStatus === 'student' ? '' : 'student'));
    if (eduGraduateBtn) eduGraduateBtn.addEventListener('click', () => setEducationStatus(educationStatus === 'graduate' ? '' : 'graduate'));
    if (gradYearSelect) {
        gradYearSelect.addEventListener('change', (e) => {
            const v = e.target.value.trim();
            graduationYear = v ? parseInt(v, 10) : null;
            saveDraft();
        });
    }

    // 1. Üniversite Seçimi (Combobox)
    initCustomSelect('custom-uni-select-form', typeof TURKISH_UNIVERSITIES !== 'undefined' ? TURKISH_UNIVERSITIES : [], (newUni) => {
        if (uniSelectHidden) uniSelectHidden.value = newUni;
        checkExistingReview(newUni);
        validateForm(true);
        saveDraft();
    });

    // Kullanıcı daha önce bu okula yorum yazdı mı kontrolü
    function checkExistingReview(uniName) {
        if (!uniWarning) return;
        if (!uniName) {
            uniWarning.hidden = true;
            return;
        }
        const norm = (s) => String(s || '').replace(/\s*\([^)]*\)/g, '').trim().toLocaleLowerCase('tr');
        const target = norm(uniName);
        const all = getAllReviewsGlobal();
        const hasPrev = all.some(r => {
            const sameUni = norm(r.university) === target;
            const sameUser = (CURRENT_USER.name && r.user === CURRENT_USER.name) ||
                             (CURRENT_USER.uid && CURRENT_USER.uid !== 'guest' && (r.user_id === CURRENT_USER.uid || r.uid === CURRENT_USER.uid));
            return sameUni && sameUser;
        });

        if (hasPrev) {
            uniWarning.innerHTML = '<strong>Bilgi:</strong> Bu üniversiteye daha önce bir değerlendirme yazdınız. Yeni değerlendirmeniz profilinizde ayrı bir yorum olarak yer alacaktır.';
            uniWarning.hidden = false;
        } else {
            uniWarning.hidden = true;
        }
    }

    // 2. Genel Puan (Yıldızlar + Metin)
    const starBtns = starContainer ? starContainer.querySelectorAll('.rf-star') : [];

    function highlightStars(val) {
        starBtns.forEach(s => {
            const starVal = Number(s.dataset.value);
            s.classList.toggle('rf-star--filled', starVal <= val);
        });
        if (ratingLabel) {
            ratingLabel.textContent = RATING_TEXTS[val] || RATING_TEXTS[0];
        }
    }

    starBtns.forEach(btn => {
        const val = Number(btn.dataset.value);
        btn.addEventListener('click', () => {
            selectedRating = val;
            if (ratingHidden) ratingHidden.value = val;
            highlightStars(selectedRating);
            validateForm(true);
            saveDraft();
        });
        btn.addEventListener('mouseenter', () => {
            highlightStars(val);
        });
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                selectedRating = Math.min(5, selectedRating + 1);
                if (ratingHidden) ratingHidden.value = selectedRating;
                highlightStars(selectedRating);
                validateForm(true);
                saveDraft();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                selectedRating = Math.max(1, selectedRating - 1);
                if (ratingHidden) ratingHidden.value = selectedRating;
                highlightStars(selectedRating);
                validateForm(true);
                saveDraft();
            }
        });
    });

    if (starContainer) {
        starContainer.addEventListener('mouseleave', () => {
            highlightStars(selectedRating);
        });
    }

    // 3. İsteğe Bağlı Kriter Yıldızları (Yurt, Yemekhane, Ulaşım, Sosyal Hayat, Akademik)
    document.querySelectorAll('.rf-crit-item').forEach(item => {
        const critId = item.dataset.crit;
        const critStars = item.querySelectorAll('.rf-crit-star');
        critStars.forEach(s => {
            const v = Number(s.dataset.v);
            s.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (criteriaRatings[critId] === v) {
                    criteriaRatings[critId] = 0;
                } else {
                    criteriaRatings[critId] = v;
                }
                updateCritDisplay(item, criteriaRatings[critId]);
                saveDraft();
            });
            s.addEventListener('mouseenter', () => {
                critStars.forEach(st => st.classList.toggle('is-hover', Number(st.dataset.v) <= v));
            });
        });
        item.addEventListener('mouseleave', () => {
            critStars.forEach(st => st.classList.remove('is-hover'));
            updateCritDisplay(item, criteriaRatings[critId] || 0);
        });
    });

    function updateCritDisplay(itemEl, val) {
        itemEl.querySelectorAll('.rf-crit-star').forEach(s => {
            s.classList.toggle('is-active', Number(s.dataset.v) <= val);
        });
        updatePowerMeter();
    }

    // 4. Bağlam Alanları (Bölüm, Sınıf, Burs)
    const DEPT_OPTIONS = ['Seçiniz...', ...COMMON_DEPARTMENTS];
    initCustomSelect('custom-dept-select-form', DEPT_OPTIONS, (selectedDept) => {
        if (!selectedDept || selectedDept === 'Seçiniz...') {
            if (deptHidden) deptHidden.value = '';
            const trig = document.querySelector('#custom-dept-select-form .custom-select__text');
            if (trig) {
                trig.textContent = 'Bölüm ara…';
                trig.style.color = '';
            }
        } else {
            if (deptHidden) deptHidden.value = selectedDept;
        }
        updatePowerMeter();
        saveDraft();
    });

    if (deptSearchInput) {
        deptSearchInput.addEventListener('input', () => {
            const val = deptSearchInput.value.trim();
            if (val === 'Seçiniz...') {
                if (deptHidden) deptHidden.value = '';
            } else {
                if (deptHidden) deptHidden.value = val;
            }
            updatePowerMeter();
            saveDraft();
        });
    }

    if (classSelect) {
        classSelect.addEventListener('change', () => saveDraft());
    }
    if (scholarshipSelect) {
        scholarshipSelect.addEventListener('change', () => saveDraft());
    }

    // 5. Tek Metin Alanı (Deneyimin)
    function updateCharCount() {
        const text = reviewTextInput ? reviewTextInput.value.trim() : '';
        const total = text.length;

        if (charCountEl) {
            charCountEl.textContent = `${total} / 40 min (maks. 500)`;
            charCountEl.classList.toggle('is-valid', total >= 40);
        }

        if (charGuidanceEl) {
            if (total === 0) {
                charGuidanceEl.textContent = 'En az 40 karakter yazmalısın.';
                charGuidanceEl.style.color = '';
            } else if (total < 40) {
                charGuidanceEl.textContent = `En az 40 karakter yazmalısın (kalan: ${40 - total} karakter).`;
                charGuidanceEl.style.color = 'var(--color-danger)';
            } else {
                charGuidanceEl.textContent = `✓ Karakter sayısı yeterli (${total}/500 karakter).`;
                charGuidanceEl.style.color = 'var(--color-success)';
            }
        }
        if (textError && total >= 40) {
            textError.textContent = '';
        }
        updatePowerMeter();
        validateForm(true);
        saveDraft();
    }

    if (reviewTextInput) reviewTextInput.addEventListener('input', updateCharCount);

    // 7. Yorum Gücü Göstergesi (Bilgilendirme)
    function updatePowerMeter() {
        const text = reviewTextInput ? reviewTextInput.value.trim() : '';
        const totalChars = text.length;

        let score = 0;
        // Metin uzunluğu (max 50)
        if (totalChars > 0 && totalChars < 40) score += 15;
        else if (totalChars >= 40 && totalChars < 120) score += 35;
        else if (totalChars >= 120) score += 50;

        // Tavsiye (15)
        if (isRecommended !== null) score += 15;

        // Bölüm (15)
        const dept = (educationStatus && deptHidden) ? deptHidden.value.trim() : '';
        if (dept) score += 15;

        // Öğrenim durumu (10)
        if (educationStatus) score += 10;

        // Kriter puanları (max 10)
        const critCount = Object.values(criteriaRatings).filter(v => v > 0).length;
        score += Math.min(10, critCount * 2);

        const fillEl = document.getElementById('rf-power-fill');
        const textEl = document.getElementById('rf-power-text');
        if (!fillEl || !textEl) return;

        fillEl.style.width = `${Math.max(10, Math.min(100, score))}%`;

        if (score < 40) {
            textEl.textContent = 'Kısa';
            fillEl.className = 'rf-power-fill rf-power-fill--short';
        } else if (score < 75) {
            textEl.textContent = 'İyi';
            fillEl.className = 'rf-power-fill rf-power-fill--good';
        } else {
            textEl.textContent = 'Çok faydalı';
            fillEl.className = 'rf-power-fill rf-power-fill--great';
        }
    }

    // 8. Onay Kutusu
    if (consentCheckbox) {
        consentCheckbox.addEventListener('change', () => {
            validateForm(true);
            saveDraft();
        });
    }

    // Hata durumunda ilgili alana yumuşak kaydırma ve vurgulama
    function highlightAndScroll(fieldId, errEl, msg) {
        if (errEl) errEl.textContent = msg;
        const target = document.getElementById(fieldId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('rf-highlight-error');
            setTimeout(() => target.classList.remove('rf-highlight-error'), 2500);
        }
    }

    // 9. Doğrulama ve Submit Butonu Durumu
    function validateForm(silent = false, scrollToFirstError = false) {
        const uni = uniSelectHidden ? uniSelectHidden.value.trim() : '';
        const text = reviewTextInput ? reviewTextInput.value.trim() : '';
        const totalChars = text.length;
        const consent = consentCheckbox ? consentCheckbox.checked : false;

        let isValid = true;
        let firstError = null;

        // 1. Üniversite
        if (!uni) {
            isValid = false;
            if (!silent && uniError) uniError.textContent = 'Lütfen bir üniversite seçin.';
            if (!firstError) firstError = { id: 'rf-field-uni', el: uniError, msg: 'Lütfen bir üniversite seçin.' };
        } else if (uniError) {
            uniError.textContent = '';
        }

        // 2. Genel Puan
        if (!(selectedRating >= 1 && selectedRating <= 5)) {
            isValid = false;
            if (!silent && ratingError) ratingError.textContent = 'Lütfen 1 ile 5 arasında genel bir puan verin.';
            if (!firstError) firstError = { id: 'rf-field-rating', el: ratingError, msg: 'Lütfen 1 ile 5 arasında genel bir puan verin.' };
        } else if (ratingError) {
            ratingError.textContent = '';
        }

        // 3. Tavsiye (Zorunlu)
        if (isRecommended === null) {
            isValid = false;
            if (!silent && recError) recError.textContent = 'Lütfen bu üniversiteyi tavsiye edip etmediğinizi belirtin.';
            if (!firstError) firstError = { id: 'rf-field-recommend', el: recError, msg: 'Lütfen bu üniversiteyi tavsiye edip etmediğinizi belirtin.' };
        } else if (recError) {
            recError.textContent = '';
        }

        // 4. Metin (en az 40 karakter)
        if (totalChars < 40) {
            isValid = false;
            const textMsg = totalChars === 0
                ? 'Lütfen deneyimini detaylandıran bir değerlendirme yaz (en az 40 karakter).'
                : `Yorumun çok kısa. Lütfen en az ${40 - totalChars} karakter daha ekle.`;
            if (!silent && textError) textError.textContent = textMsg;
            if (!firstError) firstError = { id: 'rf-field-text', el: textError, msg: textMsg };
        } else if (textError) {
            textError.textContent = '';
        }

        // 5. Onay
        if (!consent) {
            isValid = false;
            if (!silent && consentError) consentError.textContent = 'Yorumunuzu paylaşmak için Topluluk Kurallarını onaylamalısınız.';
            if (!firstError) firstError = { id: 'rf-field-consent', el: consentError, msg: 'Topluluk Kurallarını onaylamalısınız.' };
        } else if (consentError) {
            consentError.textContent = '';
        }

        // İlerleme Sayacı (5 zorunlu alan)
        const checks = [Boolean(uni), selectedRating >= 1, isRecommended !== null, totalChars >= 40, Boolean(consent)];
        const completed = checks.filter(Boolean).length;
        if (progressText) progressText.textContent = `Zorunlu alanlar: ${completed}/5 tamam`;
        if (bottomStatus) bottomStatus.classList.toggle('is-ready', completed === 5);

        if (submitBtn) {
            if (isValid) {
                submitBtn.removeAttribute('disabled');
                submitBtn.setAttribute('aria-disabled', 'false');
            } else {
                submitBtn.setAttribute('disabled', 'disabled');
                submitBtn.setAttribute('aria-disabled', 'true');
            }
        }

        if (scrollToFirstError && firstError) {
            highlightAndScroll(firstError.id, firstError.el, firstError.msg);
        }

        return isValid;
    }

    // Submit butonu pasifken tıklandığında eksik alana yönlendirme
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            if (submitBtn.getAttribute('aria-disabled') === 'true' || submitBtn.disabled) {
                e.preventDefault();
                validateForm(false, true);
            }
        });
    }

    // 10. Taslak Kaydetme / Geri Yükleme (Draft Autosave)
    function saveDraft() {
        try {
            const draft = {
                uni: uniSelectHidden ? uniSelectHidden.value : '',
                rating: selectedRating,
                recommend: isRecommended,
                is_anonymous: isAnonymous,
                edu_status: educationStatus,
                grad_year: educationStatus === 'graduate' ? graduationYear : null,
                criteria: criteriaRatings,
                dept: (educationStatus && deptHidden) ? deptHidden.value : ((educationStatus && deptSearchInput) ? deptSearchInput.value : ''),
                student_class: (educationStatus === 'student' && classSelect) ? classSelect.value : '',
                scholarship: (educationStatus && scholarshipSelect) ? scholarshipSelect.value : '',
                text: reviewTextInput ? reviewTextInput.value : '',
                consent: consentCheckbox ? consentCheckbox.checked : false
            };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        } catch (_) {}
    }

    function restoreDraft() {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (!raw) return;
            const draft = JSON.parse(raw);
            if (!draft) return;

            // Üniversite
            if (draft.uni && uniSelectHidden) {
                uniSelectHidden.value = draft.uni;
                const trig = document.querySelector('#custom-uni-select-form .custom-select__text');
                if (trig) {
                    trig.textContent = draft.uni;
                    trig.style.color = 'var(--color-text)';
                }
                checkExistingReview(draft.uni);
            }

            // Puan
            if (draft.rating >= 1 && draft.rating <= 5) {
                selectedRating = draft.rating;
                if (ratingHidden) ratingHidden.value = draft.rating;
                highlightStars(selectedRating);
            }

            // Tavsiye
            if (typeof draft.recommend === 'boolean') {
                setRecommendation(draft.recommend);
            }

            // Anonimlik
            if (typeof draft.is_anonymous === 'boolean') {
                setAnonymous(draft.is_anonymous);
            }

            // Öğrenim Durumu
            if (draft.edu_status) {
                setEducationStatus(draft.edu_status, draft.grad_year);
            }

            // Kriterler
            if (draft.criteria && typeof draft.criteria === 'object') {
                Object.entries(draft.criteria).forEach(([k, v]) => {
                    criteriaRatings[k] = Number(v) || 0;
                    const item = document.querySelector(`.rf-crit-item[data-crit="${k}"]`);
                    if (item) updateCritDisplay(item, criteriaRatings[k]);
                });
            }

            // Bağlam
            if (draft.dept) {
                if (deptHidden) deptHidden.value = draft.dept;
                const dTrig = document.querySelector('#custom-dept-select-form .custom-select__text');
                if (dTrig) {
                    dTrig.textContent = draft.dept;
                    dTrig.style.color = 'var(--color-text)';
                }
            }
            if (draft.student_class && classSelect) classSelect.value = draft.student_class;
            if (draft.scholarship && scholarshipSelect) scholarshipSelect.value = draft.scholarship;

            // Metin
            if (draft.text && reviewTextInput) {
                reviewTextInput.value = draft.text;
            } else if ((draft.pros || draft.cons) && reviewTextInput) {
                reviewTextInput.value = [draft.pros, draft.cons].filter(Boolean).join('\n\n');
            }
            updateCharCount();

            // Onay
            if (draft.consent && consentCheckbox) {
                consentCheckbox.checked = true;
            }

            updatePowerMeter();
            validateForm(true);
        } catch (_) {}
    }

    restoreDraft();
    updatePowerMeter();

    // 11. Form Gönderimi
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm(false, true)) {
            showToast('⚠️ Lütfen formdaki zorunlu alanları eksiksiz doldurun.');
            return;
        }

        const university = uniSelectHidden.value.trim();
        const textVal = reviewTextInput ? reviewTextInput.value.trim() : '';

        // Sade metin olarak kaydedilir
        let reviewText = textVal;

        // Bağlam satırı (eğer eğitim durumu seçildiyse)
        const metaParts = [];
        const deptVal = (educationStatus && deptHidden) ? deptHidden.value.trim() : '';
        const classVal = (educationStatus === 'student' && classSelect) ? classSelect.value : '';
        const scholarshipVal = (educationStatus && scholarshipSelect) ? scholarshipSelect.value : '';
        const gradYearVal = (educationStatus === 'graduate' && gradYearSelect) ? (parseInt(gradYearSelect.value, 10) || null) : null;

        if (deptVal) metaParts.push(`Bölüm: ${deptVal}`);
        if (classVal) metaParts.push(`Sınıf: ${classVal}`);
        if (gradYearVal) metaParts.push(`Mezuniyet: ${gradYearVal}`);
        if (scholarshipVal) metaParts.push(`Burs: ${scholarshipVal}`);

        if (metaParts.length > 0) {
            reviewText += `\n\n(${metaParts.join(' • ')})`;
        }

        const newReview = {
            id: Date.now(),
            user: CURRENT_USER.name,
            initials: CURRENT_USER.initials,
            university: university,
            date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
            rating: selectedRating,
            tags: [], // Boş etiket listesi
            text: reviewText,
            is_recommended: isRecommended,
            is_anonymous: isAnonymous,
            education_status: educationStatus || null,
            graduation_year: gradYearVal,
            department: deptVal || undefined,
            student_class: classVal || undefined,
            scholarship: scholarshipVal || undefined,
            rating_dorm: criteriaRatings.yurt || null,
            rating_food: criteriaRatings.yemekhane || null,
            rating_transport: criteriaRatings.ulasim || null,
            rating_social: criteriaRatings.sosyal || null,
            rating_academic: criteriaRatings.egitim || null,
            criteria: {
                yurt: criteriaRatings.yurt || 0,
                yemekhane: criteriaRatings.yemekhane || 0,
                ulasim: criteriaRatings.ulasim || 0,
                sosyal: criteriaRatings.sosyal || 0,
                akademik: criteriaRatings.egitim || 0,
                egitim: criteriaRatings.egitim || 0
            }
        };

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Gönderiliyor…';
        }

        window.saveReview(newReview).then(saved => {
            // Taslağı temizle
            try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}

            // Başarı kartını göster, formu gizle
            form.hidden = true;
            if (successCard) successCard.hidden = false;

            if (btnUni) {
                btnUni.href = `#/university?name=${encodeURIComponent(university)}`;
            }

            showToast('✅ Değerlendirmeniz başarıyla gönderildi!');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }).catch(err => {
            console.error(err);
            showToast(`❌ Hata: ${err.message || 'Gönderilemedi'}`);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Yorumu paylaş';
            }
        });
    });

    // "Başka bir okula yorum yaz" butonu
    if (btnNew) {
        btnNew.addEventListener('click', () => {
            form.reset();
            selectedRating = 0;
            highlightStars(0);
            if (reviewTextInput) reviewTextInput.value = '';
            setEducationStatus('');
            Object.keys(criteriaRatings).forEach(k => {
                criteriaRatings[k] = 0;
                const item = document.querySelector(`.rf-crit-item[data-crit="${k}"]`);
                if (item) updateCritDisplay(item, 0);
            });
            if (uniSelectHidden) uniSelectHidden.value = '';
            const trig = document.querySelector('#custom-uni-select-form .custom-select__text');
            if (trig) trig.textContent = 'Üniversite seçin...';
            if (charCountEl) charCountEl.textContent = '0 / 40 min (maks. 500)';
            if (charGuidanceEl) charGuidanceEl.textContent = 'En az 40 karakter yazmalısın.';
            if (successCard) successCard.hidden = true;
            form.hidden = false;
            validateForm(true);
        });
    }
}


// ─── Profile Page (Two-Column Modern Layout) ─────────────────────────

const SAMPLE_SUBMISSIONS_MOCK = [
    {
        id: 'mock-exp-1',
        type: 'experience',
        type_label: 'Deneyim & Blog',
        title: 'İTÜ Ayazağa Kampüsü ve Yurt Başvuru Sürecim',
        subtitle: 'Kampüs Rehberi · 5 dk okuma',
        summary: 'Hazırlık senesinden itibaren Ayazağa yerleşkesinde ulaşım, yemekhane saatleri, kütüphane çalışma salonları ve gölet yurtları hakkında tüm gerçek deneyimlerim.',
        status: 'approved',
        admin_note: 'Deneyim yazınız yayın ilkelerimize uygun bulundu ve Kampüs Sesi Blog sayfasında yayına alındı.',
        created_at: '2026-10-12T14:20:00',
        is_sample: true
    },
    {
        id: 'mock-sug-2',
        type: 'school_suggestion',
        type_label: 'Okul Önerisi',
        title: 'Gebze Teknik Üniversitesi — Çayırova Yerleşkesi',
        subtitle: 'Kocaeli · Çayırova Kampüsü',
        summary: 'Mühendislik laboratuvarları ve Marmaray durağına yürüme mesafesindeki ana yerleşke bilgilerinin sisteme eklenmesi talebi.',
        status: 'pending',
        admin_note: 'Öneriniz moderasyon sırasındadır. Resmi yerleşke ve bölüm verileri kontrol edildikten sonra aktif edilecektir.',
        created_at: '2026-10-15T09:45:00',
        is_sample: true
    },
    {
        id: 'mock-exp-3',
        type: 'experience',
        type_label: 'Deneyim & Blog',
        title: 'Kampüs Çevresi Özel Yurt Fiyat Listesi 2026',
        subtitle: 'Barınma & Yurt · 3 dk okuma',
        summary: 'Kampüse yakın özel öğrenci apartlarının iletişim numaraları ve ticari kampanya bağlantıları.',
        status: 'rejected',
        admin_note: 'Topluluk Kuralları gereği doğrudan ticari reklam, fiyat broşürü veya iletişim numarası içeren paylaşımlar onaylanmamaktadır.',
        created_at: '2026-10-08T18:10:00',
        is_sample: true
    }
];

const STATUS_BADGE_MAP = {
    pending: {
        label: 'İnceleniyor',
        icon: 'clock',
        badgeClass: 'bg-amber-950/60 text-amber-400 border-amber-500/30',
        dotClass: 'bg-amber-400',
        noteBoxClass: 'bg-amber-950/15 border-amber-500/25 text-amber-200/90',
        noteIconColor: 'text-amber-400'
    },
    approved: {
        label: 'Onaylandı',
        icon: 'check-circle-2',
        badgeClass: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
        dotClass: 'bg-emerald-400',
        noteBoxClass: 'bg-emerald-950/15 border-emerald-500/25 text-emerald-200/90',
        noteIconColor: 'text-emerald-400'
    },
    rejected: {
        label: 'Reddedildi',
        icon: 'x-circle',
        badgeClass: 'bg-rose-950/60 text-rose-400 border-rose-500/30',
        dotClass: 'bg-rose-400',
        noteBoxClass: 'bg-rose-950/15 border-rose-500/25 text-rose-200/90',
        noteIconColor: 'text-rose-400'
    }
};

function initProfilePage(params) {
    const listContainer = document.getElementById('user-reviews-list');
    if (!listContainer) return () => {};

    const targetUser = params.get('user') || CURRENT_USER.name;
    const isCurrentUser = !params.get('user') || targetUser === CURRENT_USER.name;

    const reviewsTab = document.getElementById('profile-reviews-tab');
    const submissionsTab = document.getElementById('profile-submissions-tab');
    const settingsTab = document.getElementById('profile-settings-tab');

    const reviewsPanel = document.getElementById('profile-reviews-panel');
    const submissionsPanel = document.getElementById('profile-submissions-panel');
    const settingsPanel = document.getElementById('profile-settings-panel');

    const logoutButton = document.getElementById('profile-logout-btn');
    const editQuickBtn = document.getElementById('profile-edit-quick-btn');
    const settingsForm = document.getElementById('profile-settings-form');
    const settingsMessage = document.getElementById('profile-settings-message');
    const bioInput = document.getElementById('settings-bio');
    const bioCounter = document.getElementById('settings-bio-counter');

    let profile = null;
    let reviews = isCurrentUser ? [] : getAllReviewsGlobal().filter(review => review.user === targetUser);
    let submissions = [];
    let favorites = [];
    let activeSubmissionFilter = 'all';

    // Populate University Datalist in Settings Form
    const uniDatalist = document.getElementById('profile-uni-datalist');
    if (uniDatalist && typeof TURKISH_UNIVERSITIES !== 'undefined') {
        uniDatalist.innerHTML = TURKISH_UNIVERSITIES.map(u => `<option value="${escapeHtml(u)}"></option>`).join('');
    }

    if (bioInput && bioCounter) {
        bioInput.addEventListener('input', () => {
            bioCounter.textContent = `${bioInput.value.length} / 240`;
        });
    }

    if (!isCurrentUser) {
        if (submissionsTab) submissionsTab.hidden = true;
        if (submissionsPanel) submissionsPanel.hidden = true;
        if (settingsTab) settingsTab.hidden = true;
        if (settingsPanel) settingsPanel.hidden = true;
        if (logoutButton) logoutButton.hidden = true;
        if (editQuickBtn) editQuickBtn.hidden = true;
    }

    // ─── Tab Switching Logic ───
    function setActiveTab(tabName) {
        document.querySelectorAll('[data-profile-tab]').forEach(tab => {
            const selected = tab.dataset.profileTab === tabName;
            tab.classList.toggle('is-active', selected);
            tab.setAttribute('aria-selected', String(selected));
        });

        if (reviewsPanel) {
            const hideRev = tabName !== 'reviews';
            reviewsPanel.hidden = hideRev;
            reviewsPanel.classList.toggle('hidden', hideRev);
        }
        if (submissionsPanel) {
            const hideSub = tabName !== 'submissions' || !isCurrentUser;
            submissionsPanel.hidden = hideSub;
            submissionsPanel.classList.toggle('hidden', hideSub);
        }
        if (settingsPanel) {
            const hideSet = tabName !== 'settings' || !isCurrentUser;
            settingsPanel.hidden = hideSet;
            settingsPanel.classList.toggle('hidden', hideSet);
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    document.querySelectorAll('[data-profile-tab]').forEach(tab => {
        tab.addEventListener('click', () => setActiveTab(tab.dataset.profileTab));
    });

    editQuickBtn?.addEventListener('click', () => {
        setActiveTab('settings');
        settingsPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ─── Submission Filter Chips ───
    document.querySelectorAll('[data-sub-filter]').forEach(chip => {
        chip.addEventListener('click', () => {
            activeSubmissionFilter = chip.dataset.subFilter || 'all';
            document.querySelectorAll('[data-sub-filter]').forEach(c => {
                const isSelected = c.dataset.subFilter === activeSubmissionFilter;
                c.className = isSelected
                    ? 'sub-filter-chip px-3 py-1.5 rounded-xl text-xs font-medium border border-cyan-400 bg-cyan-950/30 text-cyan-400 transition-all cursor-pointer inline-flex items-center gap-1.5'
                    : 'sub-filter-chip px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 transition-all cursor-pointer inline-flex items-center gap-1.5';
            });
            renderSubmissionsList();
        });
    });

    function formatSubmissionDate(isoStr) {
        if (!isoStr) return 'Yakın zamanda';
        try {
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return isoStr;
            return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch (e) {
            return isoStr;
        }
    }

    // ─── Render Submissions Status Cards ───
    function renderSubmissionsList() {
        const subContainer = document.getElementById('user-submissions-list');
        if (!subContainer) return;

        // Combine real DB submissions with sample cards so all 3 status badges are demonstrable
        const combined = [...submissions];
        const existingStatuses = new Set(combined.map(item => item.status));
        SAMPLE_SUBMISSIONS_MOCK.forEach(mock => {
            if (!existingStatuses.has(mock.status) || combined.length === 0) {
                combined.push(mock);
            }
        });

        const tabBadgeSub = document.getElementById('tab-badge-submissions');
        if (tabBadgeSub) tabBadgeSub.textContent = combined.length;

        const statSubEl = document.getElementById('stat-submissions-count');
        if (statSubEl) statSubEl.textContent = combined.length;

        const filtered = activeSubmissionFilter === 'all'
            ? combined
            : combined.filter(item => item.status === activeSubmissionFilter);

        if (filtered.length === 0) {
            subContainer.innerHTML = `
                <div class="p-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 text-center space-y-3">
                    <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                        <i data-lucide="folder-open" class="w-6 h-6"></i>
                    </div>
                    <h4 class="text-sm font-bold text-zinc-200">Bu filtrede başvuru veya öneri bulunamadı</h4>
                    <p class="text-xs text-zinc-500 max-w-md mx-auto">Yeni bir üniversite önerebilir veya kampüs deneyimlerinizi blog yazısı olarak gönderebilirsiniz.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        subContainer.innerHTML = filtered.map(item => {
            const st = STATUS_BADGE_MAP[item.status] || STATUS_BADGE_MAP.pending;
            const isSchool = item.type === 'school_suggestion';
            const typeIcon = isSchool ? 'building-2' : 'book-open';
            const typeBadgeColor = isSchool
                ? 'bg-purple-950/50 text-purple-300 border-purple-500/30'
                : 'bg-sky-950/50 text-sky-300 border-sky-500/30';

            return `
                <article class="rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-all duration-200 p-5 sm:p-6 space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${typeBadgeColor}">
                                <i data-lucide="${typeIcon}" class="w-3.5 h-3.5"></i>
                                <span>${escapeHtml(item.type_label || (isSchool ? 'Okul Önerisi' : 'Deneyim & Blog'))}</span>
                            </span>
                            <span class="text-xs text-zinc-500 flex items-center gap-1">
                                <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                                <span>${escapeHtml(formatSubmissionDate(item.created_at))}</span>
                            </span>
                        </div>

                        <!-- Status Badge (Pending / Approved / Rejected) -->
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${st.badgeClass}">
                            <i data-lucide="${st.icon}" class="w-3.5 h-3.5"></i>
                            <span>${st.label}</span>
                        </span>
                    </div>

                    <div>
                        <h4 class="text-base sm:text-lg font-bold text-zinc-100">${escapeHtml(item.title)}</h4>
                        <p class="text-xs font-medium text-cyan-400/90 mt-0.5">${escapeHtml(item.subtitle || '')}</p>
                        ${item.summary ? `<p class="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">${escapeHtml(item.summary)}</p>` : ''}
                    </div>

                    <!-- Admin / Moderator Durum Notu -->
                    <div class="rounded-xl border p-3.5 flex items-start gap-3 ${st.noteBoxClass}">
                        <i data-lucide="info" class="w-4 h-4 shrink-0 mt-0.5 ${st.noteIconColor}"></i>
                        <div class="text-xs leading-relaxed">
                            <span class="font-bold block mb-0.5">Moderasyon Notu & Durum:</span>
                            <span>${escapeHtml(item.admin_note || 'Başvurunuz kayıt altına alınmıştır.')}</span>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ─── Render Right Sidebar Widgets ───
    function renderSidebarWidgets(reviewLikeCount) {
        const allSubs = [...submissions];
        const existingStatuses = new Set(allSubs.map(i => i.status));
        SAMPLE_SUBMISSIONS_MOCK.forEach(m => {
            if (!existingStatuses.has(m.status) || allSubs.length === 0) allSubs.push(m);
        });

        const approvedCount = allSubs.filter(s => s.status === 'approved').length;
        const pendingCount = allSubs.filter(s => s.status === 'pending').length;

        // 1. Completeness Calculation
        let completeness = 20; // Name exists
        if (profile?.university) completeness += 25;
        if (profile?.department) completeness += 25;
        if (profile?.grade) completeness += 15;
        if (profile?.bio) completeness += 15;
        if (completeness > 100) completeness = 100;

        const pctEl = document.getElementById('profile-completeness-pct');
        const barEl = document.getElementById('profile-completeness-bar');
        const lblEl = document.getElementById('profile-completeness-label');
        if (pctEl) pctEl.textContent = `%${completeness}`;
        if (barEl) barEl.style.width = `${completeness}%`;
        if (lblEl) {
            lblEl.textContent = completeness === 100 ? 'Tamamlandı' : completeness >= 70 ? 'Çok İyi' : 'Geliştirilebilir';
        }

        // Average rating
        const avgRating = reviews.length > 0
            ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
            : '0.0';

        const avgEl = document.getElementById('sidebar-avg-rating');
        const appEl = document.getElementById('sidebar-approved-count');
        const pendEl = document.getElementById('sidebar-pending-count');
        const joinEl = document.getElementById('sidebar-join-date');

        if (avgEl) avgEl.textContent = `${avgRating} / 5.0`;
        if (appEl) appEl.textContent = `${approvedCount + reviews.length} İçerik`;
        if (pendEl) pendEl.textContent = `${pendingCount} Başvuru`;
        if (joinEl) joinEl.textContent = profile?.created_at || 'Mart 2026';

        // 2. Badges Widget
        const badges = [
            {
                title: 'Doğrulanmış Üye',
                desc: 'Kampüs Sesi topluluk üyesi',
                icon: 'shield-check',
                unlocked: true,
                color: 'text-cyan-400 bg-cyan-950/50 border-cyan-500/30'
            },
            {
                title: 'İlk Ses',
                desc: 'İlk kampüs yorumunu paylaştı',
                icon: 'message-square',
                unlocked: reviews.length >= 1,
                color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30'
            },
            {
                title: 'Kampüs Kaşifi',
                desc: 'Okul veya deneyim önerisi sundu',
                icon: 'compass',
                unlocked: allSubs.length >= 1,
                color: 'text-sky-400 bg-sky-950/50 border-sky-500/30'
            },
            {
                title: 'Beğeni Mıknatısı',
                desc: 'Yorumları öğrencilerden destek aldı',
                icon: 'thumbs-up',
                unlocked: reviewLikeCount >= 1,
                color: 'text-amber-400 bg-amber-950/50 border-amber-500/30'
            },
            {
                title: 'Tam Profil',
                desc: 'Akademik bilgilerini tamamladı',
                icon: 'user-check',
                unlocked: completeness >= 70,
                color: 'text-indigo-400 bg-indigo-950/50 border-indigo-500/30'
            },
            {
                title: 'Kampüs Elçisi',
                desc: '3+ değerlendirme veya yönetici',
                icon: 'award',
                unlocked: reviews.length >= 3 || profile?.role === 'admin' || CURRENT_USER.role === 'admin',
                color: 'text-purple-400 bg-purple-950/50 border-purple-500/30'
            }
        ];

        const unlockedCount = badges.filter(b => b.unlocked).length;
        const badgeCountEl = document.getElementById('profile-badges-count');
        if (badgeCountEl) badgeCountEl.textContent = `${unlockedCount} / ${badges.length} Kazanıldı`;

        const badgesGrid = document.getElementById('profile-badges-grid');
        if (badgesGrid) {
            badgesGrid.innerHTML = badges.map(b => `
                <div class="p-3 rounded-xl border transition-all ${b.unlocked ? 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-950/30 border-zinc-800/40 opacity-45'} flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <div class="w-8 h-8 rounded-lg border flex items-center justify-center ${b.unlocked ? b.color : 'bg-zinc-900 border-zinc-800 text-zinc-500'}">
                            <i data-lucide="${b.icon}" class="w-4 h-4"></i>
                        </div>
                        ${b.unlocked
                            ? '<span class="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20">Aktif</span>'
                            : '<i data-lucide="lock" class="w-3.5 h-3.5 text-zinc-600"></i>'
                        }
                    </div>
                    <div>
                        <div class="text-xs font-bold text-zinc-100 leading-tight">${escapeHtml(b.title)}</div>
                        <div class="text-[10px] text-zinc-500 mt-0.5 leading-snug">${escapeHtml(b.desc)}</div>
                    </div>
                </div>
            `).join('');
        }

        // 3. Favorites Widget
        const favCountHeader = document.getElementById('stat-favorites-count');
        if (favCountHeader) favCountHeader.textContent = favorites.length;

        const favListEl = document.getElementById('profile-favorites-list');
        if (favListEl) {
            if (favorites.length === 0) {
                const defaultSuggestions = [
                    'Boğaziçi Üniversitesi',
                    'Orta Doğu Teknik Üniversitesi (ODTÜ)',
                    'İstanbul Teknik Üniversitesi'
                ];
                favListEl.innerHTML = `
                    <p class="text-xs text-zinc-500 mb-2">Henüz favori üniversite eklemediniz. Popüler kampüsleri inceleyin:</p>
                    ${defaultSuggestions.map(u => `
                        <a href="#/university?name=${encodeURIComponent(u)}" class="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-2 group">
                            <div class="flex items-center gap-2.5 min-w-0">
                                <div class="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shrink-0">
                                    <i data-lucide="building-2" class="w-3.5 h-3.5"></i>
                                </div>
                                <span class="text-xs font-semibold text-zinc-200 group-hover:text-cyan-400 transition-colors truncate">${escapeHtml(u)}</span>
                            </div>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 shrink-0"></i>
                        </a>
                    `).join('')}
                `;
            } else {
                favListEl.innerHTML = favorites.slice(0, 5).map(u => `
                    <div class="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-2 group">
                        <a href="#/university?name=${encodeURIComponent(u)}" class="flex items-center gap-2.5 min-w-0 flex-1">
                            <div class="w-7 h-7 rounded-lg bg-rose-950/50 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                                <i data-lucide="heart" class="w-3.5 h-3.5"></i>
                            </div>
                            <span class="text-xs font-semibold text-zinc-200 group-hover:text-cyan-400 transition-colors truncate">${escapeHtml(u)}</span>
                        </a>
                        <a href="#/university?name=${encodeURIComponent(u)}" class="text-[11px] font-semibold text-cyan-400 hover:underline shrink-0">İncele</a>
                    </div>
                `).join('');
            }
        }
    }

    // ─── Main Render Function ───
    function render() {
        const targetReviews = reviews;
        const reviewLikeCount = targetReviews.reduce((sum, review) => {
            const interactions = getInteractions()[review.id] || { likes: [], dislikes: [] };
            return sum + interactions.likes.length;
        }, 0);

        const displayName = profile?.name || targetReviews[0]?.user || targetUser;
        const displayInitials = profile?.initials || targetReviews[0]?.initials || getInitials(displayName);
        const academicParts = [profile?.university, profile?.department].filter(Boolean);
        const academicInfo = academicParts.join(' · ');
        const totalUpvotes = profile?.stats?.upvote_count ?? reviewLikeCount;
        const totalReviews = profile?.stats?.review_count ?? targetReviews.length;

        const avatarEl = document.getElementById('profile-avatar');
        const nameEl = document.getElementById('profile-name');
        const academicEl = document.getElementById('profile-academic-info');
        const bioTextEl = document.getElementById('profile-bio-text');
        const gradePillEl = document.getElementById('profile-grade-pill');
        const roleTextEl = document.getElementById('profile-role-text');

        if (avatarEl) avatarEl.textContent = displayInitials;
        if (nameEl) nameEl.textContent = displayName;
        if (academicEl) {
            academicEl.innerHTML = `
                <i data-lucide="graduation-cap" class="w-4 h-4 text-cyan-400 shrink-0"></i>
                <span>${escapeHtml(academicInfo || 'Üniversite ve bölüm bilgisi henüz eklenmemiş.')}</span>
            `;
        }

        if (gradePillEl) {
            if (profile?.grade) {
                gradePillEl.textContent = profile.grade;
                gradePillEl.classList.remove('hidden');
                gradePillEl.classList.add('inline-flex');
            } else {
                gradePillEl.classList.add('hidden');
            }
        }

        if (bioTextEl) {
            bioTextEl.textContent = profile?.bio || 'Henüz kısa biyografi eklenmemiş. Ayarlar sekmesinden kendinizi tanıtabilirsiniz.';
        }

        if (roleTextEl) {
            const roleVal = profile?.role || CURRENT_USER.role || 'user';
            roleTextEl.textContent = roleVal === 'admin' ? 'Platform Yöneticisi (Admin)' : roleVal === 'moderator' ? 'Moderatör' : 'Doğrulanmış Öğrenci';
        }

        const statRevEl = document.getElementById('stat-review-count');
        const statUpEl = document.getElementById('stat-upvotes');
        const tabBadgeRev = document.getElementById('tab-badge-reviews');

        if (statRevEl) statRevEl.textContent = totalReviews;
        if (statUpEl) statUpEl.textContent = totalUpvotes;
        if (tabBadgeRev) tabBadgeRev.textContent = totalReviews;

        // Populate Settings Form
        if (isCurrentUser && profile) {
            const nameInp = document.getElementById('settings-name');
            const uniInp = document.getElementById('settings-university');
            const deptInp = document.getElementById('settings-department');
            const gradeInp = document.getElementById('settings-grade');
            const bioInp = document.getElementById('settings-bio');

            if (nameInp) nameInp.value = profile.name || '';
            if (uniInp) uniInp.value = profile.university || '';
            if (deptInp) deptInp.value = profile.department || '';
            if (gradeInp) gradeInp.value = profile.grade || '';
            if (bioInp) {
                bioInp.value = profile.bio || '';
                if (bioCounter) bioCounter.textContent = `${bioInp.value.length} / 240`;
            }
        }

        // Render Reviews List
        if (targetReviews.length === 0) {
            listContainer.innerHTML = `
                <div class="p-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 text-center space-y-4">
                    <div class="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                        <i data-lucide="message-square" class="w-6 h-6"></i>
                    </div>
                    <div class="space-y-1">
                        <h4 class="text-base font-bold text-zinc-100">${isCurrentUser ? 'Henüz bir değerlendirmeniz bulunmuyor' : 'Bu kullanıcının henüz değerlendirmesi yok'}</h4>
                        <p class="text-xs text-zinc-500 max-w-md mx-auto">Okuduğunuz üniversitenin kampüs, eğitim, yemekhane veya yurt olanaklarını değerlendirerek aday öğrencilere yol gösterin.</p>
                    </div>
                    ${isCurrentUser ? `
                        <a href="#/review-form" class="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold text-xs inline-flex items-center gap-2 transition-all">
                            <i data-lucide="pen-line" class="w-4 h-4"></i>
                            <span>İlk Değerlendirmeyi Sen Yaz</span>
                        </a>
                    ` : ''}
                </div>
            `;
        } else {
            listContainer.innerHTML = targetReviews
                .map(review => renderReviewCard(review, { showUni: true, showDelete: isCurrentUser }))
                .join('');
        }

        // Render Submissions & Sidebar
        renderSubmissionsList();
        renderSidebarWidgets(totalUpvotes);

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if (isCurrentUser) {
        listContainer.innerHTML = '<div class="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 text-center text-xs text-zinc-400">Profil verileri yükleniyor...</div>';
        Promise.all([
            api.getMyProfile().catch(() => null),
            api.getMyReviews().catch(() => []),
            api.getMySubmissions().catch(() => ({ submissions: [] })),
            api.getFavorites().catch(() => [])
        ]).then(([userProfile, userReviews, userSubmissions, userFavorites]) => {
            profile = userProfile;
            reviews = userReviews || [];
            submissions = userSubmissions?.submissions || [];
            favorites = Array.isArray(userFavorites) ? userFavorites : [];
            render();
        }).catch(error => {
            listContainer.innerHTML = `<div class="p-8 rounded-2xl border border-rose-500/30 bg-rose-950/20 text-center text-xs text-rose-400">${escapeHtml(error.message)}</div>`;
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
                name: (formData.get('name') || '').trim(),
                university: (formData.get('university') || '').trim(),
                department: (formData.get('department') || '').trim(),
                grade: (formData.get('grade') || '').trim(),
                bio: (formData.get('bio') || '').trim()
            };
            const newPassword = (formData.get('new_password') || '').trim();
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
                const curPassInp = document.getElementById('settings-current-password');
                const newPassInp = document.getElementById('settings-new-password');
                if (curPassInp) curPassInp.value = '';
                if (newPassInp) newPassInp.value = '';
                render();
                settingsMessage.textContent = 'Değişiklikler başarıyla kaydedildi.';
                showToast('Profil bilgileriniz güncellendi.');
            } catch (error) {
                settingsMessage.textContent = error.message;
                showToast(`Hata: ${error.message}`);
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

    // Legal Modal (Pop-up) Handler for Registration Checkbox Links
    const regConsentCheckbox = document.getElementById('reg-legal-consent');
    const legalModal = document.getElementById('auth-legal-modal');
    const legalModalBackdrop = document.getElementById('auth-legal-modal-backdrop');
    const legalModalClose = document.getElementById('auth-legal-modal-close');
    const legalModalCancel = document.getElementById('auth-legal-modal-cancel');
    const legalModalAccept = document.getElementById('auth-legal-modal-accept');
    const modalTabs = document.querySelectorAll('[data-modal-tab]');
    const paneTerms = document.getElementById('modal-content-terms');
    const paneKvkk = document.getElementById('modal-content-kvkk');

    function switchLegalModalTab(tabName) {
        modalTabs.forEach(t => {
            t.classList.toggle('active', t.dataset.modalTab === tabName);
        });
        if (paneTerms && paneKvkk) {
            if (tabName === 'kvkk') {
                paneTerms.hidden = true;
                paneKvkk.hidden = false;
            } else {
                paneTerms.hidden = false;
                paneKvkk.hidden = true;
            }
        }
        const bodyEl = document.getElementById('auth-legal-modal-body');
        if (bodyEl) bodyEl.scrollTop = 0;
    }

    function openLegalModal(tabName) {
        if (!legalModal) return;
        switchLegalModalTab(tabName || 'terms');
        legalModal.hidden = false;
        legalModal.removeAttribute('hidden');
        requestAnimationFrame(() => {
            legalModal.classList.add('auth-legal-modal--open');
        });
    }

    function closeLegalModal() {
        if (!legalModal) return;
        legalModal.classList.remove('auth-legal-modal--open');
        setTimeout(() => {
            legalModal.hidden = true;
        }, 200);
    }

    document.querySelectorAll('[data-legal-modal]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLegalModal(link.dataset.legalModal);
        });
    });

    modalTabs.forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
            switchLegalModalTab(tabBtn.dataset.modalTab);
        });
    });

    if (legalModalClose) legalModalClose.addEventListener('click', closeLegalModal);
    if (legalModalCancel) legalModalCancel.addEventListener('click', closeLegalModal);
    if (legalModalBackdrop) legalModalBackdrop.addEventListener('click', closeLegalModal);

    if (legalModalAccept) {
        legalModalAccept.addEventListener('click', () => {
            if (regConsentCheckbox) {
                regConsentCheckbox.checked = true;
            }
            closeLegalModal();
        });
    }

    // Register Handle
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-password').value;
        const consentCheckbox = document.getElementById('reg-legal-consent');
        const errDiv = document.getElementById('reg-error');
        const btn = registerForm.querySelector('button[type="submit"]') || registerForm.querySelector('button');

        if (consentCheckbox && !consentCheckbox.checked) {
            errDiv.textContent = "Kayıt olabilmek için Kullanıcı Sözleşmesi'ni ve KVKK Aydınlatma Metni'ni onaylamalısınız.";
            return;
        }

        errDiv.textContent = '';
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

    const COMPARE_CRITERIA = [
        {
            id: 'genel',
            label: 'Genel Puan',
            icon: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`
        },
        {
            id: 'yurt',
            label: 'Yurt',
            icon: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
        },
        {
            id: 'yemekhane',
            label: 'Yemekhane',
            icon: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v16"/><path d="M6 2v19"/><path d="M9 2a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3V2z"/></svg>`
        },
        {
            id: 'ulasim',
            label: 'Ulaşım',
            icon: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.6 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>`
        },
        {
            id: 'sosyal',
            label: 'Sosyal Hayat',
            icon: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
        },
        {
            id: 'egitim',
            label: 'Akademik',
            icon: `<svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
        }
    ];

    const normKey = (s) => String(s || '').replace(/\s*\([^)]*\)/g, '').trim().toLocaleLowerCase('tr');

    function getUniStats(name) {
        const target = normKey(name);
        const reviews = getAllReviewsGlobal().filter(r => normKey(r.university) === target);
        const stats = {};

        COMPARE_CRITERIA.forEach(crit => {
            let matching;
            if (crit.id === 'genel') {
                matching = reviews.filter(r => Number(r.rating) >= 1);
            } else if (crit.id === 'egitim') {
                matching = reviews.filter(r => Array.isArray(r.tags) && (r.tags.includes('egitim') || r.tags.includes('akademik')));
            } else {
                matching = reviews.filter(r => Array.isArray(r.tags) && r.tags.includes(crit.id));
            }

            if (matching.length > 0) {
                const sum = matching.reduce((acc, r) => acc + Number(r.rating), 0);
                stats[crit.id] = {
                    avg: sum / matching.length,
                    count: matching.length
                };
            } else {
                stats[crit.id] = null;
            }
        });

        return { totalReviews: reviews.length, stats };
    }

    function renderComparison() {
        const u1Stats = getUniStats(uni1);
        const u2Stats = getUniStats(uni2);

        const details1 = UNI_DETAILS[uni1] ? { ...UNI_DETAILS[uni1] } : { ...GENERIC_UNI_DATA };
        const details2 = UNI_DETAILS[uni2] ? { ...UNI_DETAILS[uni2] } : { ...GENERIC_UNI_DATA };

        function buildColHtml(name, statsObj, otherStatsObj, details, colIdx) {
            const initial = String(name || '?').trim().charAt(0).toLocaleUpperCase('tr');
            const criteriaHtml = COMPARE_CRITERIA.map(crit => {
                const s = statsObj.stats[crit.id];
                const o = otherStatsObj.stats[crit.id];
                const isLead = s && (!o || s.avg > o.avg || (s.avg === o.avg && s.count >= (o.count || 0)));

                if (!s) {
                    return `
                        <div class="cmp-row cmp-row--empty">
                            <div class="cmp-row__top">
                                <span class="cmp-row__label">${crit.icon} <span>${crit.label}</span></span>
                                <span class="cmp-insufficient">Yetersiz veri</span>
                            </div>
                        </div>
                    `;
                }

                const pct = Math.min(100, Math.max(10, Math.round((s.avg / 5) * 100)));
                return `
                    <div class="cmp-row${isLead ? ' is-lead' : ''}">
                        <div class="cmp-row__top">
                            <span class="cmp-row__label">${crit.icon} <span>${crit.label}</span></span>
                            <span class="cmp-row__val">${s.avg.toFixed(1)} <small>(${s.count})</small></span>
                        </div>
                        <div class="cmp-bar" role="progressbar" aria-valuenow="${s.avg.toFixed(1)}" aria-valuemin="1" aria-valuemax="5">
                            <span class="cmp-bar__fill" style="width: ${pct}%;"></span>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="cmp-card__photo-box">
                    <img src="${details.image}" class="cmp-card__cover compare-img-${colIdx}" alt="${name}" loading="lazy">
                    <div class="cmp-card__logo-badge">
                        <span class="cmp-card__logo--mono compare-logo-${colIdx}" aria-hidden="true">${initial}</span>
                    </div>
                </div>
                <h2 class="cmp-card__title">${name}</h2>
                <div class="cmp-card__meta">
                    <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>${details.subtitle || 'Türkiye'}</span>
                    ${statsObj.totalReviews > 0 ? `<span>· ${statsObj.totalReviews} değerlendirme</span>` : ''}
                </div>

                <div class="cmp-metrics">
                    <div class="cmp-metrics__title">Kriter Puanları</div>
                    ${criteriaHtml}
                </div>

                ${details.rank ? `
                    <div class="compare-section">
                        <div class="cmp-rank-tag">Başarı Sıralaması: ${details.rank}</div>
                    </div>
                ` : ''}

                ${details.aboutShort ? `
                    <div class="compare-section">
                        <h3 class="cmp-sec-title">Hakkında</h3>
                        <p class="cmp-sec-desc">${details.aboutShort}</p>
                    </div>
                ` : ''}

                ${details.transport && details.transport.length > 0 ? `
                    <div class="compare-section">
                        <h3 class="cmp-sec-title">Ulaşım Bilgisi</h3>
                        <ul class="cmp-transport-list">
                            ${details.transport.map(t => `
                                <li>
                                    <strong>${t.from}</strong> <span class="cmp-arrow">→</span> ${t.duration} <small>(${t.type})</small>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            `;
        }

        res1.innerHTML = buildColHtml(uni1, u1Stats, u2Stats, details1, 1);
        res2.innerHTML = buildColHtml(uni2, u2Stats, u1Stats, details2, 2);

        // Fetch cover images and logos asynchronously from API / Wikipedia
        [ { name: uni1, idx: 1 }, { name: uni2, idx: 2 } ].forEach(({ name, idx }) => {
            const container = idx === 1 ? res1 : res2;
            api.getUniversity(name).then(uniDb => {
                if (uniDb && uniDb.image_url && uniDb.image_url.trim() !== '') {
                    const logoContainer = container.querySelector(`.compare-logo-${idx}`);
                    if (logoContainer) {
                        const img = document.createElement('img');
                        img.src = uniDb.image_url;
                        img.className = 'cmp-card__logo';
                        img.alt = '';
                        img.loading = 'lazy';
                        img.onerror = () => { img.replaceWith(logoContainer); };
                        logoContainer.replaceWith(img);
                    }
                }
                if (uniDb && uniDb.cover_url && uniDb.cover_url.trim() !== '') {
                    const imgEl = container.querySelector(`.compare-img-${idx}`);
                    if (imgEl) imgEl.src = uniDb.cover_url;
                } else {
                    fetchWikipediaImage(name).then(url => {
                        if (url) {
                            const imgEl = container.querySelector(`.compare-img-${idx}`);
                            if (imgEl) imgEl.src = url;
                        }
                    }).catch(() => {});
                }
            }).catch(() => {
                fetchWikipediaImage(name).then(url => {
                    if (url) {
                        const imgEl = container.querySelector(`.compare-img-${idx}`);
                        if (imgEl) imgEl.src = url;
                    }
                }).catch(() => {});
            });
        });
    }

    initCustomSelect('custom-uni-select-1', typeof TURKISH_UNIVERSITIES !== 'undefined' ? TURKISH_UNIVERSITIES : [], (newUni) => {
        uni1 = newUni;
        renderComparison();
    }, uni1);

    initCustomSelect('custom-uni-select-2', typeof TURKISH_UNIVERSITIES !== 'undefined' ? TURKISH_UNIVERSITIES : [], (newUni) => {
        uni2 = newUni;
        renderComparison();
    }, uni2);

    renderComparison();

    return () => {
        renderComparison();
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

    if (route === 'admin') {
        if (!CURRENT_USER || CURRENT_USER.uid === 'guest') {
            showToast('⚠️ Admin paneline erişmek için lütfen giriş yapın.');
            window.location.hash = '#/login';
            return;
        }
        if (CURRENT_USER.role !== 'admin' && CURRENT_USER.role !== 'moderator') {
            showToast('⛔ Bu sayfaya yalnızca yöneticiler erişebilir.');
            window.location.hash = '#/home';
            return;
        }
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
        'kvkk': TEMPLATES.gizlilik,
        'cerez-politikasi': TEMPLATES.cerezPolitikasi,
        'cookies': TEMPLATES.cerezPolitikasi,
        'kullanim-sartlari': TEMPLATES.kullanimSartlari,
        'terms': TEMPLATES.kullanimSartlari,
        'favorites': TEMPLATES.favorites,
        'cities': TEMPLATES.cities,
        'ranking': TEMPLATES.ranking,
        'departments': TEMPLATES.departments,
        'admin': TEMPLATES.admin
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
        'gizlilik': 'KVKK Aydınlatma ve Gizlilik Politikası — Kampüs Sesi',
        'privacy': 'KVKK Aydınlatma ve Gizlilik Politikası — Kampüs Sesi',
        'kvkk': 'KVKK Aydınlatma ve Gizlilik Politikası — Kampüs Sesi',
        'cerez-politikasi': 'Çerez (Cookie) Politikası — Kampüs Sesi',
        'cookies': 'Çerez (Cookie) Politikası — Kampüs Sesi',
        'kullanim-sartlari': 'Kullanıcı Sözleşmesi — Kampüs Sesi',
        'terms': 'Kullanıcı Sözleşmesi — Kampüs Sesi',
        'favorites': 'Favorilerim — Kampüs Sesi',
        'cities': 'Şehirler — Kampüs Sesi',
        'ranking': 'Sıralama — Kampüs Sesi',
        'departments': 'Bölümler — Kampüs Sesi',
        'admin': 'Admin & Moderasyon Paneli — Kampüs Sesi'
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
        const initialUni = params.get('name') || selectedUniState || 'Bandırma Onyedi Eylül Üniversitesi';
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
        activeRenderers.home = initHomePage();
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
    } else if (route === 'admin') {
        initAdminPage();
    }

    if (window.initAnimations) window.initAnimations(root, { pageEnter: true });
}

// ─── Admin & Moderation Panel Controller ─────────────────────
function initAdminPage() {
    let currentAdminTab = 'dashboard';
    let cachedUsers = [];
    let cachedModeration = { suggestions: [], blogs: [] };
    let cachedMessages = [];

    // 1. Tab Navigation Handlers
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabPanels = {
        'dashboard': document.getElementById('admin-tab-dashboard'),
        'users': document.getElementById('admin-tab-users'),
        'moderation': document.getElementById('admin-tab-moderation'),
        'messages': document.getElementById('admin-tab-messages')
    };

    function switchAdminTab(targetTab) {
        currentAdminTab = targetTab;

        // Update tab buttons style
        tabBtns.forEach(btn => {
            const isTarget = (btn.dataset.tab === targetTab);
            if (isTarget) {
                btn.className = 'admin-tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 text-zinc-950 cursor-pointer transition-all active-tab flex items-center gap-1.5';
            } else {
                btn.className = 'admin-tab-btn px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer transition-all flex items-center gap-1.5';
            }
        });

        // Hide all panels, show target
        Object.keys(tabPanels).forEach(key => {
            if (tabPanels[key]) {
                if (key === targetTab) {
                    tabPanels[key].classList.remove('hidden');
                } else {
                    tabPanels[key].classList.add('hidden');
                }
            }
        });

        // Load data on switch
        if (targetTab === 'dashboard') loadStats();
        else if (targetTab === 'users') loadUsers();
        else if (targetTab === 'moderation') loadModeration();
        else if (targetTab === 'messages') loadMessages();

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchAdminTab(btn.dataset.tab));
    });

    // Quick Action Jump Buttons
    document.querySelectorAll('.admin-quick-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const jumpTo = btn.dataset.jump;
            if (jumpTo) switchAdminTab(jumpTo);
        });
    });

    // 2. Dashboard Stats
    async function loadStats() {
        try {
            const stats = await api.getAdminStats();
            const elUsers = document.getElementById('admin-stat-users');
            const elReviews = document.getElementById('admin-stat-reviews');
            const elSug = document.getElementById('admin-stat-suggestions');
            const elBlogs = document.getElementById('admin-stat-blogs');
            const elMsg = document.getElementById('admin-stat-messages');
            const elDorms = document.getElementById('admin-stat-dorms');

            if (elUsers) elUsers.textContent = Number(stats.total_users || 0).toLocaleString('tr-TR');
            if (elReviews) elReviews.textContent = Number(stats.total_reviews || 0).toLocaleString('tr-TR');
            if (elSug) elSug.textContent = Number(stats.pending_suggestions || 0).toLocaleString('tr-TR');
            if (elBlogs) elBlogs.textContent = Number(stats.pending_blogs || 0).toLocaleString('tr-TR');
            if (elMsg) elMsg.textContent = Number(stats.unread_messages || 0).toLocaleString('tr-TR');
            if (elDorms) elDorms.textContent = Number(stats.total_dorms || 0).toLocaleString('tr-TR');
        } catch (err) {
            console.error("Dashboard stats error:", err);
            showToast("⚠️ İstatistikler yüklenemedi: " + err.message);
        }
    }

    // 3. User Management
    const userSearchInput = document.getElementById('admin-user-search');
    const userRoleFilter = document.getElementById('admin-user-role-filter');

    async function loadUsers() {
        const tbody = document.getElementById('admin-users-tbody');
        if (!tbody) return;
        tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-zinc-500">Kullanıcılar yükleniyor...</td></tr>`;

        try {
            const q = userSearchInput?.value.trim() || '';
            const role = userRoleFilter?.value || 'all';
            cachedUsers = await api.getAdminUsers(q, role);
            renderUsersTable(cachedUsers);
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-rose-400">Kullanıcılar alınamadı: ${escapeHtml(err.message)}</td></tr>`;
        }
    }

    function renderUsersTable(users) {
        const tbody = document.getElementById('admin-users-tbody');
        if (!tbody) return;

        if (!users || users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-zinc-500">Kriterlere uygun kayıtlı kullanıcı bulunamadı.</td></tr>`;
            return;
        }

        tbody.innerHTML = users.map(u => {
            const isSelf = (u.id === CURRENT_USER.uid);
            const initials = (u.name || 'U').substring(0, 2).toUpperCase();

            const statusBadge = u.is_active
                ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Aktif</span>`
                : `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-500/30"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Askıda</span>`;

            return `
                <tr class="hover:bg-zinc-800/30 transition-colors">
                    <td class="p-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-cyan-400 shrink-0">
                                ${initials}
                            </div>
                            <div>
                                <div class="font-bold text-white flex items-center gap-1.5">
                                    ${escapeHtml(u.name)}
                                    ${isSelf ? '<span class="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">Sen</span>' : ''}
                                </div>
                                <div class="text-[10px] text-zinc-500">Kayıt: #${u.id}</div>
                            </div>
                        </div>
                    </td>
                    <td class="p-4 text-zinc-300 font-mono text-[11px]">${escapeHtml(u.email)}</td>
                    <td class="p-4 text-zinc-400">${escapeHtml(u.university || 'Belirtilmedi')}</td>
                    <td class="p-4">
                        <select class="admin-role-select bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 outline-none focus:border-cyan-400 transition-colors" data-user-id="${u.id}" ${isSelf ? 'disabled title="Kendi yetkinizi değiştiremezsiniz"' : ''}>
                            <option value="user" ${u.role === 'user' ? 'selected' : ''}>Öğrenci (User)</option>
                            <option value="moderator" ${u.role === 'moderator' ? 'selected' : ''}>Moderatör</option>
                            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Yönetici (Admin)</option>
                        </select>
                    </td>
                    <td class="p-4">${statusBadge}</td>
                    <td class="p-4 text-right">
                        <div class="inline-flex items-center gap-1.5">
                            <button class="admin-toggle-status-btn px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${u.is_active ? 'border-rose-800/60 text-rose-400 hover:bg-rose-950/40' : 'border-emerald-800/60 text-emerald-400 hover:bg-emerald-950/40'}" data-user-id="${u.id}" data-current-active="${u.is_active}" ${isSelf ? 'disabled style="opacity:0.35;cursor:not-allowed;" title="Kendi hesabınızı askıya alamazsınız"' : ''}>
                                ${u.is_active ? 'Askıya Al' : 'Aktifleştir'}
                            </button>
                            <button class="admin-delete-user-btn p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-all" data-user-id="${u.id}" data-user-name="${escapeHtml(u.name)}" ${isSelf ? 'disabled style="opacity:0.25;cursor:not-allowed;" title="Kendi hesabınızı silemezsiniz"' : ''} title="Kullanıcıyı Kalıcı Sil">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Bind role changes
        tbody.querySelectorAll('.admin-role-select').forEach(sel => {
            sel.addEventListener('change', async (e) => {
                const userId = parseInt(e.target.dataset.userId);
                const newRole = e.target.value;
                try {
                    await api.updateAdminUserRole(userId, newRole);
                    showToast(`✅ Kullanıcı rolü "${newRole}" yapıldı.`);
                    loadStats();
                } catch (err) {
                    showToast(`❌ Rol güncellenemedi: ${err.message}`);
                    loadUsers();
                }
            });
        });

        // Bind status toggle
        tbody.querySelectorAll('.admin-toggle-status-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const userId = parseInt(btn.dataset.userId);
                const currentActive = btn.dataset.currentActive === 'true';
                const nextActive = !currentActive;
                const verb = nextActive ? 'aktifleştirilsin' : 'askıya alınsın';
                if (!confirm(`Bu kullanıcının hesabı ${verb} mi?`)) return;

                try {
                    await api.toggleAdminUserStatus(userId, nextActive);
                    showToast(nextActive ? '✅ Kullanıcı hesabı aktifleştirildi.' : '🚫 Kullanıcı hesabı askıya alındı.');
                    loadUsers();
                } catch (err) {
                    showToast(`❌ İşlem başarısız: ${err.message}`);
                }
            });
        });

        // Bind user delete
        tbody.querySelectorAll('.admin-delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const userId = parseInt(btn.dataset.userId);
                const userName = btn.dataset.userName;
                if (!confirm(`"${userName}" adlı kullanıcıyı ve tüm verilerini kalıcı olarak silmek istediğinizden emin misiniz?`)) return;

                try {
                    await api.deleteAdminUser(userId);
                    showToast(`🗑️ "${userName}" hesabı tamamen silindi.`);
                    loadUsers();
                    loadStats();
                } catch (err) {
                    showToast(`❌ Silme hatası: ${err.message}`);
                }
            });
        });
    }

    if (userSearchInput) {
        let debounceTimer;
        userSearchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => loadUsers(), 300);
        });
    }

    if (userRoleFilter) {
        userRoleFilter.addEventListener('change', () => loadUsers());
    }

    // 4. Moderation Tab (School Suggestions & Blog Submissions)
    async function loadModeration() {
        const container = document.getElementById('admin-moderation-list');
        const countBadge = document.getElementById('admin-moderation-count');
        if (!container) return;

        container.innerHTML = `<div class="p-8 text-center text-zinc-500">Bekleyen içerikler taranıyor...</div>`;

        try {
            cachedModeration = await api.getPendingModeration();
            const suggestions = cachedModeration.suggestions || [];
            const blogs = cachedModeration.blogs || [];
            const total = suggestions.length + blogs.length;

            if (countBadge) countBadge.textContent = `${total} adet bekleyen içerik`;

            if (total === 0) {
                container.innerHTML = `
                    <div class="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/40">
                        <i data-lucide="check-circle" class="w-12 h-12 text-emerald-400 mx-auto mb-3"></i>
                        <h4 class="text-base font-bold text-white mb-1">Harika! İncelenecek bekleyen içerik yok</h4>
                        <p class="text-xs text-zinc-500">Tüm okul önerileri ve blog başvuruları onaylandı veya reddedildi.</p>
                    </div>
                `;
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }

            let html = '';

            // Render School Suggestions
            suggestions.forEach(s => {
                const dateStr = s.created_at ? new Date(s.created_at).toLocaleDateString('tr-TR') : '';
                html += `
                    <div class="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="space-y-1.5 flex-1">
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/70 text-purple-400 border border-purple-800/60 flex items-center gap-1">
                                    <i data-lucide="building-2" class="w-3 h-3"></i> Okul Önerisi
                                </span>
                                <span class="text-[11px] text-zinc-500">${dateStr}</span>
                            </div>
                            <h4 class="text-base font-bold text-white">${escapeHtml(s.uni_name)}</h4>
                            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                                <span><strong class="text-zinc-500">Şehir:</strong> ${escapeHtml(s.city)}</span>
                                ${s.campus_name ? `<span><strong class="text-zinc-500">Yerleşke:</strong> ${escapeHtml(s.campus_name)}</span>` : ''}
                                ${s.website ? `<span><strong class="text-zinc-500">Web:</strong> <a href="${escapeHtml(s.website)}" target="_blank" class="text-cyan-400 hover:underline">${escapeHtml(s.website)}</a></span>` : ''}
                                <span><strong class="text-zinc-500">Öneren:</strong> ${escapeHtml(s.submitter_email || 'Anonim')}</span>
                            </div>
                            ${s.notes ? `<p class="text-xs text-zinc-400 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800 mt-2">${escapeHtml(s.notes)}</p>` : ''}
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <button class="admin-mod-btn px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40 transition-all flex items-center gap-1.5 cursor-pointer" data-type="suggestion" data-id="${s.id}" data-action="approved">
                                <i data-lucide="check" class="w-3.5 h-3.5"></i> Onayla
                            </button>
                            <button class="admin-mod-btn px-4 py-2 rounded-xl text-xs font-semibold border border-rose-500/40 bg-rose-950/30 text-rose-400 hover:bg-rose-900/40 transition-all flex items-center gap-1.5 cursor-pointer" data-type="suggestion" data-id="${s.id}" data-action="rejected">
                                <i data-lucide="x" class="w-3.5 h-3.5"></i> Reddet
                            </button>
                        </div>
                    </div>
                `;
            });

            // Render Blog Submissions
            blogs.forEach(b => {
                const dateStr = b.created_at ? new Date(b.created_at).toLocaleDateString('tr-TR') : '';
                html += `
                    <div class="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div class="space-y-1.5 flex-1">
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-950/70 text-sky-400 border border-sky-800/60 flex items-center gap-1">
                                    <i data-lucide="book-open" class="w-3 h-3"></i> Blog Başvurusu (${escapeHtml(b.category)})
                                </span>
                                <span class="text-[11px] text-zinc-500">${dateStr}</span>
                            </div>
                            <h4 class="text-base font-bold text-white">${escapeHtml(b.title)}</h4>
                            <div class="text-xs text-zinc-400 mb-2">
                                <strong class="text-zinc-500">Yazar:</strong> ${escapeHtml(b.author_info || 'Öğrenci')}
                            </div>
                            <div class="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                                ${escapeHtml(b.content)}
                            </div>
                        </div>
                        <div class="flex items-center gap-2 shrink-0 md:mt-1">
                            <button class="admin-mod-btn px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40 transition-all flex items-center gap-1.5 cursor-pointer" data-type="blog" data-id="${b.id}" data-action="approved">
                                <i data-lucide="check" class="w-3.5 h-3.5"></i> Onayla & Yayınla
                            </button>
                            <button class="admin-mod-btn px-4 py-2 rounded-xl text-xs font-semibold border border-rose-500/40 bg-rose-950/30 text-rose-400 hover:bg-rose-900/40 transition-all flex items-center gap-1.5 cursor-pointer" data-type="blog" data-id="${b.id}" data-action="rejected">
                                <i data-lucide="x" class="w-3.5 h-3.5"></i> Reddet
                            </button>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Bind moderate actions
            container.querySelectorAll('.admin-mod-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const type = btn.dataset.type;
                    const id = parseInt(btn.dataset.id);
                    const action = btn.dataset.action;
                    const actionTr = (action === 'approved') ? 'onaylandı' : 'reddedildi';

                    try {
                        await api.moderateItem(type, id, action);
                        showToast(`✅ İçerik başarıyla ${actionTr}.`);
                        loadModeration();
                        loadStats();
                    } catch (err) {
                        showToast(`❌ Moderasyon işlemi başarısız: ${err.message}`);
                    }
                });
            });

        } catch (err) {
            container.innerHTML = `<div class="p-8 text-center text-rose-400">Moderasyon verileri alınamadı: ${escapeHtml(err.message)}</div>`;
        }
    }

    // 5. Contact Messages Tab
    async function loadMessages() {
        const container = document.getElementById('admin-messages-list');
        const countBadge = document.getElementById('admin-messages-count');
        if (!container) return;

        container.innerHTML = `<div class="p-8 text-center text-zinc-500">İletişim mesajları yükleniyor...</div>`;

        try {
            cachedMessages = await api.getAdminMessages();
            const unreadCount = cachedMessages.filter(m => !m.is_read).length;

            if (countBadge) countBadge.textContent = `${unreadCount} okunmamış / ${cachedMessages.length} toplam`;

            if (cachedMessages.length === 0) {
                container.innerHTML = `
                    <div class="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/40">
                        <i data-lucide="mail-open" class="w-12 h-12 text-zinc-600 mx-auto mb-3"></i>
                        <h4 class="text-base font-bold text-white mb-1">Gelen mesaj kutusu boş</h4>
                        <p class="text-xs text-zinc-500">Henüz iletişim formundan iletilen bir talep bulunmuyor.</p>
                    </div>
                `;
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }

            container.innerHTML = cachedMessages.map(m => {
                const dateStr = m.created_at ? new Date(m.created_at).toLocaleString('tr-TR') : '';
                return `
                    <div class="p-5 rounded-2xl border ${m.is_read ? 'border-zinc-800/80 bg-zinc-900/40' : 'border-cyan-500/30 bg-zinc-900/80 shadow-lg shadow-cyan-950/20'} transition-all flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div class="space-y-2 flex-1">
                            <div class="flex items-center gap-2">
                                ${m.is_read 
                                    ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">Okundu</span>`
                                    : `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/70 text-rose-400 border border-rose-800/60 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Yeni Mesaj</span>`
                                }
                                <span class="text-xs text-zinc-500">${dateStr}</span>
                            </div>
                            <div class="flex flex-wrap items-center gap-x-3 text-xs">
                                <span class="font-bold text-white text-sm">${escapeHtml(m.sender_name)}</span>
                                <a href="mailto:${escapeHtml(m.sender_email)}" class="text-cyan-400 hover:underline font-mono text-[11px]">${escapeHtml(m.sender_email)}</a>
                            </div>
                            <div class="text-xs font-semibold text-zinc-300">
                                <span class="text-zinc-500">Konu:</span> ${escapeHtml(m.subject)}
                            </div>
                            <div class="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 leading-relaxed whitespace-pre-wrap">
                                ${escapeHtml(m.message)}
                            </div>
                        </div>
                        <div class="shrink-0 md:mt-1">
                            <button class="admin-toggle-msg-btn px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer" data-id="${m.id}" data-is-read="${m.is_read}">
                                <i data-lucide="${m.is_read ? 'mail' : 'check'}" class="w-3.5 h-3.5 ${m.is_read ? 'text-zinc-400' : 'text-cyan-400'}"></i>
                                <span>${m.is_read ? 'Okunmadı Yap' : 'Okundu Olarak İşaretle'}</span>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Bind toggle read
            container.querySelectorAll('.admin-toggle-msg-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = parseInt(btn.dataset.id);
                    const currentRead = (btn.dataset.isRead === 'true');
                    const nextRead = !currentRead;
                    try {
                        await api.toggleMessageRead(id, nextRead);
                        loadMessages();
                        loadStats();
                    } catch (err) {
                        showToast(`❌ Mesaj durumu güncellenemedi: ${err.message}`);
                    }
                });
            });

        } catch (err) {
            container.innerHTML = `<div class="p-8 text-center text-rose-400">İletişim mesajları alınamadı: ${escapeHtml(err.message)}</div>`;
        }
    }

    // Initialize with Dashboard
    loadStats();
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
    let searchQuery = (currentParams && currentParams.get('q')) || '';
    if (searchInput && searchQuery) searchInput.value = searchQuery;
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

    // 5. Vitrin: son yorumlar, öne çıkan üniversiteler, şehirler, karşılaştırma demosu (gerçek API verisi)
    return initHomeShowcase({
        api,
        getReviews: getSavedReviews,
        isLoaded: () => appDataLoaded,
        hasFailed: () => appDataFailed
    });
}

// ─── Click Interceptor for Seamless SPA Navigation ───
// (Sayfa geçiş animasyonu js/animations.js içinde, capture aşamasında çalışır.)

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore external, new tab, or modal trigger links
    if (link.hasAttribute('data-legal-modal') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || link.target === '_blank') {
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

// ─── Cookie Consent Banner Controller ─────

function initCookieConsentBanner() {
    const STORAGE_KEY = 'kampus_sesi_cookie_consent_v2';

    try {
        if (localStorage.getItem(STORAGE_KEY) === 'accepted') {
            const existing = document.getElementById('cookie-consent-banner');
            if (existing) existing.remove();
            return;
        }
    } catch (e) {}

    let banner = document.getElementById('cookie-consent-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Çerez Bilgilendirme Bandı');
        banner.innerHTML = `
            <div class="cookie-banner__inner">
                <div class="cookie-banner__content">
                    <div class="cookie-banner__icon" aria-hidden="true">🍪</div>
                    <div class="cookie-banner__text">
                        <strong>Çerez ve Gizlilik Bilgilendirmesi:</strong> Kampüs Sesi'nde reklam veya takip çerezi kullanılmaz. Yalnızca güvenli oturum yönetimi ve interaktif kampüs haritası (OpenStreetMap) entegrasyonu için zorunlu çerezler kullanılmaktadır. Detaylar için <a href="#/cerez-politikasi">Çerez Politikası</a> ve <a href="#/gizlilik">KVKK Aydınlatma Metni</a> sayfalarımızı inceleyebilirsiniz.
                    </div>
                </div>
                <div class="cookie-banner__actions">
                    <a href="#/cerez-politikasi" class="cookie-banner__link-btn">Çerez Politikası</a>
                    <button type="button" id="cookie-accept-btn" class="cookie-banner__accept-btn">Kabul Et ✓</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
    }

    banner.hidden = false;
    banner.removeAttribute('hidden');
    requestAnimationFrame(() => {
        setTimeout(() => {
            banner.classList.add('cookie-banner--visible');
        }, 80);
    });

    const acceptBtn = banner.querySelector('#cookie-accept-btn');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            try {
                localStorage.setItem(STORAGE_KEY, 'accepted');
                localStorage.setItem('kampus_sesi_cookie_consent', 'accepted');
            } catch (e) {}
            banner.classList.remove('cookie-banner--visible');
            setTimeout(() => {
                banner.hidden = true;
            }, 300);
        });
    }
}

// ─── App Lifecycle ────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Setup Hamburger & Cookie Consent Banner
    setupNavEvents();
    initCookieConsentBanner();

    // 2. Restore User Session if Token Exists
    try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('token')) {
            localStorage.setItem('kampus_sesi_token', urlParams.get('token'));
        }
        const me = await api.getMe();
        if (me) {
            CURRENT_USER = {
                uid: me.id,
                name: me.name,
                initials: me.initials || getInitials(me.name),
                email: me.email,
                role: me.role || 'user'
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
