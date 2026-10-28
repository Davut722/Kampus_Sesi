#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to update university image_url in MySQL database with official logo URLs
from Wikipedia / Wikimedia Commons instead of campus/building photos.
"""

import os
import sys
import time
import requests

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
for _p in (PROJECT_ROOT, BACKEND_DIR):
    if _p not in sys.path:
        sys.path.insert(0, _p)

from database import SessionLocal, University

HEADERS = {"User-Agent": "KampusSesiAcademicBot/2.0 (contact@kampussesi.com)"}

# Explicit mapped logo file titles on Wikipedia (Turkish or Commons)
EXPLICIT_FILE_TITLES = {
    "Boğaziçi Üniversitesi": "Boğaziçi Üniversitesi Logo.png",
    "İstanbul Teknik Üniversitesi": "İTÜ logo.png",
    "Koç Üniversitesi": "Koç University logo.svg",
    "Sabancı Üniversitesi": "Sabancı University logo.svg",
    "Özyeğin Üniversitesi": "Özyeğin University logo.svg",
    "Bahçeşehir Üniversitesi": "Bahçeşehir Üniversitesi logo.png",
    "Kadir Has Üniversitesi": "Kadir Has Üniversitesi logo.png",
    "Anadolu Üniversitesi": "Anadolu Üniversitesi Logosu.svg",
    "Galatasaray Üniversitesi": "Galatasaray Üniversitesi Mezunlar Derneği Logosu.png",
    "Çankaya Üniversitesi": "Çankaya Üniversitesi logo.png",
    "Fenerbahçe Üniversitesi": "FBU logo.svg",
    "Mimar Sinan Güzel Sanatlar Üniversitesi": "Mimar Sinan Güzel Sanatlar Üniversitesi logo.png",
    "Işık Üniversitesi": "Iu logo-mavi.png",
    "Yaşar Üniversitesi": "Yaşar Üniversitesi logo.png",
    "Burdur Mehmet Akif Ersoy Üniversitesi": "Burdur Mehmet Akif Ersoy University logotype.svg",
    "Karadeniz Teknik Üniversitesi": "Blackseatechnical university.png",
    "Gebze Teknik Üniversitesi": "Gebze Teknik Üniversitesi.PNG",
    "İskenderun Teknik Üniversitesi": "İskenderun Teknik Üniversitesi.png",
    "Recep Tayyip Erdoğan Üniversitesi": "Recep Tayyip Erdoğan Üniversitesi.png",
    "Trabzon Üniversitesi": "Trabzon Üniversitesi.png",
    "Çağ Üniversitesi": "Cag universitesi.png",
    "Yüksek İhtisas Üniversitesi": "Yuksek ihtisas universitesi.png",
    "İstanbul Esenyurt Üniversitesi": "İstanbul esenyurt universitesi.png",
    "Avrasya Üniversitesi": "Avrasya Üniversitesi.png",
    "Mudanya Üniversitesi": "Mudanya Üniversitesi.png",
    "Siirt Üniversitesi": "Siirt üniversitesi.png",
}

def resolve_file_url(filename):
    """Resolve direct image URL for a given File: title on tr.wikipedia.org or commons."""
    clean_title = filename if filename.startswith(("Dosya:", "File:")) else f"Dosya:{filename}"
    for domain in ["tr.wikipedia.org", "commons.wikimedia.org", "en.wikipedia.org"]:
        try:
            r = requests.get(
                f"https://{domain}/w/api.php",
                params={
                    "action": "query",
                    "titles": clean_title,
                    "prop": "imageinfo",
                    "iiprop": "url",
                    "format": "json"
                },
                headers=HEADERS,
                timeout=8
            )
            data = r.json()
            pages = data.get("query", {}).get("pages", {})
            for p in pages.values():
                if "imageinfo" in p and p["imageinfo"]:
                    url = p["imageinfo"][0].get("url")
                    if url:
                        return url.split("?")[0]
        except Exception:
            pass
    return None

def find_logo_from_page(uni_name):
    """Search for logo files on the university's Wikipedia article."""
    for domain in ["tr.wikipedia.org", "en.wikipedia.org"]:
        try:
            r = requests.get(
                f"https://{domain}/w/api.php",
                params={
                    "action": "query",
                    "titles": uni_name,
                    "prop": "images",
                    "imlimit": 50,
                    "format": "json"
                },
                headers=HEADERS,
                timeout=8
            )
            pages = r.json().get("query", {}).get("pages", {})
            for p in pages.values():
                for img in p.get("images", []):
                    title = img.get("title", "")
                    t_low = title.lower()
                    if any(x in t_low for x in ["commons-logo", "oojs", "symbol", "flag", "icon", "map", "metro"]):
                        continue
                    if any(x in t_low for x in ["logo", "arma", "emblem"]):
                        url = resolve_file_url(title)
                        if url:
                            return url
        except Exception:
            pass
    return None

def verify_url(url):
    """Verify that the image URL is accessible via HTTP GET."""
    try:
        r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=6, stream=True)
        return r.status_code == 200
    except Exception:
        return False

def main():
    db = SessionLocal()
    updated_count = 0

    print("=" * 60)
    print("Üniversite Logo Güncellemesi Başlatılıyor...")
    print("=" * 60)

    try:
        unis = db.query(University).all()
        for u in unis:
            name = u.name
            old_url = u.image_url or ""
            target_url = None

            # 1. Check explicit title map
            if name in EXPLICIT_FILE_TITLES:
                target_url = resolve_file_url(EXPLICIT_FILE_TITLES[name])

            # 2. If not found or not in map, search page if old_url is a photo
            if not target_url:
                is_photo = (
                    any(k in old_url.lower() for k in ["campus", "panoramio", "binas", "giris", "giri%c5%9f", "armory", "ist1", "front_door"]) or
                    (old_url.lower().endswith((".jpg", ".jpeg")) and not any(k in old_url.lower() for k in ["logo", "arma"])) or
                    "ui-avatars.com" in old_url.lower()
                )
                if is_photo:
                    target_url = find_logo_from_page(name)

            if target_url and target_url != old_url:
                u.image_url = target_url
                db.commit()
                updated_count += 1
                print(f"[GÜNCELLENDİ] {name}")
                print(f"   -> {target_url}")

        print("=" * 60)
        print(f"Sonuç: Toplam {updated_count} üniversite logosu resmi logoyla güncellendi!")
        print("=" * 60)

    finally:
        db.close()

if __name__ == "__main__":
    main()
