// import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";

export function AdminOrdersList() {
  const mockOrders = [
    { id: "RPG-0125", customer: "Jean-Claude Kamga", amount: 38500, payment: "MTN Mobile Money", zone: "Buea Molyko", status: "PENDING", date: "2024-09-10 10:30" },
    { id: "RPG-0124", customer: "Marie Ndongo", amount: 56000, payment: "Orange Money", zone: "Douala Bonanjo", status: "PROCESSING", date: "2024-09-09 14:15" },
    { id: "RPG-0123", customer: "Paul Biya", amount: 15000, payment: "Cash on Delivery", zone: "Yaounde Bastos", status: "SHIPPED", date: "2024-09-08 09:00" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <h1 className="text-2xl font-bold text-brand-navy">Orders Management</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <Input placeholder="Search orders..." className="w-full sm:w-64" />
          <Select options={[{label: "All Status", value: ""}, {label: "Pending", value: "PENDING"}]} />
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-brand-muted uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Delivery Zone</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {mockOrders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-brand-navy">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4 font-medium">FCFA {order.amount.toLocaleString()}</td>
                <td className="px-6 py-4"><span className="bg-slate-100 text-brand-navy px-2 py-1 rounded text-xs">{order.payment}</span></td>
                <td className="px-6 py-4">{order.zone}</td>
                <td className="px-6 py-4">
                  <Badge variant={order.status === 'PENDING' ? 'warning' : order.status === 'PROCESSING' ? 'default' : 'success'}>{order.status}</Badge>
                </td>
                <td className="px-6 py-4 text-brand-muted">{order.date}</td>
                <td className="px-6 py-4">
                  <Link to={`/admin/orders/${order.id}`} className="text-brand-blue font-semibold hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}