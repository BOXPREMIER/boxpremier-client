import React, { useEffect, useState } from "react";
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import StatsCards from "./StatsCards";

/**
 * AdminDashboard - layout principal del panel de administración.
 * Maneja tabs con NavLink y renderiza rutas hijas con <Outlet />
 */

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    paymentsCaptured: 0,
    paymentsFailed: 0,
  });

  const location = useLocation();

 

  const tabClass = ({ isActive }) =>
    `table-cell text-center px-4 py-3 text-sm font-medium cursor-pointer transition-colors 
     ${isActive ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100"} 
     border-r border-gray-300`;

  // Redirect por defecto si estás en /app/admin
  if (location.pathname === "/app/admin") {
    return <Navigate to="users" replace />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-widest">Tablero del Administrador</h1>
      </header>

     
      <nav className="mb-6 w-full">
        <div className="table w-full border border-gray-300 rounded-lg overflow-hidden">
          <NavLink to="users" className={tabClass}>
            Administración de Usuarios
          </NavLink>
          <NavLink to="plans" className={tabClass}>
            Planes de Suscripción
          </NavLink>
          <NavLink to="subscriptions" className={tabClass}>
            Suscripciones
          </NavLink>
          <NavLink to="orders" className={tabClass}>
            Pedidos
          </NavLink>
          <NavLink to="payments" className={tabClass} style={{ borderRight: "none" }}>
            Pagos
          </NavLink>
        </div>
      </nav>

      <main className="mt-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
