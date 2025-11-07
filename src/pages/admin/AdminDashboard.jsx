import React, { useEffect, useState } from "react";
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import StatsCards from "./StatsCards";

/**
 * AdminDashboard - layout principal del panel de administración.
 * Mantiene el mismo comportamiento pero con tu estilo visual personalizado.
 */

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    paymentsCaptured: 0,
    paymentsFailed: 0,
  });

  const location = useLocation();

  const tabClass = ({ isActive }) =>
    `table-cell text-center px-4 py-3 text-sm font-medium cursor-pointer transition-all duration-200 
     border-r border-secondary ${
       isActive
         ? "bg-primary text-white"
         : "bg-secondary text-primary hover:opacity-80"
     }`;

  // Redirección por defecto si estás en /app/admin
  if (location.pathname === "/app/admin") {
    return <Navigate to="users" replace />;
  }

  return (
    <div className="p-8 bg-white min-h-screen text-primary font-gotham">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-widest text-primary">
          Tablero del Administrador
        </h1>
      </header>

      {/* Navegación de pestañas */}
      <nav className="mb-6 w-full">
        <div className="table w-full border border-secondary rounded-lg overflow-hidden">
          <NavLink to="users" className={tabClass}>
            Administración de Usuarios
          </NavLink>
          <NavLink to="plans" className={tabClass}>
            Planes de Suscripción
          </NavLink>
          <NavLink to="orders" className={tabClass}>
            Pedidos
          </NavLink>
          <NavLink
            to="payments"
            className={tabClass}
            style={{ borderRight: "none" }}
          >
            Pagos
          </NavLink>
        </div>
      </nav>

      {/* Contenido dinámico */}
      <main className="mt-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
