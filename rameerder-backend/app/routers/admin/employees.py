# app/routers/admin/employees.py
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import RequireRole
from app.schemas.user import UserResponse
from app.services.admin_service import AdminService

router = APIRouter()
@router.get("", response_model=List[UserResponse])
async def admin_get_employees(session: AsyncSession = Depends(get_session), user=Depends(RequireRole(["ADMINISTRATOR", "MANAGER"]))):
    return await AdminService.get_employees(session)