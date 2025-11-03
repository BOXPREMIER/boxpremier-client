// import React from "react";
// import { createBrowserRouter } from "react-router-dom";
// import Layout from "../layout/Layout";
// import Home from "../pages/Home";
// import ProfilePage from "../pages/ProfilePage";
// import SubscriptionPage from "../pages/SubscriptionPage";
// import AuthForm from "../components/AuthForm";
// import { authGuard } from "../validators/routeValidator";
// import SubscriptionCheckout from "../pages/SubscriptionCheckout";
// import MainPage from "../pages/MainPage";


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainPage />,
//   },
//   {
//     path: "/app",
//     element: <Layout />,
//     children: [
//       {
//         index: true,
//         element: <Home />,
//       },
//       {
//         path: "profilePage",
//         element: <ProfilePage />,
//         loader: authGuard,
//       },
//       {
//         path: "subscriptionPage",
//         element: <SubscriptionPage />,
//         loader: authGuard,
//       },
//       {
//         path: "subscription/checkout",
//         element: <SubscriptionCheckout />,
//         loader: authGuard,
//       },
//       {
//         path: "login",
//         element: <AuthForm mode="login" />,
//       },
//       {
//         path: "register",
//         element: <AuthForm mode="register" />,
//       },
//       { path: "login", element: <AuthForm mode="login" /> },
//       { path: "register", element: <AuthForm mode="register" /> },
//     ],
//   },
// ]);


// export default router;
// src/router/Router.jsx
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
import UsersTab from "../pages/admin/UsersTab";
import PlansTab from "../pages/admin/PlansTab";
import SubscriptionsTab from "../pages/admin/SubscriptionTab"
import OrdersTab from "../pages/admin/OrdersTab";
import PaymentsTab from "../pages/admin/PaymentsTab";
import GiftPage from "../pages/GiftPage";


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
      { path: "subscription", element: <SubscriptionPage />, loader: authGuard }, // /app/subscription
      { path: "subscription/checkout", element: <SubscriptionCheckout />, loader: authGuard }, // /app/subscription/checkout
      { path: "gift", element: <GiftPage /> },
      {
        path: "admin", element: <AdminDashboard />, loader: adminGuard,
        children: [
          { path: "users", element: <UsersTab />, },
          { path: "plans", element: <PlansTab />, },
          { path: "subscriptions", element: <SubscriptionsTab />, },
          { path: "orders", element: <OrdersTab />, },
          { path: "payments", element: <PaymentsTab />, },
        ],
      },
    ],
  },

  // Auth fuera del layout (sin navbar/footer)
  { path: "/login", element: <AuthForm mode="login" /> },
  { path: "/register", element: <AuthForm mode="register" /> },

  // Fallback: cualquier cosa rara te manda a /app
  { path: "*", element: <Navigate to="/app" replace /> },
]);

export default router;
