//import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

export function AdminProductsList() {
  const products = [
    { id: "p1", name: "African Economic Horizons", sku: "BOK-AEH-001", category: "Books", price: 25000, stock: 45, status: "Active" },
    { id: "p2", name: "Premium Paper Ream", sku: "STA-PPR-500", category: "Stationery", price: 11000, stock: 0, status: "Out of Stock" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-navy">Products</h1>
        <Link to="/admin/products/new">
          <Button className="gap-2"><Plus className="w-4 h-4"/> ADD PRODUCT</Button>
        </Link>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-brand-muted uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><div className="w-10 h-10 bg-slate-200 rounded"></div></td>
                <td className="px-6 py-4 font-bold text-brand-navy">{p.name}</td>
                <td className="px-6 py-4 text-brand-muted">{p.sku}</td>
                <td className="px-6 py-4">{p.category}</td>
                <td className="px-6 py-4 font-medium">FCFA {p.price.toLocaleString()}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4">
                  <Badge variant={p.stock > 0 ? 'success' : 'danger'}>{p.status}</Badge>
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <Link to={`/admin/products/${p.id}/edit`} className="text-brand-blue hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}