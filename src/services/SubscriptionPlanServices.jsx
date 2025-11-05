import API from './Api';

export const getAllPlans = async () => {
    const { data } = await API.get('/plans');
    return data.data || [];
};

export const getPlanById = async (id) => {
    const { data } = await API.get(`/plans/${id}`);
    return data.data;
};

export const createPlan = async (planData) => {
    const { data } = await API.post('/plans', planData);
    return data.data;
};

export const updatePlan = async (id, planData) => {
    const { data } = await API.put(`/plans/${id}`, planData);
    return data.data;
};

export const deletePlan = async (id) => {
    const { data } = await API.delete(`/plans/${id}`);
    return data.data;
};