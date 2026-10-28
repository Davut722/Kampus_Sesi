/* ========================================
   Kampüs Sesi — REST API Client (FastAPI Backend)
   ======================================== */

const API_BASE = 'http://127.0.0.1:8000/api';

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

    const response = await fetch(url, {
        ...options,
        headers
    });

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
                is_recommended: reviewData.is_recommended,
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

    async deleteAdminReview(reviewId) {
        return await request(`/admin/reviews/${reviewId}`, {
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
    }
};
