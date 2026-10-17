import os
import json
import time
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, BigInteger, String, Text, DateTime, ForeignKey, UniqueConstraint, JSON, Boolean, inspect, text
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
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    dorms = relationship("KykDorm", back_populates="university", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "image_url": self.image_url,
            "website_url": self.website_url,
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

    university = relationship("University", back_populates="dorms")

    def to_dict(self):
        return {
            "ad": self.name,
            "tip": self.type,
            "mesafe": self.distance,
            "ucret": self.fee,
            "kapasite": self.capacity
        }

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
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "uni_name": self.uni_name,
            "city": self.city,
            "campus": self.campus,
            "website": self.website,
            "email": self.email,
            "notes": self.notes,
            "status": self.status,
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
    status = Column(String(50), default="pending")  # pending, published, rejected
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

    # Automated lightweight migration: ensure 'role' and 'is_active' exist in 'users'
    try:
        insp = inspect(engine)
        if 'users' in insp.get_table_names():
            cols = [c['name'] for c in insp.get_columns('users')]
            with engine.connect() as conn:
                if 'role' not in cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
                    conn.commit()
                if 'is_active' not in cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1"))
                    conn.commit()
    except Exception as e:
        print(f"[WARN] User table migration check note: {e}")

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
    finally:
        db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
