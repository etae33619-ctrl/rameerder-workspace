// import React from "react";
import { Container } from "../../components/ui/Container";
import { ProductCard } from "../../components/products/ProductCard";
import { MOCK_PRODUCTS } from "../../services/mock/data";

export function ShopPreview() {
  return (
    <div className="py-12 bg-brand-bg">
      <Container>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-brand-navy">Shop Products</h1>
          <div className="flex gap-4">
             {/* Placeholders for Phase 4 Filter/Sort */}
             <select className="px-3 py-2 border border-brand-border rounded-md bg-white text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
             </select>
          </div>
        </div>
        
        {/* We reuse MOCK_PRODUCTS and duplicate them to simulate a full grid for Phase 2 Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...MOCK_PRODUCTS, ...MOCK_PRODUCTS].map((product, idx) => (
            <ProductCard key={`${product.id}-${idx}`} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}