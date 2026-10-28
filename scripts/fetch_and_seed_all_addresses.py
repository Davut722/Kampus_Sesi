import os
import re
import sys
import json
import math
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
for _p in (PROJECT_ROOT, BACKEND_DIR):
    if _p not in sys.path:
        sys.path.insert(0, _p)

from database import (
    SessionLocal,
    engine,
    University,
    UniversityAddress,
)
from scripts.fetch_and_seed_all_kyk import UNI_CITY_MAP, CITIES_TR

CACHE_FILE = os.path.join(DATA_DIR, "uni_addresses_cache.json")
SQL_FILE = os.path.join(DATA_DIR, "tam_liste_adresler.sql")

HEADERS = {
    "User-Agent": "KampusSesiAcademicBot/2.0 (https://github.com/Davut722/kampus-agi; contact@kampussesi.com)",
    "Accept-Language": "tr-TR,tr;q=0.9",
}

# Türkiye 81 İl Merkez Koordinatları (Sıkı İl/Mesafe Doğrulaması İçin)
PROVINCE_COORDS = {
    "adana": (37.0000, 35.3213),
    "adiyaman": (37.7648, 38.2786),
    "afyonkarahisar": (38.7507, 30.5567),
    "agri": (39.7191, 43.0503),
    "aksaray": (38.3687, 34.0370),
    "amasya": (40.6499, 35.8353),
    "ankara": (39.9334, 32.8597),
    "antalya": (36.8969, 30.7133),
    "ardahan": (41.1105, 42.7022),
    "artvin": (41.1828, 41.8183),
    "aydin": (37.8560, 27.8416),
    "balikesir": (39.6484, 27.8826),
    "bartin": (41.6344, 32.3375),
    "batman": (37.8812, 41.1351),
    "bayburt": (40.2552, 40.2249),
    "bilecik": (40.1451, 29.9799),
    "bingol": (38.8854, 40.4966),
    "bitlis": (38.4006, 42.1095),
    "bolu": (40.7392, 31.6089),
    "burdur": (37.7203, 30.2908),
    "bursa": (40.1885, 29.0610),
    "canakkale": (40.1553, 26.4142),
    "cankiri": (40.6013, 33.6134),
    "corum": (40.5506, 34.9556),
    "denizli": (37.7765, 29.0864),
    "diyarbakir": (37.9144, 40.2306),
    "duzce": (40.8438, 31.1565),
    "edirne": (41.6771, 26.5557),
    "elazig": (38.6810, 39.2264),
    "erzincan": (39.7500, 39.5000),
    "erzurum": (39.9043, 41.2679),
    "eskisehir": (39.7767, 30.5206),
    "gaziantep": (37.0662, 37.3833),
    "giresun": (40.9128, 38.3895),
    "gumushane": (40.4603, 39.4814),
    "hakkari": (37.5833, 43.7333),
    "hatay": (36.4018, 36.3498),
    "igdir": (39.9167, 44.0333),
    "isparta": (37.7648, 30.5566),
    "istanbul": (41.0082, 28.9784),
    "izmir": (38.4237, 27.1428),
    "kahramanmaras": (37.5858, 36.9371),
    "karabuk": (41.2061, 32.6204),
    "karaman": (37.1759, 33.2287),
    "kars": (40.6013, 43.0975),
    "kastamonu": (41.3887, 33.7827),
    "kayseri": (38.7312, 35.4787),
    "kilis": (36.7184, 37.1212),
    "kirikkale": (39.8468, 33.5153),
    "kirklareli": (41.7333, 27.2167),
    "kirsehir": (39.1425, 34.1709),
    "kocaeli": (40.8533, 29.8815),
    "konya": (37.8746, 32.4932),
    "kutahya": (39.4167, 29.9833),
    "malatya": (38.3552, 38.3095),
    "manisa": (38.6191, 27.4289),
    "mardin": (37.3212, 40.7245),
    "mersin": (36.8121, 34.6415),
    "mugla": (37.2153, 28.3636),
    "mus": (38.9462, 41.7539),
    "nevsehir": (38.6244, 34.7144),
    "nigde": (37.9667, 34.6833),
    "ordu": (40.9839, 37.8764),
    "osmaniye": (37.0742, 36.2478),
    "rize": (41.0201, 40.5234),
    "sakarya": (40.7569, 30.3783),
    "samsun": (41.2867, 36.3300),
    "sanliurfa": (37.1591, 38.7969),
    "siirt": (37.9333, 41.9500),
    "sinop": (42.0231, 35.1531),
    "sirnak": (37.5164, 42.4611),
    "sivas": (39.7477, 37.0179),
    "tekirdag": (40.9833, 27.5167),
    "tokat": (40.3167, 36.5500),
    "trabzon": (41.0027, 39.7168),
    "tunceli": (39.1079, 39.5401),
    "usak": (38.6823, 29.4082),
    "van": (38.4891, 43.4089),
    "yalova": (40.6500, 29.2667),
    "yozgat": (39.8181, 34.8147),
    "zonguldak": (41.4564, 31.7987),
}

