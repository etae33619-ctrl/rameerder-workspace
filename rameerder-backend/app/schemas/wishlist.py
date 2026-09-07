import uuid
from datetime import datetime
from pydantic import BaseModel
from app.schemas.cart import CartProductInfo

class WishlistItemAdd(BaseModel):
    product_id: uuid.UUID

class WishlistItemResponse(BaseModel):
    id: uuid.UUID
    product: CartProductInfo
    added_at: datetime

class WishlistResponse(BaseModel):
    id: uuid.UUID
    items: list[WishlistItemResponse]