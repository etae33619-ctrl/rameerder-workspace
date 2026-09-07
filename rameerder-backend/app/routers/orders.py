import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.order import CheckoutRequest, OrderResponse, OrderTrackingResponse
from app.services.order_service import OrderService

router = APIRouter()

@router.post("/checkout", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def checkout(
    data: CheckoutRequest,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Process the cart, calculate totals securely, and create the order."""
    return await OrderService.process_checkout(session, current_user.id, data)

@router.get("", response_model=List[OrderResponse])
async def get_orders(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Get all orders for the authenticated user."""
    return await OrderService.get_user_orders(session, current_user.id)

@router.get("/{id}", response_model=OrderResponse)
async def get_order(
    id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Get complete details of a specific order."""
    return await OrderService.get_order_details(session, current_user.id, id)

@router.get("/{id}/tracking", response_model=List[OrderTrackingResponse])
async def get_order_tracking(
    id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Get the timeline and status history of a specific order."""
    return await OrderService.get_tracking_history(session, current_user.id, id)