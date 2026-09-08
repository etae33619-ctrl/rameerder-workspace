import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.models.delivery_zone import DeliveryZone
from app.schemas.delivery_zone import DeliveryZoneCreate, DeliveryZoneUpdate


class DeliveryZoneService:
    @staticmethod
    async def get_all(session: AsyncSession, only_active: bool = True):
        query = select(DeliveryZone)
        if only_active:
            query = query.where(DeliveryZone.is_active == True)
        result = await session.exec(query)
        return result.all()

    @staticmethod
    async def get_by_id(session: AsyncSession, zone_id: uuid.UUID, only_active: bool = True):
        query = select(DeliveryZone).where(DeliveryZone.id == zone_id)
        if only_active:
            query = query.where(DeliveryZone.is_active == True)

        result = await session.exec(query)
        zone = result.first()
        if not zone:
            raise HTTPException(status_code=404, detail="Delivery zone not found or inactive")
        return zone

    @staticmethod
    async def create(session: AsyncSession, data: DeliveryZoneCreate):
        zone = DeliveryZone(**data.model_dump())
        session.add(zone)
        await session.commit()
        await session.refresh(zone)
        return zone

    @staticmethod
    async def update(session: AsyncSession, zone_id: uuid.UUID, data: DeliveryZoneUpdate):
        zone = await session.get(DeliveryZone, zone_id)
        if not zone:
            raise HTTPException(status_code=404, detail="Delivery zone not found")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(zone, key, value)

        session.add(zone)
        await session.commit()
        await session.refresh(zone)
        return zone

    @staticmethod
    async def delete(session: AsyncSession, zone_id: uuid.UUID):
        zone = await session.get(DeliveryZone, zone_id)
        if not zone:
            raise HTTPException(status_code=404, detail="Delivery zone not found")

        await session.delete(zone)
        await session.commit()