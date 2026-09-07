from abc import ABC, abstractmethod
from typing import Dict, Any


class PaymentResponse:
    def __init__(self, success: bool, reference: str, redirect_url: str | None = None, provider_data: Dict = {}):
        self.success = success
        self.reference = reference
        self.redirect_url = redirect_url
        self.provider_data = provider_data


class BasePaymentProvider(ABC):
    """
    Abstract base class for all payment integrations.
    Guarantees that checkout never tightly couples to a single gateway.
    """

    @abstractmethod
    async def initialize_payment(self, amount: float, order_id: str, customer_email: str,
                                 customer_phone: str | None) -> PaymentResponse:
        """Initiates the payment request to the 3rd party provider."""
        pass

    @abstractmethod
    async def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        """Verifies the webhook actually came from the payment provider."""
        pass