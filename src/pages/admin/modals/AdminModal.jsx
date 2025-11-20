import React, { useState, useEffect } from "react";
import Button from "../../../components/Button";

const AdminModal = ({ open, onClose, onSubmit, initialData = {}, readOnly = false }) => {
  const [formData, setFormData] = useState({
    _id: null,
    userType: "admin",
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && initialData._id) {
      setFormData({
        _id: initialData._id,
        userType: "admin",
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        password: ""
      });
    } else {
      setFormData({
        _id: null,
        userType: "admin",
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      });
    }

    setErrors({});
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es obligatorio";
    if (!formData.lastName.trim()) newErrors.lastName = "El apellido es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio";


    if (!formData._id) {

      if (!formData.password) {
        newErrors.password = "La contraseña es obligatoria";
      } else if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    } else {

      if (formData.password && formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }


    const dataToSubmit = {
      ...formData,
      status: true,
      preferences: {
        emailNotifications: true
      }
    };
    onSubmit(dataToSubmit);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {formData._id ? "Editar Administrador" : "Nuevo Administrador"}
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
              className={`w-full border p-2 rounded-lg ${errors.firstName ? 'border-red-500' : 'border-secondary'
                }`}
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
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
              className={`w-full border p-2 rounded-lg ${errors.lastName ? 'border-red-500' : 'border-secondary'
                }`}
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="new-email"
              readOnly={readOnly}
              className={`w-full border p-2 rounded-lg ${errors.email ? 'border-red-500' : 'border-secondary'
                }`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {formData._id ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña *"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              readOnly={readOnly}
              className={`w-full border p-2 rounded-lg ${errors.password ? 'border-red-500' : 'border-secondary'
                }`}
              required={!formData._id}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            {formData._id && (
              <p className="text-xs text-gray-500 mt-1">
                Deja vacío si no quieres cambiar la contraseña
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button 
              title="Cerrar" 
              action={onClose} 
              tooltip="Cerrar modal" 
            />
            {!readOnly && (
              <Button 
                title="Guardar" 
                action={handleSaveClick}
                tooltip="Guardar administrador"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;