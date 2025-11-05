import API from "./API";

export const getMonthlyWines = async () => {
  const { data } = await API.get("/monthlyWines");
  return data;
};

export const getMonthlyWineById = async (id) => {
  const { data } = await API.get(`/monthlyWines/${id}`);
  return data;
};

export const createMonthlyWine = async (wineData) => {
  const { data } = await API.post("/monthlyWines", wineData);
  return data;
};
