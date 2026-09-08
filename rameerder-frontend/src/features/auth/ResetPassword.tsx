import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/features/auth/auth.api";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await authApi.resetPassword(password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-brand-bg flex items-center justify-center p-4 py-16">
      <Card className="w-full max-w-md shadow-lg border-brand-border">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-brand-navy">Create New Password</CardTitle>
          <p className="text-sm text-brand-muted">Please enter your new password below</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-3 text-sm text-brand-red bg-brand-red-light rounded-md border border-brand-red/20">{error}</div>}
            {success && <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">Password updated successfully! Redirecting...</div>}
            
            <Input label="New Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input label="Confirm New Password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            
            <Button type="submit" className="w-full" isLoading={isLoading}>
              SAVE NEW PASSWORD
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}