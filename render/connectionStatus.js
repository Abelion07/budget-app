import { store } from "../store/store.js";
import { loadCategories, loadCurrentUser, getSessionUser } from "../api/api.js";

const statusCopy = {
  unknown: "Kapcsolat ellenőrzése...",
  waking: "A szerver ébred. Ez akár 30-60 mp is lehet.",
  down: "A szerver nem elérhető. Próbáld újra.",
  ok: "Kapcsolat rendben.",
};

function updateStatus(banner) {
  const textEl = banner.querySelector(".backend-status-text");
  const status = store.backendStatus || "unknown";

  banner.dataset.status = status;

  if (textEl) {
    textEl.textContent = statusCopy[status] || statusCopy.unknown;
  }
}

async function handleRetry() {
  const userId = store.user?.id;
  if (userId) {
    await loadCurrentUser(userId);
    await loadCategories();
    return;
  }

  const sessionUser = await getSessionUser();
  if (sessionUser?.id) {
    await loadCurrentUser(sessionUser.id);
    await loadCategories();
  }
}

export function bindConnectionStatus(root = document) {
  const banner = root.querySelector(".backend-status");
  if (!banner) return;

  store.subscribe(() => updateStatus(banner));
  updateStatus(banner);

  banner.addEventListener("click", (e) => {
    if (!e.target.closest(".backend-status-retry")) return;
    handleRetry().catch((err) => console.error(err));
  });
}
