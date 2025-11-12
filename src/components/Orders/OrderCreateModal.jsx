import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { getUsers } from "../../services/UserServices";
import { getUserSubscriptions } from "../../services/SubscriptionServices";
import { createOrder, getAllOrders } from "../../services/OrderServices";
import { showCustomAlert } from "../CustomAlert";


const OrderCreateModal = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            const customers = data.filter(user => user.userType === 'customer');
            setUsers(customers);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            showCustomAlert({
                title: "Error",
                text: "Error al cargar usuarios.",
                confirmText: "Cerrar",
                type: "error"
            });
        }
    };

    const fetchUserSubscriptions = async (userId) => {
        setLoading(true);
        try {
            const [subsData, ordersData] = await Promise.all([
                getUserSubscriptions(userId),
                getAllOrders()
            ]);

            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            const userOrdersThisMonth = ordersData.filter(order => {
                const orderDate = new Date(order.createdAt);
                return order.userId?._id === userId &&
                    orderDate.getMonth() === currentMonth &&
                    orderDate.getFullYear() === currentYear;
            });

            const subsWithOrderThisMonth = userOrdersThisMonth.map(o => o.subscriptionId?._id);

            const activeSubs = subsData.filter(sub =>
                !["paused", "canceled", "expired"].includes(sub.status)
            );

            const subsWithFlag = activeSubs.map(sub => ({
                ...sub,
                hasOrderThisMonth: subsWithOrderThisMonth.includes(sub._id)
            }));

            setSubscriptions(subsWithFlag);

            if (subsWithFlag.length === 0) {
                showCustomAlert({
                    title: "Sin suscripciones activas",
                    text: "Este cliente no tiene suscripciones activas.",
                    confirmText: "Entendido",
                    showCancelButton: false,
                    onConfirm: () => {
                        setStep(1);
                        setSelectedUser(null);
                    },
                });
                setStep(1);
                setSelectedUser(null);
            } else {
                setStep(2);
            }
        } catch (error) {
            console.error("Error al cargar suscripciones:", error);
            showCustomAlert({
                title: "Error",
                text: "Error al cargar las suscripciones del cliente.",
                confirmText: "Cerrar",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        fetchUserSubscriptions(user._id);
    };

    const handleSelectSubscription = (subscription) => {
        if (subscription.hasOrderThisMonth) {
            showCustomAlert({
                title: "Suscripción ya usada",
                text: "Esta suscripción ya tiene un pedido creado este mes.",
                confirmText: "Entendido",
                showCancelButton: false,
            });
            return;
        }
        setSelectedSubscription(subscription);
        setStep(3);
    };

    const handleCreateOrder = async () => {
        setLoading(true);
        try {
            await createOrder({
                userId: selectedUser._id,
                subscriptionId: selectedSubscription._id
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error al crear pedido:", error);
            showCustomAlert({
                title: "Error al crear pedido",
                text: "Ocurrió un error al crear el pedido. Inténtalo de nuevo.",
                confirmText: "Cerrar",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
        const email = user.email?.toLowerCase() || "";
        return fullName.includes(searchLower) || email.includes(searchLower);
    });

    const winetype = {
        mixed: "mixto",
        rose: "rosé",
        red: "tinto",
        sparkling: "espumoso"
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Crear Pedido Manual</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {step === 1 && "Paso 1: Seleccionar cliente"}
                            {step === 2 && "Paso 2: Seleccionar suscripción"}
                            {step === 3 && "Paso 3: Confirmar datos"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar cliente por nombre o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {filteredUsers.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">
                                        No se encontraron clientes
                                    </p>
                                ) : (
                                    filteredUsers.map(user => (
                                        <button
                                            key={user._id}
                                            onClick={() => handleSelectUser(user)}
                                            className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer"
                                        >
                                            <div className="font-medium">
                                                {user.firstName} {user.lastName}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {user.email}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4 mb-4">
                                <p className="text-sm font-medium text-primary">
                                    Cliente seleccionado:
                                </p>
                                <p className="text-secondary">
                                    {selectedUser?.firstName} {selectedUser?.lastName} - {selectedUser?.email}
                                </p>
                            </div>

                            <h3 className="font-semibold text-lg mb-3">
                                Selecciona una suscripción activa:
                            </h3>

                            {loading ? (
                                <p className="text-center text-gray-500 py-8">Cargando suscripciones...</p>
                            ) : (
                                <div className="space-y-3">
                                    {subscriptions.map(sub => (
                                        <button
                                            key={sub._id}
                                            onClick={() => handleSelectSubscription(sub)}
                                            disabled={sub.hasOrderThisMonth}
                                            className={`w-full text-left p-4 border border-gray-200 rounded-lg transition-colors ${sub.hasOrderThisMonth
                                                ? 'bg-gray-100 cursor-not-allowed opacity-60'
                                                : 'hover:bg-gray-100 hover:border-primary cursor-pointer'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="font-medium capitalize">
                                                        Box {sub.boxType}
                                                    </span>
                                                    <span className="mx-2">•</span>
                                                    <span className="capitalize">{winetype[sub.wineType] || sub.wineType}</span>
                                                </div>
                                                <span className="text-green-600 text-sm font-medium">
                                                    Activa
                                                </span>
                                                <span className={`text-sm font-medium ${sub.hasOrderThisMonth ? 'text-orange-600' : 'text-green-600'
                                                    }`}>
                                                    {sub.hasOrderThisMonth ? 'Ya tiene pedido este mes' : 'Disponible'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {sub.boxSize} botellas - €{sub.subscriptionPlanId?.price}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setStep(1);
                                    setSelectedUser(null);
                                    setSubscriptions([]);
                                }}
                                className="text-primary hover:text-blue-800 text-sm mt-4 cursor-pointer"
                            >
                                ← Volver a selección de cliente
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="bg-white border border-primary rounded-lg p-4">
                                <h3 className="font-semibold text-primary mb-3">
                                    Confirmar datos del pedido
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Cliente:</span>
                                        <p className="text-gray-900">
                                            {selectedUser?.firstName} {selectedUser?.lastName}
                                        </p>
                                        <p className="text-gray-600">{selectedUser?.email}</p>
                                    </div>

                                    <div className="border-t pt-3">
                                        <span className="font-medium text-gray-700">Suscripción:</span>
                                        <p className="text-gray-900 capitalize">
                                            Box {selectedSubscription?.boxType} - {selectedSubscription?.wineType}
                                        </p>
                                        <p className="text-gray-600">
                                            {selectedSubscription?.boxSize} botellas
                                        </p>
                                    </div>

                                    <div className="border-t pt-3">
                                        <span className="font-medium text-gray-700">Dirección de entrega:</span>
                                        <p className="text-gray-900">
                                            {selectedUser?.street} {selectedUser?.number}
                                            {selectedUser?.floor && `, ${selectedUser.floor}`}
                                        </p>
                                        <p className="text-gray-900">
                                            {selectedUser?.postalCode} {selectedUser?.city}
                                        </p>
                                        <p className="text-gray-900">
                                            {selectedUser?.province}, {selectedUser?.country}
                                        </p>
                                    </div>

                                    <div className="border-t pt-3">
                                        <span className="font-medium text-gray-700">Total:</span>
                                        <p className="text-2xl font-bold text-green-700">
                                            €{selectedSubscription?.subscriptionPlan?.price?.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-secondary rounded-lg p-4">
                                <p className="text-sm text-secondary">
                                    <strong>Nota:</strong> El pedido se creará con estado "Pendiente".
                                    Podrás actualizarlo después desde la tabla de pedidos.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setStep(2);
                                    setSelectedSubscription(null);
                                }}
                                className="text-primary hover:text-blue-800 text-sm mt-4 cursor-pointer"
                            >
                                ← Volver a selección de suscripción
                            </button>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>

                    {step === 3 && (
                        <button
                            onClick={handleCreateOrder}
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
                        >
                            {loading ? "Creando..." : "Crear Pedido"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCreateModal;