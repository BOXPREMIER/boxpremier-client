import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import ProfilePage from "../pages/ProfilePage";
import SubscriptionPage from "../pages/SubscriptionPage";
import AuthForm from "../components/AuthForm";
import { authGuard } from "../validators/routeValidator";
import SubscriptionCheckout from "../pages/SubscriptionCheckout";
import MainPage from "../pages/MainPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/app",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "profilePage",
        element: <ProfilePage />,
        loader: authGuard,
      },
      {
        path: "subscriptionPage",
        element: <SubscriptionPage />,
        loader: authGuard,
      },
      {
        path: "/subscription/checkout",
        element: <SubscriptionCheckout />,
        loader: authGuard,
      },
      {
        path: "login",
        element: <AuthForm mode="login" />,
      },
      {
        path: "register",
        element: <AuthForm mode="register" />,
      },
      { path: "login", element: <AuthForm mode="login" /> },
      { path: "register", element: <AuthForm mode="register" /> },
    ],
  },
]);


export default router;
