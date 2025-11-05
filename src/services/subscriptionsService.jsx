// services/subscriptions.js
import API from "./Api";
import useAuthStore from "../store/authStore";

// ------- Plans -------
export async function fetchActivePlans() {
  const { data } = await API.get("/subscriptions/plans"); // activos ya filtrados para customer
  return data;
}
//GET/subscriptions activos e inactivos
export async function getAllPlans() {
  const { data } = await API.get('/subscriptionsPlan');
  return data;
}

// ------- Subscriptions -------
export async function createSubscription({ planId, wineType }) {
  // el back espera subscriptionPlanId y wineType
  const payload = { subscriptionPlanId: planId, wineType };
  const { data } = await API.post("/subscriptions", payload);
  return data;
}

export async function getMySubscriptions() {
  const { data } = await API.get("/subscriptions");
  return data; // array
}

export async function getMyActiveSubscription() {
  const subs = await getMySubscriptions();
  if (!Array.isArray(subs) || subs.length === 0) return null;
  return subs.find(s => s.status === "active") ||
         subs.find(s => s.status === "pending") ||
         subs[0];
}

export async function updateSubscription(subId, patch) {
  const { data } = await API.patch(`/subscriptions/${subId}`, patch);
  return data;
}

export async function cancelSubscription(subId) {
  // si tu router la montó como POST, cambia a API.post
  const { data } = await API.patch(`/subscriptions/${subId}/cancel`);
  return data;
}
