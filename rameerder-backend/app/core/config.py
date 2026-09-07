from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "RAMEERDER PACE GROUP API"
    API_PREFIX: str = "/api"
    BACKEND_CORS_ORIGINS: List[str] = []
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Payment Gateway Configurations
    MTN_MOMO_API_KEY: Optional[str] = None
    MTN_MOMO_API_SECRET: Optional[str] = None
    ORANGE_MONEY_CLIENT_ID: Optional[str] = None
    ORANGE_MONEY_CLIENT_SECRET: Optional[str] = None
    CARD_GATEWAY_SECRET: Optional[str] = None
    CARD_WEBHOOK_SECRET: Optional[str] = None

    # Notification Provider Configurations
    SMTP_SERVER: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    TWILIO_SMS_KEY: Optional[str] = None
    WHATSAPP_API_KEY: Optional[str] = None
    PUSH_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

settings = Settings()