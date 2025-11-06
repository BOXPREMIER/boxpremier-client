import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/UserServices";
import { getSubscriptions } from "../../services/SubscriptionServices";
import { MoreVertical } from "lucide-react";
import UserModal from "./modals/UserModal";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null); // 👈 controla qué menú está abierto

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersData, subscriptions] = await Promise.all([
        getUsers(),
        getSubscriptions(),
      ]);

      const mergedUsers = usersData.map((user) => ({
        ...user,
        subscriptionStatus:
          subscriptions.find((s) => s.users === user._id)?.status || "Ninguna",
      }));

      setUsers(mergedUsers);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setMenuOpenId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser._id, formData);
      } else {
        await createUser(formData);
      }
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("¿Seguro que deseas desactivar este usuario?")) return;
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
    } finally {
      setMenuOpenId(null);
    }
  };

  const toggleMenu = (userId) => {
    setMenuOpenId(menuOpenId === userId ? null : userId);
  };

  const filteredUsers = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Usuarios</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo usuario
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar usuario..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm relative">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Nombre</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Teléfono</th>
              <th className="p-3 border">Rol</th>
              <th className="p-3 border">Suscripción</th>
              <th className="p-3 border">Estado</th>
              <th className="p-3 border text-center">Acciones</th>
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
                <td colSpan="7" className="p-4 text-center">
                  No hay usuarios
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="relative">
                  <td className="p-3 border">{user.fullName}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border">{user.phone}</td>
                  <td className="p-3 border capitalize">{user.role}</td>
                  <td className="p-3 border">{user.subscriptionStatus}</td>
                  <td className="p-3 border text-center">
                    {user.status ? (
                      <span className="text-green-600 font-medium">Activo</span>
                    ) : (
                      <span className="text-red-500 font-medium">Inactivo</span>
                    )}
                  </td>
                  <td className="p-3 border text-center relative">
                    {/* Botón de menú */}
                    <button
                      onClick={() => toggleMenu(user._id)}
                      className="p-2 hover:bg-gray-200 rounded-full"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Menú desplegable */}
                    {menuOpenId === user._id && (
                      <div className="absolute right-6 top-10 bg-white border rounded-lg shadow-lg z-10 w-36">
                        <button
                          onClick={() => openModal(user)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeactivate(user._id)}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          🚫 Desactivar
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

      {/* Modal de creación/edición */}
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveUser}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default UsersTab;
