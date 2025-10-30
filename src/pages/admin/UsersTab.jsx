import React, { useEffect, useState } from "react";
import { getUsers } from "../../services/UserServices"; // Solo usamos esto

const UsersTab = () => {
  const [users, setUsers] = useState([]); // estado para los usuarios
  const [loading, setLoading] = useState(false);

  // 🔹 1. Cargar los usuarios desde la API (db.json)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRes = await getUsers(); // llamada al servicio
      console.log("Usuarios cargados:", usersRes);
      setUsers(usersRes || []); // guardamos en estado
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      alert("Error cargando usuarios.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 2. useEffect para ejecutar al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 3. Renderizar tabla básica
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Usuarios</h2>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 bg-gray-50">
              <th className="p-4">Email</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4">Dirección</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Fecha de suscription</th>
              <th className="p-4">Proximo cobro</th>

            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Cargando usuarios...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No hay usuarios disponibles
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id || user.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">{user.email || "-"}</td>
                  <td className="p-4">
                    {`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                      "-"}
                  </td>
                  <td className="p-4">{user.phone || "-"}</td>
                  <td className="p-4">{`${user.city ??"-"} ${user.postalCode ?? "-"} ${user.street ?? "-"} ${user.number ?? "-"} `}</td>
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
                  <td className="p-4">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "-"}
                  </td> 
                   <td className="p-4">{user.updatedAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "-"}
                  </td>
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
