from unittest.mock import AsyncMock, patch


def test_webhook_successful_payment(client):
    """
    Tests that a valid webhook successfully updates the payment status.
    """
    mock_payload = {
        "transaction_ref": "FAKE-REF-123",
        "status": "SUCCESS"
    }

    # Mock the database service layer so we don't need real records
    with patch("app.services.payment_service.PaymentService.process_webhook", new_callable=AsyncMock) as mock_webhook:
        mock_webhook.return_value = {"status": "success", "message": "Payment completed"}

        response = client.post(
            "/api/payments/webhook/mtn",
            json=mock_payload,
            headers={"X-Signature": "fake-hash"}
        )

        assert response.status_code == 200
        assert response.json()["status"] == "success"


def test_unsupported_payment_factory_error():
    """Prove the factory blocks bad providers natively"""
    from app.integrations.payments.factory import PaymentFactory
    from fastapi import HTTPException
    import pytest

    with pytest.raises(HTTPException) as exc:
        PaymentFactory.get_provider("BITCOIN")
    assert exc.value.status_code == 400