import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserProfileUpdate, PasswordChangeRequest, UserRoleUpdate
from app.core.security import get_password_hash, verify_password


class UserService:

    @staticmethod
    async def update_profile(user: User, data: UserProfileUpdate, session: AsyncSession) -> User:
        if data.first_name is not None:
            user.first_name = data.first_name
        if data.last_name is not None:
            user.last_name = data.last_name
        if data.phone is not None:
            user.phone = data.phone

        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    @staticmethod
    async def change_password(user: User, data: PasswordChangeRequest, session: AsyncSession):
        if not verify_password(data.current_password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect current password")

        user.hashed_password = get_password_hash(data.new_password)
        session.add(user)
        await session.commit()
        return {"message": "Password updated successfully"}

    @staticmethod
    async def get_all_users(session: AsyncSession) -> list[User]:
        result = await session.exec(select(User))
        return list(result.all())

    @staticmethod
    async def update_user_role(user_id: uuid.UUID, data: UserRoleUpdate, session: AsyncSession) -> User:
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        role = await session.get(Role, data.role_id)
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")

        user.role_id = role.id
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user