from datetime import date
from pydantic import BaseModel, ConfigDict
from typing import List


class DailySalesTrend(BaseModel):
    date: date
    total_orders: int
    total_revenue: float


class OrderStatusDistribution(BaseModel):
    status: str
    count: int


class TopSellingProduct(BaseModel):
    product_sku: str
    product_name: str
    quantity_sold: int
    total_revenue: float


class FinancialSummary(BaseModel):
    total_revenue: float
    pending_revenue: float
    successful_payments: int
    pending_payments: int
    failed_payments: int


class CustomerGrowthTrend(BaseModel):
    date: date
    new_customers: int


class AnalyticsDashboardResponse(BaseModel):
    financials: FinancialSummary
    order_distribution: List[OrderStatusDistribution]
    sales_trend: List[DailySalesTrend]
    top_products: List[TopSellingProduct]
    customer_growth: List[CustomerGrowthTrend]

    model_config = ConfigDict(from_attributes=True)