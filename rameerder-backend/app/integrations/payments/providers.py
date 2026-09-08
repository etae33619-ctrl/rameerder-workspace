import uuid
from app.integrations.payments.base import BasePaymentProvider, PaymentResponse
from app.core.config import settings

class MTNMobileMoneyProvider(BasePaymentProvider):
    async def initialize_payment(self, amount: float, order_id: str, customer_email: str, customer_phone: str | None) -> PaymentResponse:
        # TODO: Implement actual HTTP call to MTN MoMo API using settings.MTN_MOMO_API_KEY
        reference = f"MTN-{uuid.uuid4().hex[:8].upper()}"
        return PaymentResponse(success=True, reference=reference, provider_data={"status": "pending_push"})

    async def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        # TODO: Implement MTN specific signature verification
        return True

class OrangeMoneyProvider(BasePaymentProvider):
    async def initialize_payment(self, amount: float, order_id: str, customer_email: str, customer_phone: str | None) -> PaymentResponse:
        # TODO: Implement actual HTTP call to Orange Money API
        reference = f"OM-{uuid.uuid4().hex[:8].upper()}"
        return PaymentResponse(success=True, reference=reference, redirect_url="https://orange.money/mock-redirect")

    async def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        return True

class CardPaymentProvider(BasePaymentProvider):
    async def initialize_payment(self, amount: float, order_id: str, customer_email: str, customer_phone: str | None) -> PaymentResponse:
        # TODO: Implement Stripe/Flutterwave/Campay API calls here
        reference = f"CARD-{uuid.uuid4().hex[:8].upper()}"
        return PaymentResponse(success=True, reference=reference, redirect_url="https://secure-card-gateway.com/mock-checkout")

    async def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        # E.g., comparing HMAC SHA256 of payload with settings.CARD_WEBHOOK_SECRET
        return True

class CashOnDeliveryProvider(BasePaymentProvider):
    async def initialize_payment(self, amount: float, order_id: str, customer_email: str, customer_phone: str | None) -> PaymentResponse:
        # COD doesn't hit an external API, it just generates a reference and succeeds immediately
        reference = f"COD-{uuid.uuid4().hex[:8].upper()}"
        return PaymentResponse(success=True, reference=reference)

    async def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        return True