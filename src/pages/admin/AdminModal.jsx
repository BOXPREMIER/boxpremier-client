import React, { useState, useEffect } from "react";
import Button from "../../components/Button";

const AdminModal = ({ open, onClose, onSubmit, initialData = {}, readOnly = false }) => {
  const [formData, setFormData] = useState({
    userType: "admin",
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (initialData && initialData._id) {
      setFormData({
        userType: "admin", 
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        password: initialData.password || ""
      });
    } else {
      setFormData({
        userType: "admin",
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {initialData?._id ? "Editar Administrador" : "Nuevo Administrador"}
        </h2>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="off"
              readOnly={readOnly}
              className="w-full border border-secondary p-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Apellido *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="off"
              readOnly={readOnly}
              className="w-full border border-secondary p-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="new email"
              readOnly={readOnly}
              className="w-full border border-secondary p-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {initialData?._id ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña *"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new password"
              readOnly={readOnly}
              className="w-full border border-secondary p-2 rounded-lg"
              required={!initialData?._id}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button title="Cerrar" action={onClose} tooltip="Cerrar modal" />
            {!readOnly && <Button title="Guardar" type="submit" tooltip="Guardar administrador" />}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;