import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field,ConfigDict

class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    first_name: str
    last_name: str
    phone: str | None = None
    is_active: bool
    is_verified: bool
    role_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True) # Replaces class Config

class UserProfileUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)

class UserRoleUpdate(BaseModel):
    role_id: uuid.UUID