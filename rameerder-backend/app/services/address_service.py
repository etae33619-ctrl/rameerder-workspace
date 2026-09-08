import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, update
from sqlalchemy import desc

from app.models.address import Address
from app.models.delivery_zone import DeliveryZone
from app.schemas.address import AddressCreate, AddressUpdate


class AddressService:
    @staticmethod
    async def _format_address_response(addr: Address, zone: DeliveryZone) -> dict:
        """Helper to nest the DeliveryZone inside the Address response for the React frontend."""
        data = addr.model_dump()
        data["zone"] = zone.model_dump()
        return data

    @staticmethod
    async def get_user_addresses(session: AsyncSession, user_id: uuid.UUID):
        # Explicit JOIN to fetch the Address and its assigned DeliveryZone concurrently
        query = select(Address, DeliveryZone) \
            .join(DeliveryZone, Address.delivery_zone_id == DeliveryZone.id) \
            .where(Address.user_id == user_id) \
            .order_by(desc(Address.is_default))

        results = await session.exec(query)
        return [await AddressService._format_address_response(addr, zone) for addr, zone in results.all()]

    @staticmethod
    async def get_address_by_id(session: AsyncSession, address_id: uuid.UUID, user_id: uuid.UUID):
        query = select(Address, DeliveryZone) \
            .join(DeliveryZone, Address.delivery_zone_id == DeliveryZone.id) \
            .where(Address.id == address_id, Address.user_id == user_id)

        result = await session.exec(query)
        row = result.first()
        if not row:
            raise HTTPException(status_code=404, detail="Address not found")

        return await AddressService._format_address_response(row[0], row[1])

    @staticmethod
    async def create_address(session: AsyncSession, user_id: uuid.UUID, data: AddressCreate):
        # 1. Strictly Validate the Delivery Zone
        zone = await session.get(DeliveryZone, data.delivery_zone_id)
        if not zone or not zone.is_active:
            raise HTTPException(status_code=400, detail="Invalid or inactive delivery zone selected.")

        # 2. Handle 'is_default' toggling safely
        if data.is_default:
            await session.execute(update(Address).where(Address.user_id == user_id).values(is_default=False))

        # 3. If this is their first address, force it to be default
        if not data.is_default:
            existing = await session.exec(select(Address).where(Address.user_id == user_id))
            if not existing.first():
                data.is_default = True

        new_addr = Address(**data.model_dump(), user_id=user_id)
        session.add(new_addr)
        await session.commit()

        return await AddressService.get_address_by_id(session, new_addr.id, user_id)

    @staticmethod
    async def update_address(session: AsyncSession, user_id: uuid.UUID, address_id: uuid.UUID, data: AddressUpdate):
        addr = await session.get(Address, address_id)
        if not addr or addr.user_id != user_id:
            raise HTTPException(status_code=404, detail="Address not found")

        if data.delivery_zone_id:
            zone = await session.get(DeliveryZone, data.delivery_zone_id)
            if not zone or not zone.is_active:
                raise HTTPException(status_code=400, detail="Invalid or inactive delivery zone selected.")

        if data.is_default and not addr.is_default:
            await session.execute(update(Address).where(Address.user_id == user_id).values(is_default=False))

        for key, val in data.model_dump(exclude_unset=True).items():
            setattr(addr, key, val)

        session.add(addr)
        await session.commit()

        return await AddressService.get_address_by_id(session, addr.id, user_id)

    @staticmethod
    async def delete_address(session: AsyncSession, user_id: uuid.UUID, address_id: uuid.UUID):
        addr = await session.get(Address, address_id)
        if not addr or addr.user_id != user_id:
            raise HTTPException(status_code=404, detail="Address not found")

        await session.delete(addr)
        await session.commit()