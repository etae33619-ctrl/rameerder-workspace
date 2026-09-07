export interface AdminStatOverview {
  totalRevenue: number;
  totalOrders: number;
  customers: number;
  products: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

export interface AdminAuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  date: string;
  ip: string;
  status: "SUCCESS" | "FAILED" | "WARNING";
}

export interface AdminEmployee {
  id: string;
  name: string;
  email: string;
  role: "STAFF" | "MANAGER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  lastLogin: string;
}