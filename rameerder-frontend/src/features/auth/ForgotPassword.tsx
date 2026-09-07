import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/features/auth/auth.api";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setIsSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-brand-bg flex items-center justify-center p-4 py-16">
      <Card className="w-full max-w-md shadow-lg border-brand-border">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-brand-navy">Reset Password</CardTitle>
          <p className="text-sm text-brand-muted">Enter your email to receive a reset link</p>
        </CardHeader>
        <CardContent>
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input 
                label="Email Address" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                SEND RESET LINK
              </Button>
              <div className="text-center pt-2">
                <Link to="/login" className="text-sm font-semibold text-brand-blue hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
                Reset link sent! Please check your email.
              </div>
              <Button variant="outline" className="w-full" asChild>
                 <Link to="/login">RETURN TO LOGIN</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}