// pages/Subscribe.jsx
import { useEffect, useMemo, useState } from "react";
import {
  fetchActivePlans,
  localPlansFallback,
  createSubscription,
} from "../services/subscriptionsService";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

const HERO_BG = "/public/vinosuscripcion.png";

const LOGIN_NEXT = "/subscriptionPage";
const LOGIN_URL  = `/login?next=${encodeURIComponent(LOGIN_NEXT)}`;

const WINE_TYPES = ["mixto", "tinto", "rosa", "espumoso"];
const FIRST_MONTH_PROMO = 25;

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => Boolean(s.token));
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);

  const [selectedLevel, setSelectedLevel] = useState("basic"); // "basic" | "premium"
  const [wineType, setWineType] = useState("mixto");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchActivePlans(); // axios
        if (!mounted) return;
        setPlans(res);
      } catch {
        if (!mounted) return;
        setPlans(localPlansFallback());
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.boxType === selectedLevel) || null,
    [plans, selectedLevel]
  );

  const BENEFITS = {
    basic: [
      "Envío gratuito todos los meses.",
      "Caja con 3 botellas de 750 ml cuidadosamente seleccionadas.",
      "Vinos españoles de distintas regiones y denominaciones.",
      "Selección de nuestros sumilleres para ofrecerte una experiencia distinta en cada entrega.",
    ],
    premium: [
      "Envío gratuito mensual, directo a tu puerta.",
      "Caja con 3 botellas de 750 ml de vinos selectos y de alta gama.",
      "Vinos españoles y de otras regiones prestigiosas del mundo.",
      "Selección de nuestros sumilleres con etiquetas de producción limitada y bodegas de renombre.",
      "Fichas de cata detalladas y recomendaciones de maridaje para cada vino.",
    ],
  };

  const currentPrice = selectedPlan?.price ?? 0;
  const firstMonthPrice = Math.min(
    FIRST_MONTH_PROMO,
    currentPrice || FIRST_MONTH_PROMO
  );

  // este helper es para exigir login antes de una acción
