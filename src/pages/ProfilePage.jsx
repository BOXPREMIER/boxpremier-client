import React, { useEffect, useMemo, useState } from "react";
import useAuthStore from "../store/authStore";
import { getSubscriptions, cancelSubscription } from "../services/SubscriptionServices";
import { getMe, updateMe, changeMyPassword } from "../services/ProfileServices";
import { getAllOrders, cancelOrder } from "../services/OrderServices";

const tabButton = (active) =>
  `px-4 py-1 rounded-full text-sm border transition font-gotham ${active ? "bg-[#F5F5F5] border-[#ADADAD]" : "border-[#ADADAD] hover:bg-[#F5F5F5]"}`;

const field =
  "w-full rounded-full border px-4 py-2 outline-none focus:ring-2 " +
  "border-[#AD946C]/60 focus:ring-[#AD946C]/40 text-primary bg-white font-gotham disabled:bg-gray-100 disabled:cursor-not-allowed";

const card =
  "rounded-xl border border-[#E7E7E7] p-6 md:p-8 shadow-sm bg-white font-gotham text-primary";

export default function ProfilePage() {
  const { user: userStore, setUser } = useAuthStore();
  const [tab, setTab] = useState("perfil");
  const [orders, setOrders] = useState([]);

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
  const [isEditing, setIsEditing] = useState(false);
  const [sub, setSub] = useState([]);
  const [loadingSub, setLoadingSub] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const [pwd, setPwd] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ c: false, n: false, r: false });
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    (async () => {
      if (!userStore?._id) {
        return;
      }

      if (profile.email) {
        return;
      }
      try {
        const me = await getMe();
        if (me) {
          setUser(me);
          setProfile({
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
          });
        }
      } catch (e) {
        console.error(e);
        alert("No se pudo cargar tu perfil");
      }
    })();
  }, []);

  useEffect(() => {
    if (tab !== "suscripciones") return;
    (async () => {
      setLoadingSub(true);
      try {
        const [allSubs, allOrders] = await Promise.all([
          getSubscriptions(),
          getAllOrders()
        ]);

        const activeSubs = allSubs.filter(s =>
          s.status === "active" || s.status === "pending"
        );

        const subsWithOrders = activeSubs.map(sub => {
          const matchingOrders = allOrders.filter(order => {
            const match1 = order.subscriptionId?._id === sub._id;
            const match2 = order.subscriptionId === sub._id;
            const match3 = String(order.subscriptionId?._id) === String(sub._id);
            const match4 = String(order.subscriptionId) === String(sub._id);

            // console.log("Comparando:", {
            //   subId: sub._id,
            //   orderSubId: order.subscriptionId,
            //   orderSubIdObj: order.subscriptionId?._id,
            //   match1, match2, match3, match4,
            //   orderStatus: order.status
            // });

            return (match3 || match4) && ['pending', 'preparing', 'shipped', 'delivered'].includes(order.status);
          });

          return { ...sub, hasOrders: matchingOrders.length > 0 };
        });

        setSub(subsWithOrders);
        setOrders(allOrders);
      } catch (e) {
        console.error(e);
        setSub([]);
      } finally {
        setLoadingSub(false);
      }
    })();
  }, [tab]);

  const fullName = useMemo(
    () => [profile.firstName, profile.lastName].filter(Boolean).join(" "),
    [profile.firstName, profile.lastName]
  );

  const onSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await updateMe(profile);
      setUser((prev) => ({ ...prev, ...profile, ...updated }));
      setIsEditing(false);
      alert("Perfil actualizado");
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const onCancelPlan = async (subId) => {
    if (!subId) return;
    if (!confirm("¿Seguro que quieres cancelar tu plan?")) return;

    try {
      setCanceling(true);

      await cancelSubscription(subId);

      const activeOrder = orders.find(
        (o) =>
          (String(o.subscriptionId?._id) === String(subId) ||
            String(o.subscriptionId) === String(subId)) &&
          !["shipped", "delivered", "cancelled"].includes(o.status)
      );

      // if (activeOrder) {
      //   await cancelOrder(activeOrder._id);
      //   console.log("Pedido cancelado:", activeOrder._id);
      // }

      setSub((prev) =>
        prev.map((s) =>
          s._id === subId ? { ...s, status: "canceled" } : s
        )
      );
    } catch (e) {
      console.error(e);
      alert("No se pudo cancelar la suscripción ni el pedido");
    } finally {
      setCanceling(false);
    }
  };


  const onChangePassword = async (e) => {
    e.preventDefault();
    if (!pwd.newPassword) return alert("Introduce la nueva contraseña");
    if (pwd.newPassword !== pwd.confirmPassword) {
      return alert("La nueva contraseña y su confirmación no coinciden");
    }
    try {
      setChanging(true);
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfile({
      firstName: userStore.firstName || "",
      lastName: userStore.lastName || "",
      email: userStore.email || "",
      phone: userStore.phone || "",
      street: userStore.street || "",
      number: userStore.number || "",
      floor: userStore.floor ?? "",
      postalCode: userStore.postalCode || "",
      city: userStore.city || "",
      province: userStore.province || "",
      country: userStore.country || "ES",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-0 py-10 font-gotham text-primary">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Mi cuenta</h1>
        <p className="text-sm" style={{ color: "#ADADAD" }}>
          Administra tu cuenta como quieras.
        </p>
      </header>

      <div className="flex items-center gap-2 mb-6">
        <button className={tabButton(tab === "perfil")} onClick={() => setTab("perfil")}>
          <span className="inline-flex items-center gap-2">Perfil</span>
        </button>
        {userStore?.userType === 'customer' && (
          <button className={tabButton(tab === "suscripciones")} onClick={() => setTab("suscripciones")}>
            <span className="inline-flex items-center gap-2">Suscripciones</span>
          </button>
        )}
        <button className={tabButton(tab === "ajustes")} onClick={() => setTab("ajustes")}>
          <span className="inline-flex items-center gap-2">Ajustes</span>
        </button>
      </div>

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
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm">Apellidos</label>
                <input
                  className={field}
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className={userStore?.userType === 'admin' ? 'md:col-span-2' : ''}>
                <label className="text-sm">Correo Electrónico</label>
                <input
                  type="email"
                  className={field}
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              {userStore?.userType === 'customer' && (
                <div>
                  <label className="text-sm">Número de Teléfono</label>
                  <input
                    className={field}
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              )}
            </div>

            {userStore?.userType === 'customer' && (
              <div>
                <h3 className="text-sm font-medium mb-2">Dirección</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Calle</label>
                    <input
                      className={field}
                      value={profile.street}
                      onChange={(e) => setProfile({ ...profile, street: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="text-sm">Número</label>
                    <input
                      className={field}
                      value={profile.number}
                      onChange={(e) => setProfile({ ...profile, number: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="text-sm">Piso</label>
                    <input
                      className={field}
                      value={profile.floor}
                      onChange={(e) => setProfile({ ...profile, floor: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="text-sm">Código Postal</label>
                    <input
                      className={field}
                      value={profile.postalCode}
                      onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="text-sm">Ciudad</label>
                    <input
                      className={field}
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="text-sm">Estado/Provincia</label>
                    <input
                      className={field}
                      value={profile.province}
                      onChange={(e) => setProfile({ ...profile, province: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 rounded-full text-white"
                  style={{ backgroundColor: "#AD946C" }}
                >
                  Editar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 rounded-full border"
                    style={{ borderColor: "#AD946C", color: "#AD946C" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-full text-white"
                    style={{ backgroundColor: "#AD946C" }}
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </>
              )}
            </div>
          </form>
        </section>
      )}

      {tab === "suscripciones" && (
        <section className={card}>
          <h2 className="text-2xl font-semibold mb-2">Suscripciones Actuales</h2>
          <p className="text-sm" style={{ color: "#ADADAD" }}>
            Administra tus suscripciones como quieras.
          </p>
          {loadingSub ? (
            <p>Cargando...</p>
          ) : sub.length === 0 ? (
            <p>No tienes suscripciones activas.</p>
          ) : (
            sub.map((s) => (
              <div
                key={s._id}
                className="rounded-xl p-6 mt-4"
                style={{ backgroundColor: "#EFE8DD", border: "1px solid #D9C7AE" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {s.subscriptionPlan?.boxType === "basic" ? "Box Premier Basic" : "Box Premier Prestige"}
                    </h3>
                    <p className="text-sm" style={{ color: "#6B6B6B" }}>
                      {s.subscriptionPlan?.boxSize || 3} botellas de vino al mes.
                    </p>
                  </div>
                </div>
                <div
                  className="border-t mt-4 pt-4 text-sm space-y-2"
                  style={{ borderColor: "#D9C7AE" }}
                >
                  <div className="flex justify-between">
                    <span>Fecha de suscripción:</span>
                    <span>
                      {new Date(s.startDate).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Próximo cobro:</span>
                    <span>
                      {new Date(s.nextPayDate).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  {s.hasOrders ? (
                    <p className="text-sm text-gray-600 italic">
                      Esta suscripción tiene pedido enviado o entregue. Contacta con el administrador para cancelarla.
                    </p>
                  ) : (
                    <button
                      onClick={() => { console.log("Clicou no botão, subId:", s._id); onCancelPlan(s._id) }}
                      disabled={canceling || s.status == "canceled"}
                      className="px-5 py-2 rounded-full text-white cursor-pointer"
                      style={{
                        backgroundColor: "#7B1D1D",
                        opacity: canceling || s.status == "canceled" ? 0.6 : 1,
                      }}
                    >
                      {canceling ? "Cancelando..." : "Cancelar plan"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {tab === "ajustes" && (
        <section className={card}>
          <h2 className="text-xl font-semibold mb-6">Modificar Contraseña</h2>

          <form onSubmit={onChangePassword} className="space-y-5 max-w-xl">
            <div>
              <label className="text-sm">Nueva Contraseña</label>
              <div className="relative">
                <input
                  className={field}
                  type={show.n ? "text" : "password"}
                  value={pwd.newPassword}
                  onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
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
                  onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
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