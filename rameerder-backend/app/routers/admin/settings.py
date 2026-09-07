# app/routers/admin/settings.py
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import RequireRole
from app.schemas.admin import SystemSettingResponse, SystemSettingUpdate
from app.services.admin_service import AdminService

router = APIRouter()
@router.get("", response_model=List[SystemSettingResponse])
async def admin_get_settings(session: AsyncSession = Depends(get_session), user=Depends(RequireRole(["ADMINISTRATOR"]))):
    return await AdminService.get_settings(session)

@router.patch("/{key}", response_model=SystemSettingResponse)
async def admin_update_setting(key: str, data: SystemSettingUpdate, session: AsyncSession = Depends(get_session), user=Depends(RequireRole(["ADMINISTRATOR"]))):
    setting = await AdminService.update_setting(session, key, data)
    await AdminService.log_action(session, user.id, "UPDATE_SETTING", "SystemSetting", key, data.value)
    return setting