import {type  Product } from "../products/types";

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}