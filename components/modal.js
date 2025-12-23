function elFromHTML(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".uj-tranzakcio")) {
    document.querySelector(".modal")?.classList.add("is-open");
  }
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".btn-close")) {
    document.querySelector(".modal")?.classList.remove("is-open");
  }
});

export function TransactionModal() {
  return elFromHTML(`
    <div class="modal is-open" aria-hidden="true">
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
              <select>
                <option>Kiadás</option>
                <option>Bevétel</option>
              </select>
            </label>

            <label class="field">
              <span>Összeg</span>
              <!-- // DB: amount (validáció: > 0), currency: userSettings.currency -->
              <input type="number" placeholder="pl. 12430" min="0"/>
            </label>

            <label class="field">
              <span>Dátum</span>
              <!-- // DB: date (ISO), default: today -->
              <input type="date" />
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
