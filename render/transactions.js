import { store } from "../store/store.js";

export function bindTransactions(root = document) {
  const tablazatbody = document.querySelector(".tablazatbody");
  const hu = new Intl.NumberFormat("hu-HU");
  store.subscribe(() => {
    const t = [...store.transactions].sort((a, b) => b.id - a.id);

    // console.log(t);

    t.forEach((element) => {
      // console.log(element);
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
                  <button class="btn btn-small">Szerkeszt</button>
                  <button class="btn btn-small btn-danger">Töröl</button>
                </td>
              </tr>`;
    });
  });
}
