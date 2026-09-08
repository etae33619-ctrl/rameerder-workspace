from pydantic import BaseModel, ConfigDict
import uuid

class WebhookResponse(BaseModel):
    status: str
    message: str

class PaymentCheckoutResponse(BaseModel):
    reference: str
    redirect_url: str | None = None
    provider_data: dict = {}
    model_config = ConfigDict(from_attributes=True)