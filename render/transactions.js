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

function openDetailModal(tx) {
  const modal = document.querySelector(".tx-detail-modal");
  if (!modal || !tx) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  const categoryEl = modal.querySelector(".tx-detail-category");
  const dateEl = modal.querySelector(".tx-detail-date");
  const typeEl = modal.querySelector(".tx-detail-type");
  const amountEl = modal.querySelector(".tx-detail-amount");
  const editBtn = modal.querySelector(".btn-edit-transaction");
  const deleteBtn = modal.querySelector(".btn-delete-transaction");

  const icon = tx.categories?.icons ?? "";
  const name = tx.categories?.kat_nev ?? "-";
  if (categoryEl) categoryEl.textContent = `${icon} ${name}`.trim();
  if (dateEl) dateEl.textContent = tx.datum ?? "-";
  if (typeEl) {
    const tagClass = tx.tipus === "Bevétel" ? "tag-green" : "tag-red";
    typeEl.innerHTML = `<span class="tag ${tagClass}">${tx.tipus ?? "-"}</span>`;
  }
  if (amountEl) {
    const sign = tx.tipus === "Bevétel" ? "+" : "-";
    amountEl.classList.add("amount");
    amountEl.classList.toggle("pos", tx.tipus === "Bevétel");
    amountEl.classList.toggle("neg", tx.tipus !== "Bevétel");
    amountEl.textContent = `${sign} ${hu.format(tx.osszeg)} Ft`;
  }
  if (editBtn) editBtn.dataset.id = tx.id;
  if (deleteBtn) deleteBtn.dataset.id = tx.id;
}

function closeDetailModal() {
  const modal = document.querySelector(".tx-detail-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

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
    tablazatbodyRef.innerHTML += `<tr class="tx-row" data-id="${element.id}">
                <td class="tx-date-cell">${element.datum}</td>

                <td>
                  <div class="tx-name">
                    <span class="tx-icon">${element.categories.icons}</span>
                    <span class="tx-title">${element.categories.kat_nev}</span>
                  </div>
                  <div class="tx-date">${element.datum}</div>
                </td>

                <td><span class="tag ${
                  tipus == "Bevétel" ? "tag-green" : "tag-red"
                }">${tipus}</span></td>

                

                <td class="center amount ${
                  tipus == "Bevétel" ? "pos" : "neg"
                }">${tipus == "Bevétel" ? "+" : "-"} ${hu.format(penz)} Ft</td>



                <td class="center">
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

document.addEventListener("click", (e) => {
  const row = e.target.closest(".tx-row");
  if (!row) return;
  if (e.target.closest("button, a, input, select, textarea")) return;

  const id = Number(row.dataset.id);
  if (!id) return;
  const tx = store.transactions.find((item) => item.id === id);
  if (!tx) return;
  openDetailModal(tx);
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".btn-tx-detail-close")) {
    closeDetailModal();
    return;
  }
  if (e.target.closest(".tx-detail-modal .modal-backdrop")) {
    closeDetailModal();
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".tx-detail-modal .btn-edit-transaction") &&
      !e.target.closest(".tx-detail-modal .btn-delete-transaction")) {
    return;
  }
  closeDetailModal();
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
