import uuid
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import RequireRole
from app.schemas.user import UserResponse, UserRoleUpdate
from app.services.user_service import UserService

router = APIRouter()

# Enforce ADMINISTRATOR only access on all routes in this router
admin_only = RequireRole(["ADMINISTRATOR"])

@router.get("", response_model=List[UserResponse])
async def get_all_users(
    session: AsyncSession = Depends(get_session),
    current_user=Depends(admin_only)
):
    """Get all users (Administrator only)"""
    return await UserService.get_all_users(session)

@router.patch("/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: uuid.UUID,
    data: UserRoleUpdate,
    session: AsyncSession = Depends(get_session),
    current_user=Depends(admin_only)
):
    """Change a user's role (Administrator only)"""
    return await UserService.update_user_role(user_id, data, session)