/* ========================================
   Kampüs Sesi — Page HTML Templates (SPA)
   ======================================== */

export const TEMPLATES = {
    home: `
        <main class="home page-view relative bg-zinc-950 text-zinc-100 overflow-hidden min-h-screen">

            <!-- Ambient Glow Aydınlatmaları (Köşelerden vuran ferah, yumuşak cyan ve gece mavisi gradientler) -->
            <div class="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-cyan-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="pointer-events-none absolute top-10 -right-32 w-[32rem] h-[32rem] bg-indigo-600/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="pointer-events-none absolute top-64 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-cyan-400/[0.04] rounded-full blur-3xl" aria-hidden="true"></div>

            <!-- Hero & Arama Alanı (Adım 1) -->
            <section class="home-hero-centered relative z-10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
                
                <!-- Üst Rozet (Badge) -->
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/10 text-cyan-300 mb-6 backdrop-blur-md shadow-sm">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5 text-cyan-400"></i>
                    <span>Türkiye'nin İlk Şeffaf Öğrenci ve Kampüs Ağı</span>
                </div>

                <!-- Ana Başlık (Typography) -->
                <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight" style="font-family: var(--font-heading);">
                    Kampüsün <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">Gerçek Sesine</span> Kulak Ver
                </h1>

                <!-- Alt Açıklama -->
                <p class="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                    Broşürlerdeki süslü reklamları değil; amfilerde sabahlayan, yurtlarda kalan ve yemekhaneyi deneyimleyen öğrencilerin sansürsüz yorumlarını keşfet.
                </p>

                <!-- Cam Efektli Geniş Arama Çubuğu (Glassmorphism Search Bar) -->
                <div class="hero-centered__search-wrapper relative max-w-2xl mx-auto mb-6">
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
            </section>

            <!-- Minimalist Features Section -->
            <section class="home-features container reveal-up" style="padding-bottom: var(--space-xl); position: relative; z-index: 10;">
                <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-lg);">
                    <div class="feature-card minimal-card" style="background: var(--color-bg-card); padding: var(--space-xl) var(--space-lg); border-radius: var(--radius-lg); border: 1px solid var(--color-border); text-align: center; transition: all 0.3s ease;">
                        <div class="feature-icon" style="color: var(--color-accent); font-size: 2rem; margin-bottom: var(--space-sm);"><i data-lucide="shield-check" style="width: 40px; height: 40px;"></i></div>
                        <h3 class="feature-title" style="margin-bottom: var(--space-xs); font-family: var(--font-heading); font-size: 1.25rem;">Doğrulanmış Deneyimler</h3>
                        <p class="feature-desc" style="color: var(--color-text-muted); font-size: 0.95rem;">Şeffaflığı ön planda tutarak, kampüs yaşamını birinci ağızdan, dürüst yorumlarla sunuyoruz.</p>
                    </div>
                    <div class="feature-card minimal-card" style="background: var(--color-bg-card); padding: var(--space-xl) var(--space-lg); border-radius: var(--radius-lg); border: 1px solid var(--color-border); text-align: center; transition: all 0.3s ease;">
                        <div class="feature-icon" style="color: var(--color-accent-2); font-size: 2rem; margin-bottom: var(--space-sm);"><i data-lucide="git-compare-arrows" style="width: 40px; height: 40px;"></i></div>
                        <h3 class="feature-title" style="margin-bottom: var(--space-xs); font-family: var(--font-heading); font-size: 1.25rem;">Akıllı Karşılaştırma</h3>
                        <p class="feature-desc" style="color: var(--color-text-muted); font-size: 0.95rem;">Birden fazla üniversiteyi akademik, sosyal ve ulaşım gibi temel metriklerde yan yana kıyaslayın.</p>
                    </div>
                    <div class="feature-card minimal-card" style="background: var(--color-bg-card); padding: var(--space-xl) var(--space-lg); border-radius: var(--radius-lg); border: 1px solid var(--color-border); text-align: center; transition: all 0.3s ease;">
                        <div class="feature-icon" style="color: var(--color-success); font-size: 2rem; margin-bottom: var(--space-sm);"><i data-lucide="network" style="width: 40px; height: 40px;"></i></div>
                        <h3 class="feature-title" style="margin-bottom: var(--space-xs); font-family: var(--font-heading); font-size: 1.25rem;">Topluluk Ağı</h3>
                        <p class="feature-desc" style="color: var(--color-text-muted); font-size: 0.95rem;">Bölümünüzdeki veya hedeflediğiniz üniversitedeki kişilerle iletişim kurun, sorularınızı yöneltin.</p>
                    </div>
                </div>
            </section>

            <!-- Minimalist Blog Section -->
            <section class="home-blog container reveal-up" style="padding-bottom: var(--space-2xl); position: relative; z-index: 10;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-lg);">
                    <h2 class="section-title" style="margin-bottom: 0;">Son <span>İçerikler</span></h2>
                    <a href="#/home" style="color: var(--color-accent); font-weight: 500; font-size: 0.9rem; display: flex; align-items: center; gap: 4px;">Tümünü Gör <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i></a>
                </div>
                <div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-lg);">
                    <!-- Intro Blog 1 -->
                    <article class="blog-card minimal-card" style="background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); padding: var(--space-lg); transition: all 0.3s ease; display: flex; flex-direction: column;">
                        <span style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-xs);">Hakkımızda</span>
                        <h3 style="font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: var(--space-sm); color: var(--color-text); line-height: 1.4;">Kampüs Sesi Nedir?</h3>
                        <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: var(--space-md); flex: 1; line-height: 1.6;">Üniversitelerin resmi broşürlerindeki süslü lafları değil, orada okuyan öğrencilerin filtreden geçmemiş gerçek deneyimlerini paylaştığı özgür platformdur.</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: var(--space-sm); margin-top: auto;">
                            <a href="#/about" style="font-size: 0.8rem; font-weight: 500; color: var(--color-text);">Detaylar &rarr;</a>
                        </div>
                    </article>

                    <!-- Intro Blog 2 -->
                    <article class="blog-card minimal-card" style="background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); padding: var(--space-lg); transition: all 0.3s ease; display: flex; flex-direction: column;">
                        <span style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-xs);">Kullanım Rehberi</span>
                        <h3 style="font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: var(--space-sm); color: var(--color-text); line-height: 1.4;">Karşılaştırma Aracı</h3>
                        <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: var(--space-md); flex: 1; line-height: 1.6;">İki üniversite arasında mı kaldın? Şehir, yemekhane, ulaşım ve yurt olanaklarını tek ekranda yan yana koyarak en doğru seçimi yapmanı sağlar.</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: var(--space-sm); margin-top: auto;">
                            <a href="#/compare" style="font-size: 0.8rem; font-weight: 500; color: var(--color-text);">Nasıl Kullanılır? &rarr;</a>
                        </div>
                    </article>

                    <!-- Intro Blog 3 -->
                    <article class="blog-card minimal-card" style="background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); padding: var(--space-lg); transition: all 0.3s ease; display: flex; flex-direction: column;">
                        <span style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-xs);">Topluluk</span>
                        <h3 style="font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: var(--space-sm); color: var(--color-text); line-height: 1.4;">Nasıl Katkı Sağlarsın?</h3>
                        <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: var(--space-md); flex: 1; line-height: 1.6;">Kendi kampüsündeki iyi ve kötü yanları paylaşarak tercih dönemindeki adaylara yol gösterebilirsin. Üstelik tamamen anonim olarak yorum yapabilirsin.</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: var(--space-sm); margin-top: auto;">
                            <a href="#/review-form" style="font-size: 0.8rem; font-weight: 500; color: var(--color-text);">Yorum Yaz &rarr;</a>
                        </div>
                    </article>
                </div>
            </section>
            
            <!-- Compact FAQ Section (Interactive) -->
            <section class="home-faq container" style="max-width: 600px; padding-top: var(--space-lg); padding-bottom: var(--space-xl);">
                <h2 class="section-title" style="text-align: center; margin-bottom: var(--space-lg);">Merak Edilenler 🧐</h2>
                <div class="faq-accordion-list" style="display: flex; flex-direction: column; gap: var(--space-sm);">
                    <details class="faq-details">
                        <summary class="faq-summary">
                            <span>Üye olmak şart mı?</span>
                            <i data-lucide="plus" class="faq-icon"></i>
                        </summary>
                        <div class="faq-content">
                            <p>Okumak bedava! Ama "şu hocanın sınavları çok zor" diye isyan edeceksen veya soru soracaksan üye olman lazım ki trolleri uzak tutalım.</p>
                        </div>
                    </details>
                    <details class="faq-details">
                        <summary class="faq-summary">
                            <span>Üniversitelerin bilgileri güncel mi?</span>
                            <i data-lucide="plus" class="faq-icon"></i>
                        </summary>
                        <div class="faq-content">
                            <p>Her şeyi olabildiğince güncel tutmaya çalışıyoruz. Yurtlar, ulaşım falan hepsi sistemde var ama en iyi güncellemeyi yorumlarda okursun.</p>
                        </div>
                    </details>
                    <details class="faq-details">
                        <summary class="faq-summary">
                            <span>Puanlamalar neye göre yapılıyor?</span>
                            <i data-lucide="plus" class="faq-icon"></i>
                        </summary>
                        <div class="faq-content">
                            <p>Bizzat sizlerin oylarıyla! Eğitim, sosyallik, yemekler ... Herkesin notunun şeffaf ortalamasını alıp sıralıyoruz.</p>
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
                    <p class="profile-hero__subtitle" id="uni-hero-subtitle">📍 Balıkesir, Türkiye</p>
                    <a href="#" id="uni-website-btn" target="_blank" rel="noopener noreferrer"
                        class="btn btn--outline profile-hero__btn">
                        📍 Resmi Web Sitesine Git
                    </a>
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
                                <a href="#/review-form" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-zinc-950 font-bold hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]">
                                    <i data-lucide="send" class="w-4 h-4"></i> Yazı Gönder
                                </a>
                                <a href="#/about" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-all text-sm font-semibold">
                                    Yayın İlkeleri <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
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
    `};