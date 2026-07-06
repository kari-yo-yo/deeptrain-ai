import json
import sys
import os

# Change to backend directory so DB_PATH resolves correctly
backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend')
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

from app.database import engine, SessionLocal, Base
from app.models import Tutorial, Term

def init_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Load seed data
        seed_path = os.path.join(backend_dir, 'app', 'data', 'seed_data.json')
        with open(seed_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Insert tutorials
        if db.query(Tutorial).count() == 0:
            for item in data['tutorials']:
                tutorial = Tutorial(**item)
                db.add(tutorial)
            print(f"Inserted {len(data['tutorials'])} tutorials")
        else:
            print("Tutorials already exist, skipping")
        
        # Insert terms
        if db.query(Term).count() == 0:
            for item in data['terms']:
                term = Term(**item)
                db.add(term)
            print(f"Inserted {len(data['terms'])} terms")
        else:
            print("Terms already exist, skipping")
        
        db.commit()
        print("Database initialization completed!")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
