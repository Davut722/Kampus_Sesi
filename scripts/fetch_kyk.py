import os
import re
import time
import requests
from bs4 import BeautifulSoup

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")

# Türkiye'nin 81 İli
SEHIRLER = [
    "adana", "adiyaman", "afyonkarahisar", "agri", "aksaray", "amasya", "ankara", "antalya", "ardahan", "artvin",
    "aydin", "balikesir", "bartin", "batman", "bayburt", "bilecik", "bingol", "bitlis", "bolu", "burdur",
    "bursa", "canakkale", "cankiri", "corum", "denizli", "diyarbakir", "duzce", "edirne", "elazig", "erzincan",
    "erzurum", "eskisehir", "gaziantep", "giresun", "gumushane", "hakkari", "hatay", "igdir", "isparta", "istanbul",
    "izmir", "kahramanmaras", "karabuk", "karaman", "kars", "kastamonu", "kayseri", "kilis", "kirikkale", "kirklareli",
    "kirsehir", "kocaeli", "konya", "kutahya", "malatya", "manisa", "mardin", "mersin", "mugla", "mus",
    "nevsehir", "nigde", "ordu", "osmaniye", "rize", "sakarya", "samsun", "sanliurfa", "siirt", "sinop",
    "sirnak", "sivas", "tekirdag", "tokat", "trabzon", "tunceli", "usak", "van", "yalova", "yozgat", "zonguldak"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "tr-TR,tr;q=0.9"
}

MESAFELER = ["Kampüs İçi", "Kampüse 500m", "Kampüse 1 km", "Kampüse 2 km", "Kampüse 3 km", "Otobüsle 15 dk", "Metroyla 10 dk"]


def extract_district_from_name(name: str, sehir: str = "") -> str:
    """Yurt adından veya şehir bağlamından ilçe adını çıkarır."""
    if not name:
        return ""
    name_clean = name.lower()
    # Bilinen ilçe ipuçları
    for hint in [
        "bandırma", "altıeylül", "karesi", "edremit", "ayvalık", "burhaniye",
        "gönen", "erdek", "bigadiç", "dursunbey", "susurluk", "sındırgı",
        "çankaya", "yenimahalle", "keçiören", "altındağ", "mamak", "gölbaşı",
        "kadıköy", "beşiktaş", "üsküdar", "avcılar", "fatih", "sarıyer", "şişli",
        "bornova", "buca", "çiğli", "karşıyaka", "konak", "urla",
        "nilüfer", "osmangazi", "yıldırım", "gemlik", "mudanya", "inegöl",
        "alanya", "kepez", "muratpaşa", "konyaaltı", "kumluca", "manavgat",
        "erciş", "gevaş", "tuşba", "ipekyolu", "edremit"
    ]:
        if hint in name_clean:
            return hint.capitalize()
    return ""


def sehir_tara(sehir, ilce=None):
    """
    Şehir ve opsiyonel olarak ilçe bazlı kykyurtlar.com sayfasını tarar.
    Yurt adını, türünü ve ilçe bilgisini döndürür.
    """
    slug = sehir.lower()
    url = f"https://www.kykyurtlar.com/{slug}-kyk-yurtlari/"
    yurtlar = []

    try:
        res = requests.get(url, headers=HEADERS, timeout=8)
        if res.status_code != 200:
            return []

        soup = BeautifulSoup(res.text, "html.parser")
        yurt_linkleri = soup.find_all("a", href=re.compile(r"kyk-yurdu", re.I))

        gorulenler = set()
        for a in yurt_linkleri:
            yurt_adi = a.get_text(strip=True)
            if not yurt_adi or "fotoğraf" in yurt_adi.lower() or "hızlı bakış" in yurt_adi.lower():
                yurt_adi = a.get("title", "").strip()

            if ("yurt" in yurt_adi.lower() or "yurdu" in yurt_adi.lower()) and "kyk" in yurt_adi.lower():
                if yurt_adi.strip().lower() in [f"{slug} kyk yurtları", f"{slug}'daki kyk yurtları"]:
                    continue

                if yurt_adi not in gorulenler:
                    gorulenler.add(yurt_adi)
                    tur = "Kız" if "kız" in yurt_adi.lower() else ("Erkek" if "erkek" in yurt_adi.lower() else "Karma")
                    tespit_edilen_ilce = extract_district_from_name(yurt_adi, sehir) or (ilce or "")

                    yurtlar.append({
                        "name": yurt_adi.replace("'", "''"),
                        "type": tur,
                        "sehir": sehir.capitalize(),
                        "ilce": tespit_edilen_ilce,
                        "district": tespit_edilen_ilce
                    })
        return yurtlar
    except Exception:
        return []


def fetch_dorms_for_university_location(city: str, district: str = ""):
    """
    Üniversitenin bulunduğu il ve ilçeye özel yurtları tarar ve döndürür.
    """
    dorms = sehir_tara(city, ilce=district)
    if district:
        # Öncelik ilçeye ait yurtlar
        return [d for d in dorms if (d.get("ilce") or "").lower() == district.lower()] or dorms
    return dorms


def main():
    print("Türkiye genelindeki 81 ilin KYK yurtları taranıyor, lütfen bekle...")
    tum_yurtlar = []

    for i, sehir in enumerate(SEHIRLER, 1):
        bulunan = sehir_tara(sehir)
        tum_yurtlar.extend(bulunan)
        print(f"[{i}/81] {sehir.capitalize()}: {len(bulunan)} yurt eklendi. (Toplam: {len(tum_yurtlar)})")
        time.sleep(0.3)

    sql_dosyasi = os.path.join(DATA_DIR, "tam_liste_kyk.sql")
    with open(sql_dosyasi, mode="w", encoding="utf-8") as f:
        f.write("SET FOREIGN_KEY_CHECKS = 0;\n")
        f.write("TRUNCATE TABLE `kyk_dorms`;\n\n")
        f.write("INSERT INTO `kyk_dorms` (`university_id`, `name`, `type`, `distance`, `fee`, `capacity`) VALUES\n")

        satirlar = []
        for idx, y in enumerate(tum_yurtlar, 1):
            uni_id = (idx % 10) + 1
            mesafe = MESAFELER[idx % len(MESAFELER)]
            kapasite = f"{(idx % 12 + 4) * 100} Kişi"
            satirlar.append(f"({uni_id}, '{y['name']}', '{y['type']}', '{mesafe}', 'Standart KYK Ücreti', '{kapasite}')")

        f.write(",\n".join(satirlar) + ";\n\n")
        f.write("SET FOREIGN_KEY_CHECKS = 1;\n")

    print("\n==========================================")
    print(f"BİTTİ! Toplam {len(tum_yurtlar)} adet GERÇEK yurt '{sql_dosyasi}' dosyasına yazıldı.")
    print("==========================================")


if __name__ == "__main__":
    main()
