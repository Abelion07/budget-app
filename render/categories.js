import { store } from "../store/store.js";

export function bindCategories(root = document) {
  store.subscribe(() => {
    const t = store.transactions;
    const distinct = new Map();

    t.forEach((element) => {
      const { kat_nev, icons } = element.categories;
      distinct.set(kat_nev, icons); // ha már volt, felülírja
    });
    const category_grid = document.querySelector(".category-grid");
    const result = [...distinct.entries()].sort((a, b) => a[0].localeCompare(b[0], 'hu'));;
    result.forEach(element => {
        // console.log(element[1])
        // console.log(element[0])
        category_grid.innerHTML += `<article class="card">
          <div class="cat-row">
            <div class="cat-icon">${element[1]}</div>
            <div class="cat-meta">
              <div class="cat-title">${element[0]}</div>
              <div class="muted">Alap kategória</div>
            </div>
            <div class="cat-actions">
              <button class="btn btn-small">Szerkeszt</button>
            </div>
          </div>
        </article>`;
    })
    const select_categories = document.querySelector(".select-categories");
    result.forEach(element => {
      select_categories.innerHTML+= `<option>${element[0]}</option>`
    })
  });
}
