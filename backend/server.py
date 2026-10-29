import os
import sys
import json
import time
import html
import urllib.request
import urllib.error
from datetime import datetime
from collections import defaultdict
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, status, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
for _p in (BACKEND_DIR, PROJECT_ROOT):
    if _p not in sys.path:
        sys.path.insert(0, _p)


def _load_dotenv_files():
    """Load .env from project root or backend directory without external dependencies."""
    try:
        from dotenv import load_dotenv
        for env_path in (os.path.join(PROJECT_ROOT, ".env"), os.path.join(BACKEND_DIR, ".env")):
            if os.path.isfile(env_path):
                load_dotenv(env_path, override=False)
    except ImportError:
        pass
    for env_path in (os.path.join(PROJECT_ROOT, ".env"), os.path.join(BACKEND_DIR, ".env")):
        if os.path.isfile(env_path):
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    for raw_line in f:
                        line = raw_line.strip()
                        if not line or line.startswith("#") or "=" not in line:
                            continue
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k and k not in os.environ:
                            os.environ[k] = v
            except Exception:
                pass


_load_dotenv_files()

from database import (
    init_db, get_db, SessionLocal, User, Review, Reply, Interaction,
    University, UniversityAddress, KykDorm, UniversityDorm, SchoolSuggestion,
    ContactMessage, ContactMessageReply, BlogSubmission, UserFavorite, UserNotification
)
from auth_utils import hash_password, verify_password, create_access_token, decode_access_token

# Initialize database tables & seed
init_db()

ENABLE_DOCS = os.getenv("ENABLE_DOCS", "false").lower() in ("true", "1")

app = FastAPI(
    title="Kampüs Sesi API",
    description="Üniversite Değerlendirme Platformu REST API ve Veritabanı Backend Servisi",
    version="1.0.0",
    docs_url="/docs" if ENABLE_DOCS else None,
    redoc_url="/redoc" if ENABLE_DOCS else None,
    openapi_url="/openapi.json" if ENABLE_DOCS else None,
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    return response

# CORS Middleware (allow_credentials=False complies with wildcard allow_origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── In-Memory Rate Limiting ──────────────
_RATE_LIMIT_STORE: Dict[str, List[float]] = defaultdict(list)

def check_rate_limit(key: str, max_requests: int, window_seconds: int = 60):
    now = time.time()
    timestamps = _RATE_LIMIT_STORE[key]
    _RATE_LIMIT_STORE[key] = [t for t in timestamps if (now - t) < window_seconds]
    if len(_RATE_LIMIT_STORE[key]) >= max_requests:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Çok fazla istek gönderdiniz. Lütfen bir süre sonra tekrar deneyin."
        )
    _RATE_LIMIT_STORE[key].append(now)

def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"

# ─── Pydantic Schemas ─────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

VALID_REVIEW_CATEGORIES = {
    "kampus": "Kampüs",
    "yemekhane": "Yemekhane",
    "egitim": "Eğitim",
    "kutuphane": "Kütüphane",
    "sosyal": "Sosyal Hayat",
    "ulasim": "Ulaşım",
    "yurt": "Yurt Olanakları",
}

def _tr_lower(s: str) -> str:
    return s.replace("İ", "i").replace("I", "ı").lower()


CATEGORY_LABEL_TO_ID = {
    _tr_lower(label): cat_id for cat_id, label in VALID_REVIEW_CATEGORIES.items()
}


def normalize_review_categories(raw_list: Optional[List[str]]) -> List[str]:
    if not raw_list or not isinstance(raw_list, list):
        return []
    normalized = []
    for item in raw_list:
        if not isinstance(item, str):
            raise HTTPException(status_code=400, detail="Geçersiz kategori seçimi.")
        val = item.strip()
        if not val:
            continue
        lower_val = _tr_lower(val)
        if lower_val in VALID_REVIEW_CATEGORIES:
            cat_id = lower_val
        elif lower_val in CATEGORY_LABEL_TO_ID:
            cat_id = CATEGORY_LABEL_TO_ID[lower_val]
        else:
            raise HTTPException(status_code=400, detail=f"Geçersiz kategori: {val}")
        if cat_id not in normalized:
            normalized.append(cat_id)
    return normalized


class ReviewCreateRequest(BaseModel):
    university: str
    rating: int
    categories: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    text: str
    is_anonymous: bool = True
    education_status: Optional[str] = "student"
    graduation_year: Optional[int] = None
    rating_dorm: Optional[int] = None
    rating_food: Optional[int] = None
    rating_transport: Optional[int] = None
    rating_social: Optional[int] = None
    rating_academic: Optional[int] = None
    criteria: Optional[Dict[str, Any]] = None
    yurt: Optional[int] = None
    yemekhane: Optional[int] = None
    ulasim: Optional[int] = None
    sosyal: Optional[int] = None
    akademik: Optional[int] = None
    egitim: Optional[int] = None

class ReplyCreateRequest(BaseModel):
    text: str

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    university: Optional[str] = None
    department: Optional[str] = None
    grade: Optional[str] = None
    bio: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class SchoolSuggestionCreate(BaseModel):
    uni_name: str
    city: str
    campus: Optional[str] = ""
    website: Optional[str] = ""
    email: str
    notes: Optional[str] = ""

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class BlogSubmissionCreate(BaseModel):
    title: str
    category: str
    read_time: Optional[str] = "4 dk okuma"
    author_name: str
    author_info: str
    summary: Optional[str] = ""
    content: str

class FavoriteToggleRequest(BaseModel):
    university: str

class UserRoleUpdate(BaseModel):
    role: str

class UserStatusUpdate(BaseModel):
    is_active: bool

