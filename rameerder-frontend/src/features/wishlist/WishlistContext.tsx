import  { createContext, useContext, useState, useEffect, type  ReactNode } from "react";
import {type  WishlistItem } from "./types";
import { type Product } from "../products/types";
import { wishlistApi } from "./wishlist.api";

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    wishlistApi.fetchWishlist().then(data => {
      setItems(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      wishlistApi.syncWishlist(items);
    }
  }, [items, isLoading]);

  const toggleWishlist = (product: Product) => {
    setItems(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.filter(item => item.product.id !== product.id);
      }
      return [...prev, { id: `${Date.now()}_${product.id}`, product, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ items, isLoading, toggleWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};