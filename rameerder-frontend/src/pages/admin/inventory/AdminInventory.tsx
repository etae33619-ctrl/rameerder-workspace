//import React from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

export function AdminInventory() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Inventory Management</h1>
      
      <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-brand-muted uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4 text-center">Current Stock</th>
              <th className="px-6 py-4 text-center">Reserved (Orders)</th>
              <th className="px-6 py-4 text-center">Available Stock</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {[1, 2, 3].map(i => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-brand-navy">Product {i}</td>
                <td className="px-6 py-4 text-brand-muted">SKU-{i}000</td>
                <td className="px-6 py-4 text-center font-medium">150</td>
                <td className="px-6 py-4 text-center text-brand-red font-medium">20</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">130</td>
                <td className="px-6 py-4"><Badge variant="success">In Stock</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}