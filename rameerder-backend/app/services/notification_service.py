import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlalchemy import desc

from app.models.notification import Notification
from app.integrations.notifications.factory import NotificationFactory


class NotificationService:

    @staticmethod
    async def _create_and_dispatch(
            session: AsyncSession,
            user_id: uuid.UUID,
            recipient: str,
            title: str,
            message: str,
            channel: str = "EMAIL"
    ):
        """Creates the database record and triggers the external provider."""
        # 1. Save to DB for internal user history
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            channel=channel
        )
        session.add(notification)
        await session.commit()

        # 2. Dispatch to external gateway
        provider = NotificationFactory.get_provider(channel)
        await provider.send(recipient=recipient, title=title, message=message)

    # --- SPECIFIC BUSINESS EVENTS ---

    @classmethod
    async def trigger_otp(cls, session: AsyncSession, user_id: uuid.UUID, email: str, otp: str):
        await cls._create_and_dispatch(
            session, user_id, email,
            title="Your Verification Code",
            message=f"Your OTP code is {otp}. It expires in 15 minutes."
        )

    @classmethod
    async def trigger_registration_welcome(cls, session: AsyncSession, user_id: uuid.UUID, email: str, first_name: str):
        await cls._create_and_dispatch(
            session, user_id, email,
            title="Welcome to RAMEERDER PACE GROUP!",
            message=f"Hi {first_name}, thank you for verifying your account. Explore our catalog today!"
        )

    @classmethod
    async def trigger_order_created(cls, session: AsyncSession, user_id: uuid.UUID, email: str, order_id: uuid.UUID,
                                    amount: float):
        await cls._create_and_dispatch(
            session, user_id, email,
            title="Order Placed Successfully",
            message=f"Your order {str(order_id)[:8].upper()} totaling {amount} has been received and is pending processing."
        )

    @classmethod
    async def trigger_payment_confirmation(cls, session: AsyncSession, user_id: uuid.UUID, email: str,
                                           order_id: uuid.UUID, amount: float):
        await cls._create_and_dispatch(
            session, user_id, email,
            title="Payment Received",
            message=f"We have successfully received your payment of {amount} for order {str(order_id)[:8].upper()}."
        )

    @classmethod
    async def trigger_order_status(cls, session: AsyncSession, user_id: uuid.UUID, email: str, order_id: uuid.UUID,
                                   status: str):
        await cls._create_and_dispatch(
            session, user_id, email,
            title=f"Order Status Update: {status}",
            message=f"Your order {str(order_id)[:8].upper()} is now {status}."
        )

    # --- CRUD OPERATIONS FOR CUSTOMER DASHBOARD ---

    @staticmethod
    async def get_user_notifications(session: AsyncSession, user_id: uuid.UUID):
        result = await session.exec(
            select(Notification).where(Notification.user_id == user_id).order_by(desc(Notification.created_at)))
        return result.all()

    @staticmethod
    async def mark_as_read(session: AsyncSession, user_id: uuid.UUID, notification_id: uuid.UUID):
        notification = await session.get(Notification, notification_id)
        if not notification or notification.user_id != user_id:
            raise HTTPException(status_code=404, detail="Notification not found")

        notification.is_read = True
        session.add(notification)
        await session.commit()
        await session.refresh(notification)
        return notification