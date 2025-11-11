import React, { useEffect, useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { getUsers } from "../../services/UserServices";
import { getUserSubscriptions } from "../../services/SubscriptionServices";
import { createPayment, getPaymentById } from "../../services/PaymentsServices";
import Button from "../Button";

const PaymentCreateModal = ({
  onClose,
  onSuccess,
  isAdmin = true,
  currentUser = null,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // Paso 1
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Paso 2
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Paso 3
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState("paypal");

  const winetype = {
    mixed: "mixto",
    rose: "rosé",
    red: "tinto",
    sparkling: "espumoso",
  };

  useEffect(() => {
    if (!isAdmin && currentUser) {
      setSelectedUser(currentUser);
      setStep(2);
      fetchUserSubs(currentUser._id);
    }
  }, [isAdmin, currentUser]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await getUsers();
      const customers = Array.isArray(data)
        ? data.filter((u) => u.userType === "customer")
        : [];
      setUsers(customers);
    } catch (e) {
      console.error(e);
      setErr("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubs = async (userId) => {
    try {
      setLoading(true);
      setErr(null);
      const subs = await getUserSubscriptions(userId);
      const active = (subs || []).filter(
        (s) => !["paused", "canceled", "expired"].includes(s.status)
      );
      setSubscriptions(active);
    } catch (e) {
      console.error(e);
      setErr("No se pudieron cargar las suscripciones del cliente.");
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedSubscription(null);
    setAmount("");
    setStep(2);
    fetchUserSubs(user._id);
  };

  const handleSelectSubscription = (sub) => {
    setSelectedSubscription(sub);
    const price = sub?.subscriptionPlan?.price;
    setAmount(typeof price === "number" ? String(price) : "");
    setStep(3);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const userBadge = useMemo(() => {
    if (!selectedUser) return "";
    const { firstName, lastName, email } = selectedUser;
    return `${firstName ?? ""} ${lastName ?? ""} - ${email ?? ""}`.trim();
  }, [selectedUser]);

  const canSubmit =
    selectedSubscription && amount && Number(amount) > 0 && gateway;

  const unwrap = (x) => x?.data ?? x?.payment ?? x;
  const extractId = (x) =>
    x?._id || x?.id || x?.insertedId || x?.data?._id || x?.payment?._id;

  const handleCreatePayment = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      setErr(null);

      // 1) Crear pago
      const res = await createPayment({
        subscriptionId: selectedSubscription._id,
        amount: parseFloat(amount),
        gateway,
      });

      let created = unwrap(res);
      const paymentId = extractId(created) || extractId(res);

      // 2) Siempre obtener el pago completo con populate
      if (paymentId) {
        try {
          const fullPayment = await getPaymentById(paymentId);
          created = unwrap(fullPayment);
        } catch (fetchError) {
          console.error("Error obteniendo pago completo:", fetchError);
          // Si falla, construimos un objeto mínimo con los datos que tenemos
          created = {
            _id: paymentId,
            id: paymentId,
            amount: parseFloat(amount),
            gateway,
            status: created?.status || "pending",
            createdAt: created?.createdAt || new Date().toISOString(),
            subscriptionId: {
              _id: selectedSubscription._id,
              user: selectedUser,
            },
          };
        }
      }

      // 3) Si aún no tenemos el usuario poblado, lo añadimos manualmente
      if (
        created &&
        selectedUser &&
        (!created.subscriptionId?.user || !created.subscriptionId.user._id)
      ) {
        created = {
          ...created,
          subscriptionId: {
            ...(created.subscriptionId || {}),
            _id: selectedSubscription._id,
            user: selectedUser,
          },
        };
      }

      console.log("Pago creado completo:", created);

      // 4) Enviar al componente padre
      onSuccess?.(created);

      // 5) Cerrar modal
      onClose?.();
    } catch (e) {
      console.error("Error al crear pago:", e);
      setErr("Error al crear el pago. Revisa los datos e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 1) return onClose?.();
    if (step === 2) return isAdmin ? setStep(1) : onClose?.();
    if (step === 3) return setStep(2);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Crear Pago Manual</h2>
            <p className="text-sm text-gray-600 mt-1">
              {step === 1 && "Paso 1: Seleccionar cliente"}
              {step === 2 && "Paso 2: Seleccionar suscripción"}
              {step === 3 && "Paso 3: Datos del pago"}
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
          {err && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {/* Paso 1: Usuarios */}
          {step === 1 && isAdmin && (
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
                {loading ? (
                  <p className="text-center text-gray-500 py-8">
                    Cargando clientes...
                  </p>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No se encontraron clientes
                  </p>
                ) : (
                  filteredUsers.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Paso 2: Suscripciones */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-primary">
                  Cliente seleccionado:
                </p>
                <p className="text-secondary">{userBadge}</p>
              </div>

              <h3 className="font-semibold text-lg mb-3">
                Selecciona una suscripción activa:
              </h3>

              {loading ? (
                <p className="text-center text-gray-500 py-8">
                  Cargando suscripciones...
                </p>
              ) : subscriptions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Este cliente no tiene suscripciones activas
                </p>
              ) : (
                <div className="space-y-3">
                  {subscriptions.map((sub) => (
                    <button
                      key={sub._id}
                      onClick={() => handleSelectSubscription(sub)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium capitalize">
                            Box {sub.boxType}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="capitalize">
                            {winetype[sub.wineType] || sub.wineType}
                          </span>
                        </div>
                        <span className="text-green-600 text-sm font-medium">
                          Activa
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {sub.boxSize} botellas
                        {typeof sub?.subscriptionPlan?.price === "number" &&
                          ` - €${Number(sub.subscriptionPlan.price).toFixed(
                            2
                          )}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={goBack}
                className="text-primary hover:text-[#AD946C] text-sm mt-4 cursor-pointer"
              >
                ← Volver a selección de cliente
              </button>
            </div>
          )}

          {/* Paso 3: Datos del pago */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-white border border-primary rounded-lg p-4">
                <h3 className="font-semibold text-primary mb-3">
                  Datos del pago
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-gray-600">Cliente</span>
                    <p className="font-medium">{userBadge}</p>
                  </div>
                  <div>
                    <span className="block text-gray-600">Suscripción</span>
                    <p className="font-mono">{selectedSubscription?._id}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gateway
                  </label>
                  <select
                    value={gateway}
                    onChange={(e) => setGateway(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="paypal">PayPal</option>
                    <option value="multisafepay">MultiSafepay</option>
                    <option value="redsys">Redsys</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep(2);
                  setSelectedSubscription(null);
                }}
                className="text-primary hover:text-[#AD946C] text-sm mt-2 cursor-pointer"
              >
                ← Volver a selección de suscripción
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          {step >= 2 && step < 3 && (
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-[#AD946C] text-white rounded-lg hover:bg-transparent-90"
              disabled={loading || (step === 2 && !selectedSubscription)}
            >
              Siguiente
            </button>
          )}
          {step === 3 && (
            <div
              className={
                !canSubmit || loading ? "opacity-50 pointer-events-none" : ""
              }
            >
              <Button
                title="Crear Pago"
                action={handleCreatePayment}
                bgColor="#AD946C"
                data-testid="create-payment"
                tooltip="Crear Pago"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCreateModal;
