import argparse
import json
import os
import re
import sys
import time
import unicodedata
import requests

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from database import SessionLocal, University, UniversityAddress, KykDorm, init_db

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
KYK_CACHE_PATH = os.path.join(SCRIPT_DIR, "kyk_cache_by_city.json")
GEOCODE_CACHE_PATH = os.path.join(SCRIPT_DIR, "dorm_geocode_cache.json")
UNMATCHED_PATH = os.path.join(SCRIPT_DIR, "dorm_geocode_unmatched.json")

# HTTP başlıkları (RFC 7230 / http.client) latin-1 kullandığından UTF-8 bayt dizisi olarak iletilir
USER_AGENT_STR = "KampusSesi/1.0 (iletişim: destek@kampussesi.com)"
USER_AGENT = USER_AGENT_STR.encode("utf-8")
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
MIN_INTERVAL = 1.05

CITIES_TR = {
    "adana": "Adana", "adiyaman": "Adıyaman", "afyonkarahisar": "Afyonkarahisar", "agri": "Ağrı",
    "aksaray": "Aksaray", "amasya": "Amasya", "ankara": "Ankara", "antalya": "Antalya",
    "ardahan": "Ardahan", "artvin": "Artvin", "aydin": "Aydın", "balikesir": "Balıkesir",
    "bartin": "Bartın", "batman": "Batman", "bayburt": "Bayburt", "bilecik": "Bilecik",
    "bingol": "Bingöl", "bitlis": "Bitlis", "bolu": "Bolu", "burdur": "Burdur",
    "bursa": "Bursa", "canakkale": "Çanakkale", "cankiri": "Çankırı", "corum": "Çorum",
    "denizli": "Denizli", "diyarbakir": "Diyarbakır", "duzce": "Düzce", "edirne": "Edirne",
    "elazig": "Elazığ", "erzincan": "Erzincan", "erzurum": "Erzurum", "eskisehir": "Eskişehir",
    "gaziantep": "Gaziantep", "giresun": "Giresun", "gumushane": "Gümüşhane", "hakkari": "Hakkari",
    "hatay": "Hatay", "igdir": "Iğdır", "isparta": "Isparta", "istanbul": "İstanbul",
    "izmir": "İzmir", "kahramanmaras": "Kahramanmaraş", "karabuk": "Karabük", "karaman": "Karaman",
    "kars": "Kars", "kastamonu": "Kastamonu", "kayseri": "Kayseri", "kilis": "Kilis",
    "kirikkale": "Kırıkkale", "kirklareli": "Kırklareli", "kirsehir": "Kırşehir", "kocaeli": "Kocaeli",
    "konya": "Konya", "kutahya": "Kütahya", "malatya": "Malatya", "manisa": "Manisa",
    "mardin": "Mardin", "mersin": "Mersin", "mugla": "Muğla", "mus": "Muş",
    "nevsehir": "Nevşehir", "nigde": "Niğde", "ordu": "Ordu", "osmaniye": "Osmaniye",
    "rize": "Rize", "sakarya": "Sakarya", "samsun": "Samsun", "sanliurfa": "Şanlıurfa",
    "siirt": "Siirt", "sinop": "Sinop", "sirnak": "Şırnak", "sivas": "Sivas",
    "tekirdag": "Tekirdağ", "tokat": "Tokat", "trabzon": "Trabzon", "tunceli": "Tunceli",
    "usak": "Uşak", "van": "Van", "yalova": "Yalova", "yozgat": "Yozgat",
    "zonguldak": "Zonguldak"
}

TR_MAP = str.maketrans({
    "Ç": "c", "ç": "c",
    "Ğ": "g", "ğ": "g",
    "I": "i", "ı": "i",
    "İ": "i", "i": "i",
    "Ö": "o", "ö": "o",
    "Ş": "s", "ş": "s",
    "Ü": "u", "ü": "u",
    "Â": "a", "â": "a",
    "Î": "i", "î": "i",
    "Û": "u", "û": "u",
})


def normalize_tr(text: str) -> str:
    if not text:
        return ""
    s = unicodedata.normalize("NFC", text)
    s = s.translate(TR_MAP).lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


