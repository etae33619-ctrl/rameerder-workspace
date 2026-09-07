import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse
from app.schemas.role import RoleResponse

# Updates
class OrderStatusUpdate(BaseModel):
    status: str

class OrderTrackingCreateAdmin(BaseModel):
    status: str
    notes: str | None = None

class InventoryUpdate(BaseModel):
    stock: int

class PaymentStatusUpdate(BaseModel):
    status: str

class SystemSettingUpdate(BaseModel):
    value: str

# Responses
class AuditLogResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    action: str
    resource: str
    resource_id: str | None
    details: str | None
    ip_address: str | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SystemSettingResponse(BaseModel):
    id: uuid.UUID
    key: str
    value: str
    description: str | None
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ReportDashboardResponse(BaseModel):
    total_customers: int
    total_orders: int
    total_revenue: float
    pending_orders: int
    low_stock_products: int