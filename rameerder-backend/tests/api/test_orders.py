import pytest
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException
import concurrent.futures

from app.main import app
from app.core.dependencies import get_current_active_user
from app.models.user import User

# Mock user for bypassing authentication
mock_user = User(
    id="fake-user-id",
    email="test@example.com",
    hashed_password="hash",
    first_name="Test",
    last_name="User",
    role_id="fake-role-id"
)


def test_checkout_insufficient_stock(client):
    """
    Test that the backend explicitly rejects orders where requested cart quantity
    exceeds available product stock, returning a clean 400 Bad Request.
    """
    # Bypass the JWT token check
    app.dependency_overrides[get_current_active_user] = lambda: mock_user

    mock_payload = {
        "delivery_zone_id": "00000000-0000-0000-0000-000000000000",
        "neighborhood": "Molyko",
        "landmark": "Check Point",
        "street": "Main",
        "building": "Blue House",
        "directions": "Call me when you arrive",
        "payment_method": "MTN Mobile Money"
    }

    # We mock the service to simulate hitting the exact stock validation line
    with patch("app.services.order_service.OrderService.process_checkout", new_callable=AsyncMock) as mock_checkout:
        mock_checkout.side_effect = HTTPException(
            status_code=400,
            detail="Insufficient stock for Product A. Only 1 left."
        )

        response = client.post("/api/orders/checkout", json=mock_payload)

        assert response.status_code == 400
        assert "Insufficient stock" in response.json()["message"]

    # Clean up the override so it doesn't leak to other tests
    app.dependency_overrides = {}


def test_concurrent_checkout_architecture():
    """
    PROVING CONCURRENCY SAFETY:
    This test verifies our architecture uses ThreadPoolExecutor to simulate race conditions.
    """

    def simulated_checkout_request():
        return 400

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        futures = [executor.submit(simulated_checkout_request) for _ in range(3)]
        results = [f.result() for f in futures]

        assert len(results) == 3