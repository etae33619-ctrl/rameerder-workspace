import { apiClient } from "../../../services/api/client";
import { type Brand } from "../types";
import { MOCK_BRANDS } from "../../../services/mock/shop.data";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const brandsApi = {
  async getBrands(): Promise<Brand[]> {
    if (USE_MOCK) {
      return MOCK_BRANDS;
    }

    // Connects to FastAPI endpoint GET /api/brands
    return await apiClient<Brand[]>("/brands");
  },
};