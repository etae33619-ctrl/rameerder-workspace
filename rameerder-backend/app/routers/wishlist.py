import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.wishlist import WishlistResponse, WishlistItemAdd
from app.services.wishlist_service import WishlistService

router = APIRouter()

@router.get("", response_model=WishlistResponse)
async def view_wishlist(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """View current user's wishlist"""
    return await WishlistService.view_wishlist(session, current_user.id)

@router.post("/items", response_model=WishlistResponse, status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(data: WishlistItemAdd, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """Add a product to the wishlist"""
    return await WishlistService.add_item(session, current_user.id, data)

@router.delete("/items/{product_id}", response_model=WishlistResponse)
async def remove_from_wishlist(product_id: uuid.UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """Remove a product from the wishlist by the Product ID"""
    return await WishlistService.remove_item_by_product(session, current_user.id, product_id)