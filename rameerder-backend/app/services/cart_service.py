import uuid
from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cart import CartItemAdd, CartItemUpdate


class CartService:
    @staticmethod
    async def get_or_create_cart(session: AsyncSession, user_id: uuid.UUID) -> Cart:
        result = await session.exec(select(Cart).where(Cart.user_id == user_id))
        cart = result.first()
        if not cart:
            cart = Cart(user_id=user_id)
            session.add(cart)
            await session.commit()
            await session.refresh(cart)
        return cart

    @staticmethod
    async def view_cart(session: AsyncSession, user_id: uuid.UUID):
        cart = await CartService.get_or_create_cart(session, user_id)

        # Explicit JOIN to fetch items + product details simultaneously
        query = select(CartItem, Product).join(Product, CartItem.product_id == Product.id).where(
            CartItem.cart_id == cart.id)
        results = await session.exec(query)

        items = []
        cart_total = 0.0

        for item, product in results.all():
            active_price = product.price - product.discount
            item_subtotal = active_price * item.quantity
            cart_total += item_subtotal

            items.append({
                "id": item.id,
                "quantity": item.quantity,
                "item_subtotal": round(item_subtotal, 2),
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
            "id": cart.id,
            "items": items,
            "cart_total": round(cart_total, 2)
        }

    @staticmethod
    async def add_item(session: AsyncSession, user_id: uuid.UUID, data: CartItemAdd):
        cart = await CartService.get_or_create_cart(session, user_id)

        # 1. Validate Product
        product = await session.get(Product, data.product_id)
        if not product or not product.is_active:
            raise HTTPException(status_code=400, detail="Product is unavailable")

        # 2. Check if item already in cart
        result = await session.exec(
            select(CartItem).where(CartItem.cart_id == cart.id, CartItem.product_id == data.product_id)
        )
        existing_item = result.first()

        new_quantity = existing_item.quantity + data.quantity if existing_item else data.quantity

        # 3. Validate Stock
        if new_quantity > product.stock:
            raise HTTPException(status_code=400, detail=f"Insufficient stock. Only {product.stock} available.")

        if existing_item:
            existing_item.quantity = new_quantity
            existing_item.updated_at = datetime.now(timezone.utc)
            session.add(existing_item)
        else:
            new_item = CartItem(cart_id=cart.id, product_id=product.id, quantity=data.quantity)
            session.add(new_item)

        await session.commit()
        return await CartService.view_cart(session, user_id)

    @staticmethod
    async def update_item_quantity(session: AsyncSession, user_id: uuid.UUID, item_id: uuid.UUID, data: CartItemUpdate):
        cart = await CartService.get_or_create_cart(session, user_id)

        item = await session.get(CartItem, item_id)
        if not item or item.cart_id != cart.id:
            raise HTTPException(status_code=404, detail="Cart item not found")

        product = await session.get(Product, item.product_id)
        if data.quantity > product.stock:
            raise HTTPException(status_code=400, detail=f"Insufficient stock. Only {product.stock} available.")

        item.quantity = data.quantity
        item.updated_at = datetime.now(timezone.utc)
        session.add(item)
        await session.commit()

        return await CartService.view_cart(session, user_id)

    @staticmethod
    async def remove_item(session: AsyncSession, user_id: uuid.UUID, item_id: uuid.UUID):
        cart = await CartService.get_or_create_cart(session, user_id)
        item = await session.get(CartItem, item_id)

        if not item or item.cart_id != cart.id:
            raise HTTPException(status_code=404, detail="Cart item not found")

        await session.delete(item)
        await session.commit()
        return await CartService.view_cart(session, user_id)

    @staticmethod
    async def clear_cart(session: AsyncSession, user_id: uuid.UUID):
        cart = await CartService.get_or_create_cart(session, user_id)
        items_result = await session.exec(select(CartItem).where(CartItem.cart_id == cart.id))
        for item in items_result.all():
            await session.delete(item)

        await session.commit()
        return {"message": "Cart cleared successfully"}