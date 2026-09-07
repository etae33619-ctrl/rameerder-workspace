import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class SystemSetting(SQLModel, table=True):
    __tablename__ = "system_settings"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    key: str = Field(unique=True, index=True)
    value: str
    description: str | None = None

    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))