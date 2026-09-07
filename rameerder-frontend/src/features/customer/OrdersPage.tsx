import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card} from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { LoadingState } from "../../components/ui/LoadingState";
import { customerApi } from "../../features/customer/customer.api";
import { type OrderSummary } from "../../features/customer/types";

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    customerApi.getRecentOrders().then(o => {
      setOrders(o);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <LoadingState />;

  const statusColors: Record<string, "warning" | "default" | "success" | "danger"> = {
    PENDING: "warning", PROCESSING: "default", SHIPPED: "default", DELIVERED: "success", CANCELLED: "danger"
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <h1 className="text-2xl font-bold text-brand-navy">My Orders</h1>
      <Card>
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
                <tr key={order.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-brand-navy">{order.id}</td>
                  <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{order.itemCount}</td>
                  <td className="px-6 py-4 font-medium text-brand-navy">FCFA {order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <Link to={`/account/orders/${order.id}`} className="text-brand-blue hover:underline font-medium">Details</Link>
                    <Link to={`/account/track/${order.id}`} className="text-brand-blue hover:underline font-medium">Track</Link>
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