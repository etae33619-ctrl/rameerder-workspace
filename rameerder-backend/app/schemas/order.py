import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.address import AddressResponse


class CheckoutRequest(BaseModel):
    # Delivery Information Payload
    delivery_zone_id: uuid.UUID
    neighborhood: str
    landmark: str
    street: str
    building: str
    directions: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    # Payment Instruction
    payment_method: str  # e.g., "MTN Mobile Money", "Cash on Delivery"


class OrderItemResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    product_name: str
    product_sku: str
    price: float
    quantity: int
    subtotal: float
    model_config = ConfigDict(from_attributes=True)


class OrderTrackingResponse(BaseModel):
    id: uuid.UUID
    status: str
    notes: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PaymentInstructions(BaseModel):
    reference: str
    redirect_url: Optional[str] = None
    provider_data: dict = {}


class OrderResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    status: str
    subtotal: float
    delivery_fee: float
    discount_total: float
    final_total: float
    created_at: datetime
    updated_at: datetime

    items: List[OrderItemResponse] = []
    tracking: List[OrderTrackingResponse] = []

    # Securely exposes payment instructions to the frontend
    payment_instructions: Optional[PaymentInstructions] = None

    model_config = ConfigDict(from_attributes=True)