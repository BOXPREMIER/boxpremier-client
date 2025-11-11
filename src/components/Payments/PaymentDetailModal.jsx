import React from "react";
import { X } from "lucide-react";

const PaymentDetailsModal = ({ payment, onClose, onEdit }) => {
  if (!payment) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount || 0);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  // Extraer datos del usuario
  const user = payment?.subscriptionId?.user || {};
  const subscription = payment?.subscriptionId || {};
  const address = user?.address || {};

  // Mapeo de tipos de vino
  const wineTypeMap = {
    mixed: "Mixto",
    rose: "Rosé",
    red: "Tinto",
    white: "Blanco",
    sparkling: "Espumoso"
  };

  // Mapeo de tipos de box
  const boxTypeMap = {
    basic: "Basic",
    premium: "Premium",
    deluxe: "Deluxe"
  };

  // Mapeo de estados de pago
  const statusMap = {
    pending: "Pendiente",
    paid: "Pagado",
    completed: "Completado",
    failed: "Fallido",
    canceled: "Cancelado",
    refunded: "Reembolsado"
  };

  // Color del badge según estado
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
      canceled: "bg-gray-100 text-gray-800",
      refunded: "bg-purple-100 text-purple-800"
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Detalles del Pago</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* ID y Estado */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">ID del Pago</p>
              <p className="text-lg font-mono font-semibold text-gray-900">
                #{payment._id || payment.id}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                payment.status
              )}`}
            >
              {statusMap[payment.status?.toLowerCase()] || payment.status}
            </span>
          </div>

          <hr className="border-gray-200" />

          {/* Información del Cliente y Dirección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cliente</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="text-base font-medium text-gray-900">
                    {user.firstName || ""} {user.lastName || ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-base text-gray-900">{user.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="text-base text-gray-900">{user.phone || "-"}</p>
                </div>
              </div>
            </div>

            {/* Dirección de Entrega */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dirección de Entrega</h3>
              <div className="space-y-1 text-base text-gray-900">
                {address.street && <p>{address.street}</p>}
                {address.postalCode && address.city && (
                  <p>
                    {address.postalCode} {address.city}
                  </p>
                )}
                {address.province && <p>{address.province}, {address.country || "ES"}</p>}
                {!address.street && !address.postalCode && <p className="text-gray-500">-</p>}
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Detalles de la Suscripción */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalles de la Suscripción</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Tipo de Box</p>
                <p className="text-base font-medium text-gray-900 capitalize">
                  {boxTypeMap[subscription.boxType?.toLowerCase()] || subscription.boxType || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de Vino</p>
                <p className="text-base font-medium text-gray-900 capitalize">
                  {wineTypeMap[subscription.wineType?.toLowerCase()] || subscription.wineType || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tamaño</p>
                <p className="text-base font-medium text-gray-900">
                  {subscription.boxSize ? `${subscription.boxSize} botellas` : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID de Suscripción</p>
                <p className="text-base font-mono text-gray-900 truncate">
                  {subscription._id || "-"}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Información del Pago */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Pago</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Monto</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gateway</p>
                <p className="text-base font-medium text-gray-900 capitalize">
                  {payment.gateway || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Creación</p>
                <p className="text-base text-gray-900">{formatDate(payment.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Actualización</p>
                <p className="text-base text-gray-900">{formatDate(payment.updatedAt)}</p>
              </div>
              {payment.transactionId && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">ID de Transacción</p>
                  <p className="text-base font-mono text-gray-900 break-all">
                    {payment.transactionId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información de Envío (si existe) */}
          {(payment.trackingNumber || payment.carrier || payment.shippingStatus) && (
            <>
              <hr className="border-gray-200" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Información de Envío</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {payment.trackingNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Número de Seguimiento</p>
                      <p className="text-base font-mono text-gray-900">
                        {payment.trackingNumber}
                      </p>
                    </div>
                  )}
                  {payment.carrier && (
                    <div>
                      <p className="text-sm text-gray-600">Transportista</p>
                      <p className="text-base text-gray-900 capitalize">{payment.carrier}</p>
                    </div>
                  )}
                  {payment.shippingStatus && (
                    <div>
                      <p className="text-sm text-gray-600">Estado de Envío</p>
                      <p className="text-base text-gray-900 capitalize">
                        {payment.shippingStatus}
                      </p>
                    </div>
                  )}
                  {payment.shippedAt && (
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Envío</p>
                      <p className="text-base text-gray-900">{formatDate(payment.shippedAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Notas (si existen) */}
          {payment.notes && (
            <>
              <hr className="border-gray-200" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notas</h3>
                <p className="text-base text-gray-700 whitespace-pre-wrap">{payment.notes}</p>
              </div>
            </>
          )}
        </div>

        {/* Footer con botones */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Cerrar
          </button>
          {onEdit && (
            <button
              onClick={() => {
                onEdit(payment);
                onClose();
              }}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Editar Pago
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
