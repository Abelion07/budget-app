import { App } from "./components/app.js";
const root = document.querySelector("#root");
root.appendChild(App());

function lekeres() {
  return fetch("http://localhost:3001/api/users/3/transactions").then((r) =>
    r.json()
  );
}

lekeres().then((data) => console.log("adat:", data));
