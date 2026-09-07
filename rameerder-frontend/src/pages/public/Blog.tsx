// import React from "react";
import { Container } from "../../components/ui/Container";

export function Blog() {
  return (
    <div className="py-16">
      <Container>
        <h1 className="text-4xl font-bold text-brand-navy text-center mb-12">Latest Insights</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-sm">
              <div className="h-48 bg-slate-200"></div>
              <div className="p-6">
                <p className="text-xs text-brand-muted mb-2">September 1, 2026</p>
                <h3 className="text-lg font-bold text-brand-navy mb-3">Navigating Cameroon's Digital Commerce Landscape</h3>
                <p className="text-sm text-brand-muted line-clamp-3">
                  Discover the latest trends in e-commerce, logistics, and supply chain management across the region...
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}