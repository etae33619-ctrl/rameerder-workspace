import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.address import AddressCreate, AddressUpdate, AddressResponse
from app.services.address_service import AddressService

router = APIRouter()

@router.get("", response_model=List[AddressResponse])
async def get_addresses(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """Get all addresses for the authenticated customer."""
    return await AddressService.get_user_addresses(session, current_user.id)

@router.get("/{id}", response_model=AddressResponse)
async def get_address(id: uuid.UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """Get a specific address."""
    return await AddressService.get_address_by_id(session, id, current_user.id)

@router.post("", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
async def create_address(data: AddressCreate, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """Create a new delivery address."""
    return await AddressService.create_address(session, current_user.id, data)

@router.patch("/{id}", response_model=AddressResponse)
async def update_address(id: uuid.UUID, data: AddressUpdate, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """Update an existing address."""
    return await AddressService.update_address(session, current_user.id, id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_address(id: uuid.UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    """Delete an address."""
    await AddressService.delete_address(session, current_user.id, id)