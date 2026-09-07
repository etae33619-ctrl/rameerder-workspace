import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.delivery_zone import DeliveryZoneResponse


class AddressBase(BaseModel):
    # Critical Business Requirements
    delivery_zone_id: uuid.UUID
    neighborhood: str
    landmark: str
    street: str
    building: str
    directions: str

    # Optional GPS Requirements
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    delivery_zone_id: uuid.UUID | None = None
    neighborhood: str | None = None
    landmark: str | None = None
    street: str | None = None
    building: str | None = None
    directions: str | None = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_default: bool | None = None


class AddressResponse(AddressBase):
    id: uuid.UUID
    user_id: uuid.UUID
    # We nest the zone so the frontend React app automatically knows the delivery fee
    # without having to make a second API request.
    zone: DeliveryZoneResponse

    model_config = ConfigDict(from_attributes=True)