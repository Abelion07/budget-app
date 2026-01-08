import { store } from "../store/store.js";

export function bindGraphics(root = document) {
  store.subscribe(() => {
    const t = store.transactions;

    // aktuális hónap
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // 0) csak az aktuális hónap tranzakciói
    const thisMonthTransactions = t.filter((item) => {
      const d = new Date(item.datum);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    // 1) csak a kiadások
    const tkiadas = thisMonthTransactions.filter((x) => x.tipus === "Kiadás");

    // 2) groupby + count kategórianév alapján
    const grouped = Object.values(
      tkiadas.reduce((acc, item) => {
        const kat = item.categories?.kat_nev ?? "Nincs kategória";

        if (!acc[kat]) {
          acc[kat] = { kat_nev: kat, count: 0 };
        }

        acc[kat].count++;
        return acc;
      }, {})
    );

    // 3) rendezés count szerint csökkenő
    const adatok = grouped.sort((a, b) => b.count - a.count);

    // százalék számítás
    const osszeg = adatok.reduce((sum, e) => sum + e.count, 0);
    const egyszazalek = osszeg ? 100 / osszeg : 0;

    const chart = document.querySelector(".chart");
    chart.innerHTML = ""; // fontos: ne duplázzon

    adatok.forEach((element) => {
      chart.innerHTML += `
        <div class="chart-bar" style="--h: ${(
          element.count * egyszazalek
        ).toFixed(0)}%;">
          <span>${element.kat_nev}</span>
          <strong>${(element.count * egyszazalek).toFixed(2)}%</strong>
        </div>
      `;
    });
  });
}
