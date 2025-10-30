// pages/SubscriptionCheckout.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import {
  fetchActivePlans,
  localPlansFallback,
  createSubscription,
} from "../services/subscriptionsService";

const COLORS = { gold: "#AD946C", gray: "#ADADAD", black: "#000000" };
const WINE_TYPES = ["mixto", "tinto", "rosa", "espumoso"];

export default function SubscriptionCheckout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ usuario para pre-rellenar
  const user = useAuthStore((s) => s.user);

  // ✅ params de navegación (vienen de SubscriptionPage)
  const search = new URLSearchParams(location.search);
  const initialPlanId = search.get("plan");
  const initialBox = search.get("box") || "basic";
  const initialWine = search.get("wine") || "mixto";

  // ✅ estado UI
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [error, setError] = useState(null);

  // ✅ form state
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [street, setStreet] = useState(user?.address?.street || "");
  const [number, setNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [postalCode, setPostalCode] = useState(user?.address?.postal_code || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState(user?.address?.country || "ES");

  const [planId, setPlanId] = useState(initialPlanId || "");
  const [boxType, setBoxType] = useState(initialBox);
  const [wineType, setWineType] = useState(initialWine);
  const [isGift, setIsGift] = useState(false);

  const [payMethod, setPayMethod] = useState("multisafepay"); // “paypal/multisafepay” en tu JSON
  const [submitting, setSubmitting] = useState(false);

  // 🔎 Cargar planes
  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoadingPlans(true);
        const res = await fetchActivePlans();
        if (!ok) return;
        setPlans(res);
      } catch {
        if (!ok) return;
        setPlans(localPlansFallback());
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
    // si no venía planId, pero ya tenemos planes, setearlo por boxType
    if (!planId && selectedPlan?._id) setPlanId(selectedPlan._id);
  }, [selectedPlan, planId]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!planId) {
      setError("Selecciona un plan válido");
      return;
    }

    try {
      setSubmitting(true);

      // payload compatible con tu JSON/schema
      const payload = {
        planId,
        boxType,
        wineType,
        payMethod,              
        isGift,
        // Datos de envío (si backend admite en la creación)
        shipping: {
          firstName,
          lastName,
          email,
          phone,
          address: { street, number, floor, postalCode, city, province, country },
        },
      };

      const sub = await createSubscription(payload);
      navigate("/account/subscription", { state: { createdId: sub?._id } });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "No se pudo crear la suscripción");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-[#000000]">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Header con logo y título */}
        <div className="mb-6 text-center">
          <img src="/plan.PNG" alt="BOX PREMIER" className="mx-auto h-16 w-auto object-contain" />
          <p className="mt-1 text-base text-xl font-semibold">Suscripción</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border p-6 sm:p-8"
          style={{ borderColor: COLORS.gold }}
        >
          {/* Datos personales */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-[#000000]">Nombre</label>
              <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: COLORS.gold }}
                value={firstName} onChange={e=>setFirstName(e.target.value)} autoComplete="given-name" />
            </div>
            <div>
              <label className="text-xs text-[#000000]">Apellidos</label>
              <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: COLORS.gold }}
                value={lastName} onChange={e=>setLastName(e.target.value)} autoComplete="family-name" />
            </div>

            <div>
              <label className="text-xs text-[#000000]">Correo Electrónico</label>
              <input type="email" className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: COLORS.gold }}
                value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div>
              <label className="text-xs text-[#000000]">Número de Teléfono</label>
              <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: COLORS.gold }}
                value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" />
            </div>
          </div>

          {/* Dirección */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">Dirección</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs">Calle</label>
                <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: COLORS.gold }}
                  value={street} onChange={e=>setStreet(e.target.value)} />
              </div>
              <div>
                <label className="text-xs">Número</label>
                <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: COLORS.gold }}
                  value={number} onChange={e=>setNumber(e.target.value)} />
              </div>
              <div>
                <label className="text-xs">Piso</label>
                <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: COLORS.gold }}
                  value={floor} onChange={e=>setFloor(e.target.value)} />
              </div>
              <div>
                <label className="text-xs">Código Postal</label>
                <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: COLORS.gold }}
                  value={postalCode} onChange={e=>setPostalCode(e.target.value)} />
              </div>
              <div>
                <label className="text-xs">Ciudad</label>
                <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: COLORS.gold }}
                  value={city} onChange={e=>setCity(e.target.value)} />
              </div>
              <div>
                <label className="text-xs">Estado/Provincia</label>
                <input className="mt-1 w-full rounded-xl border px-3 py-2" style={{ borderColor: COLORS.gold }}
                  value={province} onChange={e=>setProvince(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Plan + regalo */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">Elige tu plan</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-end">
              <div>
                <label className="text-xs">Planes</label>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  style={{ borderColor: COLORS.gold }}
                  value={planId}
                  onChange={(e) => {
                    const p = plans.find((pl) => pl._id === e.target.value);
                    setPlanId(e.target.value);
                    if (p?.boxType) setBoxType(p.boxType);
                  }}
                  disabled={loadingPlans || !plans.length}
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

              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={isGift} onChange={(e)=>setIsGift(e.target.checked)} />
                Enviar como regalo
              </label>
            </div>

            <div className="mt-4">
              <label className="text-xs">Tipo de vino</label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {WINE_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setWineType(t)}
                    className={`rounded-xl border px-3 py-2 capitalize ${
                      wineType === t ? "border-[#AD946C] bg-[#FFF8F1]" : "border-[#ADADAD] hover:bg-[#F8F8F8]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">Método de pago</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payMethod"
                  value="multisafepay"
                  checked={payMethod === "multisafepay"}
                  onChange={(e) => setPayMethod(e.target.value)}
                />
                 PayPal
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
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}

          {/* Submit */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={submitting || !planId}
              className="rounded-2xl bg-[#AD946C] px-8 py-3 font-semibold text-[#000000] hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Procesando…" : "Suscribir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
