import { apiClient } from "../../../services/api/client";
import { type Category } from "../types";
import { MOCK_CATEGORIES } from "../../../services/mock/shop.data";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    if (USE_MOCK) {
      return MOCK_CATEGORIES;
    }

    // Connects to FastAPI endpoint GET /api/categories
    return await apiClient<Category[]>("/categories");
  },
};