class NominatimClient:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
            "Accept-Language": "tr-TR,tr;q=0.9",
        })
        self.last_request_ts = 0.0
        self.request_count = 0

    def search(self, query: str):
        elapsed = time.time() - self.last_request_ts
        if elapsed < MIN_INTERVAL:
            time.sleep(MIN_INTERVAL - elapsed)

        params = {
            "q": query,
            "format": "jsonv2",
            "limit": 5,
            "countrycodes": "tr",
            "addressdetails": 1,
        }
        for attempt in range(1, 4):
            try:
                self.last_request_ts = time.time()
                self.request_count += 1
                resp = self.session.get(NOMINATIM_URL, params=params, timeout=15)
                if resp.status_code == 429:
                    wait_sec = 5 * attempt
                    print(f"  [429 Rate Limit] {wait_sec} sn bekleniyor...")
                    time.sleep(wait_sec)
                    continue
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"  [Uyarı] Nominatim hatası (deneme {attempt}/3): {e}")
                if attempt < 3:
                    time.sleep(2 * attempt)
        return []


def extract_core_dorm_name(dorm_name: str) -> str:
    s = dorm_name
    s = re.sub(r"\bKyk\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bKız\s+Ve\s+Erkek\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bKız\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bErkek\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bÖğrenci\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bYurdu\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bYurt\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\s+", " ", s).strip(" -.,")
    return s


def build_candidate_queries(dorm_name: str, city: str) -> list[str]:
    core = extract_core_dorm_name(dorm_name)
    candidates = []

    def add(q):
        q = re.sub(r"\s+", " ", q).strip()
        if q and q not in candidates:
            candidates.append(q)

    if core:
        # 1. '{core} Yurdu, {city}' Nominatim token aramasında hem 'Öğrenci Yurdu' hem 'KYK Yurdu' kayıtlarını tek sorguda yakalar
        add(f"{core} Yurdu, {city}")
        # 2. Doğrudan yer/ilçe/mahalle/cadde adı araması
        if normalize_tr(core) != normalize_tr(city):
            add(f"{core}, {city}")
            # Çok kelimeli özel isimlerde (örn. 'Besni Servi M.erdemoğlu') ilk kelime genellikle ilçe/semt adıdır
            tokens = [t for t in re.split(r"[\s.]+", core) if len(t) >= 3]
            if len(tokens) >= 2:
                add(f"{tokens[0]}, {city}")
        else:
            add(f"{city}, Türkiye")
    else:
        add(f"{dorm_name}, {city}")
    return candidates


def result_matches_city(item: dict, city: str) -> bool:
    norm_city = normalize_tr(city)
    raw_disp = item.get("display_name", "")
    parts = [normalize_tr(p) for p in raw_disp.split(",") if p.strip()]
    if not parts:
        return False
    # İl adı Nominatim display_name içinde idari hiyerarşide (son 5 segmentte veya kısa il sonuçlarında ilk segmentte) yer alır
    tail_parts = parts if len(parts) <= 4 else parts[-5:]
    for seg in tail_parts:
        if seg == norm_city or seg == f"{norm_city} merkez":
            return True
    addr = item.get("address") or {}
    for k in ("province", "state", "city"):
        if normalize_tr(addr.get(k, "")) == norm_city:
            return True
    return False


