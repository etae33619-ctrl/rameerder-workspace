import uuid
from pydantic import BaseModel, Field

class CartItemAdd(BaseModel):
    product_id: uuid.UUID
    quantity: int = Field(default=1, ge=1)

class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)

class CartProductInfo(BaseModel):
    id: uuid.UUID
    name: str
    sku: str
    price: float
    discount: float
    stock: int
    is_active: bool

class CartItemResponse(BaseModel):
    id: uuid.UUID
    quantity: int
    product: CartProductInfo
    item_subtotal: float

class CartResponse(BaseModel):
    id: uuid.UUID
    items: list[CartItemResponse]
    cart_total: float