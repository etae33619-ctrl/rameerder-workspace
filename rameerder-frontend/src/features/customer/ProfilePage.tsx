// import React from "react";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../features/auth/AuthContext";

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl">
      <h1 className="text-2xl font-bold text-brand-navy">Profile Details</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-brand-muted">
                <User className="w-8 h-8" />
              </div>
              <Button type="button" variant="outline">Upload Picture</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" defaultValue={user?.firstName} />
              <Input label="Last Name" defaultValue={user?.lastName} />
            </div>
            <Input label="Email Address" type="email" defaultValue={user?.email} disabled />
            <Input label="Phone Number" type="tel" defaultValue="" placeholder="+237..." />
            
            <div className="pt-4 border-t border-brand-border">
              <Button type="button">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}