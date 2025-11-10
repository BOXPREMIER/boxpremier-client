import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../../../components/Button";

const PlansModal = ({ plan, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    boxType: "",
    boxSize: "",
    price: "",
    active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plan) {
      setFormData({
        boxType: plan.boxType || "",
        boxSize: plan.boxSize || "",
        price: plan.price || "",
        active: plan.active ?? true,
      });
    }
  }, [plan]);

  const validate = () => {
    const newErrors = {};
    if (!formData.boxType.trim()) newErrors.boxType = "El tipo de caja es obligatorio";
    if (!formData.boxSize.trim()) newErrors.boxSize = "El tamaño es obligatorio";
    if (!formData.price || isNaN(formData.price)) newErrors.price = "El precio debe ser un número válido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onSave(formData);
    } catch (err) {
      console.error("Error guardando plan:", err);
      alert("Error al guardar el plan");
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      style={{ fontFamily: "Gotham, sans-serif" }}
    >
      <div 
        className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative"
        style={{ 
          fontFamily: "Gotham, sans-serif",
          color: "#27251F"
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 hover:text-gray-800 transition"
          style={{ color: "#27251F" }}
        >
          <X size={20} />
        </button>

        <h2 
          className="text-xl font-semibold mb-4"
          style={{ 
            fontFamily: "Gotham, sans-serif",
            color: "#27251F"
          }}
        >
          {plan ? "Editar Plan" : "Nuevo Plan"}
        </h2>

        <div className="space-y-3">
          <div>
            <label 
              className="block text-sm font-medium"
              style={{ 
                fontFamily: "Gotham, sans-serif",
                color: "#27251F"
              }}
            >
              Tipo de caja
            </label>
            <input
              type="text"
              name="boxType"
              value={formData.boxType}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              style={{ 
                fontFamily: "Gotham, sans-serif",
                borderColor: "#AB9470"
              }}
            />
            {errors.boxType && <p className="text-red-500 text-sm">{errors.boxType}</p>}
          </div>

          <div>
            <label 
              className="block text-sm font-medium"
              style={{ 
                fontFamily: "Gotham, sans-serif",
                color: "#27251F"
              }}
            >
              Tamaño
            </label>
            <input
              type="text"
              name="boxSize"
              value={formData.boxSize}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              style={{ 
                fontFamily: "Gotham, sans-serif",
                borderColor: "#AB9470"
              }}
            />
            {errors.boxSize && <p className="text-red-500 text-sm">{errors.boxSize}</p>}
          </div>

          <div>
            <label 
              className="block text-sm font-medium"
              style={{ 
                fontFamily: "Gotham, sans-serif",
                color: "#27251F"
              }}
            >
              Precio (€)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              style={{ 
                fontFamily: "Gotham, sans-serif",
                borderColor: "#AB9470"
              }}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            <label
              style={{ 
                fontFamily: "Gotham, sans-serif",
                color: "#27251F"
              }}
            >
              Activo
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <Button title="Cancelar" action={handleCancel} />
          <Button title="Guardar" action={handleSubmit} type="submit" />
        </div>
      </div>
    </div>
  );
};

export default PlansModal;