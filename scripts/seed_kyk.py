import argparse
import json
import math
import os
import sys

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
from scripts.geocode_dorms import normalize_tr, load_dorm_city_map, result_matches_city

# Eşleşme mesafe eşiği (km) — tek sabitte tutulur
MAX_DORM_DISTANCE_KM = 10.0

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
GEOCODE_CACHE_PATH = os.path.join(DATA_DIR, "dorm_geocode_cache.json")
UNMATCHED_PATH = os.path.join(DATA_DIR, "dorm_geocode_unmatched.json")


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """İki koordinat arasındaki kuş uçuşu Haversine mesafesini (km) hesaplar."""
    r = 6371.0088
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(d_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return r * c


def format_distance_label(distance_km: float) -> str:
    """1 km altında metre, 1 km ve üzerinde virgüllü km etiketi üretir."""
    if distance_km < 1.0:
        meters = max(1, int(round(distance_km * 1000)))
        return f"Kuş uçuşu {meters} m"
    return f"Kuş uçuşu {distance_km:.1f} km".replace(".", ",")


def sync_cached_coords_to_db(db, dry_run: bool = False) -> int:
    """dorm_geocode_cache.json içindeki koordinatları doğrular ve KykDorm satırlarına senkronize eder."""
    if not os.path.exists(GEOCODE_CACHE_PATH):
        return 0
    try:
        with open(GEOCODE_CACHE_PATH, "r", encoding="utf-8") as f:
            cache = json.load(f)
    except Exception:
        return 0

    name_to_coords = {}
    invalid_names = set()
    cache_modified = False

    for key, val in cache.items():
        if not isinstance(val, dict):
            continue
        norm_name = normalize_tr(val.get("name", ""))
        city = val.get("city", "")
        if val.get("lat") is not None and val.get("lng") is not None:
            if city and val.get("display_name") and not result_matches_city(val, city):
                val["lat"] = None
                val["lng"] = None
                val["query"] = None
                val["display_name"] = None
                invalid_names.add(norm_name)
                cache_modified = True
            elif norm_name:
                name_to_coords[norm_name] = (float(val["lat"]), float(val["lng"]))

    if cache_modified and not dry_run:
        with open(GEOCODE_CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)
        unmatched_list = [
            {"name": v.get("name"), "city": v.get("city")}
            for v in cache.values()
            if isinstance(v, dict) and (v.get("lat") is None or v.get("lng") is None)
        ]
        with open(UNMATCHED_PATH, "w", encoding="utf-8") as f:
            json.dump(unmatched_list, f, ensure_ascii=False, indent=2)

    updated = 0
    all_rows = db.query(KykDorm).order_by(KykDorm.id.asc()).all()
    for row in all_rows:
        norm_r = normalize_tr(row.name)
        if norm_r in invalid_names and (row.lat is not None or row.lng is not None):
            row.lat = None
            row.lng = None
            updated += 1
        elif row.lat is None or row.lng is None:
            coords = name_to_coords.get(norm_r)
            if coords:
                row.lat, row.lng = coords
                updated += 1

    if updated > 0 and not dry_run:
        db.commit()
    return updated


def main():
    parser = argparse.ArgumentParser(
        description="KYK yurtlarını üniversite yerleşkelerine Haversine yakınlığına (<= 10 km) göre eşleştirir."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Veritabanına yazmadan eşleşmeleri hesaplar ve raporlar.",
    )
    args = parser.parse_args()

    init_db()
    db = SessionLocal()

    try:
        sync_cached_coords_to_db(db, dry_run=args.dry_run)

        all_dorm_rows = db.query(KykDorm).order_by(KykDorm.id.asc()).all()
        unique_dorms_by_name = {}
        for d in all_dorm_rows:
            norm_name = normalize_tr(d.name)
            if norm_name not in unique_dorms_by_name:
                unique_dorms_by_name[norm_name] = d
            else:
                # Koordinatı olan satırı tercih et
                existing = unique_dorms_by_name[norm_name]
                if (existing.lat is None or existing.lng is None) and (d.lat is not None and d.lng is not None):
                    unique_dorms_by_name[norm_name] = d

        unique_dorms = list(unique_dorms_by_name.values())
        geocoded_dorms = [d for d in unique_dorms if d.lat is not None and d.lng is not None]
        missing_coord_dorms = [d for d in unique_dorms if d.lat is None or d.lng is None]

        universities = db.query(University).order_by(University.id.asc()).all()
        all_addresses = db.query(UniversityAddress).order_by(UniversityAddress.id.asc()).all()

        campuses_by_uni = {}
        for addr in all_addresses:
            campuses_by_uni.setdefault(addr.university_id, []).append(addr)

        missing_coord_unis = []
        uni_match_counts = {}
        uni_matches_detail = {}

        existing_relations = {
            (rel.university_id, rel.dorm_id): rel
            for rel in db.query(UniversityDorm).all()
        }

        total_matches = 0
        inserted_count = 0
        updated_count = 0

        for uni in universities:
            campuses = campuses_by_uni.get(uni.id, [])
            valid_campuses = [
                c for c in campuses
                if c.latitude is not None and c.longitude is not None
            ]
            if not valid_campuses:
                missing_coord_unis.append(uni.name)
                uni_match_counts[uni.id] = 0
                uni_matches_detail[uni.name] = []
                continue

            matched_for_uni = []
            for dorm in geocoded_dorms:
                best_dist = None
                best_campus = None
                for c in valid_campuses:
                    dist = haversine_km(
                        float(c.latitude),
                        float(c.longitude),
                        float(dorm.lat),
                        float(dorm.lng),
                    )
                    if best_dist is None or dist < best_dist:
                        best_dist = dist
                        best_campus = c.campus_name or "Merkez Yerleşke"

                if best_dist is not None and best_dist <= MAX_DORM_DISTANCE_KM:
                    rounded_dist = round(best_dist, 2)
                    matched_for_uni.append((rounded_dist, dorm, best_campus))

            matched_for_uni.sort(key=lambda x: x[0])
            uni_match_counts[uni.id] = len(matched_for_uni)
            uni_matches_detail[uni.name] = matched_for_uni
            total_matches += len(matched_for_uni)

            if not args.dry_run:
                valid_dorm_ids_for_uni = {dorm.id for _, dorm, _ in matched_for_uni}
                for (r_uid, r_did), rel_obj in list(existing_relations.items()):
                    if r_uid == uni.id and r_did not in valid_dorm_ids_for_uni:
                        db.delete(rel_obj)
                        del existing_relations[(r_uid, r_did)]

                for rounded_dist, dorm, best_campus in matched_for_uni:
                    key = (uni.id, dorm.id)
                    if key in existing_relations:
                        rel = existing_relations[key]
                        if rel.distance_km != rounded_dist or rel.nearest_campus != best_campus:
                            rel.distance_km = rounded_dist
                            rel.nearest_campus = best_campus
                            updated_count += 1
                    else:
                        new_rel = UniversityDorm(
                            university_id=uni.id,
                            dorm_id=dorm.id,
                            distance_km=rounded_dist,
                            nearest_campus=best_campus,
                        )
                        db.add(new_rel)
                        existing_relations[key] = new_rel
                        inserted_count += 1

                    # KykDorm satırındaki sabit mesafe etiketini de gerçek kuş uçuşu mesafeyle güncelle
                    dorm.distance = format_distance_label(rounded_dist)

        if not args.dry_run:
            db.commit()

        total_uni_count = len(universities)
        zero_dorm_unis = sum(1 for cnt in uni_match_counts.values() if cnt == 0)
        avg_dorms = (total_matches / total_uni_count) if total_uni_count else 0.0

        print("============================================================")
        print(f"KYK YURT - ÜNİVERSİTE YAKINLIK EŞLEŞTİRME RAPORU (<= {MAX_DORM_DISTANCE_KM} km)")
        print("============================================================")
        print(f"Toplam kyk_dorms satırı                 : {len(all_dorm_rows)}")
        print(f"Toplam tekil yurt sayısı                : {len(unique_dorms)}")
        print(f"Koordinatı bulunan tekil yurt           : {len(geocoded_dorms)}")
        print(f"Koordinatı bulunamayan tekil yurt       : {len(missing_coord_dorms)}")
        print(f"Koordinatı olmayan üniversite sayısı    : {len(missing_coord_unis)}")
        print(f"Toplam eşleşme (university_dorm)        : {total_matches} (Yeni: {inserted_count}, Güncellenen: {updated_count})")
        print(f"Üniversite başına ortalama yakın yurt   : {avg_dorms:.2f}")
        print(f"Yakınında hiç yurt çıkmayan üniversite  : {zero_dorm_unis} / {total_uni_count}")

        if missing_coord_dorms:
            print("\nKoordinatı Bulunamayan Yurtlar (Eşleşmeye Dahil Edilmedi):")
            for md in missing_coord_dorms:
                print(f"  - {md.name}")

        if missing_coord_unis:
            print("\nKoordinatı Olmayan Üniversiteler (Eşleşmeye Dahil Edilmedi):")
            for mu in missing_coord_unis:
                print(f"  - {mu}")

        sample_targets = [
            ("Bandırma Onyedi Eylül", "Bandırma Onyedi Eylül Üniversitesi"),
            ("Balıkesir", "Balıkesir Üniversitesi"),
            ("Ankara", "Ankara Üniversitesi"),
            ("ODTÜ", "Orta Doğu Teknik Üniversitesi"),
            ("İTÜ", "İstanbul Teknik Üniversitesi"),
        ]
        print("\n--- 5 Örnek Üniversite Yakın Yurt Sayıları ---")
        for short_label, target_name in sample_targets:
            found_uni = None
            for u in universities:
                if u.name == target_name or target_name.lower() in u.name.lower():
                    found_uni = u
                    break
            if found_uni:
                matches = uni_matches_detail.get(found_uni.name, [])
                preview = ", ".join(
                    f"{m[1].name} ({format_distance_label(m[0])})"
                    for m in matches[:3]
                )
                print(f"  * {found_uni.name}: {len(matches)} yurt" + (f" -> Örn: {preview}" if preview else ""))
    finally:
        db.close()


if __name__ == "__main__":
    main()

