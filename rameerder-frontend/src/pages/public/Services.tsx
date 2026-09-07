//import React from "react";
import { Container } from "../../components/ui/Container";
import { MOCK_SERVICES } from "../../services/mock/data";

export function Services() {
  return (
    <div className="py-16 bg-brand-bg">
      <Container>
        <h1 className="text-4xl font-bold text-brand-navy text-center mb-12">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {MOCK_SERVICES.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-xl border border-brand-border shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-brand-blue mb-4">{service.title}</h2>
              <p className="text-brand-muted">{service.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}