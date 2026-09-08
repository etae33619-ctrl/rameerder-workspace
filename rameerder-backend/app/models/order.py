import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    address_id: uuid.UUID = Field(foreign_key="addresses.id")

    status: str = Field(default="PENDING", index=True)

    # Financial snapshots
    subtotal: float
    delivery_fee: float
    discount_total: float
    final_total: float

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))