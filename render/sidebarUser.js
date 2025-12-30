import { store } from "../store/store.js";

export function bindSidebarUser(root = document) {
  const avatarEl = root.querySelector(".avatar");
  const nameEl = root.querySelector(".user-name");
  const emailEl = root.querySelector(".user-email");

  if (!avatarEl || !nameEl || !emailEl) return;

  store.subscribe(() => {
    const u = store.user;
    if (!u) return;
    // console.log(u)

    avatarEl.textContent = u.first_name?.[0]?.toUpperCase?.() ?? "?";
    nameEl.textContent = u.first_name ?? "-";
    emailEl.textContent = u.email ?? "-";
  });
}
