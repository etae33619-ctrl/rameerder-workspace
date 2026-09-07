import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Book, PenTool, Briefcase, Paperclip, Package, Lightbulb, Truck, Car, Globe, Zap, Timer, ShieldCheck, Star } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";
//import { ProductCard } from "../../components/products/ProductCard";
import { MOCK_SERVICES } from "../../services/mock/data";
import { productsApi } from "../../features/products/api/products.api";
import {  type Product } from "../../features/products/types";
import { ProductCard } from "@/features/products/ProductCard";

export function CustomerHome() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    productsApi.getProducts({ sort: "featured", limit: 4 })
      .then(res => setFeaturedProducts(res.data || []))
      .catch(err => console.error("Failed to load featured products:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-brand-blue-light py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-navy leading-tight">
                Your Trusted Partner for <br/>
                <span className="text-brand-blue">Products & Services</span>
              </h1>
              <p className="text-lg text-brand-muted max-w-lg">
                Books, stationery, logistics, consultancy and sourcing — delivered with speed, convenience and exceptional customer experience.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {/* FIXED: Wrapped Button inside Link instead of using asChild */}
                <Link to="/shop">
                  <Button size="lg">SHOP NOW</Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg">EXPLORE SERVICES</Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="relative w-full max-w-md aspect-square bg-white rounded-3xl shadow-xl flex items-center justify-center p-8">
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                  <div className="bg-blue-100 rounded-xl flex items-center justify-center"><Book className="w-12 h-12 text-brand-blue" /></div>
                  <div className="bg-red-100 rounded-xl flex items-center justify-center"><Truck className="w-12 h-12 text-brand-red" /></div>
                  <div className="bg-slate-100 rounded-xl flex items-center justify-center"><Lightbulb className="w-12 h-12 text-brand-navy" /></div>
                  <div className="bg-green-100 rounded-xl flex items-center justify-center"><PenTool className="w-12 h-12 text-green-600" /></div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Shop By Category */}
      <section>
        <Container>
          <h2 className="text-2xl font-bold text-center text-brand-navy mb-8">SHOP BY CATEGORY</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Books", icon: Book },
              { name: "Stationery", icon: PenTool },
              { name: "School Supplies", icon: Package },
              { name: "Office Supplies", icon: Briefcase },
              { name: "Accessories", icon: Paperclip }
            ].map((cat, i) => (
              <Link key={i} to="/shop" className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-brand-border hover:border-brand-blue hover:shadow-md transition-all group">
                <cat.icon className="w-8 h-8 text-brand-muted group-hover:text-brand-blue mb-3 transition-colors" />
                <span className="font-semibold text-sm text-brand-navy text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      <section>
        <Container>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-brand-navy">FEATURED PRODUCTS</h2>
            <Link to="/shop" className="text-sm font-semibold text-brand-blue hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-50 rounded-xl border border-brand-border animate-pulse"></div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-brand-muted bg-white border border-brand-border rounded-xl">
                No featured products found.
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16 border-y border-brand-border">
        <Container>
          <h2 className="text-2xl font-bold text-center text-brand-navy mb-12">OUR SERVICES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_SERVICES.map((service, i) => {
              const icons: Record<string, React.ElementType> = { Lightbulb, Truck, Car, Globe };
              const Icon = icons[service.icon] || Lightbulb;
              return (
                <div key={i} className="text-center">
                  <div className="mx-auto w-16 h-16 bg-brand-blue-light rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-brand-blue" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy mb-2">{service.title}</h3>
                  <p className="text-brand-muted text-sm">{service.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
      
      {/* Why Choose Us */}
      <section>
        <Container>
          <h2 className="text-2xl font-bold text-center text-brand-navy mb-12">WHY CHOOSE US</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Agility", desc: "We adapt quickly to meet your unique needs.", icon: Zap },
              { title: "Speed", desc: "Fast processing and timely deliveries.", icon: Timer },
              { title: "Honesty", desc: "Transparent pricing and trustworthy operations.", icon: ShieldCheck },
              { title: "Wow Experience", desc: "Exceptional customer service every time.", icon: Star }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
                <feature.icon className="w-8 h-8 text-brand-red mb-4" />
                <h3 className="text-lg font-bold text-brand-navy mb-2">{feature.title}</h3>
                <p className="text-brand-muted text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}