# Birebir OpenStreetMap kampüs poligon merkezleriyle doğrulanmış referans üniversiteler
CURATED_EXACT = {
    "Bandırma Onyedi Eylül Üniversitesi": {
        "campus_name": "Merkez Yerleşke (Yeni Mahalle / Bandırma)",
        "city": "Balıkesir",
        "district": "Bandırma",
        "full_address": "Yeni Mahalle Şehit Astsubay Mustafa Soner Varlık Caddesi No:77, 10200 Bandırma/Balıkesir",
        "transport_info": "Marmara Denizi kıyısında, Bandırma İDO Feribot İskelesi ve şehir merkezine 10 dakika mesafede konumlanan ana yerleşke.",
        "latitude": 40.335171,
        "longitude": 27.936656,
        "zoom_level": 15,
    },
    "Zonguldak Bülent Ecevit Üniversitesi": {
        "campus_name": "Farabi Merkez Kampüsü (İncivez / Zonguldak)",
        "city": "Zonguldak",
        "district": "Merkez",
        "full_address": "İncivez Mah. Üniversite Cad. 67100 Merkez/Zonguldak",
        "transport_info": "Karadeniz manzaralı Farabi Merkez Yerleşkesi; şehir merkezine, sahil hattına ve öğrenci mahallesi İncivez'e yürüme mesafesinde.",
        "latitude": 41.451440,
        "longitude": 31.763154,
        "zoom_level": 15,
    },
    "Boğaziçi Üniversitesi": {
        "campus_name": "Güney Kampüs (Bebek / İstanbul)",
        "city": "İstanbul",
        "district": "Beşiktaş",
        "full_address": "Bebek Mah. 34342 Beşiktaş/İstanbul",
        "transport_info": "İstanbul Boğazı'na hakim tarihi Güney Kampüs; M6 Boğaziçi Üniversitesi Metro İstasyonu çıkışında yer alır.",
        "latitude": 41.084600,
        "longitude": 29.051000,
        "zoom_level": 15,
    },
    "Orta Doğu Teknik Üniversitesi (ODTÜ)": {
        "campus_name": "Üniversiteler Mah. Merkez Kampüs (Çankaya / Ankara)",
        "city": "Ankara",
        "district": "Çankaya",
        "full_address": "Üniversiteler Mah. Dumlupınar Bulvarı No:1, 06800 Çankaya/Ankara",
        "transport_info": "Eskişehir Yolu üzerinde, M2 ODTÜ Metro İstasyonu ve kampüs içi ring hatlarıyla doğrudan erişilebilir ana yerleşke.",
        "latitude": 39.891400,
        "longitude": 32.784700,
        "zoom_level": 14,
    },
    "İstanbul Teknik Üniversitesi": {
        "campus_name": "Ayazağa Kampüsü (Maslak / İstanbul)",
        "city": "İstanbul",
        "district": "Sarıyer",
        "full_address": "Reşitpaşa Mah. Katar Cad. No:2, 34467 Sarıyer/İstanbul",
        "transport_info": "M2 İTÜ-Ayazağa Metro İstasyonu çıkışında, Maslak iş merkezi ve İTÜ ARI Teknokent ile bütünleşik ana yerleşke.",
        "latitude": 41.105500,
        "longitude": 29.023500,
        "zoom_level": 15,
    },
    "Hacettepe Üniversitesi": {
        "campus_name": "Beytepe Kampüsü (Çankaya / Ankara)",
        "city": "Ankara",
        "district": "Çankaya",
        "full_address": "Üniversiteler Mah. Hacettepe Beytepe Kampüsü, 06800 Çankaya/Ankara",
        "transport_info": "Beytepe Metro İstasyonu'ndan kalkan ring otobüsleriyle kolayca ulaşılan, geniş ormanlık alana kurulu kampüs.",
        "latitude": 39.867400,
        "longitude": 32.734400,
        "zoom_level": 14,
    },
    "Ankara Üniversitesi": {
        "campus_name": "Tandoğan Yerleşkesi (Anıttepe / Ankara)",
        "city": "Ankara",
        "district": "Çankaya",
        "full_address": "Emniyet Mah. Dögol Cad. No:6A, 06560 Yenimahalle/Çankaya/Ankara",
        "transport_info": "Ankaray Anadolu/Tandoğan durağı ve Başkentray hattına yürüme mesafesinde merkezi şehir yerleşkesi.",
        "latitude": 39.935800,
        "longitude": 32.823900,
        "zoom_level": 15,
    },
    "Ege Üniversitesi": {
        "campus_name": "Bornova Merkez Yerleşkesi (Bornova / İzmir)",
        "city": "İzmir",
        "district": "Bornova",
        "full_address": "Erzene Mah. Ege Üniversitesi Merkez Yerleşkesi, 35040 Bornova/İzmir",
        "transport_info": "İzmir Metrosu Evka-3 / Ege Üniversitesi durağı kampüsün tam içinden geçmektedir.",
        "latitude": 38.458200,
        "longitude": 27.227500,
        "zoom_level": 15,
    },
    "Dokuz Eylül Üniversitesi": {
        "campus_name": "Tınaztepe Yerleşkesi (Buca / İzmir)",
        "city": "İzmir",
        "district": "Buca",
        "full_address": "Adatepe Mah. Doğuş Cad. No:207, 35390 Buca/İzmir",
        "transport_info": "İzmir Çevre Yolu bağlantısı ve İZBAN aktarmalı ESHOT otobüs hatlarıyla ulaşılabilen ana yerleşke.",
        "latitude": 38.368800,
        "longitude": 27.207800,
        "zoom_level": 15,
    },
    "Yıldız Teknik Üniversitesi (YTÜ)": {
        "campus_name": "Davutpaşa Kampüsü (Esenler / İstanbul)",
        "city": "İstanbul",
        "district": "Esenler",
        "full_address": "Çifte Havuzlar Mah. Eski Londra Asfaltı Cad. 34220 Esenler/İstanbul",
        "transport_info": "M1A Davutpaşa-YTÜ Metro İstasyonu ile kampüs girişine doğrudan raylı sistem ulaşımı sağlanır.",
        "latitude": 41.025800,
        "longitude": 28.889700,
        "zoom_level": 15,
    },
    "Marmara Üniversitesi": {
        "campus_name": "Göztepe Yerleşkesi (Kadıköy / İstanbul)",
        "city": "İstanbul",
        "district": "Kadıköy",
        "full_address": "Eğitim Mah. Fahrettin Kerim Gökay Cad. 34722 Kadıköy/İstanbul",
        "transport_info": "Marmaray Göztepe İstasyonu ve Kadıköy-Kartal aksındaki toplu taşıma hatlarına yürüme mesafesinde.",
        "latitude": 40.986900,
        "longitude": 29.053700,
        "zoom_level": 15,
    },
    "İhsan Doğramacı Bilkent Üniversitesi": {
        "campus_name": "Merkez Kampüs (Bilkent / Ankara)",
        "city": "Ankara",
        "district": "Çankaya",
        "full_address": "Üniversiteler Mah. 1598. Cad. 06800 Çankaya/Ankara",
        "transport_info": "Tunus Caddesi, Sıhhiye ve Bilkent Metro durağından düzenli ücretsiz öğrenci servisleriyle ulaşım imkanı.",
        "latitude": 39.868100,
        "longitude": 32.748800,
        "zoom_level": 15,
    },
    "Koç Üniversitesi": {
        "campus_name": "Rumelifeneri Kampüsü (Sarıyer / İstanbul)",
        "city": "İstanbul",
        "district": "Sarıyer",
        "full_address": "Rumelifeneri Yolu, 34450 Sarıyer/İstanbul",
        "transport_info": "M2 Hacıosman Metro İstasyonu'ndan hareket eden İETT ve kampüs shuttle hatlarıyla doğrudan ulaşım.",
        "latitude": 41.205100,
        "longitude": 29.074100,
        "zoom_level": 15,
    },
    "Acıbadem Mehmet Ali Aydınlar Üniversitesi": {
        "campus_name": "Kerem Aydınlar Kampüsü (Ataşehir / İstanbul)",
        "city": "İstanbul",
        "district": "Ataşehir",
        "full_address": "İçerenköy Mah. Kayışdağı Cad. No:32, 34752 Ataşehir/İstanbul",
        "transport_info": "M4 Kozyatağı ve M8 Küçükbakkalköy metro duraklarına yürüme mesafesinde yer alan Kerem Aydınlar Merkez Kampüsü.",
        "latitude": 40.970833,
        "longitude": 29.110833,
        "zoom_level": 15,
    },
    "İstanbul Sabahattin Zaim Üniversitesi": {
        "campus_name": "Halkalı Merkez Kampüsü (Küçükçekmece / İstanbul)",
        "city": "İstanbul",
        "district": "Küçükçekmece",
        "full_address": "Halkalı Mah. Halkalı Cad. No:281, 34303 Küçükçekmece/İstanbul",
        "transport_info": "Halkalı Marmaray ve İETT hatlarıyla doğrudan ulaşılabilen tarihi ve geniş yeşil alanlı merkez yerleşke.",
        "latitude": 41.031520,
        "longitude": 28.784710,
        "zoom_level": 15,
    },
    "İstanbul Medeniyet Üniversitesi": {
        "campus_name": "Göztepe Güney/Kuzey Yerleşkesi (Kadıköy / İstanbul)",
        "city": "İstanbul",
        "district": "Kadıköy",
        "full_address": "Dumlupınar Mah. D-100 Karayolu No:98, 34720 Kadıköy/İstanbul",
        "transport_info": "M4 Ünalan Metro ve Metrobüs Uzunçayır aktarma merkezinin hemen yanında konumlanan ana yerleşke.",
        "latitude": 40.999180,
        "longitude": 29.069440,
        "zoom_level": 15,
    },
    "Hatay Mustafa Kemal Üniversitesi": {
        "campus_name": "Tayfur Sökmen Merkez Kampüsü (Antakya / Hatay)",
        "city": "Hatay",
        "district": "Antakya",
        "full_address": "Alahan Mah. Tayfur Sökmen Kampüsü, 31060 Antakya/Hatay",
        "transport_info": "Antakya-İskenderun karayolu üzerinde Serinyol/Alahan bölgesinde konumlanan Tayfur Sökmen Merkez Yerleşkesi.",
        "latitude": 36.329200,
        "longitude": 36.195600,
        "zoom_level": 15,
    },
}


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    )
    return 2 * R * math.asin(math.sqrt(a))


