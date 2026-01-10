import { Sidebar } from "./sidebar.js";
import { Main } from "./content.js";
import { TransactionModal } from "./modal.js";
import { TransactionDetailModal } from "./transactionDetailModal.js";

export function App() {
  const app = document.createElement("div");
  app.className = "app";

  app.appendChild(Sidebar());
  app.appendChild(Main());
  app.appendChild(TransactionModal());
  app.appendChild(TransactionDetailModal());

  return app;
}
