// import React from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";

export function AdminCustomersList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Customers</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-brand-muted uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4 text-center">Orders</th>
              <th className="px-6 py-4 text-right">Total Spent</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-brand-navy">Jean-Claude Kamga</td>
              <td className="px-6 py-4 text-brand-muted">jean@example.com</td>
              <td className="px-6 py-4">+237 600 000 000</td>
              <td className="px-6 py-4 text-center font-bold">12</td>
              <td className="px-6 py-4 text-right font-medium text-brand-navy">FCFA 450,000</td>
              <td className="px-6 py-4"><Badge variant="success">Active</Badge></td>
              <td className="px-6 py-4"><Button variant="outline" size="sm">View</Button></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}