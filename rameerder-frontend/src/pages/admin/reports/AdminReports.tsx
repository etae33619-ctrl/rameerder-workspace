// import React from "react";
import { BarChart3, LineChart, PieChart, Users, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export function AdminReports() {
  const reportTypes = [
    { name: "Sales & Revenue", desc: "Detailed breakdown of sales and revenue growth.", icon: LineChart },
    { name: "Order Analytics", desc: "Order volume, fulfillment times, and zone mapping.", icon: ShoppingBag },
    { name: "Customer Insights", desc: "Customer acquisition and retention rates.", icon: Users },
    { name: "Inventory Health", desc: "Stock levels, fast-moving items, and low stock alerts.", icon: PieChart },
    { name: "Financial Reports", desc: "Tax, discounts, and delivery fee collections.", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((rt, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="w-10 h-10 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center">
                <rt.icon className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">{rt.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-brand-muted mb-4">{rt.desc}</p>
              <Button variant="outline" className="w-full">Generate Report</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}