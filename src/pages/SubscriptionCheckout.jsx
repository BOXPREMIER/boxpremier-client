import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { createSubscription } from "../services/SubscriptionServices";
import { getAllPlans } from "../services/SubscriptionPlanServices";
import { createUser, updatePaymentMethod } from "../services/UserServices";
import { login } from "../services/AuthServices";

const WINE_TYPES = [
  { label: "mixto", value: "mixed" },
  { label: "tinto", value: "red" },
  { label: "rosa", value: "rose" },
  { label: "espumoso", value: "sparkling" },
];

export default function SubscriptionCheckout() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const isLoggedIn = !!user;

  const search = new URLSearchParams(location.search);
  const initialPlanId = search.get("plan");
  const initialBox = search.get("box") || "basic";
  const initialWine = search.get("wine") || "mixto";

  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("plan");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("ES");

  const [recipientFirstName, setRecipientFirstName] = useState("");
  const [recipientLastName, setRecipientLastName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  const [recipientStreet, setRecipientStreet] = useState("");
  const [recipientNumber, setRecipientNumber] = useState("");
  const [recipientFloor, setRecipientFloor] = useState("");
  const [recipientPostalCode, setRecipientPostalCode] = useState("");
  const [recipientCity, setRecipientCity] = useState("");
  const [recipientProvince, setRecipientProvince] = useState("");
  const [recipientCountry, setRecipientCountry] = useState("ES");

  const [planId, setPlanId] = useState(initialPlanId || "");
  const [boxType, setBoxType] = useState(initialBox);
  const [wineType, setWineType] = useState(initialWine);

  const [payMethod, setPayMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone);

      setStreet(user.street);
      setNumber(user.number);
      setFloor(user.floor);
      setPostalCode(user.postalCode);
      setCity(user.city);
      setProvince(user.province);
      setCountry(user.country || "ES");

      if (user.paymentMethod) {
        setCardHolder(user.paymentMethod.cardHolderName);
        setExpirationDate(user.paymentMethod.expirationDate);
      }
    }
  }, [user]);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setError(null);
        setLoadingPlans(true);
        const res = await getAllPlans();
        if (!ok) return;
        if (Array.isArray(res) && res.length) {
          setPlans(res);
        } else {
          setError("No se recibieron planes desde la API.");
        }
      } catch (e) {
        if (!ok) return;
        console.error(e);
        setError("No se pudieron cargar los planes.");
      } finally {
        ok && setLoadingPlans(false);
      }
    })();
    return () => (ok = false);
  }, []);

  const selectedPlan = useMemo(() => {
    if (!plans?.length) return null;
    if (planId) return plans.find((p) => p._id === planId) || null;
    return plans.find((p) => p.boxType === boxType) || null;
  }, [plans, planId, boxType]);

  useEffect(() => {
    if (!planId && selectedPlan?._id) setPlanId(selectedPlan._id);
  }, [selectedPlan, planId]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!planId) {
      setError("Selecciona un plan válido");
      return;
    }

    if (mode === "regalo") {
      if (!recipientFirstName || !recipientLastName || !recipientEmail || !recipientPhone) {
        setError("Completa todos los datos del destinatario");
        return;
      }
      if (!recipientStreet || !recipientNumber || !recipientPostalCode || !recipientCity || !recipientProvince) {
        setError("Completa la dirección del destinatario");
        return;
      }
    }

    if (!isLoggedIn && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (payMethod === "card" && (!cardNumber || !cardHolder || !expirationDate || !cvv)) {
      setError("Completa todos los datos de la tarjeta");
      return;
    }

    if (payMethod === "card") {
      const cleanNumber = cardNumber.replace(/\s/g, "");
      if (cleanNumber.length < 13) {
        setError("Número de tarjeta inválido");
        return;
      }
    }

    try {
      setSubmitting(true);

      if (!isLoggedIn) {
        const newUser = await createUser({
          userType: "customer",
          firstName,
          lastName,
          email,
          password,
          phone,
          street,
          number,
          floor,
          postalCode,
          city,
          province,
          country
        });

        const authData = await login({ email, password });
        setAuth(authData.token, authData.user);

        if (payMethod === "card") {
          const cleanNumber = cardNumber.replace(/\s/g, "");
          const lastFour = cleanNumber.slice(-4);

          await updatePaymentMethod({
            type: "card",
            lastFourDigits: lastFour,
            cardHolderName: cardHolder,
            expirationDate: expirationDate,
            paymentToken: `tok_${lastFour}_${Date.now()}`
          });
        }
      } else if (payMethod === "card") {
        const cleanNumber = cardNumber.replace(/\s/g, "");
        const lastFour = cleanNumber.slice(-4);

        await updatePaymentMethod({
          type: "card",
          lastFourDigits: lastFour,
          cardHolderName: cardHolder,
          expirationDate: expirationDate,
          paymentToken: `tok_${lastFour}_${Date.now()}`
        });
      }

      const subscriptionData = {
        planId,
        wineType,
      };

      if (mode === "regalo") {
        subscriptionData.isGift = true;
        subscriptionData.giftInfo = {
          recipientName: `${recipientFirstName} ${recipientLastName}`,
          recipientEmail,
          recipientPhone,
          giftMessage,
          recipientAddress: {
            street: recipientStreet,
            number: recipientNumber,
            floor: recipientFloor,
            postalCode: recipientPostalCode,
            city: recipientCity,
            province: recipientProvince,
            country: recipientCountry
          }
        };
      }

      await createSubscription(subscriptionData);

      navigate("/app/profile", { state: { openTab: "suscripciones", createdId: planId } });
    } catch (err) {
      const apiError = err?.response?.data?.message;
      setError(apiError || err.message || "No se pudo crear la suscripción");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-primary">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6 text-center">
          <img src="/plan.PNG" alt="BOX PREMIER" className="mx-auto h-16 w-auto object-contain" />
          <p className="mt-1 text-xl font-semibold">Suscripción</p>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode("plan")}
              className={`rounded-2xl border-2 px-6 py-4 font-semibold transition ${mode === "plan"
                ? "border-secondary bg-[#FFF8F1] text-primary"
                : "border-[#ADADAD] text-[#ADADAD] hover:border-secondary"
                }`}
            >
              Elegir plan
            </button>
            <button
              type="button"
              onClick={() => setMode("regalo")}
              className={`rounded-2xl border-2 px-6 py-4 font-semibold transition ${mode === "regalo"
                ? "border-secondary bg-[#FFF8F1] text-primary"
                : "border-[#ADADAD] text-[#ADADAD] hover:border-secondary"
                }`}
            >
              Enviar regalo
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border p-6 sm:p-8 border-secondary">
          {mode === "plan" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-primary">Nombre</label>
                  <input
                    className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-primary">Apellidos</label>
                  <input
                    className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-primary">Correo Electrónico</label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-primary">Número de Teléfono</label>
                  <input
                    className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </div>

                {!isLoggedIn && (
                  <>
                    <div>
                      <label className="text-xs text-primary">Contraseña</label>
                      <input
                        type="password"
                        className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-primary">Confirmar contraseña</label>
                      <input
                        type="password"
                        className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold">Dirección</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs">Calle</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs">Número</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs">Piso</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs">Código Postal</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs">Ciudad</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs">Estado/Provincia</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {mode === "regalo" && (
            <>
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold">Tus datos (quien envía el regalo)</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-primary">Nombre</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-primary">Apellidos</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-primary">Correo Electrónico</label>
                    <input
                      type="email"
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-primary">Teléfono</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  {!isLoggedIn && (
                    <>
                      <div>
                        <label className="text-xs text-primary">Contraseña</label>
                        <input
                          type="password"
                          className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-primary">Confirmar contraseña</label>
                        <input
                          type="password"
                          className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold">Datos del destinatario</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-primary">Nombre</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={recipientFirstName}
                      onChange={(e) => setRecipientFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-primary">Apellidos</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={recipientLastName}
                      onChange={(e) => setRecipientLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-primary">Correo Electrónico</label>
                    <input
                      type="email"
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-primary">Teléfono</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs text-primary">Mensaje personalizado</label>
                  <textarea
                    className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary resize-none"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    rows="3"
                    placeholder="Escribe un mensaje para el destinatario"
                  />
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold">Dirección de envío</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs">Calle</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={recipientStreet}
                      onChange={(e) => setRecipientStreet(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs">Número</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={recipientNumber}
                      onChange={(e) => setRecipientNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs">Piso</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={recipientFloor}
                      onChange={(e) => setRecipientFloor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs">Código Postal</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={recipientPostalCode}
                      onChange={(e) => setRecipientPostalCode(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs">Ciudad</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={recipientCity}
                      onChange={(e) => setRecipientCity(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs">Estado/Provincia</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                      value={recipientProvince}
                      onChange={(e) => setRecipientProvince(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">Elige tu plan</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs">Planes</label>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 border-secondary"
                  value={planId}
                  onChange={(e) => {
                    const p = plans.find((pl) => pl._id === e.target.value);
                    setPlanId(e.target.value);
                    if (p?.boxType) setBoxType(p.boxType);
                  }}
                  disabled={loadingPlans || !plans.length}
                  required
                >
                  <option value="" disabled>
                    {loadingPlans ? "Cargando planes..." : "Selecciona un plan"}
                  </option>
                  {plans.map((p) => (
                    <option key={p._id} value={p._id}>
                      {`Plan Box Premier ${p.boxType.toUpperCase()} · ${p.boxSize} bot · ${p.price.toFixed(2)}€`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs">Tipo de vino</label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {WINE_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setWineType(t.value)}
                    className={`rounded-xl border px-3 py-2 capitalize ${wineType === t.value
                      ? "border-secondary bg-[#FFF8F1]"
                      : "border-[#ADADAD] hover:bg-[#F8F8F8]"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">Método de pago</p>
            <div className="flex flex-wrap gap-6 text-sm mb-4">
              <label className="flex items-center gap-2 opacity-50">
                <input
                  type="radio"
                  name="payMethod"
                  value="multisafepay"
                  checked={payMethod === "multisafepay"}
                  onChange={(e) => setPayMethod(e.target.value)}
                  disabled
                />
                PayPal (Próximamente)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payMethod"
                  value="card"
                  checked={payMethod === "card"}
                  onChange={(e) => setPayMethod(e.target.value)}
                />
                Tarjeta bancaria
              </label>
            </div>

            {payMethod === "card" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs">Número de tarjeta</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm border-secondary"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength="19"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs">Titular de la tarjeta</label>
                  <input
                    type="text"
                    placeholder="Nombre como aparece en la tarjeta"
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm border-secondary"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs">Fecha de expiración</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm border-secondary"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      maxLength="5"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm border-secondary"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {Array.isArray(error)
                ? error.map((err, i) => <p key={i}>{err.message}</p>)
                : <p>{error}</p>
              }
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={submitting || !planId}
              className="rounded-2xl bg-secondary px-8 py-3 font-semibold text-primary hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Procesando…" : "Suscribir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}