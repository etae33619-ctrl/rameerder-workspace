import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlalchemy import func, desc, or_

from app.models.user import User
from app.models.role import Role
from app.models.order import Order
from app.models.order_tracking import OrderTracking
from app.models.payment import Payment
from app.models.product import Product
from app.models.audit_log import AuditLog
from app.models.system_setting import SystemSetting
from app.schemas.admin import OrderStatusUpdate, OrderTrackingCreateAdmin, InventoryUpdate, PaymentStatusUpdate, \
    SystemSettingUpdate


class AdminService:
    # --- AUDIT LOGGING ---
    @staticmethod
    async def log_action(session: AsyncSession, user_id: uuid.UUID, action: str, resource: str, resource_id: str = None,
                         details: str = None):
        log = AuditLog(user_id=user_id, action=action, resource=resource, resource_id=resource_id, details=details)
        session.add(log)
        await session.commit()

    @staticmethod
    async def get_audit_logs(session: AsyncSession, limit: int = 100):
        result = await session.exec(select(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit))
        return result.all()

    # --- USERS, CUSTOMERS, EMPLOYEES ---
    @staticmethod
    async def get_customers(session: AsyncSession):
        query = select(User).join(Role).where(Role.name == "CUSTOMER").order_by(desc(User.created_at))
        result = await session.exec(query)
        return result.all()

    @staticmethod
    async def get_employees(session: AsyncSession):
        query = select(User).join(Role).where(Role.name.in_(["STAFF", "MANAGER", "ADMINISTRATOR"])).order_by(
            desc(User.created_at))
        result = await session.exec(query)
        return result.all()

    @staticmethod
    async def get_roles(session: AsyncSession):
        result = await session.exec(select(Role).order_by(Role.name))
        return result.all()

    # --- ORDERS ---
    @staticmethod
    async def get_all_orders(session: AsyncSession, limit: int = 100):
        result = await session.exec(select(Order).order_by(desc(Order.created_at)).limit(limit))
        return result.all()

    @staticmethod
    async def update_order_status(session: AsyncSession, order_id: uuid.UUID, data: OrderStatusUpdate):
        order = await session.get(Order, order_id)
        if not order: raise HTTPException(status_code=404, detail="Order not found")
        order.status = data.status.upper()
        session.add(order)
        await session.commit()
        await session.refresh(order)
        return order

    @staticmethod
    async def add_order_tracking(session: AsyncSession, order_id: uuid.UUID, data: OrderTrackingCreateAdmin):
        order = await session.get(Order, order_id)
        if not order: raise HTTPException(status_code=404, detail="Order not found")
        tracking = OrderTracking(order_id=order.id, status=data.status.upper(), notes=data.notes)
        session.add(tracking)
        order.status = data.status.upper()
        session.add(order)
        await session.commit()
        await session.refresh(tracking)
        return tracking

    # --- INVENTORY ---
    @staticmethod
    async def get_low_stock(session: AsyncSession, threshold: int = 10):
        result = await session.exec(select(Product).where(Product.stock <= threshold).order_by(Product.stock))
        return result.all()

    @staticmethod
    async def update_inventory(session: AsyncSession, product_id: uuid.UUID, data: InventoryUpdate):
        product = await session.get(Product, product_id)
        if not product: raise HTTPException(status_code=404, detail="Product not found")
        product.stock = data.stock
        session.add(product)
        await session.commit()
        await session.refresh(product)
        return product

    # --- PAYMENTS ---
    @staticmethod
    async def get_all_payments(session: AsyncSession, limit: int = 100):
        result = await session.exec(select(Payment).order_by(desc(Payment.created_at)).limit(limit))
        return result.all()

    @staticmethod
    async def update_payment_status(session: AsyncSession, payment_id: uuid.UUID, data: PaymentStatusUpdate):
        payment = await session.get(Payment, payment_id)
        if not payment: raise HTTPException(status_code=404, detail="Payment not found")
        payment.status = data.status.upper()
        session.add(payment)

        if payment.status == "COMPLETED":
            order = await session.get(Order, payment.order_id)
            if order and order.status == "PENDING":
                order.status = "PROCESSING"
                session.add(order)

        await session.commit()
        await session.refresh(payment)
        return payment

    # --- SETTINGS ---
    @staticmethod
    async def get_settings(session: AsyncSession):
        result = await session.exec(select(SystemSetting))
        return result.all()

    @staticmethod
    async def update_setting(session: AsyncSession, key: str, data: SystemSettingUpdate):
        result = await session.exec(select(SystemSetting).where(SystemSetting.key == key))
        setting = result.first()
        if not setting:
            setting = SystemSetting(key=key, value=data.value)
        else:
            setting.value = data.value
        session.add(setting)
        await session.commit()
        await session.refresh(setting)
        return setting

    # --- REPORTS ---
    @staticmethod
    async def get_dashboard_stats(session: AsyncSession):
        cust_count = (await session.exec(
            select(func.count()).select_from(select(User).join(Role).where(Role.name == "CUSTOMER").subquery()))).one()
        order_count = (await session.exec(select(func.count(Order.id)))).one()
        pending_count = (await session.exec(select(func.count(Order.id)).where(Order.status == "PENDING"))).one()
        low_stock = (await session.exec(select(func.count(Product.id)).where(Product.stock <= 10))).one()
        revenue = (await session.exec(
            select(func.sum(Payment.amount)).where(Payment.status == "COMPLETED"))).one() or 0.0

        return {
            "total_customers": cust_count,
            "total_orders": order_count,
            "total_revenue": revenue,
            "pending_orders": pending_count,
            "low_stock_products": low_stock
        }