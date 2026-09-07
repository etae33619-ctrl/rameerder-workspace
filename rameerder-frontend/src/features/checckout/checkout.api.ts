import { apiClient } from "../../services/api/client";
import {type  DeliveryZone, type CheckoutPayload, type OrderResponse } from "./types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_ZONES: DeliveryZone[] = [
  { id: "dz_1", name: "Buea - Molyko", fee: 1000, estimatedTime: "30-45 Minutes" },
  { id: "dz_2", name: "Buea - Clerk's Quarters", fee: 1500, estimatedTime: "45-60 Minutes" },
  { id: "dz_3", name: "Limbe - Down Beach", fee: 2500, estimatedTime: "1-2 Hours" },
  { id: "dz_4", name: "Douala - Bonanjo", fee: 3500, estimatedTime: "1-2 Days" },
  { id: "dz_5", name: "Yaounde - Bastos", fee: 4000, estimatedTime: "2-3 Days" },
];

export const checkoutApi = {
  async getDeliveryZones(): Promise<DeliveryZone[]> {
    if (USE_MOCK) {
      await delay(200);
      return MOCK_ZONES;
    }

    // Connects to FastAPI endpoint GET /api/delivery-zones
    return await apiClient<DeliveryZone[]>("/delivery-zones");
  },

  async placeOrder(payload: CheckoutPayload): Promise<OrderResponse> {
    if (USE_MOCK) {
      await delay(1200);
      return {
        orderId: `RPG-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };
    }

    // Maps frontend structures into FastAPI Pydantic request format
    const backendPayload = {
      customer: {
        full_name: payload.customerInfo.fullName,
        phone: payload.customerInfo.phone,
        email: payload.customerInfo.email,
      },
      delivery_location: {
        delivery_zone_id: payload.deliveryLocation.deliveryZoneId,
        neighborhood: payload.deliveryLocation.neighborhood,
        landmark: payload.deliveryLocation.landmark,
        street: payload.deliveryLocation.street || null,
        building: payload.deliveryLocation.building || null,
        directions: payload.deliveryLocation.directions,
        latitude: payload.deliveryLocation.latitude ?? null,
        longitude: payload.deliveryLocation.longitude ?? null,
      },
      payment_method: payload.paymentMethod,
      items: payload.items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.discountPrice || item.product.price,
      })),
      subtotal: payload.subtotal,
      delivery_fee: payload.deliveryFee,
      discount: payload.discount,
      total: payload.total,
    };

    // Connects to FastAPI endpoint POST /api/orders
    const result = await apiClient<{ order_id: string; status: OrderResponse["status"]; created_at: string }>(
      "/orders",
      {
        method: "POST",
        data: backendPayload,
      }
    );

    return {
      orderId: result.order_id,
      status: result.status,
      createdAt: result.created_at,
    };
  },
};