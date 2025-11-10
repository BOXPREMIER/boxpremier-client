import React, { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser } from "../../services/UserServices";
import { getSubscriptions } from "../../services/SubscriptionServices"; 
import UserModal from "./UserModal";
import AdminModal from "./AdminModal"; 
import Button from "../../components/Button";
import { showCustomAlert } from "../../components/CustomAlert";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdminModal, setIsAdminModal] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [filterType, setFilterType] = useState("customer"); 

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersRes, subsRes] = await Promise.all([getUsers(), getSubscriptions()]);
      const enrichedUsers = usersRes.map(user => {
        const userSub = subsRes.find(sub => sub.user._id === user._id);
        return {
          ...user,
          subscription: userSub || null,
          plan: userSub?.subscriptionPlan || null,
        };
      });
      setUsers(enrichedUsers);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setReadOnly(false);
    setIsAdminModal(false); 
    setModalOpen(true);
  };

  const handleAddAdmin = () => {
    setReadOnly(false);
    setIsAdminModal(true); 
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setReadOnly(false);
    setIsAdminModal(user.userType === "admin");
    setModalOpen(true);
  };

  const handleSubmitUser = async (userData) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(userData).filter(([_, value]) => value !== "" && value !== null)
      );
      await updateUser(userData._id, cleanedData);

      showCustomAlert({
        title: "¡Usuario actualizado!",
        text: "Los cambios se guardaron correctamente.",
        confirmText: "Aceptar",
        onConfirm: () => setModalOpen(false),
      });

      fetchUsers();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      showCustomAlert({
        title: "Error",
        text: "No se pudo actualizar el usuario.",
        confirmText: "Aceptar",
      });
    }
  };

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

  const usersByType = users.filter(u => {
    if (filterType === "customer") return u.userType === "customer";
    if (filterType === "admin") return u.userType === "admin";
    return true;
  });

  const filteredUsers = usersByType.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-secondary">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Administración de Usuarios</h2>
        <div className="flex gap-3">
          <Button title="+ Nuevo Cliente" action={handleAddUser} tooltip="Crear nuevo cliente" />
          <Button title="+ Nuevo Admin" action={handleAddAdmin} tooltip="Crear nuevo administrador" />
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setFilterType("customer")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filterType === "customer"
              ? "bg-secondary text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Clientes
        </button>
        <button
          onClick={() => setFilterType("admin")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filterType === "admin"
              ? "bg-secondary text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Administradores
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
            <tr className="bg-secondary text-white">
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Email</th>
              {filterType === "customer" && (
                <>
                  <th className="p-3 text-left">Plan</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-left">Dirección</th>
                  <th className="p-3 text-left">Fecha de suscripción</th>
                  <th className="p-3 text-left">Próximo cobro</th>
                </>
              )}
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={filterType === "customer" ? "8" : "3"} className="p-4 text-center">
                  Cargando...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={filterType === "customer" ? "8" : "3"} className="p-4 text-center text-gray-500">
                  No se encontraron {filterType === "customer" ? "clientes" : "administradores"}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim()}</td>
                  <td className="p-3">{user.email}</td>
                  {filterType === "customer" && (
                    <>
                      <td className="p-3 capitalize">{user.plan?.boxType ?? "-"}</td>
                      <td className="p-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          user.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {user.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="p-3">{`${user.city ?? "-"}, ${user.postalCode ?? "-"}, ${user.street ?? "-"} ${user.number ?? "-"}`}</td>
                      <td className="p-3">{user.subscription?.startDate ? new Date(user.subscription.startDate).toLocaleDateString("es-ES") : "-"}</td>
                      <td className="p-3">{user.subscription?.nextPayDate ? new Date(user.subscription.nextPayDate).toLocaleDateString("es-ES") : "-"}</td>
                    </>
                  )}
                  <td className="p-3 flex gap-2 justify-center">
                    <Button title="Editar" action={() => handleEditUser(user)} tooltip="Editar usuario" />
                    <Button title="Eliminar" action={() => handleDeleteUser(user._id)} tooltip="Eliminar usuario" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAdminModal ? (
        <AdminModal
          key={selectedUser?._id || 'new-admin'}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitUser}
          initialData={selectedUser}
          readOnly={readOnly}
        />
      ) : (
        <UserModal
          key={selectedUser?._id || 'new-user'}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitUser}
          initialData={selectedUser}
          readOnly={readOnly}
        />
      )}
    </div>
  );
};

export default UsersTab;
