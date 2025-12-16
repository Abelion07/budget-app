import { Sidebar } from "./sidebar.js";
import { Main } from "./content.js";
import { TransactionModal } from "./modal.js";

export function App() {
  const app = document.createElement("div");
  app.className = "app";

  app.appendChild(Sidebar());
  app.appendChild(Main());
  app.appendChild(TransactionModal());

  return app;
}
