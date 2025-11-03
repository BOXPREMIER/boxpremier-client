import React, { useEffect, useState } from "react";
import { getSubscriptions, fetchActivePlans } from "../../services/subscriptionsService";
import { getUsers } from "../../services/UserServices";

const SubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // 🔹 Fetch suscripciones y planes
  const fetchData = async () => {
    setLoading(true);
    try {
      const [subsRes, plansRes, usersRes] = await Promise.all([
        getSubscriptions(),
        fetchActivePlans(),
        getUsers(),
      ]);

      setSubscriptions(subsRes || []);
      setPlans(plansRes || []);
      setUsers(usersRes || []);
    } catch (err) {
      console.error("Error cargando suscripciones:", err);
      alert("Error cargando datos de suscripciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 // 🔹 Función para obtener el boxType del plan por ID
const getPlanBoxType = (planId) => {
  const plan = plans.find(p => p._id === planId);
  return plan ? plan.boxType : "-";
};
const getUserName = (userId) => {
  const user = users.find(u => u._id === userId || u.id === userId);
  return user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "-";
};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Suscripciones</h2>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 bg-gray-50">
              <th className="p-4">Usuario </th>
              <th className="p-4">Plan</th>
              <th className="p-4">Wine Type</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Fecha Inicio</th>
              <th className="p-4">Próximo pago</th>
              <th className="p-4">Método de pago</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  Cargando suscripciones...
                </td>
              </tr>
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No hay suscripciones disponibles
                </td>
              </tr>
            ) : (
              subscriptions.map(sub => (
                <tr key={sub._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4">{getUserName(sub.users)}</td>
                  <td className="p-4">{getPlanBoxType(sub.subscriptionsPlan)}</td>
                  <td className="p-4">{sub.wineType || "-"}</td>
                  <td className="p-4">{sub.status || "-"}</td>
                  <td className="p-4">{sub.startDate ? new Date(sub.startDate).toLocaleDateString("es-ES") : "-"}</td>
                  <td className="p-4">{sub.nextPayDate ? new Date(sub.nextPayDate).toLocaleDateString("es-ES") : "-"}</td>
                  <td className="p-4">{sub.payMethod || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionsTab;
