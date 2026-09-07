// import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MailCheck } from "lucide-react";

export function VerifyEmail() {
  return (
    <div className="min-h-[80vh] bg-brand-bg flex items-center justify-center p-4 py-16">
      <Card className="w-full max-w-md shadow-lg border-brand-border text-center">
        <CardHeader className="space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 bg-brand-blue-light rounded-full flex items-center justify-center">
            <MailCheck className="w-8 h-8 text-brand-blue" />
          </div>
          <CardTitle className="text-2xl font-bold text-brand-navy">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-brand-muted">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>
          <Button className="w-full" asChild>
            <Link to="/login">RETURN TO LOGIN</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}