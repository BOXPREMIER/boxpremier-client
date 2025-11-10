import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../../../components/Button";
import Swal from 'sweetalert2';

const PlansModal = ({ plan, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    boxType: "",
    boxSize: "", // Mantener como string en el estado del formulario
    price: "",
    active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plan) {
      setFormData({
        boxType: plan.boxType || "",
        boxSize: String(plan.boxSize || ""), // Convertir número a string para el input
        price: String(plan.price || ""), // También convertir precio a string para el input
        active: plan.active ?? true,
      });
    } else {
      // Resetear el formulario cuando no hay plan (crear nuevo)
      setFormData({
        boxType: "",
        boxSize: "",
        price: "",
        active: true,
      });
    }
  }, [plan]);

  const validate = () => {
    const newErrors = {};
    
    // Validar boxType
    if (!String(formData.boxType || "").trim()) {
      newErrors.boxType = "El tipo de caja es obligatorio";
    }
    
    // Validar boxSize - convertir a número y validar
    const boxSizeNum = parseInt(formData.boxSize);
    if (isNaN(boxSizeNum) || boxSizeNum <= 0) {
      newErrors.boxSize = "El tamaño debe ser un número válido mayor a 0";
    }
    
    // Validar precio
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue < 0) {
      newErrors.price = "El precio debe ser un número válido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      // Preparar datos para enviar - convertir a los tipos correctos para MongoDB
      const dataToSave = {
        boxType: formData.boxType,
        boxSize: parseInt(formData.boxSize), // Convertir a número para MongoDB
        price: parseFloat(formData.price),   // Convertir a número para MongoDB
        active: formData.active
      };
      
      await onSave(dataToSave);
    } catch (err) {
      console.error("Error guardando plan:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el plan. Por favor, intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4"
      style={{ fontFamily: "Gotham, sans-serif" }}
    >
      <div 
        className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto relative max-h-[90vh] overflow-y-auto"
        style={{ 
          fontFamily: "Gotham, sans-serif",
          color: "#27251F"
        }}
      >
        {/* Header sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 
              className="text-lg sm:text-xl font-semibold"
              style={{ 
                fontFamily: "Gotham, sans-serif",
                color: "#27251F"
              }}
            >
              {plan ? "Editar Plan" : "Nuevo Plan"}
            </h2>
            <button
              onClick={onClose}
              className="hover:text-gray-800 transition p-1"
              style={{ color: "#27251F" }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form content */}
        <div className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-3">
            {/* Box Type - Cambiar a select para coincidir con el enum del schema */}
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ 
                  fontFamily: "Gotham, sans-serif",
                  color: "#27251F"
                }}
              >
                Tipo de caja
              </label>
              <select
                name="boxType"
                value={formData.boxType}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                style={{ 
                  fontFamily: "Gotham, sans-serif",
                  borderColor: "#AB9470"
                }}
              >
                <option value="">Seleccionar tipo</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
              {errors.boxType && <p className="text-red-500 text-sm mt-1">{errors.boxType}</p>}
            </div>

            {/* Box Size - Input numérico pero manejado como string en el estado */}
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ 
                  fontFamily: "Gotham, sans-serif",
                  color: "#27251F"
                }}
              >
                Tamaño
              </label>
              <input
                type="number"
                name="boxSize"
                value={formData.boxSize}
                onChange={handleChange}
                min="1"
                className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                style={{ 
                  fontFamily: "Gotham, sans-serif",
                  borderColor: "#AB9470"
                }}
                placeholder="Ej: 3"
              />
              {errors.boxSize && <p className="text-red-500 text-sm mt-1">{errors.boxSize}</p>}
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ 
                  fontFamily: "Gotham, sans-serif",
                  color: "#27251F"
                }}
              >
                Precio (€)
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                style={{ 
                  fontFamily: "Gotham, sans-serif",
                  borderColor: "#AB9470"
                }}
                placeholder="Ej: 29.99"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label
                className="text-sm sm:text-base"
                style={{ 
                  fontFamily: "Gotham, sans-serif",
                  color: "#27251F"
                }}
              >
                Activo
              </label>
            </div>
          </div>

          {/* Botones responsive */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t">
            <Button 
              title="Cancelar" 
              action={handleCancel} 
              className="w-full sm:w-auto order-2 sm:order-1"
            />
            <Button 
              title="Guardar" 
              action={handleSubmit} 
              type="submit" 
              className="w-full sm:w-auto order-1 sm:order-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansModal;