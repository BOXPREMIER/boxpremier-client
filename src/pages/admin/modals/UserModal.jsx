import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";

const UserModal = ({ isOpen, onClose, onSave, selectedUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    status: true,
  });

  useEffect(() => {
    setFormData(
      selectedUser
        ? {
            fullName: selectedUser.fullName || "",
            email: selectedUser.email || "",
            phone: selectedUser.phone || "",
            role: selectedUser.role || "",
            status: selectedUser.status ?? true,
          }
        : { fullName: "", email: "", phone: "", role: "", status: true }
    );
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["fullName", "email", "phone"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {field === "fullName" ? "Nombre completo" : field}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
                required={field !== "phone"}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Seleccionar rol</option>
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              id="status"
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="status" className="text-sm">Activo</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button title="Cancelar" action={onClose} variant="secondary" />
            <Button title="Guardar" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
