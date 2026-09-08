from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.models.payment import Payment
from app.models.order import Order
from app.models.user import User
from app.integrations.payments.factory import PaymentFactory
from app.services.notification_service import NotificationService  # NEW


class PaymentService:

    @staticmethod
    async def process_webhook(provider_name: str, payload_bytes: bytes, signature: str, event_data: dict,
                              session: AsyncSession):
        provider = PaymentFactory.get_provider(provider_name)

        is_valid = await provider.verify_webhook_signature(payload_bytes, signature)
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

        reference = event_data.get("transaction_ref") or event_data.get("reference")
        if not reference:
            raise HTTPException(status_code=400, detail="Missing transaction reference in payload")

        result = await session.exec(select(Payment).where(Payment.reference == reference))
        payment = result.first()

        if not payment:
            raise HTTPException(status_code=404, detail="Payment reference not found")

        provider_status = event_data.get("status", "").upper()

        if provider_status in ["SUCCESS", "COMPLETED", "SUCCESSFUL"]:
            payment.status = "COMPLETED"
        elif provider_status in ["FAILED", "DECLINED"]:
            payment.status = "FAILED"

        session.add(payment)

        # Update Order status and TRIGGER NOTIFICATION
        if payment.status == "COMPLETED":
            order = await session.get(Order, payment.order_id)
            if order and order.status == "PENDING":
                order.status = "PROCESSING"
                session.add(order)

                # We need the user email for the notification
                user = await session.get(User, order.user_id)
                if user:
                    await NotificationService.trigger_payment_confirmation(
                        session, user.id, user.email, order.id, payment.amount
                    )

        await session.commit()
        return {"status": "success", "message": f"Payment {payment.status.lower()}"}