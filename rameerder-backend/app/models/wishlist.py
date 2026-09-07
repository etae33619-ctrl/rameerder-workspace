import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, UniqueConstraint


class Wishlist(SQLModel, table=True):
    __tablename__ = "wishlists"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", unique=True, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WishlistItem(SQLModel, table=True):
    __tablename__ = "wishlist_items"
    __table_args__ = (UniqueConstraint("wishlist_id", "product_id", name="uq_wishlist_product"),)

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    wishlist_id: uuid.UUID = Field(foreign_key="wishlists.id", index=True)
    product_id: uuid.UUID = Field(foreign_key="products.id")

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))