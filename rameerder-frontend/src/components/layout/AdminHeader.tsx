import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Bell, ChevronRight, Menu } from "lucide-react";
import { Input } from "../ui/Input";
import { useAuth } from "../../features/auth/AuthContext";

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const location = useLocation();
  const { user } = useAuth();

  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden text-brand-muted" onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </button>

        {/* Breadcrumbs */}
        <div className="hidden sm:flex items-center text-sm text-brand-muted capitalize">
          <Link to="/admin" className="hover:text-brand-blue">Admin</Link>
          {pathnames.slice(1).map((name, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className={index === pathnames.length - 2 ? "text-brand-navy font-semibold" : ""}>
                {name.replace("-", " ")}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:block w-64 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-brand-muted" />
          <Input className="pl-9 h-10 bg-slate-50 border-transparent focus:bg-white" placeholder="Search..." />
        </div>

        <button className="relative text-brand-muted hover:text-brand-navy">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-red rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-brand-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-brand-navy leading-none">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-brand-muted mt-1">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
}