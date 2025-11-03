import API from './Api';

export const getAllOrders = async () => {
    const { data } = await API.get('/orders');
    return data.data || [];
};

export const getOrderById = async (id) => {
    const { data } = await API.get(`/orders/${id}`);
    return data.data;
};

export const createOrder = async (orderData) => {
    const { data } = await API.post('/orders', orderData);
    return data.data;
};

export const updateOrderStatus = async (id, status) => {
    const { data } = await API.patch(`/orders/${id}/status`, { status });
    return data.data;
};

export const updateOrderAddress = async (id, address) => {
    const { data } = await API.patch(`/orders/${id}/address`, address);
    return data.data;
};

export const updateOrderTracking = async (id, tracking) => {
    const { data } = await API.patch(`/orders/${id}/tracking`, tracking);
    return data.data;
};

export const cancelOrder = async (id) => {
    const { data } = await API.patch(`/orders/${id}/cancel`);
    return data.data;
};

export const deleteOrder = async (id) => {
    const { data } = await API.delete(`/orders/${id}`);
    return data.data;
};