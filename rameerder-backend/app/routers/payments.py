from fastapi import APIRouter, Depends, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.schemas.payment import WebhookResponse
from app.services.payment_service import PaymentService

router = APIRouter()


@router.post("/webhook/{provider}", response_model=WebhookResponse)
async def payment_webhook(
        provider: str,
        request: Request,
        session: AsyncSession = Depends(get_session),
        x_signature: str = Header(None, description="Signature from the payment gateway")
):
    """
    Public webhook endpoint for payment providers (MTN, Orange, Card gateways).
    Must not be protected by JWT auth, as it's called by 3rd party servers.
    """
    # Get raw bytes for accurate HMAC signature verification
    payload_bytes = await request.body()

    # Parse JSON payload
    event_data = await request.json()

    # Process
    return await PaymentService.process_webhook(
        provider_name=provider,
        payload_bytes=payload_bytes,
        signature=x_signature or "",
        event_data=event_data,
        session=session
    )