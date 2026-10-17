import os
import json
import time
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import (
    init_db, get_db, User, Review, Reply, Interaction,
    University, KykDorm, SchoolSuggestion, ContactMessage, BlogSubmission, UserFavorite
)
from auth_utils import hash_password, verify_password, create_access_token, decode_access_token

# Initialize database tables & seed
init_db()

app = FastAPI(
    title="Kampüs Sesi API",
    description="Üniversite Değerlendirme Platformu REST API ve Veritabanı Backend Servisi",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Pydantic Schemas ─────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ReviewCreateRequest(BaseModel):
    university: str
    rating: int
    tags: List[str]
    text: str

class ReplyCreateRequest(BaseModel):
    text: str

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    university: Optional[str] = None
    department: Optional[str] = None
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
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.strip().lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu e-posta adresi zaten kullanımda.")

    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Şifre en az 6 karakter olmalıdır.")

    name = req.name.strip()
    user = User(
        name=name,
        email=req.email.strip().lower(),
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
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.strip().lower()).first()
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

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "initials": current_user.initials or calc_initials(current_user.name),
        "university": current_user.university or "",
        "department": current_user.department or "",
        "stats": {
            "review_count": review_count,
            "upvote_count": upvote_count
        }
    }

@app.get("/api/users/me/reviews")
def get_my_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reviews = db.query(Review).filter(
        Review.user_id == current_user.id
    ).order_by(Review.timestamp.desc()).all()
    return [review.to_dict() for review in reviews]

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

    if req.new_password is not None:
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
        "department": current_user.department or ""
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
    now_ms = int(time.time() * 1000)
    turkish_months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"]
    now = time.localtime()
    date_str = f"{now.tm_mday:02d} {turkish_months[now.tm_mon - 1]} {now.tm_year}"

    review = Review(
        user_id=current_user.id,
        user_name=current_user.name,
        initials=current_user.initials,
        university=req.university.strip(),
        rating=max(1, min(5, req.rating)),
        tags_json=json.dumps(req.tags),
        text=req.text.strip(),
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Değerlendirme bulunamadı.")
    
    if review.user_id != current_user.id and review.user_name != current_user.name:
        raise HTTPException(status_code=403, detail="Yalnızca kendi değerlendirmenizi silebilirsiniz.")

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
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Değerlendirme bulunamadı.")

    turkish_months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    now = time.localtime()
    date_str = f"{now.tm_mday:02d} {turkish_months[now.tm_mon - 1]} {now.tm_year}"

    reply = Reply(
        review_id=review.id,
        user_name=current_user.name,
        text=req.text.strip(),
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

from database import University, KykDorm

@app.get("/api/universities")
def get_universities(db: Session = Depends(get_db)):
    """Tüm üniversiteleri listeler."""
    records = db.query(University).order_by(University.name).all()
    return [r.to_dict() for r in records]

@app.get("/api/universities/{uni_identifier}/dorms")
def get_university_dorms(uni_identifier: str, db: Session = Depends(get_db)):
    """ID'si veya adı verilen üniversiteye ait tüm KYK ve özel yurtları getirir."""
    # 1. Sayısal ID ile ara
    if uni_identifier.isdigit():
        uid = int(uni_identifier)
        dorms = db.query(KykDorm).filter(KykDorm.university_id == uid).all()
        if dorms:
            return [d.to_dict() for d in dorms]
        record = db.query(University).filter(University.id == uid).first()
    else:
        # 2. Üniversite adıyla ara
        clean = uni_identifier.strip()
        record = db.query(University).filter(University.name == clean).first()
        if not record:
            base_name = clean.split("(")[0].strip()
            record = db.query(University).filter(
                (University.name.ilike(f"%{base_name}%")) |
                (University.name.ilike(f"%{clean}%"))
            ).first()

    if record:
        dorms = db.query(KykDorm).filter(KykDorm.university_id == record.id).all()
        if dorms:
            return [d.to_dict() for d in dorms]

    # 3. Son çare genel yurt fallback
    fallback = db.query(KykDorm).limit(8).all()
    return [d.to_dict() for d in fallback]

@app.get("/api/universities/{uni_name}")
def get_university(uni_name: str, db: Session = Depends(get_db)):
    """Spesifik bir üniversitenin detaylarını getirir."""
    clean = uni_name.strip()
    record = db.query(University).filter(University.name == clean).first()
    if not record:
        base_name = clean.split("(")[0].strip()
        record = db.query(University).filter(
            (University.name.ilike(f"%{base_name}%")) |
            (University.name.ilike(f"%{clean}%"))
        ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Üniversite bulunamadı")
    return record.to_dict()

# ─── Suggestions, Contact, Blog & Favorites Endpoints ────

@app.post("/api/suggestions/school")
def create_school_suggestion(req: SchoolSuggestionCreate, db: Session = Depends(get_db)):
    if not req.uni_name.strip() or not req.city.strip() or not req.email.strip():
        raise HTTPException(status_code=400, detail="Üniversite adı, şehir ve e-posta zorunludur.")
    
    suggestion = SchoolSuggestion(
        uni_name=req.uni_name.strip(),
        city=req.city.strip(),
        campus=req.campus.strip() if req.campus else "",
        website=req.website.strip() if req.website else "",
        email=req.email.strip(),
        notes=req.notes.strip() if req.notes else ""
    )
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)
    return {"success": True, "message": "Üniversite öneriniz başarıyla kaydedildi.", "data": suggestion.to_dict()}

@app.get("/api/suggestions/school")
def get_school_suggestions(db: Session = Depends(get_db)):
    suggestions = db.query(SchoolSuggestion).order_by(SchoolSuggestion.created_at.desc()).all()
    return [s.to_dict() for s in suggestions]

@app.post("/api/contact")
def create_contact_message(req: ContactMessageCreate, db: Session = Depends(get_db)):
    if not req.name.strip() or not req.email.strip() or not req.message.strip():
        raise HTTPException(status_code=400, detail="Ad, e-posta ve mesaj alanları zorunludur.")
    
    msg = ContactMessage(
        name=req.name.strip(),
        email=req.email.strip(),
        subject=req.subject.strip(),
        message=req.message.strip()
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"success": True, "message": "Mesajınız başarıyla iletildi.", "data": msg.to_dict()}

@app.get("/api/contact")
def get_contact_messages(db: Session = Depends(get_db)):
    msgs = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [m.to_dict() for m in msgs]

@app.post("/api/blog/submissions")
def create_blog_submission(req: BlogSubmissionCreate, db: Session = Depends(get_db)):
    if not req.title.strip() or not req.content.strip() or not req.author_name.strip():
        raise HTTPException(status_code=400, detail="Başlık, yazar adı ve içerik alanları zorunludur.")
    
    sub = BlogSubmission(
        title=req.title.strip(),
        category=req.category.strip(),
        read_time=req.read_time.strip() if req.read_time else "4 dk okuma",
        author_name=req.author_name.strip(),
        author_info=req.author_info.strip(),
        summary=req.summary.strip() if req.summary else "",
        content=req.content.strip()
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return {"success": True, "message": "Blog yazınız başarıyla kaydedildi.", "data": sub.to_dict()}

@app.get("/api/blog/submissions")
def get_blog_submissions(db: Session = Depends(get_db)):
    subs = db.query(BlogSubmission).order_by(BlogSubmission.created_at.desc()).all()
    return [s.to_dict() for s in subs]

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

@app.delete("/api/admin/reviews/{review_id}")
def admin_delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_moderator_or_admin)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Yorum bulunamadı.")

    db.delete(review)
    db.commit()
    return {"success": True, "message": "Yorum yayından kaldırıldı."}

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
    msg.status = "read" if msg.status == "unread" else "unread"
    db.commit()
    return {"success": True, "status": msg.status, "is_read": (msg.status == "read")}

# ─── Static Frontend Serving ──────────────

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

if os.path.exists(os.path.join(BASE_DIR, "css")):
    app.mount("/css", StaticFiles(directory=os.path.join(BASE_DIR, "css")), name="css")
if os.path.exists(os.path.join(BASE_DIR, "js")):
    app.mount("/js", StaticFiles(directory=os.path.join(BASE_DIR, "js")), name="js")
if os.path.exists(os.path.join(BASE_DIR, "img")):
    app.mount("/img", StaticFiles(directory=os.path.join(BASE_DIR, "img")), name="img")

@app.get("/")
def serve_index():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))

@app.get("/index.html")
def serve_index_html():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*50)
    print("Kampüs Sesi Sunucusu Baslatiliyor...")
    print("Web Sitesi: http://localhost:8000")
    print("API Docs: http://localhost:8000/docs")
    print("Veritabani:  MySQL (Kampüs Sesi)")
    print("="*50 + "\n")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)