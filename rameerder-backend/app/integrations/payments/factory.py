from fastapi import HTTPException
from app.integrations.payments.base import BasePaymentProvider
from app.integrations.payments.providers import (
    MTNMobileMoneyProvider,
    OrangeMoneyProvider,
    CardPaymentProvider,
    CashOnDeliveryProvider
)


class PaymentFactory:
    @staticmethod
    def get_provider(method_name: str) -> BasePaymentProvider:
        """Returns the appropriate payment provider instance based on frontend selection."""
        method = method_name.strip().upper()

        if method in ["MTN MOBILE MONEY", "MTN"]:
            return MTNMobileMoneyProvider()
        elif method in ["ORANGE MONEY", "ORANGE"]:
            return OrangeMoneyProvider()
        elif method in ["CARD", "CREDIT CARD", "DEBIT CARD"]:
            return CardPaymentProvider()
        elif method in ["CASH ON DELIVERY", "COD"]:
            return CashOnDeliveryProvider()
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported payment method: {method_name}")