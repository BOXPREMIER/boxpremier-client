import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../services/OrderServices";
import { getBoxesByType, getWinesByType } from "../../services/AdminServices";
import { exportOrdersCSV } from "../../services/AdminServices";
import { Package, Truck, CheckCircle, Wine, Box, Download, Plus } from "lucide-react";
import OrderDetailsModal from "../../components/Orders/OrderDetailsModal";
import OrderEdit from "../../components/Orders/OrderEdit";
import OrderFilters from "../../components/Orders/OrderFilters";
import OrderCreateModal from "../../components/Orders/OrderCreateModal";
import Button from '../../components/Button';

const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [boxesMetrics, setBoxesMetrics] = useState([]);
    const [winesMetrics, setWinesMetrics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ordersData, boxesData, winesData] = await Promise.all([
                getAllOrders(),
                getBoxesByType(),
                getWinesByType()
            ]);

            setOrders(ordersData);
            setFilteredOrders(ordersData);
            setBoxesMetrics(boxesData);
            setWinesMetrics(winesData);
        } catch (err) {
            console.error("Error al cargar datos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (filter === "all") {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(o => o.status === filter));
        }
    }, [filter, orders]);

    const stats = {
        total: filteredOrders.length,
        pending: filteredOrders.filter(o => o.status === 'pending').length,
        preparing: filteredOrders.filter(o => o.status === 'preparing').length,
        shipped: filteredOrders.filter(o => o.status === 'shipped').length,
        delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    };

    const statusColors = {
        pending: "bg-secondary text-white",
        preparing: "bg-secondary text-white",
        shipped: "bg-secondary text-white",
        delivered: "bg-secondary text-white",
        cancelled: "bg-secondary text-white"
    };

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

    const handleExportCSV = async () => {
        try {
            const blob = await exportOrdersCSV();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `pedidos_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al exportar CSV:", error);
            alert("Error al exportar datos");
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleApplyFilters = (filters) => {
        let filtered = [...orders];

        if (filters.status && filters.status !== "all") {
            filtered = filtered.filter(o => o.status === filters.status);
        }

        if (filters.dateFrom) {
            filtered = filtered.filter(o => new Date(o.createdAt) >= new Date(filters.dateFrom));
        }

        if (filters.dateTo) {
            filtered = filtered.filter(o => new Date(o.createdAt) <= new Date(filters.dateTo));
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(o =>
                o._id.toLowerCase().includes(searchLower) ||
                o.userId?.firstName?.toLowerCase().includes(searchLower) ||
                o.userId?.lastName?.toLowerCase().includes(searchLower) ||
                o.userId?.email?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredOrders(filtered);
    };


    const handleOrderUpdated = () => {
        fetchData();
        setIsEditDrawerOpen(false);
    };

    const handleOrderCreated = () => {
        fetchData();
        setIsCreateModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Dashboard de Pedidos</h2>
            </div>
            <div className="flex gap-3">
                {/* <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:brightness-90 transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Crear Pedido Manual
                </button>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:brightness-90 transition-colors cursor-pointer"
                >
                    <Download className="w-4 h-4" />
                    Exportar CSV
                </button> */}
                <Button
                    title="Crear Pedido Manual"
                    action={() => setIsCreateModalOpen(true)}
                />

                <Button
                    title="Exportar CSV"
                    action={handleExportCSV}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Pedidos</p>
                            <p className="text-3xl font-bold text-primary">{stats.total}</p>
                        </div>
                        <Package className="w-10 h-10 text-secondary" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pendientes</p>
                            <p className="text-3xl font-bold text-primary">{stats.pending}</p>
                        </div>
                        <Package className="w-10 h-10 text-secondary" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">En Camino</p>
                            <p className="text-3xl font-bold text-primary">{stats.shipped}</p>
                        </div>
                        <Truck className="w-10 h-10 text-secondary" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Entregados</p>
                            <p className="text-3xl font-bold text-primary">{stats.delivered}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-secondary" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Box className="w-6 h-6 text-secondary" />
                        <h3 className="text-lg font-semibold">Boxes por Tipo</h3>
                    </div>
                    <div className="space-y-3">
                        {Array.isArray(boxesMetrics) && boxesMetrics.length > 0 ? (
                            boxesMetrics.map((metric) => (
                                <div key={metric._id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                        <span className="capitalize font-medium">{winetype[metric._id] || metric._id}</span>
                                    </div>
                                    <span className="text-2xl font-bold">{metric.count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No hay datos disponibles</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Wine className="w-6 h-6 text-secondary" />
                        <h3 className="text-lg font-semibold">Vinos por Tipo</h3>
                    </div>
                    <div className="space-y-3">
                        {Array.isArray(winesMetrics) && winesMetrics.length > 0 ? (
                            winesMetrics.map((metric) => (
                                <div key={metric._id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                        <span className="capitalize font-medium">{winetype[metric._id] || metric._id}</span>
                                    </div>
                                    <span className="text-2xl font-bold">{metric.count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No hay datos disponibles</p>
                        )}
                    </div>
                </div>
            </div>

            <OrderFilters onApplyFilters={handleApplyFilters} />

            <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter("pending")}
                        className={`px-4 py-2 rounded transition-colors ${filter === "pending" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                        Pendientes ({stats.pending})
                    </button>
                    <button
                        onClick={() => setFilter("preparing")}
                        className={`px-4 py-2 rounded transition-colors ${filter === "preparing" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                        Preparando ({stats.preparing})
                    </button>
                    <button
                        onClick={() => setFilter("shipped")}
                        className={`px-4 py-2 rounded transition-colors ${filter === "shipped" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                        En Camino ({stats.shipped})
                    </button>
                    <button
                        onClick={() => setFilter("delivered")}
                        className={`px-4 py-2 rounded transition-colors ${filter === "delivered" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                        Entregados ({stats.delivered})
                    </button>
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded transition-colors ${filter === "all" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                        Todos ({orders.length})
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-gray-600 bg-gray-50 border-b">
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Cliente</th>
                                <th className="p-4 font-semibold">Total</th>
                                <th className="p-4 font-semibold">Estado</th>
                                <th className="p-4 font-semibold">Tracking</th>
                                <th className="p-4 font-semibold">Fecha</th>
                                <th className="p-4 font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
                                        Cargando datos...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
                                        No hay pedidos con este filtro
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-sm text-gray-600">
                                            #{order._id.slice(-6)}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">
                                                {order.userId?.firstName} {order.userId?.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.userId?.email}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-semibold text-lg">
                                                €{order.totalAmount?.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-mono text-gray-600">
                                                {order.trackingNumber || "-"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString("es-ES")}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {/* <button
                                                    onClick={() => handleViewDetails(order)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:brightness-90 transition-colors cursor-pointer"
                                                >
                                                    Ver / Editar
                                                </button> */}
                                                <Button
                                                    title="Ver / Editar"
                                                    action={() => handleViewDetails(order)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isDetailsModalOpen && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setIsDetailsModalOpen(false)}
                    onEdit={() => {
                        setIsDetailsModalOpen(false);
                        setIsEditDrawerOpen(true);
                    }}
                />
            )}

            {isEditDrawerOpen && (
                <OrderEdit
                    order={selectedOrder}
                    onClose={() => setIsEditDrawerOpen(false)}
                    onSuccess={handleOrderUpdated}
                />
            )}

            {isCreateModalOpen && (
                <OrderCreateModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={handleOrderCreated}
                />
            )}
        </div>
    );
};

export default OrdersTab;