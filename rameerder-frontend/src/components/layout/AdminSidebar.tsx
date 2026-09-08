//import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Package, Tags, Briefcase,
  Layers, MapPin, Users, UserCog, Shield, Lock, CreditCard,
  Bell, FileText, BarChart3, Activity, Settings
} from "lucide-react";
import { cn } from "../../utils/cn";

export function AdminSidebar() {
  const location = useLocation();

  const navGroups = [
    {
      title: "CORE",
      items: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
      ]
    },
    {
      title: "CATALOG",
      items: [
        { name: "Products", path: "/admin/products", icon: Package },
        { name: "Categories", path: "/admin/categories", icon: Layers },
        { name: "Brands", path: "/admin/brands", icon: Tags },
        { name: "Inventory", path: "/admin/inventory", icon: Briefcase },
      ]
    },
    {
      title: "LOGISTICS & USERS",
      items: [
        { name: "Delivery Zones", path: "/admin/delivery-zones", icon: MapPin },
        { name: "Customers", path: "/admin/customers", icon: Users },
        { name: "Employees", path: "/admin/employees", icon: UserCog },
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { name: "Roles", path: "/admin/roles", icon: Shield },
        { name: "Permissions", path: "/admin/permissions", icon: Lock },
        { name: "Payments", path: "/admin/payments", icon: CreditCard },
        { name: "Notifications", path: "/admin/notifications", icon: Bell },
        { name: "Content", path: "/admin/content", icon: FileText },
        { name: "Reports", path: "/admin/reports", icon: BarChart3 },
        { name: "Audit Logs", path: "/admin/audit-logs", icon: Activity },
        { name: "Settings", path: "/admin/settings", icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-brand-navy text-slate-300 flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-brand-navy sticky top-0 z-10">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="text-brand-blue text-2xl font-black">R</span>
          <span className="text-white font-bold tracking-wide text-sm">ADMIN PORTAL</span>
        </Link>
      </div>

      <div className="flex-1 py-4">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <nav className="space-y-1 px-3">
              {group.items.map(item => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-brand-blue text-white" : "hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}