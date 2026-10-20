from database import (
    SessionLocal,
    engine,
    University,
    UniversityAddress,
    INITIAL_UNIVERSITY_ADDRESSES,
)


def seed_addresses():
    db = SessionLocal()
    try:
        # 1. university_addresses tablosunu (yoksa) oluştur
        UniversityAddress.__table__.create(engine, checkfirst=True)

        inserted = 0
        updated = 0

        for item in INITIAL_UNIVERSITY_ADDRESSES:
            uni_name = item["uni_name"]
            base_name = uni_name.split("(")[0].strip()

            # 2. universities tablosunda ilgili üniversiteyi bul (yoksa ekle)
            uni = db.query(University).filter(University.name == uni_name).first()
            if not uni:
                uni = db.query(University).filter(University.name == base_name).first()
            if not uni:
                uni = db.query(University).filter(University.name.ilike(f"%{base_name}%")).first()
            if not uni:
                uni = University(name=uni_name)
                db.add(uni)
                db.flush()

            # 3. Foreign Key (university_id) ile bağlı adres kaydını kontrol et
            addr = db.query(UniversityAddress).filter(UniversityAddress.university_id == uni.id).first()
            if not addr:
                addr = UniversityAddress(
                    university_id=uni.id,
                    campus_name=item["campus_name"],
                    city=item["city"],
                    district=item["district"],
                    full_address=item["full_address"],
                    transport_info=item["transport_info"],
                    latitude=item["latitude"],
                    longitude=item["longitude"],
                    zoom_level=item["zoom_level"],
                    google_maps_url=item["google_maps_url"],
                )
                db.add(addr)
                inserted += 1
            else:
                addr.campus_name = item["campus_name"]
                addr.city = item["city"]
                addr.district = item["district"]
                addr.full_address = item["full_address"]
                addr.transport_info = item["transport_info"]
                addr.latitude = item["latitude"]
                addr.longitude = item["longitude"]
                addr.zoom_level = item["zoom_level"]
                addr.google_maps_url = item["google_maps_url"]
                updated += 1

        db.commit()
        total = db.query(UniversityAddress).count()
        print(f"[BASARILI] university_addresses tablosu olusturuldu ve universities.id Foreign Key ile baglandi.")
        print(f" -> Yeni eklenen: {inserted} | Guncellenen: {updated} | Toplam Kayit: {total}")
    except Exception as e:
        db.rollback()
        print(f"[HATA] Adres tablosu doldurulurken hata olustu: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_addresses()

