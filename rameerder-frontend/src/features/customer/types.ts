export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderSummary {
  id: string;
  date: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
}

export interface CustomerAddress {
  id: string;
  deliveryZone: string;
  neighborhood: string;
  landmark: string;
  street: string;
  building: string;
  directions: string;
  isDefault: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}