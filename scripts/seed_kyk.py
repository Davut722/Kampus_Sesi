import argparse
import csv
import json
import math
import os
import re
import sys
import unicodedata

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
for _p in (PROJECT_ROOT, BACKEND_DIR):
    if _p not in sys.path:
        sys.path.insert(0, _p)

from database import (
    SessionLocal,
    University,
    UniversityAddress,
    KykDorm,
    UniversityDorm,
    init_db,
)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
KYK_CACHE_PATH = os.path.join(DATA_DIR, "kyk_cache_by_city.json")
GEOCODE_CACHE_PATH = os.path.join(DATA_DIR, "dorm_geocode_cache.json")
ESLESMEYENLER_CSV = os.path.join(DATA_DIR, "eslesmeyenler.csv")

# Eşik değerleri
MAX_CLOSE_DISTANCE_KM = 10.0
MAX_FAR_DISTANCE_KM = 30.0

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

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0088
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi, d_lambda = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2.0)**2
    return r * 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

def format_distance_label(distance_km: float) -> str:
    if distance_km is None:
        return "Mesafe bilinmiyor"
    if distance_km < 1.0:
        meters = max(1, int(round(distance_km * 1000)))
        return f"Kuş uçuşu {meters} m"
    return f"Kuş uçuşu {distance_km:.1f} km".replace(".", ",")

def sync_source_dorms_to_db(db, dry_run: bool = False):
    """
    kyk_cache_by_city.json ve dorm_geocode_cache.json verilerini kyk_dorms tablosuna UPSERT eder.
    Mevcut ve elle eklenmiş (source='manual') kayıtları ezmez.
    """
    if not os.path.exists(KYK_CACHE_PATH):
        print(f"[HATA] Kaynak dosya bulunamadı: {KYK_CACHE_PATH}")
        return 0, 0

    with open(KYK_CACHE_PATH, "r", encoding="utf-8") as f:
        kyk_by_city = json.load(f)

    geocode_cache = {}
    if os.path.exists(GEOCODE_CACHE_PATH):
        with open(GEOCODE_CACHE_PATH, "r", encoding="utf-8") as f:
            geocode_cache = json.load(f)

    # Veritabanındaki mevcut kayıtları indexle (norm_name, norm_city) -> row
    existing_rows = db.query(KykDorm).all()
    existing_index = {}
    for r in existing_rows:
        key = (normalize_tr(r.name), normalize_tr(r.city or ""))
        existing_index[key] = r

    inserted = 0
    updated = 0
    total_processed = 0

    for slug, dlist in kyk_by_city.items():
        city_name = CITIES_TR.get(slug.lower(), slug.capitalize())
        for d in dlist:
            raw_name = (d.get("name") or "").strip()
            if not raw_name:
                continue
            total_processed += 1
            key = (normalize_tr(raw_name), normalize_tr(city_name))

            # Koordinatları önbellekten çöz
            cache_key = f"{city_name}::{raw_name}"
            geo_entry = geocode_cache.get(cache_key) or {}
            if not geo_entry:
                norm_raw = normalize_tr(raw_name)
                for k, v in geocode_cache.items():
                    if normalize_tr(v.get("name", "")) == norm_raw:
                        geo_entry = v
                        break

            lat = float(geo_entry["lat"]) if geo_entry.get("lat") is not None else None
            lng = float(geo_entry["lng"]) if geo_entry.get("lng") is not None else None
            district = (d.get("ilce") or d.get("district") or "").strip()
            dorm_type = (d.get("type") or "Karma").strip()

            existing = existing_index.get(key)
            if existing:
                if existing.source == "manual":
                    continue
                changed = False
                if lat is not None and existing.lat != lat:
                    existing.lat = lat
                    changed = True
                if lng is not None and existing.lng != lng:
                    existing.lng = lng
                    changed = True
                if city_name and existing.city != city_name:
                    existing.city = city_name
                    changed = True
                if district and existing.district != district:
                    existing.district = district
                    changed = True
                if dorm_type and existing.type != dorm_type:
                    existing.type = dorm_type
                    changed = True
                if changed:
                    updated += 1
            else:
                new_dorm = KykDorm(
                    university_id=1,
                    name=raw_name,
                    type=dorm_type,
                    distance="Mesafe bilinmiyor",
                    fee="Standart KYK",
                    capacity="Belirtilmedi",
                    lat=lat,
                    lng=lng,
                    city=city_name,
                    district=district,
                    source="system"
                )
                if not dry_run:
                    db.add(new_dorm)
                existing_index[key] = new_dorm
                inserted += 1

    if not dry_run:
        db.commit()

    print(f"KykDorm senkronizasyonu: {total_processed} yurt işlendi (Yeni: {inserted}, Güncellenen: {updated})")
    return inserted, updated

