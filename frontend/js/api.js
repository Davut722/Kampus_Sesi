/* ========================================
   Kampüs Sesi — REST API Client (FastAPI Backend)
   ======================================== */

// Akıllı API Base tespiti:
// 1. Tarayıcıda http://localhost:8000 veya tünel (ngrok/Cloudflare)/canlı domain açıldığında -> kendi origin'i (/api)
// 2. VS Code Live Server (port 5500/5501 vb.), Vite (5173), Webpack/React (3000) veya file:// ile açıldığında -> FastAPI varsayılan portu olan http://localhost:8000/api
function resolveApiBase() {
    if (typeof window === 'undefined' || !window.location) {
        return 'http://localhost:8000/api';
    }

    const { protocol, hostname, port, origin } = window.location;

    // file:// doğrudan dosya olarak açıldıysa
    if (protocol === 'file:' || origin === 'null' || !origin) {
        return 'http://localhost:8000/api';
    }

    // Yerel bir geliştirme sunucusunda (Live Server 5500, Vite vb.) backend portu dışında açıldıysa
    if (port && port !== '8000' && (hostname === 'localhost' || hostname === '127.0.0.1')) {
        return `http://${hostname}:8000/api`;
    }

    // FastAPI tarafından doğrudan sunuluyorsa (port 8000) veya ngrok / domain üzerindeyse
    return `${origin}/api`;
}

export const API_BASE = resolveApiBase();

function getToken() {
    return localStorage.getItem('kampus_sesi_token');
}

function setToken(token) {
    if (token) {
        localStorage.setItem('kampus_sesi_token', token);
    } else {
        localStorage.removeItem('kampus_sesi_token');
    }
}

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(url, {
            ...options,
            headers
        });
    } catch (networkErr) {
        console.error(`[Kampüs Sesi] API bağlantı hatası (${url}):`, networkErr);
        throw new Error(`Backend sunucusuna bağlanılamadı (${API_BASE}). Lütfen 'python backend/server.py' çalıştırıp 'http://localhost:8000' adresini açın.`);
    }

    if (!response.ok) {
        let errorMsg = 'Bir hata oluştu.';
        try {
            const data = await response.json();
            errorMsg = data.detail || data.message || errorMsg;
        } catch (e) { }
        throw new Error(errorMsg);
    }

    return await response.json();
}

// FastAPI'nin rota bulunamadığında döndüğü varsayılan detay "Not Found"dur.
// Yeni eklenen uç noktalarda bu, sunucunun eski kodla çalıştığı (yeniden başlatılmadığı) anlamına gelir.
async function requestNewEndpoint(endpoint, options = {}) {
    try {
        return await request(endpoint, options);
    } catch (err) {
        if (err && err.message === 'Not Found') {
            throw new Error('Sunucu eski sürümle çalışıyor. Backend\'i durdurup yeniden başlatın (baslat.bat veya python backend/server.py).');
        }
        throw err;
    }
}

