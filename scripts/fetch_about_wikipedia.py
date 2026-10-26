#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AŞAMA 2: Üniversiteler için Türkçe Vikipedi ve Wikidata'dan ham özet metni
ve üst veri çeken salt-okunur betik.

Veritabanına DOĞRUDAN YAZMAZ.
Çıktılar:
  - scripts/about_raw.json
  - scripts/about_unmatched.json
"""

import argparse
import difflib
import json
import os
import re
import sys
import time
from urllib.parse import quote, urlparse

import requests

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

USER_AGENT_STR = "KampusSesi/1.0 (iletişim: destek@kampussesi.com)"
WIKI_API_URL = "https://tr.wikipedia.org/w/api.php"
WIKI_SUMMARY_URL = "https://tr.wikipedia.org/api/rest_v1/page/summary/{title}"
WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php"

MIN_REQUEST_INTERVAL = 1.0  # İstekler arası en az 1 saniye bekleme
MAX_RETRIES = 3
REQUEST_TIMEOUT = 15

MIN_ACCEPT_SCORE = 0.55     # Bu değerin altındaki eşleşmeler reddedilir
LOW_MATCH_THRESHOLD = 0.80  # < 0.8 ise "düşük eşleşme" bayrağı eklenir
SHORT_TEXT_THRESHOLD = 120  # < 120 karakter ise "kısa metin" bayrağı eklenir
MAX_RAW_CHARS = 600         # En çok ~600 karakter, cümle sınırında kesilir


class PoliteRequester:
    """Nezaket kurallarına uyan HTTP istemcisi (en az 1 sn bekleme, 3 deneme, 429 yönetimi)."""

    def __init__(self, min_interval: float = MIN_REQUEST_INTERVAL):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT_STR.encode("utf-8"),
            "Accept": "application/json",
        })
        self.min_interval = min_interval
        self.last_request_ts = 0.0
        self.total_requests = 0

    def _wait_if_needed(self):
        elapsed = time.monotonic() - self.last_request_ts
        if elapsed < self.min_interval:
            time.sleep(self.min_interval - elapsed)

    def get_json(self, url: str, params: dict = None) -> dict | None:
        for attempt in range(1, MAX_RETRIES + 1):
            self._wait_if_needed()
            try:
                self.last_request_ts = time.monotonic()
                self.total_requests += 1
                resp = self.session.get(url, params=params, timeout=REQUEST_TIMEOUT)

                if resp.status_code == 429:
                    retry_after = resp.headers.get("Retry-After")
                    wait_sec = float(retry_after) if (retry_after and retry_after.isdigit()) else (5.0 * attempt)
                    print(f"  [429 Rate Limit] {wait_sec:.1f} sn bekleniyor (deneme {attempt}/{MAX_RETRIES})...")
                    time.sleep(wait_sec)
                    continue

                if resp.status_code == 404:
                    return None

                resp.raise_for_status()
                return resp.json()
            except (requests.RequestException, ValueError) as exc:
                if attempt < MAX_RETRIES:
                    backoff = 2.0 * attempt
                    print(f"  [UYARI] İstek hatası ({exc}), {backoff:.1f} sn sonra yeniden denenecek ({attempt}/{MAX_RETRIES})...")
                    time.sleep(backoff)
                else:
                    print(f"  [HATA] İstek 3 denemede başarısız oldu: {url} ({exc})")
                    return None
        return None


def tr_lower(text: str) -> str:
    """Türkçe karakter duyarlı küçük harfe çevirme."""
    if not text:
        return ""
    return text.replace("İ", "i").replace("I", "ı").lower()


def normalize_for_compare(text: str) -> str:
    """Türkçe karakter ve büyük/küçük harf duyarsız karşılaştırma için metni normalize eder."""
    if not text:
        return ""
    s = tr_lower(text)
    s = re.sub(r"\([^)]*\)", " ", s)
    tr_map = str.maketrans({
        "ı": "i",
        "ğ": "g",
        "ü": "u",
        "ş": "s",
        "ö": "o",
        "ç": "c",
        "â": "a",
        "î": "i",
        "û": "u",
    })
    s = s.translate(tr_map)
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def contains_universite(text: str) -> bool:
    """Metinde 'üniversite' kelimesinin geçip geçmediğini kontrol eder."""
    if not text:
        return False
    low = tr_lower(text)
    return ("üniversite" in low) or ("universite" in normalize_for_compare(text))


def compute_match_score(uni_name: str, wiki_title: str) -> float:
    """Üniversite adı ile Vikipedi başlığı arasındaki benzerliği (0.0 - 1.0) hesaplar."""
    raw_variants = [uni_name]
    stripped_paren = re.sub(r"\([^)]*\)", "", uni_name).strip()
    if stripped_paren and stripped_paren != uni_name:
        raw_variants.append(stripped_paren)

    norm_title = normalize_for_compare(wiki_title)
    if not norm_title:
        return 0.0

    best_score = 0.0
    for variant in raw_variants:
        norm_uni = normalize_for_compare(variant)
        if not norm_uni:
            continue
        if norm_uni == norm_title:
            return 1.0

        seq_ratio = difflib.SequenceMatcher(None, norm_uni, norm_title).ratio()

        stop_words = {"universitesi", "universite", "tc", "t", "c"}
        uni_tokens = [t for t in norm_uni.split() if t not in stop_words]
        title_tokens = [t for t in norm_title.split() if t not in stop_words]

        if uni_tokens and title_tokens:
            set_u = set(uni_tokens)
            set_t = set(title_tokens)
            inter = len(set_u & set_t)
            union = len(set_u | set_t)
            jaccard = inter / union if union else 0.0
            score = 0.55 * seq_ratio + 0.45 * jaccard
            # Kısa/uzun resmi ad varyantları (örn. "Acıbadem Mehmet Ali Aydınlar Üniversitesi" <-> "Acıbadem Üniversitesi",
            # "Bilkent Üniversitesi" <-> "İhsan Doğramacı Bilkent Üniversitesi")
            if (set_t.issubset(set_u) or set_u.issubset(set_t)) and (
                uni_tokens[0] == title_tokens[0] or uni_tokens[-1] == title_tokens[-1]
            ):
                score = max(score, 0.72)
        else:
            score = seq_ratio

        if score > best_score:
            best_score = score

    return round(min(best_score, 1.0), 3)


def clean_wiki_extract(raw_text: str) -> str:
    """
    Parantez içi okunuş/telaffuz kalıntılarını, dipnot işaretlerini ve fazla boşlukları temizler.
    """
    if not raw_text:
        return ""
    text = raw_text.strip()

    # Dipnot işaretlerini kaldır: [1], [2], [a], [not 1], [kaynak belirtilmeli] vb.
    text = re.sub(r"\[\s*(?:\d+|[a-z]|not\s*\d+|kaynak[^\]]*)\s*\]", "", text, flags=re.IGNORECASE)

    # Parantez içi okunuş, telaffuz, IPA ve şablon kalıntılarını temizle
    text = re.sub(r"\(\s*(?:okunuşu|telaffuz|telaffuzu|IPA)\s*:[^)]*\)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\(\s*[;,:\-–—]+\s*([^)]+)\)", r"(\1)", text)
    text = re.sub(r"\(([^)]+?)\s*[;,:\-–—]+\s*\)", r"(\1)", text)
    text = re.sub(r"\(\s*[;,:\-–—]*\s*\)", "", text)

    # Fazla boşlukları temizle
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\s+([.,;:!?])", r"\1", text)
    text = re.sub(r"\n+", " ", text).strip()
    return text


def split_turkish_sentences(text: str) -> list[str]:
    """Türkçe kısaltmaları ve sıra sayılarını koruyarak metni cümlelere ayırır."""
    if not text:
        return []

    abbreviations = [
        r"\bProf\.", r"\bDoç\.", r"\bDr\.", r"\bYrd\.", r"\bAv\.", r"\bMüh\.",
        r"\bMim\.", r"\bOrg\.", r"\bAlb\.", r"\bvb\.", r"\bvs\.", r"\börn\.",
        r"\byy\.", r"\bYY\.", r"\bNo\.", r"\bno\.", r"\bSt\.", r"\bA\.Ş\.",
        r"\bLtd\.", r"\bŞti\.", r"\bT\.C\.", r"\bMÖ\.", r"\bMS\.",
    ]
    protected = text
    placeholders = {}
    for idx, pattern in enumerate(abbreviations):
        def _repl(match, i=idx):
            key = f"__ABBR_{i}_{len(placeholders)}__"
            placeholders[key] = match.group(0)
            return key
        protected = re.sub(pattern, _repl, protected)

    def _num_repl(match):
        key = f"__NUM_{len(placeholders)}__"
        placeholders[key] = match.group(0)
        return key

    protected = re.sub(r"\b\d+\.(?=\s+[a-zçğıöşü0-9])", _num_repl, protected)
    raw_parts = re.split(r"(?<=[.!?…])\s+(?=[A-ZÇĞİÖŞÜ0-9\"“'(\[])", protected)

    sentences = []
    for part in raw_parts:
        restored = part
        for key, val in placeholders.items():
            restored = restored.replace(key, val)
        restored = restored.strip()
        if restored:
            sentences.append(restored)

    return sentences


def truncate_at_sentence_boundary(cleaned_text: str, max_chars: int = MAX_RAW_CHARS) -> str:
    """Metni en çok ~600 karakter olacak şekilde cümle sınırında keser."""
    if len(cleaned_text) <= max_chars:
        return cleaned_text

    sentences = split_turkish_sentences(cleaned_text)
    if not sentences:
        return cleaned_text[:max_chars].strip()

    selected = []
    current_len = 0
    for sent in sentences:
        added_len = len(sent) if not selected else (current_len + 1 + len(sent))
        if added_len <= max_chars:
            selected.append(sent)
            current_len = added_len
        else:
            if not selected:
                truncated = sent[: max_chars - 1].rsplit(" ", 1)[0].rstrip(" ,;:") + "…"
                selected.append(truncated)
            break

    return " ".join(selected)


def read_universities_readonly() -> list[dict]:
    """Veritabanındaki tüm üniversiteleri salt-okunur olarak okur."""
    from database import SessionLocal, University

    universities = []
    db = SessionLocal()
    try:
        rows = db.query(University).order_by(University.id.asc()).all()
        for u in rows:
            city = ""
            district = ""
            if getattr(u, "address", None):
                city = (u.address.city or "").strip()
                district = (u.address.district or "").strip()
            universities.append({
                "id": u.id,
                "name": u.name.strip(),
                "city": city,
                "district": district,
                "website": (u.website_url or "").strip(),
            })
    finally:
        db.close()

    return universities


def search_wikipedia_title(requester: PoliteRequester, uni_name: str) -> tuple[str | None, float]:
    """
    Türkçe Vikipedi'de üniversite adını arar ve en yakın başlığı döndürür.
    Başlıkta 'üniversite' geçmeyenleri ve anlam ayrımı sayfalarını eler.
    """
    base_name = re.sub(r"\([^)]*\)", "", uni_name).strip()
    search_query = base_name if base_name else uni_name

    params = {
        "action": "query",
        "list": "search",
        "srsearch": search_query,
        "srlimit": 5,
        "utf8": 1,
        "format": "json",
    }
    data = requester.get_json(WIKI_API_URL, params=params)
    if not data:
        return None, 0.0

    results = data.get("query", {}).get("search", [])
    if not results:
        return None, 0.0

    best_title = None
    best_score = -1.0

    for item in results:
        title = item.get("title", "").strip()
        if not title:
            continue
        if "anlam ayrımı" in tr_lower(title):
            continue
        if not contains_universite(title):
            continue
        score = compute_match_score(uni_name, title)
        if score > best_score:
            best_score = score
            best_title = title

    return best_title, max(best_score, 0.0)


def fetch_wikidata_info(requester: PoliteRequester, qid: str, entity_label_cache: dict) -> dict:
    """
    Wikidata'dan kuruluş yılı (P571), yer/şehir (P131 veya P159) ve resmi web sitesi (P856) çeker.
    """
    result = {
        "founded": None,
        "city": None,
        "website": None,
    }
    if not qid:
        return result

    params = {
        "action": "wbgetentities",
        "ids": qid,
        "props": "claims|labels",
        "languages": "tr|en",
        "format": "json",
    }
    data = requester.get_json(WIKIDATA_API_URL, params=params)
    if not data:
        return result

    entity = data.get("entities", {}).get(qid, {})
    claims = entity.get("claims", {})

    # Kuruluş yılı (P571)
    for statement in claims.get("P571", []):
        try:
            time_val = statement["mainsnak"]["datavalue"]["value"]["time"]
            m = re.search(r"([0-9]{4})", time_val)
            if m:
                result["founded"] = int(m.group(1))
                break
        except (KeyError, TypeError, ValueError):
            continue

    # Resmi web sitesi (P856)
    for statement in claims.get("P856", []):
        try:
            url_val = statement["mainsnak"]["datavalue"]["value"]
            if isinstance(url_val, str) and url_val.strip():
                result["website"] = url_val.strip()
                break
        except (KeyError, TypeError):
            continue

    # Yer / Şehir (P131 veya P159)
    loc_qid = None
    for prop in ("P131", "P159"):
        for statement in claims.get(prop, []):
            try:
                loc_qid = statement["mainsnak"]["datavalue"]["value"]["id"]
                if loc_qid:
                    break
            except (KeyError, TypeError):
                continue
        if loc_qid:
            break

    if loc_qid:
        if loc_qid in entity_label_cache:
            result["city"] = entity_label_cache[loc_qid]
        else:
            loc_data = requester.get_json(
                WIKIDATA_API_URL,
                params={
                    "action": "wbgetentities",
                    "ids": loc_qid,
                    "props": "labels",
                    "languages": "tr|en",
                    "format": "json",
                },
            )
            if loc_data:
                loc_entity = loc_data.get("entities", {}).get(loc_qid, {})
                labels = loc_entity.get("labels", {})
                label_val = (
                    labels.get("tr", {}).get("value")
                    or labels.get("en", {}).get("value")
                )
                if label_val:
                    entity_label_cache[loc_qid] = label_val
                    result["city"] = label_val

    return result


def normalize_domain(url_str: str) -> str:
    if not url_str:
        return ""
    s = url_str.strip().lower()
    if not s.startswith(("http://", "https://")):
        s = "https://" + s
    try:
        netloc = urlparse(s).netloc
        if netloc.startswith("www."):
            netloc = netloc[4:]
        return netloc.rstrip("/")
    except Exception:
        return s


def has_db_mismatch(db_uni: dict, wikidata_info: dict) -> bool:
    """Veritabanındaki mevcut şehir/ilçe veya web sitesi ile Wikidata değerlerini karşılaştırır."""
    db_city = normalize_for_compare(db_uni.get("city") or "")
    db_district = normalize_for_compare(db_uni.get("district") or "")
    wd_city = normalize_for_compare(wikidata_info.get("city") or "")

    if db_city and wd_city:
        city_matches = (db_city in wd_city) or (wd_city in db_city)
        district_matches = bool(db_district) and ((db_district in wd_city) or (wd_city in db_district))
        if not (city_matches or district_matches):
            return True

    db_web = normalize_domain(db_uni.get("website") or "")
    wd_web = normalize_domain(wikidata_info.get("website") or "")
    if db_web and wd_web and db_web != wd_web:
        return True

    return False


def load_json_list(path: str) -> list:
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, list):
                return data
        except Exception:
            pass
    return []


def main():
    parser = argparse.ArgumentParser(
        description="Üniversiteler için Vikipedi/Wikidata kaynak çekme botu (Veritabanına yazmaz)."
    )
    parser.add_argument("--limit", type=int, default=None, help="İlk N üniversiteyi işle.")
    parser.add_argument("--only", type=str, default=None, help="Yalnızca belirtilen üniversiteyi işle.")
    parser.add_argument("--resume", action="store_true", help="Mevcut JSON'daki kayıtları atla.")
    args = parser.parse_args()

    out_path = os.path.join(SCRIPT_DIR, "about_raw.json")
    unmatched_path = os.path.join(SCRIPT_DIR, "about_unmatched.json")

    all_universities = read_universities_readonly()

    # --only filtresi
    if args.only:
        only_norm = normalize_for_compare(args.only)
        target_universities = [
            u for u in all_universities
            if only_norm in normalize_for_compare(u["name"])
            or normalize_for_compare(u["name"]) in only_norm
        ]
    else:
        target_universities = list(all_universities)

    # --limit filtresi
    if args.limit is not None and args.limit > 0:
        target_universities = target_universities[: args.limit]

    # --resume filtresi
    existing_matched = load_json_list(out_path) if args.resume else []
    existing_unmatched = load_json_list(unmatched_path) if args.resume else []
    done_names = {item.get("name") for item in existing_matched if item.get("name")}

    if args.resume and done_names:
        before_count = len(target_universities)
        target_universities = [u for u in target_universities if u["name"] not in done_names]
        print(f"[RESUME] Mevcut JSON'da bulunan {before_count - len(target_universities)} kayıt atlandı.")

    total_to_process = len(target_universities)
    min_est_requests = total_to_process * 2
    max_est_requests = total_to_process * 4

    print("=" * 72)
    print(f"Veritabanındaki toplam üniversite : {len(all_universities)}")
    print(f"Şimdi işlenecek üniversite sayısı : {total_to_process}")
    print(f"Tahmini HTTP istek sayısı         : {min_est_requests} – {max_est_requests} istek (üniversite başına 2-4 istek)")
    print(f"İstekler arası bekleme            : en az {MIN_REQUEST_INTERVAL:.1f} sn | User-Agent: {USER_AGENT_STR}")
    print("=" * 72)

    requester = PoliteRequester(min_interval=MIN_REQUEST_INTERVAL)
    entity_label_cache = {}

    matched_records = list(existing_matched)
    unmatched_records = list(existing_unmatched)
    new_matched_count = 0
    new_unmatched_count = 0
    flagged_count = 0

    for idx, uni in enumerate(target_universities, start=1):
        uni_name = uni["name"]
        print(f"[{idx}/{total_to_process}] Araştırılıyor: {uni_name}")

        # 1. Vikipedi başlık araması
        wiki_title, match_score = search_wikipedia_title(requester, uni_name)
        if not wiki_title:
            print("  -> ATLANDI: Uygun 'üniversite' başlıklı sonuç bulunamadı.")
            unmatched_records.append({
                "name": uni_name,
                "reason": "başlıkta 'üniversite' içeren arama sonucu bulunamadı",
                "candidate_title": None,
                "match_score": 0.0,
            })
            new_unmatched_count += 1
            continue

        if match_score < MIN_ACCEPT_SCORE:
            print(f"  -> ATLANDI: Başlık benzerliği çok düşük ('{wiki_title}', skor={match_score}).")
            unmatched_records.append({
                "name": uni_name,
                "reason": "düşük başlık benzerliği",
                "candidate_title": wiki_title,
                "match_score": match_score,
            })
            new_unmatched_count += 1
            continue

        # 2. REST summary çekimi
        encoded_title = quote(wiki_title.replace(" ", "_"), safe="")
        summary_data = requester.get_json(WIKI_SUMMARY_URL.format(title=encoded_title))
        if not summary_data:
            print(f"  -> ATLANDI: REST summary yanıtı alınamadı ('{wiki_title}').")
            unmatched_records.append({
                "name": uni_name,
                "reason": "REST summary alınamadı",
                "candidate_title": wiki_title,
                "match_score": match_score,
            })
            new_unmatched_count += 1
            continue

        resolved_title = (summary_data.get("title") or wiki_title).strip()
        page_type = summary_data.get("type", "")
        extract_raw = summary_data.get("extract") or ""
        description_raw = summary_data.get("description") or ""

        # Başlıkta 'üniversite' kontrolü, disambiguation kontrolü ve özette 'üniversite' kontrolü
        if not contains_universite(resolved_title):
            print(f"  -> ATLANDI: Çözümlenen başlık 'üniversite' içermiyor ('{resolved_title}').")
            unmatched_records.append({
                "name": uni_name,
                "reason": "başlık 'üniversite' içermiyor",
                "candidate_title": resolved_title,
                "match_score": match_score,
            })
            new_unmatched_count += 1
            continue

        if (
            page_type == "disambiguation"
            or "anlam ayrımı" in tr_lower(resolved_title)
            or "anlam ayrımı" in tr_lower(description_raw)
        ):
            print(f"  -> ATLANDI: Anlam ayrımı sayfası ('{resolved_title}').")
            unmatched_records.append({
                "name": uni_name,
                "reason": "anlam ayrımı (disambiguation) sayfası",
                "candidate_title": resolved_title,
                "match_score": match_score,
            })
            new_unmatched_count += 1
            continue

        if not contains_universite(extract_raw):
            print(f"  -> ATLANDI: Özet metninde 'üniversite' geçmiyor ('{resolved_title}').")
            unmatched_records.append({
                "name": uni_name,
                "reason": "özet metninde 'üniversite' geçmiyor",
                "candidate_title": resolved_title,
                "match_score": match_score,
            })
            new_unmatched_count += 1
            continue

        # 3. Özeti temizle ve ~600 karakter / cümle sınırında kes
        cleaned_extract = clean_wiki_extract(extract_raw)
        raw_summary = truncate_at_sentence_boundary(cleaned_extract, max_chars=MAX_RAW_CHARS)

        wiki_url = (
            summary_data.get("content_urls", {}).get("desktop", {}).get("page")
            or f"https://tr.wikipedia.org/wiki/{encoded_title}"
        )

        # 4. Wikidata alanlarını çek
        wikibase_item = summary_data.get("wikibase_item")
        wikidata_info = fetch_wikidata_info(requester, wikibase_item, entity_label_cache)

        # 5. Bayrakları (flags) belirle
        flags = []
        if match_score < LOW_MATCH_THRESHOLD:
            flags.append("düşük eşleşme")
        if len(raw_summary) < SHORT_TEXT_THRESHOLD:
            flags.append("kısa metin")
        if has_db_mismatch(uni, wikidata_info):
            flags.append("veritabanıyla uyuşmuyor")
        if not any(wikidata_info.get(k) for k in ("founded", "city", "website")):
            flags.append("tek kaynak")

        if flags:
            flagged_count += 1

        record = {
            "name": uni_name,
            "raw": raw_summary,
            "wiki_title": resolved_title,
            "wiki_url": wiki_url,
            "match_score": match_score,
            "wikidata": wikidata_info,
            "flags": flags,
        }
        matched_records.append(record)
        new_matched_count += 1
        flag_str = f" | flags={flags}" if flags else ""
        print(f"  -> EŞLEŞTİ: '{resolved_title}' (skor={match_score}, {len(raw_summary)} kr{flag_str})", flush=True)

        if idx % 10 == 0:
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(matched_records, f, ensure_ascii=False, indent=2)
            with open(unmatched_path, "w", encoding="utf-8") as f:
                json.dump(unmatched_records, f, ensure_ascii=False, indent=2)

    # Çıktıları kaydet
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(matched_records, f, ensure_ascii=False, indent=2)

    with open(unmatched_path, "w", encoding="utf-8") as f:
        json.dump(unmatched_records, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 72)
    print("ÖZET")
    print("=" * 72)
    print(f"İşlenen üniversite   : {total_to_process}")
    print(f"Eşleşen kayıt        : {new_matched_count} (Toplam dosyada: {len(matched_records)}) -> {out_path}")
    print(f"Atlanan kayıt        : {new_unmatched_count} (Toplam dosyada: {len(unmatched_records)}) -> {unmatched_path}")
    print(f"Bayraklı kayıt sayısı: {flagged_count}")
    print(f"Toplam HTTP isteği   : {requester.total_requests}")
    print("=" * 72)


if __name__ == "__main__":
    main()

