import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, Truck, Heart, MapPin, 
  Bell, User, Settings, LogOut, Menu, X 
} from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";
import { cn } from "../../utils/cn";

export function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/account", icon: LayoutDashboard },
    { name: "Orders", path: "/account/orders", icon: ShoppingBag },
    { name: "Order Tracking", path: "/account/track", icon: Truck },
    { name: "Wishlist", path: "/wishlist", icon: Heart }, // Points to public wishlist
    { name: "Addresses", path: "/account/addresses", icon: MapPin },
    { name: "Notifications", path: "/account/notifications", icon: Bell },
    { name: "Profile", path: "/account/profile", icon: User },
    { name: "Settings", path: "/account/settings", icon: Settings },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/account' && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-brand-blue text-white" 
                : "text-brand-text hover:bg-slate-100 hover:text-brand-blue"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-brand-red hover:bg-brand-red-light transition-colors w-full text-left mt-4"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-brand-border p-4 sticky top-0 z-20">
        <span className="font-bold text-brand-navy">My Account</span>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-brand-text">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-brand-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-brand-border flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-brand-navy flex items-center gap-2">
            <span className="text-brand-blue text-2xl font-black">R</span>
            PACE GROUP
          </Link>
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-brand-muted"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="p-6 border-b border-brand-border bg-slate-50">
          <p className="text-sm text-brand-muted mb-1">Welcome back,</p>
          <p className="font-bold text-brand-navy truncate">{user?.firstName} {user?.lastName}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <NavLinks />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}
    </div>
  );
}