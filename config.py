"""Configuration for Lakshmipur Bostraloy Flask app."""
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "lb-dev-secret-change-in-production-2026"
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or f"sqlite:///{BASE_DIR / 'instance' / 'bostraloy.db'}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Bangladeshi shop defaults
    SHOP_NAME_BN = "লক্ষ্মীপুর বস্ত্রালয়"
    SHOP_NAME_EN = "Lakshmipur Bostraloy"
    SHOP_PHONE = "+880 1700-000000"
    SHOP_WHATSAPP = "8801700000000"
    SHOP_ADDRESS_BN = "লক্ষ্মীপুর সদর, বাংলাদেশ"
    SHOP_ADDRESS_EN = "Lakshmipur Sadar, Bangladesh"

    # i18n
    LANGUAGES = ["bn", "en"]
    DEFAULT_LANGUAGE = "bn"

    # Admin credentials (override in production)
    ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL") or "admin@lakshmipurbostraloy.com"
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD") or "Admin@123456"

    # Upload
    UPLOAD_FOLDER = BASE_DIR / "static" / "uploads"
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB

    # Currency
    CURRENCY = "৳"  # Taka
