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
                    <div class="hero-centered__search-wrapper relative w-full max-w-4xl mx-auto mb-8">
                        <div class="relative w-full flex items-center p-2.5 sm:p-3 rounded-2xl bg-white/[0.04] border border-white/15 backdrop-blur-xl shadow-2xl shadow-cyan-950/30 hover:border-cyan-500/45 focus-within:border-cyan-400/70 transition-all duration-300 group">
                            <i data-lucide="search" class="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 ml-3 sm:ml-4 shrink-0 group-hover:text-cyan-400 transition-colors"></i>
                            <input 
                                type="text" 
                                id="hero-search-input"
                                class="hero-centered__search-input flex-1 bg-transparent px-4 sm:px-5 py-3.5 sm:py-4 text-base sm:text-lg text-white placeholder-zinc-400 focus:outline-none w-full" 
                                placeholder="Üniversite, şehir veya bölüm ara (örn. İTÜ Bilgisayar)..."
                                autocomplete="off"
                            >
                            <button 
                                type="button" 
                                id="hero-search-btn"
                                class="px-6 sm:px-9 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-zinc-950 font-bold text-sm sm:text-base shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center gap-2.5 cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span>Keşfet</span>
                                <i data-lucide="arrow-right" class="w-4 h-4 sm:w-5 sm:h-5"></i>
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
                    <p class="section-desc">Çevre illerden bu üniversiteye ulaşım imkanlarını ve kampüsün interaktif konumunu keşfedin.</p>

                    <!-- Canlı Kampüs & Ulaşım Haritası Kapsayıcısı (Leaflet.js) -->
                    <div class="campus-map-wrapper" id="campus-map-wrapper">
                        <div class="campus-map-header">
                            <div class="campus-map-header__info">
                                <span class="campus-map-header__dot"></span>
                                <span class="campus-map-header__title" id="campus-map-label">Bandırma Onyedi Eylül Üniversitesi — Merkez Yerleşke</span>
                            </div>
                            <div class="campus-map-header__actions">
                                <button type="button" class="campus-map-reset-btn" id="campus-map-reset-btn" title="Kampüs konumuna odakla">
                                    <i data-lucide="locate-fixed" class="icon-xs"></i> Kampüse Odakla
                                </button>
                            </div>
                        </div>

                        <div class="campus-map-body">
                            <div id="campus-transport-map" class="campus-transport-map" aria-label="Üniversite Kampüs Konum Haritası"></div>

                            <!-- Haritanın Sol Alt Köşesinde Zoom Kısayol Bilgilendirme Rozeti -->
                            <div class="campus-map-zoom-hint" id="campus-map-zoom-hint" aria-live="polite">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="5" y="2" width="14" height="20" rx="7"/>
                                    <path d="M12 6v4"/>
                                </svg>
                                <span>Zoom için <kbd>Ctrl</kbd> + <kbd>Scroll</kbd></span>
                            </div>

                            <!-- Haritanın Sağ Alt Köşesinde Konumlanan Google Haritalar Butonu & Hover Açıklama Kartı -->
                            <div class="campus-map-edge-card" id="campus-map-edge-card">
                                <div class="campus-map-edge-card__popover">
                                    <span class="map-popup__badge">Canlı Kampüs Konumu</span>
                                    <h4 class="campus-map-edge-card__title" id="campus-map-edge-title">Bandırma Onyedi Eylül Üniversitesi</h4>
                                    <p class="campus-map-edge-card__desc" id="campus-map-edge-desc">Marmara Denizi kıyısında, Bandırma İDO Feribot İskelesi ve şehir merkezine 10 dakika mesafede konumlanan ana yerleşke.</p>
                                </div>
                                <a href="https://www.google.com/maps?q=40.3414,27.9344" target="_blank" rel="noopener noreferrer" class="map-popup__btn" id="campus-map-gmaps-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    <span>Google Haritalar'da Aç</span>
                                </a>
                            </div>
                        </div>
                    </div>

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
        <main class="page-view profile-page-v2 relative bg-zinc-950 text-zinc-100 min-h-screen pb-20 overflow-hidden">
            <!-- Ambient Glow Effects -->
            <div class="pointer-events-none absolute -top-32 left-1/4 w-[32rem] h-[32rem] bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="pointer-events-none absolute top-64 -right-24 w-[28rem] h-[28rem] bg-indigo-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <!-- 1. ÜST KISIM: ZARİF KAPAK (BANNER) & KULLANICI KİMLİK KARTI -->
            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
                <div class="rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                    
                    <!-- Cover Banner -->
                    <div class="relative h-32 sm:h-44 w-full bg-gradient-to-r from-cyan-950/80 via-zinc-900 to-indigo-950/80 border-b border-zinc-800/80 overflow-hidden">
                        <div class="absolute inset-0 opacity-25" style="background-image: radial-gradient(circle at 2px 2px, rgba(34,211,238,0.25) 1px, transparent 0); background-size: 24px 24px;"></div>
                        <div class="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-400/15 rounded-full blur-2xl"></div>
                        <div class="absolute -top-16 right-12 w-64 h-64 bg-sky-400/10 rounded-full blur-2xl"></div>
                        <div class="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
                            <span id="profile-role-badge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-950/70 border border-zinc-700/80 text-cyan-400 backdrop-blur-md">
                                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                                <span id="profile-role-text">Öğrenci Üye</span>
                            </span>
                        </div>
                    </div>

                    <!-- Identity Row & Top Stats -->
                    <div class="px-5 sm:px-8 pb-6 sm:pb-8">
                        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-12 sm:-mt-14 relative z-10">
                            
                            <!-- Avatar & User Meta -->
                            <div class="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                                <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-950 border-4 border-zinc-900 ring-1 ring-cyan-500/40 flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-cyan-400 shadow-2xl shrink-0" id="profile-avatar">
                                    MS
                                </div>
                                <div class="space-y-1.5 pt-1 sm:pb-1">
                                    <div class="flex flex-wrap items-center gap-2.5">
                                        <h1 class="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight" id="profile-name" style="font-family: var(--font-heading);">
                                            Yükleniyor...
                                        </h1>
                                        <span id="profile-grade-pill" class="hidden items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-950/50 border border-cyan-500/30 text-cyan-300"></span>
                                    </div>
                                    <p class="text-xs sm:text-sm text-zinc-400 flex items-center gap-1.5" id="profile-academic-info">
                                        <i data-lucide="graduation-cap" class="w-4 h-4 text-cyan-400 shrink-0"></i>
                                        <span>Üniversite ve bölüm bilgisi eklenmemiş.</span>
                                    </p>
                                    <p class="text-xs text-zinc-500 max-w-2xl leading-relaxed" id="profile-bio-text"></p>
                                </div>
                            </div>

                            <!-- Quick Actions -->
                            <div class="flex flex-wrap items-center gap-2.5" id="profile-identity-actions">
                                <a href="#/review-form" class="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-zinc-950 transition-all inline-flex items-center gap-1.5 shadow-lg shadow-cyan-500/10">
                                    <i data-lucide="pen-line" class="w-3.5 h-3.5"></i>
                                    <span>Değerlendir</span>
                                </a>
                                <button type="button" id="profile-edit-quick-btn" class="px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all inline-flex items-center gap-1.5 cursor-pointer">
                                    <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5 text-cyan-400"></i>
                                    <span>Profili Düzenle</span>
                                </button>
                                <button type="button" id="profile-logout-btn" class="px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 border border-rose-500/30 transition-all inline-flex items-center gap-1.5 cursor-pointer">
                                    <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                                    <span>Çıkış Yap</span>
                                </button>
                            </div>
                        </div>

                        <!-- 4-Column Counter Strip -->
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-zinc-800/80" aria-label="Profil istatistikleri">
                            <div class="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center gap-3.5">
                                <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                                    <i data-lucide="message-square" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <div class="text-xl sm:text-2xl font-extrabold text-zinc-100 leading-none" id="stat-review-count">0</div>
                                    <div class="text-[11px] text-zinc-500 font-medium mt-1">Değerlendirme</div>
                                </div>
                            </div>

                            <div class="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center gap-3.5">
                                <div class="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                    <i data-lucide="thumbs-up" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <div class="text-xl sm:text-2xl font-extrabold text-zinc-100 leading-none" id="stat-upvotes">0</div>
                                    <div class="text-[11px] text-zinc-500 font-medium mt-1">Toplam Beğeni</div>
                                </div>
                            </div>

                            <div class="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center gap-3.5">
                                <div class="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                    <i data-lucide="file-check-2" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <div class="text-xl sm:text-2xl font-extrabold text-zinc-100 leading-none" id="stat-submissions-count">0</div>
                                    <div class="text-[11px] text-zinc-500 font-medium mt-1">Başvuru & Öneri</div>
                                </div>
                            </div>

                            <div class="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center gap-3.5">
                                <div class="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                                    <i data-lucide="bookmark" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <div class="text-xl sm:text-2xl font-extrabold text-zinc-100 leading-none" id="stat-favorites-count">0</div>
                                    <div class="text-[11px] text-zinc-500 font-medium mt-1">Favori Üniversite</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. İKİ KOLONLU ANA DÜZEN (SOL %70 ANA ALAN / SAĞ %30 YAN PANEL) -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">

                    <!-- SOL / ANA ALAN (%70 -> 8 Sütun) -->
                    <div class="lg:col-span-8 space-y-6">

                        <!-- Sekme Navigasyonu (Tabs) -->
                        <div class="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-x-auto" role="tablist" aria-label="Profil bölümleri">
                            <button class="profile-tab-v2 is-active flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                                id="profile-reviews-tab" type="button" role="tab" aria-selected="true"
                                aria-controls="profile-reviews-panel" data-profile-tab="reviews">
                                <i data-lucide="message-square" class="w-4 h-4"></i>
                                <span>Değerlendirmelerim</span>
                                <span id="tab-badge-reviews" class="px-2 py-0.5 rounded-full text-[11px] bg-zinc-950/60 text-cyan-400 border border-zinc-700/60">0</span>
                            </button>

                            <button class="profile-tab-v2 flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                                id="profile-submissions-tab" type="button" role="tab" aria-selected="false"
                                aria-controls="profile-submissions-panel" data-profile-tab="submissions">
                                <i data-lucide="layers" class="w-4 h-4"></i>
                                <span>Başvurularım & Önerilerim</span>
                                <span id="tab-badge-submissions" class="px-2 py-0.5 rounded-full text-[11px] bg-zinc-950/60 text-zinc-400 border border-zinc-700/60">0</span>
                            </button>

                            <button class="profile-tab-v2 flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                                id="profile-settings-tab" type="button" role="tab" aria-selected="false"
                                aria-controls="profile-settings-panel" data-profile-tab="settings">
                                <i data-lucide="settings" class="w-4 h-4"></i>
                                <span>Ayarlar</span>
                            </button>
                        </div>

                        <!-- SEKME 1: DEĞERLENDİRMELERİM -->
                        <section class="profile-panel-v2 space-y-4" id="profile-reviews-panel" role="tabpanel" aria-labelledby="profile-reviews-tab">
                            <div id="user-reviews-list" class="space-y-4" aria-live="polite"></div>
                        </section>

                        <!-- SEKME 2: BAŞVURULARIM & ÖNERİLERİM -->
                        <section class="profile-panel-v2 space-y-5" id="profile-submissions-panel" role="tabpanel" aria-labelledby="profile-submissions-tab" hidden>
                            
                            <!-- Filtre Çipleri & Hızlı Katkı Butonları -->
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                                <div class="flex flex-wrap items-center gap-1.5" id="submission-status-filters">
                                    <button type="button" data-sub-filter="all" class="sub-filter-chip px-3 py-1.5 rounded-xl text-xs font-medium border border-cyan-400 bg-cyan-950/30 text-cyan-400 transition-all cursor-pointer">
                                        Tümü
                                    </button>
                                    <button type="button" data-sub-filter="pending" class="sub-filter-chip px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 transition-all cursor-pointer inline-flex items-center gap-1.5">
                                        <span class="w-2 h-2 rounded-full bg-amber-400"></span> İnceleniyor
                                    </button>
                                    <button type="button" data-sub-filter="approved" class="sub-filter-chip px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 transition-all cursor-pointer inline-flex items-center gap-1.5">
                                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Onaylandı
                                    </button>
                                    <button type="button" data-sub-filter="rejected" class="sub-filter-chip px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 transition-all cursor-pointer inline-flex items-center gap-1.5">
                                        <span class="w-2 h-2 rounded-full bg-rose-400"></span> Reddedildi
                                    </button>
                                </div>

                                <div class="flex items-center gap-2 shrink-0">
                                    <a href="#/okul-oner" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all inline-flex items-center gap-1.5">
                                        <i data-lucide="building-2" class="w-3.5 h-3.5 text-cyan-400"></i>
                                        <span>Okul Öner</span>
                                    </a>
                                    <a href="#/yazi-gonder" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all inline-flex items-center gap-1.5">
                                        <i data-lucide="book-open" class="w-3.5 h-3.5 text-cyan-400"></i>
                                        <span>Deneyim Paylaş</span>
                                    </a>
                                </div>
                            </div>

                            <!-- Başvuru Durum Kartları Listesi -->
                            <div id="user-submissions-list" class="space-y-4" aria-live="polite"></div>
                        </section>

                        <!-- SEKME 3: AYARLAR (PROFİL DÜZENLEME FORMU) -->
                        <section class="profile-panel-v2" id="profile-settings-panel" role="tabpanel" aria-labelledby="profile-settings-tab" hidden>
                            <form id="profile-settings-form" class="space-y-6">
                                
                                <!-- Bölüm 1: Akademik & Kişisel Bilgiler -->
                                <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
                                    <div class="flex items-center gap-3 pb-4 border-b border-zinc-800/80">
                                        <div class="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                            <i data-lucide="user-check" class="w-4 h-4"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-base font-bold text-zinc-100">Kişisel ve Akademik Bilgiler</h3>
                                            <p class="text-xs text-zinc-500">Yorumlarınızda ve profil kartınızda görünecek temel bilgileriniz.</p>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div class="space-y-1.5">
                                            <label class="block text-xs font-semibold text-zinc-300" for="settings-name">Ad Soyad</label>
                                            <input class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl px-4 py-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                                                id="settings-name" name="name" autocomplete="name" placeholder="Örn: Davut Örs" required>
                                        </div>

                                        <div class="space-y-1.5">
                                            <label class="block text-xs font-semibold text-zinc-300" for="settings-grade">Sınıf Derecesi</label>
                                            <select class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl px-4 py-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                                                id="settings-grade" name="grade">
                                                <option value="">Seçiniz...</option>
                                                <option value="Hazırlık">Hazırlık Sınıfı</option>
                                                <option value="1. Sınıf">1. Sınıf</option>
                                                <option value="2. Sınıf">2. Sınıf</option>
                                                <option value="3. Sınıf">3. Sınıf</option>
                                                <option value="4. Sınıf">4. Sınıf</option>
                                                <option value="Yüksek Lisans / Doktora">Yüksek Lisans / Doktora</option>
                                                <option value="Mezun">Mezun</option>
                                            </select>
                                        </div>

                                        <div class="space-y-1.5">
                                            <label class="block text-xs font-semibold text-zinc-300" for="settings-university">Üniversite</label>
                                            <input class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl px-4 py-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                                                id="settings-university" name="university" list="profile-uni-datalist" autocomplete="organization" placeholder="Üniversite seçin veya yazın...">
                                            <datalist id="profile-uni-datalist"></datalist>
                                        </div>

                                        <div class="space-y-1.5">
                                            <label class="block text-xs font-semibold text-zinc-300" for="settings-department">Bölüm / Program</label>
                                            <input class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl px-4 py-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                                                id="settings-department" name="department" placeholder="Örn: Bilgisayar Mühendisliği">
                                        </div>
                                    </div>

                                    <div class="space-y-1.5">
                                        <div class="flex items-center justify-between">
                                            <label class="block text-xs font-semibold text-zinc-300" for="settings-bio">Kısa Biyografi</label>
                                            <span class="text-[11px] text-zinc-500" id="settings-bio-counter">0 / 240</span>
                                        </div>
                                        <textarea class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl px-4 py-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all resize-none"
                                            id="settings-bio" name="bio" rows="3" maxlength="240"
                                            placeholder="Kampüs hayatınız, ilgi alanlarınız veya aday öğrencilere tavsiyelerinizden kısaca bahsedin..."></textarea>
                                    </div>
                                </div>

                                <!-- Bölüm 2: Şifre & Güvenlik -->
                                <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
                                    <div class="flex items-center gap-3 pb-4 border-b border-zinc-800/80">
                                        <div class="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                            <i data-lucide="lock" class="w-4 h-4"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-base font-bold text-zinc-100">Şifre ve Hesap Güvenliği</h3>
                                            <p class="text-xs text-zinc-500">Şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakabilirsiniz.</p>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div class="space-y-1.5">
                                            <label class="block text-xs font-semibold text-zinc-300" for="settings-current-password">Mevcut Şifre</label>
                                            <input class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl px-4 py-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                                                id="settings-current-password" name="current_password" type="password" autocomplete="current-password" placeholder="••••••••">
                                        </div>

                                        <div class="space-y-1.5">
                                            <label class="block text-xs font-semibold text-zinc-300" for="settings-new-password">Yeni Şifre (En az 6 karakter)</label>
                                            <input class="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl px-4 py-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                                                id="settings-new-password" name="new_password" type="password" minlength="6" autocomplete="new-password" placeholder="••••••••">
                                        </div>
                                    </div>
                                </div>

                                <!-- Kaydet Aksiyon Alanı -->
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                                    <p id="profile-settings-message" class="text-xs font-semibold text-cyan-400" role="status"></p>
                                    <button class="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold text-sm transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer" type="submit">
                                        <i data-lucide="save" class="w-4 h-4"></i>
                                        <span>Değişiklikleri Kaydet</span>
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

                    <!-- SAĞ YAN PANEL (SIDEBAR - %30 -> 4 Sütun) -->
                    <aside class="lg:col-span-4 space-y-6">

                        <!-- Widget 1: Hızlı Özet İstatistik & Profil Doluluk Kartı -->
                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                    <i data-lucide="bar-chart-3" class="w-4 h-4 text-cyan-400"></i>
                                    <span>Hızlı Özet & Katkı</span>
                                </h3>
                                <span id="profile-completeness-pct" class="text-xs font-bold text-cyan-400">%0</span>
                            </div>

                            <!-- Profil Doluluk Çubuğu -->
                            <div class="space-y-1.5">
                                <div class="flex items-center justify-between text-[11px] text-zinc-400">
                                    <span>Profil Tamamlanma Oranı</span>
                                    <span id="profile-completeness-label">Başlangıç</span>
                                </div>
                                <div class="w-full h-2 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                                    <div id="profile-completeness-bar" class="h-full bg-gradient-to-r from-cyan-400 to-sky-400 transition-all duration-500" style="width: 25%;"></div>
                                </div>
                            </div>

                            <!-- Özet Metrik Satırları -->
                            <div class="space-y-2.5 pt-2 border-t border-zinc-800/80 text-xs">
                                <div class="flex items-center justify-between py-1">
                                    <span class="text-zinc-400 flex items-center gap-2">
                                        <i data-lucide="star" class="w-3.5 h-3.5 text-amber-400"></i> Ortalama Puanım
                                    </span>
                                    <span class="font-bold text-zinc-100" id="sidebar-avg-rating">0.0 / 5.0</span>
                                </div>
                                <div class="flex items-center justify-between py-1">
                                    <span class="text-zinc-400 flex items-center gap-2">
                                        <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> Onaylanan Katkı
                                    </span>
                                    <span class="font-bold text-emerald-400" id="sidebar-approved-count">0 İçerik</span>
                                </div>
                                <div class="flex items-center justify-between py-1">
                                    <span class="text-zinc-400 flex items-center gap-2">
                                        <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-400"></i> İncelenen Başvuru
                                    </span>
                                    <span class="font-bold text-amber-400" id="sidebar-pending-count">0 Başvuru</span>
                                </div>
                                <div class="flex items-center justify-between py-1">
                                    <span class="text-zinc-400 flex items-center gap-2">
                                        <i data-lucide="calendar" class="w-3.5 h-3.5 text-cyan-400"></i> Katılım Tarihi
                                    </span>
                                    <span class="font-medium text-zinc-300" id="sidebar-join-date">Mart 2026</span>
                                </div>
                            </div>
                        </div>

                        <!-- Widget 2: Kullanıcı Rozetleri (Badges) -->
                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                    <i data-lucide="award" class="w-4 h-4 text-amber-400"></i>
                                    <span>Kullanıcı Rozetleri</span>
                                </h3>
                                <span id="profile-badges-count" class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/50 text-amber-400 border border-amber-500/30">
                                    1 / 6 Kazanıldı
                                </span>
                            </div>

                            <div id="profile-badges-grid" class="grid grid-cols-2 gap-3">
                                <!-- JS tarafından dinamik doldurulur -->
                            </div>
                        </div>

                        <!-- Widget 3: Favori / Takip Edilen Üniversiteler -->
                        <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                    <i data-lucide="heart" class="w-4 h-4 text-rose-400"></i>
                                    <span>Takip Edilen Okullar</span>
                                </h3>
                                <a href="#/favorites" class="text-[11px] font-semibold text-cyan-400 hover:underline inline-flex items-center gap-1">
                                    <span>Tümü</span>
                                    <i data-lucide="arrow-up-right" class="w-3 h-3"></i>
                                </a>
                            </div>

                            <div id="profile-favorites-list" class="space-y-2.5">
                                <!-- JS tarafından dinamik doldurulur -->
                            </div>
                        </div>

                    </aside>
                </div>
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
                    <div class="auth-input-group" style="margin-bottom: 18px;">
                        <label for="reg-password">Şifre (En az 6 karakter)</label>
                        <input type="password" id="reg-password" class="auth-input" placeholder="••••••••" required minlength="6">
                    </div>

                    <div class="auth-checkbox-group">
                        <label class="auth-checkbox-label" for="reg-legal-consent">
                            <input type="checkbox" id="reg-legal-consent" class="auth-checkbox-input" required>
                            <span class="auth-checkbox-custom"></span>
                            <span class="auth-checkbox-text">
                                <a href="#/kullanim-sartlari" data-legal-modal="terms" class="auth-legal-link">Kullanıcı Sözleşmesi</a>'ni ve <a href="#/gizlilik" data-legal-modal="kvkk" class="auth-legal-link">KVKK Aydınlatma Metni</a>'ni okudum ve kabul ediyorum.
                            </span>
                        </label>
                    </div>

                    <button type="submit" class="auth-submit-btn">Hesap Oluştur 🚀</button>
                    <div id="reg-error" style="color: var(--color-danger); margin-top: 15px; text-align: center; font-size: 0.9rem; font-weight: 500;"></div>
                </form>
            </div>

            <!-- Yasal Metinler Şık Pop-up (Modal) Penceresi -->
            <div id="auth-legal-modal" class="auth-legal-modal" role="dialog" aria-modal="true" aria-labelledby="auth-legal-modal-title" hidden>
                <div class="auth-legal-modal__backdrop" id="auth-legal-modal-backdrop"></div>
                <div class="auth-legal-modal__box">
                    <div class="auth-legal-modal__header">
                        <div class="auth-legal-modal__tabs">
                            <button type="button" class="auth-legal-modal__tab active" data-modal-tab="terms">Kullanıcı Sözleşmesi</button>
                            <button type="button" class="auth-legal-modal__tab" data-modal-tab="kvkk">KVKK Aydınlatma Metni</button>
                        </div>
                        <button type="button" id="auth-legal-modal-close" class="auth-legal-modal__close" aria-label="Kapat">✕</button>
                    </div>

                    <div class="auth-legal-modal__body" id="auth-legal-modal-body">
                        <!-- Kullanıcı Sözleşmesi İçeriği -->
                        <div id="modal-content-terms" class="auth-legal-modal__pane">
                            <h2 id="auth-legal-modal-title">Kullanıcı Sözleşmesi ve Yer Sağlayıcı Bildirimi</h2>
                            <p>Kampüs Sesi platformuna üye olan ve içerik paylaşan her kullanıcı aşağıdaki yasal koşulları kabul etmiş sayılır:</p>
                            <h3>1. 5651 Sayılı Kanun Kapsamında "Yer Sağlayıcı" Statüsü</h3>
                            <p>Kampüs Sesi, <strong>5651 sayılı Kanun'un 2. ve 5. maddeleri</strong> uyarınca hukuken <strong>"Yer Sağlayıcı"</strong> sıfatını haizdir. 5651 sayılı Kanun m. 5/1 gereğince Yer Sağlayıcı, yer sağladığı içeriği önceden kontrol etmek veya hukuka aykırı bir faaliyetin söz konusu olup olmadığını araştırmakla yükümlü değildir.</p>
                            <h3>2. Yurt ve Üniversite Yorumlarının Hukuki Sorumluluğu</h3>
                            <p>Platformda üniversiteler, akademisyenler, kampüsler, KYK yurtları veya özel yurtlar hakkında yayınlanan her türlü yorum, eleştiri ve puanlamanın <strong>tüm hukuki, cezai ve mali sorumluluğu münhasıran o içeriği yazan kullanıcıya aittir.</strong> Kullanıcı; TCK m. 125 (Hakaret), TCK m. 267 (İftira), kişilik hakları ihlali veya gerçeğe aykırı ticari karalama niteliği taşıyan ifadelerden doğabilecek her türlü dava ve tazminat talebinden bizzat sorumludur; Kampüs Sesi hiçbir hukuki/cezai sorumluluk kabul etmez.</p>
                            <h3>3. Kurumlar İçin "Uyar-Kaldır" Sistemi</h3>
                            <p>Kişilik haklarının veya kurumsal itibarının ihlal edildiğini düşünen kişi ve kurumlar <a href="mailto:destek@kampussesi.com">destek@kampussesi.com</a> adresine ilgili URL ve açıklama ile başvurabilir. Usulüne uygun bildirimler <strong>24–48 saat</strong> içinde incelenerek hukuka aykırı içerikler yayından kaldırılır.</p>
                            <h3>4. Moderasyon ve Yürürlük</h3>
                            <p>Kampüs Sesi, topluluk kurallarına aykırı veya spam içerikleri kaldırma ve ilgili hesabı askıya alma hakkını saklı tutar.</p>
                        </div>

                        <!-- KVKK Aydınlatma Metni İçeriği -->
                        <div id="modal-content-kvkk" class="auth-legal-modal__pane" hidden>
                            <h2>KVKK Aydınlatma ve Gizlilik Politikası</h2>
                            <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca <strong>Kampüs Sesi</strong> veri sorumlusu sıfatıyla hareket etmektedir.</p>
                            <h3>1. İşlenen Kişisel Veriler ve Amaçları</h3>
                            <p>Kayıt sırasında paylaştığınız ad-soyad/rumuz, e-posta adresi, şifrelenmiş (hash) parola ve 5651 sayılı Kanun gereği tutulan trafik/IP kayıtları; yalnızca üyelik sözleşmesinin ifası, oturum güvenliğinin sağlanması ve yasal yükümlülüklerin yerine getirilmesi amacıyla (KVKK m. 5/2) işlenmektedir.</p>
                            <h3>2. Öğrenci Mahremiyeti ve Veri Aktarımı</h3>
                            <p>Değerlendirme yapan öğrencilerin e-posta ve kimlik bilgileri <strong>asla üniversite yönetimleriyle, yurt idareleriyle veya reklam şirketleriyle paylaşılmaz.</strong> Veriler yalnızca bağlayıcı resmi mahkeme/savcılık talebi halinde yetkili makamlarla paylaşılabilir.</p>
                            <h3>3. KVKK Madde 11 Kapsamındaki Haklarınız</h3>
                            <p>Dilediğiniz zaman profilinizden yorumlarınızı silebilir veya kişisel verilerinizin silinmesi/düzeltilmesi taleplerinizi <a href="mailto:destek@kampussesi.com">destek@kampussesi.com</a> adresine iletebilirsiniz.</p>
                        </div>
                    </div>

                    <div class="auth-legal-modal__footer">
                        <button type="button" id="auth-legal-modal-cancel" class="auth-legal-modal__btn-secondary">Kapat</button>
                        <button type="button" id="auth-legal-modal-accept" class="auth-legal-modal__btn-primary">Okudum, Kabul Ediyorum ✓</button>
                    </div>
                </div>
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
                <!-- Yasal Sayfalar Arasi Hizli Sekme (Tab) Gecisi -->
                <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
                    <a href="#/gizlilik" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-cyan-400 text-zinc-950 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all">
                        <i data-lucide="shield-check" class="w-4 h-4"></i> KVKK ve Gizlilik Politikası
                    </a>
                    <a href="#/cerez-politikasi" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-cyan-500/40 hover:text-white flex items-center gap-2 transition-all">
                        <i data-lucide="cookie" class="w-4 h-4 text-cyan-400"></i> Çerez (Cookie) Politikası
                    </a>
                    <a href="#/kullanim-sartlari" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-cyan-500/40 hover:text-white flex items-center gap-2 transition-all">
                        <i data-lucide="scale" class="w-4 h-4 text-cyan-400"></i> Kullanıcı Sözleşmesi
                    </a>
                </div>

                <!-- Baslik & Hero -->
                <div class="text-center mb-14">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-5 backdrop-blur-md">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>6698 Sayılı KVKK & Veri Güvenliği</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        KVKK Aydınlatma ve Gizlilik Politikası
                    </h1>
                    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Kampüs Sesi olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca kişisel verilerinizin güvenliğine, şeffaflığa ve öğrenci mahremiyetine en üst düzeyde önem veriyoruz.
                    </p>
                </div>

                <!-- Yasal Metin Kartlari (h1, h2, p formatinda) -->
                <div class="space-y-6 legal-document-content">
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="building-2" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">1. Veri Sorumlusu ve Kapsam</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, <strong>Kampüs Sesi</strong> platformu ("Platform"), kullanıcıların ve ziyaretçilerin kişisel verilerinin işlenmesi süreçlerinde "Veri Sorumlusu" sıfatıyla hareket etmektedir. İşbu Aydınlatma ve Gizlilik Politikası, üniversite ve yurt değerlendirmeleri yapılan platformumuzda hangi verilerin hangi amaçlarla işlendiğini ve nasıl korunduğunu açıklamak amacıyla hazırlanmıştır.
                        </p>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Veri sorumlusu sıfatıyla bize her türlü soru, talep ve başvurunuz için resmi iletişim adresimiz olan <a href="mailto:destek@kampussesi.com" class="text-cyan-400 hover:underline font-medium">destek@kampussesi.com</a> üzerinden ulaşabilirsiniz.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="database" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">2. İşlenen Kişisel Veriler ve Toplama Yöntemleri</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Platformumuza üye olurken, üniversite veya yurt değerlendirmesi paylaşırken ya da iletişim formunu kullanırken elektronik ortamda otomatik veya kısmen otomatik yöntemlerle şu verileriniz işlenmektedir:
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-2">
                            <strong>Kimlik ve İletişim Verileri:</strong> Kayıt sırasında beyan ettiğiniz ad-soyad (veya tercih ettiğiniz kullanıcı rumuzu) ve e-posta adresiniz.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-2">
                            <strong>İşlem Güvenliği ve Trafik Verileri:</strong> 5651 sayılı Kanun gereği yasal zorunluluk kapsamında tutulan IP adresi, oturum açma/kapama zaman damgaları ve kriptografik olarak özetlenmiş (hashlenmiş) parola verisi.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            <strong>Kullanıcı İçerik Verileri:</strong> Üniversiteler, kampüsler ve yurtlar hakkında paylaştığınız yorumlar, puanlamalar, blog yazıları ve favori okul tercihleri.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="target" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">3. Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepleri</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Toplanan kişisel verileriniz, KVKK'nın 5. maddesinde belirtilen <em>"bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması"</em>, <em>"veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması"</em> ve <em>"ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaat"</em> hukuki sebeplerine dayanılarak işlenmektedir.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            Verileriniz; kullanıcı hesabınızın oluşturulması ve güvenliğinin sağlanması, sahte/bot yorumların ve spam içeriklerin önlenmesi, 5651 sayılı Kanun kapsamındaki yer sağlayıcı trafik kayıt (log) yükümlülüklerinin yerine getirilmesi ve öğrenci topluluğuna şeffaf bir rehberlik hizmeti sunulması amaçlarıyla sınırlı olarak işlenir.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="user-check" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">4. Öğrenci Mahremiyeti, Anonimlik ve Verilerin Aktarımı</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Değerlendirme yapan öğrencilerimizin e-posta adresleri ve kimlik bilgileri <strong>hiçbir koşulda üniversite yönetimleriyle, özel veya devlet yurt idareleriyle, reklam şirketleriyle ya da ticari üçüncü kişilerle paylaşılmaz ve satılmaz.</strong>
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            Kişisel verileriniz yalnızca Türkiye Cumhuriyeti mahkemeleri, Cumhuriyet Başsavcılıkları veya Bilgi Teknolojileri ve İletişim Kurumu (BTK) tarafından yürütülen resmi bir soruşturma kapsamında ve usulüne uygun bağlayıcı bir yasal talep bulunması halinde yetkili kamu kurum ve kuruluşlarıyla paylaşılabilir.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="lock" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">5. Veri Güvenliği ve Kişisel Verilerin Korunması</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            Kampüs Sesi, KVKK'nın 12. maddesi uyarınca kişisel verilerin hukuka aykırı olarak işlenmesini ve erişilmesini önlemek amacıyla güncel teknik ve idari tedbirleri uygular. Kullanıcı şifreleri veritabanımızda düz metin (plain-text) olarak tutulmaz; endüstri standardı tek yönlü şifreleme (bcrypt/hash) algoritmalarıyla korunur. Kullanıcılar diledikleri zaman yorumlarını veya hesaplarını kalıcı olarak silebilirler.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="mail-check" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">6. İlgili Kişinin Hakları (KVKK Madde 11) ve Başvuru</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            KVKK'nın 11. maddesi uyarınca her kullanıcı; kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını öğrenme, eksik veya yanlış işlenmişse düzeltilmesini isteme ve KVKK'nın 7. maddesi çerçevesinde kişisel verilerinin silinmesini veya yok edilmesini talep etme hakkına sahiptir.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            Bu haklarınıza ilişkin taleplerinizi kayıtlı e-posta adresiniz üzerinden <a href="mailto:destek@kampussesi.com" class="text-cyan-400 hover:underline font-medium">destek@kampussesi.com</a> adresine iletebilirsiniz. Başvurularınız talebin niteliğine göre en kısa sürede ve en geç otuz (30) gün içinde ücretsiz olarak sonuçlandırılır.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    `,

    cerezPolitikasi: `
        <main class="page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen py-16 sm:py-24">
            <!-- Ambient Glow Aydinlatmalari -->
            <div class="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="pointer-events-none absolute top-64 -right-32 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Yasal Sayfalar Arasi Hizli Sekme (Tab) Gecisi -->
                <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
                    <a href="#/gizlilik" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-cyan-500/40 hover:text-white flex items-center gap-2 transition-all">
                        <i data-lucide="shield-check" class="w-4 h-4 text-cyan-400"></i> KVKK ve Gizlilik Politikası
                    </a>
                    <a href="#/cerez-politikasi" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-cyan-400 text-zinc-950 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all">
                        <i data-lucide="cookie" class="w-4 h-4"></i> Çerez (Cookie) Politikası
                    </a>
                    <a href="#/kullanim-sartlari" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-cyan-500/40 hover:text-white flex items-center gap-2 transition-all">
                        <i data-lucide="scale" class="w-4 h-4 text-cyan-400"></i> Kullanıcı Sözleşmesi
                    </a>
                </div>

                <!-- Baslik & Hero -->
                <div class="text-center mb-14">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-5 backdrop-blur-md">
                        <i data-lucide="cookie" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>6698 Sayılı KVKK · Şeffaf Çerez & Yerel Depolama Yönetimi</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        Çerez (Cookie) Politikası
                    </h1>
                    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Kampüs Sesi'nde reklam, yeniden pazarlama veya davranışsal takip çerezleri kullanılmaz; yalnızca güvenli kullanıcı oturumu ve interaktif kampüs haritalarımız (OpenStreetMap) için zorunlu teknik veriler kullanılır.
                    </p>
                </div>

                <!-- Yasal Metin Kartlari (h1, h2, p formatinda) -->
                <div class="space-y-6 legal-document-content">
                    <!-- 1. Çerez ve Yerel Depolama Nedir? -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="info" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">1. Çerez (Cookie) ve Yerel Depolama Nedir?</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Çerezler (cookies) ve modern internet tarayıcılarının yerel depolama birimleri (<code>localStorage</code> ve <code>sessionStorage</code>), ziyaret ettiğiniz internet sitesinin düzgün çalışabilmesi için bilgisayarınıza veya mobil cihazınıza kaydedilen küçük boyutlu teknik metin kayıtlarıdır.
                        </p>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            İşbu Çerez Politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve Kişisel Verileri Koruma Kurumu'nun "Çerez Uygulamaları Hakkında Rehber" ilkeleri doğrultusunda, <strong>Kampüs Sesi</strong> platformunda kullanılan zorunlu teknik depolama unsurlarını şeffaf biçimde açıklamak amacıyla hazırlanmıştır.
                        </p>
                    </div>

                    <!-- 2. Oturum ve Güvenlik İçin Kullanılan Zorunlu Çerezler -->
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="key-round" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">2. Oturum Yönetimi ve Tercihler İçin Kullanılan Zorunlu Veriler</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            KVKK'nın 5. maddesinin 2. fıkrasının (c) ve (f) bentleri uyarınca, bilgi toplumu hizmetlerinin (üyelik girişi, yorum yazma, favori üniversite kaydetme) bizzat kullanıcı tarafından talep edildiği hallerde <strong>"Kesinlikle Zorunlu (Teknik) Çerezler"</strong> açık rıza şartına bağlı olmaksızın çalıştırılmaktadır:
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-2">
                            <strong>Kimlik Doğrulama ve Oturum Anahtarı (JWT Auth Token):</strong> Üye girişi yaptığınızda sayfa yenilense veya sekmeler arasında geçiş yapılsa dahi oturumunuzun güvenli şekilde açık kalmasını sağlayan kriptografik belirteçtir. Oturumu kapattığınızda (Çıkış Yap) cihazınızdan derhal silinir.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-2">
                            <strong>Görünüm ve Tema Tercihi (<code>kampus_sesi_theme</code>):</strong> Platformu karanlık (dark mode) veya aydınlık temada kullanma seçiminizi hatırlayarak her ziyarette göz konforunuzu koruyan teknik kayıttır.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            <strong>Çerez Bilgilendirme Onayı (<code>kampus_sesi_cookie_consent</code>):</strong> Ekranın altında yer alan çerez bilgilendirme bandında "Kabul Et" butonuna tıkladığınızı kaydederek aynı bildirimin her sayfa geçişinde tekrar karşınıza çıkmasını önleyen kayıttır.
                        </p>
                    </div>

                    <!-- 3. Harita Entegrasyonu (OpenStreetMap & Leaflet) Zorunlu Çerezleri -->
                    <div class="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0">
                                <i data-lucide="map-pin" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-cyan-300">3. Harita Entegrasyonu (OpenStreetMap & Leaflet) Zorunlu Çerezleri</h2>
                        </div>
                        <p class="text-zinc-200 text-sm leading-relaxed mb-3">
                            Üniversite yerleşkelerinin ve KYK/özel öğrenci yurtlarının gerçek coğrafi koordinatlarını, kampüs içi binalarını ve ulaşım bağlantılarını interaktif harita üzerinde gösterebilmek amacıyla açık kaynaklı <strong>Leaflet.js</strong> kütüphanesi ve <strong>OpenStreetMap (OSM)</strong> harita katmanı servisleri kullanılmaktadır.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Bir üniversitenin detay sayfasındaki kampüs haritasını görüntülediğinizde, harita karolarının (map tiles) cihazınıza doğru yakınlaştırma (zoom) seviyesinde indirilebilmesi ve akıcı bir harita deneyimi için tarayıcı önbelleğine (cache) alınabilmesi amacıyla tarayıcınız doğrudan OpenStreetMap (<code>tile.openstreetmap.org</code>) sunucularına teknik istek gönderir.
                        </p>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Bu teknik iletişim sırasında cihazınızın IP adresi, tarayıcı üstbilgisi (User-Agent) ve harita önbellek çerezleri yalnızca harita görüntüsünün oluşturulması ve sunucu yükünün dengelenmesi amacıyla kullanılır; <strong>kesinlikle konum takibi (GPS izleme) veya reklam profillemesi yapılmaz.</strong>
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
                <!-- Yasal Sayfalar Arasi Hizli Sekme (Tab) Gecisi -->
                <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
                    <a href="#/gizlilik" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-cyan-500/40 hover:text-white flex items-center gap-2 transition-all">
                        <i data-lucide="shield-check" class="w-4 h-4 text-cyan-400"></i> KVKK ve Gizlilik Politikası
                    </a>
                    <a href="#/cerez-politikasi" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-cyan-500/40 hover:text-white flex items-center gap-2 transition-all">
                        <i data-lucide="cookie" class="w-4 h-4 text-cyan-400"></i> Çerez (Cookie) Politikası
                    </a>
                    <a href="#/kullanim-sartlari" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-cyan-400 text-zinc-950 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all">
                        <i data-lucide="scale" class="w-4 h-4"></i> Kullanıcı Sözleşmesi
                    </a>
                </div>

                <!-- Baslik & Hero -->
                <div class="text-center mb-14">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-5 backdrop-blur-md">
                        <i data-lucide="scale" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>5651 Sayılı Kanun · Yer Sağlayıcı & Uyar-Kaldır</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
                        Kullanıcı Sözleşmesi ve Yer Sağlayıcı Bildirimi
                    </h1>
                    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Kampüs Sesi platformuna erişim sağlayan, üye olan veya yorum paylaşan her kullanıcı ile kurum temsilcileri aşağıdaki yasal koşulları kabul etmiş sayılır.
                    </p>
                </div>

                <!-- Yasal Metin Kartlari (h1, h2, p formatinda) -->
                <div class="space-y-6 legal-document-content">
                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="file-text" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">1. Taraflar, Konu ve Hizmetin Kapsamı</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            İşbu Kullanıcı Sözleşmesi ("Sözleşme"), <strong>Kampüs Sesi</strong> ("Platform") ile siteyi ziyaret eden, üye olan veya içerik (üniversite değerlendirmesi, yurt yorumu, puanlama, blog yazısı) üreten tüm gerçek kişiler ("Kullanıcı") arasında akdedilmiştir. Kampüs Sesi, öğrencilerin yükseköğretim kurumları ve barınma imkanları hakkındaki öznel deneyimlerini paylaştığı bağımsız bir sosyal rehberlik platformudur.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0">
                                <i data-lucide="server" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-cyan-300">2. 5651 Sayılı Kanun Kapsamında "Yer Sağlayıcı" Statüsü</h2>
                        </div>
                        <p class="text-zinc-200 text-sm leading-relaxed mb-3">
                            Kampüs Sesi, <strong>5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun'un 2. ve 5. maddeleri</strong> uyarınca hukuken <strong>"Yer Sağlayıcı" (Hosting/Platform Provider)</strong> sıfatını haizdir.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            5651 sayılı Kanun'un 5. maddesinin 1. fıkrası açık hükmü gereğince; <strong>Yer Sağlayıcı, yer sağladığı içeriği kontrol etmek veya hukuka aykırı bir faaliyetin söz konusu olup olmadığını araştırmakla yükümlü değildir.</strong> Platformda yer alan üniversite, fakülte, kampüs, KYK yurdu veya özel yurt yorumları Kampüs Sesi'nin kurumsal görüşünü yansıtmaz.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="user-check" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">3. Yurt ve Üniversite Yorumlarının Hukuki ve Cezai Sorumluluğu</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Platformda yayınlanan her türlü yorum, eleştiri, puanlama ve metnin <strong>hukuki, cezai ve mali sorumluluğu münhasıran o içeriği oluşturan ve yayınlayan Kullanıcı'ya (İçerik Sağlayıcı'ya) aittir.</strong>
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Kullanıcı; üniversiteler, akademisyenler, devlet yurtları (KYK) veya özel öğrenci yurtları hakkında değerlendirme yaparken Türkiye Cumhuriyeti Anayasası ve Avrupa İnsan Hakları Sözleşmesi ile güvence altına alınan ifade ve eleştiri özgürlüğü sınırları içinde kalmayı; 5237 sayılı Türk Ceza Kanunu anlamında <strong>hakaret (TCK m. 125), iftira (TCK m. 267), tehdit, nefret söylemi, kişilik haklarına saldırı veya gerçeğe aykırı ticari karalama</strong> niteliği taşıyan ifadeler kullanmamayı peşinen kabul ve taahhüt eder.
                        </p>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            Kullanıcılar ayrıca üçüncü kişilere (akademisyen, yurt personeli veya diğer öğrenciler) ait kişisel verileri (telefon numarası, açık ev adresi, özel hayat görüntüleri vb.) yorumlarda paylaşamaz.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                                <i data-lucide="bell-ring" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-amber-300">4. Kurumlar ve İlgili Kişiler İçin "Uyar-Kaldır" (Notice and Take-Down) Sistemi</h2>
                        </div>
                        <p class="text-zinc-200 text-sm leading-relaxed mb-3">
                            Kampüs Sesi, 5651 sayılı Kanun'un 5. maddesinin 2. fıkrası çerçevesinde hukuka saygılı bir platform olarak etkin bir <strong>"Uyar-Kaldır" (Notice and Take-Down)</strong> prosedürü işletmektedir.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Herhangi bir üniversite yönetimi, özel/devlet yurt işletmesi, akademisyen veya gerçek/tüzel kişi; platformda yer alan bir yorumun kişilik haklarını, ticari itibarını veya yürürlükteki mevzuatı ihlal ettiğini düşünüyorsa, doğrudan yargı yoluna başvurmadan önce resmi iletişim adresimiz olan <a href="mailto:destek@kampussesi.com" class="text-cyan-400 hover:underline font-bold">destek@kampussesi.com</a> üzerinden "Uyar-Kaldır" talebinde bulunabilir.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            <strong>Başvuru Usulü:</strong> <a href="mailto:destek@kampussesi.com" class="text-cyan-400 hover:underline">destek@kampussesi.com</a> adresine gönderilecek bildirimde; (1) İhlale konu yorumun bulunduğu sayfa bağlantısı (URL) veya ekran görüntüsü, (2) İçeriğin hangi açıdan hukuka veya kişilik haklarına aykırı olduğunun somut açıklaması ve (3) Başvuran kişinin yetki belgesi veya kimlik teyidi yer almalıdır. Usulüne uygun olarak iletilen bildirimler hukuk ve moderasyon ekibimizce <strong>en geç 24 ila 48 saat içerisinde</strong> incelenir; hukuka aykırılığı tespit edilen içerikler derhal yayından kaldırılır ve başvuru sahibine yazılı bilgi verilir.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="shield" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">5. Moderasyon Yetkisi ve Fikri Mülkiyet Hakları</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed mb-3">
                            Kampüs Sesi, topluluk kurallarına aykırı olan, gizli reklam (spam) içeren veya kişilik haklarını ihlal ettiği değerlendirilen yorumları önceden haber vermeksizin yayından kaldırma, düzenleme veya ilgili kullanıcının üyeliğini askıya alma hakkını saklı tutar.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            Platformun arayüz tasarımı, logosu, veritabanı mimarisi ve özgün yazılım kodları Kampüs Sesi'ne aittir; yazılı izin olmaksızın kopyalanamaz, çoğaltılamaz veya otomatik botlarla (scraping) çekilemez.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i data-lucide="gavel" class="w-5 h-5"></i>
                            </div>
                            <h2 class="text-xl font-bold text-white">6. Yürürlük ve Uyuşmazlıkların Çözümü</h2>
                        </div>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            Kullanıcı, üyelik kayıt formundaki onay kutusunu işaretleyerek veya platformu kullanarak işbu Sözleşme hükümlerini okuduğunu ve kabul ettiğini beyan eder. İşbu Sözleşme'den doğabilecek her türlü hukuki uyuşmazlıkta Türkiye Cumhuriyeti kanunları uygulanır. Her türlü bildirim ve yasal iletişim için resmi adresimiz <a href="mailto:destek@kampussesi.com" class="text-cyan-400 hover:underline font-medium">destek@kampussesi.com</a>'dur.
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