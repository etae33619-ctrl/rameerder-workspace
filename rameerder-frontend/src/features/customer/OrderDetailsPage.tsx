// import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();

  // Using static placeholder data mimicking a fetched order
  return (
    <div className="space-y-6 animate-in fade-in">
      <Link to="/account/orders" className="text-sm font-medium text-brand-muted hover:text-brand-blue flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand-navy">Order {id}</h1>
        <Link to={`/account/track/${id}`}>
          <Button variant="outline" className="gap-2"><Package className="w-4 h-4"/> Track Delivery</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="p-4 border-b border-brand-border bg-slate-50 font-semibold text-brand-navy">Order Items</div>
            <CardContent className="p-0">
              <ul className="divide-y divide-brand-border">
                {[1, 2].map((i) => (
                  <li key={i} className="p-4 flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-md"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-brand-navy">Mock Product Name {i}</p>
                      <p className="text-sm text-brand-muted">Qty: 1</p>
                    </div>
                    <div className="font-bold text-brand-navy">FCFA 15,000</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="p-4 border-b border-brand-border bg-slate-50 font-semibold text-brand-navy">Payment Summary</div>
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-brand-muted">Subtotal</span><span className="font-medium">FCFA 30,000</span></div>
              <div className="flex justify-between"><span className="text-brand-muted">Delivery Fee</span><span className="font-medium">FCFA 1,500</span></div>
              <div className="flex justify-between border-t border-brand-border pt-3 mt-3">
                <span className="font-bold text-brand-navy text-base">Total</span>
                <span className="font-black text-brand-blue text-base">FCFA 31,500</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}