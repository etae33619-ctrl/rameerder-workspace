from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from app.core.limiter import limiter

from app.core.config import settings
from app.core.exceptions import http_exception_handler, validation_exception_handler
from app.api import health

# Public & Customer Routers
from app.routers import auth, users, categories, brands, products, cart, wishlist, zones, addresses, orders, payments, \
    notifications

# Admin Routers
from app.routers.admin import (
    users as admin_users, categories as admin_categories, brands as admin_brands,
    products as admin_products, delivery_zones as admin_zones, orders as admin_orders,
    inventory as admin_inventory, customers as admin_customers, employees as admin_employees,
    roles as admin_roles, payments as admin_payments, reports as admin_reports,
    audit_logs as admin_logs, settings as admin_settings
)


def create_app() -> FastAPI:
    app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_PREFIX}/openapi.json", docs_url="/docs",
                  redoc_url="/redoc")

    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(CORSMiddleware, allow_origins=settings.BACKEND_CORS_ORIGINS, allow_credentials=True,
                           allow_methods=["*"], allow_headers=["*"])

    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Customer & Public
    app.include_router(health.router, prefix=settings.API_PREFIX, tags=["Health"])
    app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["Authentication"])
    app.include_router(users.router, prefix=f"{settings.API_PREFIX}/users", tags=["Users Profile"])
    app.include_router(cart.router, prefix=f"{settings.API_PREFIX}/cart", tags=["Customer Cart"])
    app.include_router(wishlist.router, prefix=f"{settings.API_PREFIX}/wishlist", tags=["Customer Wishlist"])
    app.include_router(addresses.router, prefix=f"{settings.API_PREFIX}/addresses", tags=["Customer Addresses"])
    app.include_router(orders.router, prefix=f"{settings.API_PREFIX}/orders", tags=["Customer Orders"])
    app.include_router(notifications.router, prefix=f"{settings.API_PREFIX}/notifications",
                       tags=["Customer Notifications"])
    app.include_router(categories.router, prefix=f"{settings.API_PREFIX}/categories", tags=["Public Categories"])
    app.include_router(brands.router, prefix=f"{settings.API_PREFIX}/brands", tags=["Public Brands"])
    app.include_router(products.router, prefix=f"{settings.API_PREFIX}/products", tags=["Public Products"])
    app.include_router(zones.router, prefix=f"{settings.API_PREFIX}/zones", tags=["Public Delivery Zones"])
    app.include_router(payments.router, prefix=f"{settings.API_PREFIX}/payments", tags=["Payment Webhooks"])

    # Admin
    app.include_router(admin_users.router, prefix=f"{settings.API_PREFIX}/admin/users", tags=["Admin Users"])
    app.include_router(admin_customers.router, prefix=f"{settings.API_PREFIX}/admin/customers",
                       tags=["Admin Customers"])
    app.include_router(admin_employees.router, prefix=f"{settings.API_PREFIX}/admin/employees",
                       tags=["Admin Employees"])
    app.include_router(admin_roles.router, prefix=f"{settings.API_PREFIX}/admin/roles", tags=["Admin Roles"])

    app.include_router(admin_categories.router, prefix=f"{settings.API_PREFIX}/admin/categories",
                       tags=["Admin Categories"])
    app.include_router(admin_brands.router, prefix=f"{settings.API_PREFIX}/admin/brands", tags=["Admin Brands"])
    app.include_router(admin_products.router, prefix=f"{settings.API_PREFIX}/admin/products", tags=["Admin Products"])
    app.include_router(admin_inventory.router, prefix=f"{settings.API_PREFIX}/admin/inventory",
                       tags=["Admin Inventory"])
    app.include_router(admin_zones.router, prefix=f"{settings.API_PREFIX}/admin/delivery-zones",
                       tags=["Admin Delivery Zones"])

    app.include_router(admin_orders.router, prefix=f"{settings.API_PREFIX}/admin/orders", tags=["Admin Orders"])
    app.include_router(admin_payments.router, prefix=f"{settings.API_PREFIX}/admin/payments", tags=["Admin Payments"])
    app.include_router(admin_reports.router, prefix=f"{settings.API_PREFIX}/admin/reports", tags=["Admin Reports"])
    app.include_router(admin_logs.router, prefix=f"{settings.API_PREFIX}/admin/audit-logs", tags=["Admin Audit Logs"])
    app.include_router(admin_settings.router, prefix=f"{settings.API_PREFIX}/admin/settings",
                       tags=["Admin System Settings"])

    return app


app = create_app()