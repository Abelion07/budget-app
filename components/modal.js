import {
  createTransaction,
  loadCurrentUser,
  updateTransaction,
} from "../api/api.js";
import { store } from "../store/store.js";

function elFromHTML(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function openModal() {
  document.querySelector(".modal")?.classList.add("is-open");
  const dateInput = document.querySelector(".modal .input-date");
  if (dateInput && !dateInput.value) dateInput.value = todayIso();
}

function closeModal() {
  document.querySelector(".modal")?.classList.remove("is-open");
}

function setEditState(transactionId, isEditing) {
  const form = document.querySelector(".modal .form");
  if (!form) return;
  form.dataset.editingId = isEditing ? String(transactionId) : "";
  const title = document.querySelector(".modal #modalTitle");
  if (title) title.textContent = isEditing ? "Tranzakció szerkesztése" : "Új tranzakció";
}

function fillFormFromTransaction(tx) {
  const form = document.querySelector(".modal .form");
  if (!form || !tx) return;
  const typeSelect = form.querySelector(".select-type");
  const amountInput = form.querySelector(".input-amount");
  const dateInput = form.querySelector(".input-date");
  const categorySelect = form.querySelector(".select-categories");

  if (typeSelect) typeSelect.value = tx.tipus;
  if (amountInput) amountInput.value = tx.osszeg;
  if (dateInput) dateInput.value = tx.datum;
  if (categorySelect) categorySelect.value = String(tx.category_id ?? tx.categories?.id ?? "");
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".uj-tranzakcio")) {
    setEditState(null, false);
    openModal();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".btn-close")) {
    closeModal();
  }
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-edit-transaction");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (!id) return;
  const tx = store.transactions.find((item) => item.id === id);
  if (!tx) return;

  setEditState(id, true);
  fillFormFromTransaction(tx);
  openModal();
});

document.addEventListener("submit", async (e) => {
  const form = e.target.closest(".modal .form");
  if (!form) return;

  e.preventDefault();

  const type = form.querySelector(".select-type")?.value;
  const amountRaw = form.querySelector(".input-amount")?.value;
  const date = form.querySelector(".input-date")?.value || todayIso();
  const categoryId = Number(
    form.querySelector(".select-categories")?.value
  );

  const amount = Number(amountRaw);
  const userId = store.user?.id;
  const editingId = Number(form.dataset.editingId || 0);

  if (!userId) {
    console.error("No user loaded for transaction creation.");
    return;
  }

  if (!type || !Number.isFinite(amount) || amount <= 0 || !categoryId || !date) {
    console.error("Invalid transaction form values.");
    return;
  }

  try {
    const payload = { type, amount, date, categoryId };
    if (editingId) {
      await updateTransaction(userId, editingId, payload);
    } else {
      await createTransaction(userId, payload);
    }
    await loadCurrentUser(userId);
    form.reset();
    setEditState(null, false);
    closeModal();
  } catch (err) {
    console.error(err);
  }
});

export function TransactionModal() {
  return elFromHTML(`
    <div class="modal" aria-hidden="true">
      <!-- MODAL (demo: add "is-open" a classhoz, ha meg akarod jeleníteni) -->
      <!-- // DB: categories lista a dropdownhoz -->
      <!-- // DB: createTransaction endpoint (mentés) -->
      <div class="modal-backdrop"></div>
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-head">
          <h3 id="modalTitle">Új tranzakció</h3>
          <!-- // DB: nem kell; modal close -->
          <button class="btn btn-ghost btn-small btn-close" type="button">✕</button>
        </div>

        <form class="form">
          <div class="form-grid">
            <label class="field">
              <span>Típus</span>
              <!-- // DB: nem kell; enum: income/expense -->
              <select class="select-type">
                <option value="Kiadás">Kiadás</option>
                <option value="Bevétel">Bevétel</option>
              </select>
            </label>

            <label class="field">
              <span>Összeg</span>
              <!-- // DB: amount (validáció: > 0), currency: userSettings.currency -->
              <input class="input-amount" type="number" placeholder="pl. 12430" min="0"/>
            </label>

            <label class="field">
              <span>Dátum</span>
              <!-- // DB: date (ISO), default: today -->
              <input class="input-date" type="date" />
            </label>

            <label class="field">
              <span>Kategória</span>
              <!-- // DB: categories: [{id,name}] -->
              <!-- // DB: transaction.categoryId -->
              <select class="select-categories">
              </select>
            </label>


           
          </div>

          <div class="form-actions">
            <!-- // DB: nem kell; modal close -->
            <!-- // DB: POST /transactions { type, amount, date, categoryId, note } -->
            <button class="btn btn-primary" type="submit">Mentés</button>
          </div>
        </form>
      </div>
    </div>
  `);
}

//  <label class="field full">
//               <span>Megjegyzés</span>
//               <!-- // DB: description/note (string) -->
//               <input type="text" placeholder="pl. Spar / benzin / mozi..." />
//             </label>
