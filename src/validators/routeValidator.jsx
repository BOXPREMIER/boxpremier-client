// import { redirect } from "react-router-dom";
// import useAuthStore from "../store/authStore";

// /** Guard básico: exige sesión */
// export async function authGuard({ request }) {
//   const { token, user } = useAuthStore.getState();

//   // también mira LocalStorage por si recargaste y zustand aún no hidrató
//   const savedToken = token || localStorage.getItem("token");
//   const savedUser =
//     user || JSON.parse(localStorage.getItem("user") || "null");

//   if (!savedToken) {
//     const url = new URL(request.url);
//     const next = url.pathname + url.search;
//     throw redirect(`/login?next=${encodeURIComponent(next)}`);
//   }

//   // Puede devolver datos para usar con useLoaderData
//   return savedUser ?? null;
// }

// /** Guard de administrador (requiere rol === 'admin') */
// export async function adminGuard(args) {
//   const { user } = useAuthStore.getState();
//   const savedUser = user || JSON.parse(localStorage.getItem("user") || "null");

//   if (!savedUser || savedUser.role !== "admin") {
//     throw redirect("/");
//   }
//   return null;
// }

// /** Compat: si ya usabas 'routeValidator', exporto el guard básico con ese nombre */
// export const routeValidator = authGuard;
// export default authGuard;


import { redirect } from "react-router-dom";
import useAuthStore from "../store/authStore";

/** Guard básico: exige sesión */
export async function authGuard({ request }) {
  const { token, user } = useAuthStore.getState();
  // también mira LocalStorage por si recargaste y zustand aún no hidrató
  const savedToken = token || localStorage.getItem("token");
  const savedUser = user || JSON.parse(localStorage.getItem("user") || "null");

  if (!savedToken) {
    const url = new URL(request.url);
    const next = url.pathname + url.search;
    throw redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  // Puede devolver datos para usar con useLoaderData
  return savedUser ?? null;
}

/** Guard de administrador (requiere token + userType === 'admin') */
export async function adminGuard(args) {
  const { token, user } = useAuthStore.getState();
  // también mira LocalStorage por si recargaste y zustand aún no hidrató
  const savedToken = token || localStorage.getItem("token");
  const savedUser = user || JSON.parse(localStorage.getItem("user") || "null");

  // Primero verificar si tiene sesión
  if (!savedToken || !savedUser) {
    throw redirect("/login");
  }

  // Luego verificar si es admin (backend usa 'userType', no 'role')
  if (savedUser.userType !== "admin") {
    throw redirect("/app");
  }

  return null;
}

/** Compat: si ya usabas 'routeValidator', exporto el guard básico con ese nombre */
export const routeValidator = authGuard;
export default authGuard;