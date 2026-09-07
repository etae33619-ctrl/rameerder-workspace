import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.cart import CartResponse, CartItemAdd, CartItemUpdate
from app.services.cart_service import CartService

router = APIRouter()

@router.get("", response_model=CartResponse)
async def view_cart(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """View current user's shopping cart"""
    return await CartService.view_cart(session, current_user.id)

@router.post("/items", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
async def add_to_cart(data: CartItemAdd, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """Add a product to the cart or increment its quantity"""
    return await CartService.add_item(session, current_user.id, data)

@router.patch("/items/{item_id}", response_model=CartResponse)
async def update_cart_item(item_id: uuid.UUID, data: CartItemUpdate, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """Update the exact quantity of a cart item"""
    return await CartService.update_item_quantity(session, current_user.id, item_id, data)

@router.delete("/items/{item_id}", response_model=CartResponse)
async def remove_from_cart(item_id: uuid.UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """Remove an item entirely from the cart"""
    return await CartService.remove_item(session, current_user.id, item_id)

@router.delete("", status_code=status.HTTP_200_OK)
async def clear_cart(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """Empty the cart completely"""
    return await CartService.clear_cart(session, current_user.id)