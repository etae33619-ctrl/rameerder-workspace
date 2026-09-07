from app.integrations.notifications.base import BaseNotificationProvider
from app.integrations.notifications.providers import (
    EmailProvider,
    SMSProvider,
    WhatsAppProvider,
    PushProvider
)

class NotificationFactory:
    @staticmethod
    def get_provider(channel: str) -> BaseNotificationProvider:
        channel = channel.strip().upper()
        if channel == "EMAIL":
            return EmailProvider()
        elif channel == "SMS":
            return SMSProvider()
        elif channel == "WHATSAPP":
            return WhatsAppProvider()
        elif channel == "PUSH":
            return PushProvider()
        else:
            # Fallback to email for unknown channels
            return EmailProvider()