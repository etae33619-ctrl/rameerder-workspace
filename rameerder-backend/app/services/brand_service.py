import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandUpdate

class BrandService:
    @staticmethod
    async def get_all(session: AsyncSession, only_active: bool = True):
        query = select(Brand)
        if only_active:
            query = query.where(Brand.is_active == True)
        result = await session.exec(query)
        return result.all()

    @staticmethod
    async def get_by_id(session: AsyncSession, id: uuid.UUID):
        brand = await session.get(Brand, id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        return brand

    @staticmethod
    async def create(session: AsyncSession, data: BrandCreate):
        brand = Brand(**data.model_dump())
        session.add(brand)
        await session.commit()
        await session.refresh(brand)
        return brand

    @staticmethod
    async def update(session: AsyncSession, id: uuid.UUID, data: BrandUpdate):
        brand = await BrandService.get_by_id(session, id)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(brand, key, value)
        session.add(brand)
        await session.commit()
        await session.refresh(brand)
        return brand

    @staticmethod
    async def delete(session: AsyncSession, id: uuid.UUID):
        brand = await BrandService.get_by_id(session, id)
        await session.delete(brand)
        await session.commit()