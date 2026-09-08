import uuid
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.delivery_zone import DeliveryZoneResponse
from app.services.delivery_zone_service import DeliveryZoneService

router = APIRouter()

@router.get("", response_model=List[DeliveryZoneResponse])
async def get_public_zones(session: AsyncSession = Depends(get_session)):
    """Fetch all active delivery zones for checkout."""
    return await DeliveryZoneService.get_all(session, only_active=True)

@router.get("/{id}", response_model=DeliveryZoneResponse)
async def get_public_zone(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    """Fetch a specific active delivery zone."""
    return await DeliveryZoneService.get_by_id(session, id, only_active=True)