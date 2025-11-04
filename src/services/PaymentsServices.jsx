import API from './Api';

// Servicio para crear un nuevo pago
export const createPayment = async (paymentData) => {
  try {
    const response = await API.post(`/payments`, paymentData);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error al crear el pago:', error);
    throw error;
  }
};

// Servicio para obtener todos los pagos
// Si es admin: obtiene todos los pagos
// Si es usuario: obtiene solo sus pagos
export const getAllPayments = async () => {
  try {
    const response = await API.get(`/payments`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    throw error;
  }
};

// Servicio para obtener un pago por ID
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

// Servicio para actualizar el estado de un pago
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