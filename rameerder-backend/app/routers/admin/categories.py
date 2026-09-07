import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import RequireRole
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services.category_service import CategoryService

router = APIRouter()
admin_manager = RequireRole(["ADMINISTRATOR", "MANAGER"])

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(data: CategoryCreate, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    return await CategoryService.create(session, data)

@router.patch("/{id}", response_model=CategoryResponse)
async def update_category(id: uuid.UUID, data: CategoryUpdate, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    return await CategoryService.update(session, id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(id: uuid.UUID, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    await CategoryService.delete(session, id)