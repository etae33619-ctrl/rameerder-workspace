from fastapi import APIRouter, Depends, Request, status
from app.core.limiter import limiter
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.auth import (
    UserRegisterRequest, LoginRequest, TokenResponse,
    OTPVerifyRequest, ForgotPasswordRequest, ResetPasswordRequest
)
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")  # NEW: Prevent spam account creation
async def register(request: Request, data: UserRegisterRequest, session: AsyncSession = Depends(get_session)):
    return await AuthService.register_user(data, session)

@router.post("/login", response_model=dict)
@limiter.limit("5/minute")  # NEW: Block brute-force password guessing
async def login(request: Request, data: LoginRequest, session: AsyncSession = Depends(get_session)):
    return await AuthService.authenticate(data, session)

@router.post("/verify-otp")
async def verify_otp(request: OTPVerifyRequest, session: AsyncSession = Depends(get_session)):
    return await AuthService.verify_otp(request.email, request.otp_code, session)

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, session: AsyncSession = Depends(get_session)):
    return await AuthService.process_forgot_password(request.email, session)

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, session: AsyncSession = Depends(get_session)):
    return await AuthService.process_reset_password(request.email, request.reset_token, request.new_password, session)