def load_dorm_city_map(db) -> dict[str, str]:
    dorm_city = {}
    if os.path.exists(KYK_CACHE_PATH):
        try:
            with open(KYK_CACHE_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            for slug, dorms in data.items():
                city_tr = CITIES_TR.get(slug.lower(), slug.capitalize())
                for d in dorms:
                    name = (d.get("name") or "").strip()
                    if name:
                        dorm_city[name] = city_tr
        except Exception:
            pass

    ua_by_uid = {
        ua.university_id: ua.city
        for ua in db.query(UniversityAddress).all()
        if ua.city
    }
    for row in db.query(KykDorm).all():
        if row.name not in dorm_city and row.university_id in ua_by_uid:
            dorm_city[row.name] = ua_by_uid[row.university_id]
    return dorm_city


def main():
    parser = argparse.ArgumentParser(
        description="Koordinatı eksik KYK yurtları için Nominatim ile lat/lng bulur."
    )
    parser.add_argument("--limit", type=int, default=None, help="En fazla N tekil yurdu sorgula.")
    parser.add_argument("--dry-run", action="store_true", help="Veritabanına yazmadan çalışır.")
    args = parser.parse_args()

    init_db()
    db = SessionLocal()

    cache = {}
    if os.path.exists(GEOCODE_CACHE_PATH):
        try:
            with open(GEOCODE_CACHE_PATH, "r", encoding="utf-8") as f:
                cache = json.load(f)
        except Exception:
            cache = {}

    try:
        dorm_city_map = load_dorm_city_map(db)
        all_rows = db.query(KykDorm).order_by(KykDorm.id.asc()).all()

        # Tekil yurtları (koordinatı eksik olanlar) sırayla topla
        missing_by_name = {}
        for row in all_rows:
            if row.lat is None or row.lng is None:
                missing_by_name.setdefault(row.name, []).append(row)

        unique_missing_names = list(missing_by_name.keys())
        if args.limit is not None and args.limit >= 0:
            target_names = unique_missing_names[:args.limit]
        else:
            target_names = unique_missing_names

        print(f"Toplam kyk_dorms satırı        : {len(all_rows)}")
        print(f"Koordinatı eksik tekil yurt    : {len(unique_missing_names)}")
        print(f"Bu çalışmada işlenecek yurt    : {len(target_names)}")
        print(f"Mod                            : {'DRY-RUN' if args.dry_run else 'NORMAL (DB + Cache)'}\n")

        client = NominatimClient()
        found_list = []
        unmatched_list = []

        for idx, dorm_name in enumerate(target_names, start=1):
            city = dorm_city_map.get(dorm_name, "")
            cache_key = f"{city}::{dorm_name}"

            cached_entry = cache.get(cache_key)
            if cached_entry and cached_entry.get("lat") is not None and cached_entry.get("lng") is not None:
                lat = float(cached_entry["lat"])
                lng = float(cached_entry["lng"])
                matched_q = cached_entry.get("query", "(cache)")
                disp_name = cached_entry.get("display_name", "")
                print(f"[{idx}/{len(target_names)}] ÖNBELLEKTEN: {dorm_name} ({city}) -> ({lat:.6f}, {lng:.6f})")
            else:
                candidates = build_candidate_queries(dorm_name, city)
                lat = None
                lng = None
                matched_q = None
                disp_name = None

                for q in candidates:
                    results = client.search(q)
                    for r in results:
                        if result_matches_city(r, city):
                            lat = float(r["lat"])
                            lng = float(r["lon"])
                            matched_q = q
                            disp_name = r.get("display_name", "")
                            break
                    if lat is not None:
                        break

                cache[cache_key] = {
                    "name": dorm_name,
                    "city": city,
                    "lat": lat,
                    "lng": lng,
                    "query": matched_q,
                    "display_name": disp_name,
                }
                with open(GEOCODE_CACHE_PATH, "w", encoding="utf-8") as f:
                    json.dump(cache, f, ensure_ascii=False, indent=2)

                if lat is not None and lng is not None:
                    print(f"[{idx}/{len(target_names)}] BULUNDU: {dorm_name} ({city}) -> ({lat:.6f}, {lng:.6f}) | Sorgu: '{matched_q}'")
                else:
                    print(f"[{idx}/{len(target_names)}] BULUNAMADI: {dorm_name} ({city})")

            if lat is not None and lng is not None:
                found_list.append({
                    "name": dorm_name,
                    "city": city,
                    "lat": lat,
                    "lng": lng,
                    "query": matched_q,
                    "display_name": disp_name,
                })
                if not args.dry_run:
                    for row in missing_by_name[dorm_name]:
                        row.lat = lat
                        row.lng = lng
            else:
                unmatched_list.append({
                    "name": dorm_name,
                    "city": city,
                })

        if not args.dry_run:
            db.commit()

        with open(UNMATCHED_PATH, "w", encoding="utf-8") as f:
            json.dump(unmatched_list, f, ensure_ascii=False, indent=2)

        print("\n=== ÖZET ===")
        print(f"İşlenen tekil yurt : {len(target_names)}")
        print(f"Koordinatı bulunan : {len(found_list)}")
        print(f"Bulunamayan        : {len(unmatched_list)}")
        print(f"Toplam HTTP isteği : {client.request_count}")
        if unmatched_list:
            print("Bulunamayan Yurtlar:")
            for u in unmatched_list:
                print(f"  - {u['name']} ({u['city']})")
    finally:
        db.close()


if __name__ == "__main__":
    main()

