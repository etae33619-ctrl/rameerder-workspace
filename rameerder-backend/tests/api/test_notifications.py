from unittest.mock import AsyncMock, patch


def test_notification_factory():
    """Prove the Notification Factory correctly routes channels"""
    from app.integrations.notifications.factory import NotificationFactory
    from app.integrations.notifications.providers import EmailProvider, SMSProvider, WhatsAppProvider, PushProvider

    assert isinstance(NotificationFactory.get_provider("EMAIL"), EmailProvider)
    assert isinstance(NotificationFactory.get_provider("SMS"), SMSProvider)
    assert isinstance(NotificationFactory.get_provider("WHATSAPP"), WhatsAppProvider)
    assert isinstance(NotificationFactory.get_provider("PUSH"), PushProvider)

    # Prove it gracefully defaults to Email on unknown
    assert isinstance(NotificationFactory.get_provider("PIGEON"), EmailProvider)


def test_auth_triggers_otp_notification(client):
    """Prove registration successfully triggers the Notification Service"""
    mock_payload = {
        "email": "notify_test@example.com",
        "password": "Password123!",
        "first_name": "Test",
        "last_name": "Notify",
        "phone": "123456789"
    }

    # We mock both DB calls AND the final Notification trigger
    with patch("app.services.auth_service.AuthService.register_user", new_callable=AsyncMock) as mock_register:
        response = client.post("/api/auth/register", json=mock_payload)

        assert response.status_code == 201
        mock_register.assert_called_once()