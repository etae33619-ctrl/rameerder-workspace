import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class Review(SQLModel, table=True):
    __tablename__ = "reviews"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    product_id: uuid.UUID = Field(foreign_key="products.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)

    rating: int = Field(ge=1, le=5)
    comment: str | None = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))