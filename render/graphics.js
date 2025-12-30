import { store } from "../store/store.js";

export function bindGraphics(root = document) {
  store.subscribe(() => {
    const t = store.transactions;

    // 1) csak a kiadások
    const tkiadas = t.filter((x) => x.tipus === "Kiadás");

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

    // console.log(adatok);

    let osszeg = 0;
    adatok.forEach((element) => {
      osszeg += element.count;
    });
    // console.log(osszeg);
    let egyszazalek = 100 / osszeg;
    // console.log(egyszazalek);
    const chart = document.querySelector(".chart");
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
