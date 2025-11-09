import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../../components/Button"; // Asegúrate de que la ruta sea correcta

const PlanModal = ({ plan, onClose, onSave }) => {
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
        active: plan.active !== undefined ? plan.active : true,
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.boxType.trim()) {
      newErrors.boxType = "El tipo de box es obligatorio";
    }
    
    const boxSize = Number(formData.boxSize);
    if (!formData.boxSize || isNaN(boxSize) || boxSize <= 0) {
      newErrors.boxSize = "El tamaño debe ser un número mayor a 0";
    }
    
    const price = Number(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = "El precio debe ser un número mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      // Convertir a números antes de enviar
      const dataToSave = {
        boxType: formData.boxType,
        boxSize: parseInt(formData.boxSize, 10),
        price: parseFloat(formData.price),
        active: Boolean(formData.active),
      };
      
      
      
      await onSave(dataToSave);
      onClose();
    } catch (err) {
      let errorMsg = "Error al guardar el plan";
      
      if (err.response?.data) {
    
        
        errorMsg = serverError.message || 
                   serverError.error || 
                   serverError.errors?.[0]?.msg ||
                   serverError.errors?.[0]?.message ||
                   JSON.stringify(serverError);
      }
      
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleCancel = async () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">
            {plan ? "Editar Plan" : "Crear Nuevo Plan"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Box <span className="text-red-500">*</span>
            </label>
            <select
              name="boxType"
              value={formData.boxType}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                errors.boxType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Selecciona un tipo</option>
              <option value="basic">Básico</option>
              <option value="premium">Premium</option>
            </select>
            {errors.boxType && <p className="text-red-500 text-sm mt-1">{errors.boxType}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tamaño de Box (número de productos) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="boxSize"
              value={formData.boxSize}
              onChange={handleChange}
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                errors.boxSize ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: 3"
            />
            {errors.boxSize && <p className="text-red-500 text-sm mt-1">{errors.boxSize}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Precio ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: 29.99"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2"
            />
            <label className="text-sm font-semibold text-gray-700">Plan Activo</label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <Button
              title="Cancelar"
              action={handleCancel}
              tooltip="Cerrar sin guardar cambios"
            />
            <Button
              title={plan ? "Actualizar" : "Crear"}
              action={handleSubmit}
              tooltip={plan ? "Guardar cambios del plan" : "Crear nuevo plan de suscripción"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;