import pytest
from unittest.mock import AsyncMock
from fastapi import HTTPException
from app.main import app
from app.core.dependencies import get_current_active_user, get_session
from app.models.user import User
from app.models.role import Role


# Helper to generate mock users and roles
def mock_user_with_role(role_name: str):
    mock_role = Role(id="fake-role-id", name=role_name)
    mock_user = User(
        id="fake-user-id",
        email="test@example.com",
        hashed_password="hash",
        first_name="Test",
        last_name="User",
        role_id=mock_role.id
    )
    return mock_user, mock_role


# Create a mock session dependency
def create_mock_session(mock_role: Role):
    session = AsyncMock()
    # When session.get(Role, role_id) is called, return our mock role
    session.get.return_value = mock_role
    return session


def test_customer_cannot_access_admin(client):
    """Prove a CUSTOMER gets 403 on an ADMIN endpoint."""
    user, role = mock_user_with_role("CUSTOMER")

    app.dependency_overrides[get_current_active_user] = lambda: user
    app.dependency_overrides[get_session] = lambda: create_mock_session(role)

    response = client.get("/api/admin/users")
    assert response.status_code == 403
    assert response.json()["message"] == "You do not have permission to perform this action"


def test_staff_cannot_access_admin(client):
    """Prove a STAFF member gets 403 on an ADMIN endpoint."""
    user, role = mock_user_with_role("STAFF")

    app.dependency_overrides[get_current_active_user] = lambda: user
    app.dependency_overrides[get_session] = lambda: create_mock_session(role)

    response = client.get("/api/admin/users")
    assert response.status_code == 403
    assert response.json()["message"] == "You do not have permission to perform this action"


def test_manager_cannot_access_admin(client):
    """Prove a MANAGER gets 403 on an ADMIN endpoint."""
    user, role = mock_user_with_role("MANAGER")

    app.dependency_overrides[get_current_active_user] = lambda: user
    app.dependency_overrides[get_session] = lambda: create_mock_session(role)

    response = client.get("/api/admin/users")
    assert response.status_code == 403
    assert response.json()["message"] == "You do not have permission to perform this action"


def test_admin_can_access_admin(client):
    """Prove an ADMINISTRATOR gets access to ADMIN endpoints."""
    user, role = mock_user_with_role("ADMINISTRATOR")

    app.dependency_overrides[get_current_active_user] = lambda: user
    app.dependency_overrides[get_session] = lambda: create_mock_session(role)

    # We mock the actual service call so it doesn't fail trying to read a real DB
    with pytest.MonkeyPatch.context() as m:
        m.setattr("app.services.user_service.UserService.get_all_users", AsyncMock(return_value=[]))
        response = client.get("/api/admin/users")

        assert response.status_code == 200
        assert response.json() == []


def test_staff_can_access_staff_dashboard(client):
    """Prove a STAFF member CAN access a STAFF endpoint."""
    user, role = mock_user_with_role("STAFF")

    app.dependency_overrides[get_current_active_user] = lambda: user
    app.dependency_overrides[get_session] = lambda: create_mock_session(role)

    response = client.get("/api/users/staff-dashboard")
    assert response.status_code == 200
    assert response.json()["message"] == "Welcome to the operational dashboard"

    # Clean up overrides so they don't leak into other tests
    app.dependency_overrides = {}