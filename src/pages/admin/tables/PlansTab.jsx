import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import PlansModal from "../modals/PlansModal";
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../../../services/SubscriptionPlanServices"; 

const PlansTab = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
console.log("🔵 Estado isModalOpen:", isModalOpen);
  const [loading, setLoading] = useState(true);

  // 📦 Cargar planes al montar el componente
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getAllPlans();
      setPlans(data);
    } catch (error) {
      console.error("Error al cargar los planes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan = null) => {
    console.log("Abriendo modal con plan:", plan);
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Cerrando modal desde padre");
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedPlan) {
        // ✏️ Editar plan existente
        await updatePlan(selectedPlan._id, formData);
      } else {
        // ➕ Crear nuevo plan
        await createPlan(formData);
      }
      await fetchPlans(); // recarga la lista
      handleCloseModal(); // Cerrar modal después de guardar
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      throw error; // Re-lanzar para que el modal lo maneje
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este plan?")) {
      try {
        await deletePlan(id);
        setPlans(plans.filter((plan) => plan._id !== id));
      } catch (error) {
        console.error("Error al eliminar el plan:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Planes de Suscripción</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:scale-[1.07] cursor-pointer"
        >
          <Plus size={18} /> Nuevo Plan
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Tamaño</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-left">Activo</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Cargando planes...
                </td>
              </tr>
            ) : plans.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No hay planes disponibles.
                </td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{plan.boxType}</td>
                  <td className="p-3">{plan.boxSize}</td>
                  <td className="p-3">${plan.price.toFixed(2)}</td>
                  <td className="p-3">
                    {plan.active ? (
                      <span className="text-green-600 font-semibold">Activo</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Inactivo</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleOpenModal(plan)}
                        className="text-secondary hover:scale-[2.10] cursor-pointer transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="text-primary hover:scale-[2.10] cursor-pointer transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Renderizar modal solo si está abierto */}
     {isModalOpen && (
  <PlansModal // ← Cambia esto
    plan={selectedPlan}
    onClose={handleCloseModal}
    onSave={handleSave}
  />
)}
    </div>
  );
};

export default PlansTab;