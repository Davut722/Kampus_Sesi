/* ========================================
   Kampüs Sesi — Page HTML Templates (SPA)
   ======================================== */

export const TEMPLATES = {
    home: `
        <main id="hm-root" class="home page-view ed-home hm">

            <!-- 1. Hero: başlık + arama solda; harita ve rakamlar sağda -->
            <section class="ed-hero">
                <div class="ed-hero__grid">

                    <div class="ed-hero__main">
                        <p class="ed-kicker" data-anim="fade-in">Öğrenci yorumlarıyla üniversite rehberi</p>

                        <h1 data-anim="fade-up" class="ed-hero__title">
                            Kampüsün <em>gerçek sesine</em> kulak ver
                        </h1>

                        <p data-anim="fade-up" data-anim-delay="80" class="ed-hero__lead">
                            Üniversiteleri ve kampüs hayatını, orada okuyan öğrencilerin yorumlarıyla keşfet.
                        </p>

                        <div data-anim="fade-up" data-anim-delay="140" class="ed-search">
                            <i data-lucide="search" class="ed-search__icon"></i>
                            <input
                                type="text"
                                id="hero-search-input"
                                class="ed-search__input"
                                placeholder="Üniversite, şehir veya bölüm ara (örn. İTÜ Bilgisayar)..."
                                autocomplete="off"
                            >
                            <button type="button" id="hero-search-btn" class="ed-search__btn">
                                <span>Keşfet</span>
                                <i data-lucide="arrow-right" class="ed-search__arrow"></i>
                            </button>
                        </div>

                        <div data-anim="fade-up" data-anim-delay="200" class="ed-popular">
                            <span class="ed-popular__label">Sık aranan</span>
                            <button class="hero-tag-pill" data-uni="İstanbul Teknik Üniversitesi">İTÜ</button>
                            <button class="hero-tag-pill" data-uni="Orta Doğu Teknik Üniversitesi (ODTÜ)">ODTÜ</button>
                            <button class="hero-tag-pill" data-uni="Boğaziçi Üniversitesi">Boğaziçi</button>
                            <button class="hero-tag-pill" data-uni="Hacettepe Üniversitesi">Hacettepe</button>
                            <button class="hero-tag-pill" data-uni="Yıldız Teknik Üniversitesi (YTÜ)">YTÜ</button>
                            <button class="hero-tag-pill" data-uni="Koç Üniversitesi">Koç</button>
                        </div>
                    </div>

                    <aside class="ed-hero__side" data-anim="fade-in" data-anim-delay="120" aria-label="Kampüs Sesi rakamlarla">
                        <figure class="ed-map">
                            <div class="ed-map__stage">
                                <svg id="hm-map-svg" class="ed-map__svg" viewBox="0 22 560 268" role="group" aria-label="Üniversite yerleşkelerinin Türkiye haritasındaki konumları"></svg>
                            </div>
                            <div id="hm-tip" class="hm-tip-slot" aria-live="polite">
                                <div class="hm-tip-slot__idle">
                                    <span class="hm-tip-slot__icon"><i data-lucide="map-pin" class="icon-xs"></i></span>
                                    <span>Her nokta bir yerleşke. Koyu noktalar yorum almış okullar; üzerine gel ya da tıkla.</span>
                                </div>
                            </div>
                        </figure>
                        <dl id="hm-facts" class="ed-facts"></dl>
                    </aside>

                </div>
            </section>

            <!-- 2. Son yorumlar şeridi -->
            <section class="ed-section hm-section" aria-labelledby="hm-h-reviews">
                <header class="ed-section__head ed-section__head--split" data-anim="fade-up">
                    <h2 id="hm-h-reviews" class="ed-section__title">Son yorumlar</h2>
                    <span class="hm-note">En yeniden eskiye, öğrencilerden</span>
                </header>
                <div id="hm-reviews" class="hm-reviews" data-anim="fade-in" aria-live="polite"></div>
            </section>

            <!-- 3. Öne çıkan üniversiteler -->
            <section class="ed-section hm-section" aria-labelledby="hm-h-featured">
                <header class="ed-section__head" data-anim="fade-up">
                    <h2 id="hm-h-featured" class="ed-section__title">Öne çıkan üniversiteler</h2>
                </header>
                <div id="hm-tabs" class="hm-tabs" role="tablist" aria-label="Kritere göre sırala" data-anim="fade-up">
                    <button type="button" role="tab" class="hm-tab" data-tab="genel" aria-selected="true">Genel</button>
                    <button type="button" role="tab" class="hm-tab" data-tab="yurt" aria-selected="false">Yurt</button>
                    <button type="button" role="tab" class="hm-tab" data-tab="yemekhane" aria-selected="false">Yemekhane</button>
                    <button type="button" role="tab" class="hm-tab" data-tab="ulasim" aria-selected="false">Ulaşım</button>
                </div>
                <div id="hm-featured" class="hm-featured" aria-live="polite"></div>
                <p class="hm-foot">Sıralama, yorum sayısı az olan okulların puanını genel ortalamaya yaklaştıran ağırlıklı ortalamayla yapılır.</p>
            </section>

            <!-- 4. Şehirlere göz at -->
            <section class="ed-section hm-section" aria-labelledby="hm-h-cities">
                <header class="ed-section__head ed-section__head--split" data-anim="fade-up">
                    <h2 id="hm-h-cities" class="ed-section__title">Şehirlere göz at</h2>
                    <a href="#/cities" class="ed-link">Tüm şehirler <span aria-hidden="true">&rarr;</span></a>
                </header>
                <div id="hm-cities"></div>
            </section>

            <!-- 5. Karşılaştırma önizlemesi -->
            <section class="ed-section hm-section" aria-labelledby="hm-h-compare">
                <header class="ed-section__head" data-anim="fade-up">
                    <h2 id="hm-h-compare" class="ed-section__title">İki üniversiteyi yan yana koy</h2>
                </header>
                <div class="hm-compare" data-anim="fade-up">
                    <div class="hm-cmp">
                        <label class="hm-cmp__label">Birinci üniversite</label>
                        <div class="custom-select" id="hm-custom-select-0">
                            <div class="custom-select__trigger" tabindex="0">
                                <span class="custom-select__text">1. Üniversiteyi seçin...</span>
                                <span class="custom-select__icon">▼</span>
                            </div>
                            <div class="custom-select__dropdown">
                                <input type="text" class="custom-select__search" placeholder="Üniversite ara...">
                                <ul class="custom-select__options"></ul>
                            </div>
                        </div>
                        <div id="hm-cmp-rows-0" class="hm-cmp__rows"></div>
                    </div>
                    <div class="hm-cmp">
                        <label class="hm-cmp__label">İkinci üniversite</label>
                        <div class="custom-select" id="hm-custom-select-1">
                            <div class="custom-select__trigger" tabindex="0">
                                <span class="custom-select__text">2. Üniversiteyi seçin...</span>
                                <span class="custom-select__icon">▼</span>
                            </div>
                            <div class="custom-select__dropdown">
                                <input type="text" class="custom-select__search" placeholder="Üniversite ara...">
                                <ul class="custom-select__options"></ul>
                            </div>
                        </div>
                        <div id="hm-cmp-rows-1" class="hm-cmp__rows"></div>
                    </div>
                </div>
                <div class="hm-compare__foot">
                    <p id="hm-cmp-note" class="hm-foot"></p>
                    <a href="#/compare" class="btn btn--primary">Kendi karşılaştırmanı yap <i data-lucide="arrow-right" class="icon-sm"></i></a>
                </div>
            </section>

            <!-- 6. Katkı çağrısı -->
            <section class="ed-section hm-section">
                <div class="hm-contribute" data-anim="fade-up">
                    <p class="hm-contribute__text">Okuduğun okulu bir cümleyle anlat; seçim yapacak biri için fark yaratır.</p>
                    <a href="#/review-form" class="btn btn--primary">Yorum yaz</a>
                </div>
            </section>

            <!-- 7a. Platform: tek ince şerit -->
            <section class="ed-section hm-section">
                <ul class="hm-strip" data-anim="fade-up">
                    <li><strong>Doğrulanmış deneyimler</strong><span>Kampüs yaşamını birinci ağızdan, sansürsüz öğrenci yorumlarıyla sunuyoruz.</span></li>
                    <li><strong>Akıllı karşılaştırma</strong><span>Üniversiteleri yurt, ulaşım ve yemekhane gibi kriterlerde yan yana kıyasla.</span></li>
                    <li><strong>Topluluk ağı</strong><span>Hedeflediğin okuldaki kıdemli öğrencilere sorularını yönelt.</span></li>
                </ul>
            </section>

            <!-- 7b. Uzun açıklamalar ve SSS: sayfanın en altında, daraltılmış -->
            <section class="ed-section ed-section--faq">
                <header class="ed-faq__head" data-anim="fade-up">
                    <h2 class="ed-section__title">Platform ve sık sorulanlar</h2>
                    <p class="ed-faq__note">Başlıklara tıklayarak ayrıntıları aç.</p>
                </header>

                <div class="ed-faq__list">
                    <details class="faq-details">
                        <summary class="faq-summary"><span>Kampüs Sesi nedir?</span><i data-lucide="plus" class="faq-icon"></i></summary>
                        <div class="faq-content"><p>Üniversitelerin resmi broşürlerindeki süslü lafları değil, orada okuyan öğrencilerin filtreden geçmemiş gerçek deneyimlerini paylaştığı özgür platformdur.</p></div>
                    </details>
                    <details class="faq-details">
                        <summary class="faq-summary"><span>Karşılaştırma aracı nasıl çalışır?</span><i data-lucide="plus" class="faq-icon"></i></summary>
                        <div class="faq-content"><p>İki üniversite arasında mı kaldın? Şehir, yemekhane, ulaşım ve yurt olanaklarını tek ekranda yan yana koyarak en doğru seçimi yapmanı sağlar.</p></div>
                    </details>
                    <details class="faq-details">
                        <summary class="faq-summary"><span>Nasıl katkı sağlarsın?</span><i data-lucide="plus" class="faq-icon"></i></summary>
                        <div class="faq-content"><p>Kendi kampüsündeki iyi ve kötü yanları paylaşarak tercih dönemindeki adaylara yol gösterebilirsin. Üstelik tamamen anonim olarak yorum yapabilirsin.</p></div>
                    </details>
                    <details class="faq-details">
                        <summary class="faq-summary"><span>Üye olmak şart mı?</span><i data-lucide="plus" class="faq-icon"></i></summary>
                        <div class="faq-content"><p>Yorumları okumak ve üniversiteleri incelemek tamamen ücretsiz ve anonimdir. Kendi okulunuz hakkında yorum yazmak veya soru sormak istediğinizde spam'ı önlemek için üye girişi yapmanız yeterlidir.</p></div>
                    </details>
                    <details class="faq-details">
                        <summary class="faq-summary"><span>Üniversite ve yurt bilgileri ne sıklıkla güncellenir?</span><i data-lucide="plus" class="faq-icon"></i></summary>
                        <div class="faq-content"><p>Tüm resmi veriler dönem başlarında güncellenir; ayrıca bizzat o okulda okuyan öğrencilerin canlı yorumlarıyla en taze bilgilere anında ulaşırsınız.</p></div>
                    </details>
                    <details class="faq-details">
                        <summary class="faq-summary"><span>Puanlamalar ve sıralamalar nasıl hesaplanıyor?</span><i data-lucide="plus" class="faq-icon"></i></summary>
                        <div class="faq-content"><p>Eğitim, kampüs olanakları, yemekhane kalitesi, sosyallik ve yurt şartları gibi temel metriklerde öğrencilerin verdiği oyların şeffaf ağırlıklı ortalamasıyla listelenir.</p></div>
                    </details>
                </div>
            </section>

        </main>
    `,

    university: `
        <main class="container page-view uni-page-view">
            <!-- 1. Breadcrumb & University Search Combobox -->
            <div class="uni-top-bar">
                <nav class="ed-breadcrumb" aria-label="Sayfa Konumu">
                    <a href="#/home" class="ed-breadcrumb__link">Ana Sayfa</a>
                    <span class="ed-breadcrumb__sep">/</span>
                    <a href="#/ranking" class="ed-breadcrumb__link">Üniversiteler</a>
                    <span class="ed-breadcrumb__sep">/</span>
                    <span class="ed-breadcrumb__text" id="uni-bc-city">Balıkesir</span>
                    <span class="ed-breadcrumb__sep">/</span>
                    <span class="ed-breadcrumb__current" id="uni-bc-name">Bandırma Onyedi Eylül Üniversitesi</span>
                </nav>

                <div class="uni-search-combobox" id="uni-search-combobox">
                    <div class="uni-search-combobox__input-wrap">
                        <i data-lucide="search" class="icon-xs uni-search-combobox__icon"></i>
                        <input type="text"
                               id="uni-combobox-input"
                               class="uni-search-combobox__input"
                               placeholder="Başka üniversite ara... (örn. ODTÜ, İTÜ, Boğaziçi)"
                               autocomplete="off"
                               role="combobox"
                               aria-expanded="false"
                               aria-autocomplete="list"
                               aria-controls="uni-combobox-listbox"
                               aria-label="Başka üniversite ara">
                        <button type="button" class="uni-search-combobox__clear" id="uni-combobox-clear" aria-label="Aramayı temizle" style="display: none;">
                            <i data-lucide="x" class="icon-xs"></i>
                        </button>
                    </div>
                    <ul id="uni-combobox-listbox"
                        class="uni-search-combobox__dropdown"
                        role="listbox"
                        style="display: none;">
                    </ul>
                </div>
            </div>

            <!-- 2. Hero Card -->
            <header class="ed-uni-hero" id="uni-hero">
                <div class="ed-uni-hero__main">
                    <div class="ed-uni-hero__logo-box">
                        <img id="hero-img" class="ed-uni-hero__logo"
                            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2070"
                            alt="Üniversite Logosu">
                    </div>
                    <div class="ed-uni-hero__header-info">
                        <div class="ed-uni-hero__meta-chips">
                            <span class="ed-chip" id="uni-hero-type">Devlet Üniversitesi</span>
                            <span class="ed-chip" id="uni-hero-city-chip"><i data-lucide="map-pin" class="icon-xs"></i> <span id="uni-hero-city">Balıkesir</span></span>
                            <span class="ed-chip" id="uni-hero-year-chip"><i data-lucide="calendar" class="icon-xs"></i> <span id="uni-hero-year">Kuruluş: 2015</span></span>
                        </div>
                        <h1 class="ed-uni-hero__title" id="uni-hero-title">Bandırma Onyedi Eylül Üniversitesi</h1>
                        <p class="ed-uni-hero__subtitle" id="uni-hero-subtitle" style="display:none;"></p>

                        <!-- Puan ve Tavsiye Bloğu -->
                        <div class="ed-uni-hero__score-row">
                            <div class="ed-uni-hero__rating-badge">
                                <span class="ed-uni-hero__avg" id="stat-avg">—</span>
                                <div class="ed-uni-hero__stars-col">
                                    <div class="ed-uni-hero__stars" id="hero-stars-display">★★★★★</div>
                                    <span class="ed-uni-hero__rev-count" id="stat-count-label"><span id="stat-count">0</span> değerlendirme</span>
                                </div>
                            </div>
                            <div class="ed-uni-hero__low-badge" id="hero-low-reviews-note" style="display: none;">
                                <i data-lucide="info" class="icon-xs"></i>
                                <span>Az sayıda yoruma dayanır</span>
                            </div>
                            <div class="ed-uni-hero__rank-badge" id="stat-rank-badge" style="display: none;">
                                <i data-lucide="award" class="icon-xs"></i>
                                <span id="stat-rank">Top 3</span>
                            </div>
                        </div>

                        <!-- Butonlar -->
                        <div class="ed-uni-hero__actions">
                            <a href="#/review-form" id="uni-add-review-btn" class="btn btn--primary">
                                <i data-lucide="edit-3" class="icon-sm"></i> Yorum Yaz
                            </a>
                            <a href="#/compare" id="uni-compare-btn" class="btn btn--outline">
                                <i data-lucide="git-compare" class="icon-sm"></i> Karşılaştır
                            </a>
                            <button id="uni-fav-btn" class="btn btn--outline" type="button">
                                <i data-lucide="heart" id="uni-fav-icon" class="icon-sm"></i> <span id="uni-fav-text">Favorilere Ekle</span>
                            </button>
                            <a href="#" id="uni-website-btn" target="_blank" rel="noopener noreferrer" class="btn btn--outline">
                                <i data-lucide="globe" class="icon-sm"></i> Resmi Web Sitesi
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <!-- 3. Yapışkan Sekme Menüsü (Sticky Tabs) -->
            <nav class="ed-uni-tabs" id="uni-sticky-tabs" aria-label="Üniversite Sayfa Bölümleri">
                <div class="ed-uni-tabs__inner">
                    <button type="button" class="ed-uni-tab active" data-target="sec-genel">Genel</button>
                    <button type="button" class="ed-uni-tab" data-target="sec-yorumlar">Yorumlar <span class="tab-badge" id="tab-reviews-count">0</span></button>
                    <button type="button" class="ed-uni-tab" data-target="sec-yurtlar">Yurtlar <span class="tab-badge" id="tab-dorms-count">0</span></button>
                    <button type="button" class="ed-uni-tab" data-target="sec-ulasim">Ulaşım & Harita</button>
                </div>
            </nav>

            <!-- 4. İki Sütunlu Sayfa Düzeni (2/3 Ana İçerik, 1/3 Yapışkan Yan Panel) -->
            <div class="uni-detail-layout">
                <!-- Sol / Ana Sütun -->
                <div class="uni-detail-main">
                    <!-- BÖLÜM 1: GENEL -->
                    <section class="profile-section uni-section" id="sec-genel">
                        <div class="ed-section__head">
                            <p class="ed-kicker">Genel Bakış</p>
                            <h2 class="ed-section__title">Üniversite Hakkında</h2>
                        </div>
                        <div class="profile-card about-card ed-card">
                            <div class="profile-card__content about-content">
                                <p id="about-text-short">Yükleniyor...</p>
                                <div class="about-content__extended" id="about-extended">
                                    <p id="about-text-long"></p>
                                </div>
                            </div>
                            <button class="btn btn--text about-toggle-btn" id="about-toggle-btn" type="button" style="display: none;">
                                Daha Fazla Oku <i data-lucide="chevron-down" class="icon-sm"></i>
                            </button>
                        </div>
                    </section>

                    <!-- BÖLÜM 2: YORUMLAR -->
                    <section class="profile-section uni-section" id="sec-yorumlar">
                        <div class="ed-section__head uni-reviews-head">
                            <div>
                                <p class="ed-kicker">Öğrenci Deneyimleri</p>
                                <h2 class="ed-section__title">Değerlendirmeler (<span id="reviews-header-count">0</span>)</h2>
                            </div>
                            <div class="uni-reviews-sort">
                                <label for="reviews-sort-select" class="uni-sort-label"><i data-lucide="arrow-down-up" class="icon-xs"></i> Sırala:</label>
                                <select id="reviews-sort-select" class="ed-select">
                                    <option value="newest">En Yeni</option>
                                    <option value="helpful">En Faydalı</option>
                                    <option value="highest">En Yüksek Puan</option>
                                    <option value="lowest">En Düşük Puan</option>
                                </select>
                            </div>
                        </div>

                        <!-- Filtre Etiketleri (Konu başlıkları ve yanlarında yorum sayıları) -->
                        <div class="filter-bar ed-filter-bar" id="filter-bar"></div>

                        <!-- Yorum Kartları -->
                        <div id="reviews-container" class="ed-reviews-list" data-stagger="80"></div>
                    </section>

                    <!-- BÖLÜM 3: YURTLAR -->
                    <section class="profile-section uni-section" id="sec-yurtlar">
                        <div class="ed-section__head uni-dorms-head">
                            <div>
                                <p class="ed-kicker">Barınma Olanakları</p>
                                <h2 class="ed-section__title">Çevredeki Yurtlar (KYK & Özel)</h2>
                                <p class="section-desc">Kampüse en yakın devlet ve özel yurt olanakları.</p>
                            </div>
                            <div class="dorm-filter-chips" id="dorm-filter-chips">
                                <button type="button" class="dorm-chip active" data-type="all">Tümü</button>
                                <button type="button" class="dorm-chip" data-type="Kız">Kız</button>
                                <button type="button" class="dorm-chip" data-type="Erkek">Erkek</button>
                                <button type="button" class="dorm-chip" data-type="Karma">Karma</button>
                            </div>
                        </div>

                        <div id="kyk-grid" data-stagger="80" class="kyk-grid ed-kyk-grid"></div>

                        <div class="dorm-expand-wrap" id="dorm-expand-wrap" style="display: none; margin-top: 16px; text-align: center;">
                            <button type="button" class="btn btn--outline" id="dorms-expand-btn">
                                Tümünü Gör (<span id="dorms-total-count">0</span>)
                            </button>
                        </div>
                    </section>

                    <!-- BÖLÜM 5: ULAŞIM & CANLI HARİTA -->
                    <section class="profile-section uni-section" id="sec-ulasim">
                        <div class="ed-section__head">
                            <p class="ed-kicker">Lokasyon & Ulaşım</p>
                            <h2 class="ed-section__title">Ulaşım ve Kampüs Haritası</h2>
                            <p class="section-desc">Şehir içi ve çevre illerden ulaşım güzergâhları ile interaktif yerleşke haritası.</p>
                        </div>

                        <!-- Ulaşım Hatları Kartları -->
                        <div class="transport-grid" id="transport-grid" data-stagger="80"></div>

                        <!-- Daraltılmış / Genişletilebilir Canlı Leaflet Haritası -->
                        <div class="campus-map-collapsible-wrapper">
                            <div class="campus-map-toggle-bar">
                                <button type="button" class="btn btn--outline campus-map-toggle-btn" id="btn-toggle-campus-map">
                                    <i data-lucide="map" class="icon-sm"></i>
                                    <span id="btn-toggle-campus-map-text">Canlı Kampüs Haritasını Göster</span>
                                </button>
                            </div>

                            <div class="campus-map-wrapper is-collapsed" id="campus-map-wrapper" style="display: none;">
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

                                    <div class="campus-map-zoom-hint" id="campus-map-zoom-hint" aria-live="polite">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="5" y="2" width="14" height="20" rx="7"/>
                                            <path d="M12 6v4"/>
                                        </svg>
                                        <span>Zoom için <kbd>Ctrl</kbd> + <kbd>Scroll</kbd></span>
                                    </div>

                                    <div class="campus-map-edge-card" id="campus-map-edge-card">
                                        <div class="campus-map-edge-card__popover">
                                            <span class="map-popup__badge">Canlı Kampüs Konumu</span>
                                            <h4 class="campus-map-edge-card__title" id="campus-map-edge-title">Bandırma Onyedi Eylül Üniversitesi</h4>
                                            <p class="campus-map-edge-card__desc" id="campus-map-edge-desc">Ana yerleşke ve çevre ulaşım bağlantıları.</p>
                                        </div>
                                        <a href="https://www.google.com/maps?q=40.3414,27.9344" target="_blank" rel="noopener noreferrer" class="map-popup__btn" id="campus-map-gmaps-btn">
                                            <i data-lucide="map-pin" class="icon-xs"></i>
                                            <span>Google Haritalar'da Aç</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Sağ / Yapışkan Yan Panel (1/3) -->
                <aside class="uni-detail-sidebar">
                    <div class="uni-sticky-panel">
                        <!-- Kriter Puanları İlerleme Çubukları -->
                        <div class="uni-sidebar-card">
                            <h3 class="uni-sidebar-card__title">
                                <i data-lucide="bar-chart-2" class="icon-sm"></i> Kriter Puanları
                            </h3>
                            <div class="uni-criteria-list" id="uni-criteria-list">
                                <!-- Dinamik doldurulacak -->
                            </div>
                        </div>

                        <!-- Hızlı Yorum Yaz CTA -->
                        <div class="uni-sidebar-card uni-sidebar-card--cta">
                            <h4 class="uni-sidebar-card__sub">Bu okulda okudun mu?</h4>
                            <p class="uni-sidebar-card__p">Deneyimlerin yeni üniversite adaylarının en önemli rehberidir.</p>
                            <a href="#/review-form" id="sidebar-add-review-btn" class="btn btn--primary btn--full">
                                <i data-lucide="edit-3" class="icon-sm"></i> Yorum Yaz
                            </a>
                        </div>

                        <!-- Küçük Harita Önizlemesi -->
                        <div class="uni-sidebar-card uni-sidebar-card--map">
                            <div class="uni-sidebar-map-preview">
                                <div class="uni-sidebar-map-preview__pin">
                                    <i data-lucide="map-pin" class="icon-md"></i>
                                </div>
                                <div class="uni-sidebar-map-preview__info">
                                    <div class="uni-sidebar-map-preview__name" id="sidebar-map-uni">Yerleşke Konumu</div>
                                    <div class="uni-sidebar-map-preview__city" id="sidebar-map-city">Harita ve yol tarifleri</div>
                                </div>
                            </div>
                            <button type="button" class="btn btn--outline btn--sm btn--full" id="sidebar-expand-map-btn">
                                <i data-lucide="maximize-2" class="icon-xs"></i> Haritayı Büyüt
                            </button>
                        </div>

                        <!-- Hızlı Bilgiler -->
                        <div class="uni-sidebar-card">
                            <h3 class="uni-sidebar-card__title">
                                <i data-lucide="info" class="icon-sm"></i> Hızlı Bilgiler
                            </h3>
                            <dl class="uni-quick-dl">
                                <dt>Üniversite Türü</dt>
                                <dd id="sidebar-info-type">Devlet Üniversitesi</dd>
                                <dt>Şehir</dt>
                                <dd id="sidebar-info-city">—</dd>
                                <dt>Kuruluş Yılı</dt>
                                <dd id="sidebar-info-year">—</dd>
                                <dt>Resmi Web Sitesi</dt>
                                <dd><a href="#" id="sidebar-info-web" target="_blank" rel="noopener noreferrer">Ziyaret Et ↗</a></dd>
                            </dl>
                        </div>
                    </div>
                </aside>
            </div>

            <!-- Mobilde Sabit (Sticky) Alt Bar -->
            <div class="uni-mobile-cta" id="uni-mobile-cta">
                <div class="uni-mobile-cta__info">
                    <span class="uni-mobile-cta__uni" id="mobile-cta-uni-name">Üniversite</span>
                    <span class="uni-mobile-cta__sub">Deneyimini paylaş, adaylara yol göster</span>
                </div>
                <a href="#/review-form" id="mobile-cta-btn" class="btn btn--primary btn--sm">
                    <i data-lucide="edit-3" class="icon-xs"></i> Yorum Yaz
                </a>
            </div>
        </main>
    `,

    compare: `
        <main class="container page-view compare-page ed-compare">
            <header class="ed-section__head" style="margin-bottom: 2rem;">
                <p class="ed-kicker">Üniversiteleri Kıyasla</p>
                <h1 class="ed-section__title">Üniversite Karşılaştırma Aracı</h1>
                <p class="section-desc" style="color: var(--color-text-muted); margin-top: 8px;">
                    İki farklı üniversiteyi seçerek genel puan durumlarını, yurt, yemekhane, ulaşım, sosyal hayat ve akademik kriterlerini yan yana inceleyin.
                </p>
            </header>

            <div class="compare-container">
                <div class="compare-col" id="compare-col-1" data-anim="slide-left">
                    <label class="hm-cmp__label" style="display:block; margin-bottom: 8px; font-weight: 600;">1. Üniversite</label>
                    <div class="custom-select" id="custom-uni-select-1">
                        <div class="custom-select__trigger" tabindex="0">
                            <span class="custom-select__text">1. Üniversiteyi seçin...</span>
                            <span class="custom-select__icon">▼</span>
                        </div>
                        <div class="custom-select__dropdown">
                            <input type="text" class="custom-select__search" placeholder="Üniversite ara...">
                            <ul class="custom-select__options"></ul>
                        </div>
                    </div>
                    <div id="compare-result-1"></div>
                </div>

                <div class="compare-col" id="compare-col-2" data-anim="slide-right">
                    <label class="hm-cmp__label" style="display:block; margin-bottom: 8px; font-weight: 600;">2. Üniversite</label>
                    <div class="custom-select" id="custom-uni-select-2">
                        <div class="custom-select__trigger" tabindex="0">
                            <span class="custom-select__text">2. Üniversiteyi seçin...</span>
                            <span class="custom-select__icon">▼</span>
                        </div>
                        <div class="custom-select__dropdown">
                            <input type="text" class="custom-select__search" placeholder="Üniversite ara...">
                            <ul class="custom-select__options"></ul>
                        </div>
                    </div>
                    <div id="compare-result-2"></div>
                </div>
            </div>
        </main>
    `,

    reviewForm: `
        <main class="container page-view review-page ed-review-page">
            <header class="rf-header">
                <p class="ed-kicker">Deneyimini Paylaş</p>
                <h1 class="rf-title">Üniversite Değerlendirmesi Yap</h1>
                <p class="rf-subtitle">Okuduğun okulu anlat. Yorumun adaylara yol gösterir.</p>
            </header>

            <!-- Mobil Akordeon İpucu Kutusu (Mobilde formun üstünde daraltılmış) -->
            <details class="rf-tips-mobile" id="rf-tips-mobile">
                <summary class="rf-tips-summary">
                    <span class="rf-tips-summary__title">
                        <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        İyi bir yorum nasıl yazılır?
                    </span>
                    <span class="rf-tips-chevron">▾</span>
                </summary>
                <div class="rf-tips-content">
                    <ul class="rf-tips-list">
                        <li><strong>Somut deneyimler paylaş:</strong> Sadece "iyiydi" demek yerine dersler, hocalar veya kampüs imkanlarından somut örnekler ver.</li>
                        <li><strong>Dengeli ol:</strong> Okulun hem güçlü yönlerine hem de geliştirilmesi gereken eksiklerine değin.</li>
                        <li><strong>Aday öğrencileri düşün:</strong> Tercih döneminde olsan bu okul hakkında neyi bilmek isterdin?</li>
                        <li><strong>Kişiselleştirme:</strong> Kişileri adıyla hedef alma; genel işleyişe ve olanaklara odaklan.</li>
                    </ul>
                </div>
            </details>

            <div class="rf-layout">
                <!-- Sol Sütun: Ana Form Kartı (Tek karta indirildi) -->
                <div class="rf-card" id="rf-main-card">
                    <form id="add-review-form" class="rf-form" novalidate>
                        
                        <!-- 1. Üniversite Seçimi (Searchable Combobox) -->
                        <div class="rf-field" id="rf-field-uni">
                            <label class="rf-label" for="form-uni-hidden">
                                Üniversite <span class="rf-req" aria-label="zorunlu">*</span>
                            </label>
                            <div class="custom-select" id="custom-uni-select-form">
                                <div class="custom-select__trigger" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded="false">
                                    <span class="custom-select__text">Üniversite seçin...</span>
                                    <span class="custom-select__icon">▼</span>
                                </div>
                                <div class="custom-select__dropdown">
                                    <input type="text" class="custom-select__search" placeholder="Üniversite ara (örn. İTÜ, ODTÜ)..." aria-label="Üniversite ara">
                                    <ul class="custom-select__options" role="listbox"></ul>
                                </div>
                            </div>
                            <input type="hidden" id="form-uni-hidden" required>
                            <div id="rf-uni-warning" class="rf-warning" hidden></div>
                            <div class="rf-error" id="rf-uni-error" aria-live="polite"></div>
                        </div>

                        <!-- 2. Genel Puan -->
                        <div class="rf-field" id="rf-field-rating">
                            <div class="rf-label-wrap">
                                <label class="rf-label">
                                    Genel Puanınız <span class="rf-req" aria-label="zorunlu">*</span>
                                </label>
                                <span class="rf-hint-pill">1 ile 5 yıldız arası</span>
                            </div>
                            <div class="rf-stars-wrap">
                                <div id="star-rating" class="rf-stars" role="radiogroup" aria-label="Genel Puan">
                                    <span class="rf-star" data-value="1" role="radio" aria-label="1 yıldız" tabindex="0">★</span>
                                    <span class="rf-star" data-value="2" role="radio" aria-label="2 yıldız" tabindex="0">★</span>
                                    <span class="rf-star" data-value="3" role="radio" aria-label="3 yıldız" tabindex="0">★</span>
                                    <span class="rf-star" data-value="4" role="radio" aria-label="4 yıldız" tabindex="0">★</span>
                                    <span class="rf-star" data-value="5" role="radio" aria-label="5 yıldız" tabindex="0">★</span>
                                </div>
                                <div id="rf-rating-label" class="rf-rating-desc" aria-live="polite">Puan seçin (1-5)</div>
                            </div>
                            <input type="hidden" id="form-rating" value="0" required>
                            <div class="rf-error" id="rf-rating-error" aria-live="polite"></div>
                        </div>

                        <!-- 3. Kategori Seçimi (Zorunlu - Çoklu Seçim) -->
                        <div class="rf-field" id="rf-field-categories">
                            <div class="rf-label-wrap">
                                <label class="rf-label" id="rf-categories-label">
                                    Hangi konuda yorum yapıyorsun? <span class="rf-req" aria-label="zorunlu">*</span>
                                </label>
                                <span class="rf-hint-pill">Birden fazla seçebilirsin</span>
                            </div>
                            <div class="rf-cat-chips" id="rf-category-chips" role="group" aria-labelledby="rf-categories-label"></div>
                            <div class="rf-error" id="rf-categories-error" aria-live="polite"></div>
                        </div>

                        <!-- 4. Deneyimin (Tek Metin Alanı) -->
                        <div class="rf-field" id="rf-field-text">
                            <div class="rf-label-wrap">
                                <label class="rf-label" for="form-review-text">
                                    Deneyimin <span class="rf-req" aria-label="zorunlu">*</span>
                                </label>
                                <span class="rf-hint-pill">Kişisel deneyim</span>
                            </div>
                            <textarea id="form-review-text" class="rf-textarea" rows="5" maxlength="500"
                                placeholder="Kampüs, eğitim, yurt, yemekhane, sosyal çevre... Güçlü ve zayıf yönleriyle deneyimini anlat."></textarea>
                            
                            <div class="rf-char-bar">
                                <span id="rf-char-guidance" class="rf-char-guidance">En az 40 karakter yazmalısın.</span>
                                <span id="char-count" class="rf-char-count">0 / 40 min (maks. 500)</span>
                            </div>

                            <!-- Yorum Gücü Göstergesi -->
                            <div class="rf-power-meter" id="rf-power-meter" aria-live="polite">
                                <div class="rf-power-header">
                                    <span class="rf-power-label">Yorum Gücü:</span>
                                    <span class="rf-power-text" id="rf-power-text">Kısa</span>
                                </div>
                                <div class="rf-power-track">
                                    <div class="rf-power-fill" id="rf-power-fill" style="width: 10%;"></div>
                                </div>
                            </div>

                            <div class="rf-error" id="rf-text-error" aria-live="polite"></div>
                        </div>

                        <!-- 4. Seni Tanıyalım (İsteğe Bağlı) Bloğu -->
                        <div class="rf-field rf-context-group" id="rf-sec-profile">
                            <div class="rf-label-wrap">
                                <span class="rf-label">Seni tanıyalım</span>
                                <span class="rf-opt-badge">İsteğe bağlı</span>
                            </div>
                            <p class="rf-help">Deneyiminin hangi bağlamda olduğunu belirtmek adaylara daha çok yardımcı olur.</p>

                            <!-- Adım 1: Öğrenci / Mezun Seçimi (Başlangıçta ikisi de seçili değil) -->
                            <div class="rf-edu-segmented">
                                <button type="button" class="rf-edu-btn" data-status="student" id="rf-edu-student">
                                    <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                                    <span>Şu an öğrenciyim</span>
                                </button>
                                <button type="button" class="rf-edu-btn" data-status="graduate" id="rf-edu-graduate">
                                    <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                    <span>Mezunum</span>
                                </button>
                            </div>
                            <input type="hidden" id="form-edu-status" value="">

                            <!-- Adım 2: Durum seçilince açılan koşullu alanlar (Başlangıçta kapalı) -->
                            <div class="rf-edu-details" id="rf-edu-details" style="display: none;">
                                <div class="rf-context-grid">
                                    <!-- Bölüm Combobox -->
                                    <div class="rf-context-col">
                                        <label class="rf-sublabel" for="rf-dept-input">Bölüm</label>
                                        <div class="custom-select" id="custom-dept-select-form">
                                            <div class="custom-select__trigger" tabindex="0">
                                                <span class="custom-select__text">Bölüm ara…</span>
                                                <span class="custom-select__icon">▼</span>
                                            </div>
                                            <div class="custom-select__dropdown">
                                                <input type="text" id="rf-dept-input" class="custom-select__search" placeholder="Bölüm ara…" aria-label="Bölüm ara">
                                                <ul class="custom-select__options"></ul>
                                            </div>
                                        </div>
                                        <input type="hidden" id="form-dept-hidden" value="">
                                    </div>

                                    <!-- Burs Durumu (Her iki durumda Bölümün yanında) -->
                                    <div class="rf-context-col">
                                        <label class="rf-sublabel" for="form-scholarship-select">Burs Durumu <span class="rf-sub-opt">(isteğe bağlı)</span></label>
                                        <select id="form-scholarship-select" class="rf-select">
                                            <option value="">Seçiniz...</option>
                                            <option value="Burslu">Burslu</option>
                                            <option value="Yarı Burslu (%50)">Yarı burslu (%50)</option>
                                            <option value="Burssuz">Burssuz</option>
                                            <option value="Belirtmek istemiyorum">Belirtmek istemiyorum</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Koşullu Alanlar: Öğrenciyse Sınıf, Mezunsa Mezuniyet Yılı -->
                                <div class="rf-conditional-fields" id="rf-conditional-fields" style="margin-top: 12px;">
                                    <!-- Öğrenci: Sınıf -->
                                    <div class="rf-context-col" id="rf-student-class-wrap" style="display: none;">
                                        <label class="rf-sublabel" for="form-class-select">Sınıf</label>
                                        <select id="form-class-select" class="rf-select">
                                            <option value="">Seçiniz...</option>
                                            <option value="Hazırlık">Hazırlık</option>
                                            <option value="1. Sınıf">1. Sınıf</option>
                                            <option value="2. Sınıf">2. Sınıf</option>
                                            <option value="3. Sınıf">3. Sınıf</option>
                                            <option value="4. Sınıf">4. Sınıf</option>
                                            <option value="Lisansüstü">Lisansüstü</option>
                                        </select>
                                    </div>

                                    <!-- Mezun: Mezuniyet Yılı (Son 15 Yıl Seçim Kutusu) -->
                                    <div class="rf-context-col" id="rf-grad-year-wrap" style="display: none;">
                                        <label class="rf-sublabel" for="rf-grad-year-select">Mezuniyet Yılı</label>
                                        <select id="rf-grad-year-select" class="rf-select">
                                            <option value="">Seçiniz...</option>
                                            <option value="2026">2026</option>
                                            <option value="2025">2025</option>
                                            <option value="2024">2024</option>
                                            <option value="2023">2023</option>
                                            <option value="2022">2022</option>
                                            <option value="2021">2021</option>
                                            <option value="2020">2020</option>
                                            <option value="2019">2019</option>
                                            <option value="2018">2018</option>
                                            <option value="2017">2017</option>
                                            <option value="2016">2016</option>
                                            <option value="2015">2015</option>
                                            <option value="2014">2014</option>
                                            <option value="2013">2013</option>
                                            <option value="2012">2012</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 5. Detaylı Puanlar (İsteğe Bağlı) Kapalı Akordeon Bölümü -->
                        <details class="rf-accordion" id="rf-criteria-details">
                            <summary class="rf-accordion-summary">
                                <span class="rf-accordion-title">
                                    <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    + 2 dakikada daha detaylı değerlendir
                                </span>
                                <span class="rf-accordion-chevron">▾</span>
                            </summary>
                            <div class="rf-accordion-content">
                                <p class="rf-help">Aşağıdaki kriterleri deneyimlediğin kadarıyla 1-5 yıldız arasında puanlayabilirsin.</p>
                                
                                <div class="rf-crit-grid">
                                    <!-- Yurt -->
                                    <div class="rf-crit-item" data-crit="yurt">
                                        <div class="rf-crit-label">
                                            <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                            <span>Yurt</span>
                                        </div>
                                        <div class="rf-crit-stars" data-crit="yurt">
                                            <span class="rf-crit-star" data-v="1">★</span>
                                            <span class="rf-crit-star" data-v="2">★</span>
                                            <span class="rf-crit-star" data-v="3">★</span>
                                            <span class="rf-crit-star" data-v="4">★</span>
                                            <span class="rf-crit-star" data-v="5">★</span>
                                        </div>
                                    </div>

                                    <!-- Yemekhane -->
                                    <div class="rf-crit-item" data-crit="yemekhane">
                                        <div class="rf-crit-label">
                                            <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v16"/><path d="M6 2v19"/><path d="M9 2a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3V2z"/></svg>
                                            <span>Yemekhane</span>
                                        </div>
                                        <div class="rf-crit-stars" data-crit="yemekhane">
                                            <span class="rf-crit-star" data-v="1">★</span>
                                            <span class="rf-crit-star" data-v="2">★</span>
                                            <span class="rf-crit-star" data-v="3">★</span>
                                            <span class="rf-crit-star" data-v="4">★</span>
                                            <span class="rf-crit-star" data-v="5">★</span>
                                        </div>
                                    </div>

                                    <!-- Ulaşım -->
                                    <div class="rf-crit-item" data-crit="ulasim">
                                        <div class="rf-crit-label">
                                            <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.6 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>
                                            <span>Ulaşım</span>
                                        </div>
                                        <div class="rf-crit-stars" data-crit="ulasim">
                                            <span class="rf-crit-star" data-v="1">★</span>
                                            <span class="rf-crit-star" data-v="2">★</span>
                                            <span class="rf-crit-star" data-v="3">★</span>
                                            <span class="rf-crit-star" data-v="4">★</span>
                                            <span class="rf-crit-star" data-v="5">★</span>
                                        </div>
                                    </div>

                                    <!-- Sosyal Hayat -->
                                    <div class="rf-crit-item" data-crit="sosyal">
                                        <div class="rf-crit-label">
                                            <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                            <span>Sosyal Hayat</span>
                                        </div>
                                        <div class="rf-crit-stars" data-crit="sosyal">
                                            <span class="rf-crit-star" data-v="1">★</span>
                                            <span class="rf-crit-star" data-v="2">★</span>
                                            <span class="rf-crit-star" data-v="3">★</span>
                                            <span class="rf-crit-star" data-v="4">★</span>
                                            <span class="rf-crit-star" data-v="5">★</span>
                                        </div>
                                    </div>

                                    <!-- Akademik (Merkezlenmiş 5. eleman) -->
                                    <div class="rf-crit-item rf-crit-item--full" data-crit="egitim">
                                        <div class="rf-crit-label">
                                            <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                                            <span>Akademik</span>
                                        </div>
                                        <div class="rf-crit-stars" data-crit="egitim">
                                            <span class="rf-crit-star" data-v="1">★</span>
                                            <span class="rf-crit-star" data-v="2">★</span>
                                            <span class="rf-crit-star" data-v="3">★</span>
                                            <span class="rf-crit-star" data-v="4">★</span>
                                            <span class="rf-crit-star" data-v="5">★</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </details>

                        <!-- 6. Anonimlik Anahtarı -->
                        <div class="rf-field rf-anon-card" id="rf-field-anon">
                            <div class="rf-anon-left">
                                <span class="rf-anon-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z"/></svg>
                                </span>
                                <div>
                                    <div class="rf-anon-title" id="rf-anon-label">Anonim olarak paylaş</div>
                                    <div class="rf-anon-desc" id="rf-anon-desc">İsminiz gizlenir, yorumunuz "Anonim öğrenci" adıyla yayınlanır.</div>
                                </div>
                            </div>
                            <label class="rf-switch" for="rf-anonymous-toggle" aria-label="Anonim paylaşım anahtarı">
                                <input type="checkbox" id="rf-anonymous-toggle" checked aria-labelledby="rf-anon-label">
                                <span class="rf-slider"></span>
                            </label>
                        </div>

                        <!-- 7. Güven & Moderasyon Uyarısı -->
                        <div class="rf-trust-box">
                            <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            <p>
                                Lütfen kişileri doğrudan adıyla hedef almayın ve kişisel iletişim bilgisi paylaşmayın.
                            </p>
                        </div>

                        <!-- 8. Zorunlu Onay Kutusu -->
                        <div class="rf-field rf-consent-field" id="rf-field-consent">
                            <label class="rf-checkbox-label" for="rf-consent">
                                <input type="checkbox" id="rf-consent" class="rf-checkbox" required>
                                <span class="rf-checkbox-text">
                                    Bu yorum kendi gerçek deneyimimdir ve <a href="#/topluluk-kurallari" target="_blank" rel="noopener">Topluluk Kurallarını</a> kabul ediyorum.
                                </span>
                            </label>
                            <div class="rf-error" id="rf-consent-error" aria-live="polite"></div>
                        </div>

                        <!-- 9. Ekran Altında Sabit Gönderim Çubuğu (Sticky Bottom Bar) -->
                        <div class="rf-bottom-bar" id="rf-bottom-bar">
                            <div class="rf-bottom-bar__inner">
                                <div class="rf-bottom-bar__status" id="rf-bottom-status">
                                    <span class="rf-progress-dot"></span>
                                    <span id="rf-progress-text">Zorunlu alanlar: 0/4 tamam</span>
                                </div>
                                <button type="submit" id="rf-submit-btn" class="btn btn--primary rf-submit-btn" aria-disabled="true">
                                    Yorumu paylaş
                                </button>
                            </div>
                        </div>
                    </form>

                    <!-- Gönderim Sonrası Teşekkür Kartı (Başlangıçta gizli) -->
                    <div id="rf-success-card" class="rf-success-card" hidden>
                        <div class="rf-success-icon">✓</div>
                        <h2 class="rf-success-title">Değerlendirmeniz Alındı!</h2>
                        <p class="rf-success-desc">
                            Okulun hakkında paylaştığın samimi deneyimler için teşekkür ederiz.
                            Yorumun incelendikten sonra yayınlanacak ve aday öğrencilere rehberlik edecek.
                        </p>
                        <div class="rf-success-actions">
                            <button type="button" id="rf-btn-new" class="btn btn--secondary">
                                Başka bir okula yorum yaz
                            </button>
                            <a href="#/home" id="rf-btn-uni" class="btn btn--primary">
                                Okul sayfasına dön
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Sağ Sütun: Geniş ekranda İpucu Kutusu -->
                <aside class="rf-tips-sidebar" aria-label="İyi bir yorum yazma rehberi">
                    <div class="rf-tips-card">
                        <div class="rf-tips-header">
                            <svg class="crit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            <h3>İyi bir yorum nasıl yazılır?</h3>
                        </div>
                        <ul class="rf-tips-list">
                            <li>
                                <strong>Somut deneyimler paylaş:</strong>
                                <span>Sadece "iyiydi" demek yerine ders işleyişi, hocaların yaklaşımı veya yerleşke olanaklarından somut örnekler ver.</span>
                            </li>
                            <li>
                                <strong>Dengeli ve tarafsız ol:</strong>
                                <span>Okulun hem takdir ettiğin güçlü yanlarına hem de geliştirilmesi gereken eksikliklerine değin.</span>
                            </li>
                            <li>
                                <strong>Aday öğrencileri düşün:</strong>
                                <span>Tercih listesi hazırlarken bilseydim çok işime yarardı dediğin pratik detayları aktar.</span>
                            </li>
                            <li>
                                <strong>Kişiselleştirme:</strong>
                                <span>Akademisyenleri veya öğrencileri isim vererek hedef alma; genel sisteme ve olanaklara odaklan.</span>
                            </li>
                        </ul>
                    </div>
                </aside>
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
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-zinc-800/80" data-stagger="70" aria-label="Profil istatistikleri">
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
                    <aside data-stagger="100" class="lg:col-span-4 space-y-6">

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

            <div class="auth-glass-card" data-anim="zoom-in">
                <div class="auth-header">
                    <span class="auth-header__icon" aria-hidden="true">
                        <svg class="brand-logo-mark" viewBox="594 430 880 880" fill="currentColor">
                            <g transform="translate(0,2048) scale(0.1,-0.1)">
                                <path d="M10095 15586 c-110 -46 -261 -108 -335 -139 -74 -30 -304 -125 -510 -210 -627 -259 -982 -405 -1260 -518 -146 -59 -355 -144 -465 -189 -110 -45 -308 -126 -440 -180 -822 -335 -784 -318 -813 -361 -20 -29 -23 -44 -20 -101 6 -112 20 -121 384 -262 l201 -78 7 -121 c8 -154 8 -531 0 -629 l-7 -74 -45 -25 c-169 -89 -264 -281 -233 -469 14 -84 47 -164 90 -212 17 -20 31 -44 31 -54 0 -9 -38 -210 -85 -446 -47 -236 -85 -452 -85 -480 0 -68 35 -128 87 -152 34 -15 77 -16 425 -14 375 3 387 4 415 24 43 33 64 75 64 136 0 29 -21 161 -46 293 -81 425 -115 613 -115 632 0 11 20 47 44 82 60 85 80 162 74 283 -6 108 -21 156 -72 232 -42 63 -89 105 -163 143 l-53 28 0 347 0 347 68 -24 c37 -12 132 -48 212 -80 299 -117 625 -247 628 -250 1 -1 2 -172 2 -380 0 -237 4 -392 11 -417 5 -22 25 -56 43 -76 30 -32 40 -36 93 -40 33 -2 93 3 135 11 256 53 670 61 913 18 352 -63 564 -160 848 -388 127 -101 166 -123 222 -123 53 0 92 20 181 92 345 280 618 396 1033 439 163 17 510 6 676 -21 215 -35 254 -36 294 -8 19 12 44 39 55 58 20 33 21 52 24 436 l3 402 62 22 c34 12 175 68 312 123 138 55 327 128 420 164 94 35 260 99 370 142 110 44 276 109 370 146 93 36 187 76 208 88 99 55 114 197 29 267 -20 17 -83 48 -140 70 -57 22 -174 70 -260 106 -86 37 -303 126 -482 199 -506 206 -855 348 -1105 452 -126 53 -360 148 -520 213 -610 247 -869 352 -1125 460 -146 62 -289 120 -317 131 -89 32 -118 27 -338 -65z m523 -367 c147 -62 416 -172 597 -246 538 -219 1099 -446 1425 -578 168 -67 429 -174 580 -237 151 -63 353 -146 447 -184 95 -38 173 -72 173 -75 0 -3 -109 -48 -242 -99 -134 -51 -342 -132 -463 -180 -270 -107 -510 -200 -519 -200 -3 0 -6 26 -6 59 0 150 -37 224 -134 270 -106 51 -334 136 -533 200 -403 129 -777 200 -1243 236 -426 33 -863 4 -1324 -86 -376 -74 -938 -247 -1156 -357 -61 -30 -80 -46 -104 -84 -25 -42 -29 -60 -34 -144 -4 -82 -7 -95 -21 -91 -9 2 -159 62 -335 131 -175 70 -371 147 -435 171 l-116 43 -3 134 -3 134 38 13 c21 7 180 72 353 144 320 132 586 241 1103 451 159 64 422 172 585 240 164 68 376 156 472 195 96 39 270 111 385 160 116 50 218 90 228 90 10 1 138 -49 285 -110z m202 -1368 c193 -21 571 -88 736 -131 176 -46 417 -125 604 -197 l125 -48 2 -475 c1 -261 0 -480 -2 -486 -2 -7 -30 -7 -91 2 -142 21 -451 28 -604 15 -381 -34 -723 -143 -1005 -320 -55 -35 -130 -87 -167 -117 -37 -30 -69 -54 -73 -54 -3 0 -39 27 -80 59 -303 241 -701 391 -1148 432 -153 14 -470 6 -596 -16 -52 -8 -100 -14 -106 -11 -8 3 -11 138 -11 482 l1 479 100 38 c425 160 693 236 1046 296 239 41 409 61 569 69 164 8 543 -1 700 -17z m-3738 -1456 c77 -52 70 -168 -13 -211 -67 -34 -151 -1 -178 70 -13 33 -13 44 0 79 28 82 119 111 191 62z m-52 -557 c1 -2 27 -145 59 -318 32 -173 56 -318 54 -322 -2 -5 -63 -8 -135 -8 l-131 0 7 48 c6 50 105 568 111 590 4 10 34 18 35 10z"/>
                                <path d="M9411 11538 c-97 -27 -171 -117 -227 -273 -66 -186 -98 -408 -139 -978 -53 -729 -94 -1127 -115 -1127 -18 0 -55 187 -174 890 -39 230 -80 379 -132 482 -101 201 -264 262 -426 159 -114 -72 -189 -245 -258 -595 -60 -296 -144 -605 -171 -622 -18 -10 -38 16 -105 140 -124 224 -193 307 -312 369 -122 64 -134 66 -582 69 -390 3 -406 2 -439 -17 -112 -66 -110 -222 4 -288 14 -8 141 -14 415 -17 l395 -5 48 -28 c56 -33 96 -85 168 -217 140 -257 228 -341 376 -356 72 -8 152 13 206 53 129 97 203 305 328 913 26 130 52 229 67 254 20 35 73 -182 127 -527 95 -608 137 -790 216 -952 72 -147 142 -205 250 -205 69 0 147 37 187 88 123 156 170 425 237 1357 21 300 51 596 81 800 25 173 39 235 53 235 11 0 86 -310 110 -455 21 -126 98 -691 157 -1155 104 -823 179 -1178 297 -1415 55 -111 95 -158 169 -194 50 -25 73 -31 127 -31 262 0 407 319 516 1133 14 103 36 271 50 375 14 103 35 259 46 347 88 708 211 1395 249 1395 31 0 99 -514 130 -975 18 -267 69 -802 90 -944 32 -221 78 -363 147 -464 38 -55 115 -97 177 -97 122 0 199 60 272 214 71 150 95 254 204 896 74 437 106 580 129 566 13 -8 45 -134 86 -336 46 -226 77 -349 121 -485 70 -215 132 -313 228 -362 44 -23 63 -27 141 -28 76 0 97 4 133 23 99 53 170 140 266 328 63 125 118 194 180 227 40 21 53 22 431 27 435 6 432 5 475 75 18 29 22 47 18 94 -5 65 -25 100 -79 130 -35 20 -51 21 -432 21 -394 0 -396 0 -475 -25 -95 -30 -182 -84 -242 -152 -25 -27 -81 -110 -125 -184 -106 -179 -133 -219 -150 -219 -30 0 -98 246 -180 650 -62 306 -114 439 -210 536 -153 154 -374 90 -480 -139 -46 -100 -79 -229 -110 -425 -84 -534 -158 -932 -175 -932 -20 0 -53 296 -100 885 -48 613 -67 773 -121 1031 -43 207 -81 304 -152 382 -86 93 -218 121 -308 64 -93 -60 -166 -169 -218 -328 -84 -258 -138 -582 -236 -1409 -22 -185 -110 -807 -136 -960 -38 -227 -114 -520 -149 -575 -13 -21 -24 -6 -53 77 -85 237 -149 616 -296 1748 -103 786 -156 1050 -250 1240 -60 121 -97 166 -165 205 -55 32 -117 38 -185 18z"/>
                            </g>
                        </svg>
                    </span>
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
                    <button type="submit" class="auth-submit-btn">Giriş Yap </button>
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

                    <button type="submit" class="auth-submit-btn">Hesap Oluştur </button>
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
                            <p>Kişilik haklarının veya kurumsal itibarının ihlal edildiğini düşünen kişi ve kurumlar <a href="#/iletisim">İletişim &amp; Destek formu</a> üzerinden ilgili URL ve açıklama ile başvurabilir. Usulüne uygun bildirimler <strong>24–48 saat</strong> içinde incelenerek hukuka aykırı içerikler yayından kaldırılır.</p>
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
                            <p>Dilediğiniz zaman profilinizden yorumlarınızı silebilir veya kişisel verilerinizin silinmesi/düzeltilmesi taleplerinizi <a href="#/iletisim">İletişim &amp; Destek formu</a> üzerinden iletebilirsiniz.</p>
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

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="blog-articles-grid" data-stagger="80">
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
                <div data-anim="fade-up" class="text-center mb-16">
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
                <div data-stagger="110" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
                <div data-anim="fade-up" class="text-center mb-10">
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
                <div data-anim="fade-up" class="text-center mb-10">
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
                <div data-anim="fade-up" class="text-center mb-16">
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
                <div data-stagger="110" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
                <div data-anim="fade-up" class="text-center mb-16">
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
                <div data-stagger="110" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
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
                    <div data-stagger="110" class="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                <div class="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center" data-stagger="100">
                    <div>
                        <div class="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1" style="font-family: var(--font-heading);" data-counter="200" data-counter-suffix="+">200+</div>
                        <div class="text-xs text-zinc-400">Üniversite</div>
                    </div>
                    <div>
                        <div class="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1" style="font-family: var(--font-heading);" data-counter="1560" data-counter-suffix="+">1.560+</div>
                        <div class="text-xs text-zinc-400">KYK Yurdu</div>
                    </div>
                    <div>
                        <div class="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1" style="font-family: var(--font-heading);" data-counter="15000" data-counter-suffix="+">15.000+</div>
                        <div class="text-xs text-zinc-400">Öğrenci Yorumu</div>
                    </div>
                    <div>
                        <div class="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1" style="font-family: var(--font-heading);" data-counter="81" data-counter-suffix=" İl">81 İl</div>
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
                <div data-anim="fade-up" class="text-center mb-14">
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
                                <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">İletişim Kanalı</span>
                                <div class="flex items-start gap-2.5 text-sm text-zinc-200 leading-relaxed">
                                    <i data-lucide="message-square-reply" class="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"></i>
                                    <span>Mesajını formdan ilet, yanıtımız doğrudan <strong>e-posta adresine</strong> gelir.</span>
                                </div>
                            </div>

                            <div class="pt-4 border-t border-zinc-800">
                                <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Yanıt Süresi</span>
                                <div class="flex items-center gap-2 text-sm text-zinc-300">
                                    <i data-lucide="clock" class="w-4 h-4 text-cyan-400 shrink-0"></i>
                                    <span>En geç <strong>24 saat</strong> içinde dönüş yapıyoruz.</span>
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
                <div data-anim="fade-up" class="text-center mb-14">
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
                <div data-stagger="70" class="space-y-6 legal-document-content">
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
                            Veri sorumlusu sıfatıyla bize her türlü soru, talep ve başvurunuz için resmi <a href="#/iletisim" class="text-cyan-400 hover:underline font-medium">İletişim &amp; Destek formumuz</a> üzerinden ulaşabilirsiniz.
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
                            Bu haklarınıza ilişkin taleplerinizi kayıtlı e-posta adresinizle <a href="#/iletisim" class="text-cyan-400 hover:underline font-medium">İletişim &amp; Destek formumuz</a> üzerinden iletebilirsiniz. Başvurularınız talebin niteliğine göre en kısa sürede ve en geç otuz (30) gün içinde ücretsiz olarak sonuçlandırılır.
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
                <div data-anim="fade-up" class="text-center mb-14">
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
                <div data-stagger="70" class="space-y-6 legal-document-content">
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
                <div data-anim="fade-up" class="text-center mb-14">
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
                <div data-stagger="70" class="space-y-6 legal-document-content">
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
                            Herhangi bir üniversite yönetimi, özel/devlet yurt işletmesi, akademisyen veya gerçek/tüzel kişi; platformda yer alan bir yorumun kişilik haklarını, ticari itibarını veya yürürlükteki mevzuatı ihlal ettiğini düşünüyorsa, doğrudan yargı yoluna başvurmadan önce resmi <a href="#/iletisim" class="text-cyan-400 hover:underline font-bold">İletişim &amp; Destek formumuz</a> üzerinden "Uyar-Kaldır" talebinde bulunabilir.
                        </p>
                        <p class="text-zinc-300 text-sm leading-relaxed">
                            <strong>Başvuru Usulü:</strong> <a href="#/iletisim" class="text-cyan-400 hover:underline">İletişim &amp; Destek formu</a> üzerinden gönderilecek bildirimde; (1) İhlale konu yorumun bulunduğu sayfa bağlantısı (URL) veya ekran görüntüsü, (2) İçeriğin hangi açıdan hukuka veya kişilik haklarına aykırı olduğunun somut açıklaması ve (3) Başvuran kişinin yetki belgesi veya kimlik teyidi yer almalıdır. Usulüne uygun olarak iletilen bildirimler hukuk ve moderasyon ekibimizce <strong>en geç 24 ila 48 saat içerisinde</strong> incelenir; hukuka aykırılığı tespit edilen içerikler derhal yayından kaldırılır ve başvuru sahibine yazılı bilgi verilir.
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
                            Kullanıcı, üyelik kayıt formundaki onay kutusunu işaretleyerek veya platformu kullanarak işbu Sözleşme hükümlerini okuduğunu ve kabul ettiğini beyan eder. İşbu Sözleşme'den doğabilecek her türlü hukuki uyuşmazlıkta Türkiye Cumhuriyeti kanunları uygulanır. Her türlü bildirim ve yasal iletişim için resmi kanalımız <a href="#/iletisim" class="text-cyan-400 hover:underline font-medium">İletişim &amp; Destek formumuzdur</a>.
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
                <div data-anim="fade-up" class="text-center mb-12">
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
                <div id="favorites-container" data-stagger="80" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="skeleton h-44 rounded-2xl"></div>
                    <div class="skeleton h-44 rounded-2xl"></div>
                    <div class="skeleton h-44 rounded-2xl"></div>
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
                <div data-anim="fade-up" class="text-center mb-12">
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
                <div id="cities-grid" data-stagger="80" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div data-anim="fade-up" class="text-center mb-12">
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
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" id="top-podium-cards" data-stagger="80">
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
                <div id="ranking-list" data-stagger="80" class="space-y-3">
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
                <div data-anim="fade-up" class="text-center mb-12">
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
                <div id="departments-grid" data-stagger="80" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <i data-lucide="mail" class="w-3.5 h-3.5"></i>
                            <span>İletişim</span>
                            <span id="admin-tab-messages-badge" class="hidden px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white leading-none">0</span>
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
                <div id="admin-tab-messages" class="hidden space-y-5">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 class="text-lg font-bold text-white flex items-center gap-2">
                                <i data-lucide="mail" class="w-4 h-4 text-rose-400"></i> Gelen İletişim Mesajları
                            </h3>
                            <span id="admin-messages-count" class="text-xs text-zinc-500 block mt-0.5">Yükleniyor...</span>
                        </div>

                        <!-- Mesaj Durumu Filtreleri -->
                        <div id="admin-messages-filters" class="flex flex-wrap items-center gap-1.5">
                            <button type="button" class="admin-msg-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-400 text-zinc-950 border border-cyan-400 cursor-pointer transition-all" data-msg-filter="all">
                                Tümü
                            </button>
                            <button type="button" class="admin-msg-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer transition-all" data-msg-filter="unread">
                                Okunmamış
                            </button>
                            <button type="button" class="admin-msg-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer transition-all" data-msg-filter="pending_reply">
                                Yanıt bekleyen
                            </button>
                            <button type="button" class="admin-msg-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer transition-all" data-msg-filter="replied">
                                Yanıtlanan
                            </button>
                        </div>
                    </div>

                    <div id="admin-messages-list" class="space-y-4">
                        <div class="p-8 text-center text-zinc-500">Mesajlar yükleniyor...</div>
                    </div>
                </div>

            </div>
        </main>
    `
};