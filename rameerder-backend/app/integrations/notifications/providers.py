from app.integrations.notifications.base import BaseNotificationProvider
from app.core.config import settings

class EmailProvider(BaseNotificationProvider):
    async def send(self, recipient: str, title: str, message: str) -> bool:
        # TODO: Implement actual SMTP/SendGrid transmission using settings.SMTP_USER
        print(f"[EMAIL TO: {recipient}] {title} | {message}")
        return True

class SMSProvider(BaseNotificationProvider):
    async def send(self, recipient: str, title: str, message: str) -> bool:
        # TODO: Implement Twilio/Infobip transmission using settings.TWILIO_SMS_KEY
        print(f"[SMS TO: {recipient}] {title} | {message}")
        return True

class WhatsAppProvider(BaseNotificationProvider):
    async def send(self, recipient: str, title: str, message: str) -> bool:
        # TODO: Implement Meta WhatsApp Business API using settings.WHATSAPP_API_KEY
        print(f"[WHATSAPP TO: {recipient}] {title} | {message}")
        return True

class PushProvider(BaseNotificationProvider):
    async def send(self, recipient: str, title: str, message: str) -> bool:
        # TODO: Implement Firebase Cloud Messaging using settings.PUSH_API_KEY
        print(f"[PUSH TO: {recipient}] {title} | {message}")
        return True