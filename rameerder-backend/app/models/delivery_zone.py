import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class DeliveryZone(SQLModel, table=True):
    __tablename__ = "delivery_zones"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(unique=True, index=True)
    description: str
    delivery_fee: float = Field(default=0.0)
    is_active: bool = Field(default=True)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))