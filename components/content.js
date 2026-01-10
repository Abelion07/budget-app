function elFromHTML(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function SummaryCards() {
  return elFromHTML(`
    <div class="grid cards foinfok">
      <!-- SUMMARY CARDS -->
      <!-- // DB: aggregált havi/aktuális időszak statisztikák -->
      <!-- // szükséges: totalIncome, totalExpense, netBalance -->
      <!-- // opcionális: prevIncome, prevExpense vagy százalékos változás -->
      <!-- // pénznem: userSettings.currency -->

      <article class="card">
        <div class="card-head">
          <div class="card-title">Egyenleg</div>
          <div class="pill pill-blue">Összesen</div>
        </div>
        <div class="money osszesen">? Ft</div>
      </article>

      <article class="card">
        <div class="card-head">
          <div class="card-title">Bevétel</div>
          <div class="pill pill-green">+ Ebben a hónapban</div>
        </div>
        <div class="money obevetel">+ ? Ft</div>
      </article>

      <article class="card">
        <div class="card-head">
          <div class="card-title">Kiadás</div>
          <div class="pill pill-red">- Ebben a hónapban</div>
        </div>
        <div class="money okiadas">- ? Ft</div>
      </article>

    </div>
  `);
}

function ChartAndQuickOverview() {
  return elFromHTML(`
    <div class="grid two-cols">
      <!-- CHART + BREAKDOWN -->
      <article class="card">
        <div class="card-head">
          <div class="card-title">Kiadások megoszlása</div>
          <div class="card-actions">
            <!-- // DB: nem kell; UI state: chartRange = monthly/yearly -->
            <button class="btn btn-chip">Havi</button>
            <!--<button class="btn btn-chip">Éves</button>-->
          </div>
        </div>

        <!-- Chart placeholder -->
        <!-- // DB: expenseByCategory aggregáció -->
        <!-- // pl. [{ categoryId, categoryName, totalAmount, percent }] -->
        <!-- // rendezés: totalAmount desc, top N -->
        <div class="chart">
        </div>

        <!-- <div class="muted">* Helyettesítő grafikon (JS-sel majd valódi chart lesz)</div> -->
      </article>

      <article class="card">
        <div class="card-head">
          <div class="card-title">Gyors áttekintés</div>
          <div class="pill pill-gray">tippek</div>
        </div>

        <!-- // DB: kiemelt elemek (topok) -->
        <ul class="list">
          <li>
            <span class="dot dot-green"></span>
            <div>
              <div class="list-title">Legnagyobb bevétel</div>
              <div class="muted legnagyobb-bevetel">?</div>
            </div>
          </li>
          <li>
            <span class="dot dot-red"></span>
            <div>
              <div class="list-title">Legnagyobb kiadás</div>
              <div class="muted legnagyobb-kiadas">?</div>
            </div>
          </li>
        </ul>
      </article>
    </div>
  `);
}

function TransactionsSection() {
  return elFromHTML(`
    <div>
      <!-- TRANSACTIONS -->
      <div class="section-head" id="transactions">
        <h2>Tranzakciók</h2>
        <div class="section-actions">
          <div class="filters">
            <!-- // DB: nem kell; filter -> query param: type -->
            <select class="filter-type">
              <option value="all">Összes típus</option>
              <option value="Bevétel">Bevétel</option>
              <option value="Kiadás">Kiadás</option>
            </select>

            <!-- // DB: categories lista -->
            <select class="filter-category">
              <option value="all">Összes kategória</option>
            </select>
          </div>

          <!-- // DB: nem kell; export action -> backend generál CSV-t a current filter alapján -->
          <!--<button class="btn">Export CSV</button>-->
        </div>
      </div>

      <article class="card table-card">
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Dátum</th>
                <th>Leírás</th>
                <th>Kategória</th>
                <th class="right">Összeg</th>
                <th class="right">Művelet</th>
              </tr>
            </thead>
            <tbody class="tablazatbody"></tbody>
          </table>
        </div>
      </article>
    </div>
  `);
}

function CategoriesSection() {
  return elFromHTML(`
    <div>
      <!-- CATEGORIES -->
      <div class="section-head" id="categories">
        <h2>Kategóriák</h2>
        <!--<div class="section-actions">
          <button class="btn">+ Új kategória</button>
        </div>-->
      </div>

      <div class="grid category-grid">
        
      </div>
    </div>
  `);
}

function SettingsSection() {
  return elFromHTML(`
    <div>
      <!-- SETTINGS -->
      <div class="section-head" id="settings">
        <h2>Beállítások</h2>
      </div>

      <article class="card">
        <!-- // DB: userSettings (felhasználói beállítások) -->
        <!-- // userSettings: { currency, defaultView, monthlyGoal? } -->
        <div class="form-grid">
          <label class="field">
            <span>Pénznem</span>
            <select>
              <option>HUF</option>
              <option>EUR</option>
              <option>USD</option>
            </select>
          </label>

          <label class="field">
            <span>Alapértelmezett nézet</span>
            <select>
              <option>Havi</option>
              <option>Heti</option>
              <option>Éves</option>
            </select>
          </label>

          <label class="field">
            <span>Mentés</span>
            <button class="btn btn-primary" type="button">Beállítások mentése</button>
          </label>
        </div>
      </article>
    </div>
  `);
}

export function Main() {
  const main = document.createElement("main");
  main.className = "main";

  // MAIN
  const content = document.createElement("section");
  content.className = "content";

  content.appendChild(SummaryCards());
  content.appendChild(ChartAndQuickOverview());
  content.appendChild(TransactionsSection());
  content.appendChild(CategoriesSection());
  // content.appendChild(SettingsSection());

  main.appendChild(content);
  return main;
}
