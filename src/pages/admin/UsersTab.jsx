import React, { useEffect, useState, useMemo, useRef } from "react";
import { getUsers } from "../../services/UserServices";
import { getSubscriptions } from "../../services/SubscriptionServices";
import { Search, MoreVertical, Plus } from "lucide-react";
import UserModal from "../modals/UserModal"; // Ajusta la ruta según tu estructura

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("customer");

  const [showMenu, setShowMenu] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const menuRef = useRef(null); // referencia para detectar clic fuera

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cargar usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, subsRes] = await Promise.all([
        getUsers(),
        getSubscriptions(),
      ]);

      const enrichedUsers = usersRes.map((user) => {
        const userSub = subsRes.find((sub) => sub.user._id === user._id);
        return {
          ...user,
          subscription: userSub || null,
          plan: userSub?.subscriptionPlan || null,
        };
      });

      let filteredByType = enrichedUsers;
      if (filterType !== "all") {
        filteredByType = enrichedUsers.filter((u) => u.userType === filterType);
      }

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

  // Filtrado por búsqueda
  const filteredUsers = useMemo(() => {
    if (filterType !== "customer") return users;
    const lowerSearch = search.toLowerCase();
    return users.filter((user) => {
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
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usuarios</h2>

        <div className="flex items-center gap-4">
          {filterType === "customer" && (
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Nombre, plan, estado, ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-80 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {/* Botón de crear usuario */}
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowUserModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Nuevo perfil
          </button>
        </div>
      </div>

      {/* Botones de filtro */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterType("customer")}
          className={`px-4 py-2 rounded-lg ${
            filterType === "customer"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Clientes
        </button>
        <button
          onClick={() => setFilterType("admin")}
          className={`px-4 py-2 rounded-lg ${
            filterType === "admin" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Admins
        </button>
      </div>

      {/* Tabla */}
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
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={filterType === "customer" ? 8 : 4}
                  className="p-4 text-center text-gray-500"
                >
                  Cargando usuarios...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={filterType === "customer" ? 8 : 4}
                  className="p-4 text-center text-gray-500"
                >
                  No hay usuarios que coincidan
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user._id || user.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">{user.email || "-"}</td>
                  <td className="p-4">{`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "-"}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  {user.userType === "customer" && (
                    <>
                      <td className="p-4 capitalize">
                        {user.plan?.boxType ?? "-"}
                      </td>
                      <td className="p-4">{`${user.city ?? "-"}, ${
                        user.postalCode ?? "-"
                      }, ${user.street ?? "-"} ${user.number ?? "-"}`}</td>
                      <td className="p-4">
                        {user.subscription?.startDate
                          ? new Date(
                              user.subscription.startDate
                            ).toLocaleDateString("es-ES")
                          : "-"}
                      </td>
                      <td className="p-4">
                        {user.subscription?.nextPayDate
                          ? new Date(
                              user.subscription.nextPayDate
                            ).toLocaleDateString("es-ES")
                          : "-"}
                      </td>
                    </>
                  )}

                  {/* Menú de acciones */}
                  <td className="p-4 text-center relative" ref={menuRef}>
                    <button
                      onClick={() =>
                        setShowMenu(showMenu === user._id ? null : user._id)
                      }
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {showMenu === user._id && (
                      <div className="absolute right-4 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                            setShowMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            console.log("Desactivar usuario:", user._id);
                            setShowMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                        >
                          Desactivar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de usuario */}
      <UserModal
        open={showUserModal}
        onClose={() => setShowUserModal(false)}
        initialData={selectedUser}
        onSubmit={async (data) => {
          console.log("Datos enviados:", data);
          setShowUserModal(false);
          await fetchUsers();
        }}
      />
    </div>
  );
};

export default UsersTab;
