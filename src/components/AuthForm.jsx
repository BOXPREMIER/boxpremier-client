import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { login, register } from "../services/AuthServices";
import useAuthStore from "../store/authStore";
import { showCustomAlert } from "../components/CustomAlert";

export default function AuthForm({ mode = "login" }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const next = search.get("next") || "/app/subscription";

  const { setToken, setUser } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      if (confirmPassword !== password) e.confirmPassword = "No coincide";
    }
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      showCustomAlert({
        title: "Error",
        text: "Por favor completa todos los campos requeridos correctamente.",
        confirmText: "Cerrar",
        type: "error"
      });
      return;
    }

    try {
      setSubmitting(true);
      let res;
      if (isRegister) {
        res = await register({ firstName, lastName, email, password });
      } else {
        res = await login({ email, password });
      }

      if (res?.token && res?.user) {
        setToken(res.token);
        setUser(res.user);
        navigate(res.user.userType === "admin" ? "/admin/dashboard" : "/app/home", { replace: true });
      } else {
        showCustomAlert({
          title: "Error",
          text: "No se recibió token. Intenta de nuevo.",
          confirmText: "Cerrar",
          type: "error"
        });
      }
    } catch (err) {
      showCustomAlert({
        title: "Error",
        text: err?.message || "Error de autenticación",
        confirmText: "Cerrar",
        type: "error"
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg shadow">
          <h1 className="text-center text-xl font-bold mb-4">
            {isRegister ? "Crea tu cuenta" : "Bienvenido de vuelta"}
          </h1>

          {errors.general && <p className="text-red-600 text-center">{errors.general}</p>}

          {isRegister && (
            <>
              <label>
                Nombre
                <input
                  placeholder="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full mt-1 border rounded px-2 py-1"
                />
                {errors.firstName && <p className="text-red-600 text-xs">{errors.firstName}</p>}
              </label>

              <label>
                Apellido
                <input
                  placeholder="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full mt-1 border rounded px-2 py-1"
                />
                {errors.lastName && <p className="text-red-600 text-xs">{errors.lastName}</p>}
              </label>
            </>
          )}

          <label>
            Correo electrónico
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-1"
            />
            {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
          </label>

          <label>
            Contraseña
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-1"
            />
            {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}
          </label>

          {isRegister && (
            <label>
              Confirmar contraseña
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 border rounded px-2 py-1"
              />
              {errors.confirmPassword && <p className="text-red-600 text-xs">{errors.confirmPassword}</p>}
            </label>
          )}

          <button type="submit" disabled={submitting} className="w-full py-2 bg-blue-600 text-white rounded">
            {submitting ? "Procesando…" : isRegister ? "Crear cuenta" : "Iniciar sesión"}
          </button>

          <p className="text-center text-sm mt-2">
            {isRegister ? (
              <>
                ¿Ya tienes cuenta? <Link to={`/login?next=${encodeURIComponent(next)}`} className="underline">Inicia sesión</Link>
              </>
            ) : (
              <>
                ¿No tienes cuenta? <Link to={`/register?next=${encodeURIComponent(next)}`} className="underline">Crea tu cuenta</Link>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
