import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    action: str = Field(index=True)
    resource: str = Field(index=True)
    resource_id: str | None = None
    details: str | None = None
    ip_address: str | None = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))