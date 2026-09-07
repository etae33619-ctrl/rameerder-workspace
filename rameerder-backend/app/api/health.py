from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.database import get_session

router = APIRouter()


@router.get("/health", status_code=200)
async def health_check(session: AsyncSession = Depends(get_session)):
    """
    Health check endpoint to verify the API and Database are operational.
    """
    db_status = "operational"

    try:
        # Ping the database
        await session.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"degraded: {str(e)}"

    return {
        "status": "operational" if db_status == "operational" else "degraded",
        "database": db_status,
        "service": "RAMEERDER PACE GROUP API",
        "version": "1.0.0"
    }