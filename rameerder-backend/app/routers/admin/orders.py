import uuid
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import RequireRole, get_current_active_user
from app.schemas.order import OrderResponse, OrderTrackingResponse
from app.schemas.admin import OrderStatusUpdate, OrderTrackingCreateAdmin
from app.services.admin_service import AdminService
from app.services.order_service import OrderService

router = APIRouter()
admin_staff_manager = RequireRole(["ADMINISTRATOR", "MANAGER", "STAFF"])

@router.get("", response_model=List[OrderResponse])
async def admin_get_orders(session: AsyncSession = Depends(get_session), user=Depends(admin_staff_manager)):
    return await AdminService.get_all_orders(session)

@router.patch("/{id}/status", response_model=OrderResponse)
async def admin_update_order_status(id: uuid.UUID, data: OrderStatusUpdate, session: AsyncSession = Depends(get_session), user=Depends(admin_staff_manager)):
    await AdminService.update_order_status(session, id, data)
    await AdminService.log_action(session, user.id, "UPDATE_ORDER_STATUS", "Order", str(id), data.status)
    # Using existing service to get full populated response
    return await OrderService.get_order_details(session, (await session.get(Order, id)).user_id, id)

@router.post("/{id}/tracking", response_model=OrderTrackingResponse)
async def admin_add_order_tracking(id: uuid.UUID, data: OrderTrackingCreateAdmin, session: AsyncSession = Depends(get_session), user=Depends(admin_staff_manager)):
    tracking = await AdminService.add_order_tracking(session, id, data)
    await AdminService.log_action(session, user.id, "ADD_TRACKING", "Order", str(id), data.status)
    return tracking