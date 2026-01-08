import { deleteTransaction, loadCurrentUser } from "../api/api.js";
import { store } from "../store/store.js";

let currentTypeFilter = "all";
let currentCategoryFilter = "all";
let tablazatbodyRef = null;

function applyTypeFilter(items) {
  if (currentTypeFilter === "all") return items;
  return items.filter((item) => item.tipus === currentTypeFilter);
}

function applyCategoryFilter(items) {
  if (currentCategoryFilter === "all") return items;
  const targetId = Number(currentCategoryFilter);
  return items.filter((item) => item.category_id === targetId);
}

const hu = new Intl.NumberFormat("hu-HU");

function renderTransactions() {
  if (!tablazatbodyRef) return;
  const t = applyCategoryFilter(
    applyTypeFilter(
      [...store.transactions].sort((a, b) => b.id - a.id)
    )
  );

  tablazatbodyRef.innerHTML = "";

  t.forEach((element) => {
    const penz = element.osszeg;
    const tipus = element.tipus;
    tablazatbodyRef.innerHTML += `<tr>
                <td>${element.datum}</td>
                <td>${element.categories.icons} ${
        element.categories.kat_nev
      }</td>
                <td><span class="tag ${
                  tipus == "Bevétel" ? "tag-green" : "tag-red"
                }">${tipus}</span></td>
                <td class="right amount ${
                  tipus == "Bevétel" ? "pos" : "neg"
                }">${tipus == "Bevétel" ? "+" : "-"} ${hu.format(penz)} Ft</td>
                <td class="right">
                  <button class="btn btn-small btn-edit-transaction" data-id="${element.id}">Szerkeszt</button>
                  <button class="btn btn-small btn-danger btn-delete-transaction" data-id="${element.id}">Töröl</button>
                </td>
              </tr>`;
  });
}

export function bindTransactions(root = document) {
  tablazatbodyRef = root.querySelector(".tablazatbody");
  store.subscribe(renderTransactions);
  renderTransactions();
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-delete-transaction");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const userId = store.user?.id;
  if (!id || !userId) return;

  try {
    await deleteTransaction(userId, id);
    await loadCurrentUser(userId);
  } catch (err) {
    console.error(err);
  }
});

document.addEventListener("change", (e) => {
  const select = e.target.closest(".filter-type");
  if (!select) return;
  currentTypeFilter = select.value || "all";
  renderTransactions();
});

document.addEventListener("change", (e) => {
  const select = e.target.closest(".filter-category");
  if (!select) return;
  currentCategoryFilter = select.value || "all";
  renderTransactions();
});
