import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "../../components/Button";

const PaymentDetailsModal = ({ payment, onClose, onUpdatePayment, isAdmin = true }) => {
  if (!payment) return null;

  // --- state ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(payment?.status || "pending");
  const [saving, setSaving] = useState(false);

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

  const user = payment?.subscriptionId?.user || {};
  const subscription = payment?.subscriptionId || {};
  const address = user?.address || {};

  const wineTypeMap = { mixed: "Mixto", rose: "Rosé", red: "Tinto", white: "Blanco", sparkling: "Espumoso" };
  const boxTypeMap = { basic: "Basic", premium: "Premium", deluxe: "Deluxe" };
  const statusMap = { pending: "Pendiente", completed: "Completado", failed: "Fallido" };
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[(status || "").toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const handleEditClick = () => {
    setSelectedStatus(payment.status);
    setShowEditModal(true);
  };

  const handleSaveStatus = async () => {
    if (!onUpdatePayment) {
      console.error("onUpdatePayment no está definido");
      return;
    }
    try {
      setSaving(true);
      const paymentId = payment._id || payment.id;
      await onUpdatePayment(paymentId, { status: selectedStatus });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Error al actualizar el estado del pedido");
    } finally {
      setSaving(false);
    }
  };

  const saveDisabled = saving || selectedStatus === payment.status;

  return (
    <>
      {/* Modal de Detalles */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Detalles del Pago</h2>
            {/* Botón de cierre (icon-only) */}
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
                <p className="text-lg font-mono font-semibold text-gray-900">#{payment._id || payment.id}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                {statusMap[(payment.status || "").toLowerCase()] || payment.status}
              </span>
            </div>

            <hr className="border-gray-200" />

            {/* Información del Cliente y Dirección */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dirección de Entrega</h3>
                <div className="space-y-1 text-base text-gray-900">
                  {address.street && <p>{address.street}</p>}
                  {address.postalCode && address.city && <p>{address.postalCode} {address.city}</p>}
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
                    {boxTypeMap[(subscription.boxType || "").toLowerCase()] || subscription.boxType || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo de Vino</p>
                  <p className="text-base font-medium text-gray-900 capitalize">
                    {wineTypeMap[(subscription.wineType || "").toLowerCase()] || subscription.wineType || "-"}
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
                  <p className="text-base font-mono text-gray-900 truncate">{subscription._id || "-"}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gateway</p>
                  <p className="text-base font-medium text-gray-900 capitalize">{payment.gateway || "-"}</p>
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
                    <p className="text-base font-mono text-gray-900 break-all">{payment.transactionId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de Envío */}
            {(payment.trackingNumber || payment.carrier || payment.shippingStatus) && (
              <>
                <hr className="border-gray-200" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Información de Envío</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {payment.trackingNumber && (
                      <div>
                        <p className="text-sm text-gray-600">Número de Seguimiento</p>
                        <p className="text-base font-mono text-gray-900">{payment.trackingNumber}</p>
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
                        <p className="text-base text-gray-900 capitalize">{payment.shippingStatus}</p>
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

            {/* Notas */}
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

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
            <Button title="Cerrar" action={onClose} />
            {isAdmin && (
              <Button title="Editar Pedido" action={handleEditClick} bgColor="#AD946C" />
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edición (estado) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Editar Pedido</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">ID del Pedido</p>
                <p className="text-base font-mono font-semibold text-gray-900">
                  #{payment._id || payment.id}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado del Pedido</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  disabled={saving}
                >
                  <option value="pending">Pendiente</option>
                  <option value="completed">Completado</option>
                  <option value="failed">Fallido</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">Estados disponibles según el modelo de base de datos</p>
              </div>

              <div className="flex justify-end gap-3">
                {/* Cancelar (bloqueado mientras guarda) */}
                <div className={saving ? "opacity-50 pointer-events-none" : ""}>
                  <Button title="Cancelar" action={() => setShowEditModal(false)} />
                </div>

                {/* Guardar (bloqueado si no hay cambios o si guarda) */}
                <div className={saveDisabled ? "opacity-50 pointer-events-none" : ""}>
                  <Button title="Guardar" action={handleSaveStatus} bgColor="#AD946C" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentDetailsModal;
