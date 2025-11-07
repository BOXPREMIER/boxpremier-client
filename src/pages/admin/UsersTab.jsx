import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/UserServices";
import { getSubscriptions } from "../../services/SubscriptionServices";
import UserModal from "./UserModal";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [readOnly, setReadOnly] = useState(false);

  // --- Cargar usuarios ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Cargar suscripciones ---
  const fetchSubscriptions = async () => {
    try {
      const res = await getSubscriptions();
      setSubscriptions(res);
    } catch (error) {
      console.error("Error al cargar suscripciones:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSubscriptions();
  }, []);

  // --- Modal crear usuario ---
  const handleAddUser = () => {
    setSelectedUser(null);
    setReadOnly(false);
    setModalOpen(true);
  };

  // --- Modal editar usuario ---
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setReadOnly(false);
    setModalOpen(true);
  };

  // --- Modal ver usuario ---
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setReadOnly(true);
    setModalOpen(true);
  };

  // --- Guardar usuario ---
  const handleSubmitUser = async (data) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser._id, data);
      } else {
        await createUser(data);
      }
      await fetchUsers();
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  // --- Eliminar usuario ---
  const handleDeleteUser = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      try {
        await deleteUser(id);
        await fetchUsers();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  // --- Filtro de búsqueda ---
  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // --- Obtener datos de suscripción por usuario ---
  const getUserSubscription = (userId) => {
    return subscriptions.find((sub) => sub.userId === userId);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-secondary">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Administración de Usuarios</h2>
        <button
          onClick={handleAddUser}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-80 transition"
        >
          + Nuevo usuario
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-secondary rounded-lg p-2 outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">plan</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Inicio</th>
              <th className="p-3 text-left">Próximo cobro</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  Cargando...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const sub = getUserSubscription(user._id);
                return (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {user.fullName || `${user.firstName || ""} ${user.lastName || ""}`}
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{sub?.boxtype|| "Sin plan"}</td>
                    <td className="p-3">{sub?.status || "No activo"}</td>
                    <td className="p-3">
                      {sub?.startDate ? new Date(sub.startDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-3">
                      {sub?.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:opacity-80 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:opacity-80 transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitUser}
        initialData={selectedUser}
        readOnly={readOnly}
      />
    </div>
  );
};

export default UsersTab;
