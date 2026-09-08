import { apiClient } from "../../../services/api/client";
import { type Product, type ProductQueryParams, type PaginatedProducts, type Review } from "../types";
import { MOCK_PRODUCTS, MOCK_REVIEWS } from "../../../services/mock/shop.data";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const productsApi = {
  async getProducts(params: ProductQueryParams): Promise<PaginatedProducts> {
    if (USE_MOCK) {
      await delay(400);
      let filtered = [...MOCK_PRODUCTS];

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }
      if (params.categoryId) filtered = filtered.filter((p) => p.categoryId === params.categoryId);
      if (params.brandId) filtered = filtered.filter((p) => p.brandId === params.brandId);
      if (params.minPrice) filtered = filtered.filter((p) => (p.discountPrice || p.price) >= params.minPrice!);
      if (params.maxPrice) filtered = filtered.filter((p) => (p.discountPrice || p.price) <= params.maxPrice!);
      if (params.inStock) filtered = filtered.filter((p) => p.stock > 0);

      switch (params.sort) {
        case "price_asc":
          filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
          break;
        case "price_desc":
          filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          filtered.sort((a, b) => (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0));
          break;
        default:
          filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }

      const page = params.page || 1;
      const limit = params.limit || 12;
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return { data, total, page, totalPages };
    }

    // Connects to FastAPI endpoint GET /api/products
    return await apiClient<PaginatedProducts>("/products", {
      params: {
        search: params.search,
        category_id: params.categoryId,
        brand_id: params.brandId,
        min_price: params.minPrice,
        max_price: params.maxPrice,
        sort: params.sort,
        page: params.page,
        limit: params.limit,
        in_stock: params.inStock,
      },
    });
  },

  async getProductById(id: string): Promise<Product> {
    if (USE_MOCK) {
      await delay(300);
      const product = MOCK_PRODUCTS.find((p) => p.id === id);
      if (!product) throw new Error("Product not found");
      return product;
    }

    // Connects to FastAPI endpoint GET /api/products/{id}
    return await apiClient<Product>(`/products/${id}`);
  },

  async getProductReviews(productId: string): Promise<Review[]> {
    if (USE_MOCK) {
      await delay(200);
      return MOCK_REVIEWS.filter((r) => r.productId === productId);
    }

    // Connects to FastAPI endpoint GET /api/products/{id}/reviews
    return await apiClient<Review[]>(`/products/${productId}/reviews`);
  },
};