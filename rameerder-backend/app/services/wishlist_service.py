import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.wishlist import Wishlist, WishlistItem
from app.models.product import Product
from app.schemas.wishlist import WishlistItemAdd


class WishlistService:
    @staticmethod
    async def get_or_create_wishlist(session: AsyncSession, user_id: uuid.UUID) -> Wishlist:
        result = await session.exec(select(Wishlist).where(Wishlist.user_id == user_id))
        wishlist = result.first()
        if not wishlist:
            wishlist = Wishlist(user_id=user_id)
            session.add(wishlist)
            await session.commit()
            await session.refresh(wishlist)
        return wishlist

    @staticmethod
    async def view_wishlist(session: AsyncSession, user_id: uuid.UUID):
        wishlist = await WishlistService.get_or_create_wishlist(session, user_id)

        query = select(WishlistItem, Product).join(Product, WishlistItem.product_id == Product.id).where(
            WishlistItem.wishlist_id == wishlist.id)
        results = await session.exec(query)

        items = []
        for item, product in results.all():
            items.append({
                "id": item.id,
                "added_at": item.created_at,
                "product": {
                    "id": product.id,
                    "name": product.name,
                    "sku": product.sku,
                    "price": product.price,
                    "discount": product.discount,
                    "stock": product.stock,
                    "is_active": product.is_active
                }
            })

        return {
            "id": wishlist.id,
            "items": items
        }

    @staticmethod
    async def add_item(session: AsyncSession, user_id: uuid.UUID, data: WishlistItemAdd):
        wishlist = await WishlistService.get_or_create_wishlist(session, user_id)

        product = await session.get(Product, data.product_id)
        if not product or not product.is_active:
            raise HTTPException(status_code=400, detail="Product is unavailable")

        result = await session.exec(
            select(WishlistItem).where(WishlistItem.wishlist_id == wishlist.id,
                                       WishlistItem.product_id == data.product_id)
        )
        if result.first():
            return await WishlistService.view_wishlist(session, user_id)  # Already exists, ignore gracefully

        new_item = WishlistItem(wishlist_id=wishlist.id, product_id=product.id)
        session.add(new_item)
        await session.commit()

        return await WishlistService.view_wishlist(session, user_id)

    @staticmethod
    async def remove_item_by_product(session: AsyncSession, user_id: uuid.UUID, product_id: uuid.UUID):
        # Frontend prefers removing by product_id directly from the catalog UI
        wishlist = await WishlistService.get_or_create_wishlist(session, user_id)

        result = await session.exec(
            select(WishlistItem).where(WishlistItem.wishlist_id == wishlist.id, WishlistItem.product_id == product_id)
        )
        item = result.first()

        if item:
            await session.delete(item)
            await session.commit()

        return await WishlistService.view_wishlist(session, user_id)