// import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { Badge } from "../../../components/ui/Badge";

export function AdminOrderDetails() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <Link to="/admin/orders" className="text-sm font-medium text-brand-muted hover:text-brand-blue flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-navy">Order Details: {id}</h1>
        <Button>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Customer & Delivery Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 text-sm">
                <h4 className="font-bold text-brand-navy border-b border-brand-border pb-2 mb-4">Customer Info</h4>
                <div className="flex"><span className="w-32 text-brand-muted">Name:</span> <span className="font-semibold">Jean-Claude Kamga</span></div>
                <div className="flex"><span className="w-32 text-brand-muted">Phone:</span> <span>+237 600 000 000</span></div>
                <div className="flex"><span className="w-32 text-brand-muted">Email:</span> <span>jean@example.com</span></div>
              </div>
              
              <div className="space-y-2 text-sm bg-brand-blue-light/30 p-4 rounded-lg border border-brand-blue/20">
                <h4 className="font-bold text-brand-blue border-b border-brand-blue/20 pb-2 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4"/> Primary Structured Delivery
                </h4>
                <div className="flex"><span className="w-32 text-brand-muted">Zone:</span> <span className="font-semibold text-brand-navy">Buea - Molyko</span></div>
                <div className="flex"><span className="w-32 text-brand-muted">Neighborhood:</span> <span>Molyko</span></div>
                <div className="flex"><span className="w-32 text-brand-muted">Landmark:</span> <span>Opposite Molyko Pharmacy</span></div>
                <div className="flex"><span className="w-32 text-brand-muted">Street:</span> <span>University Road</span></div>
                <div className="flex"><span className="w-32 text-brand-muted">Building:</span> <span>Blue Complex</span></div>
                <div className="pt-2 mt-2 border-t border-brand-blue/20">
                  <span className="w-full text-brand-muted block mb-1">Detailed Directions:</span> 
                  <span className="italic">Take the dirt road next to the pharmacy, it's the second blue gate on the right. Call when at the gate.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-brand-muted border-b border-brand-border">
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  <tr>
                    <td className="p-3 font-medium">African Economic Horizons</td>
                    <td className="p-3 text-center">2</td>
                    <td className="p-3 text-right">FCFA 15,000</td>
                    <td className="p-3 text-right font-bold">FCFA 30,000</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Order Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase">Current Status</label>
                <Select className="mt-1" options={[
                  {label: "PENDING", value: "PENDING"},
                  {label: "PROCESSING", value: "PROCESSING"},
                  {label: "SHIPPED", value: "SHIPPED"},
                  {label: "DELIVERED", value: "DELIVERED"},
                ]} value="PENDING" />
              </div>
              <Button className="w-full">UPDATE STATUS</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Payment Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-brand-muted">Method</span><Badge variant="outline">MTN Mobile Money</Badge></div>
              <div className="flex justify-between"><span className="text-brand-muted">Subtotal</span><span>FCFA 30,000</span></div>
              <div className="flex justify-between"><span className="text-brand-muted">Delivery</span><span>FCFA 1,500</span></div>
              <div className="flex justify-between font-bold text-lg border-t border-brand-border pt-3 mt-3 text-brand-navy">
                <span>Total</span><span>FCFA 31,500</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}