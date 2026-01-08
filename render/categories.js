import { store } from "../store/store.js";

export function bindCategories(root = document) {
  store.subscribe(() => {
    const category_grid = document.querySelector(".category-grid");
    const select_categories = document.querySelector(".select-categories");
    const filter_categories = document.querySelector(".filter-category");
    const w = store.categories;
    if (!category_grid || !select_categories || !filter_categories) return;
    if (!w || w.length === 0) return;

    const sorted = [...w].sort((a, b) =>
      a.kat_nev.localeCompare(b.kat_nev, "hu")
    );

    category_grid.innerHTML = "";
    select_categories.innerHTML = "";
    filter_categories.innerHTML = `<option value="all">Összes kategória</option>`;

    sorted.forEach((cat) => {
      category_grid.innerHTML += `<article class="card">
          <div class="cat-row">
            <div class="cat-icon">${cat.icons}</div>
            <div class="cat-meta">
              <div class="cat-title">${cat.kat_nev}</div>
            </div>
            <div class="cat-actions">
              <button class="btn btn-small">Szerkeszt</button>
            </div>
          </div>
        </article>`;
    });

    sorted.forEach((cat) => {
      select_categories.innerHTML += `<option value="${cat.id}">${cat.kat_nev}</option>`;
    });

    sorted.forEach((cat) => {
      filter_categories.innerHTML += `<option value="${cat.id}">${cat.kat_nev}</option>`;
    });
  });
}
