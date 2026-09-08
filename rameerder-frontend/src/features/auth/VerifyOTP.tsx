import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/features/auth/auth.api";

export function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authApi.verifyOTP(otp);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setError(err.message || "Invalid OTP code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-brand-bg flex items-center justify-center p-4 py-16">
      <Card className="w-full max-w-md shadow-lg border-brand-border">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-brand-navy">Verify Email</CardTitle>
          <p className="text-sm text-brand-muted">Enter the 6-digit code sent to your email.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-3 text-sm text-brand-red bg-brand-red-light rounded-md">{error}</div>}
            {success && <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">Verification successful! Redirecting...</div>}
            
            <Input 
              label="OTP Code" 
              placeholder="123456"
              maxLength={6}
              required 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center tracking-widest text-lg"
            />
            
            <Button type="submit" className="w-full" isLoading={isLoading}>
              VERIFY ACCOUNT
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}