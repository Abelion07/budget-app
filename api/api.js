import { store } from "../store/store.js";

export async function loadCurrentUser(userId) {
  const r = await fetch(`http://192.168.100.185:3001/api/users/${userId}/transactions`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();

  store.setUser(data);
  return data;
}
