import {  type CartItem } from "../cart/types";

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string; // e.g., "30-45 Minutes", "1-2 Days"
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
}

export interface DeliveryLocation {
  deliveryZoneId: string;
  neighborhood: string;
  landmark: string;
  street: string;
  building: string;
  directions: string;
  latitude?: number;
  longitude?: number;
}

export type PaymentMethodType = "MTN_MOMO" | "ORANGE_MONEY" | "CARD" | "COD";

export interface CheckoutPayload {
  customerInfo: CustomerInfo;
  deliveryLocation: DeliveryLocation;
  paymentMethod: PaymentMethodType;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

export interface OrderResponse {
  orderId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  createdAt: string;
}