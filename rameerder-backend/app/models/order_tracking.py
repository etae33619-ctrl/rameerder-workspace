import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class OrderTracking(SQLModel, table=True):
    __tablename__ = "order_tracking"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    order_id: uuid.UUID = Field(foreign_key="orders.id", index=True)

    status: str = Field(index=True)  # PENDING, PROCESSING, SHIPPED, DELIVERED
    notes: str | None = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))