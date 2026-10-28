# Kampüs Sesi — Üniversite Değerlendirme Platformu

Türkiye'deki üniversiteler için doğrulanmış öğrenci yorumları, kampüs konumları, Vikipedi/Wikidata tabanlı kurumsal bilgiler ve kampüse yakınlığa göre eşleştirilmiş KYK yurt rehberi sunan tam kapsamlı web uygulaması.

## Proje Dizin Yapısı

```text
uni-review/
├── backend/                # FastAPI sunucusu, veritabanı modelleri ve kimlik doğrulama
│   ├── server.py           # REST API uçları ve statik önyüz sunumu
│   ├── database.py         # SQLAlchemy ORM modelleri ve veritabanı bağlantısı
│   └── auth_utils.py       # JWT ve parola özetleme (bcrypt/PBKDF2) yardımcıları
├── frontend/               # Vanilla JS SPA önyüz dosyaları
│   ├── index.html          # Ana uygulama kabuğu
│   ├── css/                # Stil ve tema dosyaları (style.css, theme.css, animations.css)
│   ├── js/                 # İstemci tarafı modüller (app.js, templates.js, universities.js, api.js, home.js)
│   └── assets/             # Logo ve ikon varlıkları
├── scripts/                # Veri çekme (fetch), geocoding ve veritabanı yükleme (seed) betikleri
│   ├── fetch_about_wikipedia.py
│   ├── seed_about.py
│   ├── fetch_kyk.py
│   ├── fetch_and_seed_all_kyk.py
│   ├── geocode_dorms.py
│   ├── seed_kyk.py
│   └── fetch_and_seed_all_addresses.py
├── data/                   # Önbellek (JSON) ve veritabanı yedek/seed (SQL) dosyaları
├── baslat.bat              # Tek tıkla yerel sunucu ve tarayıcı başlatıcı
├── .gitignore
├── requirements.txt
└── README.md
```

## Kurulum ve Çalıştırma

1. **Bağımlılıkları yükleyin:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Sunucuyu başlatın:**
   ```bash
   python backend/server.py
   ```
   Uygulama varsayılan olarak `http://localhost:8000` adresinde (API dokümantasyonu `http://localhost:8000/docs`) çalışır.

3. **Veri Güncelleme / Seed Betikleri:**
   - Üniversite "Hakkında" metinlerini yükleme: `python scripts/seed_about.py --apply`
   - KYK yurt koordinatlarını çekme: `python scripts/geocode_dorms.py`
   - Kampüse yakın (`<= 10 km`) KYK yurtlarını eşleştirme: `python scripts/seed_kyk.py`

