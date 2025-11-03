import React from "react";

/**
 * StatsCards - muestra 3 tarjetas simples de métricas.
 * Puedes pasar los números desde props o conectarlas a endpoints (ej: /api/stats).
 */
const StatsCards = ({ stats = {} }) => {
  const { activeSubscriptions = 0, paymentsCaptured = 0, paymentsFailed = 0 } = stats;

  const cardClass = "bg-white rounded-lg border p-6 shadow-sm"; // base, ajusta con tailwind de tu Figma

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className={cardClass}>
        <h3 className="text-sm font-semibold">Suscripciones Activas</h3>
        <p className="text-4xl font-bold mt-4">{activeSubscriptions}</p>
        <p className="text-xs text-gray-400 mt-2">Usuarios activos</p>
      </div>

      <div className={cardClass}>
        <h3 className="text-sm font-semibold">Pagos realizados correctamente</h3>
        <p className="text-4xl font-bold mt-4">{paymentsCaptured}</p>
        <p className="text-xs text-gray-400 mt-2">Éxito en suscripciones</p>
      </div>

      <div className={cardClass}>
        <h3 className="text-sm font-semibold">Pagos Rechazados</h3>
        <p className="text-4xl font-bold mt-4">{paymentsFailed}</p>
        <p className="text-xs text-gray-400 mt-2">Requiere atención</p>
      </div>
    </div>
  );
};

export default StatsCards;
