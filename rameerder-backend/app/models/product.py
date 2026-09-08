import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    sku: str = Field(unique=True, index=True)
    description: str
    price: float = Field(default=0.0)
    discount: float = Field(default=0.0)
    stock: int = Field(default=0)
    is_active: bool = Field(default=True)

    category_id: uuid.UUID = Field(foreign_key="categories.id", index=True)
    brand_id: Optional[uuid.UUID] = Field(default=None, foreign_key="brands.id")

    # Cached metrics for performance
    average_rating: float = Field(default=0.0)
    review_count: int = Field(default=0)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))