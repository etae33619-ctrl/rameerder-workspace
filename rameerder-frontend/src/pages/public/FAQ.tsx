// import React from "react";
import { Container } from "../../components/ui/Container";

export function FAQ() {
  return (
    <div className="py-16">
      <Container>
        <h1 className="text-4xl font-bold text-brand-navy text-center mb-12">Frequently Asked Questions</h1>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: "How long does delivery take?", a: "Delivery typically takes between 1-3 business days depending on your zone." },
            { q: "What payment methods do you accept?", a: "We accept MTN Mobile Money, Orange Money, Credit/Debit Cards, and Cash on Delivery." },
            { q: "Can you source custom products?", a: "Yes, our sourcing service specializes in finding specific products based on your requirements." }
          ].map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-brand-border">
              <h3 className="text-lg font-bold text-brand-navy mb-2">{faq.q}</h3>
              <p className="text-brand-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}