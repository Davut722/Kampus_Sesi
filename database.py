import os
import json
import time
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, BigInteger, Float, String, Text, Date, DateTime, ForeignKey, UniqueConstraint, JSON, Boolean, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

# ---------------------------------------------------------------------------
# Database configuration
# ---------------------------------------------------------------------------
# MySQL bağlantısı – XAMPP varsayılan: kullanıcı root, şifre boş.
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost/unireview?charset=utf8mb4"
DATABASE_URL = os.getenv("DATABASE_URL", SQLALCHEMY_DATABASE_URL)

# Engine creation – SQLite uses a special connect_args, MySQL (or others) do not.
try:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
        pool_pre_ping=True,
    )
except Exception as e:
    print(f"[ERROR] Failed to create database engine: {e}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    initials = Column(String(10), default="MS")
    photo_url = Column(String(255), default="")
    university = Column(String(150), default="")
    department = Column(String(150), default="")
    grade = Column(String(50), default="")  # e.g. "3. Sınıf", "Mezun"
    bio = Column(Text, default="")
    role = Column(String(20), default="user", nullable=False)  # 'user', 'moderator', 'admin'
    is_active = Column(Boolean, default=True, nullable=False)  # Account status: active or suspended
    created_at = Column(DateTime, default=datetime.utcnow)

    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("UserFavorite", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "initials": self.initials,
            "photo_url": self.photo_url or "",
            "university": self.university or "",
            "department": self.department or "",
            "grade": self.grade or "",
            "bio": self.bio or "",
            "role": self.role or "user",
            "is_active": self.is_active if self.is_active is not None else True,
            "created_at": self.created_at.strftime("%d.%m.%Y") if self.created_at else None
        }

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_name = Column(String(100), nullable=False)
    initials = Column(String(10), default="MS")
    university = Column(String(150), index=True, nullable=False)
    rating = Column(Integer, default=5)
    tags_json = Column(Text, default="[]")  # stored as JSON string
    text = Column(Text, nullable=False)
    timestamp = Column(BigInteger, default=lambda: int(time.time() * 1000))
    date = Column(String(50), nullable=False)
    is_recommended = Column(Boolean, nullable=True)
    is_anonymous = Column(Boolean, default=True, nullable=False)
    education_status = Column(String(50), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    rating_dorm = Column(Integer, nullable=True)
    rating_food = Column(Integer, nullable=True)
    rating_transport = Column(Integer, nullable=True)
    rating_social = Column(Integer, nullable=True)
    rating_academic = Column(Integer, nullable=True)

    user = relationship("User", back_populates="reviews")
    replies = relationship(
        "Reply",
        back_populates="review",
        cascade="all, delete-orphan",
        order_by="Reply.id.asc()",
    )
    interactions = relationship(
        "Interaction",
        back_populates="review",
        cascade="all, delete-orphan",
    )

    def to_dict(self, current_user_name=None):
        try:
            tags = json.loads(self.tags_json)
        except Exception:
            tags = []
        likes = [i.user_name for i in self.interactions if i.interaction_type == "like"]
        dislikes = [i.user_name for i in self.interactions if i.interaction_type == "dislike"]
        return {
            "id": self.id,
            "user": self.user_name,
            "initials": self.initials,
            "university": self.university,
            "rating": self.rating,
            "tags": tags,
            "text": self.text,
            "is_recommended": self.is_recommended,
            "is_anonymous": bool(self.is_anonymous) if self.is_anonymous is not None else True,
            "education_status": self.education_status,
            "graduation_year": self.graduation_year,
            "rating_dorm": self.rating_dorm,
            "rating_food": self.rating_food,
            "rating_transport": self.rating_transport,
            "rating_social": self.rating_social,
            "rating_academic": self.rating_academic,
            "criteria": {
                "yurt": self.rating_dorm or 0,
                "yemekhane": self.rating_food or 0,
                "ulasim": self.rating_transport or 0,
                "sosyal": self.rating_social or 0,
                "akademik": self.rating_academic or 0,
                "egitim": self.rating_academic or 0,
            },
            "timestamp": self.timestamp,
            "date": self.date,
            "replies": [r.to_dict() for r in self.replies],
            "likes": likes,
            "dislikes": dislikes,
        }

class Reply(Base):
    __tablename__ = "replies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    review_id = Column(Integer, ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False)
    user_name = Column(String(100), nullable=False)
    text = Column(Text, nullable=False)
    date = Column(String(50), nullable=False)
    timestamp = Column(BigInteger, default=lambda: int(time.time() * 1000))

    review = relationship("Review", back_populates="replies")

    def to_dict(self):
        return {
            "id": self.id,
            "user": self.user_name,
            "text": self.text,
            "date": self.date,
        }

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    review_id = Column(Integer, ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False)
    user_name = Column(String(100), nullable=False)
    interaction_type = Column(String(20), nullable=False)  # 'like' or 'dislike'

    __table_args__ = (
        UniqueConstraint("review_id", "user_name", name="uq_review_user_interaction"),
    )

    review = relationship("Review", back_populates="interactions")

class University(Base):
    __tablename__ = "universities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(200), unique=True, index=True, nullable=False)
    image_url = Column(String(500), default="")
    website_url = Column(String(255), default="")
    about = Column(Text, nullable=True)
    about_source = Column(Text, nullable=True)
    about_updated = Column(Date, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    dorms = relationship("KykDorm", back_populates="university", cascade="all, delete-orphan")
    address = relationship("UniversityAddress", back_populates="university", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "image_url": self.image_url,
            "website_url": self.website_url,
            "about": self.about,
            "about_source": self.about_source,
            "about_updated": self.about_updated.isoformat() if self.about_updated else None,
            "address": self.address.to_dict() if self.address else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class UniversityAddress(Base):
    __tablename__ = "university_addresses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    university_id = Column(Integer, ForeignKey("universities.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    campus_name = Column(String(200), nullable=False, default="Merkez Yerleşke")
    city = Column(String(100), nullable=False, default="")
    district = Column(String(100), default="")
    full_address = Column(Text, default="")
    transport_info = Column(Text, default="")
    latitude = Column(Float(precision=53), nullable=False)
    longitude = Column(Float(precision=53), nullable=False)
    zoom_level = Column(Integer, default=16)
    google_maps_url = Column(String(500), default="")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    university = relationship("University", back_populates="address")

    def to_dict(self):
        return {
            "id": self.id,
            "university_id": self.university_id,
            "university_name": self.university.name if self.university else None,
            "campus": self.campus_name,
            "campus_name": self.campus_name,
            "city": self.city,
            "district": self.district,
            "full_address": self.full_address,
            "info": self.transport_info or self.full_address,
            "transport_info": self.transport_info,
            "lat": self.latitude,
            "lng": self.longitude,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "zoom": self.zoom_level,
            "zoom_level": self.zoom_level,
            "googleMapsUrl": self.google_maps_url,
            "google_maps_url": self.google_maps_url,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class KykDorm(Base):
    __tablename__ = "kyk_dorms"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    university_id = Column(Integer, ForeignKey("universities.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(50), default="Karma") # Kiz, Erkek, Karma
    distance = Column(String(100), default="")
    fee = Column(String(100), default="")
    capacity = Column(String(50), default="")
    lat = Column(Float(precision=53), nullable=True)
    lng = Column(Float(precision=53), nullable=True)

    university = relationship("University", back_populates="dorms")

    def to_dict(self, distance_km=None, nearest_campus=None):
        mesafe_str = self.distance
        if distance_km is not None:
            d = float(distance_km)
            if d < 1.0:
                mesafe_str = f"Kuş uçuşu {int(round(d * 1000))} m"
            else:
                mesafe_str = f"Kuş uçuşu {d:.1f} km".replace(".", ",")
        data = {
            "id": self.id,
            "ad": self.name,
            "tip": self.type,
            "mesafe": mesafe_str,
            "ucret": self.fee,
            "kapasite": self.capacity,
            "lat": self.lat,
            "lng": self.lng,
        }
        if distance_km is not None:
            data["distance_km"] = round(float(distance_km), 2)
        if nearest_campus:
            data["nearest_campus"] = nearest_campus
        return data

class UniversityDorm(Base):
    __tablename__ = "university_dorm"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    university_id = Column(Integer, ForeignKey("universities.id", ondelete="CASCADE"), nullable=False, index=True)
    dorm_id = Column(Integer, ForeignKey("kyk_dorms.id", ondelete="CASCADE"), nullable=False, index=True)
    distance_km = Column(Float(precision=53), nullable=False)
    nearest_campus = Column(String(200), nullable=True)

    __table_args__ = (
        UniqueConstraint("university_id", "dorm_id", name="uq_university_dorm"),
    )

    university = relationship("University")
    dorm = relationship("KykDorm")

class SchoolSuggestion(Base):
    __tablename__ = "school_suggestions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uni_name = Column(String(200), nullable=False)
    city = Column(String(100), nullable=False)
    campus = Column(String(200), default="")
    website = Column(String(255), default="")
    email = Column(String(150), nullable=False)
    notes = Column(Text, default="")
    status = Column(String(50), default="pending")  # pending, approved, rejected
    admin_note = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "uni_name": self.uni_name,
            "city": self.city,
            "campus": self.campus,
            "campus_name": self.campus,
            "website": self.website,
            "email": self.email,
            "submitter_email": self.email,
            "notes": self.notes,
            "status": self.status,
            "admin_note": self.admin_note or "",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    subject = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="unread")  # unread, read, replied
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "sender_name": self.name,
            "email": self.email,
            "sender_email": self.email,
            "subject": self.subject,
            "message": self.message,
            "status": self.status,
            "is_read": self.status != "unread",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class BlogSubmission(Base):
    __tablename__ = "blog_submissions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    read_time = Column(String(50), default="4 dk okuma")
    author_name = Column(String(100), nullable=False)
    author_info = Column(String(200), nullable=False)
    summary = Column(Text, default="")
    content = Column(Text, nullable=False)
    status = Column(String(50), default="pending")  # pending, approved, published, rejected
    admin_note = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "read_time": self.read_time,
            "author_name": self.author_name,
            "author_info": self.author_info,
            "summary": self.summary,
            "content": self.content,
            "status": self.status,
            "admin_note": self.admin_note or "",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class UserFavorite(Base):
    __tablename__ = "user_favorites"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    university = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("user_id", "university", name="uq_user_university_favorite"),
    )

    user = relationship("User", back_populates="favorites")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "university": self.university,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

def init_db():
    # Create missing tables without deleting persisted user data.
    Base.metadata.create_all(bind=engine)

    # Automated lightweight migration: ensure new columns exist
    try:
        insp = inspect(engine)
        table_names = insp.get_table_names()
        with engine.connect() as conn:
            if 'users' in table_names:
                cols = [c['name'] for c in insp.get_columns('users')]
                if 'role' not in cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
                    conn.commit()
                if 'is_active' not in cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1"))
                    conn.commit()
                if 'grade' not in cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN grade VARCHAR(50) DEFAULT ''"))
                    conn.commit()
                if 'bio' not in cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN bio TEXT"))
                    conn.commit()

            if 'school_suggestions' in table_names:
                s_cols = [c['name'] for c in insp.get_columns('school_suggestions')]
                if 'admin_note' not in s_cols:
                    conn.execute(text("ALTER TABLE school_suggestions ADD COLUMN admin_note TEXT"))
                    conn.commit()

            if 'blog_submissions' in table_names:
                b_cols = [c['name'] for c in insp.get_columns('blog_submissions')]
                if 'admin_note' not in b_cols:
                    conn.execute(text("ALTER TABLE blog_submissions ADD COLUMN admin_note TEXT"))
                    conn.commit()

            if 'reviews' in table_names:
                r_cols = [c['name'] for c in insp.get_columns('reviews')]
                if 'is_recommended' not in r_cols:
                    conn.execute(text("ALTER TABLE reviews ADD COLUMN is_recommended BOOLEAN DEFAULT NULL"))
                    conn.commit()
                if 'is_anonymous' not in r_cols:
                    conn.execute(text("ALTER TABLE reviews ADD COLUMN is_anonymous BOOLEAN DEFAULT 1"))
                    conn.commit()
                if 'education_status' not in r_cols:
                    conn.execute(text("ALTER TABLE reviews ADD COLUMN education_status VARCHAR(50) DEFAULT NULL"))
                    conn.commit()
                if 'graduation_year' not in r_cols:
                    conn.execute(text("ALTER TABLE reviews ADD COLUMN graduation_year INT DEFAULT NULL"))
                    conn.commit()
                if 'rating_dorm' not in r_cols:
                    conn.execute(text("ALTER TABLE reviews ADD COLUMN rating_dorm INT DEFAULT NULL"))
                    conn.commit()
                if 'rating_food' not in r_cols:
                    conn.execute(text("ALTER TABLE reviews ADD COLUMN rating_food INT DEFAULT NULL"))
                    conn.commit()
                if 'rating_transport' not in r_cols:
                    conn.execute(text("ALTER TABLE reviews ADD COLUMN rating_transport INT DEFAULT NULL"))
                    conn.commit()
                if 'rating_social' not in r_cols:
                    conn.execute(text("ALTER TABLE reviews ADD COLUMN rating_social INT DEFAULT NULL"))
                    conn.commit()
                if 'rating_academic' not in r_cols:
                    conn.execute(text("ALTER TABLE reviews ADD COLUMN rating_academic INT DEFAULT NULL"))
                    conn.commit()

            if 'universities' in table_names:
                u_cols = [c['name'] for c in insp.get_columns('universities')]
                if 'about' not in u_cols:
                    conn.execute(text("ALTER TABLE universities ADD COLUMN about TEXT DEFAULT NULL"))
                    conn.commit()
                if 'about_source' not in u_cols:
                    conn.execute(text("ALTER TABLE universities ADD COLUMN about_source TEXT DEFAULT NULL"))
                    conn.commit()
                if 'about_updated' not in u_cols:
                    conn.execute(text("ALTER TABLE universities ADD COLUMN about_updated DATE DEFAULT NULL"))
                    conn.commit()

            if 'kyk_dorms' in table_names:
                k_cols = [c['name'] for c in insp.get_columns('kyk_dorms')]
                if 'lat' not in k_cols:
                    conn.execute(text("ALTER TABLE kyk_dorms ADD COLUMN lat DOUBLE DEFAULT NULL"))
                    conn.commit()
                if 'lng' not in k_cols:
                    conn.execute(text("ALTER TABLE kyk_dorms ADD COLUMN lng DOUBLE DEFAULT NULL"))
                    conn.commit()
    except Exception as e:
        print(f"[WARN] Table migration check note: {e}")

    # Add sample seed data if the reviews table is empty
    db = SessionLocal()
    try:
        # Ensure at least one admin user exists for management
        admin_user = db.query(User).filter(User.role == "admin").first()
        if not admin_user:
            # Promote Davut or first user to admin
            davut = db.query(User).filter(User.email.ilike("%davut%")).first()
            if davut:
                davut.role = "admin"
                db.commit()
            else:
                first_u = db.query(User).first()
                if first_u:
                    first_u.role = "admin"
                    db.commit()

        if db.query(Review).count() == 0:
            sample_reviews = [
                Review(
                    user_name="Ahmet Yılmaz",
                    initials="AY",
                    university="Boğaziçi Üniversitesi",
                    rating=5,
                    tags_json=json.dumps(["kampus", "egitim", "sosyal"]),
                    text="Güney kampüsün manzarası ve kütüphane ortamı muhteşem. Kulüp aktiviteleri ve akademik kadro gerçekten Türkiye'nin zirvesinde.",
                    date="15 Şub 2026",
                    timestamp=int(time.time() * 1000) - 86400000 * 5,
                ),
                Review(
                    user_name="Zeynep Kaya",
                    initials="ZK",
                    university="Orta Doğu Teknik Üniversitesi (ODTÜ)",
                    rating=5,
                    tags_json=json.dumps(["kampus", "egitim", "kutuphane"]),
                    text="ODTÜ kültürü bambaşka bir deneyim. Geniş ormanlık kampüsü, devasa kütüphanesi ve zorlayıcı ama çok şey katan mühendislik eğitimi var.",
                    date="20 Şub 2026",
                    timestamp=int(time.time() * 1000) - 86400000 * 3,
                ),
                Review(
                    user_name="Burak Demir",
                    initials="BD",
                    university="Bandırma Onyedi Eylül Üniversitesi",
                    rating=4,
                    tags_json=json.dumps(["kampus", "ulasim"]),
                    text="Denizcilik fakültesi çok iyi. İstanbul'dan feribotla ulaşım oldukça pratik ve şehir öğrenci için sakin ve ekonomik.",
                    date="01 Mar 2026",
                    timestamp=int(time.time() * 1000) - 86400000,
                ),
            ]
            db.add_all(sample_reviews)
            db.commit()

        # İlk hazırlanan üniversite adres ve koordinat verilerini university_addresses tablosuna aktar
        seed_initial_university_addresses(db)
    finally:
        db.close()


INITIAL_UNIVERSITY_ADDRESSES = [
    {
        "uni_name": "Bandırma Onyedi Eylül Üniversitesi",
        "campus_name": "Merkez Yerleşke (Yeni Mahalle / Bandırma)",
        "city": "Balıkesir",
        "district": "Bandırma",
        "full_address": "Yeni Mahalle Şehit Astsubay Mustafa Soner Varlık Caddesi No:77, 10200 Bandırma/Balıkesir",
        "transport_info": "Marmara Denizi kıyısında, Bandırma İDO Feribot İskelesi ve şehir merkezine 10 dakika mesafede konumlanan ana yerleşke.",
        "latitude": 40.3414,
        "longitude": 27.9344,
        "zoom_level": 14,
        "google_maps_url": "https://www.google.com/maps?q=40.3414,27.9344",
    },
    {
        "uni_name": "Zonguldak Bülent Ecevit Üniversitesi",
        "campus_name": "Farabi Merkez Kampüsü (İncivez / Zonguldak)",
        "city": "Zonguldak",
        "district": "Merkez",
        "full_address": "İncivez Mah. Üniversite Cad. 67100 Merkez/Zonguldak",
        "transport_info": "Karadeniz manzaralı Farabi Merkez Yerleşkesi; şehir merkezine, sahil hattına ve öğrenci mahallesi İncivez'e yürüme mesafesinde.",
        "latitude": 41.4514,
        "longitude": 31.7611,
        "zoom_level": 15,
        "google_maps_url": "https://www.google.com/maps?q=41.4514,31.7611",
    },
    {
        "uni_name": "Boğaziçi Üniversitesi",
        "campus_name": "Güney Kampüs (Bebek / İstanbul)",
        "city": "İstanbul",
        "district": "Beşiktaş",
        "full_address": "Bebek Mah. 34342 Beşiktaş/İstanbul",
        "transport_info": "İstanbul Boğazı'na hakim tarihi Güney Kampüs; M6 Boğaziçi Üniversitesi Metro İstasyonu çıkışında yer alır.",
        "latitude": 41.0846,
        "longitude": 29.0510,
        "zoom_level": 15,
        "google_maps_url": "https://www.google.com/maps?q=41.0846,29.0510",
    },
    {
        "uni_name": "Orta Doğu Teknik Üniversitesi (ODTÜ)",
        "campus_name": "Üniversiteler Mah. Merkez Kampüs (Çankaya / Ankara)",
        "city": "Ankara",
        "district": "Çankaya",
        "full_address": "Üniversiteler Mah. Dumlupınar Bulvarı No:1, 06800 Çankaya/Ankara",
        "transport_info": "Eskişehir Yolu üzerinde, M2 ODTÜ Metro İstasyonu ve kampüs içi ring hatlarıyla doğrudan erişilebilir ana yerleşke.",
        "latitude": 39.8914,
        "longitude": 32.7847,
        "zoom_level": 14,
        "google_maps_url": "https://www.google.com/maps?q=39.8914,32.7847",
    },
    {
        "uni_name": "İstanbul Teknik Üniversitesi",
        "campus_name": "Ayazağa Kampüsü (Maslak / İstanbul)",
        "city": "İstanbul",
        "district": "Sarıyer",
        "full_address": "Reşitpaşa Mah. Katar Cad. No:2, 34467 Sarıyer/İstanbul",
        "transport_info": "M2 İTÜ-Ayazağa Metro İstasyonu çıkışında, Maslak iş merkezi ve İTÜ ARI Teknokent ile bütünleşik ana yerleşke.",
        "latitude": 41.1055,
        "longitude": 29.0235,
        "zoom_level": 15,
        "google_maps_url": "https://www.google.com/maps?q=41.1055,29.0235",
    },
    {
        "uni_name": "Hacettepe Üniversitesi",
        "campus_name": "Beytepe Kampüsü (Çankaya / Ankara)",
        "city": "Ankara",
        "district": "Çankaya",
        "full_address": "Üniversiteler Mah. Hacettepe Beytepe Kampüsü, 06800 Çankaya/Ankara",
        "transport_info": "Beytepe Metro İstasyonu'ndan kalkan ring otobüsleriyle kolayca ulaşılan, geniş ormanlık alana kurulu kampüs.",
        "latitude": 39.8674,
        "longitude": 32.7344,
        "zoom_level": 14,
        "google_maps_url": "https://www.google.com/maps?q=39.8674,32.7344",
    },
    {
        "uni_name": "Ankara Üniversitesi",
        "campus_name": "Tandoğan Yerleşkesi (Anıttepe / Ankara)",
        "city": "Ankara",
        "district": "Çankaya",
        "full_address": "Emniyet Mah. Dögol Cad. No:6A, 06560 Yenimahalle/Çankaya/Ankara",
        "transport_info": "Ankaray Anadolu/Tandoğan durağı ve Başkentray hattına yürüme mesafesinde merkezi şehir yerleşkesi.",
        "latitude": 39.9358,
        "longitude": 32.8239,
        "zoom_level": 15,
        "google_maps_url": "https://www.google.com/maps?q=39.9358,32.8239",
    },
    {
        "uni_name": "Ege Üniversitesi",
        "campus_name": "Bornova Merkez Yerleşkesi (Bornova / İzmir)",
        "city": "İzmir",
        "district": "Bornova",
        "full_address": "Erzene Mah. Ege Üniversitesi Merkez Yerleşkesi, 35040 Bornova/İzmir",
        "transport_info": "İzmir Metrosu Evka-3 / Ege Üniversitesi durağı kampüsün tam içinden geçmektedir.",
        "latitude": 38.4582,
        "longitude": 27.2275,
        "zoom_level": 15,
        "google_maps_url": "https://www.google.com/maps?q=38.4582,27.2275",
    },
    {
        "uni_name": "Dokuz Eylül Üniversitesi",
        "campus_name": "Tınaztepe Yerleşkesi (Buca / İzmir)",
        "city": "İzmir",
        "district": "Buca",
        "full_address": "Adatepe Mah. Doğuş Cad. No:207, 35390 Buca/İzmir",
        "transport_info": "İzmir Çevre Yolu bağlantısı ve İZBAN aktarmalı ESHOT otobüs hatlarıyla ulaşılabilen ana yerleşke.",
        "latitude": 38.3688,
        "longitude": 27.2078,
        "zoom_level": 15,
        "google_maps_url": "https://www.google.com/maps?q=38.3688,27.2078",
    },
    {
        "uni_name": "Yıldız Teknik Üniversitesi (YTÜ)",
        "campus_name": "Davutpaşa Kampüsü (Esenler / İstanbul)",
        "city": "İstanbul",
        "district": "Esenler",
        "full_address": "Çifte Havuzlar Mah. Eski Londra Asfaltı Cad. 34220 Esenler/İstanbul",
        "transport_info": "M1A Davutpaşa-YTÜ Metro İstasyonu ile kampüs girişine doğrudan raylı sistem ulaşımı sağlanır.",
        "latitude": 41.0258,
        "longitude": 28.8897,
        "zoom_level": 15,
        "google_maps_url": "https://www.google.com/maps?q=41.0258,28.8897",
    },
    {
        "uni_name": "Marmara Üniversitesi",
        "campus_name": "Göztepe Yerleşkesi (Kadıköy / İstanbul)",
        "city": "İstanbul",
        "district": "Kadıköy",
        "full_address": "Eğitim Mah. Fahrettin Kerim Gökay Cad. 34722 Kadıköy/İstanbul",
        "transport_info": "Marmaray Göztepe İstasyonu ve Kadıköy-Kartal aksındaki toplu taşıma hatlarına yürüme mesafesinde.",
        "latitude": 40.9869,
        "longitude": 29.0537,
        "zoom_level": 15,
        "google_maps_url": "https://www.google.com/maps?q=40.9869,29.0537",
    },
    {
        "uni_name": "Bilkent Üniversitesi",
        "campus_name": "Merkez Kampüs (Bilkent / Ankara)",
        "city": "Ankara",
        "district": "Çankaya",
        "full_address": "Üniversiteler Mah. 1598. Cad. 06800 Çankaya/Ankara",
        "transport_info": "Tunus Caddesi, Sıhhiye ve Bilkent Metro durağından düzenli ücretsiz öğrenci servisleriyle ulaşım imkanı.",
        "latitude": 39.8681,
        "longitude": 32.7488,
        "zoom_level": 15,
        "google_maps_url": "https://www.google.com/maps?q=39.8681,32.7488",
    },
    {
        "uni_name": "Koç Üniversitesi",
        "campus_name": "Rumelifeneri Kampüsü (Sarıyer / İstanbul)",
        "city": "İstanbul",
        "district": "Sarıyer",
        "full_address": "Rumelifeneri Yolu, 34450 Sarıyer/İstanbul",
        "transport_info": "M2 Hacıosman Metro İstasyonu'ndan hareket eden İETT ve kampüs shuttle hatlarıyla doğrudan ulaşım.",
        "latitude": 41.2051,
        "longitude": 29.0741,
        "zoom_level": 15,
        "google_maps_url": "https://www.google.com/maps?q=41.2051,29.0741",
    },
]


def seed_initial_university_addresses(db):
    """Tüm üniversitelerin doğrulanmış adres ve koordinat verilerini universities.id Foreign Key ile bağlayarak kaydeder."""
    try:
        items_to_seed = list(INITIAL_UNIVERSITY_ADDRESSES)
        cache_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts", "uni_addresses_cache.json")
        if os.path.exists(cache_path):
            try:
                with open(cache_path, "r", encoding="utf-8") as f:
                    cache_data = json.load(f)
                if isinstance(cache_data, dict) and len(cache_data) > 0:
                    items_to_seed = list(cache_data.values())
            except Exception:
                pass

        for item in items_to_seed:
            uni_name = item["uni_name"]
            base_name = uni_name.split("(")[0].strip()

            # 1. universities tablosunda ilgili üniversiteyi bul (yoksa oluştur)
            uni = None
            if "university_id" in item and item["university_id"]:
                uni = db.query(University).filter(University.id == int(item["university_id"])).first()
            if not uni:
                uni = db.query(University).filter(University.name == uni_name).first()
            if not uni:
                uni = db.query(University).filter(University.name == base_name).first()
            if not uni:
                uni = db.query(University).filter(University.name.ilike(f"%{base_name}%")).first()
            if not uni:
                uni = University(name=uni_name)
                db.add(uni)
                db.flush()

            # 2. university_addresses tablosunda bu university_id için kayıt var mı kontrol et
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
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"[WARN] UniversityAddress seed hatası: {e}")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