def main():
    parser = argparse.ArgumentParser(
        description="KYK yurtlarını üniversitelere Haversine ve İl havuzuna göre eşleştirir."
    )
    parser.add_argument("--dry-run", action="store_true", help="Veritabanına yazmadan çalışır.")
    args = parser.parse_args()

    init_db()
    db = SessionLocal()

    try:
        # 1. Kaynak yurtları DB ile senkronize et
        sync_source_dorms_to_db(db, dry_run=args.dry_run)

        # 2. Üniversiteleri ve kampüs adreslerini al
        universities = db.query(University).order_by(University.id.asc()).all()
        all_addresses = db.query(UniversityAddress).order_by(UniversityAddress.id.asc()).all()

        campuses_by_uni = {}
        for addr in all_addresses:
            campuses_by_uni.setdefault(addr.university_id, []).append(addr)

        # 3. Tüm yurtları tekilleştirilmiş olarak çek (source='manual' olanlar öncelikli)
        all_dorm_rows = db.query(KykDorm).order_by(KykDorm.id.asc()).all()
        unique_dorms_map = {}
        for d in all_dorm_rows:
            key = (normalize_tr(d.name), normalize_tr(d.city or ""))
            if key not in unique_dorms_map:
                unique_dorms_map[key] = d
            else:
                curr = unique_dorms_map[key]
                if curr.source != "manual" and (d.source == "manual" or (curr.lat is None and d.lat is not None)):
                    unique_dorms_map[key] = d

        unique_dorms = list(unique_dorms_map.values())
        print(f"Toplam benzersiz KYK yurdu: {len(unique_dorms)}")

        # Mevcut university_dorm ilişkilerini yükle
        existing_relations = {
            (rel.university_id, rel.dorm_id): rel
            for rel in db.query(UniversityDorm).all()
        }

        total_matches = 0
        inserted_relations = 0
        updated_relations = 0
        all_matched_dorm_ids = set()
        unmatched_dorms_report = []

        uni_match_counts = {}

        for uni in universities:
            campuses = campuses_by_uni.get(uni.id, [])
            valid_campuses = [c for c in campuses if c.latitude is not None and c.longitude is not None]
            uni_city = campuses[0].city if (campuses and campuses[0].city) else ""
            uni_city_norm = normalize_tr(uni_city)

            matched_for_uni = [] # list of (distance_km or None, dorm_obj, campus_label)

            for dorm in unique_dorms:
                dorm_city_norm = normalize_tr(dorm.city or "")
                best_dist = None
                best_campus = None

                # Koordinatlı mesafe hesabı
                if valid_campuses and dorm.lat is not None and dorm.lng is not None:
                    for c in valid_campuses:
                        dist = haversine_km(float(c.latitude), float(c.longitude), float(dorm.lat), float(dorm.lng))
                        if best_dist is None or dist < best_dist:
                            best_dist = dist
                            best_campus = c.campus_name or "Merkez Yerleşke"

                # Sadece adresi/koordinatı belirlenmiş ve kampüse <= 30 km olan yurtlar eşleştirilir
                if best_dist is not None and best_dist <= MAX_FAR_DISTANCE_KM:
                    matched_for_uni.append((round(best_dist, 2), dorm, best_campus))
                    all_matched_dorm_ids.add(dorm.id)

            # Sırala: Önce yakınlar (km artan sırada), sonra uzaklar, en son koordinatsızlar (None)
            matched_for_uni.sort(key=lambda x: (x[0] is None, x[0] if x[0] is not None else 9999))
            uni_match_counts[uni.id] = len(matched_for_uni)
            total_matches += len(matched_for_uni)

            if not args.dry_run:
                # Bu üniversiteye ait artık geçerli olmayan eski eşleşmeleri temizle
                valid_dorm_ids_for_uni = {d.id for _, d, _ in matched_for_uni}
                for (r_uid, r_did), rel_obj in list(existing_relations.items()):
                    if r_uid == uni.id and r_did not in valid_dorm_ids_for_uni:
                        db.delete(rel_obj)
                        del existing_relations[(r_uid, r_did)]

                # Yeni veya güncellenen eşleşmeleri kaydet (UPSERT)
                for rounded_dist, dorm, best_campus in matched_for_uni:
                    key = (uni.id, dorm.id)
                    if key in existing_relations:
                        rel = existing_relations[key]
                        if rel.distance_km != rounded_dist or rel.nearest_campus != best_campus:
                            rel.distance_km = rounded_dist
                            rel.nearest_campus = best_campus
                            updated_relations += 1
                    else:
                        new_rel = UniversityDorm(
                            university_id=uni.id,
                            dorm_id=dorm.id,
                            distance_km=rounded_dist,
                            nearest_campus=best_campus,
                        )
                        db.add(new_rel)
                        existing_relations[key] = new_rel
                        inserted_relations += 1

                    if rounded_dist is not None:
                        dorm.distance = format_distance_label(rounded_dist)

        if not args.dry_run:
            db.commit()

        # Hiçbir üniversiteye bağlanamayan yurtları kontrol et
        for dorm in unique_dorms:
            if dorm.id not in all_matched_dorm_ids:
                if dorm.lat is None or dorm.lng is None:
                    reason = "Adres/koordinat bilgisi bulunamadığı için elendi"
                else:
                    reason = "Üniversite kampüslerine 30 km'den uzak olduğu için elendi"
                unmatched_dorms_report.append({
                    "name": dorm.name,
                    "city": dorm.city or "",
                    "district": dorm.district or "",
                    "reason": reason
                })

        with open(ESLESMEYENLER_CSV, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["ad", "sehir", "ilce", "neden"])
            for u in unmatched_dorms_report:
                writer.writerow([u["name"], u["city"], u["district"], u["reason"]])

        total_unis = len(universities)
        zero_dorm_unis = sum(1 for cnt in uni_match_counts.values() if cnt == 0)

        print("\n============================================================")
        print("KYK YURT - ÜNİVERSİTE GELİŞMİŞ EŞLEŞTİRME RAPORU")
        print("============================================================")
        print(f"Toplam tekil KYK yurdu                : {len(unique_dorms)}")
        print(f"En az bir üniversiteye bağlanan yurt  : {len(all_matched_dorm_ids)}")
        print(f"Eşleşmeyen yurt sayısı                : {len(unmatched_dorms_report)} (Detay: {ESLESMEYENLER_CSV})")
        print(f"Toplam eşleşme (university_dorm)      : {total_matches} (Yeni: {inserted_relations}, Güncellenen: {updated_relations})")
        print(f"Sıfır yurt kalan üniversite sayısı    : {zero_dorm_unis} / {total_unis}")

    finally:
        db.close()

if __name__ == "__main__":
    main()
