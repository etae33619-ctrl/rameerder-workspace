# app/routers/admin/audit_logs.py
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import RequireRole
from app.schemas.admin import AuditLogResponse
from app.services.admin_service import AdminService

router = APIRouter()
@router.get("", response_model=List[AuditLogResponse])
async def admin_get_audit_logs(session: AsyncSession = Depends(get_session), user=Depends(RequireRole(["ADMINISTRATOR"]))):
    return await AdminService.get_audit_logs(session)