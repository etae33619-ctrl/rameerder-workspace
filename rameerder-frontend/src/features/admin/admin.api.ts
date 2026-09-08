import { apiClient } from "../../services/api/client";
import { type AdminStatOverview, type AdminAuditLog, type AdminEmployee } from "./types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const adminApi = {
  async getDashboardStats(): Promise<AdminStatOverview> {
    if (USE_MOCK) {
      await delay(300);
      return {
        totalRevenue: 12500000,
        totalOrders: 850,
        customers: 2300,
        products: 450,
        revenueGrowth: 8,
        ordersGrowth: 5,
      };
    }

    // Connects to FastAPI endpoint GET /api/admin/stats
    return await apiClient<AdminStatOverview>("/admin/stats");
  },

  async getAuditLogs(): Promise<AdminAuditLog[]> {
    if (USE_MOCK) {
      await delay(300);
      return [
        { id: "log_1", user: "Admin Jane", action: "Updated Product", resource: "Product #p1", date: "2024-09-10 10:30", ip: "192.168.1.1", status: "SUCCESS" },
        { id: "log_2", user: "John Doe", action: "Deleted Order", resource: "Order #RPG-012", date: "2024-09-10 09:15", ip: "192.168.1.5", status: "WARNING" },
        { id: "log_3", user: "System", action: "Failed Login", resource: "Auth", date: "2024-09-09 23:45", ip: "10.0.0.5", status: "FAILED" },
      ];
    }

    // Connects to FastAPI endpoint GET /api/admin/audit-logs
    return await apiClient<AdminAuditLog[]>("/admin/audit-logs");
  },

  async getEmployees(): Promise<AdminEmployee[]> {
    if (USE_MOCK) {
      await delay(300);
      return [
        { id: "emp_1", name: "Admin Jane", email: "jane@rameerder.com", role: "ADMIN", status: "ACTIVE", lastLogin: "2024-09-10" },
        { id: "emp_2", name: "John Doe", email: "john@rameerder.com", role: "MANAGER", status: "ACTIVE", lastLogin: "2024-09-09" },
        { id: "emp_3", name: "Sarah Smith", email: "sarah@rameerder.com", role: "STAFF", status: "INACTIVE", lastLogin: "2024-08-15" },
      ];
    }

    // Connects to FastAPI endpoint GET /api/admin/employees
    return await apiClient<AdminEmployee[]>("/admin/employees");
  },
};