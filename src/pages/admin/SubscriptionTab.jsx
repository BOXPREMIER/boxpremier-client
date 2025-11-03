import React, { useEffect, useState } from "react";
import { getAllPlans } from "../../services/SubscriptionPlanServices";

const PlansTab = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar los planes activos usando el servicio
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const plansRes = await getAllPlans();
      setPlans(plansRes || []);
    } catch (err) {
      console.error("Error cargando planes:", err);
      alert("Error cargando planes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Planes Activos</h2>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 bg-gray-50">
              <th className="p-4">Tipo de Box</th>
              <th className="p-4">Tamaño de Box</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Activo</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Cargando planes...
                </td>
              </tr>
            ) : plans.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No hay planes disponibles
                </td>
              </tr>
            ) : (
              plans.map(plan => (
                <tr key={plan._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4">{plan.boxType || "-"}</td>
                  <td className="p-4">{plan.boxSize || "-"}</td>
                  <td className="p-4">{plan.price != null ? `$${plan.price}` : "-"}</td>
                  <td className="p-4">{plan.active ? "Sí" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlansTab;
