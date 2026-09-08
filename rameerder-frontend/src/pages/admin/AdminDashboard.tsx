import  { useEffect, useState } from "react";
import { TrendingUp, Users, ShoppingCart, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { LoadingState } from "../../components/ui/LoadingState";
import { adminApi } from "../../features/admin/admin.api";
import { type AdminStatOverview } from "../../features/admin/types";
import { cn } from "../../utils/cn";

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStatOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardStats().then(s => {
      setStats(s);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <LoadingState />;

  const formatPrice = (price: number) => `FCFA ${(price / 1000000).toFixed(1)}M`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-brand-navy">Welcome Back, Admin</h1>
        <Badge variant="outline">Today</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Revenue", value: formatPrice(stats?.totalRevenue || 0), growth: `+${stats?.revenueGrowth}% MoM`, icon: TrendingUp, color: "text-brand-blue", bg: "bg-brand-blue-light" },
          { title: "Total Orders", value: stats?.totalOrders, growth: `+${stats?.ordersGrowth}% MoM`, icon: ShoppingCart, color: "text-indigo-600", bg: "bg-indigo-100" },
          { title: "Customers", value: `${(stats?.customers || 0) / 1000}K`, growth: "+2% MoM", icon: Users, color: "text-green-600", bg: "bg-green-100" },
          { title: "Products", value: stats?.products, growth: "Active", icon: Package, color: "text-orange-600", bg: "bg-orange-100" },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-brand-muted">{kpi.title}</p>
                  <h3 className="text-2xl font-bold text-brand-navy mt-1">{kpi.value}</h3>
                  <p className="text-xs text-green-600 font-semibold mt-1">{kpi.growth}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", kpi.bg, kpi.color)}>
                  <kpi.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Chart Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 border-b border-brand-border pb-4">
              {[40, 60, 45, 80, 55, 90, 75, 100, 85, 60, 110, 95].map((h, i) => (
                <div key={i} className="w-full bg-brand-blue-light rounded-t-sm hover:bg-brand-blue transition-colors relative group" style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Data: {h}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-brand-muted">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </CardContent>
        </Card>

        {/* Mock Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4">
            <div className="w-40 h-40 rounded-full border-[16px] border-brand-blue border-r-green-500 border-b-yellow-400 border-l-red-500 mb-6"></div>
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between"><span className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-blue rounded-full"></div> Books</span><span className="font-semibold">45%</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Stationery</span><span className="font-semibold">25%</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded-full"></div> Logistics</span><span className="font-semibold">20%</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}