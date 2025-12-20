import { store } from "../store/store.js";

export function bevetelkiadas(root = document) {
  const osszesbevetel = root.querySelector(".obevetel");
  const osszeskiadas = root.querySelector(".okiadas");
  const osszespenz = root.querySelector(".osszesen");
  const hu = new Intl.NumberFormat("hu-HU"); // 1 234 567

  store.subscribe(() => {
    const t = store.transactions;
    // console.log(t.filter(w => w.tipus === "kiadas"));
    let sumkiadas = t
      .filter((w) => w.tipus === "Kiadás")
      .reduce((sum, w) => sum + w.osszeg, 0);
    osszeskiadas.textContent = `-${hu.format(sumkiadas)} Ft` ?? "?";
    let sumbevetel = t
      .filter((w) => w.tipus === "Bevétel")
      .reduce((sum, w) => sum + w.osszeg, 0);
    osszesbevetel.textContent = `+${hu.format(sumbevetel)} Ft` ?? "?";
    // console.log(t);
    const osszpenz = t.reduce((max, curr) => {
      return new Date(curr.datum) > new Date(max.datum) ? curr : max;
    });

    osszespenz.textContent = `${hu.format(osszpenz.akt_osszpenz)} Ft`
  });
}
