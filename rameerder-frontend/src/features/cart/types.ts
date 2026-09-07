import {type  Product } from "../products/types";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}