from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Application
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    
    # Security (for JWT if needed)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    
    # ML Models
    BLINK_DETECTION_MODEL: str = os.getenv("BLINK_DETECTION_MODEL", "models/blink_detection.h5")
    FACE_MESH_MODEL: str = os.getenv("FACE_MESH_MODEL", "models/face_landmarker.task")
    
    # WebSocket
    WEBSOCKET_URL: str = os.getenv("WEBSOCKET_URL", "wss://devops-x0lk.onrender.com")
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
