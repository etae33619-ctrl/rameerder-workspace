import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import RequireRole
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductImageCreate, ProductImageResponse
from app.services.product_service import ProductService

router = APIRouter()
admin_manager = RequireRole(["ADMINISTRATOR", "MANAGER"])

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(data: ProductCreate, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    return await ProductService.create(session, data)

@router.patch("/{id}", response_model=ProductResponse)
async def update_product(id: uuid.UUID, data: ProductUpdate, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    return await ProductService.update(session, id, data)

@router.post("/{id}/images", response_model=ProductImageResponse)
async def add_product_image(id: uuid.UUID, data: ProductImageCreate, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    return await ProductService.add_image(session, id, data)