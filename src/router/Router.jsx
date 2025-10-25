import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import ProfilePage from "../pages/ProfilePage"
import SubscriptionPage from "../pages/SubscriptionPage"

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
        // loader: routeValidator,
      },
      {
        path: "/subscriptionPage",
        element: <SubscriptionPage />,
        // loader: routeValidator,
      },
    ],
  },
]);

export default router;
