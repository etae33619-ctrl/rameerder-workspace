import uuid
from pydantic import BaseModel, ConfigDict

class CategoryBase(BaseModel):
    name: str
    description: str | None = None
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None

class CategoryResponse(CategoryBase):
    id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)