# ─── Auth Dependency ──────────────────────

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Giriş yapmanız gerekmektedir."
        )
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz veya süresi dolmuş oturum."
        )
    try:
        user_id = int(payload["sub"])
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz oturum kimliği."
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı bulunamadı."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hesabınız askıya alınmıştır. Destek ile iletişime geçin."
        )
    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için yönetici (Admin) yetkisi gerekmektedir."
        )
    return current_user

def require_moderator_or_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in ["admin", "moderator"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için moderatör veya yönetici yetkisi gerekmektedir."
        )
    return current_user

def get_optional_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    try:
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            user_id = int(payload["sub"])
            return db.query(User).filter(User.id == user_id).first()
    except Exception:
        pass
    return None

def calc_initials(name: str) -> str:
    if not name:
        return "MS"
    words = name.strip().split()
    initials = words[0][0].upper()
    if len(words) > 1:
        initials += words[-1][0].upper()
    return initials

# ─── Auth Endpoints ───────────────────────

@app.post("/api/auth/register")
def register(req: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    client_ip = get_client_ip(request)
    check_rate_limit(f"register:{client_ip}", max_requests=5, window_seconds=60)

    clean_email = req.email.strip().lower()
    if "@" not in clean_email or "." not in clean_email or len(clean_email) > 150:
        raise HTTPException(status_code=400, detail="Geçerli bir e-posta adresi giriniz.")

    name = req.name.strip()
    if not name or len(name) > 100:
        raise HTTPException(status_code=400, detail="İsim 1-100 karakter arasında olmalıdır.")

    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Şifre en az 6 karakter olmalıdır.")
    if len(req.password) > 128:
        raise HTTPException(status_code=400, detail="Şifre en fazla 128 karakter olabilir.")

    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu e-posta adresi zaten kullanımda.")

    user = User(
        name=name,
        email=clean_email,
        password_hash=hash_password(req.password),
        initials=calc_initials(name)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email, "name": user.name, "role": user.role or "user"})
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "initials": user.initials,
            "role": user.role or "user"
        }
    }

@app.post("/api/auth/login")
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    client_ip = get_client_ip(request)
    clean_email = req.email.strip().lower()
    check_rate_limit(f"login:{client_ip}:{clean_email}", max_requests=10, window_seconds=60)

    user = db.query(User).filter(User.email == clean_email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=400, detail="E-posta veya şifre hatalı.")

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hesabınız askıya alınmıştır. Lütfen destek ekibi ile iletişime geçin."
        )

    token = create_access_token({"sub": user.id, "email": user.email, "name": user.name, "role": user.role or "user"})
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "initials": user.initials,
            "role": user.role or "user"
        }
    }

@app.get("/api/auth/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "initials": user.initials,
        "role": user.role or "user",
        "is_active": user.is_active
    }

@app.get("/api/users/me")
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    review_count = db.query(Review).filter(Review.user_id == current_user.id).count()
    upvote_count = db.query(func.count(Interaction.id)).join(
        Review, Review.id == Interaction.review_id
    ).filter(
        Review.user_id == current_user.id,
        Interaction.interaction_type == "like"
    ).scalar() or 0

    sug_count = db.query(SchoolSuggestion).filter(SchoolSuggestion.email.ilike(current_user.email)).count()
    blog_count = db.query(BlogSubmission).filter(
        (BlogSubmission.author_name.ilike(current_user.name)) |
        (BlogSubmission.author_info.ilike(f"%{current_user.email}%"))
    ).count()
    fav_count = db.query(UserFavorite).filter(UserFavorite.user_id == current_user.id).count()
    unread_notifications = db.query(UserNotification).filter(
        UserNotification.user_id == current_user.id,
        UserNotification.is_read == False
    ).count()

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "initials": current_user.initials or calc_initials(current_user.name),
        "university": current_user.university or "",
        "department": current_user.department or "",
        "grade": current_user.grade or "",
        "bio": current_user.bio or "",
        "role": current_user.role or "user",
        "created_at": current_user.created_at.strftime("%d.%m.%Y") if current_user.created_at else "",
        "stats": {
            "review_count": review_count,
            "upvote_count": upvote_count,
            "submission_count": sug_count + blog_count,
            "favorite_count": fav_count,
            "unread_notifications": unread_notifications
        }
    }

@app.get("/api/users/me/notifications")
def get_my_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifs = db.query(UserNotification).filter(
        UserNotification.user_id == current_user.id
    ).order_by(UserNotification.id.desc()).all()
    return [n.to_dict() for n in notifs]

