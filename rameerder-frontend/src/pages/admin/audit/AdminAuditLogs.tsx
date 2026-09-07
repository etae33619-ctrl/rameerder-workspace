import  { useEffect, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { LoadingState } from "../../../components/ui/LoadingState";
import { adminApi } from "../../../features/admin/admin.api";
import {type  AdminAuditLog } from "../../../features/admin/types";

export function AdminAuditLogs() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi.getAuditLogs().then(l => {
      setLogs(l);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">System Audit Logs</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-brand-muted uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Date / Time</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Resource</th>
              <th className="px-6 py-4">IP Address</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-brand-muted">{log.date}</td>
                <td className="px-6 py-4 font-bold text-brand-navy">{log.user}</td>
                <td className="px-6 py-4 font-medium">{log.action}</td>
                <td className="px-6 py-4 text-brand-blue">{log.resource}</td>
                <td className="px-6 py-4 text-xs font-mono">{log.ip}</td>
                <td className="px-6 py-4">
                  <Badge variant={log.status === "SUCCESS" ? "success" : log.status === "FAILED" ? "danger" : "warning"}>
                    {log.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}