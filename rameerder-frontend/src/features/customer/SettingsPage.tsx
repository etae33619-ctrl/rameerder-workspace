// import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl">
      <h1 className="text-2xl font-bold text-brand-navy">Account Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
            <div className="pt-2">
              <Button type="button">Update Password</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}