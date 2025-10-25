// services/subscriptions.js
import API from './Api'
import useAuthStore from '../store/authStore'

// ------- Plans (axios) -------
export async function fetchActivePlans() {
  // GET /subscriptions/plans?active=true
  const { data } = await API.get('/subscriptions/plans', { params: { active: true } })
  return data
}

// ------- Subscriptions (axios) -------
export async function createSubscription({ planId, boxType, wineType, payMethod = 'multisafepay' }) {
  const { user } = useAuthStore.getState()
  if (!user?._id && !user?.id) throw new Error('Necesitas iniciar sesión')

  const users = user._id || user.id

  const payload = {
    users,                    // ObjectId del usuario
    subscriptionsPlan: planId,
    boxType,                  // "basic" | "premium"
    wineType,                 // "mixto" | "tinto" | "rosa" | "espumoso"
    payMethod                 // "multisafepay"
    // boxSize lo define el plan en backend (opcional enviarlo)
  }

  const { data } = await API.post('/subscriptions', payload)
  return data
}

export async function getMyActiveSubscription() {
  const { data } = await API.get('/subscriptions/me/active')
  return data
}

export async function updateSubscription(subId, patch) {
  const { data } = await API.patch(`/subscriptions/${subId}`, patch)
  return data
}

export async function cancelSubscription(subId) {
  const { data } = await API.post(`/subscriptions/${subId}/cancel`)
  return data
}

// Fallback local por si la API de planes aún no está lista
export function localPlansFallback() {
  return [
    { _id: 'plan_basic_6',   name: 'mensual', boxType: 'basic',   boxSize: 6, price: 59.9, active: true },
    { _id: 'plan_premium_6', name: 'mensual', boxType: 'premium', boxSize: 6, price: 79.9, active: true }
  ]
}
