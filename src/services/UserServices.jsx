import API from "./Api";

// Obtener todos los usuarios
export const getUsers = async () => {
  const res = await API.get("/users"); // json-server usa plural
  console.log("Datos recibidos en getUsers:", res.data);
  // En el backend real probablemente vendrá como res.data.data
  return res.data.data || res.data || [];
};

// Obtener un usuario específico
export const getUser = async (id) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};

// Crear usuario
export const createUser = async (data) => {
  const res = await API.post("/users", data);
  return res.data;
};

// Actualizar usuario
export const updateUser = async (id, data) => {
  const res = await API.patch(`/users/${id}`, data);
  return res.data;
};

// Eliminar usuario
export const deleteUser = async (id) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};
