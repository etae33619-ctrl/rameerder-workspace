import uuid
from typing import Optional
from sqlmodel import SQLModel, Field


class Address(SQLModel, table=True):
    __tablename__ = "addresses"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)

    # Critical Business Requirement implementation
    delivery_zone_id: uuid.UUID = Field(foreign_key="delivery_zones.id", index=True)
    neighborhood: str
    landmark: str
    street: str
    building: str
    directions: str

    # Optional GPS per requirements
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_default: bool = Field(default=False)