function ensureAuthThen(action) {
  if (!isAuthenticated) {
    navigate(LOGIN_URL);
    return;
  }
  action?.();
}


  async function handleSubscribe() {
    setError(null);
    if (!isAuthenticated) {
      navigate(LOGIN_URL);
      return;
    }
    try {
      setSubmitting(true);
      const planId = selectedPlan?._id;
      if (!planId) throw new Error("No hay plan seleccionado");

      const sub = await createSubscription({
        planId,
        boxType: selectedLevel,
        wineType,
        payMethod: "PayPall",
      }); // axios

      navigate("/account/subscription", { state: { createdId: sub?._id } });
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e.message ||
          "No se pudo crear la suscripción"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-[#000000]">
      {/* ===== Sección 1: HERO ===== */}
      <section
        className="relative isolate w-full overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="h-[84vh] md:h-[88vh] lg:h-[92vh]">
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
            <div className="w-full max-w-3xl">
              <h1
                className="uppercase text-[#000000] leading-none tracking-[0.12em] text-5xl sm:text-6xl md:text-7xl"
                aria-label="BOXPREMIER"
              >
                <span className="font-light">BOX</span>
                <span className="font-extrabold">PREMIER</span>
              </h1>
              <p className="mt-4 text-xl font-medium text-[#000000] sm:text-2xl">
                Prueba increíbles vinos por{" "}
                <span className="font-extrabold text-[#AD946C]">25€</span> el
                primer mes
              </p>
              <p className="mt-2 max-w-2xl text-base text-[#000000]/90">
                Luego, desde{" "}
                {currentPrice ? `${currentPrice.toFixed(2)}€` : "—"} al mes.
                Cancela cuando quieras.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  className="rounded-2xl bg-[#AD946C] px-7 py-3 font-semibold text-[#000000] shadow hover:opacity-90"
                  onClick={() =>
                    document
                      .getElementById("plans")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Suscríbete
                </button>
                <a
                  href="#plans"
                  className="rounded-2xl border border-white/60 bg-white/10 px-7 py-3 font-semibold text-[#000000] backdrop-blur hover:bg-white/20"
                >
                  Conoce los planes
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Sección 2: Planes (fondo blanco) ===== */}
      <section id="plans" className="bg-[#FFFFFF]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <header className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#000000]">
              Planes creados para ti
            </h2>
            <p className="mt-2 text-[#000000]">
              Elige el que mejor acompañe tu estilo de disfrutar el vino.
              <br></br>Paga como prefieras y cancela cuando quieras.
            </p>
          </header>

          {/* Toggle nivel */}
          <div className="mx-auto mb-8 grid max-w-2xl grid-cols-2 overflow-hidden rounded-2xl border border-[#ADADAD] bg-[#FFFFFF] p-1 text-sm">
            {["basic", "premium"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`rounded-xl px-4 py-3 font-semibold capitalize transition ${
                  selectedLevel === level
                    ? "bg-[#FFFFFF] shadow"
                    : "text-[#ADADAD] hover:bg-[#F8F8F8]"
                }`}
                style={{
                  color: selectedLevel === level ? "#000000" : undefined,
                }}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Tarjetas de plan */}
          <div className="grid gap-6 sm:grid-cols-2">
            {["basic", "premium"].map((level) => {
              const plan = plans.find((p) => p.boxType === level);
              const active = selectedLevel === level;
              return (
                <article
                  key={level}
                  className={`rounded-3xl border border-[#ADADAD] p-6 shadow-sm transition ${
                    active ? "ring-2 ring-[#AD946C]" : ""
                  }`}
                >
                
                  <div className="mb-6 flex flex-col items-center text-center">
                    <p className="text-xl uppercase tracking-widest text-[#000000]">
                      Box Premier
                    </p>
                    <h3 className="mt-1 text-3xl font-extrabold capitalize text-[#AD946C]">
                      {level === "basic" ? "Basic" : "Premium"}
                    </h3>
                    <div className="mt-3">
                      <p className="text-sm text-[#ADADAD]">1er mes</p>
                      <p className="text-3xl font-black text-[#000000]">
                        {firstMonthPrice.toFixed(0)}€
                      </p>
                    </div>
                  </div>

                  <div
                    className="mb-4 rounded-xl bg-[#F8F6F4] p-4"
                    style={{ backgroundColor: "#F8F6F4" }}
                  >
                    <p className="text-sm text-[#000000]">
                      Luego{" "}
                      <span className="font-semibold">
                        {plan?.price ? `${plan.price.toFixed(2)}€` : "—"}
                      </span>{" "}
                      al mes. Caja de{" "}
                      <span className="font-semibold">
                        {plan?.boxSize ?? "—"}
                      </span>{" "}
                      botellas (750 ml).
                    </p>
                  </div>

                  <ul className="mb-6 list-disc space-y-2 pl-5 text-sm text-[#000000]">
                    {(BENEFITS[level] || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedLevel(level)}
                    className={`mb-4 w-full rounded-xl px-4 py-3 font-semibold transition ${
                      active
                        ? "bg-[#AD946C] text-[#000000] hover:opacity-90"
                        : "bg-[#000000] text-[#FFFFFF] hover:opacity-90"
                    }`}
                  >
                    {active ? "Plan seleccionado" : "Elegir este plan"}
                  </button>

                  {active && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-[#000000]">
                        Tipo de vino
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {WINE_TYPES.map((t) => (
                          <button
                            key={t}
                            onClick={() => setWineType(t)}
                            className={`rounded-xl border px-3 py-2 capitalize ${
                              wineType === t
                                ? "border-[#AD946C] bg-[#FFF8F1]"
                                : "border-[#ADADAD] hover:bg-[#F8F8F8]"
                            }`}
                            style={{ color: "#000000" }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      {/* <button
                        onClick={handleSubscribe}
                        disabled={submitting}
                        className="mt-2 w-full rounded-2xl bg-[#000000] px-6 py-3 font-semibold text-[#FFFFFF] hover:opacity-90 disabled:opacity-60"
                      >
                        {submitting
                          ? "Creando suscripción…"
                          : "Suscribirme ahora"}
                      </button> */}

                      <p
                        className="mt-2 text-center text-xs"
                        style={{ color: "#ADADAD" }}
                      >
                        Pagos seguros con PayPall. Puedes cancelar cuando
                        quieras.
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* CTA global en la sección 2 */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => ensureAuthThen(handleSubscribe)}
              disabled={submitting || !selectedPlan}
              className="rounded-2xl bg-[#AD946C] px-6 py-3 mt-8 font-semibold text-[#000000] hover:opacity-90 disabled:opacity-60"
              title={
                !selectedPlan
                  ? "Selecciona un plan"
                  : "Continuar con la suscripción"
              }
            >
              {submitting ? "Creando suscripción…" : "Suscríbete ahora"}
            </button>
            {error && (
              <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>

          {/* ===== Todo lo que necesitas saber (FAQ) ===== */}
          <div className="mt-14">
            <h3 className="mb-4 text-2xl font-bold text-center text-[#000000]">
              Todo lo que necesitas saber
            </h3>

            <div className="divide-y divide-[#ADADAD]/40 rounded-2xl border border-[#ADADAD]">
              <details className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between">
                  <span className="text-base font-semibold text-[#000000]">
                    ¿Qué incluye cada caja?
                  </span>
                  <span className="text-[#AD946C] transition group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#000000]">
                  6 botellas seleccionadas por sumilleres, fichas de cata y
                  sugerencias de maridaje.
                </p>
              </details>

              <details className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between">
                  <span className="text-base font-semibold text-[#000000]">
                    ¿Cómo funciona el cobro?
                  </span>
                  <span className="text-[#AD946C] transition group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#000000]">
                  El primer mes pagas {firstMonthPrice.toFixed(0)}€ y luego{" "}
                  {currentPrice ? `${currentPrice.toFixed(2)}€` : "—"} al mes
                  mediante PayPall. Puedes cancelar cuando quieras.
                </p>
              </details>

              <details className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between">
                  <span className="text-base font-semibold text-[#000000]">
                    ¿Cuándo recibo mi caja?
                  </span>
                  <span className="text-[#AD946C] transition group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#000000]">
                  Preparamos tu pedido al confirmar la suscripción y te
                  notificamos con el número de seguimiento.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