@app.patch("/api/users/me/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notif = db.query(UserNotification).filter(
        UserNotification.id == notification_id,
        UserNotification.user_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Bildirim bulunamadı.")
    notif.is_read = True
    db.commit()
    return {"success": True, "message": "Bildirim okundu olarak işaretlendi."}

@app.post("/api/users/me/notifications/read-all")
def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(UserNotification).filter(
        UserNotification.user_id == current_user.id,
        UserNotification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"success": True, "message": "Tüm bildirimler okundu olarak işaretlendi."}

@app.delete("/api/users/me/notifications/{notification_id}")
def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notif = db.query(UserNotification).filter(
        UserNotification.id == notification_id,
        UserNotification.user_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Bildirim bulunamadı.")
    db.delete(notif)
    db.commit()
    return {"success": True, "message": "Bildirim silindi."}

@app.get("/api/users/me/reviews")
def get_my_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reviews = db.query(Review).filter(
        Review.user_id == current_user.id
    ).order_by(Review.timestamp.desc()).all()
    return [review.to_dict() for review in reviews]

@app.get("/api/users/me/submissions")
def get_my_submissions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    suggestions = db.query(SchoolSuggestion).filter(
        SchoolSuggestion.email.ilike(current_user.email)
    ).order_by(SchoolSuggestion.created_at.desc()).all()

    experiences = db.query(BlogSubmission).filter(
        (BlogSubmission.author_name.ilike(current_user.name)) |
        (BlogSubmission.author_info.ilike(f"%{current_user.email}%"))
    ).order_by(BlogSubmission.created_at.desc()).all()

    items = []
    for s in suggestions:
        status_norm = "approved" if s.status in ("approved", "published") else ("rejected" if s.status == "rejected" else "pending")
        default_note = (
            "Üniversite/kampüs öneriniz doğrulandı ve platform veritabanına eklendi."
            if status_norm == "approved" else
            "Önerilen kurum sistemimizde zaten mevcut veya resmi YÖK kaydı doğrulanamadı."
            if status_norm == "rejected" else
            "Öneriniz moderasyon sırasındadır. Resmi bilgiler kontrol edildikten sonra eklenecektir."
        )
        items.append({
            "id": f"sug-{s.id}",
            "raw_id": s.id,
            "type": "school_suggestion",
            "type_label": "Okul Önerisi",
            "title": s.uni_name,
            "subtitle": f"{s.city}" + (f" · {s.campus}" if s.campus else ""),
            "summary": s.notes or f"Resmi Web: {s.website or 'Belirtilmedi'}",
            "status": status_norm,
            "admin_note": s.admin_note or default_note,
            "created_at": s.created_at.isoformat() if s.created_at else None
        })

    for b in experiences:
        status_norm = "approved" if b.status in ("approved", "published") else ("rejected" if b.status == "rejected" else "pending")
        default_note = (
            "Deneyim yazınız yayın ilkelerimize uygun bulundu ve Kampüs Sesi Blog'da yayına alındı."
            if status_norm == "approved" else
            "Gönderiniz topluluk rehberi standartlarını veya özgünlük kriterlerini karşılamadığı için reddedildi."
            if status_norm == "rejected" else
            "Deneyim paylaşımınız editör ekibimiz tarafından inceleniyor. Kısa süre içinde yayına alınacaktır."
        )
        items.append({
            "id": f"exp-{b.id}",
            "raw_id": b.id,
            "type": "experience",
            "type_label": "Deneyim & Blog",
            "title": b.title,
            "subtitle": f"{b.category} · {b.read_time}",
            "summary": b.summary or (b.content[:160] + "..." if len(b.content) > 160 else b.content),
            "status": status_norm,
            "admin_note": b.admin_note or default_note,
            "created_at": b.created_at.isoformat() if b.created_at else None
        })

    items.sort(key=lambda x: x["created_at"] or "", reverse=True)

    return {
        "submissions": items,
        "school_suggestions": [s.to_dict() for s in suggestions],
        "experiences": [b.to_dict() for b in experiences]
    }

@app.patch("/api/users/me")
def update_my_profile(
    req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.name is not None:
        name = req.name.strip()
        if not name:
            raise HTTPException(status_code=400, detail="Ad soyad boş bırakılamaz.")
        current_user.name = name
        current_user.initials = calc_initials(name)
        db.query(Review).filter(Review.user_id == current_user.id).update({
            Review.user_name: name,
            Review.initials: current_user.initials
        }, synchronize_session=False)

    if req.university is not None:
        current_user.university = req.university.strip()
    if req.department is not None:
        current_user.department = req.department.strip()
    if req.grade is not None:
        current_user.grade = req.grade.strip()
    if req.bio is not None:
        current_user.bio = req.bio.strip()

    if req.new_password is not None and req.new_password.strip() != "":
        if not req.current_password or not verify_password(req.current_password, current_user.password_hash):
            raise HTTPException(status_code=400, detail="Mevcut şifreniz hatalı.")
        if len(req.new_password) < 6:
            raise HTTPException(status_code=400, detail="Yeni şifre en az 6 karakter olmalıdır.")
        current_user.password_hash = hash_password(req.new_password)

    db.commit()
    db.refresh(current_user)
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "initials": current_user.initials,
        "university": current_user.university or "",
        "department": current_user.department or "",
        "grade": current_user.grade or "",
        "bio": current_user.bio or "",
        "role": current_user.role or "user"
    }

# ─── Reviews Endpoints ────────────────────

@app.get("/api/reviews")
def get_reviews(
    university: Optional[str] = None,
    user: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Review)
    if university:
        query = query.filter(Review.university == university)
    if user:
        query = query.filter(Review.user_name == user)

    reviews = query.order_by(Review.timestamp.desc()).all()
    return [r.to_dict() for r in reviews]

@app.post("/api/reviews")
def create_review(
    req: ReviewCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_rate_limit(f"review_user:{current_user.id}", max_requests=6, window_seconds=60)

    clean_text = req.text.strip()
    if len(clean_text) < 10:
        raise HTTPException(status_code=400, detail="Değerlendirme metni en az 10 karakter olmalıdır.")
    if len(clean_text) > 4000:
        raise HTTPException(status_code=400, detail="Değerlendirme metni en fazla 4000 karakter olabilir.")

    raw_categories = req.categories if req.categories is not None else (req.tags if req.tags is not None else [])
    normalized_categories = normalize_review_categories(raw_categories)
    if len(normalized_categories) < 1:
        raise HTTPException(status_code=400, detail="Lütfen en az bir kategori seç.")

    now_ms = int(time.time() * 1000)
    turkish_months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"]
    now = time.localtime()
    date_str = f"{now.tm_mday:02d} {turkish_months[now.tm_mon - 1]} {now.tm_year}"

    grad_year = None
    if req.education_status == "graduate" and req.graduation_year:
        try:
            grad_year = int(req.graduation_year)
            current_year = now.tm_year
            if grad_year < 1950 or grad_year > current_year + 1:
                grad_year = None
        except (ValueError, TypeError):
            grad_year = None

    def clean_criterion(val):
        if val is None:
            return None
        try:
            v = int(val)
            return v if 1 <= v <= 5 else None
        except (ValueError, TypeError):
            return None

    crit_dict = req.criteria if isinstance(req.criteria, dict) else {}

    r_dorm = clean_criterion(req.rating_dorm if req.rating_dorm is not None else (req.yurt if req.yurt is not None else crit_dict.get('yurt')))
    r_food = clean_criterion(req.rating_food if req.rating_food is not None else (req.yemekhane if req.yemekhane is not None else crit_dict.get('yemekhane')))
    r_trans = clean_criterion(req.rating_transport if req.rating_transport is not None else (req.ulasim if req.ulasim is not None else crit_dict.get('ulasim')))
    r_soc = clean_criterion(req.rating_social if req.rating_social is not None else (req.sosyal if req.sosyal is not None else crit_dict.get('sosyal')))
    r_acad = clean_criterion(req.rating_academic if req.rating_academic is not None else (req.akademik if req.akademik is not None else (req.egitim if req.egitim is not None else (crit_dict.get('akademik') if crit_dict.get('akademik') is not None else crit_dict.get('egitim')))))

    review = Review(
        user_id=current_user.id,
        user_name=current_user.name,
        initials=current_user.initials,
        university=req.university.strip(),
        rating=max(1, min(5, req.rating)),
        categories_json=json.dumps(normalized_categories, ensure_ascii=False),
        tags_json=json.dumps(normalized_categories, ensure_ascii=False),
        text=clean_text,
        is_anonymous=bool(req.is_anonymous),
        education_status=(req.education_status or "student").strip() if req.education_status else None,
        graduation_year=grad_year,
        rating_dorm=r_dorm,
        rating_food=r_food,
        rating_transport=r_trans,
        rating_social=r_soc,
        rating_academic=r_acad,
        timestamp=now_ms,
        date=date_str
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review.to_dict()

@app.delete("/api/reviews/{review_id}")
def delete_review(
    review_id: int,
    req: Optional[ReviewDeleteRequest] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Değerlendirme bulunamadı.")
    
    is_author = (review.user_id is not None and review.user_id == current_user.id)
    is_admin = (current_user.role in ["admin", "moderator"])
    if not (is_author or is_admin):
        raise HTTPException(status_code=403, detail="Yalnızca kendi değerlendirmenizi silebilirsiniz.")

    # Eğer yönetici veya moderatör siliyorsa kural ihlali bildirimi ve geri dönüş mesajı oluştur:
    if is_admin:
        target_uid = review.user_id
        if not target_uid and review.user_name:
            matched = db.query(User).filter(
                (User.name == review.user_name) |
                (User.name.like(f"%{review.user_name}%")) |
                (User.email.like(f"%{review.user_name}%"))
            ).first()
            if matched:
                target_uid = matched.id

        custom_reason = (req.reason.strip() if req and req.reason and req.reason.strip() else None)
        feedback_text = custom_reason if custom_reason else "Site kurallarımız ve topluluk ilkelerimiz çerçevesi dışındaki içerik veya üslup."

        final_msg = (
            f"🏛️ Üniversite: {review.university}\n"
            f"⭐ Değerlendirme Puanı: {review.rating}/5\n"
            f"📝 Silinen Yorumunuz:\n\"{review.text}\"\n\n"
            f"📢 Yönetim Geri Dönüşü & Kaldırılma Gerekçesi:\n"
            f"Yorumunuz site kurallarımız çerçevesi dışında olduğu için yönetim tarafından kaldırılmıştır.\n"
            f"Geri Dönüş Notu: {feedback_text}"
        )

        if target_uid and not is_author:
            db.add(UserNotification(
                user_id=target_uid,
                title="Yorumunuz Kaldırıldı (Kural İhlali)",
                message=final_msg,
                notification_type="warning"
            ))

    db.delete(review)
    db.commit()
    return {"success": True, "message": "Değerlendirme silindi."}

@app.post("/api/reviews/{review_id}/reply")
def add_reply(
    review_id: int,
    req: ReplyCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_rate_limit(f"reply_user:{current_user.id}", max_requests=10, window_seconds=60)
    clean_text = req.text.strip()
    if not clean_text or len(clean_text) > 1500:
        raise HTTPException(status_code=400, detail="Yanıt 1-1500 karakter arasında olmalıdır.")

    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Değerlendirme bulunamadı.")

    turkish_months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    now = time.localtime()
    date_str = f"{now.tm_mday:02d} {turkish_months[now.tm_mon - 1]} {now.tm_year}"

    reply = Reply(
        review_id=review.id,
        user_name=current_user.name,
        text=clean_text,
        date=date_str,
        timestamp=int(time.time() * 1000)
    )
    db.add(reply)
    db.commit()
    db.refresh(reply)
    return reply.to_dict()

# ─── Interactions Endpoints (Likes / Dislikes) ───

@app.post("/api/reviews/{review_id}/like")
def toggle_like(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Değerlendirme bulunamadı.")

    interaction = db.query(Interaction).filter(
        Interaction.review_id == review_id,
        Interaction.user_name == current_user.name
    ).first()

    if interaction:
        if interaction.interaction_type == "like":
            db.delete(interaction)
        else:
            interaction.interaction_type = "like"
    else:
        new_int = Interaction(
            review_id=review_id,
            user_name=current_user.name,
            interaction_type="like"
        )
        db.add(new_int)

    db.commit()

    # Return refreshed interactions for this review
    all_ints = db.query(Interaction).filter(Interaction.review_id == review_id).all()
    likes = [i.user_name for i in all_ints if i.interaction_type == "like"]
    dislikes = [i.user_name for i in all_ints if i.interaction_type == "dislike"]
    return {"likes": likes, "dislikes": dislikes}

@app.post("/api/reviews/{review_id}/dislike")
def toggle_dislike(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Değerlendirme bulunamadı.")

    interaction = db.query(Interaction).filter(
        Interaction.review_id == review_id,
        Interaction.user_name == current_user.name
    ).first()

    if interaction:
        if interaction.interaction_type == "dislike":
            db.delete(interaction)
        else:
            interaction.interaction_type = "dislike"
    else:
        new_int = Interaction(
            review_id=review_id,
            user_name=current_user.name,
            interaction_type="dislike"
        )
        db.add(new_int)

    db.commit()

    all_ints = db.query(Interaction).filter(Interaction.review_id == review_id).all()
    likes = [i.user_name for i in all_ints if i.interaction_type == "like"]
    dislikes = [i.user_name for i in all_ints if i.interaction_type == "dislike"]
    return {"likes": likes, "dislikes": dislikes}

@app.get("/api/interactions")
def get_all_interactions(db: Session = Depends(get_db)):
    interactions = db.query(Interaction).all()
    result = {}
    for i in interactions:
        rid = str(i.review_id)
        if rid not in result:
            result[rid] = {"likes": [], "dislikes": []}
        if i.interaction_type == "like":
            result[rid]["likes"].append(i.user_name)
        elif i.interaction_type == "dislike":
            result[rid]["dislikes"].append(i.user_name)
    return result

# ─── Universities Endpoints ──────────────────────────────

from database import University, UniversityAddress, KykDorm, UniversityDorm

@app.get("/api/universities")
def get_universities(db: Session = Depends(get_db)):
    """Tüm üniversiteleri listeler."""
    records = db.query(University).order_by(University.name).all()
    return [r.to_dict() for r in records]

@app.get("/api/university-addresses")
def get_all_university_addresses(db: Session = Depends(get_db)):
    """university_addresses tablosundaki tüm üniversite adres ve koordinatlarını listeler."""
    records = db.query(UniversityAddress).order_by(UniversityAddress.id.asc()).all()
    return [r.to_dict() for r in records]

@app.get("/api/universities/{uni_identifier}/address")
def get_university_address(uni_identifier: str, db: Session = Depends(get_db)):
    """ID'si veya adı verilen üniversitenin university_addresses tablosundaki adres ve koordinatlarını getirir."""
    if uni_identifier.isdigit():
        uid = int(uni_identifier)
        addr = db.query(UniversityAddress).filter(UniversityAddress.university_id == uid).first()
        if addr:
            return addr.to_dict()
        record = db.query(University).filter(University.id == uid).first()
    else:
        clean = uni_identifier.strip()
        record = db.query(University).filter(University.name == clean).first()
        if not record:
            base_name = clean.split("(")[0].strip()
            record = db.query(University).filter(
                (University.name.ilike(f"%{base_name}%")) |
                (University.name.ilike(f"%{clean}%"))
            ).first()

    if record:
        addr = db.query(UniversityAddress).filter(UniversityAddress.university_id == record.id).first()
        if addr:
            return addr.to_dict()

    raise HTTPException(status_code=404, detail="Bu üniversite için kayıtlı adres bulunamadı.")

@app.get("/api/universities/{uni_identifier}/dorms")
def get_university_dorms(uni_identifier: str, db: Session = Depends(get_db)):
    """ID'si veya adı verilen üniversiteye yakın (<= 10 km) KYK yurtlarını mesafeye göre artan sırada getirir."""
    target_uid = None
    if uni_identifier.isdigit():
        target_uid = int(uni_identifier)
    else:
        clean = uni_identifier.strip()
        record = db.query(University).filter(University.name == clean).first()
        if not record:
            base_name = clean.split("(")[0].strip()
            record = db.query(University).filter(
                (University.name.ilike(f"%{base_name}%")) |
                (University.name.ilike(f"%{clean}%"))
            ).first()
        if record:
            target_uid = record.id

    if target_uid is None:
        return []

    matches = (
        db.query(UniversityDorm)
        .filter(
            UniversityDorm.university_id == target_uid,
            UniversityDorm.distance_km != None,
            UniversityDorm.distance_km <= 30.0
        )
        .order_by(UniversityDorm.distance_km.asc())
        .all()
    )
    return [
        m.dorm.to_dict(distance_km=m.distance_km, nearest_campus=m.nearest_campus)
        for m in matches
        if m.dorm is not None and m.dorm.lat is not None and m.dorm.lng is not None
    ]

@app.get("/api/universities/{uni_name}")
def get_university(uni_name: str, db: Session = Depends(get_db)):
    """Spesifik bir üniversitenin detaylarını (ve bağlı adresini) getirir."""
    clean = uni_name.strip()
    if clean.isdigit():
        record = db.query(University).filter(University.id == int(clean)).first()
    else:
        record = db.query(University).filter(University.name == clean).first()
    if not record:
        base_name = clean.split("(")[0].strip()
        record = db.query(University).filter(
            (University.name.ilike(f"%{base_name}%")) |
            (University.name.ilike(f"%{clean}%"))
        ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Üniversite bulunamadı")
    data = record.to_dict()
    data["about"] = record.about
    data["about_source"] = record.about_source
    data["about_updated"] = record.about_updated.isoformat() if record.about_updated else None
    return data

# ─── Suggestions, Contact, Blog & Favorites Endpoints ────

@app.post("/api/suggestions/school")
def create_school_suggestion(req: SchoolSuggestionCreate, request: Request, db: Session = Depends(get_db)):
    client_ip = get_client_ip(request)
    check_rate_limit(f"sug:{client_ip}", max_requests=5, window_seconds=60)

    clean_email = req.email.strip().lower()
    if "@" not in clean_email or "." not in clean_email or len(clean_email) > 150:
        raise HTTPException(status_code=400, detail="Geçerli bir e-posta adresi giriniz.")

    clean_uni = req.uni_name.strip()
    clean_city = req.city.strip()
    if not clean_uni or not clean_city or len(clean_uni) > 150 or len(clean_city) > 100:
        raise HTTPException(status_code=400, detail="Üniversite adı ve şehir zorunludur (en fazla 150 karakter).")

    clean_website = (req.website or "").strip()
    if clean_website:
        w_lower = clean_website.lower()
        if not (w_lower.startswith("http://") or w_lower.startswith("https://")):
            raise HTTPException(status_code=400, detail="Web sitesi adresi 'http://' veya 'https://' ile başlamalıdır.")
        if len(clean_website) > 255:
            raise HTTPException(status_code=400, detail="Web sitesi adresi en fazla 255 karakter olabilir.")

    clean_notes = (req.notes or "").strip()
    if len(clean_notes) > 1000:
        raise HTTPException(status_code=400, detail="Notlar en fazla 1000 karakter olabilir.")

    suggestion = SchoolSuggestion(
        uni_name=clean_uni,
        city=clean_city,
        campus=(req.campus or "").strip()[:150],
        website=clean_website,
        email=clean_email,
        notes=clean_notes
    )
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)
    return {"success": True, "message": "Üniversite öneriniz başarıyla kaydedildi.", "data": suggestion.to_dict()}


def notify_discord_new_message(name: str, email: str, subject: str, message: str):
    """Optionally send notification to Discord webhook when a new contact message is received."""
    _load_dotenv_files()
    webhook_url = os.getenv("DISCORD_WEBHOOK_URL", "").strip()
    if not webhook_url:
        return
    try:
        clean_name = (name or "").strip()
        clean_email = (email or "").strip()
        clean_subj = (subject or "").strip()
        raw_msg = (message or "").strip()
        truncated_msg = raw_msg[:200]
        if len(raw_msg) > 200:
            truncated_msg += "..."

        discord_payload = {
            "content": f"📬 **Yeni İletişim Mesajı**\n**Gönderen:** {clean_name} ({clean_email})\n**Konu:** {clean_subj}\n**Mesaj:**\n> {truncated_msg}"
        }
        payload_bytes = json.dumps(discord_payload).encode("utf-8")
        req = urllib.request.Request(
            webhook_url,
            data=payload_bytes,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "KampusSesi-Notifier/1.0"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            pass
    except Exception as e:
        print(f"[WARN] Discord webhook notification failed: {e}")


@app.post("/api/contact")
def create_contact_message(req: ContactMessageCreate, request: Request, db: Session = Depends(get_db)):
    client_ip = get_client_ip(request)
    check_rate_limit(f"contact:{client_ip}", max_requests=5, window_seconds=60)

    clean_name = req.name.strip()
    clean_email = req.email.strip().lower()
    clean_subj = req.subject.strip()
    clean_msg = req.message.strip()

    if not clean_name or not clean_email or not clean_msg:
        raise HTTPException(status_code=400, detail="Ad, e-posta ve mesaj alanları zorunludur.")
    if "@" not in clean_email or "." not in clean_email or len(clean_email) > 150:
        raise HTTPException(status_code=400, detail="Geçerli bir e-posta adresi giriniz.")
    if len(clean_name) > 100:
        raise HTTPException(status_code=400, detail="İsim en fazla 100 karakter olabilir.")
    if len(clean_subj) > 150:
        raise HTTPException(status_code=400, detail="Konu en fazla 150 karakter olabilir.")
    if len(clean_msg) > 3000:
        raise HTTPException(status_code=400, detail="Mesaj en fazla 3000 karakter olabilir.")

    msg = ContactMessage(
        name=clean_name,
        email=clean_email,
        subject=clean_subj,
        message=clean_msg
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    # Optional Discord notification (failure never blocks or fails user request)
    try:
        notify_discord_new_message(
            name=msg.name,
            email=msg.email,
            subject=msg.subject,
            message=msg.message
        )
    except Exception:
        pass

    return {"success": True, "message": "Mesajınız başarıyla iletildi.", "data": msg.to_dict()}


@app.post("/api/blog/submissions")
def create_blog_submission(req: BlogSubmissionCreate, request: Request, db: Session = Depends(get_db)):
    client_ip = get_client_ip(request)
    check_rate_limit(f"blog:{client_ip}", max_requests=5, window_seconds=60)

    clean_title = req.title.strip()
    clean_content = req.content.strip()
    clean_author = req.author_name.strip()

    if not clean_title or not clean_content or not clean_author:
        raise HTTPException(status_code=400, detail="Başlık, yazar adı ve içerik alanları zorunludur.")
    if len(clean_title) > 200:
        raise HTTPException(status_code=400, detail="Başlık en fazla 200 karakter olabilir.")
    if len(clean_author) > 100:
        raise HTTPException(status_code=400, detail="Yazar adı en fazla 100 karakter olabilir.")
    if len(clean_content) > 20000:
        raise HTTPException(status_code=400, detail="Blog içeriği en fazla 20.000 karakter olabilir.")

    sub = BlogSubmission(
        title=clean_title,
        category=req.category.strip()[:50] if req.category else "Genel",
        read_time=(req.read_time or "4 dk okuma").strip()[:30],
        author_name=clean_author,
        author_info=(req.author_info or "").strip()[:200],
        summary=(req.summary or "").strip()[:500],
        content=clean_content
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return {"success": True, "message": "Blog yazınız başarıyla kaydedildi.", "data": sub.to_dict()}


@app.get("/api/users/me/favorites")
def get_user_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    favs = db.query(UserFavorite).filter(UserFavorite.user_id == current_user.id).all()
    return [f.university for f in favs]

@app.post("/api/users/me/favorites")
def add_user_favorite(
    req: FavoriteToggleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    uni = req.university.strip()
    existing = db.query(UserFavorite).filter(
        UserFavorite.user_id == current_user.id,
        UserFavorite.university == uni
    ).first()
    if existing:
        favs = db.query(UserFavorite).filter(UserFavorite.user_id == current_user.id).all()
        return {"success": True, "message": "Zaten favorilerde ekli.", "favorites": [f.university for f in favs]}
    
    fav = UserFavorite(user_id=current_user.id, university=uni)
    db.add(fav)
    db.commit()
    favs = db.query(UserFavorite).filter(UserFavorite.user_id == current_user.id).all()
    return {"success": True, "message": "Favorilere eklendi.", "favorites": [f.university for f in favs]}

@app.delete("/api/users/me/favorites/{uni_name}")
def remove_user_favorite(
    uni_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    uni = uni_name.strip()
    fav = db.query(UserFavorite).filter(
        UserFavorite.user_id == current_user.id,
        UserFavorite.university == uni
    ).first()
    if fav:
        db.delete(fav)
        db.commit()
    favs = db.query(UserFavorite).filter(UserFavorite.user_id == current_user.id).all()
    return {"success": True, "message": "Favorilerden çıkarıldı.", "favorites": [f.university for f in favs]}

# ─── Admin Panel API Endpoints ───────────

@app.get("/api/admin/dashboard/stats")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    total_users = db.query(User).count()
    total_reviews = db.query(Review).count()
    pending_suggestions = db.query(SchoolSuggestion).filter(SchoolSuggestion.status == "pending").count()
    pending_blogs = db.query(BlogSubmission).filter(BlogSubmission.status == "pending").count()
    unread_messages = db.query(ContactMessage).filter(ContactMessage.status == "unread").count()
    total_dorms = db.query(KykDorm).count()

    return {
        "total_users": total_users,
        "total_reviews": total_reviews,
        "pending_suggestions": pending_suggestions,
        "pending_blogs": pending_blogs,
        "unread_messages": unread_messages,
        "total_dorms": total_dorms
    }

@app.get("/api/admin/users")
def get_admin_users(
    q: Optional[str] = None,
    role: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    query = db.query(User)
    if q:
        kw = f"%{q.strip().lower()}%"
        query = query.filter((User.name.ilike(kw)) | (User.email.ilike(kw)))
    if role and role != "all":
        query = query.filter(User.role == role)

    users = query.order_by(User.id.desc()).limit(100).all()
    result = []
    for u in users:
        reviews_count = db.query(Review).filter(Review.user_id == u.id).count()
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role or "user",
            "is_active": u.is_active if u.is_active is not None else True,
            "university": u.university or "",
            "department": u.department or "",
            "reviews_count": reviews_count,
            "created_at": u.created_at.strftime("%d.%m.%Y") if u.created_at else "—"
        })
    return result

@app.patch("/api/admin/users/{user_id}/role")
def update_user_role(
    user_id: int,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    if admin.id == user_id:
        raise HTTPException(status_code=400, detail="Kendi yöneticilik rolünüzü değiştiremezsiniz.")

    if data.role not in ["user", "moderator", "admin"]:
        raise HTTPException(status_code=400, detail="Geçersiz rol seçimi.")

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")

    target_user.role = data.role
    db.commit()
    return {"success": True, "message": f"{target_user.name} kullanıcısının rolü '{data.role}' olarak güncellendi."}

@app.patch("/api/admin/users/{user_id}/status")
def toggle_user_status(
    user_id: int,
    data: UserStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    if admin.id == user_id:
        raise HTTPException(status_code=400, detail="Kendi hesabınızı askıya alamazsınız.")

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")

    target_user.is_active = data.is_active
    db.commit()
    status_text = "aktifleştirildi" if data.is_active else "askıya alındı"
    return {"success": True, "message": f"{target_user.name} hesabı başarıyla {status_text}."}

@app.delete("/api/admin/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    if admin.id == user_id:
        raise HTTPException(status_code=400, detail="Kendi hesabınızı silemezsiniz.")

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")

    user_name = target_user.name
    db.delete(target_user)
    db.commit()
    return {"success": True, "message": f"{user_name} kullanıcısı sistemden kalıcı olarak silindi."}

@app.get("/api/admin/moderation/pending")
def get_pending_moderations(
    db: Session = Depends(get_db),
    admin: User = Depends(require_moderator_or_admin)
):
    suggestions = db.query(SchoolSuggestion).filter(SchoolSuggestion.status == "pending").order_by(SchoolSuggestion.id.desc()).all()
    blogs = db.query(BlogSubmission).filter(BlogSubmission.status == "pending").order_by(BlogSubmission.id.desc()).all()
    recent_reviews = db.query(Review).order_by(Review.id.desc()).limit(15).all()

    return {
        "suggestions": [s.to_dict() for s in suggestions],
        "blogs": [b.to_dict() for b in blogs],
        "recent_reviews": [r.to_dict() for r in recent_reviews]
    }

@app.patch("/api/admin/moderation/{content_type}/{content_id}")
def moderate_content(
    content_type: str,
    content_id: int,
    action: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_moderator_or_admin)
):
    new_status = "approved" if action in ["approve", "approved"] else "rejected"
    if content_type == "suggestion":
        item = db.query(SchoolSuggestion).filter(SchoolSuggestion.id == content_id).first()
    elif content_type == "blog":
        item = db.query(BlogSubmission).filter(BlogSubmission.id == content_id).first()
    else:
        raise HTTPException(status_code=400, detail="Geçersiz içerik türü.")

    if not item:
        raise HTTPException(status_code=404, detail="İçerik bulunamadı.")

    item.status = new_status
    db.commit()
    return {"success": True, "message": f"İçerik '{new_status}' olarak güncellendi."}

class ReviewDeleteRequest(BaseModel):
    reason: Optional[str] = None


@app.get("/api/admin/reviews")
def get_admin_reviews(
    q: Optional[str] = None,
    university: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_moderator_or_admin)
):
    query = db.query(Review)
    if university and university.strip():
        query = query.filter(Review.university == university.strip())
    if q and q.strip():
        kw = f"%{q.strip().lower()}%"
        query = query.filter(
            (Review.text.ilike(kw)) |
            (Review.university.ilike(kw)) |
            (Review.user_name.ilike(kw))
        )
    # En son eklenen yorum daima en başta:
    reviews = query.order_by(Review.id.desc()).limit(200).all()
    results = []
    for r in reviews:
        d = r.to_dict()
        if r.user_id:
            u = db.query(User).filter(User.id == r.user_id).first()
            d["author_email"] = u.email if u else None
            d["author_id"] = r.user_id
        else:
            d["author_email"] = None
            d["author_id"] = None
        results.append(d)
    return results


@app.delete("/api/admin/reviews/{review_id}")
def admin_delete_review(
    review_id: int,
    req: Optional[ReviewDeleteRequest] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_moderator_or_admin)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Yorum bulunamadı.")

    custom_reason = (req.reason.strip() if req and req.reason and req.reason.strip() else None)
    feedback_text = custom_reason if custom_reason else "Site kurallarımız ve topluluk ilkelerimiz çerçevesi dışındaki içerik veya üslup."

    final_msg = (
        f"🏛️ Üniversite: {review.university}\n"
        f"⭐ Değerlendirme Puanı: {review.rating}/5\n"
        f"📝 Silinen Yorumunuz:\n\"{review.text}\"\n\n"
        f"📢 Yönetim Geri Dönüşü & Kaldırılma Gerekçesi:\n"
        f"Yorumunuz site kurallarımız çerçevesi dışında olduğu için yönetim tarafından kaldırılmıştır.\n"
        f"Geri Dönüş Notu: {feedback_text}"
    )

    # Yorum kayıtlı bir üyeye aitse profil bildirim kutusuna düşür
    target_user_id = review.user_id
    if not target_user_id and review.user_name:
        matched_user = db.query(User).filter(
            (User.name == review.user_name) |
            (User.name.like(f"%{review.user_name}%")) |
            (User.email.like(f"%{review.user_name}%"))
        ).first()
        if matched_user:
            target_user_id = matched_user.id

    if target_user_id:
        db.add(UserNotification(
            user_id=target_user_id,
            title="Yorumunuz Kaldırıldı (Kural İhlali)",
            message=final_msg,
            notification_type="warning"
        ))

    db.delete(review)
    db.commit()
    return {
        "success": True,
        "message": "Yorum yayından kaldırıldı ve kullanıcıya bildirim iletildi."
    }

class ToggleMessageRepliedRequest(BaseModel):
    replied: Optional[bool] = None


@app.get("/api/admin/messages")
def get_admin_contact_messages(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    messages = db.query(ContactMessage).order_by(ContactMessage.id.desc()).limit(100).all()
    return [m.to_dict() for m in messages]


@app.patch("/api/admin/messages/{message_id}/read")
def toggle_message_read(
    message_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Mesaj bulunamadı.")
    
    if msg.status == "replied":
        msg.status = "unread"
    elif msg.status == "unread":
        msg.status = "replied" if msg.replied_at else "read"
    else:
        msg.status = "unread"
    
    db.commit()
    db.refresh(msg)
    return {
        "success": True,
        "status": msg.status,
        "is_read": (msg.status != "unread"),
        "data": msg.to_dict()
    }


@app.patch("/api/admin/messages/{message_id}/replied")
@app.post("/api/admin/messages/{message_id}/reply")
def toggle_message_replied(
    message_id: int,
    req: Optional[ToggleMessageRepliedRequest] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Mesaj bulunamadı.")
    
    is_currently_replied = bool(msg.status == "replied" or msg.replied_at)
    target_replied = not is_currently_replied if (req is None or req.replied is None) else req.replied

    if target_replied:
        msg.status = "replied"
        msg.replied_at = datetime.utcnow()
        msg.replied_by = admin.name or "Admin"
    else:
        msg.status = "read"
        msg.replied_at = None
        msg.replied_by = None

    db.commit()
    db.refresh(msg)
    return {
        "success": True,
        "status": msg.status,
        "is_replied": bool(msg.status == "replied" or msg.replied_at),
        "data": msg.to_dict()
    }

# ─── Static Frontend Serving ──────────────

FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")

if os.path.exists(os.path.join(FRONTEND_DIR, "css")):
    app.mount("/css", StaticFiles(directory=os.path.join(FRONTEND_DIR, "css")), name="css")
if os.path.exists(os.path.join(FRONTEND_DIR, "js")):
    app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")
if os.path.exists(os.path.join(FRONTEND_DIR, "img")):
    app.mount("/img", StaticFiles(directory=os.path.join(FRONTEND_DIR, "img")), name="img")
if os.path.exists(os.path.join(FRONTEND_DIR, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")

@app.get("/")
def serve_index():
    return FileResponse(
        os.path.join(FRONTEND_DIR, "index.html"),
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
    )

@app.get("/index.html")
def serve_index_html():
    return FileResponse(
        os.path.join(FRONTEND_DIR, "index.html"),
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
    )

if __name__ == "__main__":
    import uvicorn
    should_reload = os.getenv("UVICORN_RELOAD", "true").lower() in ("true", "1")
    print("\n" + "="*50)
    print("Kampüs Sesi Sunucusu Başlatılıyor...")
    print("Web Sitesi: http://localhost:8000")
    print(f"API Docs:   {'http://localhost:8000/docs (Aktif)' if ENABLE_DOCS else 'Devre Dışı (Güvenli)'}")
    print(f"Hot Reload: {'Açık (Geliştirme)' if should_reload else 'Kapalı (Performans / Demo)'}")
    print("Veritabanı: MySQL (Kampüs Sesi)")
    print("="*50 + "\n")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=should_reload, app_dir=BACKEND_DIR)