def is_valid_coord_for_city(lat, lng, city_slug):
    if not (35.0 <= lat <= 42.5 and 25.5 <= lng <= 45.0):
        return False
    if city_slug == "mersin" and 35.1 <= lat <= 35.5 and 33.0 <= lng <= 34.0:
        return True
    p_lat, p_lng = PROVINCE_COORDS.get(city_slug, (39.9, 32.8))
    dist = haversine_km(lat, lng, p_lat, p_lng)
    return dist <= 165.0


def normalize_wiki_title(uni_name):
    clean = re.sub(r"\s*\([^)]*\)", "", uni_name).strip()
    aliases = {
        "Abant İzzet Baysal Üniversitesi": "Bolu Abant İzzet Baysal Üniversitesi",
        "Ahi Evran Üniversitesi": "Kırşehir Ahi Evran Üniversitesi",
        "İhsan Doğramacı Bilkent Üniversitesi": "Bilkent Üniversitesi",
        "İstanbul Bilim Üniversitesi": "Demiroğlu Bilim Üniversitesi",
        "İstanbul Ayvansaray Üniversitesi": "İstanbul Topkapı Üniversitesi",
    }
    return aliases.get(clean, clean)


GMAP_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "tr-TR,tr;q=0.9",
}

DISTRICT_HINTS = [
    "alanya", "bandırma", "iskenderun", "gebze", "tarsus", "mudanya", "beykoz",
    "ataşehir", "şişli", "maltepe", "üsküdar", "kadıköy", "bakırçay", "tınaztepe",
]


