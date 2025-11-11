import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import PlansModal from "../modals/PlansModal";
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../../../services/SubscriptionPlanServices"; 
import Swal from 'sweetalert2';

const PlansTab = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los planes',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan = null) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedPlan) {
        // ✏️ Editar plan existente
        await updatePlan(selectedPlan._id, formData);
        Swal.fire({
          title: '¡Plan actualizado!',
          text: 'El plan se actualizó correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
        });
      } else {
        // ➕ Crear nuevo plan
        await createPlan(formData);
        Swal.fire({
          title: '¡Plan creado!',
          text: 'El nuevo plan se creó correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
        });
      }
      await fetchPlans(); // recarga la lista
      handleCloseModal(); // Cerrar modal después de guardar
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar el plan. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33',
      });
      throw error; // Re-lanzar para que el modal lo maneje
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deletePlan(id);
        setPlans(plans.filter((plan) => plan._id !== id));
        Swal.fire({
          title: "¡Eliminado!",
          text: "El plan ha sido eliminado.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3085d6",
        });
      } catch (error) {
        console.error("Error al eliminar el plan:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el plan.",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
          Planes de Suscripción
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-secondary text-white px-4 py-2 sm:py-2 rounded-lg hover:scale-[1.02] cursor-pointer transition-transform w-full sm:w-auto"
        >
          <Plus size={18} /> 
          <span className="text-sm sm:text-base">Nuevo Plan</span>
        </button>
      </div>

      {/* Vista de escritorio - Tabla */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-xl shadow-md">
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
                        className="text-secondary hover:scale-110 cursor-pointer transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="text-primary hover:scale-110 cursor-pointer transition"
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

      {/* Vista móvil - Cards */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="text-center p-4 bg-white rounded-xl shadow-md">
            Cargando planes...
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center p-4 bg-white rounded-xl shadow-md">
            No hay planes disponibles.
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              {/* Información principal */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Tipo</span>
                  <span className="text-base font-semibold">{plan.boxType}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Tamaño</span>
                  <span className="text-base font-semibold">{plan.boxSize}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Precio</span>
                  <span className="text-base font-semibold text-green-600">
                    ${plan.price.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Estado</span>
                  <span className={`text-sm font-semibold ${
                    plan.active ? "text-green-600" : "text-red-500"
                  }`}>
                    {plan.active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleOpenModal(plan)}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white py-2 px-3 rounded-lg hover:bg-secondary/90 transition-colors text-sm"
                >
                  <Pencil size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2 px-3 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PlansModal
          plan={selectedPlan}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PlansTab;