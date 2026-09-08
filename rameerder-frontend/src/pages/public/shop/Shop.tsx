import React, { useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import { Container } from "../../../components/ui/Container";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { LoadingState } from "../../../components/ui/LoadingState";
//import { ProductCard } from "../../../components/products/ProductCard";
import { ProductCard } from "@/features/products/ProductCard";
import { productsApi } from "../../../features/products/api/products.api";
import { categoriesApi } from "../../../features/products/api/categories.api";
import { brandsApi } from "../../../features/products/api/brands.api";
import {type Product, type Category, type Brand,type  ProductQueryParams } from "@/features/products/types";

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [params, setParams] = useState<ProductQueryParams>({
    page: 1,
    sort: "featured",
  });

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    Promise.all([categoriesApi.getCategories(), brandsApi.getBrands()])
      .then(([cats, brnds]) => {
        setCategories(cats);
        setBrands(brnds);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    productsApi.getProducts(params)
      .then((res) => {
        setProducts(res.data);
        setTotalPages(res.totalPages);
        setTotalItems(res.total);
      })
      .finally(() => setIsLoading(false));
  }, [params]);

  const updateParam = (key: keyof ProductQueryParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParam("search", e.target.value);
  };

  return (
    <div className="py-8 bg-brand-bg min-h-screen">
      <Container>
        {/* Breadcrumb & Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Shop Products</h1>
            <p className="text-sm text-brand-muted mt-1">Showing {products.length} of {totalItems} results</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
              <Input 
                className="pl-9" 
                placeholder="Search products..." 
                value={params.search || ""} 
                onChange={handleSearch}
              />
            </div>
            <Button 
              variant="outline" 
              className="md:hidden" 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <div className="hidden md:block w-48">
              <Select
                options={[
                  { label: "Sort by: Featured", value: "featured" },
                  { label: "Newest Arrivals", value: "newest" },
                  { label: "Price: Low to High", value: "price_asc" },
                  { label: "Price: High to Low", value: "price_desc" },
                  { label: "Highest Rated", value: "rating" },
                ]}
                value={params.sort}
                onChange={(e) => updateParam("sort", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`md:w-64 flex-shrink-0 space-y-8 ${isMobileFiltersOpen ? "block" : "hidden md:block"}`}>
            {/* Categories */}
            <div>
              <h3 className="font-bold text-brand-navy mb-4">Categories</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => updateParam("categoryId", undefined)}
                  className={`block text-sm text-left w-full ${!params.categoryId ? "text-brand-blue font-semibold" : "text-brand-muted hover:text-brand-navy"}`}
                >
                  All Categories
                </button>
                {categories.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => updateParam("categoryId", c.id)}
                    className={`block text-sm text-left w-full flex justify-between ${params.categoryId === c.id ? "text-brand-blue font-semibold" : "text-brand-muted hover:text-brand-navy"}`}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{c.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-bold text-brand-navy mb-4">Brands</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => updateParam("brandId", undefined)}
                  className={`block text-sm text-left w-full ${!params.brandId ? "text-brand-blue font-semibold" : "text-brand-muted hover:text-brand-navy"}`}
                >
                  All Brands
                </button>
                {brands.map(b => (
                  <button 
                    key={b.id} 
                    onClick={() => updateParam("brandId", b.id)}
                    className={`block text-sm text-left w-full flex justify-between ${params.brandId === b.id ? "text-brand-blue font-semibold" : "text-brand-muted hover:text-brand-navy"}`}
                  >
                    <span>{b.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-bold text-brand-navy mb-4">Availability</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={params.inStock || false} 
                  onChange={(e) => updateParam("inStock", e.target.checked ? true : undefined)}
                  className="rounded border-brand-border text-brand-blue focus:ring-brand-blue"
                />
                <span className="text-sm text-brand-muted">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {isLoading ? (
              <LoadingState message="Loading products..." />
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-brand-border">
                <p className="text-brand-muted">No products found matching your filters.</p>
                <Button variant="outline" className="mt-4" onClick={() => setParams({ page: 1, sort: "featured" })}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      disabled={params.page === 1}
                      onClick={() => setParams(p => ({ ...p, page: (p.page || 1) - 1 }))}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm font-medium text-brand-navy">
                      Page {params.page} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      disabled={params.page === totalPages}
                      onClick={() => setParams(p => ({ ...p, page: (p.page || 1) + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}