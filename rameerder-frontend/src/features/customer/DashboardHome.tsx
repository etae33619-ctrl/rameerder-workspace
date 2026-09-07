import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Clock, CheckCircle, Heart, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { LoadingState } from "../../components/ui/LoadingState";
import { customerApi } from "../../features/customer/customer.api";
import { useWishlist } from "../../features/wishlist/WishlistContext";
import { type OrderSummary } from "../../features/customer/types";

export function DashboardHome() {
  const { items: wishlistItems } = useWishlist();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      customerApi.getDashboardStats(),
      customerApi.getRecentOrders()
    ]).then(([s, o]) => {
      setStats(s);
      setOrders(o);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <LoadingState message="Loading your dashboard..." />;

  const statusColors: Record<string, "warning" | "default" | "success" | "danger"> = {
    PENDING: "warning",
    PROCESSING: "default",
    SHIPPED: "default",
    DELIVERED: "success",
    CANCELLED: "danger"
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-brand-navy">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-brand-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-blue-light flex items-center justify-center text-brand-blue">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-brand-muted font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-brand-navy">{stats?.totalOrders}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-brand-muted font-medium">Pending Orders</p>
              <p className="text-2xl font-bold text-brand-navy">{stats?.pendingOrders}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-brand-muted font-medium">Completed</p>
              <p className="text-2xl font-bold text-brand-navy">{stats?.completedOrders}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-red-light flex items-center justify-center text-brand-red">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-brand-muted font-medium">Wishlist Items</p>
              <p className="text-2xl font-bold text-brand-navy">{wishlistItems.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-brand-border pb-4">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <Link to="/account/orders" className="text-sm font-medium text-brand-blue flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-brand-muted">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Items</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-navy">{order.id}</td>
                  <td className="px-6 py-4 text-brand-text">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-brand-text">{order.itemCount}</td>
                  <td className="px-6 py-4 font-medium text-brand-navy">FCFA {order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/account/orders/${order.id}`} className="text-brand-blue hover:underline font-medium">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}