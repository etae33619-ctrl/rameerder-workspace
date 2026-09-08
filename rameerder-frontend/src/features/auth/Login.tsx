import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/features/auth/auth.api";
import { useAuth } from "@/features/auth/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.login({ email, password });
      login(response.token, response.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-brand-bg flex items-center justify-center p-4 py-16">
      <Card className="w-full max-w-md shadow-lg border-brand-border">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-brand-navy">Welcome Back</CardTitle>
          <p className="text-sm text-brand-muted">Log in to manage your account and orders</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-brand-red bg-brand-red-light rounded-md border border-brand-red/20">
                {error}
              </div>
            )}
            <Input 
              label="Email Address" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="space-y-1">
              <Input 
                label="Password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs font-medium text-brand-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              LOG IN
            </Button>
            <div className="text-center text-sm text-brand-muted pt-4">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-brand-blue hover:underline">
                Create Account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}