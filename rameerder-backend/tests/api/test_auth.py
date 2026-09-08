import pytest
from unittest.mock import AsyncMock, patch

# Provide pytest-asyncio marker for the whole file
pytestmark = pytest.mark.asyncio


async def test_register_success(client):
    """
    Test the registration endpoint JSON payload handling.
    We mock the service to bypass actual database operations.
    """
    mock_payload = {
        "email": "test@example.com",
        "password": "Password123!",
        "first_name": "Test",
        "last_name": "User",
        "phone": "123456789"
    }

    with patch("app.services.auth_service.AuthService.register_user", new_callable=AsyncMock) as mock_register:
        response = client.post("/api/auth/register", json=mock_payload)

        assert response.status_code == 201
        assert response.json()["message"] == "Registration successful. Please check your email for the OTP."
        mock_register.assert_called_once()


async def test_login_success(client):
    """
    Test JSON login expected by the React frontend.
    """
    mock_payload = {
        "email": "test@example.com",
        "password": "Password123!"
    }

    mock_return = {
        "access_token": "fake-jwt-token",
        "token_type": "bearer",
        "user_id": "1234-uuid",
        "is_verified": True
    }

    with patch("app.services.auth_service.AuthService.authenticate", new_callable=AsyncMock) as mock_auth:
        mock_auth.return_value = mock_return

        response = client.post("/api/auth/login", json=mock_payload)

        assert response.status_code == 200
        assert response.json()["access_token"] == "fake-jwt-token"