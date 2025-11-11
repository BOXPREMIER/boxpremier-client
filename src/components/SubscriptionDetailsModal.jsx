export default function SubscriptionDetailsModal({ subscription, onClose }) {
    if (!subscription) return null;

    const isGift = subscription.isGift;

    const statusLabels = {
        active: "Activa",
        pending: "Pendiente",
        paused: "Pausada",
        canceled: "Cancelada",
        expired: "Expirada"
    };

    const winetype = {
        mixed: "Mixto",
        rose: "Rosé",
        red: "Tinto",
        sparkling: "Espumoso"
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">
                        {isGift ? "🎁 Suscripción Regalo" : "Detalle de Suscripción"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Estado</h3>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${subscription.status === 'active' ? 'bg-green-100 text-green-700' :
                                subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                            }`}>
                            {statusLabels[subscription.status] || subscription.status}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Plan</h3>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="font-medium text-lg">
                                {subscription.subscriptionPlan?.boxType === "basic" ? "Box Premier Basic" : "Box Premier Prestige"}
                            </p>
                            <p className="text-sm text-gray-600">
                                {subscription.subscriptionPlan?.boxSize || 3} botellas · Tipo: {winetype[subscription.wineType] || subscription.wineType}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Fechas</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Inicio:</span>
                                <span className="font-medium">
                                    {new Date(subscription.startDate).toLocaleDateString("es-ES", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Próximo cobro:</span>
                                <span className="font-medium">
                                    {new Date(subscription.nextPayDate).toLocaleDateString("es-ES", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            {subscription.endDate && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Fin:</span>
                                    <span className="font-medium">
                                        {new Date(subscription.endDate).toLocaleDateString("es-ES", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {isGift && (
                        <div className="bg-[#FFF8F1] border border-secondary rounded-xl p-4">
                            <h3 className="text-lg font-semibold mb-3">🎁 Información de Regalo</h3>
                            <div className="space-y-3 text-sm">
                                {subscription.user && (
                                    <div>
                                        <span className="text-gray-600 font-medium">Para:</span>
                                        <p className="mt-1">
                                            {subscription.user.firstName} {subscription.user.lastName}
                                        </p>
                                        {subscription.user.email && (
                                            <p className="text-gray-500">{subscription.user.email}</p>
                                        )}
                                    </div>
                                )}

                                {subscription.giftFromId && (
                                    <div>
                                        <span className="text-gray-600 font-medium">De:</span>
                                        <p className="mt-1">
                                            {subscription.giftFromId.firstName} {subscription.giftFromId.lastName}
                                        </p>
                                    </div>
                                )}

                                {subscription.giftMessage && (
                                    <div>
                                        <span className="text-gray-600 font-medium">Mensaje:</span>
                                        <p className="mt-1 italic bg-white p-3 rounded-lg">"{subscription.giftMessage}"</p>
                                    </div>
                                )}

                                {subscription.giftDurationMonths && (
                                    <div>
                                        <span className="text-gray-600 font-medium">Duración:</span>
                                        <span className="ml-2">
                                            {subscription.giftDurationMonths} {subscription.giftDurationMonths === 1 ? 'mes' : 'meses'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Método de pago</h3>
                        <p className="text-sm text-gray-600 capitalize">{subscription.payMethod}</p>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 rounded-full bg-secondary text-white font-semibold hover:opacity-90"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}