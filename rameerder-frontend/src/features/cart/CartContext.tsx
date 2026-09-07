import React, { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from "react";
import { type CartItem, type CartSummary } from "./types";
import {type  Product } from "../products/types";
import { cartApi } from "./cart.api";

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  summary: CartSummary;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    cartApi.fetchCart().then(data => {
      setItems(data);
      setIsLoading(false);
    });
  }, []);

  // Sync to persistence whenever items change
  useEffect(() => {
    if (!isLoading) {
      cartApi.syncCart(items);
    }
  }, [items, isLoading]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { id: `${Date.now()}_${product.id}`, product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const safeQty = Math.max(1, Math.min(quantity, item.product.stock));
        return { ...item, quantity: safeQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const summary = useMemo(() => {
    let subtotal = 0;
    let originalTotal = 0;

    items.forEach(item => {
      const price = item.product.discountPrice || item.product.price;
      subtotal += price * item.quantity;
      originalTotal += item.product.price * item.quantity;
    });

    const discount = originalTotal - subtotal;
    const deliveryFee = items.length > 0 ? 2000 : 0; // Placeholder 2000 FCFA fee
    const total = subtotal + deliveryFee;

    return { subtotal, discount, deliveryFee, total };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, isLoading, addToCart, removeFromCart, updateQuantity, clearCart, summary }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};