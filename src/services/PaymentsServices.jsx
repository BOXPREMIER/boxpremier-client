import API from "./Api";


export const createPayment = async (paymentData) => {
  try {
    const response = await API.post(`/payments`, paymentData);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error al crear el pago:", error);
    throw error;
  }
};


export const getAllPayments = async () => {
  try {
    const response = await API.get(`/payments`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    throw error;
  }
};

export const getPaymentById = async (id) => {
  try {
    const response = await API.get(`/payments/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`Error al obtener el pago ${id}:`, error);
    throw error;
  }
};

export const updatePaymentStatus = async (id, updates) => {
  try {
    const response = await API.put(`/payments/${id}`, updates);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`Error al actualizar el pago ${id}:`, error);
    throw error;
  }
};