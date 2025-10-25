import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import ProfilePage from "../pages/ProfilePage";
import SubscriptionPage from "../pages/SubscriptionPage";
import AuthForm from "../components/AuthForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/profilePage",
        element: <ProfilePage />,
        //loader: routeValidator,
      },
      {
        path: "/subscriptionPage",
        element: <SubscriptionPage />,
        //loader: routeValidator,
      },
      { path: "login", 
        element: <AuthForm mode="login" /> 
      },
      { path: "register", 
        element: <AuthForm mode="register" /> 
      },
    ],
  },
]);

export default router;
