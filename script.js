import { App } from "./components/app.js";
import { Login } from "./components/login.js";
import {
  loadCurrentUser,
  loadCategories,
  loginUser,
  logoutUser,
  getSessionUser,
} from "./api/api.js";
import { bindSidebarUser } from "./render/sidebarUser.js"
import { bevetelkiadas } from "./render/bevetelkiadas.js";
import { bindStatistics } from "./render/statistics.js";
import { bindTransactions } from "./render/transactions.js";
import { bindCategories } from "./render/categories.js";
import { bindGraphics } from "./render/graphics.js";
import { bindConnectionStatus } from "./render/connectionStatus.js";
import { store } from "./store/store.js";

const root = document.querySelector("#root");
const appRoot = document.createElement("div");
const authRoot = document.createElement("div");

appRoot.id = "app-root";
authRoot.id = "auth-root";
appRoot.appendChild(App());
authRoot.appendChild(Login());
root.append(authRoot, appRoot);

bindSidebarUser(document);
bindStatistics(document);
bevetelkiadas(document);
bindTransactions(document);
bindCategories(document);
bindGraphics(document);
bindConnectionStatus(document);

function setLoginError(message) {
  const errorEl = document.querySelector(".auth-error");
  if (!errorEl) return;
  errorEl.textContent = message || "";
}

function showLogin() {
  appRoot.hidden = true;
  authRoot.hidden = false;
  setLoginError("");
  document.querySelector(".auth-form")?.reset();
}

function showApp() {
  authRoot.hidden = true;
  appRoot.hidden = false;
}

async function initApp(userId) {
  showApp();
  try {
    await loadCurrentUser(userId);
    await loadCategories();
  } catch (err) {
    console.error(err);
    showLogin();
  }
}

document.addEventListener("submit", async (e) => {
  const form = e.target.closest(".auth-form");
  if (!form) return;

  e.preventDefault();
  setLoginError("");

  const email = form.querySelector(".input-email")?.value.trim();
  const password = form.querySelector(".input-password")?.value;

  if (!email || !password) {
    setLoginError("Add meg az email címed és a jelszavad.");
    return;
  }

  try {
    const user = await loginUser(email, password);
    const userId = user?.id;
    if (!userId) {
      setLoginError("Sikertelen bejelentkezés.");
      return;
    }
    await initApp(userId);
  } catch (err) {
    console.error(err);
    setLoginError(err?.message || "Sikertelen bejelentkezés.");
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".btn-logout")) return;
  logoutUser()
    .catch(console.error)
    .finally(() => {
      store.setUser(null);
      showLogin();
    });
});

document.addEventListener("click", (e) => {
  const navLink = e.target.closest(".nav-item");
  if (!navLink || navLink.classList.contains("uj-tranzakcio")) return;
  const target = navLink.dataset.target || navLink.getAttribute("href");
  if (!target) return;
  e.preventDefault();
  if (target === "top" || target === "#dashboard") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const targetEl = document.querySelector(target);
  if (!targetEl) return;
  targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
});

function updateCompactLayout() {
  const root = document.documentElement;
  const isCompact = window.innerWidth <= 1180;
  root.classList.toggle("compact-layout", isCompact);
}

updateCompactLayout();
window.addEventListener("resize", updateCompactLayout);
window.addEventListener("orientationchange", updateCompactLayout);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("Service worker registration failed:", err);
    });
  });
}

getSessionUser()
  .then((user) => {
    if (user?.id) {
      initApp(user.id);
    } else {
      showLogin();
    }
  })
  .catch((err) => {
    console.error(err);
    showLogin();
  });
