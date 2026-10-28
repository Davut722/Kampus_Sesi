import argparse
import json
import os
import re
import sys
import unicodedata
from datetime import date

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
for _p in (PROJECT_ROOT, BACKEND_DIR):
    if _p not in sys.path:
        sys.path.insert(0, _p)

from database import SessionLocal, University, init_db

DEFAULT_INPUT = os.path.join(DATA_DIR, "about_texts.json")

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


def main():
    parser = argparse.ArgumentParser(
        description="about_texts.json verilerini University tablosuna yükler (varsayılan: DRY-RUN)."
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Değişiklikleri veritabanına gerçekten yazar (verilmezse DRY-RUN çalışır).",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Zaten about alanı dolu olan kayıtların da üzerine yazar.",
    )
    parser.add_argument(
        "--input",
        type=str,
        default=DEFAULT_INPUT,
        help="Okunacak JSON dosyası yolu (varsayılan: scripts/about_texts.json).",
    )
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Hata: Giriş dosyası bulunamadı: {args.input}")
        sys.exit(1)

    with open(args.input, "r", encoding="utf-8") as f:
        records = json.load(f)

    init_db()
    db = SessionLocal()
    try:
        universities = db.query(University).all()
        uni_by_norm = {}
        for u in universities:
            norm = normalize_tr(u.name)
            uni_by_norm[norm] = u

        today = date.today()
        will_update = []
        skipped_empty = []
        skipped_existing = []
        unmatched = []

        for item in records:
            name = (item.get("name") or "").strip()
            about = (item.get("about") or "").strip()
            source = (item.get("source") or "").strip()

            if not about:
                skipped_empty.append(name)
                continue

            norm_name = normalize_tr(name)
            uni = uni_by_norm.get(norm_name)
            if not uni:
                unmatched.append(name)
                continue

            has_existing = bool(uni.about and uni.about.strip())
            if has_existing and not args.overwrite:
                skipped_existing.append(uni.name)
                continue

            will_update.append((uni, about, source))

        mode_label = "APPLY (YAZMA MODU)" if args.apply else "DRY-RUN (SALT KONTROL MODU)"
        print(f"=== {mode_label} ===")
        print(f"Toplam JSON kaydı          : {len(records)}")
        print(f"Boş about (atlanan)        : {len(skipped_empty)}")
        print(f"Zaten dolu (atlanan)       : {len(skipped_existing)}")
        print(f"Eşleşmeyen kayıt sayısı    : {len(unmatched)}")
        print(f"Güncellenecek kayıt sayısı : {len(will_update)}")

        if unmatched:
            print("\nEşleşmeyen Üniversiteler:")
            for u_name in unmatched:
                print(f"  - {u_name}")

        if args.apply and will_update:
            for uni, about, source in will_update:
                uni.about = about
                uni.about_source = source
                uni.about_updated = today
            db.commit()
            print(f"\nBaşarılı: {len(will_update)} üniversitenin 'about' bilgisi güncellendi (about_updated={today.isoformat()}).")
        elif not args.apply:
            print("\nNot: DRY-RUN modunda hiçbir değişiklik yazılmadı. Veritabanına yazmak için '--apply' parametresini ekleyin.")
    finally:
        db.close()


if __name__ == "__main__":
    main()

