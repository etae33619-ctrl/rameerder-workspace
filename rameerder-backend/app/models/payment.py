import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class Payment(SQLModel, table=True):
    __tablename__ = "payments"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    order_id: uuid.UUID = Field(foreign_key="orders.id", unique=True)
    amount: float
    provider: str
    reference: str = Field(unique=True, index=True)
    status: str = Field(default="PENDING")

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))