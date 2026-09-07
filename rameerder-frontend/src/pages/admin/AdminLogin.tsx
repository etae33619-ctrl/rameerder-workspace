import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { authApi } from "../../features/auth/auth.api";
import { useAuth } from "../../features/auth/AuthContext";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/admin";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Using the auth service we built in Phase 3
      const response = await authApi.login({ email, password });
      
      // Ensure only authorized roles get into the admin panel
      if (["ADMIN", "MANAGER", "STAFF"].includes(response.user.role)) {
        login(response.token, response.user);
        navigate(from, { replace: true });
      } else {
        setError("Access denied. You do not have admin privileges.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center mb-4">
            <div className="text-brand-blue text-4xl font-black">R</div>
          </div>
          <CardTitle className="text-2xl">ADMIN PORTAL</CardTitle>
          <p className="text-sm text-brand-muted">OPERATIONAL & MANAGEMENT PLATFORM</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-brand-red bg-brand-red-light rounded-md border border-brand-red/20">
                {error}
              </div>
            )}
            <Input 
              label="Email" 
              type="email" 
              placeholder="admin@rameerder.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              LOGIN
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}