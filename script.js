import { App } from "./components/app.js";
import { loadCurrentUser, loadCategories } from "./api/api.js"
import { bindSidebarUser } from "./render/sidebarUser.js"
import { bevetelkiadas } from "./render/bevetelkiadas.js";
import { bindStatistics } from "./render/statistics.js";
import { bindTransactions } from "./render/transactions.js";
import { bindCategories } from "./render/categories.js";
import { bindGraphics } from "./render/graphics.js";

const root = document.querySelector("#root");
root.appendChild(App());

bindSidebarUser(document);
bindStatistics(document);
bevetelkiadas(document);
bindTransactions(document);
bindCategories(document);
bindGraphics(document);


const userId = 2;
loadCurrentUser(userId).catch(console.error).then(loadCategories());