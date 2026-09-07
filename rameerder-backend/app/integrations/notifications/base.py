from abc import ABC, abstractmethod


class BaseNotificationProvider(ABC):
    """
    Abstract interface guaranteeing that the core logic is never tightly
    coupled to a specific messaging provider like SendGrid, Twilio, or Meta.
    """

    @abstractmethod
    async def send(self, recipient: str, title: str, message: str) -> bool:
        """Dispatches the message to the external service."""
        pass