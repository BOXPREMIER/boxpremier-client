import API from "./Api";

export async function login(credentials) {
  const { data } = await API.post("/auth/login", credentials);
  return data; // { token, user }
}

export async function register(payload) {
  const { data } = await API.post("/auth/register", payload);
  return data; // { token?, user? }
}
