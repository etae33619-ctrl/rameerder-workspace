import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/features/auth/auth.api";
import { useAuth } from "@/features/auth/AuthContext";

export function Register() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.register(formData);
      login(response.token, response.user);
      // In a real app, we might route them to /verify-email first
      navigate("/verify-otp");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-brand-bg flex items-center justify-center p-4 py-16">
      <Card className="w-full max-w-lg shadow-lg border-brand-border">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-brand-navy">Create an Account</CardTitle>
          <p className="text-sm text-brand-muted">Join Rameerder Pace Group today</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-brand-red bg-brand-red-light rounded-md border border-brand-red/20">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" name="firstName" required value={formData.firstName} onChange={handleChange} />
              <Input label="Last Name" name="lastName" required value={formData.lastName} onChange={handleChange} />
            </div>
            <Input label="Email Address" type="email" name="email" required value={formData.email} onChange={handleChange} />
            <Input label="Password" type="password" name="password" required value={formData.password} onChange={handleChange} />
            <Input label="Confirm Password" type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} />
            
            <Button type="submit" className="w-full" isLoading={isLoading}>
              CREATE ACCOUNT
            </Button>
            
            <div className="text-center text-sm text-brand-muted pt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-brand-blue hover:underline">
                Log In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}