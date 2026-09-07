import { apiClient } from "../../services/api/client";
import { type CartItem } from "./types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const cartApi = {
  async fetchCart(): Promise<CartItem[]> {
    if (USE_MOCK) {
      const stored = localStorage.getItem("rpg_cart");
      return stored ? JSON.parse(stored) : [];
    }

    // Connects to FastAPI endpoint GET /api/cart
    try {
      return await apiClient<CartItem[]>("/cart");
    } catch {
      const stored = localStorage.getItem("rpg_cart");
      return stored ? JSON.parse(stored) : [];
    }
  },

  async syncCart(items: CartItem[]): Promise<void> {
    // Always persist to localStorage for offline access/resilience
    localStorage.setItem("rpg_cart", JSON.stringify(items));

    if (USE_MOCK) return;

    // Connects to FastAPI endpoint POST /api/cart/sync
    try {
      await apiClient<void>("/cart/sync", {
        method: "POST",
        data: { items },
      });
    } catch {
      // Degrades gracefully to localStorage state
    }
  },
};