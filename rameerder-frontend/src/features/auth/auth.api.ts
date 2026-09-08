import { apiClient } from "../../services/api/client";
import {type  AuthResponse, type User } from "./types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_USER: User = {
  id: "usr_123",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  role: "CUSTOMER",
  isEmailVerified: true,
};

export const authApi = {
  async login(credentials: Record<string, string>): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay(800);
      if (credentials.email === "admin@rameerder.com") {
        return {
          user: { ...MOCK_USER, role: "ADMIN", firstName: "Admin" },
          token: "mock_jwt_token_admin_123",
        };
      }
      if (credentials.password === "password123" || credentials.password === "admin") {
        return {
          user: MOCK_USER,
          token: "mock_jwt_token_customer_123",
        };
      }
      throw new Error("Invalid email or password.");
    }

    // Connects to FastAPI endpoint POST /api/auth/login
    return await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      data: credentials,
    });
  },

  async register(data: Record<string, string>): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay(800);
      return {
        user: { ...MOCK_USER, email: data.email, firstName: data.firstName, lastName: data.lastName },
        token: "mock_jwt_token_new_user",
      };
    }

    // Connects to FastAPI endpoint POST /api/auth/register
    return await apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      data,
    });
  },

  async verifyOTP(otp: string): Promise<boolean> {
    if (USE_MOCK) {
      await delay(500);
      if (otp !== "123456") throw new Error("Invalid OTP code.");
      return true;
    }

    // Connects to FastAPI endpoint POST /api/auth/verify-otp
    await apiClient<{ success: boolean }>("/auth/verify-otp", {
      method: "POST",
      data: { otp },
    });
    return true;
  },

  async forgotPassword(email: string): Promise<boolean> {
    if (USE_MOCK) {
      await delay(500);
      return true;
    }

    // Connects to FastAPI endpoint POST /api/auth/forgot-password
    await apiClient<{ success: boolean }>("/auth/forgot-password", {
      method: "POST",
      data: { email },
    });
    return true;
  },

  async resetPassword(password: string): Promise<boolean> {
    if (USE_MOCK) {
      await delay(500);
      return true;
    }

    // Connects to FastAPI endpoint POST /api/auth/reset-password
    await apiClient<{ success: boolean }>("/auth/reset-password", {
      method: "POST",
      data: { password },
    });
    return true;
  },

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK) {
      return MOCK_USER;
    }

    // Connects to FastAPI endpoint GET /api/auth/me
    return await apiClient<User>("/auth/me");
  },
};