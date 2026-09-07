import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { LoadingState } from "../../../components/ui/LoadingState";
import { adminApi } from "../../../features/admin/admin.api";
import { type AdminEmployee } from "../../../features/admin/types";

export function AdminEmployeesList() {
  const [employees, setEmployees] = useState<AdminEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi.getEmployees().then(e => {
      setEmployees(e);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Employees & Roles</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-brand-muted uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Employee Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-brand-navy">{emp.name}</td>
                <td className="px-6 py-4 text-brand-muted">{emp.email}</td>
                <td className="px-6 py-4"><Badge variant={emp.role === "ADMIN" ? "danger" : "outline"}>{emp.role}</Badge></td>
                <td className="px-6 py-4"><Badge variant={emp.status === "ACTIVE" ? "success" : "default"}>{emp.status}</Badge></td>
                <td className="px-6 py-4 text-brand-muted">{emp.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}