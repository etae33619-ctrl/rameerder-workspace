import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class ProductImage(SQLModel, table=True):
    __tablename__ = "product_images"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    product_id: uuid.UUID = Field(foreign_key="products.id", index=True)
    url: str
    alt_text: str | None = None
    is_primary: bool = Field(default=False)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))