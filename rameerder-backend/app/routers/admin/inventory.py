import uuid
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.dependencies import RequireRole
from app.schemas.product import ProductResponse
from app.schemas.admin import InventoryUpdate
from app.services.admin_service import AdminService
from app.services.product_service import ProductService

router = APIRouter()
admin_manager = RequireRole(["ADMINISTRATOR", "MANAGER"])

@router.get("/low-stock", response_model=List[ProductResponse])
async def admin_get_low_stock(threshold: int = 10, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    return await AdminService.get_low_stock(session, threshold)

@router.patch("/{id}/stock", response_model=ProductResponse)
async def admin_update_inventory(id: uuid.UUID, data: InventoryUpdate, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    await AdminService.update_inventory(session, id, data)
    await AdminService.log_action(session, user.id, "UPDATE_INVENTORY", "Product", str(id), f"Stock set to {data.stock}")
    return await ProductService.get_product_with_images(session, id)