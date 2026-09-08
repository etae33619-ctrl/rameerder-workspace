import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.schemas.brand import BrandResponse
from app.services.brand_service import BrandService

router = APIRouter()

@router.get("", response_model=list[BrandResponse])
async def get_public_brands(session: AsyncSession = Depends(get_session)):
    return await BrandService.get_all(session, only_active=True)

@router.get("/{id}", response_model=BrandResponse)
async def get_public_brand(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    return await BrandService.get_by_id(session, id)