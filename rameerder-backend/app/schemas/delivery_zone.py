import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class DeliveryZoneBase(BaseModel):
    name: str
    description: str
    delivery_fee: float
    is_active: bool = True


class DeliveryZoneCreate(DeliveryZoneBase):
    pass


class DeliveryZoneUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    delivery_fee: float | None = None
    is_active: bool | None = None


class DeliveryZoneResponse(DeliveryZoneBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)