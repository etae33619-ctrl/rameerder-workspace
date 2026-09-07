// import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { type Product } from "@/features/products/types";
import { MOCK_BRANDS } from "@/services/mock/shop.data";


interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => `FCFA ${price.toLocaleString()}`;
  const brandName = MOCK_BRANDS.find(b => b.id === product.brandId)?.name || "Unknown Brand";

  //const imageUrl = product.images?.[0] || "https://via.placeholder.com/300";
  //const ratingValue = product.rating ?? 0;

  return (
    <div className="group relative flex flex-col rounded-xl border border-brand-border bg-white p-4 shadow-sm transition-all hover:shadow-md">
      {/* Badges */}
      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
        {product.discountPrice && <Badge variant="danger" className="font-bold">SALE</Badge>}
        {product.isNew && <Badge variant="success" className="font-bold">NEW</Badge>}
      </div>

      {/* Wishlist Button */}
      <button className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-brand-muted shadow-sm transition-colors hover:text-brand-red focus:outline-none">
        <Heart className="h-5 w-5" />
      </button>

      {/* Image */}
      <Link to={`/shop/${product.id}`} className="mb-4 block">
        <div className={cn("aspect-square w-full rounded-lg object-cover transition-transform group-hover:scale-105", product.images[0] || "bg-slate-100")}></div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-muted">
          {brandName}
        </span>
        <Link to={`/shop/${product.id}`}>
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-brand-navy hover:text-brand-blue">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("h-4 w-4", i < Math.floor(product.rating) ? "fill-current" : "fill-transparent text-gray-300")} />
            ))}
          </div>
          <span className="text-xs text-brand-muted">({product.reviewsCount})</span>
        </div>

        {/* Price & Actions */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-brand-navy">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-brand-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <Button 
            className="w-full gap-2" 
            disabled={product.stock === 0}
            variant={product.stock === 0 ? "secondary" : "primary"}
          >
            {product.stock === 0 ? (
              "OUT OF STOCK"
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" /> ADD TO CART
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}