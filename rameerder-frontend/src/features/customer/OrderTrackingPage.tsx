//import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, MapPin, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { cn } from "../../utils/cn";

export function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();

  const currentStatusIndex = 2; // Mock: 0=Pending, 1=Processing, 2=Shipped, 3=Delivered
  const steps = ["Order Placed", "Processing", "Shipped", "Delivered"];

  return (
    <div className="space-y-6 animate-in fade-in">
      <Link to="/account/orders" className="text-sm font-medium text-brand-muted hover:text-brand-blue flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>
      
      <h1 className="text-2xl font-bold text-brand-navy flex items-center gap-3">
        <Truck className="w-6 h-6 text-brand-blue" /> Tracking Order {id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-4 space-y-8 mt-4 border-l-2 border-brand-border ml-2">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                return (
                  <div key={idx} className="relative pl-6">
                    <div className={cn(
                      "absolute -left-[33px] w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm",
                      isCompleted ? "bg-brand-blue text-white" : "bg-slate-200 text-transparent"
                    )}>
                      {isCompleted && <CheckCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className={cn("font-bold", isCurrent ? "text-brand-blue" : isCompleted ? "text-brand-navy" : "text-brand-muted")}>
                        {step}
                      </h4>
                      {isCurrent && <p className="text-sm text-brand-muted mt-1">Your package is currently in this stage.</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Structured Delivery Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-brand-border bg-brand-blue-light/50">
              <CardTitle className="text-brand-blue flex items-center gap-2"><MapPin className="w-5 h-5"/> Customer Provided Manual Info</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4 text-sm text-brand-text">
                <li className="grid grid-cols-3"><span className="font-semibold text-brand-navy">Delivery Zone</span> <span className="col-span-2">Buea - Molyko</span></li>
                <li className="grid grid-cols-3"><span className="font-semibold text-brand-navy">Neighborhood</span> <span className="col-span-2">Molyko</span></li>
                <li className="grid grid-cols-3"><span className="font-semibold text-brand-navy">Landmark</span> <span className="col-span-2">Opposite Molyko Pharmacy</span></li>
                <li className="grid grid-cols-3"><span className="font-semibold text-brand-navy">Street</span> <span className="col-span-2">University Road</span></li>
                <li className="grid grid-cols-3"><span className="font-semibold text-brand-navy">Building</span> <span className="col-span-2">Blue Complex, Apt 4</span></li>
                <li className="pt-4 border-t border-brand-border">
                  <span className="font-semibold text-brand-navy block mb-1">Detailed Directions</span>
                  <p className="italic text-brand-muted">Take the dirt road next to the pharmacy, it's the second blue gate on the right.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-brand-navy text-sm mb-2">Optional Delivery Map</h4>
              <div className="h-48 bg-slate-200 rounded-lg flex items-center justify-center border border-slate-300">
                 <span className="text-brand-muted text-sm flex items-center gap-2"><MapPin className="w-4 h-4"/> Manual map info placeholder</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}