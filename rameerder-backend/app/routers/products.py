import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.product import ProductResponse, PaginatedProductResponse
from app.schemas.review import ReviewResponse, ReviewCreate
from app.services.product_service import ProductService

router = APIRouter()

@router.get("", response_model=PaginatedProductResponse)
async def get_public_products(
    session: AsyncSession = Depends(get_session),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = None,
    category_id: uuid.UUID | None = None,
    brand_id: uuid.UUID | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    sort_by: str = Query("created_at", pattern="^(price|rating|created_at)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$")
):
    return await ProductService.get_products(
        session, page, limit, search, category_id, brand_id, min_price, max_price, sort_by, sort_order, only_active=True
    )

@router.get("/{id}", response_model=ProductResponse)
async def get_public_product(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    return await ProductService.get_product_with_images(session, id)

@router.get("/{id}/reviews", response_model=list[ReviewResponse])
async def get_product_reviews(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    return await ProductService.get_reviews(session, id)

@router.post("/{id}/reviews", response_model=ReviewResponse)
async def add_product_review(
    id: uuid.UUID,
    data: ReviewCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    return await ProductService.add_review(session, id, current_user.id, data)