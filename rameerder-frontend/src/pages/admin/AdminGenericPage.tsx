// import React from "react";
import { useLocation } from "react-router-dom";
import { Wrench } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";

export function AdminGenericPage() {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop()?.replace("-", " ") || "Page";

  return (
    <div className="space-y-6 animate-in fade-in h-full flex flex-col">
      <h1 className="text-2xl font-bold text-brand-navy capitalize">{pageName}</h1>
      <Card className="flex-1 min-h-[50vh] flex items-center justify-center bg-slate-50 border-dashed">
        <CardContent className="text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-muted">
            <Wrench className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-brand-navy mb-2 capitalize">{pageName} Management</h2>
          <p className="text-brand-muted max-w-md mx-auto">
            This module interface is connected to the router shell and is awaiting data binding in Phase 9 API integration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}