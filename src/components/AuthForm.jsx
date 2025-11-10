import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { login, register } from "../services/AuthServices";
import useAuthStore from "../store/authStore";

const COLORS = {
  gold: "#AD946C",
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
          className="mx-auto rounded-[14px] border shadow-[0_6px_20px_rgba(0,0,0,0.06)] px-8 py-10 sm:p-12"
          style={{ borderColor: COLORS.gold }}
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
                {/* Nome e Apellido, Teléfono e Correo, Contraseña e Confirmar contraseña */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-[#000000]">Nombre</label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                      style={{ borderColor: COLORS.gold }}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-[#000000]">Apellido</label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                      style={{ borderColor: COLORS.gold }}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-[#000000]">Teléfono</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                      style={{ borderColor: COLORS.gold }}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-[#000000]">Correo electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                      style={{ borderColor: COLORS.gold }}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-[#000000]">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                      style={{ borderColor: COLORS.gold }}
                      autoComplete="current-password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                    )}
                  </div>
                  {isRegister && (
                    <div>
                      <label className="text-xs text-[#000000]">Confirmar contraseña</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                        style={{ borderColor: COLORS.gold }}
                        autoComplete="new-password"
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Dirección */}
                <div className="mt-6">
                  <p className="mb-3 text-sm font-semibold">Dirección</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs">Calle</label>
                      <input
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                        style={{ borderColor: COLORS.gold }}
                      />
                      {errors.street && <p className="mt-1 text-xs text-red-600">{errors.street}</p>}
                    </div>
                    <div>
                      <label className="text-xs">Número</label>
                      <input
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                        style={{ borderColor: COLORS.gold }}
                      />
                      {errors.number && <p className="mt-1 text-xs text-red-600">{errors.number}</p>}
                    </div>
                    <div>
                      <label className="text-xs">Piso</label>
                      <input
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                        style={{ borderColor: COLORS.gold }}
                      />
                    </div>
                    <div>
                      <label className="text-xs">Código Postal</label>
                      <input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                        style={{ borderColor: COLORS.gold }}
                      />
                      {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>}
                    </div>
                    <div>
                      <label className="text-xs">Ciudad</label>
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                        style={{ borderColor: COLORS.gold }}
                      />
                      {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-xs">Provincia</label>
                      <input
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                        style={{ borderColor: COLORS.gold }}
                      />
                      {errors.province && <p className="mt-1 text-xs text-red-600">{errors.province}</p>}
                    </div>
                  </div>
                </div>

                {/* Checkbox de termos */}
                {isRegister && (
                  <label className="mt-2 flex items-center gap-2 text-xs" style={{ color: COLORS.gray }}>
                    <input type="checkbox" className="rounded border" required /> Acepto los términos y política de privacidad
                  </label>
                )}

                {/* Botão de submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 w-full rounded-2xl px-6 py-3 font-semibold shadow transition"
                  style={{ backgroundColor: COLORS.gold, color: COLORS.black }}
                >
                  {submitting ? "Procesando…" : isRegister ? "Crear cuenta" : "Iniciar sesión"}
                </button>
              </>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}
