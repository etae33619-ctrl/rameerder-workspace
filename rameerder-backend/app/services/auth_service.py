import uuid
import secrets
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.user import User
from app.models.role import Role
from app.schemas.auth import UserRegisterRequest, LoginRequest
from app.core.security import get_password_hash, verify_password, create_access_token
from app.services.notification_service import NotificationService  # NEW


class AuthService:

    @staticmethod
    async def get_or_create_customer_role(session: AsyncSession) -> Role:
        result = await session.exec(select(Role).where(Role.name == "CUSTOMER"))
        role = result.first()
        if not role:
            role = Role(name="CUSTOMER", description="Default customer role")
            session.add(role)
            await session.commit()
            await session.refresh(role)
        return role

    @staticmethod
    async def register_user(data: UserRegisterRequest, session: AsyncSession) -> User:
        result = await session.exec(select(User).where(User.email == data.email))
        if result.first():
            raise HTTPException(status_code=409, detail="Email already registered")

        role = await AuthService.get_or_create_customer_role(session)
        otp = str(secrets.randbelow(900000) + 100000)

        new_user = User(
            email=data.email,
            hashed_password=get_password_hash(data.password),
            first_name=data.first_name,
            last_name=data.last_name,
            phone=data.phone,
            role_id=role.id,
            otp_code=otp,
            otp_expires_at=datetime.now(timezone.utc) + timedelta(minutes=15)
        )

        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)

        # TRIGGER ACTUAL NOTIFICATION
        await NotificationService.trigger_otp(session, new_user.id, new_user.email, otp)

        return new_user

    @staticmethod
    async def authenticate(data: LoginRequest, session: AsyncSession) -> dict:
        result = await session.exec(select(User).where(User.email == data.email))
        user = result.first()

        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is disabled")

        access_token = create_access_token(subject=str(user.id))

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": str(user.id),
            "is_verified": user.is_verified
        }

    @staticmethod
    async def verify_otp(email: str, otp_code: str, session: AsyncSession):
        result = await session.exec(select(User).where(User.email == email))
        user = result.first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if user.is_verified:
            raise HTTPException(status_code=400, detail="User already verified")

        if user.otp_code != otp_code or not user.otp_expires_at:
            raise HTTPException(status_code=400, detail="Invalid OTP")

        if user.otp_expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="OTP expired")

        user.is_verified = True
        user.otp_code = None
        user.otp_expires_at = None

        session.add(user)
        await session.commit()

        # TRIGGER WELCOME NOTIFICATION
        await NotificationService.trigger_registration_welcome(session, user.id, user.email, user.first_name)

        return {"message": "Account verified successfully"}

    @staticmethod
    async def process_forgot_password(email: str, session: AsyncSession):
        result = await session.exec(select(User).where(User.email == email))
        user = result.first()

        if user:
            token = secrets.token_urlsafe(32)
            user.reset_token = token
            user.reset_token_expires_at = datetime.now(timezone.utc) + timedelta(hours=1)

            session.add(user)
            await session.commit()

            # TRIGGER RESET NOTIFICATION
            await NotificationService._create_and_dispatch(
                session, user.id, user.email,
                title="Password Reset Request",
                message=f"Use this token to reset your password: {token}"
            )

        return {"message": "If that email is registered, a reset link has been sent."}

    @staticmethod
    async def process_reset_password(email: str, token: str, new_password: str, session: AsyncSession):
        result = await session.exec(select(User).where(User.email == email))
        user = result.first()

        if not user or user.reset_token != token:
            raise HTTPException(status_code=400, detail="Invalid reset token")

        if not user.reset_token_expires_at or user.reset_token_expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Reset token expired")

        user.hashed_password = get_password_hash(new_password)
        user.reset_token = None
        user.reset_token_expires_at = None

        session.add(user)
        await session.commit()
        return {"message": "Password has been reset successfully"}