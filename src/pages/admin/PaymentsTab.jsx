import { useEffect, useState, useMemo } from "react";
import * as paymentServices from "../../services/PaymentsServices";
import useAuthStore from "../../store/authStore";
import PaymentFilters from "../../components/Payments/PaymentFilter";
import PaymentCreateModal from "../../components/Payments/PaymentCreate";
import PaymentDetailsModal from "../../components/Payments/PaymentDetailModal";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import Button from "../../components/Button";

const ICON_CLASS = "w-10 h-10 text-[#AD946C]";
const STATUS_BADGE_CLASS =
  "inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary text-white";

const PaymentsTab = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filter, setFilter] = useState("all");

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
    console.warn(
      "[Payments] GET /payments no devolvió un array. Payload:",
      payload
    );
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
      return list;
    } catch (err) {
      console.error("Error cargando pagos:", err);
      setError("Error al cargar los pagos. Por favor, intenta de nuevo.");
      setPayments([]);
      setFilteredPayments([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = ({ search, date }) => {
    const safe = (v) => (v ?? "").toString().toLowerCase();
    let filtered = [...payments];

    if (search) {
      const q = safe(search);
      filtered = filtered.filter(
        (p) =>
          safe(p._id || p.id).includes(q) ||
          safe(p.subscriptionId?._id).includes(q) ||
          safe(p.subscriptionId?.user?.email).includes(q) ||
          safe(p.subscriptionId?.user?.firstName).includes(q) ||
          safe(p.subscriptionId?.user?.lastName).includes(q) ||
          safe(p.gateway).includes(q)
      );
    }

    if (date) {
      filtered = filtered.filter((p) => {
        const paymentDate = new Date(p.createdAt).toISOString().split("T")[0];
        return paymentDate === date;
      });
    }

    if (filter && filter !== "all") {
      filtered = filtered.filter((p) => safe(p.status) === safe(filter));
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

  const handleUpdatePayment = async (id, updates) => {
    try {
      await paymentServices.updatePaymentStatus(id, updates);

      const updatedList = await fetchData();

      const updatedPayment = updatedList.find(p => (p._id || p.id) === id);

      if (updatedPayment) {
        setSelectedPayment(updatedPayment);
      }

      return updatedPayment;
    } catch (err) {
      console.error("Error actualizando pago:", err);
      throw err;
    }
  };

  const handlePaymentCreated = (createdPayment) => {
    try {   

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

      setPayments((prev) => [
        createdPayment,
        ...prev.filter((p) => (p._id || p.id) !== paymentId),
      ]);
      setFilteredPayments((prev) => [
        createdPayment,
        ...prev.filter((p) => (p._id || p.id) !== paymentId),
      ]);

     
    } catch (e) {
      console.error("Error al insertar el pago:", e);
      fetchData();
    } finally {
      setShowCreateModal(false);
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("es-ES") : "-";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount || 0);

  const userLabel = (p) => {
    if (p?.subscriptionId?.user) {
      const u = p.subscriptionId.user;
      return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    }
    return "-";
  };

  const userEmail = (p) => {
    if (p?.subscriptionId?.user) {
      return p.subscriptionId.user.email || "-";
    }
    return "-";
  };

  const stats = useMemo(() => {
    return {
      total: payments.length,
      pending: payments.filter((p) => p.status === "pending").length,
      completed: payments.filter((p) => p.status === "completed").length,
      failed: payments.filter((p) => p.status === "failed").length,
    };
  }, [payments]);

  const totalMonto = useMemo(
    () =>
      payments
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + (p?.amount || 0), 0),
    [payments]
  );

  useEffect(() => {
    handleApplyFilters({ search: "", date: "" });
  }, [filter, payments]);

  const statusLabels = {
    pending: "Pendiente",
    completed: "Completado",
    failed: "Fallido",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard de Pagos</h2>
      </div>

      <div className="flex gap-3">
        {isAdmin && (
          <Button title="Crear Pago Manual" action={handleOpenCreate} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pagos</p>
              <p className="text-3xl font-bold text-[#AD946C]">{stats.total}</p>
            </div>
            <Package className={ICON_CLASS} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-[#AD946C]">
                {stats.pending}
              </p>
            </div>
            <Clock className={ICON_CLASS} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-3xl font-bold text-[#AD946C]">
                {stats.completed}
              </p>
            </div>
            <CheckCircle className={ICON_CLASS} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fallidos</p>
              <p className="text-3xl font-bold text-[#AD946C]">
                {stats.failed}
              </p>
            </div>
            <XCircle className={ICON_CLASS} />
          </div>
        </div>
      </div>

      <PaymentFilters onApplyFilters={handleApplyFilters} />

      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded transition-colors ${filter === "pending"
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            Pendientes ({stats.pending})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded transition-colors ${filter === "completed"
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            Completados ({stats.completed})
          </button>
          <button
            onClick={() => setFilter("failed")}
            className={`px-4 py-2 rounded transition-colors ${filter === "failed"
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            Fallidos ({stats.failed})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded transition-colors ${filter === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            Todos ({stats.total})
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 bg-gray-50 border-b">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold">Gateway</th>
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
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No hay pagos con este filtro
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const pid = payment._id || payment.id;
                  return (
                    <tr
                      key={pid}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-mono text-sm text-gray-600">
                        #{pid?.slice(-6) || pid}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{userLabel(payment)}</div>
                        <div className="text-sm text-gray-500">
                          {userEmail(payment)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-lg">
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={STATUS_BADGE_CLASS}>
                          {statusLabels[payment.status] || payment.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-mono text-gray-600">
                          {payment.gateway || "-"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            title="Ver / Editar"
                            action={() => handleOpenDetails(payment)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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