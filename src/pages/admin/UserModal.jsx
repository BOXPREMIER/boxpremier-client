import React, { useEffect, useState, useRef } from "react";
import { getSubscriptions } from "../../services/SubscriptionServices";

const UserModal = ({ open, onClose, onSubmit, initialData, readOnly }) => {
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userType: "user",
    planName: "",
    status: "",
    startDate: "",
    nextBillingDate: "",
  });

  const [plans, setPlans] = useState([]);

  // Cargar datos iniciales y planes
  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        userType: initialData.userType || "user",
        planName: initialData.planName || "",
        status: initialData.status || "",
        startDate: initialData.startDate || "",
        nextBillingDate: initialData.nextBillingDate || "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        userType: "user",
        planName: "",
        status: "",
        startDate: "",
        nextBillingDate: "",
      });
    }

    const fetchPlans = async () => {
      try {
        const res = await getSubscriptions();
        setPlans(res);
      } catch (error) {
        console.error("Error al cargar planes:", error);
      }
    };

    fetchPlans();
  }, [initialData]);

  // Cerrar modal si haces clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
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

  // Manejador de cambios
  const handleChange = (e) => {
    if (readOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 animate-fadeIn"
      >
        <h2 className="text-2xl font-bold text-primary mb-4">
          {initialData ? "Editar Usuario" : "Nuevo Usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Campos personales */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-secondary rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-secondary rounded-lg p-2"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-secondary rounded-lg p-2"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-secondary rounded-lg p-2"
            />
          </div>

          {/* Tipo de usuario */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Tipo de Usuario</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-secondary rounded-lg p-2"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Plan */}
          <div>
            <label className="block text-sm font-medium mb-1">Plan</label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-secondary rounded-lg p-2"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-secondary rounded-lg p-2"
            >
              <option value="">Seleccionar...</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="canceled">Cancelado</option>
            </select>
          </div>

          {/* Fechas */}
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Inicio</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-secondary rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Próximo Cobro</label>
            <input
              type="date"
              name="nextBillingDate"
              value={formData.nextBillingDate}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-secondary rounded-lg p-2"
            />
          </div>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              Cerrar
            </button>
            {!readOnly && (
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-80 transition"
              >
                Guardar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
