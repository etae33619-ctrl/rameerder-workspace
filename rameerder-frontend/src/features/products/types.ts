
export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
  categoryId: string;
  brandId?: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?:
    | "featured"
    | "newest"
    | "price_asc"
    | "price_desc"
    | "rating";
  page?: number;
  limit?: number;
  inStock?: boolean;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
}

