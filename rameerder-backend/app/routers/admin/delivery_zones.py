import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import RequireRole
from app.schemas.delivery_zone import DeliveryZoneCreate, DeliveryZoneUpdate, DeliveryZoneResponse
from app.services.delivery_zone_service import DeliveryZoneService

router = APIRouter()
admin_manager = RequireRole(["ADMINISTRATOR", "MANAGER"])

@router.get("", response_model=List[DeliveryZoneResponse])
async def get_all_zones(session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    """Get all zones, including inactive ones."""
    return await DeliveryZoneService.get_all(session, only_active=False)

@router.post("", response_model=DeliveryZoneResponse, status_code=status.HTTP_201_CREATED)
async def create_zone(data: DeliveryZoneCreate, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    return await DeliveryZoneService.create(session, data)

@router.patch("/{id}", response_model=DeliveryZoneResponse)
async def update_zone(id: uuid.UUID, data: DeliveryZoneUpdate, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    return await DeliveryZoneService.update(session, id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_zone(id: uuid.UUID, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    await DeliveryZoneService.delete(session, id)