from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlalchemy import func, desc, cast, Date

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.payment import Payment
from app.models.user import User
from app.models.role import Role


class ReportService:

    @staticmethod
    async def get_financial_summary(session: AsyncSession) -> dict:
        """Calculates total and pending revenue directly in the database."""
        query = select(Payment.status, func.sum(Payment.amount), func.count(Payment.id)).group_by(Payment.status)
        results = await session.exec(query)

        summary = {
            "total_revenue": 0.0,
            "pending_revenue": 0.0,
            "successful_payments": 0,
            "pending_payments": 0,
            "failed_payments": 0
        }

        for status, total_amount, count in results.all():
            if status == "COMPLETED":
                summary["total_revenue"] = total_amount or 0.0
                summary["successful_payments"] = count
            elif status == "PENDING":
                summary["pending_revenue"] = total_amount or 0.0
                summary["pending_payments"] = count
            elif status == "FAILED":
                summary["failed_payments"] = count

        return summary

    @staticmethod
    async def get_order_distribution(session: AsyncSession) -> list:
        """Groups orders by their current status."""
        query = select(Order.status, func.count(Order.id)).group_by(Order.status)
        results = await session.exec(query)
        return [{"status": r[0], "count": r[1]} for r in results.all()]

    @staticmethod
    async def get_daily_sales_trend(session: AsyncSession, days: int = 30) -> list:
        """Calculates daily orders and revenue for charts."""
        # Using cast to Date is universally highly efficient in Postgres
        query = (
            select(
                cast(Order.created_at, Date).label("date"),
                func.count(Order.id).label("total_orders"),
                func.sum(Order.final_total).label("total_revenue")
            )
            .group_by(cast(Order.created_at, Date))
            .order_by(desc("date"))
            .limit(days)
        )
        results = await session.exec(query)
        return [{"date": r[0], "total_orders": r[1], "total_revenue": r[2] or 0.0} for r in results.all()]

    @staticmethod
    async def get_top_selling_products(session: AsyncSession, limit: int = 10) -> list:
        """Identifies best sellers efficiently via OrderItem aggregation."""
        query = (
            select(
                OrderItem.product_sku,
                OrderItem.product_name,
                func.sum(OrderItem.quantity).label("qty"),
                func.sum(OrderItem.subtotal).label("rev")
            )
            .group_by(OrderItem.product_sku, OrderItem.product_name)
            .order_by(desc("qty"))
            .limit(limit)
        )
        results = await session.exec(query)
        return [{"product_sku": r[0], "product_name": r[1], "quantity_sold": r[2], "total_revenue": r[3] or 0.0} for r
                in results.all()]

    @staticmethod
    async def get_customer_growth_trend(session: AsyncSession, days: int = 30) -> list:
        """Tracks daily new customer registrations."""
        # Subquery to filter only users with the CUSTOMER role
        customer_role_query = select(Role.id).where(Role.name == "CUSTOMER").scalar_subquery()

        query = (
            select(
                cast(User.created_at, Date).label("date"),
                func.count(User.id).label("new_customers")
            )
            .where(User.role_id == customer_role_query)
            .group_by(cast(User.created_at, Date))
            .order_by(desc("date"))
            .limit(days)
        )
        results = await session.exec(query)
        return [{"date": r[0], "new_customers": r[1]} for r in results.all()]

    @staticmethod
    async def get_full_analytics_dashboard(session: AsyncSession) -> dict:
        """Aggregates all reports into a single API call for the React Dashboard."""
        return {
            "financials": await ReportService.get_financial_summary(session),
            "order_distribution": await ReportService.get_order_distribution(session),
            "sales_trend": await ReportService.get_daily_sales_trend(session, days=14),
            "top_products": await ReportService.get_top_selling_products(session, limit=5),
            "customer_growth": await ReportService.get_customer_growth_trend(session, days=14)
        }