import React, { useEffect, useState, useMemo } from "react";
import { getUsers } from "../../services/UserServices";
import { getSubscriptions } from "../../services/SubscriptionServices";
import { Search } from "lucide-react";

const UsersTab = () => {
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [search, setSearch] = useState(""); // Texto de búsqueda
  const [loading, setLoading] = useState(false); // Cargando datos
  const [filterType, setFilterType] = useState("customer"); // Tipo de usuario

  // Función para cargar usuarios y suscripciones
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, subsRes] = await Promise.all([
        getUsers(),
        getSubscriptions(), // subs ya viene con subscriptionPlan poblado
      ]);

      // Asociar cada usuario con su suscripción y plan
      const enrichedUsers = usersRes.map(user => {
        const userSub = subsRes.find(sub => sub.user._id === user._id);
        return {
          ...user,
          subscription: userSub || null,
          plan: userSub?.subscriptionPlan || null, // plan directo
        };
      });

      // Filtrar por tipo de usuario
      let filteredByType = enrichedUsers;
      if (filterType !== "all") {
        filteredByType = enrichedUsers.filter(u => u.userType === filterType);
      }

      // Priorizar clientes
      filteredByType.sort((a, b) => {
        if (a.userType === b.userType) return 0;
        return a.userType === "customer" ? -1 : 1;
      });

      setUsers(filteredByType);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      alert("Error cargando usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterType]);

  // Filtrar por búsqueda solo si es customer
  const filteredUsers = useMemo(() => {
    if (filterType !== "customer") return users;
    const lowerSearch = search.toLowerCase();
    return users.filter(user => {
      const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.toLowerCase();
      const email = user.email?.toLowerCase() ?? "";
      const city = user.city?.toLowerCase() ?? "";
      const plan = user.plan?.boxType?.toLowerCase() ?? "";
      const postal = user.postalCode?.toLowerCase() ?? "";

      return (
        fullName.includes(lowerSearch) ||
        email.includes(lowerSearch) ||
        city.includes(lowerSearch) ||
        plan.includes(lowerSearch) ||
        postal.includes(lowerSearch)
      );
    });
  }, [users, search, filterType]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usuarios</h2>

        {/* Barra de búsqueda solo para clientes */}
        {filterType === "customer" && (
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nombre, plan, estado, ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-80 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* Botones para filtrar por tipo */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterType("customer")}
          className={`px-4 py-2 rounded-lg ${filterType === "customer" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Clientes
        </button>
        <button
          onClick={() => setFilterType("admin")}
          className={`px-4 py-2 rounded-lg ${filterType === "admin" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Admins
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 bg-gray-50">
              <th className="p-4">Email</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Estado</th>
              {filterType === "customer" && (
                <>
                  <th className="p-4">Tipo de Box</th>
                  <th className="p-4">Dirección</th>
                  <th className="p-4">Fecha de suscripción</th>
                  <th className="p-4">Próximo cobro</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={filterType === "customer" ? 7 : 3} className="p-4 text-center text-gray-500">
                  Cargando usuarios...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={filterType === "customer" ? 7 : 3} className="p-4 text-center text-gray-500">
                  No hay usuarios que coincidan
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user._id || user.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4">{user.email || "-"}</td>
                  <td className="p-4">{`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "-"}</td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {user.status ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  {user.userType === "customer" && (
                    <>
                      <td className="p-4 capitalize">{user.plan?.boxType ?? "-"}</td>
                      <td className="p-4">{`${user.city ?? "-"}, ${user.postalCode ?? "-"}, ${user.street ?? "-"} ${user.number ?? "-"}`}</td>
                      <td className="p-4">{user.subscription?.startDate ? new Date(user.subscription.startDate).toLocaleDateString("es-ES") : "-"}</td>
                      <td className="p-4">{user.subscription?.nextPayDate ? new Date(user.subscription.nextPayDate).toLocaleDateString("es-ES") : "-"}</td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTab;
