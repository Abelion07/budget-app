import { store } from "../store/store.js";

export function bevetelkiadas(root = document) {
  const osszesbevetel = root.querySelector(".obevetel");
  const osszeskiadas = root.querySelector(".okiadas");
  const osszespenz = root.querySelector(".osszesen");
  const hu = new Intl.NumberFormat("hu-HU"); // 1 234 567

  store.subscribe(() => {
    const t = [...store.transactions].sort((a, b) => b.id - a.id);

    // aktuális hónap
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // csak az aktuális hónap tranzakciói
    const thisMonth = t.filter((item) => {
      const d = new Date(item.datum);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    // összkiadás (aktuális hónap)
    const sumkiadas = thisMonth
      .filter((w) => w.tipus === "Kiadás")
      .reduce((sum, w) => sum + w.osszeg, 0);

    osszeskiadas.textContent = `-${hu.format(sumkiadas)} Ft`;

    // összbevétel (aktuális hónap)
    const sumbevetel = thisMonth
      .filter((w) => w.tipus === "Bevétel")
      .reduce((sum, w) => sum + w.osszeg, 0);

    osszesbevetel.textContent = `+${hu.format(sumbevetel)} Ft`;

    // aktuális összvagyon (legutóbbi tranzakció)
    if (t.length > 0) {
      const osszpenz = t.reduce((latest, curr) =>
        new Date(curr.datum) > new Date(latest.datum) ? curr : latest
      );

      osszespenz.textContent = `${hu.format(osszpenz.akt_osszpenz)} Ft`;
    } else {
      osszespenz.textContent = "0 Ft";
    }
  });
}
