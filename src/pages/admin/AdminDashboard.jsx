import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import StatsCards from "./StatsCards";
import UsersTab from "./UsersTab";
/**
 * AdminDashboard - layout principal del panel.
 * Define las pestañas usando NavLink y renderiza rutas hijas con <Outlet />
 *
 * Nota: en este archivo renderizo UsersTab directamente para simplificar la demo.
 * En un proyecto real, usaría rutas separadas y lazy loading para cada tab.
 */

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    paymentsCaptured: 0,
    paymentsFailed: 0,
  });

  // Ejemplo: podrías traer métricas desde /api/admin/stats
  useEffect(() => {
    // fetchStats() -> setStats(...)
    // por ahora valores dummy para que las tarjetas no estén vacías
    setStats({ activeSubscriptions: 4, paymentsCaptured: 32, paymentsFailed: 2 });
  }, []);

  const tabClass = ({ isActive }) =>
    `px-4 py-3 rounded-md ${isActive ? "bg-indigo-600 text-white" : "text-gray-600 border"}`;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-widest">Tablero del Administrador</h1>
        </header>

      <section className="mb-8">
        <StatsCards stats={stats} />
      </section>

     <nav className="mb-6 w-full">
  <div className="table w-full border border-gray-300 rounded-lg overflow-hidden">
    <NavLink
      to="/app/admin/users"
      className={({ isActive }) =>
        `table-cell text-center px-4 py-3 text-sm font-medium cursor-pointer transition-colors 
        ${isActive ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} 
        border-r border-gray-300`
      }
    >
      Administración de Usuarios
    </NavLink>

    <NavLink
      to="/admin/plans"
      className={({ isActive }) =>
        `table-cell text-center px-4 py-3 text-sm font-medium cursor-pointer transition-colors 
        ${isActive ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} 
        border-r border-gray-300`
      }
    >
      Planes de Suscripción
    </NavLink>

    <NavLink
      to="/admin/subscriptions"
      className={({ isActive }) =>
        `table-cell text-center px-4 py-3 text-sm font-medium cursor-pointer transition-colors 
        ${isActive ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} 
        border-r border-gray-300`
      }
    >
      Suscripciones
    </NavLink>

    <NavLink
      to="/admin/orders"
      className={({ isActive }) =>
        `table-cell text-center px-4 py-3 text-sm font-medium cursor-pointer transition-colors 
        ${isActive ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} 
        border-r border-gray-300`
      }
    >
      Pedidos
    </NavLink>

    <NavLink
      to="/admin/payments"
      className={({ isActive }) =>
        `table-cell text-center px-4 py-3 text-sm font-medium cursor-pointer transition-colors 
        ${isActive ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`
      }
    >
      Pagos
    </NavLink>
  </div>
</nav>


      <main>
        {/* 
          Aquí podrías usar <Outlet/> para rutas hijas en router:
          <Outlet /> -> /admin/users -> UsersTab
          Para la entrega rápida incluyo un pequeño router fallback: si la ruta es /admin/...
        */}

        {/* Si usas routing completo, renderiza <Outlet/>. Para demo simple, mostramos UsersTab al entrar en /admin/users */}
        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
