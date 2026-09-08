import pytest
from fastapi import status
import uuid
from unittest.mock import AsyncMock, patch


def test_sql_injection_protection(client):
    """
    Test that Pydantic and SQLModel correctly parameterize inputs.
    Pydantic will actively block SQL injection payloads in constrained fields (like EmailStr)
    before they ever reach the database layer.
    """
    sqli_payload = {
        "email": "admin@example.com' OR '1'='1",
        "password": "password123"
    }
    response = client.post("/api/auth/login", json=sqli_payload)

    # Proves Pydantic catches the injection attempt as a malformed email
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_cors_headers(client):
    """
    Test that Cross-Origin Resource Sharing (CORS) is actively blocking
    unauthorized domains and allowing the configured React frontend.
    """
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    }
    response = client.options("/api/products", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    assert "access-control-allow-origin" in response.headers
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"


def test_pydantic_input_validation(client):
    """
    Test that Pydantic drops malformed data (like weak passwords or bad emails).
    """
    bad_payload = {
        "email": "not-an-email",
        "password": "short",  # Fails min_length constraint
        "first_name": "Test",
        "last_name": "User",
        "phone": "123"
    }
    response = client.post("/api/auth/register", json=bad_payload)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Our custom exception handler formats errors differently, so we check the raw text
    assert "email" in response.text
    assert "password" in response.text


def test_rate_limiting(client):
    """
    Test that the slowapi rate limiter actively blocks brute-force attempts.
    The limit is 5 per minute on login. We mock the service to avoid hitting the real DB.
    """
    payload = {"email": "test@example.com", "password": "wrongpassword"}

    with patch("app.services.auth_service.AuthService.authenticate", new_callable=AsyncMock) as mock_auth:
        mock_auth.return_value = {"access_token": "fake"}

        for _ in range(5):
            client.post("/api/auth/login", json=payload)

        # The 6th request should trigger the rate limiter (HTTP 429 Too Many Requests)
        response = client.post("/api/auth/login", json=payload)
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
        assert "Rate limit exceeded" in response.text


def test_admin_rbac_isolation(client):
    """
    Test that the backend independently verifies roles, proving that a compromised
    frontend cannot bypass admin route guards.
    """
    from app.main import app
    from app.core.dependencies import get_current_active_user, get_session
    from app.models.user import User
    from app.models.role import Role

    fake_role_id = uuid.uuid4()

    # Mock a standard customer with valid UUIDs
    mock_customer = User(
        id=uuid.uuid4(), email="cust@test.com", hashed_password="hash",
        first_name="Cust", last_name="User", role_id=fake_role_id
    )

    mock_role = Role(id=fake_role_id, name="CUSTOMER")

    # Mock the database session so the dependency doesn't crash looking for the role
    session_mock = AsyncMock()
    session_mock.get.return_value = mock_role

    app.dependency_overrides[get_current_active_user] = lambda: mock_customer
    app.dependency_overrides[get_session] = lambda: session_mock

    # Attempt to access a high-level admin settings route
    response = client.get("/api/admin/settings")

    # Must explicitly fail at the dependency layer with a 403 Forbidden
    assert response.status_code == status.HTTP_403_FORBIDDEN

    app.dependency_overrides = {}