//import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { CustomerLayout } from "../../components/layout/CustomerLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardLayout } from "@/features/customer/DashboardLayout";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { RoleGuard } from "../../components/layout/RoleGuard";

// Public Pages
import { CustomerHome } from "../../pages/public/CustomerHome";
import { About } from "../../pages/public/About";
import { Services } from "../../pages/public/Services";
import { Shop } from "../../pages/public/shop/Shop";
import { ProductDetails } from "../../pages/public/shop/ProductDetails";
import { CartPage } from "../../pages/public/CartPage";
import { WishlistPage } from "../../pages/public/WishlistPage";
import { Blog } from "../../pages/public/Blog";
import { Contact } from "../../pages/public/Contact";
import { FAQ } from "../../pages/public/FAQ";
import { TestimonialsPage } from "../../pages/public/TestimonialsPage";
import { NotFound } from "../../pages/public/NotFound";

// Auth & Checkout Pages

import { Login } from "@/features/auth/Login";
import { Register } from "@/features/auth/Register";
import { VerifyOTP } from "@/features/auth/VerifyOTP";
import { VerifyEmail } from "@/features/auth/VerifyEmail";
import { ForgotPassword } from "@/features/auth/ForgotPassword";
import { ResetPassword } from "@/features/auth/ResetPassword";
import { CheckoutPage } from "@/features/checckout/CheckoutPage";
import { OrderSuccessPage } from "@/features/checckout/OrderSuccessPage";

// Customer Dashboard Pages

import { DashboardHome } from "@/features/customer/DashboardHome";
import { OrdersPage  as CustomerOrdersPage} from "@/features/customer/OrdersPage";
import { OrderDetailsPage as CustomerOrderDetailsPage  } from "@/features/customer/OrderDetailsPage";
import { OrderTrackingPage } from "@/features/customer/OrderTrackingPage";
import { AddressesPage } from "@/features/customer/AddressesPage";
import {NotificationsPage as CustomerNotificationsPage } from "@/features/customer/NotificationsPage";
import { ProfilePage } from "@/features/customer/ProfilePage";
import { SettingsPage as CustomerSettingsPage } from "@/features/customer/SettingsPage";

// 5. Admin Pages
import { AdminLogin } from "../../pages/admin/AdminLogin";
import { AdminDashboard } from "../../pages/admin/AdminDashboard";
import { AdminOrdersList } from "../../pages/admin/orders/AdminOrdersList";
import { AdminOrderDetails } from "@/pages/admin/orders/AdminOrderDetails";
import { AdminProductsList } from "../../pages/admin/products/AdminProductsList";
import { AdminInventory } from "../../pages/admin/inventory/AdminInventory";
import { AdminDeliveryZones } from "../../pages/admin/delivery/AdminDeliveryZones";
import { AdminCustomersList } from "../../pages/admin/customers/AdminCustomersList";
import { AdminEmployeesList } from "../../pages/admin/employees/AdminEmployeesList";
import { AdminAuditLogs } from "../../pages/admin/audit/AdminAuditLogs";
import { AdminReports } from "../../pages/admin/reports/AdminReports";
import { AdminGenericPage } from "../../pages/admin/AdminGenericPage";

export const router = createBrowserRouter([
  // PUBLIC WEBSITE & CHECKOUT ROUTES
  {
    path: "/",
    element: <CustomerLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <CustomerHome /> },
      { path: "about", element: <About /> },
      { path: "services", element: <Services /> },
      { path: "shop", element: <Shop /> },
      { path: "shop/:id", element: <ProductDetails /> },
      { path: "cart", element: <CartPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "blog", element: <Blog /> },
      { path: "contact", element: <Contact /> },
      { path: "faq", element: <FAQ /> },
      { path: "testimonials", element: <TestimonialsPage /> },

      // Auth
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "verify-otp", element: <VerifyOTP /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },

      // Checkout
      { path: "checkout", element: <CheckoutPage /> },
      { path: "order-success/:orderId", element: <OrderSuccessPage /> },
    ],
  },

  // PROTECTED CUSTOMER DASHBOARD ROUTES
  {
    path: "/account",
    element: <ProtectedRoute />,
    errorElement: <NotFound />,
    children: [
      {
        element: <RoleGuard allowedRoles={["CUSTOMER", "STAFF", "MANAGER", "ADMIN"]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardHome /> },
              { path: "orders", element: <CustomerOrdersPage /> },
              { path: "orders/:id", element: <CustomerOrderDetailsPage /> },
              { path: "track", element: <CustomerOrdersPage /> },
              { path: "track/:id", element: <OrderTrackingPage /> },
              { path: "addresses", element: <AddressesPage /> },
              { path: "notifications", element: <CustomerNotificationsPage /> },
              { path: "profile", element: <ProfilePage /> },
              { path: "settings", element: <CustomerSettingsPage /> },
            ]
          }
        ]
      }
    ]
  },

  // ADMIN LOGIN
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  // PROTECTED ADMIN DASHBOARD ROUTES
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleGuard allowedRoles={["ADMIN", "MANAGER", "STAFF"]} redirectTo="/login" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },

              // Major Routes
              { path: "orders", element: <AdminOrdersList /> },
              { path: "orders/:id", element: <AdminOrderDetails /> },
              { path: "products", element: <AdminProductsList /> },
              { path: "products/new", element: <AdminGenericPage /> },
              { path: "products/:id/edit", element: <AdminGenericPage /> },
              { path: "inventory", element: <AdminInventory /> },
              { path: "delivery-zones", element: <AdminDeliveryZones /> },
              { path: "customers", element: <AdminCustomersList /> },
              { path: "employees", element: <AdminEmployeesList /> },
              { path: "reports", element: <AdminReports /> },
              { path: "audit-logs", element: <AdminAuditLogs /> },

              // Minor/Structural Routes (Generic Placeholders)
              { path: "categories", element: <AdminGenericPage /> },
              { path: "brands", element: <AdminGenericPage /> },
              { path: "roles", element: <AdminGenericPage /> },
              { path: "permissions", element: <AdminGenericPage /> },
              { path: "payments", element: <AdminGenericPage /> },
              { path: "notifications", element: <AdminGenericPage /> },
              { path: "content", element: <AdminGenericPage /> },
              { path: "settings", element: <AdminGenericPage /> },
            ]
          }
        ]
      }
    ]
  },
]);