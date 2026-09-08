import uuid
from pydantic import BaseModel, ConfigDict

class BrandBase(BaseModel):
    name: str
    description: str | None = None
    is_active: bool = True

class BrandCreate(BrandBase):
    pass

class BrandUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None

class BrandResponse(BrandBase):
    id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)