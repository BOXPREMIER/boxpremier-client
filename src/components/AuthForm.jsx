import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { login, register } from "../services/AuthServices";
import useAuthStore from "../store/authStore";

const COLORS = {

  white: "#FFFFFF",
  gray: "#ADADAD",
  black: "#000000",
};

export default function AuthForm({ mode = "login" }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const next = search.get("next") || "/subscriptionPage";

  const { setToken, setUser } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("ES");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const emailRe = /\S+@\S+\.\S+/;

  function validate() {
    const e = {};
    if (!emailRe.test(email)) e.email = "Email inválido";
    if (password.length < 6) e.password = "Mínimo 6 caracteres";
    if (isRegister) {
      if (!firstName) e.firstName = "Nombre requerido";
      if (!lastName) e.lastName = "Apellido requerido";
      if (!phone) e.phone = "Teléfono requerido";
      if (!street) e.street = "Calle requerida";
      if (!number) e.number = "Número requerido";
      if (!postalCode) e.postalCode = "Código postal requerido";
      if (!city) e.city = "Ciudad requerida";
      if (!province) e.province = "Provincia requerida";
      if (!country) e.country = "País requerido";
      if (confirmPassword !== password) e.confirmPassword = "No coincide";
    }
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    try {
      setSubmitting(true);
      if (isRegister) {
        const res = await register({
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
          country,
        });

        if (res?.token && res?.user) {
          setToken(res.token);
          setUser(res.user);
          navigate(next, { replace: true });
        } else {
          navigate(`/login?next=${encodeURIComponent(next)}`, {
            replace: true,
          });
        }
      } else {
        const res = await login({ email, password });
        if (res?.token && res?.user) {
          setToken(res.token);
          setUser(res.user);
          navigate(next, { replace: true });
        } else {
          setErrors({ general: "No se recibió token. Intenta de nuevo." });
        }
      }
    } catch (err) {
      setErrors({
        general: err?.response?.data?.message || "Error de autenticación",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[820px]">
        <div
          className="mx-auto rounded-[14px] border shadow-[0_6px_20px_rgba(0,0,0,0.06)] px-8 py-10 sm:p-12 border-secondary"
        >
          <div className="mb-8 flex justify-center">
            <img
              src="/public/logo-vinopremier.png"
              alt="Vino Premier"
              className="h-16 w-16 object-contain select-none"
              draggable="false"
            />
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-lg sm:text-xl font-bold" style={{ color: COLORS.black }}>
              {isRegister ? "Crea tu cuenta" : "Bienvenido de vuelta"}
            </h1>
            <p className="mt-1 text-xs sm:text-[13px]" style={{ color: COLORS.gray }}>
              {isRegister ? "Empieza a disfrutar de nuevos vinos hoy." : "Accede a tu cuenta"}
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {Array.isArray(errors.general)
                ? errors.general.map((err, i) => (
                  <p key={i} className="text-center">
                    {err.message}
                  </p>
                ))
                : <p className="text-center">{errors.general}</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>
                      Nombre
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      autoComplete="given-name"
                    />
                    {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>
                      Apellido
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      autoComplete="family-name"
                    />
                    {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>
                      Teléfono
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      autoComplete="tel"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      autoComplete="email"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      autoComplete="new-password"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold" style={{ color: COLORS.black }}>Dirección</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>Calle</label>
                      <input
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      />
                      {errors.street && <p className="mt-1 text-xs text-red-600">{errors.street}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>Número</label>
                      <input
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      />
                      {errors.number && <p className="mt-1 text-xs text-red-600">{errors.number}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>Piso</label>
                      <input
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>Código Postal</label>
                      <input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      />
                      {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>Ciudad</label>
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      />
                      {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>Provincia</label>
                      <input
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                      />
                      {errors.province && <p className="mt-1 text-xs text-red-600">{errors.province}</p>}
                    </div>
                  </div>
                </div>

                <label className="mt-2 flex items-center gap-2 text-xs" style={{ color: COLORS.gray }}>
                  <input type="checkbox" className="rounded border" required /> Acepto los términos y política de privacidad
                </label>
              </>
            )}

            {!isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                    autoComplete="email"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: COLORS.black }}>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-secondary"
                    autoComplete="current-password"
                  />
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded-2xl px-6 py-3 font-semibold shadow transition bg-secondary"
            >
              {submitting
                ? "Procesando…"
                : isRegister
                  ? "Crear cuenta"
                  : "Iniciar sesión"}
            </button>

            <p className="mt-4 text-center text-xs" style={{ color: COLORS.gray }}>
              {isRegister ? (
                <>
                  ¿Ya tienes cuenta?{" "}
                  <Link to={`/login?next=${encodeURIComponent(next)}`} className="underline">
                    Inicia sesión
                  </Link>
                </>
              ) : (
                <>
                  ¿No tienes cuenta?{" "}
                  <Link to={`/register?next=${encodeURIComponent(next)}`} className="underline">
                    Crea tu cuenta
                  </Link>
                </>
              )}
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
