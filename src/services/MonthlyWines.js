import JsonServerAPI from "./JsonServerApi";

//  Obtener todos los vinos del JSON Server
export const getMonthlyWines = async () => {
  const { data } = await JsonServerAPI.get("/../monthlyWines");
  return data;
};

//  Obtener un vino específico por ID
export const getMonthlyWineById = async (id) => {
  const { data } = await JsonServerAPI.get(`/monthlyWines/${id}`);
  return data;
};

//  Crear un nuevo registro de vinos mensuales
export const createMonthlyWine = async (wineData) => {
  const { data } = await JsonServerAPI.post("/monthlyWines", wineData);
  return data;
};
