// import React from "react";
import { Container } from "../../components/ui/Container";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";

export function Contact() {
  return (
    <div className="py-16">
      <Container>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-brand-navy text-center mb-4">Contact Us</h1>
          <p className="text-center text-brand-muted mb-12">We'd love to hear from you. Send us a message below.</p>
          
          <form className="bg-white p-8 rounded-xl border border-brand-border shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" placeholder="John Doe" />
              <Input label="Email Address" type="email" placeholder="john@example.com" />
            </div>
            <Input label="Subject" placeholder="How can we help?" />
            <Textarea label="Message" placeholder="Write your message here..." rows={5} />
            <Button size="lg" className="w-full">SEND MESSAGE</Button>
          </form>
        </div>
      </Container>
    </div>
  );
}