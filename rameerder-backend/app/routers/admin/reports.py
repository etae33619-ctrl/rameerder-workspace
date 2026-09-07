from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import RequireRole
from app.schemas.admin import ReportDashboardResponse
from app.schemas.report import AnalyticsDashboardResponse, DailySalesTrend, TopSellingProduct
from app.services.admin_service import AdminService
from app.services.report_service import ReportService

router = APIRouter()
admin_manager = RequireRole(["ADMINISTRATOR", "MANAGER"])

@router.get("/summary", response_model=ReportDashboardResponse)
async def admin_get_summary_stats(session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    """Phase 12: Basic high-level summary cards (totals)."""
    return await AdminService.get_dashboard_stats(session)

@router.get("/analytics", response_model=AnalyticsDashboardResponse)
async def admin_get_full_analytics(session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    """Phase 13: Deep analytics, trends, financials, and top products for charting."""
    return await ReportService.get_full_analytics_dashboard(session)

@router.get("/analytics/sales-trend", response_model=List[DailySalesTrend])
async def admin_get_sales_trend(days: int = 30, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    """Standalone API for just the sales trend chart."""
    return await ReportService.get_daily_sales_trend(session, days)

@router.get("/analytics/top-products", response_model=List[TopSellingProduct])
async def admin_get_top_products(limit: int = 10, session: AsyncSession = Depends(get_session), user=Depends(admin_manager)):
    """Standalone API for best-selling products table."""
    return await ReportService.get_top_selling_products(session, limit)