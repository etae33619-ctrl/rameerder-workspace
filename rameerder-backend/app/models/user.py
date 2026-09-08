import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    first_name: str
    last_name: str
    phone: Optional[str] = None

    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    role_id: uuid.UUID = Field(foreign_key="roles.id", index=True)

    # Auth/Verification Fields
    otp_code: Optional[str] = None
    otp_expires_at: Optional[datetime] = None
    reset_token: Optional[str] = None
    reset_token_expires_at: Optional[datetime] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))