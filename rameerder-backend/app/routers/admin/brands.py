import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import RequireRole
from app.schemas.brand import BrandCreate, BrandUpdate, BrandResponse
from app.services.brand_service import BrandService

router = APIRouter()
admin_manager = RequireRole(["ADMINISTRATOR", "MANAGER"])

@router.post("", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
async def create_brand(data: BrandCreate, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    return await BrandService.create(session, data)

@router.patch("/{id}", response_model=BrandResponse)
async def update_brand(id: uuid.UUID, data: BrandUpdate, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    return await BrandService.update(session, id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand(id: uuid.UUID, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    await BrandService.delete(session, id)