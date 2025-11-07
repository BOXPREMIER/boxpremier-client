// src/pages/ProfilePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import useAuthStore from "../store/authStore";
import { getMe, updateMe, changeMyPassword } from "../services/ProfileServices";
import {
  getMyActiveSubscription,
  cancelSubscription,
} from "../services/subscriptionsService";

const tabButton = (active) =>
  `px-4 py-1 rounded-full text-sm border transition font-gotham ${
    active ? "bg-[#F5F5F5] border-[#ADADAD]" : "border-[#ADADAD] hover:bg-[#F5F5F5]"
  }`;

const field =
  "w-full rounded-full border px-4 py-2 outline-none focus:ring-2 " +
  "border-[#AD946C]/60 focus:ring-[#AD946C]/40 text-primary bg-white font-gotham";

const card =
  "rounded-xl border border-[#E7E7E7] p-6 md:p-8 shadow-sm bg-white font-gotham text-primary";

export default function ProfilePage() {
  const { user: userStore, setUser } = useAuthStore();
  const [tab, setTab] = useState("perfil"); // perfil | suscripciones | ajustes

  // ----- PERFIL -----
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    floor: "",
    postalCode: "",
    city: "",
    province: "",
    country: "ES",
  });
  const [saving, setSaving] = useState(false);

  // ----- SUSCRIPCIÓN -----
  const [sub, setSub] = useState(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [canceling, setCanceling] = useState(false);

  // ----- PASSWORD -----
  const [pwd, setPwd] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ c: false, n: false, r: false });
  const [changing, setChanging] = useState(false);

  // Carga de usuario
  useEffect(() => {
    (async () => {
      try {
        // Trae siempre del back para mantener datos frescos
        const me = await getMe();
        if (me) {
          setUser(me);
          setProfile((p) => ({
            ...p,
            firstName: me.firstName || "",
            lastName: me.lastName || "",
            email: me.email || "",
            phone: me.phone || "",
            street: me.street || "",
            number: me.number || "",
            floor: me.floor ?? "",
            postalCode: me.postalCode || "",
            city: me.city || "",
            province: me.province || "",
            country: me.country || "ES",
          }));
        }
      } catch (e) {
        console.error(e);
        alert("No se pudo cargar tu perfil");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carga de suscripción activa al entrar en la pestaña
  useEffect(() => {
    if (tab !== "suscripciones") return;
    (async () => {
      setLoadingSub(true);
      try {
        const s = await getMyActiveSubscription();
        setSub(s || null);
      } catch (e) {
        console.error(e);
        setSub(null);
      } finally {
        setLoadingSub(false);
      }
    })();
  }, [tab]);

  const fullName = useMemo(
    () => [profile.firstName, profile.lastName].filter(Boolean).join(" "),
    [profile.firstName, profile.lastName]
  );

  // Guardar perfil
  const onSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await updateMe(profile);
      setUser((prev) => ({ ...prev, ...profile, ...updated }));
      alert("Perfil actualizado");
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  // Cancelar suscripción
  const onCancelPlan = async () => {
    if (!sub?._id) return;
    if (!confirm("¿Seguro que quieres cancelar tu plan?")) return;
    try {
      setCanceling(true);
      const res = await cancelSubscription(sub._id);
      setSub(res); // el back devuelve la suscripción cancelada
    } catch (e) {
      console.error(e);
      alert("No se pudo cancelar la suscripción");
    } finally {
      setCanceling(false);
    }
  };

  // Cambiar contraseña
  const onChangePassword = async (e) => {
    e.preventDefault();
    if (!pwd.newPassword) return alert("Introduce la nueva contraseña");
    if (pwd.newPassword !== pwd.confirmPassword) {
      return alert("La nueva contraseña y su confirmación no coinciden");
    }
    try {
      setChanging(true);
      // Tu back cambia contraseña con PATCH /users/:id { password }
      await changeMyPassword({ newPassword: pwd.newPassword });
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Contraseña actualizada");
    } catch (e) {
      console.error(e);
      alert("No se pudo cambiar la contraseña");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-0 py-10 font-gotham text-primary">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Mi cuenta</h1>
        <p className="text-sm" style={{ color: "#ADADAD" }}>
            Administra tu cuenta y suscripciones como quieras.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {/* Reemplaza los src de los <img> por las rutas a tus imágenes */}
        <button className={tabButton(tab === "perfil")} onClick={() => setTab("perfil")}>
          <span className="inline-flex items-center gap-2">
            <img src="/assets/icons/user.png" alt="" className="h-4 w-4" />
            Perfil
          </span>
        </button>
        <button className={tabButton(tab === "suscripciones")} onClick={() => setTab("suscripciones")}>
          <span className="inline-flex items-center gap-2">
            <img src="/assets/icons/box.png" alt="" className="h-4 w-4" />
            Suscripciones
          </span>
        </button>
        <button className={tabButton(tab === "ajustes")} onClick={() => setTab("ajustes")}>
          <span className="inline-flex items-center gap-2">
            <img src="/assets/icons/lock.png" alt="" className="h-4 w-4" />
            Ajustes
          </span>
        </button>
      </div>

      {/* PERFIL */}
      {tab === "perfil" && (
        <section className={card}>
          <div className="flex items-center gap-4 mb-6">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: "#AD946C" }}
              title={fullName || "Usuario"}
            >
              {(fullName || "U").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{fullName || "Tu perfil"}</h2>
              <p className="text-sm" style={{ color: "#ADADAD" }}>{profile.email || "—"}</p>
            </div>
          </div>

          <form onSubmit={onSaveProfile} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Nombre</label>
                <input
                  className={field}
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm">Apellidos</label>
                <input
                  className={field}
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm">Correo Electrónico</label>
                <input
                  type="email"
                  className={field}
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm">Número de Teléfono</label>
                <input
                  className={field}
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Dirección</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Calle</label>
                  <input
                    className={field}
                    value={profile.street}
                    onChange={(e) => setProfile({ ...profile, street: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm">Número</label>
                  <input
                    className={field}
                    value={profile.number}
                    onChange={(e) => setProfile({ ...profile, number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm">Piso</label>
                  <input
                    className={field}
                    value={profile.floor}
                    onChange={(e) => setProfile({ ...profile, floor: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm">Código Postal</label>
                  <input
                    className={field}
                    value={profile.postalCode}
                    onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm">Ciudad</label>
                  <input
                    className={field}
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm">Estado/Provincia</label>
                  <input
                    className={field}
                    value={profile.province}
                    onChange={(e) => setProfile({ ...profile, province: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-full text-white"
                style={{ backgroundColor: "#AD946C" }}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* SUSCRIPCIONES */}
      {tab === "suscripciones" && (
        <section className={card}>
          <h2 className="text-2xl font-semibold mb-2">Suscripciones Actuales</h2>
          <p className="text-sm" style={{ color: "#ADADAD" }}>
            Administra tus suscripciones como quieras.
          </p>

          {loadingSub ? (
            <p>Cargando...</p>
          ) : !sub ? (
            <p>No tienes una suscripción activa.</p>
          ) : (
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: "#EFE8DD", border: "1px solid #D9C7AE" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    {sub.boxType === "basic" ? "Box Premier Basic" : "Suscripción"}
                  </h3>
                  <p className="text-sm" style={{ color: "#6B6B6B" }}>
                    {(sub.boxSize || 3)} botella de vino al mes.
                  </p>
                </div>
                {/* Icono decorativo (sustituye src por tu imagen) */}
                <img src="/assets/icons/wine.png" alt="" className="h-8 w-8" />
              </div>

              <div
                className="border-t mt-4 pt-4 text-sm grid md:grid-cols-2 gap-2"
                style={{ borderColor: "#D9C7AE" }}
              >
                <div className="flex justify-between">
                  <span>Fecha de suscripción:</span>
                  <span>
                    {new Date(sub.startDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Próximo cobro:</span>
                  <span>
                    {new Date(sub.nextPayDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onCancelPlan}
                  disabled={canceling || sub.status !== "active"}
                  className="px-5 py-2 rounded-full text-white"
                  style={{
                    backgroundColor: "#7B1D1D",
                    opacity: canceling || sub.status !== "active" ? 0.6 : 1,
                  }}
                >
                  {canceling ? "Cancelando..." : "Cancelar plan"}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* AJUSTES */}
      {tab === "ajustes" && (
        <section className={card}>
          <h2 className="text-xl font-semibold mb-6">Modificar Contraseña</h2>

          <form onSubmit={onChangePassword} className="space-y-5 max-w-xl">
            <div>
              <label className="text-sm">Contraseña Actual</label>
              <div className="relative">
                <input
                  className={field}
                  type={show.c ? "text" : "password"}
                  value={pwd.currentPassword}
                  onChange={(e) =>
                    setPwd({ ...pwd, currentPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShow((s) => ({ ...s, c: !s.c }))}
                  title={show.c ? "Ocultar" : "Mostrar"}
                >
                  {show.c ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm">Nueva Contraseña</label>
              <div className="relative">
                <input
                  className={field}
                  type={show.n ? "text" : "password"}
                  value={pwd.newPassword}
                  onChange={(e) =>
                    setPwd({ ...pwd, newPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShow((s) => ({ ...s, n: !s.n }))}
                  title={show.n ? "Ocultar" : "Mostrar"}
                >
                  {show.n ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <input
                  className={field}
                  type={show.r ? "text" : "password"}
                  value={pwd.confirmPassword}
                  onChange={(e) =>
                    setPwd({ ...pwd, confirmPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShow((s) => ({ ...s, r: !s.r }))}
                  title={show.r ? "Ocultar" : "Mostrar"}
                >
                  {show.r ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changing}
                className="px-6 py-2 rounded-full text-white"
                style={{ backgroundColor: "#AD946C" }}
              >
                {changing ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