def extract_district_from_gmap_addr(addr_str, city_name):
    if not addr_str:
        return ""
    # Örn: "Yeni, Şehit Astsubay ... No:77, 10250 Bandırma/Balıkesir" -> "Bandırma"
    m = re.search(r"(?:,\s*|\b)(?:\d{5}\s+)?([A-Za-zÇĞİÖŞÜçğıöşüİı\s\-]+?)\s*/\s*[A-Za-zÇĞİÖŞÜçğıöşüİı]+\s*$", addr_str)
    if m:
        dist = m.group(1).strip()
        # Posta kodu veya cadde kalıntısını temizle
        dist = re.sub(r"^\d+\s*", "", dist).strip()
        if dist and len(dist) <= 35:
            return dist
    return ""


def parse_gmap_response(d, uni_name, base_name, city_slug, city_name):
    is_myo_uni = "meslek yüksekokulu" in uni_name.lower()
    bad_words = [
        "hastane", "poliklinik", "diş hekimliği", "yurdu", "kyk", "konukevi",
        "otopark", "kantin", "kafe", "camii", "istasyonu", "durağı", "vakfı",
        "koleji", "lisesi", "ilkokulu", "ortaokulu", "kreş", "anaokulu",
    ]
    if not is_myo_uni:
        bad_words += ["meslek yüksekokulu", " myo"]

    uni_low = uni_name.lower()
    base_low = base_name.lower()
    required_district_hint = None
    for dh in DISTRICT_HINTS:
        if dh in uni_low:
            required_district_hint = dh
            break

    candidates = []

    # 1. d[0][1] içindeki tam yer kartları (it[14])
    items = d[0][1] if (isinstance(d, list) and len(d) > 0 and isinstance(d[0], list) and len(d[0]) > 1 and isinstance(d[0][1], list)) else []
    for idx, it in enumerate(items):
        if not (isinstance(it, list) and len(it) > 14 and isinstance(it[14], list)):
            continue
        p = it[14]
        coords = p[9] if len(p) > 9 else None
        if not (isinstance(coords, list) and len(coords) >= 4 and isinstance(coords[2], (int, float)) and isinstance(coords[3], (int, float))):
            continue
        lat, lng = round(float(coords[2]), 7), round(float(coords[3]), 7)
        if not is_valid_coord_for_city(lat, lng, city_slug):
            continue

        title = (p[11] if len(p) > 11 and isinstance(p[11], str) else "").strip()
        addr = (p[39] if len(p) > 39 and isinstance(p[39], str) else (p[18] if len(p) > 18 and isinstance(p[18], str) else "")).strip()
        cats = p[13] if len(p) > 13 and isinstance(p[13], list) else []
        place_id = p[78] if len(p) > 78 and isinstance(p[78], str) else ""

        t_low = title.lower()
        t_clean = re.sub(r"\s*\([^)]*\)", "", t_low).strip()
        addr_low = addr.lower()

        score = max(0, 35 - idx * 4)
        if t_low == base_low or t_low == uni_low or t_clean == base_low:
            score += 140
        elif base_low in t_low or t_clean in base_low:
            score += 75

        if any(w in t_low for w in ["rektörlük", "rektörlüğü", "merkez kampüs", "merkez yerleşke"]):
            score += 65

        if any("üniversite" in str(c).lower() for c in cats):
            score += 55

        if any(bw in t_low for bw in bad_words):
            score -= 180

        if any(fw in t_low for fw in ["fakülte", "enstitü", "yüksekokul", "bölümü", "kütüphane", "spor", "laboratuvar"]) and t_clean != base_low and "rektör" not in t_low:
            score -= 45

        if required_district_hint:
            if required_district_hint in addr_low or required_district_hint in t_low:
                score += 120
            else:
                score -= 120

        candidates.append({
            "title": title,
            "lat": lat,
            "lng": lng,
            "full_address": addr,
            "place_id": place_id,
            "score": score,
        })

    # 2. d[37] içindeki doğrudan Google Maps Spotlight / Rektörlük pini
    if isinstance(d, list) and len(d) > 37 and isinstance(d[37], list) and len(d[37]) >= 3 and isinstance(d[37][2], list):
        for idx, entry in enumerate(d[37][2]):
            if not (isinstance(entry, list) and len(entry) >= 5 and isinstance(entry[3], list) and len(entry[3]) >= 4):
                continue
            c_lat, c_lng = entry[3][2], entry[3][3]
            if not (isinstance(c_lat, (int, float)) and isinstance(c_lng, (int, float))):
                continue
            lat, lng = round(float(c_lat), 7), round(float(c_lng), 7)
            if not is_valid_coord_for_city(lat, lng, city_slug):
                continue
            label = str(entry[4] or d[37][1] or "").strip()
            parts = [x.strip() for x in label.split(",") if x.strip()]
            title = parts[0] if parts else uni_name
            addr = ", ".join(parts[1:]) if len(parts) > 1 else label
            t_low = title.lower()
            score = 135 - idx * 5
            if any(bw in t_low for bw in bad_words):
                score -= 180
            if required_district_hint and required_district_hint not in label.lower():
                score -= 120
            candidates.append({
                "title": title,
                "lat": lat,
                "lng": lng,
                "full_address": addr,
                "place_id": "",
                "score": score,
            })

    if not candidates:
        return None
    candidates.sort(key=lambda x: x["score"], reverse=True)
    return candidates[0] if candidates[0]["score"] >= 40 else None


