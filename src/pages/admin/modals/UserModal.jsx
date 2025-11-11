import React, { useEffect, useState, useRef } from "react";
import Button from "../../../components/Button"; 

const UserModal = ({ open, onClose, onSubmit, initialData, readOnly }) => {
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    _id: null,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    number: "",
    floor: "",
    postalCode: "",
    city: "",
    province: "",
    country: ""
  });

  const [errors, setErrors] = useState({});

  // Cargar datos iniciales 
  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id || null,
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        password: "",
        phone: initialData.phone || "",
        street: initialData.street || "",
        number: initialData.number || "",
        floor: initialData.floor || "",
        postalCode: initialData.postalCode || "",
        city: initialData.city || "",
        province: initialData.province || "",
        country: initialData.country || ""
      });
    } else {
      // Reset completo cuando no hay initialData (nuevo usuario)
      setFormData({
        _id: null,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        street: "",
        number: "",
        floor: "",
        postalCode: "",
        city: "",
        province: "",
        country: ""
      });
    }
    // Limpiar errores al abrir/cerrar modal
    setErrors({});
  }, [initialData, open]); 

  // Cerrar modal al hacer clic fuera o presionar ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") handleClose();
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  // Manejar cierre con reset opcional
  const handleClose = () => {
    onClose();
  };

  // Manejador de cambios
  const handleChange = (e) => {
    if (readOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario escriba
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es obligatorio";
    if (!formData.lastName.trim()) newErrors.lastName = "El apellido es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio";
    
    // Validación de contraseña
    if (!formData._id) {
      // Para creación: contraseña obligatoria
      if (!formData.password) {
        newErrors.password = "La contraseña es obligatoria";
      } else if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    } else {
      // Para edición: contraseña opcional pero si se ingresa, debe tener al menos 6 caracteres
      if (formData.password && formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar (asegurando el _id)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Preparar datos para enviar
    const dataToSubmit = {
      ...formData,
      status: true,
      preferences: {
        emailNotifications: true
      }
    };

    console.log("📤 Enviando datos de usuario:", dataToSubmit);
    onSubmit(dataToSubmit);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-auto animate-fadeIn max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {formData._id ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Datos personales */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Datos Personales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className={`w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base ${
                    errors.firstName ? 'border-red-500' : 'border-secondary'
                  }`}
                  required
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Apellido *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className={`w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base ${
                    errors.lastName ? 'border-red-500' : 'border-secondary'
                  }`}
                  required
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className={`w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base ${
                    errors.email ? 'border-red-500' : 'border-secondary'
                  }`}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">
                  {formData._id ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña *"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className={`w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base ${
                    errors.password ? 'border-red-500' : 'border-secondary'
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

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className="w-full border border-secondary rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Dirección</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Calle</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className="w-full border border-secondary rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Número</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className="w-full border border-secondary rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Piso/Puerta</label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className="w-full border border-secondary rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Código Postal</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className="w-full border border-secondary rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Ciudad</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className="w-full border border-secondary rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Provincia</label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className="w-full border border-secondary rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">País</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={readOnly}
                  className="w-full border border-secondary rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t">
            <Button 
              title="Cerrar" 
              action={handleClose} 
              tooltip="Cerrar modal" 
              className="w-full sm:w-auto order-2 sm:order-1"
            />
            {!readOnly && (
              <Button 
                title="Guardar" 
                type="submit" 
                tooltip="Guardar cambios" 
                className="w-full sm:w-auto order-1 sm:order-2"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;