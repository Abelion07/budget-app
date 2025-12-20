import { store } from "../store/store.js";

export function bindSidebarUser(root = document) {
  const avatarEl = root.querySelector(".avatar");
  const nameEl = root.querySelector(".user-name");
  const emailEl = root.querySelector(".user-email");

  if (!avatarEl || !nameEl || !emailEl) return;

  store.subscribe(() => {
    const u = store.user;
    if (!u) return;

    avatarEl.textContent = u.nev?.[0]?.toUpperCase?.() ?? "?";
    nameEl.textContent = u.nev ?? "-";
    emailEl.textContent = u.email ?? "-";
  });
}