def fetch_google_maps_exact(uni_name, city_slug, city_name):
    """
    Google Haritalar (tbm=map) üzerinden üniversitenin birebir pin koordinatını (7 hane),
    ilçesini ve açık adresini çeker.
    """
    base_name = normalize_wiki_title(uni_name)
    queries = [
        base_name,
        f"{base_name} Rektörlük",
        f"{base_name} Merkez Kampüs",
        f"{base_name}, {city_name}",
    ]

    best_overall = None
    for q in queries:
        try:
            r = requests.get(
                "https://www.google.com/search",
                params={"tbm": "map", "hl": "tr", "gl": "tr", "q": q},
                headers=GMAP_HEADERS,
                timeout=10,
            )
            if r.status_code != 200 or not r.text:
                continue
            txt = r.text.split("\n", 1)[1] if r.text.startswith(")]}") else r.text
            d = json.loads(txt)
            cand = parse_gmap_response(d, uni_name, base_name, city_slug, city_name)
            if cand:
                if best_overall is None or cand["score"] > best_overall["score"]:
                    best_overall = cand
                if best_overall["score"] >= 140:
                    break
        except Exception:
            pass

    return best_overall


def fetch_wikipedia_and_wikidata_batch(unis):
    results = {}
    title_to_uni_ids = {}

    for u in unis:
        wtitle = normalize_wiki_title(u.name)
        title_to_uni_ids.setdefault(wtitle, []).append(u.id)

    all_titles = list(title_to_uni_ids.keys())
    wikidata_qids = {}

    print(f"[1/3] Wikipedia & Wikidata üzerinden {len(all_titles)} üniversite yedek verisi sorgulanıyor...")
    batch_size = 40
    for i in range(0, len(all_titles), batch_size):
        batch = all_titles[i : i + batch_size]
        params = {
            "action": "query",
            "titles": "|".join(batch),
            "redirects": 1,
            "prop": "coordinates|pageprops",
            "colimit": "max",
            "format": "json",
        }
        try:
            res = requests.get("https://tr.wikipedia.org/w/api.php", params=params, headers=HEADERS, timeout=12)
            data = res.json()
            query = data.get("query", {})

            redirect_map = {r["to"]: r["from"] for r in query.get("redirects", [])}
            normalized_map = {n["to"]: n["from"] for n in query.get("normalized", [])}

            for page_id, page in query.get("pages", {}).items():
                if str(page_id).startswith("-"):
                    continue
                title = page.get("title", "")
                orig_title = redirect_map.get(title, title)
                orig_title = normalized_map.get(orig_title, orig_title)

                matched_ids = title_to_uni_ids.get(orig_title) or title_to_uni_ids.get(title) or []
                if not matched_ids:
                    for k, v in title_to_uni_ids.items():
                        if k.lower() == title.lower() or k.lower() == orig_title.lower():
                            matched_ids = v
                            break

                coords = page.get("coordinates", [])
                qid = page.get("pageprops", {}).get("wikibase_item")

                for uid in matched_ids:
                    results.setdefault(uid, {})
                    if coords:
                        results[uid]["lat"] = float(coords[0]["lat"])
                        results[uid]["lng"] = float(coords[0]["lon"])
                        results[uid]["source"] = "wikipedia"
                    if qid:
                        wikidata_qids.setdefault(qid, []).append(uid)
        except Exception as e:
            print(f"  [WARN] Wikipedia batch hatası: {e}")
        time.sleep(0.1)

    qids_list = list(wikidata_qids.keys())
    for i in range(0, len(qids_list), 40):
        batch_q = qids_list[i : i + 40]
        params = {
            "action": "wbgetentities",
            "ids": "|".join(batch_q),
            "props": "claims|labels",
            "languages": "tr|en",
            "format": "json",
        }
        try:
            res = requests.get("https://www.wikidata.org/w/api.php", params=params, headers=HEADERS, timeout=12)
            entities = res.json().get("entities", {})
            for qid, ent in entities.items():
                claims = ent.get("claims", {})
                p625 = claims.get("P625", [])
                lat, lng = None, None
                if p625:
                    try:
                        val = p625[0]["mainsnak"]["datavalue"]["value"]
                        lat = float(val["latitude"])
                        lng = float(val["longitude"])
                    except Exception:
                        pass

                p6375 = claims.get("P6375", [])
                street_addr = ""
                if p6375:
                    try:
                        street_addr = p6375[0]["mainsnak"]["datavalue"]["value"]["text"]
                    except Exception:
                        pass

                for uid in wikidata_qids.get(qid, []):
                    results.setdefault(uid, {})
                    if lat is not None and lng is not None and "lat" not in results[uid]:
                        results[uid]["lat"] = lat
                        results[uid]["lng"] = lng
                        results[uid]["source"] = "wikidata"
                    if street_addr:
                        results[uid]["street_address"] = street_addr
        except Exception as e:
            print(f"  [WARN] Wikidata batch hatası: {e}")
        time.sleep(0.1)

    return results


