import { deleteTransaction, loadCurrentUser } from "../api/api.js";
import { store } from "../store/store.js";

export function bindTransactions(root = document) {
  const tablazatbody = document.querySelector(".tablazatbody");
  const hu = new Intl.NumberFormat("hu-HU");
  store.subscribe(() => {
    const t = [...store.transactions].sort((a, b) => b.id - a.id);

    if (!tablazatbody) return;
    tablazatbody.innerHTML = "";

    t.forEach((element) => {
      const penz = element.osszeg;
      const tipus = element.tipus;
      tablazatbody.innerHTML += `<tr>
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
  });
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
