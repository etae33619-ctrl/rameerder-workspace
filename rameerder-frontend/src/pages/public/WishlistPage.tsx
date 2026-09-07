//import React from "react";
import { Heart } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProductCard } from "../../components/products/ProductCard";
import { useWishlist } from "../../features/wishlist/WishlistContext";

export function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="py-12 bg-brand-bg min-h-screen">
      <Container>
        <h1 className="text-3xl font-bold text-brand-navy mb-8 flex items-center gap-3">
          <Heart className="w-8 h-8 text-brand-red fill-brand-red" />
          My Wishlist
        </h1>

        {items.length === 0 ? (
          <EmptyState 
            title="Your Wishlist is Empty" 
            description="Save items you love here and purchase them later." 
            actionLabel="Discover Products" 
            onAction={() => window.location.href = "/shop"} 
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}