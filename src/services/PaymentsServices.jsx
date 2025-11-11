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
    console.log(`Intentando actualizar pago ${id} con:`, updates);
    
    // Intenta primero con PATCH (más común para actualizaciones parciales)
    try {
      const response = await API.patch(`/payments/${id}`, updates);
      console.log("Actualización exitosa");
      return response.data;
    } catch (patchError) {
      console.log("PATCH falló, intentando con PUT:", patchError.response?.status);
      
      // Si PATCH falla con 404, intenta con PUT
      if (patchError.response?.status === 404) {
        const response = await API.put(`/payments/${id}`, updates);
        console.log("Actualización exitosa");
        return response.data;
      }
      throw patchError;
    }
  } catch (error) {
    console.error(`Error al actualizar el pago ${id}:`, error.response || error);
    
    
    if (error.response?.status === 404) {
      console.log("Intentando ruta alternativa: /payments/${id}/status");
      try {
        const response = await API.patch(`/payments/${id}/status`, updates);
        console.log("Actualización exitosa");
        return response.data;
      } catch (altError) {
        console.error("Todas las rutas alternativas fallaron:", altError);
        throw new Error(`No se pudo actualizar el pago. Verifica la configuración del backend. Error: ${error.message}`);
      }
    }
    
    throw error;
  }
};

// Función alternativa específica para actualizar solo el estado
export const updateStatus = async (id, status) => {
  try {
    const response = await API.patch(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el estado del pago ${id}:`, error);
    throw error;
  }
};

// Función para actualizar tracking/envío
export const updateShipping = async (id, shippingData) => {
  try {
    const response = await API.patch(`/payments/${id}/shipping`, shippingData);
    return response;
  } catch (error) {
    console.error(`Error al actualizar el envío del pago ${id}:`, error);
    throw error;
  }
};