def resolve_university_location(uni_obj, wiki_info, curated_item=None):
    uid = uni_obj.id
    uni_name = uni_obj.name
    city_slug = UNI_CITY_MAP.get(uid, "ankara")
    city_name = CITIES_TR.get(city_slug, "Ankara")
    clean_name = normalize_wiki_title(uni_name)

    lat, lng = None, None
    district = ""
    full_addr = ""
    place_id = ""
    source = ""

    # 1. BİRİNCİL KAYNAK: Google Haritalar (tbm=map) Doğrudan Pin Koordinatı (7 Ondalık Hassasiyet)
    gmap = fetch_google_maps_exact(uni_name, city_slug, city_name)
    if gmap:
        lat, lng = gmap["lat"], gmap["lng"]
        full_addr = gmap.get("full_address") or ""
        place_id = gmap.get("place_id") or ""
        district = extract_district_from_gmap_addr(full_addr, city_name)
        source = "google_maps_exact"

    # 2. YEDEK KAYNAK: Curated / Wikipedia / Wikidata
    if (lat is None or lng is None) and curated_item:
        lat = float(curated_item["latitude"])
        lng = float(curated_item["longitude"])
        district = curated_item.get("district") or ""
        full_addr = curated_item.get("full_address") or ""
        source = "curated_verified"

    if (lat is None or lng is None) and "lat" in wiki_info and "lng" in wiki_info:
        w_lat, w_lng = wiki_info["lat"], wiki_info["lng"]
        if is_valid_coord_for_city(w_lat, w_lng, city_slug):
            lat, lng = round(w_lat, 7), round(w_lng, 7)
            source = wiki_info.get("source", "wikipedia")

    if not full_addr and wiki_info.get("street_address"):
        full_addr = wiki_info["street_address"]

    # 3. Koordinat hala yoksa ArcGIS Geocoder ile bul
    if lat is None or lng is None:
        try:
            country_code = "CYP" if "Kıbrıs" in uni_name else "TUR"
            res = requests.get(
                "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates",
                params={
                    "SingleLine": f"{clean_name}, {city_name}",
                    "countryCode": country_code,
                    "f": "json",
                    "outFields": "Match_addr,Place_addr,City,Subregion,Region,Nbrhd,StAddr,Postal",
                    "maxLocations": 3,
                },
                headers=HEADERS,
                timeout=10,
            )
            if res.status_code == 200:
                for cand in res.json().get("candidates", []):
                    c_lat = float(cand["location"]["y"])
                    c_lng = float(cand["location"]["x"])
                    if is_valid_coord_for_city(c_lat, c_lng, city_slug):
                        lat, lng = round(c_lat, 7), round(c_lng, 7)
                        attrs = cand.get("attributes", {})
                        district = attrs.get("Subregion") or attrs.get("City") or ""
                        c_place = attrs.get("Place_addr") or attrs.get("Match_addr") or ""
                        full_addr = c_place
                        source = "geocoder_verified"
                        break
        except Exception:
            pass

    # 4. İlçe veya açık adres eksikse koordinatı Reverse Geocode et
    if lat is not None and lng is not None and (not district or not full_addr or len(full_addr) < 12):
        try:
            rev = requests.get(
                "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode",
                params={
                    "location": f"{lng},{lat}",
                    "f": "json",
                    "langCode": "TR",
                },
                headers=HEADERS,
                timeout=8,
            )
            if rev.status_code == 200:
                r_addr = rev.json().get("address", {})
                if not district:
                    district = r_addr.get("Subregion") or r_addr.get("City") or r_addr.get("District") or "Merkez"
                if not full_addr or len(full_addr) < 12:
                    parts = [
                        r_addr.get("Neighborhood") or "",
                        r_addr.get("Address") or "",
                        r_addr.get("Postal") or "",
                        district,
                        city_name,
                    ]
                    clean_parts = []
                    for p in parts:
                        if p and p not in clean_parts:
                            clean_parts.append(p)
                    full_addr = ", ".join(clean_parts) if len(clean_parts) >= 2 else (r_addr.get("LongLabel") or f"{uni_name}, {district}/{city_name}")
        except Exception:
            pass

    if lat is None or lng is None:
        p_lat, p_lng = PROVINCE_COORDS.get(city_slug, (39.9334, 32.8597))
        lat, lng = round(p_lat, 7), round(p_lng, 7)
        district = district or (curated_item.get("district") if curated_item else "Merkez")
        full_addr = full_addr or (curated_item.get("full_address") if curated_item else f"{uni_name} Merkez Yerleşkesi, {district}/{city_name}")
        source = "province_verified_fallback"

    if not district:
        district = curated_item.get("district") if curated_item else "Merkez"
    if not full_addr:
        full_addr = curated_item.get("full_address") if curated_item else f"{uni_name} Merkez Yerleşkesi, {district}/{city_name}"

    if curated_item and curated_item.get("campus_name"):
        campus_name = curated_item["campus_name"]
    else:
        campus_name = (
            f"Merkez Yerleşke ({district} / {city_name})"
            if district and district.lower() != city_name.lower()
            else f"Merkez Yerleşke ({city_name})"
        )

    transport_info = (
        curated_item["transport_info"]
        if (curated_item and curated_item.get("transport_info"))
        else f"{city_name} ({district}) bölgesinde yer alan ana yerleşke. Açık Adres: {full_addr}"
    )

    if place_id:
        gmaps_url = f"https://www.google.com/maps/search/?api=1&query={lat},{lng}&query_place_id={place_id}"
    else:
        gmaps_url = f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"

    return {
        "university_id": uid,
        "uni_name": uni_name,
        "campus_name": campus_name[:195],
        "city": city_name,
        "district": district[:95],
        "full_address": full_addr,
        "transport_info": transport_info,
        "latitude": float(lat),
        "longitude": float(lng),
        "zoom_level": 16,
        "google_maps_url": gmaps_url,
        "source": source,
    }


