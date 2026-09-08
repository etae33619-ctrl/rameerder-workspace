import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.category import CategoryResponse
from app.schemas.brand import BrandResponse

class ProductImageCreate(BaseModel):
    url: str
    alt_text: str | None = None
    is_primary: bool = False

class ProductImageResponse(ProductImageCreate):
    id: uuid.UUID
    product_id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ProductCreate(BaseModel):
    name: str
    sku: str
    description: str
    price: float
    discount: float = 0.0
    stock: int = 0
    is_active: bool = True
    category_id: uuid.UUID
    brand_id: uuid.UUID | None = None

class ProductUpdate(BaseModel):
    name: str | None = None
    sku: str | None = None
    description: str | None = None
    price: float | None = None
    discount: float | None = None
    stock: int | None = None
    is_active: bool | None = None
    category_id: uuid.UUID | None = None
    brand_id: uuid.UUID | None = None

class ProductResponse(BaseModel):
    id: uuid.UUID
    name: str
    sku: str
    description: str
    price: float
    discount: float
    stock: int
    is_active: bool
    category_id: uuid.UUID
    brand_id: uuid.UUID | None
    average_rating: float
    review_count: int
    images: list[ProductImageResponse] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PaginatedProductResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    data: list[ProductResponse]