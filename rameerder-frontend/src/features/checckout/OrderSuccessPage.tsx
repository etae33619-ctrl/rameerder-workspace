//import React from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="min-h-[80vh] bg-brand-bg flex items-center py-16">
      <Container className="max-w-xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-brand-border text-center shadow-lg animate-in zoom-in-95 duration-500">
          
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-extrabold text-brand-navy mb-2">ORDER PLACED SUCCESSFULLY</h1>
          <p className="text-brand-muted mb-8">Thank you for your purchase. We've received your order and are preparing it for delivery.</p>

          <div className="bg-slate-50 border border-brand-border rounded-xl p-6 mb-8 text-left">
            <div className="flex justify-between items-center border-b border-brand-border pb-4 mb-4">
              <span className="text-brand-muted">Order Number:</span>
              <span className="font-bold text-brand-navy">{orderId}</span>
            </div>
            <div className="flex justify-between items-center border-b border-brand-border pb-4 mb-4">
              <span className="text-brand-muted">Status:</span>
              <span className="bg-brand-blue-light text-brand-blue px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                PENDING
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-muted">Estimated Delivery:</span>
              <span className="font-medium text-brand-navy">Check tracking for updates</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* FIXED: Removed asChild and wrapped Button inside Link */}
            <Link to="/account/orders" className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2">
                <Package className="w-5 h-5" /> TRACK ORDER
              </Button>
            </Link>
            
            <Link to="/shop" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                CONTINUE SHOPPING
              </Button>
            </Link>
          </div>

        </div>
      </Container>
    </div>
  );
}