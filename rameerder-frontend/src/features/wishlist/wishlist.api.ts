import { apiClient } from "../../services/api/client";
import { type WishlistItem } from "./types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const wishlistApi = {
  async fetchWishlist(): Promise<WishlistItem[]> {
    if (USE_MOCK) {
      const stored = localStorage.getItem("rpg_wishlist");
      return stored ? JSON.parse(stored) : [];
    }

    // Connects to FastAPI endpoint GET /api/wishlist
    try {
      return await apiClient<WishlistItem[]>("/wishlist");
    } catch {
      const stored = localStorage.getItem("rpg_wishlist");
      return stored ? JSON.parse(stored) : [];
    }
  },

  async syncWishlist(items: WishlistItem[]): Promise<void> {
    localStorage.setItem("rpg_wishlist", JSON.stringify(items));

    if (USE_MOCK) return;

    // Connects to FastAPI endpoint POST /api/wishlist/sync
    try {
      await apiClient<void>("/wishlist/sync", {
        method: "POST",
        data: { items },
      });
    } catch {
      // Degrades gracefully to localStorage state
    }
  },
};