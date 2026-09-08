import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.schemas.category import CategoryResponse
from app.services.category_service import CategoryService

router = APIRouter()

@router.get("", response_model=list[CategoryResponse])
async def get_public_categories(session: AsyncSession = Depends(get_session)):
    return await CategoryService.get_all(session, only_active=True)

@router.get("/{id}", response_model=CategoryResponse)
async def get_public_category(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    return await CategoryService.get_by_id(session, id)