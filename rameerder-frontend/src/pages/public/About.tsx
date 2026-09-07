//import React from "react";
import { Container } from "../../components/ui/Container";

export function About() {
  return (
    <div className="py-16">
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-brand-navy text-center mb-8">About Us</h1>
          <div className="bg-white p-8 rounded-xl border border-brand-border shadow-sm space-y-6">
            <p className="text-brand-text leading-relaxed">
              RAMEERDER PACE GROUP is a premium Cameroon-based business dedicated to bridging the gap between quality products and exceptional service delivery. 
            </p>
            <p className="text-brand-text leading-relaxed">
              Our core values are Agility, Speed, Honesty, and providing an exceptional "Wow Factor" customer experience. Whether you are looking for academic materials, office supplies, or comprehensive logistics and consultancy solutions, we are equipped to serve you.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}