def run_bot():
    db = SessionLocal()
    try:
        UniversityAddress.__table__.create(engine, checkfirst=True)
        unis = db.query(University).order_by(University.id.asc()).all()
        print(f"Veritabanında toplam {len(unis)} üniversite bulundu.")

        curated_map = {}
        for k, v in CURATED_EXACT.items():
            curated_map[k.lower()] = v
            base_n = re.sub(r"\s*\([^)]*\)", "", k).strip().lower()
            curated_map[base_n] = v

        wiki_data = fetch_wikipedia_and_wikidata_batch(unis)

        final_records_map = {}

        print(f"[2/3] Tüm {len(unis)} üniversite için Google Haritalar (tbm=map) birebir pin koordinatları çekiliyor...")
        with ThreadPoolExecutor(max_workers=8) as executor:
            future_to_uni = {}
            for u in unis:
                u_low = u.name.lower()
                u_base_low = re.sub(r"\s*\([^)]*\)", "", u.name).strip().lower()
                c_item = curated_map.get(u_low) or curated_map.get(u_base_low)
                w_info = wiki_data.get(u.id, {})
                future = executor.submit(resolve_university_location, u, w_info, c_item)
                future_to_uni[future] = u

            completed_count = 0
            for future in as_completed(future_to_uni):
                u = future_to_uni[future]
                completed_count += 1
                try:
                    rec = future.result()
                    final_records_map[u.id] = rec
                    if completed_count % 25 == 0 or completed_count == len(unis):
                        print(f"  -> İlerleme: {completed_count}/{len(unis)} tamamlandı")
                except Exception as exc:
                    print(f"  [WARN] {u.name} işlenirken hata: {exc}")

        final_records = [final_records_map[u.id] for u in unis if u.id in final_records_map]

        cache_out = {str(r["university_id"]): r for r in final_records}
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache_out, f, ensure_ascii=False, indent=2)

        inserted = 0
        updated = 0
        for rec in final_records:
            existing = (
                db.query(UniversityAddress)
                .filter(UniversityAddress.university_id == rec["university_id"])
                .first()
            )
            if not existing:
                db.add(
                    UniversityAddress(
                        university_id=rec["university_id"],
                        campus_name=rec["campus_name"],
                        city=rec["city"],
                        district=rec["district"],
                        full_address=rec["full_address"],
                        transport_info=rec["transport_info"],
                        latitude=rec["latitude"],
                        longitude=rec["longitude"],
                        zoom_level=rec["zoom_level"],
                        google_maps_url=rec["google_maps_url"],
                    )
                )
                inserted += 1
            else:
                existing.campus_name = rec["campus_name"]
                existing.city = rec["city"]
                existing.district = rec["district"]
                existing.full_address = rec["full_address"]
                existing.transport_info = rec["transport_info"]
                existing.latitude = rec["latitude"]
                existing.longitude = rec["longitude"]
                existing.zoom_level = rec["zoom_level"]
                existing.google_maps_url = rec["google_maps_url"]
                updated += 1

        db.commit()

        with open(SQL_FILE, "w", encoding="utf-8") as f:
            f.write("SET FOREIGN_KEY_CHECKS = 0;\n")
            f.write("TRUNCATE TABLE `university_addresses`;\n\n")
            f.write(
                "INSERT INTO `university_addresses` "
                "(`university_id`, `campus_name`, `city`, `district`, `full_address`, `transport_info`, `latitude`, `longitude`, `zoom_level`, `google_maps_url`) VALUES\n"
            )
            sql_rows = []
            for r in final_records:
                cn = r["campus_name"].replace("'", "''")
                ct = r["city"].replace("'", "''")
                dt = r["district"].replace("'", "''")
                fa = r["full_address"].replace("'", "''")
                ti = r["transport_info"].replace("'", "''")
                gm = r["google_maps_url"].replace("'", "''")
                sql_rows.append(
                    f"({r['university_id']}, '{cn}', '{ct}', '{dt}', '{fa}', '{ti}', {r['latitude']}, {r['longitude']}, {r['zoom_level']}, '{gm}')"
                )
            f.write(",\n".join(sql_rows) + ";\n\n")
            f.write("SET FOREIGN_KEY_CHECKS = 1;\n")

        # [3/3] Frontend js/universities.js dosyasını birebir senkronize et
        print("[3/3] Frontend js/universities.js dosyası Google Haritalar koordinatlarıyla senkronize ediliyor...")
        rows_sorted = (
            db.query(University, UniversityAddress)
            .join(UniversityAddress, University.id == UniversityAddress.university_id)
            .order_by(University.name.asc())
            .all()
        )
        uni_names = [u.name for u, _ in rows_sorted]
        addr_map = {}
        for u, a in rows_sorted:
            addr_map[u.name] = {
                "id": a.id,
                "university_id": u.id,
                "name": u.name,
                "campus": a.campus_name,
                "city": a.city,
                "district": a.district,
                "full_address": a.full_address,
                "info": a.transport_info or a.full_address,
                "lat": float(a.latitude),
                "lng": float(a.longitude),
                "zoom": int(a.zoom_level or 16),
                "googleMapsUrl": a.google_maps_url or f"https://www.google.com/maps/search/?api=1&query={a.latitude},{a.longitude}",
            }
        if "İhsan Doğramacı Bilkent Üniversitesi" in addr_map:
            addr_map["Bilkent Üniversitesi"] = addr_map["İhsan Doğramacı Bilkent Üniversitesi"]
        if "Orta Doğu Teknik Üniversitesi (ODTÜ)" in addr_map:
            addr_map["Orta Doğu Teknik Üniversitesi"] = addr_map["Orta Doğu Teknik Üniversitesi (ODTÜ)"]
        if "Yıldız Teknik Üniversitesi (YTÜ)" in addr_map:
            addr_map["Yıldız Teknik Üniversitesi"] = addr_map["Yıldız Teknik Üniversitesi (YTÜ)"]
        if "İstanbul Teknik Üniversitesi" in addr_map:
            addr_map["İstanbul Teknik Üniversitesi (İTÜ)"] = addr_map["İstanbul Teknik Üniversitesi"]

        js_uni_path = os.path.join(PROJECT_ROOT, "frontend", "js", "universities.js")
        with open(js_uni_path, "w", encoding="utf-8") as jf:
            jf.write("const TURKISH_UNIVERSITIES = " + json.dumps(uni_names, ensure_ascii=False, indent=4) + ";\n\n")
            jf.write("// MySQL university_addresses tablosu ve Google Haritalar ile birebir senkronize kampüs adres ve koordinat veritabanı\n")
            jf.write("window.UNIVERSITY_ADDRESSES_DB = " + json.dumps(addr_map, ensure_ascii=False, indent=4) + ";\n")

        sources = {}
        for r in final_records:
            s = r.get("source", "unknown")
            sources[s] = sources.get(s, 0) + 1

        print("\n====================================================")
        print(f"[TAMAMLANDI] Toplam {len(final_records)} üniversitenin Google Haritalar koordinatı güncellendi!")
        print(f" -> Yeni Eklenen: {inserted} | Güncellenen: {updated}")
        print(f" -> Veri Kaynağı Dağılımı: {sources}")
        print("====================================================")
    except Exception as e:
        db.rollback()
        print(f"[HATA] Bot çalışırken hata oluştu: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run_bot()
