/* ========================================
   Kampüs Sesi — Page HTML Templates (SPA)
   ======================================== */

export const TEMPLATES = {
    home: `
        <main class="home page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen">

            <!-- Ambient Glow Aydınlatmaları (Cyan & Gece Mavisi) -->
            <div class="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="pointer-events-none absolute top-10 -right-32 w-[32rem] h-[32rem] bg-indigo-600/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="pointer-events-none absolute top-72 left-1/2 -translate-x-1/2 w-[44rem] h-[22rem] bg-cyan-400/[0.04] rounded-full blur-3xl" aria-hidden="true"></div>

            <!-- 1. Hero & Arama Alanı (Baştan Aşağıya Düzgün Dikey Akış) -->
            <section class="home-hero-centered relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                <div class="hero-centered__content w-full flex flex-col items-center text-center">
                    
                    <!-- Üst Rozet (Badge) -->
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-6 backdrop-blur-md shadow-sm">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>Türkiye'nin İlk Şeffaf Öğrenci ve Kampüs Ağı</span>
                    </div>

                    <!-- Ana Başlık (Typography) -->
                    <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl" style="font-family: var(--font-heading);">
                        Kampüsün <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">Gerçek Sesine</span> Kulak Ver
                    </h1>

                    <!-- Alt Açıklama -->
                    <p class="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                        Broşürlerdeki süslü reklamları değil; amfilerde sabahlayan, yurtlarda kalan ve yemekhaneyi deneyimleyen öğrencilerin sansürsüz yorumlarını keşfet.
                    </p>

                    <!-- Cam Efektli Geniş Arama Çubuğu (Glassmorphism Search Bar) -->
                    <div class="hero-centered__search-wrapper relative w-full max-w-2xl mx-auto mb-6">
                        <div class="relative flex items-center p-2 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl shadow-cyan-950/20 hover:border-cyan-500/40 transition-all duration-300 group">
                            <i data-lucide="search" class="w-5 h-5 text-zinc-400 ml-3 shrink-0 group-hover:text-cyan-400 transition-colors"></i>
                            <input 
                                type="text" 
                                id="hero-search-input"
                                class="hero-centered__search-input flex-1 bg-transparent px-4 py-3 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none w-full" 
                                placeholder="Üniversite, şehir veya bölüm ara (örn. İTÜ Bilgisayar)..."
                                autocomplete="off"
                            >
                            <button 
                                type="button" 
                                id="hero-search-btn"
                                class="px-5 sm:px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-zinc-950 font-bold text-sm shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center gap-2 cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span>Keşfet</span>
                                <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Arama Altı Popüler Etiket Hapları (#İTÜ, #ODTÜ vb.) -->
                    <div class="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-zinc-400">
                        <span class="text-zinc-500 font-medium mr-1 flex items-center gap-1">
                            <i data-lucide="trending-up" class="w-3.5 h-3.5 text-cyan-400"></i> Popüler:
                        </span>
                        <button class="hero-tag-pill" data-uni="İstanbul Teknik Üniversitesi">#İTÜ</button>
                        <button class="hero-tag-pill" data-uni="Orta Doğu Teknik Üniversitesi (ODTÜ)">#ODTÜ</button>
                        <button class="hero-tag-pill" data-uni="Boğaziçi Üniversitesi">#Boğaziçi</button>
                        <button class="hero-tag-pill" data-uni="Hacettepe Üniversitesi">#Hacettepe</button>
                        <button class="hero-tag-pill" data-uni="Yıldız Teknik Üniversitesi (YTÜ)">#YTÜ</button>
                        <button class="hero-tag-pill" data-uni="Koç Üniversitesi">#Koç</button>
                    </div>

                </div>
            </section>

            <!-- 2. Özellikler Bölümü (Ferah Koyu Antrasit & Camgöbeği Temalı) -->
            <section class="home-features w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Kart 1 -->
                    <div class="group p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20 text-center">
                        <div class="w-12 h-12 rounded-xl bg-cyan-950/70 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <i data-lucide="shield-check" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white mb-2" style="font-family: var(--font-heading);">Doğrulanmış Deneyimler</h3>
                        <p class="text-sm text-zinc-400 leading-relaxed">Şeffaflığı ön planda tutarak kampüs yaşamını birinci ağızdan, sansürsüz öğrenci yorumlarıyla sunuyoruz.</p>
                    </div>

                    <!-- Kart 2 -->
                    <div class="group p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-sky-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-950/20 text-center">
                        <div class="w-12 h-12 rounded-xl bg-sky-950/70 border border-sky-800/60 flex items-center justify-center text-sky-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <i data-lucide="git-compare-arrows" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white mb-2" style="font-family: var(--font-heading);">Akıllı Karşılaştırma</h3>
                        <p class="text-sm text-zinc-400 leading-relaxed">Birden fazla üniversiteyi akademik kadro, yurt ve ulaşım gibi temel kriterlerde yan yana kıyaslayın.</p>
                    </div>

                    <!-- Kart 3 -->
                    <div class="group p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-indigo-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20 text-center">
                        <div class="w-12 h-12 rounded-xl bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <i data-lucide="network" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white mb-2" style="font-family: var(--font-heading);">Topluluk Ağı</h3>
                        <p class="text-sm text-zinc-400 leading-relaxed">Bölümünüzdeki veya hedeflediğiniz okuldaki kıdemli öğrencilerle iletişim kurun, sorularınızı yöneltin.</p>
                    </div>
                </div>
            </section>

            <!-- 3. Platformu Tanıyalım (Mini Tanıtım Kartları - Koyu Antrasit Temalı) -->
            <section class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
                <div class="flex items-center justify-between mb-8 border-b border-zinc-800/80 pb-3">
                    <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2" style="font-family: var(--font-heading);">
                        <i data-lucide="compass" class="w-5 h-5 text-cyan-400"></i>
                        Platformu <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">Tanıyalım</span>
                    </h2>
                    <a href="#/blog" class="text-cyan-400 hover:text-cyan-300 font-medium text-xs sm:text-sm flex items-center gap-1 transition-colors">
                        Tüm Bloglar <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </a>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Intro Blog 1 -->
                    <article class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between">
                        <div>
                            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/50 mb-3 uppercase tracking-wider">
                                Hakkımızda
                            </span>
                            <h3 class="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2" style="font-family: var(--font-heading);">
                                Kampüs Sesi Nedir?
                            </h3>
                            <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                                Üniversitelerin resmi broşürlerindeki süslü lafları değil, orada okuyan öğrencilerin filtreden geçmemiş gerçek deneyimlerini paylaştığı özgür platformdur.
                            </p>
                        </div>
                        <div class="pt-3 border-t border-zinc-800/80 mt-auto">
                            <a href="#/hakkimizda" class="text-xs sm:text-sm font-semibold text-cyan-400 hover:underline inline-flex items-center gap-1">
                                Detaylar &rarr;
                            </a>
                        </div>
                    </article>

                    <!-- Intro Blog 2 -->
                    <article class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between">
                        <div>
                            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-950/70 text-sky-400 border border-sky-800/50 mb-3 uppercase tracking-wider">
                                Kullanım Rehberi
                            </span>
                            <h3 class="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2" style="font-family: var(--font-heading);">
                                Karşılaştırma Aracı
                            </h3>
                            <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                                İki üniversite arasında mı kaldın? Şehir, yemekhane, ulaşım ve yurt olanaklarını tek ekranda yan yana koyarak en doğru seçimi yapmanı sağlar.
                            </p>
                        </div>
                        <div class="pt-3 border-t border-zinc-800/80 mt-auto">
                            <a href="#/compare" class="text-xs sm:text-sm font-semibold text-cyan-400 hover:underline inline-flex items-center gap-1">
                                Nasıl Kullanılır? &rarr;
                            </a>
                        </div>
                    </article>

                    <!-- Intro Blog 3 -->
                    <article class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between">
                        <div>
                            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-950/70 text-orange-400 border border-orange-800/50 mb-3 uppercase tracking-wider">
                                Topluluk
                            </span>
                            <h3 class="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2" style="font-family: var(--font-heading);">
                                Nasıl Katkı Sağlarsın?
                            </h3>
                            <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                                Kendi kampüsündeki iyi ve kötü yanları paylaşarak tercih dönemindeki adaylara yol gösterebilirsin. Üstelik tamamen anonim olarak yorum yapabilirsin.
                            </p>
                        </div>
                        <div class="pt-3 border-t border-zinc-800/80 mt-auto">
                            <a href="#/review-form" class="text-xs sm:text-sm font-semibold text-cyan-400 hover:underline inline-flex items-center gap-1">
                                Yorum Yaz &rarr;
                            </a>
                        </div>
                    </article>
                </div>
            </section>
            
            <!-- 4. SSS / Merak Edilenler (Ferah Koyu Antrasit & Camgöbeği İkonlu) -->
            <section class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
                <h2 class="text-2xl sm:text-3xl font-extrabold text-white text-center mb-8 flex items-center justify-center gap-2" style="font-family: var(--font-heading);">
                    Merak Edilenler <span class="text-cyan-400">🧐</span>
                </h2>
                <div class="flex flex-col gap-3">
                    <details class="faq-details">
                        <summary class="faq-summary">
                            <span>Üye olmak şart mı?</span>
                            <i data-lucide="plus" class="faq-icon"></i>
                        </summary>
                        <div class="faq-content">
                            <p>Yorumları okumak ve üniversiteleri incelemek tamamen ücretsiz ve anonimdir. Kendi okulunuz hakkında yorum yazmak veya soru sormak istediğinizde spam'ı önlemek için üye girişi yapmanız yeterlidir.</p>
                        </div>
                    </details>
                    <details class="faq-details">
                        <summary class="faq-summary">
                            <span>Üniversite ve yurt bilgileri ne sıklıkla güncellenir?</span>
                            <i data-lucide="plus" class="faq-icon"></i>
                        </summary>
                        <div class="faq-content">
                            <p>Tüm resmi veriler dönem başlarında güncellenir; ayrıca bizzat o okulda okuyan öğrencilerin canlı yorumlarıyla en taze bilgilere anında ulaşırsınız.</p>
                        </div>
                    </details>
                    <details class="faq-details">
                        <summary class="faq-summary">
                            <span>Puanlamalar ve sıralamalar nasıl hesaplanıyor?</span>
                            <i data-lucide="plus" class="faq-icon"></i>
                        </summary>
                        <div class="faq-content">
                            <p>Eğitim, kampüs olanakları, yemekhane kalitesi, sosyallik ve yurt şartları gibi temel metriklerde öğrencilerin verdiği oyların şeffaf ağırlıklı ortalamasıyla listelenir.</p>
                        </div>
                    </details>
                </div>
            </section>

        </main>
    `,

    university: `
        <main class="container page-view">
            <div class="uni-selector" id="uni-selector">
                <label class="uni-selector__label">📍 Üniversite Seçin</label>
                <div class="custom-select" id="custom-uni-select">
                    <div class="custom-select__trigger">
                        <span class="custom-select__text">Üniversite seçin...</span>
                        <span class="custom-select__icon">▼</span>
                    </div>
                    <div class="custom-select__dropdown">
                        <input type="text" class="custom-select__search" placeholder="Üniversite ara...">
                        <ul class="custom-select__options"></ul>
                    </div>
                </div>
            </div>

            <header class="profile-hero" id="uni-hero" style="margin-top: var(--space-xl);">
                <div class="profile-hero__bg">
                    <img id="hero-blur-img" class="profile-hero__bg-blur"
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2070"
                        alt="" aria-hidden="true">
                    <img id="hero-img" class="profile-hero__bg-img"
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2070"
                        alt="Üniversite Kampüsü">
                    <div class="profile-hero__overlay"></div>
                </div>
                <div class="profile-hero__content container reveal-up">
                    <h1 class="profile-hero__title" id="uni-hero-title">Bandırma Onyedi Eylül Üniversitesi</h1>
                    <p class="profile-hero__subtitle" id="uni-hero-subtitle"><i data-lucide="map-pin" class="icon-sm"></i> Balıkesir, Türkiye</p>
                    <div class="profile-hero__actions" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                        <a href="#" id="uni-website-btn" target="_blank" rel="noopener noreferrer"
                            class="btn btn--outline profile-hero__btn">
                            <i data-lucide="globe" class="icon-sm"></i> Resmi Web Sitesi
                        </a>
                        <button id="uni-fav-btn" class="btn btn--outline profile-hero__btn" type="button" style="display: inline-flex; align-items: center; gap: 6px;">
                            <i data-lucide="heart" id="uni-fav-icon" class="icon-sm"></i> <span id="uni-fav-text">Favorilere Ekle</span>
                        </button>
                    </div>
                </div>
            </header>

            <div class="profile-main">
                <section class="profile-section reveal-up">
                    <div class="profile-card about-card">
                        <div class="profile-card__header">
                            <h2 class="profile-card__title">Üniversite Hakkında</h2>
                        </div>
                        <div class="profile-card__content about-content">
                            <p id="about-text-short">Yükleniyor...</p>
                            <div class="about-content__extended" id="about-extended">
                                <p id="about-text-long"></p>
                            </div>
                        </div>
                        <button class="btn btn--text about-toggle-btn" id="about-toggle-btn">
                            Daha Fazla Oku ▼
                        </button>
                    </div>
                </section>

                <section class="profile-section reveal-up" style="animation-delay: 0.1s;">
                    <h2 class="section-title">Canlı <span>Ulaşım Modülü</span></h2>
                    <p class="section-desc">Çevre illerden bu üniversiteye ulaşım imkanlarını keşfedin.</p>
                    <div class="transport-grid" id="transport-grid"></div>
                </section>

                <section class="profile-section reveal-up" style="animation-delay: 0.15s;">
                    <h2 class="section-title">🏢 Çevredeki <span>Yurtlar (KYK & Özel)</span></h2>
                    <p class="section-desc">Bu üniversitenin çevresindeki öğrenci yurtları ve barınma imkanları.</p>
                    <div id="kyk-grid" class="kyk-grid">
                        <div style="color: var(--color-text-muted);">Yurt bilgileri yükleniyor...</div>
                    </div>
                </section>

                <section class="profile-section hero__stats reveal-up"
                    style="animation-delay: 0.2s; padding: var(--space-lg); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg);">
                    <div class="hero__stat">
                        <div class="hero__stat-value" id="stat-avg">—</div>
                        <div class="hero__stat-label">Ortalama Puan</div>
                    </div>
                    <div class="hero__stat">
                        <div class="hero__stat-value" id="stat-count">—</div>
                        <div class="hero__stat-label">Değerlendirme</div>
                    </div>
                    <div class="hero__stat">
                        <div class="hero__stat-value" id="stat-rank">Top 3</div>
                        <div class="hero__stat-label">Türkiye Sıralaması</div>
                    </div>
                </section>

                <section class="profile-section reveal-up" style="animation-delay: 0.3s; margin-bottom: var(--space-md);">
                    <h2 class="section-title">📋 Öğrenci <span>Değerlendirmeleri</span></h2>
                    <div class="filter-bar" id="filter-bar"></div>
                </section>

                <div id="reviews-container"></div>
            </div>
        </main>
    `,

    compare: `
        <main class="container page-view">
            <h1 class="section-title">Üniversite <span>Karşılaştırma Aracı</span> ⚖️</h1>
            <p class="section-desc" style="color: var(--color-text-muted);">İki farklı üniversiteyi seçerek aralarındaki
                farkları, puan durumlarını ve olanakları yan yana inceleyin.</p>

            <div class="compare-container">
                <div class="compare-col">
                    <div class="custom-select" id="custom-uni-select-1">
                        <div class="custom-select__trigger">
                            <span class="custom-select__text">1. Üniversiteyi seçin...</span>
                            <span class="custom-select__icon">▼</span>
                        </div>
                        <div class="custom-select__dropdown">
                            <input type="text" class="custom-select__search" placeholder="Ara...">
                            <ul class="custom-select__options"></ul>
                        </div>
                    </div>
                    <div id="compare-result-1"></div>
                </div>

                <div class="compare-col">
                    <div class="custom-select" id="custom-uni-select-2">
                        <div class="custom-select__trigger">
                            <span class="custom-select__text">2. Üniversiteyi seçin...</span>
                            <span class="custom-select__icon">▼</span>
                        </div>
                        <div class="custom-select__dropdown">
                            <input type="text" class="custom-select__search" placeholder="Ara...">
                            <ul class="custom-select__options"></ul>
                        </div>
                    </div>
                    <div id="compare-result-2"></div>
                </div>
            </div>
        </main>
    `,

    reviewForm: `
        <main class="container page-view">
            <div class="profile-card" style="max-width: 600px; margin: var(--space-xl) auto;">
                <div class="profile-card__header">
                    <h2 class="profile-card__title">Yeni Değerlendirme Ekle</h2>
                </div>
                <div class="profile-card__content">
                    <form id="add-review-form" class="form">
                        <div class="form__group">
                            <label class="form__label">Üniversite Seçin</label>
                            <div class="custom-select" id="custom-uni-select-form">
                                <div class="custom-select__trigger">
                                    <span class="custom-select__text">Üniversite seçin...</span>
                                    <span class="custom-select__icon">▼</span>
                                </div>
                                <div class="custom-select__dropdown">
                                    <input type="text" class="custom-select__search" placeholder="Ara...">
                                    <ul class="custom-select__options"></ul>
                                </div>
                            </div>
                            <input type="hidden" id="form-uni-hidden" required>
                        </div>

                        <div class="form__group">
                            <label class="form__label">Puanınız (1-5)</label>
                            <div id="star-rating" class="stars stars--interactive" style="font-size: 2rem;">
                                <span class="stars__item" data-value="1">★</span>
                                <span class="stars__item" data-value="2">★</span>
                                <span class="stars__item" data-value="3">★</span>
                                <span class="stars__item" data-value="4">★</span>
                                <span class="stars__item" data-value="5">★</span>
                            </div>
                            <input type="hidden" id="form-rating" value="0" required>
                        </div>

                        <div class="form__group">
                            <label class="form__label" for="form-text">Değerlendirmeniz</label>
                            <textarea id="form-text" class="form__input" rows="5"
                                placeholder="Üniversiteniz hakkında düşüncelerinizi detaylıca yazın..." required></textarea>
                            <div style="text-align: right; margin-top: 5px;">
                                <small id="char-count" style="color: var(--color-text-muted);">0 / 500</small>
                            </div>
                        </div>

                        <div class="form__group">
                            <label class="form__label">Etiketler (En fazla 3 adet)</label>
                            <div id="form-tags" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
                            <input type="hidden" id="form-tags-hidden" value="">
                        </div>

                        <button type="submit" class="btn btn--primary" style="width: 100%;">Paylaş ✨</button>
                        <div id="preview-container" style="margin-top: 20px;"></div>
                    </form>
                </div>
            </div>
        </main>
    `,

    profile: `
        <main class="page-view profile-page-v2">

            <!-- Cover Banner -->
            <div class="profile-cover">
                <div class="profile-cover__gradient"></div>
            </div>

            <!-- Identity Block -->
            <div class="container">
                <div class="profile-identity">
                    <div class="profile-identity__avatar-wrap">
                        <div class="profile-identity__avatar" id="profile-avatar">MS</div>
                    </div>
                    <div class="profile-identity__meta">
                        <h1 class="profile-identity__name" id="profile-name">Yükleniyor...</h1>
                        <p class="profile-identity__sub" id="profile-academic-info">Üniversite ve bölüm bilgisi eklenmemiş.</p>
                    </div>
                    <div class="profile-identity__actions">
                        <button class="btn btn--danger btn--sm" id="profile-logout-btn" type="button">
                            <i data-lucide="log-out" aria-hidden="true"></i> Çıkış Yap
                        </button>
                    </div>
                </div>

                <!-- Stats Strip -->
                <div class="profile-strip" aria-label="Profil istatistikleri">
                    <div class="profile-strip__item">
                        <span class="profile-strip__val" id="stat-review-count">0</span>
                        <span class="profile-strip__lbl">Değerlendirme</span>
                    </div>
                    <div class="profile-strip__divider"></div>
                    <div class="profile-strip__item">
                        <span class="profile-strip__val profile-strip__val--green" id="stat-upvotes">0</span>
                        <span class="profile-strip__lbl">Beğeni</span>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="profile-tabs-v2" role="tablist" aria-label="Profil bölümleri">
                    <button class="profile-tab-v2 is-active" id="profile-reviews-tab" type="button" role="tab"
                        aria-selected="true" aria-controls="profile-reviews-panel" data-profile-tab="reviews">
                        Değerlendirmelerim
                    </button>
                    <button class="profile-tab-v2" id="profile-settings-tab" type="button" role="tab"
                        aria-selected="false" aria-controls="profile-settings-panel" data-profile-tab="settings">
                        Ayarlar
                    </button>
                </div>

                <!-- Reviews Panel -->
                <section class="profile-panel-v2" id="profile-reviews-panel" role="tabpanel" aria-labelledby="profile-reviews-tab">
                    <div id="user-reviews-list" aria-live="polite"></div>
                </section>

                <!-- Settings Panel -->
                <section class="profile-panel-v2" id="profile-settings-panel" role="tabpanel"
                    aria-labelledby="profile-settings-tab" hidden>
                    <form id="profile-settings-form" class="profile-settings-form-v2">
                        <div class="psf-section">
                            <div class="psf-section__header">
                                <span class="psf-section__icon">👤</span>
                                <h3 class="psf-section__title">Hesap Bilgileri</h3>
                            </div>
                            <div class="psf-section__body">
                                <div class="form__group">
                                    <label class="form__label" for="settings-name">Ad Soyad</label>
                                    <input class="form__input" id="settings-name" name="name" autocomplete="name" required>
                                </div>
                                <div class="form__group">
                                    <label class="form__label" for="settings-university">Üniversite</label>
                                    <input class="form__input" id="settings-university" name="university" autocomplete="organization">
                                </div>
                                <div class="form__group">
                                    <label class="form__label" for="settings-department">Bölüm</label>
                                    <input class="form__input" id="settings-department" name="department">
                                </div>
                            </div>
                        </div>

                        <div class="psf-section">
                            <div class="psf-section__header">
                                <span class="psf-section__icon">🔒</span>
                                <h3 class="psf-section__title">Şifre Değiştir</h3>
                            </div>
                            <div class="psf-section__body">
                                <div class="form__group">
                                    <label class="form__label" for="settings-current-password">Mevcut şifre</label>
                                    <input class="form__input" id="settings-current-password" name="current_password"
                                        type="password" autocomplete="current-password">
                                </div>
                                <div class="form__group">
                                    <label class="form__label" for="settings-new-password">Yeni şifre</label>
                                    <input class="form__input" id="settings-new-password" name="new_password"
                                        type="password" minlength="6" autocomplete="new-password">
                                </div>
                            </div>
                        </div>

                        <div class="psf-actions">
                            <p id="profile-settings-message" class="profile-settings-form__message" role="status"></p>
                            <button class="btn btn--primary" type="submit">Kaydet</button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    `,

    login: `
        <div class="auth-page">
            <div class="auth-bg-shapes">
                <div class="auth-shape auth-shape-1"></div>
                <div class="auth-shape auth-shape-2"></div>
            </div>

            <div class="auth-glass-card">
                <div class="auth-header">
                    <span class="auth-header__icon">🎓</span>
                    <h1 class="auth-header__title">Kampüs Sesi</h1>
                    <p class="auth-header__desc">Platforma giriş yap veya aramıza katıl.</p>
                </div>

                <div class="auth-tabs-modern">
                    <button type="button" class="auth-tab-btn auth-tab active" data-tab="login">Giriş Yap</button>
                    <button type="button" class="auth-tab-btn auth-tab" data-tab="register">Kayıt Ol</button>
                </div>

                <!-- Login Form -->
                <form id="login-form" class="auth-form login-form active-form">
                    <div class="auth-input-group">
                        <label for="login-email">E-posta Adresi</label>
                        <input type="email" id="login-email" class="auth-input" placeholder="ogrenci@uni.edu.tr" required>
                    </div>
                    <div class="auth-input-group" style="margin-bottom: 25px;">
                        <label for="login-password">Şifre</label>
                        <input type="password" id="login-password" class="auth-input" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="auth-submit-btn">Giriş Yap ✨</button>
                    <div id="login-error" style="color: var(--color-danger); margin-top: 15px; text-align: center; font-size: 0.9rem; font-weight: 500;"></div>
                </form>

                <!-- Register Form -->
                <form id="register-form" class="auth-form login-form">
                    <div class="auth-input-group">
                        <label for="reg-name">Adınız Soyadınız</label>
                        <input type="text" id="reg-name" class="auth-input" placeholder="Örn: Elif Yılmaz" required>
                    </div>
                    <div class="auth-input-group">
                        <label for="reg-email">E-posta Adresi</label>
                        <input type="email" id="reg-email" class="auth-input" placeholder="ogrenci@uni.edu.tr" required>
                    </div>
                    <div class="auth-input-group" style="margin-bottom: 25px;">
                        <label for="reg-password">Şifre (En az 6 karakter)</label>
                        <input type="password" id="reg-password" class="auth-input" placeholder="••••••••" required minlength="6">
                    </div>
                    <button type="submit" class="auth-submit-btn">Hesap Oluştur 🚀</button>
                    <div id="reg-error" style="color: var(--color-danger); margin-top: 15px; text-align: center; font-size: 0.9rem; font-weight: 500;"></div>
                </form>
            </div>
        </div>
    `

    ,
    blog: `
        <main class="ks-blog-page bg-zinc-950 text-zinc-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <!-- 1. Hero & Kategori Filtreleri (Arama çubuğu OLMASIN) -->
                <header class="text-center max-w-3xl mx-auto mb-10 pt-4">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 mb-4 tracking-wider uppercase">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5 text-cyan-400"></i>
                        Öğrenci Rehberi & Kampüs Deneyimleri
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4" style="font-family: var(--font-heading);">
                        Blog & <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-orange-400">Rehberler</span>
                    </h1>
                    <p class="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                        Üniversite tercihinden barınmaya, staj taktiklerinden ders çalışma stratejilerine kadar kıdemli öğrencilerin sansürsüz ve gerçek rehberleri.
                    </p>
                </header>

                <!-- Kategori Sekmeleri (Yatay Hap Butonlar) -->
                <div class="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-12 no-scrollbar" id="blog-category-filters">
                    <button class="ks-blog-pill active" data-category="all">
                        <i data-lucide="layout-grid" class="w-4 h-4"></i> Tümü
                    </button>
                    <button class="ks-blog-pill" data-category="kampus">
                        <i data-lucide="coffee" class="w-4 h-4"></i> Kampüs Yaşamı
                    </button>
                    <button class="ks-blog-pill" data-category="burs-barinma">
                        <i data-lucide="home" class="w-4 h-4"></i> Burs & Barınma
                    </button>
                    <button class="ks-blog-pill" data-category="staj-kariyer">
                        <i data-lucide="briefcase" class="w-4 h-4"></i> Staj & Kariyer
                    </button>
                    <button class="ks-blog-pill" data-category="akademik">
                        <i data-lucide="graduation-cap" class="w-4 h-4"></i> Akademik Rehberler
                    </button>
                </div>

                <!-- 2. Öne Çıkanlar (Asimetrik Vitrin) -->
                <section class="mb-16" id="blog-featured-section">
                    <div class="flex items-center justify-between mb-6 border-b border-zinc-800/80 pb-3">
                        <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2" style="font-family: var(--font-heading);">
                            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            Öne Çıkan İçerikler
                        </h2>
                        <span class="text-xs uppercase tracking-wider text-zinc-500 font-medium">Haftanın Seçkisi</span>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <!-- Sol Taraf: 1 Büyük Kart (Haftanın Öne Çıkan Rehberi) -->
                        <article class="ks-blog-card ks-featured-hero lg:col-span-7 group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-950/40" data-category="kampus" data-post-id="feat-1">
                            <!-- Büyük Görsel -->
                            <div class="relative h-64 sm:h-72 w-full overflow-hidden rounded-xl mb-6">
                                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200" alt="Kampüs Yaşamı" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent"></div>
                                <div class="absolute top-4 left-4 flex items-center gap-2">
                                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/90 text-zinc-950 shadow-md">
                                        ★ Haftanın Rehberi
                                    </span>
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900/90 text-cyan-400 border border-zinc-700/80 backdrop-blur-md">
                                        Kampüs Yaşamı
                                    </span>
                                </div>
                                <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-zinc-300">
                                    <span class="flex items-center gap-1.5 bg-zinc-900/85 px-2.5 py-1 rounded-md backdrop-blur-sm border border-zinc-700/60">
                                        <i data-lucide="clock" class="w-3.5 h-3.5 text-cyan-400"></i> 5 dk okuma
                                    </span>
                                    <span class="text-zinc-400">12 Ekim 2026</span>
                                </div>
                            </div>

                            <!-- Başlık & Özet -->
                            <div class="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 class="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors line-clamp-2" style="font-family: var(--font-heading);">
                                        Yeni Başlayanlar İçin Üniversite Hayatta Kalma Rehberi: İlk Yılda Yapılan 10 Hata
                                    </h3>
                                    <p class="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                                        Liseden üniversiteye geçişte ders seçimi stratejileri, vize-final dengesi, kulüp aktiviteleri ve bütçe yönetimi konusunda üst sınıfların tecrübeleriyle hazırlanmış kapsamlı yol haritası.
                                    </p>
                                </div>
                                <div class="flex items-center justify-between pt-4 border-t border-zinc-800/80 mt-auto">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-bold text-xs text-cyan-400">
                                            CB
                                        </div>
                                        <div>
                                            <div class="text-sm font-semibold text-zinc-200">Can Berk D.</div>
                                            <div class="text-xs text-zinc-500">ODTÜ · Endüstri Müh.</div>
                                        </div>
                                    </div>
                                    <span class="inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                                        Rehberi Oku <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                    </span>
                                </div>
                            </div>
                        </article>

                        <!-- Sağ Taraf: Dikey Dizilmiş 2 Küçük Trend Kart -->
                        <div class="lg:col-span-5 flex flex-col gap-6">
                            <!-- Trend Kart 1 -->
                            <article class="ks-blog-card group relative flex flex-col sm:flex-row lg:flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30 flex-1" data-category="burs-barinma" data-post-id="feat-2">
                                <div class="relative h-44 sm:h-auto sm:w-44 lg:w-full lg:h-36 overflow-hidden rounded-xl mb-4 sm:mb-0 lg:mb-4 shrink-0">
                                    <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800" alt="Yurt Rehberi" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                                    <div class="absolute top-2.5 left-2.5">
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-900/90 text-orange-400 border border-orange-500/30 backdrop-blur-md">
                                            Burs & Barınma
                                        </span>
                                    </div>
                                    <span class="absolute bottom-2.5 right-2.5 text-xs text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                                        <i data-lucide="clock" class="w-3 h-3 text-cyan-400"></i> 3 dk
                                    </span>
                                </div>
                                <div class="flex-1 flex flex-col justify-between sm:pl-4 lg:pl-0">
                                    <div>
                                        <h3 class="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2" style="font-family: var(--font-heading);">
                                            KYK Yurt ve Burs Başvurularında Dikkat Edilmesi Gereken Kritik Detaylar
                                        </h3>
                                        <p class="text-xs text-zinc-400 line-clamp-2 mb-3">
                                            Gelir beyanı, yedek yerleştirmeler ve nakil süreçlerinde yapılan hatalar bursunuzu riske atmasın.
                                        </p>
                                    </div>
                                    <div class="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/60 mt-auto">
                                        <span>Büşra Y. · İTÜ Mimarlık</span>
                                        <span class="text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform">İncele &rarr;</span>
                                    </div>
                                </div>
                            </article>

                            <!-- Trend Kart 2 -->
                            <article class="ks-blog-card group relative flex flex-col sm:flex-row lg:flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30 flex-1" data-category="staj-kariyer" data-post-id="feat-3">
                                <div class="relative h-44 sm:h-auto sm:w-44 lg:w-full lg:h-36 overflow-hidden rounded-xl mb-4 sm:mb-0 lg:mb-4 shrink-0">
                                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Staj & Kariyer" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                                    <div class="absolute top-2.5 left-2.5">
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-900/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                                            Staj & Kariyer
                                        </span>
                                    </div>
                                    <span class="absolute bottom-2.5 right-2.5 text-xs text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                                        <i data-lucide="clock" class="w-3 h-3 text-cyan-400"></i> 4 dk
                                    </span>
                                </div>
                                <div class="flex-1 flex flex-col justify-between sm:pl-4 lg:pl-0">
                                    <div>
                                        <h3 class="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2" style="font-family: var(--font-heading);">
                                            Teknoloji Sektöründe Staj Bulmanın En Etkili 5 Yolu: GitHub ve LinkedIn
                                        </h3>
                                        <p class="text-xs text-zinc-400 line-clamp-2 mb-3">
                                            Henüz 1. veya 2. sınıftayken bile öne çıkmanızı sağlayacak açık kaynak projeler ve networking adımları.
                                        </p>
                                    </div>
                                    <div class="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/60 mt-auto">
                                        <span>Mert S. · Boğaziçi</span>
                                        <span class="text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform">İncele &rarr;</span>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                <!-- 3. Son Eklenen Yazılar Grid'i (3 Sütunlu Sade Kart Dizilimi) -->
                <section class="mb-20">
                    <div class="flex items-center justify-between mb-8 border-b border-zinc-800/80 pb-3">
                        <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2" style="font-family: var(--font-heading);">
                            <i data-lucide="newspaper" class="w-5 h-5 text-cyan-400"></i>
                            Tüm Yazılar & Rehberler
                        </h2>
                        <span class="text-xs text-zinc-500" id="blog-articles-count">6 rehber listeleniyor</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="blog-articles-grid">
                        <!-- Kart 1: Burs & Barınma -->
                        <article class="ks-blog-card group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30" data-category="burs-barinma" data-post-id="grid-1">
                            <div class="relative aspect-video w-full overflow-hidden bg-zinc-950">
                                <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800" alt="Öğrenci Evi ve Barınma" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                                <span class="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900/90 text-orange-400 border border-orange-500/30 backdrop-blur-md">
                                    Burs & Barınma
                                </span>
                                <span class="absolute bottom-3 right-3 text-xs text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                                    <i data-lucide="clock" class="w-3 h-3 text-cyan-400"></i> 4 dk
                                </span>
                            </div>
                            <div class="flex-1 flex flex-col justify-between p-5">
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors" style="font-family: var(--font-heading);">
                                        Öğrenci Evi Mi, KYK Mı, Özel Yurt Mu? 2026 Maliyet ve Konfor Kıyaslaması
                                    </h3>
                                    <p class="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                                        Kira, aidat, faturalar, yemek ve ulaşım masraflarını tek bir tabloda çıkardık. Hangi şehirde hangi seçenek daha ekonomik ve konforlu?
                                    </p>
                                </div>
                                <div class="flex items-center justify-between pt-3 border-t border-zinc-800/80 mt-auto">
                                    <div class="flex items-center gap-2">
                                        <div class="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                                            DA
                                        </div>
                                        <span class="text-xs text-zinc-300 font-medium">Deniz A. · Hacettepe</span>
                                    </div>
                                    <span class="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">Oku &rarr;</span>
                                </div>
                            </div>
                        </article>

                        <!-- Kart 2: Kampüs Yaşamı -->
                        <article class="ks-blog-card group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30" data-category="kampus" data-post-id="grid-2">
                            <div class="relative aspect-video w-full overflow-hidden bg-zinc-950">
                                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800" alt="Öğrenci Kulüpleri" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                                <span class="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                                    Kampüs Yaşamı
                                </span>
                                <span class="absolute bottom-3 right-3 text-xs text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                                    <i data-lucide="clock" class="w-3 h-3 text-cyan-400"></i> 3 dk
                                </span>
                            </div>
                            <div class="flex-1 flex flex-col justify-between p-5">
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors" style="font-family: var(--font-heading);">
                                        Öğrenci Kulüpleri Gerçekten Kariyerine Katkı Sağlar Mı? Sosyalleşmenin Ötesi
                                    </h3>
                                    <p class="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                                        Kulüpler sadece eğlence değil; bütçe yönetimi, sponsorluk görüşmeleri ve sektör profesyonelleriyle ilk teması kurma laboratuvarıdır.
                                    </p>
                                </div>
                                <div class="flex items-center justify-between pt-3 border-t border-zinc-800/80 mt-auto">
                                    <div class="flex items-center gap-2">
                                        <div class="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                                            SK
                                        </div>
                                        <span class="text-xs text-zinc-300 font-medium">Selin K. · YTÜ</span>
                                    </div>
                                    <span class="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">Oku &rarr;</span>
                                </div>
                            </div>
                        </article>

                        <!-- Kart 3: Staj & Kariyer -->
                        <article class="ks-blog-card group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30" data-category="staj-kariyer" data-post-id="grid-3">
                            <div class="relative aspect-video w-full overflow-hidden bg-zinc-950">
                                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800" alt="Erasmus Stajı" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                                <span class="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                                    Staj & Kariyer
                                </span>
                                <span class="absolute bottom-3 right-3 text-xs text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                                    <i data-lucide="clock" class="w-3 h-3 text-cyan-400"></i> 5 dk
                                </span>
                            </div>
                            <div class="flex-1 flex flex-col justify-between p-5">
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors" style="font-family: var(--font-heading);">
                                        Erasmus+ ve Yurt Dışı Staj Bursları: Başvuru Aşamasından Kabul Mektubuna
                                    </h3>
                                    <p class="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                                        İngilizce motivasyon mektubu nasıl yazılır? Hibe hesaplamaları, vize randevusu tüyoları ve Avrupa'da uygun konaklama bulma rehberi.
                                    </p>
                                </div>
                                <div class="flex items-center justify-between pt-3 border-t border-zinc-800/80 mt-auto">
                                    <div class="flex items-center gap-2">
                                        <div class="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                                            ET
                                        </div>
                                        <span class="text-xs text-zinc-300 font-medium">Emre T. · Koç Üni</span>
                                    </div>
                                    <span class="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">Oku &rarr;</span>
                                </div>
                            </div>
                        </article>

                        <!-- Kart 4: Akademik Rehberler -->
                        <article class="ks-blog-card group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30" data-category="akademik" data-post-id="grid-4">
                            <div class="relative aspect-video w-full overflow-hidden bg-zinc-950">
                                <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800" alt="Kütüphane ÇAP" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                                <span class="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900/90 text-sky-400 border border-sky-500/30 backdrop-blur-md">
                                    Akademik Rehberler
                                </span>
                                <span class="absolute bottom-3 right-3 text-xs text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                                    <i data-lucide="clock" class="w-3 h-3 text-cyan-400"></i> 4 dk
                                </span>
                            </div>
                            <div class="flex-1 flex flex-col justify-between p-5">
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors" style="font-family: var(--font-heading);">
                                        Çift Anadal (ÇAP) ve Yandal Yapmak İsteyenler İçin Stratejik Planlama
                                    </h3>
                                    <p class="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                                        Ortalama barajını korurken iki bölümün ağır ders temposunu dengeleme, ders saydırma (intibak) ve dönem uzatmadan mezun olma sırları.
                                    </p>
                                </div>
                                <div class="flex items-center justify-between pt-3 border-t border-zinc-800/80 mt-auto">
                                    <div class="flex items-center gap-2">
                                        <div class="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                                            AN
                                        </div>
                                        <span class="text-xs text-zinc-300 font-medium">Ayşe N. · Bilkent</span>
                                    </div>
                                    <span class="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">Oku &rarr;</span>
                                </div>
                            </div>
                        </article>

                        <!-- Kart 5: Akademik Rehberler -->
                        <article class="ks-blog-card group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30" data-category="akademik" data-post-id="grid-5">
                            <div class="relative aspect-video w-full overflow-hidden bg-zinc-950">
                                <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800" alt="Ders Çalışma" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                                <span class="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900/90 text-sky-400 border border-sky-500/30 backdrop-blur-md">
                                    Akademik Rehberler
                                </span>
                                <span class="absolute bottom-3 right-3 text-xs text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                                    <i data-lucide="clock" class="w-3 h-3 text-cyan-400"></i> 3 dk
                                </span>
                            </div>
                            <div class="flex-1 flex flex-col justify-between p-5">
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors" style="font-family: var(--font-heading);">
                                        Vize ve Final Döneminde Tükenmişliği Önleme: Pomodoro ve Not Tutma
                                    </h3>
                                    <p class="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                                        Son gece sabahlamak yerine Notion ile sistematik özet çıkarma, çıkmış soru analizi ve zihinsel stresi kontrol altında tutma taktikleri.
                                    </p>
                                </div>
                                <div class="flex items-center justify-between pt-3 border-t border-zinc-800/80 mt-auto">
                                    <div class="flex items-center gap-2">
                                        <div class="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                                            KV
                                        </div>
                                        <span class="text-xs text-zinc-300 font-medium">Kaan V. · Ankara Tıp</span>
                                    </div>
                                    <span class="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">Oku &rarr;</span>
                                </div>
                            </div>
                        </article>

                        <!-- Kart 6: Kampüs Yaşamı -->
                        <article class="ks-blog-card group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30" data-category="kampus" data-post-id="grid-6">
                            <div class="relative aspect-video w-full overflow-hidden bg-zinc-950">
                                <img src="https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&q=80&w=800" alt="Şehir Karşılaştırması" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                                <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                                <span class="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                                    Kampüs Yaşamı
                                </span>
                                <span class="absolute bottom-3 right-3 text-xs text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                                    <i data-lucide="clock" class="w-3 h-3 text-cyan-400"></i> 4 dk
                                </span>
                            </div>
                            <div class="flex-1 flex flex-col justify-between p-5">
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors" style="font-family: var(--font-heading);">
                                        Şehir Değiştirecek Üniversitelilere Tavsiyeler: İstanbul, Ankara ve İzmir
                                    </h3>
                                    <p class="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                                        Toplu taşıma abonmanları, sosyal mekanlar, 7/24 kütüphane erişimi ve öğrenci dostu semtler hakkında tarafsız şehir incelemeleri.
                                    </p>
                                </div>
                                <div class="flex items-center justify-between pt-3 border-t border-zinc-800/80 mt-auto">
                                    <div class="flex items-center gap-2">
                                        <div class="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                                            ED
                                        </div>
                                        <span class="text-xs text-zinc-300 font-medium">Ece D. · Ege Üniversitesi</span>
                                    </div>
                                    <span class="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">Oku &rarr;</span>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>

                <!-- 4. Topluluk Çağrı Kutusu (CTA Banner) -->
                <section class="mb-12">
                    <div class="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/95 via-zinc-900/80 to-zinc-950 p-8 sm:p-12 text-center backdrop-blur-md shadow-2xl">
                        <!-- Glow Ambient Effects -->
                        <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
                        <div class="pointer-events-none absolute -bottom-24 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

                        <div class="relative z-10 max-w-2xl mx-auto">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/15 border border-orange-500/35 text-orange-400 mb-4">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Katkıda Bulun
                            </span>
                            <h3 class="text-2xl sm:text-3xl font-extrabold text-white mb-3" style="font-family: var(--font-heading);">
                                Kendi kampüs deneyimini veya rehberini binlerce öğrenciyle paylaşmak ister misin?
                            </h3>
                            <p class="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
                                Üniversitendeki yurtları, hocaları, kulüpleri veya staj tecrübelerini anlat; tercih yapacak gençlere en samimi rehber sen ol. Yazıların hem platformda öne çıksın hem de topluluğa değer katsın.
                            </p>
                            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a href="#/yazi-gonder" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-zinc-950 font-bold hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]">
                                    <i data-lucide="send" class="w-4 h-4"></i> Yazı Gönder
                                </a>
                                <a href="#/yayin-ilkeleri" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-all text-sm font-semibold">
                                    Yayın İlkeleri <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Blog Okuma Modalı (Minimalist Article Reader Modal) -->
            <div id="ks-blog-modal" class="ks-blog-modal-backdrop" aria-hidden="true">
                <div class="ks-blog-modal-box">
                    <div class="relative h-64 sm:h-80 w-full overflow-hidden rounded-t-xl bg-zinc-950">
                        <img id="ks-modal-img" src="" alt="Makale Görseli" class="h-full w-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent"></div>
                        <button id="ks-modal-close" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 flex items-center justify-center cursor-pointer transition-colors backdrop-blur-md shadow-lg" aria-label="Kapat">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                        <div class="absolute bottom-4 left-6 right-6 flex items-center gap-2">
                            <span id="ks-modal-badge" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/90 text-cyan-400 border border-cyan-800/80 backdrop-blur-md"></span>
                            <span id="ks-modal-readtime" class="inline-flex items-center gap-1 text-xs text-zinc-300 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-700/60 backdrop-blur-sm"></span>
                        </div>
                    </div>
                    <div class="p-6 sm:p-8">
                        <h2 id="ks-modal-title" class="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight" style="font-family: var(--font-heading);"></h2>
                        <div class="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800 text-xs sm:text-sm text-zinc-400">
                            <div class="flex items-center gap-3">
                                <div id="ks-modal-avatar" class="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-bold text-xs text-cyan-400"></div>
                                <span id="ks-modal-author" class="font-medium text-zinc-200"></span>
                            </div>
                            <span id="ks-modal-date" class="text-zinc-500"></span>
                        </div>
                        <div id="ks-modal-body" class="text-zinc-300 text-base leading-relaxed space-y-4"></div>
                        <div class="mt-8 pt-6 border-t border-zinc-800/80 flex items-center justify-between">
                            <a href="#/review-form" class="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline font-semibold">
                                <i data-lucide="message-square" class="w-4 h-4"></i> Bu konuda bir yorum da sen ekle
                            </a>
                            <button id="ks-modal-bottom-close" class="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 font-medium cursor-pointer transition-colors">
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `,

    yayinIlkeleri: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Aydinlatmalari -->
            <div class="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="pointer-events-none absolute top-48 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Baslik & Hero -->
                <div class="text-center mb-16">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-5 backdrop-blur-md">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>Doğruluk, Şeffaflık & Bağımsızlık</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        Yayın İlkeleri
                    </h1>
                    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Kampüs Sesi topluluğunun temel direği; bağımsız, dürüst ve tarafsız öğrenci deneyimidir. Platformda yayımlanan her değerlendirme ve rehber aşağıdaki ilkeler doğrultusunda denetlenir.
                    </p>
                </div>

                <!-- 4 Temel Ilke Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <!-- 1. Tarafsızlık ve Şeffaflık -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 hover:border-zinc-700 transition-all duration-200">
                        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5">
                            <i data-lucide="scale" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2.5">1. Tarafsızlık ve Şeffaflık</h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Deneyimlerin ticari veya kurumsal baskı olmadan tamamen öğrencilerin kendi hür iradeleriyle yazılması esastır. Hiçbir üniversite yönetimi veya sponsorlu kurum içeriğe müdahale edemez veya olumsuz yorumların silinmesini talep edemez.
                        </p>
                    </div>

                    <!-- 2. Doğrulanabilirlik -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 hover:border-zinc-700 transition-all duration-200">
                        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5">
                            <i data-lucide="check-check" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2.5">2. Doğrulanabilirlik</h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Paylaşılan staj, yurt, yemekhane veya kulüp rehberlerinin güncel ve yanıltıcı olmayan bilgiler içermesi beklenir. Kulaktan dolma söylentiler yerine gerçek öğrenci yaşanmışlıkları ve doğrulanabilir bilgiler esas alınır.
                        </p>
                    </div>

                    <!-- 3. İntihal ve Kopya İçerik Yasağı -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 hover:border-zinc-700 transition-all duration-200">
                        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5">
                            <i data-lucide="file-x-2" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2.5">3. İntihal ve Kopya İçerik Yasağı</h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Başka web sitelerinden veya resmi tanıtım bültenlerinden kopyalanmış tanıtım metinleri doğrudan reddedilir; yalnızca öğrencilerin kendi kaleminden çıkan orijinal deneyimler ve kılavuzlar kabul edilir.
                        </p>
                    </div>

                    <!-- 4. Yapıcı Eleştiri Kültürü -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 hover:border-zinc-700 transition-all duration-200">
                        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5">
                            <i data-lucide="message-square-quote" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2.5">4. Yapıcı Eleştiri Kültürü</h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Üniversitelerin eksik yönleri veya kampüs imkanlarının yetersizliği; hakaret ve küfür olmadan, somut örneklerle ve yapıcı bir dille ifade edilmelidir. Amaç karalamak değil, aday öğrencileri doğru bilgilendirmektir.
                        </p>
                    </div>
                </div>

                <!-- CTA Banner -->
                <div class="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-zinc-900/80 to-zinc-900 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
                    <div>
                        <h4 class="text-lg font-bold text-white mb-1">İlkelerimize aykırı bir içerik mi gördün?</h4>
                        <p class="text-zinc-400 text-sm">Gözden kaçan veya taraflı olduğunu düşündüğün paylaşımları moderasyon ekibimize bildirebilirsin.</p>
                    </div>
                    <div class="flex items-center gap-3 w-full sm:w-auto">
                        <a href="#/iletisim" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold transition-all">
                            <i data-lucide="flag" class="w-4 h-4"></i> Bildir
                        </a>
                        <a href="#/review-form" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">
                            <i data-lucide="pen-line" class="w-4 h-4"></i> Yorum Yaz
                        </a>
                    </div>
                </div>
            </div>
        </main>
    `,

    okulOner: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Aydinlatmalari -->
            <div class="pointer-events-none absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
                <!-- Baslik & Hero -->
                <div class="text-center mb-10">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-4 backdrop-blur-md">
                        <i data-lucide="building-2" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>Veritabanı Katkısı</span>
                    </div>
                    <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3" style="font-family: var(--font-heading);">
                        Sistemde Olmayan Bir Üniversite veya Kampüs Öner
                    </h1>
                    <p class="text-zinc-400 text-sm sm:text-base leading-relaxed">
                        Aradığın üniversite, meslek yüksekokulu veya yeni kurulan bir yerleşke henüz listemizde yok mu? Bilgileri paylaş, ekibimiz 24 saat içinde doğrulayıp platforma eklesin.
                    </p>
                </div>

                <!-- Form Kartı -->
                <div class="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                    <form id="suggest-uni-form" class="space-y-5">
                        <div>
                            <label for="suggest-uni-name" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                Üniversite Adı <span class="text-cyan-400">*</span>
                            </label>
                            <input type="text" id="suggest-uni-name" required placeholder="Örn: İzmir Bakırçay Üniversitesi" class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label for="suggest-city" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                    Bulunduğu Şehir <span class="text-cyan-400">*</span>
                                </label>
                                <input type="text" id="suggest-city" required placeholder="Örn: İzmir" class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                            </div>
                            <div>
                                <label for="suggest-campus" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                    Kampüs / Yerleşke Adı (Varsa)
                                </label>
                                <input type="text" id="suggest-campus" placeholder="Örn: Seyrek Ana Kampüsü" class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                            </div>
                        </div>

                        <div>
                            <label for="suggest-website" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                Resmi Web Sitesi
                            </label>
                            <input type="url" id="suggest-website" placeholder="Örn: https://bakircay.edu.tr" class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                        </div>

                        <div>
                            <label for="suggest-email" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                Öneren E-posta <span class="text-cyan-400">*</span>
                            </label>
                            <input type="email" id="suggest-email" required placeholder="ornek@ogrenci.edu.tr" class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                            <p class="text-xs text-zinc-500 mt-1.5">Üniversite listeye eklendiğinde sana e-posta ile bildirelim.</p>
                        </div>

                        <div>
                            <label for="suggest-notes" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                Ek Notlar veya Açıklama
                            </label>
                            <textarea id="suggest-notes" rows="3" placeholder="Fakülteler, yurt imkanları veya eklemek istediğin detaylar..." class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors resize-none"></textarea>
                        </div>

                        <div class="pt-2">
                            <button type="submit" id="suggest-submit-btn" class="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-zinc-950 font-bold hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                <i data-lucide="send" class="w-4 h-4"></i> Öneriyi Gönder
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    `,

    yaziGonder: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Aydinlatmalari -->
            <div class="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
                <!-- Baslik & Hero -->
                <div class="text-center mb-10">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-4 backdrop-blur-md">
                        <i data-lucide="pen-tool" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>Blog & Rehber Katkısı</span>
                    </div>
                    <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3" style="font-family: var(--font-heading);">
                        Kampüs Sesine Yazı Gönder
                    </h1>
                    <p class="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                        Kendi kampüs deneyimini, yurt rehberini veya staj serüvenini binlerce öğrenciyle paylaş. Yazın editörlerimizce incelenip Blog & Rehberler bölümünde öne çıkarılsın.
                    </p>
                </div>

                <!-- Form Kartı -->
                <div class="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                    <form id="post-submission-form" class="space-y-5">
                        <div>
                            <label for="post-title" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                Yazı Başlığı <span class="text-cyan-400">*</span>
                            </label>
                            <input type="text" id="post-title" required placeholder="Örn: İstanbul'da KYK Yurdunda Yaşamak: İlk Yıl Hayatta Kalma Taktikleri" class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label for="post-category" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                    Kategori Seçimi <span class="text-cyan-400">*</span>
                                </label>
                                <select id="post-category" required class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                                    <option value="" disabled selected>Bir kategori seçin...</option>
                                    <option value="Kampüs Yaşamı">Kampüs Yaşamı</option>
                                    <option value="Burs & Barınma">Burs & Barınma</option>
                                    <option value="Staj & Kariyer">Staj & Kariyer</option>
                                    <option value="Akademik Rehberler">Akademik Rehberler</option>
                                    <option value="Şehir & Ulaşım">Şehir & Ulaşım</option>
                                </select>
                            </div>
                            <div>
                                <label for="post-read-time" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                    Tahmini Okuma Süresi
                                </label>
                                <input type="text" id="post-read-time" placeholder="Örn: 4 dk okuma" class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label for="post-author" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                    Yazar Adı / Rumuz <span class="text-cyan-400">*</span>
                                </label>
                                <input type="text" id="post-author" required placeholder="Örn: Ali K." class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                            </div>
                            <div>
                                <label for="post-author-desc" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                    Üniversite, Bölüm ve Sınıf <span class="text-cyan-400">*</span>
                                </label>
                                <input type="text" id="post-author-desc" required placeholder="Örn: İTÜ - Endüstri Mühendisliği, 3. Sınıf" class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                            </div>
                        </div>

                        <div>
                            <label for="post-summary" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                Kısa Özet (Kartta Görünecek Açıklama)
                            </label>
                            <input type="text" id="post-summary" placeholder="1-2 cümlelik dikkat çekici özet..." class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                        </div>

                        <div>
                            <label for="post-content" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                Yazı İçeriği <span class="text-cyan-400">*</span>
                            </label>
                            <textarea id="post-content" rows="8" required placeholder="Deneyimini, tavsiyelerini ve alt başlıklarını detaylı bir şekilde yazabilirsin..." class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors resize-y leading-relaxed"></textarea>
                        </div>

                        <div class="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-start gap-3">
                            <input type="checkbox" id="post-consent" required class="mt-1 w-4 h-4 rounded border-zinc-700 text-cyan-400 focus:ring-cyan-400 cursor-pointer">
                            <label for="post-consent" class="text-xs text-zinc-400 leading-relaxed cursor-pointer">
                                Yazımın tamamen kendi deneyimlerime dayandığını, intihal içermediğini ve Kampüs Sesi <a href="#/yayin-ilkeleri" target="_blank" class="text-cyan-400 hover:underline">Yayın İlkeleri</a> ile <a href="#/topluluk-kurallari" target="_blank" class="text-cyan-400 hover:underline">Topluluk Kuralları</a>'na uygun olduğunu onaylıyorum.
                            </label>
                        </div>

                        <div class="pt-2">
                            <button type="submit" id="post-submit-btn" class="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-zinc-950 font-bold hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                <i data-lucide="send" class="w-4 h-4"></i> Yazıyı Editörlere Gönder
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    `,

    toplulukKurallari: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Aydinlatmalari -->
            <div class="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="pointer-events-none absolute top-48 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Baslik & Hero -->
                <div class="text-center mb-16">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-5 backdrop-blur-md">
                        <i data-lucide="users" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>Güvenli & Saygılı Topluluk</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        Topluluk Kuralları
                    </h1>
                    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Kampüs Sesi, öğrencilerin birbirlerine güvenle danışabildiği saygılı bir dayanışma alanıdır. Platformumuzda geçerli olan 4 temel kural:
                    </p>
                </div>

                <!-- 4 Temel Kural Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <!-- 1. Sıfır Tolerans (Nefret Söylemi & Tehdit) -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 hover:border-zinc-700 transition-all duration-200">
                        <div class="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/30 text-red-400 flex items-center justify-center mb-5">
                            <i data-lucide="shield-alert" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2.5">1. Sıfır Tolerans (Nefret Söylemi & Tehdit)</h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Din, dil, ırk, cinsiyet veya cinsel yönelim üzerinden ayrımcılık içeren veya tehdit barındıran yorumlar süresiz olarak engellenir. Bu tür hesaplar ve içerikler hiçbir uyarı yapılmaksızın derhal platformdan uzaklaştırılır.
                        </p>
                    </div>

                    <!-- 2. Kişisel Veri ve Mahremiyet (KVKK) -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 hover:border-zinc-700 transition-all duration-200">
                        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5">
                            <i data-lucide="lock" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2.5">2. Kişisel Veri ve Mahremiyet</h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Akademisyenlerin veya öğrencilerin kişisel telefon numaraları, özel sosyal medya profilleri veya özel hayatlarına dair detaylar paylaşılamaz. Değerlendirmeler yalnızca kurumsal ve akademik deneyimle sınırlıdır.
                        </p>
                    </div>

                    <!-- 3. Reklam ve Ticari Kazanç Yasağı -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 hover:border-zinc-700 transition-all duration-200">
                        <div class="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5">
                            <i data-lucide="ban" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2.5">3. Reklam ve Ticari Kazanç Yasağı</h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Özel yurt veya mekanların gizli reklamını yapan sahte hesapların tespiti ve silinmesi tavizsiz uygulanır. Referans linkleri, ticari promosyonlar veya yönlendirici bot faaliyetleri kesinlikle yasaktır.
                        </p>
                    </div>

                    <!-- 4. Saygılı İletişim İlkesi -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 hover:border-zinc-700 transition-all duration-200">
                        <div class="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5">
                            <i data-lucide="heart-handshake" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2.5">4. Saygılı İletişim İlkesi</h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Farklı görüşlere ve kampüs deneyimlerine saygı gösterilmelidir. Tartışmalar kişiselleştirilmemeli, alaycı veya taciz edici üsluptan uzak durulmalı; amaca odaklı, yapıcı ve yardımcı bir dil kullanılmalıdır.
                        </p>
                    </div>
                </div>

                <!-- Bilgilendirme Kutusu -->
                <div class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex items-start gap-4">
                    <div class="w-10 h-10 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
                        <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-white mb-1">Kurallara uymayan bir paylaşım mı var?</h4>
                        <p class="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                            Herhangi bir yorumun altındaki bayrak simgesine tıklayarak veya doğrudan <a href="#/iletisim" class="text-cyan-400 hover:underline">İletişim</a> sayfamız üzerinden ilgili içeriğin linkiyle birlikte bize bildirebilirsin. Moderasyon ekibimiz en geç 24 saat içinde inceleyip gerekli aksiyonu alır.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    `,

    hakkimizda: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Aydinlatmalari -->
            <div class="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Baslik & Hero -->
                <div class="text-center mb-16">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-5 backdrop-blur-md">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>Öğrenciden Öğrenciye Gerçek Kampüs Rehberi</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        Hakkımızda
                    </h1>
                    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Üniversite tercihlerini süslü broşürlerin ve tanıtım günlerinin ötesine taşıyarak; amfilerde, yurtlarda ve kampüslerde gerçekten ne yaşandığını şeffaf bir şekilde öğrencilerin sesinden aktarmak için buradayız.
                    </p>
                </div>

                <!-- Misyon & Vizyon -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 hover:border-zinc-700 transition-all">
                        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5">
                            <i data-lucide="target" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-3">Misyonumuz</h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Üniversite tercihlerini süslü broşürlerin ve tanıtım günlerinin ötesine taşıyarak; amfilerde, yurtlarda ve kampüslerde gerçekten ne yaşandığını şeffaf bir şekilde öğrencilerin sesinden aktarmak.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 hover:border-zinc-700 transition-all">
                        <div class="w-12 h-12 rounded-xl bg-sky-950/60 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-5">
                            <i data-lucide="compass" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-3">Vizyonumuz</h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Türkiye'nin en güvenilir, tarafsız ve öğrenci odaklı kampüs ekosistemi olmak; her adayın geleceğine karar verirken gerçek bilgilere özgürce ve sansürsüzce ulaşabilmesini sağlamak.
                        </p>
                    </div>
                </div>

                <!-- Ilkelerimiz (3 Kolon) -->
                <div class="mb-16">
                    <h3 class="text-xl font-bold text-white mb-6 text-center">İlkelerimiz</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div class="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 text-center">
                            <div class="w-10 h-10 mx-auto rounded-lg bg-zinc-800 text-cyan-400 flex items-center justify-center mb-3">
                                <i data-lucide="eye" class="w-5 h-5"></i>
                            </div>
                            <h4 class="font-bold text-white mb-1.5 text-base">Şeffaflık</h4>
                            <p class="text-zinc-400 text-xs leading-relaxed">Tüm veriler, puanlar ve yorumlar manipülasyonsuz ve sansürsüz aktarılır.</p>
                        </div>

                        <div class="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 text-center">
                            <div class="w-10 h-10 mx-auto rounded-lg bg-zinc-800 text-cyan-400 flex items-center justify-center mb-3">
                                <i data-lucide="handshake" class="w-5 h-5"></i>
                            </div>
                            <h4 class="font-bold text-white mb-1.5 text-base">Öğrenci Dayanışması</h4>
                            <p class="text-zinc-400 text-xs leading-relaxed">Kâr amacı değil; birbirine yol gösteren gençlerin kolektif aklı ve yardımlaşması esastır.</p>
                        </div>

                        <div class="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 text-center">
                            <div class="w-10 h-10 mx-auto rounded-lg bg-zinc-800 text-cyan-400 flex items-center justify-center mb-3">
                                <i data-lucide="shield" class="w-5 h-5"></i>
                            </div>
                            <h4 class="font-bold text-white mb-1.5 text-base">Bağımsızlık</h4>
                            <p class="text-zinc-400 text-xs leading-relaxed">Hiçbir vakıf, üniversite yönetimi ya da ticari sponsordan bağımsız, tarafsız duruş.</p>
                        </div>
                    </div>
                </div>

                <!-- Sayaç Bandı -->
                <div class="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <div class="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1" style="font-family: var(--font-heading);">200+</div>
                        <div class="text-xs text-zinc-400">Üniversite</div>
                    </div>
                    <div>
                        <div class="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1" style="font-family: var(--font-heading);">1.560+</div>
                        <div class="text-xs text-zinc-400">KYK Yurdu</div>
                    </div>
                    <div>
                        <div class="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1" style="font-family: var(--font-heading);">15.000+</div>
                        <div class="text-xs text-zinc-400">Öğrenci Yorumu</div>
                    </div>
                    <div>
                        <div class="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1" style="font-family: var(--font-heading);">81 İl</div>
                        <div class="text-xs text-zinc-400">Tüm Türkiye</div>
                    </div>
                </div>
            </div>
        </main>
    `,

    iletisim: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Aydinlatmalari -->
            <div class="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Baslik & Hero -->
                <div class="text-center mb-14">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-4 backdrop-blur-md">
                        <i data-lucide="mail" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>Her Zaman Yanındayız</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        İletişim & Destek
                    </h1>
                    <p class="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
                        Bir sorun mu var, önerin mi var ya da iş birliği mi planlıyorsun? Ekibimizle doğrudan iletişime geç, en kısa sürede dönüş yapalım.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <!-- Sol Kolon: İletişim Bilgileri (md:col-span-5) -->
                    <div class="md:col-span-5 space-y-6">
                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 space-y-6">
                            <div>
                                <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">E-posta Adresi</span>
                                <a href="mailto:destek@kampussesi.com" class="text-lg font-bold text-cyan-400 hover:underline flex items-center gap-2">
                                    <i data-lucide="mail" class="w-4 h-4"></i> destek@kampussesi.com
                                </a>
                            </div>

                            <div class="pt-4 border-t border-zinc-800">
                                <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Yanıt Süresi</span>
                                <div class="flex items-center gap-2 text-sm text-zinc-300">
                                    <i data-lucide="clock" class="w-4 h-4 text-cyan-400 shrink-0"></i>
                                    <span>En geç <strong>24 saat</strong> içinde dönüş yapıyoruz.</span>
                                </div>
                            </div>

                            <div class="pt-4 border-t border-zinc-800">
                                <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Sosyal Medyada Biz</span>
                                <div class="flex items-center gap-3">
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors" title="Twitter / X">
                                        <i data-lucide="twitter" class="w-4 h-4"></i>
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors" title="Instagram">
                                        <i data-lucide="instagram" class="w-4 h-4"></i>
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors" title="LinkedIn">
                                        <i data-lucide="linkedin" class="w-4 h-4"></i>
                                    </a>
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors" title="GitHub">
                                        <i data-lucide="github" class="w-4 h-4"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 text-xs text-zinc-400 flex items-start gap-3">
                            <i data-lucide="shield-check" class="w-5 h-5 text-cyan-400 shrink-0"></i>
                            <span>Tüm bildirimleriniz ve mesajlarınız gizlilik politikamız kapsamında korunur ve üçüncü taraflarla paylaşılmaz.</span>
                        </div>
                    </div>

                    <!-- Sağ Kolon: Minimalist İletişim Formu (md:col-span-7) -->
                    <div class="md:col-span-7">
                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                            <form id="contact-form" class="space-y-4">
                                <div>
                                    <label for="contact-name" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                        Adınız <span class="text-cyan-400">*</span>
                                    </label>
                                    <input type="text" id="contact-name" required placeholder="Örn: Deniz Yılmaz" class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                                </div>

                                <div>
                                    <label for="contact-email" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                        E-posta Adresiniz <span class="text-cyan-400">*</span>
                                    </label>
                                    <input type="email" id="contact-email" required placeholder="ornek@ogrenci.edu.tr" class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                                </div>

                                <div>
                                    <label for="contact-subject" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                        Konu <span class="text-cyan-400">*</span>
                                    </label>
                                    <select id="contact-subject" required class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                                        <option value="" disabled selected>Bir konu seçin...</option>
                                        <option value="Öneri">Öneri</option>
                                        <option value="Hata Bildirimi">Hata Bildirimi</option>
                                        <option value="İş Birliği">İş Birliği</option>
                                        <option value="Diğer">Diğer</option>
                                    </select>
                                </div>

                                <div>
                                    <label for="contact-message" class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                        Mesajınız <span class="text-cyan-400">*</span>
                                    </label>
                                    <textarea id="contact-message" rows="5" required placeholder="Mesajınızı detaylıca açıklayın..." class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors resize-none leading-relaxed"></textarea>
                                </div>

                                <div class="pt-2">
                                    <button type="submit" id="contact-submit-btn" class="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-zinc-950 font-bold hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                        <i data-lucide="send" class="w-4 h-4"></i> Gönder
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `,

    gizlilik: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Aydinlatmalari -->
            <div class="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Baslik & Hero -->
                <div class="text-center mb-16">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-5 backdrop-blur-md">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>KVKK & Veri Güvenliği</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        Gizlilik Politikası
                    </h1>
                    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Kampüs Sesi olarak kullanıcılarımızın ve değerlendirme yapan öğrencilerimizin mahremiyetine en yüksek derecede önem veriyoruz.
                    </p>
                </div>

                <!-- Icerik Kartlari -->
                <div class="space-y-6">
                    <!-- 1. KVKK Uyum Metni -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                                <i data-lucide="file-text" class="w-5 h-5"></i>
                            </div>
                            <h3 class="text-xl font-bold text-white">KVKK Uyum Metni</h3>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, Kampüs Sesi veri sorumlusu sıfatıyla hareket etmektedir. Platformumuza kayıt olurken veya içerik üretirken sağladığınız e-posta ve kullanıcı verileri yalnızca üyelik oturumunun sürdürülmesi ve topluluk güvenliğinin sağlanması amacıyla işlenir.
                        </p>
                        <p class="text-zinc-400 text-xs leading-relaxed">
                            Kişisel verileriniz, yasal zorunluluklar hariç olmak kaydıyla hiçbir ticari şirketle, reklam ajansıyla veya üniversite yönetimiyle paylaşılmaz.
                        </p>
                    </div>

                    <!-- 2. Anonimlik İlkesi -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                                <i data-lucide="user-x" class="w-5 h-5"></i>
                            </div>
                            <h3 class="text-xl font-bold text-white">Anonimlik İlkesi</h3>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Değerlendirme yapan öğrencilerin kimlik ve e-posta bilgileri <strong>asla üçüncü taraflarla veya üniversite yönetimleriyle paylaşılmaz</strong>.
                        </p>
                        <p class="text-zinc-400 text-xs leading-relaxed">
                            Öğrenciler diledikleri takdirde değerlendirmelerini rumuz kullanarak veya tamamen anonim profille yayınlayabilir. Amacımız öğrencilerin korkusuzca, hür iradeleriyle doğru bilgiyi paylaşabilmesidir.
                        </p>
                    </div>

                    <!-- 3. Çerez Politikası (Cookie Policy) -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                                <i data-lucide="cookie" class="w-5 h-5"></i>
                            </div>
                            <h3 class="text-xl font-bold text-white">Çerez Politikası</h3>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Sitede sadece oturum ve temel analitik çerezleri kullanılır; kullanıcıları takip eden üçüncü taraf reklam ve pazarlama çerezleri kesinlikle kullanılmaz.
                        </p>
                        <p class="text-zinc-400 text-xs leading-relaxed">
                            Yalnızca oturum devamlılığını sağlayan kimlik doğrulama token'ı ve karanlık/aydınlık tema tercihini hatırlayan yerel tarayıcı depolaması (localStorage) aktiftir.
                        </p>
                    </div>

                    <!-- 4. Veri Güvenliği ve Silme Hakkı -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                                <i data-lucide="trash-2" class="w-5 h-5"></i>
                            </div>
                            <h3 class="text-xl font-bold text-white">Veri Güvenliği ve Silme Hakkı</h3>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            Kullanıcılar diledikleri zaman profil sayfalarından daha önce yaptıkları yorumları silebilir veya hesaplarının silinmesini talep edebilir. Silinen veriler sistemden geri döndürülemez biçimde kalıcı olarak kaldırılır.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    `,

    kullanimSartlari: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Aydinlatmalari -->
            <div class="pointer-events-none absolute -top-32 right-1/2 translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Baslik & Hero -->
                <div class="text-center mb-16">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-5 backdrop-blur-md">
                        <i data-lucide="file-check" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>Yasal Koşullar</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        Kullanım Şartları
                    </h1>
                    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Kampüs Sesi web sitesini ziyaret ederek veya üye olarak aşağıdaki hizmet ve kullanım şartlarını kabul etmiş sayılırsınız.
                    </p>
                </div>

                <div class="space-y-6">
                    <!-- 1. Hizmet Kapsamı -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
                        <h3 class="text-xl font-bold text-white mb-3">1. Platformun Hizmet Kapsamı</h3>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            Kampüs Sesi; üniversite öğrencileri ve adayları için bilgilendirici, tarafsız bir değerlendirme, yurt ve kampüs rehberi platformudur. Platformda sunulan puanlar, sıralamalar ve değerlendirmeler rehberlik niteliğinde olup bağlayıcı resmi bir kayıt teşkil etmez.
                        </p>
                    </div>

                    <!-- 2. Kullanıcı Sorumlulukları -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
                        <h3 class="text-xl font-bold text-white mb-3">2. Kullanıcı Sorumlulukları</h3>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Sitede yayınlanan yorumların ve içeriklerin hukuki sorumluluğu yazarına aittir.
                        </p>
                        <p class="text-zinc-400 text-xs leading-relaxed">
                            Kullanıcılar; iftira, hakaret, yanlış beyan, telif ihlali veya kişi haklarını zedeleyici ifadelerden bizzat sorumludur.
                        </p>
                    </div>

                    <!-- 3. Fikri Mülkiyet Hakları ve İçerik Moderasyon Yetkisi -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
                        <h3 class="text-xl font-bold text-white mb-3">3. Fikri Mülkiyet Hakları ve İçerik Moderasyon Yetkisi</h3>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Platform yönetimi, topluluk kurallarına ve yayın ilkelerine uymayan içerikleri silme, düzenleme veya kullanıcının hesabını askıya alma hakkını saklı tutar.
                        </p>
                        <p class="text-zinc-400 text-xs leading-relaxed">
                            Sitenin tasarımı, kaynak kodları ve tescilli markası Kampüs Sesi'ne aittir; izinsiz kopyalanamaz veya ticari amaçla kullanılamaz.
                        </p>
                    </div>

                    <!-- 4. Değişiklik Hakkı -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
                        <h3 class="text-xl font-bold text-white mb-3">4. Değişiklik ve Güncelleme Hakkı</h3>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            Kampüs Sesi, bu kullanım şartlarını güncel mevzuat ve topluluk gereksinimlerine göre dilediği zaman güncelleme hakkını saklı tutar. Güncellemeler sitede yayımlandığı andan itibaren geçerlilik kazanır.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    `,

    favorites: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow -->
            <div class="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="text-center mb-12">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-rose-300 mb-4 backdrop-blur-md">
                        <i data-lucide="heart" class="w-3.5 h-3.5 text-rose-400"></i>
                        <span>Kişisel Listen</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        Favori Üniversitelerim
                    </h1>
                    <p class="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
                        Tercih dönemi veya kampüs araştırman için kaydettiğin tüm üniversiteleri buradan tek ekranda takip edebilir ve inceleyebilirsin.
                    </p>
                </div>

                <!-- Favoriler Grid Konteyneri -->
                <div id="favorites-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="col-span-full py-16 text-center text-zinc-500">
                        Favoriler yükleniyor...
                    </div>
                </div>
            </div>
        </main>
    `,

    cities: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Effects -->
            <div class="pointer-events-none absolute -top-32 left-1/3 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="pointer-events-none absolute top-72 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="text-center mb-12">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-4 backdrop-blur-md">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>81 İl · Üniversite & Şehir Rehberi</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        Öğrenci Şehirleri
                    </h1>
                    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Üniversite tercihi sadece okul seçmek değil; yaşayacağın şehri, ulaşımını, kira ve yurt imkanlarını seçmektir. Türkiye'nin öne çıkan öğrenci şehirlerini keşfet.
                    </p>
                </div>

                <!-- Search & Filter Controls -->
                <div class="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="relative w-full sm:w-80">
                        <i data-lucide="search" class="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                        <input type="text" id="city-search-input" placeholder="Şehir ara (örn: Eskişehir, İzmir)..." class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                    </div>

                    <div id="city-filter-pills" class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                        <button class="city-filter-pill px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-950/40 text-cyan-400 border border-cyan-500/40 cursor-pointer transition-all active-pill" data-category="all">Tümü</button>
                        <button class="city-filter-pill px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer transition-all" data-category="metropol">Büyükşehirler</button>
                        <button class="city-filter-pill px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer transition-all" data-category="student">Öğrenci Dostu</button>
                        <button class="city-filter-pill px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer transition-all" data-category="coast">Sahil & Tatil</button>
                        <button class="city-filter-pill px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer transition-all" data-category="anadolu">Anadolu</button>
                    </div>
                </div>

                <!-- City Cards Grid Container -->
                <div id="cities-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Rendered dynamically via initCitiesPage -->
                </div>
            </div>

            <!-- City Universities Modal Dialog -->
            <div id="city-unis-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-200">
                <div class="relative w-full max-w-2xl max-h-[85vh] rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-2xl flex flex-col overflow-hidden transform scale-95 transition-all duration-200" id="city-unis-modal-box">
                    <!-- Modal Header -->
                    <div class="p-6 border-b border-zinc-800/80 flex items-start justify-between gap-4 bg-zinc-900/80 shrink-0">
                        <div>
                            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-2">
                                <i data-lucide="map-pin" class="w-3 h-3 text-cyan-400"></i>
                                <span id="city-modal-badge">İstanbul</span>
                            </div>
                            <h3 id="city-modal-title" class="text-xl sm:text-2xl font-bold text-white tracking-tight">İstanbul'daki Üniversiteler</h3>
                            <p id="city-modal-desc" class="text-xs text-zinc-400 mt-1">İncelemek istediğin üniversiteye tıklayarak öğrenci değerlendirmelerine ve kampüs rehberine ulaşabilirsin.</p>
                        </div>
                        <button id="city-modal-close-btn" class="w-9 h-9 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0" aria-label="Kapat">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Search Input inside Modal -->
                    <div class="p-4 border-b border-zinc-800/60 bg-zinc-950/40 shrink-0">
                        <div class="relative w-full">
                            <i data-lucide="search" class="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                            <input type="text" id="city-modal-search" placeholder="Bu şehirdeki üniversitelerde ara..." class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors">
                        </div>
                    </div>

                    <!-- Universities List (Scrollable) -->
                    <div id="city-modal-unis-list" class="p-6 overflow-y-auto space-y-2 max-h-[50vh]">
                        <!-- Rendered dynamically -->
                    </div>

                    <!-- Modal Footer -->
                    <div class="p-4 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between text-xs text-zinc-500 shrink-0">
                        <span id="city-modal-count">59 üniversite listeleniyor</span>
                        <button id="city-modal-close-footer" class="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium transition-colors cursor-pointer">
                            Kapat
                        </button>
                    </div>
                </div>
            </div>
        </main>
    `,

    ranking: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Effects -->
            <div class="pointer-events-none absolute -top-32 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="pointer-events-none absolute top-96 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="text-center mb-12">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-amber-300 mb-4 backdrop-blur-md">
                        <i data-lucide="trophy" class="w-3.5 h-3.5 text-amber-400"></i>
                        <span>2026 Öğrenci Memnuniyeti & Üniversite Liderleri</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        Üniversite Sıralaması
                    </h1>
                    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Doğrulanmış 15.000+ öğrenci değerlendirmesi; akademik kalite, yurt/yemekhane, kampüs yaşamı ve ulaşım kriterleri baz alınarak oluşturulan güncel sıralama.
                    </p>
                </div>

                <!-- Top 3 Podium Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" id="top-podium-cards">
                    <!-- Rendered dynamically via initRankingPage -->
                </div>

                <!-- Filter Tabs & Search -->
                <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
                    <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0" id="ranking-filter-tabs">
                        <button class="rank-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-400 text-zinc-950 cursor-pointer transition-all active-tab" data-sort="overall">Genel Sıralama</button>
                        <button class="rank-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer transition-all" data-sort="academic">Akademik Kalite</button>
                        <button class="rank-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer transition-all" data-sort="campus">Kampüs & Sosyal Yaşam</button>
                        <button class="rank-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer transition-all" data-sort="dorm">Yurt & Yemekhane</button>
                        <button class="rank-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer transition-all" data-sort="transport">Ulaşım & Lokasyon</button>
                    </div>

                    <div class="relative w-full md:w-64">
                        <i data-lucide="search" class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
                        <input type="text" id="ranking-search-input" placeholder="Okul ara..." class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:border-cyan-400 outline-none">
                    </div>
                </div>

                <!-- Ranking List Table / Cards -->
                <div id="ranking-list" class="space-y-3">
                    <!-- Populated dynamically via initRankingPage -->
                </div>
            </div>
        </main>
    `,

    departments: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Effects -->
            <div class="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="text-center mb-12">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-4 backdrop-blur-md">
                        <i data-lucide="graduation-cap" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>Lisans & Önlisans Bölüm Rehberi</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        Üniversite Bölümleri
                    </h1>
                    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Hangi bölüm sana uygun? Sektördeki iş imkanları, öğrenci zorluk derecesi, staj olanakları ve o alanda Türkiye'nin en iyi üniversitelerini keşfet.
                    </p>
                </div>

                <!-- Filter Controls -->
                <div class="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="relative w-full sm:w-80">
                        <i data-lucide="search" class="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                        <input type="text" id="dept-search-input" placeholder="Bölüm ara (örn: Bilgisayar, Tıp, Hukuk)..." class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:border-cyan-400 outline-none">
                    </div>

                    <div id="dept-filter-pills" class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                        <button class="dept-filter-pill px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-950/40 text-cyan-400 border border-cyan-500/40 cursor-pointer active-pill" data-category="all">Tümü</button>
                        <button class="dept-filter-pill px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer" data-category="eng">Mühendislik & Bilişim</button>
                        <button class="dept-filter-pill px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer" data-category="health">Sağlık & Tıp</button>
                        <button class="dept-filter-pill px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer" data-category="econ">İktisadi & İdari</button>
                        <button class="dept-filter-pill px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer" data-category="law">Sosyal & Hukuk</button>
                        <button class="dept-filter-pill px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer" data-category="design">Mimarlık & Sanat</button>
                    </div>
                </div>

                <!-- Departments Grid -->
                <div id="departments-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Rendered dynamically via initDepartmentsPage -->
                </div>
            </div>
        </main>
    `,

    admin: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-10 sm:py-16">
            <!-- Ambient Glow -->
            <div class="pointer-events-none absolute -top-32 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="pointer-events-none absolute top-80 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                <!-- Header & Tab Navigation -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-zinc-800/80">
                    <div>
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 mb-2">
                            <i data-lucide="shield" class="w-3.5 h-3.5"></i>
                            <span>Yönetim Merkezi · RBAC Güvenli</span>
                        </div>
                        <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight" style="font-family: var(--font-heading);">
                            Admin & Moderasyon Paneli
                        </h1>
                        <p class="text-xs sm:text-sm text-zinc-400 mt-1">Platform metriklerini izleyin, kullanıcıları denetleyin ve bekleyen içerikleri onaylayın.</p>
                    </div>

                    <!-- Panel Tabs -->
                    <div class="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-x-auto" id="admin-panel-tabs">
                        <button class="admin-tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 text-zinc-950 cursor-pointer transition-all active-tab flex items-center gap-1.5" data-tab="dashboard">
                            <i data-lucide="layout-dashboard" class="w-3.5 h-3.5"></i> Dashboard
                        </button>
                        <button class="admin-tab-btn px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer transition-all flex items-center gap-1.5" data-tab="users">
                            <i data-lucide="users" class="w-3.5 h-3.5"></i> Kullanıcılar
                        </button>
                        <button class="admin-tab-btn px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer transition-all flex items-center gap-1.5" data-tab="moderation">
                            <i data-lucide="check-square" class="w-3.5 h-3.5"></i> Moderasyon
                        </button>
                        <button class="admin-tab-btn px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer transition-all flex items-center gap-1.5" data-tab="messages">
                            <i data-lucide="mail" class="w-3.5 h-3.5"></i> İletişim
                        </button>
                    </div>
                </div>

                <!-- 1. TAB: DASHBOARD -->
                <div id="admin-tab-dashboard" class="space-y-8">
                    <!-- Metric Cards Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
                            <div class="flex items-center justify-between text-zinc-500 mb-2">
                                <span class="text-xs uppercase font-semibold">Kullanıcılar</span>
                                <i data-lucide="users" class="w-4 h-4 text-cyan-400"></i>
                            </div>
                            <div class="text-3xl font-extrabold text-white" id="admin-stat-users">—</div>
                            <div class="text-[11px] text-zinc-500 mt-2">Kayıtlı üye profili</div>
                        </div>

                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
                            <div class="flex items-center justify-between text-zinc-500 mb-2">
                                <span class="text-xs uppercase font-semibold">Öğrenci Yorumu</span>
                                <i data-lucide="message-square" class="w-4 h-4 text-amber-400"></i>
                            </div>
                            <div class="text-3xl font-extrabold text-white" id="admin-stat-reviews">—</div>
                            <div class="text-[11px] text-zinc-500 mt-2">Doğrulanmış deneyim</div>
                        </div>

                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
                            <div class="flex items-center justify-between text-zinc-500 mb-2">
                                <span class="text-xs uppercase font-semibold">Okul Önerileri</span>
                                <i data-lucide="building-2" class="w-4 h-4 text-purple-400"></i>
                            </div>
                            <div class="text-3xl font-extrabold text-white" id="admin-stat-suggestions">—</div>
                            <div class="text-[11px] text-zinc-500 mt-2">Bekleyen başvuru</div>
                        </div>

                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
                            <div class="flex items-center justify-between text-zinc-500 mb-2">
                                <span class="text-xs uppercase font-semibold">Blog Yazıları</span>
                                <i data-lucide="book-open" class="w-4 h-4 text-sky-400"></i>
                            </div>
                            <div class="text-3xl font-extrabold text-white" id="admin-stat-blogs">—</div>
                            <div class="text-[11px] text-zinc-500 mt-2">İncelenecek rehber</div>
                        </div>

                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
                            <div class="flex items-center justify-between text-zinc-500 mb-2">
                                <span class="text-xs uppercase font-semibold">İletişim Mesajı</span>
                                <i data-lucide="mail" class="w-4 h-4 text-rose-400"></i>
                            </div>
                            <div class="text-3xl font-extrabold text-white" id="admin-stat-messages">—</div>
                            <div class="text-[11px] text-zinc-500 mt-2">Okunmamış bildirim</div>
                        </div>

                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
                            <div class="flex items-center justify-between text-zinc-500 mb-2">
                                <span class="text-xs uppercase font-semibold">KYK Yurtları</span>
                                <i data-lucide="home" class="w-4 h-4 text-emerald-400"></i>
                            </div>
                            <div class="text-3xl font-extrabold text-white" id="admin-stat-dorms">—</div>
                            <div class="text-[11px] text-zinc-500 mt-2">Veritabanında kayıtlı</div>
                        </div>
                    </div>

                    <!-- Quick Navigation & Server Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                            <h3 class="text-base font-bold text-white flex items-center gap-2">
                                <i data-lucide="zap" class="w-4 h-4 text-cyan-400"></i> Hızlı Moderasyon Eylemleri
                            </h3>
                            <div class="space-y-2 text-xs">
                                <button class="admin-quick-action w-full p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 transition-all text-left flex items-center justify-between text-zinc-200" data-jump="moderation">
                                    <span class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-purple-400"></i> Bekleyen Okul ve Blog Başvurularını İncele</span>
                                    <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-zinc-500"></i>
                                </button>
                                <button class="admin-quick-action w-full p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 transition-all text-left flex items-center justify-between text-zinc-200" data-jump="users">
                                    <span class="flex items-center gap-2"><i data-lucide="user-check" class="w-4 h-4 text-cyan-400"></i> Kullanıcı Yetkilerini & Rollerini Düzenle</span>
                                    <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-zinc-500"></i>
                                </button>
                                <button class="admin-quick-action w-full p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 transition-all text-left flex items-center justify-between text-zinc-200" data-jump="messages">
                                    <span class="flex items-center gap-2"><i data-lucide="mail-open" class="w-4 h-4 text-rose-400"></i> Gelen İletişim & Destek Taleplerine Bak</span>
                                    <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-zinc-500"></i>
                                </button>
                            </div>
                        </div>

                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                            <h3 class="text-base font-bold text-white flex items-center gap-2">
                                <i data-lucide="server" class="w-4 h-4 text-emerald-400"></i> Sistem & Güvenlik Mimarisi
                            </h3>
                            <div class="space-y-3 text-xs text-zinc-400">
                                <div class="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                                    <span>Yetkilendirme Modeli:</span>
                                    <span class="font-bold text-cyan-400">RBAC (Role-Based Access Control)</span>
                                </div>
                                <div class="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                                    <span>Oturum Protokolü:</span>
                                    <span class="font-bold text-zinc-200">JWT Bearer (HS256)</span>
                                </div>
                                <div class="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                                    <span>Veritabanı Motoru:</span>
                                    <span class="font-bold text-zinc-200">MySQL / SQLAlchemy ORM</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span>Erişim Koruması:</span>
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">Backend & Route Guard Aktif</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. TAB: KULLANICILAR -->
                <div id="admin-tab-users" class="hidden space-y-4">
                    <!-- Search & Filter Controls -->
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="relative w-full sm:w-80">
                            <i data-lucide="search" class="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                            <input type="text" id="admin-user-search" placeholder="İsim veya e-posta ile kullanıcı ara..." class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-cyan-400">
                        </div>

                        <div class="flex items-center gap-2 w-full sm:w-auto">
                            <select id="admin-user-role-filter" class="w-full sm:w-48 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-4 py-2.5 outline-none focus:border-cyan-400">
                                <option value="all">Tüm Roller</option>
                                <option value="admin">Yöneticiler (Admin)</option>
                                <option value="moderator">Moderatörler</option>
                                <option value="user">Standart Öğrenciler</option>
                            </select>
                        </div>
                    </div>

                    <!-- Users Table Container -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden overflow-x-auto shadow-xl">
                        <table class="w-full text-left text-xs text-zinc-300">
                            <thead class="bg-zinc-950/80 text-zinc-500 border-b border-zinc-800 uppercase font-semibold text-[11px]">
                                <tr>
                                    <th class="p-4">Kullanıcı Bilgisi</th>
                                    <th class="p-4">E-posta</th>
                                    <th class="p-4">Üniversite</th>
                                    <th class="p-4">Rol (RBAC)</th>
                                    <th class="p-4">Durum</th>
                                    <th class="p-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody id="admin-users-tbody" class="divide-y divide-zinc-800/60">
                                <tr><td colspan="6" class="p-8 text-center text-zinc-500">Kullanıcılar yükleniyor...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 3. TAB: MODERASYON -->
                <div id="admin-tab-moderation" class="hidden space-y-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-bold text-white flex items-center gap-2">
                            <i data-lucide="check-square" class="w-4 h-4 text-cyan-400"></i> Onay Bekleyen İçerikler
                        </h3>
                        <span id="admin-moderation-count" class="text-xs text-zinc-500">Taranıyor...</span>
                    </div>

                    <div id="admin-moderation-list" class="space-y-4">
                        <div class="p-8 text-center text-zinc-500">Bekleyen içerikler yükleniyor...</div>
                    </div>
                </div>

                <!-- 4. TAB: İLETİŞİM MESAJLARI -->
                <div id="admin-tab-messages" class="hidden space-y-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-bold text-white flex items-center gap-2">
                            <i data-lucide="mail" class="w-4 h-4 text-rose-400"></i> Gelen İletişim Mesajları
                        </h3>
                        <span id="admin-messages-count" class="text-xs text-zinc-500">Yükleniyor...</span>
                    </div>

                    <div id="admin-messages-list" class="space-y-4">
                        <div class="p-8 text-center text-zinc-500">Mesajlar yükleniyor...</div>
                    </div>
                </div>

            </div>
        </main>
    `
};