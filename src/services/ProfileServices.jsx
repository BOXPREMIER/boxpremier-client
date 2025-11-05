// services/ProfileServices.jsx
import API from "./Api";
import useAuthStore from "../store/authStore";

// GET datos del usuario autenticado
export async function getMe() {
  const id = useAuthStore.getState()?.user?._id || useAuthStore.getState()?.user?.id;
  const { data } = await API.get(`/users/${id}`);
  return data;
}

// PATCH perfil del usuario autenticado (incluida password si la envías)
export async function updateMe(patch) {
  const id = useAuthStore.getState()?.user?._id || useAuthStore.getState()?.user?.id;
  const { data } = await API.patch(`/users/${id}`, patch);
  return data;
}

// Cambiar contraseña = PATCH /users/:id con { password }
export async function changeMyPassword({ newPassword }) {
  const id = useAuthStore.getState()?.user?._id || useAuthStore.getState()?.user?.id;
  const { data } = await API.patch(`/users/${id}`, { password: newPassword });
  return data;
}
