import API from './Api';
import useAuthStore from '../store/authStore';

export async function createSubscription({ planId, boxType, wineType, payMethod = 'multisafepay' }) {
    const { user } = useAuthStore.getState();
    if (!user?._id && !user?.id) throw new Error('Necesitas iniciar sesión');
    const payload = {
        subscriptionPlanId: planId,
        wineType,
        payMethod
    };
    const { data } = await API.post('/subs', payload);
    return data.data;
}

export async function getMyActiveSubscription() {
    const { data } = await API.get('/subs');
    const activeSubs = data.data?.filter(sub => sub.status === 'active') || [];
    return activeSubs[0] || null;
}

export async function getSubscriptions() {
    const { data } = await API.get('/subs');
    return data.data || [];
}

export async function getUserSubscriptions(userId) {
    const { data } = await API.get(`/subs/${userId}`);
    return data.data || [];
}

export async function updateSubscription(subId, patch) {
    const { data } = await API.put(`/subs/${subId}`, patch);
    return data.data;
}

export async function cancelSubscription(subId) {
    const { data } = await API.delete(`/subs/${subId}`);
    return data.data;
}