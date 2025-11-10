import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import ProfilePage from "../pages/ProfilePage";
import SubscriptionPage from "../pages/SubscriptionPage";
import AuthForm from "../components/AuthForm";
import { authGuard, adminGuard } from "../validators/routeValidator";
import SubscriptionCheckout from "../pages/SubscriptionCheckout";
import MainPage from "../pages/MainPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersTab from "../pages/admin/tables/UsersTab";
import PlansTab from "../pages/admin/tables/PlansTab";
import OrdersTab from "../pages/admin/OrdersTab";
import PaymentsTab from "../pages/admin/PaymentsTab";
import GiftPage from "../pages/GiftPage";
import MonthlyWines from "../pages/MonthlyWines";


const router = createBrowserRouter([
  // Si quieres una landing primero:
  { path: "/", element: <MainPage /> },

  // App con layout (navbar + outlet + footer)
  {
    path: "/app",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> }, // /app
      { path: "profile", element: <ProfilePage />, loader: authGuard }, // /app/profile
      { path: "subscription", element: <SubscriptionPage /> }, // /app/subscription
      { path: "subscription/checkout", element: <SubscriptionCheckout /> }, // /app/subscription/checkout
      { path: "gift", element: <GiftPage /> },
      { path: "monthly-wines", element: <MonthlyWines /> },
      {
        path: "admin", element: <AdminDashboard />, loader: adminGuard,
        children: [
          { path: "users", element: <UsersTab />, },
          { path: "plans", element: <PlansTab />, },
          { path: "orders", element: <OrdersTab />, },
          { path: "payments", element: <PaymentsTab />, },
        ],
      }, // /app/admin
    ],
  },

  // Auth fuera del layout (sin navbar/footer)
  { path: "/login", element: <AuthForm mode="login" /> },
  { path: "/register", element: <AuthForm mode="register" /> },

  //Fallback: cualquier cosa rara te manda a /app
  { path: "*", element: <Navigate to="/app" replace /> },
]);

export default router;
