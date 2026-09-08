import uuid
from sqlmodel import SQLModel, Field


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    order_id: uuid.UUID = Field(foreign_key="orders.id", index=True)
    product_id: uuid.UUID = Field(foreign_key="products.id")

    # Financial snapshot at the exact time of purchase
    product_name: str
    product_sku: str
    price: float
    quantity: int
    subtotal: float