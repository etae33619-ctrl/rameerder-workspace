import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

class CategoryService:
    @staticmethod
    async def get_all(session: AsyncSession, only_active: bool = True):
        query = select(Category)
        if only_active:
            query = query.where(Category.is_active == True)
        result = await session.exec(query)
        return result.all()

    @staticmethod
    async def get_by_id(session: AsyncSession, id: uuid.UUID):
        category = await session.get(Category, id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category

    @staticmethod
    async def create(session: AsyncSession, data: CategoryCreate):
        category = Category(**data.model_dump())
        session.add(category)
        await session.commit()
        await session.refresh(category)
        return category

    @staticmethod
    async def update(session: AsyncSession, id: uuid.UUID, data: CategoryUpdate):
        category = await CategoryService.get_by_id(session, id)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(category, key, value)
        session.add(category)
        await session.commit()
        await session.refresh(category)
        return category

    @staticmethod
    async def delete(session: AsyncSession, id: uuid.UUID):
        category = await CategoryService.get_by_id(session, id)
        await session.delete(category)
        await session.commit()