import { store } from "../store/store.js";

export async function loadCurrentUser(userId) {
  const r = await fetch(
    `http://localhost:3001/api/users/${userId}/transactions`
  );
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();

  store.setUser(data);
  return data;
}

export async function loadCategories() {
  const q = await fetch("http://localhost:3001/api/allcategories");
  if (!q.ok) throw new Error(`HTTP ${q.status}`);
  const kat = await q.json();

  store.setCategories(kat);
  return kat;
}
