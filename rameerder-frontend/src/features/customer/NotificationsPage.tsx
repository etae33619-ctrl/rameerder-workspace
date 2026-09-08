import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { LoadingState } from "../../components/ui/LoadingState";
import { customerApi } from "../../features/customer/customer.api";
import { type Notification } from "../../features/customer/types";
import { cn } from "../../utils/cn";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    customerApi.getNotifications().then(n => {
      setNotifications(n);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl">
      <h1 className="text-2xl font-bold text-brand-navy">Notifications</h1>
      
      <Card>
        <div className="divide-y divide-brand-border">
          {notifications.map((n) => (
            <div key={n.id} className={cn("p-6 flex gap-4 transition-colors", !n.isRead ? "bg-brand-blue-light/30" : "")}>
              <div className="mt-1">
                <Bell className={cn("w-5 h-5", !n.isRead ? "text-brand-blue" : "text-brand-muted")} />
              </div>
              <div className="flex-1">
                <h4 className={cn("text-sm font-bold", !n.isRead ? "text-brand-navy" : "text-brand-text")}>{n.title}</h4>
                <p className="text-sm text-brand-muted mt-1">{n.message}</p>
                <span className="text-xs text-brand-muted block mt-2">{n.date}</span>
              </div>
              {!n.isRead && (
                <div className="w-2 h-2 rounded-full bg-brand-blue mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}