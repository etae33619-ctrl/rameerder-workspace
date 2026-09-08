import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlalchemy import desc

from app.models.user import User
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.delivery_zone import DeliveryZone
from app.models.address import Address
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_tracking import OrderTracking
from app.models.payment import Payment
from app.schemas.order import CheckoutRequest
from app.services.cart_service import CartService
from app.integrations.payments.factory import PaymentFactory
from app.services.notification_service import NotificationService  # NEW


class OrderService:

    @staticmethod
    async def process_checkout(session: AsyncSession, user_id: uuid.UUID, data: CheckoutRequest) -> dict:
        user = await session.get(User, user_id)
        if not user: raise HTTPException(status_code=404, detail="User not found")

        cart = await CartService.get_or_create_cart(session, user_id)
        cart_items_result = await session.exec(select(CartItem).where(CartItem.cart_id == cart.id))
        cart_items = cart_items_result.all()

        if not cart_items:
            raise HTTPException(status_code=400, detail="Cannot checkout with an empty cart.")

        product_ids = [item.product_id for item in cart_items]
        products_query = select(Product).where(Product.id.in_(product_ids)).with_for_update()
        products_result = await session.exec(products_query)
        products = {p.id: p for p in products_result.all()}

        subtotal = 0.0
        discount_total = 0.0

        for item in cart_items:
            p = products.get(item.product_id)
            if not p or not p.is_active:
                raise HTTPException(status_code=400, detail="One or more products are no longer available.")
            if item.quantity > p.stock:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for {p.name}. Only {p.stock} left.")
            subtotal += (p.price * item.quantity)
            discount_total += (p.discount * item.quantity)

        zone = await session.get(DeliveryZone, data.delivery_zone_id)
        if not zone or not zone.is_active:
            raise HTTPException(status_code=400, detail="Selected delivery zone is invalid or inactive.")

        delivery_fee = zone.delivery_fee
        final_total = subtotal - discount_total + delivery_fee

        address = Address(
            user_id=user_id, delivery_zone_id=zone.id, neighborhood=data.neighborhood,
            landmark=data.landmark, street=data.street, building=data.building,
            directions=data.directions, latitude=data.latitude, longitude=data.longitude, is_default=False
        )
        session.add(address)
        await session.flush()

        order = Order(
            user_id=user_id, address_id=address.id, status="PENDING", subtotal=subtotal,
            delivery_fee=delivery_fee, discount_total=discount_total, final_total=final_total
        )
        session.add(order)
        await session.flush()

        for item in cart_items:
            p = products[item.product_id]
            order_item = OrderItem(
                order_id=order.id, product_id=p.id, product_name=p.name, product_sku=p.sku,
                price=p.price - p.discount, quantity=item.quantity, subtotal=(p.price - p.discount) * item.quantity
            )
            session.add(order_item)
            p.stock -= item.quantity
            session.add(p)

        tracking = OrderTracking(order_id=order.id, status="PENDING", notes="Order placed successfully.")
        session.add(tracking)

        provider = PaymentFactory.get_provider(data.payment_method)
        payment_response = await provider.initialize_payment(
            amount=final_total, order_id=str(order.id), customer_email=user.email, customer_phone=user.phone
        )

        payment = Payment(
            order_id=order.id, amount=final_total, provider=data.payment_method,
            reference=payment_response.reference,
            status="COMPLETED" if data.payment_method.upper() in ["CASH ON DELIVERY", "COD"] else "PENDING"
        )
        session.add(payment)

        for item in cart_items:
            await session.delete(item)

        await session.commit()
        await session.refresh(order)

        # TRIGGER NOTIFICATION (We do this after commit so order exists safely)
        await NotificationService.trigger_order_created(session, user.id, user.email, order.id, final_total)

        response = order.model_dump()
        items_result = await session.exec(select(OrderItem).where(OrderItem.order_id == order.id))
        response["items"] = [i.model_dump() for i in items_result.all()]
        response["payment_instructions"] = {
            "reference": payment_response.reference,
            "redirect_url": payment_response.redirect_url,
            "provider_data": payment_response.provider_data
        }
        return response

    @staticmethod
    async def get_user_orders(session: AsyncSession, user_id: uuid.UUID):
        result = await session.exec(select(Order).where(Order.user_id == user_id).order_by(desc(Order.created_at)))
        return result.all()

    @staticmethod
    async def get_order_details(session: AsyncSession, user_id: uuid.UUID, order_id: uuid.UUID):
        order = await session.get(Order, order_id)
        if not order or order.user_id != user_id:
            raise HTTPException(status_code=404, detail="Order not found")
        items = await session.exec(select(OrderItem).where(OrderItem.order_id == order_id))
        tracking = await session.exec(
            select(OrderTracking).where(OrderTracking.order_id == order_id).order_by(desc(OrderTracking.created_at)))
        response = order.model_dump()
        response["items"] = items.all()
        response["tracking"] = tracking.all()
        return response

    @staticmethod
    async def get_tracking_history(session: AsyncSession, user_id: uuid.UUID, order_id: uuid.UUID):
        order = await session.get(Order, order_id)
        if not order or order.user_id != user_id:
            raise HTTPException(status_code=404, detail="Order not found")
        result = await session.exec(
            select(OrderTracking).where(OrderTracking.order_id == order_id).order_by(desc(OrderTracking.created_at)))
        return result.all()