import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Settings:
    DB_PATH: str = os.path.join(BASE_DIR, "deeptrain_data.db")
    TOS_PATH: str = os.path.join(BASE_DIR, "uploads")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "deeptrain-secret-key-change-in-production")

settings = Settings()
