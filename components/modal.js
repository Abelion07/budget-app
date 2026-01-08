import { createTransaction, loadCurrentUser } from "../api/api.js";
import { store } from "../store/store.js";

function elFromHTML(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".uj-tranzakcio")) {
    document.querySelector(".modal")?.classList.add("is-open");
    const dateInput = document.querySelector(".modal .input-date");
    if (dateInput && !dateInput.value) dateInput.value = todayIso();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".btn-close")) {
    document.querySelector(".modal")?.classList.remove("is-open");
  }
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

  if (!userId) {
    console.error("No user loaded for transaction creation.");
    return;
  }

  if (!type || !Number.isFinite(amount) || amount <= 0 || !categoryId || !date) {
    console.error("Invalid transaction form values.");
    return;
  }

  try {
    await createTransaction(userId, {
      type,
      amount,
      date,
      categoryId,
    });
    await loadCurrentUser(userId);
    form.reset();
    document.querySelector(".modal")?.classList.remove("is-open");
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