export const api = {
    // Auth
    async register(name, email, password) {
        const data = await request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        setToken(data.token);
        return data.user;
    },

    async login(email, password) {
        const data = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        setToken(data.token);
        return data.user;
    },

    async getMe() {
        const token = getToken();
        if (!token) return null;
        try {
            return await request('/auth/me');
        } catch (e) {
            setToken(null);
            return null;
        }
    },

    async getMyProfile() {
        return await request('/users/me');
    },

    async getMyReviews() {
        return await request('/users/me/reviews');
    },

    async getMySubmissions() {
        return await request('/users/me/submissions');
    },

    async updateMyProfile(profileData) {
        return await request('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(profileData)
        });
    },

    logout() {
        setToken(null);
    },

    // Reviews
    async getReviews(params = {}) {
        const query = new URLSearchParams(params).toString();
        const endpoint = `/reviews${query ? '?' + query : ''}`;
        return await request(endpoint);
    },

    async createReview(reviewData) {
        const ratingDorm = reviewData.rating_dorm || reviewData.criteria?.yurt || null;
        const ratingFood = reviewData.rating_food || reviewData.criteria?.yemekhane || null;
        const ratingTransport = reviewData.rating_transport || reviewData.criteria?.ulasim || null;
        const ratingSocial = reviewData.rating_social || reviewData.criteria?.sosyal || null;
        const ratingAcademic = reviewData.rating_academic || reviewData.criteria?.egitim || reviewData.criteria?.akademik || null;

        const cats = Array.isArray(reviewData.categories) && reviewData.categories.length > 0
            ? reviewData.categories
            : (Array.isArray(reviewData.tags) ? reviewData.tags : []);

        return await request('/reviews', {
            method: 'POST',
            body: JSON.stringify({
                university: reviewData.university,
                rating: reviewData.rating,
                categories: cats,
                tags: cats,
                text: reviewData.text,
                is_anonymous: reviewData.is_anonymous,
                education_status: reviewData.education_status,
                graduation_year: reviewData.graduation_year,
                rating_dorm: ratingDorm,
                rating_food: ratingFood,
                rating_transport: ratingTransport,
                rating_social: ratingSocial,
                rating_academic: ratingAcademic,
                criteria: {
                    yurt: ratingDorm,
                    yemekhane: ratingFood,
                    ulasim: ratingTransport,
                    sosyal: ratingSocial,
                    akademik: ratingAcademic,
                    egitim: ratingAcademic
                }
            })
        });
    },

    async deleteReview(reviewId) {
        return await request(`/reviews/${reviewId}`, {
            method: 'DELETE'
        });
    },

    async addReply(reviewId, text) {
        return await request(`/reviews/${reviewId}/reply`, {
            method: 'POST',
            body: JSON.stringify({ text })
        });
    },

    // Interactions
    async toggleLike(reviewId) {
        return await request(`/reviews/${reviewId}/like`, {
            method: 'POST'
        });
    },

    async toggleDislike(reviewId) {
        return await request(`/reviews/${reviewId}/dislike`, {
            method: 'POST'
        });
    },

    async getInteractions() {
        return await request('/interactions');
    },

    // Rankings
    async getRankings(minReviews = 10) {
        return await request(`/rankings?min_reviews=${encodeURIComponent(minReviews)}`);
    },

    // Universities
    async getUniversities() {
        return await request('/universities');
    },

    async getUniversity(uniName) {
        return await request(`/universities/${encodeURIComponent(uniName)}`);
    },
    
    async getDorms(uniId) {
        return await request(`/universities/${encodeURIComponent(uniId)}/dorms`);
    },

    async getUniversityAddress(uniIdOrName) {
        return await request(`/universities/${encodeURIComponent(uniIdOrName)}/address`);
    },

    // Suggestions
    async suggestSchool(data) {
        return await request('/suggestions/school', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Contact
    async sendContactMessage(data) {
        return await request('/contact', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Blog Submissions
    async submitBlogPost(data) {
        return await request('/blog/submissions', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // User Favorites
    async getFavorites() {
        return await request('/users/me/favorites');
    },

    async addFavorite(university) {
        return await request('/users/me/favorites', {
            method: 'POST',
            body: JSON.stringify({ university })
        });
    },

    async removeFavorite(university) {
        return await request(`/users/me/favorites/${encodeURIComponent(university)}`, {
            method: 'DELETE'
        });
    },

    // ─── Admin API ───
    async getAdminStats() {
        return await request('/admin/dashboard/stats');
    },

    async getAdminUsers(query = '', role = 'all') {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (role && role !== 'all') params.append('role', role);
        return await request(`/admin/users?${params.toString()}`);
    },

    async updateAdminUserRole(userId, newRole) {
        return await request(`/admin/users/${userId}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role: newRole })
        });
    },

    async toggleAdminUserStatus(userId, isActive) {
        return await request(`/admin/users/${userId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ is_active: isActive })
        });
    },

    async deleteAdminUser(userId) {
        return await request(`/admin/users/${userId}`, {
            method: 'DELETE'
        });
    },

    async getPendingModeration() {
        return await request('/admin/moderation/pending');
    },

    async moderateItem(contentType, contentId, action) {
        return await request(`/admin/moderation/${contentType}/${contentId}?action=${action}`, {
            method: 'PATCH'
        });
    },

    async getAdminReviews(query = '', university = '') {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (university) params.append('university', university);
        const qs = params.toString() ? `?${params.toString()}` : '';
        return await requestNewEndpoint(`/admin/reviews${qs}`);
    },

    // Not: Eski /api/reviews/{id} uç noktasına sessizce düşülmez; o yol kullanıcıya bildirim üretmez.
    async deleteAdminReview(reviewId, reason = '') {
        return await requestNewEndpoint(`/admin/reviews/${reviewId}`, {
            method: 'DELETE',
            body: reason ? JSON.stringify({ reason }) : undefined
        });
    },

    async getMyNotifications() {
        return await requestNewEndpoint('/users/me/notifications');
    },

    async markNotificationRead(notificationId) {
        return await request(`/users/me/notifications/${notificationId}/read`, {
            method: 'PATCH'
        });
    },

    async markAllNotificationsRead() {
        return await request('/users/me/notifications/read-all', {
            method: 'POST'
        });
    },

    async deleteNotification(notificationId) {
        return await request(`/users/me/notifications/${notificationId}`, {
            method: 'DELETE'
        });
    },

    async getAdminMessages() {
        return await request('/admin/messages');
    },

    async toggleMessageRead(messageId) {
        return await request(`/admin/messages/${messageId}/read`, {
            method: 'PATCH'
        });
    },

    async toggleMessageReplied(messageId, replied = null) {
        return await request(`/admin/messages/${messageId}/replied`, {
            method: 'PATCH',
            body: replied !== null ? JSON.stringify({ replied }) : undefined
        });
    },

    async replyToAdminMessage(messageId) {
        return await this.toggleMessageReplied(messageId, true);
    }
};
