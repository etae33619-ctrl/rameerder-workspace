// import React from "react";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

export function AdminDeliveryZones() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-navy">Delivery Zones</h1>
        <Button className="gap-2"><Plus className="w-4 h-4"/> ADD DELIVERY ZONE</Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-brand-muted uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Zone Name</th>
              <th className="px-6 py-4">Delivery Fee</th>
              <th className="px-6 py-4">Estimated Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-brand-navy">Buea - Molyko</td>
              <td className="px-6 py-4 font-medium">FCFA 1,000</td>
              <td className="px-6 py-4 text-brand-muted">30-45 Minutes</td>
              <td className="px-6 py-4"><Badge variant="success">Active</Badge></td>
              <td className="px-6 py-4 text-brand-blue cursor-pointer hover:underline">Edit</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-brand-navy">Douala - Bonanjo</td>
              <td className="px-6 py-4 font-medium">FCFA 3,500</td>
              <td className="px-6 py-4 text-brand-muted">1-2 Days</td>
              <td className="px-6 py-4"><Badge variant="success">Active</Badge></td>
              <td className="px-6 py-4 text-brand-blue cursor-pointer hover:underline">Edit</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}