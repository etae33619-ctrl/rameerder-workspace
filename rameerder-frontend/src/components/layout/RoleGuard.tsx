//import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import {type  Role } from "../../features/auth/types";
import { ErrorState } from "../ui/ErrorState";

interface RoleGuardProps {
  allowedRoles: Role[];
  redirectTo?: string;
}

export function RoleGuard({ allowedRoles, redirectTo = "/" }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // Let ProtectedRoute handle loading if stacked

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have the right role
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return (
      <div className="p-8">
        <ErrorState title="Access Denied" message="You do not have permission to view this page." />
      </div>
    );
  }

  return <Outlet />;
}