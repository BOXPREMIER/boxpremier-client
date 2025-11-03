import React, { useEffect, useState } from "react";
import { fetchActivePlans } from "../../services/subscriptionsService"; 

const PlansTab = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetchActivePlans(); 
      console.log("Planes cargados:", res);
      setPlans(res || []);
    } catch (err) {
      console.error("Error al cargar planes:", err);
      alert("Error cargando los planes de suscripción.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Planes de Suscripción</h2>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 bg-gray-50">
              <th className="p-4">Tipo</th>
              <th className="p-4">Precio (€)</th>
              <th className="p-4">Activo</th>
              <th className="p-4">Fecha de creación</th>
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
              plans.map((plan) => (
                <tr
                  key={plan._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 capitalize">{plan.boxType || "-"}</td>
                  <td className="p-4">
                    {plan.price ? `${plan.price.toFixed(2)} €` : "-"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        plan.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {plan.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4">
                    {plan.createdAt
                      ? new Date(plan.createdAt).toLocaleDateString("es-ES")
                      : "-"}
                  </td>
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
