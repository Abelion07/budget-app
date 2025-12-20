import { store } from "../store/store.js";

export function bindStatistics(root = document) {
    const legnagyobbbevetel = root.querySelector(".legnagyobb-bevetel");
    const legnagyobbkiadas = root.querySelector(".legnagyobb-kiadas");

  if (!legnagyobbbevetel || !legnagyobbkiadas) return;

  store.subscribe(() => {
    const t = store.transactions;
    const mennyikiadasmax = t.filter(tx => tx.tipus === "Kiadás").reduce((max, tx) => tx.osszeg > max.osszeg ? tx : max, {osszeg: 0});
    const mennyibevetelmax = t.filter(tx => tx.tipus === "Bevétel").reduce((max, tx) => tx.osszeg > max.osszeg ? tx : max, {osszeg: 0});
    // console.log(mennyibevetelmax)

    legnagyobbbevetel.textContent = `${mennyibevetelmax.osszeg} Ft - (${mennyibevetelmax.datum ?? "Nincs adat"})`
    legnagyobbkiadas.textContent = `${mennyikiadasmax.osszeg} Ft - (${mennyikiadasmax.datum ?? "Nincs adat"})`
  });
}