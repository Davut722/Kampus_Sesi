import argparse
import csv
import json
import os
import re
import sys
import time
import unicodedata
import requests

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
for _p in (PROJECT_ROOT, BACKEND_DIR):
    if _p not in sys.path:
        sys.path.insert(0, _p)

from database import SessionLocal, KykDorm, init_db

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
KYK_CACHE_PATH = os.path.join(DATA_DIR, "kyk_cache_by_city.json")
GEOCODE_CACHE_PATH = os.path.join(DATA_DIR, "dorm_geocode_cache.json")
UNMATCHED_PATH = os.path.join(DATA_DIR, "dorm_geocode_unmatched.json")
ESLESMEYENLER_CSV = os.path.join(DATA_DIR, "eslesmeyenler.csv")

USER_AGENT_STR = "KampusSesi/1.0 (iletisim: destek@kampussesi.com)"
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
    "ç": "c", "Ç": "c",
    "ğ": "g", "Ğ": "g",
    "ı": "i", "I": "i",
    "İ": "i", "i": "i",
    "ö": "o", "Ö": "o",
    "ş": "s", "Ş": "s",
    "ü": "u", "Ü": "u",
    "â": "a", "Â": "a",
    "î": "i", "Î": "i",
    "û": "u", "Û": "u",
})

def normalize_tr(text: str) -> str:
    if not text:
        return ""
    s = unicodedata.normalize("NFC", str(text))
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
    s = re.sub(r"\bMüdürlüğü\b|\bMüdürlük\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bSos\.?\s*Yar\.?\s*Day\.?\s*Vak\.?\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bKyk\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bKız\s*(?:ve|Ve|/|-)?\s*Erkek\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bKız\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bErkek\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bÖğrenci\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\bYurdu\b|\bYurt\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\s+", " ", s).strip(" -.,")
    return s

def build_candidate_queries(dorm_name: str, city: str, district: str = "") -> list[str]:
    core = extract_core_dorm_name(dorm_name)
    candidates = []

    def add(q):
        q = re.sub(r"\s+", " ", str(q)).strip()
        if q and q not in candidates:
            candidates.append(q)

    if core:
        if district:
            add(f"{core} Yurdu, {district}, {city}")
            add(f"{core}, {district}, {city}")
        add(f"{core} Yurdu, {city}")
        add(f"{core} Öğrenci Yurdu, {city}")
        add(f"KYK {core} Yurdu, {city}")
        if normalize_tr(core) != normalize_tr(city):
            add(f"{core}, {city}")
            tokens = [t for t in re.split(r"[\s.]+", core) if len(t) >= 3]
            if len(tokens) >= 2:
                add(f"{tokens[0]}, {city}")
    else:
        add(f"{dorm_name}, {city}")
    return candidates

def result_matches_city(item: dict, city: str) -> bool:
    norm_city = normalize_tr(city)
    raw_disp = item.get("display_name", "")
    parts = [normalize_tr(p) for p in raw_disp.split(",") if p.strip()]
    if not parts:
        return False
    tail_parts = parts if len(parts) <= 4 else parts[-5:]
    for seg in tail_parts:
        if seg == norm_city or seg == f"{norm_city} merkez":
            return True
    addr = item.get("address") or {}
    for k in ("province", "state", "city", "county"):
        if normalize_tr(addr.get(k, "")) == norm_city:
            return True
    return False

def load_all_source_dorms() -> list[dict]:
    """kyk_cache_by_city.json dosyasından 611 yurdun tamamını okur."""
    all_dorms = []
    if not os.path.exists(KYK_CACHE_PATH):
        return all_dorms

    with open(KYK_CACHE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    for slug, dlist in data.items():
        city_name = CITIES_TR.get(slug.lower(), slug.capitalize())
        for d in dlist:
            raw_name = (d.get("name") or "").strip()
            if raw_name:
                all_dorms.append({
                    "name": raw_name,
                    "city": city_name,
                    "city_slug": slug,
                    "district": (d.get("ilce") or d.get("district") or "").strip(),
                    "type": (d.get("type") or "Karma").strip(),
                })
    return all_dorms

def main():
    parser = argparse.ArgumentParser(
        description="Kaynak listedeki (kyk_cache_by_city.json) tüm KYK yurtları için koordinat çözer."
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
        source_dorms = load_all_source_dorms()
        print(f"Kaynak kyk_cache_by_city.json içindeki toplam yurt: {len(source_dorms)}")

        # Eksik olanları belirle
        target_list = []
        for d in source_dorms:
            cache_key = f"{d['city']}::{d['name']}"
            cached_entry = cache.get(cache_key)
            if not cached_entry or cached_entry.get("lat") is None or cached_entry.get("lng") is None:
                target_list.append(d)

        print(f"Önceden koordinatı çözülmüş kayıt sayısı       : {len(source_dorms) - len(target_list)}")
        print(f"Koordinat aranacak / çözülmesi gereken yurt   : {len(target_list)}")

        if args.limit is not None and args.limit >= 0:
            target_list = target_list[:args.limit]

        client = NominatimClient()
        found_list = []
        unmatched_list = []

        for idx, d in enumerate(target_list, start=1):
            dorm_name = d["name"]
            city = d["city"]
            district = d["district"]
            cache_key = f"{city}::{dorm_name}"

            candidates = build_candidate_queries(dorm_name, city, district)
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
                "district": district,
                "lat": lat,
                "lng": lng,
                "query": matched_q,
                "display_name": disp_name,
            }
            with open(GEOCODE_CACHE_PATH, "w", encoding="utf-8") as f:
                json.dump(cache, f, ensure_ascii=False, indent=2)

            if lat is not None and lng is not None:
                found_list.append({
                    "name": dorm_name,
                    "city": city,
                    "district": district,
                    "lat": lat,
                    "lng": lng,
                    "query": matched_q,
                    "display_name": disp_name,
                })
                print(f"[{idx}/{len(target_list)}] BULUNDU: {dorm_name} ({city}) -> ({lat:.6f}, {lng:.6f})")
            else:
                unmatched_list.append({
                    "name": dorm_name,
                    "city": city,
                    "district": district,
                    "reason": "Nominatim aramasında şehir eşleşmesi bulunamadı",
                })
                print(f"[{idx}/{len(target_list)}] BULUNAMADI: {dorm_name} ({city})")

        # Unmatched JSON ve CSV dökümü
        with open(UNMATCHED_PATH, "w", encoding="utf-8") as f:
            json.dump(unmatched_list, f, ensure_ascii=False, indent=2)

        with open(ESLESMEYENLER_CSV, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["ad", "sehir", "ilce", "neden"])
            for u in unmatched_list:
                writer.writerow([u["name"], u["city"], u.get("district", ""), u.get("reason", "Koordinat bulunamadı")])

        print(f"\nGeocoding tamamlandı. Başarılı: {len(found_list)}, Bulunamayan: {len(unmatched_list)}")
        print(f"Eşleşmeyenler raporu yazıldı: {ESLESMEYENLER_CSV}")

    finally:
        db.close()

if __name__ == "__main__":
    main()
