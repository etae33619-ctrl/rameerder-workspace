# app/routers/admin/payments.py
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import RequireRole
from app.schemas.admin import PaymentStatusUpdate
from app.services.admin_service import AdminService

router = APIRouter()
@router.get("")
async def admin_get_payments(session: AsyncSession = Depends(get_session), user=Depends(RequireRole(["ADMINISTRATOR", "MANAGER"]))):
    return await AdminService.get_all_payments(session)

@router.patch("/{id}/status")
async def admin_update_payment(id: uuid.UUID, data: PaymentStatusUpdate, session: AsyncSession = Depends(get_session), user=Depends(RequireRole(["ADMINISTRATOR"]))):
    payment = await AdminService.update_payment_status(session, id, data)
    await AdminService.log_action(session, user.id, "UPDATE_PAYMENT", "Payment", str(id), data.status)
    return payment