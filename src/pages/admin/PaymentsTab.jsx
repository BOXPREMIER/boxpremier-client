import { useEffect, useState, useMemo } from "react";
import * as paymentServices from "../../services/PaymentsServices";
import useAuthStore from "../../store/authStore";
import PaymentFilters from "../../components/Payments/PaymentFilter";
import PaymentCreateModal from "../../components/Payments/PaymentCreate";
import PaymentDetailsModal from "../../components/Payments/PaymentDetailModal";
import PaymentEditModal from "../../components/Payments/PaymentEdit";
import PaymentRowActions from "../../components/Payments/PaymentRowActions";
import PaymentStatusBadge from "../../components/Payments/PaymentStatusBadge";

const PaymentsTab = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.userType === "admin";

  useEffect(() => {
    fetchData();
  }, []);

  const asArrayOrEmpty = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === "object") {
      if (Array.isArray(payload.data)) return payload.data;
      if (Array.isArray(payload.payments)) return payload.payments;
      if (Array.isArray(payload.results)) return payload.results;
    }
    console.warn("[Payments] GET /payments no devolvió un array. Payload:", payload);
    return [];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = await paymentServices.getAllPayments();
      const list = asArrayOrEmpty(payload);
      setPayments(list);
      setFilteredPayments(list);
    } catch (err) {
      console.error("Error cargando pagos:", err);
      setError("Error al cargar los pagos. Por favor, intenta de nuevo.");
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = ({ search, status }) => {
    const safe = (v) => (v ?? "").toString().toLowerCase();
    let filtered = [...payments];

    // Filtrar por búsqueda
    if (search) {
      const q = safe(search);
      filtered = filtered.filter((p) =>
        safe(p._id || p.id).includes(q) ||
        safe(p.subscriptionId?._id).includes(q) ||
        safe(p.subscriptionId?.user?.email).includes(q) ||
        safe(p.subscriptionId?.user?.firstName).includes(q) ||
        safe(p.subscriptionId?.user?.lastName).includes(q) ||
        safe(p.gateway).includes(q)
      );
    }

    // Filtrar por estado
    if (status && status !== "all") {
      filtered = filtered.filter((p) => {
        const pStatus = safe(p.status);
        const targetStatus = safe(status);
        
        return pStatus === targetStatus;
      });
    }

    setFilteredPayments(filtered);
  };

  const handleOpenCreate = () => setShowCreateModal(true);
  const handleCloseCreate = () => setShowCreateModal(false);

  const handleOpenDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };
  const handleCloseDetails = () => {
    setSelectedPayment(null);
    setShowDetailsModal(false);
  };

  const unwrap = (x) => x?.data ?? x?.payment ?? x;

  const handleUpdatePayment = async (id, updates) => {
    try {
      const updatedRes = await paymentServices.updatePaymentStatus(id, updates);
      const updated = unwrap(updatedRes);
      const apply = (p) => ((p._id || p.id) === id ? { ...p, ...updated } : p);

      setPayments((prev) => prev.map(apply));
      setFilteredPayments((prev) => prev.map(apply));
      setSelectedPayment((prev) =>
        prev && (prev._id || prev.id) === id ? { ...prev, ...updated } : prev
      );

      return updated;
    } catch (err) {
      console.error("Error actualizando pago:", err);
      throw err;
    }
  };

  const handleUpdateStatus = (id, status) => handleUpdatePayment(id, { status });

  const handlePaymentCreated = (createdPayment) => {
    try {
      console.log("Pago recibido en PaymentsTab:", createdPayment);
      
      if (!createdPayment) {
        console.error("No se recibió pago");
        fetchData();
        return;
      }

      const paymentId = createdPayment._id || createdPayment.id;
      
      if (!paymentId) {
        console.error("Pago sin ID:", createdPayment);
        fetchData();
        return;
      }

      setPayments((prev) => [createdPayment, ...prev.filter((p) => (p._id || p.id) !== paymentId)]);
      setFilteredPayments((prev) => [createdPayment, ...prev.filter((p) => (p._id || p.id) !== paymentId)]);
      
      console.log("Pago insertado correctamente en la tabla");
    } catch (e) {
      console.error("Error al insertar el pago:", e);
      fetchData();
    } finally {
      setShowCreateModal(false);
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount || 0);

  const userLabel = (p) => {
    if (p?.subscriptionId?.user) {
      const u = p.subscriptionId.user;
      return `${u.firstName ?? ""} ${u.lastName ?? ""} (${u.email})`.trim();
    }
    return p?.subscriptionId?._id ?? "-";
  };

  const totalMonto = useMemo(
    () => filteredPayments.reduce((sum, p) => sum + (p?.amount || 0), 0),
    [filteredPayments]
  );
  const totalPendientes = useMemo(
    () => filteredPayments.filter((p) => p?.status === "pending").length,
    [filteredPayments]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con botón */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Gestión de Pagos</h1>
            <p className="text-gray-600">Administra y monitorea todos los pagos del sistema</p>
          </div>
          
          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-sm whitespace-nowrap"
            >
              CREAR PEDIDO MANUAL
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Filtros con pestañas */}
        <PaymentFilters 
          onApplyFilters={handleApplyFilters} 
          payments={payments}
        /> 

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pagos</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredPayments.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monto Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonto)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPendientes}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-lg font-medium mb-2">No se encontraron pagos</p>
              <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gateway</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPayments.map((payment) => {
                      const pid = payment._id || payment.id;
                      return (
                        <tr key={pid} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{pid}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userLabel(payment)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.gateway}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <PaymentStatusBadge status={payment.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(payment.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <PaymentRowActions
                              paymentId={pid}
                              payment={payment}
                              isAdmin={isAdmin}
                              onView={() => handleOpenDetails(payment)}
                              onUpdateStatus={handleUpdateStatus}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="lg:hidden divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const pid = payment._id || payment.id;
                  return (
                    <div key={pid} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">#{pid}</p>
                          <p className="text-sm text-gray-600">{userLabel(payment)}</p>
                        </div>
                        <PaymentStatusBadge status={payment.status} />
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </span>
                        <span className="text-sm text-gray-600">{payment.gateway}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{formatDate(payment.createdAt)}</span>
                        <PaymentRowActions
                          compact
                          paymentId={pid}
                          payment={payment}
                          isAdmin={isAdmin}
                          onView={() => handleOpenDetails(payment)}
                          onUpdateStatus={handleUpdateStatus}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modales */}
      {showCreateModal && (
        <PaymentCreateModal
          isAdmin={isAdmin}
          currentUser={user}
          onClose={handleCloseCreate}
          onSuccess={handlePaymentCreated}
        />
      )}

      {showDetailsModal && selectedPayment && (
        <PaymentDetailsModal 
          payment={selectedPayment} 
          onClose={handleCloseDetails}
          onUpdatePayment={handleUpdatePayment}  
        />
      )}
    </div>
  );
};

export default PaymentsTab;