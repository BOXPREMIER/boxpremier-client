import React from "react";
import { X } from "lucide-react";

const OrderDetailsModal = ({ order, onClose, onEdit }) => {
    if (!order) return null;

    const statusLabels = {
        pending: "Pendiente",
        preparing: "Preparando",
        shipped: "Enviado",
        delivered: "Entregado",
        cancelled: "Cancelado"
    };

    const winetype = {
        mixed: "mixto",
        rose: "rosé",
        red: "tinto",
        sparkling: "espumoso"
    };

    const isGift = order.subscriptionId?.giftInfo?.isGift;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Detalles del Pedido</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-600">ID del Pedido</p>
                            <p className="text-lg font-mono font-semibold">#{order._id}</p>
                        </div>
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary text-white">
                                {statusLabels[order.status] || order.status}
                            </span>
                        </div>
                    </div>

                    {isGift && (
                        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="font-semibold text-pink-900">Este es un regalo</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Enviado por:</span>
                                    <span className="ml-2 text-gray-900">
                                        {order.subscriptionId.giftInfo.giftGiverUserId?.firstName} {order.subscriptionId.giftInfo.giftGiverUserId?.lastName}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Para:</span>
                                    <span className="ml-2 text-gray-900">
                                        {order.subscriptionId.giftInfo.recipientName}
                                    </span>
                                </div>
                                {order.subscriptionId.giftInfo.giftMessage && (
                                    <div>
                                        <span className="font-medium text-gray-700">Mensaje:</span>
                                        <p className="ml-2 text-gray-900 italic">"{order.subscriptionId.giftInfo.giftMessage}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">

                                <h3 className="font-semibold text-lg">Cliente</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="font-medium text-gray-700">Nombre</p>
                                    <p className="text-gray-900">{order.userId?.firstName} {order.userId?.lastName}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Email</p>
                                    <p className="text-gray-900">{order.userId?.email}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Teléfono</p>
                                    <p className="text-gray-900">{order.phone || "-"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">

                                <h3 className="font-semibold text-lg">Dirección de Entrega</h3>
                            </div>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-900">{order.street} {order.number}</p>
                                {order.floor && <p className="text-gray-900">{order.floor}</p>}
                                <p className="text-gray-900">{order.postalCode} {order.city}</p>
                                <p className="text-gray-900">{order.province}, {order.country}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-3">

                            <h3 className="font-semibold text-lg">Detalles de la Suscripción</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-gray-700">Tipo de Box</p>
                                <p className="text-gray-900 capitalize">{order.subscriptionId?.boxType || "-"}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Tipo de Vino</p>
                                <p className="text-gray-900 capitalize"> {winetype[order.subscriptionId?.wineType] || "-"}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Tamaño</p>
                                <p className="text-gray-900">{order.subscriptionId?.boxSize || "-"} botellas</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold text-lg">Información de Envío</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-gray-700">Tracking Number</p>
                                <p className="text-gray-900 font-mono">{order.trackingNumber || "Sin asignar"}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Transportista</p>
                                <p className="text-gray-900">{order.carrier || "Sin asignar"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-gray-700">Fecha de Creación</p>
                                <p className="text-gray-900">{new Date(order.createdAt).toLocaleString("es-ES")}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Última Actualización</p>
                                <p className="text-gray-900">{new Date(order.updatedAt).toLocaleString("es-ES")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-2xl font-bold text-secondary">€{order.totalAmount?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={onEdit}
                        className="px-4 py-2 bg-secondary text-white rounded-lg hover:brightness-90 transition-colors cursor-pointer"
                    >
                        Editar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;