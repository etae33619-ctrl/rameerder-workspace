// import React from "react";
import { Container } from "../../components/ui/Container";
import { Star } from "lucide-react";

export function TestimonialsPage() {
  return (
    <div className="py-16">
      <Container>
        <h1 className="text-4xl font-bold text-brand-navy text-center mb-12">What Our Customers Say</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white p-8 rounded-xl border border-brand-border shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-brand-text mb-6 italic">
                "RAMEERDER PACE GROUP transformed how we source our office supplies. Their agility and speed are truly exceptional!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div>
                  <h4 className="font-bold text-sm text-brand-navy">Customer {item}</h4>
                  <p className="text-xs text-brand-muted">Buea, Cameroon</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}