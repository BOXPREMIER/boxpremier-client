import React, { useState } from "react";
import { X } from "lucide-react";
import { updateOrderStatus, updateOrderTracking, updateOrderAddress } from "../../services/OrderServices";
import { showCustomAlert } from "../CustomAlert";

const OrderEdit = ({ order, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        status: order.status,
        trackingNumber: order.trackingNumber || "",
        carrier: order.carrier || "",
        street: order.street,
        number: order.number,
        floor: order.floor || "",
        postalCode: order.postalCode,
        city: order.city,
        province: order.province,
        country: order.country
    });

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("status");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (activeTab === "status" && formData.status !== order.status) {
                await updateOrderStatus(order._id, formData.status);
            }

            if (activeTab === "tracking") {
                await updateOrderTracking(order._id, {
                    trackingNumber: formData.trackingNumber,
                    carrier: formData.carrier
                });
            }

            if (activeTab === "address") {
                await updateOrderAddress(order._id, {
                    street: formData.street,
                    number: formData.number,
                    floor: formData.floor,
                    postalCode: formData.postalCode,
                    city: formData.city,
                    province: formData.province,
                    country: formData.country
                });
            }

            onSuccess();
        } catch (error) {
            console.error("Error al actualizar pedido:", error);
            showCustomAlert({
                title: "Error",
                text: "Error al actualizar el pedido.",
                confirmText: "Cerrar",
                showCancelButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full md:w-[500px] h-full md:h-auto md:max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Editar Pedido</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-600">ID del Pedido</p>
                        <p className="text-lg font-mono font-semibold">#{order._id}</p>
                    </div>

                    <div className="flex gap-2 mb-6 border-b">
                        <button
                            onClick={() => setActiveTab("status")}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === "status"
                                ? "text-primary border-b-2 border-secondary"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Estado
                        </button>
                        <button
                            onClick={() => setActiveTab("tracking")}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === "tracking"
                                ? "text-primary border-b-2 border-secondary"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Tracking
                        </button>
                        <button
                            onClick={() => setActiveTab("address")}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === "address"
                                ? "text-primary border-b-2 border-secondary"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Dirección
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {activeTab === "status" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado del Pedido
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                                >
                                    <option value="pending">Pendiente</option>
                                    <option value="preparing">Preparando</option>
                                    <option value="shipped">Enviado</option>
                                    <option value="delivered">Entregado</option>
                                    <option value="cancelled">Cancelado</option>
                                </select>
                            </div>
                        )}

                        {activeTab === "tracking" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número de Tracking
                                    </label>
                                    <input
                                        type="text"
                                        name="trackingNumber"
                                        value={formData.trackingNumber}
                                        onChange={handleChange}
                                        placeholder="Ej: ES123456789"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Transportista
                                    </label>
                                    <input
                                        type="text"
                                        name="carrier"
                                        value={formData.carrier}
                                        onChange={handleChange}
                                        placeholder="Ej: SEUR, Correos"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === "address" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Calle
                                    </label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número
                                        </label>
                                        <input
                                            type="text"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Piso (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            name="floor"
                                            value={formData.floor}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Código Postal
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ciudad
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Provincia
                                    </label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        País
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-secondary text-white rounded-lg hover:brightness-90 transition-colors cursor-pointer"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-secondary text-white rounded-lg hover:brightness-90 transition-colors cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrderEdit;