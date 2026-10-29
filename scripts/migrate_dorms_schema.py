import sys
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
for _p in (PROJECT_ROOT, BACKEND_DIR):
    if _p not in sys.path:
        sys.path.insert(0, _p)

from database import engine
from sqlalchemy import text

def run_migration():
    with engine.connect() as conn:
        # 1. kyk_dorms table columns
        cols = [r[0] for r in conn.execute(text("SHOW COLUMNS FROM kyk_dorms")).fetchall()]
        print("Existing kyk_dorms columns:", cols)

        if "source" not in cols:
            conn.execute(text("ALTER TABLE kyk_dorms ADD COLUMN source VARCHAR(50) NOT NULL DEFAULT 'system'"))
            print("Added column 'source' to kyk_dorms")
        if "city" not in cols:
            conn.execute(text("ALTER TABLE kyk_dorms ADD COLUMN city VARCHAR(100) NULL"))
            print("Added column 'city' to kyk_dorms")
        if "district" not in cols:
            conn.execute(text("ALTER TABLE kyk_dorms ADD COLUMN district VARCHAR(100) NULL"))
            print("Added column 'district' to kyk_dorms")

        # 2. university_dorm table
        conn.execute(text("ALTER TABLE university_dorm MODIFY distance_km DOUBLE NULL"))
        print("Modified 'distance_km' to nullable in university_dorm")

        cols_ud = [r[0] for r in conn.execute(text("SHOW COLUMNS FROM university_dorm")).fetchall()]
        print("Updated university_dorm columns:", cols_ud)

if __name__ == "__main__":
    run_migration()

