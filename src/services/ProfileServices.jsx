// services/ProfileServices.jsx
import API from "./Api";
import useAuthStore from "../store/authStore";

// GET datos del usuario autenticado
export async function getMe() {
  const user = useAuthStore.getState()?.user;
  const id = user?._id || user?.id;

  const { data } = await API.get(`/users/${id}`);
  return data.data;
}

// PATCH perfil del usuario autenticado (incluida password si la envías)
export async function updateMe(profileData) {
  const user = useAuthStore.getState()?.user;
  const id = user?._id || user?.id;

  const { data } = await API.put(`/users/${id}`, profileData);
  return data.data;
}

// Cambiar contraseña = PATCH /users/:id con { password }
export async function changeMyPassword({ newPassword }) {
  const user = useAuthStore.getState()?.user;
  const id = user?._id || user?.id;

  const { data } = await API.put(`/users/${id}`, { password: newPassword });
  return data.data;
}
