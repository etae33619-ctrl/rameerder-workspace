from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_active_user, RequireRole
from app.schemas.user import UserResponse, UserProfileUpdate, PasswordChangeRequest
from app.models.user import User
from app.services.user_service import UserService

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_active_user)):
    """Get the currently authenticated user's profile."""
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_profile(
    data: UserProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Update personal profile details."""
    return await UserService.update_profile(current_user, data, session)

@router.post("/me/change-password")
async def change_password(
    data: PasswordChangeRequest,
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """Change account password."""
    return await UserService.change_password(current_user, data, session)

# Example endpoint proving staff/manager functionality for future phases
@router.get("/staff-dashboard")
async def staff_dashboard_demo(
    current_user: User = Depends(RequireRole(["STAFF", "MANAGER", "ADMINISTRATOR"]))
):
    """Demonstrates an endpoint accessible to staff and above."""
    return {"message": "Welcome to the operational dashboard", "user": current_user.email}