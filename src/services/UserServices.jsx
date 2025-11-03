import API from "./Api";

// Obtener todos los usuarios
export const getUsers = async () => {
  const { data } = await API.get("/users");
  console.log("Datos recibidos en getUsers:", res.data);
  return data.data || [];
};

// Obtener un usuario específico
export const getUser = async (id) => {
  const { data } = await API.get(`/users/${id}`);
  return data.data;
};

// Crear usuario
export const createUser = async (userData) => {
  const { data } = await API.post("/users", userData);
  return data.data;
};

// Actualizar usuario
export const updateUser = async (id, userData) => {
  const { data } = await API.patch(`/users/${id}`, userData);
  return data.data;
};

// Eliminar usuario
export const deleteUser = async (id) => {
  const { data } = await API.delete(`/users/${id}`);
  return data.data;
};

//INGRID ESTUVO POR AQUI
export async function getUserById(userId) {
  const { data } = await API.get(`/users/${userId}`)
  return data
}

