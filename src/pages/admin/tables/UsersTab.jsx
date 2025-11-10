import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../../services/UserServices";
import { getSubscriptions } from "../../../services/SubscriptionServices"; 
import UserModal from "../modals/UserModal";
import AdminModal from "../modals/AdminModal"; 
import Button from "../../../components/Button";
import Swal from 'sweetalert2';

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
      Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
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
        Object.entries(userData).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === 'subscription' || key === 'plan' || key === 'status' || key === 'fullName') return false;
          return true;
        })
      );

      const finalData = {
        ...cleanedData,
        userType: isAdminModal ? "admin" : "customer",
        status: true,
        preferences: {
          emailNotifications: true
        }
      };

      if (finalData._id === null) {
        delete finalData._id;
      }

      if (userData._id) {
        await updateUser(userData._id, finalData);
        Swal.fire({
          title: "¡Usuario actualizado!",
          text: "Los cambios se guardaron correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          setModalOpen(false);
          setSelectedUser(null);
        });
      } else {
        await createUser(finalData);
        Swal.fire({
          title: "¡Usuario creado!",
          text: "El nuevo usuario se creó correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          setModalOpen(false);
          setSelectedUser(null);
        });
      }

      await fetchUsers();

    } catch (error) {
      console.error("Error al guardar usuario:", error);
      
      let errorMessage = "No se pudo guardar el usuario. Por favor, verifica los datos.";
      
      if (error.response?.status === 400) {
        if (error.response.data.message === "Email already exists") {
          errorMessage = "El email ya está registrado. Por favor, utiliza otro email.";
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else {
        errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      "No se pudo guardar el usuario. Por favor, verifica los datos.";
      }
      
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        await fetchUsers();
        Swal.fire({
          title: "Eliminado!",
          text: "El usuario ha sido eliminado.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3085d6",
        });
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el usuario.",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#d33",
        });
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

  // Función para formatear dirección
  const formatAddress = (user) => {
    const parts = [user.street, user.number, user.floor, user.city, user.postalCode].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : "-";
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-secondary">
      {/* Header responsive */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-primary text-center lg:text-left">
          Administración de Usuarios
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            title="+ Nuevo Cliente" 
            action={handleAddUser} 
            tooltip="Crear nuevo cliente"
            className="text-sm py-2 px-4"
          />
          <Button 
            title="+ Nuevo Admin" 
            action={handleAddAdmin} 
            tooltip="Crear nuevo administrador"
            className="text-sm py-2 px-4"
          />
        </div>
      </div>

      {/* Filtros responsive */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          onClick={() => setFilterType("customer")}
          className={`px-4 py-2 md:px-6 md:py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${
            filterType === "customer"
              ? "bg-secondary text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Clientes
        </button>
        <button
          onClick={() => setFilterType("admin")}
          className={`px-4 py-2 md:px-6 md:py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${
            filterType === "admin"
              ? "bg-secondary text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Administradores
        </button>
      </div>

      {/* Búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-secondary rounded-lg p-2 md:p-3 outline-none focus:ring-2 focus:ring-secondary text-sm md:text-base"
        />
      </div>

      {/* Vista de escritorio - Tabla */}
      <div className="hidden lg:block overflow-x-auto">
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
                  <th className="p-3 text-left">Fecha suscripción</th>
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
                      <td className="p-3 max-w-xs truncate" title={formatAddress(user)}>
                        {formatAddress(user)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {user.subscription?.startDate ? new Date(user.subscription.startDate).toLocaleDateString("es-ES") : "-"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {user.subscription?.nextPayDate ? new Date(user.subscription.nextPayDate).toLocaleDateString("es-ES") : "-"}
                      </td>
                    </>
                  )}
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <Button title="Editar" action={() => handleEditUser(user)} tooltip="Editar usuario" />
                      <Button title="Eliminar" action={() => handleDeleteUser(user._id)} tooltip="Eliminar usuario"  />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista móvil - Cards */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="text-center p-4">Cargando...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No se encontraron {filterType === "customer" ? "clientes" : "administradores"}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user._id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Información básica */}
              <div className="mb-3">
                <h3 className="font-semibold text-lg text-primary">
                  {user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim()}
                </h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <p className="text-gray-500 text-xs">{user.phone || "Sin teléfono"}</p>
              </div>

              {/* Información específica para clientes */}
              {filterType === "customer" && (
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <span className="font-medium">Plan:</span>
                    <span className="ml-1 capitalize">{user.plan?.boxType ?? "-"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Estado:</span>
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      user.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {user.status ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Dirección:</span>
                    <span className="ml-1 text-xs">{formatAddress(user)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Suscripción:</span>
                    <span className="ml-1 text-xs">
                      {user.subscription?.startDate ? new Date(user.subscription.startDate).toLocaleDateString("es-ES") : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Próximo cobro:</span>
                    <span className="ml-1 text-xs">
                      {user.subscription?.nextPayDate ? new Date(user.subscription.nextPayDate).toLocaleDateString("es-ES") : "-"}
                    </span>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  title="Editar" 
                  action={() => handleEditUser(user)} 
                  tooltip="Editar usuario"
                  className="flex-1 text-sm py-2"
                />
                <Button 
                  title="Eliminar" 
                  action={() => handleDeleteUser(user._id)} 
                  tooltip="Eliminar usuario"
                  className="flex-1 text-sm py-2  "
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modales */}
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