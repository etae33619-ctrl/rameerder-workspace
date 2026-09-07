import { apiClient } from "../../services/api/client";
import { type OrderSummary, type CustomerAddress, type Notification } from "./types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_ORDERS: OrderSummary[] = [
  { id: "RPG-000125", date: "2023-01-15", itemCount: 3, total: 58500, status: "SHIPPED" },
  { id: "RPG-000124", date: "2023-01-10", itemCount: 1, total: 15000, status: "PROCESSING" },
  { id: "RPG-000120", date: "2022-12-05", itemCount: 5, total: 120500, status: "DELIVERED" },
];

const MOCK_ADDRESSES: CustomerAddress[] = [
  {
    id: "addr_1",
    deliveryZone: "Buea - Molyko",
    neighborhood: "Molyko",
    landmark: "Opposite Molyko Pharmacy",
    street: "University Road",
    building: "Blue Complex, Apt 4",
    directions: "Take the dirt road next to the pharmacy, it's the second blue gate on the right.",
    isDefault: true,
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "notif_1", title: "Order Shipped", message: "Your order #RPG-000125 has been shipped.", date: "2 hours ago", isRead: false },
  { id: "notif_2", title: "Payment Successful", message: "Payment for order #RPG-000125 was successful.", date: "1 day ago", isRead: true },
];

export const customerApi = {
  async getDashboardStats() {
    if (USE_MOCK) {
      await delay(300);
      return { totalOrders: 25, pendingOrders: 3, completedOrders: 22 };
    }

    // Connects to FastAPI endpoint GET /api/customer/stats
    return await apiClient<{ totalOrders: number; pendingOrders: number; completedOrders: number }>(
      "/customer/stats"
    );
  },

  async getRecentOrders(): Promise<OrderSummary[]> {
    if (USE_MOCK) {
      await delay(300);
      return MOCK_ORDERS;
    }

    // Connects to FastAPI endpoint GET /api/customer/orders
    return await apiClient<OrderSummary[]>("/customer/orders");
  },

  async getAddresses(): Promise<CustomerAddress[]> {
    if (USE_MOCK) {
      await delay(300);
      return MOCK_ADDRESSES;
    }

    // Connects to FastAPI endpoint GET /api/customer/addresses
    return await apiClient<CustomerAddress[]>("/customer/addresses");
  },

  async getNotifications(): Promise<Notification[]> {
    if (USE_MOCK) {
      await delay(300);
      return MOCK_NOTIFICATIONS;
    }

    // Connects to FastAPI endpoint GET /api/customer/notifications
    return await apiClient<Notification[]>("/customer/notifications");
  },
};